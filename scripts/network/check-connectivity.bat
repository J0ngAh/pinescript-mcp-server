@echo off
echo NETWORK CONNECTIVITY DIAGNOSTIC TOOL
echo ==================================
echo.

echo This tool will check if your system can:
echo  1. Resolve DNS
echo  2. Connect to localhost
echo  3. Connect to the internet
echo  4. Check available ports
echo.

echo ----- SYSTEM INFORMATION -----
echo.
echo Computer name: %COMPUTERNAME%
echo Windows version:
ver
echo.

echo ----- CHECKING IP CONFIGURATION -----
echo.
ipconfig /all | findstr "IPv4 DNS"
echo.

echo ----- CHECKING LOCALHOST CONNECTIVITY -----
echo.
ping 127.0.0.1 -n 2
echo.

echo ----- CHECKING INTERNET CONNECTIVITY -----
echo.
ping 8.8.8.8 -n 2
echo.
ping www.google.com -n 2
echo.

echo ----- CHECKING FOR PROCESSES ON WEB PORTS -----
echo.
echo Checking ports 3000, 3001, 8000, 8080...
echo.
netstat -ano | findstr /C:":3000 " /C:":3001 " /C:":8000 " /C:":8080 "
echo.

echo ----- CHECKING FIREWALL STATUS -----
echo.
netsh advfirewall show allprofiles | findstr "State"
echo.

echo ----- DIAGNOSTIC COMPLETE -----
echo.
echo If you see "Reply from 127.0.0.1", local connectivity is working.
echo If you see "Reply from 8.8.8.8", internet connectivity is working.
echo.
echo If port checks show entries, those ports are in use.
echo.
echo Windows Firewall status affects your ability to connect to servers.
echo.

pause 