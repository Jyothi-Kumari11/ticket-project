// =====================================================
// ResolveDesk – Admin Ticket Detail
// =====================================================

function renderAdminTicketDetail(ticketId) {
  const ticket = DB.getTicketById(ticketId);
  if (!ticket) {
    UI.renderPage(`
      <div class="page-enter" style="text-align:center;padding:80px 20px">
        <h2 style="font-size:var(--text-xl);margin-bottom:8px">Ticket Not Found</h2>
        <button class="btn btn-primary" onclick="navigate('#admin/tickets')">Back to Tickets</button>
      </div>
    `);
    return;
  }

  const user = DB.getUserById(ticket.userId);

  UI.setActiveNav('#admin/tickets');

  UI.renderPage(`
    <div class="page-enter">
      <div class="back-btn" onclick="navigate('#admin/tickets')">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        All Tickets
      </div>

      <div class="page-header page-header-row" style="margin-bottom:24px">
        <div>
          <div style="font-size:var(--text-xs);font-weight:700;color:var(--primary);font-family:monospace;margin-bottom:6px">${ticket.id}</div>
          <h1 class="page-title" style="font-size:var(--text-xl)">${escapeHtml(ticket.subject)}</h1>
        </div>
        <div style="display:flex;gap:10px">
          ${ticket.status !== 'closed' ? `
            <button class="btn btn-secondary" onclick="quickCloseTicket('${ticket.id}')">Close Ticket</button>
          ` : ''}
        </div>
      </div>

      <div class="ticket-detail-grid">
        <!-- Left Column -->
        <div style="display:flex;flex-direction:column;gap:20px">
          <!-- Description -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">📄 Description</h3>
            </div>
            <div class="card-body">
              <p style="color:var(--text-secondary);font-size:var(--text-sm);line-height:1.8;white-space:pre-wrap">${escapeHtml(ticket.description)}</p>
            </div>
          </div>

          <!-- Conversation -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">💬 Conversation</h3>
            </div>
            <div class="card-body">
              <div class="message-thread">
                ${ticket.messages.map(msg => `
                  <div class="message-bubble ${msg.senderRole}">
                    <div class="message-avatar ${msg.senderRole}-avatar">
                      ${msg.senderRole === 'admin' ? '🔑' : user?.initials || 'U'}
                    </div>
                    <div class="message-content">
                      <div class="message-sender">${msg.senderName}</div>
                      <div class="message-text">${escapeHtml(msg.content)}</div>
                      <div class="message-time">${DB.formatDateTime(msg.timestamp)}</div>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div class="reply-area">
                <label style="font-size:var(--text-sm);font-weight:600;margin-bottom:8px;display:block">Send Reply</label>
                <textarea id="admin-reply-input" class="reply-input" placeholder="Type your reply here..." rows="3"></textarea>
                <div class="reply-actions">
                  <button class="btn btn-primary" onclick="sendAdminReply('${ticket.id}')">Send Reply</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div style="display:flex;flex-direction:column;gap:18px">
          <!-- Status Update -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">🔄 Update Status</h3>
            </div>
            <div class="card-body">
              <select id="admin-status-select" class="form-select admin-status-form" style="margin-bottom:12px">
                <option value="open" ${ticket.status === 'open' ? 'selected' : ''}>🟡 Open</option>
                <option value="in_progress" ${ticket.status === 'in_progress' ? 'selected' : ''}>🔵 In Progress</option>
                <option value="resolved" ${ticket.status === 'resolved' ? 'selected' : ''}>🟢 Resolved</option>
                <option value="closed" ${ticket.status === 'closed' ? 'selected' : ''}>⚫ Closed</option>
              </select>
              <button class="btn btn-secondary btn-full" onclick="updateAdminTicketStatus('${ticket.id}')">Update Status</button>
            </div>
          </div>

          <!-- Ticket Info -->
          <div class="ticket-meta-card">
            <div class="ticket-meta-header">Ticket Info</div>
            <div class="ticket-meta-item">
              <span class="ticket-meta-label">User</span>
              <span class="ticket-meta-value">${escapeHtml(user?.name || 'Unknown')}</span>
            </div>
            <div class="ticket-meta-item">
              <span class="ticket-meta-label">Priority</span>
              <span>${DB.priorityBadgeHTML(ticket.priority)}</span>
            </div>
            <div class="ticket-meta-item">
              <span class="ticket-meta-label">Category</span>
              <span class="ticket-meta-value">${ticket.category}</span>
            </div>
          </div>

          <!-- Internal Notes -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">🔒 Internal Notes</h3>
            </div>
            <div class="card-body">
              <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px">
                ${(ticket.adminNotes || []).map(note => `
                  <div style="padding:10px;background:#fef3c7;border-left:3px solid #f59e0b;font-size:var(--text-sm)">
                    ${escapeHtml(note)}
                  </div>
                `).join('')}
              </div>
              <textarea id="admin-note-input" class="form-textarea" placeholder="Add internal note..." rows="2"></textarea>
              <button class="btn btn-secondary btn-full" style="margin-top:10px" onclick="saveAdminNote('${ticket.id}')">Add Note</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
}

function sendAdminReply(ticketId) {
  const input = document.getElementById('admin-reply-input');
  const content = input.value.trim();
  if (!content) return;
  const admin = Auth.getCurrentUser();
  DB.addTicketMessage(ticketId, admin.id, content);
  UI.showToast('success', 'Reply sent');
  renderAdminTicketDetail(ticketId);
}

function updateAdminTicketStatus(ticketId) {
  const status = document.getElementById('admin-status-select').value;
  const admin = Auth.getCurrentUser();
  DB.updateTicketStatus(ticketId, status, admin.id);
  UI.showToast('success', 'Status updated');
  renderAdminTicketDetail(ticketId);
}

function saveAdminNote(ticketId) {
  const input = document.getElementById('admin-note-input');
  const note = input.value.trim();
  if (!note) return;
  DB.addAdminNote(ticketId, note);
  UI.showToast('success', 'Note added');
  renderAdminTicketDetail(ticketId);
}

window.renderAdminTicketDetail = renderAdminTicketDetail;
window.sendAdminReply = sendAdminReply;
window.updateAdminTicketStatus = updateAdminTicketStatus;
window.saveAdminNote = saveAdminNote;
