const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

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

router.put('/updateIncome', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { income } = req.body;
    await User.findByIdAndUpdate(userId, { income });
    res.status(200).json({ message: "Income updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating income", error });
  }
});

router.get('/user', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password'); 
      res.json(user);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
