import React from 'react';

const StatCard = ({ title, value, icon, color = 'primary', trend, subtitle }) => {
  const colorClasses = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
    secondary: 'text-secondary'
  };

  return (
    <div className="card stat-card gravity-card premium-glow">
      <div className="flex items-center justify-between">
        <div>
          <p className="stat-label">{title}</p>
          <p className="stat-value">{value}</p>
          {subtitle && <p className="text-sm text-tertiary mt-xs">{subtitle}</p>}
        </div>
        <div className={`${colorClasses[color]} text-2xl`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className={`text-sm mt-xs ${trend.startsWith('+') ? 'text-success' : 'text-danger'}`}>
          {trend}
        </div>
      )}
    </div>
  );
};

export default StatCard;