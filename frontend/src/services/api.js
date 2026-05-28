import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api');
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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
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

// Auth APIs
export const signup = async (data) => {
  const response = await api.post('/auth/signup', data);
  return response.data;
};

export const login = async (data) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Candidate Portal APIs
export const getAssessment = async (assessmentId) => {
  const response = await api.get(`/candidate/assessments/${assessmentId}`);
  return response.data;
};

export const saveAssessmentDraft = async (assessmentId, data) => {
  const response = await api.post(`/candidate/assessments/${assessmentId}/save`, data);
  return response.data;
};

export const submitAssessment = async (assessmentId, data) => {
  const response = await api.post(`/candidate/assessments/${assessmentId}/submit`, data);
  return response.data;
};
export const getCandidateDashboard = async () => {
  const response = await api.get('/candidate/me/dashboard');
  return response.data;
};

export const submitCandidateAssessment = async (data) => {
  const response = await api.post('/candidate/me/submit', data);
  return response.data;
};

export const uploadResumeSkills = async (data) => {
  const response = await api.post('/candidate/me/resume', data);
  return response.data;
};

export const getTasksForRole = async (role) => {
  // Ensure role does not contain '/' which FastAPI treats as path separator
  const sanitizedRole = role.replace(/\//g, '-');
  const response = await api.get(`/tasks/${encodeURIComponent(sanitizedRole)}`);
  return response.data;
};

export const getAllTasks = async () => {
  const response = await api.get('/tasks/');
  return response.data;
};

export const getCandidateAssessments = async () => {
  const response = await api.get('/candidate/assessments/');
  return response.data;
};

export const assignTaskToCandidate = async (candidateId, data) => {
  const response = await api.post(`/candidates/${candidateId}/assign-task`, data);
  return response.data;
};

export const generateAiTask = async (data) => {
  const response = await api.post('/tasks/generate-ai', data);
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

export const scheduleInterview = async (data) => {
  const response = await api.post('/interviews/schedule', data);
  return response.data;
};

export const getInterviews = async () => {
  const response = await api.get('/interviews/');
  return response.data;
};

export const updateInterview = async (id, status) => {
  const response = await api.patch(
    `/interviews/${id}?status=${status}`
  );

  return response.data;
};

export const getCandidateInterviews = async (candidateId) => {
  const response = await api.get(`/interviews/${candidateId}`);
  return response.data;
};

// Interview APIs


// Messaging APIs
export const sendMessage = async (data) => {
  const response = await api.post('/messages/send', data);
  return response.data;
};

export const getMessages = async (candidateId, recruiterId = null) => {
  const url = recruiterId ? `/messages/${candidateId}?recruiter_id=${recruiterId}` : `/messages/${candidateId}`;
  const response = await api.get(url);
  return response.data;
};

export const getConversations = async () => {
  const response = await api.get('/messages/conversations');
  return response.data;
};

export const getCandidateConversations = async (candidateId) => {
  const response = await api.get(`/messages/candidate/${candidateId}/conversations`);
  return response.data;
};

export const getRecruiters = async () => {
  const response = await api.get('/messages/recruiters');
  return response.data;
};

export default api;
