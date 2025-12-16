// src/pages/PatientTimeline.jsx
import React from 'react';

export default function PatientTimeline({ patientId }) {
  // call backend here; for now use demo
  const p = {
    id: patientId || 'P-100',
    name: 'Demo Patient',
    age: 56,
    allergies: ['Penicillin'],
    meds: ['Amlodipine 5mg'],
    vitals: [{ ts: '2025-12-07T10:00', bp: '120/80', hr: 82 }],
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold">Patient — {p.name}</h2>
      <div className="mt-3 bg-white p-3 rounded shadow">
        <div>Age: {p.age}</div>
        <div>Allergies: {p.allergies.join(', ')}</div>
        <div className="mt-2">
          <h4 className="font-medium">Latest vitals</h4>
          {p.vitals.map((v,i)=> <div key={i}>{v.ts} — BP {v.bp} HR {v.hr}</div>)}
        </div>
      </div>
    </div>
  );
}
