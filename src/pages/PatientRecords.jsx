import React, { useEffect, useState } from 'react';
import PatientLayout from './PatientLayout';
import * as patientService from '../services/patientService';

export default function PatientRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [type, setType] = useState('Lab report');
  const [notes, setNotes] = useState('');

  const load = () => {
    setLoading(true);
    setErr('');
    patientService
      .getRecords()
      .then((data) => setRecords(data.records || data || []))
      .catch((e) => setErr(e.message || 'Failed to load records'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Select a file to upload.');
      return;
    }
    const form = new FormData();
    form.append('file', file);
    form.append('type', type);
    form.append('notes', notes);

    setUploading(true);
    setErr('');
    try {
      await patientService.uploadRecord(form);
      setFile(null);
      setNotes('');
      load();
      alert('Record uploaded.');
    } catch (e) {
      setErr(e.message || 'Failed to upload record');
    } finally {
      setUploading(false);
    }
  };

  return (
    <PatientLayout
      title="My Medical Records"
      subtitle="View and upload your medical records."
    >
      <div className="hk-container">
        <div className="panels">
          <div className="panel">
            <div className="panel-header">
              <h3>Records list</h3>
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
                    <th>Date</th>
                    <th>Type</th>
                    <th>Title / note</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 && (
                    <tr>
                      <td colSpan={4}>No records found.</td>
                    </tr>
                  )}
                  {records.map((r) => (
                    <tr key={r._id || r.id}>
                      <td>
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleDateString()
                          : '-'}
                      </td>
                      <td>{r.type || 'Record'}</td>
                      <td>{r.title || r.notes || '-'}</td>
                      <td>{r.source || r.hospitalName || 'Uploaded'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="panel">
            <h3>Upload new record</h3>
            <form onSubmit={handleUpload} className="reg-form">
              <div className="reg-grid">
                <label>
                  Record type
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option>Lab report</option>
                    <option>Prescription</option>
                    <option>Discharge summary</option>
                    <option>Scan / imaging</option>
                    <option>Other</option>
                  </select>
                </label>
                <label>
                  File
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0] || null)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                </label>
              </div>
              <label style={{ display: 'block', marginTop: 8 }}>
                Notes (optional)
                <textarea
                  className="consult-notes"
                  style={{ minHeight: 80 }}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Short description for your reference"
                />
              </label>
              <button type="submit" className="btn" disabled={uploading}>
                {uploading ? 'Uploading…' : 'Upload record'}
              </button>
              <p className="hint">
                Only you and your authorised doctors will be able to see these
                records.
              </p>
            </form>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}