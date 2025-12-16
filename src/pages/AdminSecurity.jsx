// src/pages/AdminSecurity.jsx
import React from "react";
import AdminLayout from "./AdminLayout";

const SECURITY_KPIS = [
  { label: "Failed logins (24h)", value: "18" },
  { label: "MFA-enabled admins", value: "6 / 7" },
  { label: "Emergency unlocks (30d)", value: "1" },
];

const ALERTS = [
  {
    id: 1,
    level: "Warning",
    message: "Multiple failed logins from same IP",
    time: "Today • 09:32 AM",
  },
  {
    id: 2,
    level: "Info",
    message: "New hospital admin created (demo)",
    time: "Yesterday • 04:15 PM",
  },
];

export default function AdminSecurity() {
  return (
    <AdminLayout
      title="Security & compliance"
      subtitle="Monitor failed logins, backups and security alerts (demo data)."
    >
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {SECURITY_KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4"
          >
            <p className="text-xs text-slate-500">{kpi.label}</p>
            <p className="text-xl font-semibold text-slate-800 mt-1">
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Recent security alerts (demo)
          </h2>
          <ul className="divide-y divide-slate-100 text-sm">
            {ALERTS.map((a) => (
              <li key={a.id} className="py-2 flex items-start justify-between">
                <div>
                  <span
                    className={
                      "inline-flex items-center px-2 py-0.5 text-[11px] rounded-full mr-2 " +
                      (a.level === "Warning"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-sky-50 text-sky-700")
                    }
                  >
                    {a.level}
                  </span>
                  <span className="text-slate-800">{a.message}</span>
                </div>
                <span className="text-xs text-slate-400 ml-4 whitespace-nowrap">
                  {a.time}
                </span>
              </li>
            ))}
            {ALERTS.length === 0 && (
              <li className="py-2 text-sm text-slate-500">
                No security alerts in the last 24 hours.
              </li>
            )}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Backup & encryption status
          </h2>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Last full backup</span>
              <span className="font-medium">Today • 03:15 AM</span>
            </li>
            <li className="flex justify-between">
              <span>Backup location</span>
              <span className="font-medium">Encrypted cloud (demo)</span>
            </li>
            <li className="flex justify-between">
              <span>Database encryption</span>
              <span className="text-emerald-600 font-medium">Enabled</span>
            </li>
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            This screen is only a UI mock. When you connect a real backend, make
            sure actual security logs & checks are implemented server-side.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
