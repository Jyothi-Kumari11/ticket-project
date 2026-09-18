import express from 'express';
import { getMongoDb } from '../../database/mongodb.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications
router.get('/', verifyToken, async (req, res) => {
  try {
    const db = await getMongoDb();
    const filter = req.user.role !== 'admin'
      ? { $or: [{ user_id: req.user.id }, { user_id: null }] }
      : {};

    const notifications = await db.collection('notifications')
      .find(filter).sort({ created_at: -1 }).limit(50).toArray();

    res.json({
      success: true,
      data: notifications.map(r => ({
        id: r.id, title: r.title, message: r.message,
        ticketId: r.ticket_id, read: Boolean(r.read),
        time: r.time || 'Just now', createdAt: r.created_at
      }))
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    const db = await getMongoDb();
    await db.collection('notifications').updateOne({ id: req.params.id }, { $set: { read: true } });
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', verifyToken, async (req, res) => {
  try {
    const db = await getMongoDb();
    const filter = req.user.role === 'admin'
      ? {}
      : { $or: [{ user_id: req.user.id }, { user_id: null }] };
    await db.collection('notifications').updateMany(filter, { $set: { read: true } });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
