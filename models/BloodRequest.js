const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodGroup: { type: String, required: true },
  quantityRequired: { type: Number, required: true }, // in units
  hospitalName: { type: String, required: true },
  location: { type: String, required: true },
  urgencyLevel: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  status: { 
    type: String,
    enum: ['Pending', 'Approved', 'Fulfilled', 'Cancelled'],
    default: 'Pending'
  },
  neededBefore: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
