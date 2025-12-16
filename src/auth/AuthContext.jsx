import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('hk_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // optional: validate token on mount
    // authService.me().then(...).catch(() => logout());
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      const userObj = {
        id: data.id,
        name: data.name,
        role: data.role,
        token: data.token,
      };
      localStorage.setItem('hk_user', JSON.stringify(userObj));
      localStorage.setItem('hk_token', data.token);
      setUser(userObj);
      return userObj;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('hk_user');
    localStorage.removeItem('hk_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
