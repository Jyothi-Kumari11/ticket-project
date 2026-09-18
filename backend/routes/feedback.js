import express from 'express';
import { getMongoDb } from '../../database/mongodb.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/feedback (Admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = await getMongoDb();
    const feedbacks = await db.collection('feedback')
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    res.json({ success: true, data: feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/feedback
router.post('/', verifyToken, async (req, res) => {
  try {
    const { ticketId, rating, comment } = req.body;
    if (!ticketId || !rating) {
      return res.status(400).json({ success: false, error: 'ticketId and rating are required' });
    }

    const db = await getMongoDb();

    // Check ticket exists
    const ticket = await db.collection('tickets').findOne({ ticket_id: ticketId });
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }

    const id = `fb_${Date.now()}`;
    const newFeedback = {
      id,
      ticket_id: ticketId,
      user_id: req.user.id,
      user_name: req.user.name,
      rating: Number(rating),
      comment: comment || '',
      created_at: new Date().toISOString()
    };

    await db.collection('feedback').insertOne(newFeedback);

    res.status(201).json({
      success: true,
      data: newFeedback
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
