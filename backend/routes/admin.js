const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Admin middleware to check if user is admin
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all users (admin only)
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user statistics (admin only)
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isBlocked: false });
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });
    
    // Get users who logged in recently (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const recentlyActive = await User.countDocuments({ 
      lastLogin: { $gte: oneDayAgo } 
    });
    
    res.json({
      totalUsers,
      activeUsers,
      blockedUsers,
      adminUsers,
      recentRegistrations,
      recentlyActive
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Block/Unblock user (admin only)
router.put('/users/:id/block', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { isBlocked } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json({ 
      msg: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user 
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update user role (admin only)
router.put('/users/:id/role', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json({ 
      msg: `User role updated to ${role} successfully`,
      user 
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user activity (admin only)
router.get('/users/:id/activity', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // In a real application, you would fetch user activity from logs/analytics
    // For now, we'll return basic user info with mock activity data
    const activity = {
      user,
      loginHistory: [
        // Mock data - in real app, this would come from login logs
        { date: user.lastLogin || user.createdAt, action: 'Login', ip: '192.168.1.1' }
      ],
      uploadCount: 0, // This would be fetched from uploads collection
      lastActivity: user.lastLogin || user.createdAt
    };
    
    res.json(activity);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;