import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Redirect to home page after logout
    window.location.href = '/';
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard, {user.username}!</p>
      <p>This is a protected page. Only logged-in users can see this.</p>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Logout from Dashboard</button>
    </div>
  );
};

export default DashboardPage;