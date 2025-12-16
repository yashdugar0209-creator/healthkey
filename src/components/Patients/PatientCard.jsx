import React from "react";
import { Link } from "react-router-dom";

export default function PatientCard({ patient, onDelete }) {
  return (
    <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontWeight: 700 }}>{patient.name || "Unnamed"}</div>
        <div style={{ fontSize: 13, color: "#666" }}>{patient.age ? `Age ${patient.age}` : ""} {patient.gender ? `• ${patient.gender}` : ""}</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Link to={`/patients/${patient.id}`} style={{ textDecoration: "none", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6 }}>View</Link>
        <Link to={`/patients/${patient.id}/edit`} style={{ textDecoration: "none", padding: "6px 8px", border: "1px solid #ddd", borderRadius: 6 }}>Edit</Link>
        <button onClick={onDelete} style={{ padding: "6px 8px" }}>Delete</button>
      </div>
    </div>
  );
}
