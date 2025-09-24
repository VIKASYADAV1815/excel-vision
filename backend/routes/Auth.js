const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hash });
    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password are required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ msg: 'Account has been blocked. Please contact administrator.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Update last login time
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log('Login successful for:', email, 'Role:', user.role);
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        name: user.name,
        profilePic: user.profilePic,
        role: user.role
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});



// JWT Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Profile Update Route
router.put('/profile', authMiddleware, async (req, res) => {
  const { username, email } = req.body;
  try {
    // Check if username or email already exists for other users
    if (username || email) {
      const existing = await User.findOne({
        $and: [
          { _id: { $ne: req.user.id } },
          { $or: [{ email }, { username }] }
        ]
      });
      if (existing) {
        return res.status(400).json({ msg: 'Username or email already exists' });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;