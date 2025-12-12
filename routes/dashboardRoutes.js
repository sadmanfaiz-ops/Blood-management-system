const express = require('express');
const User = require('../models/User');
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// User dashboard summary
router.get('/user', auth, async (req, res) => {
  const userId = req.user._id;
  const donationCount = req.user.donationCount || 0;
  const totalRequests = await BloodRequest.countDocuments({ recipientId: userId });
  const activeRequests = await BloodRequest.countDocuments({ recipientId: userId, status: { $in: ['Pending', 'Approved'] } });
  const bloodGroupAvailability = await Donor.countDocuments({ bloodGroup: req.user.bloodGroup, availability: true, status: 'Approved', location: { $regex: req.user.location, $options: 'i' } });
  res.json({ donationCount, totalRequests, activeRequests, bloodGroupAvailability });
});

// Admin dashboard summary
router.get('/admin', auth, requireRole('admin'), async (req, res) => {
  const donors = await Donor.countDocuments();
  const approvedDonors = await Donor.countDocuments({ status: 'Approved' });
  const pendingDonors = await Donor.countDocuments({ status: 'Pending' });
  const totalRequests = await BloodRequest.countDocuments();
  const fulfilledRequests = await BloodRequest.countDocuments({ status: 'Fulfilled' });
  const monthlyTrend = await BloodRequest.aggregate([
    { $group: { _id: { $substr: ['$createdAt', 0, 7] }, total: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  res.json({ donors, approvedDonors, pendingDonors, totalRequests, fulfilledRequests, monthlyTrend });
});

module.exports = router;
