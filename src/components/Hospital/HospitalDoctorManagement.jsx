import React, { useEffect, useState } from 'react';
import * as hospitalService from '../../services/hospitalService';

export default function HospitalDoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    setErr('');
    hospitalService
      .getDoctors()
      .then((data) => setDoctors(data.doctors || data))
      .catch((e) => setErr(e.message || 'Failed to load doctors'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Doctor Management</h3>
        <button className="btn-ghost" onClick={load}>
          Refresh
        </button>
      </div>

      {loading && <div>Loading doctors...</div>}
      {err && <div className="error">{err}</div>}

      {!loading && !err && (
        <ul className="simple-list">
          {doctors.length === 0 && <li>No doctors found.</li>}
          {doctors.slice(0, 6).map((d) => (
            <li key={d._id || d.id}>
              <strong>{d.name}</strong> — {d.specialty || 'General'}<br />
              {d.status || 'On duty'} • {d.department || '-'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
