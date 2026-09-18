// ResolveDesk Unified API Client with JWT Auth

const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('rd_token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    ...options
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`API Error [${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // ─── Auth ───────────────────────────────────────────────────────────
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (userData) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),

  getMe: () => request('/auth/me'),

  updateProfile: (profileData) =>
    request('/auth/profile', { method: 'PATCH', body: JSON.stringify(profileData) }),

  // ─── Tickets ────────────────────────────────────────────────────────
  getTickets: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== 'all' && v !== 'All') {
        searchParams.append(k, v);
      }
    });
    const qs = searchParams.toString();
    return request(`/tickets${qs ? `?${qs}` : ''}`);
  },

  getTicketById: (id) => request(`/tickets/${id}`),

  createTicket: (ticketData) =>
    request('/tickets', { method: 'POST', body: JSON.stringify(ticketData) }),

  updateTicketStatus: (ticketId, payload) =>
    request(`/tickets/${ticketId}/status`, { method: 'PATCH', body: JSON.stringify(payload) }),

  addComment: (ticketId, payload) =>
    request(`/tickets/${ticketId}/comments`, { method: 'POST', body: JSON.stringify(payload) }),

  requestDeletion: (ticketId) =>
    request(`/tickets/${ticketId}/deletion-request`, { method: 'POST', body: JSON.stringify({}) }),

  getDeletionStatus: (ticketId) =>
    request(`/tickets/${ticketId}/deletion-status`),

  respondDeletion: (ticketId, approved) =>
    request(`/tickets/${ticketId}/deletion-response`, { method: 'PATCH', body: JSON.stringify({ approved: Boolean(approved) }) }),

  permanentlyDeleteTicket: (ticketId) =>
    request(`/tickets/${ticketId}`, { method: 'DELETE' }),

  // ─── Users ──────────────────────────────────────────────────────────
  getUsers: () => request('/users'),
  getUserById: (id) => request(`/users/${id}`),

  // ─── Notifications ──────────────────────────────────────────────────
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PATCH', body: JSON.stringify({}) }),

  // ─── Audit Logs ─────────────────────────────────────────────────────
  getAuditLogs: (ticketId) => {
    const qs = ticketId ? `?ticketId=${ticketId}` : '';
    return request(`/audit-logs${qs}`);
  },

  // ─── Feedback ───────────────────────────────────────────────────────
  getFeedback: () => request('/feedback'),
  submitFeedback: (feedbackData) =>
    request('/feedback', { method: 'POST', body: JSON.stringify(feedbackData) }),

  // ─── Stats ──────────────────────────────────────────────────────────
  getStatsSummary: () => request('/stats/summary'),

  // ─── Settings ───────────────────────────────────────────────────────
  getSettings: () => request('/settings'),
  saveSettings: (settings) =>
    request('/settings', { method: 'POST', body: JSON.stringify(settings) }),
};

export default api;
