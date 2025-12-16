// src/pages/AdminUsers.jsx
import React, { useState } from "react";
import AdminLayout from "./AdminLayout";

const MOCK_USERS = [
  { id: "U-1001", name: "Ravi Patel", role: "patient", status: "Active" },
  { id: "U-1002", name: "Dr. Neha Shah", role: "doctor", status: "Active" },
  { id: "U-1003", name: "CityCare Hospital", role: "hospital", status: "Pending" },
  { id: "U-1004", name: "Admin User", role: "admin", status: "Active" },
  { id: "U-1005", name: "Priya Verma", role: "patient", status: "Inactive" },
];

export default function AdminUsers() {
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = roleFilter === "all"
    ? MOCK_USERS
    : MOCK_USERS.filter((u) => u.role === roleFilter);

  return (
    <AdminLayout
      title="Users"
      subtitle="Manage all patients, doctors, hospitals and admin accounts."
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="all">All roles</option>
          <option value="patient">Patients</option>
          <option value="doctor">Doctors</option>
          <option value="hospital">Hospitals</option>
          <option value="admin">Admins</option>
        </select>
        <div className="text-xs text-slate-500">
          Showing {filtered.length} of {MOCK_USERS.length} users
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-2 font-medium text-slate-500">
                ID
              </th>
              <th className="text-left px-4 py-2 font-medium text-slate-500">
                Name
              </th>
              <th className="text-left px-4 py-2 font-medium text-slate-500">
                Role
              </th>
              <th className="text-left px-4 py-2 font-medium text-slate-500">
                Status
              </th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-slate-100">
                <td className="px-4 py-2 font-mono text-xs text-slate-500">
                  {u.id}
                </td>
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2 capitalize">{u.role}</td>
                <td className="px-4 py-2">
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium " +
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
                <td className="px-4 py-2 text-right">
                  <button className="text-xs text-sky-600 hover:underline mr-2">
                    View
                  </button>
                  <button className="text-xs text-slate-500 hover:underline">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  className="px-4 py-6 text-center text-slate-400 text-sm"
                  colSpan={5}
                >
                  No users for this role filter in demo data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
