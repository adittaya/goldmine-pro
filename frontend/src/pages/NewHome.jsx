import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Testimonials from '../components/Testimonials';
import SecurityFeatures from '../components/SecurityFeatures';
import TrustBadge from '../components/TrustBadge';
import { FaArrowRight, FaShieldAlt, FaChartLine, FaRupeeSign, FaCheckCircle, FaStar, FaUsers, FaMoneyBillWave } from 'react-icons/fa';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <FaChartLine className="text-primary" size={24} />,
      title: 'Daily Income',
      description: 'Earn daily returns on your investments automatically'
    },
    {
      icon: <FaRupeeSign className="text-success" size={24} />,
      title: 'High Returns',
      description: 'Get up to 32% daily returns on our premium plans'
    },
    {
      icon: <FaShieldAlt className="text-warning" size={24} />,
      title: 'Secure & Safe',
      description: 'Enterprise-grade security for your investments'
    }
  ];

  const plans = [
    { name: 'Starter Plan', price: '₹500', daily: '₹50', return: '₹650' },
    { name: 'Growth Plan', price: '₹1000', daily: '₹120', return: '₹2200' },
    { name: 'Premium Plan', price: '₹5000', daily: '₹700', return: '₹15500' }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users', icon: <FaUsers /> },
    { number: '₹50M+', label: 'Invested', icon: <FaMoneyBillWave /> },
    { number: '4.9★', label: 'User Rating', icon: <FaStar /> },
    { number: '24/7', label: 'Support', icon: <FaShieldAlt /> }
  ];

  return (
    <div className="app-layout">
      <div className="main-content">
        {/* Hero Section */}
        <div className={`card mb-lg ${isVisible ? 'fade-in' : ''}`}>
          <div className="text-center py-xl">
            <div className="mb-lg">
              <TrustBadge type="premium">
                🏆 #1 INVESTMENT PLATFORM
              </TrustBadge>
            </div>
            
            <h1 className="font-extrabold text-3xl mb-lg bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              Goldmine Pro
            </h1>
            <p className="text-lg text-secondary mb-xl">
              Your trusted platform for daily investment returns
            </p>
            
            <div className="security-badge mb-lg">
              <FaShieldAlt /> SECURE INVESTMENTS
            </div>
            
            {!user ? (
              <div className="grid grid-cols-1 gap-md">
                <Link to="/login" className="btn btn-primary btn-lg">
                  Login to Dashboard <FaArrowRight className="ml-sm" />
                </Link>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Create Account
                </Link>
              </div>
            ) : (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard <FaArrowRight className="ml-sm" />
              </Link>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-md mb-xl">
          {stats.map((stat, index) => (
            <div key={index} className="card text-center py-lg">
              <div className="text-2xl font-bold text-primary mb-sm">{stat.number}</div>
              <div className="text-sm text-tertiary">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Security Features */}
        <SecurityFeatures />

        {/* Features */}
        <div className="mb-xl">
          <h2 className="font-bold text-xl mb-lg text-center">Why Choose Goldmine Pro?</h2>
          <div className="grid grid-cols-1 gap-lg">
            {features.map((feature, index) => (
              <div key={index} className="card flex items-start gap-md">
                <div className="p-md bg-primary-50 rounded-full">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-sm">{feature.title}</h3>
                  <p className="text-secondary">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <Testimonials />

        {/* Popular Plans */}
        <div className="mb-xl">
          <div className="flex items-center justify-between mb-lg">
            <h2 className="font-bold text-xl">Popular Plans</h2>
            <Link to={user ? '/plans' : '/register'} className="text-primary font-semibold">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-md">
            {plans.map((plan, index) => (
              <div key={index} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <p className="text-2xl font-bold text-primary mt-sm">₹{plan.price}</p>
                    <p className="text-success font-semibold">₹{plan.daily}/day</p>
                  </div>
                  <div className="text-center">
                    <p className="text-success font-bold text-xl">₹{plan.return}</p>
                    <p className="text-xs text-tertiary">Total Return</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="card text-center py-xl">
          <h3 className="font-bold text-xl mb-md">Ready to Start Earning?</h3>
          <p className="text-secondary mb-lg">
            Join thousands of investors earning daily returns
          </p>
          
          {!user ? (
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Investing Now
            </Link>
          ) : (
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;