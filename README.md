# PineScript MCP Project

A comprehensive tool for creation, optimization, and management of PineScript trading strategies.

## Project Structure

```
├── src/             # Core application code
├── ui/              # Next.js web interface
├── dist/            # Compiled JavaScript
├── docs/            # Documentation
├── scripts/         # Utility scripts
│   ├── server/      # Server management scripts
│   ├── network/     # Network diagnostics scripts
│   └── docs/        # Documentation
├── data/            # Data files
├── tests/           # Application tests
├── examples/        # Example scripts and strategies
└── memory-bank/     # Project context and information
```

## Quick Start

1. Install dependencies:
   ```
   npm install
   ```

2. Start the UI (choose one method):
   ```
   # Standard Next.js development server
   npm run ui
   
   # Clean start with port cleanup
   npm run ui:clean
   
   # Alternative Express server (if Next.js has issues)
   npm run ui:express
   
   # Desktop app (no web server required)
   npm run ui:electron
   ```

3. Access the web interface at:
   ```
   http://localhost:3001
   ```
   (Not required for the desktop app option)

## UI Options

The project includes multiple ways to access the UI:

### 1. Next.js Development Server
```bash
# Standard Next.js dev server
npm run ui

# Clean start (kills any existing processes using the ports)
npm run ui:clean

# Start with administrator privileges (for stubborn processes)
npm run ui:admin
```

### 2. Alternative Server Options
```bash
# Simple Express server (more stable alternative)
npm run ui:express

# Basic HTML test page server
npm run ui:test
```

### 3. Desktop Application
For environments where web servers have connectivity issues:
```bash
# Electron desktop application (no web server required)
npm run ui:electron
```

### Troubleshooting UI Server

If you experience connection issues with the UI server:

1. Check your firewall settings
2. Run the firewall exception script: `npm run firewall:allow`
3. See the `scripts/docs/ui-connect-guide.md` for detailed connection troubleshooting
4. Try the desktop app option: `npm run ui:electron`

## Utility Scripts

The repository includes several utility scripts to help with development and troubleshooting:

### Essential Server Scripts (in scripts/server/)
- `run-ui-clean.bat` - Main script to start the UI server (cleans up existing processes)
- `run-ui-admin.bat` - Starts the UI server with administrator privileges
- `serve-test-page.bat` - Serves a simple HTML test page on port 8000 to test connectivity
- `run-express-server.bat` - Starts an Express server as an alternative to Next.js
- `run-electron-app.bat` - Starts the Electron desktop application (no web server required)

### Network Troubleshooting (in scripts/network/)
- `check-connectivity.bat` - Comprehensive network connectivity diagnostics
- `check-windows-firewall.bat` - Check firewall status and rules
- `allow-node-firewall.bat` - Add Node.js to Windows Firewall exceptions
- `test-network-connection.bat` - Test specific network connections
- `test-port-3000.bat` - Test if port 3000 is available
- `kill-port-3000.bat` - Kill any process using port 3000

### Documentation (in scripts/docs/)
- `ui-connect-guide.md` - Comprehensive guide to UI connectivity troubleshooting
- `README-UI.md` - UI-specific documentation

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

### Building the Project

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Features

- Strategy creation and editing
- Backtesting capabilities
- Performance analysis
- Strategy optimization
- TradingView integration

## Claude Desktop Integration

The PineScript MCP Server can be integrated with Claude Desktop to provide AI-assisted PineScript development capabilities.

### Quick Start (macOS)

```bash
# Install and configure with one command
npx pinescript-mcp-server

# Or add to Claude Desktop
claude mcp add pinescript-server npx --args pinescript-mcp-server
```

### Quick Start (Windows)

```bash
# Add to Claude Desktop with Windows-specific wrapper
claude mcp add pinescript-server cmd --args /c npx pinescript-mcp-server
```

### Documentation

For detailed setup instructions, platform-specific configurations, and troubleshooting:
- See [CLAUDE_DESKTOP_SETUP.md](./CLAUDE_DESKTOP_SETUP.md)

### Example Configurations

- [.mcp.json.example](./.mcp.json.example) - Basic configuration
- [.mcp.json.mac.example](./.mcp.json.mac.example) - macOS-specific example
- [.mcp.json.windows.example](./.mcp.json.windows.example) - Windows-specific example

### Features Available in Claude Desktop

When integrated with Claude Desktop, you can:
- Create and edit PineScript strategies
- Run backtests and analyze performance
- Optimize trading parameters
- Generate TradingView-compatible code
- Access real-time market data (with proper API configuration)

## Documentation

See the `docs/` directory for detailed documentation on:
- API Reference
- User Guide
- Development Guide

## License

This project is proprietary and confidential.

Copyright © 2025. All rights reserved. 