// =====================================================
// ResolveDesk – Data Layer (localStorage)
// =====================================================

const DB_KEY = 'resolvedesk_db';

// ── Default seed data ──
const SEED_DATA = {
  users: [
    {
      id: 'usr_admin',
      name: 'Admin User',
      email: 'admin@resolvedesk.com',
      password: 'admin123',
      role: 'admin',
      initials: 'AU',
      avatarColor: '#6366f1',
      phone: '+91 9876543210',
      department: 'IT Support',
      createdAt: '2024-01-01T08:00:00.000Z'
    },
    {
      id: 'usr_001',
      name: 'Jyothi Kumari',
      email: 'jyothi@example.com',
      password: 'user123',
      role: 'user',
      initials: 'JK',
      avatarColor: '#06b6d4',
      phone: '+91 9123456789',
      department: 'Finance',
      createdAt: '2024-01-10T09:00:00.000Z'
    },
    {
      id: 'usr_002',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: 'user123',
      role: 'user',
      initials: 'RS',
      avatarColor: '#10b981',
      phone: '+91 9988776655',
      department: 'Operations',
      createdAt: '2024-01-12T10:00:00.000Z'
    },
    {
      id: 'usr_003',
      name: 'Priya Patel',
      email: 'priya@example.com',
      password: 'user123',
      role: 'user',
      initials: 'PP',
      avatarColor: '#f97316',
      phone: '+91 9765432100',
      department: 'Marketing',
      createdAt: '2024-01-14T11:00:00.000Z'
    }
  ],
  tickets: [
    {
      id: 'TKT-1001',
      ticketNum: 1001,
      userId: 'usr_001',
      subject: 'Unable to login to my account',
      description: 'I am unable to login to my account since this morning. I get an error saying "Invalid credentials" even though I am entering the correct password. I have tried resetting my password but the reset email is not arriving.',
      category: 'Account & Login',
      priority: 'high',
      status: 'in_progress',
      createdAt: '2026-09-14T10:20:00.000Z',
      updatedAt: '2026-09-14T10:40:00.000Z',
      timeline: [
        { event: 'created', message: 'Ticket created by Jyothi Kumari', timestamp: '2026-09-14T10:20:00.000Z' },
        { event: 'viewed', message: 'Viewed by Admin', timestamp: '2026-09-14T10:35:00.000Z' },
        { event: 'status_changed', message: 'Status changed to In Progress', timestamp: '2026-09-14T10:40:00.000Z' }
      ],
      messages: [
        {
          id: 'msg_001',
          senderId: 'usr_admin',
          senderName: 'Admin User',
          senderRole: 'admin',
          content: 'Hello Jyothi, we are looking into your login issue. Our team has identified a potential issue with the authentication service. We will have this resolved shortly.',
          timestamp: '2026-09-14T11:00:00.000Z'
        }
      ],
      adminNotes: ['Check if 2FA is enabled. User may need to use backup code.']
    },
    {
      id: 'TKT-1002',
      ticketNum: 1002,
      userId: 'usr_001',
      subject: 'Payment not reflected in account',
      description: 'I made a payment of ₹5,000 yesterday for my subscription renewal but it has not been reflected in my account. The payment was deducted from my bank account successfully.',
      category: 'Billing',
      priority: 'urgent',
      status: 'open',
      createdAt: '2026-09-15T09:15:00.000Z',
      updatedAt: '2026-09-15T09:15:00.000Z',
      timeline: [
        { event: 'created', message: 'Ticket created by Jyothi Kumari', timestamp: '2026-09-15T09:15:00.000Z' }
      ],
      messages: [],
      adminNotes: []
    },
    {
      id: 'TKT-1003',
      ticketNum: 1003,
      userId: 'usr_002',
      subject: 'Network connectivity issues in office',
      description: 'Our entire floor (3rd floor) has been experiencing intermittent network connectivity issues since Monday. This is affecting productivity significantly.',
      category: 'Network & Infrastructure',
      priority: 'high',
      status: 'resolved',
      createdAt: '2026-09-10T08:30:00.000Z',
      updatedAt: '2026-09-13T16:45:00.000Z',
      timeline: [
        { event: 'created', message: 'Ticket created by Rahul Sharma', timestamp: '2026-09-10T08:30:00.000Z' },
        { event: 'viewed', message: 'Viewed by Admin', timestamp: '2026-09-10T09:00:00.000Z' },
        { event: 'status_changed', message: 'Status changed to In Progress', timestamp: '2026-09-10T09:30:00.000Z' },
        { event: 'status_changed', message: 'Status changed to Resolved', timestamp: '2026-09-13T16:45:00.000Z' }
      ],
      messages: [
        {
          id: 'msg_002',
          senderId: 'usr_admin',
          senderName: 'Admin User',
          senderRole: 'admin',
          content: 'Our network team has investigated the issue. A faulty switch was replaced on the 3rd floor. The connectivity should now be stable. Please confirm.',
          timestamp: '2026-09-13T16:40:00.000Z'
        },
        {
          id: 'msg_003',
          senderId: 'usr_002',
          senderName: 'Rahul Sharma',
          senderRole: 'user',
          content: 'Yes, the network is working perfectly now. Thank you for the quick resolution!',
          timestamp: '2026-09-13T17:10:00.000Z'
        }
      ],
      adminNotes: ['Replaced faulty Cisco switch on floor 3, rack B.']
    },
    {
      id: 'TKT-1004',
      ticketNum: 1004,
      userId: 'usr_002',
      subject: 'Software license expired',
      description: 'The license for our design software (Adobe Creative Suite) has expired. Our marketing team is unable to work without it. We need urgent renewal.',
      category: 'Software & Licenses',
      priority: 'medium',
      status: 'closed',
      createdAt: '2026-09-05T11:00:00.000Z',
      updatedAt: '2026-09-07T14:00:00.000Z',
      timeline: [
        { event: 'created', message: 'Ticket created by Rahul Sharma', timestamp: '2026-09-05T11:00:00.000Z' },
        { event: 'viewed', message: 'Viewed by Admin', timestamp: '2026-09-05T11:30:00.000Z' },
        { event: 'status_changed', message: 'Status changed to In Progress', timestamp: '2026-09-05T12:00:00.000Z' },
        { event: 'status_changed', message: 'Status changed to Resolved', timestamp: '2026-09-07T13:00:00.000Z' },
        { event: 'closed', message: 'Ticket closed', timestamp: '2026-09-07T14:00:00.000Z' }
      ],
      messages: [
        {
          id: 'msg_004',
          senderId: 'usr_admin',
          senderName: 'Admin User',
          senderRole: 'admin',
          content: 'License has been renewed for 12 months. All users should now have access. Please clear browser cache if the software does not recognize the new license.',
          timestamp: '2026-09-07T13:00:00.000Z'
        }
      ],
      adminNotes: ['Renewed Adobe CC Teams plan. Invoice #INV-2024-0907.']
    },
    {
      id: 'TKT-1005',
      ticketNum: 1005,
      userId: 'usr_003',
      subject: 'Email not syncing on mobile device',
      description: 'My official email is not syncing on my mobile device (iPhone 15 Pro). I configured it with the settings provided by IT but it keeps showing "Connection Error".',
      category: 'Email & Communication',
      priority: 'low',
      status: 'open',
      createdAt: '2026-09-15T14:30:00.000Z',
      updatedAt: '2026-09-15T14:30:00.000Z',
      timeline: [
        { event: 'created', message: 'Ticket created by Priya Patel', timestamp: '2026-09-15T14:30:00.000Z' }
      ],
      messages: [],
      adminNotes: []
    },
    {
      id: 'TKT-1006',
      ticketNum: 1006,
      userId: 'usr_003',
      subject: 'Request for new laptop setup',
      description: 'I have received a new laptop (Dell XPS 15) and need IT to set it up with all the required software, VPN, and access credentials.',
      category: 'Hardware',
      priority: 'medium',
      status: 'in_progress',
      createdAt: '2026-09-13T10:00:00.000Z',
      updatedAt: '2026-09-14T09:00:00.000Z',
      timeline: [
        { event: 'created', message: 'Ticket created by Priya Patel', timestamp: '2026-09-13T10:00:00.000Z' },
        { event: 'viewed', message: 'Viewed by Admin', timestamp: '2026-09-13T10:30:00.000Z' },
        { event: 'status_changed', message: 'Status changed to In Progress', timestamp: '2026-09-14T09:00:00.000Z' }
      ],
      messages: [
        {
          id: 'msg_005',
          senderId: 'usr_admin',
          senderName: 'Admin User',
          senderRole: 'admin',
          content: 'We have received your laptop setup request. A technician will visit your desk tomorrow (Sept 15) between 10 AM - 12 PM. Please ensure you are available.',
          timestamp: '2026-09-14T09:00:00.000Z'
        }
      ],
      adminNotes: ['Schedule with tech team. Needs: Office 365, VPN client, Slack, Adobe.']
    },
    {
      id: 'TKT-1007',
      ticketNum: 1007,
      userId: 'usr_001',
      subject: 'Cannot access project management tool',
      description: 'I am getting a "403 Forbidden" error when trying to access Jira. My account was working fine last week. I believe my permissions may have been revoked accidentally.',
      category: 'Access & Permissions',
      priority: 'high',
      status: 'resolved',
      createdAt: '2026-09-08T09:45:00.000Z',
      updatedAt: '2026-09-09T11:30:00.000Z',
      timeline: [
        { event: 'created', message: 'Ticket created by Jyothi Kumari', timestamp: '2026-09-08T09:45:00.000Z' },
        { event: 'viewed', message: 'Viewed by Admin', timestamp: '2026-09-08T10:00:00.000Z' },
        { event: 'status_changed', message: 'Status changed to In Progress', timestamp: '2026-09-08T10:15:00.000Z' },
        { event: 'status_changed', message: 'Status changed to Resolved', timestamp: '2026-09-09T11:30:00.000Z' }
      ],
      messages: [
        {
          id: 'msg_006',
          senderId: 'usr_admin',
          senderName: 'Admin User',
          senderRole: 'admin',
          content: 'Your Jira access has been restored. It appears your account was incorrectly removed during a group permission update. You should have full access now.',
          timestamp: '2026-09-09T11:30:00.000Z'
        }
      ],
      adminNotes: ['Accidentally removed from Jira project group. Re-added to Finance-Team group.']
    },
    {
      id: 'TKT-1008',
      ticketNum: 1008,
      userId: 'usr_002',
      subject: 'Slow internet speed affecting video calls',
      description: 'The internet speed has been very slow this week, causing frequent disconnections during video conference calls. This is happening to multiple team members.',
      category: 'Network & Infrastructure',
      priority: 'medium',
      status: 'in_progress',
      createdAt: '2026-09-15T11:00:00.000Z',
      updatedAt: '2026-09-15T13:00:00.000Z',
      timeline: [
        { event: 'created', message: 'Ticket created by Rahul Sharma', timestamp: '2026-09-15T11:00:00.000Z' },
        { event: 'viewed', message: 'Viewed by Admin', timestamp: '2026-09-15T11:30:00.000Z' },
        { event: 'status_changed', message: 'Status changed to In Progress', timestamp: '2026-09-15T13:00:00.000Z' }
      ],
      messages: [
        {
          id: 'msg_007',
          senderId: 'usr_admin',
          senderName: 'Admin User',
          senderRole: 'admin',
          content: 'We are aware of this issue and our network team is currently investigating. It appears to be an ISP-side issue. Expected resolution: within 4 hours.',
          timestamp: '2026-09-15T13:00:00.000Z'
        }
      ],
      adminNotes: ['ISP escalation raised. Ticket #ISP-44821.']
    }
  ],
  notifications: [],
  settings: {
    appName: 'ResolveDesk',
    allowRegistration: true,
    defaultPriority: 'medium',
    autoCloseResolved: false,
    emailNotifications: true
  },
  nextTicketNum: 1009
};

