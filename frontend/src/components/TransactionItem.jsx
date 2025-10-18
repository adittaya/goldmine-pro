import React from 'react';

const TransactionItem = ({ transaction }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'plan_purchase':
        return 'text-danger';
      case 'recharge':
        return 'text-success';
      case 'withdrawal':
        return 'text-danger';
      case 'daily_income':
        return 'text-success';
      default:
        return 'text-secondary';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'plan_purchase':
        return '💳';
      case 'recharge':
        return '⬆️';
      case 'withdrawal':
        return '⬇️';
      case 'daily_income':
        return '💰';
      default:
        return '📝';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'plan_purchase':
        return 'Plan Purchase';
      case 'recharge':
        return 'Recharge';
      case 'withdrawal':
        return 'Withdrawal';
      case 'daily_income':
        return 'Daily Income';
      default:
        return type.replace('_', ' ');
    }
  };

  return (
    <div className="list-item list-item-interactive">
      <div className="list-item-content">
        <h4 className="list-item-title">
          {getTypeIcon(transaction.type)} {getTypeText(transaction.type)}
        </h4>
        <p className="list-item-subtitle">
          {transaction.description || transaction.type.replace('_', ' ')}
        </p>
        <p className="text-xs text-tertiary mt-xs">
          {new Date(transaction.created_at).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
      <div className="list-item-meta">
        <div className={`font-semibold ${getTypeColor(transaction.type)}`}>
          {transaction.type === 'recharge' || transaction.type === 'daily_income' ? '+' : '-'}₹{transaction.amount?.toFixed(2)}
        </div>
        <div className="text-xs text-tertiary mt-xs">
          Balance: ₹{transaction.balance_after?.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;