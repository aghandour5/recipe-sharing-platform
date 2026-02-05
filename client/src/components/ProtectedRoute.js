import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => { // prop children represents the content that should be rendered inside the component.
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation(); // Use the hook instead of global location

  if (loading) {
    return <div>Loading...</div>;
  }
  
  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; // If authenticated, render the child components
};

export default ProtectedRoute;