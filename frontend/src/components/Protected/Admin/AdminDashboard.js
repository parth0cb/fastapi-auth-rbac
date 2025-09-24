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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>{message}</p>
      <div>
        <h3>Management</h3>
        <ul>
          <li><Link to="/admin/users">Manage Users</Link></li>
          <li><Link to="/admin/roles">Manage Roles</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
