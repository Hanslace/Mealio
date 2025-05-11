// File: src/api/axiosInstance.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://mealio--api.up.railway.app/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// List of public routes that don’t require a token
const PUBLIC_PATHS = [
  '/auth/register',
  '/auth/login',
  '/auth/forgot-password',
];

axiosInstance.interceptors.request.use(
  async (config) => {
    const url = config.url || '';

    // If this request URL matches a public path, skip token injection
    if (PUBLIC_PATHS.some(path => url.startsWith(path))) {
      return config;
    }

    // Otherwise, attach the stored token
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
