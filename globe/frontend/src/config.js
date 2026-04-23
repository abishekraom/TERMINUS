/**
 * Frontend Configuration
 * 
 * Central configuration for API connectivity.
 * Vessel & aircraft data now comes from Firebase Firestore (see src/firebase.js).
 * These REST endpoints are still used for threats and tracks.
 * Override via Vite env vars (VITE_API_BASE, VITE_WS_URL).
 */

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';
export const TIE_API_BASE = import.meta.env.VITE_TIE_API_BASE || 'http://localhost:3002';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/vessels/stream';
export const POLL_INTERVAL_MS = 4000; // 4-second polling for REST snapshot
export const SNAPSHOT_LOD = 200;       // Request up to 200 vessels per snapshot
