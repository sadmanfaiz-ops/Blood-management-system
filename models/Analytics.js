const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  eventType: {
    type: String,
    enum: ['REQUEST_CREATED', 'DONOR_APPROVED', 'DONOR_REJECTED', 'NOTIFICATION_SENT', 'REQUEST_FULFILLED', 'USER_SIGNUP', 'USER_LOGIN'],
    required: true,
    index: true
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodRequest' },
  metadata: {
    bloodGroup: String,
    location: String,
    urgencyLevel: String,
    notificationType: String, // 'EMAIL', 'SMS'
    recipientEmail: String,
    status: String
  },
  timestamp: { type: Date, default: Date.now, index: true },
  ipAddress: String
}, { timestamps: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
