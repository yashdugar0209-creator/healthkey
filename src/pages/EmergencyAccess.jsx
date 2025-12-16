// pages/EmergencyAccess.jsx
import React, { useState } from 'react';
import { DataService } from '../services/DataService';
import { AlertTriangle, Shield, Clock, User, FileText, Activity } from 'lucide-react';

const EmergencyAccess = () => {
  const [nfcId, setNfcId] = useState('');
  const [accessorName, setAccessorName] = useState('');
  const [accessorId, setAccessorId] = useState('');
  const [reason, setReason] = useState('');
  const [emergencyAccess, setEmergencyAccess] = useState(null);
  const [patientData, setPatientData] = useState(null);

  const handleEmergencyAccess = (e) => {
    e.preventDefault();
    
    const access = DataService.grantEmergencyAccess(
      nfcId,
      accessorName,
      accessorId,
      reason
    );
    
    if (access) {
      const data = DataService.get();
      const patient = data.patients.find(p => p.id === access.patientId);
      setPatientData(patient);
      setEmergencyAccess(access);
      
      // Auto-redirect to patient data after 2 seconds
      setTimeout(() => {
        window.location.href = `/emergency/patient/${access.patientId}?access=${access.id}`;
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Emergency Access Portal</h1>
          <p className="text-slate-600">Critical medical information access for emergency situations</p>
        </div>

        {!emergencyAccess ? (
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Grant Emergency Access
              </h2>
              <p className="text-red-100 mt-1">Access will expire in 2 hours automatically</p>
            </div>

            <form onSubmit={handleEmergencyAccess} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Patient NFC ID *
                </label>
                <input
                  type="text"
                  required
                  value={nfcId}
                  onChange={(e) => setNfcId(e.target.value.toUpperCase())}
                  className="w-full p-3 border border-slate-300 rounded-lg font-mono"
                  placeholder="HKXXXXX"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Scan NFC card or enter ID from physical card
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={accessorName}
                    onChange={(e) => setAccessorName(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg"
                    placeholder="Dr. Emergency Staff"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Staff ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={accessorId}
                    onChange={(e) => setAccessorId(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg"
                    placeholder="EMP123"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Emergency Reason *
                </label>
                <select
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                >
                  <option value="">Select reason</option>
                  <option value="accident">Road Accident</option>
                  <option value="heart_attack">Cardiac Emergency</option>
                  <option value="stroke">Stroke</option>
                  <option value="unconscious">Unconscious Patient</option>
                  <option value="allergic_reaction">Severe Allergic Reaction</option>
                  <option value="other">Other Emergency</option>
                </select>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-800 font-medium">Legal Notice</p>
                    <p className="text-xs text-red-700">
                      By accessing emergency records, you acknowledge this is for legitimate emergency medical 
                      purposes only. Unauthorized access is prohibited under the Digital Information Security 
                      in Healthcare Act.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-shadow"
              >
                Grant Emergency Access
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Emergency Access Granted
              </h2>
              <p className="text-green-100 mt-1">Access ID: {emergencyAccess.id}</p>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {patientData?.name}
                </h3>
                <p className="text-slate-600">Patient data access granted for 2 hours</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-xs text-slate-500 uppercase font-medium mb-1">Blood Group</div>
                  <div className="text-lg font-bold text-slate-800">{patientData?.bloodGroup}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-xs text-slate-500 uppercase font-medium mb-1">Allergies</div>
                  <div className="text-sm font-medium text-slate-800">{patientData?.allergies}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-xs text-slate-500 uppercase font-medium mb-1">Age</div>
                  <div className="text-lg font-bold text-slate-800">{patientData?.age} years</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-xs text-slate-500 uppercase font-medium mb-1">Emergency Contact</div>
                  <div className="text-sm font-medium text-slate-800">{patientData?.emergencyContact}</div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Access Expires</p>
                    <p className="text-xs text-blue-700">
                      {new Date(emergencyAccess.expiresAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-500 mb-4">
                  Redirecting to complete patient records...
                </p>
                <div className="w-16 h-1 bg-slate-200 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-green-500 animate-progress"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            © 2024 HealthKey Emergency System. All access is logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAccess;