import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth() || {};
  const { theme, toggleTheme } = (useTheme && useTheme()) || { theme: "light", toggleTheme: () => {} };
  const loc = useLocation();

  const handleAnchor = (id) => {
    if (loc.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b">
      <div className="container mx-auto flex items-center justify-between py-4">
        <NavLink to="/" className="text-xl font-bold">HealthKey</NavLink>

        <nav className="hidden md:flex gap-6 items-center">
          <button onClick={() => handleAnchor("features")} className="text-sm text-slate-700 hover:underline">Features</button>
          <button onClick={() => handleAnchor("why")} className="text-sm text-slate-700 hover:underline">Why HealthKey</button>
          <button onClick={() => handleAnchor("about")} className="text-sm text-slate-700 hover:underline">About Us</button>
          <NavLink to="/dashboard" className="text-sm text-slate-700">Dashboard</NavLink>
          <NavLink to="/patients" className="text-sm text-slate-700">Patients</NavLink>
          <NavLink to="/er" className="text-sm text-slate-700">ER</NavLink>
          <NavLink to="/hospital" className="text-sm text-slate-700">Hospital</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2"> {theme === "dark" ? "☀️" : "🌙"} </button>
          {user ? (
            <>
              <span className="text-sm hidden md:inline">Hi, {user.name}</span>
              <button onClick={logout} className="px-3 py-1 border rounded">Logout</button>
            </>
          ) : (
            <NavLink to="/login" className="px-3 py-1 border rounded">Login</NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
