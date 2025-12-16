import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Smartphone, User, Shield, Heart, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateLogin } from '../utils/validators';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    role: 'patient'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const validationErrors = validateLogin(
      formData.identifier, 
      formData.password, 
      formData.role
    );
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setAuthError('');

    try {
      const result = await login(
        formData.identifier,
        formData.password,
        formData.role
      );

      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setAuthError(result.message || 'Login failed');
      }
    } catch (error) {
      setAuthError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (authError) {
      setAuthError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Welcome Back</h1>
                <p className="text-blue-100">Sign in to your HealthKey account</p>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="p-6 border-b">
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'patient', label: 'Patient', icon: User },
                { id: 'doctor', label: 'Doctor', icon: User },
                { id: 'hospital', label: 'Hospital', icon: Shield },
                { id: 'admin', label: 'Admin', icon: Shield }
              ].map(role => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: role.id }))}
                  className={`p-3 rounded-lg text-center transition-all ${
                    formData.role === role.id
                      ? role.id === 'patient' ? 'bg-blue-600 text-white' :
                        role.id === 'doctor' ? 'bg-green-600 text-white' :
                        role.id === 'hospital' ? 'bg-purple-600 text-white' :
                        'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <role.icon className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {formData.role === 'patient' ? 'Email or Mobile Number' : 'Email Address'}
              </label>
              <div className="relative">
                {formData.role === 'patient' && formData.identifier.match(/^\d+$/) ? (
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                ) : (
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                )}
                <input
                  type={formData.role === 'patient' && formData.identifier.match(/^\d+$/) ? "tel" : "text"}
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={
                    formData.role === 'patient' 
                      ? "Email or 10-digit mobile" 
                      : "Enter your email"
                  }
                />
              </div>
              {errors.identifier && <p className="text-red-500 text-sm mt-1">{errors.identifier}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-slate-700">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </Link>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="px-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Alternative Login Methods */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 border border-slate-300 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium">Google</span>
              </button>
              <button className="p-3 border border-slate-300 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50">
                <svg className="w-5 h-5" fill="#000000" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-sm font-medium">Aadhaar</span>
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="p-6 border-t bg-slate-50">
            <div className="text-center">
              <p className="text-slate-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-blue-600 font-bold hover:text-blue-700"
                >
                  Create one now
                </Link>
              </p>
              <p className="text-sm text-slate-500 mt-2">
                By signing in, you agree to our{' '}
                <Link to="/terms" className="text-blue-600">Terms</Link> and{' '}
                <Link to="/privacy" className="text-blue-600">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Access Notice */}
        <div className="mt-6 text-center">
          <Link
            to="/emergency"
            className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
          >
            <Shield className="w-4 h-4 mr-2" />
            Need emergency medical access? Click here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;