import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { FaWallet, FaChartLine, FaShoppingCart, FaMoneyBillWave, FaHistory, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaChartLine /> },
    { path: '/plans', label: 'Invest Plans', icon: <FaShoppingCart /> },
    { path: '/recharge', label: 'Recharge', icon: <FaWallet /> },
    { path: '/withdrawal', label: 'Withdrawal', icon: <FaMoneyBillWave /> },
    { path: '/transactions', label: 'Transactions', icon: <FaHistory /> },
    { path: '/profile', label: 'Profile', icon: <FaUser /> },
  ];

  return (
    <div className="layout">
      {/* Mobile menu button */}
      <div className="mobile-menu-button" onClick={toggleSidebar}>
        <FaBars />
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Goldmine Pro</h2>
          <button className="close-btn" onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>

        <div className="user-info">
          <h3>{user?.name || 'User'}</h3>
          <p>Balance: ₹{user?.balance?.toFixed(2) || '0.00'}</p>
        </div>

        <nav className="nav-menu">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={isActive(item.path) ? 'active' : ''}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="logout-section">
          <button onClick={logout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="overlay" onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default Layout;