import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="home-container">
      <div className={`hero ${isVisible ? 'fade-in' : ''}`}>
        <div className="hero-content">
          <h1>Goldmine Pro</h1>
          <p>Your trusted investment platform for daily returns</p>
          
          {!user ? (
            <div className="auth-options">
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Register
              </Link>
            </div>
          ) : (
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>💰 Daily Income</h3>
          <p>Get daily returns on your investments automatically</p>
        </div>
        <div className="feature-card">
          <h3>📱 Mobile First</h3>
          <p>Optimized for mobile experience</p>
        </div>
        <div className="feature-card">
          <h3>🔒 Secure</h3>
          <p>Enterprise-grade security for your investments</p>
        </div>
      </div>

      <div className="investment-plans-preview">
        <h2>Popular Investment Plans</h2>
        <div className="plans-grid">
          <div className="plan-card">
            <h3>Starter Plan</h3>
            <p className="price">₹500</p>
            <p>Daily Income: ₹50</p>
            <p>Duration: 10 Days</p>
            <p>Total Return: ₹650</p>
          </div>
          <div className="plan-card">
            <h3>Growth Plan</h3>
            <p className="price">₹1000</p>
            <p>Daily Income: ₹120</p>
            <p>Duration: 10 Days</p>
            <p>Total Return: ₹2200</p>
          </div>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => user ? navigate('/plans') : navigate('/register')}
        >
          {user ? 'View All Plans' : 'Get Started'}
        </button>
      </div>

      <div className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <p>"This platform has transformed my financial life. Daily returns are consistent!"</p>
            <p className="user">- Rajesh K.</p>
          </div>
          <div className="testimonial-card">
            <p>"Easy to use and reliable. The withdrawal process is seamless."</p>
            <p className="user">- Priya M.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;