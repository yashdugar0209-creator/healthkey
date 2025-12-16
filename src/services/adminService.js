import apiClient from './apiClient';

// System overview (uptime, active users, etc.)
export async function getSystemOverview() {
  return apiClient.request('/api/admin/stats', { method: 'GET' });
}

// Users list
export async function getUsers(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiClient.request('/api/admin/users' + (query ? `?${query}` : ''), {
    method: 'GET',
  });
}

export async function updateUserStatus(userId, payload) {
  return apiClient.request(`/api/admin/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

// Hospitals list
export async function getHospitals(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiClient.request('/api/admin/hospitals' + (query ? `?${query}` : ''), {
    method: 'GET',
  });
}

export async function updateHospitalStatus(hospitalId, payload) {
  return apiClient.request(`/api/admin/hospitals/${hospitalId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

// Approvals queue
export async function getPendingApprovals() {
  return apiClient.request('/api/admin/approvals/pending', {
    method: 'GET',
  });
}

export async function approveItem(id, payload) {
  return apiClient.request(`/api/admin/approvals/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify(payload || {}),
  });
}

export async function rejectItem(id, payload) {
  return apiClient.request(`/api/admin/approvals/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify(payload || {}),
  });
}
export async function getAnalytics() {
  return apiClient.request('/api/admin/analytics', { method: 'GET' });
}

export async function getSecurityOverview() {
  return apiClient.request('/api/admin/security', { method: 'GET' });
}