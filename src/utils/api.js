import axios from 'axios';
import { logout } from '../redux/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'https://take-home-test-api.nutech-integrasi.com';

const api = axios.create({
  baseURL: API_URL,
});

// request untuk menambahkan bearer token ke setiap permintaan API
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response untuk menangani error 401 (Unauthorized)
export const setupInterceptors = (store) => {
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        // Hapus token dan alihkan ke halaman login
        store.dispatch(logout());
        // Catatan: Pengalihan akan ditangani oleh ProtectedRoute atau komponen App
        // karena state token di auth akan menjadi null.
      }
      return Promise.reject(error);
    }
  );
};

export default api;
