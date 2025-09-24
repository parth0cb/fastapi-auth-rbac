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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Role Management</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <form onSubmit={createRole}>
        <input
          type="text"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="New role name"
          required
        />
        <button type="submit">Create Role</button>
      </form>
      <ul>
        {roles.map(role => (
          <li key={role}>
            {role}
            <button onClick={() => deleteRole(role)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoleManagement;
