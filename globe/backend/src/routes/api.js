'use strict';

/**
 * API Routes
 *
 * POST /lod           — Change LOD count (x-api-key required)
 * GET  /vessels/snapshot — Snapshot of current VesselState[] (x-api-key required)
 * GET  /health        — Health check (unauthenticated)
 *
 * Authentication: x-api-key header validated against INTERNAL_API_KEY env var.
 */

const { selectByLod } = require('../lod/priorityScorer');
const { invalidateSnapshotCache } = require('../transport/restSnapshot');
const logger = require('../logger');

/**
 * Validate x-api-key header.
 * Returns true if valid or if INTERNAL_API_KEY is not configured.
 */
function validateApiKey(request) {
  const expectedKey = process.env.INTERNAL_API_KEY;
  if (!expectedKey) return true; // not configured, allow all (dev mode)
  const provided = request.headers['x-api-key'];
  return provided === expectedKey;
}

/**
 * Register API routes as a Fastify plugin.
 *
 * @param {import('fastify').FastifyInstance} fastify
 * @param {{
 *   vesselStore: Map,
 *   operatorTrackedIds: Set,
 *   getLodState: function,
 *   setLodCount: function,
 *   startTime: Date,
 *   connectorStatus: object
 * }} opts
 */
async function apiPlugin(fastify, opts) {
  const {
    vesselStore,
    operatorTrackedIds,
    getLodState,
    setLodCount,
    startTime,
    connectorStatus,
  } = opts;

  // ── Auth Hook ────────────────────────────────────────────
  fastify.addHook('preHandler', async (request, reply) => {
    // /health is public
    if (request.routerPath === '/health') return;

    if (!validateApiKey(request)) {
      reply.code(401).send({ error: 'Unauthorized', message: 'Invalid or missing x-api-key header' });
    }
  });

  // ── GET /health ──────────────────────────────────────────
  fastify.get('/health', async (request, reply) => {
    const uptimeSeconds = Math.floor((Date.now() - startTime.getTime()) / 1000);

    return {
      status: 'ok',
      service: 'vdie',
      version: '1.0.0',
      uptime: uptimeSeconds,
      activeVessels: vesselStore.size,
      lod: getLodState(),
      connectedSources: connectorStatus,
      timestamp: new Date().toISOString(),
    };
  });

  // ── POST /lod ────────────────────────────────────────────
  fastify.post('/lod', {
    schema: {
      body: {
        type: 'object',
        required: ['count'],
        properties: {
          count: { type: 'integer', minimum: 1, maximum: 5000 },
        },
      },
    },
  }, async (request, reply) => {
    const { count } = request.body;
    const lodMax = parseInt(process.env.LOD_MAX, 10) || 5000;
    const actualCount = Math.min(count, lodMax);

    const previousCount = getLodState().count;
    setLodCount(actualCount);
    invalidateSnapshotCache();

    const { selected, total, filteredOut } = selectByLod(actualCount, vesselStore, operatorTrackedIds);

    logger.info({
      event: 'LOD_CHANGE',
      requestedCount: count,
      actualCount,
      filteredOut,
      reason: filteredOut > 0 ? 'below_priority_threshold' : 'all_included',
    });

    return {
      success: true,
      previous: previousCount,
      current: actualCount,
      activeVessels: vesselStore.size,
      selected: selected.length,
      filteredOut,
      total,
    };
  });

  // ── GET /vessels/snapshot — delegated to restSnapshot plugin ─
  // (restSnapshotPlugin registers this route, not here — avoid duplicate route)

  // ── GET /tracks/:icao24 — OpenSky historical track ───────
  fastify.get('/tracks/:icao24', async (request, reply) => {
    const { icao24 } = request.params;
    const { fetch } = require('undici');
    const token = request.headers['x-opensky-token'] || null;

    const url = `https://opensky-network.org/api/tracks/all?icao24=${encodeURIComponent(icao24)}&time=0`;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await fetch(url, { headers });
      if (!res.ok) {
        return reply.code(res.status).send({ error: `OpenSky returned ${res.status}` });
      }
      const data = await res.json();

      // Trim to last 50 waypoints as per PRD §4.3
      if (data.path && data.path.length > 50) {
        data.path = data.path.slice(-50);
      }

      return data;
    } catch (err) {
      logger.error({ event: 'TRACKS_FETCH_ERROR', icao24, error: err.message });
      return reply.code(502).send({ error: 'Failed to fetch track from OpenSky' });
    }
  });
}

module.exports = { apiPlugin };
