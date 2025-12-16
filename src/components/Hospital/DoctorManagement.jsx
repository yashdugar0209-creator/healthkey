// components/Hospital/DoctorManagement.jsx
import React, { useState, useEffect } from 'react';
import { DataService } from '../../services/DataService';
import { UserPlus, Search, Filter, MoreVertical, Phone, Mail, Check, X, Clock, Users } from 'lucide-react';

const DoctorManagement = ({ hospital }) => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    email: '',
    mobile: '',
    specialization: '',
    qualifications: '',
    consultationFee: '',
    availability: {}
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    loadDoctors();
  }, [hospital]);

  const loadDoctors = () => {
    const data = DataService.get();
    const hospitalDoctors = data.doctors.filter(d => d.hospitalId === hospital.id);
    setDoctors(hospitalDoctors);
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    const result = DataService.addDoctorToHospital(hospital.id, {
      ...newDoctor,
      doctorId: `D${Date.now()}`
    });
    
    if (result) {
      alert('Doctor added successfully!');
      setShowAddDoctor(false);
      setNewDoctor({
        name: '',
        email: '',
        mobile: '',
        specialization: '',
        qualifications: '',
        consultationFee: '',
        availability: {}
      });
      loadDoctors();
    }
  };

  const removeDoctor = (doctorId) => {
    if (window.confirm('Are you sure you want to remove this doctor?')) {
      DataService.removeDoctorFromHospital(hospital.id, doctorId);
      loadDoctors();
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Doctor Management</h2>
            <p className="text-slate-600">Manage doctors at {hospital.name}</p>
          </div>
          <button
            onClick={() => setShowAddDoctor(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4" />
            Add Doctor
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search doctors by name, specialization, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <div key={doctor.id} className="bg-slate-50 rounded-xl border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-2">
                    {doctor.name[0]}
                  </div>
                  <h3 className="font-bold text-lg text-slate-800">Dr. {doctor.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">{doctor.specialization}</p>
                </div>
                <button
                  onClick={() => setSelectedDoctor(selectedDoctor?.id === doctor.id ? null : doctor)}
                  className="p-2 hover:bg-slate-200 rounded-lg"
                >
                  <MoreVertical className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4" />
                  {doctor.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4" />
                  {doctor.assignedPatients?.length || 0} patients assigned
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  {doctor.patientQueue?.length || 0} in queue
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.location.href = `/doctor/${doctor.id}`}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  View Profile
                </button>
                <button
                  onClick={() => removeDoctor(doctor.id)}
                  className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Stats */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-slate-500">Fee</p>
                    <p className="font-bold">₹{doctor.consultationFee}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Status</p>
                    <span className={`px-2 py-1 rounded text-xs ${
                      doctor.status === 'approved' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {doctor.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No Doctors Found</h3>
            <p className="text-slate-600">Add doctors to your hospital to get started</p>
          </div>
        )}
      </div>

      {/* Add Doctor Modal */}
      {showAddDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Add New Doctor</h3>
              <button onClick={() => setShowAddDoctor(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  placeholder="Dr. Full Name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-lg"
                    placeholder="doctor@hospital.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mobile</label>
                  <input
                    type="tel"
                    required
                    value={newDoctor.mobile}
                    onChange={(e) => setNewDoctor({...newDoctor, mobile: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-lg"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Specialization</label>
                <select
                  value={newDoctor.specialization}
                  onChange={(e) => setNewDoctor({...newDoctor, specialization: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                >
                  <option value="">Select Specialization</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Orthopedist">Orthopedist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Surgeon">Surgeon</option>
                  <option value="Gynecologist">Gynecologist</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Consultation Fee</label>
                <input
                  type="number"
                  value={newDoctor.consultationFee}
                  onChange={(e) => setNewDoctor({...newDoctor, consultationFee: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Qualifications</label>
                <textarea
                  value={newDoctor.qualifications}
                  onChange={(e) => setNewDoctor({...newDoctor, qualifications: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  rows="3"
                  placeholder="MD, DM Cardiology, AIIMS..."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  Add Doctor to Hospital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;