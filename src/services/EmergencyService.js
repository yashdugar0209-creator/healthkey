export const EmergencyService = {
  accessRequests: [],
  
  grantAccess: (nfcId, accessorDetails, reason) => {
    const request = {
      id: `EMA${Date.now()}`,
      nfcId,
      accessor: accessorDetails,
      reason,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    };
    
    EmergencyService.accessRequests.push(request);
    
    // Log emergency access
    const logs = JSON.parse(localStorage.getItem('healthkey_emergency_logs') || '[]');
    logs.push({
      requestId: request.id,
      nfcId,
      accessor: accessorDetails.name,
      reason,
      timestamp: request.timestamp
    });
    localStorage.setItem('healthkey_emergency_logs', JSON.stringify(logs));
    
    return request;
  },
  
  validateAccess: (requestId) => {
    const request = EmergencyService.accessRequests.find(r => r.id === requestId);
    if (!request) return false;
    
    const now = new Date();
    const expiresAt = new Date(request.expiresAt);
    
    if (now > expiresAt) {
      request.status = 'expired';
      return false;
    }
    
    return true;
  },
  
  getPatientCriticalInfo: (patientId) => {
    const data = JSON.parse(localStorage.getItem('healthkey_system') || '{}');
    const patient = data.patients?.find(p => p.id === patientId);
    
    if (!patient) return null;
    
    return {
      name: patient.name,
      age: patient.age,
      bloodGroup: patient.bloodGroup,
      allergies: patient.allergies,
      emergencyContact: patient.emergencyContact,
      currentMedications: patient.medicalHistory?.slice(0, 2) || [],
      criticalConditions: ['Hypertension'],
      insurance: patient.insurance,
      lastHospital: patient.currentHospital
    };
  },
  
  notifyEmergencyContact: (patientId, emergencyDetails) => {
    const data = JSON.parse(localStorage.getItem('healthkey_system') || '{}');
    const patient = data.patients?.find(p => p.id === patientId);
    
    if (patient && patient.emergencyContact) {
      // In real implementation, this would send SMS/Email
      console.log(`Emergency notification sent to: ${patient.emergencyContact}`);
      console.log('Details:', emergencyDetails);
      
      return {
        success: true,
        contact: patient.emergencyContact,
        message: 'Emergency contact notified'
      };
    }
    
    return {
      success: false,
      message: 'No emergency contact found'
    };
  },
  
  getAccessLogs: () => {
    return JSON.parse(localStorage.getItem('healthkey_emergency_logs') || '[]');
  }
};