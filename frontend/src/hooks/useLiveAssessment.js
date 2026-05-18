import { useState, useEffect, useRef } from 'react';
import { getLiveSession, logLiveEvent } from '../services/api';

export default function useLiveAssessment(sessionId, isRecruiter = false) {
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState(null);
  const pollingInterval = useRef(null);

  const fetchSession = async () => {
    if (!sessionId) return;
    try {
      const data = await getLiveSession(sessionId);
      setSessionData(data);
    } catch (err) {
      console.error("Failed to fetch live session", err);
      setError("Failed to fetch live session.");
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchSession();

    // Setup polling (every 2 seconds)
    // In the future, replace this interval with WebSockets (e.g., socket.on('update'))
    pollingInterval.current = setInterval(() => {
      fetchSession();
    }, 2000);

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [sessionId]);

  const logEvent = async (type, message, severity = 'info') => {
    if (isRecruiter) return; // Recruiters don't log events
    try {
      await logLiveEvent(sessionId, { type, message, severity });
      // Optimistic local update (or let polling catch it)
      fetchSession();
    } catch (err) {
      console.error("Failed to log event", err);
    }
  };

  return { sessionData, error, logEvent };
}
