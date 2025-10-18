import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import NewLayout from './components/NewLayout';
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
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <div className="app-root">
            <Routes>
              <Route path="/" element={
                <NewLayout>
                  <Home />
                </NewLayout>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <NewLayout>
                      <Dashboard />
                    </NewLayout>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/plans" 
                element={
                  <PrivateRoute>
                    <NewLayout>
                      <Plans />
                    </NewLayout>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/recharge" 
                element={
                  <PrivateRoute>
                    <NewLayout>
                      <Recharge />
                    </NewLayout>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/withdrawal" 
                element={
                  <PrivateRoute>
                    <NewLayout>
                      <Withdrawal />
                    </NewLayout>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/transactions" 
                element={
                  <PrivateRoute>
                    <NewLayout>
                      <Transactions />
                    </NewLayout>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <NewLayout>
                      <Profile />
                    </NewLayout>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <PrivateRoute>
                    <NewLayout>
                      <Admin />
                    </NewLayout>
                  </PrivateRoute>
                } 
              />
            </Routes>
          </div>
        </AuthProvider>
        <DebugPanel />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
