import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for stored credentials upon load
  useEffect(() => {
    const storedUser = localStorage.getItem('jeevan_roshini_user');
    const storedToken = localStorage.getItem('jeevan_roshini_token');

    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      
      // Optionally sync user state from backend
      api.get('/me')
        .then(response => {
          const freshUser = response.data;
          setCurrentUser(freshUser);
          localStorage.setItem('jeevan_roshini_user', JSON.stringify(freshUser));
        })
        .catch(() => {
          // If profile fetch fails, credentials might be stale
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // Listener for custom logout events dispatched by Axios response interceptors
    const handleGlobalLogout = () => {
      setCurrentUser(null);
    };

    window.addEventListener('auth:logout', handleGlobalLogout);
    return () => {
      window.removeEventListener('auth:logout', handleGlobalLogout);
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('jeevan_roshini_token', token);
      localStorage.setItem('jeevan_roshini_user', JSON.stringify(user));
      setCurrentUser(user);

      return { success: true, user };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please verify credentials.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('jeevan_roshini_token');
      localStorage.removeItem('jeevan_roshini_user');
      setCurrentUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
