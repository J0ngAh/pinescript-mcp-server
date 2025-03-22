# PineScript Project UI Server Launcher
# This script ensures reliable startup of the Next.js development server

# Show script execution
Set-PSDebug -Trace 1

# Stop any existing node processes that might be using port 3000
Write-Host "Checking for existing processes on port 3000..." -ForegroundColor Yellow
$process = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($process) {
    Write-Host "Killing process using port 3000..." -ForegroundColor Yellow
    Stop-Process -Id $process -Force
}

# Navigate to UI directory
try {
    Set-Location -Path "$PSScriptRoot"
    Write-Host "Current directory: $PSScriptRoot" -ForegroundColor Green
} catch {
    Write-Host "Failed to navigate to UI directory: $_" -ForegroundColor Red
    exit 1
}

# Verify node and npm are installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    $npmVersion = npm -v
    Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js or npm not found. Please install Node.js: $_" -ForegroundColor Red
    exit 1
}

# Clean Next.js cache if needed
if (Test-Path -Path ".next") {
    Write-Host "Cleaning Next.js cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .next
}

# Verify dependencies
Write-Host "Verifying dependencies..." -ForegroundColor Yellow
if (-not (Test-Path -Path "node_modules/next")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies. Error code: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
}

# Create or verify .env.local file
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
"@ | Out-File -FilePath ".env.local"
}

# Verify local hosts file has localhost entry (requires admin)
# Uncomment this section when running as administrator
<#
$hostsFile = "$env:SystemRoot\System32\drivers\etc\hosts"
$hostsContent = Get-Content -Path $hostsFile -Raw

if (-not ($hostsContent -match "127.0.0.1\s+localhost")) {
    Write-Host "Updating hosts file with localhost entry..." -ForegroundColor Yellow
    Add-Content -Path $hostsFile -Value "`n127.0.0.1 localhost"
}
#>

# Start the development server
Write-Host "Starting Next.js development server at http://127.0.0.1:3000" -ForegroundColor Green
npm run dev

# Provide feedback on server exit
if ($LASTEXITCODE -ne 0) {
    Write-Host "Server exited with error code: $LASTEXITCODE" -ForegroundColor Red
} else {
    Write-Host "Server shutdown successfully" -ForegroundColor Green
} 