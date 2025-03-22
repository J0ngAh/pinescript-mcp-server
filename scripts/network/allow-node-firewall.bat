@echo off
echo Adding Node.js Firewall Exception
echo ===============================
echo.
echo This script will add a firewall exception for Node.js.
echo Administrator privileges are required.
echo.
echo Press any key to continue or close this window to cancel.
pause > nul

:: Create a temporary VBS script to request admin privileges
echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\nodejsfw.vbs"
echo UAC.ShellExecute "cmd.exe", "/c netsh advfirewall firewall add rule name=""Node.js Server"" dir=in action=allow program=""%ProgramFiles%\nodejs\node.exe"" enable=yes & echo. & echo Firewall rule added. & pause", "", "runas", 1 >> "%temp%\nodejsfw.vbs"

:: Execute the VBS script
start "" "%temp%\nodejsfw.vbs"

:: Delete the temporary VBS script
timeout /t 1 > nul
del "%temp%\nodejsfw.vbs"

echo.
echo If you approved the UAC prompt, the firewall rule should be added.
echo You may need to restart any Node.js processes for changes to take effect.
echo.
pause 