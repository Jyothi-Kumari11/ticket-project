import express from 'express';
import { getMongoDb } from '../../database/mongodb.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/settings
router.get('/', verifyToken, async (req, res) => {
  try {
    const db = await getMongoDb();
    const rows = await db.collection('system_settings').find({}).toArray();
    const settings = {};
    rows.forEach(r => { settings[r.key] = r.value; });
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/settings (Admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const newSettings = req.body;
    const db = await getMongoDb();
    const now = new Date().toISOString();

    for (const [key, value] of Object.entries(newSettings)) {
      await db.collection('system_settings').updateOne(
        { key },
        { $set: { key, value: String(value), updated_at: now } },
        { upsert: true }
      );
    }

    res.json({ success: true, message: 'Settings saved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
