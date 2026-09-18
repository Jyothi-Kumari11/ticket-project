import express from 'express';
import { getMongoDb } from '../../database/mongodb.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/stats/summary (Admin only)
router.get('/summary', verifyToken, isAdmin, async (req, res) => {
  try {
    const db = await getMongoDb();

    const [
      totalTickets,
      openTickets,
      inProgressTickets,
      waitingTickets,
      resolvedTickets,
      closedTickets,
      criticalTickets,
      highTickets,
      mediumTickets,
      lowTickets,
      totalUsers,
      totalAdmins,
      categoryCounts
    ] = await Promise.all([
      db.collection('tickets').countDocuments(),
      db.collection('tickets').countDocuments({ status: 'Open' }),
      db.collection('tickets').countDocuments({ status: 'In Progress' }),
      db.collection('tickets').countDocuments({ status: 'Waiting for User' }),
      db.collection('tickets').countDocuments({ status: 'Resolved' }),
      db.collection('tickets').countDocuments({ status: 'Closed' }),
      db.collection('tickets').countDocuments({ priority: 'Critical' }),
      db.collection('tickets').countDocuments({ priority: 'High' }),
      db.collection('tickets').countDocuments({ priority: 'Medium' }),
      db.collection('tickets').countDocuments({ priority: 'Low' }),
      db.collection('users').countDocuments({ role: 'user' }),
      db.collection('users').countDocuments({ role: 'admin' }),
      db.collection('tickets').aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $project: { category: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } }
      ]).toArray()
    ]);

    const resolvedCount = resolvedTickets + closedTickets;
    const resolutionRate = totalTickets > 0 ? Math.round((resolvedCount / totalTickets) * 100) : 100;

    // Monthly trend (last 6 months)
    let trendRows = [];
    try {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyData = await db.collection('tickets').aggregate([
        {
          $project: {
            createdDate: {
              $dateFromString: {
                dateString: '$created_at',
                onError: new Date(),
                onNull: new Date()
              }
            },
            status: 1
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdDate' },
              month: { $month: '$createdDate' }
            },
            total: { $sum: 1 },
            resolved: {
              $sum: {
                $cond: [{ $in: ['$status', ['Resolved', 'Closed']] }, 1, 0]
              }
            }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]).toArray();

      trendRows = monthlyData.map(item => ({
        month: monthNames[item._id.month - 1] || `M${item._id.month}`,
        total: item.total || 0,
        resolved: item.resolved || 0
      }));
    } catch (e) {
      console.warn('Fallback for monthly trend:', e.message);
      trendRows = [];
    }

    // Average feedback rating
    let avgSatisfactionRating = null;
    try {
      const feedbackAgg = await db.collection('feedback').aggregate([
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ]).toArray();

      if (feedbackAgg.length > 0 && feedbackAgg[0].avgRating !== null) {
        avgSatisfactionRating = feedbackAgg[0].avgRating.toFixed(1);
      }
    } catch (e) {
      avgSatisfactionRating = null;
    }

    res.json({
      success: true,
      data: {
        totalTickets,
        openTickets,
        inProgressTickets,
        waitingTickets,
        resolvedTickets,
        closedTickets,
        activeTickets: openTickets + inProgressTickets + waitingTickets,
        criticalTickets,
        highTickets,
        mediumTickets,
        lowTickets,
        totalUsers,
        totalAdmins,
        resolutionRate,
        avgSatisfactionRating,
        categories: categoryCounts,
        monthlyTrend: trendRows
      }
    });
  } catch (err) {
    console.error('Error fetching stats summary:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
