import apiClient from './apiClient';

export async function getQueue() {
  return apiClient.request('/api/doctor/queue', { method: 'GET' });
}

export async function getAppointments() {
  return apiClient.request('/api/doctor/appointments', { method: 'GET' });
}

export async function getPatients() {
  return apiClient.request('/api/doctor/patients', { method: 'GET' });
}

export async function createConsultation(payload) {
  return apiClient.request('/api/doctor/consultations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createPrescription(payload) {
  return apiClient.request('/api/doctor/prescriptions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