// ── DB Helpers ──

function getDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function initDB() {
  if (!getDB()) {
    saveDB(SEED_DATA);
  }
}

// ── Users ──

function getUsers() { return getDB().users || []; }

function getUserById(id) { return getUsers().find(u => u.id === id) || null; }

function getUserByEmail(email) { return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null; }

function createUser(data) {
  const db = getDB();
  const id = 'usr_' + Date.now();
  const initials = data.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['#6366f1','#06b6d4','#10b981','#f97316','#8b5cf6','#ec4899','#14b8a6'];
  const avatarColor = colors[Math.floor(Math.random() * colors.length)];
  const user = {
    id,
    name: data.name,
    email: data.email,
    password: data.password,
    role: 'user',
    initials,
    avatarColor,
    phone: data.phone || '',
    department: data.department || '',
    createdAt: new Date().toISOString()
  };
  db.users.push(user);
  saveDB(db);
  return user;
}

function updateUser(id, changes) {
  const db = getDB();
  const idx = db.users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  db.users[idx] = { ...db.users[idx], ...changes };
  saveDB(db);
  return db.users[idx];
}

// ── Tickets ──

function getTickets() { return getDB().tickets || []; }

function getTicketById(id) { return getTickets().find(t => t.id === id) || null; }

function getTicketsByUser(userId) { return getTickets().filter(t => t.userId === userId); }

