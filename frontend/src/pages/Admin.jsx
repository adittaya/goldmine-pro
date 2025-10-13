import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../utils/api';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('recharges'); // 'recharges' or 'withdrawals'
  const [recharges, setRecharges] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rechargesRes, withdrawalsRes] = await Promise.all([
        transactionAPI.getAllRecharges(),
        transactionAPI.getAllWithdrawals()
      ]);
      
      setRecharges(rechargesRes.data);
      setWithdrawals(withdrawalsRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const handleApproveRecharge = async (rechargeId) => {
    try {
      await transactionAPI.approveRecharge(rechargeId);
      fetchData(); // Refresh data
    } catch (err) {
      alert('Failed to approve recharge');
    }
  };

  const handleRejectRecharge = async (rechargeId) => {
    try {
      await transactionAPI.rejectRecharge(rechargeId);
      fetchData(); // Refresh data
    } catch (err) {
      alert('Failed to reject recharge');
    }
  };

  const handleApproveWithdrawal = async (withdrawalId) => {
    try {
      await transactionAPI.approveWithdrawal(withdrawalId);
      fetchData(); // Refresh data
    } catch (err) {
      alert('Failed to approve withdrawal');
    }
  };

  const handleRejectWithdrawal = async (withdrawalId) => {
    try {
      await transactionAPI.rejectWithdrawal(withdrawalId);
      fetchData(); // Refresh data
    } catch (err) {
      alert('Failed to reject withdrawal');
    }
  };

  if (loading) return <div className="loading">Loading admin data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin">
      <h1>Admin Panel</h1>
      
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'recharges' ? 'active' : ''}`}
          onClick={() => setActiveTab('recharges')}
        >
          Recharge Requests
        </button>
        <button 
          className={`tab-btn ${activeTab === 'withdrawals' ? 'active' : ''}`}
          onClick={() => setActiveTab('withdrawals')}
        >
          Withdrawal Requests
        </button>
      </div>

      {activeTab === 'recharges' && (
        <div className="admin-section">
          <h2>Recharge Requests</h2>
          <div className="requests-grid">
            {recharges.map((recharge) => (
              <div key={recharge.id} className="request-card">
                <div className="request-header">
                  <h3>{recharge.users?.name || 'Unknown'}</h3>
                  <p className="mobile">{recharge.users?.mobile || 'N/A'}</p>
                </div>
                <div className="request-details">
                  <p><strong>Amount:</strong> ₹{recharge.amount}</p>
                  <p><strong>UTR:</strong> {recharge.utr}</p>
                  <p><strong>Method:</strong> {recharge.payment_method}</p>
                  <p><strong>Status:</strong> <span className={`status-${recharge.status}`}>{recharge.status}</span></p>
                  <p><strong>Date:</strong> {new Date(recharge.created_at).toLocaleString()}</p>
                </div>
                {recharge.status === 'pending' && (
                  <div className="request-actions">
                    <button 
                      className="btn btn-success" 
                      onClick={() => handleApproveRecharge(recharge.id)}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleRejectRecharge(recharge.id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'withdrawals' && (
        <div className="admin-section">
          <h2>Withdrawal Requests</h2>
          <div className="requests-grid">
            {withdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="request-card">
                <div className="request-header">
                  <h3>{withdrawal.users?.name || 'Unknown'}</h3>
                  <p className="mobile">{withdrawal.users?.mobile || 'N/A'}</p>
                </div>
                <div className="request-details">
                  <p><strong>Amount:</strong> ₹{withdrawal.amount}</p>
                  <p><strong>Net Amount:</strong> ₹{withdrawal.net_amount}</p>
                  <p><strong>GST:</strong> ₹{withdrawal.gst_amount}</p>
                  <p><strong>Method:</strong> {withdrawal.method}</p>
                  {withdrawal.method === 'bank' && (
                    <>
                      <p><strong>Bank:</strong> {withdrawal.bank_name}</p>
                      <p><strong>Account Holder:</strong> {withdrawal.account_holder_name}</p>
                      <p><strong>IFSC:</strong> {withdrawal.ifsc_code}</p>
                      <p><strong>Account No:</strong> {withdrawal.account_number}</p>
                    </>
                  )}
                  {withdrawal.method === 'upi' && (
                    <p><strong>UPI ID:</strong> {withdrawal.upi_id}</p>
                  )}
                  <p><strong>Status:</strong> <span className={`status-${withdrawal.status}`}>{withdrawal.status}</span></p>
                  <p><strong>Date:</strong> {new Date(withdrawal.created_at).toLocaleString()}</p>
                </div>
                {withdrawal.status === 'pending' && (
                  <div className="request-actions">
                    <button 
                      className="btn btn-success" 
                      onClick={() => handleApproveWithdrawal(withdrawal.id)}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleRejectWithdrawal(withdrawal.id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;