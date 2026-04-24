import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children, requireAuth = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Жүктелуде...</div>;
  }

  // Егер auth талап етілсе және user жоқ болса, login бетіне қайта бағыттау
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Әйтпесе барлығына рұқсат (кірусіз қол жетімді)
  return children;
};

export default PrivateRoute;


