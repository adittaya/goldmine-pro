import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaMoneyBillWave, FaWallet, FaUser, FaEllipsisH } from 'react-icons/fa';

const MobileNav = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'Home' },
    { path: '/plans', icon: <FaMoneyBillWave />, label: 'Plans' },
    { path: '/recharge', icon: <FaWallet />, label: 'Wallet' },
    { path: '/profile', icon: <FaUser />, label: 'Profile' },
    { path: '/more', icon: <FaEllipsisH />, label: 'More' },
  ];

  return (
    <div className="mobile-nav">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
        >
          <div className="mobile-nav-icon">{item.icon}</div>
          <span className="mobile-nav-label">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default MobileNav;