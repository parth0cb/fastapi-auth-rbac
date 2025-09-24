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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>{message}</p>
      {isAdmin && (
        <div>
          <h3>Admin Section</h3>
          <p>
            <Link to="/admin">Go to Admin Dashboard</Link>
          </p>
        </div>
      )}
      <p>
        <Link to="/change-password">Change Password</Link>
      </p>
    </div>
  );
};

export default Dashboard;
