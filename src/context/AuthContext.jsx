import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * IMPORTANT:
 * - No eslint-disable comments
 * - No dynamic require()
 * - No unresolved imports
 * - Vercel + CRA safe
 */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    try {
      const stored = localStorage.getItem("healthkey_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load auth state", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = ({ email, role }) => {
    const authUser = {
      email,
      role,
      loggedInAt: Date.now(),
    };

    setUser(authUser);
    localStorage.setItem("healthkey_user", JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("healthkey_user");
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
