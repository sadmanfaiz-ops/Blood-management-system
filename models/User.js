const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: { type: String, required: true, minlength: 6 },
    bloodGroup: {
      type: String,
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      required: true
    },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'donor', 'recipient'],
      default: 'donor'
    },
    isDonor: { type: Boolean, default: false },
    isRecipient: { type: Boolean, default: false },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    lastLoginAt: { type: Date },
    donationCount: { type: Number, default: 0 },
    totalRequests: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function() {
  try {
    if (!this.isModified('password')) {
      return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON responses
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
