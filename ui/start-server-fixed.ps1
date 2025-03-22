# PineScript Project UI Server Launcher - Simplified Version
# This script provides a more direct approach to starting the Next.js server

Write-Host "PineScript Project - Starting Next.js Server" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Don't use Set-PSDebug as it can cause issues
# Set-PSDebug -Trace 0

# Try to kill any existing process on port 3000
try {
    Write-Host "Checking for processes using port 3000..." -ForegroundColor Yellow
    $existingProcess = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | 
                      Select-Object -ExpandProperty OwningProcess -ErrorAction SilentlyContinue
    
    if ($existingProcess) {
        Write-Host "Killing process ID $existingProcess using port 3000..." -ForegroundColor Yellow
        Stop-Process -Id $existingProcess -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
} catch {
    Write-Host "Note: Could not check for existing processes. This is OK." -ForegroundColor Yellow
}

# Ensure we're in the right directory
Write-Host "Setting working directory..." -ForegroundColor Yellow
try {
    Set-Location -Path $PSScriptRoot -ErrorAction Stop
    $currentPath = Get-Location
    Write-Host "Current directory: $currentPath" -ForegroundColor Green
} catch {
    Write-Host "Failed to set working directory, using current location instead" -ForegroundColor Yellow
}

# Make sure .env.local exists with correct settings
if (-not (Test-Path -Path ".env.local")) {
    Write-Host "Creating .env.local file..." -ForegroundColor Yellow
    @"
# Local development server settings
HOSTNAME=127.0.0.1
PORT=3000
NEXT_PUBLIC_BASE_URL=http://127.0.0.1:3000

# Server configuration
NODE_OPTIONS='--max-http-header-size=12288'
NEXT_TELEMETRY_DISABLED=1
"@ | Out-File -FilePath ".env.local" -Encoding utf8
}

# Check for node_modules
if (-not (Test-Path -Path "node_modules")) {
    Write-Host "Installing dependencies (this may take a while)..." -ForegroundColor Yellow
    npm install
}

# Start the Next.js development server directly
Write-Host ""
Write-Host "Starting Next.js server at http://127.0.0.1:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Different ways to start the server - try each one
try {
    # Option 1: Use npm script
    npm run dev
} catch {
    try {
        # Option 2: Use npx directly with explicit host and port
        npx next dev -H 127.0.0.1 -p 3000
    } catch {
        # Option 3: Most basic way to start Next.js
        Write-Host "Falling back to basic Next.js start method..." -ForegroundColor Yellow
        node node_modules/next/dist/bin/next dev -H 127.0.0.1 -p 3000
    }
} 