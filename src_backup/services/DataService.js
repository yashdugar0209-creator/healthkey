// src/services/DataService.js
class DataService {
  static init() {
    console.log('DataService initialized');
    // Initialize any data or connections here
  }
export const dataService = {
  // Initialization
  init: () => {
    if (!localStorage.getItem('healthkey_system')) {
      const DEFAULT_SYSTEM_DATA = {
        users: [
          {id: "U001", email: "patient@example.com", password: "123", role: "patient", patientId: "P001", status: "active"},
          {id: "U002", email: "doctor@example.com", password: "123", role: "doctor", doctorId: "D001", status: "active"},
          {id: "U003", email: "hospital@example.com", password: "123", role: "hospital", hospitalId: "H001", status: "active"},
          {id: "U004", email: "admin@healthkey.in", password: "Admin123", role: "admin", status: "active"},
          // Apollo Hospital Demo Data
          {id: "U005", email: "apollo@hospital.com", password: "apollo123", role: "hospital", hospitalId: "H002", status: "active"},
          {id: "U006", email: "dr.sharma@apollo.com", password: "doc123", role: "doctor", doctorId: "D002", status: "active"},
          {id: "U007", email: "dr.verma@apollo.com", password: "doc123", role: "doctor", doctorId: "D003", status: "active"},
        ],
        patients: [
          {
            id: "P001",
            name: "Rajesh Kumar",
            mobile: "9876543210",
            email: "patient@example.com",
            gender: "Male",
            age: 34,
            bloodGroup: "O+",
            allergies: "Penicillin, Dust",
            emergencyContact: "+91 9876543219",
            nfcId: "NFC001",
            currentHospital: "H002",
            assignedDoctor: "D002",
            medicalHistory: [
              {id: "V001", date: "2023-11-15", hospital: "Apollo Delhi", doctor: "Dr. Sharma", diagnosis: "Hypertension", prescription: "Amlodipine 5mg", type: "Consultation"}
            ],
            uploadedDocuments: [],
            insurance: {
              provider: "Star Health",
              policyNo: "STAR123456",
              validity: "2024-12-31"
            }
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
            assignedPatients: ["P001"],
            consultationFee: 800,
            availability: {
              monday: ["09:00-13:00", "15:00-18:00"],
              tuesday: ["09:00-13:00", "15:00-18:00"],
              wednesday: ["09:00-13:00"],
              thursday: ["09:00-13:00", "15:00-18:00"],
              friday: ["09:00-13:00"]
            },
            patientQueue: []
          },
          // Apollo Hospital Doctors
          {
            id: "D002",
            name: "Dr. Ravi Sharma",
            email: "dr.sharma@apollo.com",
            specialization: "Neurologist",
            hospitalId: "H002",
            status: "approved",
            qualifications: "MD, DM Neurology, AIIMS",
            assignedPatients: ["P001"],
            consultationFee: 1500,
            availability: {
              monday: ["10:00-16:00"],
              tuesday: ["10:00-16:00"],
              wednesday: ["10:00-13:00"],
              thursday: ["10:00-16:00"],
              friday: ["10:00-13:00"]
            },
            patientQueue: ["P001"]
          },
          {
            id: "D003",
            name: "Dr. Priya Verma",
            email: "dr.verma@apollo.com",
            specialization: "Pediatrician",
            hospitalId: "H002",
            status: "approved",
            qualifications: "MD Pediatrics, PGIMER",
            assignedPatients: [],
            consultationFee: 1200,
            availability: {
              monday: ["09:00-13:00"],
              tuesday: ["09:00-13:00"],
              wednesday: ["09:00-13:00", "15:00-18:00"],
              thursday: ["09:00-13:00"],
              friday: ["09:00-13:00", "15:00-18:00"]
            },
            patientQueue: []
          }
        ],
        hospitals: [
          {
            id: "H001",
            name: "General Hospital, Delhi",
            email: "hospital@example.com",
            registrationNo: "GH123456",
            status: "approved",
            address: "Sarita Vihar, Delhi",
            doctors: ["D001"],
            patients: ["P001"],
            departments: ["Cardiology", "General Medicine"],
            emergencyContact: "+91 11 2658 8888"
          },
          // Apollo Hospital Data
          {
            id: "H002",
            name: "Apollo Hospitals, Ahmedabad",
            email: "apollo@hospital.com",
            registrationNo: "AP789012",
            status: "approved",
            address: "Plot No. 1A, Bhat, Ahmedabad, Gujarat 380058",
            doctors: ["D002", "D003"],
            patients: ["P001"],
            departments: ["Neurology", "Pediatrics", "Cardiology", "Orthopedics", "Oncology"],
            emergencyContact: "+91 79 6670 1800",
            facilities: ["ICU", "NICU", "MRI", "CT Scan", "24x7 Emergency"],
            registrationCounter: {
              currentToken: 25,
              waitingPatients: 3
            }
          }
        ],
        nfcCards: [
          { id: "NFC001", patientId: "P001", status: "active" }
        ],
        accessLogs: [
          { id: "L001", timestamp: "2023-11-15 10:30", accessor: "Dr. Arjun Gupta", action: "Viewed Records", patientId: "P001" }
        ],
        appointments: [
          {
            id: "APT001",
            patientId: "P001",
            doctorId: "D002",
            hospitalId: "H002",
            date: "2024-01-20",
            time: "10:30",
            status: "confirmed",
            reason: "Follow-up for hypertension",
            createdAt: "2024-01-15"
          }
        ],
        emergencyAccess: [],
        analytics: {
          dailyPatients: 0,
          monthlyRevenue: 0,
          patientSatisfaction: 0
        }
      };
      localStorage.setItem('healthkey_system', JSON.stringify(DEFAULT_SYSTEM_DATA));
    }
  },
  
  get: () => {
    return JSON.parse(localStorage.getItem('healthkey_system') || '{}');
  },

  save: (data) => {
    localStorage.setItem('healthkey_system', JSON.stringify(data));
  },

  // Enhanced Login
  login: (identifier, password, role) => {
    const data = DataService.get();
    const user = data.users.find(u => 
      (u.email === identifier || (u.role === 'patient' && u.mobile === identifier)) && 
      u.password === password && 
      u.role === role
    );
    
    if (user && user.role !== 'admin' && user.status !== 'active') {
      throw new Error("Account pending approval or suspended.");
    }
    
    if (!user) {
      throw new Error("Invalid credentials.");
    }
    
    // Log the access
    data.accessLogs.push({
      id: `LOG${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: user.id,
      action: "Logged in",
      ipAddress: "127.0.0.1"
    });
    DataService.save(data);
    
    return user;
  },

  // Enhanced Registration
  register: (role, formData) => {
    const data = DataService.get();
    const newUserId = `U${Date.now()}`;
    const status = role === 'patient' ? 'active' : 'pending';
    
    const newUser = {
      id: newUserId,
      email: formData.email,
      password: formData.password,
      role: role,
      status: status,
      createdAt: new Date().toISOString()
    };

    if (role === 'patient') {
      const pId = `P${Date.now()}`;
      newUser.patientId = pId;
      newUser.mobile = formData.mobile;
      
      // Generate unique NFC ID
      const nfcId = `HK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      data.patients.push({
        id: pId,
        ...formData,
        nfcId: nfcId,
        medicalHistory: [],
        uploadedDocuments: [],
        createdAt: new Date().toISOString(),
        insurance: formData.insurance || null
      });
      
      data.nfcCards.push({
        id: nfcId,
        patientId: pId,
        status: 'active',
        issuedDate: new Date().toISOString()
      });
      
    } else if (role === 'doctor') {
      const dId = `D${Date.now()}`;
      newUser.doctorId = dId;
      data.doctors.push({
        id: dId,
        ...formData,
        assignedPatients: [],
        patientQueue: [],
        status: 'pending',
        consultationFee: formData.consultationFee || 500,
        availability: formData.availability || {},
        qualifications: formData.qualifications || "",
        createdAt: new Date().toISOString()
      });
    } else if (role === 'hospital') {
      const hId = `H${Date.now()}`;
      newUser.hospitalId = hId;
      data.hospitals.push({
        id: hId,
        ...formData,
        doctors: [],
        patients: [],
        status: 'pending',
        departments: formData.departments || [],
        facilities: formData.facilities || [],
        emergencyContact: formData.emergencyContact || "",
        registrationCounter: {
          currentToken: 1,
          waitingPatients: 0
        },
        createdAt: new Date().toISOString()
      });
    }

    data.users.push(newUser);
    DataService.save(data);
    return newUser;
  },

  // Apollo Hospital Features
  
  // Hospital adds doctor to their system
  addDoctorToHospital: (hospitalId, doctorData) => {
    const data = DataService.get();
    const hospital = data.hospitals.find(h => h.id === hospitalId);
    const doctor = data.doctors.find(d => d.id === doctorData.doctorId || d.email === doctorData.email);
    
    if (!hospital || !doctor) return null;
    
    // Check if doctor already in hospital
    if (!hospital.doctors.includes(doctor.id)) {
      hospital.doctors.push(doctor.id);
    }
    
    // Update doctor's hospital affiliation
    doctor.hospitalId = hospitalId;
    doctor.status = 'approved';
    
    DataService.save(data);
    return { success: true, doctor, hospital };
  },

  // Remove doctor from hospital
  removeDoctorFromHospital: (hospitalId, doctorId) => {
    const data = DataService.get();
    const hospital = data.hospitals.find(h => h.id === hospitalId);
    
    if (hospital) {
      hospital.doctors = hospital.doctors.filter(d => d !== doctorId);
      DataService.save(data);
      return true;
    }
    return false;
  },

  // Assign patient to doctor with queue management
  assignPatientToDoctor: (patientId, doctorId, hospitalId, priority = 'normal') => {
    const data = DataService.get();
    const doctor = data.doctors.find(d => d.id === doctorId);
    const patient = data.patients.find(p => p.id === patientId);
    
    if (!doctor || !patient) return null;
    
    // Update patient's current doctor and hospital
    patient.assignedDoctor = doctorId;
    patient.currentHospital = hospitalId;
    
    // Add patient to doctor's queue if not already there
    if (!doctor.patientQueue.includes(patientId)) {
      if (priority === 'emergency') {
        doctor.patientQueue.unshift(patientId); // Add to front for emergency
      } else {
        doctor.patientQueue.push(patientId); // Add to end for normal
      }
    }
    
    // Add patient to doctor's assigned patients if not already
    if (!doctor.assignedPatients.includes(patientId)) {
      doctor.assignedPatients.push(patientId);
    }
    
    // Create consultation record
    const consultationId = `CONS${Date.now()}`;
    const consultation = {
      id: consultationId,
      patientId,
      doctorId,
      hospitalId,
      date: new Date().toISOString(),
      status: 'waiting',
      priority,
      tokenNumber: doctor.patientQueue.length,
      estimatedWaitTime: doctor.patientQueue.length * 15 // 15 minutes per patient
    };
    
    if (!data.consultations) data.consultations = [];
    data.consultations.push(consultation);
    
    DataService.save(data);
    
    return {
      consultation,
      queuePosition: doctor.patientQueue.indexOf(patientId) + 1,
      estimatedWaitTime: consultation.estimatedWaitTime
    };
  },

  // Doctor marks consultation as complete
  completeConsultation: (consultationId, diagnosis, prescription, notes) => {
    const data = DataService.get();
    const consultation = data.consultations?.find(c => c.id === consultationId);
    
    if (consultation) {
      consultation.status = 'completed';
      consultation.completedAt = new Date().toISOString();
      consultation.diagnosis = diagnosis;
      consultation.prescription = prescription;
      consultation.notes = notes;
      
      // Add to patient's medical history
      const patient = data.patients.find(p => p.id === consultation.patientId);
      if (patient) {
        patient.medicalHistory.unshift({
          id: `REC${Date.now()}`,
          date: consultation.date.split('T')[0],
          hospital: data.hospitals.find(h => h.id === consultation.hospitalId)?.name,
          doctor: data.doctors.find(d => d.id === consultation.doctorId)?.name,
          diagnosis,
          prescription,
          notes,
          type: 'Consultation'
        });
      }
      
      // Remove patient from doctor's queue
      const doctor = data.doctors.find(d => d.id === consultation.doctorId);
      if (doctor) {
        doctor.patientQueue = doctor.patientQueue.filter(p => p !== consultation.patientId);
      }
      
      DataService.save(data);
      return true;
    }
    return false;
  },

  // Emergency Access System
  grantEmergencyAccess: (patientNFCId, accessorName, accessorId, reason) => {
    const data = DataService.get();
    const nfcCard = data.nfcCards.find(n => n.id === patientNFCId);
    
    if (!nfcCard) return null;
    
    const emergencyAccess = {
      id: `EMA${Date.now()}`,
      patientId: nfcCard.patientId,
      nfcId: patientNFCId,
      accessorName,
      accessorId,
      reason,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
      status: 'active'
    };
    
    if (!data.emergencyAccess) data.emergencyAccess = [];
    data.emergencyAccess.push(emergencyAccess);
    
    // Log the emergency access
    data.accessLogs.push({
      id: `LOG${Date.now()}`,
      timestamp: new Date().toISOString(),
      patientId: nfcCard.patientId,
      accessor: accessorName,
      action: `Emergency access granted: ${reason}`,
      emergency: true
    });
    
    DataService.save(data);
    return emergencyAccess;
  },

  // Get doctor's queue with patient details
  getDoctorQueue: (doctorId) => {
    const data = DataService.get();
    const doctor = data.doctors.find(d => d.id === doctorId);
    
    if (!doctor) return [];
    
    return doctor.patientQueue.map(patientId => {
      const patient = data.patients.find(p => p.id === patientId);
      const consultation = data.consultations?.find(c => 
        c.patientId === patientId && 
        c.doctorId === doctorId && 
        c.status === 'waiting'
      );
      
      return {
        patient,
        consultation,
        waitTime: consultation?.estimatedWaitTime || 0
      };
    });
  },

  // Get hospital statistics
  getHospitalStats: (hospitalId) => {
    const data = DataService.get();
    const hospital = data.hospitals.find(h => h.id === hospitalId);
    
    if (!hospital) return null;
    
    const hospitalDoctors = data.doctors.filter(d => d.hospitalId === hospitalId);
    const hospitalPatients = data.patients.filter(p => p.currentHospital === hospitalId);
    
    const today = new Date().toISOString().split('T')[0];
    const todaysConsultations = data.consultations?.filter(c => 
      c.hospitalId === hospitalId && 
      c.date.startsWith(today)
    ) || [];
    
    return {
      totalDoctors: hospitalDoctors.length,
      totalPatients: hospitalPatients.length,
      activeConsultations: todaysConsultations.length,
      completedToday: todaysConsultations.filter(c => c.status === 'completed').length,
      waitingPatients: hospitalDoctors.reduce((sum, doc) => sum + doc.patientQueue.length, 0),
      revenueToday: todaysConsultations.filter(c => c.status === 'completed').length * 
                   hospitalDoctors.reduce((avg, doc, i, arr) => avg + (doc.consultationFee || 0) / arr.length, 0)
    };
  },

  // Insurance Integration
  updatePatientInsurance: (patientId, insuranceData) => {
    const data = DataService.get();
    const patient = data.patients.find(p => p.id === patientId);
    
    if (patient) {
      patient.insurance = {
        ...patient.insurance,
        ...insuranceData,
        updatedAt: new Date().toISOString()
      };
      DataService.save(data);
      return true;
    }
    return false;
  },

  // Search Patients (for hospitals/doctors)
  searchPatients: (query, hospitalId = null) => {
    const data = DataService.get();
    let patients = data.patients;
    
    if (hospitalId) {
      patients = patients.filter(p => p.currentHospital === hospitalId);
    }
    
    return patients.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.mobile.includes(query) ||
      p.nfcId?.includes(query) ||
      p.email?.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Bulk operations for hospitals
  bulkAssignPatients: (hospitalId, doctorId, patientIds) => {
    const results = [];
    patientIds.forEach(patientId => {
      const result = DataService.assignPatientToDoctor(patientId, doctorId, hospitalId);
      results.push({ patientId, success: !!result });
    });
    return results;
  },

  // Analytics
  updateAnalytics: () => {
    const data = DataService.get();
    const today = new Date().toISOString().split('T')[0];
    
    const todaysPatients = data.consultations?.filter(c => 
      c.date.startsWith(today) && c.status === 'completed'
    ).length || 0;
    
    const revenue = data.consultations?.filter(c => 
      c.date.startsWith(today) && c.status === 'completed'
    ).reduce((sum, cons) => {
      const doctor = data.doctors.find(d => d.id === cons.doctorId);
      return sum + (doctor?.consultationFee || 0);
    }, 0) || 0;
    
    data.analytics = {
      dailyPatients: todaysPatients,
      monthlyRevenue: revenue * 30, // Simple projection
      patientSatisfaction: Math.min(100, 85 + Math.random() * 15) // Mock data
    };
    
    DataService.save(data);
    return data.analytics;
  },

  // Prescription Management
  addPrescription: (patientId, doctorId, prescriptionData) => {
    const data = DataService.get();
    const patient = data.patients.find(p => p.id === patientId);
    
    if (patient) {
      const prescription = {
        id: `PRES${Date.now()}`,
        patientId,
        doctorId,
        date: new Date().toISOString(),
        ...prescriptionData,
        status: 'active'
      };
      
      if (!patient.prescriptions) patient.prescriptions = [];
      patient.prescriptions.push(prescription);
      
      DataService.save(data);
      return prescription;
    }
    return null;
  },

  // Lab Test Integration
  addLabTest: (patientId, testData) => {
    const data = DataService.get();
    const patient = data.patients.find(p => p.id === patientId);
    
    if (patient) {
      const labTest = {
        id: `LAB${Date.now()}`,
        patientId,
        ...testData,
        orderedAt: new Date().toISOString(),
        status: 'ordered'
      };
      
      if (!patient.labTests) patient.labTests = [];
      patient.labTests.push(labTest);
      
      DataService.save(data);
      return labTest;
    }
    return null;
  }
};