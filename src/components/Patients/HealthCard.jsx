import React, { useState, useEffect } from 'react';
import { Shield, QrCode, Download, Printer, Smartphone, Wifi, Battery } from 'lucide-react';
import { DataService } from '../../services/DataService';
import { generateNFCId } from '../../utils/helpers';

const HealthCard = ({ patientId }) => {
  const [patient, setPatient] = useState(null);
  const [nfcData, setNfcData] = useState('');
  const [isVirtual, setIsVirtual] = useState(false);

  useEffect(() => {
    const data = DataService.get();
    const patientData = data.patients.find(p => p.id === patientId);
    setPatient(patientData);
    
    if (patientData?.nfcId) {
      setNfcData(patientData.nfcId);
    }
  }, [patientId]);

  const generateQRCode = () => {
    // In real app, generate QR code for patient data
    return `https://healthkey.in/patient/${patientId}`;
  };

  const downloadCard = (format) => {
    const link = document.createElement('a');
    link.href = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(patient, null, 2)
    )}`;
    link.download = `HealthKey_${patient?.name}_${new Date().toISOString().split('T')[0]}.${format}`;
    link.click();
  };

  if (!patient) {
    return <div>Loading health card...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">HealthKey Card</h2>
          <p className="text-slate-600">Your digital health identity card</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => downloadCard('json')}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Health Card Design */}
      <div className="max-w-2xl mx-auto">
        {/* Physical Card Design */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="p-8 text-white">
            {/* Card Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-bold">HealthKey</h1>
                <p className="text-blue-200">India's Digital Health Card</p>
              </div>
              <div className="text-right">
                <Shield className="w-12 h-12 opacity-80" />
                <p className="text-sm text-blue-200 mt-2">Govt. Verified</p>
              </div>
            </div>

            {/* Patient Info */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-blue-200 text-sm">Patient Name</p>
                <p className="text-2xl font-bold">{patient.name}</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">NFC ID</p>
                <p className="text-xl font-mono font-bold">{patient.nfcId || 'HK' + Date.now().toString(36).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Blood Group</p>
                <p className="text-3xl font-bold">{patient.bloodGroup}</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Age / Gender</p>
                <p className="text-xl font-bold">{patient.age} yrs • {patient.gender}</p>
              </div>
            </div>

            {/* Emergency Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-200 text-sm">Emergency Contact</p>
                  <p className="text-lg font-bold">{patient.emergencyContact}</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-200 text-sm">Allergies</p>
                  <p className="text-sm font-bold">{patient.allergies || 'None reported'}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-200 text-sm">Insurance</p>
                  <p className="text-sm font-bold">{patient.insurance?.provider || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-blue-500/30">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-sm">Tap to read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4" />
                  <span className="text-sm">NFC Enabled</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-300">Valid across all hospitals</p>
                <p className="text-sm font-bold">Issued: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Virtual Card Controls */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Virtual Card Controls</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setIsVirtual(!isVirtual)}
              className={`p-4 rounded-xl border flex flex-col items-center ${
                isVirtual ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <Smartphone className={`w-8 h-8 mb-2 ${isVirtual ? 'text-blue-600' : 'text-slate-600'}`} />
              <span className={`font-medium ${isVirtual ? 'text-blue-700' : 'text-slate-700'}`}>
                Virtual Card
              </span>
              <span className="text-sm text-slate-500 mt-1">
                {isVirtual ? 'Active' : 'Activate'}
              </span>
            </button>

            <div className="p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-700">NFC Status</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Active</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Card can be tapped at any hospital
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-700">Last Used</span>
                <span className="text-sm text-slate-600">2 days ago</span>
              </div>
              <p className="text-xs text-slate-500">
                At Apollo Hospitals, Delhi
              </p>
            </div>
          </div>

          {/* QR Code Display */}
          <div className="text-center">
            <div className="inline-block p-6 bg-white border-2 border-dashed border-slate-300 rounded-2xl mb-4">
              <div className="w-48 h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center rounded-xl">
                <QrCode className="w-32 h-32 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Scan this QR code at hospitals for instant registration
            </p>
            <button className="text-blue-600 font-medium hover:text-blue-700">
              Show full QR code
            </button>
          </div>
        </div>

        {/* Card Security */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-amber-600 mt-1" />
            <div>
              <h4 className="font-bold text-amber-800 mb-2">Card Security</h4>
              <ul className="text-sm text-amber-700 space-y-2">
                <li>• Report lost card immediately to block access</li>
                <li>• Card automatically locks after 5 failed attempts</li>
                <li>• All access is logged and can be reviewed</li>
                <li>• Emergency access requires OTP verification</li>
              </ul>
              <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700">
                Report Lost Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCard;