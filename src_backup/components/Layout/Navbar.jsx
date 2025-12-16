import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, Bell, Search, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    switch (user.role) {
      case 'patient': return '/patient/dashboard';
      case 'doctor': return '/doctor/dashboard';
      case 'hospital': return '/hospital/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/dashboard';
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-blue-600">HealthKey</span>
                <span className="text-slate-700">.in</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link to="/about" className="text-slate-700 hover:text-blue-600 font-medium">
              About
            </Link>
            <Link to="/hospitals" className="text-slate-700 hover:text-blue-600 font-medium">
              Hospitals
            </Link>
            <Link to="/doctors" className="text-slate-700 hover:text-blue-600 font-medium">
              Doctors
            </Link>
            <Link to="/emergency" className="text-red-600 hover:text-red-700 font-medium">
              Emergency
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-slate-600 hover:text-blue-600">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 hover:text-blue-600"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : ☀️'}
            </button>

            {/* Auth Buttons / User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 hover:bg-slate-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    {user.name?.[0] || user.email?.[0] || 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{user.name || 'User'}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border py-2">
                    <div className="px-4 py-3 border-b">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Settings
                    </Link>
                    <div className="border-t mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="space-y-3">
              <Link
                to="/"
                className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/hospitals"
                className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Hospitals
              </Link>
              <Link
                to="/doctors"
                className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Doctors
              </Link>
              <Link
                to="/emergency"
                className="block px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Emergency
              </Link>
              
              {user && (
                <>
                  <div className="border-t pt-3">
                    <Link
                      to={getDashboardLink()}
                      className="block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                </>
              )}

              {!user && (
                <div className="border-t pt-3 space-y-2">
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 bg-blue-600 text-white rounded-lg text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;