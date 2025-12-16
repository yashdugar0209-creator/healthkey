import React, { useState } from 'react';
import { Mail, Lock, Smartphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(identifier, password, role);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
        <p className="text-slate-600 mt-2">Sign in to access your HealthKey account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            I am a
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['patient', 'doctor', 'hospital', 'admin'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`p-3 rounded-lg text-center capitalize ${
                  role === r
                    ? r === 'patient' ? 'bg-blue-600 text-white' :
                      r === 'doctor' ? 'bg-green-600 text-white' :
                      r === 'hospital' ? 'bg-purple-600 text-white' :
                      'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {role === 'patient' ? 'Email or Mobile Number' : 'Email Address'}
          </label>
          <div className="relative">
            {role === 'patient' && identifier.match(/^\d+$/) ? (
              <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            ) : (
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            )}
            <input
              type={role === 'patient' && identifier.match(/^\d+$/) ? "tel" : "text"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                role === 'patient' 
                  ? "Email or 10-digit mobile" 
                  : "Enter your email"
              }
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-slate-300" />
            <span className="ml-2 text-sm text-slate-700">Remember me</span>
          </label>
          <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 font-medium hover:text-blue-700">
            Create one now
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;