// vdie/src/firebase.js
'use strict';

const admin = require('firebase-admin');
const path = require('path');
const logger = require('./logger');

// Resolve service account path relative to the vdie/ root
const serviceAccountPath = path.resolve(
  __dirname,
  '..',
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './secrets/firebase-service-account.json'
);

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_REALTIME_DB_URL,
});

const realtimeDb = admin.database();
const firestore = admin.firestore();
firestore.settings({ ignoreUndefinedProperties: true });

logger.info({
  event: 'FIREBASE_INITIALIZED',
  projectId: process.env.FIREBASE_PROJECT_ID,
  realtimeDbUrl: process.env.FIREBASE_REALTIME_DB_URL,
  hasFirestore: true,
  hasRealtimeDb: true,
});

module.exports = { admin, realtimeDb, firestore };
