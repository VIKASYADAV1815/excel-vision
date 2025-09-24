const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET /api/settings - Get user settings
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/settings/password - Change password
router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: 'Please provide both current and new password' });
    }
    
    // Get user with password
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Save user with new password
    await user.save();
    
    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/settings/profile - Update profile settings
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, email, bio, phone, preferences } = req.body;
    
    // Build update object
    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (bio) updateFields.bio = bio;
    if (phone) updateFields.phone = phone;
    
    // Handle preferences update
    if (preferences) {
      // Get current user to access existing preferences
      const currentUser = await User.findById(req.user.id);
      if (!currentUser) {
        return res.status(404).json({ msg: 'User not found' });
      }
      
      // Merge existing preferences with new ones
      updateFields.preferences = {
        ...currentUser.preferences || {},
        ...preferences
      };
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Error updating profile settings:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/settings/preferences - Update user preferences only
router.put('/preferences', authMiddleware, async (req, res) => {
  try {
    const { theme, emailNotifications, appNotifications } = req.body;
    
    // Get current user to access existing preferences
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Initialize preferences if they don't exist
    if (!user.preferences) {
      user.preferences = {};
    }
    
    // Update specific preference fields if provided
    if (theme !== undefined) user.preferences.theme = theme;
    if (emailNotifications !== undefined) user.preferences.emailNotifications = emailNotifications;
    if (appNotifications !== undefined) user.preferences.appNotifications = appNotifications;
    
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error('Error updating preferences:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;