import { useState, useEffect, useCallback } from 'react';
import { TIE_API_BASE } from '../config';

/**
 * useThreatsData
 * 
 * Fetches tactical threat zones from the backend /threats/active endpoint.
 */
export function useThreatsData(enabled = true) {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchThreats = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      const res = await fetch(`${TIE_API_BASE}/threats/active`, {
        headers: {
          'x-api-key': import.meta.env.VITE_TIE_API_KEY || 'default-dev-key'
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setThreats(data.threats || []);
      setError(null);
    } catch (err) {
      console.error('[useThreatsData] Fetch error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchThreats();
    // Poll threats less frequently than vessels
    const interval = setInterval(fetchThreats, 30000);
    return () => clearInterval(interval);
  }, [fetchThreats]);

  return { threats, loading, error, refetch: fetchThreats };
}
