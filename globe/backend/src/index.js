'use strict';

/**
 * VDIE — Vessel Data Ingestion Engine
 * Entry Point
 *
 * Bootstraps:
 *  1. Environment config (dotenv)
 *  2. Firebase Admin SDK
 *  3. Fastify server with @fastify/websocket
 *  4. Transport plugins (WebSocket, REST snapshot)
 *  5. API routes
 *  6. AISStream WebSocket connector
 *  7. OpenSky polling connector
 *  8. Local queue drain loop
 */

require('dotenv').config();

const Fastify = require('fastify');
const logger = require('./logger');

const { initFirebase, writeVesselState, appendVesselTrail, writeVesselProfile, writeVesselAlert } = require('./writers/firebaseWriter');
const { startDrainLoop, stopDrainLoop } = require('./writers/localQueue');
const { normalizeAisMessage } = require('./normalizers/aisNormalizer');
const { normalizeOpenSkyResponse } = require('./normalizers/adsbNormalizer');
const { detectAnomalies } = require('./calculators/anomaly');
const { calculateEta } = require('./calculators/eta');
const { createAisStreamConnector } = require('./connectors/aisstream');
const { createOpenSkyConnector } = require('./connectors/opensky');
const wsServerPlugin = require('./transport/wsServer');
const { restSnapshotPlugin } = require('./transport/restSnapshot');
const { apiPlugin } = require('./routes/api');

// ── Shared State ─────────────────────────────────────────────────────────────
// Central in-memory store: vesselId → VesselState
const vesselStore = new Map();

// Operator-tracked vessel IDs (populated by external tooling / future route monitor)
const operatorTrackedIds = new Set();

// LOD state
let currentLodCount = parseInt(process.env.LOD_DEFAULT, 10) || 200;

const getLodState = () => ({ count: currentLodCount });
const setLodCount = (n) => { currentLodCount = n; };

// Connector status for /health
const connectorStatus = {
  aisstream: 'STARTING',
  opensky: 'STARTING',
};

// Server start time for uptime reporting
const startTime = new Date();

// ── AIS Message Handler ───────────────────────────────────────────────────────
async function handleAisMessage(raw) {
  const normalized = normalizeAisMessage(raw);
  if (!normalized) {
    logger.debug({ event: 'AIS_MESSAGE_SKIPPED', type: raw.MessageType, mmsi: raw.MetaData?.MMSI });
    return;
  }

  // Static data update (ShipStaticData) — merge into existing state
  if (normalized._isStaticUpdate) {
    const existing = vesselStore.get(normalized.vesselId) || {};
    const merged = { ...existing, ...normalized };
    delete merged._isStaticUpdate;
    vesselStore.set(normalized.vesselId, merged);

    // Write static profile to Firestore
    writeVesselProfile(normalized).catch(() => {});
    return;
  }

  // Live position update — merge motion/position into existing profile
  const existing = vesselStore.get(normalized.vesselId) || {};

  // Preserve static fields from previous ShipStaticData if present
  const merged = {
    ...existing,
    ...normalized,
    name: existing.name || normalized.name,
    vesselType: existing.vesselType !== 'UNKNOWN' ? existing.vesselType : normalized.vesselType,
    imoNumber: existing.imoNumber || normalized.imoNumber,
    callsign: existing.callsign || normalized.callsign,
    dimensions: existing.dimensions || normalized.dimensions,
    // Preserve trail ring buffer — append new point
    trail: mergeTrail(existing.trail, normalized.trail, 200),
    // Preserve active threats and route status set by external monitor
    activeThreatIds: existing.activeThreatIds || [],
    routeStatus: existing.routeStatus || 'CLEAR',
  };

  vesselStore.set(merged.vesselId, merged);

  // ETA Calculation — run when vessel has a known destination with coordinates
  if (
    merged.destination?.lat != null &&
    merged.destination?.lon != null &&
    merged.position?.lat != null &&
    merged.motion?.sogKnots != null
  ) {
    const etaResult = calculateEta(
      merged.position.lat,
      merged.position.lon,
      merged.destination.lat,
      merged.destination.lon,
      merged.motion.sogKnots
    );
    merged.destination.calculatedEtaUtc = etaResult.calculatedEtaUtc;
    merged.destination.calculatedDistanceNm = etaResult.distanceNm;
    merged.destination.etaConfidence = etaResult.etaConfidence;

    if (etaResult.calculatedEtaUtc) {
      logger.info({
        event: 'ETA_CALCULATED',
        vesselId: merged.vesselId,
        destinationPort: merged.destination.portCode || merged.destination.rawText,
        distanceNm: etaResult.distanceNm,
        sogKnots: merged.motion.sogKnots,
        etaHours: etaResult.etaHours,
        calculatedEtaUtc: etaResult.calculatedEtaUtc,
        selfReportedEtaUtc: merged.destination.selfReportedEta || null,
        deltaHours: merged.destination.selfReportedEta
          ? parseFloat(((new Date(etaResult.calculatedEtaUtc) - new Date(merged.destination.selfReportedEta)) / 3_600_000).toFixed(2))
          : null,
      });
    }
  }

  // Anomaly detection
  const anomalies = detectAnomalies(merged, existing);
  for (const anomaly of anomalies) {
    logger.warn({
      event: 'VESSEL_ANOMALY',
      ...anomaly,
      vesselId: merged.vesselId,
      timestamp: new Date().toISOString(),
    });
    writeVesselAlert(merged.vesselId, { ...anomaly, timestamp: new Date().toISOString() }).catch(() => {});
  }

  // Write to Firebase
  writeVesselState(merged).catch(() => {});
  appendVesselTrail(merged).catch(() => {});
}

