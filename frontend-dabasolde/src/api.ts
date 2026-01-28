import axios from 'axios';
import type { ApiError } from './types/api.types';

const api = axios.create({
  // Use the environment variable, or fallback to localhost if missing
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const apiError: ApiError = {
        message: error.response.data?.message || 'An error occurred',
        statusCode: error.response.status,
        error: error.response.data?.error,
      };
      console.error('API Error:', apiError);
      return Promise.reject(apiError);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        statusCode: 0,
      });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject({
        message: error.message,
        statusCode: 0,
      });
    }
  },
);

export default api;
