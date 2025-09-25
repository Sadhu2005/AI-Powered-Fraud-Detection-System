import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user_id = await AsyncStorage.getItem('user_id');
      const user_email = await AsyncStorage.getItem('user_email');

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
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store in AsyncStorage
      await AsyncStorage.setItem('token', userData.token);
      await AsyncStorage.setItem('user_id', userData.user_id.toString());
      await AsyncStorage.setItem('user_email', userData.email);
      
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
      
      // Clear AsyncStorage
      await AsyncStorage.multiRemove(['token', 'user_id', 'user_email']);
      
      // Remove authorization header
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const refreshToken = async () => {
    try {
      const response = await api.post('/auth/refresh');
      if (response.data.access_token) {
        const newToken = response.data.access_token;
        
        // Update token in AsyncStorage and context
        await AsyncStorage.setItem('token', newToken);
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
