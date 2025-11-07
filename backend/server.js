const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/auth', require('./routes/Auth'));
app.use('/api', require('./routes/Data'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/settings', require('./routes/settings'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const cloudinaryStatus = {
    configured: process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_SECRET),
    method: process.env.CLOUDINARY_URL ? 'URL' : 'Separate Variables',
    url: process.env.CLOUDINARY_URL ? 'Set' : 'Not set',
    name: process.env.CLOUDINARY_NAME ? 'Set' : 'Not set',
    apiKey: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set',
    secret: process.env.CLOUDINARY_SECRET ? 'Set' : 'Not set'
  };
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    cloudinary: cloudinaryStatus
  });
});

module.exports = serverless(app);