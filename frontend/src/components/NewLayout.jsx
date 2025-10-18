import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaChartBar, 
  FaWallet, 
  FaShoppingCart, 
  FaMoneyBillWave, 
  FaHistory, 
  FaUser, 
  FaSignOutAlt, 
  FaHome,
  FaCog
} from 'react-icons/fa';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [showBottomNav, setShowBottomNav] = useState(true);
  const location = useLocation();

  // Hide bottom nav on auth pages
  useEffect(() => {
    const authPages = ['/login', '/register'];
    setShowBottomNav(!authPages.includes(location.pathname));
  }, [location.pathname]);

  const navItems = [
    { path: '/', label: 'Home', icon: <FaHome size={20} /> },
    { path: '/dashboard', label: 'Dashboard', icon: <FaChartBar size={20} /> },
    { path: '/plans', label: 'Plans', icon: <FaShoppingCart size={20} /> },
    { path: '/recharge', label: 'Recharge', icon: <FaWallet size={20} /> },
    { path: '/withdrawal', label: 'Withdraw', icon: <FaMoneyBillWave size={20} /> },
    { path: '/transactions', label: 'History', icon: <FaHistory size={20} /> },
    { path: '/profile', label: 'Profile', icon: <FaUser size={20} /> },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/home';
    }
    return location.pathname.startsWith(path);
  };

  if (!showBottomNav) {
    return (
      <div className="app-layout">
        <main className="main-content">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <main className="main-content">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            aria-label={item.label}
          >
            <div className="nav-icon">{item.icon}</div>
            <div className="nav-label">{item.label}</div>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;