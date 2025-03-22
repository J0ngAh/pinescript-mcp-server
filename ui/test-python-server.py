"""
Simple HTTP Server to test connectivity
Run with: python test-python-server.py
Access at: http://localhost:8000
"""

import http.server
import socketserver
import socket
import time
import webbrowser
from datetime import datetime
import os

PORT = 8000

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.end_headers()
        
        hostname = socket.gethostname()
        ip = socket.gethostbyname(hostname)
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Python Test Server</title>
            <style>
                body {{ font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; }}
                h1 {{ color: #3366cc; }}
                .success {{ color: green; font-weight: bold; }}
                .server-info {{ background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <h1>Python HTTP Server Test Page</h1>
            
            <p class="success">✓ CONNECTION SUCCESSFUL! The Python HTTP server is running and responding.</p>
            
            <div class="server-info">
                <h2>Server Information</h2>
                <p><strong>Server Time:</strong> {now}</p>
                <p><strong>Hostname:</strong> {hostname}</p>
                <p><strong>Local IP:</strong> {ip}</p>
                <p><strong>Port:</strong> {PORT}</p>
                <p><strong>Request Path:</strong> {self.path}</p>
                <p><strong>Your Browser:</strong> {self.headers.get('User-Agent')}</p>
            </div>
            
            <p>Since you can view this page, your network connection is working correctly for this server.</p>
            <p>This is a simple Python HTTP server, which is often easier to set up than Node.js or Next.js servers.</p>
            
            <p><strong>To stop this server:</strong> Press Ctrl+C in the terminal window where it's running.</p>
        </body>
        </html>
        """
        
        self.wfile.write(bytes(html, "utf8"))
        return

def check_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

if __name__ == "__main__":
    # Check if port is already in use
    if check_port_in_use(PORT):
        print(f"WARNING: Port {PORT} is already in use!")
        print("Try changing the PORT variable in the script or close the application using this port.")
        time.sleep(5)
        exit(1)
    
    print(f"Starting Python HTTP server on port {PORT}...")
    
    # Create the server
    Handler = MyHttpRequestHandler
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"Server started at http://localhost:{PORT}")
            print("You can access it in your browser at:")
            print(f"  → http://localhost:{PORT}")
            print(f"  → http://127.0.0.1:{PORT}")
            
            # Try to open the browser automatically
            try:
                webbrowser.open(f"http://localhost:{PORT}")
            except:
                pass
                
            print("\nPress Ctrl+C to stop the server")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except Exception as e:
        print(f"Error starting server: {e}")
        
        # If permission denied, suggest running as admin
        if "permission" in str(e).lower():
            print("\nTIP: Try running this script as administrator if you're getting permission errors.")
        
        time.sleep(5) 