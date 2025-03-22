# PineScript MCP UI

The web interface for the PineScript MCP project, built with Next.js.

## Project Setup

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Server Configuration

The Next.js server is configured to run on port 3001 by default. This can be changed in the `package.json` file:

```json
"scripts": {
  "dev": "next dev -H 127.0.0.1 -p 3001",
  ...
}
```

## Starting the Server

### Method 1: Using npm

```bash
npm run dev
```

### Method 2: Using Batch Scripts

The root directory contains several batch scripts for starting the server:

- `run-ui-clean.bat` - Cleans up existing processes and starts the server
- `run-ui-admin.bat` - Starts the server with administrator privileges

## Pages

The UI consists of several main pages:

- `/` - Home page with overview and quick actions
- `/analyze` - Strategy analyzer page
- `/strategies` - Strategy management page
- `/backtest-results` - Backtest results visualization

## Troubleshooting

### Port Already in Use

If you encounter a "Port already in use" error, use the `run-ui-clean.bat` script to kill any processes using the port.

### Server Not Responding

If the server starts but the browser shows a blank page or spinning loader:

1. Check if your Windows Firewall is blocking the connection
2. Run `allow-node-firewall.bat` to add a firewall exception
3. Verify you can connect to `http://localhost:3001` in your browser

### Server Testing

To test basic connectivity without Next.js, use:

```bash
# From the root directory
./serve-test-page.bat
```

Then access `http://localhost:8000/test-page.html` in your browser.

## Development Notes

- The UI uses React and Next.js
- Styling is done with Tailwind CSS
- State management uses React Context API

## Building for Production

```bash
npm run build
npm start
```

# PineScript Project - UI

This is the UI component of the PineScript Project, featuring visualization tools for backtesting results and strategy analysis.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Windows PowerShell or Command Prompt
- Modern web browser (Chrome, Firefox, or Edge)

### Running the UI Server Reliably

We've created robust scripts to ensure consistent server operation and resolve IP address instability:

#### Option 1: Command Prompt Method (Recommended for Windows Users)

1. **Navigate to the UI directory**:
   ```
   cd ui
   ```

2. **Run the direct starter batch file**:
   ```
   direct-start.bat
   ```
   
   This script will:
   - Free up port 3000 if it's in use
   - Create proper configuration files
   - Clean the Next.js cache
   - Start the server with explicit host and port settings

#### Option 2: PowerShell Method

1. **Navigate to the UI directory**:
   ```powershell
   cd ui
   ```

2. **Run the simplified server script**:
   ```powershell
   .\start-server-fixed.ps1
   ```

## 🔍 Troubleshooting Connection Issues

If you encounter a "Connection Refused" error or other connection problems:

### Option 1: Run Diagnostics (Command Prompt)

1. Open Command Prompt and navigate to the UI directory:
   ```
   cd ui
   ```

2. Run the diagnostics tool:
   ```
   run-diagnostics.bat
   ```

3. Follow the recommendations provided by the diagnostic tool

### Option 2: Run Diagnostics (PowerShell)

1. Open PowerShell and navigate to the UI directory:
   ```powershell
   cd ui
   ```

2. Run the troubleshooting script:
   ```powershell
   .\server-troubleshoot.ps1
   ```

### Common Solutions

1. **Fix localhost Resolution**:
   - Run Command Prompt as Administrator
   - Run: `echo 127.0.0.1 localhost >> %WINDIR%\System32\drivers\etc\hosts`
   
   **OR**
   
   - Run PowerShell as Administrator
   - Run: `.\hosts-fix.ps1`

2. **Access via Direct IP**:
   - Use `http://127.0.0.1:3000` instead of `http://localhost:3000`

3. **Check Windows Firewall**:
   - Ensure Windows Firewall is not blocking port 3000
   - Temporarily disable firewall to test if it's the issue

4. **Clean Next.js Cache**:
   - Remove the `.next` directory and restart the server

## 📚 Testing Plan

See [testing-plan.md](./testing-plan.md) for a comprehensive testing approach.

## 📦 Project Structure

- `components/` - React components
- `pages/` - Next.js pages for routing
- `public/` - Static assets
- `styles/` - CSS and styling
- `tests/` - Test scripts and configurations

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linting
- `npm run test` - Run tests

## 📊 Features

- Backtest results visualization
- Strategy comparison tools
- Performance metrics display
- Interactive charts
- Strategy analyzer

## 💻 Helper Scripts

- `direct-start.bat` - Command Prompt script to start the server
- `run-diagnostics.bat` - Command Prompt script to diagnose issues
- `start-server-fixed.ps1` - PowerShell script to start the server
- `server-troubleshoot.ps1` - PowerShell script to diagnose issues
- `hosts-fix.ps1` - PowerShell script to fix localhost resolution 