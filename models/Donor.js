const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  bloodGroup: { type: String, required: true }, // e.g. 'A+', 'O-'
  location: { type: String, required: true },   // city / area
  phone: { type: String, required: true },
  availability: { type: Boolean, default: true },
  availabilityStatus: {
    type: String,
    enum: ['Available', 'Unavailable', 'Donated Recently'],
    default: 'Available'
  },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  lastDonationDate: { type: Date },
  // Geolocation for map-based donor tracking - GeoJSON format
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  // Keep latitude/longitude for backward compatibility
  latitude: { type: Number },
  longitude: { type: Number }
}, { timestamps: true });

// Index for geospatial queries
donorSchema.index({ 'coordinates': '2dsphere' });

module.exports = mongoose.model('Donor', donorSchema);
