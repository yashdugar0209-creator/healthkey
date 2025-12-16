import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Container from "../components/ui/Container";
import dataService from "../services/DataService";
import { v4 as uuidv4 } from "uuid";

export default function PatientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (id) {
      const patients = dataService.get("patients", []) || [];
      const p = patients.find(x => String(x.id) === String(id));
      if (p) reset(p);
    }
  }, [id, reset]);

  function onSubmit(data) {
    const patients = dataService.get("patients", []) || [];
    if (id) {
      const updated = patients.map(p => (String(p.id) === String(id) ? { ...p, ...data } : p));
      dataService.set("patients", updated);
    } else {
      const newP = { id: uuidv4(), ...data };
      dataService.set("patients", [...patients, newP]);
    }
    navigate("/patients");
  }

  return (
    <Container className="py-6">
      <h1 className="text-2xl font-bold mb-4">{id ? "Edit Patient" : "New Patient"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm">Name</label>
          <input {...register("name", { required: true })} className="mt-1 block w-full rounded-md p-2 border" />
        </div>

        <div>
          <label className="block text-sm">Email</label>
          <input {...register("email")} className="mt-1 block w-full rounded-md p-2 border" />
        </div>

        <div>
          <label className="block text-sm">Notes</label>
          <textarea {...register("notes")} className="mt-1 block w-full rounded-md p-2 border" />
        </div>

        <div>
          <button type="submit" className="px-4 py-2 bg-brand-500 text-white rounded-md">{id ? "Save" : "Create"}</button>
        </div>
      </form>
    </Container>
  );
}
