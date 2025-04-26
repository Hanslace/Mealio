// src/api/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://YOUR_IP:PORT/api',   // Base URL of backend
  timeout: 10000,                      // 10-second request timeout
  headers: { 'Content-Type': 'application/json' }
});

export default axiosInstance;
