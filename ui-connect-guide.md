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