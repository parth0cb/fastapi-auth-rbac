import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header>
      <div className="header-content">
        <h1 className="header-title">FastAPI Auth RBAC</h1>
        <nav className="header-nav">
          {user ? (
            <>
              <div className="header-user-info">
                <span>Welcome, {user.username}!</span>
              </div>
              <Link to="/dashboard">Dashboard</Link>
              {isAdmin && <Link to="/admin">Admin</Link>}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
