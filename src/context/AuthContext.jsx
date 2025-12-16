/*
  Safe demo AuthContext for HealthKey
  - login({email, role, name}) returns a demo user object and never throws
  - persists to dataService if available
  - provides isRole(), logout(), and ready state
*/
import React, { createContext, useContext, useEffect, useState } from "react";

let safeDataService = null;
try {
  // try to require the project's dataService if present
    // NOTE: Keep this import dynamic to avoid breaking build if the file is missing.
  safeDataService = require("../services/DataService").default;
} catch (e) {
  safeDataService = null;
  // console.info intentionally silent in production; log for debugging when devtools open
  // console.info("dataService not present; using in-memory fallback.");
}

// in-memory fallback storage
const inMemoryStore = {};
const fallbackDataService = {
  init: () => {},
  get: (k, def = null) => {
    if (k in inMemoryStore) return inMemoryStore[k];
    return def;
  },
  set: (k, v) => { inMemoryStore[k] = v; },
  remove: (k) => { delete inMemoryStore[k]; },
};

// choose actual dataService (prefer real one)
const dataService = safeDataService || fallbackDataService;

const AuthContext = createContext({
  user: null,
  ready: false,
  login: async () => ({}),
  logout: () => {},
  isRole: () => false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      dataService.init && dataService.init();
      const stored = dataService.get("user", null);
      if (stored) setUser(stored);
    } catch (err) {
      // fail silently but log for dev debugging
      // console.error("AuthProvider init error:", err);
    } finally {
      setReady(true);
    }
  }, []);

  // Demo login: creates and returns a demo user object.
  const login = async (payload = {}) => {
    try {
      const role = payload.role || "patient";
      const demoUser = {
        id: payload.id || `u_${Date.now()}`,
        name: payload.name || (payload.email ? payload.email.split("@")[0] : role),
        email: payload.email || `${role}@local`,
        role,
      };

      setUser(demoUser);
      try {
        dataService.set && dataService.set("user", demoUser);
      } catch (innerErr) {
        // non-fatal: fallback storage will still have set the data if using fallback
        // console.warn("Failed to persist user to dataService:", innerErr);
      }
      return demoUser;
    } catch (err) {
      // Defensive: never rethrow — return a minimal user so UI can proceed
      const fallbackUser = { id: `u_${Date.now()}`, name: "User", email: "user@local", role: "patient" };
      setUser(fallbackUser);
      try { dataService.set && dataService.set("user", fallbackUser); } catch (_) {}
      return fallbackUser;
    }
  };

  const logout = () => {
    setUser(null);
    try { dataService.remove && dataService.remove("user"); } catch (_) {}
  };

  const isRole = (r) => !!(user && user.role === r);

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, isRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
