// src/pages/AdminLayout.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "🏠", to: "/admin" },
  { id: "users", label: "Users", icon: "👥", to: "/admin/users" },
  { id: "hospitals", label: "Hospitals", icon: "📋", to: "/admin/hospitals" },
  { id: "approvals", label: "Approvals", icon: "✅", to: "/admin/approvals" },
  { id: "analytics", label: "Analytics", icon: "📊", to: "/admin/analytics" },
  { id: "security", label: "Security", icon: "🔒", to: "/admin/security" },
  { id: "settings", label: "Settings", icon: "⚙️", to: "/admin/settings" },
];

export default function AdminLayout({ title, subtitle, children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const isActive = (item) => {
    if (item.to === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-4 py-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Admin
          </p>
          <p className="text-sm font-semibold text-slate-800">
            HealthKey Dashboard
          </p>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          {MENU_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.to)}
                className={
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition " +
                  (active
                    ? "bg-sky-50 text-sky-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50")
                }
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 text-xs text-slate-500 border-t border-slate-100">
          admin •{" "}
          <button
            type="button"
            onClick={() => navigate("/logout")}
            className="text-sky-600 hover:underline"
          >
            logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="text-sm">
            <span className="font-semibold text-slate-800">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-500" />
              NFC HealthKey
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Security first
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-8 py-6 overflow-y-auto">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h1 className="text-lg font-semibold text-slate-800">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-1.5 rounded-full text-sm border border-slate-200 bg-white shadow-sm hover:border-sky-500 hover:text-sky-700"
            >
              Refresh
            </button>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
