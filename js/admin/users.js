// =====================================================
// ResolveDesk – Admin Users
// =====================================================

function renderAdminUsers() {
  UI.setActiveNav('#admin/users');
  const users = DB.getUsers();

  UI.renderPage(`
    <div class="page-enter">
      <div class="page-header">
        <h1 class="page-title">Users</h1>
        <p class="page-subtitle">Manage registered users in the system</p>
      </div>
      <div class="card">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr class="stagger-item">
                  <td>
                    <div style="display:flex;align-items:center;gap:8px">
                      <div class="user-list-avatar" style="background:${u.avatarColor || 'var(--primary)'}">${u.initials || 'U'}</div>
                      <div style="font-weight:600">${escapeHtml(u.name)}</div>
                    </div>
                  </td>
                  <td>${escapeHtml(u.email)}</td>
                  <td><span class="badge ${u.role === 'admin' ? 'badge-urgent' : 'badge-low'}">${u.role}</span></td>
                  <td>${escapeHtml(u.department || '-')}</td>
                  <td>${DB.formatDate(u.createdAt)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `);
}

window.renderAdminUsers = renderAdminUsers;
