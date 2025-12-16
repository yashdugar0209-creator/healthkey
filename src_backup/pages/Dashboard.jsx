import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DataService } from '../services/DataService';
import { 
  Activity, Calendar, FileText, Users, TrendingUp, 
  Bell, Shield, Clock, Heart, AlertCircle 
} from 'lucide-react';

// Components
import StatsCards from '../components/Dashboard/StatsCards';
import HealthAssistant from '../components/Common/HealthAssistant';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = () => {
    const data = DataService.get();
    let userStats = {};

    if (user?.role === 'patient') {
      const patient = data.patients?.find(p => p.id === user.patientId);
      if (patient) {
        userStats = {
          healthScore: 85,
          activePrescriptions: patient.prescriptions?.length || 0,
          upcomingAppointments: data.appointments?.filter(a => 
            a.patientId === patient.id && a.status === 'confirmed'
          ).length || 0,
          medicalRecords: patient.medicalHistory?.length || 0
        };
      }
    } else if (user?.role === 'doctor') {
      const doctor = data.doctors?.find(d => d.id === user.doctorId);
      if (doctor) {
        userStats = {
          patientsInQueue: doctor.patientQueue?.length || 0,
          completedToday: 12,
          avgTime: 15,
          revenueToday: doctor.consultationFee * 12
        };
      }
    } else if (user?.role === 'hospital') {
      const hospital = data.hospitals?.find(h => h.id === user.hospitalId);
      if (hospital) {
        userStats = {
          totalPatients: data.patients?.filter(p => p.currentHospital === hospital.id).length || 0,
          activeDoctors: hospital.doctors?.length || 0,
          revenue: 245000,
          avgWaitTime: 18
        };
      }
    }

    setStats(userStats);

    // Recent activity
    const activity = [
      { id: 1, action: 'New appointment booked', time: '10 minutes ago', icon: Calendar },
      { id: 2, action: 'Prescription added', time: '2 hours ago', icon: FileText },
      { id: 3, action: 'Health checkup completed', time: '1 day ago', icon: Activity },
      { id: 4, action: 'Doctor consultation', time: '2 days ago', icon: Users },
    ];
    setRecentActivity(activity);

    setLoading(false);
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, {user.name || 'User'}!
              </h1>
              <p className="text-slate-600">
                Here's what's happening with your health today
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-600 hover:text-blue-600">
                <Bell className="w-6 h-6" />
              </button>
              <div className="text-sm text-slate-500">
                {new Date().toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards stats={stats} role={user.role} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Health Overview */}
          <div className="lg:col-span-2 space-y-8">
            {/* Health Assistant */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">AI Health Assistant</h2>
              <HealthAssistant />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <div className="flex flex-col items-center">
                    <Calendar className="w-6 h-6 text-blue-600 mb-2" />
                    <span className="text-sm font-medium">Book Appointment</span>
                  </div>
                </button>
                <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                  <div className="flex flex-col items-center">
                    <FileText className="w-6 h-6 text-green-600 mb-2" />
                    <span className="text-sm font-medium">View Records</span>
                  </div>
                </button>
                <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                  <div className="flex flex-col items-center">
                    <Shield className="w-6 h-6 text-purple-600 mb-2" />
                    <span className="text-sm font-medium">Health Card</span>
                  </div>
                </button>
                <button className="p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                  <div className="flex flex-col items-center">
                    <AlertCircle className="w-6 h-6 text-red-600 mb-2" />
                    <span className="text-sm font-medium">Emergency</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{activity.action}</p>
                      <p className="text-sm text-slate-500">{activity.time}</p>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Health Status */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Health Status</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600">Overall Health Score</span>
                    <span className="font-bold text-blue-600">85/100</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-blue-500" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <Heart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">120/80</div>
                    <div className="text-sm text-slate-600">Blood Pressure</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">98</div>
                    <div className="text-sm text-slate-600">Heart Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Upcoming Appointments</h2>
              <div className="space-y-4">
                {[
                  { time: '10:30 AM', doctor: 'Dr. Sharma', type: 'Cardiology' },
                  { time: '2:00 PM', doctor: 'Dr. Verma', type: 'General Checkup' },
                  { time: '4:30 PM', doctor: 'Dr. Patel', type: 'Lab Results' }
                ].map((appointment, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-800">{appointment.time}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        Today
                      </span>
                    </div>
                    <p className="font-bold text-slate-900">{appointment.doctor}</p>
                    <p className="text-sm text-slate-600">{appointment.type}</p>
                    <button className="w-full mt-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                      Join Call
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Notifications</h2>
              <div className="space-y-3">
                {[
                  { text: 'Prescription ready for pickup', urgent: false },
                  { text: 'Lab results available', urgent: true },
                  { text: 'Appointment reminder', urgent: false },
                  { text: 'Health check due', urgent: false }
                ].map((notification, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${notification.urgent ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                    <span className="text-sm text-slate-700">{notification.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Access */}
        <div className="mt-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-12 h-12" />
              <div>
                <h3 className="text-xl font-bold">Emergency Medical Access</h3>
                <p className="text-red-100">Critical information available instantly</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-white text-red-600 rounded-xl font-bold hover:bg-red-50">
              Emergency Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;