import axios from 'axios';

// Helper to extract cookies from client document
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return '';
};

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for securing HTTPOnly cookies authentication
});

// Request interceptor to dynamically inject the CSRF token on status-changing events
client.interceptors.request.use(
  (config) => {
    const method = config.method ? config.method.toLowerCase() : '';
    if (['post', 'put', 'delete', 'patch'].includes(method)) {
      const csrfToken = getCookie('csrf_token');
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Handle token validation failures
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we receive a 401 and are currently inside an admin route, we might want to let the App redirect to login
    return Promise.reject(error);
  }
);

export default client;
