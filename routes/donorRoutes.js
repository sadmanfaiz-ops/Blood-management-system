const express = require('express');
const Donor = require('../models/Donor');
const { auth, requireRole } = require('../middleware/auth');
const { getCoordinatesByRegion, isValidRegion } = require('../utils/regionCoordinates');
const { logEvent } = require('../utils/analyticsService');
const router = express.Router();

// ========== SPECIFIC ROUTES (must come BEFORE /:id) ==========

// Find nearest donors by geolocation (lat, lng, optional radius in km)
// Supports both coordinates and region name
// GET /api/donors/nearest?lat=23.8103&lng=90.4125&radius=5&bloodGroup=O%2B
// GET /api/donors/nearest?region=dhaka&radius=5&bloodGroup=O%2B
// Returns array of nearby donors sorted by distance
router.get('/nearest', async (req, res) => {
  try {
    let { lat, lng, radius = 5, bloodGroup, region } = req.query;
    
    let latitude, longitude;
    
    // If region is provided, get coordinates from region name
    if (region) {
      if (!isValidRegion(region)) {
        return res.status(400).json({ 
          message: `Invalid region: "${region}". Use /api/donors/regions for supported regions`,
          error: 'Invalid region'
        });
      }
      const coords = getCoordinatesByRegion(region);
      latitude = coords.latitude;
      longitude = coords.longitude;
    } else if (lat && lng) {
      // Use provided coordinates
      latitude = parseFloat(lat);
      longitude = parseFloat(lng);
    } else {
      return res.status(400).json({ message: 'Either (latitude + longitude) or region is required' });
    }
    
    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }
    
    const radiusInMeters = parseFloat(radius) * 1000; // Convert km to meters
    
    // Build MongoDB geospatial query
    const filter = {
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude] // GeoJSON format: [long, lat]
          },
          $maxDistance: radiusInMeters
        }
      },
      status: 'Approved',
      availability: true
    };
    
    // Add blood group filter if provided
    if (bloodGroup) {
      filter.bloodGroup = bloodGroup;
    }
    
    // Query nearby donors with distance calculation
    const donors = await Donor.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          distanceField: 'distance',
          maxDistance: radiusInMeters,
          spherical: true
        }
      },
      {
        $match: {
          status: 'Approved',
          availability: true,
          ...(bloodGroup && { bloodGroup: bloodGroup })
        }
      },
      {
        $project: {
          name: 1,
          bloodGroup: 1,
          location: 1,
          phone: 1,
          availability: 1,
          availabilityStatus: 1,
          lastDonationDate: 1,
          distance: 1,
          coordinates: 1,
          userId: 1,
          _id: 1
        }
      },
      {
        $limit: 20 // Limit to 20 nearest donors
      }
    ]);
    
    // Convert distance from meters to km and add readable format
    const donorsWithDistance = donors.map(donor => ({
      ...donor,
      distanceKm: (donor.distance / 1000).toFixed(2),
      distanceText: `${(donor.distance / 1000).toFixed(2)} km away`
    }));
    
    res.json({
      success: true,
      count: donorsWithDistance.length,
      userLocation: { 
        latitude, 
        longitude,
        region: region || 'Custom Location'
      },
      donors: donorsWithDistance
    });
  } catch (err) {
    console.error('Nearest donors error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get list of all supported regions
router.get('/regions/list', (req, res) => {
  try {
    const { getAvailableRegions } = require('../utils/regionCoordinates');
    const regions = getAvailableRegions();
    
    res.json({
      success: true,
      count: regions.length,
      regions: regions,
      usage: 'Use ?region=dhaka or ?region=chattogram in /nearest endpoint'
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Search donors by blood group, location, and availability
// MUST be before /:id route to avoid matching /search as an id
router.get('/search', async (req, res) => {
  try {
    let { bloodGroup, location, available } = req.query;

    const filter = {};
    
    // Handle blood group - trim whitespace and handle A+ as A (space gets sent instead of +)
    if (bloodGroup) {
      bloodGroup = bloodGroup.trim();
      // If user sent "A " (space), convert to "A+"
      if (bloodGroup === 'A') {
        bloodGroup = 'A+';
      } else if (bloodGroup === 'B') {
        bloodGroup = 'B+';
      } else if (bloodGroup === 'AB') {
        bloodGroup = 'AB+';
      } else if (bloodGroup === 'O') {
        bloodGroup = 'O+';
      }
      filter.bloodGroup = bloodGroup;
    }
    
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (available !== undefined) filter.availability = available === 'true';
    filter.status = 'Approved';

    const donors = await Donor.find(filter).select('name bloodGroup location phone availability availabilityStatus status lastDonationDate');
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ========== GENERAL CRUD ROUTES ==========

// Create or update donor profile (self)
router.post('/', auth, async (req, res) => {
  try {
    const { name, bloodGroup, location, phone, coordinates } = req.body;
    
    // If location is provided but coordinates are not, try to get coordinates from region
    let finalCoordinates = coordinates || { type: 'Point', coordinates: [0, 0] };
    if (!coordinates && location) {
      const regionCoords = getCoordinatesByRegion(location);
      if (regionCoords) {
        finalCoordinates = {
          type: 'Point',
          coordinates: [regionCoords.longitude, regionCoords.latitude]
        };
      }
    }
    
    let donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      donor = await Donor.create({
        userId: req.user._id,
        name: name || req.user.name,
        bloodGroup: bloodGroup || req.user.bloodGroup,
        location: location || req.user.location,
        phone: phone || req.user.phone,
        coordinates: finalCoordinates,
        status: 'Pending'
      });
    } else {
      donor.name = name || donor.name;
      donor.bloodGroup = bloodGroup || donor.bloodGroup;
      donor.location = location || donor.location;
      donor.phone = phone || donor.phone;
      
      // Update coordinates if location changed
      if (location) {
        const regionCoords = getCoordinatesByRegion(location);
        if (regionCoords) {
          donor.coordinates = {
            type: 'Point',
            coordinates: [regionCoords.longitude, regionCoords.latitude]
          };
        }
      }
      
      if (coordinates) {
        donor.coordinates = coordinates;
      }
      donor.status = donor.status || 'Pending';
      await donor.save();
    }
    res.status(201).json(donor);
  } catch (err) {
    res.status(400).json({ message: 'Could not create/update donor', error: err.message });
  }
});

// Get current user's donor profile (self)
router.get('/me', auth, async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id });
    if (donor) {
      res.json(donor);
    } else {
      res.status(404).json({ message: 'Donor profile not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update availability (self)
router.patch('/:id/availability', auth, async (req, res) => {
  const { availability, availabilityStatus, lastDonationDate } = req.body;
  const donor = await Donor.findById(req.params.id);
  if (!donor) return res.status(404).json({ message: 'Donor not found' });
  if (donor.userId?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  if (availability !== undefined) donor.availability = availability;
  if (availabilityStatus) donor.availabilityStatus = availabilityStatus;
  if (lastDonationDate) donor.lastDonationDate = lastDonationDate;
  await donor.save();
  res.json({ message: 'Availability updated', donor });
});

// Admin: approve/reject donors (uses 'status' field)
router.patch('/:id/status', auth, requireRole('admin'), async (req, res) => {
  const { status } = req.body; // Pending | Approved | Rejected
  const donor = await Donor.findById(req.params.id);
  if (!donor) return res.status(404).json({ message: 'Donor not found' });
  donor.status = status || donor.status;
  await donor.save();
  
  // Log analytics event
  const eventType = status === 'Approved' ? 'DONOR_APPROVED' : status === 'Rejected' ? 'DONOR_REJECTED' : 'DONOR_STATUS_UPDATE';
  await logEvent(eventType, {
    donorId: donor._id,
    metadata: {
      status: donor.status,
      bloodGroup: donor.bloodGroup,
      location: donor.location
    }
  });
  
  try {
    // Notify donor on approval/rejection via email only
    const { sendEmailNotification } = require('../utils/notifications');
    const subject = `Donor Registration ${donor.status}`;
    const body = donor.status === 'Approved'
      ? 'Your donor registration has been approved. Thank you for volunteering to save lives!'
      : donor.status === 'Rejected'
      ? 'Your donor registration was not approved at this time.'
      : 'Your donor registration status has been updated.';

    // Send Email via linked user
    if (donor.userId) {
      const user = await require('../models/User').findById(donor.userId).select('email');
      if (user?.email) await sendEmailNotification(user.email, subject, body);
    }
  } catch (err) {
    console.warn('Notification (donor status) failed:', err.message);
  }
  res.json({ message: 'Donor status updated', donor });
});

// Admin: list all donors (with user details)
router.get('/', auth, requireRole('admin'), async (req, res) => {
  const donors = await Donor.find().populate('userId', 'name email phone location').sort('-createdAt');
  res.json(donors);
});

// Get a single donor profile by ID
router.get('/:id', async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.json(donor);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
