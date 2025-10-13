import React, { useState } from 'react';
import { transactionAPI } from '../utils/api';
import { FaQrcode, FaCopy } from 'react-icons/fa';

const Recharge = () => {
  const [amount, setAmount] = useState('');
  const [utr, setUtr] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [upiId] = useState('7047571829@yespop');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    alert('UPI ID copied to clipboard!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await transactionAPI.createRecharge(parseFloat(amount), utr, 'upi');
      setSuccess(response.data.message);
      setAmount('');
      setUtr('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create recharge request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recharge">
      <h1>Recharge Wallet</h1>
      
      <div className="recharge-methods">
        <div className="recharge-method">
          <h3>UPI Payment</h3>
          <p>Pay using UPI ID</p>
          
          <div className="upi-info">
            <div className="upi-id">
              <p><strong>UPI ID:</strong> {upiId}</p>
              <button className="copy-btn" onClick={copyToClipboard}>
                <FaCopy /> Copy
              </button>
            </div>
            
            {/* QR Code placeholder - you would add your actual QR image here */}
            <div className="qr-section">
              <p>Scan QR Code for payment:</p>
              <div className="qr-placeholder">
                <p>QR Code Image</p>
                <p className="qr-instruction">QR code for {upiId}</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="recharge-form">
            <div className="form-group">
              <label htmlFor="amount">Amount (₹)</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
                placeholder="Enter recharge amount"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="utr">UTR Number</label>
              <input
                type="text"
                id="utr"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                required
                placeholder="Enter UTR from your transaction"
              />
              <p className="form-help">UTR is a Unique Transaction Reference from your bank or UPI app</p>
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Submit Recharge Request'}
            </button>
          </form>
        </div>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Recharge;