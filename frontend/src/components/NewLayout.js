import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNav';

// Layout component that includes the bottom navigation for authenticated users
const NewLayout = ({ children }) => {
  const location = useLocation();
  
  // Determine if bottom navigation should be shown
  const showBottomNav = [
    '/',
    '/dashboard',
    '/plans',
    '/transactions',
    '/profile'
  ].includes(location.pathname) || location.pathname.startsWith('/dashboard') || 
     location.pathname.startsWith('/plans') || 
     location.pathname.startsWith('/transactions') || 
     location.pathname.startsWith('/profile');

  return (
    <div>
      {children}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};

export default NewLayout;