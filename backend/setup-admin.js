const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

// Admin credentials
const adminEmail = 'vikasyadav151817@gmail.com';
const adminPassword = 'vikasyadav1518';
const adminUsername = 'vikas';

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('Admin user already exists. Updating role to admin...');
      
      // Update existing user to admin role
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      
      console.log('User updated to admin role successfully!');
      process.exit(0);
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      // Create new admin user
      const adminUser = new User({
        username: adminUsername,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        name: 'Vikas Admin',
        profilePic: 'https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png'
      });
      
      await adminUser.save();
      console.log('Admin user created successfully!');
      process.exit(0);
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();