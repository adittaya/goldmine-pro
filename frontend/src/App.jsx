import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/NewHome';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/NewDashboard';
import Plans from './pages/NewPlans';
import Recharge from './pages/Recharge';
import Withdrawal from './pages/Withdrawal';
import Transactions from './pages/Transactions';
import Profile from './pages/NewProfile';
import Admin from './pages/Admin';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import DebugPanel from './components/DebugPanel';
import './styles/mobile-design-system.css';

// Add error logging
console.log("App.jsx loaded successfully with mobile-first design system");

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ErrorBoundary>
          <AuthProvider>
            <div className="app-root">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/plans" element={
                  <PrivateRoute>
                    <Plans />
                  </PrivateRoute>
                } />
                <Route path="/recharge" element={
                  <PrivateRoute>
                    <Recharge />
                  </PrivateRoute>
                } />
                <Route path="/withdrawal" element={
                  <PrivateRoute>
                    <Withdrawal />
                  </PrivateRoute>
                } />
                <Route path="/transactions" element={
                  <PrivateRoute>
                    <Transactions />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                <Route path="/admin" element={
                  <PrivateRoute>
                    <Admin />
                  </PrivateRoute>
                } />
              </Routes>
            </div>
          </AuthProvider>
          <DebugPanel />
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
}

export default App;
