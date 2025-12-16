// src/components/Auth/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// usage: <ProtectedRoute role="admin" element={<Admin />} />
export default function ProtectedRoute({ element, role = null }) {
  const { user, ready } = useAuth();
  if (!ready) return null; // or a spinner

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (role && user.role !== role) {
    // unauthorized -> send to home or their dashboard
    return <Navigate to="/" replace />;
  }
  return element;
}
