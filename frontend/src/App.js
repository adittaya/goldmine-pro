import React, { useState } from 'react';
import './index.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');

  // Simple login function
  const handleLogin = async (mobile, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, password }),
      });

      if (response.ok) {
        setCurrentPage('dashboard');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  // Simple register function
  const handleRegister = async (name, mobile, password) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, mobile, password }),
      });

      if (response.ok) {
        setCurrentPage('dashboard');
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  // Login Page
  const LoginPage = () => {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      handleLogin(mobile, password);
    };

    return React.createElement(
      'div',
      { className: 'container' },
      React.createElement('div', { className: 'header' },
        React.createElement('h1', { style: { color: 'white', margin: 0 } }, 'Goldmine Pro')
      ),
      React.createElement('form', { onSubmit: handleSubmit, style: { maxWidth: '400px', margin: '0 auto', padding: '2rem 0' } },
        React.createElement('div', { style: { marginBottom: '1rem' } },
          React.createElement('label', { htmlFor: 'mobile', style: { display: 'block', marginBottom: '0.5rem' } }, 'Mobile'),
          React.createElement('input', {
            id: 'mobile',
            type: 'tel',
            value: mobile,
            onChange: (e) => setMobile(e.target.value),
            required: true,
            style: { width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }
          })
        ),
        React.createElement('div', { style: { marginBottom: '1rem' } },
          React.createElement('label', { htmlFor: 'password', style: { display: 'block', marginBottom: '0.5rem' } }, 'Password'),
          React.createElement('input', {
            id: 'password',
            type: 'password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
            style: { width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }
          })
        ),
        React.createElement('button', { type: 'submit', className: 'btn btn-primary' }, 'Login'),
        React.createElement('div', { style: { textAlign: 'center', marginTop: '1rem' } },
          React.createElement('button', {
            type: 'button',
            onClick: () => setCurrentPage('register')
          }, 'Create Account')
        )
      )
    );
  };

  // Register Page
  const RegisterPage = () => {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      handleRegister(name, mobile, password);
    };

    return React.createElement(
      'div',
      { className: 'container' },
      React.createElement('div', { className: 'header' },
        React.createElement('h1', { style: { color: 'white', margin: 0 } }, 'Goldmine Pro')
      ),
      React.createElement('form', { onSubmit: handleSubmit, style: { maxWidth: '400px', margin: '0 auto', padding: '2rem 0' } },
        React.createElement('div', { style: { marginBottom: '1rem' } },
          React.createElement('label', { htmlFor: 'name', style: { display: 'block', marginBottom: '0.5rem' } }, 'Name'),
          React.createElement('input', {
            id: 'name',
            type: 'text',
            value: name,
            onChange: (e) => setName(e.target.value),
            required: true,
            style: { width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }
          })
        ),
        React.createElement('div', { style: { marginBottom: '1rem' } },
          React.createElement('label', { htmlFor: 'mobile', style: { display: 'block', marginBottom: '0.5rem' } }, 'Mobile'),
          React.createElement('input', {
            id: 'mobile',
            type: 'tel',
            value: mobile,
            onChange: (e) => setMobile(e.target.value),
            required: true,
            style: { width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }
          })
        ),
        React.createElement('div', { style: { marginBottom: '1rem' } },
          React.createElement('label', { htmlFor: 'password', style: { display: 'block', marginBottom: '0.5rem' } }, 'Password'),
          React.createElement('input', {
            id: 'password',
            type: 'password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
            style: { width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }
          })
        ),
        React.createElement('button', { type: 'submit', className: 'btn btn-primary' }, 'Register'),
        React.createElement('div', { style: { textAlign: 'center', marginTop: '1rem' } },
          React.createElement('button', {
            type: 'button',
            onClick: () => setCurrentPage('login')
          }, 'Back to Login')
        )
      )
    );
  };

  // Dashboard Page
  const DashboardPage = () => {
    return React.createElement(
      'div',
      { className: 'container' },
      React.createElement('div', { className: 'header' },
        React.createElement('h1', { style: { color: 'white', margin: 0 } }, 'Dashboard')
      ),
      React.createElement('div', { style: { padding: '2rem 0', textAlign: 'center' } },
        React.createElement('h2', {}, 'Welcome!'),
        React.createElement('button', {
          className: 'btn btn-primary',
          onClick: () => setCurrentPage('recharge'),
          style: { margin: '0.5rem' }
        }, 'Recharge'),
        React.createElement('button', {
          className: 'btn btn-secondary',
          onClick: () => setCurrentPage('plans'),
          style: { margin: '0.5rem' }
        }, 'Plans'),
        React.createElement('button', {
          className: 'btn btn-secondary',
          onClick: () => setCurrentPage('login'),
          style: { margin: '0.5rem' }
        }, 'Logout')
      )
    );
  };

  // Recharge Page
  const RechargePage = () => {
    const [amount, setAmount] = useState('');
    const [utr, setUtr] = useState('');

    return React.createElement(
      'div',
      { className: 'container' },
      React.createElement('div', { className: 'header' },
        React.createElement('h1', { style: { color: 'white', margin: 0 } }, 'Recharge')
      ),
      React.createElement('div', { style: { padding: '2rem 0' } },
        React.createElement('h2', { style: { textAlign: 'center' } }, 'Recharge Account'),
        React.createElement('div', { className: 'card', style: { marginBottom: '1rem' } },
          React.createElement('h3', {}, 'Payment Instructions'),
          React.createElement('p', {}, 'Pay to UPI: 7047571829@yespop'),
          React.createElement('img', {
            src: '/upi_qr.png',
            alt: 'UPI QR Code',
            style: { maxWidth: '200px', display: 'block', margin: '1rem auto' }
          }),
          React.createElement('p', {}, `Amount: ₹${amount || 'Enter amount'}`)
        ),
        React.createElement('div', { className: 'card' },
          React.createElement('h3', {}, 'Enter Details'),
          React.createElement('div', { style: { marginBottom: '1rem' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '0.5rem' } }, 'Amount'),
            React.createElement('input', {
              type: 'number',
              value: amount,
              onChange: (e) => setAmount(e.target.value),
              style: { width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }
            })
          ),
          React.createElement('div', { style: { marginBottom: '1rem' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '0.5rem' } }, 'UTR Number'),
            React.createElement('input', {
              type: 'text',
              value: utr,
              onChange: (e) => setUtr(e.target.value),
              placeholder: '12-digit UTR',
              style: { width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }
            })
          ),
          React.createElement('button', { className: 'btn btn-primary' }, 'Submit')
        )
      )
    );
  };

  // Plans Page
  const PlansPage = () => {
    const plans = [
      { id: 1, name: 'Plan A', price: 500, daily: 50, days: 10 },
      { id: 2, name: 'Plan B', price: 1000, daily: 120, days: 10 },
      { id: 3, name: 'Plan C', price: 5000, daily: 700, days: 15 }
    ];

    return React.createElement(
      'div',
      { className: 'container' },
      React.createElement('div', { className: 'header' },
        React.createElement('h1', { style: { color: 'white', margin: 0 } }, 'Plans')
      ),
      React.createElement('div', { style: { padding: '2rem 0' } },
        React.createElement('h2', { style: { textAlign: 'center', marginBottom: '2rem' } }, 'Investment Plans'),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' } },
          plans.map(plan => 
            React.createElement('div', { key: plan.id, className: 'card' },
              React.createElement('h3', {}, plan.name),
              React.createElement('p', {}, `₹${plan.price}`),
              React.createElement('p', {}, `${plan.daily}/day`),
              React.createElement('p', {}, `${plan.days} days`),
              React.createElement('button', { className: 'btn btn-primary' }, 'Buy')
            )
          )
        )
      )
    );
  };

  // Render current page
  switch (currentPage) {
    case 'register':
      return React.createElement(RegisterPage);
    case 'dashboard':
      return React.createElement(DashboardPage);
    case 'recharge':
      return React.createElement(RechargePage);
    case 'plans':
      return React.createElement(PlansPage);
    default:
      return React.createElement(LoginPage);
  }
};

export default App;