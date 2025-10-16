import axios from 'axios';
import { errorLogger } from './errorLogger';

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
      errorLogger.logError(e, 'API Base URL Config');
    }
  }
  // Fallback to a proper production URL if in production, otherwise localhost
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
    // In production, use the actual deployed backend URL
    return 'https://goldmine-pro-backend.onrender.com/api';
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
        // Add debug header if in development
        if (process.env.NODE_ENV !== 'production') {
          config.headers['X-Debug-Info'] = 'true';
        }
      }
    } catch (error) {
      // localStorage might not be available in some environments (SSR, etc.)
      console.warn('Could not access localStorage:', error);
      errorLogger.logError(error, 'API Request Interceptor');
    }
    return config;
  },
  (error) => {
    errorLogger.logError(error, 'API Request Error');
    return Promise.reject(error);
  }
);

// Add a response interceptor to catch and log API errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const requestInfo = {
      method: error.config?.method,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.config?.headers,
      timestamp: new Date().toISOString()
    };
    
    errorLogger.logError(
      error, 
      'API Response Error', 
      requestInfo
    );
    
    // Log more details in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('API Error Details:', {
        message: error.message,
        config: error.config,
        response: error.response,
        requestInfo
      });
    }
    
    return Promise.reject(error);
  }
);

// API functions with enhanced error logging
export const authAPI = {
  login: async (mobile, password) => {
    try {
      const response = await api.post('/auth/login', { mobile, password });
      return response;
    } catch (error) {
      errorLogger.logError(error, 'Auth API - Login', { mobile });
      throw error;
    }
  },
  register: async (name, mobile, password) => {
    try {
      const response = await api.post('/auth/register', { name, mobile, password });
      return response;
    } catch (error) {
      errorLogger.logError(error, 'Auth API - Register', { name, mobile });
      throw error;
    }
  },
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response;
    } catch (error) {
      errorLogger.logError(error, 'Auth API - Get Profile');
      throw error;
    }
  },
  updateProfile: async (name) => {
    try {
      const response = await api.put('/auth/profile', { name });
      return response;
    } catch (error) {
      errorLogger.logError(error, 'Auth API - Update Profile', { name });
      throw error;
    }
  },
};

export const plansAPI = {
  getPlans: async () => {
    try {
      const response = await api.get('/plans');
      return response;
    } catch (error) {
      errorLogger.logError(error, 'Plans API - Get Plans');
      throw error;
    }
  },
  getPlan: async (planId) => {
    try {
      const response = await api.get(`/plans/${planId}`);
      return response;
    } catch (error) {
      errorLogger.logError(error, 'Plans API - Get Plan', { planId });
      throw error;
    }
  },
  purchasePlan: async (planId) => {
    try {
      const response = await api.post(`/plans/purchase/${planId}`);
      return response;
    } catch (error) {
      errorLogger.logError(error, 'Plans API - Purchase Plan', { planId });
      throw error;
    }
  },
};

export const userAPI = {
  getDashboard: async () => {
    try {
      const response = await api.get('/user/dashboard');
      return response;
    } catch (error) {
      errorLogger.logError(error, 'User API - Get Dashboard');
      throw error;
    }
  },
  getProfile: async () => {
    try {
      const response = await api.get('/user');
      return response;
    } catch (error) {
      errorLogger.logError(error, 'User API - Get Profile');
      throw error;
    }
  },
  updateProfile: async (name) => {
    try {
      const response = await api.put('/user', { name });
      return response;
    } catch (error) {
      errorLogger.logError(error, 'User API - Update Profile', { name });
      throw error;
    }
  },
  getReferral: async () => {
    try {
      const response = await api.get('/user/referral');
      return response;
    } catch (error) {
      errorLogger.logError(error, 'User API - Get Referral');
      throw error;
    }
  },
};

export const transactionAPI = {
  getUserTransactions: async () => {
    try {
      const response = await api.get('/transactions/user');
      return response;
    } catch (error) {
      errorLogger.logError(error, 'Transaction API - Get User Transactions');
      throw error;
    }
  },
  createRecharge: async (amount, utr, payment_method = 'upi') => {
    try {
      const response = await api.post('/transactions/recharge', { amount, utr, payment_method });
      return response;
    } catch (error) {
      errorLogger.logError(error, 'Transaction API - Create Recharge', { amount, utr, payment_method });
      throw error;
    }
  },
  getUserRecharges: async () => {
    try {
      const response = await api.get('/transactions/recharge');
      return response;
    } catch (error) {
      errorLogger.logError(error, 'Transaction API - Get User Recharges');
      throw error;
    }
  },
  createWithdrawal: async (data) => {
    try {
      const response = await api.post('/transactions/withdrawal', data);
      return response;
    } catch (error) {
      errorLogger.logError(error, 'Transaction API - Create Withdrawal', { data });
      throw error;
    }
  },
  getUserWithdrawals: async () => {
    try {
      const response = await api.get('/transactions/withdrawal');
      return response;
    } catch (error) {
      errorLogger.logError(error, 'Transaction API - Get User Withdrawals');
      throw error;
    }
  },
  // Admin endpoints
  getAllRecharges: async () => {
    try {
      const response = await api.get('/transactions/admin/recharges');
      return response;
    } catch (error) {
      errorLogger.logError(error, 'Transaction API - Get All Recharges (Admin)');
      throw error;
    }
  },
  getAllWithdrawals: async () => {
    try {
      const response = await api.get('/transactions/admin/withdrawals');
      return response;
    } catch (error) {
      errorLogger.logError(error, 'Transaction API - Get All Withdrawals (Admin)');
      throw error;
    }
  },
  approveRecharge: async (rechargeId) => {
    try {
      const response = await api.patch(`/transactions/admin/recharges/${rechargeId}/approve`);
      return response;
    } catch (error) {
      errorLogger.logError(error, 'Transaction API - Approve Recharge (Admin)', { rechargeId });
      throw error;
    }
  },
  rejectRecharge: async (rechargeId) => {
    try {
      const response = await api.patch(`/transactions/admin/recharges/${rechargeId}/reject`);
      return response;
    } catch (error) {
      errorLogger.logError(error, 'Transaction API - Reject Recharge (Admin)', { rechargeId });
      throw error;
    }
  },
  approveWithdrawal: async (withdrawalId) => {
    try {
      const response = await api.patch(`/transactions/admin/withdrawals/${withdrawalId}/approve`);
      return response;
    } catch (error) {
      errorLogger.logError(error, 'Transaction API - Approve Withdrawal (Admin)', { withdrawalId });
      throw error;
    }
  },
  rejectWithdrawal: async (withdrawalId) => {
    try {
      const response = await api.patch(`/transactions/admin/withdrawals/${withdrawalId}/reject`);
      return response;
    } catch (error) {
      errorLogger.logError(error, 'Transaction API - Reject Withdrawal (Admin)', { withdrawalId });
      throw error;
    }
  },
};

export default api;