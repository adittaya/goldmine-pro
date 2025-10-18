import React, { useState, useEffect } from 'react';
import { userAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import TransactionItem from '../components/TransactionItem';
import { FaWallet, FaChartLine, FaMoneyBillWave, FaHistory, FaShareAlt, FaArrowUp, FaArrowDown } from 'react-icons/fa';

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

  if (loading) return (
    <div className="app-layout">
      <Header title="Dashboard" />
      <div className="main-content">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="app-layout">
      <Header title="Dashboard" />
      <div className="main-content">
        <div className="error">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="app-layout">
      <Header title="Dashboard" />
      <div className="main-content">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-lg mb-lg">
          <StatCard 
            title="Wallet Balance" 
            value={`₹${dashboardData?.user?.balance?.toFixed(2) || '0.00'}`}
            icon={<FaWallet />}
            color="primary"
          />
          <StatCard 
            title="Total Invested" 
            value={`₹${dashboardData?.user?.total_invested?.toFixed(2) || '0.00'}`}
            icon={<FaChartLine />}
            color="success"
          />
          <StatCard 
            title="Total Withdrawn" 
            value={`₹${dashboardData?.user?.total_withdrawn?.toFixed(2) || '0.00'}`}
            icon={<FaMoneyBillWave />}
            color="warning"
          />
        </div>

        {/* Quick Actions */}
        <div className="card mb-lg">
          <button 
            className="btn btn-primary btn-block"
            onClick={copyReferralLink}
          >
            <FaShareAlt /> Share Referral Link
          </button>
        </div>

        {/* Active Plans */}
        {dashboardData?.activePlans && dashboardData.activePlans.length > 0 && (
          <div className="card mb-lg">
            <h2 className="font-bold text-lg mb-md">Active Investment Plans</h2>
            {dashboardData.activePlans.map((plan) => (
              <div key={plan.id} className="list-item">
                <div className="list-item-content">
                  <h4 className="list-item-title">{plan.plan_name}</h4>
                  <p className="list-item-subtitle">
                    Daily: ₹{plan.daily_income} | Ends: {new Date(plan.end_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="list-item-meta">
                  <span className="text-success font-semibold">Active</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Transactions */}
        <div className="card">
          <h2 className="font-bold text-lg mb-md">Recent Transactions</h2>
          {dashboardData?.transactions && dashboardData.transactions.length > 0 ? (
            <div>
              {dashboardData.transactions.slice(0, 5).map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          ) : (
            <p className="text-secondary text-center py-lg">No recent transactions</p>
          )}
        </div>

        {/* Recent Withdrawals */}
        {dashboardData?.withdrawals && dashboardData.withdrawals.length > 0 && (
          <div className="card mt-lg">
            <h2 className="font-bold text-lg mb-md">Recent Withdrawals</h2>
            {dashboardData.withdrawals.slice(0, 3).map((withdrawal) => (
              <div key={withdrawal.id} className="list-item">
                <div className="list-item-content">
                  <h4 className="list-item-title">
                    <FaArrowDown /> ₹{withdrawal.amount}
                  </h4>
                  <p className="list-item-subtitle">
                    {new Date(withdrawal.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="list-item-meta">
                  <span className={`text-sm px-sm py-xs rounded-full ${
                    withdrawal.status === 'approved' ? 'bg-green-100 text-green-800' :
                    withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {withdrawal.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;