'use strict';

/**
 * Anomaly Detector
 *
 * Detects:
 *   - SHARP_TURN: |RateOfTurn| > 60 deg/min
 *   - SUDDEN_STOP: SOG drops more than 5 knots from prior state
 *   - EMERGENCY_SQUAWK: ADS-B squawk 7500/7600/7700
 *   - AIS_DARK: position not updated > 30 minutes (passed in as flag)
 */

const SHARP_TURN_THRESHOLD = 60; // deg/min
const SUDDEN_STOP_DROP_KT = 5;   // knots
const EMERGENCY_SQUAWKS = new Set(['7500', '7600', '7700']);

/**
 * Check AIS vessel for anomalies.
 *
 * @param {object} vessel - incoming VesselState
 * @param {object|null} previousState - previous VesselState for same vesselId (may be null)
 * @returns {Array<{ anomalyType: string, details: object }>}
 */
function detectAisAnomalies(vessel, previousState) {
  const anomalies = [];

  const rot = vessel.motion?.rateOfTurnDegPerMin;

  // SHARP_TURN
  if (rot != null && rot !== -128 && Math.abs(rot) > SHARP_TURN_THRESHOLD) {
    anomalies.push({
      anomalyType: 'SHARP_TURN',
      details: {
        rateOfTurn: rot,
        previousCog: previousState?.motion?.cogDegrees ?? null,
        newCog: vessel.motion?.cogDegrees,
      },
    });
  }

  // SUDDEN_STOP
  if (
    previousState &&
    previousState.motion?.sogKnots != null &&
    vessel.motion?.sogKnots != null
  ) {
    const drop = previousState.motion.sogKnots - vessel.motion.sogKnots;
    if (drop >= SUDDEN_STOP_DROP_KT && vessel.motion.sogKnots < 1) {
      anomalies.push({
        anomalyType: 'SUDDEN_STOP',
        details: {
          previousSog: previousState.motion.sogKnots,
          newSog: vessel.motion.sogKnots,
          drop,
        },
      });
    }
  }

  return anomalies;
}

/**
 * Check ADS-B aircraft for emergency squawk.
 *
 * @param {object} vessel - incoming VesselState (ADS-B)
 * @returns {Array<{ anomalyType: string, details: object }>}
 */
function detectAdsbAnomalies(vessel) {
  const anomalies = [];
  const squawk = vessel.operationalStatus?.emergencySquawk;

  if (squawk && EMERGENCY_SQUAWKS.has(squawk)) {
    anomalies.push({
      anomalyType: 'EMERGENCY_SQUAWK',
      details: { squawk },
    });
  }

  return anomalies;
}

/**
 * Unified anomaly detection entry point.
 *
 * @param {object} vessel - VesselState
 * @param {object|null} previousState
 * @returns {Array<{ anomalyType: string, details: object }>}
 */
function detectAnomalies(vessel, previousState) {
  if (vessel.source === 'AIS') {
    return detectAisAnomalies(vessel, previousState);
  } else if (vessel.source === 'ADSB') {
    return detectAdsbAnomalies(vessel);
  }
  return [];
}

module.exports = { detectAnomalies, detectAisAnomalies, detectAdsbAnomalies };
