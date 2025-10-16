import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { errorLogger } from '../utils/errorLogger';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!mobile || !password) {
        setError('Mobile and password are required');
        errorLogger.logError('Login credentials missing', 'Login Form Validation', { hasMobile: !!mobile, hasPassword: !!password });
        setLoading(false);
        return;
      }

      const result = await login(mobile, password);
      
      if (result.success) {
        console.log('Login successful, navigating to dashboard');
        navigate('/dashboard');
      } else {
        setError(result.message || 'Login failed');
        errorLogger.logError(result.message || 'Login failed', 'Login API Call', { 
          mobile,
          success: result.success 
        });
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      errorLogger.logError(err, 'Login Function Error', { mobile });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              type="tel"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              placeholder="Enter your mobile number"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="auth-links">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;