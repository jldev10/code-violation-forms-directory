import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '@/api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);
      
      const token = api.token;
      
      if (!token) {
        setIsLoadingAuth(false);
        setIsAuthenticated(false);
        return;
      }

      // Verify token with our new backend
      const response = await api.get('/auth/me');
      
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('User auth check failed:', error);
      setAuthError({
        type: 'auth_required',
        message: 'Your session has expired or is invalid. Please log in again.'
      });
      api.token = null;
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const login = async (email, password) => {
    try {
      setAuthError(null);
      const response = await api.post('/auth/login', { email, password });
      
      api.token = response.token;
      setUser(response.user);
      setIsAuthenticated(true);
      return response.user; // Return user object for redirect logic
    } catch (error) {
      console.error('Login failed:', error);
      const errMsg = error.message || 'Invalid email or password';
      setAuthError({
        type: 'login_failed',
        message: errMsg
      });
      throw new Error(errMsg); // Re-throw so callers can handle it
    }
  };

  const register = async (userData) => {
    try {
      setAuthError(null);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Auto-login after successful registration
      api.token = data.token;
      setUser(data.user);
      setIsAuthenticated(true);
      return data.user;
    } catch (error) {
      console.error('Registration failed:', error);
      const errMsg = error.message || 'Registration failed';
      setAuthError({
        type: 'registration_failed',
        message: errMsg
      });
      throw new Error(errMsg);
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    api.token = null; 
    
    if (shouldRedirect) {
      window.location.href = '/login';
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      authError,
      login,
      register,
      logout,
      navigateToLogin,
      checkUserAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
