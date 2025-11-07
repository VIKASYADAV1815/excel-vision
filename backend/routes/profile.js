const express = require('express');
const router = express.Router();
const { upload, uploadToCloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// POST /api/profile/photo - Upload profile picture
// Accept frontend field name 'profilePic' for consistency
router.post('/photo', authMiddleware, upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // Upload to Cloudinary or save locally
    const userId = req.user.id;
    const timestamp = Date.now();
    const publicId = `profile_${userId}_${timestamp}`;
    
    let result;
    try {
      result = await uploadToCloudinary(req.file.buffer, {
        public_id: publicId,
        folder: 'profile-pictures'
      });
    } catch (uploadError) {
      console.error('Upload error:', uploadError);
      return res.status(500).json({ 
        msg: isCloudinaryConfigured ? 'Failed to upload to Cloudinary' : 'Failed to save image locally',
        error: uploadError.message 
      });
    }

    // Update user's profile picture in database
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePic: result.secure_url },
      { new: true }
    ).select('-password');

    res.json({ 
      msg: 'Profile picture updated successfully',
      url: result.secure_url,
      publicId: result.public_id,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        bio: user.bio,
        phone: user.phone,
        profilePic: user.profilePic,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Profile picture upload error:', err);
    res.status(500).json({ 
      msg: 'Server error',
      error: err.message 
    });
  }
});

// GET /api/profile - Get user profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      bio: user.bio,
      phone: user.phone,
      profilePic: user.profilePic,
      role: user.role,
      isBlocked: user.isBlocked,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      preferences: user.preferences
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/profile - Update user profile
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { email, username, name, bio, phone } = req.body;
    
    // Create update object with only provided fields
    const updateData = {};
    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (phone !== undefined) updateData.phone = phone;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('-password');
    
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      bio: user.bio,
      phone: user.phone,
      profilePic: user.profilePic,
      role: user.role,
      isBlocked: user.isBlocked,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      preferences: user.preferences
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;