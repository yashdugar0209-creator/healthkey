import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, Shield, Smartphone, Users, Stethoscope, Building2, 
  CheckCircle, ArrowRight, Play, Star, Award, Globe, 
  TrendingUp, Zap, Lock, Cloud
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "NFC Health Card",
      description: "Tap and access your complete medical history instantly",
      color: "blue"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "End-to-end encrypted with blockchain verification",
      color: "green"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Nationwide Access",
      description: "Works across all hospitals in India",
      color: "purple"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Emergency Ready",
      description: "Critical medical information in emergencies",
      color: "red"
    }
  ];

  const stats = [
    { value: "50K+", label: "Patients Served" },
    { value: "500+", label: "Hospitals Onboard" },
    { value: "5K+", label: "Doctors Registered" },
    { value: "99.9%", label: "System Uptime" }
  ];

  const testimonials = [
    {
      name: "Dr. Ravi Sharma",
      role: "Neurologist, Apollo Hospitals",
      content: "HealthKey has revolutionized how we access patient history. The NFC card system is seamless.",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Patient",
      content: "No more carrying files. My entire medical history is on one card. Life-changing!",
      rating: 5
    },
    {
      name: "Fortis Hospital",
      role: "Hospital Administration",
      content: "Patient registration time reduced by 70%. Highly efficient system.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Heart className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              India's First<br />
              <span className="text-blue-200">NFC Health Record</span> System
            </h1>
            
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
              Your complete medical history on a single tap. Secure, portable, and accessible 
              across all hospitals nationwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all"
                  >
                    Get Your Health Card
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How HealthKey Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              A simple, secure system that puts your health data in your hands
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl transition-all cursor-pointer ${
                  activeFeature === index
                    ? `bg-${feature.color}-50 border-2 border-${feature.color}-200 shadow-lg`
                    : 'bg-slate-50 border border-slate-200 hover:shadow-lg'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`w-16 h-16 ${activeFeature === index ? `bg-${feature.color}-100` : 'bg-slate-100'} rounded-2xl flex items-center justify-center mb-6 ${
                  activeFeature === index ? `text-${feature.color}-600` : 'text-slate-600'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Demo Video */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <h3 className="text-3xl font-bold text-slate-900 mb-6">
                  See HealthKey in Action
                </h3>
                <p className="text-lg text-slate-600 mb-8">
                  Watch how patients, doctors, and hospitals use HealthKey to transform healthcare delivery.
                </p>
                <ul className="space-y-4">
                  {[
                    "Instant patient registration with NFC tap",
                    "Real-time access to medical history",
                    "Emergency access for critical situations",
                    "Secure data sharing with consent"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Whom Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Who Uses HealthKey?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              A unified platform for all healthcare stakeholders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Patients */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">For Patients</h3>
              <ul className="space-y-3 mb-8">
                {[
                  "Digital health card with NFC",
                  "Complete medical history access",
                  "Emergency information availability",
                  "Hospital registration in seconds"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/register?role=patient"
                className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700"
              >
                Get your Health Card
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            {/* Doctors */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Stethoscope className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">For Doctors</h3>
              <ul className="space-y-3 mb-8">
                {[
                  "Instant patient history access",
                  "Digital prescriptions",
                  "Patient queue management",
                  "Telemedicine integration"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/register?role=doctor"
                className="inline-flex items-center text-green-600 font-bold hover:text-green-700"
              >
                Register as Doctor
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            {/* Hospitals */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">For Hospitals</h3>
              <ul className="space-y-3 mb-8">
                {[
                  "Streamlined patient registration",
                  "Digital record management",
                  "Inter-hospital data sharing",
                  "Analytics and reporting"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/register?role=hospital"
                className="inline-flex items-center text-purple-600 font-bold hover:text-purple-700"
              >
                Onboard Hospital
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See what our users say about HealthKey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-8 border">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Partners */}
          <div className="mt-20 pt-20 border-t">
            <h3 className="text-center text-2xl font-bold text-slate-900 mb-8">
              Partnered With Leading Hospitals
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {['Apollo', 'Fortis', 'Max', 'Medanta', 'AIIMS'].map((hospital, index) => (
                <div key={index} className="h-16 bg-slate-100 rounded-xl flex items-center justify-center">
                  <span className="text-lg font-bold text-slate-700">{hospital}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Healthcare?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of patients, doctors, and hospitals using HealthKey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
            >
              Request Demo
            </Link>
          </div>
          <p className="text-blue-200 mt-6 text-sm">
            No credit card required • Free for patients • 30-day trial for hospitals
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;