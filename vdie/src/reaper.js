'use strict';

const logger = require('./logger');

/**
 * Parses the Go-formatted UTC timestamp VDIE writes to Firebase.
 * Format: "2026-03-21 17:53:48.225926587 +0000 UTC"
 * Falls back to standard ISO parsing for forward-compatibility.
 * Returns a Unix ms timestamp, or NaN if unparseable.
 */
function parseVdieTimestamp(raw) {
  if (!raw || typeof raw !== 'string') return NaN;

  // Normalise Go format → ISO 8601: replace first space with 'T', strip " UTC" suffix
  // "2026-03-21 17:53:48.225926587 +0000 UTC" → "2026-03-21T17:53:48.225+00:00"
  const normalised = raw
    .trim()
    .replace(' ', 'T')          // date/time separator
    .replace(' UTC', '')        // trailing " UTC" suffix
    .replace(' +0000', 'Z')     // +0000 → Z
    .replace(/(\.\d{3})\d+/, '$1'); // truncate nanoseconds to milliseconds

  const ms = Date.parse(normalised);

  if (isNaN(ms)) {
    // Last-resort: try native parse on the raw string
    const fallback = Date.parse(raw);
    if (!isNaN(fallback)) return fallback;
    logger.warn({ event: 'TIMESTAMP_PARSE_FAILED', raw });
  }

  return ms;
}

/**
 * Creates a Stale Vessel Reaper.
 *
 * Two-threshold design:
 *   staleMemoryMs  — how long before a vessel is evicted from the in-memory store
 *                    and its /state node removed from Firebase Realtime DB.
 *                    Default: 5 min. Keeps the globe clean of vessels that briefly
 *                    go silent (AIS shadow zones, brief signal loss).
 *
 *   staleFirebaseMs — how long before the entire /vessels/{id} node (state + trail)
 *                    is deleted from Firebase Realtime DB.
 *                    Default: 30 min. Gives vessels time to reappear after longer
 *                    gaps (port entry, satellite AIS delay, ShipStaticData 6-min cycle).
 *
 * @param {Map}      vesselStore         - Engine's in-memory vessel store
 * @param {Function} removeVesselState   - Deletes /vessels/{id}/state from Firebase
 * @param {Function} removeVesselFull    - Deletes /vessels/{id} entirely from Firebase
 * @param {object}   options
 * @param {number}   options.staleMemoryMs   - In-memory + state eviction threshold (default 300_000 = 5 min)
 * @param {number}   options.staleFirebaseMs - Full Firebase node eviction threshold (default 1_800_000 = 30 min)
 */
function createReaper(vesselStore, removeVesselState, removeVesselFull, options = {}) {
  const staleMemoryMs   = options.staleMemoryMs   ?? 300_000;   // 5 min
  const staleFirebaseMs = options.staleFirebaseMs ?? 1_800_000; // 30 min

  async function cleanup() {
    const now = Date.now();
    const stats = { stateRemoved: 0, fullRemoved: 0, parseErrors: 0, remaining: 0 };

    for (const [vesselId, vessel] of vesselStore) {
      const lastUpdate = parseVdieTimestamp(vessel.lastUpdatedUtc);
      const ageMs = now - lastUpdate;

      if (isNaN(lastUpdate)) {
        // Unparseable timestamp — do not delete, just warn and skip
        stats.parseErrors++;
        logger.warn({ event: 'REAPER_SKIP_BAD_TIMESTAMP', vesselId, raw: vessel.lastUpdatedUtc });
        continue;
      }

      if (ageMs > staleFirebaseMs) {
        // Vessel has been dark for 30+ min — remove entirely from Firebase (state + trail)
        logger.info({
          event: 'STALE_VESSEL_FULL_REMOVE',
          vesselId,
          lastUpdated: vessel.lastUpdatedUtc,
          ageMinutes: Math.round(ageMs / 60_000),
        });

        vesselStore.delete(vesselId);

        try {
          await removeVesselFull(vesselId);
          stats.fullRemoved++;
        } catch (err) {
          logger.error({ event: 'STALE_FULL_REMOVE_ERROR', vesselId, error: err.message });
        }

      } else if (ageMs > staleMemoryMs) {
        // Vessel is quiet but may return — evict from memory + remove state,
        // but keep trail in Firebase so the globe doesn't lose the historical polyline
        logger.info({
          event: 'STALE_VESSEL_STATE_REMOVE',
          vesselId,
          lastUpdated: vessel.lastUpdatedUtc,
          ageMinutes: Math.round(ageMs / 60_000),
        });

        vesselStore.delete(vesselId);

        try {
          await removeVesselState(vesselId);
          stats.stateRemoved++;
        } catch (err) {
          logger.error({ event: 'STALE_STATE_REMOVE_ERROR', vesselId, error: err.message });
        }

      } else {
        stats.remaining++;
      }
    }

    if (stats.stateRemoved > 0 || stats.fullRemoved > 0 || stats.parseErrors > 0) {
      logger.info({
        event: 'REAPER_RUN_COMPLETE',
        ...stats,
      });
    }

    return stats;
  }

  return {
    cleanup,

    /**
     * Starts the reaper on a fixed interval.
     * Returns the interval handle — store it and call clearInterval() on graceful shutdown.
     * Default interval: 5 min. No point running faster than staleMemoryMs.
     */
    start(intervalMs = 300_000) {
      logger.info({
        event: 'REAPER_STARTED',
        staleMemoryMs,
        staleFirebaseMs,
        intervalMs,
      });

      return setInterval(() => {
        cleanup().catch(err => {
          logger.error({ event: 'REAPER_UNCAUGHT', error: err.message });
        });
      }, intervalMs);
    },

    // Expose for unit testing
    _parseVdieTimestamp: parseVdieTimestamp,
  };
}

module.exports = { createReaper };