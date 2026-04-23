import { useState, useEffect, useRef, useMemo } from 'react';
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
 * 
 * Transforms a VDIE VesselState object from RTDB into the flat shape
 * the globe's Markers expect.
 */
function normalizeEntity(vId, v) {
  normalizeEntity.logged = normalizeEntity.logged || false;
  
  if (!v || !v.state) return null;
  const state = v.state;
  const pos = parsePsObject(state.position);
  const mot = parsePsObject(state.motion);
  const opStat = parsePsObject(state.operationalStatus);

  const latRaw = pos?.lat ?? null;
  const lonRaw = pos?.lon ?? null;
  
  // Convert string to number
  const lat = Number(latRaw);
  const lon = Number(lonRaw);

  // Log first few for debugging
  if (vId && !normalizeEntity.logged) {
    console.log('[normalizeEntity] Sample:', vId, { lat: latRaw, lon: lonRaw, parsed: pos, latNum: lat, lonNum: lon });
    normalizeEntity.logged = true;
  }

  // Guard: invalid coordinates
  if (lat == null || lon == null || isNaN(lat) || isNaN(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;

  const rawType = (state.vesselType || state.type || '').toLowerCase();
  let type = 'ship';
  if (rawType.includes('aircraft') || rawType.includes('plane') || rawType.includes('flight')) {
    type = 'aircraft';
  }

  return {
    id: state.vesselId || vId || 'UNKNOWN',
    lat: lat,
    lon: lon,
    heading: Number(mot?.cogDegrees ?? 0),
    speed: Number(mot?.sogKnots ?? 0),
    type,
    status: opStat?.status || opStat?.navStatusLabel || (typeof opStat === 'string' ? opStat : 'UNKNOWN'),
    name: state.name || state.vesselId || 'UNNAMED',
    source: state.source || 'RTDB',
  };
}

/**
 * useRealtimeData
 * 
 * Fetches vessel data from Firebase Realtime Database.
 * OPTIMIZED: Throttled updates, limited initial load
 */
export function useRealtimeData() {
  const [vessels, setVessels] = useState([]);
  const [aircraft, setAircraft] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('CONNECTING');

  // Hash refs for change detection
  const prevVesselHash = useRef('');
  const prevAircraftHash = useRef('');
  
  // Throttle ref - only update state every 2 seconds max
  const lastUpdateTime = useRef(0);
  const UPDATE_INTERVAL_MS = 2000;
  
  // Buffer for pending updates
  const pendingData = useRef({ ships: [], planes: [] });
  const isProcessing = useRef(false);

  useEffect(() => {
    console.log('[useRealtimeData] Effect running, setting up RTDB listener');
    const vesselsRef = ref(rtdb, 'vessels');

    const unsubscribe = onValue(
      vesselsRef,
      (snapshot) => {
        const data = snapshot.val();
        
        if (!data) {
          setLoading(false);
          setConnectionStatus('CONNECTED');
          return;
        }

        const ships = [];
        const planes = [];

        // Process and limit entries for performance
        const entries = Object.entries(data);
        const maxEntries = 5000; // Limit initial load for performance
        
        // Sample entries evenly if too many
        const step = entries.length > maxEntries ? Math.floor(entries.length / maxEntries) : 1;
        
        for (let i = 0; i < entries.length; i += step) {
          const [vId, v] = entries[i];
          const entity = normalizeEntity(vId, v);
          if (!entity) continue;

          if (entity.type === 'aircraft') {
            planes.push(entity);
          } else {
            ships.push(entity);
          }
        }

        // Store in buffer
        pendingData.current = { ships, planes };
        
        // Throttle: only update state if enough time has passed
        const now = Date.now();
        if (now - lastUpdateTime.current >= UPDATE_INTERVAL_MS) {
          lastUpdateTime.current = now;
          processUpdate();
        }
      },
      (err) => {
        console.error('[useRealtimeData] RTDB error:', err.message, err.code);
        setError(err.message);
        setConnectionStatus('ERROR');
        setLoading(false);
      }
    );

    // Process pending updates periodically
    const intervalId = setInterval(() => {
      if (pendingData.current.ships.length > 0 || pendingData.current.planes.length > 0) {
        processUpdate();
      }
    }, UPDATE_INTERVAL_MS);

    function processUpdate() {
      const { ships, planes } = pendingData.current;
      if (ships.length === 0 && planes.length === 0) return;
      
      // Update ships if changed
      const shipHash = ships.map(v => `${v.id}:${v.lat.toFixed(2)},${v.lon.toFixed(2)}`).join('|');
      if (shipHash !== prevVesselHash.current) {
        prevVesselHash.current = shipHash;
        console.log('[useRealtimeData] Updating ships:', ships.length);
        setVessels(ships);
      }

      // Update aircraft if changed
      const acHash = planes.map(a => `${a.id}:${a.lat.toFixed(2)},${a.lon.toFixed(2)}`).join('|');
      if (acHash !== prevAircraftHash.current) {
        prevAircraftHash.current = acHash;
        console.log('[useRealtimeData] Updating aircraft:', planes.length);
        setAircraft(planes);
      }

      setError(null);
      setConnectionStatus('CONNECTED');
      setLastUpdated(new Date());
      setLoading(false);
    }

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

  return { vessels, aircraft, loading, error, lastUpdated, connectionStatus };
}

export default useRealtimeData;