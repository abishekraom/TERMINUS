const admin = require('firebase-admin');
const config = require('./config');
const logger = require('./logger');

if (!admin.apps.length) {
  try {
    if (config.firebase.projectId && config.firebase.privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.firebase.projectId,
          clientEmail: config.firebase.clientEmail,
          privateKey: config.firebase.privateKey,
        }),
      });
      logger.info('Firebase initialized with standard credentials');
    } else {
      admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
      logger.warn('Firebase initialized with default application credentials');
    }
  } catch (error) {
    logger.error({ err: error }, 'Failed to initialize Firebase');
  }
}

const db = admin.firestore();

module.exports = { admin, db };
