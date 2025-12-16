// simple API helper
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

async function request(path, opts = {}) {
  const token = localStorage.getItem('hk_token');
  const headers = opts.headers || {};
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(BASE_URL + path, { ...opts, headers });
  const json = await res.json().catch(()=> ({}));
  if (!res.ok) throw json;
  return json;
}

export default {
  login: (email, password) => request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  register: (payload) => request('/api/auth/register', {
    method: 'POST', body: JSON.stringify(payload)
  }),
  getAdminStats: () => request('/api/admin/stats'),
  // add other calls: appointments, records, queue...
};
