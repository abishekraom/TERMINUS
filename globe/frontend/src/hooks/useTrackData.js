import { useState, useEffect, useCallback } from 'react';
import { API_BASE } from '../config';

/**
 * useTrackData
 * 
 * Fetches historical path data for a specific vessel.
 */
export function useTrackData(vesselId) {
  const [track, setTrack] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrack = useCallback(async () => {
    if (!vesselId) {
      setTrack([]);
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/tracks/${encodeURIComponent(vesselId)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTrack(data.path || []);
      setError(null);
    } catch (err) {
      console.error('[useTrackData] Fetch error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [vesselId]);

  useEffect(() => {
    fetchTrack();
  }, [fetchTrack]);

  return { track, loading, error };
}
