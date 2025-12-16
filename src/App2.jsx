import React, { useState, useEffect, useRef } from 'react';
import { 
  Key, 
  LayoutDashboard, 
  Building2, 
  Stethoscope, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut,
  X,
  Eye,
  EyeOff,
  Lock,
  User,
  Phone,
  Mail,
  ArrowRight,
  ShieldAlert,
  Menu,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  CheckCircle2,
  Activity,
  Database,
  Shield,
  Smartphone,
  FileText,
  Download,
  MessageCircle,
  Moon,
  Upload,
  File,
  Loader2,
  Calendar,
  Save,
  Trash2,
  Plus,
  Sparkles,
  Send,
  Bot,
  Search,
  Scan,
  UserPlus,
  FilePlus,
  Ban,
  Check,
  Link as LinkIcon
} from 'lucide-react';

// --- GEMINI AI SERVICE ---
const GeminiService = {
  apiKey: "", // API Key is injected by the environment

  async analyzeMedicalImage(base64Image) {
    if (!base64Image) return null;
    
    const prompt = `Analyze this image of a medical document. Extract the following details and return ONLY a valid JSON object with no markdown formatting. 
    Fields required:
    - hospital: Name of the hospital or clinic
    - doctor: Name of the doctor
    - date: Date of visit (YYYY-MM-DD format if possible)
    - diagnosis: Diagnosis or key findings
    - prescription: List of medicines or prescriptions as a single string
    - confidence: A number between 0-100 indicating how legible the document was.
    
    If a field is not found, leave it as an empty string.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/jpeg", data: base64Image } }
            ]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) throw new Error('Gemini API Error');
      
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      return JSON.parse(text);
    } catch (error) {
      console.error("AI Analysis Failed:", error);
      return {
        hospital: "AI Detection Failed",
        doctor: "Unknown",
        date: new Date().toISOString().split('T')[0],
        diagnosis: "Could not analyze image. Please enter details manually.",
        prescription: "",
        confidence: 0
      };
    }
  },

  async chatWithAssistant(message) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
          systemInstruction: {
            parts: [{ text: "You are HealthKey Assistant. Answer health-related queries briefly and professionally. Disclaimer: I am an AI, not a doctor." }]
          }
        })
      });

      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || "Connection error.";
    } catch (error) {
      return "Service unavailable.";
    }
  }
};

// --- DATA MANAGEMENT SYSTEM ---

const DEFAULT_SYSTEM_DATA = {
  users: [
    {id: "U001", email: "patient@example.com", password: "123", role: "patient", patientId: "P001", status: "active"},
    {id: "U002", email: "doctor@example.com", password: "123", role: "doctor", doctorId: "D001", status: "active"},
    {id: "U003", email: "hospital@example.com", password: "123", role: "hospital", hospitalId: "H001", status: "active"},
    {id: "U004", email: "admin@healthkey.in", password: "Admin123", role: "admin", status: "active"}
  ],
  patients: [
    {
      id: "P001",
      name: "Rajesh Kumar",
      mobile: "9876543210",
      email: "patient@example.com",
      gender: "Male",
      age: 34,
      aadhaar: "XXXX-XXXX-1234",
      bloodGroup: "O+",
      allergies: "Penicillin, Dust",
      emergencyContact: "+91 9876543219",
      nfcId: "NFC001",
      medicalHistory: [
        {id: "V001", date: "2023-11-15", hospital: "Apollo Delhi", doctor: "Dr. Sharma", diagnosis: "Hypertension", prescription: "Amlodipine 5mg", type: "Visit"}
      ],
      uploadedDocuments: []
    }
  ],
  doctors: [
    {
      id: "D001",
      name: "Dr. Arjun Gupta",
      email: "doctor@example.com",
      specialization: "Cardiologist",
      hospitalId: "H001",
      status: "approved",
      qualifications: "MD, DM Cardiology",
      assignedPatients: ["P001"]
    }
  ],
  hospitals: [
    {
      id: "H001",
      name: "Apollo Hospital, Delhi",
      email: "hospital@example.com",
      registrationNo: "AP123456",
      status: "approved",
      address: "Sarita Vihar, Delhi",
      doctors: ["D001"],
      patients: ["P001"]
    }
  ],
  nfcCards: [
    { id: "NFC001", patientId: "P001", status: "active" }
  ],
  accessLogs: [
    { id: "L001", timestamp: "2023-11-15 10:30", accessor: "Dr. Arjun Gupta", action: "Viewed Records" }
  ]
};

const DataService = {
  init: () => {
    if (!localStorage.getItem('healthkey_system')) {
      localStorage.setItem('healthkey_system', JSON.stringify(DEFAULT_SYSTEM_DATA));
    }
  },
  
  get: () => {
    return JSON.parse(localStorage.getItem('healthkey_system') || '{}');
  },

  save: (data) => {
    localStorage.setItem('healthkey_system', JSON.stringify(data));
  },

  login: (identifier, password, role) => {
    const data = DataService.get();
    const user = data.users.find(u => 
      (u.email === identifier || (u.role === 'patient' && u.mobile === identifier)) && 
      u.password === password && 
      u.role === role
    );
    
    if (user && user.status === 'pending') {
      throw new Error("Your account is pending admin approval.");
    }
    if (user && user.status === 'rejected') {
      throw new Error("Your account has been rejected. Contact admin.");
    }
    return user;
  },

  register: (role, formData) => {
    const data = DataService.get();
    const newUserId = `U${Date.now()}`;
    const status = role === 'patient' ? 'active' : 'pending'; // Docs/Hospitals need approval
    
    const newUser = {
      id: newUserId,
      email: formData.email,
      password: formData.password,
      role: role,
      status: status
    };

    if (role === 'patient') {
      const pId = `P${Date.now()}`;
      newUser.patientId = pId;
      newUser.mobile = formData.mobile;
      data.patients.push({
        id: pId,
        ...formData, // Saves allergies, blood group etc.
        medicalHistory: [],
        uploadedDocuments: []
      });
    } else if (role === 'doctor') {
      const dId = `D${Date.now()}`;
      newUser.doctorId = dId;
      data.doctors.push({
        id: dId,
        ...formData,
        assignedPatients: [],
        status: 'pending'
      });
    } else if (role === 'hospital') {
      const hId = `H${Date.now()}`;
      newUser.hospitalId = hId;
      data.hospitals.push({
        id: hId,
        ...formData,
        doctors: [],
        patients: [],
        status: 'pending'
      });
    }

    data.users.push(newUser);
    DataService.save(data);
    return newUser;
  },

  updateProfile: (role, id, updateData) => {
    const data = DataService.get();
    if (role === 'patient') {
      const idx = data.patients.findIndex(p => p.id === id);
      if (idx !== -1) {
        data.patients[idx] = { ...data.patients[idx], ...updateData };
        DataService.save(data);
        return true;
      }
    }
    return false;
  },

  addMedicalRecord: (patientId, record) => {
    const data = DataService.get();
    const patientIndex = data.patients.findIndex(p => p.id === patientId);
    if (patientIndex > -1) {
      data.patients[patientIndex].medicalHistory.unshift({
        id: `REC${Date.now()}`,
        ...record,
        type: 'AI Upload'
      });
      DataService.save(data);
      return true;
    }
    return false;
  },

  adminAction: (userId, action) => {
    const data = DataService.get();
    const userIdx = data.users.findIndex(u => u.id === userId);
    if (userIdx !== -1) {
      const status = action === 'approve' ? 'active' : 'rejected';
      data.users[userIdx].status = status;
      
      // Also update specific role status
      const user = data.users[userIdx];
      if (user.role === 'doctor') {
        const dIdx = data.doctors.findIndex(d => d.id === user.doctorId);
        if (dIdx !== -1) data.doctors[dIdx].status = action === 'approve' ? 'approved' : 'rejected';
      } else if (user.role === 'hospital') {
        const hIdx = data.hospitals.findIndex(h => h.id === user.hospitalId);
        if (hIdx !== -1) data.hospitals[hIdx].status = action === 'approve' ? 'approved' : 'rejected';
      }
      
      DataService.save(data);
      return true;
    }
    return false;
  },

  linkNFC: (patientId, nfcId) => {
    const data = DataService.get();
    const pIdx = data.patients.findIndex(p => p.id === patientId);
    if (pIdx !== -1) {
      data.patients[pIdx].nfcId = nfcId;
      // Add to global NFC list if not exists
      if(!data.nfcCards.find(c => c.id === nfcId)) {
        data.nfcCards.push({ id: nfcId, patientId: patientId, status: 'active' });
      }
      DataService.save(data);
      return true;
    }
    return false;
  }
};

// --- COMPONENTS ---

// 1. HEALTH ASSISTANT CHATBOT
const HealthAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I'm your HealthKey Assistant. How can I help you today? ✨" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);
    const response = await GeminiService.chatWithAssistant(userMsg);
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={`fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:scale-105 transition-transform z-40 ${isOpen ? 'hidden' : 'flex'}`}><Sparkles className="w-6 h-6" /></button>
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-200">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2"><Bot className="w-5 h-5" /><span className="font-bold">Health Assistant</span></div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><X className="w-4 h-4" /></button>
          </div>
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'}`}>{msg.text}</div>
              </div>
            ))}
            {isTyping && <div className="flex justify-start"><div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1"><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div></div></div>}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about symptoms..." className="flex-1 px-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-blue-500" />
            <button type="submit" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"><Send className="w-4 h-4" /></button>
          </form>
        </div>
      )}
    </>
  );
};

