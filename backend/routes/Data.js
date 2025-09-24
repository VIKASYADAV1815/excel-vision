const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Upload = require('../models/Upload');
const authMiddleware = require('../middleware/auth');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// --- Upload file ---
router.post('/uploads', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    console.log('POST /uploads called. Body:', req.body);
    const file = req.file;
    if (!file) return res.status(400).json({ msg: 'No file uploaded' });
    // Parse chartType, labels, data from body (labels/data may be JSON strings)
    let chartType = req.body.chartType || 'Bar';
    let labels = req.body.labels;
    let data = req.body.data;
    try {
      if (typeof labels === 'string') labels = JSON.parse(labels);
      if (typeof data === 'string') data = JSON.parse(data);
    } catch (e) {
      labels = [];
      data = [];
    }
    const uploadDoc = new Upload({
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
      user: req.user.id,
      chartType,
      labels,
      data
    });
    await uploadDoc.save();
    console.log('Saved upload:', uploadDoc);
    res.status(201).json(uploadDoc);
  } catch (err) {
    console.log('Error in POST /uploads:', err);
    res.status(500).json({ msg: 'Upload failed', error: err.message });
  }
});

// --- Get all uploads ---
router.get('/uploads', authMiddleware, async (req, res) => {
  try {
    const uploads = await Upload.find({ user: req.user.id }).sort({ date: -1 });
    res.json(uploads.map(u => ({
      id: u._id,
      filename: u.originalname,
      date: u.date.toISOString().slice(0, 10),
      url: `/api/download/${u._id}`
    })));
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch uploads', error: err.message });
  }
});

// --- KPIs ---
router.get('/kpis', authMiddleware, async (req, res) => {
  try {
    const totalUploads = await Upload.countDocuments({ user: req.user.id });
    const recentUpload = await Upload.findOne({ user: req.user.id }).sort({ date: -1 });
    // You can add more KPIs as needed
    const kpis = [
      { label: 'Total Uploads', value: totalUploads, icon: '📁' },
      { label: 'Recent Upload', value: recentUpload ? recentUpload.date.toISOString().slice(0, 10) : '-', icon: '⏰' },
    ];
    res.json(kpis);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch KPIs', error: err.message });
  }
});

// --- History ---
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const uploads = await Upload.find({ user: req.user.id }).sort({ date: -1 });
    console.log('GET /history for user', req.user.id, 'found uploads:', uploads.length);
    const history = uploads.map(u => ({
      id: u._id,
      filename: u.originalname,
      date: u.date.toISOString().slice(0, 10),
      chartType: u.chartType || 'Bar',
      labels: u.labels || [],
      data: u.data || [],
      fileId: u._id
    }));
    res.json(history);
  } catch (err) {
    console.log('Error in GET /history:', err);
    res.status(500).json({ msg: 'Failed to fetch history', error: err.message });
  }
});

// --- Delete upload/history item ---
router.delete('/history/:id', authMiddleware, async (req, res) => {
  try {
    console.log('DELETE /history/:id called with:', req.params.id, 'by user', req.user.id);
    const upload = await Upload.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!upload) {
      console.log('No upload found for this ID and user.');
      return res.status(404).json({ msg: 'Upload not found' });
    }
    console.log('Upload deleted:', upload._id);
    res.json({ msg: 'Upload deleted' });
  } catch (err) {
    console.log('Error deleting upload:', err);
    res.status(500).json({ msg: 'Failed to delete upload', error: err.message });
  }
});

// --- Download ---
router.get('/download/:fileId', async (req, res) => {
  try {
    const file = await Upload.findById(req.params.fileId);
    if (!file) return res.status(404).json({ msg: 'File not found' });
    res.download(file.path, file.originalname);
  } catch (err) {
    res.status(500).json({ msg: 'Download failed', error: err.message });
  }
});

module.exports = router; 