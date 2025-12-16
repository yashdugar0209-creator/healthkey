// pages/DoctorPortal.jsx
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/DataService';
import { Stethoscope, Users, Clock, Bell, Activity, Calendar, FileText, MessageCircle, TrendingUp } from 'lucide-react';

// Components
import PatientQueue from '../components/Doctor/PatientQueue';
import PrescriptionModule from '../components/Doctor/PrescriptionModule';

const DoctorPortal = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [activeTab, setActiveTab] = useState('queue');
  const [queue, setQueue] = useState([]);
  const [consultation, setConsultation] = useState(null);
  const [stats, setStats] = useState({
    todayPatients: 0,
    completedToday: 0,
    avgTime: 0,
    revenue: 0
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('healthkey_user'));
    if (user?.role !== 'doctor') {
      window.location.href = '/dashboard';
      return;
    }

    const data = DataService.get();
    const doctor = data.doctors.find(d => d.id === user.doctorId);
    setDoctorData(doctor);
    
    if (doctor) {
      const queueData = DataService.getDoctorQueue(doctor.id);
      setQueue(queueData);
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayConsultations = data.consultations?.filter(c => 
        c.doctorId === doctor.id && c.date.startsWith(today)
      ) || [];
      
      setStats({
        todayPatients: queueData.length,
        completedToday: todayConsultations.filter(c => c.status === 'completed').length,
        avgTime: 15, // Mock average
        revenue: todayConsultations.filter(c => c.status === 'completed').length * (doctor.consultationFee || 0)
      });
    }
  }, []);

  const startConsultation = (patient) => {
    setConsultation(patient);
    setActiveTab('consultation');
  };

  const completeConsultation = (data) => {
    DataService.completeConsultation(
      data.consultationId,
      data.diagnosis,
      data.prescription,
      data.notes
    );
    
    // Refresh queue
    const updatedQueue = DataService.getDoctorQueue(doctorData.id);
    setQueue(updatedQueue);
    setConsultation(null);
    setActiveTab('queue');
  };

  const navItems = [
    { id: 'queue', label: 'Patient Queue', icon: Users },
    { id: 'consultation', label: 'Consultation', icon: Stethoscope, disabled: !consultation },
    { id: 'patients', label: 'My Patients', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageCircle }
  ];

  if (!doctorData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Doctor Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Stethoscope className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dr. {doctorData.name}</h1>
                <p className="text-blue-100">{doctorData.specialization}</p>
                <p className="text-sm text-blue-200">{doctorData.qualifications}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 bg-white/20 rounded-full hover:bg-white/30">
                <Bell className="w-5 h-5" />
              </button>
              <div className="text-right">
                <p className="font-medium">Consultation Fee: ₹{doctorData.consultationFee}</p>
                <p className="text-sm opacity-90">Available Today</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.todayPatients}</div>
              <div className="text-sm text-slate-600">Patients in Queue</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-green-600">{stats.completedToday}</div>
              <div className="text-sm text-slate-600">Completed Today</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-amber-600">{stats.avgTime} min</div>
              <div className="text-sm text-slate-600">Avg. Consultation Time</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-purple-600">₹{stats.revenue}</div>
              <div className="text-sm text-slate-600">Revenue Today</div>
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
                  onClick={() => !item.disabled && setActiveTab(item.id)}
                  disabled={item.disabled}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-100'
                      : item.disabled
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
            
            {/* Availability */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Today's Availability
              </h3>
              <div className="space-y-2">
                {doctorData.availability && Object.entries(doctorData.availability).map(([day, slots]) => {
                  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
                  if (day === today) {
                    return slots.map((slot, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-700">{slot}</span>
                      </div>
                    ));
                  }
                  return null;
                })}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'queue' && (
              <PatientQueue 
                queue={queue}
                onStartConsultation={startConsultation}
                doctor={doctorData}
              />
            )}
            
            {activeTab === 'consultation' && consultation && (
              <PrescriptionModule
                patient={consultation.patient}
                consultation={consultation.consultation}
                onComplete={completeConsultation}
                onCancel={() => {
                  setConsultation(null);
                  setActiveTab('queue');
                }}
              />
            )}
            
            {activeTab === 'patients' && (
              <DoctorPatients doctor={doctorData} />
            )}
            
            {activeTab === 'schedule' && (
              <DoctorSchedule doctor={doctorData} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// Additional Components
const DoctorPatients = ({ doctor }) => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const data = DataService.get();
    const doctorPatients = doctor.assignedPatients?.map(patientId => 
      data.patients.find(p => p.id === patientId)
    ) || [];
    setPatients(doctorPatients.filter(p => p));
  }, [doctor]);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6">My Patients ({patients.length})</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Patient</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Last Visit</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient.id} className="border-b hover:bg-slate-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      {patient.name[0]}
                    </div>
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-slate-500">{patient.age} yrs • {patient.bloodGroup}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {patient.medicalHistory?.[0]?.date || 'No visits'}
                </td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Active
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button className="px-4 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                    View History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DoctorSchedule = ({ doctor }) => {
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    setSchedule(doctor.availability || {});
  }, [doctor]);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Weekly Schedule</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {days.map(day => (
          <div key={day} className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-bold text-slate-800 mb-3 capitalize">{day}</h3>
            <div className="space-y-2">
              {schedule[day]?.map((slot, idx) => (
                <div key={idx} className="bg-white border rounded p-2 text-sm">
                  {slot}
                </div>
              )) || (
                <p className="text-sm text-slate-500 italic">Not available</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold text-slate-800 mb-2">Schedule Settings</h3>
        <p className="text-sm text-slate-600 mb-4">
          Update your availability for better patient scheduling
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          Edit Schedule
        </button>
      </div>
    </div>
  );
};

export default DoctorPortal;