function createTicket(data, userId) {
  const db = getDB();
  const num = db.nextTicketNum;
  db.nextTicketNum++;
  const ticket = {
    id: 'TKT-' + num,
    ticketNum: num,
    userId,
    subject: data.subject,
    description: data.description,
    category: data.category,
    priority: data.priority,
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      {
        event: 'created',
        message: 'Ticket created by ' + getUserById(userId)?.name,
        timestamp: new Date().toISOString()
      }
    ],
    messages: [],
    adminNotes: []
  };
  db.tickets.push(ticket);
  // Add notification for admin
  db.notifications.push({
    id: 'notif_' + Date.now(),
    userId: 'usr_admin',
    title: 'New ticket submitted',
    message: `${ticket.id}: ${ticket.subject}`,
    type: 'new_ticket',
    ticketId: ticket.id,
    read: false,
    timestamp: new Date().toISOString()
  });
  saveDB(db);
  return ticket;
}

function updateTicket(id, changes) {
  const db = getDB();
  const idx = db.tickets.findIndex(t => t.id === id);
  if (idx === -1) return null;
  db.tickets[idx] = { ...db.tickets[idx], ...changes, updatedAt: new Date().toISOString() };
  saveDB(db);
  return db.tickets[idx];
}

function addTicketTimelineEvent(ticketId, event, message) {
  const db = getDB();
  const idx = db.tickets.findIndex(t => t.id === ticketId);
  if (idx === -1) return;
  db.tickets[idx].timeline.push({ event, message, timestamp: new Date().toISOString() });
  db.tickets[idx].updatedAt = new Date().toISOString();
  saveDB(db);
}

