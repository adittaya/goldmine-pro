import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const Withdrawal = () => {
  const { user } = useAuth();
  const [method, setMethod] = useState('bank'); // 'bank' or 'upi'
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);

  useEffect(() => {
    fetchWithdrawalHistory();
  }, []);

  const fetchWithdrawalHistory = async () => {
    try {
      const response = await transactionAPI.getUserWithdrawals();
      setWithdrawalHistory(response.data);
    } catch (err) {
      setError('Failed to load withdrawal history');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const withdrawalData = {
        amount: parseFloat(amount),
        method,
      };

      if (method === 'bank') {
        withdrawalData.bank_name = bankName;
        withdrawalData.account_holder_name = accountHolderName;
        withdrawalData.ifsc_code = ifscCode;
        withdrawalData.account_number = accountNumber;
      } else if (method === 'upi') {
        withdrawalData.upi_id = upiId;
      }

      const response = await transactionAPI.createWithdrawal(withdrawalData);
      setSuccess(response.data.message);
      // Reset form
      setAmount('');
      setBankName('');
      setAccountHolderName('');
      setIfscCode('');
      setAccountNumber('');
      setUpiId('');
      
      // Refresh history
      fetchWithdrawalHistory();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  // Calculate GST (18%)
  const gstAmount = amount ? (parseFloat(amount) * 0.18).toFixed(2) : 0;
  const netAmount = amount ? (parseFloat(amount) - parseFloat(gstAmount)).toFixed(2) : 0;

  return (
    <div className="withdrawal">
      <h1>Withdraw Funds</h1>
      
      <div className="balance-info">
        <p>Available Balance: ₹{user?.balance?.toFixed(2)}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="withdrawal-form">
        <div className="form-group">
          <label htmlFor="method">Withdrawal Method</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="method"
                value="bank"
                checked={method === 'bank'}
                onChange={() => setMethod('bank')}
              />
              Bank Transfer
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="method"
                value="upi"
                checked={method === 'upi'}
                onChange={() => setMethod('upi')}
              />
              UPI Transfer
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (₹)</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            max={user?.balance}
            required
            placeholder="Enter withdrawal amount"
          />
          {amount && (
            <div className="amount-breakdown">
              <p>Original Amount: ₹{amount}</p>
              <p>GST (18%): ₹{gstAmount}</p>
              <p><strong>Net Amount: ₹{netAmount}</strong></p>
            </div>
          )}
        </div>

        {method === 'bank' && (
          <>
            <div className="form-group">
              <label htmlFor="bankName">Bank Name</label>
              <input
                type="text"
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
                placeholder="Enter bank name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="accountHolderName">Account Holder Name</label>
              <input
                type="text"
                id="accountHolderName"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                required
                placeholder="Enter account holder name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="ifscCode">IFSC Code</label>
              <input
                type="text"
                id="ifscCode"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                required
                placeholder="Enter IFSC code"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="accountNumber">Account Number</label>
              <input
                type="text"
                id="accountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                placeholder="Enter account number"
              />
            </div>
          </>
        )}

        {method === 'upi' && (
          <div className="form-group">
            <label htmlFor="upiId">UPI ID</label>
            <input
              type="text"
              id="upiId"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              required
              placeholder="Enter UPI ID (e.g., user@upi)"
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading || user?.balance < amount}>
          {loading ? 'Processing...' : 'Submit Withdrawal Request'}
        </button>
      </form>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="withdrawal-history">
        <h2>Withdrawal History</h2>
        {withdrawalHistory.length > 0 ? (
          <div className="history-list">
            {withdrawalHistory.map((withdrawal) => (
              <div key={withdrawal.id} className="history-item">
                <div className="history-info">
                  <p className="amount">₹{withdrawal.amount}</p>
                  <p className="method">{withdrawal.method}</p>
                  <p className="date">{new Date(withdrawal.created_at).toLocaleDateString()}</p>
                </div>
                <div className={`status status-${withdrawal.status}`}>
                  {withdrawal.status}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No withdrawal history</p>
        )}
      </div>
    </div>
  );
};

export default Withdrawal;