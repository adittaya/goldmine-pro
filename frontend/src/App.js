import React, { useState, useEffect } from 'react';
import './index.css';

// Mock API functions for demonstration
const mockAPI = {
  login: (mobile, password) => {
    return new Promise(resolve => {
      setTimeout(() => {
        if (mobile === '1234567890' && password === 'password') {
          resolve({ success: true, token: 'mock-token', user: { id: '1', name: 'John Doe', mobile: '1234567890', balance: 5000 } });
        } else {
          resolve({ success: false, error: 'Invalid credentials' });
        }
      }, 500);
    });
  },
  
  register: (name, mobile, password) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, token: 'mock-token', user: { id: '2', name, mobile, balance: 0 } });
      }, 500);
    });
  }
};

const App = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('/');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for existing session
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = async (mobile, password) => {
    setLoading(true);
    setError('');
    const result = await mockAPI.login(mobile, password);
    setLoading(false);
    
    if (result.success) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      setUser(result.user);
      setCurrentPage('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const handleRegister = async (name, mobile, password) => {
    setLoading(true);
    setError('');
    const result = await mockAPI.register(name, mobile, password);
    setLoading(false);
    
    if (result.success) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      setUser(result.user);
      setCurrentPage('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
        return React.createElement(DashboardPage, { user, onLogout: handleLogout, onNavigate: setCurrentPage });
      case '/plans':
        return React.createElement(PlansPage, { user, onLogout: handleLogout, onNavigate: setCurrentPage });
      case '/profile':
        return React.createElement(ProfilePage, { user, onLogout: handleLogout, onNavigate: setCurrentPage });
      default:
        return React.createElement(DashboardPage, { user, onLogout: handleLogout, onNavigate: setCurrentPage });
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

const DashboardPage = ({ user, onLogout, onNavigate }) => {
  const statCards = [
    { title: 'Wallet Balance', value: `₹${user.balance?.toFixed(2) || '0.00'}`, color: 'var(--primary)' },
    { title: 'Total Invested', value: '₹2,500.00', color: 'var(--secondary)' },
    { title: 'Total Withdrawn', value: '₹1,200.00', color: 'var(--success)' }
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
            onClick: () => {},
            style: { marginBottom: 'var(--spacing-md)' }
          }, "Refer & Earn")
        )
      ),

      // Recent Activity
      React.createElement('div', { className: 'card' },
        React.createElement('h3', { style: { marginBottom: 'var(--spacing-md)' } }, 'Recent Activity'),
        React.createElement('div', null,
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--light-gray)' } },
            React.createElement('span', null, 'Daily Income'),
            React.createElement('span', { style: { color: 'var(--success)', fontWeight: 'bold' } }, '+₹50.00')
          ),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--light-gray)' } },
            React.createElement('span', null, 'Plan Purchase'),
            React.createElement('span', { style: { color: 'var(--danger)', fontWeight: 'bold' } }, '-₹1,000.00')
          ),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: 'var(--spacing-sm) 0' } },
            React.createElement('span', null, 'Withdrawal'),
            React.createElement('span', { style: { color: 'var(--danger)', fontWeight: 'bold' } }, '-₹500.00')
          )
        )
      )
    )
  );
};

const PlansPage = ({ user, onLogout, onNavigate }) => {
  const plans = [
    { id: 1, name: 'Starter Plan', price: '500', daily: '50', duration: '10 days', return: '650' },
    { id: 2, name: 'Growth Plan', price: '1000', daily: '120', duration: '10 days', return: '2200' },
    { id: 3, name: 'Premium Plan', price: '5000', daily: '700', duration: '15 days', return: '15500' },
    { id: 4, name: 'Elite Plan', price: '10000', daily: '1600', duration: '20 days', return: '42000' }
  ];

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
                React.createElement('span', { style: { fontWeight: 'bold', color: 'var(--success)' } }, `₹${plan.daily}`)
              )
            ),
            
            React.createElement('div', { style: { marginBottom: 'var(--spacing-sm)' } },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between' } },
                React.createElement('span', null, 'Duration:'),
                React.createElement('span', { style: { fontWeight: 'bold' } }, plan.duration)
              )
            ),
            
            React.createElement('div', { style: { marginBottom: 'var(--spacing-md)' } },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between' } },
                React.createElement('span', null, 'Total Return:'),
                React.createElement('span', { style: { fontWeight: 'bold', color: 'var(--secondary)' } }, `₹${plan.return}`)
              )
            ),
            
            React.createElement('button', {
              className: 'btn btn-primary',
              style: { width: '100%' },
              onClick: () => alert(`Selected ${plan.name}`)
            }, "Subscribe Now")
          )
        )
      )
    )
  );
};

const ProfilePage = ({ user, onLogout, onNavigate }) => {
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
            React.createElement('span', { style: { fontWeight: 'bold' } }, '₹2,500.00')
          ),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between' } },
            React.createElement('span', null, 'Total Withdrawn'),
            React.createElement('span', { style: { fontWeight: 'bold' } }, '₹1,200.00')
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

const BottomNavigation = ({ currentPage, onNavigate }) => {
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/plans', label: 'Plans', icon: '📈' },
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