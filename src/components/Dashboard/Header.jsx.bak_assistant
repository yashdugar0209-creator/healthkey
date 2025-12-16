import React, { useState } from 'react';
import { Bell, Search, User, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onMenuToggle }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, text: 'Appointment reminder with Dr. Sharma', time: '10 min ago' },
    { id: 2, text: 'New prescription added', time: '1 hour ago' },
    { id: 3, text: 'Your health card is ready', time: '2 hours ago' },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 mr-2"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <div className="text-xl font-bold text-blue-600">
              HealthKey<span className="text-slate-700">.in</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patients, records, or prescriptions..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-600" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-slate-100 relative">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Notification Dropdown */}
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border hidden">
                <div className="p-4 border-b">
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notification => (
                    <div key={notification.id} className="p-4 border-b hover:bg-slate-50">
                      <p className="text-sm text-slate-800">{notification.text}</p>
                      <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t">
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    View all notifications
                  </button>
                </div>
              </div>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100"
              >
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  {user?.name?.[0] || user?.email?.[0] || 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-800">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                </div>
                <User className="w-4 h-4 text-slate-600" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border">
                  <div className="p-4 border-b">
                    <p className="font-medium text-slate-800">{user?.name}</p>
                    <p className="text-sm text-slate-500">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                    >
                      My Profile
                    </a>
                    <a
                      href="/settings"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                    >
                      Settings
                    </a>
                    <a
                      href="/help"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                    >
                      Help & Support
                    </a>
                  </div>
                  <div className="p-2 border-t">
                    <button
                      onClick={() => {
                        // Handle logout
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;