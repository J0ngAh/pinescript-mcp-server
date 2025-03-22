@echo off
echo NEXT.JS SERVER LAUNCHER (ADMIN MODE)
echo ==================================
echo.
echo This script will start the PowerShell cleanup script
echo with administrator privileges for better process killing.
echo.
echo Press any key to continue, or close this window to cancel.
pause > nul

:: Create a temporary VBS script to elevate privileges
echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\elevate.vbs"
echo UAC.ShellExecute "powershell.exe", "-ExecutionPolicy Bypass -File ""%~dp0start-ui-clean.ps1""", "", "runas", 1 >> "%temp%\elevate.vbs"

:: Execute the VBS script
start "" "%temp%\elevate.vbs"

:: Delete the temporary VBS script
timeout /t 1 > nul
del "%temp%\elevate.vbs"

echo.
echo If you approved the UAC prompt, the server should be starting...
echo.
echo This window can be closed.
echo. 