// =====================================================
// ResolveDesk – UI Helpers (Toast, Modal, Sidebar, Notifications)
// =====================================================

// ── Toast System ──
const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.body.appendChild(toastContainer);

function showToast(type, title, message = '', duration = 3500) {
  const icons = {
    success: '✓', error: '✕', info: 'ℹ', warning: '⚠'
  };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || 'ℹ'}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      ${message ? `<div class="toast-message">${message}</div>` : ''}
    </div>
    <div class="toast-close" onclick="removeToast(this.parentElement)">✕</div>
    <div class="toast-progress"></div>
  `;
  toastContainer.appendChild(toast);
  setTimeout(() => removeToast(toast), duration);
  return toast;
}

function removeToast(toast) {
  if (!toast || !toast.parentElement) return;
  toast.classList.add('removing');
  setTimeout(() => toast.remove(), 250);
}

// ── Modal System ──
let activeModal = null;

function showModal({ title, body, footer, size = 'md', onClose }) {
  if (activeModal) closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" style="${size === 'sm' ? 'max-width:380px' : size === 'lg' ? 'max-width:620px' : ''}">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        <div class="modal-close" id="modal-close-btn">✕</div>
      </div>
      <div class="modal-body">${body}</div>
      ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('open'));
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  activeModal = { overlay, onClose };
  return overlay;
}

function closeModal() {
  if (!activeModal) return;
  activeModal.overlay.classList.remove('open');
  setTimeout(() => {
    activeModal?.overlay?.remove();
    activeModal?.onClose?.();
    activeModal = null;
  }, 250);
}

function showConfirmModal({ title, message, confirmText = 'Confirm', type = 'danger', onConfirm }) {
  const overlay = showModal({
    title,
    body: `<p style="color:var(--text-secondary);font-size:var(--text-sm);line-height:1.6">${message}</p>`,
    footer: `
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-${type}" id="confirm-modal-btn">${confirmText}</button>
    `,
    size: 'sm'
  });
  document.getElementById('confirm-modal-btn').addEventListener('click', () => {
    closeModal();
    onConfirm?.();
  });
  return overlay;
}

// ── Sidebar Toggle ──
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');
  const overlay = document.getElementById('sidebar-overlay');
  const toggleBtns = document.querySelectorAll('.topbar-toggle, .sidebar-toggle');

  function toggleMobile() {
    const isOpen = sidebar.classList.contains('mobile-open');
    sidebar.classList.toggle('mobile-open', !isOpen);
    overlay.classList.toggle('active', !isOpen);
  }

  function toggleDesktop() {
    const isCollapsed = sidebar.classList.contains('collapsed');
    sidebar.classList.toggle('collapsed', !isCollapsed);
    if (mainContent) {
      mainContent.style.marginLeft = isCollapsed ? 'var(--sidebar-width)' : '72px';
    }
  }

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.innerWidth <= 900) toggleMobile();
      else toggleDesktop();
    });
  });

  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
  });
}

// ── Notification Panel ──
function initNotifications() {
  const btn = document.getElementById('notif-btn');
  const panel = document.getElementById('notif-panel');
  const dot = document.getElementById('notif-dot');
  if (!btn || !panel) return;

  const user = Auth.getCurrentUser();
  if (!user) return;

  function updateCount() {
    const count = DB.getUnreadCount(user.id);
    if (dot) dot.style.display = count > 0 ? 'block' : 'none';
  }

  updateCount();

  btn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = panel.classList.contains('open');
    if (!isOpen) {
      renderNotifPanel();
      panel.classList.add('open');
      DB.markNotificationsRead(user.id);
      if (dot) dot.style.display = 'none';
    } else {
      panel.classList.remove('open');
    }
  });

  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && e.target !== btn) {
      panel.classList.remove('open');
    }
  });
}

function renderNotifPanel() {
  const panel = document.getElementById('notif-panel');
  const user = Auth.getCurrentUser();
  if (!panel || !user) return;
  const notifications = DB.getNotifications(user.id).slice(0, 10);
  const typeIcons = { new_ticket: '🎫', reply: '💬', status_change: '🔄', default: '🔔' };
  const typeBg = { new_ticket: 'var(--primary-light)', reply: 'rgba(16,185,129,0.1)', status_change: 'var(--status-open-bg)', default: 'var(--bg)' };

  panel.innerHTML = `
    <div class="notif-panel-header">
      <span class="notif-panel-title">Notifications</span>
      <span class="notif-mark-read" onclick="DB.markNotificationsRead('${user.id}');renderNotifPanel()">Mark all read</span>
    </div>
    <div class="notif-list">
      ${notifications.length === 0 ? '<div style="padding:24px;text-align:center;color:var(--text-muted);font-size:var(--text-sm)">No notifications yet</div>' : ''}
      ${notifications.map(n => `
        <div class="notif-item ${n.read ? '' : 'unread'}" onclick="closeNotifAndNavigate('${n.ticketId}')">
          <div class="notif-item-icon" style="background:${typeBg[n.type] || typeBg.default}">
            ${typeIcons[n.type] || typeIcons.default}
          </div>
          <div class="notif-item-body">
            <div class="notif-item-text"><strong>${n.title}</strong><br>${n.message}</div>
            <div class="notif-item-time">${DB.formatDate(n.timestamp)}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function closeNotifAndNavigate(ticketId) {
  document.getElementById('notif-panel')?.classList.remove('open');
  if (ticketId) {
    const isAdmin = Auth.isAdmin();
    window.location.hash = isAdmin ? `#admin/ticket/${ticketId}` : `#ticket/${ticketId}`;
  }
}

