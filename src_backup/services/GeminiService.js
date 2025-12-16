import axios from 'axios';

export const GeminiService = {
  // Note: In production, this would use the actual Google Gemini API
  // For demo purposes, we'll simulate AI processing
  
  analyzeMedicalDocument: async (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockAnalysis = {
          type: file.name.includes('prescription') ? 'prescription' : 'lab_report',
          extractedData: {
            patientName: 'Rajesh Kumar',
            doctorName: 'Dr. Ravi Sharma',
            date: new Date().toISOString().split('T')[0],
            diagnosis: 'Hypertension',
            medicines: [
              { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily' },
              { name: 'Losartan', dosage: '50mg', frequency: 'Once daily' }
            ],
            instructions: 'Take after food. Monitor BP daily.',
            labResults: file.name.includes('lab') ? {
              hemoglobin: '14.2 g/dL',
              bloodGlucose: '98 mg/dL',
              cholesterol: '180 mg/dL'
            } : null
          },
          confidence: 92
        };
        resolve(mockAnalysis);
      }, 1500);
    });
  },

  generateHealthSummary: async (patientData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const summary = {
          healthScore: 85,
          riskFactors: ['Hypertension', 'Family history of diabetes'],
          recommendations: [
            'Monitor blood pressure weekly',
            'Reduce salt intake',
            'Exercise 30 minutes daily',
            'Annual cardiac checkup recommended'
          ],
          nextCheckup: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
        };
        resolve(summary);
      }, 2000);
    });
  },

  suggestDiagnosis: async (symptoms) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const suggestions = [
          {
            condition: 'Hypertension',
            probability: 85,
            suggestedTests: ['Blood Pressure Monitoring', 'Complete Blood Count', 'Lipid Profile']
          },
          {
            condition: 'Anxiety Disorder',
            probability: 45,
            suggestedTests: ['Psychiatric Evaluation']
          }
        ];
        resolve(suggestions);
      }, 1000);
    });
  },

  translateMedicalTerm: async (term) => {
    const medicalDictionary = {
      'hypertension': 'High blood pressure',
      'hyperglycemia': 'High blood sugar',
      'dyspnea': 'Shortness of breath',
      'tachycardia': 'Fast heart rate',
      'bradycardia': 'Slow heart rate'
    };
    
    return medicalDictionary[term.toLowerCase()] || term;
  }
};