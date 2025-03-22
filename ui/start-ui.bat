@echo off
echo PineScript MCP - UI Server Launcher
echo ===================================
echo.

:: Execute the PowerShell script with bypass execution policy
powershell -ExecutionPolicy Bypass -File "%~dp0\start-ui-server.ps1"

:: If PowerShell script fails, pause to show error
if %errorlevel% neq 0 (
    echo.
    echo Failed to start UI server.
    echo Please check the error message above.
    pause
    exit /b %errorlevel%
)

exit /b 0 