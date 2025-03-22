/**
 * Simple Express Server for PineScript MCP UI
 * 
 * This server provides a fallback option if Next.js server isn't working.
 * It can serve:
 * 1. Static files from the Next.js build output
 * 2. The test HTML page
 * 3. React build output if using a standard React build
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Check if we have a Next.js build output
const nextBuildPath = path.join(__dirname, '.next/server/pages');
const hasBuildOutput = fs.existsSync(nextBuildPath);

if (hasBuildOutput) {
  console.log('Next.js build detected - serving Next.js static output');
  app.use('/_next', express.static(path.join(__dirname, '.next')));
  
  // Serve Next.js static files
  app.use(express.static(path.join(__dirname, 'public')));
} else {
  console.log('No Next.js build detected - serving basic static files');
}

// Always serve the test page
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-page.html'));
});

// Serve test-page.html at the root as a fallback
app.get('/', (req, res) => {
  if (hasBuildOutput) {
    // Try to send the Next.js index page if available
    const indexPath = path.join(__dirname, '.next/server/pages/index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  
  // Otherwise, send the test page
  res.sendFile(path.join(__dirname, 'test-page.html'));
});

// Start the server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`
========================================
  SIMPLE EXPRESS SERVER
========================================
  
Server running at:
- http://localhost:${PORT}/
- http://localhost:${PORT}/test

Press Ctrl+C to stop the server
  `);
}); 