// =====================================================
// ResolveDesk – App Router & Bootstrap
// =====================================================

function navigate(hash) {
  window.location.hash = hash;
}

function router() {
  const hash = window.location.hash || '#';
  const path = hash.slice(1);
  const parts = path.split('/');

  if (!Auth.isLoggedIn() && path !== 'register') {
    renderAuth('login');
    return;
  }

  if (Auth.isLoggedIn() && (!path || path === 'login' || path === 'register')) {
    const role = Auth.getCurrentUser()?.role;
    navigate(role === 'admin' ? '#admin/dashboard' : '#dashboard');
    return;
  }

  if (path === 'register') {
    renderAuth('register');
    return;
  }

  const role = Auth.getCurrentUser()?.role;
  const isAdminPath = path.startsWith('admin');

  // Enforce role access
  if (role !== 'admin' && isAdminPath) {
    navigate('#dashboard');
    return;
  }
  if (role === 'admin' && !isAdminPath && path) {
    navigate('#admin/dashboard');
    return;
  }

  // Ensure shell is rendered
  if (!document.querySelector('.app-shell')) {
    UI.renderShell(role);
  }

  // Route matching
  if (role === 'user') {
    if (path === 'dashboard' || !path) renderUserDashboard();
    else if (path === 'tickets') renderMyTickets();
    else if (path === 'create') renderCreateTicket();
    else if (path === 'profile') renderProfile();
    else if (parts[0] === 'ticket' && parts[1]) renderTicketDetail(parts[1]);
    else renderUserDashboard();
  } else if (role === 'admin') {
    if (path === 'admin/dashboard' || path === 'admin') renderAdminDashboard();
    else if (path === 'admin/tickets') renderAdminTickets();
    else if (path === 'admin/users') renderAdminUsers();
    else if (path === 'admin/settings') renderAdminSettings();
    else if (parts[0] === 'admin' && parts[1] === 'ticket' && parts[2]) renderAdminTicketDetail(parts[2]);
    else renderAdminDashboard();
  }
}

// ── Auth Pages (Login/Register) ──
function renderAuth(mode) {
  document.getElementById('app').innerHTML = `
    <div class="auth-layout">
      <div class="auth-left">
        <div class="auth-brand">
          <div class="auth-brand-icon">
            <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
          <div class="auth-brand-name">ResolveDesk</div>
        </div>
        <div class="auth-left-content float-anim">
          <h1 class="auth-left-title">Enterprise Support<br>Made Simple</h1>
          <p class="auth-left-desc">A unified platform for managing complaints, tracking resolutions, and delivering exceptional support experiences.</p>
        </div>
        <div class="auth-features">
          <div class="auth-feature"><div class="auth-feature-icon">⚡</div> Fast issue tracking</div>
          <div class="auth-feature"><div class="auth-feature-icon">🔒</div> Secure role management</div>
          <div class="auth-feature"><div class="auth-feature-icon">📊</div> Real-time insights</div>
        </div>
      </div>
      <div class="auth-right">
        <div class="auth-form-container card-enter">
          <h2 class="auth-form-title">${mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p class="auth-form-subtitle">${mode === 'login' ? 'Enter your credentials to access your portal.' : 'Sign up to submit and track your complaints.'}</p>
          
          <div class="auth-tabs">
            <div class="auth-tab ${mode === 'login' ? 'active' : ''}" onclick="navigate('#login')">Sign In</div>
            <div class="auth-tab ${mode === 'register' ? 'active' : ''}" onclick="navigate('#register')">Register</div>
          </div>

          <form id="auth-form" onsubmit="${mode === 'login' ? 'handleLogin(event)' : 'handleRegister(event)'}" novalidate>
            ${mode === 'register' ? `
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" id="auth-name" class="form-input" placeholder="e.g. John Doe" required>
              </div>
            ` : ''}
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" id="auth-email" class="form-input" placeholder="you@example.com" value="${mode === 'login' ? 'admin@resolvedesk.com' : ''}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" id="auth-password" class="form-input" placeholder="••••••••" value="${mode === 'login' ? 'admin123' : ''}" required>
            </div>
            ${mode === 'login' ? `
              <div class="form-group" style="display:flex;justify-content:space-between;align-items:center;margin-top:-10px">
                <label style="font-size:var(--text-xs);color:var(--text-muted);display:flex;align-items:center;gap:6px;cursor:pointer">
                  <input type="checkbox" id="auth-remember"> Remember me
                </label>
                <a href="#" style="font-size:var(--text-xs);color:var(--primary);font-weight:600">Forgot password?</a>
              </div>
            ` : ''}
            <button type="submit" class="btn btn-primary btn-full btn-lg ripple" style="margin-top:10px">
              ${mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          ${mode === 'login' ? `
            <div style="margin-top:24px;padding:16px;background:rgba(99,102,241,0.05);border-radius:var(--radius-sm);border:1px dashed rgba(99,102,241,0.3)">
              <div style="font-size:var(--text-xs);font-weight:700;color:var(--primary);margin-bottom:8px">Demo Accounts:</div>
              <div style="font-size:var(--text-xs);color:var(--text-secondary);display:flex;justify-content:space-between;margin-bottom:4px">
                <span>Admin: <strong>admin@resolvedesk.com</strong></span> <span>admin123</span>
              </div>
              <div style="font-size:var(--text-xs);color:var(--text-secondary);display:flex;justify-content:space-between">
                <span>User: <strong>jyothi@example.com</strong></span> <span>user123</span>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('auth-email').value.trim();
  const pwd = document.getElementById('auth-password').value;
  const rem = document.getElementById('auth-remember')?.checked;

  if (!email || !pwd) { UI.showToast('error', 'Missing fields', 'Please enter email and password.'); return; }

  const res = Auth.login(email, pwd, rem);
  if (res.success) {
    UI.showToast('success', 'Login successful');
    router();
  } else {
    document.getElementById('auth-form').classList.add('shake');
    setTimeout(() => document.getElementById('auth-form').classList.remove('shake'), 400);
    UI.showToast('error', 'Login failed', res.error);
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('auth-name').value.trim();
  const email = document.getElementById('auth-email').value.trim();
  const pwd = document.getElementById('auth-password').value;

  const res = Auth.register({ name, email, password: pwd });
  if (res.success) {
    UI.showToast('success', 'Registration successful');
    router();
  } else {
    UI.showToast('error', 'Registration failed', res.error);
  }
}

// ── App Initialization ──
function initApp() {
  DB.init(); // Initialize mock DB if empty
  window.addEventListener('hashchange', router);
  router(); // Initial route
}

// Attach to window so event handlers work
window.navigate = navigate;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
