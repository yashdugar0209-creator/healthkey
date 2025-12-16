import React, { useEffect, useState } from 'react';
import * as doctorService from '../../services/doctorService';

export default function DoctorAppointmentsPanel() {
  const [appointments, setAppointments] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    setErr('');
    doctorService
      .getAppointments()
      .then((data) => setAppointments(data.appointments || data))
      .catch((e) => setErr(e.message || 'Failed to load appointments'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Today’s Appointments</h3>
        <div className="panel-actions">
          <button className="btn-ghost" onClick={load}>Refresh</button>
        </div>
      </div>

      {loading && <div>Loading appointments...</div>}
      {err && <div className="error">{err}</div>}

      {!loading && !err && (
        <ul className="simple-list">
          {appointments.length === 0 && <li>No appointments scheduled.</li>}
          {appointments.slice(0, 6).map((a) => (
            <li key={a._id || a.id}>
              <strong>{a.patientName || 'Patient'}</strong> — {a.reason || 'Consultation'}<br />
              {a.datetime ? new Date(a.datetime).toLocaleTimeString() : '-'} •{' '}
              {a.mode || 'In-clinic'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
