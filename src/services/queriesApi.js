const BASE = '/api/queries';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const queriesApi = {
  execute: (sql) => request('/execute', { method: 'POST', body: JSON.stringify({ sql }) }),
  analyze: (sql) => request('/analyze', { method: 'POST', body: JSON.stringify({ sql }) }),
};