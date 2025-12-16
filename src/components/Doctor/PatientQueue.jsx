import React, { useState, useEffect } from 'react';
import { Users, Clock, AlertCircle, Bell, CheckCircle, XCircle, MoreVertical, Stethoscope } from 'lucide-react';
import { DataService } from '../../services/DataService';
import { calculateWaitTime } from '../../utils/helpers';

const PatientQueue = ({ doctor, onStartConsultation }) => {
  const [queue, setQueue] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadQueue();
  }, [doctor]);

  const loadQueue = () => {
    if (doctor?.id) {
      const queueData = DataService.getDoctorQueue(doctor.id);
      setQueue(queueData);
    }
  };

  const updatePatientStatus = (patientId, status) => {
    // Update patient status in queue
    console.log(`Patient ${patientId} status updated to ${status}`);
    loadQueue();
  };

  const getFilteredQueue = () => {
    switch (filter) {
      case 'waiting':
        return queue.filter(q => q.consultation?.status === 'waiting');
      case 'in-progress':
        return queue.filter(q => q.consultation?.status === 'in-progress');
      case 'completed':
        return queue.filter(q => q.consultation?.status === 'completed');
      default:
        return queue;
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Patient Queue</h2>
          <p className="text-slate-600">Manage your consultation queue</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {['all', 'waiting', 'in-progress', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Call Next
          </button>
        </div>
      </div>

      {/* Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total in Queue</p>
              <p className="text-2xl font-bold text-slate-800">{queue.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Avg. Wait Time</p>
              <p className="text-2xl font-bold text-slate-800">{formatTime(18)}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Next Patient</p>
              <p className="text-lg font-bold text-slate-800">
                {queue[0]?.patient?.name?.split(' ')[0] || 'None'}
              </p>
            </div>
            <Stethoscope className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Consultations Today</p>
              <p className="text-2xl font-bold text-slate-800">12</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left py-4 px-6 font-medium text-slate-700">Token</th>
                <th className="text-left py-4 px-6 font-medium text-slate-700">Patient</th>
                <th className="text-left py-4 px-6 font-medium text-slate-700">Status</th>
                <th className="text-left py-4 px-6 font-medium text-slate-700">Wait Time</th>
                <th className="text-left py-4 px-6 font-medium text-slate-700">Priority</th>
                <th className="text-left py-4 px-6 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredQueue().length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">No patients in queue</h3>
                    <p className="text-slate-600">Patients will appear here when they check in</p>
                  </td>
                </tr>
              ) : (
                getFilteredQueue().map((item, index) => (
                  <tr key={index} className="border-b hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <div className="font-mono font-bold text-lg text-blue-600">
                        #{item.consultation?.tokenNumber || index + 1}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                          {item.patient?.name?.[0] || 'P'}
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">
                            {item.patient?.name || 'Unknown Patient'}
                          </div>
                          <div className="text-sm text-slate-500">
                            {item.patient?.age} yrs • {item.patient?.bloodGroup}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.consultation?.status === 'waiting' ? 'bg-amber-100 text-amber-700' :
                        item.consultation?.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {item.consultation?.status || 'waiting'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {formatTime(item.waitTime || 0)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.consultation?.priority === 'emergency' ? 'bg-red-100 text-red-700' :
                        item.consultation?.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {item.consultation?.priority || 'normal'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        {item.consultation?.status === 'waiting' && (
                          <button
                            onClick={() => onStartConsultation(item)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                          >
                            Start
                          </button>
                        )}
                        {item.consultation?.status === 'in-progress' && (
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedPatient(selectedPatient === item ? null : item)}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-50 rounded-xl p-6">
        <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-white border rounded-xl hover:shadow-md flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div className="text-left">
              <div className="font-medium text-slate-800">Emergency Priority</div>
              <div className="text-sm text-slate-500">Move patient to front</div>
            </div>
          </button>
          <button className="p-4 bg-white border rounded-xl hover:shadow-md flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <div className="font-medium text-slate-800">Mark Complete</div>
              <div className="text-sm text-slate-500">End current consultation</div>
            </div>
          </button>
          <button className="p-4 bg-white border rounded-xl hover:shadow-md flex items-center gap-3">
            <XCircle className="w-5 h-5 text-slate-600" />
            <div className="text-left">
              <div className="font-medium text-slate-800">Cancel</div>
              <div className="text-sm text-slate-500">Remove from queue</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientQueue;