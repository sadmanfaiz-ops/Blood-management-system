const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const { getAnalyticsSummary, getRecentEvents, getNotificationStats } = require('../utils/analyticsService');
const router = express.Router();

// Get analytics summary (admin only)
router.get('/summary', auth, requireRole('admin'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const summary = await getAnalyticsSummary(startDate, endDate);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching analytics', error: err.message });
  }
});

// Get recent events (admin only)
router.get('/recent', auth, requireRole('admin'), async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const events = await getRecentEvents(parseInt(limit));
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recent events', error: err.message });
  }
});

// Get notification delivery stats (admin only)
router.get('/notifications', auth, requireRole('admin'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await getNotificationStats(startDate, endDate);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notification stats', error: err.message });
  }
});

// Get dashboard data (admin only)
router.get('/dashboard', auth, requireRole('admin'), async (req, res) => {
  try {
    const summary = await getAnalyticsSummary();
    const recentEvents = await getRecentEvents(10);
    const notificationStats = await getNotificationStats();

    res.json({
      summary,
      recentEvents,
      notificationStats
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: err.message });
  }
});

module.exports = router;
