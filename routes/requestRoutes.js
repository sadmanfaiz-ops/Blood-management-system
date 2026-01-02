const express = require('express');
const mongoose = require('mongoose');
const BloodRequest = require('../models/BloodRequest');
const Donor = require('../models/Donor');
const { auth, requireRole } = require('../middleware/auth');
const { sendNotificationsNearby } = require('../utils/notifications');
const { findNearbyDonors } = require('../utils/mapService');
const { logEvent } = require('../utils/analyticsService');
const router = express.Router();

// Create a new blood request
router.post('/', auth, async (req, res) => {
  try {
    // Only recipients (role or flag) can post requests
    if (!(req.user.role === 'recipient' || req.user.isRecipient)) {
      return res.status(403).json({ message: 'Only recipients can post blood requests' });
    }

    const {
      bloodGroup,
      quantityRequired,
      hospitalName,
      location,
      urgencyLevel,
      neededBefore,
      description
    } = req.body;

    const newRequest = await BloodRequest.create({
      recipientId: req.user._id,
      bloodGroup,
      quantityRequired,
      hospitalName,
      location,
      urgencyLevel,
      neededBefore
    });

    // Log analytics event
    await logEvent('REQUEST_CREATED', {
      userId: req.user._id,
      requestId: newRequest._id,
      metadata: {
        bloodGroup,
        location,
        urgencyLevel
      }
    });

    // Notify compatible donors near location
    const nearbyDonors = await findNearbyDonors(bloodGroup, location);
    if (nearbyDonors && nearbyDonors.length) {
      await sendNotificationsNearby(nearbyDonors, newRequest);
    }

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// View all own requests
router.get('/my', auth, async (req, res) => {
  try {
    const myRequests = await BloodRequest.find({ recipientId: req.user._id });
    res.json(myRequests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update own request status (e.g., cancel)
router.patch('/:id', auth, async (req, res) => {
  const { status } = req.body;
  const request = await BloodRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: 'Request not found' });
  if (request.recipientId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  if (status) request.status = status;
  await request.save();
  try {
    // Notify recipient on status changes they make (e.g., Fulfilled/Cancelled confirmation)
    const { sendEmailNotification } = require('../utils/notifications');
    const userEmail = req.user.email;
    const subject = `Your Request Status: ${request.status}`;
    const body = `Your blood request (${request.bloodGroup}, ${request.location}) status is now "${request.status}".`;
    if (userEmail) await sendEmailNotification(userEmail, subject, body);
  } catch (err) {
    console.warn('Notification (recipient status update) failed:', err.message);
  }
  res.json({ message: 'Request updated', request });
});

// Admin: list all requests
router.get('/', auth, requireRole('admin'), async (req, res) => {
  const items = await BloodRequest.find().populate('recipientId', 'name email phone location').sort('-createdAt');
  res.json(items);
});

// Admin: update status
router.patch('/:id/status', auth, requireRole('admin'), async (req, res) => {
  const { status } = req.body;
  const request = await BloodRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: 'Request not found' });
  if (status) request.status = status;
  await request.save();
  try {
    // Notify recipient on admin acceptance/updates
    const { sendEmailNotification } = require('../utils/notifications');
    const recipient = await require('../models/User').findById(request.recipientId).select('email phone');
    const subject = `Request ${request.status}`;
    const body = request.status === 'Approved'
      ? 'Your blood request has been approved and is now visible to donors.'
      : request.status === 'Fulfilled'
      ? 'Your blood request has been marked fulfilled. Wishing you well.'
      : `Your blood request status is now ${request.status}.`;
    if (recipient?.email) await sendEmailNotification(recipient.email, subject, body);
  } catch (err) {
    console.warn('Notification (admin status update) failed:', err.message);
  }
  res.json({ message: 'Status updated', request });
});

// Map API: find nearby donors by bloodGroup/location (stubbed)
router.get('/nearby', auth, async (req, res) => {
  const { bloodGroup, location } = req.query;
  const donors = await findNearbyDonors(bloodGroup, location);
  res.json(donors);
});

// Update status of own request
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Approved', 'Fulfilled', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const request = await BloodRequest.findOne({
      _id: req.params.id,
      recipientId: req.user.id
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    await request.save();

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Edit details of own request
router.put('/:id', auth, async (req, res) => {
  try {
    const updates = req.body;

    const request = await BloodRequest.findOneAndUpdate(
      { _id: req.params.id, recipientId: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
});

module.exports = router;
