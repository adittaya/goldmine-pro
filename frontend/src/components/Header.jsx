import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaWallet } from 'react-icons/fa';

const Header = ({ title, showBalance = true, showBack = false, onBack }) => {
  const { user } = useAuth();

  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
      {showBalance && user && (
        <div className="header-actions">
          <div className="flex items-center gap-sm">
            <FaWallet className="text-primary" size={20} />
            <span className="font-semibold">₹{user.balance?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;