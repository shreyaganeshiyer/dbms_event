const BASE = '/api/connections';

async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.message || 'Request failed');
    return data;
}

export const connectionsApi = {
    getActive: () => request('/active'),
    test: (details) => request('/test', { method: 'POST', body: JSON.stringify(details) }),
    connect: (details) => request('/connect', { method: 'POST', body: JSON.stringify(details) }),
    disconnect: () => request('/disconnect', { method: 'POST' }),
};