// ── Topbar User Menu ──
function initTopbarUser() {
  const userBtn = document.getElementById('topbar-user-btn');
  if (!userBtn) return;
  const menu = document.createElement('div');
  menu.id = 'user-menu';
  menu.style.cssText = `
    position:fixed;top:76px;right:20px;width:220px;
    background:var(--bg-card);border:1px solid var(--border);
    border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);
    z-index:200;opacity:0;transform:translateY(-10px) scale(0.97);
    pointer-events:none;transition:var(--transition);overflow:hidden;
  `;
  const user = Auth.getCurrentUser();
  menu.innerHTML = `
    <div style="padding:16px;border-bottom:1px solid var(--border)">
      <div style="font-size:var(--text-sm);font-weight:700;color:var(--text-primary)">${user?.name || 'User'}</div>
      <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px">${user?.email || ''}</div>
    </div>
    <div style="padding:8px">
      <div class="nav-item" onclick="navigate(Auth.isAdmin()?'#admin/settings':'#profile');document.getElementById('user-menu').style.opacity=0" style="color:var(--text-secondary);gap:10px;padding:9px 12px">
        <span style="font-size:14px">⚙</span> <span style="font-size:var(--text-sm)">Settings & Profile</span>
      </div>
      <div class="nav-item" onclick="Auth.logout()" style="color:#ef4444;gap:10px;padding:9px 12px">
        <span style="font-size:14px">→</span> <span style="font-size:var(--text-sm)">Logout</span>
      </div>
    </div>
  `;
  document.body.appendChild(menu);

  userBtn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = menu.style.opacity === '1';
    menu.style.opacity = isOpen ? '0' : '1';
    menu.style.transform = isOpen ? 'translateY(-10px) scale(0.97)' : 'translateY(0) scale(1)';
    menu.style.pointerEvents = isOpen ? 'none' : 'all';
  });

  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && e.target !== userBtn) {
      menu.style.opacity = '0';
      menu.style.pointerEvents = 'none';
    }
  });
}

