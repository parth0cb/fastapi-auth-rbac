import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, rolesRes] = await Promise.all([
          api.get('/users'),
          api.get('/roles')
        ]);
        setUsers(usersRes.data);
        setRoles(rolesRes.data);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const deleteUser = async (username) => {
    if (!window.confirm(`Delete user ${username}?`)) return;
    try {
      await api.delete(`/users/${username}`);
      setUsers(users.filter(u => u.username !== username));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const updateUserRole = async (username, newRole) => {
    try {
      await api.post('/users/role', { username, role: newRole });
      setUsers(users.map(u => 
        u.username === username ? { ...u, roles: [newRole] } : u
      ));
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="main-content">
      <h2>User Management</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Roles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.username}>
                <td>{user.username}</td>
                <td>
                  <select 
                    className="form-control"
                    value={user.roles[0] || ''} 
                    onChange={(e) => updateUserRole(user.username, e.target.value)}
                  >
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <div className="table-actions">
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteUser(user.username)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
