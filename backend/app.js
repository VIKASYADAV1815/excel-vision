const express = require('express');
const app = express();
const cors = require('cors');

// Middleware
app.use(express.json());
app.use(cors());

// Importing routes
const profileRoutes = require('./routes/profile');
const settingsRoutes = require('./routes/settings');

// Using routes
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);

// ...existing code for other routes and middleware

module.exports = app;