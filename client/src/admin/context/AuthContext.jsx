import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/auth.service.js';
import adminToast from '../utils/toast.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session check on initial mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data && res.data.user) {
            setUser(res.data.user);
          }
        } catch (err) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      if (res.success && res.data && res.data.user) {
        setUser(res.data.user);
        adminToast.success('Welcome back! Login successful.');
        return res.data.user;
      }
    } catch (err) {
      const msg = err.message || 'Invalid email or password';
      adminToast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      adminToast.success('Logged out successfully.');
    } catch (err) {
      adminToast.error('Logout failed, clearing local session.');
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.success && res.data && res.data.user) {
        setUser(res.data.user);
      }
    } catch (err) {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContext;
