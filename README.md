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