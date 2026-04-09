import { useState, useEffect, useRef, useMemo } from 'react';
import { WS_URL } from '../config';

/**
 * useBackendData
 * 
 * Fetches vessel data via WebSocket from the VDIE backend.
 * Implements Deep Merge for vessel updates (delta patches) to ensure
 * coordinates are never lost.
 */
export function useBackendData() {
  const [rawVesselsMap, setRawVesselsMap] = useState(() => new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('CONNECTING');

  useEffect(() => {
    console.log('[useBackendData] Connecting to WebSocket:', WS_URL);
    let ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('[useBackendData] WS Connected');
      setConnectionStatus('CONNECTED');
      setError(null);
      // Subscribe to all vessels
      ws.send(JSON.stringify({ subscribe: 'ALL' }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'VESSEL_UPDATES' && Array.isArray(message.data)) {
          const data = message.data;
          
          setRawVesselsMap(prev => {
            const updated = new Map(prev);
            data.forEach(v => {
              const vesselId = v.vesselId || v.mmsi || v.icao24;
              if (!vesselId) return;

              const existing = updated.get(vesselId) || {};
              
              // Deep merge top-level objects (position, motion, operationalStatus)
              // Since the delta only includes changed keys, we must merge them
              // carefully so we don't overwrite the nested objects completely.
              const merged = { ...existing, ...v };
              
              // If v has position, merge it with existing position
              if (v.position && existing.position) {
                merged.position = { ...existing.position, ...v.position };
              }
              // If v has motion, merge it
              if (v.motion && existing.motion) {
                merged.motion = { ...existing.motion, ...v.motion };
              }
              // If v has operationalStatus, merge it
              if (v.operationalStatus && existing.operationalStatus) {
                merged.operationalStatus = { ...existing.operationalStatus, ...v.operationalStatus };
              }

              updated.set(vesselId, merged);
            });
            return updated;
          });
          
          setLastUpdated(new Date());
          setLoading(false);
        }
      } catch (err) {
        console.error('[useBackendData] Message parse error:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('[useBackendData] WS Error');
      setConnectionStatus('ERROR');
      setError('WebSocket connection error');
    };

    ws.onclose = () => {
      console.log('[useBackendData] WS Disconnected');
      setConnectionStatus('DISCONNECTED');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  // Compute arrays for rendering from the merged map
  const { vessels, aircraft } = useMemo(() => {
    const vList = [];
    const aList = [];

    rawVesselsMap.forEach((v) => {
      const pos = v.position;
      const mot = v.motion;
      const opStat = v.operationalStatus;
      
      const lat = pos?.lat;
      const lon = pos?.lon;
      
      if (lat == null || lon == null || isNaN(lat) || isNaN(lon)) return;
      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return;
      
      const rawType = (v.vesselType || '').toLowerCase();
      const type = rawType.includes('aircraft') || rawType.includes('passenger') ? 'aircraft' : 'ship';
      
      const entity = {
        id: v.vesselId || v.mmsi || v.icao24 || 'UNKNOWN',
        lat: Number(lat),
        lon: Number(lon),
        heading: Number(mot?.cogDegrees ?? mot?.headingDegrees ?? 0),
        speed: Number(mot?.sogKnots ?? 0),
        type,
        status: opStat?.navStatusLabel || 'ACTIVE',
        name: v.name || v.vesselId || 'UNNAMED',
        source: v.source || 'API',
      };
      
      if (type === 'aircraft') {
        aList.push(entity);
      } else {
        vList.push(entity);
      }
    });

    return { vessels: vList, aircraft: aList };
  }, [rawVesselsMap]);

  return { vessels, aircraft, loading, error, lastUpdated, connectionStatus };
}

export default useBackendData;