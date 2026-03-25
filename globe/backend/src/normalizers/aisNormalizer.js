'use strict';

/**
 * AIS Normalizer
 *
 * Consumes raw AISStream.io WebSocket messages and produces VesselState objects.
 * Handles:
 *   - PositionReport       (Class A: cargo ships, tankers, large vessels)
 *   - ShipStaticData       (Class A: sent every 6 min)
 *   - StandardClassBPositionReport (smaller vessels)
 *   - AidToNavigationReport (skip — not tracked)
 */

const { calculateEta } = require('../calculators/eta');
const { computeProjections } = require('../calculators/deadReckoning');

// AIS Navigational Status labels
const NAV_STATUS_LABELS = {
  0: 'Underway using engine',
  1: 'At anchor',
  2: 'Not under command',
  3: 'Restricted manoeuvrability',
  4: 'Constrained by draught',
  5: 'Moored',
  6: 'Aground',
  7: 'Engaged in fishing',
  8: 'Underway sailing',
  15: 'Not defined',
};

// Vessel type codes → VDIE category
const VESSEL_TYPE_MAP = {
  50: 'PILOT',
  51: 'SAR',
};

// Tracked vessel type ranges
const SKIP_TYPES = new Set([35, 30]); // Military ops, Fishing

function resolveVesselCategory(typeCode) {
  if (!typeCode) return 'UNKNOWN';
  if (VESSEL_TYPE_MAP[typeCode]) return VESSEL_TYPE_MAP[typeCode];
  if (typeCode >= 70 && typeCode <= 79) return 'CARGO';
  if (typeCode >= 80 && typeCode <= 89) return 'TANKER';
  return 'UNKNOWN';
}

/**
 * Validate lat/lon — AIS sends 91.0/181.0 as "not available" sentinels.
 */
function isValidPosition(lat, lon) {
  if (lat == null || lon == null) return false;
  if (lat === 91.0 || lon === 181.0) return false;
  if (lat > 90 || lat < -90) return false;
  if (lon > 180 || lon < -180) return false;
  return true;
}

/**
 * Check if message is stale (>120 seconds old).
 * @param {string} timeUtc - ISO-8601 receipt timestamp
 * @returns {boolean} true if stale
 */
function isStale(timeUtc) {
  if (!timeUtc) return false;
  const ageMs = Date.now() - new Date(timeUtc).getTime();
  return ageMs > 120_000;
}

/**
 * Produce a base VesselState skeleton for an AIS vessel.
 */
function baseAisState(mmsi, shipName, timeUtc) {
  const vesselId = `MMSI:${mmsi}`;
  return {
    vesselId,
    source: 'AIS',
    mmsi,
    name: (shipName || '').trim() || `MMSI:${mmsi}`,
    vesselType: 'UNKNOWN',
    flagCountry: undefined,
    position: null,
    motion: {
      sogKnots: 0,
      cogDegrees: 0,
      headingDegrees: 0,
      rateOfTurnDegPerMin: undefined,
      verticalRateMs: undefined,
      isUnderway: false,
    },
    destination: undefined,
    dimensions: undefined,
    operationalStatus: {
      navStatus: 15,
      navStatusLabel: 'Not defined',
      isAnchored: false,
      isMoored: false,
      isUnderway: false,
      emergencySquawk: undefined,
      isEmergency: false,
    },
    trail: [],
    projectedPositions: [],
    activeThreatIds: [],
    routeStatus: 'CLEAR',
    lastUpdatedUtc: timeUtc || new Date().toISOString(),
    ingestLatencyMs: timeUtc ? Date.now() - new Date(timeUtc).getTime() : 0,
    dataQuality: 'MEDIUM',
  };
}

/**
 * Normalize a PositionReport message.
 */
function normalizePositionReport(raw) {
  const meta = raw.MetaData || {};
  const msg = raw.Message?.PositionReport || {};

  const mmsi = meta.MMSI || msg.UserID;
  const timeUtc = meta.time_utc;

  if (!mmsi) return null;
  if (isStale(timeUtc)) return null;

  const lat = meta.latitude ?? msg.Latitude;
  const lon = meta.longitude ?? msg.Longitude;

  if (!isValidPosition(lat, lon)) return null;

  const sog = msg.Sog ?? 0;
  const cog = msg.Cog ?? 0;
  const trueHeading = msg.TrueHeading === 511 ? cog : (msg.TrueHeading ?? cog);
  const navStatus = msg.NavigationalStatus ?? 15;
  const rot = msg.RateOfTurn; // -128 = unavailable

  const isUnderway = navStatus === 0 || sog > 0.5;
  const isAnchored = navStatus === 1;
  const isMoored = navStatus === 5;

  const vessel = baseAisState(mmsi, meta.ShipName, timeUtc);

  vessel.position = {
    lat,
    lon,
    altitudeMetres: undefined,
    accuracyHigh: msg.PositionAccuracy === true,
    fixTimestampUtc: timeUtc,
  };

  vessel.motion = {
    sogKnots: sog,
    cogDegrees: cog,
    headingDegrees: trueHeading,
    rateOfTurnDegPerMin: rot !== -128 ? rot : undefined,
    verticalRateMs: undefined,
    isUnderway,
  };

  vessel.operationalStatus = {
    navStatus,
    navStatusLabel: NAV_STATUS_LABELS[navStatus] || 'Unknown',
    isAnchored,
    isMoored,
    isUnderway,
    emergencySquawk: undefined,
    isEmergency: false,
  };

  vessel.dataQuality = msg.PositionAccuracy ? 'HIGH' : 'MEDIUM';

  // Dead reckoning
  vessel.projectedPositions = computeProjections(lat, lon, cog, sog);

  // Trail entry
  vessel.trail = [
    {
      lat,
      lon,
      altMetres: undefined,
      timestampUtc: timeUtc,
      sogKnots: sog,
    },
  ];

  vessel.ingestLatencyMs = timeUtc ? Date.now() - new Date(timeUtc).getTime() : 0;

  // Anomaly: ManeuverIndicator trigger
  if (msg.ManeuverIndicator && msg.ManeuverIndicator > 0) {
    vessel._maneuverAlert = true;
  }

  return vessel;
}

