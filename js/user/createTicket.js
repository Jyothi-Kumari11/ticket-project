// =====================================================
// ResolveDesk – Create Ticket
// =====================================================

let selectedPriority = 'medium';
let showingSuccess = false;

function renderCreateTicket() {
  UI.setActiveNav('#create');
  showingSuccess = false;
  selectedPriority = 'medium';

  const categories = [
    'Account & Login', 'Billing', 'Network & Infrastructure',
    'Software & Licenses', 'Email & Communication', 'Hardware',
    'Access & Permissions', 'Other'
  ];

  UI.renderPage(`
    <div class="page-enter" style="max-width:720px;margin:0 auto">
      <div class="back-btn" onclick="navigate('#tickets')">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        My Tickets
      </div>

      <div class="page-header" style="text-align:center;margin-bottom:32px">
        <h1 class="page-title" style="font-size:var(--text-3xl)">✍️ Create a New Ticket</h1>
        <p class="page-subtitle" style="font-size:var(--text-base);margin-top:8px">Tell us what problem you're facing and we'll get back to you shortly.</p>
      </div>

      <div class="card">
        <div class="card-body" style="padding:32px">
          <form id="create-ticket-form" onsubmit="submitTicket(event)" novalidate>

            <div class="form-group">
              <label class="form-label" for="ticket-subject">
                Subject <span>*</span>
              </label>
              <input
                type="text"
                id="ticket-subject"
                class="form-input"
                placeholder="e.g. Unable to login to my account"
                maxlength="120"
                autocomplete="off"
              >
              <div class="form-hint">Be specific and concise (max 120 chars)</div>
            </div>

            <div class="form-group">
              <label class="form-label" for="ticket-category">Category <span>*</span></label>
              <select id="ticket-category" class="form-select">
                <option value="">-- Select a category --</option>
                ${categories.map(c => `<option value="${c}">${DB.categoryIcon(c)} ${c}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Priority <span>*</span></label>
              <div class="priority-grid">
                ${['low','medium','high','urgent'].map(p => `
                  <div class="priority-card ${p} ${selectedPriority === p ? 'selected' : ''}" onclick="selectPriority('${p}')" id="priority-${p}">
                    <div class="priority-card-dot"></div>
                    <div class="priority-card-label">${DB.getPriorityLabel(p)}</div>
                  </div>
                `).join('')}
              </div>
              <input type="hidden" id="ticket-priority" value="${selectedPriority}">
            </div>

            <div class="form-group">
              <label class="form-label" for="ticket-desc">
                Description <span>*</span>
              </label>
              <textarea
                id="ticket-desc"
                class="form-textarea"
                placeholder="Describe your issue in detail. Include steps to reproduce, error messages, and any relevant information..."
                rows="6"
                maxlength="2000"
              ></textarea>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:5px">
                <div class="form-hint">The more detail you provide, the faster we can help.</div>
                <div style="font-size:11px;color:var(--text-light)" id="desc-count">0/2000</div>
              </div>
            </div>

            <div style="margin-top:32px;display:flex;gap:12px;justify-content:center">
              <button type="button" class="btn btn-secondary btn-lg" onclick="navigate('#tickets')">Cancel</button>
              <button type="submit" class="btn btn-primary btn-lg ripple" id="submit-ticket-btn" style="min-width:180px">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/></svg>
                Submit Ticket
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  `);

  // Char count
  document.getElementById('ticket-desc')?.addEventListener('input', e => {
    document.getElementById('desc-count').textContent = `${e.target.value.length}/2000`;
  });
}

function selectPriority(p) {
  selectedPriority = p;
  document.querySelectorAll('.priority-card').forEach(el => el.classList.remove('selected'));
  document.getElementById(`priority-${p}`)?.classList.add('selected');
  document.getElementById('ticket-priority').value = p;
}

function submitTicket(e) {
  e.preventDefault();
  const subject = document.getElementById('ticket-subject').value.trim();
  const category = document.getElementById('ticket-category').value;
  const description = document.getElementById('ticket-desc').value.trim();
  const priority = document.getElementById('ticket-priority').value || 'medium';

  let valid = true;

  // Validate
  ['ticket-subject','ticket-category','ticket-desc'].forEach(id => {
    const el = document.getElementById(id);
    el?.classList.remove('error');
  });

  if (!subject) { document.getElementById('ticket-subject').classList.add('error'); valid = false; }
  if (!category) { document.getElementById('ticket-category').classList.add('error'); valid = false; }
  if (!description || description.length < 10) { document.getElementById('ticket-desc').classList.add('error'); valid = false; }

  if (!valid) {
    document.getElementById('create-ticket-form').classList.add('shake');
    setTimeout(() => document.getElementById('create-ticket-form')?.classList.remove('shake'), 400);
    UI.showToast('error', 'Please fill all required fields', 'Subject, category and description are required.');
    return;
  }

  const btn = document.getElementById('submit-ticket-btn');
  btn.disabled = true;
  btn.innerHTML = `<span class="loading-dots"><span></span><span></span><span></span></span> Submitting...`;

  setTimeout(() => {
    const user = Auth.getCurrentUser();
    const ticket = DB.createTicket({ subject, description, category, priority }, user.id);
    showTicketSuccess(ticket.id);
  }, 800);
}

function showTicketSuccess(ticketId) {
  UI.renderPage(`
    <div class="page-enter" style="max-width:560px;margin:60px auto 0">
      <div class="success-screen">
        <div class="success-icon-wrap">✅</div>
        <h2 class="success-title">Ticket Submitted!</h2>
        <p class="success-desc">
          Your complaint has been successfully submitted. Our support team will review it and get back to you shortly.
        </p>
        <div class="success-ticket-id">${ticketId}</div>
        <p style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:24px">Keep this ID to track your complaint</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
          <button class="btn btn-secondary btn-lg" onclick="navigate('#tickets')">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/></svg>
            My Tickets
          </button>
          <button class="btn btn-primary btn-lg ripple" onclick="navigate('#ticket/${ticketId}')">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Track Ticket
          </button>
        </div>
      </div>
    </div>
  `);
  UI.showToast('success', 'Ticket Created!', `${ticketId} has been submitted successfully.`);
}

window.renderCreateTicket = renderCreateTicket;
window.selectPriority = selectPriority;
window.submitTicket = submitTicket;
window.showTicketSuccess = showTicketSuccess;
