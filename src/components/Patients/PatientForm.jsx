import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dataService from "../services/DataService";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";

const patientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  age: z.string().optional(),
  gender: z.string().optional(),
  notes: z.string().optional(),
});

export default function PatientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patients = dataService.get("patients", []) || [];
  const existing = id ? patients.find(p => String(p.id) === String(id)) : null;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: existing || { name: "", age: "", gender: "", notes: "" }
  });

  function onSubmit(data) {
    if (existing) {
      const updated = patients.map(p => p.id === existing.id ? { ...p, ...data } : p);
      dataService.set("patients", updated);
    } else {
      const newP = { id: uuidv4(), ...data };
      dataService.set("patients", [...patients, newP]);
    }
    navigate("/patients");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input {...register("name")} className="mt-1 block w-full rounded-md p-2 border" />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Age</label>
        <input {...register("age")} className="mt-1 block w-full rounded-md p-2 border" />
      </div>

      <div>
        <label className="block text-sm font-medium">Gender</label>
        <select {...register("gender")} className="mt-1 block w-full rounded-md p-2 border">
          <option value="">Select</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Notes</label>
        <textarea {...register("notes")} className="mt-1 block w-full rounded-md p-2 border" />
      </div>

      <div>
        <button type="submit" className="px-4 py-2 bg-brand-500 text-white rounded-md">Save</button>
      </div>
    </form>
  );
}
