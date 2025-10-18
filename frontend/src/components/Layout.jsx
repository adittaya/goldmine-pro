import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { FaWallet, FaChartLine, FaShoppingCart, FaMoneyBillWave, FaHistory, FaUser, FaSignOutAlt, FaBars, FaTimes, FaRupeeSign } from 'react-icons/fa';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [balance, setBalance] = useState(user?.balance || 0);
  const location = useLocation();

  // Update balance when user changes
  useEffect(() => {
    if (user) {
      setBalance(user.balance);
    }
  }, [user]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

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
      <div className="mobile-menu-button" onClick={toggleSidebar} aria-label="Toggle menu">
        <FaBars />
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="sidebar-header">
          <h2>Goldmine Pro</h2>
          <button className="close-btn" onClick={toggleSidebar} aria-label="Close menu">
            <FaTimes />
          </button>
        </div>

        <div className="user-info">
          <h3>{user?.name || 'User'}</h3>
          <p><FaRupeeSign /> {balance?.toFixed(2) || '0.00'}</p>
        </div>

        <nav className="nav-menu">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={isActive(item.path) ? 'active' : ''}
                  onClick={() => setSidebarOpen(false)}
                  aria-label={item.label}
                >
                  <span className="icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="logout-section">
          <button onClick={logout} aria-label="Logout">
            <span className="icon"><FaSignOutAlt /></span>
            <span>Logout</span>
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
        <div className="overlay" onClick={toggleSidebar} aria-hidden="true"></div>
      )}
    </div>
  );
};

export default Layout;