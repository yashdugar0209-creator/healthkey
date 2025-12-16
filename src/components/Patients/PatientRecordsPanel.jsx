import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as patientService from '../../services/patientService';

export default function PatientRecordsPanel() {
  const [records, setRecords] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    setErr('');
    patientService
      .getRecords()
      .then((data) => setRecords(data.records || data))
      .catch((e) => setErr(e.message || 'Failed to load records'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Recent Medical Records</h3>
        <div className="panel-actions">
          <button className="btn-ghost" onClick={() => navigate('/patient/records')}>
            View all
          </button>
          <button className="btn-ghost" onClick={load}>
            Refresh
          </button>
        </div>
      </div>

      {loading && <div>Loading records...</div>}
      {err && <div className="error">{err}</div>}

      {!loading && !err && (
        <ul className="simple-list">
          {records.length === 0 && <li>No records yet.</li>}
          {records.slice(0, 5).map((r) => (
            <li key={r._id || r.id}>
              <strong>{r.type || 'Consultation'}</strong> — {r.summary || 'No summary'}
              <br />
              {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
