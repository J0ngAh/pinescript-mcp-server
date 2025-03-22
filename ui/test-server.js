// Simple test server to verify connectivity
const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>PineScript MCP Test Server</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #0066cc; }
        .success { color: #00cc00; font-weight: bold; }
        .container { max-width: 800px; margin: 0 auto; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>PineScript MCP Test Server is Running!</h1>
        <p class="success">✓ Connection successful</p>
        <p>If you can see this page, your server is properly accessible at:</p>
        <ul>
          <li>URL: <strong>http://127.0.0.1:3001</strong></li>
          <li>Server time: ${new Date().toLocaleString()}</li>
        </ul>
        <p>This is a simple test server to verify that your system can:</p>
        <ol>
          <li>Bind to the correct IP/port</li>
          <li>Accept incoming connections</li>
          <li>Serve content through HTTP</li>
        </ol>
      </div>
    </body>
    </html>
  `);
});

const PORT = 3001;
const HOST = '127.0.0.1';

server.listen(PORT, HOST, () => {
  console.log(`Test server running at http://${HOST}:${PORT}/`);
  console.log('Press Ctrl+C to stop the server');
});

// Log any errors
server.on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please close the application using this port or try a different port.`);
  }
}); 