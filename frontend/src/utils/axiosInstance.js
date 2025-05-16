import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001'
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  console.log('Token sendo enviado:', token); // Debug
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor - versão simplificada sem refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      sessionStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;