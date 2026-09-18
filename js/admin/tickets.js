// =====================================================
// ResolveDesk – Admin All Tickets
// =====================================================

let adminFilter = 'all';
let adminSearch = '';
let adminPriorityFilter = 'all';
let adminSort = 'newest';

function renderAdminTickets() {
  UI.setActiveNav('#admin/tickets');

  function getFiltered() {
    let tickets = DB.getTickets().sort((a, b) => {
      if (adminSort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (adminSort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (adminSort === 'priority') {
        const order = { urgent: 0, high: 1, medium: 2, low: 3 };
        return (order[a.priority] || 3) - (order[b.priority] || 3);
      }
      return 0;
    });
    if (adminFilter !== 'all') tickets = tickets.filter(t => t.status === adminFilter);
    if (adminPriorityFilter !== 'all') tickets = tickets.filter(t => t.priority === adminPriorityFilter);
    if (adminSearch) tickets = tickets.filter(t =>
      t.id.toLowerCase().includes(adminSearch) ||
      t.subject.toLowerCase().includes(adminSearch) ||
      (DB.getUserById(t.userId)?.name || '').toLowerCase().includes(adminSearch) ||
      t.category.toLowerCase().includes(adminSearch)
    );
    return tickets;
  }

  function render() {
    const tickets = getFiltered();
    const statusFilters = [
      { key: 'all', label: 'All' },
      { key: 'open', label: '🟡 Open' },
      { key: 'in_progress', label: '🔵 In Progress' },
      { key: 'resolved', label: '🟢 Resolved' },
      { key: 'closed', label: '⚫ Closed' }
    ];

    UI.renderPage(`
      <div class="page-enter">
        <div class="page-header page-header-row">
          <div>
            <h1 class="page-title">All Tickets</h1>
            <p class="page-subtitle">Manage and respond to all support requests</p>
          </div>
          <div style="display:flex;gap:10px">
            <select class="form-select" id="admin-sort" style="width:auto" onchange="setAdminSort(this.value)">
              <option value="newest" ${adminSort==='newest'?'selected':''}>Newest First</option>
              <option value="oldest" ${adminSort==='oldest'?'selected':''}>Oldest First</option>
              <option value="priority" ${adminSort==='priority'?'selected':''}>By Priority</option>
            </select>
            <select class="form-select" id="admin-priority-filter" style="width:auto" onchange="setAdminPriorityFilter(this.value)">
              <option value="all" ${adminPriorityFilter==='all'?'selected':''}>All Priorities</option>
              <option value="urgent" ${adminPriorityFilter==='urgent'?'selected':''}>🔴 Urgent</option>
              <option value="high" ${adminPriorityFilter==='high'?'selected':''}>🟠 High</option>
              <option value="medium" ${adminPriorityFilter==='medium'?'selected':''}>🟡 Medium</option>
              <option value="low" ${adminPriorityFilter==='low'?'selected':''}>🟢 Low</option>
            </select>
          </div>
        </div>

        <div class="filter-bar">
          <div class="filter-search">
            <svg class="filter-search-icon" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" id="admin-search-input" placeholder="Search by ID, user, subject..." value="${adminSearch}" autocomplete="off">
          </div>
          <div class="filter-tabs">
            ${statusFilters.map(f => `
              <div class="filter-tab ${adminFilter === f.key ? 'active' : ''}" onclick="setAdminFilter('${f.key}')">${f.label}</div>
            `).join('')}
          </div>
        </div>

        ${tickets.length === 0 ? `
          <div class="card">
            <div class="empty-state">
              <div class="empty-state-icon">🔍</div>
              <div class="empty-state-title">No tickets found</div>
              <div class="empty-state-desc">Try adjusting your search or filters.</div>
            </div>
          </div>
        ` : `
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>User</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${tickets.map(t => {
                  const user = DB.getUserById(t.userId);
                  return `
                    <tr class="stagger-item" onclick="navigate('#admin/ticket/${t.id}')" style="cursor:pointer">
                      <td class="ticket-id">${t.id}</td>
                      <td>
                        <div style="display:flex;align-items:center;gap:8px">
                          <div style="width:28px;height:28px;border-radius:50%;background:${user?.avatarColor||'var(--primary)'};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:white;flex-shrink:0">${user?.initials||'U'}</div>
                          <div>
                            <div style="font-size:var(--text-xs);font-weight:600;color:var(--text-primary)">${escapeHtml(user?.name||'Unknown')}</div>
                            <div style="font-size:10px;color:var(--text-light)">${user?.department||''}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="ticket-subject">${escapeHtml(t.subject)}</div>
                        <div class="ticket-date">${t.messages.length} message${t.messages.length!==1?'s':''}</div>
                      </td>
                      <td style="font-size:var(--text-xs);color:var(--text-muted)">${DB.categoryIcon(t.category)} ${t.category}</td>
                      <td>${DB.priorityBadgeHTML(t.priority)}</td>
                      <td>${DB.statusBadgeHTML(t.status)}</td>
                      <td style="font-size:var(--text-xs);color:var(--text-muted);white-space:nowrap">${DB.formatDate(t.createdAt)}</td>
                      <td>
                        <div class="table-actions">
                          <button class="action-btn view" title="View & Respond" onclick="event.stopPropagation();navigate('#admin/ticket/${t.id}')">
                            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          </button>
                          ${t.status !== 'closed' ? `
                            <button class="action-btn edit" title="Quick Close" onclick="event.stopPropagation();quickCloseTicket('${t.id}')">
                              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            </button>
                          ` : ''}
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
          <div style="margin-top:12px;font-size:var(--text-xs);color:var(--text-muted);text-align:right">
            Showing ${tickets.length} of ${DB.getTickets().length} tickets
          </div>
        `}
      </div>
    `);

    document.getElementById('admin-search-input')?.addEventListener('input', e => {
      adminSearch = e.target.value.toLowerCase();
      render();
    });
  }

  render();
}

function setAdminFilter(f) { adminFilter = f; renderAdminTickets(); }
function setAdminSort(s) { adminSort = s; renderAdminTickets(); }
function setAdminPriorityFilter(p) { adminPriorityFilter = p; renderAdminTickets(); }

function quickCloseTicket(ticketId) {
  UI.showConfirmModal({
    title: 'Close Ticket',
    message: `Are you sure you want to close ticket <strong>${ticketId}</strong>? This will mark it as resolved and notify the user.`,
    confirmText: 'Close Ticket',
    type: 'success',
    onConfirm: () => {
      DB.updateTicketStatus(ticketId, 'closed', Auth.getCurrentUser()?.id);
      UI.showToast('success', 'Ticket Closed', `${ticketId} has been marked as closed.`);
      renderAdminTickets();
    }
  });
}

window.renderAdminTickets = renderAdminTickets;
window.setAdminFilter = setAdminFilter;
window.setAdminSort = setAdminSort;
window.setAdminPriorityFilter = setAdminPriorityFilter;
window.quickCloseTicket = quickCloseTicket;
