// src/pages/AdminHospitals.jsx
import React from "react";
import AdminLayout from "./AdminLayout";

const MOCK_HOSPITALS = [
  {
    id: "H-2001",
    name: "Sunrise Multispeciality Hospital",
    city: "Ahmedabad",
    beds: 220,
    status: "Active",
  },
  {
    id: "H-2002",
    name: "CityCare Heart Institute",
    city: "Gandhinagar",
    beds: 80,
    status: "Pending",
  },
  {
    id: "H-2003",
    name: "Lotus Children Hospital",
    city: "Ahmedabad",
    beds: 120,
    status: "Active",
  },
];

export default function AdminHospitals() {
  return (
    <AdminLayout
      title="Hospitals"
      subtitle="Onboard and manage partner hospitals using HealthKey NFC cards."
    >
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-2 font-medium text-slate-500">
                ID
              </th>
              <th className="text-left px-4 py-2 font-medium text-slate-500">
                Hospital
              </th>
              <th className="text-left px-4 py-2 font-medium text-slate-500">
                City
              </th>
              <th className="text-left px-4 py-2 font-medium text-slate-500">
                Beds
              </th>
              <th className="text-left px-4 py-2 font-medium text-slate-500">
                Status
              </th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {MOCK_HOSPITALS.map((h) => (
              <tr key={h.id} className="border-top border-slate-100">
                <td className="px-4 py-2 font-mono text-xs text-slate-500">
                  {h.id}
                </td>
                <td className="px-4 py-2">{h.name}</td>
                <td className="px-4 py-2">{h.city}</td>
                <td className="px-4 py-2">{h.beds}</td>
                <td className="px-4 py-2">
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium " +
                      (h.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700")
                    }
                  >
                    {h.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  {h.status === "Pending" && (
                    <>
                      <button className="text-xs text-emerald-600 hover:underline mr-2">
                        Approve
                      </button>
                      <button className="text-xs text-rose-600 hover:underline">
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
