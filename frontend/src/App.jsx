import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Plans from './pages/Plans';
import Recharge from './pages/Recharge';
import Withdrawal from './pages/Withdrawal';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Add error logging
console.log("App.jsx loaded successfully");

function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <Layout>
            <div id="app-root">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/plans" 
                  element={
                    <PrivateRoute>
                      <Plans />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/recharge" 
                  element={
                    <PrivateRoute>
                      <Recharge />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/withdrawal" 
                  element={
                    <PrivateRoute>
                      <Withdrawal />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/transactions" 
                  element={
                    <PrivateRoute>
                      <Transactions />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <PrivateRoute>
                      <Admin />
                    </PrivateRoute>
                  } 
                />
              </Routes>
            </div>
          </Layout>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;
