import { useEffect, useRef, useState } from 'react';

/**
 * useWebSocket – connects to the live monitoring WS endpoint and provides realtime state.
 *
 * @param {string} sessionId – live session identifier.
 * @returns {object} state: {currentScore, riskLevel, eventList, scoreHistory, isDisqualified, connectionStatus}
 */
export function useWebSocket(sessionId) {
  const [currentScore, setCurrentScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState('Low');
  const [eventList, setEventList] = useState([]); // newest on top
  const [scoreHistory, setScoreHistory] = useState([]);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // disconnected | connecting | connected

  const wsRef = useRef(null);
  const reconnectAttempts = useRef(0);

  // Helper to safely add event without duplicates
  const addEvent = (event) => {
    // dedupe by timestamp+type
    const exists = eventList.some(
      (e) => e.timestamp === event.timestamp && e.event_type === event.event_type,
    );
    if (exists) return;
    setEventList((prev) => [event, ...prev]);
    setScoreHistory((prev) => [...prev, { time: event.timestamp, score: event.cumulative_score }]);
    setCurrentScore(event.cumulative_score);
    setRiskLevel(event.risk_level);
    if (event.auto_disqualified) setIsDisqualified(true);
  };

  useEffect(() => {
    if (!sessionId) return;
    const wsUrl = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/api/live/ws/${sessionId}`;
    let ws;
    const connect = () => {
      setConnectionStatus('connecting');
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('connected');
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Ensure we have needed fields (fallback defaults)
          const normalized = {
            candidate_id: data.candidate_id ?? '',
            session_id: data.session_id ?? sessionId,
            timestamp: data.timestamp ?? new Date().toISOString(),
            event_type: data.event_type ?? 'unknown',
            event_score: data.event_score ?? 0,
            cumulative_score: data.cumulative_score ?? 0,
            risk_level: data.risk_level ?? 'Low',
            message: data.message ?? '',
            auto_disqualified: data.auto_disqualified ?? false,
          };
          addEvent(normalized);
        } catch (e) {
          console.error('WebSocket parse error', e);
        }
      };

      ws.onclose = () => {
        setConnectionStatus('disconnected');
        // exponential back‑off up to 30 seconds
        const timeout = Math.min(30000, 1000 * 2 ** reconnectAttempts.current);
        reconnectAttempts.current += 1;
        setTimeout(connect, timeout);
      };

      ws.onerror = (err) => {
        console.error('WebSocket error', err);
        ws.close();
      };
    };

    connect();
    // cleanup on unmount
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return {
    currentScore,
    riskLevel,
    eventList,
    scoreHistory,
    isDisqualified,
    connectionStatus,
  };
}
