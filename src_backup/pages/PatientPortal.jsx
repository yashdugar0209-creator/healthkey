import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, FileText, Calendar, Shield, Activity, 
  Settings, Bell, Heart, Pill, Download
} from 'lucide-react';

// Components
import PatientDashboard from '../components/Patient/PatientDashboard';
import MedicalRecords from '../components/Patient/MedicalRecords';
import HealthCard from '../components/Patient/HealthCard';

const PatientPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || user.role !== 'patient') {
    return <div>Access denied. Please login as a patient.</div>;
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'records', label: 'Medical Records', icon: FileText },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'healthcard', label: 'Health Card', icon: Shield },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { id: 'doctors', label: 'My Doctors', icon: Activity },
    { id: 'emergency', label: 'Emergency', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Patient Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Patient Portal</h1>
                <p className="text-blue-100">Your health, your control</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 bg-white/20 rounded-full hover:bg-white/30">
                <Bell className="w-5 h-5" />
              </button>
              <div className="text-right">
                <p className="font-medium">Welcome, {user.name}</p>
                <p className="text-sm opacity-90">HealthKey ID: {user.patientId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 bg-white rounded-xl shadow-sm border p-4 h-fit sticky top-6">
            <nav className="space-y-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-100'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
            
            {/* Quick Stats */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Health Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Health Score</span>
                  <span className="font-bold text-green-600">85</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Last Checkup</span>
                  <span className="text-sm font-medium">15 days ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Next Appointment</span>
                  <span className="text-sm font-medium">Tomorrow</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'overview' && <PatientDashboard patientId={user.patientId} />}
            {activeTab === 'records' && <MedicalRecords patientId={user.patientId} />}
            {activeTab === 'healthcard' && <HealthCard patientId={user.patientId} />}
            {activeTab === 'appointments' && <AppointmentsTab />}
            {activeTab === 'prescriptions' && <PrescriptionsTab />}
            {activeTab === 'doctors' && <DoctorsTab />}
            {activeTab === 'emergency' && <EmergencyTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </main>
        </div>
      </div>
    </div>
  );
};

// Additional Tab Components
const AppointmentsTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">My Appointments</h2>
      {/* Appointment content */}
    </div>
  </div>
);

const PrescriptionsTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">My Prescriptions</h2>
      {/* Prescriptions content */}
    </div>
  </div>
);

const DoctorsTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">My Doctors</h2>
      {/* Doctors content */}
    </div>
  </div>
);

const EmergencyTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Emergency Access</h2>
      {/* Emergency content */}
    </div>
  </div>
);

const SettingsTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Settings</h2>
      {/* Settings content */}
    </div>
  </div>
);

export default PatientPortal;