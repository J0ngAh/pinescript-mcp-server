# PineScript MCP Project

A comprehensive tool for creation, optimization, and management of PineScript trading strategies.

## Project Structure

```
├── src/             # Core application code
├── ui/              # Next.js web interface
├── dist/            # Compiled JavaScript
├── docs/            # Documentation
├── tests/           # Application tests
├── examples/        # Example scripts and strategies
└── memory-bank/     # Project context and information
```

## Quick Start

1. Install dependencies:
   ```
   npm install
   ```

2. Start the UI server:
   ```
   npm run ui
   ```
   or
   ```
   ./run-ui-clean.bat
   ```

3. Access the web interface at:
   ```
   http://localhost:3001
   ```

## UI Server

The project includes a Next.js-based UI for interacting with the PineScript tools. To start the UI server:

```bash
# Clean start (kills any existing processes using the ports)
./run-ui-clean.bat

# Start with administrator privileges (for stubborn processes)
./run-ui-admin.bat
```

### Troubleshooting UI Server

If you experience connection issues with the UI server:

1. Check your firewall settings
2. Run the firewall exception script: `./allow-node-firewall.bat`
3. See the `ui-connect-guide.md` for detailed connection troubleshooting

## Batch Files Reference

The repository includes several utility batch files to help with development and troubleshooting:

### Essential Server Scripts
- `run-ui-clean.bat` - Main script to start the UI server (cleans up existing processes)
- `run-ui-admin.bat` - Starts the UI server with administrator privileges
- `serve-test-page.bat` - Serves a simple HTML test page on port 8000 to test connectivity

### Network Troubleshooting
- `check-connectivity.bat` - Comprehensive network connectivity diagnostics
- `check-windows-firewall.bat` - Check firewall status and rules
- `allow-node-firewall.bat` - Add Node.js to Windows Firewall exceptions
- `test-network-connection.bat` - Test specific network connections

### Port Management
- `test-port-3000.bat` - Test if port 3000 is available
- `kill-port-3000.bat` - Kill any process using port 3000

### Alternative Servers
- `start-simple-server.bat` - Start a simple Node.js HTTP server
- `start-python-server.bat` - Start a Python HTTP server
- `start-ps-server.bat` - Start a PowerShell HTTP server

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

## Documentation

See the `docs/` directory for detailed documentation on:
- API Reference
- User Guide
- Development Guide

## License

This project is proprietary and confidential.

Copyright © 2025. All rights reserved. 