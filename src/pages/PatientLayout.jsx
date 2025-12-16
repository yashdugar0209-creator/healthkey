// src/pages/PatientLayout.jsx
import React from "react";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

export default function PatientLayout({ title, subtitle, children }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b">
        <Container className="py-3 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-sky-700 font-semibold tracking-wide">
              Patient Dashboard
            </div>
            <div className="text-xs text-slate-500">
              {user?.role || "patient"} •{" "}
              <button
                type="button"
                onClick={handleLogout}
                className="underline hover:text-slate-700"
              >
                patientLogout
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="text-lg">💳</span> NFC HealthKey
            </span>
            <span className="flex items-center gap-1">
              <span className="text-lg">❤️</span> Personal health records
            </span>
          </div>
        </Container>
      </header>

      {/* Body */}
      <main className="flex-1">
        <Container className="py-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
              {subtitle && (
                <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
              )}
            </div>
            <Button
              type="button"
              className="hidden sm:inline-flex"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </div>

          {children}
        </Container>
      </main>
    </div>
  );
}
