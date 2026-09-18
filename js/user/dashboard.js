// =====================================================
// ResolveDesk – User Dashboard
// =====================================================

function renderUserDashboard() {
  const user = Auth.getCurrentUser();
  const stats = DB.getUserTicketStats(user.id);
  const tickets = DB.getTicketsByUser(user.id).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  UI.setActiveNav('#dashboard');

  UI.renderPage(`
    <div class="page-enter">
      <!-- Welcome Banner -->
      <div class="welcome-banner">
        <div class="welcome-text">
          <div class="welcome-greeting">Welcome back, ${user.name.split(' ')[0]}! 👋</div>
          <div class="welcome-sub">Track and manage your support tickets from one place.</div>
        </div>
        <div class="welcome-action">
          <button class="btn btn-lg ripple" onclick="navigate('#create')" style="background:white;color:var(--primary);font-weight:700">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Ticket
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card primary stagger-item hover-lift">
          <div class="stat-card-header">
            <span class="stat-card-label">Total Tickets</span>
            <div class="stat-card-icon"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg></div>
          </div>
          <div class="stat-card-value count-up">${stats.total}</div>
          <div class="stat-card-change">All your submitted complaints</div>
        </div>
        <div class="stat-card warning stagger-item hover-lift">
          <div class="stat-card-header">
            <span class="stat-card-label">Open</span>
            <div class="stat-card-icon"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          </div>
          <div class="stat-card-value count-up">${stats.open}</div>
          <div class="stat-card-change">Awaiting response</div>
        </div>
        <div class="stat-card info stagger-item hover-lift">
          <div class="stat-card-header">
            <span class="stat-card-label">In Progress</span>
            <div class="stat-card-icon"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg></div>
          </div>
          <div class="stat-card-value count-up">${stats.in_progress}</div>
          <div class="stat-card-change">Being worked on</div>
        </div>
        <div class="stat-card success stagger-item hover-lift">
          <div class="stat-card-header">
            <span class="stat-card-label">Resolved</span>
            <div class="stat-card-icon"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
          </div>
          <div class="stat-card-value count-up">${stats.resolved + stats.closed}</div>
          <div class="stat-card-change">Successfully resolved</div>
        </div>
      </div>

      <!-- Recent Tickets -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">🕐 Recent Tickets</h3>
          <button class="btn btn-secondary btn-sm" onclick="navigate('#tickets')">View All</button>
        </div>
        ${tickets.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">🎫</div>
            <div class="empty-state-title">No tickets yet</div>
            <div class="empty-state-desc">You haven't submitted any support tickets. Create your first one now.</div>
            <button class="btn btn-primary" onclick="navigate('#create')">Create First Ticket</button>
          </div>
        ` : `
          <div class="table-container" style="border:none;border-radius:0;box-shadow:none">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${tickets.map(t => `
                  <tr class="stagger-item" onclick="navigate('#ticket/${t.id}')" style="cursor:pointer">
                    <td class="ticket-id">${t.id}</td>
                    <td>
                      <div class="ticket-subject">${t.subject}</div>
                    </td>
                    <td style="font-size:var(--text-xs);color:var(--text-muted)">${DB.categoryIcon(t.category)} ${t.category}</td>
                    <td>${DB.priorityBadgeHTML(t.priority)}</td>
                    <td>${DB.statusBadgeHTML(t.status)}</td>
                    <td style="font-size:var(--text-xs);color:var(--text-muted)">${DB.formatDate(t.createdAt)}</td>
                    <td>
                      <div class="table-actions">
                        <button class="action-btn view" title="View ticket" onclick="event.stopPropagation();navigate('#ticket/${t.id}')">
                          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>

      <!-- Quick actions row -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:22px">
        <div class="card card-body" style="text-align:center;cursor:pointer;transition:var(--transition)" onclick="navigate('#create')" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--border)'">
          <div style="font-size:32px;margin-bottom:8px">✉️</div>
          <div style="font-weight:700;color:var(--text-primary);margin-bottom:4px">Submit a Complaint</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted)">Raise a new support ticket quickly</div>
        </div>
        <div class="card card-body" style="text-align:center;cursor:pointer;transition:var(--transition)" onclick="navigate('#tickets')" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--border)'">
          <div style="font-size:32px;margin-bottom:8px">🔍</div>
          <div style="font-weight:700;color:var(--text-primary);margin-bottom:4px">Track Your Tickets</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted)">View status and history of all tickets</div>
        </div>
      </div>
    </div>
  `);
}

window.renderUserDashboard = renderUserDashboard;
