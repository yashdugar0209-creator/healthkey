import React, { useState, useEffect } from 'react';
import { DataService } from '../../services/DataService';
import { FileText, Download, Eye, Calendar, User, Filter, Search, Plus } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const MedicalRecords = ({ patientId }) => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, [patientId]);

  const loadRecords = () => {
    const data = DataService.get();
    const patient = data.patients.find(p => p.id === patientId);
    if (patient && patient.medicalHistory) {
      setRecords(patient.medicalHistory);
      setFilteredRecords(patient.medicalHistory);
    }
    setLoading(false);
  };

  useEffect(() => {
    let result = records;

    if (searchTerm) {
      result = result.filter(record =>
        record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.hospital.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      result = result.filter(record => record.type === filterType);
    }

    setFilteredRecords(result);
  }, [searchTerm, filterType, records]);

  const recordTypes = ['all', 'Consultation', 'Prescription', 'Lab Report', 'Emergency', 'Surgery'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading records...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Medical Records</h2>
          <p className="text-slate-600">Your complete medical history</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Upload Document
        </button>
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
                placeholder="Search records by diagnosis, doctor, or hospital..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {recordTypes.map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  filterType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left py-4 px-6 font-medium text-slate-700">Date</th>
                <th className="text-left py-4 px-6 font-medium text-slate-700">Type</th>
                <th className="text-left py-4 px-6 font-medium text-slate-700">Diagnosis</th>
                <th className="text-left py-4 px-6 font-medium text-slate-700">Doctor</th>
                <th className="text-left py-4 px-6 font-medium text-slate-700">Hospital</th>
                <th className="text-left py-4 px-6 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">No records found</h3>
                    <p className="text-slate-600">Start by uploading your first medical document</p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record, index) => (
                  <tr key={index} className="border-b hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {formatDate(record.date)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record.type === 'Consultation' ? 'bg-blue-100 text-blue-700' :
                        record.type === 'Prescription' ? 'bg-green-100 text-green-700' :
                        record.type === 'Lab Report' ? 'bg-purple-100 text-purple-700' :
                        record.type === 'Emergency' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {record.type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-800">{record.diagnosis}</div>
                      {record.prescription && (
                        <div className="text-sm text-slate-500 mt-1">{record.prescription}</div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        {record.doctor}
                      </div>
                    </td>
                    <td className="py-4 px-6">{record.hospital}</td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                          <Download className="w-4 h-4" />
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

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-800 mb-2">Total Records</h3>
          <div className="text-3xl font-bold text-blue-600">{records.length}</div>
          <p className="text-sm text-blue-700 mt-2">Lifetime medical history</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-bold text-green-800 mb-2">Last Consultation</h3>
          <div className="text-2xl font-bold text-green-600">
            {records.length > 0 ? formatDate(records[0].date) : 'No visits'}
          </div>
          <p className="text-sm text-green-700 mt-2">
            {records.length > 0 ? `with ${records[0].doctor}` : 'Schedule your first visit'}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <h3 className="font-bold text-purple-800 mb-2">Most Visited</h3>
          <div className="text-2xl font-bold text-purple-600">
            {records.length > 0 ? 'Apollo Hospitals' : 'No data'}
          </div>
          <p className="text-sm text-purple-700 mt-2">
            {records.length > 0 ? `${records.filter(r => r.hospital === 'Apollo Hospitals').length} visits` : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;