// src/pages/AdminDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";

/* ---------- STATIC DASHBOARD DATA (same as before) ---------- */

const overviewCards = [
  { label: "Total Users", value: "4,218", hint: "+124 this month" },
  { label: "Hospitals", value: "32", hint: "7 pending approvals" },
  { label: "Doctors", value: "143", hint: "12 new onboarded" },
  { label: "NFC Cards Active", value: "9,842", hint: "99.3% uptime" },
];

const analyticsSummary = [
  { label: "Daily active users", value: "1,204" },
  { label: "Monthly active users", value: "7,932" },
  { label: "Avg. sessions / user", value: "3.1" },
  { label: "Hospitals onboarded", value: "32" },
];

const securitySummary = [
  { label: "Failed logins (24h)", value: "18" },
  { label: "Suspicious activities", value: "2" },
  { label: "Last backup", value: "Today • 03:15 AM" },
  { label: "Encryption", value: "Enabled" },
];

const recentActivity = [
  {
    id: 1,
    type: "Hospital approved",
    who: "Sunrise Multispeciality",
    when: "5 min ago",
  },
  {
    id: 2,
    type: "New doctor",
    who: "Dr. Mehta (Cardiology)",
    when: "23 min ago",
  },
  {
    id: 3,
    type: "NFC re-issued",
    who: "Patient: Raj Patel",
    when: "1 hr ago",
  },
  {
    id: 4,
    type: "User locked",
    who: "Admin: audit policy",
    when: "2 hr ago",
  },
];

const quickActions = [
  { icon: "👥", label: "Manage users", to: "/admin/users" },
  { icon: "🏥", label: "Hospitals", to: "/admin/hospitals" },
  { icon: "✅", label: "Approvals", to: "/admin/approvals" },
  { icon: "📊", label: "Analytics", to: "/admin/analytics" },
  { icon: "🔒", label: "Security", to: "/admin/security" },
  { icon: "⚙️", label: "Settings", to: "/admin/settings" },
];

/* ---------- USERS TABLE DEMO DATA (matches your screenshot) ---------- */

