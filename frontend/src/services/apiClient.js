import axios from 'axios';

// The backend Laravel API operates on http://localhost:8000/api/v1/
// In development with Vite proxy, use relative path
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: Inject Sanctum Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jeevan_roshini_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Interception & Session Expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry Logic: Attempt 3 retries for transient network drops (except 4xx validation errors)
    if (error.code === 'ECONNABORTED' || error.message.includes('Network Error')) {
      originalRequest._retryCount = originalRequest._retryCount || 0;
      if (originalRequest._retryCount < 3) {
        originalRequest._retryCount += 1;
        const delay = Math.pow(2, originalRequest._retryCount) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return apiClient(originalRequest);
      }
    }

    // 401 Unauthorized: Clear stale credentials and force login redirection
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('jeevan_roshini_token');
      localStorage.removeItem('jeevan_roshini_user');
      // If we are in the browser, trigger state resets by dispatching a custom logout event
      window.dispatchEvent(new Event('auth:logout'));
    }

    return Promise.reject(error);
  }
);

// CRUD Wrappers
export const api = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
};

export default apiClient;
