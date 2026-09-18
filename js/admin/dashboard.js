// =====================================================
// ResolveDesk – Admin Dashboard
// =====================================================

function renderAdminDashboard() {
  const stats = DB.getTicketStats();
  const tickets = DB.getTickets().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recentTickets = tickets.slice(0, 6);
  const users = DB.getUsers().filter(u => u.role === 'user');

  // Chart data: tickets per day (last 7 days)
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = tickets.filter(t => t.createdAt.startsWith(dateStr)).length;
    last7.push({ label: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()], count });
  }
  const maxCount = Math.max(...last7.map(d => d.count), 1);

  // Category breakdown
  const categories = {};
  tickets.forEach(t => { categories[t.category] = (categories[t.category] || 0) + 1; });

  // Recent activity (last 5 status changes across all tickets)
  const activities = [];
  tickets.forEach(t => {
    t.timeline.forEach(ev => activities.push({ ...ev, ticketId: t.id, subject: t.subject }));
  });
  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const recentActivity = activities.slice(0, 6);

  UI.setActiveNav('#admin/dashboard');

  UI.renderPage(`
    <div class="page-enter">
      <!-- Welcome Row -->
      <div class="welcome-banner" style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 100%)">
        <div class="welcome-text">
          <div class="welcome-greeting">Admin Dashboard 🔑</div>
          <div class="welcome-sub">Monitor and manage all support tickets across the platform.</div>
        </div>
        <div class="welcome-action" style="display:flex;gap:10px">
          <button class="btn ripple" onclick="navigate('#admin/tickets')" style="background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.2)">
            🎫 All Tickets
          </button>
          <button class="btn ripple" onclick="navigate('#admin/users')" style="background:white;color:var(--primary);font-weight:700">
            👥 Manage Users
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card primary stagger-item hover-lift" onclick="navigate('#admin/tickets')" style="cursor:pointer">
          <div class="stat-card-header">
            <span class="stat-card-label">Total Tickets</span>
            <div class="stat-card-icon">🎫</div>
          </div>
          <div class="stat-card-value count-up">${stats.total}</div>
          <div class="stat-card-change">All time submissions</div>
        </div>
        <div class="stat-card warning stagger-item hover-lift">
          <div class="stat-card-header">
            <span class="stat-card-label">Open</span>
            <div class="stat-card-icon">🟡</div>
          </div>
          <div class="stat-card-value count-up">${stats.open}</div>
          <div class="stat-card-change">Awaiting response</div>
        </div>
        <div class="stat-card info stagger-item hover-lift">
          <div class="stat-card-header">
            <span class="stat-card-label">In Progress</span>
            <div class="stat-card-icon">🔵</div>
          </div>
          <div class="stat-card-value count-up">${stats.in_progress}</div>
          <div class="stat-card-change">Being worked on</div>
        </div>
        <div class="stat-card success stagger-item hover-lift">
          <div class="stat-card-header">
            <span class="stat-card-label">Resolved</span>
            <div class="stat-card-icon">✅</div>
          </div>
          <div class="stat-card-value count-up">${stats.resolved + stats.closed}</div>
          <div class="stat-card-change">Successfully closed</div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="two-col-grid" style="margin-bottom:24px">
        <!-- Ticket Activity Chart -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">📈 Ticket Activity (Last 7 Days)</h3>
          </div>
          <div class="card-body">
            <div class="chart-placeholder">
              ${last7.map(d => `
                <div class="chart-bar-wrap">
                  <div class="chart-bar" style="height:${d.count === 0 ? 4 : Math.max(20, (d.count / maxCount) * 140)}px;background:var(--grad-primary);opacity:${d.count === 0 ? 0.3 : 1}"></div>
                  <div class="chart-bar-label">${d.label}<br><strong style="color:var(--text-primary)">${d.count}</strong></div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Priority Breakdown -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">⚡ By Priority</h3>
          </div>
          <div class="card-body">
            ${['urgent','high','medium','low'].map(p => {
              const count = tickets.filter(t => t.priority === p).length;
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              const colors = { urgent:'#dc2626', high:'#ef4444', medium:'#f97316', low:'#22c55e' };
              return `
                <div style="margin-bottom:16px">
                  <div style="display:flex;justify-content:space-between;margin-bottom:5px">
                    <span style="font-size:var(--text-xs);font-weight:600;text-transform:capitalize;color:var(--text-secondary)">${DB.getPriorityLabel(p)}</span>
                    <span style="font-size:var(--text-xs);color:var(--text-muted)">${count} (${pct}%)</span>
                  </div>
                  <div style="height:8px;background:var(--bg);border-radius:100px;overflow:hidden">
                    <div style="height:100%;width:${pct}%;background:${colors[p]};border-radius:100px;transition:width 1s ease;animation:barGrow 0.8s ease"></div>
                  </div>
                </div>
              `;
            }).join('')}

            <div style="border-top:1px solid var(--border);padding-top:14px;margin-top:14px">
              <div style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px">Users</div>
              <div style="font-size:2rem;font-weight:800;color:var(--primary)">${users.length}</div>
              <div style="font-size:var(--text-xs);color:var(--text-muted)">Registered users</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent tickets + Activity -->
      <div class="two-col-grid">
        <!-- Recent Tickets -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">🕐 Recent Tickets</h3>
            <button class="btn btn-secondary btn-sm" onclick="navigate('#admin/tickets')">View All</button>
          </div>
          <div style="overflow:hidden">
            ${recentTickets.map(t => {
              const user = DB.getUserById(t.userId);
              return `
                <div onclick="navigate('#admin/ticket/${t.id}')" style="display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid var(--border);cursor:pointer;transition:background 0.15s" onmouseover="this.style.background='var(--bg)'" onmouseout="this.style.background=''">
                  <div style="width:36px;height:36px;border-radius:50%;background:${user?.avatarColor || 'var(--primary)'};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:white;flex-shrink:0">${user?.initials || 'U'}</div>
                  <div style="flex:1;min-width:0">
                    <div style="font-size:var(--text-xs);font-weight:700;color:var(--primary);font-family:monospace">${t.id}</div>
                    <div style="font-size:var(--text-sm);font-weight:600;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(t.subject)}</div>
                  </div>
                  <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
                    ${DB.statusBadgeHTML(t.status)}
                    <span style="font-size:10px;color:var(--text-light)">${DB.formatDate(t.createdAt)}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">⚡ Recent Activity</h3>
          </div>
          <div class="card-body">
            ${recentActivity.length === 0 ? '<div style="text-align:center;color:var(--text-muted);font-size:var(--text-sm)">No activity yet</div>' : ''}
            ${recentActivity.map(a => `
              <div class="activity-item">
                <div class="activity-dot"></div>
                <div>
                  <div class="activity-text">
                    <strong>${a.ticketId}</strong> — ${a.message}
                  </div>
                  <div class="activity-time">${DB.formatDateTime(a.timestamp)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `);
}

window.renderAdminDashboard = renderAdminDashboard;
