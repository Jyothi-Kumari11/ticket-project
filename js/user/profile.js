// =====================================================
// ResolveDesk – User Profile
// =====================================================

function renderProfile() {
  const user = Auth.getCurrentUser();
  UI.setActiveNav('#profile');

  const stats = DB.getUserTicketStats(user.id);

  UI.renderPage(`
    <div class="page-enter" style="max-width:760px">
      <div class="page-header">
        <h1 class="page-title">My Profile</h1>
        <p class="page-subtitle">Manage your account information and preferences</p>
      </div>

      <!-- Profile Header Card -->
      <div class="profile-header-card">
        <div class="profile-avatar-lg">${user.initials}</div>
        <div class="profile-header-info">
          <h2>${user.name}</h2>
          <p>${user.email}</p>
          <div class="profile-header-badge">👤 User Account</div>
        </div>
        <div style="margin-left:auto;text-align:right;z-index:1">
          <div style="font-size:var(--text-xs);color:rgba(255,255,255,0.6);margin-bottom:4px">Member since</div>
          <div style="font-size:var(--text-sm);font-weight:600;color:white">${DB.formatDateShort(user.createdAt)}</div>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
        <div class="stat-card hover-lift" style="text-align:center;padding:16px">
          <div class="stat-card-value" style="font-size:1.5rem;color:var(--primary)">${stats.total}</div>
          <div class="stat-card-label" style="font-size:11px;text-align:center;margin-top:4px">Total</div>
        </div>
        <div class="stat-card hover-lift" style="text-align:center;padding:16px">
          <div class="stat-card-value" style="font-size:1.5rem;color:var(--status-open)">${stats.open}</div>
          <div class="stat-card-label" style="font-size:11px;text-align:center;margin-top:4px">Open</div>
        </div>
        <div class="stat-card hover-lift" style="text-align:center;padding:16px">
          <div class="stat-card-value" style="font-size:1.5rem;color:var(--status-progress)">${stats.in_progress}</div>
          <div class="stat-card-label" style="font-size:11px;text-align:center;margin-top:4px">In Progress</div>
        </div>
        <div class="stat-card hover-lift" style="text-align:center;padding:16px">
          <div class="stat-card-value" style="font-size:1.5rem;color:var(--status-resolved)">${stats.resolved + stats.closed}</div>
          <div class="stat-card-label" style="font-size:11px;text-align:center;margin-top:4px">Resolved</div>
        </div>
      </div>

      <!-- Edit Form -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">✏️ Edit Profile</h3>
        </div>
        <div class="card-body">
          <form id="profile-form" onsubmit="saveProfile(event)" novalidate>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
              <div class="form-group">
                <label class="form-label" for="profile-name">Full Name <span>*</span></label>
                <input type="text" id="profile-name" class="form-input" value="${escapeHtml(user.name)}" placeholder="Your full name">
              </div>
              <div class="form-group">
                <label class="form-label" for="profile-email">Email Address</label>
                <input type="email" id="profile-email" class="form-input" value="${escapeHtml(user.email)}" disabled style="opacity:0.65;cursor:not-allowed">
                <div class="form-hint">Email cannot be changed.</div>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
              <div class="form-group">
                <label class="form-label" for="profile-phone">Phone Number</label>
                <input type="tel" id="profile-phone" class="form-input" value="${escapeHtml(user.phone || '')}" placeholder="+91 XXXXX XXXXX">
              </div>
              <div class="form-group">
                <label class="form-label" for="profile-dept">Department</label>
                <input type="text" id="profile-dept" class="form-input" value="${escapeHtml(user.department || '')}" placeholder="e.g. Finance, Operations">
              </div>
            </div>

            <div style="border-top:1px solid var(--border);margin-top:8px;padding-top:20px">
              <h4 style="font-size:var(--text-sm);font-weight:700;color:var(--text-primary);margin-bottom:14px">🔒 Change Password</h4>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
                <div class="form-group">
                  <label class="form-label" for="current-pwd">Current Password</label>
                  <input type="password" id="current-pwd" class="form-input" placeholder="••••••••">
                </div>
                <div class="form-group">
                  <label class="form-label" for="new-pwd">New Password</label>
                  <input type="password" id="new-pwd" class="form-input" placeholder="••••••••">
                  <div class="form-hint">Minimum 6 characters</div>
                </div>
              </div>
            </div>

            <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:8px">
              <button type="button" class="btn btn-secondary" onclick="renderProfile()">Reset</button>
              <button type="submit" class="btn btn-primary ripple" id="save-profile-btn">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="card" style="margin-top:20px;border-color:rgba(239,68,68,0.2)">
        <div class="card-header" style="background:rgba(239,68,68,0.04)">
          <h3 class="card-title" style="color:#ef4444">⚠️ Danger Zone</h3>
        </div>
        <div class="card-body" style="display:flex;align-items:center;justify-content:space-between">
          <div>
            <div style="font-size:var(--text-sm);font-weight:600;color:var(--text-primary)">Sign Out</div>
            <div style="font-size:var(--text-xs);color:var(--text-muted)">Log out of your account on this device.</div>
          </div>
          <button class="btn btn-danger btn-sm" onclick="Auth.logout()">Sign Out</button>
        </div>
      </div>
    </div>
  `);
}

function saveProfile(e) {
  e.preventDefault();
  const user = Auth.getCurrentUser();
  const name = document.getElementById('profile-name').value.trim();
  const phone = document.getElementById('profile-phone').value.trim();
  const department = document.getElementById('profile-dept').value.trim();
  const currentPwd = document.getElementById('current-pwd').value;
  const newPwd = document.getElementById('new-pwd').value;

  if (!name) {
    document.getElementById('profile-name').classList.add('error');
    UI.showToast('error', 'Name is required');
    return;
  }

  const changes = {
    name,
    phone,
    department,
    initials: name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  };

  if (currentPwd || newPwd) {
    if (currentPwd !== user.password) {
      UI.showToast('error', 'Incorrect password', 'Current password is wrong.');
      return;
    }
    if (newPwd.length < 6) {
      UI.showToast('error', 'Password too short', 'New password must be at least 6 characters.');
      return;
    }
    changes.password = newPwd;
  }

  DB.updateUser(user.id, changes);

  // Update session
  const session = Auth.getSession();
  sessionStorage.setItem('resolvedesk_session', JSON.stringify({
    ...session, name: changes.name, initials: changes.initials
  }));

  UI.showToast('success', 'Profile saved!', 'Your changes have been updated successfully.');

  // Re-render to reflect name change
  setTimeout(() => {
    UI.renderShell('user');
    navigate('#profile');
  }, 500);
}

window.renderProfile = renderProfile;
window.saveProfile = saveProfile;