// ── Render App Shell ──
function renderShell(role) {
  const user = Auth.getCurrentUser();
  if (!user) return;
  const unread = DB.getUnreadCount(user.id);
  const isAdminRole = role === 'admin';

  const userNavItems = `
    <div class="nav-section-label">Main</div>
    <div class="nav-item" data-route="#dashboard" onclick="navigate('#dashboard')">
      <span class="nav-icon">🏠</span><span class="nav-label">Dashboard</span>
    </div>
    <div class="nav-item" data-route="#tickets" onclick="navigate('#tickets')">
      <span class="nav-icon">🎫</span><span class="nav-label">My Tickets</span>
    </div>
    <div class="nav-item" data-route="#create" onclick="navigate('#create')">
      <span class="nav-icon">➕</span><span class="nav-label">New Ticket</span>
    </div>
    <div class="nav-section-label">Account</div>
    <div class="nav-item" data-route="#profile" onclick="navigate('#profile')">
      <span class="nav-icon">👤</span><span class="nav-label">My Profile</span>
    </div>
  `;

  const adminNavItems = `
    <div class="nav-section-label">Overview</div>
    <div class="nav-item" data-route="#admin/dashboard" onclick="navigate('#admin/dashboard')">
      <span class="nav-icon">🏠</span><span class="nav-label">Dashboard</span>
    </div>
    <div class="nav-item" data-route="#admin/tickets" onclick="navigate('#admin/tickets')">
      <span class="nav-icon">🎫</span><span class="nav-label">All Tickets</span>
    </div>
    <div class="nav-section-label">Management</div>
    <div class="nav-item" data-route="#admin/users" onclick="navigate('#admin/users')">
      <span class="nav-icon">👥</span><span class="nav-label">Users</span>
    </div>
    <div class="nav-item" data-route="#admin/reports" onclick="navigate('#admin/reports')">
      <span class="nav-icon">📊</span><span class="nav-label">Reports</span>
    </div>
    <div class="nav-section-label">System</div>
    <div class="nav-item" data-route="#admin/settings" onclick="navigate('#admin/settings')">
      <span class="nav-icon">⚙</span><span class="nav-label">Settings</span>
    </div>
  `;

  document.getElementById('app').innerHTML = `
    <div class="app-shell">
      <!-- Sidebar -->
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-logo">
          <div class="logo-icon">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div class="logo-text">
            <div class="logo-name">ResolveDesk</div>
            <div class="logo-tagline">${isAdminRole ? 'Admin Portal' : 'Support Portal'}</div>
          </div>
        </div>
        <nav class="sidebar-nav">
          ${isAdminRole ? adminNavItems : userNavItems}
        </nav>
        <div class="sidebar-footer">
          <div class="sidebar-user-card" onclick="Auth.logout()">
            <div class="user-avatar-sm" style="background:${user.avatarColor}">${user.initials}</div>
            <div class="sidebar-user-info">
              <div class="sidebar-user-name">${user.name}</div>
              <div class="sidebar-user-role">${isAdminRole ? '🔑 Administrator' : '👤 User'}</div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main -->
      <main class="main-content" id="main-content">
        <!-- Topbar -->
        <header class="topbar">
          <button class="topbar-toggle" aria-label="Toggle sidebar">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div class="topbar-search">
            <svg class="topbar-search-icon" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search tickets..." id="global-search" autocomplete="off">
          </div>
          <div class="topbar-right">
            <div class="topbar-btn" id="notif-btn" title="Notifications">
              <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
              <span class="notif-dot" id="notif-dot" style="display:${unread > 0 ? 'block' : 'none'}"></span>
            </div>
            <div class="topbar-user" id="topbar-user-btn">
              <div class="topbar-avatar" style="background:${user.avatarColor}">${user.initials}</div>
              <span class="topbar-username">${user.name.split(' ')[0]}</span>
              <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <div class="page-content" id="page-content"></div>
      </main>
    </div>
    <!-- Notification panel -->
    <div class="notif-panel" id="notif-panel"></div>
    <!-- Mobile overlay -->
    <div class="overlay" id="sidebar-overlay"></div>
  `;

  initSidebar();
  initNotifications();
  initTopbarUser();
  initGlobalSearch(isAdminRole);
}

// ── Global Search ──
function initGlobalSearch(isAdmin) {
  const input = document.getElementById('global-search');
  if (!input) return;
  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const q = input.value.trim();
      if (!q) return;
      const tickets = isAdmin ? DB.getTickets() : DB.getTicketsByUser(Auth.getCurrentUser()?.id);
      const results = tickets.filter(t =>
        t.id.toLowerCase().includes(q.toLowerCase()) ||
        t.subject.toLowerCase().includes(q.toLowerCase()) ||
        t.description.toLowerCase().includes(q.toLowerCase())
      );
      if (results.length > 0) {
        const id = results[0].id;
        window.location.hash = isAdmin ? `#admin/ticket/${id}` : `#ticket/${id}`;
        input.value = '';
      } else {
        showToast('info', 'No results', `No tickets match "${q}"`);
      }
    }, 500);
  });
}

// ── Active Nav ──
function setActiveNav(route) {
  document.querySelectorAll('.nav-item[data-route]').forEach(el => {
    el.classList.toggle('active', el.dataset.route === route);
  });
}

// ── Render Content ──
function renderPage(html) {
  const el = document.getElementById('page-content');
  if (!el) return;
  el.innerHTML = html;
  el.querySelector('.page-enter') || el.classList.add('page-enter');
  requestAnimationFrame(() => el.style.animation = 'pageIn 0.3s ease forwards');
}

window.UI = {
  showToast, removeToast,
  showModal, closeModal, showConfirmModal,
  renderShell, renderPage, setActiveNav,
  renderNotifPanel, closeNotifAndNavigate
};
