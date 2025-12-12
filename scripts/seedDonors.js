const mongoose = require('mongoose');
const Donor = require('../models/Donor');

async function seed() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/blood_donation_db');
    console.log('Connected to MongoDB');

    // Clear existing donors (optional, comment out to keep existing data)
    await Donor.deleteMany({});
    console.log('Cleared existing donors');

    // Create sample donors with geolocation coordinates (GeoJSON format)
    const donors = [
      {
        name: 'Rahim Ahmed',
        bloodGroup: 'A+',
        location: 'Dhaka',
        phone: '01711111111',
        availability: true,
        availabilityStatus: 'Available',
        status: 'Approved',
        lastDonationDate: new Date('2025-11-01'),
        latitude: 23.8103,
        longitude: 90.4125,
        coordinates: {
          type: 'Point',
          coordinates: [90.4125, 23.8103]
        }
      },
      {
        name: 'Karim Khan',
        bloodGroup: 'O-',
        location: 'Chattogram',
        phone: '01722222222',
        availability: true,
        availabilityStatus: 'Available',
        status: 'Approved',
        lastDonationDate: new Date('2025-10-15'),
        latitude: 22.3569,
        longitude: 91.7832,
        coordinates: {
          type: 'Point',
          coordinates: [91.7832, 22.3569]
        }
      },
      {
        name: 'Fatima Begum',
        bloodGroup: 'B+',
        location: 'Dhaka',
        phone: '01733333333',
        availability: true,
        availabilityStatus: 'Donated Recently',
        status: 'Approved',
        lastDonationDate: new Date('2025-12-01'),
        latitude: 23.7612,
        longitude: 90.3563,
        coordinates: {
          type: 'Point',
          coordinates: [90.3563, 23.7612]
        }
      },
      {
        name: 'Saurav Roy',
        bloodGroup: 'AB+',
        location: 'Sylhet',
        phone: '01744444444',
        availability: true,
        availabilityStatus: 'Available',
        status: 'Approved',
        lastDonationDate: new Date('2025-09-20'),
        latitude: 24.8949,
        longitude: 91.8687,
        coordinates: {
          type: 'Point',
          coordinates: [91.8687, 24.8949]
        }
      },
      {
        name: 'Noor Jahan',
        bloodGroup: 'O+',
        location: 'Dhaka',
        phone: '01755555555',
        availability: true,
        availabilityStatus: 'Available',
        status: 'Approved',
        lastDonationDate: new Date('2025-08-10'),
        latitude: 23.8230,
        longitude: 90.4430,
        coordinates: {
          type: 'Point',
          coordinates: [90.4430, 23.8230]
        }
      },
      {
        name: 'Nasir Uddin',
        bloodGroup: 'A-',
        location: 'Dhaka',
        phone: '01766666666',
        availability: true,
        availabilityStatus: 'Available',
        status: 'Approved',
        lastDonationDate: new Date('2025-11-15'),
        latitude: 23.8050,
        longitude: 90.3970,
        coordinates: {
          type: 'Point',
          coordinates: [90.3970, 23.8050]
        }
      },
      {
        name: 'Zaman Khan',
        bloodGroup: 'B-',
        location: 'Chattogram',
        phone: '01777777777',
        availability: true,
        availabilityStatus: 'Available',
        status: 'Approved',
        lastDonationDate: new Date('2025-10-20'),
        latitude: 22.3400,
        longitude: 91.8200,
        coordinates: {
          type: 'Point',
          coordinates: [91.8200, 22.3400]
        }
      }
    ];

    const created = await Donor.create(donors);
    console.log(`✓ Created ${created.length} sample donors:`);
    created.forEach(donor => {
      console.log(`  - ${donor.name} (${donor.bloodGroup}) in ${donor.location}`);
    });

    mongoose.disconnect();
    console.log('✓ Seed complete');
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
