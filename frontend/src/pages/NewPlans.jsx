import React, { useState, useEffect } from 'react';
import { plansAPI } from '../utils/api';
import { userAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import PlanCard from '../components/PlanCard';
import { FaWallet, FaCheckCircle } from 'react-icons/fa';

const Plans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [userPlans, setUserPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPlans();
    fetchUserPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await plansAPI.getPlans();
      setPlans(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load plans');
      setLoading(false);
    }
  };

  const fetchUserPlans = async () => {
    try {
      const response = await userAPI.getDashboard();
      setUserPlans(response.data.activePlans || []);
    } catch (err) {
      console.error('Failed to load user plans');
    }
  };

  const handlePurchase = async (plan) => {
    if (user.balance < plan.price) {
      alert('Insufficient balance to purchase this plan');
      return;
    }

    // Check if user already has an active plan this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const hasActivePlanThisMonth = userPlans.some(p => 
      new Date(p.created_at) >= startOfMonth && p.status === 'active'
    );

    if (hasActivePlanThisMonth) {
      alert('You already have an active plan this month. You can only purchase one plan per month.');
      return;
    }

    setSelectedPlan(plan);
    setShowModal(true);
  };

  const confirmPurchase = async () => {
    if (!selectedPlan) return;

    try {
      const response = await plansAPI.purchasePlan(selectedPlan.id);
      alert('Plan purchased successfully!');
      setShowModal(false);
      setSelectedPlan(null);
      fetchUserPlans(); // Refresh user plans
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to purchase plan');
    }
  };

  if (loading) return (
    <div className="app-layout">
      <Header title="Investment Plans" showBalance={true} />
      <div className="main-content">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="app-layout">
      <Header title="Investment Plans" showBalance={true} />
      <div className="main-content">
        <div className="error">{error}</div>
      </div>
    </div>
  );

  // Check if user already has an active plan this month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const hasActivePlanThisMonth = userPlans.some(p => 
    new Date(p.created_at) >= startOfMonth && p.status === 'active'
  );

  return (
    <div className="app-layout">
      <Header title="Investment Plans" showBalance={true} />
      <div className="main-content">
        <div className="card mb-lg">
          <div className="flex items-center justify-between mb-md">
            <h2 className="font-bold text-lg">Your Balance</h2>
            <div className="flex items-center gap-sm">
              <FaWallet className="text-primary" />
              <span className="font-semibold text-lg">₹{user?.balance?.toFixed(2)}</span>
            </div>
          </div>
          
          {hasActivePlanThisMonth && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-md mb-md">
              <div className="flex items-center gap-sm">
                <FaCheckCircle className="text-green-600" />
                <span className="text-green-800 font-medium">You already have an active plan this month</span>
              </div>
              <p className="text-green-700 text-sm mt-sm">
                You can only purchase one investment plan per month.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-lg">
          {plans.map((plan) => {
            const isDisabled = hasActivePlanThisMonth;
            return (
              <PlanCard 
                key={plan.id} 
                plan={plan} 
                onPurchase={handlePurchase}
                disabled={isDisabled}
              />
            );
          })}
        </div>

        {/* Purchase Confirmation Modal */}
        {showModal && selectedPlan && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Confirm Investment</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  ×
                </button>
              </div>
              
              <div className="text-center mb-lg">
                <div className="text-2xl font-bold text-primary mb-sm">₹{selectedPlan.price}</div>
                <div className="text-lg font-semibold">{selectedPlan.name}</div>
                <div className="text-tertiary mt-md">
                  Daily Income: ₹{selectedPlan.daily_income} | Duration: {selectedPlan.duration_days} days
                </div>
                <div className="text-success font-semibold mt-sm">
                  Total Return: ₹{selectedPlan.total_return}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-md mb-lg">
                <div className="text-center p-md bg-tertiary rounded-lg">
                  <div className="text-2xl font-bold text-success">₹{selectedPlan.daily_income}</div>
                  <div className="text-sm text-tertiary">Daily Income</div>
                </div>
                <div className="text-center p-md bg-tertiary rounded-lg">
                  <div className="text-2xl font-bold text-primary">{selectedPlan.duration_days}</div>
                  <div className="text-sm text-tertiary">Days</div>
                </div>
              </div>
              
              <button 
                className="btn btn-primary btn-block" 
                onClick={confirmPurchase}
              >
                Confirm Investment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Plans;