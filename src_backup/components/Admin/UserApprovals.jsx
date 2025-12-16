import React, { useState, useEffect } from 'react';
import { DataService } from '../../services/DataService';
import { CheckCircle, XCircle, User, Building2, Stethoscope, Clock, Search, Filter } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const UserApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingUsers();
  }, []);

  useEffect(() => {
    let results = pendingUsers;

    if (searchTerm) {
      results = results.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile?.includes(searchTerm)
      );
    }

    if (filterRole !== 'all') {
      results = results.filter(user => user.role === filterRole);
    }

    setFilteredUsers(results);
  }, [searchTerm, filterRole, pendingUsers]);

  const loadPendingUsers = () => {
    const data = DataService.get();
    
    const pending = [];
    
    // Pending doctors
    data.doctors?.filter(d => d.status === 'pending').forEach(doctor => {
      const user = data.users.find(u => u.doctorId === doctor.id);
      if (user) {
        pending.push({
          ...doctor,
          ...user,
          type: 'doctor',
          registrationDate: doctor.createdAt
        });
      }
    });

    // Pending hospitals
    data.hospitals?.filter(h => h.status === 'pending').forEach(hospital => {
      const user = data.users.find(u => u.hospitalId === hospital.id);
      if (user) {
        pending.push({
          ...hospital,
          ...user,
          type: 'hospital',
          registrationDate: hospital.createdAt
        });
      }
    });

    setPendingUsers(pending);
    setFilteredUsers(pending);
    setLoading(false);
  };

  const handleApproval = (userId, type, approved) => {
    const data = DataService.get();
    
    if (type === 'doctor') {
      const doctor = data.doctors.find(d => d.id === userId);
      if (doctor) {
        doctor.status = approved ? 'approved' : 'rejected';
        doctor.reviewedAt = new Date().toISOString();
      }
    } else if (type === 'hospital') {
      const hospital = data.hospitals.find(h => h.id === userId);
      if (hospital) {
        hospital.status = approved ? 'approved' : 'rejected';
        hospital.reviewedAt = new Date().toISOString();
      }
    }

    // Update user status
    const user = data.users.find(u => 
      (type === 'doctor' && u.doctorId === userId) ||
      (type === 'hospital' && u.hospitalId === userId)
    );
    if (user) {
      user.status = approved ? 'active' : 'rejected';
    }

    DataService.save(data);
    loadPendingUsers();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'doctor': return <Stethoscope className="w-5 h-5" />;
      case 'hospital': return <Building2 className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading approvals...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Approvals</h2>
          <p className="text-slate-600">Review and approve pending registrations</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Pending Approvals</p>
          <p className="text-2xl font-bold text-amber-600">{pendingUsers.length}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or mobile..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {['all', 'doctor', 'hospital'].map(role => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  filterRole === role
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {role === 'all' ? 'All Types' : role + 's'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Approvals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length === 0 ? (
          <div className="col-span-3 py-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No pending approvals</h3>
            <p className="text-slate-600">All registrations have been reviewed</p>
          </div>
        ) : (
          filteredUsers.map(user => (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${
                    user.type === 'doctor' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {getIcon(user.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{user.name}</h3>
                    <p className="text-sm text-slate-500 capitalize">{user.type}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <User className="w-4 h-4" />
                  {user.email}
                </div>
                {user.mobile && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    {user.mobile}
                  </div>
                )}
                {user.specialization && (
                  <div className="text-sm text-slate-700">
                    <span className="font-medium">Specialization:</span> {user.specialization}
                  </div>
                )}
                {user.address && (
                  <div className="text-sm text-slate-700">
                    <span className="font-medium">Address:</span> {user.address}
                  </div>
                )}
                {user.qualifications && (
                  <div className="text-sm text-slate-700">
                    <span className="font-medium">Qualifications:</span> {user.qualifications}
                  </div>
                )}
                <div className="text-xs text-slate-500">
                  Registered: {formatDate(user.registrationDate)}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleApproval(user.id, user.type, true)}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleApproval(user.id, user.type, false)}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Approval Statistics */}
      <div className="bg-slate-50 rounded-xl p-6">
        <h3 className="font-bold text-slate-800 mb-4">Approval Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending Doctors</p>
                <p className="text-2xl font-bold text-amber-600">
                  {pendingUsers.filter(u => u.type === 'doctor').length}
                </p>
              </div>
              <Stethoscope className="w-8 h-8 text-amber-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending Hospitals</p>
                <p className="text-2xl font-bold text-purple-600">
                  {pendingUsers.filter(u => u.type === 'hospital').length}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Avg. Response Time</p>
                <p className="text-2xl font-bold text-blue-600">4.2 hours</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserApprovals;