'use strict';

/**
 * Local Queue — Fallback write buffer for Firebase failures
 *
 * On Firebase write failure (after 3 retries), failed VesselState entries
 * are written to a local JSONL file. A background drain loop periodically
 * retries these writes when Firebase becomes available again.
 */

const fs = require('fs');
const path = require('path');
const logger = require('../logger');

const QUEUE_FILE = path.resolve(process.env.LOCAL_QUEUE_PATH || './data/failed-writes.jsonl');
const DRAIN_INTERVAL_MS = 30_000; // retry every 30s
const MAX_RETRY_AGE_MS = 60 * 60 * 1000; // discard entries older than 1 hour

let drainTimer = null;
let drainCallback = null;

/**
 * Ensure queue file directory exists.
 */
function ensureQueueDir() {
  const dir = path.dirname(QUEUE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Append a failed write to the local JSONL file.
 * @param {object} payload - { path, vesselId, data? }
 */
function enqueueFailedWrite(payload) {
  try {
    ensureQueueDir();
    const entry = {
      ...payload,
      enqueuedAt: new Date().toISOString(),
    };
    fs.appendFileSync(QUEUE_FILE, JSON.stringify(entry) + '\n', 'utf8');
    logger.warn({
      event: 'LOCAL_QUEUE_ENQUEUED',
      vesselId: payload.vesselId,
      path: payload.path,
      queueFile: QUEUE_FILE,
    });
  } catch (err) {
    logger.error({
      event: 'LOCAL_QUEUE_WRITE_FAILED',
      error: err.message,
    });
  }
}

/**
 * Read all pending entries from the queue file.
 * @returns {Array<object>}
 */
function readQueue() {
  try {
    if (!fs.existsSync(QUEUE_FILE)) return [];
    const content = fs.readFileSync(QUEUE_FILE, 'utf8').trim();
    if (!content) return [];
    return content
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        try { return JSON.parse(line); }
        catch (_) { return null; }
      })
      .filter(Boolean);
  } catch (err) {
    logger.error({ event: 'LOCAL_QUEUE_READ_FAILED', error: err.message });
    return [];
  }
}

/**
 * Clear the queue file.
 */
function clearQueue() {
  try {
    fs.writeFileSync(QUEUE_FILE, '', 'utf8');
  } catch (err) {
    logger.error({ event: 'LOCAL_QUEUE_CLEAR_FAILED', error: err.message });
  }
}

/**
 * Set the drain callback. Called from firebaseWriter once Firebase is available.
 * @param {function} cb - async (entry) => void, returns true on success
 */
function setDrainCallback(cb) {
  drainCallback = cb;
}

/**
 * Start the background drain loop.
 */
function startDrainLoop() {
  drainTimer = setInterval(async () => {
    if (!drainCallback) return;

    const entries = readQueue();
    if (entries.length === 0) return;

    const now = Date.now();
    const fresh = entries.filter((e) => {
      const age = now - new Date(e.enqueuedAt).getTime();
      return age < MAX_RETRY_AGE_MS;
    });

    const stale = entries.length - fresh.length;
    if (stale > 0) {
      logger.warn({ event: 'LOCAL_QUEUE_DISCARDING_STALE', count: stale });
    }

    if (fresh.length === 0) {
      clearQueue();
      return;
    }

    logger.info({ event: 'LOCAL_QUEUE_DRAIN_START', count: fresh.length });

    const remaining = [];
    for (const entry of fresh) {
      try {
        await drainCallback(entry);
      } catch (_) {
        remaining.push(entry);
      }
    }

    // Rewrite queue with only what failed again
    clearQueue();
    for (const entry of remaining) {
      enqueueFailedWrite(entry);
    }

    logger.info({
      event: 'LOCAL_QUEUE_DRAIN_DONE',
      processed: fresh.length - remaining.length,
      remaining: remaining.length,
    });
  }, DRAIN_INTERVAL_MS);

  logger.info({ event: 'LOCAL_QUEUE_DRAIN_LOOP_STARTED', intervalMs: DRAIN_INTERVAL_MS });
}

/**
 * Stop the drain loop (for clean shutdown).
 */
function stopDrainLoop() {
  if (drainTimer) {
    clearInterval(drainTimer);
    drainTimer = null;
  }
}

/**
 * Unified enqueue method matching firebaseWriter usage.
 */
function enqueue(operation, vesselId, data, error) {
  enqueueFailedWrite({ operation, vesselId, data, error });
}

module.exports = {
  enqueue,
  enqueueFailedWrite,
  readQueue,
  clearQueue,
  setDrainCallback,
  startDrainLoop,
  stopDrainLoop,
};
