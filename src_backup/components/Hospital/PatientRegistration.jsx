import React, { useState } from 'react';
import { UserPlus, Smartphone, Upload, QrCode, Save, X } from 'lucide-react';
import { DataService } from '../../services/DataService';
import { NFCSimulator } from '../../services/NFCSimulator';
import { validatePatientForm } from '../../utils/validators';

const PatientRegistration = ({ hospital }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    age: '',
    gender: 'Male',
    bloodGroup: '',
    allergies: '',
    emergencyContact: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [isNFC, setIsNFC] = useState(true);
  const [nfcId, setNfcId] = useState('');
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const simulateNFCTap = () => {
    setScanning(true);
    setTimeout(() => {
      NFCSimulator.simulateTap().then(result => {
        if (result.success) {
          setNfcId(result.card.id);
          setFormData(prev => ({
            ...prev,
            name: result.patientData.name,
            mobile: result.patientData.mobile,
            age: result.patientData.age,
            bloodGroup: result.patientData.bloodGroup
          }));
        }
        setScanning(false);
      });
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validatePatientForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Register patient
    const patientData = {
      ...formData,
      hospitalId: hospital.id,
      registrationDate: new Date().toISOString()
    };

    // In a real app, this would call an API
    console.log('Registering patient:', patientData);
    
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setFormData({
        name: '',
        mobile: '',
        email: '',
        age: '',
        gender: 'Male',
        bloodGroup: '',
        allergies: '',
        emergencyContact: '',
        address: ''
      });
      setNfcId('');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Patient Registration</h2>
          <p className="text-slate-600">Register new patients at {hospital?.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsNFC(!isNFC)}
            className={`px-4 py-2 rounded-lg ${
              isNFC ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            NFC Registration
          </button>
          <button className={`px-4 py-2 rounded-lg ${
            !isNFC ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            Manual Entry
          </button>
        </div>
      </div>

      {isNFC ? (
        /* NFC Registration */
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">NFC Card Registration</h3>
            <p className="text-slate-600">Tap patient's HealthKey card to auto-fill details</p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className={`border-2 ${scanning ? 'border-blue-500' : 'border-dashed border-slate-300'} rounded-2xl p-12 text-center transition-all`}>
                {scanning ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                      <Smartphone className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="font-medium text-blue-600">Scanning NFC Card...</p>
                    <p className="text-sm text-slate-500">Hold card near device</p>
                  </div>
                ) : nfcId ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-green-600">Card Detected!</p>
                      <p className="text-sm font-mono text-slate-600">{nfcId}</p>
                    </div>
                    <p className="text-sm text-slate-500">Patient details auto-filled below</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
                      <Smartphone className="w-8 h-8 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Tap HealthKey Card</p>
                      <p className="text-sm text-slate-500">Place patient's NFC card near device</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!nfcId && !scanning && (
              <div className="mt-6 text-center">
                <button
                  onClick={simulateNFCTap}
                  className="btn-primary flex items-center gap-2 mx-auto"
                >
                  <Smartphone className="w-4 h-4" />
                  Simulate NFC Tap
                </button>
                <p className="text-sm text-slate-500 mt-2">
                  Click to simulate NFC card detection for demo
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Manual Registration Form */
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  placeholder="Enter patient's full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  placeholder="9876543210"
                />
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  placeholder="patient@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Age *</label>
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Blood Group *
                </label>
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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Allergies (comma separated)
              </label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                className="w-full p-3 border border-slate-300 rounded-lg"
                placeholder="Penicillin, Dust, Pollen"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Emergency Contact *
                </label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  placeholder="Emergency contact number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                  placeholder="Patient's address"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Register Patient
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    name: '',
                    mobile: '',
                    email: '',
                    age: '',
                    gender: 'Male',
                    bloodGroup: '',
                    allergies: '',
                    emergencyContact: '',
                    address: ''
                  });
                  setErrors({});
                }}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Clear
              </button>
            </div>
          </form>
        </div>
      )}

      {success && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center animate-in slide-in-from-bottom-4">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Patient Registered Successfully!</h3>
            <p className="text-slate-600 mb-6">
              {formData.name} has been registered at {hospital?.name}
            </p>
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-500">HealthKey NFC ID</p>
              <p className="font-mono font-bold text-lg text-blue-600">
                {nfcId || 'HK' + Date.now().toString(36).toUpperCase()}
              </p>
            </div>
            <button
              onClick={() => setSuccess(false)}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRegistration;