@echo off
echo NEXT.JS SERVER LAUNCHER (CLEAN)
echo ==============================
echo.
echo This batch file will start the PowerShell script
echo to clean port 3001 and launch the Next.js server.
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0start-ui-clean.ps1"

echo.
echo Server has been stopped or failed to start.
echo.
pause 