// 2. AI UPLOAD COMPONENT
const AIUploadModule = ({ patientId, onSave }) => {
  const [step, setStep] = useState('upload');
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) processImage(selectedFile);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const processImage = async (file) => {
    setFile(file);
    setStep('processing');
    try {
      const base64 = await convertToBase64(file);
      const data = await GeminiService.analyzeMedicalImage(base64);
      setExtractedData(data);
      setStep('review');
    } catch (err) {
      console.error(err);
      alert("Failed to process image.");
      setStep('upload');
    }
  };

  const handleSave = () => {
    DataService.addMedicalRecord(patientId, extractedData);
    if(onSave) onSave();
    setStep('success');
    setTimeout(() => { setStep('upload'); setFile(null); setExtractedData(null); }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2"><Sparkles className="w-12 h-12 text-blue-100 opacity-50" /></div>
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-600" /> AI-Powered Medical Upload ✨</h3>
      {step === 'upload' && (
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50/50">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"><Upload className="w-8 h-8" /></div>
          <h4 className="text-slate-900 font-medium mb-1">Upload Medical Report</h4>
          <p className="text-slate-500 text-sm mb-4">Gemini AI will extract data automatically.</p>
          <input type="file" id="file-upload" className="hidden" onChange={handleFileSelect} accept="image/*" />
          <label htmlFor="file-upload" className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 cursor-pointer transition-colors shadow-lg shadow-blue-600/20"><Sparkles className="w-4 h-4" /> Select Image</label>
        </div>
      )}
      {step === 'processing' && (
        <div className="py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
             <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
             <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-blue-600 animate-pulse" />
          </div>
          <h4 className="text-lg font-bold text-slate-800 mb-2">Gemini is Thinking...</h4>
        </div>
      )}
      {step === 'review' && extractedData && (
        <div className="space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex items-center justify-between"><span className="text-emerald-800 text-sm font-medium flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Extraction Complete</span><span className="text-emerald-700 text-xs font-bold bg-emerald-100 px-2 py-1 rounded">{extractedData.confidence || 90}% Confidence</span></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-slate-500 mb-1">Hospital</label><input type="text" value={extractedData.hospital} onChange={(e) => setExtractedData({...extractedData, hospital: e.target.value})} className="w-full p-2 border border-slate-300 rounded-md text-sm" /></div>
            <div><label className="block text-xs font-medium text-slate-500 mb-1">Doctor</label><input type="text" value={extractedData.doctor} onChange={(e) => setExtractedData({...extractedData, doctor: e.target.value})} className="w-full p-2 border border-slate-300 rounded-md text-sm" /></div>
            <div><label className="block text-xs font-medium text-slate-500 mb-1">Date</label><input type="date" value={extractedData.date} onChange={(e) => setExtractedData({...extractedData, date: e.target.value})} className="w-full p-2 border border-slate-300 rounded-md text-sm" /></div>
          </div>
          <div><label className="block text-xs font-medium text-slate-500 mb-1">Diagnosis</label><textarea rows={2} value={extractedData.diagnosis} onChange={(e) => setExtractedData({...extractedData, diagnosis: e.target.value})} className="w-full p-2 border border-slate-300 rounded-md text-sm" /></div>
          <div><label className="block text-xs font-medium text-slate-500 mb-1">Prescription</label><textarea rows={3} value={extractedData.prescription} onChange={(e) => setExtractedData({...extractedData, prescription: e.target.value})} className="w-full p-2 border border-slate-300 rounded-md text-sm font-mono bg-slate-50" /></div>
          <div className="flex gap-3 pt-4"><button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save</button><button onClick={() => setStep('upload')} className="px-4 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium">Cancel</button></div>
        </div>
      )}
      {step === 'success' && (<div className="py-12 text-center animate-in zoom-in duration-300"><div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-8 h-8" /></div><h4 className="text-lg font-bold text-slate-800 mb-2">Record Saved!</h4></div>)}
    </div>
  );
};

// --- AUTH MODAL ---
const AuthModal = ({ isOpen, onClose, type, onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [regData, setRegData] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '', specialization: '', hospitalName: '', address: '', bloodGroup: '', allergies: '', gender: 'Male', age: '' });

  useEffect(() => {
    setLoginData({ identifier: '', password: '' });
    setRegData({ name: '', email: '', mobile: '', password: '', confirmPassword: '', specialization: '', hospitalName: '', address: '', bloodGroup: '', allergies: '', gender: 'Male', age: '' });
    setError('');
    setIsLoading(false);
    setIsRegistering(false);
  }, [isOpen, type]);

  if (!isOpen) return null;

  const config = {
    patient: { title: "Patient Portal", icon: User, color: "bg-blue-600" },
    doctor: { title: "Doctor Portal", icon: Stethoscope, color: "bg-emerald-600" },
    hospital: { title: "Hospital Portal", icon: Building2, color: "bg-purple-600" },
    admin: { title: "Admin Portal", icon: Lock, color: "bg-slate-800" }
  };
  
  const currentConfig = config[type] || config.patient;
  const Icon = currentConfig.icon;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!loginData.identifier || !loginData.password) { setError("All fields required"); return; }
    setIsLoading(true);
    setTimeout(() => {
      try {
        const user = DataService.login(loginData.identifier, loginData.password, type);
        setIsLoading(false);
        if (user) { onLoginSuccess(user); onClose(); } else { setError("Invalid credentials."); }
      } catch (err) {
        setIsLoading(false);
        setError(err.message);
      }
    }, 800);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    if(regData.password !== regData.confirmPassword) { setError("Passwords do not match"); return; }
    if(!regData.name || !regData.email || !regData.password) { setError("All fields required"); return; }

    setIsLoading(true);
    setTimeout(() => {
      const newUser = DataService.register(type, regData);
      setIsLoading(false);
      if(type === 'doctor' || type === 'hospital') {
        alert("Registration successful! Your account is pending admin approval.");
        setIsRegistering(false);
      } else {
        onLoginSuccess(newUser);
        onClose();
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 z-10"><X className="w-5 h-5" /></button>
        <div className="pt-8 pb-4 text-center px-8 shrink-0">
          <div className={`mx-auto w-14 h-14 ${currentConfig.color} rounded-full flex items-center justify-center mb-3 shadow-lg`}><Icon className="w-7 h-7 text-white" /></div>
          <h2 className="text-xl font-bold text-gray-800">{isRegistering ? `Register as ${type}` : currentConfig.title}</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2"><ShieldAlert className="w-4 h-4" />{error}</div>}
          {!isRegistering ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input type="text" className="w-full p-2.5 rounded-lg border border-gray-300 outline-none" placeholder={type === 'patient' ? "e.g. 9876543210" : "e.g. admin@healthkey.in"} value={loginData.identifier} onChange={e => setLoginData({...loginData, identifier: e.target.value})} />
              <input type="password" className="w-full p-2.5 rounded-lg border border-gray-300 outline-none" placeholder="••••••••" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} />
              <button disabled={isLoading} className={`w-full py-2.5 rounded-lg font-semibold text-white ${currentConfig.color} hover:brightness-110 flex justify-center`}>{isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}</button>
              {type !== 'admin' && (<div className="text-center text-sm"><span className="text-gray-500">New here? </span><button type="button" onClick={() => setIsRegistering(true)} className="text-blue-600 font-medium hover:underline">Create Account</button></div>)}
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <input type="text" placeholder="Full Name" className="w-full p-2.5 rounded-lg border border-gray-300 outline-none" value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} />
              <input type="email" placeholder="Email Address" className="w-full p-2.5 rounded-lg border border-gray-300 outline-none" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} />
              {type === 'patient' && (
                <>
                  <input type="tel" placeholder="Mobile Number" className="w-full p-2.5 rounded-lg border border-gray-300 outline-none" value={regData.mobile} onChange={e => setRegData({...regData, mobile: e.target.value})} />
                  <div className="flex gap-2">
                    <select className="w-1/3 p-2.5 rounded-lg border border-gray-300" value={regData.gender} onChange={e => setRegData({...regData, gender: e.target.value})}><option>Male</option><option>Female</option><option>Other</option></select>
                    <input type="number" placeholder="Age" className="w-1/3 p-2.5 rounded-lg border border-gray-300" value={regData.age} onChange={e => setRegData({...regData, age: e.target.value})} />
                    <input type="text" placeholder="Blood Group" className="w-1/3 p-2.5 rounded-lg border border-gray-300" value={regData.bloodGroup} onChange={e => setRegData({...regData, bloodGroup: e.target.value})} />
                  </div>
                  <input type="text" placeholder="Allergies (Optional)" className="w-full p-2.5 rounded-lg border border-gray-300" value={regData.allergies} onChange={e => setRegData({...regData, allergies: e.target.value})} />
                </>
              )}
              {type === 'doctor' && <input type="text" placeholder="Specialization" className="w-full p-2.5 rounded-lg border border-gray-300" value={regData.specialization} onChange={e => setRegData({...regData, specialization: e.target.value})} />}
              {type === 'hospital' && <input type="text" placeholder="Address" className="w-full p-2.5 rounded-lg border border-gray-300" value={regData.address} onChange={e => setRegData({...regData, address: e.target.value})} />}
              <input type="password" placeholder="Password" className="w-full p-2.5 rounded-lg border border-gray-300" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} />
              <input type="password" placeholder="Confirm Password" className="w-full p-2.5 rounded-lg border border-gray-300" value={regData.confirmPassword} onChange={e => setRegData({...regData, confirmPassword: e.target.value})} />
              <button disabled={isLoading} className={`w-full py-2.5 rounded-lg font-semibold text-white ${currentConfig.color} hover:brightness-110 flex justify-center`}>{isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Register Now"}</button>
              <div className="text-center text-sm"><span className="text-gray-500">Already registered? </span><button type="button" onClick={() => setIsRegistering(false)} className="text-blue-600 font-medium hover:underline">Login</button></div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// --- DASHBOARD COMPONENT ---

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [systemData, setSystemData] = useState(DataService.get());
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [nfcScanning, setNfcScanning] = useState(false);
  const [scannedPatient, setScannedPatient] = useState(null);

  // Specific User Data
  const patientData = systemData.patients.find(p => p.email === user.email);
  const doctorData = systemData.doctors.find(d => d.email === user.email);
  const hospitalData = systemData.hospitals.find(h => h.email === user.email);

  useEffect(() => {
    if(user.role === 'patient' && patientData) setProfileForm(patientData);
  }, [user, patientData]);

  const refreshData = () => setSystemData(DataService.get());

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    DataService.updateProfile('patient', patientData.id, profileForm);
    refreshData();
    setEditingProfile(false);
    alert("Profile Updated Successfully");
  };

  const handleAdminAction = (id, action) => {
    DataService.adminAction(id, action);
    refreshData();
  };

  const handleNfcScan = () => {
    setNfcScanning(true);
    setTimeout(() => {
      const p = systemData.patients[0]; // Simulating scanning the first patient
      setScannedPatient(p);
      setNfcScanning(false);
    }, 2000);
  };

  const getNavItems = () => {
    if(user.role === 'patient') return [{name: 'Overview', icon: LayoutDashboard}, {name: 'Medical Records', icon: FileText}, {name: 'My Card', icon: CreditCard}, {name: 'Settings', icon: Settings}];
    if(user.role === 'doctor') return [{name: 'Overview', icon: LayoutDashboard}, {name: 'My Patients', icon: Users}, {name: 'Appointments', icon: Calendar}];
    if(user.role === 'hospital') return [{name: 'Overview', icon: LayoutDashboard}, {name: 'Doctors', icon: Stethoscope}, {name: 'Patients', icon: Users}, {name: 'NFC Reader', icon: Scan}];
    if(user.role === 'admin') return [{name: 'Overview', icon: LayoutDashboard}, {name: 'Approvals', icon: CheckCircle2}, {name: 'Users', icon: Users}, {name: 'System', icon: Database}];
    return [];
  };

  const renderContent = () => {
    switch(user.role) {
      /* PATIENT DASHBOARD */
      case 'patient':
        if(activeTab === 'Medical Records') return (
          <div className="space-y-6 max-w-5xl mx-auto">
             <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-slate-800">Medical Records</h2><button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"><Download className="w-4 h-4" /> Export</button></div>
             <AIUploadModule patientId={patientData?.id} onSave={refreshData} />
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 font-medium text-slate-700">Recent History</div>
                <div className="divide-y divide-slate-100">
                   {patientData?.medicalHistory?.map((record, idx) => (
                      <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
                         <div className="flex justify-between items-start mb-2"><div><h4 className="font-bold text-slate-800 text-lg">{record.hospital}</h4><p className="text-sm text-slate-500">Dr. {record.doctor} • {record.date}</p></div><span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${record.type === 'AI Upload' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{record.type || 'Visit'}</span></div>
                         <div className="mt-4 grid md:grid-cols-2 gap-4"><div className="bg-slate-50 p-3 rounded-lg"><span className="text-xs font-bold text-slate-400 uppercase block mb-1">Diagnosis</span><p className="text-slate-700 text-sm">{record.diagnosis}</p></div><div className="bg-slate-50 p-3 rounded-lg"><span className="text-xs font-bold text-slate-400 uppercase block mb-1">Prescription</span><pre className="text-slate-700 text-sm font-sans whitespace-pre-wrap">{record.prescription}</pre></div></div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        );
        if(activeTab === 'My Card') return (
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Digital Health Card</h2>
            <div className="bg-slate-800 text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-20 -mt-20"></div>
               <div className="flex justify-between items-start mb-12"><Key className="w-10 h-10 text-yellow-400" /><Activity className="w-8 h-8 text-emerald-400" /></div>
               <div className="mb-8"><div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Card Holder</div><div className="text-2xl font-bold tracking-wide">{patientData?.name}</div></div>
               <div className="flex justify-between items-end"><div><div className="text-xs text-slate-400 uppercase mb-1">Health ID</div><div className="font-mono text-xl">{patientData?.nfcId || 'NOT LINKED'}</div></div><CreditCard className="w-10 h-10 text-white/50" /></div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold mb-4">Link Physical NFC Card</h3>
              <p className="text-sm text-slate-500 mb-4">Visit any partner hospital to get your physical HealthKey NFC card linked to your account.</p>
              <button className="w-full py-2 bg-slate-100 text-slate-600 rounded-lg font-medium border border-slate-300 hover:bg-slate-200">Request New Card</button>
            </div>
          </div>
        );
        if(activeTab === 'Settings') return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Profile Settings</h2>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              {editingProfile ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium">Full Name</label><input type="text" className="w-full p-2 border rounded" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} /></div>
                    <div><label className="text-sm font-medium">Mobile</label><input type="text" className="w-full p-2 border rounded" value={profileForm.mobile} onChange={e => setProfileForm({...profileForm, mobile: e.target.value})} /></div>
                    <div><label className="text-sm font-medium">Age</label><input type="number" className="w-full p-2 border rounded" value={profileForm.age} onChange={e => setProfileForm({...profileForm, age: e.target.value})} /></div>
                    <div><label className="text-sm font-medium">Blood Group</label><input type="text" className="w-full p-2 border rounded" value={profileForm.bloodGroup} onChange={e => setProfileForm({...profileForm, bloodGroup: e.target.value})} /></div>
                  </div>
                  <div><label className="text-sm font-medium">Allergies</label><input type="text" className="w-full p-2 border rounded" value={profileForm.allergies} onChange={e => setProfileForm({...profileForm, allergies: e.target.value})} /></div>
                  <div><label className="text-sm font-medium">Emergency Contact</label><input type="text" className="w-full p-2 border rounded" value={profileForm.emergencyContact} onChange={e => setProfileForm({...profileForm, emergencyContact: e.target.value})} /></div>
                  <div className="flex gap-2 pt-4"><button className="px-4 py-2 bg-blue-600 text-white rounded">Save Changes</button><button type="button" onClick={() => setEditingProfile(false)} className="px-4 py-2 bg-slate-200 rounded">Cancel</button></div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4"><div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">{patientData?.name[0]}</div><div><h3 className="text-xl font-bold">{patientData?.name}</h3><p className="text-slate-500">{patientData?.email}</p></div></div>
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div><span className="text-slate-500 block">Mobile</span>{patientData?.mobile}</div>
                    <div><span className="text-slate-500 block">Blood Group</span>{patientData?.bloodGroup}</div>
                    <div><span className="text-slate-500 block">Age/Gender</span>{patientData?.age} / {patientData?.gender}</div>
                    <div><span className="text-slate-500 block">Allergies</span>{patientData?.allergies}</div>
                  </div>
                  <button onClick={() => setEditingProfile(true)} className="w-full py-2 border border-slate-300 rounded text-slate-600 hover:bg-slate-50">Edit Profile</button>
                </div>
              )}
            </div>
          </div>
        );
        return (
          <div className="max-w-4xl mx-auto">
             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl mb-8">
                <h2 className="text-3xl font-bold mb-2">Welcome, {patientData?.name}</h2>
                <div className="mt-8 flex gap-4">
                   <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl"><div className="text-2xl font-bold">{patientData?.medicalHistory?.length || 0}</div><div className="text-sm text-blue-200">Total Records</div></div>
                   <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl"><div className="text-2xl font-bold">{patientData?.bloodGroup || 'N/A'}</div><div className="text-sm text-blue-200">Blood Group</div></div>
                </div>
             </div>
          </div>
        );

      /* DOCTOR DASHBOARD */
      case 'doctor':
        const myPatients = systemData.patients.filter(p => doctorData?.assignedPatients?.includes(p.id));
        if(activeTab === 'My Patients') return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 border-b flex justify-between items-center"><h3 className="font-bold">Assigned Patients</h3><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{myPatients.length} Total</span></div>
            <div className="divide-y">{myPatients.map(p => (
              <div key={p.id} className="p-4 flex justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">{p.name[0]}</div><div><div className="font-medium">{p.name}</div><div className="text-xs text-slate-500">{p.age} Y • {p.gender}</div></div></div>
                <div className="flex gap-2"><button className="text-sm px-3 py-1 border rounded hover:bg-slate-50">View History</button><button className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Add Rx</button></div>
              </div>
            ))}
            {myPatients.length === 0 && <div className="p-8 text-center text-slate-500">No patients assigned yet.</div>}</div>
          </div>
        );
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"><div className="text-sm text-slate-500">Assigned Patients</div><div className="text-3xl font-bold text-slate-800">{myPatients.length}</div></div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"><div className="text-sm text-slate-500">Hospital</div><div className="text-xl font-bold text-slate-800 truncate">{systemData.hospitals.find(h => h.id === doctorData.hospitalId)?.name}</div></div>
          </div>
        );

      /* HOSPITAL DASHBOARD */
      case 'hospital':
        if(activeTab === 'NFC Reader') return (
          <div className="max-w-xl mx-auto text-center py-12">
            <div className={`w-48 h-48 rounded-full flex items-center justify-center mx-auto mb-8 ${nfcScanning ? 'bg-blue-50 animate-pulse' : 'bg-slate-100'}`}>
              <Scan className={`w-24 h-24 ${nfcScanning ? 'text-blue-600' : 'text-slate-400'}`} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{nfcScanning ? 'Scanning Card...' : 'Ready to Scan'}</h2>
            {!nfcScanning && !scannedPatient && <button onClick={handleNfcScan} className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:scale-105 transition-transform">Tap HealthKey Card</button>}
            
            {scannedPatient && (
              <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200 shadow-lg text-left animate-in slide-in-from-bottom-4">
                <div className="flex justify-between items-start mb-4"><h3 className="font-bold text-lg">Card Detected</h3><button onClick={() => setScannedPatient(null)} className="text-slate-400 hover:text-red-500"><X className="w-5 h-5" /></button></div>
                <div className="flex items-center gap-4 mb-6"><div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">{scannedPatient.name[0]}</div><div><div className="font-bold text-xl">{scannedPatient.name}</div><div className="text-slate-500">{scannedPatient.nfcId}</div></div></div>
                <div className="grid grid-cols-2 gap-4 mb-6"><div className="bg-slate-50 p-3 rounded"><span className="text-xs text-slate-500 block">Blood Group</span><span className="font-bold">{scannedPatient.bloodGroup}</span></div><div className="bg-slate-50 p-3 rounded"><span className="text-xs text-slate-500 block">Allergies</span><span className="font-bold">{scannedPatient.allergies}</span></div></div>
                <div className="flex gap-2"><button className="flex-1 bg-blue-600 text-white py-2 rounded font-medium">View Full Records</button><button className="flex-1 border border-slate-300 py-2 rounded font-medium">Admit Patient</button></div>
              </div>
            )}
          </div>
        );
        if(activeTab === 'Doctors') return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 border-b flex justify-between items-center"><h3 className="font-bold">Hospital Doctors</h3><button className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-2"><UserPlus className="w-4 h-4" /> Add Doctor</button></div>
            <div className="divide-y">{systemData.doctors.filter(d => hospitalData.doctors.includes(d.id) || d.hospitalId === hospitalData.id).map(d => (
              <div key={d.id} className="p-4 flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">{d.name[0]}</div><div><div className="font-medium">{d.name}</div><div className="text-xs text-slate-500">{d.specialization}</div></div></div><span className={`px-2 py-1 rounded text-xs ${d.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{d.status}</span></div>
            ))}</div>
          </div>
        );
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"><div className="text-sm text-slate-500">Registered Doctors</div><div className="text-3xl font-bold text-slate-800">{systemData.doctors.filter(d => d.hospitalId === hospitalData.id).length}</div></div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"><div className="text-sm text-slate-500">Total Patients</div><div className="text-3xl font-bold text-slate-800">{systemData.patients.length}</div></div>
          </div>
        );

      /* ADMIN DASHBOARD */
      case 'admin':
        if(activeTab === 'Approvals') {
          const pendingUsers = systemData.users.filter(u => u.status === 'pending');
          return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-4 border-b"><h3 className="font-bold">Pending Registrations</h3></div>
              <div className="divide-y">
                {pendingUsers.map(u => (
                  <div key={u.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <div className="font-medium flex items-center gap-2">{u.email} <span className="text-xs bg-slate-200 px-2 rounded uppercase">{u.role}</span></div>
                      <div className="text-xs text-slate-500">ID: {u.id}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAdminAction(u.id, 'approve')} className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"><Check className="w-4 h-4" /></button>
                      <button onClick={() => handleAdminAction(u.id, 'reject')} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"><X className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {pendingUsers.length === 0 && <div className="p-8 text-center text-slate-500">No pending approvals.</div>}
              </div>
            </div>
          );
        }
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200"><div className="text-sm text-slate-500">Total Users</div><div className="text-2xl font-bold">{systemData.users.length}</div></div>
            <div className="bg-white p-4 rounded-xl border border-slate-200"><div className="text-sm text-slate-500">Pending</div><div className="text-2xl font-bold text-orange-500">{systemData.users.filter(u => u.status === 'pending').length}</div></div>
          </div>
        );

      default: return <div className="p-8 text-center text-slate-500">Overview</div>
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      <aside className="w-64 bg-slate-800 text-slate-300 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 bg-slate-900"><Key className="h-6 w-6 text-blue-500 mr-3" /><span className="text-xl font-bold text-white tracking-tight">HealthKey</span></div>
        <div className="p-4"><div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menu</div><nav className="space-y-1">{getNavItems().map(item => (<button key={item.name} onClick={() => setActiveTab(item.name)} className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === item.name ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 hover:text-white'}`}><item.icon className={`h-5 w-5 mr-3 ${activeTab === item.name ? 'text-white' : 'text-slate-400'}`} />{item.name}</button>))}</nav></div>
        <div className="mt-auto p-4 border-t border-slate-700"><div className="flex items-center gap-3 mb-4 px-2"><div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold">{user.email[0].toUpperCase()}</div><div className="overflow-hidden"><div className="text-sm font-medium text-white truncate">{user.role.toUpperCase()}</div><div className="text-xs text-slate-500 truncate">{user.email}</div></div></div><button onClick={onLogout} className="w-full flex items-center justify-center px-4 py-2 bg-slate-700 hover:bg-red-600/20 hover:text-red-400 rounded-lg text-sm transition-colors"><LogOut className="w-4 h-4 mr-2" /> Sign Out</button></div>
      </aside>
      <main className="flex-1 overflow-y-auto">
         <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10"><h1 className="text-xl font-bold text-slate-800">{activeTab}</h1><div className="flex items-center gap-4"><span className="text-sm text-slate-500">Last login: Today, 10:30 AM</span></div></header>
         <div className="p-8">{renderContent()}</div>
      </main>
      {user.role === 'patient' && <HealthAssistant />}
    </div>
  );
};

// --- LANDING PAGE COMPONENT ---
const LandingPage = ({ onOpenModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToSection = (id) => { const el = document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth'}); setIsMenuOpen(false); };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo(0,0)}><Key className="h-8 w-8 text-blue-600 mr-2 rotate-45" /><span className={`text-2xl font-bold tracking-tight ${scrolled ? 'text-slate-900' : 'text-slate-800'}`}>HealthKey</span></div>
          <div className="hidden md:flex items-center space-x-8">{['Features', 'How It Works', 'About'].map(item => (<button key={item} onClick={() => scrollToSection(item.toLowerCase().replace(/\s+/g, '-'))} className="text-slate-600 hover:text-blue-600 font-medium transition-colors">{item}</button>))} <button onClick={() => scrollToSection('login')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-semibold shadow-lg shadow-blue-600/30 transition-all hover:scale-105">Get Started</button></div>
          <div className="md:hidden flex items-center"><button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 p-2">{isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button></div>
        </div>
      </nav>
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-70"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-6 border border-blue-100">🚀 Now Live in Delhi NCR</div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">Your Complete <span className="text-blue-600">Health Record</span> in One Tap</h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">NFC-powered healthcare cards that work across every hospital in India. Secure, instant access to your medical history.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"><button onClick={() => scrollToSection('login')} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-1">Get Your HealthKey Card</button></div>
          </div>
          <div className="lg:w-1/2 relative"><div className="relative bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 transform rotate-1 hover:rotate-0 transition-transform duration-500"><div className="bg-slate-50 rounded-xl border border-slate-200 p-4 min-h-[300px] flex items-center justify-center"><div className="text-center"><Activity className="w-16 h-16 text-blue-500 mx-auto mb-4" /><h3 className="text-xl font-bold text-slate-800">Secure Health Data</h3><p className="text-slate-500 mt-2">Access your history anywhere.</p></div></div></div></div>
        </div>
      </section>
      <section id="login" className="py-24 bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Access Your HealthKey Account</h2><p className="text-slate-400 max-w-2xl mx-auto">Select your role to login or register.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{ id: 'patient', label: 'Patient', icon: User }, { id: 'doctor', label: 'Doctor', icon: Stethoscope }, { id: 'hospital', label: 'Hospital', icon: Building2 }, { id: 'admin', label: 'Admin', icon: Lock }].map((role) => (
               <div key={role.id} className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-blue-500/50 transition-colors flex flex-col items-center">
                  <div className="w-14 h-14 bg-white/10 text-white rounded-xl flex items-center justify-center mb-6"><role.icon className="w-7 h-7" /></div>
                  <h3 className="text-xl font-bold text-white mb-2">{role.label}</h3>
                  <button onClick={() => onOpenModal(role.id)} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors mt-4">Login / Register</button>
               </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// --- APP ENTRY POINT ---
export default function App() {
  const [user, setUser] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  useEffect(() => { DataService.init(); }, []);
  const handleLoginSuccess = (userData) => { setUser(userData); setActiveModal(null); };
  const handleLogout = () => { setUser(null); };
  if (user) { return <Dashboard user={user} onLogout={handleLogout} />; }
  return (<><LandingPage onOpenModal={setActiveModal} /><AuthModal isOpen={!!activeModal} onClose={() => setActiveModal(null)} type={activeModal} onLoginSuccess={handleLoginSuccess} /></>);
}