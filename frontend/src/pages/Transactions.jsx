import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../utils/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await transactionAPI.getUserTransactions();
      setTransactions(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load transactions');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading transactions...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="transactions">
      <h1>Transaction History</h1>
      
      {transactions.length > 0 ? (
        <div className="transactions-list">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-header">
                <div className="transaction-type">
                  {transaction.type === 'plan_purchase' && 'Plan Purchase'}
                  {transaction.type === 'recharge' && 'Wallet Recharge'}
                  {transaction.type === 'withdrawal' && 'Withdrawal'}
                  {transaction.type === 'daily_income' && 'Daily Income'}
                </div>
                <div className={`transaction-amount ${transaction.type === 'recharge' || transaction.type === 'daily_income' ? 'positive' : 'negative'}`}>
                  {transaction.type === 'recharge' || transaction.type === 'daily_income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                </div>
              </div>
              
              <div className="transaction-details">
                <p><strong>Description:</strong> {transaction.description}</p>
                <p><strong>Balance Before:</strong> ₹{transaction.balance_before.toFixed(2)}</p>
                <p><strong>Balance After:</strong> ₹{transaction.balance_after.toFixed(2)}</p>
                <p><strong>Date:</strong> {new Date(transaction.created_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No transactions found</p>
      )}
    </div>
  );
};

export default Transactions;