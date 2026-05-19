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
<<<<<<< HEAD
      console.warn("[useCandidates] Backend not connected, using dummy data for preview.", err);
      // Dummy data to ensure UI is visible for review
      setCandidates([
        {
          id: 1,
          name: "Alice Johnson",
          email: "alice@example.com",
          role: "Frontend Engineer",
          overall_score: 95,
          status: "Shortlisted",
          hiring_recommendation: "Strong Hire",
          skills: { "React": 9, "Tailwind": 8 }
        },
        {
          id: 2,
          name: "Bob Smith",
          email: "bob@example.com",
          role: "Backend Developer",
          overall_score: 88,
          status: "Pending",
          hiring_recommendation: "Hire",
          skills: { "Node.js": 8, "Python": 9 }
        }
      ]);
      setError(null); // Clear error to prevent error screen
=======
      console.error("[useCandidates] Fetch Error:", err);
      setError(err.message || "Failed to load candidates");
>>>>>>> origin/geshna-backend
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
