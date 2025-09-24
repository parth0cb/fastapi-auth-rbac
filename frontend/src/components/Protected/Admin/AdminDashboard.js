import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        const response = await api.get('/admin');
        setMessage(response.data.msg);
      } catch (error) {
        setMessage('Failed to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminDashboard();
  }, []);

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="main-content">
      <h2>Admin Dashboard</h2>
      <div className="card">
        <p>{message}</p>
      </div>
      
      <div className="admin-dashboard-grid">
        <div className="admin-card">
          <div>👥</div>
          <h3>User Management</h3>
          <p>Manage users and their roles</p>
          <Link to="/admin/users" className="btn btn-primary">
            Manage Users
          </Link>
        </div>
        
        <div className="admin-card">
          <div>🔒</div>
          <h3>Role Management</h3>
          <p>Manage roles and permissions</p>
          <Link to="/admin/roles" className="btn btn-primary">
            Manage Roles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
