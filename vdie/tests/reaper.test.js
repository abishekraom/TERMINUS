'use strict';

const { header, subheader, assert, assertEqual, summary } = require('./test-utils');
const { createReaper } = require('../src/reaper');

async function run() {
  header('Unit Tests: VDIE Stale Vessel Reaper');

  subheader('Timestamp Parsing Configuration');
  const reaper = createReaper(new Map(), () => {}, () => {});
  const parse = reaper._parseVdieTimestamp;

  const goTime = "2026-03-21 17:53:48.225926587 +0000 UTC";
  const ms1 = parse(goTime);
  assert(!isNaN(ms1), 'Successfully parsed Go-formatted UTC timestamp', 'Failed passing Go-formatted timestamp');
  assertEqual(new Date(ms1).getUTCFullYear(), 2026, 'Extracted year completely matches input');
  assertEqual(new Date(ms1).getUTCMonth(), 2, 'Extracted month correctly translates to March (0-indexed)');
  assertEqual(new Date(ms1).getUTCHours(), 17, 'Extracted hours map precisely');

  const isoTime = "2026-03-21T17:53:48.225Z";
  const ms2 = parse(isoTime);
  assert(!isNaN(ms2), 'Successfully parsed standard ISO 8601 formatting', 'Failed parsing standard ISO timestamp');
  assertEqual(ms1, ms2, 'Go and ISO formats compute precisely to identical millisecond timestamps');

  const badTime = "not-a-date";
  const ms3 = parse(badTime);
  assert(isNaN(ms3), 'Gracefully handles unparseable corrupt timestamps (returning NaN)', 'Did not fail gracefully against corrupted dates');

  subheader('Two-Threshold Cleanup Logic Simulation');
  const mockVesselStore = new Map();
  const stateRemovals = [];
  const fullRemovals = [];

  const mockRemoveState = async (id) => stateRemovals.push(id);
  const mockRemoveFull = async (id) => fullRemovals.push(id);

  const now = Date.now();
  const staleMemoryMs = 5000;   // 5s
  const staleFirebaseMs = 15000; // 15s

  mockVesselStore.set('MMSI:ACTIVE', { vesselId: 'MMSI:ACTIVE', lastUpdatedUtc: new Date(now - 1000).toISOString() });
  mockVesselStore.set('MMSI:STATE_STALE', { vesselId: 'MMSI:STATE_STALE', lastUpdatedUtc: new Date(now - 8000).toISOString() });
  mockVesselStore.set('MMSI:FULL_STALE', { vesselId: 'MMSI:FULL_STALE', lastUpdatedUtc: new Date(now - 20000).toISOString() });

  const activeReaper = createReaper(mockVesselStore, mockRemoveState, mockRemoveFull, { staleMemoryMs, staleFirebaseMs });
  const stats = await activeReaper.cleanup();

  assertEqual(stats.stateRemoved, 1, 'Detected and requested exactly 1 Memory-Stale removal');
  assertEqual(stats.fullRemoved, 1, 'Detected and requested exactly 1 Fully-Stale removal');
  assertEqual(mockVesselStore.size, 1, 'Maintained 1 active vessel dynamically in memory');

  assert(mockVesselStore.has('MMSI:ACTIVE'), 'Verified Active Vessel avoided Reaper sweep', 'The active vessel was killed instead of bypassing');
  assertEqual(stateRemovals[0], 'MMSI:STATE_STALE', 'Verified state-only removal function explicitly called the correct target');
  assertEqual(fullRemovals[0], 'MMSI:FULL_STALE', 'Verified full-node removal function explicitly called the correct target');

  summary();
}

run();
