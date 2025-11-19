const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const uploadController = require('../controllers/uploadController');
const FileSecurity = require('../utils/fileSecurity');
// const { authenticateToken } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_TEMP_DIR || './uploads');
  },
  filename: function (req, file, cb) {
    // Generate secure filename
    const secureFilename = FileSecurity.generateSecureFilename(file.originalname);
    cb(null, secureFilename);
  }
});

// File filter to only accept Excel and CSV files
const fileFilter = (req, file, cb) => {
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || '.xlsx,.xls,.xlsb,.csv').split(',');
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 50) * 1024 * 1024 // Convert MB to bytes
  }
});

/**
 * POST /api/phase1/upload
 * Upload and process inventory file
 * 
 * Note: authenticateToken middleware is commented out for initial development
 * Uncomment when authentication service is ready
 */
router.post('/', 
  // authenticateToken,  // Uncomment when auth is ready
  upload.single('file'),
  uploadController.uploadFile
);

/**
 * GET /api/phase1/upload/status/:jobId
 * Check upload processing status
 */
router.get('/status/:jobId', 
  // authenticateToken,  // Uncomment when auth is ready
  uploadController.getUploadStatus
);

/**
 * GET /api/phase1/upload/jobs
 * List all upload jobs for the current tenant
 */
router.get('/jobs',
  // authenticateToken,  // Uncomment when auth is ready
  uploadController.listUploadJobs
);

/**
 * DELETE /api/phase1/upload/jobs/:jobId
 * Cancel or delete an upload job
 */
router.delete('/jobs/:jobId',
  // authenticateToken,  // Uncomment when auth is ready
  uploadController.deleteUploadJob
);

module.exports = router;