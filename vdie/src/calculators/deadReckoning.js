'use strict';

/**
 * Dead Reckoning Calculator
 *
 * Projects vessel position forward using Course Over Ground (COG) and
 * Speed Over Ground (SOG) at 5, 10, and 15 minute intervals.
 */

const EARTH_RADIUS_NM = 3440.065; // nautical miles

/**
 * Project a single position forward.
 * @param {number} lat - current latitude (decimal degrees)
 * @param {number} lon - current longitude (decimal degrees)
 * @param {number} cogDeg - course over ground in degrees (0–359.9)
 * @param {number} sogKnots - speed over ground in knots
 * @param {number} minutes - minutes ahead to project
 * @returns {{ lat: number, lon: number, minutesAhead: number }}
 */
function projectPosition(lat, lon, cogDeg, sogKnots, minutes) {
  const distanceNm = sogKnots * (minutes / 60);

  // Angular distance in radians
  const d = distanceNm / EARTH_RADIUS_NM;
  const bearingRad = (cogDeg * Math.PI) / 180;

  const lat1 = (lat * Math.PI) / 180;
  const lon1 = (lon * Math.PI) / 180;

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(d) +
    Math.cos(lat1) * Math.sin(d) * Math.cos(bearingRad)
  );

  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(d) * Math.cos(lat1),
      Math.cos(d) - Math.sin(lat1) * Math.sin(lat2)
    );

  return {
    lat: parseFloat(((lat2 * 180) / Math.PI).toFixed(6)),
    lon: parseFloat(((lon2 * 180) / Math.PI).toFixed(6)),
    minutesAhead: minutes,
  };
}

/**
 * Compute dead-reckoning projections at 5, 10, and 15 minutes ahead.
 *
 * @param {number} lat
 * @param {number} lon
 * @param {number} cogDeg
 * @param {number} sogKnots
 * @returns {Array<{ lat: number, lon: number, minutesAhead: number }>}
 */
function computeProjections(lat, lon, cogDeg, sogKnots) {
  if (!lat || !lon || cogDeg == null || !sogKnots || sogKnots < 0.5) {
    return [];
  }

  return [5, 10, 15].map((minutes) =>
    projectPosition(lat, lon, cogDeg, sogKnots, minutes)
  );
}

module.exports = { projectPosition, computeProjections };
