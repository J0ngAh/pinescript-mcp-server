@echo off
echo PineScript MCP - UI Server Launcher
echo ===================================
echo.

cd ui
call start-ui.bat

exit /b %errorlevel% 