/**
 * Normalize a ShipStaticData message (merges into existing vessel profile).
 * Returns a partial update object — should be merged with existing state.
 */
function normalizeShipStaticData(raw) {
  const meta = raw.MetaData || {};
  const msg = raw.Message?.ShipStaticData || {};

  const mmsi = meta.MMSI || msg.UserID;
  if (!mmsi) return null;

  const typeCode = msg.Type;

  // Filter out military ops (35) and fishing (30)
  if (SKIP_TYPES.has(typeCode)) return null;

  const vesselType = resolveVesselCategory(typeCode);

  // Self-reported ETA: {Month, Day, Hour, Minute}
  let selfReportedEta = undefined;
  const eta = msg.Eta;
  if (eta && eta.Month && eta.Day) {
    try {
      const year = new Date().getFullYear();
      selfReportedEta = new Date(
        `${year}-${String(eta.Month).padStart(2, '0')}-${String(eta.Day).padStart(2, '0')}T${String(eta.Hour ?? 0).padStart(2, '0')}:${String(eta.Minute ?? 0).padStart(2, '0')}:00Z`
      ).toISOString();
    } catch (_) { /* ignore malformed ETA */ }
  }

  const dim = msg.Dimension || {};
  const lengthMetres = (dim.A || 0) + (dim.B || 0) || undefined;
  const beamMetres = (dim.C || 0) + (dim.D || 0) || undefined;

  return {
    vesselId: `MMSI:${mmsi}`,
    source: 'AIS',
    mmsi,
    imoNumber: msg.ImoNumber || undefined,
    callsign: (msg.CallSign || '').trim() || undefined,
    name: (msg.Name || '').trim() || `MMSI:${mmsi}`,
    vesselType,
    destination: msg.Destination
      ? {
          rawText: msg.Destination.trim(),
          portCode: msg.Destination.trim().toUpperCase(),
          portName: undefined,
          lat: undefined,
          lon: undefined,
          selfReportedEta,
          calculatedEtaUtc: undefined,
          calculatedDistanceNm: undefined,
          etaConfidence: 'LOW',
        }
      : undefined,
    dimensions: {
      lengthMetres,
      beamMetres,
      draughtMetres: msg.MaximumStaticDraught || undefined,
    },
    lastUpdatedUtc: meta.time_utc || new Date().toISOString(),
    _isStaticUpdate: true,
  };
}

/**
 * Normalize a StandardClassBPositionReport.
 */
function normalizeClassBReport(raw) {
  const meta = raw.MetaData || {};
  const msg = raw.Message?.StandardClassBPositionReport || {};

  const mmsi = meta.MMSI || msg.UserID;
  const timeUtc = meta.time_utc;

  if (!mmsi) return null;
  if (isStale(timeUtc)) return null;

  const lat = meta.latitude ?? msg.Latitude;
  const lon = meta.longitude ?? msg.Longitude;

  if (!isValidPosition(lat, lon)) return null;

  const sog = msg.Sog ?? 0;
  const cog = msg.Cog ?? 0;
  const trueHeading = msg.TrueHeading === 511 ? cog : (msg.TrueHeading ?? cog);

  const vessel = baseAisState(mmsi, meta.ShipName, timeUtc);

  vessel.position = {
    lat,
    lon,
    altitudeMetres: undefined,
    accuracyHigh: msg.PositionAccuracy === true,
    fixTimestampUtc: timeUtc,
  };

  vessel.motion = {
    sogKnots: sog,
    cogDegrees: cog,
    headingDegrees: trueHeading,
    rateOfTurnDegPerMin: undefined,
    verticalRateMs: undefined,
    isUnderway: sog > 0.5,
  };

  vessel.operationalStatus = {
    navStatus: 0,
    navStatusLabel: 'Underway using engine',
    isAnchored: false,
    isMoored: false,
    isUnderway: sog > 0.5,
    emergencySquawk: undefined,
    isEmergency: false,
  };

  vessel.dataQuality = msg.PositionAccuracy ? 'HIGH' : 'LOW';
  vessel.projectedPositions = computeProjections(lat, lon, cog, sog);
  vessel.trail = [{ lat, lon, timestampUtc: timeUtc, sogKnots: sog }];
  vessel.ingestLatencyMs = timeUtc ? Date.now() - new Date(timeUtc).getTime() : 0;

  return vessel;
}

/**
 * Master normalizer — routes to correct handler based on MessageType.
 * @param {object} raw - raw AISStream.io message
 * @returns {object|null} VesselState or static update object, or null if to be skipped
 */
function normalizeAisMessage(raw) {
  const type = raw.MessageType;

  if (type === 'PositionReport') {
    return normalizePositionReport(raw);
  } else if (type === 'ShipStaticData') {
    return normalizeShipStaticData(raw);
  } else if (type === 'StandardClassBPositionReport') {
    return normalizeClassBReport(raw);
  } else if (type === 'AidToNavigationReport') {
    // Not tracked per PRD §3.1
    return null;
  }

  return null;
}

module.exports = {
  normalizeAisMessage,
  normalizePositionReport,
  normalizeShipStaticData,
  normalizeClassBReport,
  isValidPosition,
  isStale,
};
