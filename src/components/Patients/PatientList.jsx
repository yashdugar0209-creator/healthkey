import Card from "../ui/Card";
import { Link } from "react-router-dom";
import dataService from "../../services/DataService";

export default function PatientList() {
  const patients = dataService.get("patients", []) || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Patients</h2>
        <Link to="/patients/new" className="text-sm">
          <button className="px-3 py-1 border rounded-md">Add Patient</button>
        </Link>
      </div>

      {patients.length === 0 ? (
        <Card>No patients yet. Click Add to create one.</Card>
      ) : (
        <div className="grid gap-4">
          {patients.map(p => (
            <Card key={p.id} className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-slate-500">{p.age ? `Age ${p.age}` : ""} {p.gender && `• ${p.gender}`}</div>
              </div>
              <div className="flex gap-2">
                <Link to={`/patients/${p.id}`} className="px-3 py-1 border rounded-md">View</Link>
                <Link to={`/patients/${p.id}/edit`} className="px-3 py-1 border rounded-md">Edit</Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
