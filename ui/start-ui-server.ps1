# PineScript MCP Project - UI Server Starter
# This script provides a reliable way to start the Next.js UI server

# Stop tracing for cleaner output
Set-PSDebug -Trace 0
Clear-Host

Write-Host "PineScript MCP - UI Server Launcher" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if administrator
function Test-Administrator {
    $user = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal $user
    return $principal.IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)
}

# Function to kill any process using port 3000
function Clear-Port3000 {
    Write-Host "Checking for processes using port 3000..." -ForegroundColor Yellow
    
    $connections = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    if ($connections) {
        $processIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        
        foreach ($processId in $processIds) {
            try {
                $process = Get-Process -Id $processId -ErrorAction Stop
                Write-Host "Found process using port 3000: $($process.ProcessName) (PID: $processId)" -ForegroundColor Yellow
                Write-Host "Stopping process..." -ForegroundColor Yellow
                Stop-Process -Id $processId -Force -ErrorAction Stop
                Write-Host "Successfully stopped process" -ForegroundColor Green
                
                # Give OS time to release the port
                Start-Sleep -Seconds 2
            }
            catch {
                Write-Host "Failed to stop process (PID: $processId): $_" -ForegroundColor Red
                Write-Host "You may need to run this script as administrator" -ForegroundColor Red
                if (-not (Test-Administrator)) {
                    Write-Host "This script is not running as administrator" -ForegroundColor Red
                }
                return $false
            }
        }
    }
    else {
        Write-Host "No processes found using port 3000" -ForegroundColor Green
    }
    
    return $true
}

# Function to verify project dependencies
function Test-Dependencies {
    Write-Host "Checking dependencies..." -ForegroundColor Yellow
    
    # Check Node.js
    try {
        $nodeVersion = node -v
        $npmVersion = npm -v
        Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
        Write-Host "npm: $npmVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "Node.js or npm not found. Please install Node.js" -ForegroundColor Red
        return $false
    }
    
    # Check if node_modules exists
    if (-not (Test-Path -Path "node_modules")) {
        Write-Host "Node modules not found. Installing dependencies..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Failed to install dependencies" -ForegroundColor Red
            return $false
        }
        Write-Host "Dependencies installed successfully" -ForegroundColor Green
    }
    
    return $true
}

# Function to verify or create required configuration
function Ensure-Configuration {
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
        Write-Host "Created .env.local configuration file" -ForegroundColor Green
    }
    else {
        Write-Host ".env.local file exists" -ForegroundColor Green
    }
    
    return $true
}

# Navigate to UI directory
try {
    if (-not ($PSScriptRoot -eq "" -or $null -eq $PSScriptRoot)) {
        Set-Location -Path "$PSScriptRoot"
    }
    $currentDir = Get-Location
    Write-Host "Current directory: $currentDir" -ForegroundColor Green
}
catch {
    Write-Host "Failed to navigate to UI directory: $_" -ForegroundColor Red
    exit 1
}

# Main execution flow
try {
    # Step 1: Clear port 3000
    if (-not (Clear-Port3000)) {
        Write-Host "Failed to clear port 3000. Please stop any running servers manually." -ForegroundColor Red
        exit 1
    }
    
    # Step 2: Check dependencies
    if (-not (Test-Dependencies)) {
        Write-Host "Dependency check failed. Please fix the issues and try again." -ForegroundColor Red
        exit 1
    }
    
    # Step 3: Ensure configuration
    if (-not (Ensure-Configuration)) {
        Write-Host "Configuration setup failed." -ForegroundColor Red
        exit 1
    }
    
    # Step 4: Start the Next.js server
    Write-Host "`nStarting Next.js server at http://127.0.0.1:3000" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Yellow
    
    npm run dev
    
    # Check if server started successfully
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Server exited with error code: $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }
}
catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
    exit 1
} 