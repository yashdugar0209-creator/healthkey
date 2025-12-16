import apiClient from './apiClient';

export async function getOverview() {
  return apiClient.request('/api/hospital/overview', { method: 'GET' });
}

export async function getDoctors() {
  return apiClient.request('/api/hospital/doctors', { method: 'GET' });
}

export async function getPatients() {
  return apiClient.request('/api/hospital/patients', { method: 'GET' });
}

export async function getQueues() {
  return apiClient.request('/api/hospital/queues', { method: 'GET' });
}

export async function getDepartments() {
  return apiClient.request('/api/hospital/departments', { method: 'GET' });
}

export async function getInventory() {
  return apiClient.request('/api/hospital/inventory', { method: 'GET' });
}

export async function getBillingSummary() {
  return apiClient.request('/api/hospital/billing', { method: 'GET' });
}

export async function registerPatient(payload) {
  return apiClient.request('/api/hospital/patients/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
