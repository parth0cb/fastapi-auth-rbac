import React, { createContext, useContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ username: decoded.sub });
        checkAdminStatus();
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const checkAdminStatus = async () => {
    try {
      await api.get('/admin');
      setIsAdmin(true);
    } catch (error) {
      if (error.response?.status === 403) {
        setIsAdmin(false);
      }
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('/login', { username, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      const decoded = jwtDecode(access_token);
      setUser({ username: decoded.sub });
      await checkAdminStatus();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  };

  const register = async (username, password) => {
    try {
      await api.post('/register', { username, password });
      return { success: true, message: 'Registration successful. Please login.' };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Registration failed' };
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      await api.post('/change-password', { old_password: oldPassword, new_password: newPassword });
      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Password change failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAdmin(false);
  };

  const value = {
    user,
    isAdmin,
    loading,
    login,
    register,
    changePassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
