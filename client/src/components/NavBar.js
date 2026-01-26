import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Optionally redirect to home or login page
    window.location.href = '/';
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontSize: '1.5rem', fontWeight: 'bold' }}>
        Recipe Platform
      </Link>
      <div>
        {isAuthenticated ? (
          <>
            <span style={{ marginRight: '1rem' }}>
              <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>Welcome, {user.username}</Link>!
            </span>
            <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;