const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', 'x-session-id': getSessionId(), ...(options.headers || {}) },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'The request could not be completed.');
  return payload;
}

export const api = {
  generate: (scenario, difficulty) => request('/cases/generate', { method: 'POST', body: { scenario, difficulty } }),
  case: (id) => request(`/cases/${id}`),
  suspects: (id) => request(`/cases/${id}/suspects`),
  evidence: (id) => request(`/cases/${id}/evidence`),
  timeline: (id) => request(`/cases/${id}/timeline`),
  start: (caseId, sessionId) => request('/investigations', { method: 'POST', body: { caseId, sessionId } }),
  investigation: (id) => request(`/investigations/${id}`),
  notes: (id, notes) => request(`/investigations/${id}/notes`, { method: 'PATCH', body: { notes } }),
  accuse: (id, suspectId, reasoning) => request(`/investigations/${id}/accuse`, { method: 'POST', body: { suspectId, reasoning } }),
  result: (id) => request(`/investigations/${id}/result`),
};

export function getSessionId() {
  let id = localStorage.getItem('mystery-session');
  if (!id) { id = crypto.randomUUID(); localStorage.setItem('mystery-session', id); }
  return id;
}
