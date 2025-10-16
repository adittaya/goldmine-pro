import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  // If still loading authentication status, show loading
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If user is not authenticated, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated, render the protected content
  return children;
};

export default PrivateRoute;