// ── ADS-B Message Handler ─────────────────────────────────────────────────────
async function handleOpenSkyResponse(raw) {
  const vessels = normalizeOpenSkyResponse(raw);
  const total = raw.states?.length || 0;
  logger.debug({ event: 'OPENSKY_NORMALIZATION_RESULT', normalized: vessels.length, total });

  for (const vessel of vessels) {
    const existing = vesselStore.get(vessel.vesselId) || {};

    const merged = {
      ...existing,
      ...vessel,
      trail: mergeTrail(existing.trail, vessel.trail, 50),
      activeThreatIds: existing.activeThreatIds || [],
      routeStatus: existing.routeStatus || 'CLEAR',
    };

    vesselStore.set(merged.vesselId, merged);

    // ADS-B anomaly detection (emergency squawk)
    const anomalies = detectAnomalies(merged, existing);
    for (const anomaly of anomalies) {
      logger.warn({
        event: 'VESSEL_ANOMALY',
        ...anomaly,
        vesselId: merged.vesselId,
        timestamp: new Date().toISOString(),
      });
      writeVesselAlert(merged.vesselId, { ...anomaly, timestamp: new Date().toISOString() }).catch(() => {});
    }

    writeVesselState(merged).catch(() => {});
    appendVesselTrail(merged).catch(() => {});
  }

  connectorStatus.opensky = 'CONNECTED';
}

/**
 * Merge trail arrays, keeping the ring buffer at maxSize.
 */
function mergeTrail(existing, incoming, maxSize) {
  const base = Array.isArray(existing) ? existing : [];
  const additions = Array.isArray(incoming) ? incoming : [];
  const merged = [...base, ...additions];
  if (merged.length > maxSize) return merged.slice(-maxSize);
  return merged;
}

// ── Fastify Server Bootstrap ──────────────────────────────────────────────────
async function startServer() {
  const fastify = Fastify({
    logger: false, // we use pino directly
    disableRequestLogging: true,
  });

  // Register @fastify/websocket
  await fastify.register(require('@fastify/websocket'));

  // Register WebSocket transport B
  await fastify.register(wsServerPlugin, { vesselStore });

  // Register REST snapshot transport C
  await fastify.register(restSnapshotPlugin, { vesselStore, operatorTrackedIds });

  // Register API routes
  await fastify.register(apiPlugin, {
    vesselStore,
    operatorTrackedIds,
    getLodState,
    setLodCount,
    startTime,
    connectorStatus,
  });

  const port = parseInt(process.env.PORT, 10) || 3001;
  const host = '0.0.0.0';

  await fastify.listen({ port, host });
  logger.info({ event: 'SERVER_STARTED', port, host });

  return fastify;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  logger.info({ event: 'VDIE_STARTING', version: '1.0.0', nodeEnv: process.env.NODE_ENV });

  // 1. Initialize Firebase
  initFirebase();

  // 2. Start local queue drain loop
  startDrainLoop();

  // 3. Start Fastify server
  const fastify = await startServer();

  // 4. Start AISStream connector
  const aisConnector = createAisStreamConnector((raw) => {
    handleAisMessage(raw).catch((err) => {
      logger.error({ event: 'AIS_HANDLER_UNCAUGHT', error: err.message });
    });
    connectorStatus.aisstream = 'CONNECTED';
  });

  // 5. Start OpenSky connector
  const oskyConnector = createOpenSkyConnector((raw) => {
    handleOpenSkyResponse(raw).catch((err) => {
      logger.error({ event: 'OPENSKY_HANDLER_UNCAUGHT', error: err.message });
    });
  });

  // ── Graceful Shutdown ─────────────────────────────────────────────────────
  async function shutdown(signal) {
    logger.info({ event: 'VDIE_SHUTDOWN', signal });

    aisConnector.stop();
    oskyConnector.stop();
    stopDrainLoop();

    await fastify.close();

    logger.info({ event: 'VDIE_STOPPED' });
    process.exit(0);
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('uncaughtException', (err) => {
    logger.fatal({ event: 'UNCAUGHT_EXCEPTION', error: err.message, stack: err.stack });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error({ event: 'UNHANDLED_REJECTION', reason: String(reason) });
  });

  logger.info({ event: 'VDIE_READY', vessels: 0, lod: currentLodCount });
}

main().catch((err) => {
  console.error('VDIE fatal startup error:', err);
  process.exit(1);
});
