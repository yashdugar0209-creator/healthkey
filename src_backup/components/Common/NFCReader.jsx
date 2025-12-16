import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, Battery, AlertCircle, CheckCircle, Clock, RefreshCw, X, Shield } from 'lucide-react';
import { NFCSimulator } from '../../services/NFCSimulator';
import { DataService } from '../../services/DataService';

const NFCReader = ({ hospital }) => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const [recentScans, setRecentScans] = useState([]);
  const [nfcStatus, setNfcStatus] = useState({
    connected: true,
    battery: 85,
    signal: 'strong'
  });

  useEffect(() => {
    // Load recent scans
    const logs = JSON.parse(localStorage.getItem('healthkey_nfc_logs') || '[]');
    setRecentScans(logs.slice(-5).reverse());
  }, []);

  const simulateScan = async () => {
    setScanning(true);
    setError('');
    setScanResult(null);

    try {
      const result = await NFCSimulator.simulateTap();
      
      if (result.success) {
        setScanResult(result);
        
        // Add to recent scans
        const newScan = {
          nfcId: result.card.id,
          timestamp: new Date().toISOString(),
          patient: result.patientData.name,
          action: 'scanned'
        };
        setRecentScans(prev => [newScan, ...prev.slice(0, 4)]);
      } else {
        setError(result.message || 'Failed to read NFC card');
      }
    } catch (err) {
      setError('Error reading NFC card. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const clearScan = () => {
    setScanResult(null);
    setError('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-700' :
           status === 'inactive' ? 'bg-amber-100 text-amber-700' :
           'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">NFC Reader</h2>
          <p className="text-slate-600">Scan HealthKey cards for instant patient registration</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              nfcStatus.connected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-slate-600">
              {nfcStatus.connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <button
            onClick={simulateScan}
            disabled={scanning}
            className="btn-primary flex items-center gap-2"
          >
            {scanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4" />
                Simulate NFC Tap
              </>
            )}
          </button>
        </div>
      </div>

      {/* NFC Reader Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reader Device */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold">HealthKey NFC Reader</h3>
                  <p className="text-slate-300 text-sm">Model: HK-NFC-2024</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    <span className="text-sm">{nfcStatus.signal}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Battery className="w-4 h-4" />
                    <span className="text-sm">{nfcStatus.battery}%</span>
                  </div>
                </div>
              </div>

              <div className={`relative border-2 ${
                scanning ? 'border-blue-500 animate-pulse' : 'border-slate-600'
              } rounded-2xl p-12 text-center transition-all`}>
                {scanning ? (
                  <div className="space-y-6">
                    <div className="w-20 h-20 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
                      <Smartphone className="w-10 h-10 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-blue-400 text-lg">Scanning...</p>
                      <p className="text-slate-300 mt-2">Hold card near device</p>
                      <div className="w-48 h-1 bg-slate-700 rounded-full mx-auto mt-4 overflow-hidden">
                        <div className="h-full bg-blue-500 animate-progress"></div>
                      </div>
                    </div>
                  </div>
                ) : scanResult ? (
                  <div className="space-y-6">
                    <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <div>
                      <p className="font-bold text-green-400 text-lg">Card Detected!</p>
                      <p className="text-slate-300 mt-2">Patient information retrieved</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="w-20 h-20 mx-auto bg-slate-700 rounded-full flex items-center justify-center">
                      <Smartphone className="w-10 h-10 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-300 text-lg">Ready to Scan</p>
                      <p className="text-slate-400 mt-2">Tap HealthKey card on device</p>
                    </div>
                  </div>
                )}

                {/* Scan Animation */}
                {scanning && (
                  <div className="absolute inset-0 border-4 border-blue-500/30 rounded-2xl animate-ping"></div>
                )}
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-400">
                  {hospital?.name || 'Hospital NFC Reader'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Serial: HK-NFC-{Math.random().toString(36).substr(2, 8).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Scans */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-bold text-slate-800 mb-4">Recent Scans</h3>
          <div className="space-y-3">
            {recentScans.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500">No recent scans</p>
              </div>
            ) : (
              recentScans.map((scan, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-slate-800">
                      {scan.patient || scan.nfcId}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatTime(scan.timestamp)}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                    Success
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-6 border-t">
            <h4 className="font-bold text-slate-800 mb-3">Reader Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Connection</span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Connected</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Battery</span>
                <span className="text-sm font-medium">{nfcStatus.battery}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Signal Strength</span>
                <span className="text-sm font-medium capitalize">{nfcStatus.signal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Scans Today</span>
                <span className="text-sm font-medium">{recentScans.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Results */}
      {scanResult && (
        <div className="bg-white rounded-2xl shadow-lg border overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Patient Detected
                </h3>
                <p className="text-green-100 mt-1">
                  NFC ID: {scanResult.card.id}
                </p>
              </div>
              <button
                onClick={clearScan}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-50 rounded-xl p-6">
                <h4 className="font-bold text-slate-800 mb-4">Patient Information</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-500">Name</p>
                    <p className="font-bold text-lg text-slate-800">
                      {scanResult.patientData.name}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Age</p>
                      <p className="font-medium">{scanResult.patientData.age} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Blood Group</p>
                      <p className="font-medium">{scanResult.patientData.bloodGroup}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Allergies</p>
                    <p className="font-medium">{scanResult.patientData.allergies || 'None'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-bold text-blue-800 mb-4">Card Information</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-blue-700">NFC ID</p>
                    <p className="font-mono font-bold text-lg text-blue-800">
                      {scanResult.card.id}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-blue-700">Status</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(scanResult.card.status)}`}>
                        {scanResult.card.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">Last Used</p>
                      <p className="font-medium">{scanResult.card.lastUsed}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Issued By</p>
                    <p className="font-medium">{scanResult.card.hospital}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                <div className="flex flex-col items-center">
                  <Shield className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">View Records</span>
                </div>
              </button>
              <button className="p-4 bg-green-600 text-white rounded-xl hover:bg-green-700">
                <div className="flex flex-col items-center">
                  <Smartphone className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Check-in Patient</span>
                </div>
              </button>
              <button className="p-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700">
                <div className="flex flex-col items-center">
                  <Clock className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Assign to Doctor</span>
                </div>
              </button>
              <button className="p-4 bg-amber-600 text-white rounded-xl hover:bg-amber-700">
                <div className="flex flex-col items-center">
                  <AlertCircle className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Emergency Access</span>
                </div>
              </button>
            </div>

            {/* Medical Summary */}
            {scanResult.patientData.medicalHistory && (
              <div className="mt-6 bg-slate-50 rounded-xl p-6">
                <h4 className="font-bold text-slate-800 mb-4">Medical History Summary</h4>
                <div className="space-y-2">
                  {scanResult.patientData.medicalHistory.slice(0, 3).map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div>
                        <p className="font-medium text-sm">{record.diagnosis}</p>
                        <p className="text-xs text-slate-500">
                          {record.hospital} • {record.date}
                        </p>
                      </div>
                      <span className="text-xs text-slate-600">{record.doctor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h4 className="font-bold text-red-800 mb-1">Scan Failed</h4>
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => setError('')}
                className="mt-2 text-sm text-red-600 hover:text-red-700"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFCReader;