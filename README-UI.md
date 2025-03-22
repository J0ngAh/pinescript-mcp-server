# PineScript MCP - UI Server Guide

## Starting the UI

To start the UI server, run:

```
start-ui-direct.bat
```

This will:
1. Check if port 3000 is already in use and free it if needed
2. Start the Next.js development server
3. Open the UI at http://127.0.0.1:3000

## Features

The UI includes the following key pages:
- Home page - Overview of the system
- Strategies - View and manage trading strategies
- Templates - Browse and use prompt templates
- Analyze - Run analysis on your trading strategies

## Troubleshooting

### Common Issues

1. **Port 3000 Already in Use**
   - The start script will attempt to free port 3000 automatically
   - If that fails, run `taskkill /F /PID <process_id>` where `<process_id>` is the ID found by running `netstat -ano | findstr :3000`

2. **Node.js Not Found**
   - Make sure Node.js is installed (download from https://nodejs.org/)
   - Add Node.js to your PATH

3. **Dependencies Not Installed**
   - Run `cd ui && npm install` to install all required dependencies

4. **Cannot Access the UI**
   - Try accessing the UI at http://127.0.0.1:3000 instead of localhost:3000
   - Check your firewall settings

## Accessing the UI

The UI is only accessible from your local machine (127.0.0.1). This is for security reasons and simplifies the setup process. No external connections are allowed.

## Stopping the Server

To stop the UI server, press Ctrl+C in the terminal window where the server is running. 