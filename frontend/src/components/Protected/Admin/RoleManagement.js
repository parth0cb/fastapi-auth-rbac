import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get('/roles');
        setRoles(response.data);
      } catch (err) {
        setError('Failed to load roles');
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const createRole = async (e) => {
    e.preventDefault();
    if (!newRole.trim()) return;
    try {
      await api.post('/roles', { name: newRole });
      setRoles([...roles, newRole]);
      setNewRole('');
      setMessage('Role created successfully');
    } catch (err) {
      setError('Failed to create role');
    }
  };

  const deleteRole = async (roleName) => {
    if (!window.confirm(`Delete role ${roleName}?`)) return;
    try {
      await api.delete(`/roles/${roleName}`);
      setRoles(roles.filter(r => r !== roleName));
    } catch (err) {
      setError('Failed to delete role');
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="main-content">
      <h2>Role Management</h2>
      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      
      <div className="card">
        <h3>Create New Role</h3>
        <form onSubmit={createRole} className="form-group">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="New role name"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create Role
          </button>
        </form>
      </div>
      
      <div className="card">
        <h3>Existing Roles</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role}>
                  <td>{role}</td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteRole(role)}
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
    </div>
  );
};

export default RoleManagement;
