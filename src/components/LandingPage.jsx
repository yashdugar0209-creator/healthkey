import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-blue-600 mb-6">
        HealthKey System
      </h1>
      <p className="text-xl text-slate-600 mb-8 text-center max-w-2xl">
        India's First NFC-Based Unified Health Record System
      </p>
      <div className="flex gap-4">
        <Link to="/login" className="btn-primary">
          Get Started
        </Link>
        <Link to="/dashboard" className="btn-secondary">
          Dashboard
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;