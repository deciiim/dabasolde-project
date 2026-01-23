import axios from 'axios';

const api = axios.create({
  // Use the environment variable, or fallback to localhost if missing
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', 
});

export default api;