import axios from 'axios';

// Base API URL - you can change this to your deployed backend URL
const getApiBaseUrl = () => {
  // Check if running in a browser environment
  if (typeof window !== 'undefined') {
    // Try to get from environment variable
    try {
      const envUrl = import.meta.env.VITE_API_URL;
      if (envUrl && envUrl.trim() !== '') {
        // Ensure it doesn't already end with /api to avoid double-adding
        const cleanUrl = envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
        return cleanUrl;
      }
    } catch (e) {
      // If environment variable access fails, fallback to default
      console.warn('Could not access VITE_API_URL environment variable:', e);
    }
  }
  // Fallback to a proper production URL if in production, otherwise localhost
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
    // In production, try to use the same domain as the frontend for the backend
    // Or provide a default production backend URL
    return 'https://your-backend-deployment-url.onrender.com/api'; // Replace with your actual backend URL
  } else {
    // Fallback to localhost in development
    return 'http://localhost:5000/api';
  }
};

// Create an axios instance
const api = axios.create({
  baseURL: getApiBaseUrl(),
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    try {
      // Check if we're in a browser environment where localStorage is available
      if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      // localStorage might not be available in some environments (SSR, etc.)
      console.warn('Could not access localStorage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  login: (mobile, password) => api.post('/auth/login', { mobile, password }),
  register: (name, mobile, password) => api.post('/auth/register', { name, mobile, password }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (name) => api.put('/auth/profile', { name }),
};

export const plansAPI = {
  getPlans: () => api.get('/plans'),
  getPlan: (planId) => api.get(`/plans/${planId}`),
  purchasePlan: (planId) => api.post(`/plans/purchase/${planId}`),
};

export const userAPI = {
  getDashboard: () => api.get('/user/dashboard'),
  getProfile: () => api.get('/user'),
  updateProfile: (name) => api.put('/user', { name }),
  getReferral: () => api.get('/user/referral'),
};

export const transactionAPI = {
  getUserTransactions: () => api.get('/transactions/user'),
  createRecharge: (amount, utr, payment_method = 'upi') => 
    api.post('/transactions/recharge', { amount, utr, payment_method }),
  getUserRecharges: () => api.get('/transactions/recharge'),
  createWithdrawal: (data) => api.post('/transactions/withdrawal', data),
  getUserWithdrawals: () => api.get('/transactions/withdrawal'),
  // Admin endpoints
  getAllRecharges: () => api.get('/transactions/admin/recharges'),
  getAllWithdrawals: () => api.get('/transactions/admin/withdrawals'),
  approveRecharge: (rechargeId) => api.patch(`/transactions/admin/recharges/${rechargeId}/approve`),
  rejectRecharge: (rechargeId) => api.patch(`/transactions/admin/recharges/${rechargeId}/reject`),
  approveWithdrawal: (withdrawalId) => api.patch(`/transactions/admin/withdrawals/${withdrawalId}/approve`),
  rejectWithdrawal: (withdrawalId) => api.patch(`/transactions/admin/withdrawals/${withdrawalId}/reject`),
};

export default api;