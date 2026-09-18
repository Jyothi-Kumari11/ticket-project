import express from 'express';
import { getMongoDb } from '../../database/mongodb.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/audit-logs (Admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { ticketId } = req.query;
    const db = await getMongoDb();
    const filter = ticketId ? { ticket_id: ticketId } : {};

    const logs = await db.collection('audit_logs')
      .find(filter).sort({ created_at: -1 }).limit(200).toArray();

    res.json({
      success: true,
      data: logs.map(r => ({
        id: r.id, actor: r.actor, role: r.role, action: r.action,
        ticketId: r.ticket_id, timestamp: r.timestamp, createdAt: r.created_at
      }))
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/audit-logs
router.post('/', verifyToken, async (req, res) => {
  try {
    const { action, ticketId } = req.body;
    const id = `a_${Date.now()}`;
    const timestamp = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    const now = new Date().toISOString();

    const db = await getMongoDb();
    await db.collection('audit_logs').insertOne({
      id, actor: req.user.name,
      role: req.user.role === 'admin' ? 'Admin' : 'User',
      action, ticket_id: ticketId || null, timestamp, created_at: now
    });

    res.status(201).json({ success: true, data: { id, actor: req.user.name, role: req.user.role, action, ticketId, timestamp } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
