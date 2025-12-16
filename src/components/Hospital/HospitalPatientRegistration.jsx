import React, { useState } from 'react';
import * as hospitalService from '../../services/hospitalService';

export default function HospitalPatientRegistration() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    dob: '',
    gender: '',
    nfcCardId: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await hospitalService.registerPatient(form);
      setMessage('Patient registered and NFC card linked.');
      setForm({ name: '', phone: '', dob: '', gender: '', nfcCardId: '' });
    } catch (e) {
      setMessage(e.message || 'Failed to register patient');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Patient Registration & NFC Issuance</h3>
      </div>
      <form className="reg-form" onSubmit={handleSubmit}>
        <div className="reg-grid">
          <label>
            Full Name
            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
            />
          </label>
          <label>
            Phone
            <input
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              required
            />
          </label>
          <label>
            Date of Birth
            <input
              type="date"
              value={form.dob}
              onChange={(e) => update('dob', e.target.value)}
            />
          </label>
          <label>
            Gender
            <select
              value={form.gender}
              onChange={(e) => update('gender', e.target.value)}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            NFC Card ID
            <input
              value={form.nfcCardId}
              onChange={(e) => update('nfcCardId', e.target.value)}
              placeholder="Scan or enter"
            />
          </label>
        </div>
        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'Saving…' : 'Register Patient'}
        </button>
        {message && <div className="hint" style={{ marginTop: 8 }}>{message}</div>}
      </form>
    </div>
  );
}
