// src/pages/ER_Triage.jsx
import React, { useState } from 'react';

export default function ER_Triage() {
  const [queue] = useState([
    { id: 'ER-1', name: 'Ambulance Pt', triage: 'RED', note: 'Chest pain' },
    { id: 'ER-2', name: 'Walk-in', triage: 'AMBER', note: 'Breathlessness' },
  ]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold">ER Triage</h2>
      <div className="mt-4 space-y-2">
        {queue.map((p) => (
          <div key={p.id} className="p-3 bg-white rounded shadow flex justify-between">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-slate-500">{p.note}</div>
            </div>
            <div className="text-sm">
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700">{p.triage}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
