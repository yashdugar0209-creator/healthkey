import apiClient from './apiClient';

export async function getCard() {
  return apiClient.request('/api/patient/nfc-card', { method: 'GET' });
}

export async function getUsageHistory() {
  return apiClient.request('/api/patient/nfc-card/usage', { method: 'GET' });
}

export async function reportLost() {
  return apiClient.request('/api/patient/nfc-card/report-lost', {
    method: 'POST',
  });
}
