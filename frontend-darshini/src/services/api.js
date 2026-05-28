import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api').replace(/\/$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getStoredToken = () => {
  const directToken =
    localStorage.getItem('access_token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('token');

  if (directToken) return directToken;

  try {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    return storedUser.access_token || storedUser.token || null;
  } catch {
    return null;
  }
};

const getFullRequestUrl = (config = {}) => {
  if (!config.url) return config.baseURL || API_BASE_URL;
  if (/^https?:\/\//i.test(config.url)) return config.url;
  return `${(config.baseURL || API_BASE_URL).replace(/\/$/, '')}/${config.url.replace(/^\//, '')}`;
};

const getLoopbackFallbackBaseUrl = (baseUrl = API_BASE_URL) => {
  if (baseUrl.includes('://localhost')) {
    return baseUrl.replace('://localhost', '://127.0.0.1');
  }
  if (baseUrl.includes('://127.0.0.1')) {
    return baseUrl.replace('://127.0.0.1', '://localhost');
  }
  return null;
};

export const getApiErrorMessage = (error, fallback = 'Failed to load dashboard data') => {
  if (error?.response) {
    const detail = error.response.data?.detail || error.response.data?.message || error.response.statusText;
    return `${fallback}: ${error.response.status} ${detail}`;
  }

  const requestUrl = getFullRequestUrl(error?.config);
  if (error?.code === 'ECONNABORTED') {
    return `${fallback}: request timed out while contacting ${requestUrl}`;
  }

  if (error?.request) {
    return `${fallback}: could not reach backend at ${requestUrl}. Confirm FastAPI is running and CORS allows this frontend origin.`;
  }

  return `${fallback}: ${error?.message || 'Unknown error'}`;
};

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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
  async (error) => {
    const fallbackBaseUrl = getLoopbackFallbackBaseUrl(error.config?.baseURL);
    if (
      error.code === 'ERR_NETWORK' &&
      fallbackBaseUrl &&
      !error.config?._retriedWithLoopbackFallback
    ) {
      const retryConfig = {
        ...error.config,
        baseURL: fallbackBaseUrl,
        _retriedWithLoopbackFallback: true,
      };
      return api.request(retryConfig);
    }

    console.error('API Error:', {
      url: getFullRequestUrl(error.config),
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: getApiErrorMessage(error)
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
