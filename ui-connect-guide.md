# UI Server Connection Guide

This guide will help you connect to the PineScript MCP UI server and troubleshoot common connection issues.

## Quick Access Links

- [Server Running on Port 3000](http://localhost:3000) (default port)
- [Server Running on Port 3001](http://localhost:3001) (alternate port)
- [Test Server Running on Port 8000](http://localhost:8000/test-page.html) (testing server)

## How to Connect to the UI Server

After launching the server, you can connect to it using any of the following methods:

### Method 1: Browser Direct Access
Simply open your browser and navigate to one of these URLs:
- http://localhost:3000 (default port)
- http://localhost:3001 (alternate port)

### Method 2: Command Line
Run one of these commands to open the browser automatically:

**PowerShell:**
```powershell
Start-Process 'http://localhost:3001'
```

**Command Prompt:**
```cmd
start http://localhost:3001
```

## Server Options

The project includes multiple server options to ensure you can always access the UI:

### Option 1: Next.js Development Server
Best for development with hot-reloading.

```bash
# Via NPM
npm run ui

# Or direct batch file
run-ui-clean.bat
```

### Option 2: Express Server
More stable alternative when Next.js has issues.

```bash
# Via NPM
npm run ui:express

# Or direct batch file
run-express-server.bat
```

### Option 3: Simple Test Server
Basic HTML server to verify connectivity.

```bash
# Via NPM
npm run ui:test

# Or direct batch file
serve-test-page.bat
```

### Option 4: Desktop Application (Recommended for Connection Issues)
For a standalone application that doesn't require a web server:
```
npm run ui:electron
```
This launches an Electron desktop application with the same functionality, but without requiring any network connectivity or port access.

## Server Status Check

To check if the server is running:

1. **PowerShell:**
   ```powershell
   netstat -ano | findstr "LISTENING" | findstr /C:":3000" /C:":3001"
   ```

2. **Browser Console:**
   ```javascript
   fetch('http://localhost:3001')
     .then(r => console.log('Server running:', r.status))
     .catch(e => console.error('Server error:', e))
   ```

## Troubleshooting

If you cannot connect to the server:

### 1. Firewall Issues
Windows Firewall can block Node.js connections by default.

**Fix:**
- Run `allow-node-firewall.bat` as administrator
- Temporarily disable Windows Firewall
- Check Windows Security for blocked apps

### 2. Port in Use
Another process might be using the required port.

**Fix:**
- Run `run-ui-clean.bat` to kill processes and restart
- For stubborn processes, run `run-ui-admin.bat`
- If needed, restart your computer

### 3. Network Configuration
Local network configuration can sometimes cause issues.

**Fix:**
- Try using IP address `127.0.0.1` instead of `localhost`
- Run `check-connectivity.bat` to diagnose network issues
- Check your hosts file for correct localhost mapping

### 4. Next.js Issues
If you're having trouble with the Next.js server specifically:

**Fix:**
- Try the Express server instead: `npm run ui:express`
- Use the simple test server: `npm run ui:test`
- Delete the `.next` directory and restart: `cd ui && rm -rf .next && npm run dev`

## Utility Scripts Reference

| Script Name | Description | NPM Command |
|-------------|-------------|------------|
| `run-ui-clean.bat` | Start UI server with port cleanup | `npm run ui:clean` |
| `run-ui-admin.bat` | Start UI server with admin rights | `npm run ui:admin` |
| `run-express-server.bat` | Start Express server (alternative) | `npm run ui:express` |
| `serve-test-page.bat` | Start simple HTML test server | `npm run ui:test` |
| `check-connectivity.bat` | Run network diagnostics | `npm run check:network` |
| `allow-node-firewall.bat` | Add Node.js to firewall exceptions | `npm run firewall:allow` |
| `check-windows-firewall.bat` | Check firewall status | `npm run check:firewall` |

### PowerShell Notes

When running commands in PowerShell, use semicolons (`;`) instead of ampersands (`&&`) to chain commands:

```powershell
# WRONG in PowerShell:
cd ui && npm run dev  

# CORRECT in PowerShell:
cd ui; npm run dev
```

## UI Access Options

You have several options for accessing the UI:

1. **Next.js Development Server (default)**
   - Port: 3001
   - URL: http://localhost:3001
   - Command: `npm run ui`

2. **Express Server (alternative)**
   - Port: 3001
   - URL: http://localhost:3001
   - Command: `npm run ui:express`

3. **Simple Test Server**
   - Port: 8000
   - URL: http://localhost:8000/test-page.html
   - Command: `npm run ui:test`

4. **Desktop Application (no web server required)**
   - No port/URL needed - runs as a standalone desktop app
   - Command: `npm run ui:electron`
   - Best option if you're having persistent connection issues

## Quick Connection Test

If you're having trouble connecting to the UI server, try the desktop application option first:

```
npm run ui:electron
```

This runs as a standalone application without requiring a web server or port access, which eliminates most connection issues.

## Web Server Troubleshooting Steps

If you prefer using the web-based UI options:

1. **Check Server Status**
   ```
   npm run check:network
   ```
   This will run diagnostics on your network configuration.

2. **Verify Port Access**
   - Make sure ports 3000 and 3001 are not in use by other applications
   - You can check with:
     ```
     netstat -ano | findstr :3001
     ```
   - To kill processes using the port:
     ```
     npm run clean
     ```

3. **Check Windows Firewall**
   ```
   npm run check:firewall
   ```
   This will verify your firewall settings.

4. **Add Node.js to Firewall Exceptions**
   ```
   npm run firewall:allow
   ```
   This will add Node.js to your Windows Firewall exceptions.

## Server Options

### Option 1: Clean Start
For a clean start that resolves port conflicts automatically:
```
npm run ui:clean
```
This script will:
- Check for processes using port 3001
- Kill any conflicting processes
- Start the Next.js development server

### Option 2: Express Server
For a lightweight alternative server:
```
npm run ui:express
```
This uses Express.js instead of Next.js for a more stable server.

### Option 3: Simple Test Server
To just verify browser connectivity:
```
npm run ui:test
```
This serves a simple HTML test page on port 8000.

### Option 4: Desktop Application (Recommended for Connection Issues)
For a standalone application that doesn't require a web server:
```
npm run ui:electron
```
This launches an Electron desktop application with the same functionality, but without requiring any network connectivity or port access.

## Common Issues and Solutions

### "Cannot connect to server"
- Try using the desktop application option: `npm run ui:electron`
- Check if the server is running
- Verify firewall settings
- Try a different browser
- Try using 127.0.0.1 instead of localhost

### "Address already in use"
- Run `npm run clean` to kill processes using the port
- Run `npm run ui:clean` for a clean start

### "Connection refused"
- Check if your firewall is blocking the connection
- Run `npm run firewall:allow` to add Node.js to exceptions
- Try the desktop application option: `npm run ui:electron`

### Browser shows blank page
- Check browser console for errors
- Try disabling browser extensions
- Try a different browser
- Try the desktop application option: `npm run ui:electron`

### Slow page loading
- Check your network connection
- Try closing other applications that use the network
- Try the desktop application option for a local experience: `npm run ui:electron`

## Advanced Diagnostics

If you're still having issues:

1. **Run the comprehensive diagnostics**
   ```
   npm run check:network
   ```

2. **Check Windows hosts file**
   Make sure localhost is properly mapped to 127.0.0.1 in your hosts file

3. **Test with a minimal server**
   ```
   npm run ui:test
   ```
   Then try accessing http://localhost:8000/test-page.html

4. **Try the desktop application**
   ```
   npm run ui:electron
   ```
   This completely bypasses network connectivity requirements

## Need More Help?

If you've tried these steps and still can't connect:

1. Run `npm run check:network` and share the output
2. Check if the desktop application option works for you
3. Contact support with details of your system configuration and the error messages you're seeing 