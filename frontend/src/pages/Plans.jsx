import React, { useState, useEffect } from 'react';
import { plansAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [confirmPurchase, setConfirmPurchase] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await plansAPI.getPlans();
      setPlans(response.data.plans);
      setLoading(false);
    } catch (err) {
      setError('Failed to load plans');
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan) => {
    if (user.balance < plan.price) {
      alert('Insufficient balance to purchase this plan');
      return;
    }
    setSelectedPlan(plan);
    setConfirmPurchase(true);
  };

  const confirmPurchasePlan = async () => {
    if (!selectedPlan) return;

    try {
      await plansAPI.purchasePlan(selectedPlan.id);
      alert('Plan purchased successfully!');
      setConfirmPurchase(false);
      setSelectedPlan(null);
      // Refresh user data
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to purchase plan');
    }
  };

  if (loading) return <div className="loading">Loading plans...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="plans">
      <h1>Investment Plans</h1>
      <p className="balance-info">Your Balance: ₹{user?.balance?.toFixed(2)}</p>
      
      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.id} className="plan-card">
            <h3>{plan.name}</h3>
            <div className="plan-price">₹{plan.price}</div>
            <div className="plan-features">
              <p><strong>Daily Income:</strong> ₹{plan.daily_income}</p>
              <p><strong>Duration:</strong> {plan.duration_days} days</p>
              <p><strong>Total Return:</strong> ₹{plan.total_return}</p>
            </div>
            <button 
              className="btn btn-primary" 
              onClick={() => handlePlanSelect(plan)}
              disabled={user.balance < plan.price}
            >
              {user.balance < plan.price ? 'Insufficient Balance' : 'Purchase Plan'}
            </button>
          </div>
        ))}
      </div>

      {confirmPurchase && selectedPlan && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Purchase</h3>
            <p>Are you sure you want to purchase the <strong>{selectedPlan.name}</strong> plan for ₹{selectedPlan.price}?</p>
            <p>This will reduce your wallet balance by ₹{selectedPlan.price}.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setConfirmPurchase(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={confirmPurchasePlan}>
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;