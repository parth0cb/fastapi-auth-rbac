import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setMessage(response.data.msg);
      } catch (error) {
        setMessage('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="main-content">
      <h2>Dashboard</h2>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Welcome, {user.username}!</h3>
          <p>{message}</p>
        </div>
        
        <div className="dashboard-card">
          <h3>Account Settings</h3>
          <p>Manage your account settings and security</p>
          <Link to="/change-password" className="btn btn-outline">
            Change Password
          </Link>
        </div>
        
        {isAdmin && (
          <div className="dashboard-card">
            <h3>Admin Panel</h3>
            <p>Manage users and roles</p>
            <Link to="/admin" className="btn btn-primary">
              Go to Admin Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
