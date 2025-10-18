import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { errorLogger } from '../utils/errorLogger';
import { FaPhone, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      // Provide more specific error messages for network issues
      if (err.message.includes('Network Error')) {
        setError('Unable to connect to the server. Please check your internet connection and try again later.');
      } else if (err.response?.status === 401) {
        setError('Invalid credentials. Please check your mobile number and password.');
      } else {
        setError(err.response?.data?.error || err.message || 'Login failed');
      }
      
      errorLogger.logError(err, 'Login Function Error', { 
        mobile,
        status: err.response?.status,
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="mobile">
              <FaPhone className="form-icon" /> Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              placeholder="Enter your mobile number"
              autoComplete="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              <FaLock className="form-icon" /> Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? (
              <span className="loading-spinner">Logging in...</span>
            ) : (
              'Login'
            )}
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