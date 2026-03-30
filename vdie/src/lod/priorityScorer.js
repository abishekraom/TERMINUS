'use strict';

/**
 * LOD Priority Scorer
 *
 * Implements the vessel priority scoring system from PRD §6:
 *
 *   Priority Score = (isUnderway × 40)
 *                 + (hasActiveThreats × 30)
 *                 + (isOperatorTracked × 20)
 *                 + (dataQuality == "HIGH" × 5)
 *                 + (random jitter 0–5)
 *
 * Higher score = included first in LOD slice.
 */

/**
 * Compute priority score for a single VesselState.
 * @param {object} vessel - VesselState
 * @param {Set<string>} operatorTrackedIds - vesselIds marked as operator-tracked
 * @returns {number} priority score
 */
function scoreVessel(vessel, operatorTrackedIds = new Set()) {
  let score = 0;

  // isUnderway × 40
  if (vessel.operationalStatus?.isUnderway || vessel.motion?.isUnderway) {
    score += 40;
  }

  // hasActiveThreats × 30
  if (vessel.activeThreatIds && vessel.activeThreatIds.length > 0) {
    score += 30;
  }

  // isOperatorTracked × 20
  if (operatorTrackedIds.has(vessel.vesselId)) {
    score += 20;
  }

  // dataQuality == "HIGH" × 5
  if (vessel.dataQuality === 'HIGH') {
    score += 5;
  }

  // Random jitter 0–5
  score += Math.random() * 5;

  return score;
}

/**
 * Select the top-N vessels by priority score.
 *
 * @param {number} count - number of vessels to return (LOD target)
 * @param {Map<string, object>} vesselMap - vesselId → VesselState
 * @param {Set<string>} [operatorTrackedIds] - optional operator-tracked vessel IDs
 * @returns {object[]} selected VesselState array, sorted by score descending
 */
function selectByLod(count, vesselMap, operatorTrackedIds = new Set()) {
  if (!vesselMap || vesselMap.size === 0) {
    return { selected: [], total: 0, filteredOut: 0 };
  }

  const scored = [];

  for (const [, vessel] of vesselMap) {
    const score = scoreVessel(vessel, operatorTrackedIds);
    scored.push({ score, vessel });
  }

  // Sort descending
  scored.sort((a, b) => b.score - a.score);

  const selected = scored.slice(0, count).map((s) => s.vessel);
  const filteredOut = Math.max(0, scored.length - count);

  return { selected, total: vesselMap.size, filteredOut };
}

module.exports = { scoreVessel, selectByLod };
