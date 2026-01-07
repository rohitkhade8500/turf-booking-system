import axios from 'axios';

// This is your live Backend URL
const API_URL = 'https://turf-booking-api-nnrq.onrender.com/api'; 

const api = axios.create({
  baseURL: API_URL,
});

// This helper automatically adds the token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;