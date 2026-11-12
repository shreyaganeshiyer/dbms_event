const BASE = '/api/connections';

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

const json = (body) => JSON.stringify(body);

export const getActive = () => request('/active');

export const test = (details) =>
  request('/test', { method: 'POST', body: json(details) });

export const connect = (details) =>
  request('/connect', { method: 'POST', body: json(details) });

export const disconnect = () =>
  request('/disconnect', { method: 'POST' });

export const listSaved = () => request('/saved');

export const saveConnection = (details) =>
  request('/saved', { method: 'POST', body: json(details) });

export const deleteSaved = (id) =>
  request(`/saved/${id}`, { method: 'DELETE' });

export const connectSaved = (id) =>
  request(`/saved/${id}/connect`, { method: 'POST' });