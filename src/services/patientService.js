import apiClient from './apiClient';

export async function getOverview() {
  return apiClient.request('/api/patient/overview', { method: 'GET' });
}

export async function getAppointments() {
  return apiClient.request('/api/patient/appointments', { method: 'GET' });
}

export async function getRecords() {
  return apiClient.request('/api/patient/records', { method: 'GET' });
}

// NEW: create / reschedule / cancel appointment (MVP)
export async function createAppointment(payload) {
  return apiClient.request('/api/patient/appointments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function cancelAppointment(id) {
  return apiClient.request(`/api/patient/appointments/${id}`, {
    method: 'DELETE',
  });
}

// NEW: upload record with file
export async function uploadRecord(formData) {
  // formData: FormData with fields file, type, notes, etc.
  return apiClient.request('/api/patient/records/upload', {
    method: 'POST',
    body: formData,
  });
}