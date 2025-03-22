// Ultra-simple HTTP server with minimal configuration
const http = require('http');

// Create a basic server with minimal options
const server = http.createServer((req, res) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  
  // Set headers to prevent caching issues
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Send a very simple response
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Simple Server</title>
        <style>
          body { font-family: sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; }
          h1 { color: green; }
        </style>
      </head>
      <body>
        <h1>Server is working!</h1>
        <p>This simple server is running on port 8080.</p>
        <p>Current time: ${new Date().toLocaleString()}</p>
        <p>Request URL: ${req.url}</p>
        <p>User Agent: ${req.headers['user-agent'] || 'Unknown'}</p>
      </body>
    </html>
  `);
});

// Use port 8080 instead as it's less likely to have conflicts
const PORT = 8080;

// Listen on all interfaces
server.listen(PORT, '0.0.0.0', () => {
  console.log('==================================');
  console.log(`Simple server running on port ${PORT}`);
  console.log(`Try accessing:`);
  console.log(`http://localhost:${PORT}`);
  console.log(`http://127.0.0.1:${PORT}`);
  console.log('==================================');
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err.message);
  
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    console.error(`Try changing the PORT value in the script.`);
  }
}); 