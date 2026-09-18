// =====================================================
// ResolveDesk – Admin Settings
// =====================================================

function renderAdminSettings() {
  UI.setActiveNav('#admin/settings');
  const settings = DB.getSettings();

  UI.renderPage(`
    <div class="page-enter" style="max-width:600px">
      <div class="page-header">
        <h1 class="page-title">Settings</h1>
        <p class="page-subtitle">Configure system preferences</p>
      </div>

      <div class="card">
        <div class="card-body">
          <form onsubmit="saveSettings(event)" novalidate>
            <div class="form-group">
              <label class="form-label" for="setting-app-name">Application Name</label>
              <input type="text" id="setting-app-name" class="form-input" value="${escapeHtml(settings.appName || 'ResolveDesk')}">
            </div>
            
            <div class="form-group" style="display:flex;gap:10px;align-items:center;margin-bottom:16px">
              <input type="checkbox" id="setting-reg" ${settings.allowRegistration ? 'checked' : ''}>
              <label for="setting-reg" style="font-size:var(--text-sm);font-weight:600;color:var(--text-secondary)">Allow new user registrations</label>
            </div>

            <div class="form-group" style="display:flex;gap:10px;align-items:center;margin-bottom:16px">
              <input type="checkbox" id="setting-email" ${settings.emailNotifications ? 'checked' : ''}>
              <label for="setting-email" style="font-size:var(--text-sm);font-weight:600;color:var(--text-secondary)">Enable email notifications (Mock)</label>
            </div>

            <button type="submit" class="btn btn-primary ripple" style="margin-top:20px">Save Settings</button>
          </form>
        </div>
      </div>
    </div>
  `);
}

function saveSettings(e) {
  e.preventDefault();
  const appName = document.getElementById('setting-app-name').value;
  const allowReg = document.getElementById('setting-reg').checked;
  const emailNotif = document.getElementById('setting-email').checked;

  DB.updateSettings({ appName, allowRegistration: allowReg, emailNotifications: emailNotif });
  UI.showToast('success', 'Settings saved');
}

window.renderAdminSettings = renderAdminSettings;
window.saveSettings = saveSettings;
