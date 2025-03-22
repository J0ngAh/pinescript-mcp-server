@echo off
echo SIMPLE EXPRESS SERVER
echo ======================
echo.
echo This will start a simple Express server that can serve:
echo  - The test HTML page
echo  - Static Next.js build files (if built)
echo.

REM Kill any existing processes on port 3001
FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :3001 ^| findstr LISTENING') DO (
    echo Killing existing process on port 3001 (PID: %%P)
    taskkill /F /PID %%P >nul 2>&1
)

cd ui
echo Installing Express if needed...
call npm install express --no-save --silent

echo Starting Express server on port 3001...
echo.
echo Access the server at: http://localhost:3001/
echo.
echo Press Ctrl+C to stop the server when done
echo.

node simple-express-server.js

cd ..
pause 