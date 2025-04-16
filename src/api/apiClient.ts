import axios from 'axios';

// Create a configured axios instance for API requests
const apiClient = axios.create({
  baseURL: 'http://localhost:5258/api/v1', // Backend API URL
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor to include authentication token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we receive a 401 Unauthorized or 403 Forbidden, redirect to login page
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient; 