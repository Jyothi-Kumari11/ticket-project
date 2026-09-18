import express from 'express';
import { getMongoDb } from '../../database/mongodb.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users (Admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = await getMongoDb();
    const users = await db.collection('users').find({}, { projection: { password: 0 } }).sort({ created_at: 1 }).toArray();

    const data = await Promise.all(users.map(async (u) => {
      const totalTickets = await db.collection('tickets').countDocuments({ user_id: u.id });
      const openTickets = await db.collection('tickets').countDocuments({
        user_id: u.id,
        status: { $in: ['Open', 'In Progress', 'Waiting for User'] }
      });
      return {
        id: u.id, name: u.name, email: u.email, phone: u.phone,
        role: u.role, department: u.department,
        totalTickets, openTickets,
        joinedDate: new Date(u.created_at).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })
      };
    }));

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/users/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const db = await getMongoDb();
    const u = await db.collection('users').findOne({ id: req.params.id }, { projection: { password: 0 } });

    if (!u) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: u.id, name: u.name, email: u.email, phone: u.phone,
        role: u.role, department: u.department,
        joinedDate: new Date(u.created_at).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
