import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataService } from './services/DataService';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PatientPortal from './pages/PatientPortal';
import DoctorPortal from './pages/DoctorPortal';
import HospitalPortal from './pages/HospitalPortal';
import AdminPortal from './pages/AdminPortal';
import EmergencyAccess from './pages/EmergencyAccess';
import LoginPage from './pages/LoginPage';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import LoadingSpinner from './components/Common/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('healthkey_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('healthkey_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize services
    DataService.init();
    
    // Check for saved user
    const savedUser = localStorage.getItem('healthkey_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('healthkey_user');
      }
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('healthkey_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('healthkey_user');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider value={{ user, handleLogin, handleLogout }}>
        <Router>
          <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />
            <main className="pt-16 min-h-[calc(100vh-64px)]">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } />
                <Route path="/emergency" element={<EmergencyAccess />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />

                <Route path="/patient/*" element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <PatientPortal />
                  </ProtectedRoute>
                } />

                <Route path="/doctor/*" element={
                  <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                    <DoctorPortal />
                  </ProtectedRoute>
                } />

                <Route path="/hospital/*" element={
                  <ProtectedRoute allowedRoles={['hospital', 'admin']}>
                    <HospitalPortal />
                  </ProtectedRoute>
                } />

                <Route path="/admin/*" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPortal />
                  </ProtectedRoute>
                } />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;