// vdie/src/writers/firebaseWriter.js
'use strict';

const { realtimeDb, firestore } = require('../firebase');
const localQueue = require('./localQueue');
const logger = require('../logger');
const { FieldValue } = require('firebase-admin/firestore');

// ── Constants ────────────────────────────────────────────────────────────────

const TRAIL_MAX_LENGTH = 200;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500;

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Sleep for a given number of milliseconds.
 * @param {number} ms
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Remove undefined properties from an object recursively.
 * @param {object} obj
 * @returns {object}
 */
function cleanse(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(cleanse);
  const result = {};
  for (const key of Object.keys(obj)) {
    if (obj[key] !== undefined) {
      result[key] = cleanse(obj[key]);
    }
  }
  return result;
}

/**
 * Execute an async function with retry logic.
 * On final failure, enqueue to localQueue and throw.
 *
 * @param {Function} fn          - async function to execute
 * @param {string}   operation   - operation name for logging
 * @param {string}   vesselId    - vessel ID for logging/fallback
 * @param {object}   payload     - data payload for fallback
 * @returns {*} result of fn()
 */
async function withRetry(fn, operation, vesselId, payload) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      logger.warn({
        event: 'FIREBASE_WRITE_RETRY',
        operation,
        vesselId,
        attempt,
        maxRetries: MAX_RETRIES,
        error: err.message,
      });

      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS);
      } else {
        // All retries exhausted — enqueue to local fallback
        logger.error({
          event: 'FIREBASE_WRITE_FAILED',
          operation,
          vesselId,
          error: err.message,
        });
        localQueue.enqueue(operation, vesselId, payload, err.message);
        throw err;
      }
    }
  }
}

// ── Realtime DB Writers ──────────────────────────────────────────────────────

/**
 * Write the current VesselState to Realtime DB.
 * Path: /vessels/{vesselId}/state
 *
 * @param {object} vesselState - normalized VesselState object
 */
async function writeVesselState(vesselState) {
  const { vesselId } = vesselState;
  const refPath = `vessels/${vesselId}/state`;
  const startTime = Date.now();

  await withRetry(
    async () => {
      await realtimeDb.ref(refPath).set(cleanse(vesselState));
    },
    'WRITE_VESSEL_STATE',
    vesselId,
    vesselState
  );

  const writeLatencyMs = Date.now() - startTime;

  logger.debug({
    event: 'FIREBASE_WRITE',
    path: `/${refPath}`,
    vesselId,
    writeLatencyMs,
  });
}

/**
 * Append a trail point to the vessel's trail ring buffer in Realtime DB.
 * Maintains a max of TRAIL_MAX_LENGTH (200) entries using transaction.
 * Path: /vessels/{vesselId}/trail
 *
 * @param {string} vesselId   - canonical vessel ID
 * @param {object} trailPoint - { lat, lon, altMetres?, timestampUtc, sogKnots }
 */
async function appendTrailPoint(vesselId, trailPoint) {
  const refPath = `vessels/${vesselId}/trail`;
  const startTime = Date.now();

  await withRetry(
    async () => {
      const trailRef = realtimeDb.ref(refPath);
      await trailRef.transaction((currentTrail) => {
        const trail = Array.isArray(currentTrail) ? currentTrail : [];
        trail.push(cleanse(trailPoint));
        // Keep only the last TRAIL_MAX_LENGTH entries (ring buffer)
        if (trail.length > TRAIL_MAX_LENGTH) {
          return trail.slice(trail.length - TRAIL_MAX_LENGTH);
        }
        return trail;
      });
    },
    'APPEND_TRAIL',
    vesselId,
    trailPoint
  );

  const writeLatencyMs = Date.now() - startTime;

  logger.debug({
    event: 'FIREBASE_WRITE',
    path: `/${refPath}`,
    vesselId,
    operation: 'APPEND_TRAIL',
    writeLatencyMs,
  });
}

/**
 * Write multiple trail points at once (batch append).
 * Used when replaying from local queue or bulk ingestion.
 *
 * @param {string}   vesselId    - canonical vessel ID
 * @param {object[]} trailPoints - array of trail point objects
 */
async function batchAppendTrailPoints(vesselId, trailPoints) {
  const refPath = `vessels/${vesselId}/trail`;

  await withRetry(
    async () => {
      const trailRef = realtimeDb.ref(refPath);
      await trailRef.transaction((currentTrail) => {
        let trail = Array.isArray(currentTrail) ? currentTrail : [];
        trail = trail.concat(trailPoints);
        if (trail.length > TRAIL_MAX_LENGTH) {
          return trail.slice(trail.length - TRAIL_MAX_LENGTH);
        }
        return trail;
      });
    },
    'BATCH_APPEND_TRAIL',
    vesselId,
    trailPoints
  );
}

// ── Firestore Writers ────────────────────────────────────────────────────────