function addTicketMessage(ticketId, senderId, content) {
  const db = getDB();
  const idx = db.tickets.findIndex(t => t.id === ticketId);
  if (idx === -1) return null;
  const sender = getUserById(senderId);
  const msg = {
    id: 'msg_' + Date.now(),
    senderId,
    senderName: sender?.name || 'Unknown',
    senderRole: sender?.role || 'user',
    content,
    timestamp: new Date().toISOString()
  };
  db.tickets[idx].messages.push(msg);
  db.tickets[idx].updatedAt = new Date().toISOString();
  // Add timeline event
  db.tickets[idx].timeline.push({
    event: 'reply',
    message: `Reply from ${sender?.name}`,
    timestamp: new Date().toISOString()
  });

  // Add notification for other party
  const ticket = db.tickets[idx];
  const notifUserId = sender?.role === 'admin' ? ticket.userId : 'usr_admin';
  db.notifications.push({
    id: 'notif_' + Date.now(),
    userId: notifUserId,
    title: sender?.role === 'admin' ? 'Admin replied to your ticket' : 'User replied to ticket',
    message: `${ticket.id}: ${content.slice(0, 60)}...`,
    type: 'reply',
    ticketId: ticket.id,
    read: false,
    timestamp: new Date().toISOString()
  });
  saveDB(db);
  return msg;
}

