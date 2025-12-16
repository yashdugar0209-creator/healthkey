export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const calculateAge = (dob) => {
  if (!dob) return 'N/A';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const generateNFCId = () => {
  const prefix = 'HK';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
};

export const generateHealthScore = (medicalHistory) => {
  if (!medicalHistory || medicalHistory.length === 0) return 85;
  
  let score = 85;
  const conditions = medicalHistory.filter(record => 
    ['Hypertension', 'Diabetes', 'Heart Disease'].includes(record.diagnosis)
  );
  
  score -= conditions.length * 10;
  score = Math.max(50, Math.min(100, score));
  
  return Math.round(score);
};

export const calculateWaitTime = (queuePosition) => {
  // Average consultation time: 15 minutes
  return queuePosition * 15;
};

export const generatePDF = (data, type) => {
  // This is a placeholder for PDF generation
  console.log(`Generating PDF for ${type}:`, data);
  return `healthkey_${type}_${Date.now()}.pdf`;
};