import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

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
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    const user_email = localStorage.getItem('user_email');

    if (token && user_id && user_email) {
      setUser({
        token,
        user_id: parseInt(user_id),
        email: user_email
      });
      setIsAuthenticated(true);
      
      // Set default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    setLoading(false);
  }, []);

  const login = async (userData) => {
    try {
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user_id', userData.user_id);
      localStorage.setItem('user_email', userData.email);
      
      // Set default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear user data
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      
      // Remove authorization header
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const refreshToken = async () => {
    try {
      const response = await api.post('/auth/refresh');
      if (response.data.access_token) {
        const newToken = response.data.access_token;
        
        // Update token in localStorage and context
        localStorage.setItem('token', newToken);
        setUser(prev => ({ ...prev, token: newToken }));
        
        // Update authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        return true;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      await logout();
      return false;
    }
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    refreshToken,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
