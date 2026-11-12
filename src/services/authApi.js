const BASE = '/api/auth';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    // empty or non-JSON body
  }

  if (!res.ok || data.ok === false) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

const credentials = (username, password) =>
  JSON.stringify({ username, password });

export const me = () => request('/me');

export const login = (username, password) =>
  request('/login', { method: 'POST', body: credentials(username, password) });

export const signup = (username, password) =>
  request('/signup', { method: 'POST', body: credentials(username, password) });

export const logout = () => request('/logout', { method: 'POST' });