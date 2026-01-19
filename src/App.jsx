import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Lost from './pages/Lost';
import ReportLostPage from './pages/ReportLostPage';
import Found from './pages/Found';
import ReportFoundPage from './pages/ReportFoundPage';
import Login from './pages/Login';
import Profile from './pages/Profile';
import './index.css';

import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import ResetPassword from './pages/ResetPassword';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/lost" element={<Lost />} />
          <Route path="/report-lost" element={<ProtectedRoute><ReportLostPage /></ProtectedRoute>} />
          <Route path="/found" element={<Found />} />
          <Route path="/report-found" element={<ReportFoundPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
