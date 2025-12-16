import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import dataService from "../services/DataService";

export default function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    try {
      const list = dataService.get("patients", []) || [];
      setPatient(list.find(p => String(p.id) === String(id)) || null);
    } catch (e) {
      setPatient(null);
    }
  }, [id]);

  if (!patient) {
    return (
      <Container className="py-6">
        <Card>Patient not found.</Card>
      </Container>
    );
  }

  return (
    <Container className="py-6">
      <h1 className="text-2xl font-bold mb-2">{patient.name}</h1>
      <Card>
        <div><strong>Email:</strong> {patient.email || "—"}</div>
        <div className="mt-2"><strong>Notes:</strong> {patient.notes || "—"}</div>
      </Card>
      <div className="mt-4">
        <Link to={`/patients/${patient.id}/edit`} className="px-3 py-1 border rounded">Edit</Link>
      </div>
    </Container>
  );
}
