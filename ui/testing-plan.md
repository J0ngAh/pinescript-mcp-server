# Local Web Server Testing Plan

## Overview
This testing plan ensures the PineScript Project web UI runs consistently as a local web server with a stable connection. It addresses IP address consistency, server configuration, and validation methods.

## Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Windows PowerShell
- Modern web browser (Chrome, Firefox, or Edge)

## Environment Setup

### 1. Server Configuration
- **Fixed IP and Port**: 127.0.0.1:3000
- **Environment Variables**: Set in `.env.local`
- **Next.js Configuration**: Modified in `next.config.js`

### 2. Initial Setup Tests
- [ ] Verify Node.js version: `node -v`
- [ ] Verify npm version: `npm -v`
- [ ] Verify package installation: `cd ui; npm list next`
- [ ] Verify network interface: `ipconfig`

## Test Execution

### 1. Server Startup Tests
```powershell
# Navigate to the ui directory
cd ui

# Install dependencies if needed
npm install

# Start the development server
npm run dev
```

- [ ] Verify server starts without errors
- [ ] Verify server binds to 127.0.0.1:3000
- [ ] Verify console shows no connection errors

### 2. Connection Tests
- [ ] Access http://127.0.0.1:3000 in browser
- [ ] Access http://localhost:3000 in browser
- [ ] Test all major routes:
  - [ ] Home page (/)
  - [ ] Strategies page (/strategies)
  - [ ] Backtest Results page (/backtest-results)
  - [ ] Analyze page (/analyze)

### 3. Stability Tests
- [ ] Leave server running for 30 minutes
- [ ] Refresh pages multiple times
- [ ] Navigate between pages rapidly
- [ ] Open multiple browser tabs to different routes

### 4. Cross-Browser Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Edge

## Troubleshooting Procedures

### Connection Refused Issues
1. **Check if server is running**: 
   ```powershell
   Get-Process -Name node
   ```

2. **Check if port is already in use**: 
   ```powershell
   netstat -ano | findstr :3000
   ```

3. **Kill process using the port if needed**: 
   ```powershell
   taskkill /PID [PID] /F
   ```

4. **Check Windows Firewall**: 
   - Ensure port 3000 is allowed in Windows Firewall
   - Add exception if needed

### Server Start Failure
1. **Clean Next.js cache**:
   ```powershell
   cd ui
   rm -r -force .next
   npm run dev
   ```

2. **Reinstall dependencies**:
   ```powershell
   cd ui
   rm -r -force node_modules
   npm install
   npm run dev
   ```

## Hosts File Configuration (Optional)
If localhost resolution is inconsistent, update the hosts file:

1. Open PowerShell as Administrator
2. Edit hosts file:
   ```powershell
   notepad C:\Windows\System32\drivers\etc\hosts
   ```
3. Add or ensure the following entry:
   ```
   127.0.0.1 localhost
   ```

## Performance Monitoring
- Monitor CPU/Memory usage during server operation
- Monitor network traffic and response times
- Check for memory leaks during extended operation

## Documentation
Record all test results, including:
- Screenshots of successful connections
- Error messages if encountered
- System configuration details
- Browser version information

## Reporting
Create a test report with:
- Summary of all tests performed
- Pass/fail status for each test
- Observed issues and their resolution
- Recommendations for improving reliability 