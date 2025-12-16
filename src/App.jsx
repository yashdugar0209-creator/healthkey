import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PublicLayout from "./layouts/PublicLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ER_Triage from "./pages/ER_Triage";
import PatientTimeline from "./pages/PatientTimeline";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminHospitals from "./pages/AdminHospitals";
import AdminApprovals from "./pages/AdminApprovals";
import AdminSettings from "./pages/AdminSettings";
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSecurity from './pages/AdminSecurity';

import PatientDashboard from "./pages/PatientDashboard";
import PatientHealthCard from "./pages/PatientHealthCard";
import PatientAIHealthAssistant from "./pages/PatientAIHealthAssistant";
import PatientAppointments from './pages/PatientAppointments';
import PatientRecords from './pages/PatientRecords';

import DoctorDashboard from "./pages/DoctorDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";

function RequireAuth({ children, roles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
}

function NotAuthorized() {
  return (
    <div style={{ padding: 40 }}>
      Not authorized — you don&apos;t have permission to view this page.
    </div>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <Routes>
{/* Public routes */}
<Route element={<PublicLayout />}>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/features" element={<Features />} />
  <Route path="/contact" element={<Contact />} />
</Route>

<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
        
	{/* Admin routes */}
        <Route
          path="/admin"
          element={
            <RequireAuth roles={["admin"]}>
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/analytics"
          element={
           <RequireAuth roles={['admin']}>
              <AdminAnalytics />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/security"
          element={
            <RequireAuth roles={['admin']}>
              <AdminSecurity />
            </RequireAuth>
          }
        />
        <Route
          path="/AdminDashboard"
          element={
            <RequireAuth roles={["admin"]}>
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RequireAuth roles={["admin"]}>
              <AdminUsers />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/hospitals"
          element={
            <RequireAuth roles={["admin"]}>
              <AdminHospitals />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/approvals"
          element={
            <RequireAuth roles={["admin"]}>
              <AdminApprovals />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <RequireAuth roles={["admin"]}>
              <AdminSettings />
            </RequireAuth>
          }
        />

        {/* Doctor routes */}
        <Route
          path="/doctor"
          element={
            <RequireAuth roles={["doctor", "admin"]}>
              <DoctorDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/doctor/queue"
          element={
            <RequireAuth roles={["doctor", "admin"]}>
              <DoctorDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/doctor/consult"
          element={
            <RequireAuth roles={["doctor", "admin"]}>
              <DoctorDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <RequireAuth roles={["doctor", "admin"]}>
              <DoctorDashboard />
            </RequireAuth>
          }
        />

        {/* Hospital routes */}
        <Route
          path="/hospital"
          element={
            <RequireAuth roles={["hospital", "admin"]}>
              <HospitalDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/hospital/doctors"
          element={
            <RequireAuth roles={["hospital", "admin"]}>
              <HospitalDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/hospital/patients"
          element={
            <RequireAuth roles={["hospital", "admin"]}>
              <HospitalDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/hospital/registration"
          element={
            <RequireAuth roles={["hospital", "admin"]}>
              <HospitalDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/hospital/billing"
          element={
            <RequireAuth roles={["hospital", "admin"]}>
              <HospitalDashboard />
            </RequireAuth>
          }
        />

        {/* Patient routes */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth roles={["patient", "admin"]}>
              <PatientDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <RequireAuth roles={['patient']}>
              <PatientAppointments />
            </RequireAuth>
          }
        />

        <Route
          path="/patient/records"
          element={
            <RequireAuth roles={['patient']}>
              <PatientRecords />
            </RequireAuth>
          }
        />
        <Route
          path="/patient/card"
          element={
            <RequireAuth roles={["patient", "admin"]}>
              <PatientHealthCard />
            </RequireAuth>
          }
        />
        <Route
          path="/patient/assistant"
          element={
            <RequireAuth roles={["patient", "admin"]}>
              <PatientAIHealthAssistant />
            </RequireAuth>
          }
        />
        {/* ER route */}
        <Route
          path="/er"
          element={
            <RequireAuth roles={["hospital","admin","doctor","er"]}>
              <ER_Triage />
            </RequireAuth>
          }
        />

        {/* Patient timeline */}
        <Route
          path="/patient/:id"
          element={
            <RequireAuth roles={["doctor","hospital","admin","patient"]}>
              <PatientTimeline />
            </RequireAuth>
          }
        />
	
	{/* Common */}
        <Route path="/not-authorized" element={<NotAuthorized />} />

        {/* 404 */}
        <Route
          path="*"
          element={<div style={{ padding: 40 }}>Page not found</div>}
        />
      </Routes>
    </AuthProvider>
  );
}
