// src/pages/AdminAnalytics.jsx
import React from "react";
import AdminLayout from "./AdminLayout";
import AdminPredictiveAnalyticsPanel from "../components/Admin/AdminPredictiveAnalyticsPanel";

const KPIS = [
  { label: "New users (30 days)", value: "864" },
  { label: "Appointments (today)", value: "312" },
  { label: "Telemedicine sessions", value: "74" },
  { label: "Avg. response time", value: "1.8 sec" },
];

const TOP_HOSPITALS = [
  {
    id: "H-2001",
    name: "Sunrise Multispeciality",
    city: "Ahmedabad",
    patients: 842,
  },
  {
    id: "H-2002",
    name: "CityCare Heart Institute",
    city: "Gandhinagar",
    patients: 621,
  },
  {
    id: "H-2003",
    name: "Lotus Children Hospital",
    city: "Ahmedabad",
    patients: 512,
  },
];

export default function AdminAnalytics() {
  return (
    <AdminLayout
      title="Analytics"
      subtitle="High-level metrics for users, hospitals and platform usage (demo data)."
    >
      {/* Top KPI cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        {KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4"
          >
            <p className="text-xs text-slate-500">{kpi.label}</p>
            <p className="text-2xl font-semibold text-slate-800 mt-1">
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Top hospitals table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-4">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">
          Top hospitals by active patients (demo)
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
              <th className="py-2 pr-4">ID</th>
              <th className="py-2 pr-4">Hospital</th>
              <th className="py-2 pr-4">City</th>
              <th className="py-2 pr-4 text-right">Patients this month</th>
            </tr>
          </thead>
          <tbody>
            {TOP_HOSPITALS.map((h) => (
              <tr key={h.id} className="border-b border-slate-50 last:border-0">
                <td className="py-2 pr-4 text-xs text-slate-500">{h.id}</td>
                <td className="py-2 pr-4">{h.name}</td>
                <td className="py-2 pr-4 text-slate-600">{h.city}</td>
                <td className="py-2 pr-4 text-right font-medium">
                  {h.patients}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-slate-500">
          All numbers here are dummy values for the HealthKey UI demo. Later you
          can connect to real analytics from your backend.
        </p>
      </div>

      {/* NEW: AI predictive analytics panel */}
      <AdminPredictiveAnalyticsPanel />
    </AdminLayout>
  );
}
