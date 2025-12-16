import React, { useState } from 'react';
import DoctorEPrescriptionForm from './DoctorEPrescriptionForm';
import * as doctorService from '../../services/doctorService';

export default function DoctorConsultationRoom() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveConsultation = async () => {
    if (!selectedPatient) {
      alert('Select a patient first.');
      return;
    }
    setSaving(true);
    try {
      await doctorService.createConsultation({
        patientId: selectedPatient.id || selectedPatient._id,
        notes,
      });
      setNotes('');
      alert('Consultation saved.');
    } catch (e) {
      alert(e.message || 'Failed to save consultation');
    } finally {
      setSaving(false);
    }
  };

  // For MVP, we show a static patient preview; you can wire this to queue click later.
  const demoPatient = {
    id: 'demo-patient',
    name: 'John Doe',
    age: 42,
    gender: 'Male',
    conditions: ['Hypertension', 'Type 2 Diabetes'],
  };

  const ensurePatientLoaded = () => {
    if (!selectedPatient) setSelectedPatient(demoPatient);
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Consultation Room</h3>
        <div className="panel-actions">
          <button className="btn-ghost" onClick={ensurePatientLoaded}>
            Load demo patient
          </button>
        </div>
      </div>

      {!selectedPatient && (
        <p>Select a patient from the queue, or click “Load demo patient”.</p>
      )}

      {selectedPatient && (
        <div className="consult-layout">
          <div className="consult-left">
            <h4>Patient Summary</h4>
            <div className="patient-summary-card">
              <div className="ps-name">{selectedPatient.name}</div>
              <div className="ps-meta">
                {selectedPatient.age} yrs • {selectedPatient.gender}
              </div>
              <div className="ps-conditions">
                <strong>Conditions:</strong>{' '}
                {(selectedPatient.conditions || []).join(', ') || 'None'}
              </div>
            </div>

            <h4>Clinical Notes</h4>
            <textarea
              className="consult-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Symptoms, examination findings, diagnosis, plan..."
            />

            <button
              className="btn"
              onClick={handleSaveConsultation}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save Consultation'}
            </button>
          </div>

          <div className="consult-right">
            <DoctorEPrescriptionForm patient={selectedPatient} />
          </div>
        </div>
      )}
    </div>
  );
}
