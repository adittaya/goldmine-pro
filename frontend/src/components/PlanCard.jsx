import React from 'react';

const PlanCard = ({ plan, onPurchase, disabled = false }) => {
  return (
    <div className="card card-interactive" onClick={() => !disabled && onPurchase(plan)}>
      <div className="text-center">
        <h3 className="font-bold text-lg mb-sm">{plan.name}</h3>
        <div className="text-3xl font-bold text-primary mb-md">₹{plan.price}</div>
        <div className="grid grid-cols-2 gap-md mb-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">₹{plan.daily_income}</div>
            <div className="text-sm text-tertiary">Daily Income</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{plan.duration_days}</div>
            <div className="text-sm text-tertiary">Days</div>
          </div>
        </div>
        <div className="text-center mb-md">
          <div className="text-lg font-semibold text-success">₹{plan.total_return}</div>
          <div className="text-xs text-tertiary">Total Return</div>
        </div>
        <button 
          className={`btn btn-primary btn-block ${disabled ? 'opacity-50' : ''}`}
          disabled={disabled}
        >
          {disabled ? 'Purchased' : 'Invest Now'}
        </button>
      </div>
    </div>
  );
};

export default PlanCard;