import React, { useState, useEffect } from 'react';
import './index.css';

// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = {
  // Authentication
  login: async (mobile, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobile, password }),
    });
    return response.json();
  },

  register: async (name, mobile, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, mobile, password }),
    });
    return response.json();
  },

  // User endpoints
  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getDashboard: async (token) => {
    const response = await fetch(`${API_BASE_URL}/user/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getReferral: async (token) => {
    const response = await fetch(`${API_BASE_URL}/user/referral`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Plans
  getPlans: async () => {
    const response = await fetch(`${API_BASE_URL}/plans`);
    return response.json();
  },

  purchasePlan: async (planId, token) => {
    const response = await fetch(`${API_BASE_URL}/plans/purchase/${planId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  // Transactions
  getTransactions: async (token) => {
    const response = await fetch(`${API_BASE_URL}/transactions/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Recharge
  createRecharge: async (amount, utr, token) => {
    const response = await fetch(`${API_BASE_URL}/transactions/recharge`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, utr }),
    });
    return response.json();
  },

  // Withdrawal
  createWithdrawal: async (data, token) => {
    const response = await fetch(`${API_BASE_URL}/transactions/withdrawal`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
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
  }, [authToken]);

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
        dashboardData.activePlans.map(plan => 
          React.createElement('div', { key: plan.id, className: 'card', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            React.createElement('div', null,
              React.createElement('div', { style: { fontWeight: 'bold' } }, plan.plan_name),
              React.createElement('div', { style: { fontSize: '0.875rem', color: 'var(--gray)' } }, `Daily: ₹${plan.daily_income} | Ends: ${new Date(plan.end_date).toLocaleDateString()}`)
            ),
            React.createElement('span', { style: { color: 'var(--success)', fontWeight: 'bold' } }, 'Active')
          )
        )
      ),

      // Recent Transactions
      dashboardData?.transactions && dashboardData.transactions.length > 0 && React.createElement('div', { className: 'card' },
        React.createElement('h3', { style: { marginBottom: 'var(--spacing-md)' } }, 'Recent Transactions'),
        dashboardData.transactions.slice(0, 5).map(transaction => 
          React.createElement('div', { 
            key: transaction.id, 
            style: { 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: 'var(--spacing-sm) 0', 
              borderBottom: transaction.id !== dashboardData.transactions[4]?.id ? '1px solid var(--light-gray)' : 'none' 
            } 
          },
            React.createElement('span', null, transaction.description),
            React.createElement('span', { 
              style: { 
                fontWeight: 'bold',
                color: ['daily_income', 'recharge'].includes(transaction.type) ? 'var(--success)' : 'var(--danger)' 
              } 
            }, 
              ['daily_income', 'recharge'].includes(transaction.type) ? `+₹${transaction.amount}` : `-₹${transaction.amount}`
            )
          )
        )
      )
    )
  );
};

const PlansPage = ({ user, authToken, onLogout, onNavigate }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const result = await api.getPlans();
        setPlans(result.plans);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error('Error fetching plans:', err);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (planId) => {
    try {
      const result = await api.purchasePlan(planId, authToken);
      if (result.message) {
        alert(result.message);
        // Refresh dashboard or show success
      }
    } catch (err) {
      alert('Failed to purchase plan');
    }
  };

  if (loading) {
    return React.createElement(
      'div',
      { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' } },
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
      
      React.createElement('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-md)' } },
        plans.map(plan => 
          React.createElement('div', { key: plan.id, className: 'card' },
            React.createElement('h3', { style: { marginBottom: 'var(--spacing-sm)' } }, plan.name),
            React.createElement('div', { style: { fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: 'var(--spacing-md)' } }, `₹${plan.price}`),
            
            React.createElement('div', { style: { marginBottom: 'var(--spacing-sm)' } },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between' } },
                React.createElement('span', null, 'Daily Income:'),
                React.createElement('span', { style: { fontWeight: 'bold', color: 'var(--success)' } }, `₹${plan.daily_income}`)
              )
            ),
            
            React.createElement('div', { style: { marginBottom: 'var(--spacing-sm)' } },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between' } },
                React.createElement('span', null, 'Duration:'),
                React.createElement('span', { style: { fontWeight: 'bold' } }, `${plan.duration_days} days`)
              )
            ),
            
            React.createElement('div', { style: { marginBottom: 'var(--spacing-md)' } },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between' } },
                React.createElement('span', null, 'Total Return:'),
                React.createElement('span', { style: { fontWeight: 'bold', color: 'var(--secondary)' } }, `₹${plan.total_return}`)
              )
            ),
            
            React.createElement('button', {
              className: 'btn btn-primary',
              style: { width: '100%' },
              onClick: () => handleSubscribe(plan.id)
            }, "Subscribe Now")
          )
        )
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
            React.createElement('input', {
              id: 'amount',
              type: 'number',
              value: amount,
              onChange: (e) => setAmount(e.target.value),
              placeholder: 'Enter amount',
              min: '100',
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
            React.createElement('label', { htmlFor: 'utr', style: { display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '600' } }, 'UTR (Transaction Reference)'),
            React.createElement('input', {
              id: 'utr',
              type: 'text',
              value: utr,
              onChange: (e) => setUtr(e.target.value),
              placeholder: 'Enter UTR from bank',
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
      ),

      React.createElement('div', { className: 'card' },
        React.createElement('h3', { style: { marginBottom: 'var(--spacing-md)' } }, 'Instructions'),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' } },
          React.createElement('p', null, '1. Transfer money to: 7047571829@yespop (UPI ID)'),
          React.createElement('p', null, '2. Get the UTR from your banking app'),
          React.createElement('p', null, '3. Enter amount and UTR above'),
          React.createElement('p', null, '4. Your account will be credited after verification')
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const result = await api.getTransactions(authToken);
        setTransactions(result);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error('Error fetching transactions:', err);
      }
    };
    fetchTransactions();
  }, [authToken]);

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
      
      transactions.length > 0 
        ? React.createElement('div', null,
            transactions.map(transaction => 
              React.createElement('div', { key: transaction.id, className: 'card', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                React.createElement('div', null,
                  React.createElement('div', { style: { fontWeight: 'bold' } }, transaction.description),
                  React.createElement('div', { style: { fontSize: '0.875rem', color: 'var(--gray)' } }, new Date(transaction.created_at).toLocaleDateString())
                ),
                React.createElement('div', { style: { textAlign: 'right' } },
                  React.createElement('div', { 
                    style: { 
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      color: ['daily_income', 'recharge'].includes(transaction.type) ? 'var(--success)' : 'var(--danger)' 
                    } 
                  }, 
                    ['daily_income', 'recharge'].includes(transaction.type) ? `+₹${transaction.amount}` : `-₹${transaction.amount}`
                  ),
                  React.createElement('div', { style: { fontSize: '0.75rem', color: 'var(--gray)' } }, transaction.type)
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

const BottomNavigation = ({ currentPage, onNavigate }) => {
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/plans', label: 'Plans', icon: '📈' },
    { path: '/recharge', label: 'Recharge', icon: '👆' },
    { path: '/withdrawal', label: 'Withdraw', icon: '👇' },
    { path: '/transactions', label: 'History', icon: '📜' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ];

  return React.createElement('div', { className: 'bottom-nav' },
    navItems.map(item => 
      React.createElement('a', {
        key: item.path,
        href: '#',
        className: `nav-item ${currentPage === item.path ? 'active' : ''}`,
        onClick: (e) => {
          e.preventDefault();
          onNavigate(item.path);
        }
      },
        React.createElement('div', { style: { fontSize: '1.25rem', marginBottom: 'var(--spacing-xs)' } }, item.icon),
        item.label
      )
    )
  );
};

export default App;