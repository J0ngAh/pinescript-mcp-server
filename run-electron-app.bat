@echo off
echo PINESCRIPT MCP - ELECTRON APP
echo ============================
echo.
echo This batch file will start the Electron desktop app,
echo which runs without requiring a web server.
echo.

cd ui

echo Installing Electron if needed...
call npm install electron electron-builder --save-dev --silent

echo Starting Electron app...
echo.
echo If this is your first time, it may take a moment to start.
echo.
echo Press Ctrl+C to stop the app when done.
echo.

npm run electron:start

cd ..
pause 