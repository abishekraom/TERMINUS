/**
 * Firebase Initialization
 * 
 * Initializes the Firebase app and exports the Firestore instance.
 * Configuration is read from Vite environment variables (VITE_FIREBASE_*).
 * 
 * Usage:
 *   import { db } from '../firebase';
 *   // then use db with collection(), onSnapshot(), etc.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://supply-chain-project-29398-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate config (warn if critical fields are missing)
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn(
    '[firebase] Missing Firebase config. Set VITE_FIREBASE_* env vars. ' +
    'See .env.example for required variables.'
  );
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app);

export { db, rtdb };
export default app;
