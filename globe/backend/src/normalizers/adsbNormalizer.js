'use strict';

/**
 * ADS-B Normalizer
 *
 * Converts raw OpenSky Network state vectors into VesselState objects.
 *
 * OpenSky state vector is a positional array:
 * [0] icao24, [1] callsign, [2] origin_country, [3] time_position,
 * [4] last_contact, [5] longitude, [6] latitude, [7] baro_altitude,
 * [8] on_ground, [9] velocity (m/s), [10] true_track, [11] vertical_rate,
 * [12] sensors, [13] geo_altitude, [14] squawk, [15] spi,
 * [16] position_source, [17] category
 */

const { computeProjections } = require('../calculators/deadReckoning');

const EMERGENCY_SQUAWKS = new Set(['7500', '7600', '7700']);

// category filter: include 0 (no info — can't confirm NOT large), 4 (large), 5 (high vortex large), 6 (heavy)
// Per PRD §4.1 we target [4,5] but we must also pass through 0 (no category data = unknown, include)
const INCLUDE_CATEGORIES = new Set([0, 4, 5, 6]);
const EXCLUDE_CATEGORIES = new Set([1, 2, 3, 7]); // no transponder, light, small, high-performance

// m/s to knots conversion factor
const MS_TO_KNOTS = 1.94384;

/**
 * Map ADS-B category code to VesselCategory.
 */
function resolveAdsbCategory(category) {
  if (category === 4) return 'AIRCRAFT_CARGO';
  if (category === 5) return 'AIRCRAFT_CARGO'; // high vortex large
  if (category === 6) return 'AIRCRAFT_HEAVY';
  return 'UNKNOWN';
}

/**
 * Normalize a single OpenSky state vector (array of 18 elements).
 *
 * @param {Array} sv - state vector array
 * @returns {object|null} VesselState or null if to be skipped
 */
function normalizeStateVector(sv) {
  if (!Array.isArray(sv) || sv.length < 17) return null;

  const [
    icao24,        // 0
    callsignRaw,   // 1
    ,              // 2 origin_country
    ,              // 3 time_position
    lastContact,   // 4
    longitude,     // 5
    latitude,      // 6
    baroAltitude,  // 7
    onGround,      // 8
    velocityMs,    // 9
    trueTrack,     // 10
    verticalRate,  // 11
    ,              // 12 sensors
    geoAltitude,   // 13
    squawk,        // 14
    ,              // 15 spi
    positionSource,// 16
    category,      // 17
  ] = sv;

  // Drop surface aircraft
  if (onGround === true) return null;

  // Filter by category: only ingest if NOT light/small/high-perf
  // category 0 (no info) is passed through since we can't rule out cargo
  if (category != null && EXCLUDE_CATEGORIES.has(category)) return null;

  // Drop stale contacts (>120s)
  const ageSeconds = lastContact ? Math.floor(Date.now() / 1000) - lastContact : Infinity;
  if (ageSeconds > 120) return null;

  // Require valid position
  if (latitude == null || longitude == null) return null;

  // Filter taxiing aircraft (<100m altitude)
  const altMetres = geoAltitude ?? baroAltitude;
  if (altMetres != null && altMetres < 100) return null;

  const callsign = (callsignRaw || '').trim() || icao24;
  const sogKnots = velocityMs != null ? parseFloat((velocityMs * MS_TO_KNOTS).toFixed(2)) : 0;
  const trimmedSquawk = squawk ? String(squawk).trim() : undefined;
  const isEmergency = trimmedSquawk ? EMERGENCY_SQUAWKS.has(trimmedSquawk) : false;

  // Data quality: prefer ADS-B (source 0), downgrade MLAT
  let dataQuality = 'MEDIUM';
  if (positionSource === 0) dataQuality = 'HIGH';
  else if (positionSource === 2) dataQuality = 'LOW'; // MLAT

  const isUnderway = sogKnots > 0.5;
  const cogDegrees = trueTrack ?? 0;
  const headingDegrees = trueTrack ?? 0;

  const fixTimestampUtc = lastContact
    ? new Date(lastContact * 1000).toISOString()
    : new Date().toISOString();

  const vessel = {
    vesselId: `ICAO:${icao24}`,
    source: 'ADSB',
    icao24,
    mmsi: undefined,
    imoNumber: undefined,
    callsign,
    name: callsign,
    vesselType: resolveAdsbCategory(category),
    flagCountry: undefined,

    position: {
      lat: latitude,
      lon: longitude,
      altitudeMetres: altMetres ?? undefined,
      accuracyHigh: positionSource === 0,
      fixTimestampUtc,
    },

    motion: {
      sogKnots,
      cogDegrees,
      headingDegrees,
      rateOfTurnDegPerMin: undefined,
      verticalRateMs: verticalRate ?? undefined,
      isUnderway,
    },

    destination: undefined,

    dimensions: undefined,

    operationalStatus: {
      navStatus: 0,
      navStatusLabel: isUnderway ? 'Airborne' : 'Stationary',
      isAnchored: false,
      isMoored: false,
      isUnderway,
      emergencySquawk: isEmergency ? trimmedSquawk : undefined,
      isEmergency,
    },

    trail: [
      {
        lat: latitude,
        lon: longitude,
        altMetres: altMetres ?? undefined,
        timestampUtc: fixTimestampUtc,
        sogKnots,
      },
    ],

    projectedPositions: computeProjections(latitude, longitude, cogDegrees, sogKnots),

    activeThreatIds: [],
    routeStatus: 'CLEAR',
    lastUpdatedUtc: fixTimestampUtc,
    ingestLatencyMs: lastContact ? Date.now() - lastContact * 1000 : 0,
    dataQuality,
  };

  return vessel;
}

/**
 * Normalize a full OpenSky /states/all response.
 *
 * @param {object} openSkyResponse - { states: [[...], [...]] }
 * @returns {VesselState[]} filtered and normalized vessels
 */
function normalizeOpenSkyResponse(openSkyResponse) {
  if (!openSkyResponse || !Array.isArray(openSkyResponse.states)) {
    return [];
  }

  const results = [];
  for (const sv of openSkyResponse.states) {
    const vessel = normalizeStateVector(sv);
    if (vessel) results.push(vessel);
  }
  return results;
}

module.exports = { normalizeStateVector, normalizeOpenSkyResponse };
