import React, { useState } from 'react';
import { Pill, Clock, User, AlertCircle } from 'lucide-react';

const PrescriptionModule = ({ patient, consultation, onComplete, onCancel }) => {
  const [prescription, setPrescription] = useState({
    diagnosis: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
    tests: [],
    advice: '',
    followUp: ''
  });

  const addMedicine = () => {
    setPrescription({
      ...prescription,
      medicines: [...prescription.medicines, { name: '', dosage: '', frequency: '', duration: '' }]
    });
  };

  const updateMedicine = (index, field, value) => {
    const updatedMedicines = [...prescription.medicines];
    updatedMedicines[index][field] = value;
    setPrescription({ ...prescription, medicines: updatedMedicines });
  };

  const handleSubmit = () => {
    onComplete({
      consultationId: consultation.id,
      diagnosis: prescription.diagnosis,
      prescription: prescription.medicines,
      notes: prescription.advice
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Consultation</h2>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 text-slate-600">
              <User className="w-4 h-4" />
              {patient?.name}
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4" />
              Token: {consultation?.tokenNumber}
            </div>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>

      <div className="space-y-6">
        {/* Diagnosis */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Diagnosis *</label>
          <textarea
            value={prescription.diagnosis}
            onChange={(e) => setPrescription({...prescription, diagnosis: e.target.value})}
            className="w-full p-3 border border-slate-300 rounded-lg"
            rows="3"
            placeholder="Enter diagnosis..."
          />
        </div>

        {/* Medicines */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-slate-700">Medicines</label>
            <button
              type="button"
              onClick={addMedicine}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + Add Medicine
            </button>
          </div>
          
          <div className="space-y-3">
            {prescription.medicines.map((medicine, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-lg">
                <input
                  type="text"
                  value={medicine.name}
                  onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                  className="p-2 border rounded"
                  placeholder="Medicine name"
                />
                <input
                  type="text"
                  value={medicine.dosage}
                  onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                  className="p-2 border rounded"
                  placeholder="Dosage"
                />
                <input
                  type="text"
                  value={medicine.frequency}
                  onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                  className="p-2 border rounded"
                  placeholder="Frequency"
                />
                <input
                  type="text"
                  value={medicine.duration}
                  onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                  className="p-2 border rounded"
                  placeholder="Duration"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Tests Recommended */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tests Recommended</label>
          <textarea
            value={prescription.tests.join(', ')}
            onChange={(e) => setPrescription({
              ...prescription,
              tests: e.target.value.split(',').map(t => t.trim())
            })}
            className="w-full p-3 border border-slate-300 rounded-lg"
            rows="2"
            placeholder="Blood test, X-ray, etc."
          />
        </div>

        {/* Medical Advice */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Medical Advice</label>
          <textarea
            value={prescription.advice}
            onChange={(e) => setPrescription({...prescription, advice: e.target.value})}
            className="w-full p-3 border border-slate-300 rounded-lg"
            rows="3"
            placeholder="Enter medical advice..."
          />
        </div>

        {/* Follow-up */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Follow-up Date</label>
          <input
            type="date"
            value={prescription.followUp}
            onChange={(e) => setPrescription({...prescription, followUp: e.target.value})}
            className="w-full p-3 border border-slate-300 rounded-lg"
          />
        </div>

        {/* Warnings */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Important Notes</p>
              <ul className="text-xs text-amber-700 mt-1 list-disc list-inside">
                <li>Prescription will be saved to patient's permanent record</li>
                <li>Check for drug allergies before prescribing</li>
                <li>This consultation will be marked as completed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
          >
            Complete Consultation
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModule;