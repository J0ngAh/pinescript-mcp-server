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

## Starting the Server

Use one of these scripts to start the server:

1. **Standard Start:**
   ```
   run-ui-clean.bat
   ```

2. **Administrator Mode** (for better process management):
   ```
   run-ui-admin.bat
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

### 4. Simple Test Server
If you're having trouble with the Next.js server, try the simple test server to check basic connectivity:

```
serve-test-page.bat
```

Then access http://localhost:8000/test-page.html

## Utility Scripts Reference

| Script Name | Description | NPM Command |
|-------------|-------------|------------|
| `run-ui-clean.bat` | Start UI server with port cleanup | `npm run ui:clean` |
| `run-ui-admin.bat` | Start UI server with admin rights | `npm run ui:admin` |
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