function updateTicketStatus(ticketId, newStatus, adminId) {
  const db = getDB();
  const idx = db.tickets.findIndex(t => t.id === ticketId);
  if (idx === -1) return null;
  const oldStatus = db.tickets[idx].status;
  db.tickets[idx].status = newStatus;
  db.tickets[idx].updatedAt = new Date().toISOString();
  const statusLabels = { open: 'Open', in_progress: 'In Progress', resolved: 'Resolved', closed: 'Closed' };
  db.tickets[idx].timeline.push({
    event: 'status_changed',
    message: `Status changed to ${statusLabels[newStatus]}`,
    timestamp: new Date().toISOString()
  });
  if (newStatus === 'closed') {
    db.tickets[idx].timeline.push({
      event: 'closed',
      message: 'Ticket closed by Admin',
      timestamp: new Date().toISOString()
    });
  }
  // Notify user
  const ticket = db.tickets[idx];
  db.notifications.push({
    id: 'notif_' + Date.now(),
    userId: ticket.userId,
    title: 'Ticket status updated',
    message: `${ticket.id} status changed to ${statusLabels[newStatus]}`,
    type: 'status_change',
    ticketId: ticket.id,
    read: false,
    timestamp: new Date().toISOString()
  });
  saveDB(db);
  return db.tickets[idx];
}

function addAdminNote(ticketId, note) {
  const db = getDB();
  const idx = db.tickets.findIndex(t => t.id === ticketId);
  if (idx === -1) return;
  if (!db.tickets[idx].adminNotes) db.tickets[idx].adminNotes = [];
  db.tickets[idx].adminNotes.push(note);
  saveDB(db);
}

// ── Notifications ──

function getNotifications(userId) {
  return (getDB().notifications || []).filter(n => n.userId === userId).reverse();
}

function getUnreadCount(userId) {
  return getNotifications(userId).filter(n => !n.read).length;
}

function markNotificationsRead(userId) {
  const db = getDB();
  db.notifications.forEach(n => { if (n.userId === userId) n.read = true; });
  saveDB(db);
}

// ── Stats ──

function getTicketStats() {
  const tickets = getTickets();
  return {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length,
    high: tickets.filter(t => t.priority === 'high' || t.priority === 'urgent').length
  };
}

function getUserTicketStats(userId) {
  const tickets = getTicketsByUser(userId);
  return {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length
  };
}

// ── Settings ──
function getSettings() { return getDB().settings || {}; }
function updateSettings(changes) {
  const db = getDB();
  db.settings = { ...db.settings, ...changes };
  saveDB(db);
}

// ── Utilities ──

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ', ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function formatDateShort(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function getStatusLabel(status) {
  const map = { open: 'Open', in_progress: 'In Progress', resolved: 'Resolved', closed: 'Closed' };
  return map[status] || status;
}

function getPriorityLabel(priority) {
  const map = { low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' };
  return map[priority] || priority;
}

function statusBadgeHTML(status) {
  const cls = status === 'in_progress' ? 'badge-progress' : `badge-${status}`;
  return `<span class="badge ${cls}"><span class="badge-dot"></span>${getStatusLabel(status)}</span>`;
}

function priorityBadgeHTML(priority) {
  return `<span class="badge badge-${priority}">${getPriorityLabel(priority)}</span>`;
}

function categoryIcon(cat) {
  const icons = {
    'Account & Login': '🔐',
    'Billing': '💳',
    'Network & Infrastructure': '🌐',
    'Software & Licenses': '💻',
    'Email & Communication': '📧',
    'Hardware': '🖥️',
    'Access & Permissions': '🔑',
    'Other': '📋'
  };
  return icons[cat] || '📋';
}

window.DB = {
  init: initDB,
  getUsers, getUserById, getUserByEmail, createUser, updateUser,
  getTickets, getTicketById, getTicketsByUser, createTicket, updateTicket,
  addTicketTimelineEvent, addTicketMessage, updateTicketStatus, addAdminNote,
  getNotifications, getUnreadCount, markNotificationsRead,
  getTicketStats, getUserTicketStats,
  getSettings, updateSettings,
  formatDate, formatDateTime, formatDateShort,
  getStatusLabel, getPriorityLabel, statusBadgeHTML, priorityBadgeHTML, categoryIcon
};
