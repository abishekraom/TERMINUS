import { ref, onValue } from 'firebase/database';
import { rtdb } from '../firebase';

/**
 * Parses PowerShell object string serialization like:
 * "@{accuracyHigh=True; lat=40.95; lon=-73.58}"
 */
function parsePsObject(obj) {
  if (typeof obj !== 'string' || !obj.startsWith('@{')) return obj;
  try {
    const inner = obj.slice(2, -1);
    const pairs = inner.split(';');
    const result = {};
    for (const pair of pairs) {
      const eqIdx = pair.indexOf('=');
      if (eqIdx !== -1) {
        const k = pair.slice(0, eqIdx).trim();
        const v = pair.slice(eqIdx + 1).trim();
        result[k] = v;
      }
    }
    return result;
  } catch (e) {
    return obj;
  }
}

/**
 * normalizeEntity
 * Transforms a VDIE VesselState object from RTDB into the flat shape
 * the globe's Markers expect.
 */
function normalizeEntity(vId, v) {
  if (!v || !v.state) return null;
  const state = v.state;
  const pos = parsePsObject(state.position);
  const mot = parsePsObject(state.motion);
  const opStat = parsePsObject(state.operationalStatus);

  const latRaw = pos?.lat ?? null;
  const lonRaw = pos?.lon ?? null;
  
  const lat = Number(latRaw);
  const lon = Number(lonRaw);

  if (lat == null || lon == null || isNaN(lat) || isNaN(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;

  const rawType = (state.vesselType || state.type || '').toLowerCase();
  let type = 'ship';
  if (rawType.includes('aircraft') || rawType.includes('plane') || rawType.includes('flight') || rawType.includes('passenger')) {
    type = 'aircraft';
  }

  return {
    id: state.vesselId || vId || 'UNKNOWN',
    lat: lat,
    lon: lon,
    heading: Number(mot?.cogDegrees ?? mot?.headingDegrees ?? 0),
    speed: Number(mot?.sogKnots ?? 0),
    type,
    status: opStat?.status || opStat?.navStatusLabel || (typeof opStat === 'string' ? opStat : 'UNKNOWN'),
    name: state.name || state.vesselId || 'UNNAMED',
    source: state.source || 'RTDB',
  };
}

let unsubscribe = null;
let pendingShips = [];
let pendingPlanes = [];
let pendingUpdate = false;

self.onmessage = (event) => {
  const { type, payload } = event.data;

  if (type === 'INIT') {
    console.log('[telemetryWorker] Initializing Firebase RTDB listener');
    self.postMessage({ type: 'STATUS', payload: 'CONNECTING' });

    try {
      const vesselsRef = ref(rtdb, 'vessels');

      unsubscribe = onValue(
        vesselsRef,
        (snapshot) => {
          const data = snapshot.val();
          if (!data) {
            self.postMessage({ type: 'STATUS', payload: 'CONNECTED' });
            return;
          }

          const ships = [];
          const planes = [];
          const entries = Object.entries(data);

          for (let i = 0; i < entries.length; i++) {
            const [vId, v] = entries[i];
            const entity = normalizeEntity(vId, v);
            if (!entity) continue;

            if (entity.type === 'aircraft') {
              planes.push(entity);
            } else {
              ships.push(entity);
            }
          }

          pendingShips = ships;
          pendingPlanes = planes;
          pendingUpdate = true;

          self.postMessage({ type: 'STATUS', payload: 'CONNECTED' });
        },
        (err) => {
          console.error('[telemetryWorker] RTDB error:', err.message, err.code);
          self.postMessage({ type: 'STATUS', payload: 'ERROR' });
        }
      );
    } catch (err) {
      console.error('[telemetryWorker] Failed to initialize Firebase listener:', err);
      self.postMessage({ type: 'STATUS', payload: 'ERROR' });
    }
  }

  if (type === 'CLOSE') {
    if (unsubscribe) {
      console.log('[telemetryWorker] Closing RTDB listener');
      unsubscribe();
      unsubscribe = null;
    }
  }
};

// Throttled interval to send parsed data back to main thread
setInterval(() => {
  if (!pendingUpdate) return;

  self.postMessage({ 
    type: 'TELEMETRY_UPDATE', 
    payload: { vessels: pendingShips, aircraft: pendingPlanes } 
  });

  pendingUpdate = false;
}, 1000);
