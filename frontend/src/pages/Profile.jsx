import React, { useState, useEffect } from 'react';
import { userAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user: currentUser, loading } = useAuth();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchUserProfile();
      fetchReferralLink();
    }
  }, [currentUser]);

  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setUser(response.data.user);
      setName(response.data.user.name);
      setLoadingProfile(false);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setLoadingProfile(false);
    }
  };

  const fetchReferralLink = async () => {
    try {
      const response = await userAPI.getReferral();
      setReferralLink(response.data.referralLink);
    } catch (err) {
      console.error('Failed to get referral link:', err);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await userAPI.updateProfile(name);
      setUser(response.data.user);
      setEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };

  if (loading || loadingProfile) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile">
      <h1>Profile</h1>
      
      <div className="profile-card">
        <div className="profile-info">
          {editing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <div className="profile-field">
                <label>Name:</label>
                <p>{user?.name}</p>
              </div>
              <div className="profile-field">
                <label>Mobile:</label>
                <p>{user?.mobile}</p>
              </div>
              <div className="profile-field">
                <label>Balance:</label>
                <p>₹{user?.balance?.toFixed(2)}</p>
              </div>
              <div className="profile-field">
                <label>Total Invested:</label>
                <p>₹{user?.total_invested?.toFixed(2)}</p>
              </div>
              <div className="profile-field">
                <label>Total Withdrawn:</label>
                <p>₹{user?.total_withdrawn?.toFixed(2)}</p>
              </div>
              <div className="profile-field">
                <label>Member Since:</label>
                <p>{new Date(user?.created_at).toLocaleDateString()}</p>
              </div>
              <button className="btn btn-primary" onClick={handleEdit}>Edit Profile</button>
            </>
          )}
        </div>
      </div>

      <div className="referral-section">
        <h2>Share & Earn</h2>
        <p>Share your referral link and earn when others join!</p>
        <div className="referral-link-section">
          <input 
            type="text" 
            value={referralLink} 
            readOnly 
            className="referral-input"
          />
          <button className="btn btn-secondary" onClick={copyReferralLink}>
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;