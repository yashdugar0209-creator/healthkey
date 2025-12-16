import React, { useEffect, useState } from 'react';
import PatientLayout from './PatientLayout';
import * as patientService from '../services/patientService';

export default function PatientAppointments() {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [dept, setDept] = useState('Cardiology');
  const [mode, setMode] = useState('In-clinic');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    setErr('');
    patientService
      .getAppointments()
      .then((data) => {
        const list = data.appointments || data || [];
        const now = new Date();
        const up = [];
        const pa = [];
        list.forEach((a) => {
          const d = a.datetime ? new Date(a.datetime) : now;
          if (d >= now) up.push(a);
          else pa.push(a);
        });
        setUpcoming(up);
        setPast(pa);
      })
      .catch((e) => setErr(e.message || 'Failed to load appointments'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      alert('Please select date & time');
      return;
    }
    setSaving(true);
    setErr('');
    try {
      await patientService.createAppointment({
        department: dept,
        mode,
        date,
        time,
        note,
      });
      alert('Appointment request submitted.');
      setNote('');
      load();
    } catch (e) {
      setErr(e.message || 'Failed to create appointment');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (appt) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await patientService.cancelAppointment(appt._id || appt.id);
      load();
    } catch (e) {
      alert(e.message || 'Failed to cancel');
    }
  };

  return (
    <PatientLayout
      title="My Appointments"
      subtitle="View, book and manage your appointments."
    >
      <div className="hk-container">
        <div className="panels">
          <div className="panel">
            <div className="panel-header">
              <h3>Upcoming appointments</h3>
              <button className="btn-ghost" onClick={load}>
                Refresh
              </button>
            </div>
            {loading && <div>Loading...</div>}
            {err && <div className="error">{err}</div>}
            {!loading && !err && (
              <table className="hk-table">
                <thead>
                  <tr>
                    <th>Date & time</th>
                    <th>Doctor</th>
                    <th>Department</th>
                    <th>Mode</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {upcoming.length === 0 && (
                    <tr>
                      <td colSpan={5}>No upcoming appointments.</td>
                    </tr>
                  )}
                  {upcoming.map((a) => (
                    <tr key={a._id || a.id}>
                      <td>
                        {a.datetime
                          ? new Date(a.datetime).toLocaleString()
                          : `${a.date || ''} ${a.time || ''}`}
                      </td>
                      <td>{a.doctorName || '-'}</td>
                      <td>{a.department || a.dept || '-'}</td>
                      <td>{a.mode || 'In-clinic'}</td>
                      <td>
                        <button
                          className="btn-small btn-danger"
                          onClick={() => handleCancel(a)}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="panel">
            <h3>Book new appointment</h3>
            <form onSubmit={handleBook} className="reg-form">
              <div className="reg-grid">
                <label>
                  Department
                  <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                  >
                    <option>Cardiology</option>
                    <option>Medicine</option>
                    <option>Orthopedics</option>
                    <option>Dermatology</option>
                  </select>
                </label>
                <label>
                  Mode
                  <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="In-clinic">In-clinic</option>
                    <option value="Teleconsultation">Teleconsultation</option>
                  </select>
                </label>
                <label>
                  Date
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Time
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </label>
              </div>
              <label className="mt-2" style={{ display: 'block' }}>
                Reason / note
                <textarea
                  className="consult-notes"
                  style={{ minHeight: 80 }}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Describe your problem briefly..."
                />
              </label>
              <button type="submit" className="btn" disabled={saving}>
                {saving ? 'Booking…' : 'Submit request'}
              </button>
              <p className="hint">
                Actual confirmation & doctor allocation will be handled by the
                hospital.
              </p>
            </form>
          </div>

          <div className="panel">
            <h3>Past appointments</h3>
            <table className="hk-table">
              <thead>
                <tr>
                  <th>Date & time</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Mode</th>
                </tr>
              </thead>
              <tbody>
                {past.length === 0 && (
                  <tr>
                    <td colSpan={4}>No past appointments.</td>
                  </tr>
                )}
                {past.map((a) => (
                  <tr key={a._id || a.id}>
                    <td>
                      {a.datetime
                        ? new Date(a.datetime).toLocaleString()
                        : `${a.date || ''} ${a.time || ''}`}
                    </td>
                    <td>{a.doctorName || '-'}</td>
                    <td>{a.department || a.dept || '-'}</td>
                    <td>{a.mode || 'In-clinic'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
