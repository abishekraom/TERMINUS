'use strict';
require('dotenv').config();

const { header, subheader, pass, fail, info, assert, assertEqual, summary } = require('./test-utils');
const { createReaper } = require('../src/reaper');
const { writeVesselState, readVesselState, removeVesselState, removeVesselFull, appendTrailPoint, readVesselTrail } = require('../src/writers/firebaseWriter');
const { realtimeDb } = require('../src/firebase');
const logger = require('../src/logger');

// Temporarily suppress global logger for cleaner test output
logger.level = 'silent';

async function run() {
  header('Integration Tests: Reaper Execution Over Live Realtime DB');

  subheader('Database Staging Preparation');
  const vesselMemoryStaleId = 'MMSI:TEST_MEM_STALE';
  const ageMemoryStaleDate = new Date(Date.now() - (10 * 60 * 1000)).toISOString(); // 10 mins ago

  const vesselFullStaleId = 'MMSI:TEST_FULL_STALE';
  const ageFullStaleDate = new Date(Date.now() - (40 * 60 * 1000)).toISOString(); // 40 mins ago

  const vesselStore = new Map();
  vesselStore.set(vesselMemoryStaleId, { vesselId: vesselMemoryStaleId, lastUpdatedUtc: ageMemoryStaleDate });
  vesselStore.set(vesselFullStaleId, { vesselId: vesselFullStaleId, lastUpdatedUtc: ageFullStaleDate });

  try {
    info(`Writing Vessel 1 (${vesselMemoryStaleId}) to db...`);
    await writeVesselState({ vesselId: vesselMemoryStaleId, name: 'Mem Stale Ship', lastUpdatedUtc: ageMemoryStaleDate });
    await appendTrailPoint(vesselMemoryStaleId, { lat: 0, lon: 0, sogKnots: 10 });
    pass('Mock Memory-Stale Vessel successfully written remotely');

    info(`Writing Vessel 2 (${vesselFullStaleId}) to db...`);
    await writeVesselState({ vesselId: vesselFullStaleId, name: 'Full Stale Ship', lastUpdatedUtc: ageFullStaleDate });
    await appendTrailPoint(vesselFullStaleId, { lat: 1, lon: 1, sogKnots: 12 });
    pass('Mock Fully-Stale Vessel successfully written remotely');
  } catch(e) {
    fail('Pre-requisite database injection failed', e);
  }

  subheader('Reaper Cycle Actuation');
  const reaper = createReaper(vesselStore, removeVesselState, removeVesselFull, {
    staleMemoryMs: 5 * 60 * 1000,
    staleFirebaseMs: 30 * 60 * 1000
  });

  const stats = await reaper.cleanup();
  assertEqual(stats.stateRemoved, 1, 'Reaper telemetry counted exactly 1 state-level scrub');
  assertEqual(stats.fullRemoved, 1, 'Reaper telemetry counted exactly 1 total-node scrub');

  info('Yielding to promise resolution queue for 1,500ms...');
  await new Promise(r => setTimeout(r, 1500));
  pass('Remote delete commitments reached');

  subheader('Assessing Post-Reaper Firebase Topography');

  // Vessel 1 (Memory Stale -> Keep Trail, Scrub State)
  const memState = await readVesselState(vesselMemoryStaleId);
  const memTrail = await readVesselTrail(vesselMemoryStaleId);
  assertEqual(memState, null, `Target 1 State node (${vesselMemoryStaleId}/state) successfully nuked`);
  assert(memTrail.length > 0, `Target 1 Trail node automatically bypassed and structurally preserved in isolation`, 'Trail dropped off db!');

  // Vessel 2 (Fully Stale -> Both Scrubbed)
  const fullState = await readVesselState(vesselFullStaleId);
  const fullTrail = await readVesselTrail(vesselFullStaleId);
  assertEqual(fullState, null, `Target 2 State node (${vesselFullStaleId}/state) successfully nuked`);
  assertEqual(fullTrail.length, 0, `Target 2 Trail node (${vesselFullStaleId}/trail) successfully scrubbed out of existence`);

  assertEqual(vesselStore.size, 0, 'Internal global Map store is successfully purged of both entities');

  // Clean-up Test Data Manually Let Over.
  await removeVesselFull(vesselMemoryStaleId);
  summary();

  // Terminate Firebase sockets
  process.exit(0);
}

run().catch(err => {
  fail('Encountered an unhandled promise rejection inside runner!', err);
  process.exit(1);
});
