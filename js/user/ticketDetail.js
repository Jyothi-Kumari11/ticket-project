// =====================================================
// ResolveDesk – Ticket Detail (User)
// =====================================================

function renderTicketDetail(ticketId) {
  const ticket = DB.getTicketById(ticketId);
  const user = Auth.getCurrentUser();

  if (!ticket || ticket.userId !== user.id) {
    UI.renderPage(`
      <div class="page-enter" style="text-align:center;padding:80px 20px">
        <div style="font-size:48px;margin-bottom:16px">🔍</div>
        <h2 style="font-size:var(--text-xl);font-weight:800;margin-bottom:8px">Ticket Not Found</h2>
        <p style="color:var(--text-muted);margin-bottom:24px">This ticket doesn't exist or you don't have access to it.</p>
        <button class="btn btn-primary" onclick="navigate('#tickets')">Back to My Tickets</button>
      </div>
    `);
    return;
  }

  // Add viewed event (only if admin hasn't already viewed this session)
  const timelineEvents = ticket.timeline.map(ev => ev.event);
  if (!timelineEvents.includes('user_viewed_after_reply') && ticket.messages.length > 0) {
    // Mark as seen
  }

  const statusColors = { open: '#f59e0b', in_progress: '#3b82f6', resolved: '#10b981', closed: '#6b7280' };
  const priorityColors = { low: '#22c55e', medium: '#f97316', high: '#ef4444', urgent: '#dc2626' };

  function timelineEventIcon(event) {
    const icons = {
      created: '🎫', viewed: '👁', status_changed: '🔄',
      reply: '💬', closed: '✅', resolved: '🎉', default: '📌'
    };
    return icons[event] || icons.default;
  }

  UI.renderPage(`
    <div class="page-enter">
      <div class="back-btn" onclick="navigate('#tickets')">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        My Tickets
      </div>

      <div class="page-header page-header-row" style="margin-bottom:24px">
        <div>
          <div style="font-size:var(--text-xs);font-weight:700;color:var(--primary);font-family:monospace;margin-bottom:6px">${ticket.id}</div>
          <h1 class="page-title" style="font-size:var(--text-xl)">${escapeHtml(ticket.subject)}</h1>
          <div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap">
            ${DB.priorityBadgeHTML(ticket.priority)}
            ${DB.statusBadgeHTML(ticket.status)}
            <span style="font-size:var(--text-xs);color:var(--text-muted);display:flex;align-items:center;gap:4px">
              🕐 ${DB.formatDateTime(ticket.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div class="ticket-detail-grid">
        <!-- Left: Description + Messages -->
        <div style="display:flex;flex-direction:column;gap:20px">

          <!-- Description -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">📄 Description</h3>
              <span style="font-size:var(--text-xs);color:var(--text-muted)">${DB.categoryIcon(ticket.category)} ${ticket.category}</span>
            </div>
            <div class="card-body">
              <p style="color:var(--text-secondary);font-size:var(--text-sm);line-height:1.8;white-space:pre-wrap">${escapeHtml(ticket.description)}</p>
            </div>
          </div>

          <!-- Conversation Thread -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">💬 Conversation</h3>
              <span style="font-size:var(--text-xs);color:var(--text-muted)">${ticket.messages.length} message${ticket.messages.length !== 1 ? 's' : ''}</span>
            </div>
            <div class="card-body">
              ${ticket.messages.length === 0 ? `
                <div style="text-align:center;padding:24px;color:var(--text-muted);font-size:var(--text-sm)">
                  No messages yet. The support team will respond here.
                </div>
              ` : `
                <div class="message-thread" id="message-thread">
                  ${ticket.messages.map(msg => `
                    <div class="message-bubble ${msg.senderRole}">
                      <div class="message-avatar ${msg.senderRole}-avatar">
                        ${msg.senderRole === 'admin' ? '🔑' : DB.getUserById(msg.senderId)?.initials || 'U'}
                      </div>
                      <div class="message-content">
                        <div class="message-sender">${msg.senderName} · ${msg.senderRole === 'admin' ? 'Support Team' : 'You'}</div>
                        <div class="message-text">${escapeHtml(msg.content)}</div>
                        <div class="message-time">${DB.formatDateTime(msg.timestamp)}</div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}

              ${ticket.status !== 'closed' ? `
                <div class="reply-area">
                  <label style="font-size:var(--text-sm);font-weight:600;color:var(--text-secondary);display:block;margin-bottom:8px">Add a reply</label>
                  <textarea class="reply-input" id="reply-input" placeholder="Write your reply here..." rows="3"></textarea>
                  <div class="reply-actions">
                    <button class="btn btn-secondary btn-sm" onclick="document.getElementById('reply-input').value=''">Clear</button>
                    <button class="btn btn-primary btn-sm ripple" onclick="sendUserReply('${ticket.id}')">
                      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/></svg>
                      Send Reply
                    </button>
                  </div>
                </div>
              ` : `
                <div style="text-align:center;padding:16px;background:var(--status-closed-bg);border-radius:var(--radius-md);margin-top:16px">
                  <span style="font-size:var(--text-sm);color:var(--status-closed);font-weight:600">🔒 This ticket is closed.</span>
                </div>
              `}
            </div>
          </div>
        </div>

        <!-- Right: Meta + Timeline -->
        <div style="display:flex;flex-direction:column;gap:18px">

          <!-- Ticket Info -->
          <div class="ticket-meta-card">
            <div class="ticket-meta-header">Ticket Info</div>
            <div class="ticket-meta-item">
              <span class="ticket-meta-label">Status</span>
              <span>${DB.statusBadgeHTML(ticket.status)}</span>
            </div>
            <div class="ticket-meta-item">
              <span class="ticket-meta-label">Priority</span>
              <span>${DB.priorityBadgeHTML(ticket.priority)}</span>
            </div>
            <div class="ticket-meta-item">
              <span class="ticket-meta-label">Category</span>
              <span class="ticket-meta-value" style="font-size:var(--text-xs)">${DB.categoryIcon(ticket.category)} ${ticket.category}</span>
            </div>
            <div class="ticket-meta-item">
              <span class="ticket-meta-label">Submitted</span>
              <span class="ticket-meta-value" style="font-size:var(--text-xs)">${DB.formatDateTime(ticket.createdAt)}</span>
            </div>
            <div class="ticket-meta-item">
              <span class="ticket-meta-label">Last Update</span>
              <span class="ticket-meta-value" style="font-size:var(--text-xs)">${DB.formatDateTime(ticket.updatedAt)}</span>
            </div>
          </div>

          <!-- Timeline -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">📋 Timeline</h3>
            </div>
            <div class="card-body">
              <div class="timeline">
                ${ticket.timeline.map((ev, i) => `
                  <div class="timeline-item">
                    <div class="timeline-left">
                      <div class="timeline-dot ${ev.event === 'pending' ? 'pending' : ''}"></div>
                      ${i < ticket.timeline.length - 1 ? '<div class="timeline-line"></div>' : ''}
                    </div>
                    <div class="timeline-content">
                      <div class="timeline-event">${timelineEventIcon(ev.event)} ${ev.message}</div>
                      <div class="timeline-time">${DB.formatDateTime(ev.timestamp)}</div>
                    </div>
                  </div>
                `).join('')}
                ${ticket.status !== 'closed' && ticket.status !== 'resolved' ? `
                  <div class="timeline-item">
                    <div class="timeline-left">
                      <div class="timeline-dot pending"></div>
                    </div>
                    <div class="timeline-content">
                      <div class="timeline-event pending">⏳ Ticket Resolution</div>
                      <div class="timeline-time">Pending</div>
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
}

function sendUserReply(ticketId) {
  const input = document.getElementById('reply-input');
  const content = input?.value?.trim();
  if (!content) {
    UI.showToast('warning', 'Empty message', 'Please write something before sending.');
    return;
  }
  const user = Auth.getCurrentUser();
  DB.addTicketMessage(ticketId, user.id, content);
  UI.showToast('success', 'Reply sent!', 'Your message has been submitted.');
  renderTicketDetail(ticketId);
}

window.renderTicketDetail = renderTicketDetail;
window.sendUserReply = sendUserReply;
