import React, { useState, useEffect } from 'react';
import { DataService } from '../../services/DataService';
import { Activity, FileText, Calendar, Pill, Shield, Heart, Download } from 'lucide-react';

const PatientDashboard = ({ patientId }) => {
  const [patient, setPatient] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);
  const [healthScore, setHealthScore] = useState(85);

  useEffect(() => {
    const data = DataService.get();
    const patientData = data.patients.find(p => p.id === patientId);
    setPatient(patientData);
    
    // Get upcoming appointments
    const appointments = data.appointments?.filter(apt => 
      apt.patientId === patientId && 
      new Date(apt.date) >= new Date()
    ) || [];
    setUpcomingAppointments(appointments);
    
    // Get recent medical records
    const records = patientData?.medicalHistory?.slice(0, 3) || [];
    setRecentRecords(records);
  }, [patientId]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{patient.name}</h1>
              <p className="text-blue-100">
                HealthKey ID: {patient.nfcId} • {patient.age} yrs • {patient.bloodGroup}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{healthScore}</div>
            <p className="text-sm text-blue-200">Health Score</p>
          </div>
        </div>
      </div>

      {/* Health Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Last Checkup</p>
              <p className="font-bold">15 days ago</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Current Doctor</p>
              <p className="font-bold">Dr. {patient.assignedDoctor || 'Not Assigned'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Prescriptions</p>
              <p className="font-bold">{patient.prescriptions?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Upcoming Appointments</p>
              <p className="font-bold">{upcomingAppointments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700">
          <FileText className="w-6 h-6 mx-auto mb-2" />
          <p className="text-sm font-medium">View Records</p>
        </button>
        <button className="bg-green-600 text-white p-4 rounded-xl hover:bg-green-700">
          <Calendar className="w-6 h-6 mx-auto mb-2" />
          <p className="text-sm font-medium">Book Appointment</p>
        </button>
        <button className="bg-purple-600 text-white p-4 rounded-xl hover:bg-purple-700">
          <Download className="w-6 h-6 mx-auto mb-2" />
          <p className="text-sm font-medium">Download Health Card</p>
        </button>
        <button className="bg-red-600 text-white p-4 rounded-xl hover:bg-red-700">
          <Shield className="w-6 h-6 mx-auto mb-2" />
          <p className="text-sm font-medium">Emergency Access</p>
        </button>
      </div>

      {/* Recent Records */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Medical Records</h2>
        <div className="space-y-3">
          {recentRecords.map((record, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
              <div>
                <p className="font-medium">{record.diagnosis}</p>
                <p className="text-sm text-slate-500">
                  {record.hospital} • {record.date} • {record.doctor}
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {record.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;