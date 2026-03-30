'use strict';

/**
 * REST Snapshot Transport C
 *
 * GET /vessels/snapshot?lod=200&type=CARGO,TANKER,AIRCRAFT_CARGO
 *
 * Returns current VesselState[] at the requested LOD,
 * optionally filtered by vessel type.
 *
 * Response is cached for 10 seconds to prevent Firebase hammering.
 */

const { selectByLod } = require('../lod/priorityScorer');
const logger = require('../logger');

const CACHE_TTL_MS = 10_000; // 10 second cache

let snapshotCache = null;
let cacheBornAt = 0;

/**
 * Register the REST snapshot route as a Fastify plugin.
 *
 * @param {import('fastify').FastifyInstance} fastify
 * @param {{ vesselStore: Map, operatorTrackedIds: Set }} opts
 */
async function restSnapshotPlugin(fastify, opts) {
  const vesselStore = opts.vesselStore;
  const operatorTrackedIds = opts.operatorTrackedIds || new Set();

  fastify.get('/vessels/snapshot', async (request, reply) => {
    const lodParam = parseInt(request.query.lod, 10);
    const lodCount = Number.isFinite(lodParam) && lodParam > 0
      ? Math.min(lodParam, parseInt(process.env.LOD_MAX, 10) || 5000)
      : (parseInt(process.env.LOD_DEFAULT, 10) || 200);

    const typeFilter = request.query.type
      ? new Set(request.query.type.split(',').map((t) => t.trim().toUpperCase()))
      : null;

    const now = Date.now();
    const cacheKey = `${lodCount}:${request.query.type || ''}`;

    // Serve cached response if still fresh
    if (
      snapshotCache &&
      snapshotCache.key === cacheKey &&
      now - cacheBornAt < CACHE_TTL_MS
    ) {
      return reply
        .header('X-Cache', 'HIT')
        .header('Content-Type', 'application/json')
        .send(snapshotCache.data);
    }

    const { selected, total, filteredOut } = selectByLod(lodCount, vesselStore, operatorTrackedIds);

    // Apply optional type filter
    const result = typeFilter
      ? selected.filter((v) => typeFilter.has(v.vesselType))
      : selected;

    const response = {
      count: result.length,
      total,
      filteredOut,
      lod: lodCount,
      generatedAt: new Date().toISOString(),
      vessels: result,
    };

    snapshotCache = { key: cacheKey, data: response };
    cacheBornAt = now;

    logger.debug({
      event: 'SNAPSHOT_SERVED',
      requestedLod: lodCount,
      returned: result.length,
      total,
      cached: false,
    });

    return reply
      .header('X-Cache', 'MISS')
      .header('Content-Type', 'application/json')
      .send(response);
  });
}

/**
 * Invalidate snapshot cache (call when LOD setting changes).
 */
function invalidateSnapshotCache() {
  snapshotCache = null;
  cacheBornAt = 0;
}

module.exports = { restSnapshotPlugin, invalidateSnapshotCache };
