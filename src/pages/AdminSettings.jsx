// src/pages/AdminSettings.jsx
import React, { useState } from "react";
import AdminLayout from "./AdminLayout";

export default function AdminSettings() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [sandboxMode, setSandboxMode] = useState(true);

  return (
    <AdminLayout
      title="Settings"
      subtitle="Configure system behaviour, notifications and demo modes."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Notifications
          </h2>
          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={emailNotif}
                onChange={(e) => setEmailNotif(e.target.checked)}
              />
              <span>Email alerts for new approvals</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={smsNotif}
                onChange={(e) => setSmsNotif(e.target.checked)}
              />
              <span>SMS alerts for NFC card issues</span>
            </label>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            In this demo, settings are stored only in memory and reset on
            refresh.
          </p>
        </div>

        {/* Environment */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Environment
          </h2>
          <div className="space-y-3 text-sm">
            <label className="flex items-center justify-between">
              <span>Sandbox mode</span>
              <input
                type="checkbox"
                checked={sandboxMode}
                onChange={(e) => setSandboxMode(e.target.checked)}
              />
            </label>
            <p className="text-xs text-slate-500">
              Sandbox mode keeps all actions on mock data so you can showcase
              the UI safely.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
