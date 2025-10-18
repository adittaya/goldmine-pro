import React, { useState, useEffect, useRef } from 'react';
import './index.css';

// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const timeoutFetch = (url, options = {}, timeout = 15000) => {  // Increased timeout to 15 seconds for deployed environments
  // Ensure credentials are included in all requests
  const fetchOptions = {
    ...options,
    credentials: 'include',  // Include credentials (cookies, etc.) in requests
    headers: {
      'Content-Type': 'application/json',
      ...options.headers  // Allow overriding default headers if needed
    }
  };
  return Promise.race([
    fetch(url, fetchOptions),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout. Please check your connection and try again.')), timeout)
    )
  ]);
};

const api = {
  // Authentication
  login: async (mobile, password) => {
    try {
      const response = await timeoutFetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError' || error.message.includes('timeout')) {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    }
  },

  register: async (name, mobile, password) => {
    try {
      const response = await timeoutFetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, mobile, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError' || error.message.includes('timeout')) {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    }
  },

  // User endpoints
  getProfile: async (token) => {
    try {
      const response = await timeoutFetch(`${API_BASE_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError' || error.message.includes('timeout')) {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    }
  },

  getDashboard: async (token) => {
    try {
      const response = await timeoutFetch(`${API_BASE_URL}/user/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError' || error.message.includes('timeout')) {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    }
  },

  getReferral: async (token) => {
    try {
      const response = await timeoutFetch(`${API_BASE_URL}/user/referral`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError' || error.message.includes('timeout')) {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    }
  },

  // Plans
  getPlans: async () => {
    try {
      const response = await timeoutFetch(`${API_BASE_URL}/plans`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError' || error.message.includes('timeout')) {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    }
  },

  purchasePlan: async (planId, token) => {
    try {
      const response = await timeoutFetch(`${API_BASE_URL}/plans/purchase/${planId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError' || error.message.includes('timeout')) {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    }
  },

  // Transactions
  getTransactions: async (token) => {
    try {
      const response = await timeoutFetch(`${API_BASE_URL}/transactions/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError' || error.message.includes('timeout')) {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    }
  },

  // Recharge
  createRecharge: async (amount, utr, token) => {
    try {
      const response = await timeoutFetch(`${API_BASE_URL}/transactions/recharge`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, utr }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError' || error.message.includes('timeout')) {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    }
  },

  // Withdrawal
  createWithdrawal: async (data, token) => {
    try {
      const response = await timeoutFetch(`${API_BASE_URL}/transactions/withdrawal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError' || error.message.includes('timeout')) {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    }
  },
};

const App = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('/');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authToken, setAuthToken] = useState('');

  // Check for existing session
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setAuthToken(token);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Cache for API responses
  const apiCache = useRef(new Map());
  
  // Function to get cached data or fetch new data
  const getCachedOrFetch = async (key, fetchFn, cacheTime = 300000) => { // 5 minutes default
    const cached = apiCache.current.get(key);
    
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      return cached.data;
    }
    
    const data = await fetchFn();
    apiCache.current.set(key, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  };

  // Loading Spinner Component
  const LoadingSpinner = ({ message = 'Loading...' }) => {
    return React.createElement(
      'div',
      { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' } },
      React.createElement('div', { 
        className: 'loading-spinner-large',
        style: { marginBottom: 'var(--spacing-md)' }
      }),
      React.createElement('div', { style: { fontSize: '1rem', color: 'var(--gray)' } }, message)
    );
  };

  const handleLogin = async (mobile, password) => {
    setLoading(true);
    setError('');
    try {
      const result = await api.login(mobile, password);
      setLoading(false);
      
      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        setAuthToken(result.token);
        setUser(result.user);
        setCurrentPage('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setLoading(false);
      setError('Network error. Please try again.');
    }
  };

  const handleRegister = async (name, mobile, password) => {
    setLoading(true);
    setError('');
    try {
      const result = await api.register(name, mobile, password);
      setLoading(false);
      
      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        setAuthToken(result.token);
        setUser(result.user);
        setCurrentPage('/dashboard');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setLoading(false);
      setError('Network error. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken('');
    setUser(null);
    setCurrentPage('/');
  };

  const renderPage = () => {
    if (!user) {
      if (currentPage === '/register') {
        return React.createElement(RegisterPage, { onRegister: handleRegister, onBack: () => setCurrentPage('/'), loading, error });
      }
      return React.createElement(LoginPage, { onLogin: handleLogin, onNavigateToRegister: () => setCurrentPage('/register'), loading, error });
    }

    switch (currentPage) {
      case '/dashboard':
        return React.createElement(DashboardPage, { user, authToken, onLogout: handleLogout, onNavigate: setCurrentPage });
      case '/plans':
        return React.createElement(PlansPage, { user, authToken, onLogout: handleLogout, onNavigate: setCurrentPage });
      case '/profile':
        return React.createElement(ProfilePage, { user, authToken, onLogout: handleLogout, onNavigate: setCurrentPage });
      case '/recharge':
        return React.createElement(RechargePage, { user, authToken, onLogout: handleLogout, onNavigate: setCurrentPage });
      case '/withdrawal':
        return React.createElement(WithdrawalPage, { user, authToken, onLogout: handleLogout, onNavigate: setCurrentPage });
      case '/transactions':
        return React.createElement(TransactionsPage, { user, authToken, onLogout: handleLogout, onNavigate: setCurrentPage });
      case '/admin':
        return React.createElement(AdminPage, { authToken, onNavigate: setCurrentPage });
      default:
        return React.createElement(DashboardPage, { user, authToken, onLogout: handleLogout, onNavigate: setCurrentPage });
    }
  };

  return React.createElement(
    'div',
    { className: 'app' },
    renderPage(),
    user && React.createElement(BottomNavigation, { currentPage, onNavigate: setCurrentPage })
  );
};

const LoginPage = ({ onLogin, onNavigateToRegister, loading, error }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(mobile, password);
  };

  return React.createElement(
    'div',
    { className: 'container' },
    React.createElement('div', { className: 'header' },
      React.createElement('h1', { style: { color: 'white', margin: 0 } }, 'Goldmine Pro')
    ),
    React.createElement('div', { style: { padding: 'var(--spacing-xl) 0', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
      React.createElement('h2', { style: { marginBottom: 'var(--spacing-lg)', textAlign: 'center' } }, 'Welcome Back'),
      
      error && React.createElement('div', { 
        style: { 
          backgroundColor: '#fee2e2', 
          color: '#dc2626', 
          padding: 'var(--spacing-md)', 
          borderRadius: 'var(--border-radius)', 
          marginBottom: 'var(--spacing-md)',
          width: '100%'
        } 
      },
        React.createElement('p', { style: { margin: 0 } }, error)
      ),
      
      React.createElement('form', { onSubmit: handleSubmit, style: { width: '100%', maxWidth: '400px' } },
        React.createElement('div', { style: { marginBottom: 'var(--spacing-md)' } },
          React.createElement('label', { htmlFor: 'mobile', style: { display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' } }, 'Mobile Number'),
          React.createElement('input', {
            id: 'mobile',
            type: 'tel',
            value: mobile,
            onChange: (e) => setMobile(e.target.value),
            placeholder: 'Enter your mobile number',
            required: true,
            style: { 
              width: '100%', 
              padding: 'var(--spacing-sm)', 
              border: '1px solid var(--light-gray)', 
              borderRadius: 'var(--border-radius)',
              fontSize: '1rem'
            }
          })
        ),
        
        React.createElement('div', { style: { marginBottom: 'var(--spacing-md)' } },
          React.createElement('label', { htmlFor: 'password', style: { display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' } }, 'Password'),
          React.createElement('input', {
            id: 'password',
            type: 'password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            placeholder: 'Enter your password',
            required: true,
            style: { 
              width: '100%', 
              padding: 'var(--spacing-sm)', 
              border: '1px solid var(--light-gray)', 
              borderRadius: 'var(--border-radius)',
              fontSize: '1rem'
            }
          })
        ),
        
        React.createElement('button', {
          type: 'submit',
          className: 'btn btn-primary',
          style: { width: '100%', marginBottom: 'var(--spacing-md)' },
          disabled: loading
        },
          loading ? 'Signing in...' : 'Sign In'
        )
      ),
      
      React.createElement('div', { style: { textAlign: 'center' } },
        React.createElement('p', { style: { color: 'var(--gray)' } }, "Don't have an account?"),
        React.createElement('button', {
          type: 'button',
          className: 'btn btn-secondary',
          onClick: onNavigateToRegister,
          style: { marginTop: 'var(--spacing-sm)' }
        }, "Create Account")
      )
    )
  );
};

const RegisterPage = ({ onRegister, onBack, loading, error }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(name, mobile, password);
  };

  return React.createElement(
    'div',
    { className: 'container' },
    React.createElement('div', { className: 'header' },
      React.createElement('h1', { style: { color: 'white', margin: 0 } }, 'Goldmine Pro')
    ),
    React.createElement('div', { style: { padding: 'var(--spacing-xl) 0', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
      React.createElement('h2', { style: { marginBottom: 'var(--spacing-lg)', textAlign: 'center' } }, 'Create Account'),
      
      error && React.createElement('div', { 
        style: { 
          backgroundColor: '#fee2e2', 
          color: '#dc2626', 
          padding: 'var(--spacing-md)', 
          borderRadius: 'var(--border-radius)', 
          marginBottom: 'var(--spacing-md)',
          width: '100%'
        } 
      },
        React.createElement('p', { style: { margin: 0 } }, error)
      ),
      
      React.createElement('form', { onSubmit: handleSubmit, style: { width: '100%', maxWidth: '400px' } },
        React.createElement('div', { style: { marginBottom: 'var(--spacing-md)' } },
          React.createElement('label', { htmlFor: 'name', style: { display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' } }, 'Full Name'),
          React.createElement('input', {
            id: 'name',
            type: 'text',
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: 'Enter your full name',
            required: true,
            style: { 
              width: '100%', 
              padding: 'var(--spacing-sm)', 
              border: '1px solid var(--light-gray)', 
              borderRadius: 'var(--border-radius)',
              fontSize: '1rem'
            }
          })
        ),
        
        React.createElement('div', { style: { marginBottom: 'var(--spacing-md)' } },
          React.createElement('label', { htmlFor: 'mobile', style: { display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' } }, 'Mobile Number'),
          React.createElement('input', {
            id: 'mobile',
            type: 'tel',
            value: mobile,
            onChange: (e) => setMobile(e.target.value),
            placeholder: 'Enter your mobile number',
            required: true,
            style: { 
              width: '100%', 
              padding: 'var(--spacing-sm)', 
              border: '1px solid var(--light-gray)', 
              borderRadius: 'var(--border-radius)',
              fontSize: '1rem'
            }
          })
        ),
        
        React.createElement('div', { style: { marginBottom: 'var(--spacing-md)' } },
          React.createElement('label', { htmlFor: 'password', style: { display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' } }, 'Password'),
          React.createElement('input', {
            id: 'password',
            type: 'password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            placeholder: 'Enter your password',
            required: true,
            style: { 
              width: '100%', 
              padding: 'var(--spacing-sm)', 
              border: '1px solid var(--light-gray)', 
              borderRadius: 'var(--border-radius)',
              fontSize: '1rem'
            }
          })
        ),
        
        React.createElement('button', {
          type: 'submit',
          className: 'btn btn-primary',
          style: { width: '100%', marginBottom: 'var(--spacing-md)' },
          disabled: loading
        },
          loading ? 'Creating Account...' : 'Create Account'
        )
      ),
      
      React.createElement('button', {
        type: 'button',
        className: 'btn btn-secondary',
        onClick: onBack,
        style: { width: '100%' }
      }, "Back to Login")
    )
  );
};

const DashboardPage = ({ user, authToken, onLogout, onNavigate }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false); // Don't show loading initially

  useEffect(() => {
    // Only fetch dashboard data when needed, not on every render
    if (!dashboardData) {
      const fetchDashboardData = async () => {
        setLoading(true);
        try {
          const result = await api.getDashboard(authToken);
          setDashboardData(result);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          console.error('Error fetching dashboard:', err);
        }
      };
      fetchDashboardData();
    }
  }, [authToken, dashboardData]);

  const copyReferralLink = async () => {
    try {
      const result = await api.getReferral(authToken);
      navigator.clipboard.writeText(result.referralLink);
      alert('Referral link copied to clipboard!');
    } catch (err) {
      alert('Failed to get referral link');
    }
  };

  if (loading) {
    return React.createElement(
      'div',
      { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' } },
      React.createElement('div', { style: { fontSize: '1.5rem' } }, 'Loading...')
    );
  }

  const statCards = [
    { title: 'Wallet Balance', value: `₹${dashboardData?.user?.balance?.toFixed(2) || user.balance?.toFixed(2) || '0.00'}`, color: 'var(--primary)' },
    { title: 'Total Invested', value: `₹${dashboardData?.user?.total_invested?.toFixed(2) || '0.00'}`, color: 'var(--secondary)' },
    { title: 'Total Withdrawn', value: `₹${dashboardData?.user?.total_withdrawn?.toFixed(2) || '0.00'}`, color: 'var(--success)' }
  ];

  return React.createElement(
    'div',
    null,
    React.createElement('div', { className: 'header' },
      React.createElement('h1', { style: { color: 'white', margin: 0 } }, 'Dashboard'),
      React.createElement('button', { onClick: onLogout, className: 'btn btn-secondary', style: { color: 'white' } }, 'Logout')
    ),
    
    React.createElement('div', { className: 'container', style: { padding: 'var(--spacing-lg) 0' } },
      // Stats Grid
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' } },
        statCards.map((stat, index) => 
          React.createElement('div', { key: index, className: 'stat-card' },
            React.createElement('div', { style: { fontSize: '2rem', fontWeight: 'bold', marginBottom: 'var(--spacing-xs)' } }, stat.value),
            React.createElement('div', { style: { fontSize: '0.875rem', opacity: 0.9 } }, stat.title)
          )
        )
      ),

      // Quick Actions
      React.createElement('div', { style: { marginBottom: 'var(--spacing-lg)' } },
        React.createElement('h3', { style: { marginBottom: 'var(--spacing-md)' } }, 'Quick Actions'),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' } },
          React.createElement('button', {
            className: 'btn btn-primary',
            onClick: () => onNavigate('/plans'),
            style: { marginBottom: 'var(--spacing-md)' }
          }, "Invest Now"),
          React.createElement('button', {
            className: 'btn btn-secondary',
            onClick: copyReferralLink,
            style: { marginBottom: 'var(--spacing-md)' }
          }, "Refer & Earn")
        )
      ),

      // Active Plans
      dashboardData?.activePlans && dashboardData.activePlans.length > 0 && React.createElement('div', { style: { marginBottom: 'var(--spacing-lg)' } },
        React.createElement('h3', { style: { marginBottom: 'var(--spacing-md)' } }, 'Active Plans'),
        (dashboardData.activePlans || []).map(plan => 
          React.createElement('div', { key: plan?.id || Math.random(), className: 'card', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            React.createElement('div', null,
              React.createElement('div', { style: { fontWeight: 'bold' } }, plan?.plan_name || 'Unknown Plan'),
              React.createElement('div', { style: { fontSize: '0.875rem', color: 'var(--gray)' } }, `Daily: ₹${plan?.daily_income || '0'} | Ends: ${plan?.end_date ? new Date(plan.end_date).toLocaleDateString() : 'N/A'}`)
            ),
            React.createElement('span', { style: { color: 'var(--success)', fontWeight: 'bold' } }, 'Active')
          )
        )
      ),

      // Recent Transactions
      dashboardData?.transactions && dashboardData.transactions.length > 0 && React.createElement('div', { className: 'card' },
        React.createElement('h3', { style: { marginBottom: 'var(--spacing-md)' } }, 'Recent Transactions'),
        (dashboardData.transactions || []).slice(0, 5).map(transaction => 
          React.createElement('div', { 
            key: transaction?.id || Math.random(), 
            style: { 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: 'var(--spacing-sm) 0', 
              borderBottom: '1px solid var(--light-gray)' 
            } 
          },
            React.createElement('span', null, transaction?.description || 'Transaction'),
            React.createElement('span', { 
              style: { 
                fontWeight: 'bold',
                color: ['daily_income', 'recharge'].includes(transaction?.type) ? 'var(--success)' : 'var(--danger)' 
              } 
            }, 
              ['daily_income', 'recharge'].includes(transaction?.type) ? `+₹${transaction?.amount || 0}` : `-₹${transaction?.amount || 0}`
            )
          )
        )
      )
    )
  );
};

const PlansPage = ({ user, authToken, onLogout, onNavigate }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const result = await api.getPlans();
        setPlans(result.plans || result || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error('Error fetching plans:', err);
        alert('Failed to load investment plans. Please try again later.');
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (planId) => {
    if (!planId) {
      alert('Invalid plan selected');
      return;
    }
    
    if (!window.confirm('Are you sure you want to subscribe to this plan?')) {
      return;
    }
    
    try {
      setLoading(true);
      const result = await api.purchasePlan(planId, authToken);
      setLoading(false);
      if (result.message) {
        alert(result.message);
        // Optionally navigate back to dashboard after successful purchase
        onNavigate('/dashboard');
      }
    } catch (err) {
      setLoading(false);
      alert(err.message || 'Failed to purchase plan');
    }
  };

  if (loading && plans.length === 0) {
    return React.createElement(
      'div', { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' } },
      React.createElement('div', { style: { fontSize: '1.5rem' } }, 'Loading Plans...')
    );
  }

  return React.createElement(
    'div',
    null,
    React.createElement('div', { className: 'header' },
      React.createElement('h1', { style: { color: 'white', margin: 0 } }, 'Investment Plans'),
      React.createElement('button', { onClick: onLogout, className: 'btn btn-secondary', style: { color: 'white' } }, 'Logout')
    ),
    
    React.createElement('div', { className: 'container', style: { padding: 'var(--spacing-lg) 0' } },
      React.createElement('h2', { style: { marginBottom: 'var(--spacing-lg)', textAlign: 'center' } }, 'Choose Your Plan'),
      
      plans.length > 0 
        ? React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-md)' } },
            plans.map(plan => 
              React.createElement('div', { key: plan?.id || Math.random(), className: 'card' },
                React.createElement('h3', { style: { marginBottom: 'var(--spacing-sm)' } }, plan?.name || 'Plan'),
                React.createElement('div', { style: { fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: 'var(--spacing-md)' } }, `₹${plan?.price || '0'}`),
                
                React.createElement('div', { style: { marginBottom: 'var(--spacing-sm)' } },
                  React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between' } },
                    React.createElement('span', null, 'Daily Income:'),
                    React.createElement('span', { style: { fontWeight: 'bold', color: 'var(--success)' } }, `₹${plan?.daily_income || '0'}`)
                  )
                ),
                
                React.createElement('div', { style: { marginBottom: 'var(--spacing-sm)' } },
                  React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between' } },
                    React.createElement('span', null, 'Duration:'),
                    React.createElement('span', { style: { fontWeight: 'bold' } }, `${plan?.duration_days || '0'} days`)
                  )
                ),
                
                React.createElement('div', { style: { marginBottom: 'var(--spacing-md)' } },
                  React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between' } },
                    React.createElement('span', null, 'Total Return:'),
                    React.createElement('span', { style: { fontWeight: 'bold', color: 'var(--secondary)' } }, `₹${plan?.total_return || '0'}`)
                  )
                ),
                
                React.createElement('button', {
                  className: 'btn btn-primary',
                  style: { width: '100%' },
                  onClick: () => plan?.id && handleSubscribe(plan.id)
                }, "Subscribe Now")
              )
            )
          )
        : React.createElement('div', { style: { textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--gray)' } },
            React.createElement('p', null, 'No investment plans available at the moment.'),
            React.createElement('p', null, 'Please check back later.')
          )
    )
  );
};

const ProfilePage = ({ user, authToken, onLogout, onNavigate }) => {
  return React.createElement(
    'div',
    null,
    React.createElement('div', { className: 'header' },
      React.createElement('h1', { style: { color: 'white', margin: 0 } }, 'Profile'),
      React.createElement('button', { onClick: onLogout, className: 'btn btn-secondary', style: { color: 'white' } }, 'Logout')
    ),
    
    React.createElement('div', { className: 'container', style: { padding: 'var(--spacing-lg) 0' } },
      React.createElement('div', { className: 'card', style: { textAlign: 'center' } },
        React.createElement('div', { style: { width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-md)', fontSize: '2rem', color: 'white' } }, user.name?.charAt(0) || 'U'),
        React.createElement('h2', { style: { marginBottom: 'var(--spacing-sm)' } }, user.name),
        React.createElement('p', { style: { color: 'var(--gray)', marginBottom: 'var(--spacing-lg)' } }, user.mobile)
      ),

      React.createElement('div', { className: 'card' },
        React.createElement('h3', { style: { marginBottom: 'var(--spacing-md)' } }, 'Account Information'),
        React.createElement('div', { style: { display: 'grid', gap: 'var(--spacing-sm)' } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between' } },
            React.createElement('span', null, 'Wallet Balance'),
            React.createElement('span', { style: { fontWeight: 'bold', color: 'var(--primary)' } }, `₹${user.balance?.toFixed(2) || '0.00'}`)
          ),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between' } },
            React.createElement('span', null, 'Total Invested'),
            React.createElement('span', { style: { fontWeight: 'bold' } }, `₹${user.total_invested?.toFixed(2) || '0.00'}`)
          ),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between' } },
            React.createElement('span', null, 'Total Withdrawn'),
            React.createElement('span', { style: { fontWeight: 'bold' } }, `₹${user.total_withdrawn?.toFixed(2) || '0.00'}`)
          )
        )
      ),

      React.createElement('div', { className: 'card' },
        React.createElement('h3', { style: { marginBottom: 'var(--spacing-md)' } }, 'Security'),
        React.createElement('div', { style: { display: 'grid', gap: 'var(--spacing-sm)' } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            React.createElement('span', null, 'Change Password'),
            React.createElement('button', {
              className: 'btn btn-secondary',
              onClick: () => alert('Change password functionality')
            }, "Change")
          )
        )
      ),

      React.createElement('button', {
        className: 'btn btn-primary',
        style: { width: '100%', marginTop: 'var(--spacing-lg)' },
        onClick: onLogout
      }, "Logout")
    )
  );
};

const RechargePage = ({ user, authToken, onLogout, onNavigate }) => {
  const [amount, setAmount] = useState('');
  const [utr, setUtr] = useState('');
  const [loading, setLoading] = useState(false);

  // Suggested plan amounts (buttons)
  const planAmounts = [3000, 5000, 10000, 25000, 50000];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.createRecharge(parseFloat(amount), utr, authToken);
      if (result.message) {
        alert(result.message);
        setAmount('');
        setUtr('');
      }
    } catch (err) {
      alert('Failed to submit recharge request');
    }
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('UPI ID copied to clipboard!');
  };

  return React.createElement(
    'div',
    null,
    React.createElement('div', { className: 'header' },
      React.createElement('h1', { style: { color: 'white', margin: 0 } }, 'Recharge Account'),
      React.createElement('button', { onClick: onLogout, className: 'btn btn-secondary', style: { color: 'white' } }, 'Logout')
    ),
    
    React.createElement('div', { className: 'container', style: { padding: 'var(--spacing-lg) 0' } },
      React.createElement('div', { className: 'card' },
        React.createElement('h3', { style: { marginBottom: 'var(--spacing-md)' } }, 'Add Funds'),
        
        React.createElement('form', { onSubmit: handleSubmit },
          React.createElement('div', { style: { marginBottom: 'var(--spacing-md)' } },
            React.createElement('label', { htmlFor: 'amount', style: { display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' } }, 'Amount (₹)'),
            React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xs)' } },
              ...planAmounts.map(amt => 
                React.createElement('button', {
                  key: amt,
                  type: 'button',
                  onClick: () => setAmount(amt.toString()),
                  style: {
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--primary)',
                    backgroundColor: 'white',
                    color: 'var(--primary)',
                    cursor: 'pointer'
                  }
                }, `₹${amt}`)
              )
            ),
            React.createElement('input', {
              id: 'amount',
              type: 'number',
              value: amount,
              onChange: (e) => setAmount(e.target.value),
              placeholder: 'Enter custom amount',
              min: '100',
              required: true,
              style: { 
                width: '100%', 
                padding: 'var(--spacing-sm)', 
                border: '1px solid var(--light-gray)', 
                borderRadius: 'var(--border-radius)',
                fontSize: '1rem',
                marginTop: 'var(--spacing-sm)'
              }
            })
          ),
          
          React.createElement('button', {
            type: 'submit',
            className: 'btn btn-primary',
            style: { width: '100%', marginBottom: 'var(--spacing-md)' },
            disabled: loading
          },
            loading ? 'Processing...' : 'Proceed to Payment'
          )
        )
      ),

      // Payment Instructions Section
      React.createElement('div', { className: 'card' },
        React.createElement('h3', { style: { marginBottom: 'var(--spacing-md)' } }, 'Payment Instructions'),
        
        // TODO: Place your QR code image at /public/upi_qr.png
        // UPI ID with copy button
        React.createElement('div', { style: { marginBottom: 'var(--spacing-md)' } },
          React.createElement('label', { style: { display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' } }, 'UPI ID'),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' } },
            React.createElement('span', { 
              style: { 
                flex: 1, 
                padding: 'var(--spacing-sm)', 
                border: '1px solid var(--light-gray)', 
                borderRadius: 'var(--border-radius)',
                backgroundColor: '#f8fafc'
              } 
            }, '7047571829@yespop'),
            React.createElement('button', {
              type: 'button',
              onClick: () => copyToClipboard('7047571829@yespop'),
              className: 'btn btn-secondary',
              style: { padding: 'var(--spacing-sm) var(--spacing-md)' }
            }, 'Copy')
          )
        ),
        
        // QR Code
        React.createElement('div', { style: { marginBottom: 'var(--spacing-md)', textAlign: 'center' } },
          React.createElement('label', { style: { display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' } }, 'QR Code'),
          React.createElement('img', {
            src: '/upi_qr.png',  // Replace this file in public/ directory with your QR code image
            alt: 'UPI QR Code',
            style: { 
              maxWidth: '200px', 
              height: 'auto',
              border: '1px solid var(--light-gray)',
              borderRadius: 'var(--border-radius)',
              padding: 'var(--spacing-sm)'
            }
          })
        ),
        
        // Amount to transfer
        React.createElement('div', { style: { marginBottom: 'var(--spacing-md)' } },
          React.createElement('label', { style: { display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' } }, 'Amount to Transfer'),
          React.createElement('div', { 
            style: { 
              padding: 'var(--spacing-sm)', 
              border: '1px solid var(--light-gray)', 
              borderRadius: 'var(--border-radius)',
              backgroundColor: '#f8fafc',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              textAlign: 'center'
            } 
          }, amount ? `₹${amount}` : 'Enter amount above')
        ),
        
        // UTR Input
        React.createElement('div', { style: { marginBottom: 'var(--spacing-md)' } },
          React.createElement('label', { htmlFor: 'utr', style: { display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' } }, 'UTR (Transaction Reference)'),
          React.createElement('input', {
            id: 'utr',
            type: 'text',
            value: utr,
            onChange: (e) => setUtr(e.target.value),
            placeholder: 'Enter 12-digit UTR from bank',
            required: true,
            style: { 
              width: '100%', 
              padding: 'var(--spacing-sm)', 
              border: '1px solid var(--light-gray)', 
              borderRadius: 'var(--border-radius)',
              fontSize: '1rem'
            }
          })
        ),
        
        React.createElement('button', {
          type: 'submit',
          className: 'btn btn-primary',
          style: { width: '100%' },
          disabled: loading
        },
          loading ? 'Processing...' : 'Submit Recharge'
        )
      )
    )
  );
};

const WithdrawalPage = ({ user, authToken, onLogout, onNavigate }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifsc: '',
    accountHolder: ''
  });
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    let withdrawalData = {
      amount: parseFloat(amount),
      method: method
    };
    
    if (method === 'bank') {
      withdrawalData = {
        ...withdrawalData,
        bank_name: 'Your Bank',
        account_number: bankDetails.accountNumber,
        ifsc_code: bankDetails.ifsc,
        account_holder_name: bankDetails.accountHolder
      };
    } else {
      withdrawalData.upi_id = upiId;
    }

    try {
      const result = await api.createWithdrawal(withdrawalData, authToken);
      if (result.message) {
        alert(result.message);
        setAmount('');
        setBankDetails({ accountNumber: '', ifsc: '', accountHolder: '' });
        setUpiId('');
      }
    } catch (err) {
      alert('Failed to submit withdrawal request');
    }
    setLoading(false);
  };

  const calculateGST = (amt) => {
    if (!amt) return { gst: 0, net: 0 };
    const gst = parseFloat(amt) * 0.18;
    const net = parseFloat(amt) - gst;
    return { gst: gst.toFixed(2), net: net.toFixed(2) };
  };

  const gstInfo = calculateGST(amount);

  return React.createElement(
    'div',
    null,
    React.createElement('div', { className: 'header' },
      React.createElement('h1', { style: { color: 'white', margin: 0 } }, 'Withdraw Funds'),
      React.createElement('button', { onClick: onLogout, className: 'btn btn-secondary', style: { color: 'white' } }, 'Logout')
    ),
    
    React.createElement('div', { className: 'container', style: { padding: 'var(--spacing-lg) 0' } },
      React.createElement('div', { className: 'card' },
        React.createElement('h3', { style: { marginBottom: 'var(--spacing-md)' } }, 'Withdraw Funds'),
        
        React.createElement('div', { 
          style: { 
            backgroundColor: '#dbeafe', 
            padding: 'var(--spacing-md)', 
            borderRadius: 'var(--border-radius)', 
            marginBottom: 'var(--spacing-md)',
            textAlign: 'center'
          } 
        },
          React.createElement('div', { style: { fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' } }, `Available Balance: ₹${user.balance?.toFixed(2) || '0.00'}`)
        ),
        
        React.createElement('form', { onSubmit: handleSubmit },
          React.createElement('div', { style: { marginBottom: 'var(--spacing-md)' } },
            React.createElement('label', { htmlFor: 'amount', style: { display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' } }, 'Amount (₹)'),
            React.createElement('input', {
              id: 'amount',
              type: 'number',
              value: amount,
              onChange: (e) => setAmount(e.target.value),
              placeholder: 'Enter amount',
              min: '100',
              max: user.balance || 0,
              required: true,
              style: { 
                width: '100%', 
                padding: 'var(--spacing-sm)', 
                border: '1px solid var(--light-gray)', 
                borderRadius: 'var(--border-radius)',
                fontSize: '1rem'
              }
            })
          ),
          
          React.createElement('div', { 
            style: { 
              backgroundColor: '#f0fdf4', 
              padding: 'var(--spacing-md)', 
              borderRadius: 'var(--border-radius)', 
              marginBottom: 'var(--spacing-md)'
            } 
          },
            React.createElement('h4', { style: { marginBottom: 'var(--spacing-xs)' } }, 'GST Calculation'),
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' } },
              React.createElement('span', null, 'Withdrawal Amount:'),
              React.createElement('span', { style: { fontWeight: 'bold' } }, `₹${amount || '0.00'}`)
            ),
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' } },
              React.createElement('span', null, 'GST (18%):'),
              React.createElement('span', { style: { fontWeight: 'bold', color: 'var(--danger)' } }, `-₹${gstInfo.gst}`)
            ),
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 'bold', marginTop: 'var(--spacing-xs)' } },
              React.createElement('span', null, 'Net Amount:'),
              React.createElement('span', { style: { color: 'var(--success)' } }, `₹${gstInfo.net}`)
            )
          ),
          
          React.createElement('div', { style: { marginBottom: 'var(--spacing-md)' } },
            React.createElement('label', { style: { display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' } }, 'Withdrawal Method'),
            React.createElement('div', { style: { display: 'flex', gap: 'var(--spacing-sm)' } },
              React.createElement('label', { style: { flex: 1, textAlign: 'center', padding: 'var(--spacing-sm)', border: `2px solid ${method === 'bank' ? 'var(--primary)' : 'var(--light-gray)'}`, borderRadius: 'var(--border-radius)', cursor: 'pointer' } },
                React.createElement('input', {
                  type: 'radio',
                  name: 'method',
                  value: 'bank',
                  checked: method === 'bank',
                  onChange: (e) => setMethod(e.target.value),
                  style: { display: 'none' }
                }),
                'Bank Transfer'
              ),
              React.createElement('label', { style: { flex: 1, textAlign: 'center', padding: 'var(--spacing-sm)', border: `2px solid ${method === 'upi' ? 'var(--primary)' : 'var(--light-gray)'}`, borderRadius: 'var(--border-radius)', cursor: 'pointer' } },
                React.createElement('input', {
                  type: 'radio',
                  name: 'method',
                  value: 'upi',
                  checked: method === 'upi',
                  onChange: (e) => setMethod(e.target.value),
                  style: { display: 'none' }
                }),
                'UPI ID'
              )
            )
          ),
          
          method === 'bank' 
            ? React.createElement(React.Fragment, null,
                React.createElement('div', { style: { marginBottom: 'var(--spacing-md)' } },
                  React.createElement('label', { htmlFor: 'accountNumber', style: { display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' } }, 'Account Number'),
                  React.createElement('input', {
                    id: 'accountNumber',
                    type: 'text',
                    value: bankDetails.accountNumber,
                    onChange: (e) => setBankDetails({...bankDetails, accountNumber: e.target.value}),
                    placeholder: 'Enter account number',
                    required: true,
                    style: { 
                      width: '100%', 
                      padding: 'var(--spacing-sm)', 
                      border: '1px solid var(--light-gray)', 
                      borderRadius: 'var(--border-radius)',
                      fontSize: '1rem'
                    }
                  })
                ),
                React.createElement('div', { style: { marginBottom: 'var(--spacing-md)' } },
                  React.createElement('label', { htmlFor: 'ifsc', style: { display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' } }, 'IFSC Code'),
                  React.createElement('input', {
                    id: 'ifsc',
                    type: 'text',
                    value: bankDetails.ifsc,
                    onChange: (e) => setBankDetails({...bankDetails, ifsc: e.target.value}),
                    placeholder: 'Enter IFSC code',
                    required: true,
                    style: { 
                      width: '100%', 
                      padding: 'var(--spacing-sm)', 
                      border: '1px solid var(--light-gray)', 
                      borderRadius: 'var(--border-radius)',
                      fontSize: '1rem'
                    }
                  })
                ),
                React.createElement('div', { style: { marginBottom: 'var(--spacing-md)' } },
                  React.createElement('label', { htmlFor: 'accountHolder', style: { display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' } }, 'Account Holder Name'),
                  React.createElement('input', {
                    id: 'accountHolder',
                    type: 'text',
                    value: bankDetails.accountHolder,
                    onChange: (e) => setBankDetails({...bankDetails, accountHolder: e.target.value}),
                    placeholder: 'Enter account holder name',
                    required: true,
                    style: { 
                      width: '100%', 
                      padding: 'var(--spacing-sm)', 
                      border: '1px solid var(--light-gray)', 
                      borderRadius: 'var(--border-radius)',
                      fontSize: '1rem'
                    }
                  })
                )
              )
            : React.createElement('div', { style: { marginBottom: 'var(--spacing-md)' } },
                React.createElement('label', { htmlFor: 'upiId', style: { display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' } }, 'UPI ID'),
                React.createElement('input', {
                  id: 'upiId',
                  type: 'text',
                  value: upiId,
                  onChange: (e) => setUpiId(e.target.value),
                  placeholder: 'Enter UPI ID (e.g., yourname@bank)',
                  required: true,
                  style: { 
                    width: '100%', 
                    padding: 'var(--spacing-sm)', 
                    border: '1px solid var(--light-gray)', 
                    borderRadius: 'var(--border-radius)',
                    fontSize: '1rem'
                  }
                })
              ),
          
          React.createElement('button', {
            type: 'submit',
            className: 'btn btn-primary',
            style: { width: '100%' },
            disabled: loading
          },
            loading ? 'Processing...' : 'Submit Withdrawal'
          )
        )
      )
    )
  );
};

const TransactionsPage = ({ user, authToken, onLogout, onNavigate }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false); // Don't show loading initially

  useEffect(() => {
    // Only fetch transactions when the component mounts and transactions are empty
    if (transactions.length === 0) {
      const fetchTransactions = async () => {
        setLoading(true);
        try {
          const result = await api.getTransactions(authToken);
          setTransactions(result || []);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          console.error('Error fetching transactions:', err);
        }
      };
      fetchTransactions();
    }
  }, [authToken, transactions.length]);

  if (loading) {
    return React.createElement(
      'div',
      { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' } },
      React.createElement('div', { style: { fontSize: '1.5rem' } }, 'Loading Transactions...')
    );
  }

  return React.createElement(
    'div',
    null,
    React.createElement('div', { className: 'header' },
      React.createElement('h1', { style: { color: 'white', margin: 0 } }, 'Transaction History'),
      React.createElement('button', { onClick: onLogout, className: 'btn btn-secondary', style: { color: 'white' } }, 'Logout')
    ),
    
    React.createElement('div', { className: 'container', style: { padding: 'var(--spacing-lg) 0' } },
      React.createElement('h2', { style: { marginBottom: 'var(--spacing-lg)' } }, `Transactions (${transactions.length})`),
      
      (transactions || []).length > 0 
        ? React.createElement('div', null,
            (transactions || []).map(transaction => 
              React.createElement('div', { key: transaction?.id || Math.random(), className: 'card', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                React.createElement('div', null,
                  React.createElement('div', { style: { fontWeight: 'bold' } }, transaction?.description || 'Transaction'),
                  React.createElement('div', { style: { fontSize: '0.875rem', color: 'var(--gray)' } }, transaction?.created_at ? new Date(transaction.created_at).toLocaleDateString() : 'N/A')
                ),
                React.createElement('div', { style: { textAlign: 'right' } },
                  React.createElement('div', { 
                    style: { 
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      color: ['daily_income', 'recharge'].includes(transaction?.type) ? 'var(--success)' : 'var(--danger)' 
                    } 
                  }, 
                    ['daily_income', 'recharge'].includes(transaction?.type) ? `+₹${transaction?.amount || 0}` : `-₹${transaction?.amount || 0}`
                  ),
                  React.createElement('div', { style: { fontSize: '0.75rem', color: 'var(--gray)' } }, transaction?.type || 'transaction')
                )
              )
            )
          )
        : React.createElement('div', { style: { textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--gray)' } },
            'No transactions found'
          )
    )
  );
};

const AdminPage = ({ authToken, onNavigate }) => {
  const [recharges, setRecharges] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPendingRecharges = async () => {
      setLoading(true);
      try {
        // This would be a new API endpoint for admin functionality
        // For now, we'll simulate with a direct call to a potential admin endpoint
        const response = await fetch(`${API_BASE_URL}/admin/recharges/pending`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setRecharges(data.recharges || data || []);
        } else {
          // Simulate with mock data for now
          setRecharges([
            { id: 1, user_id: 1, amount: 5000, utr: 'UTR1234567890', status: 'pending', created_at: '2023-01-01T00:00:00Z' },
            { id: 2, user_id: 2, amount: 10000, utr: 'UTR0987654321', status: 'pending', created_at: '2023-01-02T00:00:00Z' }
          ]);
        }
      } catch (err) {
        console.error('Error fetching recharges:', err);
        // Simulate with mock data
        setRecharges([
          { id: 1, user_id: 1, amount: 5000, utr: 'UTR1234567890', status: 'pending', created_at: '2023-01-01T00:00:00Z' },
          { id: 2, user_id: 2, amount: 10000, utr: 'UTR0987654321', status: 'pending', created_at: '2023-01-02T00:00:00Z' }
        ]);
      }
      setLoading(false);
    };
    
    fetchPendingRecharges();
  }, [authToken]);

  const handleApprove = async (rechargeId) => {
    if (!window.confirm('Are you sure you want to approve this recharge?')) {
      return;
    }
    
    try {
      // This would be a new API endpoint for admin functionality
      const response = await fetch(`${API_BASE_URL}/admin/recharges/${rechargeId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        alert('Recharge approved successfully');
        // Refresh the list
        const updatedRecharges = recharges.map(recharge => 
          recharge.id === rechargeId ? { ...recharge, status: 'approved' } : recharge
        );
        setRecharges(updatedRecharges);
      } else {
        alert('Failed to approve recharge');
      }
    } catch (err) {
      console.error('Error approving recharge:', err);
      alert('Failed to approve recharge');
    }
  };

  const handleReject = async (rechargeId) => {
    if (!window.confirm('Are you sure you want to reject this recharge?')) {
      return;
    }
    
    try {
      // This would be a new API endpoint for admin functionality
      const response = await fetch(`${API_BASE_URL}/admin/recharges/${rechargeId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        alert('Recharge rejected successfully');
        // Refresh the list
        const updatedRecharges = recharges.map(recharge => 
          recharge.id === rechargeId ? { ...recharge, status: 'rejected' } : recharge
        );
        setRecharges(updatedRecharges);
      } else {
        alert('Failed to reject recharge');
      }
    } catch (err) {
      console.error('Error rejecting recharge:', err);
      alert('Failed to reject recharge');
    }
  };

  if (loading) {
    return React.createElement(
      'div', { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' } },
      React.createElement('div', { style: { fontSize: '1.5rem' } }, 'Loading recharges...')
    );
  }

  return React.createElement(
    'div',
    null,
    React.createElement('div', { className: 'header' },
      React.createElement('h1', { style: { color: 'white', margin: 0 } }, 'Admin Panel'),
      React.createElement('button', { 
        onClick: () => onNavigate('/dashboard'), 
        className: 'btn btn-secondary', 
        style: { color: 'white' } 
      }, 'Back to Dashboard')
    ),
    
    React.createElement('div', { className: 'container', style: { padding: 'var(--spacing-lg) 0' } },
      React.createElement('h2', { style: { marginBottom: 'var(--spacing-lg)', textAlign: 'center' } }, 'Pending Recharges'),
      
      recharges.length > 0 
        ? React.createElement('div', null,
            recharges.map(recharge => 
              React.createElement('div', { 
                key: recharge.id, 
                className: 'card',
                style: { 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  flexDirection: 'column',
                  gap: 'var(--spacing-sm)'
                } 
              },
                React.createElement('div', { style: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                  React.createElement('div', null,
                    React.createElement('div', { style: { fontWeight: 'bold' } }, `₹${recharge.amount}`),
                    React.createElement('div', { style: { fontSize: '0.875rem', color: 'var(--gray)' } }, `UTR: ${recharge.utr}`),
                    React.createElement('div', { style: { fontSize: '0.75rem', color: 'var(--gray)' } }, 
                      `Date: ${new Date(recharge.created_at).toLocaleDateString()}`
                    )
                  ),
                  React.createElement('span', { 
                    style: { 
                      fontWeight: 'bold',
                      color: recharge.status === 'approved' ? 'var(--success)' : 
                              recharge.status === 'rejected' ? 'var(--danger)' : 'var(--warning)'
                    } 
                  }, 
                    recharge.status
                  )
                ),
                React.createElement('div', { style: { width: '100%', display: 'flex', gap: 'var(--spacing-xs)' } },
                  React.createElement('button', {
                    className: 'btn btn-primary',
                    style: { flex: 1 },
                    onClick: () => handleApprove(recharge.id),
                    disabled: recharge.status !== 'pending'
                  }, "Approve"),
                  React.createElement('button', {
                    className: 'btn btn-secondary',
                    style: { flex: 1 },
                    onClick: () => handleReject(recharge.id),
                    disabled: recharge.status !== 'pending'
                  }, "Reject")
                )
              )
            )
          )
        : React.createElement('div', { style: { textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--gray)' } },
            React.createElement('p', null, 'No pending recharges at the moment.')
          )
    )
  );
};

const BottomNavigation = ({ currentPage, onNavigate }) => {
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/plans', label: 'Plans', icon: '📈' },
    { path: '/recharge', label: 'Recharge', icon: '👆' },
    { path: '/withdrawal', label: 'Withdraw', icon: '👇' },
    { path: '/transactions', label: 'History', icon: '📜' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ];

  // Add admin option for debugging purposes
  const allNavItems = [...navItems, { path: '/admin', label: 'Admin', icon: '⚙️' }];

  return React.createElement('div', { className: 'bottom-nav' },
    allNavItems.map(item => 
      React.createElement('a', {
        key: item.path,
        href: '#',
        className: `nav-item ${currentPage === item.path ? 'active' : ''}`,
        onClick: (e) => {
          e.preventDefault();
          
          // Special handling for admin panel
          if (item.path === '/admin') {
            // Check if this is the admin panel access
            if (window.prompt('Enter admin access code:') === 'admin123') { // Simple admin access for demo
              onNavigate(item.path);
            } else {
              alert('Invalid admin access code');
            }
          } else {
            onNavigate(item.path);
          }
        }
      },
        React.createElement('div', { style: { fontSize: '1.25rem', marginBottom: 'var(--spacing-xs)' } }, item.icon),
        item.label
      )
    )
  );
};

export default App;