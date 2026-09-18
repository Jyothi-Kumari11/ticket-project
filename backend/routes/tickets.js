import express from 'express';
import { getMongoDb } from '../../database/mongodb.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

function formatTicket(t) {
  if (!t) return null;
  return {
    ticketId: t.ticket_id,
    userId: t.user_id,
    userName: t.user_name,
    userEmail: t.user_email,
    userPhone: t.user_phone,
    subject: t.subject,
    description: t.description,
    category: t.category,
    priority: t.priority,
    status: t.status,
    assignedTo: t.assigned_to,
    attachments: Array.isArray(t.attachments) ? t.attachments : [],
    timeline: Array.isArray(t.timeline) ? t.timeline : [],
    createdAt: t.created_at,
    updatedAt: t.updated_at,
    resolvedAt: t.resolved_at,
    closedAt: t.closed_at
  };
}

// GET /api/tickets
router.get('/', verifyToken, async (req, res) => {
  try {
    const { userId, status, priority, category, search } = req.query;
    const db = await getMongoDb();
    const filter = {};

    if (req.user.role !== 'admin') {
      filter.user_id = req.user.id;
    } else if (userId) {
      filter.user_id = userId;
    }

    if (status && status !== 'all' && status !== 'All') filter.status = status;
    if (priority && priority !== 'all' && priority !== 'All') filter.priority = priority;
    if (category && category !== 'all' && category !== 'All') filter.category = category;
    if (search) {
      filter.$or = [
        { ticket_id: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { user_name: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await db.collection('tickets').find(filter).sort({ created_at: -1 }).toArray();
    res.json({ success: true, count: tickets.length, data: tickets.map(formatTicket) });
  } catch (err) {
    console.error('Error fetching tickets:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/tickets/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const ticketId = req.params.id;
    const db = await getMongoDb();
    const filter = { ticket_id: ticketId };
    if (req.user.role !== 'admin') filter.user_id = req.user.id;

    const ticketDoc = await db.collection('tickets').findOne(filter);
    if (!ticketDoc) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }

    const ticket = formatTicket(ticketDoc);

    const allComments = await db.collection('comments').find({ ticket_id: ticketId }).sort({ created_at: 1 }).toArray();
    ticket.comments = allComments.filter(c => !c.is_internal).map(c => ({
      id: c.id, sender: c.sender_name, role: c.role, text: c.text,
      timestamp: new Date(c.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
    }));
    ticket.internalNotes = allComments.filter(c => c.is_internal).map(c => ({
      id: c.id, author: c.sender_name, text: c.text,
      timestamp: new Date(c.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
    }));

    const delReq = await db.collection('deletion_requests').findOne({ ticket_id: ticketId, status: 'pending' });
    ticket.pendingDeletion = !!delReq;

    res.json({ success: true, data: ticket });
  } catch (err) {
    console.error('Error fetching ticket detail:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tickets
router.post('/', verifyToken, async (req, res) => {
  try {
    const { subject, description, category, priority = 'Medium', attachments = [] } = req.body;
    if (!subject || !description || !category) {
      return res.status(400).json({ success: false, error: 'Subject, description, and category are required' });
    }

    const db = await getMongoDb();
    const user = await db.collection('users').findOne({ id: req.user.id });

    // Generate sequential ticket ID
    const year = new Date().getFullYear();
    const last = await db.collection('tickets')
      .find({ ticket_id: { $regex: `^TKT-${year}-` } })
      .sort({ ticket_id: -1 }).limit(1).toArray();
    let nextNum = 20;
    if (last.length > 0) {
      const match = last[0].ticket_id.match(/TKT-\d+-(\d+)/);
      if (match) nextNum = Math.max(nextNum, parseInt(match[1], 10) + 1);
    }
    const ticketId = `TKT-${year}-${String(nextNum).padStart(4, '0')}`;
    const now = new Date().toISOString();

    const timeline = [
      { step: 'Submitted', date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
      { step: 'Admin Viewed', date: 'Pending', completed: false },
      { step: 'In Progress', date: 'Pending', completed: false },
      { step: 'Resolved', date: 'Pending', completed: false },
      { step: 'Closed', date: 'Pending', completed: false }
    ];

    const newTicket = {
      ticket_id: ticketId, user_id: req.user.id, user_name: req.user.name,
      user_email: req.user.email, user_phone: user?.phone || null,
      subject, description, category, priority,
      status: 'Open', assigned_to: 'Unassigned',
      attachments, timeline,
      created_at: now, updated_at: now, resolved_at: null, closed_at: null
    };

    await db.collection('tickets').insertOne(newTicket);

    // Audit log
    await db.collection('audit_logs').insertOne({
      id: `a_${Date.now()}`, actor: req.user.name,
      role: req.user.role === 'admin' ? 'Admin' : 'User',
      action: `Created new ticket ${ticketId}`, ticket_id: ticketId,
      timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      created_at: now
    });

    // Notification
    await db.collection('notifications').insertOne({
      id: `n_${Date.now()}`, user_id: req.user.id,
      title: 'Ticket Created', message: `Ticket ${ticketId} created successfully.`,
      ticket_id: ticketId, read: false, time: 'Just now', created_at: now
    });

    res.status(201).json({ success: true, data: formatTicket(newTicket) });
  } catch (err) {
    console.error('Error creating ticket:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/tickets/:id/status
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { status, priority, assignedTo } = req.body;
    const db = await getMongoDb();

    const existing = await db.collection('tickets').findOne({ ticket_id: ticketId });
    if (!existing) return res.status(404).json({ success: false, error: 'Ticket not found' });

    const newStatus = status || existing.status;
    const newPriority = priority || existing.priority;
    const newAssigned = assignedTo !== undefined ? assignedTo : existing.assigned_to;
    const now = new Date().toISOString();

    let timeline = Array.isArray(existing.timeline) ? existing.timeline : [];
    timeline = timeline.map(item =>
      item.step === newStatus ? { ...item, completed: true, date: 'Just now' } : item
    );

    const resolvedAt = newStatus === 'Resolved' ? now : existing.resolved_at;
    const closedAt = newStatus === 'Closed' ? now : existing.closed_at;

    await db.collection('tickets').updateOne(
      { ticket_id: ticketId },
      { $set: { status: newStatus, priority: newPriority, assigned_to: newAssigned, timeline, updated_at: now, resolved_at: resolvedAt, closed_at: closedAt } }
    );

    await db.collection('audit_logs').insertOne({
      id: `a_${Date.now()}`, actor: req.user.name,
      role: req.user.role === 'admin' ? 'Admin' : 'User',
      action: `Updated ${ticketId} status to ${newStatus}`, ticket_id: ticketId,
      timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      created_at: now
    });

    await db.collection('notifications').insertOne({
      id: `n_${Date.now()}`, user_id: existing.user_id,
      title: 'Ticket Status Updated', message: `Ticket ${ticketId} is now ${newStatus}.`,
      ticket_id: ticketId, read: false, time: 'Just now', created_at: now
    });

    const updated = await db.collection('tickets').findOne({ ticket_id: ticketId });
    res.json({ success: true, data: formatTicket(updated) });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tickets/:id/comments
router.post('/:id/comments', verifyToken, async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { text, isInternal = false } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: 'Comment text is required' });
    }

    const db = await getMongoDb();
    const ticket = await db.collection('tickets').findOne({ ticket_id: ticketId });
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });

    const commentId = `${isInternal ? 'n' : 'c'}_${Date.now()}`;
    const now = new Date().toISOString();

    await db.collection('comments').insertOne({
      id: commentId, ticket_id: ticketId,
      sender_id: req.user.id, sender_name: req.user.name,
      role: req.user.role, text: text.trim(),
      is_internal: isInternal, created_at: now
    });

    if (!isInternal) {
      await db.collection('notifications').insertOne({
        id: `n_${Date.now()}`, user_id: ticket.user_id,
        title: 'New Comment', message: `${req.user.name} replied on ticket ${ticketId}`,
        ticket_id: ticketId, read: false, time: 'Just now', created_at: now
      });
    }

    res.status(201).json({
      success: true,
      data: {
        id: commentId, sender: req.user.name, role: req.user.role, text: text.trim(),
        timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        isInternal
      }
    });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tickets/:id/deletion-request (Admin only)
router.post('/:id/deletion-request', verifyToken, isAdmin, async (req, res) => {
  try {
    const ticketId = req.params.id;
    const db = await getMongoDb();

    const ticket = await db.collection('tickets').findOne({ ticket_id: ticketId });
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });

    const existingReq = await db.collection('deletion_requests').findOne({ ticket_id: ticketId, status: 'pending' });
    if (existingReq) {
      return res.status(400).json({ success: false, error: 'A deletion request is already pending customer approval for this ticket.' });
    }

    const approvedReq = await db.collection('deletion_requests').findOne({ ticket_id: ticketId, status: 'approved' });
    if (approvedReq) {
      return res.status(400).json({ success: false, error: 'Customer has already approved deletion. Proceed to permanently delete the ticket.' });
    }

    const reqId = `del_${Date.now()}`;
    const now = new Date().toISOString();

    await db.collection('deletion_requests').insertOne({
      id: reqId, ticket_id: ticketId, admin_id: req.user.id,
      admin_name: req.user.name, status: 'pending', requested_at: now, created_at: now
    });

    await db.collection('notifications').insertOne({
      id: `n_${Date.now()}`, user_id: ticket.user_id,
      title: '⚠️ Ticket Deletion Consent Required',
      message: `Admin "${req.user.name}" has requested permission to permanently delete your ticket ${ticketId} ("${ticket.subject}").`,
      ticket_id: ticketId, read: false, time: 'Just now', created_at: now
    });

    await db.collection('audit_logs').insertOne({
      id: `a_${Date.now()}`, actor: req.user.name, role: 'Admin',
      action: `[DELETION REQUEST] Admin "${req.user.name}" requested customer consent to permanently delete ticket ${ticketId}`,
      ticket_id: ticketId,
      timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      created_at: now
    });

    res.json({ success: true, message: 'Deletion consent request sent to customer.', requestId: reqId });
  } catch (err) {
    console.error('Error requesting deletion:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/tickets/:id/deletion-status
router.get('/:id/deletion-status', verifyToken, async (req, res) => {
  try {
    const db = await getMongoDb();
    const dr = await db.collection('deletion_requests')
      .find({ ticket_id: req.params.id })
      .sort({ created_at: -1 }).limit(1).toArray();

    if (!dr.length) return res.json({ success: true, data: null });

    const d = dr[0];
    res.json({
      success: true,
      data: {
        id: d.id, ticketId: d.ticket_id, adminId: d.admin_id, adminName: d.admin_name,
        status: d.status, requestedAt: d.requested_at, customerName: d.customer_name, respondedAt: d.responded_at
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/tickets/:id/deletion-response (Customer only)
router.patch('/:id/deletion-response', verifyToken, async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { approved } = req.body;

    if (typeof approved !== 'boolean') {
      return res.status(400).json({ success: false, error: 'approved (boolean) is required' });
    }
    if (req.user.role === 'admin') {
      return res.status(403).json({ success: false, error: 'Only the ticket owner can approve or reject deletion.' });
    }

    const db = await getMongoDb();
    const ticket = await db.collection('tickets').findOne({ ticket_id: ticketId });
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });
    if (ticket.user_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'You can only respond to deletion requests for your own tickets.' });
    }

    const pendingReq = await db.collection('deletion_requests').findOne({ ticket_id: ticketId, status: 'pending' });
    if (!pendingReq) {
      return res.status(404).json({ success: false, error: 'No pending deletion request found for this ticket.' });
    }

    const now = new Date().toISOString();
    const newStatus = approved ? 'approved' : 'rejected';

    await db.collection('deletion_requests').updateOne(
      { ticket_id: ticketId, status: 'pending' },
      { $set: { status: newStatus, customer_id: req.user.id, customer_name: req.user.name, responded_at: now } }
    );

    const action = approved
      ? `[DELETION APPROVED] Customer "${req.user.name}" APPROVED permanent deletion of ticket ${ticketId}.`
      : `[DELETION REJECTED] Customer "${req.user.name}" REJECTED the deletion request for ticket ${ticketId}.`;

    await db.collection('audit_logs').insertOne({
      id: `a_${Date.now()}`, actor: req.user.name, role: 'User',
      action, ticket_id: ticketId,
      timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      created_at: now
    });

    const admin = await db.collection('users').findOne({ role: 'admin' });
    if (admin) {
      await db.collection('notifications').insertOne({
        id: `n_${Date.now()}`, user_id: admin.id,
        title: approved ? `✅ Deletion Approved for ${ticketId}` : `❌ Deletion Rejected for ${ticketId}`,
        message: approved
          ? `Customer "${req.user.name}" approved permanent deletion of ticket ${ticketId}.`
          : `Customer "${req.user.name}" rejected the deletion request for ticket ${ticketId}.`,
        ticket_id: ticketId, read: false, time: 'Just now', created_at: now
      });
    }

    res.json({
      success: true, approved,
      message: approved
        ? `Ticket ${ticketId} deletion approved.`
        : `Deletion request for ticket ${ticketId} has been rejected.`
    });
  } catch (err) {
    console.error('Error responding to deletion request:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/tickets/:id (Admin only, requires approved deletion request)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const ticketId = req.params.id;
    const db = await getMongoDb();

    const ticket = await db.collection('tickets').findOne({ ticket_id: ticketId });
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });

    const approvedReq = await db.collection('deletion_requests')
      .find({ ticket_id: ticketId, status: 'approved' })
      .sort({ responded_at: -1 }).limit(1).toArray();

    if (!approvedReq.length) {
      const pending = await db.collection('deletion_requests').findOne({ ticket_id: ticketId, status: 'pending' });
      if (pending) {
        return res.status(403).json({ success: false, error: 'Forbidden: Deletion request is still pending customer approval.' });
      }
      return res.status(403).json({ success: false, error: 'Forbidden: You must first send a deletion consent request and receive customer approval.' });
    }

    const approvedRecord = approvedReq[0];
    const now = new Date().toISOString();

    await db.collection('deletion_requests').deleteMany({ ticket_id: ticketId });
    await db.collection('comments').deleteMany({ ticket_id: ticketId });
    await db.collection('feedback').deleteMany({ ticket_id: ticketId });
    await db.collection('tickets').deleteOne({ ticket_id: ticketId });

    await db.collection('audit_logs').insertOne({
      id: `a_${Date.now()}`, actor: req.user.name, role: 'Admin',
      action: `[PERMANENT DELETION EXECUTED] Admin "${req.user.name}" permanently deleted ticket ${ticketId}. Customer approval granted by "${approvedRecord.customer_name}".`,
      ticket_id: ticketId,
      timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      created_at: now
    });

    res.json({
      success: true,
      message: `Ticket ${ticketId} has been permanently deleted with customer consent from "${approvedRecord.customer_name}".`,
      deletedTicketId: ticketId,
      approvedBy: approvedRecord.customer_name,
      approvedAt: approvedRecord.responded_at,
      deletedAt: now
    });
  } catch (err) {
    console.error('Error permanently deleting ticket:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
