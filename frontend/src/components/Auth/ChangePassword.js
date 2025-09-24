import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { changePassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword.trim()) {
      setError('Current password is required');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    const result = await changePassword(oldPassword, newPassword);
    if (result.success) {
      setMessage(result.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-form">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Old Password:</label>
          <input
            type="password"
            className="form-control"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">New Password:</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength="8"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Confirm New Password:</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? (
            <div className="flex flex-center">
              <div className="spinner"></div>
              <span className="ml-2">Changing...</span>
            </div>
          ) : (
            'Change Password'
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
