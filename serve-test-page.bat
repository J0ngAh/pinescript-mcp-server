@echo off
echo SIMPLE TEST PAGE SERVER
echo ======================
echo.
echo This will serve a simple test HTML page on port 8000
echo to verify browser connectivity without Next.js
echo.

REM Kill any existing processes on port 8000
FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') DO (
    echo Killing existing process on port 8000 (PID: %%P)
    taskkill /F /PID %%P >nul 2>&1
)

cd ui
echo Starting server for test-page.html on port 8000...
echo.
echo Access the test page at: http://localhost:8000/test-page.html
echo.
echo Press Ctrl+C to stop the server when done
echo.

python -m http.server 8000

cd ..
pause 