// Simple HTTP server for testing connectivity
const http = require('http');

// Create server
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test Server</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #0066cc; }
        .success { color: #00cc00; font-weight: bold; }
        .container { max-width: 800px; margin: 0 auto; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Test Server is Running!</h1>
        <p class="success">✓ Connection successful</p>
        <p>If you can see this page, your server is properly accessible at:</p>
        <ul>
          <li>URL: <strong>http://127.0.0.1:3000</strong></li>
          <li>Server time: ${new Date().toLocaleString()}</li>
        </ul>
        <h2>Next Steps</h2>
        <p>Now that we've verified basic connectivity, you can:</p>
        <ol>
          <li>Stop this test server (Ctrl+C in terminal)</li>
          <li>Start your Next.js application properly</li>
          <li>Troubleshoot any remaining issues</li>
        </ol>
      </div>
    </body>
    </html>
  `);
});

// Start server
const PORT = 3000;
const HOST = '127.0.0.1';

server.listen(PORT, HOST, () => {
  console.log(`Test server running at http://${HOST}:${PORT}/`);
  console.log('Press Ctrl+C to stop the server');
}); 