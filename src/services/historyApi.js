const BASE = '/api/history';

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

export const listHistory = (limit = 100) => request(`?limit=${limit}`);

export const deleteHistoryItem = (id) =>
  request(`/${id}`, { method: 'DELETE' });

export const clearHistory = () => request('', { method: 'DELETE' });