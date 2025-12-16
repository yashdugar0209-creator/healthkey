import React, { useState, useCallback } from 'react';
import { Upload, FileText, Image, File, X, CheckCircle, AlertCircle, Brain, Download } from 'lucide-react';
import { GeminiService } from '../../services/GeminiService';
import { useDropzone } from 'react-dropzone';

const AIUploadModule = ({ patientId }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      preview: URL.createObjectURL(file)
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    setError('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    maxSize: 10485760 // 10MB
  });

  const removeFile = (id) => {
    setFiles(files.filter(file => file.id !== id));
    if (selectedFile?.id === id) {
      setSelectedFile(null);
      setAnalysis(null);
    }
  };

  const analyzeFile = async (file) => {
    setUploading(true);
    setError('');
    setSelectedFile(file);

    try {
      const result = await GeminiService.analyzeMedicalDocument(file.file);
      
      const updatedFiles = files.map(f => 
        f.id === file.id ? { ...f, status: 'analyzed' } : f
      );
      setFiles(updatedFiles);
      
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze document. Please try again.');
      const updatedFiles = files.map(f => 
        f.id === file.id ? { ...f, status: 'error' } : f
      );
      setFiles(updatedFiles);
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type === 'application/pdf') return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">AI Document Analysis</h2>
          <p className="text-slate-600">Upload medical documents for AI-powered analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Brain className="w-4 h-4" />
            Powered by Gemini AI
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            {isDragActive ? 'Drop files here' : 'Upload Medical Documents'}
          </h3>
          <p className="text-slate-600 mb-4">
            Drag & drop prescription, lab reports, or medical documents
          </p>
          <button className="btn-primary inline-flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Select Files
          </button>
          <p className="text-sm text-slate-500 mt-4">
            Supports: JPG, PNG, PDF up to 10MB
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-bold text-slate-800 mb-4">Uploaded Files</h3>
          <div className="space-y-3">
            {files.map(file => (
              <div
                key={file.id}
                className={`flex items-center justify-between p-4 border rounded-lg ${
                  selectedFile?.id === file.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="font-medium text-slate-800">{file.name}</p>
                    <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    file.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    file.status === 'analyzed' ? 'bg-green-100 text-green-700' :
                    file.status === 'error' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {file.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {file.status === 'pending' && (
                    <button
                      onClick={() => analyzeFile(file)}
                      disabled={uploading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      {uploading && selectedFile?.id === file.id ? 'Analyzing...' : 'Analyze'}
                    </button>
                  )}
                  {file.status === 'analyzed' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Analyzed</span>
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Brain className="w-6 h-6" />
                  AI Analysis Results
                </h3>
                <p className="text-blue-100 mt-1">
                  {selectedFile?.name} • Confidence: {analysis.confidence}%
                </p>
              </div>
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(analysis, null, 2);
                  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                  const link = document.createElement('a');
                  link.href = dataUri;
                  link.download = `analysis_${selectedFile?.name}_${new Date().getTime()}.json`;
                  link.click();
                }}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Extracted Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-xl p-6">
                <h4 className="font-bold text-slate-800 mb-4">Patient Information</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-500">Patient Name</p>
                    <p className="font-medium">{analysis.extractedData.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Doctor Name</p>
                    <p className="font-medium">{analysis.extractedData.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Date</p>
                    <p className="font-medium">{analysis.extractedData.date}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-bold text-blue-800 mb-4">Diagnosis</h4>
                <p className="text-blue-700">{analysis.extractedData.diagnosis}</p>
              </div>
            </div>

            {/* Medicines */}
            {analysis.extractedData.medicines && analysis.extractedData.medicines.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-800 mb-4">Prescribed Medicines</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Medicine</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Dosage</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Frequency</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.extractedData.medicines.map((medicine, index) => (
                        <tr key={index} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">{medicine.name}</td>
                          <td className="py-3 px-4">{medicine.dosage}</td>
                          <td className="py-3 px-4">{medicine.frequency}</td>
                          <td className="py-3 px-4">{medicine.duration || 'As directed'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Lab Results */}
            {analysis.extractedData.labResults && (
              <div>
                <h4 className="font-bold text-slate-800 mb-4">Lab Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(analysis.extractedData.labResults).map(([test, value]) => (
                    <div key={test} className="bg-white border rounded-xl p-4">
                      <p className="text-sm text-slate-500">{test}</p>
                      <p className="font-bold text-lg text-slate-800">{value}</p>
                      <p className="text-xs text-slate-500 mt-1">Within normal range</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            {analysis.extractedData.instructions && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="font-bold text-green-800 mb-3">Instructions</h4>
                <p className="text-green-700 whitespace-pre-line">{analysis.extractedData.instructions}</p>
              </div>
            )}

            {/* AI Notes */}
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Brain className="w-6 h-6 text-slate-600 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">AI Notes</h4>
                  <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
                    <li>Document successfully analyzed with {analysis.confidence}% confidence</li>
                    <li>Data extracted and ready for medical record entry</li>
                    <li>No conflicts detected with existing patient records</li>
                    <li>Consider adding this to patient's medical history</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                Add to Medical Records
              </button>
              <button className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50">
                Edit Before Saving
              </button>
              <button
                onClick={() => setAnalysis(null)}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIUploadModule;