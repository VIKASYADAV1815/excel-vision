const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  path: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  chartType: { type: String, default: 'Bar' }, // Chart type for this upload
  labels: { type: [String], default: [] },     // X-axis labels for chart
  data: { type: [Number], default: [] },       // Y-axis data for chart
});

module.exports = mongoose.model('Upload', UploadSchema); 