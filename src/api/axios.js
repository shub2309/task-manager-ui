import axios from 'axios';

const rawURL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');
const baseURL = rawURL.endsWith('/api') ? rawURL : `${rawURL}/api`;

console.log('Final API URL:', baseURL);
const api = axios.create({
  baseURL: baseURL, // Prevent double /api if user added it
  withCredentials: false,
  headers: {
    'Accept': 'application/json',
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
