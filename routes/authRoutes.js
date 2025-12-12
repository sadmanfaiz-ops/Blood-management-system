const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, requireRole, JWT_SECRET } = require('../middleware/auth');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, bloodGroup, phone, location, isDonor, isRecipient, role } = req.body;

    console.log('Register attempt:', { name, email, bloodGroup, phone, location, role });

    // Validation
    if (!name || !email || !password || !bloodGroup || !phone || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password.trim(),
      bloodGroup,
      phone: phone.toString().trim(),
      location: location.trim(),
      isDonor: isDonor || false,
      isRecipient: isRecipient || false,
      role: role || (isDonor ? 'donor' : 'recipient')
    });

    console.log('Saving user to database...');
    await newUser.save();
    console.log('User saved successfully:', newUser._id);

    // Create JWT token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        bloodGroup: newUser.bloodGroup,
        phone: newUser.phone,
        location: newUser.location,
        isDonor: newUser.isDonor,
        isRecipient: newUser.isRecipient,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('REGISTER_ERROR:', err.message, err.stack);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Validation error', details: messages });
    }
    res.status(500).json({ message: err.message || 'Registration failed', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', email);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.warn('Login failed: user not found for email', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('User found, checking password...');
    
    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.warn('Login failed: password mismatch for email', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('Login successful for:', email);

    // Create JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bloodGroup: user.bloodGroup,
        phone: user.phone,
        location: user.location,
        role: user.role,
        isDonor: user.isDonor,
        isRecipient: user.isRecipient
      }
    });
  } catch (err) {
    console.error('LOGIN_ERROR:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get current user (requires token)
router.get('/me', auth, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    bloodGroup: req.user.bloodGroup,
    phone: req.user.phone,
    location: req.user.location,
    role: req.user.role,
    isDonor: req.user.isDonor,
    isRecipient: req.user.isRecipient,
    status: req.user.status
  });
});

// Update profile
router.put('/me', auth, async (req, res) => {
  const allowed = ['name', 'email', 'phone', 'location', 'bloodGroup'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });
  await req.user.save();
  res.json({ message: 'Profile updated', user: req.user });
});

// Change password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password required' });
    }
    const isMatch = await req.user.matchPassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
    req.user.password = newPassword;
    await req.user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating password', error: err.message });
  }
});

// Admin: update user role/status
router.patch('/:id/role', auth, requireRole('admin'), async (req, res) => {
  const { role, status } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (role) user.role = role;
  if (status) user.status = status;
  await user.save();
  res.json({ message: 'User updated', user });
});

// Admin: get all users
router.get('/all-users', auth, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// Logout (frontend removes token from localStorage)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
