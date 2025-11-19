// backend/src/server.js
const app = require('./app');
const logger = require('./config/logger');

// Use 3001 for local dev, 8080 for production (Cloud Run)
// Cloud Run will set PORT=8080 automatically
const PORT = process.env.NODE_ENV === 'production' 
  ? (process.env.PORT || 8080)
  : (process.env.PORT ? parseInt(process.env.PORT) : 3001);

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 API Endpoints:`);
  console.log(`   - Health: http://localhost:${PORT}/api/health`);
  console.log(`   - Phase 1: http://localhost:${PORT}/api/phase1`);
  console.log(`   - Phase 2: http://localhost:${PORT}/api/phase2`);
  console.log(`   - Phase 3: http://localhost:${PORT}/api/phase3`);
  logger.info(`Server started on port ${PORT}`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

module.exports = server;