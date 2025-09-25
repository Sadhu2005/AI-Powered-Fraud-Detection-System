import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.response?.status === 404) {
      throw new Error('Service not found. Please check your connection.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
);

// API functions
export const predictSMS = async (data) => {
  return api.post('/predict/sms', data);
};

export const predictURL = async (data) => {
  return api.post('/predict/url', data);
};

export const predictTransaction = async (data) => {
  return api.post('/predict/transaction', data);
};

export const predictWebsite = async (data) => {
  return api.post('/predict/website', data);
};

export const getHealthStatus = async () => {
  return api.get('/health');
};

export const getBlockchainStatus = async () => {
  return api.get('/blockchain/status');
};

export const verifyPrediction = async (hash) => {
  return api.post('/blockchain/verify', { hash });
};

export const reportFraud = async (data) => {
  return api.post('/blockchain/report', data);
};

export const getFraudRegistry = async (limit = 100, offset = 0) => {
  return api.get(`/blockchain/registry?limit=${limit}&offset=${offset}`);
};

export const getBlockchainStats = async () => {
  return api.get('/blockchain/stats');
};

export default api;
