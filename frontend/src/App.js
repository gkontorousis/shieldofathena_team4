import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DonationPage from './pages/DonationPage';
import ThankYouPage from './pages/ThankYouPage';
import UserDashboard from './pages/UserDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import DonorImpactPage from "./pages/DonorImpactPage";
import './App.css';

function ProtectedRoute({ children }) {
  const DEV_BYPASS_AUTH = true; 
  const { user } = useAuth();
  if (DEV_BYPASS_AUTH) {
    return children;         
  }
  return user ? children : <Navigate to="/auth" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/my-impact" 
          element={<ProtectedRoute> 
              <DonorImpactPage />
            </ProtectedRoute>} 
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

