import React, { createContext, useState, useContext, useEffect } from 'react';
import { DataService } from '../services/DataService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('healthkey_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password, role) => {
    try {
      const userData = DataService.login(identifier, password, role);
      setUser(userData);
      localStorage.setItem('healthkey_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('healthkey_user');
  };

  const register = async (role, formData) => {
    try {
      const newUser = DataService.register(role, formData);
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      register,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);