/**
 * Upsert vessel profile to Firestore (merge write).
 * Path: /vesselProfiles/{vesselId}
 *
 * @param {string} vesselId    - canonical vessel ID
 * @param {object} profileData - static vessel data (name, type, dimensions, IMO, etc.)
 */
async function upsertVesselProfile(vesselId, profileData) {
  const startTime = Date.now();

  await withRetry(
    async () => {
      await firestore
        .collection('vesselProfiles')
        .doc(vesselId)
        .set(
          {
            ...profileData,
            vesselId,
            lastUpdatedUtc: new Date().toISOString(),
          },
          { merge: true }
        );
    },
    'UPSERT_VESSEL_PROFILE',
    vesselId,
    profileData
  );

  const writeLatencyMs = Date.now() - startTime;

  logger.debug({
    event: 'FIRESTORE_WRITE',
    collection: 'vesselProfiles',
    vesselId,
    operation: 'UPSERT',
    writeLatencyMs,
  });
}

/**
 * Write a vessel alert to Firestore.
 * Path: /vesselAlerts/{vesselId}
 * Appends to the alerts array using arrayUnion.
 *
 * @param {string} vesselId  - canonical vessel ID
 * @param {object} alertData - alert object { threatId, threatType, severity, timestamp, ... }
 */
async function writeVesselAlert(vesselId, alertData) {
  const startTime = Date.now();

  const alert = {
    ...alertData,
    createdAtUtc: new Date().toISOString(),
  };

  await withRetry(
    async () => {
      await firestore
        .collection('vesselAlerts')
        .doc(vesselId)
        .set(
          {
            vesselId,
            alerts: FieldValue.arrayUnion(alert),
            lastAlertUtc: alert.createdAtUtc,
          },
          { merge: true }
        );
    },
    'WRITE_VESSEL_ALERT',
    vesselId,
    alertData
  );

  const writeLatencyMs = Date.now() - startTime;

  logger.info({
    event: 'FIRESTORE_WRITE',
    collection: 'vesselAlerts',
    vesselId,
    operation: 'ALERT_ADDED',
    threatId: alertData.threatId,
    writeLatencyMs,
  });
}

// ── Reader (for Route Monitor / REST snapshot) ───────────────────────────────

/**
 * Read current vessel state from Realtime DB.
 *
 * @param {string} vesselId - canonical vessel ID
 * @returns {object|null} VesselState or null if not found
 */
async function readVesselState(vesselId) {
  const snapshot = await realtimeDb.ref(`vessels/${vesselId}/state`).once('value');
  return snapshot.val();
}

/**
 * Read all vessel states (for REST snapshot endpoint).
 * Returns an object keyed by vesselId.
 *
 * @returns {object} { vesselId: VesselState, ... }
 */
async function readAllVesselStates() {
  const snapshot = await realtimeDb.ref('vessels').once('value');
  const data = snapshot.val();
  if (!data) return {};

  const states = {};
  for (const [vesselId, vessel] of Object.entries(data)) {
    if (vessel && vessel.state) {
      states[vesselId] = vessel.state;
    }
  }
  return states;
}

/**
 * Read vessel trail from Realtime DB.
 *
 * @param {string} vesselId - canonical vessel ID
 * @returns {object[]} trail points array
 */
async function readVesselTrail(vesselId) {
  const snapshot = await realtimeDb.ref(`vessels/${vesselId}/trail`).once('value');
  return snapshot.val() || [];
}

/**
 * Remove a vessel's live state from Realtime DB.
 * Used by the stale data reaper (Level 1).
 *
 * @param {string} vesselId - canonical vessel ID
 */
async function removeVesselState(vesselId) {
  const refPath = `vessels/${vesselId}/state`;
  await withRetry(
    async () => {
      await realtimeDb.ref(refPath).remove();
    },
    'REMOVE_VESSEL_STATE',
    vesselId,
    null
  );

  logger.info({
    event: 'FIREBASE_REMOVE_STATE',
    path: `/${refPath}`,
    vesselId,
  });
}

/**
 * Remove a vessel's entire node (state + trail) from Realtime DB.
 * Used by the stale data reaper (Level 2).
 *
 * @param {string} vesselId - canonical vessel ID
 */
async function removeVesselFull(vesselId) {
  const refPath = `vessels/${vesselId}`;
  await withRetry(
    async () => {
      await realtimeDb.ref(refPath).remove();
    },
    'REMOVE_VESSEL_FULL',
    vesselId,
    null
  );

  logger.info({
    event: 'FIREBASE_REMOVE_FULL',
    path: `/${refPath}`,
    vesselId,
  });
}

module.exports = {
  // Writers
  writeVesselState,
  appendTrailPoint,
  batchAppendTrailPoints,
  upsertVesselProfile,
  writeVesselAlert,

  // Readers
  readVesselState,
  readAllVesselStates,
  readVesselTrail,

  // Cleanup
  removeVesselState,
  removeVesselFull,
};
