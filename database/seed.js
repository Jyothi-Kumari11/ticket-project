import 'dotenv/config';
import bcrypt from 'bcrypt';
import { getMongoDb, closeMongoDB } from './mongodb.js';

export async function seedDatabase() {
  const db = await getMongoDb();

  // Check if already seeded
  const userCount = await db.collection('users').countDocuments();
  if (userCount > 0) {
    console.log('Database already contains data. Skipping seed.');
    return;
  }

  console.log('🌱 Seeding database with initial data...');

  const salt = await bcrypt.genSalt(10);
  const hashedUserPassword = await bcrypt.hash('password123', salt);
  const hashedAdminPassword = await bcrypt.hash('adminpassword', salt);

  const now = new Date().toISOString();

  // 1. Seed Users
  const users = [
    { id: 'USR-9021', name: 'Alex Johnson', email: 'alex.johnson@example.com', password: hashedUserPassword, phone: '+1 (555) 234-5678', role: 'user', department: 'Enterprise Customer', created_at: '2026-01-10T08:00:00Z', updated_at: '2026-01-10T08:00:00Z' },
    { id: 'USR-8812', name: 'Sarah Connor', email: 'sarah.c@example.com', password: hashedUserPassword, phone: '+1 (555) 987-6543', role: 'user', department: 'Operations', created_at: '2026-02-15T09:30:00Z', updated_at: '2026-02-15T09:30:00Z' },
    { id: 'USR-4420', name: 'David Miller', email: 'd.miller@example.com', password: hashedUserPassword, phone: '+1 (555) 444-2222', role: 'user', department: 'Marketing', created_at: '2026-03-01T11:00:00Z', updated_at: '2026-03-01T11:00:00Z' },
    { id: 'ADM-0001', name: 'Support Admin', email: 'admin@resolvedesk.com', password: hashedAdminPassword, phone: '+1 (555) 000-1111', role: 'admin', department: 'Tier-2 Support', created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' }
  ];
  await db.collection('users').insertMany(users);

  // 2. Seed Tickets
  const tickets = [
    {
      ticket_id: 'TKT-2026-0018', user_id: 'USR-9021', user_name: 'Alex Johnson',
      user_email: 'alex.johnson@example.com', user_phone: '+1 (555) 234-5678',
      subject: 'Unable to login to my account',
      description: 'Every time I enter my credentials, I receive an authorization code error (ERR_AUTH_502).',
      category: 'Account & Login', priority: 'High', status: 'In Progress',
      assigned_to: 'Support Team',
      attachments: [{ name: 'error_screenshot.png', size: '1.2 MB', url: '#' }],
      timeline: [
        { step: 'Submitted', date: '16 Sep • 10:20 AM', completed: true },
        { step: 'Admin Viewed', date: '16 Sep • 10:35 AM', completed: true },
        { step: 'In Progress', date: '16 Sep • 10:42 AM', completed: true },
        { step: 'Resolved', date: 'Pending', completed: false },
        { step: 'Closed', date: 'Pending', completed: false }
      ],
      created_at: '2026-09-16T10:20:00Z', updated_at: '2026-09-16T10:42:00Z',
      resolved_at: null, closed_at: null
    },
    {
      ticket_id: 'TKT-2026-0017', user_id: 'USR-9021', user_name: 'Alex Johnson',
      user_email: 'alex.johnson@example.com', user_phone: '+1 (555) 234-5678',
      subject: 'Payment failed but amount deducted',
      description: 'The transaction failed on the checkout screen, but my bank statement shows $49 deducted.',
      category: 'Payment & Billing', priority: 'Critical', status: 'Resolved',
      assigned_to: 'Finance Ops', attachments: [],
      timeline: [
        { step: 'Submitted', date: '15 Sep • 02:15 PM', completed: true },
        { step: 'Admin Viewed', date: '15 Sep • 02:30 PM', completed: true },
        { step: 'In Progress', date: '15 Sep • 03:00 PM', completed: true },
        { step: 'Resolved', date: '15 Sep • 04:30 PM', completed: true },
        { step: 'Closed', date: 'Pending', completed: false }
      ],
      created_at: '2026-09-15T14:15:00Z', updated_at: '2026-09-15T16:30:00Z',
      resolved_at: '2026-09-15T16:30:00Z', closed_at: null
    },
    {
      ticket_id: 'TKT-2026-0016', user_id: 'USR-8812', user_name: 'Sarah Connor',
      user_email: 'sarah.c@example.com', user_phone: '+1 (555) 987-6543',
      subject: 'API Gateway latency spike in EU region',
      description: 'Our integration endpoint experienced high latency exceeding 4000ms over the past 2 hours.',
      category: 'Technical Issue', priority: 'High', status: 'Open',
      assigned_to: 'Unassigned', attachments: [],
      timeline: [
        { step: 'Submitted', date: '16 Sep • 08:00 AM', completed: true },
        { step: 'Admin Viewed', date: 'Pending', completed: false },
        { step: 'In Progress', date: 'Pending', completed: false },
        { step: 'Resolved', date: 'Pending', completed: false },
        { step: 'Closed', date: 'Pending', completed: false }
      ],
      created_at: '2026-09-16T08:00:00Z', updated_at: '2026-09-16T08:00:00Z',
      resolved_at: null, closed_at: null
    },
    {
      ticket_id: 'TKT-2026-0015', user_id: 'USR-4420', user_name: 'David Miller',
      user_email: 'd.miller@example.com', user_phone: '+1 (555) 444-2222',
      subject: 'Request for custom SSL certificate installation',
      description: 'We need to install our wildcard SSL certificate for the dedicated subdomain enterprise instance.',
      category: 'Service Issue', priority: 'Medium', status: 'Waiting for User',
      assigned_to: 'DevOps Team', attachments: [],
      timeline: [
        { step: 'Submitted', date: '14 Sep • 09:30 AM', completed: true },
        { step: 'Admin Viewed', date: '14 Sep • 10:00 AM', completed: true },
        { step: 'In Progress', date: '14 Sep • 10:30 AM', completed: true },
        { step: 'Waiting for User', date: '14 Sep • 11:00 AM', completed: true }
      ],
      created_at: '2026-09-14T09:30:00Z', updated_at: '2026-09-14T11:00:00Z',
      resolved_at: null, closed_at: null
    },
    {
      ticket_id: 'TKT-2026-0014', user_id: 'USR-9021', user_name: 'Alex Johnson',
      user_email: 'alex.johnson@example.com', user_phone: '+1 (555) 234-5678',
      subject: 'Dashboard reports loading slowly',
      description: 'When switching between custom analytics date ranges, charts take over 10 seconds to respond.',
      category: 'Technical Issue', priority: 'Low', status: 'Closed',
      assigned_to: 'Frontend Tech', attachments: [],
      timeline: [
        { step: 'Submitted', date: '10 Sep • 11:00 AM', completed: true },
        { step: 'Resolved', date: '11 Sep • 04:00 PM', completed: true },
        { step: 'Closed', date: '12 Sep • 09:00 AM', completed: true }
      ],
      created_at: '2026-09-10T11:00:00Z', updated_at: '2026-09-12T09:00:00Z',
      resolved_at: '2026-09-11T16:00:00Z', closed_at: '2026-09-12T09:00:00Z'
    }
  ];
  await db.collection('tickets').insertMany(tickets);

  // 3. Seed Comments
  const comments = [
    { id: 'c1', ticket_id: 'TKT-2026-0018', sender_id: 'USR-9021', sender_name: 'Alex Johnson', role: 'user', text: 'I am unable to login to my account. Please assist.', is_internal: false, created_at: '2026-09-16T10:20:00Z' },
    { id: 'c2', ticket_id: 'TKT-2026-0018', sender_id: 'ADM-0001', sender_name: 'Support Admin', role: 'admin', text: 'We are checking the issue and have assigned it to our technical team.', is_internal: false, created_at: '2026-09-16T10:35:00Z' },
    { id: 'n1', ticket_id: 'TKT-2026-0018', sender_id: 'ADM-0001', sender_name: 'Senior Admin', role: 'admin', text: 'Customer has already contacted support twice. Verified user ID in DB.', is_internal: true, created_at: '2026-09-16T10:40:00Z' },
    { id: 'c10', ticket_id: 'TKT-2026-0017', sender_id: 'USR-9021', sender_name: 'Alex Johnson', role: 'user', text: 'Please refund or activate my subscription.', is_internal: false, created_at: '2026-09-15T14:15:00Z' },
    { id: 'c11', ticket_id: 'TKT-2026-0017', sender_id: 'ADM-0001', sender_name: 'Finance Ops', role: 'admin', text: 'The charge was pre-authorized and has been refunded to your bank account.', is_internal: false, created_at: '2026-09-15T16:30:00Z' },
    { id: 'c20', ticket_id: 'TKT-2026-0015', sender_id: 'ADM-0001', sender_name: 'DevOps Team', role: 'admin', text: 'Please upload the public CRT file and bundle.', is_internal: false, created_at: '2026-09-14T11:00:00Z' }
  ];
  await db.collection('comments').insertMany(comments);

  // 4. Seed Notifications
  const notifications = [
    { id: 'notif1', user_id: 'USR-9021', title: 'Ticket Updated', message: 'Your ticket TKT-2026-0018 is now In Progress.', ticket_id: 'TKT-2026-0018', read: false, time: '10 min ago', created_at: '2026-09-16T10:42:00Z' },
    { id: 'notif2', user_id: 'USR-9021', title: 'New Reply', message: 'Support Admin replied to your ticket TKT-2026-0018.', ticket_id: 'TKT-2026-0018', read: false, time: '25 min ago', created_at: '2026-09-16T10:35:00Z' },
    { id: 'notif3', user_id: 'USR-9021', title: 'Ticket Resolved', message: 'Your ticket TKT-2026-0017 has been resolved.', ticket_id: 'TKT-2026-0017', read: true, time: '1 day ago', created_at: '2026-09-15T16:30:00Z' }
  ];
  await db.collection('notifications').insertMany(notifications);

  // 5. Seed Audit Logs
  const auditLogs = [
    { id: 'audit1', actor: 'Support Admin', role: 'Admin', action: 'Changed status from Open to In Progress', ticket_id: 'TKT-2026-0018', timestamp: '16 Sep 2026, 10:42 AM', created_at: '2026-09-16T10:42:00Z' },
    { id: 'audit2', actor: 'Alex Johnson', role: 'User', action: 'Created new ticket TKT-2026-0018', ticket_id: 'TKT-2026-0018', timestamp: '16 Sep 2026, 10:20 AM', created_at: '2026-09-16T10:20:00Z' },
    { id: 'audit3', actor: 'Finance Ops', role: 'Admin', action: 'Resolved ticket TKT-2026-0017', ticket_id: 'TKT-2026-0017', timestamp: '15 Sep 2026, 04:30 PM', created_at: '2026-09-15T16:30:00Z' }
  ];
  await db.collection('audit_logs').insertMany(auditLogs);

  // 6. Seed System Settings
  const settings = [
    { key: 'sla_low_hours', value: '48' },
    { key: 'sla_medium_hours', value: '24' },
    { key: 'sla_high_hours', value: '8' },
    { key: 'sla_critical_hours', value: '2' },
    { key: 'auto_assign_enabled', value: 'true' },
    { key: 'email_notifications', value: 'true' },
    { key: 'company_name', value: 'ResolveDesk Corp' },
    { key: 'support_email', value: 'support@resolvedesk.com' }
  ];
  await db.collection('system_settings').insertMany(settings);

  console.log('✅ Database seeding completed successfully!');
}
