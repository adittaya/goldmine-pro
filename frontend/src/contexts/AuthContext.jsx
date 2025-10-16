import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set up axios interceptor for auth headers
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (token) {
          // Check if API URL is available
          const apiUrl = import.meta.env.VITE_API_URL;
          if (!apiUrl || apiUrl.trim() === '') {
            console.error('VITE_API_URL is not defined or empty');
            setLoading(false);
            return;
          }
          
          const response = await axios.get(`${apiUrl}/api/auth/profile`);
          if (response.data && response.data.user) {
            setUser(response.data.user);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Don't automatically log out on error, just proceed with loading
        // The error likely indicates the user is not logged in or backend is unreachable
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [token]);

  const login = async (mobile, password) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        throw new Error('API URL is not configured');
      }
      
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        mobile,
        password
      });

      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (name, mobile, password) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        throw new Error('API URL is not configured');
      }
      
      const response = await axios.post(`${apiUrl}/api/auth/register`, {
        name,
        mobile,
        password
      });

      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    // Use window.location which doesn't require router context
    window.location.href = '/login';
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div className="loading-screen">Loading Goldmine Pro...</div>}
    </AuthContext.Provider>
  );
};