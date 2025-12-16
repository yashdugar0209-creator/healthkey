import React from 'react';
import { 
  Home, User, Stethoscope, Building2, Shield, 
  FileText, Calendar, Settings, LogOut, Bell,
  Activity, Users, Clipboard, FileText as FileTextIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const getNavItems = () => {
    if (!user) return [];

    const baseItems = [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
    ];

    if (user.role === 'patient') {
      return [
        ...baseItems,
        { id: 'records', label: 'Medical Records', icon: FileText },
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'doctors', label: 'My Doctors', icon: Stethoscope },
        { id: 'healthcard', label: 'Health Card', icon: Shield },
        { id: 'emergency', label: 'Emergency Access', icon: Activity },
      ];
    }

    if (user.role === 'doctor') {
      return [
        ...baseItems,
        { id: 'queue', label: 'Patient Queue', icon: Users },
        { id: 'patients', label: 'My Patients', icon: User },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
        { id: 'prescriptions', label: 'Prescriptions', icon: Clipboard },
        { id: 'reports', label: 'Reports', icon: FileTextIcon },
      ];
    }

    if (user.role === 'hospital') {
      return [
        ...baseItems,
        { id: 'doctors', label: 'Doctors', icon: Stethoscope },
        { id: 'patients', label: 'Patients', icon: Users },
        { id: 'queue', label: 'Queue Management', icon: Clipboard },
        { id: 'registration', label: 'Registration', icon: User },
        { id: 'reports', label: 'Reports', icon: FileTextIcon },
        { id: 'settings', label: 'Hospital Settings', icon: Settings },
      ];
    }

    if (user.role === 'admin') {
      return [
        ...baseItems,
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'hospitals', label: 'Hospitals', icon: Building2 },
        { id: 'approvals', label: 'Approvals', icon: Shield },
        { id: 'analytics', label: 'Analytics', icon: Activity },
        { id: 'reports', label: 'System Reports', icon: FileTextIcon },
        { id: 'settings', label: 'System Settings', icon: Settings },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white rounded-xl shadow-sm border p-4 h-fit sticky top-6">
      {/* User Profile */}
      <div className="flex items-center gap-3 p-3 mb-6 bg-slate-50 rounded-lg">
        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
          {user?.name?.[0] || user?.email?.[0] || 'U'}
        </div>
        <div>
          <p className="font-bold text-slate-800">
            {user?.name || user?.email}
          </p>
          <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === item.id
                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              {item.label}
            </div>
            {item.badge && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 mt-6 border-t pt-6"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </aside>
  );
};

export default Sidebar;