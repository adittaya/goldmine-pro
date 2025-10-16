import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { errorLogger } from '../utils/errorLogger';

const Register = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        errorLogger.logError('Passwords do not match', 'Register Form Validation');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        errorLogger.logError('Password too short', 'Register Form Validation', { passwordLength: password.length });
        setLoading(false);
        return;
      }

      if (!/^\d{10}$/.test(mobile)) {
        setError('Mobile number must be 10 digits');
        errorLogger.logError('Invalid mobile number format', 'Register Form Validation', { mobile });
        setLoading(false);
        return;
      }

      const result = await register(name, mobile, password);
      
      if (result.success) {
        console.log('Registration successful, navigating to dashboard');
        navigate('/dashboard');
      } else {
        setError(result.message || 'Registration failed');
        errorLogger.logError(result.message || 'Registration failed', 'Register API Call', { 
          name, 
          mobile,
          success: result.success 
        });
      }
    } catch (err) {
      // Provide more specific error messages for network issues
      if (err.message.includes('Network Error')) {
        setError('Unable to connect to the server. Please check your internet connection and try again later.');
      } else if (err.response?.status === 409) {
        setError('A user with this mobile number already exists.');
      } else if (err.response?.status === 400) {
        setError(err.response.data?.error || 'Invalid input data provided.');
      } else {
        setError(err.response?.data?.error || err.message || 'Registration failed');
      }
      
      errorLogger.logError(err, 'Register Function Error', { 
        name, 
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
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;