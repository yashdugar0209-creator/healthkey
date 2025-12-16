import React, { useEffect, useState } from "react";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import { Link } from "react-router-dom";
import dataService from "../services/DataService";

export default function Patients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    try {
      const list = dataService.get("patients", []) || [];
      setPatients(list);
    } catch (e) {
      setPatients([]);
    }
  }, []);

  return (
    <Container className="py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Link to="/patients/new" className="underline">Add patient</Link>
      </div>

      {patients.length === 0 ? (
        <Card>No patients yet — add one using Add patient.</Card>
      ) : (
        <div className="grid gap-3">
          {patients.map(p => (
            <Card key={p.id} className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-slate-400">{p.email || "—"}</div>
              </div>
              <div className="flex gap-2">
                <Link to={`/patients/${p.id}`} className="px-3 py-1 border rounded">View</Link>
                <Link to={`/patients/${p.id}/edit`} className="px-3 py-1 border rounded">Edit</Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
