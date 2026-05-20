import { useState, useEffect, useCallback } from 'react';
import { getCandidates } from '../services/api';

/**
 * useCandidates hook - Centralized data fetching for the ATS.
 * Ensures consistent filtering and state across all pages.
 */
export default function useCandidates(filterStatus = 'All') {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`[useCandidates] Fetching from GET /api/candidates/`);
      const data = await getCandidates();
      
      if (!Array.isArray(data)) {
        console.error("[useCandidates] API returned non-array data:", data);
        setCandidates([]);
        return;
      }

      console.log(`[useCandidates] Successfully loaded ${data.length} candidates.`);
      setCandidates(data);
    } catch (err) {
      console.error("[useCandidates] Fetch Error:", err);
      setError(err.message || "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredCandidates = (candidates || []).filter(c => {
    if (filterStatus === 'All') return true;
    return c.status === filterStatus;
  });

  return {
    candidates,
    filteredCandidates,
    loading,
    error,
    refresh: fetchData
  };
}
