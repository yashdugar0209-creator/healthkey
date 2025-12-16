import apiClient from './apiClient';

export async function sendMessages(messages) {
  // messages: [{ role: 'user' | 'assistant' | 'system', content: string }]
  return apiClient.request('/api/patient/ai-assistant', {
    method: 'POST',
    body: JSON.stringify({ messages }),
  });
}