const INITIAL_USERS = [
  {
    id: "U-1001",
    name: "Ravi Patel",
    role: "Patient",
    status: "Active",
    email: "ravi.patel@example.com",
    phone: "+91 98765 43210",
    healthKeyId: "HK-119538",
    lastLogin: "Today • 09:32 AM",
  },
  {
    id: "U-1002",
    name: "Dr. Neha Shah",
    role: "Doctor",
    status: "Active",
    email: "neha.shah@example.com",
    phone: "+91 98200 11111",
    healthKeyId: "HK-220014",
    lastLogin: "Today • 08:21 AM",
  },
  {
    id: "U-1003",
    name: "CityCare Hospital",
    role: "Hospital",
    status: "Pending",
    email: "admin@citycare.example.com",
    phone: "+91 22 4000 1234",
    healthKeyId: "—",
    lastLogin: "Yesterday • 05:40 PM",
  },
  {
    id: "U-1004",
    name: "Admin User",
    role: "Admin",
    status: "Active",
    email: "admin@example.com",
    phone: "+91 90000 00000",
    healthKeyId: "—",
    lastLogin: "Today • 10:02 AM",
  },
  {
    id: "U-1005",
    name: "Priya Verma",
    role: "Patient",
    status: "Inactive",
    email: "priya.verma@example.com",
    phone: "+91 99301 55555",
    healthKeyId: "HK-889012",
    lastLogin: "7 days ago",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Users state for demo
  const [users, setUsers] = useState(INITIAL_USERS);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [mode, setMode] = useState("none"); // "none" | "view" | "edit"
  const [editDraft, setEditDraft] = useState(null);

  const selectedUser = users.find((u) => u.id === selectedUserId) || null;

  /* ---------- HANDLERS FOR VIEW / EDIT ---------- */

  const handleView = (user) => {
    setSelectedUserId(user.id);
    setMode("view");
    setEditDraft(null);
  };

  const handleEdit = (user) => {
    setSelectedUserId(user.id);
    setMode("edit");
    // create a local copy for editing
    setEditDraft({
      id: user.id,
      name: user.name,
      role: user.role,
      status: user.status,
      email: user.email,
      phone: user.phone,
    });
  };

  const handleEditFieldChange = (field, value) => {
    setEditDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editDraft) return;

    setUsers((prev) =>
      prev.map((u) => (u.id === editDraft.id ? { ...u, ...editDraft } : u))
    );

    setMode("view");
    setEditDraft(null);
  };

  const handleCancelEdit = () => {
    setMode("view");
    setEditDraft(null);
  };

  /* ---------- RENDER ---------- */

  return (
    <AdminLayout
      title="Admin overview"
      subtitle="Monitor users, hospitals, security and system health at a glance."
    >
      {/* Quick actions row (top) */}
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6 mb-6">
        {quickActions.map((qa) => (
          <button
            key={qa.label}
            type="button"
            onClick={() => navigate(qa.to)}
            className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-slate-100 px-3 py-2 text-xs text-slate-700 hover:border-sky-500 hover:ring-1 hover:ring-sky-100 transition"
          >
            <span className="text-lg">{qa.icon}</span>
            <span className="font-medium">{qa.label}</span>
          </button>
        ))}
      </div>

      {/* Top stats (same as before) */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        {overviewCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4"
          >
            <p className="text-xs text-slate-500">{card.label}</p>
            <p className="text-2xl font-semibold text-slate-800 mt-1">
              {card.value}
            </p>
            <p className="text-xs text-emerald-600 mt-2">{card.hint}</p>
          </div>
        ))}
      </div>

      {/* Analytics + security snapshot */}
      <div className="grid gap-4 xl:grid-cols-3 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 xl:col-span-2">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            System analytics (demo)
          </h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 text-sm">
            {analyticsSummary.map((item) => (
              <div
                key={item.label}
                className="border border-slate-100 rounded-lg px-3 py-2"
              >
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="text-base font-semibold text-slate-800 mt-1">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            These numbers are mocked for the UI demo. In real deployment they
            will come from backend analytics APIs.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Security & backups
          </h2>
          <div className="space-y-2 text-sm">
            {securitySummary.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border border-slate-100 rounded-lg px-3 py-2"
              >
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="text-xs font-semibold text-slate-800">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            Use this panel to plug in real monitoring or SIEM alerts later.
          </p>
        </div>
      </div>

      {/* Recent activity + USERS TABLE WITH VIEW/EDIT */}
      <div className="grid gap-4 xl:grid-cols-3">
        {/* Left: Recent activity list */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Recent platform activity
          </h2>
          <ul className="space-y-2 text-sm">
            {recentActivity.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between border border-slate-100 rounded-lg px-3 py-2"
              >
                <div>
                  <p className="text-xs font-medium text-slate-800">
                    {item.type}
                  </p>
                  <p className="text-[11px] text-slate-500">{item.who}</p>
                </div>
                <span className="text-[11px] text-slate-400 ml-3">
                  {item.when}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Users list + side panel (takes 2 columns on xl) */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Users</h2>

          <div className="grid gap-4 lg:grid-cols-3">
            {/* Users table */}
            <div className="lg:col-span-2 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-500 border-b border-slate-100">
                    <th className="py-2 pr-2 text-left">ID</th>
                    <th className="py-2 pr-2 text-left">Name</th>
                    <th className="py-2 pr-2 text-left">Role</th>
                    <th className="py-2 pr-2 text-left">Status</th>
                    <th className="py-2 pr-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-slate-50">
                      <td className="py-1.5 pr-2 text-xs text-slate-500">
                        {u.id}
                      </td>
                      <td className="py-1.5 pr-2">{u.name}</td>
                      <td className="py-1.5 pr-2 text-slate-600">{u.role}</td>
                      <td className="py-1.5 pr-2">
                        <span
                          className={
                            "inline-flex px-2 py-0.5 rounded-full text-[11px] " +
                            (u.status === "Active"
                              ? "bg-emerald-50 text-emerald-700"
                              : u.status === "Pending"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600")
                          }
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-1.5 pr-2 text-xs">
                        <button
                          type="button"
                          onClick={() => handleView(u)}
                          className="text-sky-600 hover:underline mr-2"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(u)}
                          className="text-sky-600 hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Side panel: view / edit user */}
            <div className="border border-slate-100 rounded-lg p-3 text-sm bg-slate-50/40">
              {mode === "none" || !selectedUser ? (
                <>
                  <p className="text-xs text-slate-500 mb-1">
                    Select <span className="font-semibold">View</span> to see
                    user details, or <span className="font-semibold">Edit</span>{" "}
                    to change profile (demo only).
                  </p>
                  <p className="text-[11px] text-slate-400">
                    When you connect real APIs later, this card can show full
                    KYC, hospital mapping, NFC cards linked, and audit logs.
                  </p>
                </>
              ) : mode === "view" ? (
                <>
                  <p className="text-xs font-semibold text-slate-800 mb-2">
                    User details
                  </p>
                  <div className="space-y-1 text-xs">
                    <div>
                      <span className="text-slate-500">ID: </span>
                      <span className="font-mono text-slate-800">
                        {selectedUser.id}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Name: </span>
                      <span className="text-slate-800">
                        {selectedUser.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Role: </span>
                      <span className="text-slate-800">
                        {selectedUser.role}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Status: </span>
                      <span className="text-slate-800">
                        {selectedUser.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Email: </span>
                      <span className="text-slate-800">
                        {selectedUser.email}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Phone: </span>
                      <span className="text-slate-800">
                        {selectedUser.phone}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">HealthKey ID: </span>
                      <span className="text-slate-800">
                        {selectedUser.healthKeyId}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Last login: </span>
                      <span className="text-slate-800">
                        {selectedUser.lastLogin}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                /* EDIT MODE */
                <form onSubmit={handleSaveEdit} className="space-y-2 text-xs">
                  <p className="font-semibold text-slate-800">
                    Edit user (demo only)
                  </p>
                  <div>
                    <label className="block text-slate-500 mb-0.5">
                      Name
                    </label>
                    <input
                      className="w-full border border-slate-200 rounded-md px-2 py-1"
                      value={editDraft?.name || ""}
                      onChange={(e) =>
                        handleEditFieldChange("name", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-0.5">
                      Role
                    </label>
                    <select
                      className="w-full border border-slate-200 rounded-md px-2 py-1"
                      value={editDraft?.role || ""}
                      onChange={(e) =>
                        handleEditFieldChange("role", e.target.value)
                      }
                    >
                      <option>Patient</option>
                      <option>Doctor</option>
                      <option>Hospital</option>
                      <option>Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-0.5">
                      Status
                    </label>
                    <select
                      className="w-full border border-slate-200 rounded-md px-2 py-1"
                      value={editDraft?.status || ""}
                      onChange={(e) =>
                        handleEditFieldChange("status", e.target.value)
                      }
                    >
                      <option>Active</option>
                      <option>Pending</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-0.5">
                      Email
                    </label>
                    <input
                      className="w-full border border-slate-200 rounded-md px-2 py-1"
                      value={editDraft?.email || ""}
                      onChange={(e) =>
                        handleEditFieldChange("email", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-0.5">
                      Phone
                    </label>
                    <input
                      className="w-full border border-slate-200 rounded-md px-2 py-1"
                      value={editDraft?.phone || ""}
                      onChange={(e) =>
                        handleEditFieldChange("phone", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-3 py-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-md bg-sky-600 text-white hover:bg-sky-700"
                    >
                      Save
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    This only updates local state for UI demo. Hook it to your
                    real admin API later.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
