import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as patientService from '../../services/patientService';

export default function PatientAppointmentsPanel() {
  const [appointments, setAppointments] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    setErr('');
    patientService
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
        <h3>Upcoming Appointments</h3>
        <div className="panel-actions">
          <button className="btn-ghost" onClick={() => navigate('/patient/appointments')}>
            Open
          </button>
          <button className="btn-ghost" onClick={load}>
            Refresh
          </button>
        </div>
      </div>

      {loading && <div>Loading appointments...</div>}
      {err && <div className="error">{err}</div>}

      {!loading && !err && (
        <ul className="simple-list">
          {appointments.length === 0 && (
            <li>
              No upcoming appointments.{' '}
              <button
                className="link-btn"
                onClick={() => navigate('/patient/appointments')}
              >
                Book now
              </button>
            </li>
          )}
          {appointments.slice(0, 5).map((a) => (
            <li key={a._id || a.id}>
              <strong>{a.doctorName || 'Doctor'}</strong> • {a.specialty || '-'}
              <br />
              {a.hospitalName || 'Hospital'} •{' '}
              {a.datetime ? new Date(a.datetime).toLocaleString() : '-'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
