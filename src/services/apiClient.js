const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

async function request(path, options = {}) {
  const token = localStorage.getItem('hk_token');
  const headers = options.headers || {};

  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }

  const res = await fetch(BASE_URL + path, {
    ...options,
    headers,
  });

  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    // no json body
  }

  if (!res.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export default { request };
