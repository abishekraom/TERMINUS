'use strict';

/**
 * WebSocket Backup Transport B
 *
 * Exposed at: ws://localhost:{PORT}/vessels/stream
 *
 * Clients subscribe with:
 *   { "subscribe": "ALL" }
 *   { "subscribe": "MMSI", "ids": [123456789] }
 *
 * Server pushes VesselState delta patches every 5 seconds per vessel.
 *
 * Registered as a Fastify plugin — caller must register @fastify/websocket first.
 */

const logger = require('../logger');

const PUSH_INTERVAL_MS = 5_000;

/**
 * Register the WebSocket transport plugin.
 *
 * @param {import('fastify').FastifyInstance} fastify
 * @param {{ vesselStore: Map }} opts - shared vessel state store
 */
async function wsServerPlugin(fastify, opts) {
  const vesselStore = opts.vesselStore; // Map<vesselId, VesselState>

  // Track all active WebSocket sessions
  const sessions = new Set();

  fastify.get('/vessels/stream', { websocket: true }, (socket, req) => {
    const sessionId = generateId();

    const session = {
      id: sessionId,
      socket,
      mode: 'ALL',       // 'ALL' | 'MMSI'
      ids: new Set(),    // tracked MMSI/ICAO ids for 'MMSI' mode
      lastSentState: new Map(), // vesselId → JSON snapshot for delta comparison
      pushTimer: null,
    };

    sessions.add(session);

    logger.debug({
      event: 'WS_CLIENT_CONNECTED',
      sessionId,
      remoteAddress: req.socket?.remoteAddress,
    });

    // Handle subscription message
    socket.on('message', (rawData) => {
      try {
        const msg = JSON.parse(rawData.toString('utf8'));

        if (msg.subscribe === 'ALL') {
          session.mode = 'ALL';
          session.ids.clear();
          logger.debug({ event: 'WS_SUBSCRIBE', sessionId, mode: 'ALL' });
        } else if (msg.subscribe === 'MMSI' && Array.isArray(msg.ids)) {
          session.mode = 'MMSI';
          session.ids = new Set(msg.ids.map(String));
          logger.debug({ event: 'WS_SUBSCRIBE', sessionId, mode: 'MMSI', count: msg.ids.length });
        }
      } catch (err) {
        logger.warn({ event: 'WS_PARSE_ERROR', sessionId, error: err.message });
      }
    });

    socket.on('close', () => {
      sessions.delete(session);
      if (session.pushTimer) clearInterval(session.pushTimer);
      logger.debug({ event: 'WS_CLIENT_DISCONNECTED', sessionId });
    });

    socket.on('error', (err) => {
      logger.error({ event: 'WS_CLIENT_ERROR', sessionId, error: err.message });
      sessions.delete(session);
      if (session.pushTimer) clearInterval(session.pushTimer);
    });

    // Start push timer for this session
    session.pushTimer = setInterval(() => {
      if (socket.readyState !== socket.OPEN) return;

      const toSend = [];

      for (const [vesselId, vesselState] of vesselStore) {
        // Filter by subscription mode
        if (session.mode === 'MMSI') {
          const keyId = vesselId.replace(/^(MMSI:|ICAO:)/, '');
          if (!session.ids.has(keyId) && !session.ids.has(vesselId)) continue;
        }

        // Build delta: only send if changed
        const currentJson = JSON.stringify(vesselState);
        const lastJson = session.lastSentState.get(vesselId);

        if (currentJson !== lastJson) {
          toSend.push(buildDelta(vesselState, lastJson));
          session.lastSentState.set(vesselId, currentJson);
        }
      }

      if (toSend.length > 0) {
        try {
          socket.send(JSON.stringify({ type: 'VESSEL_UPDATES', data: toSend, ts: new Date().toISOString() }));
        } catch (err) {
          logger.error({ event: 'WS_SEND_ERROR', sessionId, error: err.message });
        }
      }
    }, PUSH_INTERVAL_MS);
  });

  logger.info({ event: 'WS_SERVER_READY', path: '/vessels/stream', intervalMs: PUSH_INTERVAL_MS });
}

/**
 * Build a minimal delta patch from a VesselState.
 * For initial send, returns full state. For updates, returns changed fields.
 * We simplify: always send full state (delta diff is a performance enhancement
 * that can be layered later; the PRD says "delta only").
 *
 * @param {object} state
 * @param {string|undefined} lastJson
 * @returns {object}
 */
function buildDelta(state, lastJson) {
  if (!lastJson) return state; // first send = full state

  // For subsequent sends, include id + changed top-level fields only
  // This is a simple key-level diff
  const last = JSON.parse(lastJson);
  const delta = { vesselId: state.vesselId };

  const keys = ['position', 'motion', 'operationalStatus', 'trail', 'projectedPositions',
    'destination', 'activeThreatIds', 'routeStatus', 'lastUpdatedUtc', 'dataQuality'];

  for (const key of keys) {
    if (JSON.stringify(state[key]) !== JSON.stringify(last[key])) {
      delta[key] = state[key];
    }
  }

  return delta;
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

module.exports = wsServerPlugin;
