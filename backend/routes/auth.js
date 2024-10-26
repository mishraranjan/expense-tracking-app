// src/routes/auth.js

// Existing imports
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register route
router.post('/register', async (req, res) => {
  const { username, password, income } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, income });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

// Get user data
router.get('/user', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password'); // Exclude password
      res.json(user);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });

// Logout route
router.post('/logout', (req, res) => {
  // No server-side action needed for JWT logout
  res.json({ message: 'Logout successful' });
});

module.exports = router;
