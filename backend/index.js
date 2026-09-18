import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectMongoDB, getMongoDb, getMongoStatus } from '../database/mongodb.js';
import { seedDatabase } from '../database/seed.js';

import authRouter from './routes/auth.js';
import ticketsRouter from './routes/tickets.js';
import usersRouter from './routes/users.js';
import notificationsRouter from './routes/notifications.js';
import auditLogsRouter from './routes/auditLogs.js';
import feedbackRouter from './routes/feedback.js';
import statsRouter from './routes/stats.js';
import settingsRouter from './routes/settings.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow any localhost port during development
    if (!origin || origin.startsWith('http://localhost:')) {
      callback(null, true);
      return;
    }
    callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

// Initialize MongoDB & seed initial data
try {
  if (process.env.MONGODB_URI?.trim()) {
    await connectMongoDB();
    await seedDatabase();
  } else {
    console.warn('⚠️ MONGODB_URI is not set in .env. Please configure your MongoDB connection string.');
  }
} catch (err) {
  console.error('Database connection / seeding error:', err.message);
}

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    const db = await getMongoDb();
    if (!db) {
      return res.status(503).json({
        status: 'unhealthy',
        database: 'disconnected',
        mongodb: getMongoStatus(),
        error: 'MongoDB is not connected'
      });
    }
    await db.command({ ping: 1 });
    res.json({
      status: 'healthy',
      database: 'connected',
      mongodb: getMongoStatus(),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      mongodb: getMongoStatus(),
      error: err.message
    });
  }
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/users', usersRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/audit-logs', auditLogsRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/stats', statsRouter);
app.use('/api/settings', settingsRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 ResolveDesk API Server running at http://localhost:${PORT}`);
  console.log(`   Auth endpoints available at http://localhost:${PORT}/api/auth`);
});
