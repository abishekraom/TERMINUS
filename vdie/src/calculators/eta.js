'use strict';

/**
 * ETA Calculator — Haversine distance + Speed Over Ground
 *
 * Usage:
 *   const { calculateEta } = require('./eta');
 *   const result = calculateEta(fromLat, fromLon, toLat, toLon, sogKnots);
 */

const EARTH_RADIUS_NM = 3440.065; // nautical miles

/**
 * Haversine formula — returns great-circle distance in nautical miles.
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} distance in nautical miles
 */
function haversineNm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_NM * c;
}

/**
 * Calculate ETA from current position to destination point.
 *
 * @param {number} fromLat - current latitude
 * @param {number} fromLon - current longitude
 * @param {number} toLat   - destination latitude
 * @param {number} toLon   - destination longitude
 * @param {number} sogKnots - speed over ground in knots
 * @returns {{
 *   distanceNm: number,
 *   etaHours: number,
 *   calculatedEtaUtc: string|null,
 *   etaConfidence: 'HIGH'|'MEDIUM'|'LOW'|'UNAVAILABLE'
 * }}
 */
function calculateEta(fromLat, fromLon, toLat, toLon, sogKnots) {
  if (
    toLat == null ||
    toLon == null ||
    fromLat == null ||
    fromLon == null
  ) {
    return { distanceNm: null, etaHours: null, calculatedEtaUtc: null, etaConfidence: 'UNAVAILABLE' };
  }

  const distanceNm = haversineNm(fromLat, fromLon, toLat, toLon);

  // Cannot calculate ETA if vessel is not moving
  if (!sogKnots || sogKnots < 0.5) {
    return { distanceNm, etaHours: null, calculatedEtaUtc: null, etaConfidence: 'LOW' };
  }

  const etaHours = distanceNm / sogKnots;
  const etaMs = etaHours * 3600 * 1000;
  const calculatedEtaUtc = new Date(Date.now() + etaMs).toISOString();

  let etaConfidence;
  if (sogKnots >= 5 && distanceNm < 5000) {
    etaConfidence = 'HIGH';
  } else if (sogKnots >= 1) {
    etaConfidence = 'MEDIUM';
  } else {
    etaConfidence = 'LOW';
  }

  return { distanceNm, etaHours, calculatedEtaUtc, etaConfidence };
}

module.exports = { haversineNm, calculateEta };
