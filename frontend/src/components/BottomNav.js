import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNav, NavItem, Text } from '../styles/styledComponents';
import { FaHome, FaChartLine, FaWallet, FaHistory, FaUser } from 'react-icons/fa';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Define navigation items
  const navItems = [
    { path: '/', icon: <FaHome size={20} />, label: 'Home', exact: true },
    { path: '/dashboard', icon: <FaChartLine size={20} />, label: 'Dashboard', exact: false },
    { path: '/plans', icon: <FaWallet size={20} />, label: 'Plans', exact: false },
    { path: '/transactions', icon: <FaHistory size={20} />, label: 'Transactions', exact: false },
    { path: '/profile', icon: <FaUser size={20} />, label: 'Profile', exact: false },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path) && path !== '/';
  };

  return (
    <BottomNav>
      {navItems.map((item, index) => (
        <NavItem
          key={index}
          href={item.path}
          active={isActive(item.path, item.exact)}
          onClick={(e) => {
            e.preventDefault();
            navigate(item.path);
          }}
        >
          <div style={{ 
            color: isActive(item.path, item.exact) 
              ? '#0284c7' 
              : '#64748b',
            fontSize: '1.25rem',
            marginBottom: '4px'
          }}>
            {item.icon}
          </div>
          <Text 
            size="xs" 
            weight="medium"
            style={{ 
              color: isActive(item.path, item.exact) 
                ? '#0284c7' 
                : '#64748b'
            }}
          >
            {item.label}
          </Text>
        </NavItem>
      ))}
    </BottomNav>
  );
};

export default BottomNavigation;