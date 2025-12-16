// src/pages/AdminApprovals.jsx
import React, { useState } from "react";
import AdminLayout from "./AdminLayout";

const INITIAL_REQUESTS = [
  {
    id: "A-3001",
    type: "Hospital onboarding",
    entity: "CityCare Heart Institute",
    requestedBy: "citycare@demo.in",
  },
  {
    id: "A-3002",
    type: "Doctor verification",
    entity: "Dr. Mehta (Cardiology)",
    requestedBy: "sunrise@demo.in",
  },
  {
    id: "A-3003",
    type: "NFC replacement",
    entity: "Patient: Raj Patel",
    requestedBy: "support@demo.in",
  },
];

export default function AdminApprovals() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const handleAction = (id, action) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    console.log(`Request ${id} -> ${action}`);
  };

  return (
    <AdminLayout
      title="Approvals"
      subtitle="Review and approve onboarding, verification and card requests."
    >
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            No pending approvals in this demo. New requests would appear here.
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-slate-500">
                  ID
                </th>
                <th className="text-left px-4 py-2 font-medium text-slate-500">
                  Type
                </th>
                <th className="text-left px-4 py-2 font-medium text-slate-500">
                  Entity
                </th>
                <th className="text-left px-4 py-2 font-medium text-slate-500">
                  Requested by
                </th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-mono text-xs text-slate-500">
                    {r.id}
                  </td>
                  <td className="px-4 py-2">{r.type}</td>
                  <td className="px-4 py-2">{r.entity}</td>
                  <td className="px-4 py-2">{r.requestedBy}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      className="text-xs text-emerald-600 hover:underline mr-2"
                      onClick={() => handleAction(r.id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="text-xs text-rose-600 hover:underline"
                      onClick={() => handleAction(r.id, "rejected")}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
