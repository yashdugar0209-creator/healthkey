import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, Users, Building2, Activity, Settings, 
  FileText, BarChart, AlertCircle, CheckCircle 
} from 'lucide-react';

// Components
import AdminDashboard from '../components/Admin/AdminDashboard';
import UserApprovals from '../components/Admin/UserApprovals';

const AdminPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-600">Administrator access required</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'hospitals', label: 'Hospitals', icon: Building2 },
    { id: 'approvals', label: 'Approvals', icon: CheckCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'alerts', label: 'System Alerts', icon: AlertCircle },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Portal</h1>
                <p className="text-slate-300">System Administration & Monitoring</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">System Administrator</p>
              <p className="text-sm text-slate-300">Last login: Today, 10:30 AM</p>
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
            
            {/* System Status */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                System Status
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Database</span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Online</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">API Server</span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">100%</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">NFC Service</span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Active</span>
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'overview' && <AdminDashboard />}
            {activeTab === 'approvals' && <UserApprovals />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'hospitals' && <HospitalManagement />}
            {activeTab === 'analytics' && <AnalyticsTab />}
            {activeTab === 'reports' && <ReportsTab />}
            {activeTab === 'alerts' && <AlertsTab />}
            {activeTab === 'settings' && <SystemSettings />}
          </main>
        </div>
      </div>
    </div>
  );
};

// Additional Admin Components
const UserManagement = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">User Management</h2>
      {/* User management content */}
    </div>
  </div>
);

const HospitalManagement = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Hospital Management</h2>
      {/* Hospital management content */}
    </div>
  </div>
);

const AnalyticsTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">System Analytics</h2>
      {/* Analytics content */}
    </div>
  </div>
);

const ReportsTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">System Reports</h2>
      {/* Reports content */}
    </div>
  </div>
);

const AlertsTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">System Alerts</h2>
      {/* Alerts content */}
    </div>
  </div>
);

const SystemSettings = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">System Settings</h2>
      {/* Settings content */}
    </div>
  </div>
);

export default AdminPortal;