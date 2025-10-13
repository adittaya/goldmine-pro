import axios from 'axios';

// Base API URL - you can change this to your deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the token in all requests
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