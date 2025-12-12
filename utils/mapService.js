const Donor = require('../models/Donor');

// Simple stub: filter donors by bloodGroup and fuzzy location match
async function findNearbyDonors(bloodGroup, location) {
  const filter = { status: 'Approved', availability: true };
  if (bloodGroup) filter.bloodGroup = bloodGroup;
  if (location) filter.location = { $regex: location, $options: 'i' };
  return Donor.find(filter).limit(10).select('name bloodGroup location phone availability availabilityStatus');
}

module.exports = { findNearbyDonors };
