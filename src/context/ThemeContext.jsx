// src/contexts/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const DEFAULT_THEME_STATE = {
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {}
};

// create context with a default safe object so useContext won't be undefined
const ThemeContext = createContext(DEFAULT_THEME_STATE);

export const useTheme = () => {
  // always return a usable object — fallback to DEFAULT_THEME_STATE if context value is falsy
  const ctx = useContext(ThemeContext);
  return ctx || DEFAULT_THEME_STATE;
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("hk_theme") || "light";
    } catch (e) {
      return "light";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("hk_theme", theme);
    } catch (e) {}
    document.body.classList.toggle("hk-theme-dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;
