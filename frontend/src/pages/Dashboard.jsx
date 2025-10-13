import React, { useState, useEffect } from 'react';
import { userAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { FaWallet, FaChartLine, FaMoneyBillWave, FaHistory, FaShareAlt } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await userAPI.getDashboard();
      setDashboardData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
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

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FaWallet />
          </div>
          <div className="stat-info">
            <h3>Wallet Balance</h3>
            <p className="stat-value">₹{dashboardData?.user?.balance?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-info">
            <h3>Total Invested</h3>
            <p className="stat-value">₹{dashboardData?.user?.total_invested?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FaMoneyBillWave />
          </div>
          <div className="stat-info">
            <h3>Total Withdrawn</h3>
            <p className="stat-value">₹{dashboardData?.user?.total_withdrawn?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <button className="btn btn-primary" onClick={copyReferralLink}>
          <FaShareAlt /> Share Referral
        </button>
      </div>

      {dashboardData?.activePlans && dashboardData.activePlans.length > 0 && (
        <div className="active-plans">
          <h2>Your Active Plans</h2>
          <div className="plans-list">
            {dashboardData.activePlans.map((plan) => (
              <div key={plan.id} className="plan-item">
                <h4>{plan.plan_name}</h4>
                <p>Daily Income: ₹{plan.daily_income}</p>
                <p>Ends on: {new Date(plan.end_date).toLocaleDateString()}</p>
                <p>Status: <span className="status-active">{plan.status}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="recent-activity">
        <h2>Recent Transactions</h2>
        {dashboardData?.transactions && dashboardData.transactions.length > 0 ? (
          <div className="transactions-list">
            {dashboardData.transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <p className="transaction-type">{transaction.type.replace('_', ' ')}</p>
                  <p className="transaction-description">{transaction.description}</p>
                </div>
                <div className="transaction-amount">
                  {transaction.type === 'recharge' || transaction.type === 'daily_income' ? '+' : '-'}₹{transaction.amount}
                </div>
                <div className="transaction-date">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No recent transactions</p>
        )}
      </div>

      <div className="recent-withdrawals">
        <h2>Recent Withdrawals</h2>
        {dashboardData?.withdrawals && dashboardData.withdrawals.length > 0 ? (
          <div className="withdrawals-list">
            {dashboardData.withdrawals.slice(0, 3).map((withdrawal) => (
              <div key={withdrawal.id} className="withdrawal-item">
                <div className="withdrawal-info">
                  <p className="withdrawal-amount">₹{withdrawal.amount}</p>
                  <p className="withdrawal-status status-{withdrawal.status}">{withdrawal.status}</p>
                </div>
                <div className="withdrawal-date">
                  {new Date(withdrawal.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No recent withdrawals</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;