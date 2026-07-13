import React, { createContext, useState, useEffect, useContext } from 'react';
import { adminLogin, adminLogout, checkAdminSession } from '../../api/adminApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check admin token session on initial mount
  useEffect(() => {
    const fetchAdminSession = async () => {
      try {
        const data = await checkAdminSession();
        if (data && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.warn('Session check failed: Not logged in or expired cookie.');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminSession();
  }, []);

  const login = async (username, password) => {
    try {
      const data = await adminLogin({ username, password });
      if (data && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: 'Invalid credentials payload returned.' };
    } catch (error) {
      console.error('Login action error:', error);
      const msg = error.response?.data?.message || 'Login failed, check servers.';
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await adminLogout();
    } catch (error) {
      console.error('Logout error clearing server cookies:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be consumed within an AuthProvider Wrapper.');
  }
  return context;
};
