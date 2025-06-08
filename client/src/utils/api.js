// client/src/utils/api.js
import axios from 'axios';

// Get the token from localStorage
const token = localStorage.getItem('token');

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to set the Authorization header
apiClient.interceptors.request.use(
  config => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Set the Authorization header with the Bearer token
      config.headers.Authorization = `Bearer ${storedToken}`;
    }
    
    // For FormData requests, don't set Content-Type manually
    if (config.isFormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default apiClient;