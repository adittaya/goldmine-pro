import React from 'react';

const TrustBadge = ({ type = 'security', children }) => {
  const badgeStyles = {
    security: 'bg-blue-100 text-blue-800',
    verified: 'bg-green-100 text-green-800',
    premium: 'bg-purple-100 text-purple-800',
    trusted: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className={`inline-flex items-center gap-xs px-sm py-xs rounded-full text-xs font-semibold ${badgeStyles[type]}`}>
      {children}
    </div>
  );
};

export default TrustBadge;