import axios from 'axios';

<<<<<<< HEAD
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080/api';
=======
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
>>>>>>> origin/darshini-frontend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Robust health check - ensures we can reach the backend
export const getHealth = async () => {
  try {
    // Health is usually at root /health, not /api/health
    // We derive root URL from API_BASE_URL
    const rootUrl = API_BASE_URL.replace(/\/api$/, '');
    const response = await axios.get(`${rootUrl}/health`, { timeout: 5000 });
    return response.data;
  } catch (error) {
    console.warn("Backend health check failed:", error.message);
    throw error;
  }
};

// Add a response interceptor for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const getCandidates = async () => {
  try {
    const response = await api.get('/candidates/');
    console.log("DEBUG: GET /api/candidates/ SUCCESS", response.data);
    return response.data;
  } catch (error) {
    console.error("DEBUG: GET /api/candidates/ FAILED", error.message);
    throw error;
  }
};

export const createCandidate = async (data) => {
  const response = await api.post('/candidates/', data);
  return response.data;
};

export const bulkCreateCandidates = async (data) => {
  const response = await api.post('/candidates/bulk', data);
  return response.data;
};

export const getCandidateById = async (id) => {
  const response = await api.get(`/candidates/${id}`);
  return response.data;
};

export const compareCandidates = async (id1, id2) => {
  const response = await api.get(`/candidates/compare?candidate1_id=${id1}&candidate2_id=${id2}`);
  return response.data;
};

export const updateCandidateDecision = async (id, decisionData) => {
  const response = await api.patch(`/candidates/${id}/decision`, decisionData);
  return response.data;
};

export const evaluateCandidate = async (data) => {
  const response = await api.post('/evaluate/', data);
  return response.data;
};

// Live Session APIs
export const startLiveSession = async (data) => {
  const response = await api.post('/live/start', data);
  return response.data;
};

export const getActiveSessions = async () => {
  const response = await api.get('/live/active');
  return response.data;
};

export const getLiveSession = async (sessionId) => {
  const response = await api.get(`/live/${sessionId}`);
  return response.data;
};

export const logLiveEvent = async (sessionId, eventData) => {
  const response = await api.post(`/live/${sessionId}/event`, eventData);
  return response.data;
};

export const completeLiveSession = async (sessionId) => {
  const response = await api.post(`/live/${sessionId}/complete`);
  return response.data;
};

// Analytics & Notifications
export const getAnalyticsSummary = async () => {
  const response = await api.get('/analytics/summary');
  return response.data;
};

export const getNotifications = async () => {
  const response = await api.get('/notifications/');
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await api.post(`/notifications/read/${id}`);
  return response.data;
};

export const clearAllNotifications = async () => {
  const response = await api.post('/notifications/clear-all');
  return response.data;
};

// Interview APIs
export const scheduleInterview = async (data) => {
  const response = await api.post('/interviews/schedule', data);
  return response.data;
};

export const getInterviews = async () => {
  const response = await api.get('/interviews/');
  return response.data;
};

export const updateInterview = async (id, status) => {
  const response = await api.patch(`/interviews/${id}?status=${status}`);
  return response.data;
};

// Messaging APIs
export const sendMessage = async (data) => {
  const response = await api.post('/messages/send', data);
  return response.data;
};

export const getMessages = async (candidateId) => {
  const response = await api.get(`/messages/${candidateId}`);
  return response.data;
};

export const getConversations = async () => {
  const response = await api.get('/messages/conversations');
  return response.data;
};

export default api;