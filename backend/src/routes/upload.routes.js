// backend/src/routes/upload.routes.js
const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Define routes with explicit POST method
router.post('/upload', uploadController.upload, uploadController.uploadFile);
router.get('/status/:jobId', uploadController.getJobStatus);
router.get('/results/:jobId', uploadController.getResults);
router.get('/export/:jobId', uploadController.exportResults);

// Debug route to verify routes are loaded
router.get('/test', (req, res) => {
  res.json({ message: 'Phase1 routes working' });
});

module.exports = router;