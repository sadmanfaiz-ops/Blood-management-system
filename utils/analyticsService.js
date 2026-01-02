const Analytics = require('../models/Analytics');

// Log an analytics event
async function logEvent(eventType, data) {
  try {
    const event = new Analytics({
      eventType,
      userId: data.userId,
      donorId: data.donorId,
      requestId: data.requestId,
      metadata: data.metadata,
      ipAddress: data.ipAddress
    });
    await event.save();
    console.log(`📊 [Analytics] ${eventType} logged`);
    return event;
  } catch (err) {
    console.error('Analytics logging error:', err.message);
  }
}

// Get analytics summary
async function getAnalyticsSummary(startDate, endDate) {
  try {
    const filter = {};
    if (startDate) filter.timestamp = { $gte: new Date(startDate) };
    if (endDate) filter.timestamp = { ...filter.timestamp, $lte: new Date(endDate) };

    const totalEvents = await Analytics.countDocuments(filter);
    
    const eventCounts = await Analytics.aggregate([
      { $match: filter },
      { $group: { _id: '$eventType', count: { $sum: 1 } } }
    ]);

    const bloodGroupStats = await Analytics.aggregate([
      { $match: { ...filter, 'metadata.bloodGroup': { $exists: true } } },
      { $group: { _id: '$metadata.bloodGroup', count: { $sum: 1 } } }
    ]);

    const locationStats = await Analytics.aggregate([
      { $match: { ...filter, 'metadata.location': { $exists: true } } },
      { $group: { _id: '$metadata.location', count: { $sum: 1 } } }
    ]);

    return {
      totalEvents,
      eventCounts,
      bloodGroupStats,
      locationStats,
      dateRange: { startDate, endDate }
    };
  } catch (err) {
    console.error('Analytics summary error:', err.message);
    return null;
  }
}

// Get recent events
async function getRecentEvents(limit = 20) {
  try {
    return await Analytics.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('userId', 'name email')
      .populate('donorId', 'name')
      .populate('requestId', 'bloodGroup location');
  } catch (err) {
    console.error('Get recent events error:', err.message);
    return [];
  }
}

// Get notification delivery stats
async function getNotificationStats(startDate, endDate) {
  try {
    const filter = { eventType: 'NOTIFICATION_SENT' };
    if (startDate) filter.timestamp = { $gte: new Date(startDate) };
    if (endDate) filter.timestamp = { ...filter.timestamp, $lte: new Date(endDate) };

    const notificationTypes = await Analytics.aggregate([
      { $match: filter },
      { $group: { _id: '$metadata.notificationType', count: { $sum: 1 } } }
    ]);

    const totalNotifications = await Analytics.countDocuments(filter);

    return {
      totalNotifications,
      byType: notificationTypes
    };
  } catch (err) {
    console.error('Notification stats error:', err.message);
    return null;
  }
}

module.exports = { logEvent, getAnalyticsSummary, getRecentEvents, getNotificationStats };
