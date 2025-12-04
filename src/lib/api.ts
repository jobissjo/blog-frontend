import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

if (!API_BASE_URL && process.env.NODE_ENV === 'development') {
  console.warn('NEXT_PUBLIC_API_BASE_URL is not defined. API requests will fail.');
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Inject visitor_id for specific endpoints
    const visitorId = localStorage.getItem('visitor_id');
    if (visitorId) {
      const url = config.url || '';
      const method = config.method?.toLowerCase();

      // Check if the request matches the criteria for adding visitor_id
      const isBlogDetail = method === 'get' && url.match(/api\/blog\/[^/]+$/);
      const isLike = method === 'post' && url.match(/api\/blog\/[^/]+\/like$/);
      const isComment = method === 'post' && url.match(/api\/blog\/[^/]+\/comments$/);

      if (isBlogDetail || isLike || isComment) {
        config.params = { ...config.params, visitor_id: visitorId };
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if we're on an admin page
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
