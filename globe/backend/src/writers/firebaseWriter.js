'use strict';

/**
 * Firebase Writer
 *
 * Writes VesselState to:
 *   - Firebase Realtime DB: /vessels/{vesselId}/state (live position, every message)
 *   - Firebase Realtime DB: /vessels/{vesselId}/trail (ring buffer, last 200/50 points)
 *   - Firestore: /vesselProfiles/{vesselId} (static data from ShipStaticData)
 *   - Firestore: /vesselAlerts/{vesselId}/alerts[] (threat/anomaly history)
 *
 * Retry strategy: 3× retries with 500ms delay on write failure,
 * then falls back to localQueue.
 */

const admin = require('firebase-admin');
const logger = require('../logger');
const { enqueueFailedWrite } = require('./localQueue');

const TRAIL_MAX_AIS = 200;  // ring buffer size for AIS vessels
const TRAIL_MAX_ADSB = 50;  // ring buffer size for ADS-B aircraft

const FIREBASE_WRITE_RETRY_COUNT = 3;
const FIREBASE_WRITE_RETRY_DELAY_MS = 500;

// 1-in-10 sampling for FIREBASE_WRITE log in production
let writeLogCounter = 0;
function shouldLogFirebaseWrite() {
  writeLogCounter = (writeLogCounter + 1) % 10;
  return process.env.NODE_ENV !== 'production' || writeLogCounter === 0;
}

let db = null;       // Realtime DB
let firestore = null; // Firestore

/**
 * Initialize Firebase admin if not already done.
 * Called once at startup by index.js.
 */
function initFirebase() {
  if (admin.apps.length > 0) return;

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const realtimeDbUrl = process.env.FIREBASE_REALTIME_DB_URL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!serviceAccountPath || !realtimeDbUrl || !projectId) {
    logger.warn({
      event: 'FIREBASE_CONFIG_MISSING',
      reason: 'One or more Firebase env vars not set — Firebase writes disabled',
    });
    return;
  }

  try {
    const serviceAccount = require(require('path').resolve(serviceAccountPath));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: realtimeDbUrl,
      projectId,
    });

    db = admin.database();
    firestore = admin.firestore();

    logger.info({ event: 'FIREBASE_INITIALIZED', projectId, realtimeDbUrl });
  } catch (err) {
    logger.error({ event: 'FIREBASE_INIT_FAILED', error: err.message });
  }
}

/**
 * Retry wrapper for Firebase writes.
 * @param {function} writeFn - async function to attempt
 * @param {string} path - Firebase path (for logging)
 * @param {string} vesselId
 */
async function withRetry(writeFn, path, vesselId) {
  const startMs = Date.now();

  for (let attempt = 1; attempt <= FIREBASE_WRITE_RETRY_COUNT; attempt++) {
    try {
      await writeFn();
      const writeLatencyMs = Date.now() - startMs;

      if (shouldLogFirebaseWrite()) {
        logger.debug({
          event: 'FIREBASE_WRITE',
          path,
          vesselId,
          writeLatencyMs,
        });
      }
      return;
    } catch (err) {
      if (attempt < FIREBASE_WRITE_RETRY_COUNT) {
        logger.warn({
          event: 'FIREBASE_WRITE_RETRY',
          attempt,
          path,
          error: err.message,
        });
        await sleep(FIREBASE_WRITE_RETRY_DELAY_MS);
      } else {
        logger.error({
          event: 'FIREBASE_WRITE_FAILED',
          path,
          vesselId,
          attempts: FIREBASE_WRITE_RETRY_COUNT,
          error: err.message,
        });
        // Fallback to local queue
        enqueueFailedWrite({ path, vesselId });
      }
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Manage trail ring buffer.
 * Appends new trail point, trims to maxSize.
 * @param {Array} existingTrail
 * @param {object} newPoint
 * @param {number} maxSize
 * @returns {Array}
 */
function appendTrail(existingTrail, newPoint, maxSize) {
  const trail = Array.isArray(existingTrail) ? [...existingTrail] : [];
  trail.push(newPoint);
  if (trail.length > maxSize) {
    trail.splice(0, trail.length - maxSize);
  }
  return trail;
}

/**
 * Write a VesselState live position to Realtime DB.
 * @param {object} vessel - VesselState
 */
async function writeVesselState(vessel) {
  if (!db) return;

  const path = `/vessels/${vessel.vesselId}/state`;
  const statePayload = {
    vesselId: vessel.vesselId,
    source: vessel.source,
    name: vessel.name,
    vesselType: vessel.vesselType,
    position: vessel.position,
    motion: vessel.motion,
    operationalStatus: vessel.operationalStatus,
    projectedPositions: vessel.projectedPositions,
    destination: vessel.destination ?? null,
    activeThreatIds: vessel.activeThreatIds,
    routeStatus: vessel.routeStatus,
    lastUpdatedUtc: vessel.lastUpdatedUtc,
    dataQuality: vessel.dataQuality,
    ingestLatencyMs: vessel.ingestLatencyMs,
  };

  await withRetry(
    () => db.ref(path).set(statePayload),
    path,
    vessel.vesselId
  );
}

/**
 * Append a trail point to Realtime DB ring buffer.
 * @param {object} vessel - VesselState
 */
async function appendVesselTrail(vessel) {
  if (!db || !vessel.position) return;

  const maxSize = vessel.source === 'AIS' ? TRAIL_MAX_AIS : TRAIL_MAX_ADSB;
  const trailPath = `/vessels/${vessel.vesselId}/trail`;

  const newPoint = vessel.trail?.[vessel.trail.length - 1];
  if (!newPoint) return;

  await withRetry(async () => {
    const snapshot = await db.ref(trailPath).once('value');
    const existing = snapshot.val() || [];
    const updated = appendTrail(existing, newPoint, maxSize);
    await db.ref(trailPath).set(updated);
  }, trailPath, vessel.vesselId);
}

/**
 * Write static vessel profile to Firestore.
 * Called from ShipStaticData updates.
 * @param {object} staticUpdate - partial vessel with _isStaticUpdate flag
 */
async function writeVesselProfile(staticUpdate) {
  if (!firestore) return;

  const docPath = `vesselProfiles/${staticUpdate.vesselId}`;
  const profile = {
    vesselId: staticUpdate.vesselId,
    mmsi: staticUpdate.mmsi,
    imoNumber: staticUpdate.imoNumber ?? null,
    callsign: staticUpdate.callsign ?? null,
    name: staticUpdate.name,
    vesselType: staticUpdate.vesselType,
    destination: staticUpdate.destination ?? null,
    dimensions: staticUpdate.dimensions ?? null,
    source: staticUpdate.source,
    updatedAt: staticUpdate.lastUpdatedUtc,
  };

  await withRetry(
    () => firestore.doc(docPath).set(profile, { merge: true }),
    docPath,
    staticUpdate.vesselId
  );
}

/**
 * Append an alert to Firestore vessel alert history.
 * @param {string} vesselId
 * @param {object} alert - { anomalyType, details, timestamp }
 */
async function writeVesselAlert(vesselId, alert) {
  if (!firestore) return;

  const colPath = `vesselAlerts/${vesselId}/alerts`;
  await withRetry(
    () => firestore.collection(colPath).add({
      ...alert,
      vesselId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }),
    colPath,
    vesselId
  );
}

module.exports = {
  initFirebase,
  writeVesselState,
  appendVesselTrail,
  writeVesselProfile,
  writeVesselAlert,
};
