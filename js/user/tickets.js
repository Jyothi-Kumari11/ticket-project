// =====================================================
// ResolveDesk – My Tickets (User)
// =====================================================

let ticketFilter = 'all';
let ticketSearch = '';

function renderMyTickets() {
  const user = Auth.getCurrentUser();
  UI.setActiveNav('#tickets');

  function getFiltered() {
    let tickets = DB.getTicketsByUser(user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (ticketFilter !== 'all') tickets = tickets.filter(t => t.status === ticketFilter);
    if (ticketSearch) tickets = tickets.filter(t =>
      t.id.toLowerCase().includes(ticketSearch) ||
      t.subject.toLowerCase().includes(ticketSearch) ||
      t.category.toLowerCase().includes(ticketSearch)
    );
    return tickets;
  }

  function render() {
    const tickets = getFiltered();
    const filters = [
      { key: 'all', label: 'All' },
      { key: 'open', label: 'Open' },
      { key: 'in_progress', label: 'In Progress' },
      { key: 'resolved', label: 'Resolved' },
      { key: 'closed', label: 'Closed' }
    ];

    UI.renderPage(`
      <div class="page-enter">
        <div class="page-header page-header-row">
          <div>
            <h1 class="page-title">My Tickets</h1>
            <p class="page-subtitle">Track and manage all your support complaints</p>
          </div>
          <button class="btn btn-primary ripple" onclick="navigate('#create')">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Ticket
          </button>
        </div>

        <div class="filter-bar">
          <div class="filter-search">
            <svg class="filter-search-icon" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search tickets by ID, subject..." id="ticket-search-input" value="${ticketSearch}" autocomplete="off">
          </div>
          <div class="filter-tabs">
            ${filters.map(f => `
              <div class="filter-tab ${ticketFilter === f.key ? 'active' : ''}" onclick="setTicketFilter('${f.key}')">${f.label}</div>
            `).join('')}
          </div>
        </div>

        ${tickets.length === 0 ? `
          <div class="card">
            <div class="empty-state">
              <div class="empty-state-icon">🔍</div>
              <div class="empty-state-title">${ticketSearch || ticketFilter !== 'all' ? 'No matching tickets' : 'No tickets yet'}</div>
              <div class="empty-state-desc">${ticketSearch || ticketFilter !== 'all' ? 'Try adjusting your search or filter.' : 'You have not submitted any support tickets yet.'}</div>
              ${ticketFilter === 'all' && !ticketSearch ? `<button class="btn btn-primary" onclick="navigate('#create')">Create Your First Ticket</button>` : ''}
            </div>
          </div>
        ` : `
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Last Update</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${tickets.map(t => `
                  <tr class="stagger-item" onclick="navigate('#ticket/${t.id}')" style="cursor:pointer">
                    <td class="ticket-id">${t.id}</td>
                    <td>
                      <div class="ticket-subject">${escapeHtml(t.subject)}</div>
                      <div class="ticket-date">${t.messages.length} ${t.messages.length === 1 ? 'reply' : 'replies'}</div>
                    </td>
                    <td style="font-size:var(--text-xs);color:var(--text-muted)">${DB.categoryIcon(t.category)} ${t.category}</td>
                    <td>${DB.priorityBadgeHTML(t.priority)}</td>
                    <td>${DB.statusBadgeHTML(t.status)}</td>
                    <td style="font-size:var(--text-xs);color:var(--text-muted)">${DB.formatDate(t.createdAt)}</td>
                    <td style="font-size:var(--text-xs);color:var(--text-muted)">${DB.formatDate(t.updatedAt)}</td>
                    <td>
                      <div class="table-actions">
                        <button class="action-btn view" title="View" onclick="event.stopPropagation();navigate('#ticket/${t.id}')">
                          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div style="margin-top:12px;font-size:var(--text-xs);color:var(--text-muted);text-align:right">
            Showing ${tickets.length} ticket${tickets.length !== 1 ? 's' : ''}
          </div>
        `}
      </div>
    `);

    // Search event
    document.getElementById('ticket-search-input')?.addEventListener('input', e => {
      ticketSearch = e.target.value.toLowerCase();
      render();
    });
  }

  render();
}

function setTicketFilter(filter) {
  ticketFilter = filter;
  renderMyTickets();
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

window.renderMyTickets = renderMyTickets;
window.setTicketFilter = setTicketFilter;
window.escapeHtml = escapeHtml;
