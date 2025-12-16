// pages/HospitalPortal.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { DataService } from '../services/DataService';
import { Building2, Users, Stethoscope, UserPlus, Scan, Settings, Bell, Activity, TrendingUp, Clipboard, FileText } from 'lucide-react';

// Components
import HospitalDashboard from '../components/Hospital/HospitalDashboard';
import DoctorManagement from '../components/Hospital/DoctorManagement';
import PatientRegistration from '../components/Hospital/PatientRegistration';
import NFCReader from '../components/Common/NFCReader';

const HospitalPortal = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [hospitalData, setHospitalData] = useState(null);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('healthkey_user'));
    if (user?.role !== 'hospital') {
      navigate('/dashboard');
      return;
    }

    const data = DataService.get();
    const hospital = data.hospitals.find(h => h.id === user.hospitalId);
    setHospitalData(hospital);
    
    if (hospital) {
      const hospitalStats = DataService.getHospitalStats(hospital.id);
      setStats(hospitalStats);
    }
  }, [navigate]);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'register', label: 'New Registration', icon: UserPlus },
    { id: 'nfc', label: 'NFC Reader', icon: Scan },
    { id: 'queue', label: 'Queue Management', icon: Clipboard },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hospital Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {hospitalData?.name || 'Hospital Portal'}
              </h1>
              <p className="text-slate-600 text-sm">
                {hospitalData?.address}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
              <div className="text-right">
                <p className="font-medium">Emergency: {hospitalData?.emergencyContact}</p>
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
            {stats && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Quick Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Doctors Online</span>
                    <span className="font-bold text-blue-600">{stats.totalDoctors}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Patients Today</span>
                    <span className="font-bold text-green-600">{stats.activeConsultations}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Waiting</span>
                    <span className="font-bold text-amber-600">{stats.waitingPatients}</span>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'overview' && <HospitalDashboard hospital={hospitalData} />}
            {activeTab === 'doctors' && <DoctorManagement hospital={hospitalData} />}
            {activeTab === 'register' && <PatientRegistration hospital={hospitalData} />}
            {activeTab === 'nfc' && <NFCReader hospital={hospitalData} />}
            {activeTab === 'queue' && <QueueManagement hospital={hospitalData} />}
            {activeTab === 'reports' && <HospitalReports hospital={hospitalData} />}
            {activeTab === 'settings' && <HospitalSettings hospital={hospitalData} />}
          </main>
        </div>
      </div>
    </div>
  );
};

// Additional Components
const QueueManagement = ({ hospital }) => {
  const [queueData, setQueueData] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const data = DataService.get();
    const doctors = data.doctors.filter(d => d.hospitalId === hospital.id);
    const queue = doctors.map(doctor => ({
      doctor,
      queue: DataService.getDoctorQueue(doctor.id)
    }));
    setQueueData(queue);
  }, [hospital]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Queue Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {queueData.map((item, idx) => (
            <div key={idx} className="bg-slate-50 rounded-lg p-4 border">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-slate-800">Dr. {item.doctor.name}</h3>
                  <p className="text-sm text-slate-500">{item.doctor.specialization}</p>
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                  {item.queue.length} waiting
                </span>
              </div>
              
              <div className="space-y-2">
                {item.queue.slice(0, 3).map((q, qIdx) => (
                  <div key={qIdx} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div>
                      <p className="font-medium text-sm">{q.patient?.name}</p>
                      <p className="text-xs text-slate-500">Token: {q.consultation?.tokenNumber}</p>
                    </div>
                    <span className="text-sm font-bold text-amber-600">
                      {q.waitTime} min
                    </span>
                  </div>
                ))}
                
                {item.queue.length > 3 && (
                  <p className="text-center text-sm text-slate-500 pt-2">
                    +{item.queue.length - 3} more patients
                  </p>
                )}
              </div>
              
              <button 
                onClick={() => setSelectedDoctor(item.doctor)}
                className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Manage Queue
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HospitalReports = ({ hospital }) => {
  const [reports, setReports] = useState({
    daily: [],
    weekly: [],
    monthly: []
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Hospital Reports & Analytics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-blue-600" />
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">1,247</h3>
            <p className="text-sm text-slate-600">Total Patients This Month</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-green-600" />
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">₹8,74,500</h3>
            <p className="text-sm text-slate-600">Monthly Revenue</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <Stethoscope className="w-8 h-8 text-purple-600" />
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">94%</h3>
            <p className="text-sm text-slate-600">Patient Satisfaction</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <Clipboard className="w-8 h-8 text-amber-600" />
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">12 min</h3>
            <p className="text-sm text-slate-600">Avg. Wait Time</p>
          </div>
        </div>
        
        {/* Report Generation */}
        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Generate Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-800 mb-2">Daily Report</h4>
              <p className="text-sm text-slate-600">Patient visits, revenue, doctor performance</p>
            </button>
            <button className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-800 mb-2">Weekly Analytics</h4>
              <p className="text-sm text-slate-600">Trends, patient flow, resource utilization</p>
            </button>
            <button className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-800 mb-2">Monthly Summary</h4>
              <p className="text-sm text-slate-600">Financial reports, inventory, staff performance</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HospitalSettings = ({ hospital }) => {
  const [settings, setSettings] = useState({
    emergencyContact: hospital?.emergencyContact || '',
    departments: hospital?.departments || [],
    facilities: hospital?.facilities || []
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Hospital Settings</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Emergency Contact Number
            </label>
            <input
              type="text"
              value={settings.emergencyContact}
              onChange={(e) => setSettings({...settings, emergencyContact: e.target.value})}
              className="w-full p-3 border border-slate-300 rounded-lg"
              placeholder="+91 XXX XXX XXXX"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hospital Departments
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {settings.departments.map((dept, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {dept}
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add new department"
              className="w-full p-3 border border-slate-300 rounded-lg"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  setSettings({
                    ...settings,
                    departments: [...settings.departments, e.target.value]
                  });
                  e.target.value = '';
                }
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Facilities & Equipment
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['ICU', 'NICU', 'MRI', 'CT Scan', 'X-Ray', 'Operation Theater', 'Pharmacy', 'Ambulance', '24/7 Emergency'].map(facility => (
                <label key={facility} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.facilities.includes(facility)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSettings({
                          ...settings,
                          facilities: [...settings.facilities, facility]
                        });
                      } else {
                        setSettings({
                          ...settings,
                          facilities: settings.facilities.filter(f => f !== facility)
                        });
                      }
                    }}
                    className="rounded border-slate-300"
                  />
                  <span className="text-sm text-slate-700">{facility}</span>
                </label>
              ))}
            </div>
          </div>
          
          <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default HospitalPortal;