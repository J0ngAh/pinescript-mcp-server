@echo off
echo PINESCRIPT MCP - ELECTRON APP
echo ============================
echo.
echo This batch file will start the Electron desktop app,
echo which runs without requiring a web server.
echo.

cd ui

echo Installing Electron globally if needed...
call npm install -g electron

echo Installing project dependencies...
call npm install

echo Starting Electron app...
echo.
echo If this is your first time, it may take a moment to start.
echo.
echo Press Ctrl+C to stop the app when done.
echo.

npx electron .

cd ..
pause 