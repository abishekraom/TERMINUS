'use strict';

const { header, subheader, assert, assertEqual, summary } = require('./test-utils');
const { normalizePositionReport, normalizeShipStaticData } = require('../src/normalizers/aisNormalizer');

async function run() {
  header('Unit Tests: AIS Normalization & Engine Integration');

  subheader('Static Data Normalization');
  const staticRaw = {
    MessageType: 'ShipStaticData',
    MetaData: { MMSI: 244750054, time_utc: new Date().toISOString() },
    Message: {
      ShipStaticData: {
        UserID: 244750054,
        Type: 70, // Cargo
        Name: 'BATAVIER'
      }
    }
  };
  const staticNormalized = normalizeShipStaticData(staticRaw);
  assertEqual(staticNormalized.vesselType, 'CARGO', 'Correctly parses Ship Type 70 to CARGO');
  assertEqual(staticNormalized.name, 'BATAVIER', 'Correctly parses vessel Name');

  subheader('Position Report Normalization (Contradiction Handling)');
  const posRaw = {
    MessageType: 'PositionReport',
    MetaData: { MMSI: 244750054, time_utc: new Date().toISOString(), latitude: 51.0, longitude: 4.0 },
    Message: {
      PositionReport: {
        UserID: 244750054,
        Latitude: 51.0,
        Longitude: 4.0,
        Sog: 0,
        Cog: 90,
        NavigationalStatus: 0, // Underway using engine
        PositionAccuracy: true // usually gives HIGH
      }
    }
  };
  const posNormalized = normalizePositionReport(posRaw);
  assertEqual(posNormalized.dataQuality, 'LOW', 'Automatically flags stationary vessel reporting as underway with LOW quality');

  subheader('State Merging Logic Emulation (vdie/src/index.js)');
  const vesselStore = new Map();

  // 1. Emulate ShipStaticData ingestion
  let existing = vesselStore.get(staticNormalized.vesselId) || {};
  let mergedStatic = { ...existing, ...staticNormalized };
  mergedStatic.activeThreatIds = mergedStatic.activeThreatIds || [];
  mergedStatic.projectedPositions = mergedStatic.projectedPositions || [];
  vesselStore.set(mergedStatic.vesselId, mergedStatic);
  assert(vesselStore.has(staticNormalized.vesselId), 'Stored static data successfully', 'Failed to store static data');

  // 2. Emulate PositionReport ingestion
  existing = vesselStore.get(posNormalized.vesselId) || {};
  let mergedPos = {
    ...existing,
    ...posNormalized,
    name: existing.name || posNormalized.name,
    vesselType: (existing.vesselType && existing.vesselType !== 'UNKNOWN') ? existing.vesselType : (posNormalized.vesselType || 'UNKNOWN'),
    trail: posNormalized.trail,
    activeThreatIds: existing.activeThreatIds || [],
    routeStatus: existing.routeStatus || 'CLEAR',
  };
  mergedPos.activeThreatIds = mergedPos.activeThreatIds || [];
  mergedPos.projectedPositions = mergedPos.projectedPositions || [];
  vesselStore.set(mergedPos.vesselId, mergedPos);

  // 3. Assertions
  const finalVessel = vesselStore.get(posNormalized.vesselId);
  assertEqual(finalVessel.dataQuality, 'LOW', 'Merge preserves contradictory data quality warning');
  assertEqual(finalVessel.vesselType, 'CARGO', 'Merge correctly retains valid static vesselType without overwriting to UNKNOWN');
  assert(Array.isArray(finalVessel.activeThreatIds), 'Empty array initialization succeeds for activeThreatIds', 'activeThreatIds was pruned');
  assert(Array.isArray(finalVessel.projectedPositions), 'Empty array initialization succeeds for projectedPositions', 'projectedPositions was pruned');

  summary();
}

run();
