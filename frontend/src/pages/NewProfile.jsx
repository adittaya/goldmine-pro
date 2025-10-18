import React, { useState, useEffect } from 'react';
import { userAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import TrustBadge from '../components/TrustBadge';
import { FaUser, FaMobile, FaClock, FaCheckCircle, FaShareAlt } from 'react-icons/fa';

const Profile = () => {
  const { user: currentUser, token } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setUser(response.data.user);
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile data');
      setLoading(false);
    }
  };

  const copyReferralLink = async () => {
    try {
      const response = await userAPI.getReferral();
      navigator.clipboard.writeText(response.data.referralLink);
      alert('Referral link copied to clipboard!');
    } catch (err) {
      alert('Failed to get referral link');
    }
  };

  if (loading) return (
    <div className="app-layout">
      <Header title="Profile" />
      <div className="main-content">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="app-layout">
      <Header title="Profile" />
      <div className="main-content">
        <div className="error">{error}</div>
      </div>
    </div>
  );

  const joinDate = new Date(user?.created_at).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="app-layout">
      <Header title="Profile" />
      <div className="main-content">
        {/* Profile Header */}
        <div className="card mb-lg text-center">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-primary font-bold text-2xl mx-auto mb-md">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="font-bold text-xl mb-sm">{user?.name}</h2>
          <p className="text-secondary mb-md">+91 {user?.mobile}</p>
          
          <div className="flex flex-wrap justify-center gap-sm mb-lg">
            <TrustBadge type="verified">Verified User</TrustBadge>
            <TrustBadge type="security">Secure Account</TrustBadge>
          </div>
        </div>

        {/* Account Info */}
        <div className="card mb-lg">
          <h3 className="font-bold text-lg mb-lg">Account Information</h3>
          
          <div className="space-y-lg">
            <div className="flex items-center justify-between py-sm border-b border-tertiary">
              <div className="flex items-center gap-sm">
                <FaUser className="text-tertiary" />
                <span className="text-secondary">Name</span>
              </div>
              <span className="font-medium">{user?.name}</span>
            </div>
            
            <div className="flex items-center justify-between py-sm border-b border-tertiary">
              <div className="flex items-center gap-sm">
                <FaMobile className="text-tertiary" />
                <span className="text-secondary">Mobile</span>
              </div>
              <span className="font-medium">+91 {user?.mobile}</span>
            </div>
            
            <div className="flex items-center justify-between py-sm border-b border-tertiary">
              <div className="flex items-center gap-sm">
                <FaClock className="text-tertiary" />
                <span className="text-secondary">Joined</span>
              </div>
              <span className="font-medium">{joinDate}</span>
            </div>
            
            {user?.last_login && (
              <div className="flex items-center justify-between py-sm">
                <div className="flex items-center gap-sm">
                  <FaCheckCircle className="text-tertiary" />
                  <span className="text-secondary">Last Login</span>
                </div>
                <span className="font-medium">
                  {new Date(user.last_login).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="card mb-lg">
          <h3 className="font-bold text-lg mb-lg">Financial Summary</h3>
          
          <div className="grid grid-cols-2 gap-lg">
            <div className="text-center p-lg bg-tertiary rounded-lg">
              <div className="text-2xl font-bold text-primary">₹{user?.total_invested?.toFixed(2)}</div>
              <div className="text-sm text-tertiary">Total Invested</div>
            </div>
            
            <div className="text-center p-lg bg-tertiary rounded-lg">
              <div className="text-2xl font-bold text-success">₹{user?.total_withdrawn?.toFixed(2)}</div>
              <div className="text-sm text-tertiary">Withdrawn</div>
            </div>
          </div>
        </div>

        {/* Referral */}
        <div className="card">
          <h3 className="font-bold text-lg mb-lg">Share & Earn</h3>
          
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-lg mb-lg">
            <h4 className="font-semibold mb-md">Your Referral Link</h4>
            <button 
              className="btn btn-primary btn-block"
              onClick={copyReferralLink}
            >
              <FaShareAlt className="mr-sm" /> Copy Referral Link
            </button>
          </div>
          
          <p className="text-sm text-tertiary text-center">
            Earn rewards when others join using your referral link
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;