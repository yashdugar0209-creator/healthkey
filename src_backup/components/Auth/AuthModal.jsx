import React, { useState } from 'react';
import { X, Mail, Lock, Phone, User } from 'lucide-react';
import { ROLES } from '../../utils/constants';
import { validateRegistration } from '../../utils/validators';

const AuthModal = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState(ROLES.PATIENT);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    age: '',
    bloodGroup: '',
    allergies: '',
    emergencyContact: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      onLogin(formData.email || formData.mobile, formData.password, role);
    } else {
      const validationErrors = validateRegistration(formData, role);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setErrors({ confirmPassword: 'Passwords do not match' });
        return;
      }
      
      onRegister(role, formData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">
            {isLogin ? 'Login to HealthKey' : 'Join HealthKey'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Role Selection */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            <button
              type="button"
              onClick={() => setRole(ROLES.PATIENT)}
              className={`p-3 rounded-lg text-center ${
                role === ROLES.PATIENT
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => setRole(ROLES.DOCTOR)}
              className={`p-3 rounded-lg text-center ${
                role === ROLES.DOCTOR
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Doctor
            </button>
            <button
              type="button"
              onClick={() => setRole(ROLES.HOSPITAL)}
              className={`p-3 rounded-lg text-center ${
                role === ROLES.HOSPITAL
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Hospital
            </button>
            <button
              type="button"
              onClick={() => setRole(ROLES.ADMIN)}
              className={`p-3 rounded-lg text-center ${
                role === ROLES.ADMIN
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {role === ROLES.PATIENT ? 'Email or Mobile' : 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type={role === ROLES.PATIENT ? "text" : "email"}
                  name={role === ROLES.PATIENT ? (formData.email ? "email" : "mobile") : "email"}
                  value={role === ROLES.PATIENT ? (formData.email || formData.mobile) : formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg"
                  placeholder={
                    role === ROLES.PATIENT 
                      ? "Email or 10-digit mobile" 
                      : "Email address"
                  }
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {!isLogin && role === ROLES.PATIENT && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg"
                      placeholder="Age"
                    />
                    {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg"
                    >
                      <option value="">Select</option>
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                    {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg"
                  placeholder="Enter password"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg"
                    placeholder="Confirm password"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-slate-500">
            <p>By continuing, you agree to HealthKey's</p>
            <p>
              <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a> and 
              <a href="#" className="text-blue-600 hover:text-blue-700"> Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;