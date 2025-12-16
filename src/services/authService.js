import apiClient from './apiClient';

export async function login(email, password) {
  return apiClient.request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// Optional (if you implement backend endpoint for current user)
export async function me() {
  return apiClient.request('/api/auth/me', { method: 'GET' });
}
