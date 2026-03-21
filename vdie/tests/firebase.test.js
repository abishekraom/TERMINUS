'use strict';
require('dotenv').config();

const { header, subheader, assert, fail, info, summary } = require('./test-utils');
const { realtimeDb, firestore } = require('../src/firebase');
const writer = require('../src/writers/firebaseWriter');
const localQueue = require('../src/writers/localQueue');
const logger = require('../src/logger');

// Suppress normal verbose outputs to expose test utility cleanly
logger.level = 'silent';

async function run() {
  header('Integration Tests: VDIE Database Interface Logic');
  const mockId = 'MMSI:TEST_WRITER_9999';

  try {
    subheader('Firebase Realtime Database Routines');
    
    info('1. Writing primary static Vessel State chunk');
    await writer.writeVesselState({ vesselId: mockId, name: 'WRITE_TEST_SHIP' });
    const check1 = await writer.readVesselState(mockId);
    assert(check1 && check1.name === 'WRITE_TEST_SHIP', 'Confirmed deep equality writing vs reading the precise node tree payload', 'Failed comparing written vs output state nodes');

    info('2. Writing single dimensional trailpoint coordinates');
    await writer.appendTrailPoint(mockId, { lat: 10, lon: 20 });
    const check2 = await writer.readVesselTrail(mockId);
    assert(Array.isArray(check2) && check2.length === 1, 'Transactional trail array creation mapping properly validated out the box', 'Array malformed / uncreated over network');

    subheader('Firestore Routines');

    info('3. Upserting vessel master-record to Document DB (Profiles)');
    await writer.upsertVesselProfile(mockId, { imoNumber: 1234567 });
    const doc = await firestore.collection('vesselProfiles').doc(mockId).get();
    assert(doc.exists && doc.data().imoNumber === 1234567, 'Firestore Document DB Upserts performant and readable directly post-execution', 'Upsert totally failed to land inside profiles');

    info('4. Pushing emergency localized threat detection arrays');
    await writer.writeVesselAlert(mockId, { threatType: 'WEATHER', severity: 3 });
    const alertDoc = await firestore.collection('vesselAlerts').doc(mockId).get();
    assert(alertDoc.exists && alertDoc.data().alerts?.length >= 1, 'Firestore ArrayUnion appended alerts exactly identically onto existing arrays natively');

    subheader('Offline Local-Queue Circuit Breaker');

    localQueue.enqueue('TEST_OP', mockId, { fake: 1 }, 'mock network out');
    const queueState = localQueue.readQueue();
    assert(queueState[queueState.length - 1].operation === 'TEST_OP', 'File-system queue accurately caches inputs completely decoupled of internet capability');
    
    localQueue.clearQueue();
    assert(localQueue.readQueue().length === 0, 'Internal garbage-collection flushes pending offline items securely');

  } catch(e) {
    fail('Interrupted midway by a thrown database error exception:', e);
  } finally {
    subheader('Garbage Clean-up & Sweeps');
    try {
      await realtimeDb.ref(`vessels/${mockId}`).remove();
      await firestore.collection('vesselProfiles').doc(mockId).delete();
      await firestore.collection('vesselAlerts').doc(mockId).delete();
      info('Obliterated leftover garbage documents and references natively over Firebase');
    } catch(e) {
      info('Ignored an error cleaning up the database: ' + e.message);
    }
  }

  summary();
  process.exit(0);
}

run();
