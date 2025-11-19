// backend/src/test-phase2.js
// Run this to test if Phase 2 is properly set up

const express = require('express');
const app = express();

app.use(express.json());

// Test jobStorage
try {
  const jobStorage = require('./utils/jobStorage');
  console.log('✓ jobStorage module loaded');
  
  // Test set/get
  jobStorage.set('test-job', { data: 'test' });
  const retrieved = jobStorage.get('test-job');
  if (retrieved && retrieved.data === 'test') {
    console.log('✓ jobStorage set/get working');
  } else {
    console.log('✗ jobStorage set/get failed');
  }
} catch (error) {
  console.log('✗ jobStorage error:', error.message);
}

// Test Phase 2 controller
try {
  const phase2Controller = require('./controllers/phase2Controller');
  console.log('✓ phase2Controller loaded');
  
  if (typeof phase2Controller.processPhase2Analysis === 'function') {
    console.log('✓ processPhase2Analysis function exists');
  }
  if (typeof phase2Controller.getPhase2Results === 'function') {
    console.log('✓ getPhase2Results function exists');
  }
} catch (error) {
  console.log('✗ phase2Controller error:', error.message);
}

// Test Phase 2 routes
try {
  const phase2Routes = require('./routes/phase2.routes');
  console.log('✓ phase2.routes loaded');
} catch (error) {
  console.log('✗ phase2.routes error:', error.message);
}

// Test the complete app
try {
  const mainApp = require('./app');
  console.log('✓ Main app loaded');
  
  // Start test server
  const PORT = 3002;
  const server = mainApp.listen(PORT, () => {
    console.log(`\n✓ Test server running on port ${PORT}`);
    console.log('\nTesting endpoints:');
    
    // Test with fetch
    const testEndpoints = async () => {
      try {
        // Test Phase 2 test endpoint
        const response = await fetch(`http://localhost:${PORT}/api/phase2/test`);
        const data = await response.json();
        console.log('✓ Phase 2 test endpoint:', data.message);
      } catch (error) {
        console.log('✗ Phase 2 test endpoint failed:', error.message);
      }
      
      // Close server
      server.close(() => {
        console.log('\nTest complete!');
        process.exit(0);
      });
    };
    
    testEndpoints();
  });
} catch (error) {
  console.log('✗ Main app error:', error.message);
}