const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: 'https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png' },
  bio: { type: String, default: '' },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isBlocked: { type: Boolean, default: false },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
    emailNotifications: { type: Boolean, default: true },
    appNotifications: { type: Boolean, default: true }
  }
});

module.exports = mongoose.model('User', UserSchema);