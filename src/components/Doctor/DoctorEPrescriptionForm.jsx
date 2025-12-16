import React, { useState } from 'react';
import * as doctorService from '../../services/doctorService';

export default function DoctorEPrescriptionForm({ patient }) {
  const [meds, setMeds] = useState([
    { name: '', dose: '', freq: '', duration: '' },
  ]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const updateMed = (index, field, value) => {
    const next = meds.slice();
    next[index][field] = value;
    setMeds(next);
  };

  const addRow = () => {
    setMeds([...meds, { name: '', dose: '', freq: '', duration: '' }]);
  };

  const removeRow = (index) => {
    setMeds(meds.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patient) {
      alert('Select a patient first.');
      return;
    }
    const cleaned = meds.filter((m) => m.name.trim());
    if (cleaned.length === 0) {
      alert('Add at least one medicine.');
      return;
    }
    setSaving(true);
    try {
      await doctorService.createPrescription({
        patientId: patient.id || patient._id,
        meds: cleaned,
        notes,
      });
      alert('Prescription saved.');
      setNotes('');
      setMeds([{ name: '', dose: '', freq: '', duration: '' }]);
    } catch (e) {
      alert(e.message || 'Failed to save prescription');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ep-panel">
      <h4>E-Prescription</h4>
      <form onSubmit={handleSubmit} className="ep-form">
        <div className="ep-meds">
          {meds.map((m, idx) => (
            <div className="ep-row" key={idx}>
              <input
                placeholder="Medicine"
                value={m.name}
                onChange={(e) => updateMed(idx, 'name', e.target.value)}
              />
              <input
                placeholder="Dose"
                value={m.dose}
                onChange={(e) => updateMed(idx, 'dose', e.target.value)}
              />
              <input
                placeholder="Freq (e.g. 1-0-1)"
                value={m.freq}
                onChange={(e) => updateMed(idx, 'freq', e.target.value)}
              />
              <input
                placeholder="Duration (days)"
                value={m.duration}
                onChange={(e) => updateMed(idx, 'duration', e.target.value)}
              />
              {meds.length > 1 && (
                <button
                  type="button"
                  className="btn-small btn-danger"
                  onClick={() => removeRow(idx)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="button" className="btn-ghost" onClick={addRow}>
          + Add medicine
        </button>

        <textarea
          className="ep-notes"
          placeholder="Advice / instructions"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'Saving…' : 'Save Prescription'}
        </button>
      </form>
    </div>
  );
}
