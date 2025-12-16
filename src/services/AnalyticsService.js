export const AnalyticsService = {
  getHospitalAnalytics: (hospitalId, period = '7d') => {
    const data = JSON.parse(localStorage.getItem('healthkey_system') || '{}');
    const hospital = data.hospitals?.find(h => h.id === hospitalId);
    
    if (!hospital) return null;
    
    // Generate mock analytics data
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 1;
    const trends = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      trends.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        patients: Math.floor(Math.random() * 100) + 50,
        revenue: Math.floor(Math.random() * 200000) + 100000,
        waitTime: Math.floor(Math.random() * 30) + 10
      });
    }
    
    const departmentStats = [
      { department: 'Cardiology', patients: 120, revenue: 450000 },
      { department: 'Neurology', patients: 85, revenue: 320000 },
      { department: 'Pediatrics', patients: 200, revenue: 280000 },
      { department: 'Orthopedics', patients: 95, revenue: 380000 },
      { department: 'General Medicine', patients: 300, revenue: 450000 }
    ];
    
    const doctorPerformance = data.doctors
      ?.filter(d => d.hospitalId === hospitalId)
      .map(doctor => ({
        name: doctor.name,
        specialization: doctor.specialization,
        patientsSeen: Math.floor(Math.random() * 50) + 20,
        satisfaction: Math.floor(Math.random() * 20) + 80,
        revenue: Math.floor(Math.random() * 100000) + 50000
      })) || [];
    
    return {
      summary: {
        totalPatients: trends.reduce((sum, day) => sum + day.patients, 0),
        totalRevenue: trends.reduce((sum, day) => sum + day.revenue, 0),
        avgWaitTime: Math.round(trends.reduce((sum, day) => sum + day.waitTime, 0) / days),
        patientSatisfaction: 94
      },
      trends,
      departmentStats,
      doctorPerformance,
      predictions: {
        tomorrowPatients: Math.round(trends[trends.length - 1].patients * 1.1),
        weeklyRevenue: Math.round(trends.reduce((sum, day) => sum + day.revenue, 0) / days * 7),
        peakHours: ['10:00-12:00', '15:00-17:00']
      }
    };
  },
  
  getPatientAnalytics: (patientId) => {
    const data = JSON.parse(localStorage.getItem('healthkey_system') || '{}');
    const patient = data.patients?.find(p => p.id === patientId);
    
    if (!patient) return null;
    
    const visitsByMonth = Array.from({ length: 6 }, (_, i) => ({
      month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' }),
      visits: Math.floor(Math.random() * 3) + 1
    }));
    
    const conditionTrend = patient.medicalHistory?.slice(0, 5).map((record, i) => ({
      date: record.date,
      condition: record.diagnosis,
      severity: ['Low', 'Medium', 'High'][i % 3]
    })) || [];
    
    return {
      healthScore: 85,
      visitsByMonth,
      conditionTrend,
      recommendations: [
        'Regular BP monitoring',
        'Annual cardiac checkup',
        'Maintain healthy diet',
        'Exercise 30 minutes daily'
      ],
      riskFactors: [
        'Family history of hypertension',
        'Sedentary lifestyle',
        'High salt intake'
      ]
    };
  },
  
  generateReport: (type, data, format = 'pdf') => {
    const report = {
      id: `REP${Date.now()}`,
      type,
      generatedAt: new Date().toISOString(),
      format,
      data,
      downloadUrl: `#report-${Date.now()}`
    };
    
    // Store report
    const reports = JSON.parse(localStorage.getItem('healthkey_reports') || '[]');
    reports.push(report);
    localStorage.setItem('healthkey_reports', JSON.stringify(reports));
    
    return report;
  }
};