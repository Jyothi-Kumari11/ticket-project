import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getMongoDb } from '../../database/mongodb.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'resolvedesk_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const ALLOWED_ROLES = ['user'];

function formatUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    department: u.department,
    joinedDate: new Date(u.created_at).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })
  };
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(403).json({ success: false, error: 'You are not allowed to register with that role.' });
    }

    const db = await getMongoDb();
    const existing = await db.collection('users').findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const year = new Date().getFullYear();
    const prefix = role === 'admin' ? 'ADM' : 'USR';
    const count = await db.collection('users').countDocuments({ role });
    const userId = `${prefix}-${year}-${String(count + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();

    const newUser = {
      id: userId, name: name.trim(), email: email.toLowerCase().trim(),
      password: hashedPassword, phone: phone || null,
      role, department: 'General', created_at: now, updated_at: now
    };

    await db.collection('users').insertOne(newUser);

    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({ success: true, token, user: formatUser(newUser) });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, error: 'Registration failed. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const db = await getMongoDb();
    const user = await db.collection('users').findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ success: true, token, user: formatUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Login failed. Please try again.' });
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const db = await getMongoDb();
    const user = await db.collection('users').findOne({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    res.json({ success: true, user: formatUser(user) });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ success: false, error: 'Could not fetch user data.' });
  }
});

// PATCH /api/auth/profile
router.patch('/profile', verifyToken, async (req, res) => {
  try {
    const { name, phone, department } = req.body;
    if (!name && !phone && !department) {
      return res.status(400).json({ success: false, error: 'At least one field (name, phone, department) is required.' });
    }

    const db = await getMongoDb();
    const update = { updated_at: new Date().toISOString() };
    if (name) update.name = name;
    if (phone) update.phone = phone;
    if (department) update.department = department;

    await db.collection('users').updateOne({ id: req.user.id }, { $set: update });
    const user = await db.collection('users').findOne({ id: req.user.id });

    res.json({ success: true, user: formatUser(user) });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ success: false, error: 'Profile update failed. Please try again.' });
  }
});

export default router;
