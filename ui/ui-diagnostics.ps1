# PineScript MCP Project - UI Server Diagnostics
# This script checks for common issues with the UI server

# Debug information
Write-Host "Script execution started" -ForegroundColor Cyan
$currentDir = Get-Location
Write-Host "Current directory: $currentDir" -ForegroundColor Cyan

Clear-Host
Write-Host "PineScript MCP - UI Server Diagnostics" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$TESTS_PASSED = 0
$TESTS_FAILED = 0
$TESTS_WARNING = 0

# Check Node.js Installation
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    $npmVersion = npm -v
    Write-Host "  ✓ PASS: Node.js $nodeVersion and npm $npmVersion installed" -ForegroundColor Green
    $TESTS_PASSED++
}
catch {
    Write-Host "  ✗ FAIL: Node.js or npm not installed" -ForegroundColor Red
    Write-Host "  ➤ SOLUTION: Install Node.js from https://nodejs.org/ (LTS version recommended)" -ForegroundColor Magenta
    $TESTS_FAILED++
}
Write-Host ""

# Check Next.js Installation
Write-Host "Checking Next.js installation..." -ForegroundColor Yellow
if (Test-Path -Path "node_modules/next") {
    $nextVersionPath = "node_modules/next/package.json"
    if (Test-Path -Path $nextVersionPath) {
        try {
            $nextPackage = Get-Content -Path $nextVersionPath -Raw | ConvertFrom-Json
            $nextVersion = $nextPackage.version
            Write-Host "  ✓ PASS: Next.js $nextVersion installed" -ForegroundColor Green
            $TESTS_PASSED++
        }
        catch {
            Write-Host "  ⚠ WARNING: Next.js is installed but couldn't read version" -ForegroundColor Yellow
            $TESTS_WARNING++
        }
    }
    else {
        Write-Host "  ⚠ WARNING: Next.js is installed but couldn't determine version" -ForegroundColor Yellow
        $TESTS_WARNING++
    }
}
else {
    Write-Host "  ✗ FAIL: Next.js is not installed" -ForegroundColor Red
    Write-Host "  ➤ SOLUTION: Run npm install in the ui directory" -ForegroundColor Magenta
    $TESTS_FAILED++
}
Write-Host ""

# Check Project Dependencies
Write-Host "Checking project dependencies..." -ForegroundColor Yellow
$packageJsonPath = "package.json"
$nodeModulesPath = "node_modules"

if (-not (Test-Path -Path $packageJsonPath)) {
    Write-Host "  ✗ FAIL: package.json not found" -ForegroundColor Red
    Write-Host "  ➤ SOLUTION: Make sure you're in the ui directory" -ForegroundColor Magenta
    $TESTS_FAILED++
}
elseif (-not (Test-Path -Path $nodeModulesPath)) {
    Write-Host "  ✗ FAIL: node_modules not found" -ForegroundColor Red
    Write-Host "  ➤ SOLUTION: Run npm install to install dependencies" -ForegroundColor Magenta
    $TESTS_FAILED++
}
else {
    try {
        $packageJson = Get-Content -Path $packageJsonPath -Raw | ConvertFrom-Json
        $depCount = ($packageJson.dependencies | Get-Member -MemberType NoteProperty).Count
        Write-Host "  ✓ PASS: Found $depCount dependencies in package.json" -ForegroundColor Green
        $TESTS_PASSED++
    }
    catch {
        Write-Host "  ✗ FAIL: Failed to parse package.json" -ForegroundColor Red
        Write-Host "  ➤ SOLUTION: Verify package.json is valid" -ForegroundColor Magenta
        $TESTS_FAILED++
    }
}
Write-Host ""

# Check Port 3000 Availability
Write-Host "Checking port 3000 availability..." -ForegroundColor Yellow
$connections = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($null -ne $connections -and $connections.Count -gt 0) {
    $processId = $connections[0].OwningProcess
    try {
        $process = Get-Process -Id $processId -ErrorAction Stop
        Write-Host "  ✗ FAIL: Port 3000 is in use by $($process.ProcessName) (PID: $processId)" -ForegroundColor Red
        Write-Host "  ➤ SOLUTION: Stop the process using port 3000 or run start-ui-server.ps1 to handle it automatically" -ForegroundColor Magenta
        $TESTS_FAILED++
    }
    catch {
        Write-Host "  ✗ FAIL: Port 3000 is in use by unknown process (PID: $processId)" -ForegroundColor Red
        Write-Host "  ➤ SOLUTION: Stop the process using port 3000 or run start-ui-server.ps1 to handle it automatically" -ForegroundColor Magenta
        $TESTS_FAILED++
    }
}
else {
    Write-Host "  ✓ PASS: Port 3000 is available" -ForegroundColor Green
    $TESTS_PASSED++
}
Write-Host ""

# Check Configuration Files
Write-Host "Checking configuration files..." -ForegroundColor Yellow
if (Test-Path -Path ".env.local") {
    Write-Host "  ✓ PASS: .env.local configuration file exists" -ForegroundColor Green
    $TESTS_PASSED++
}
else {
    Write-Host "  ✗ FAIL: .env.local configuration file not found" -ForegroundColor Red
    Write-Host "  ➤ SOLUTION: Run start-ui-server.ps1 to create it automatically" -ForegroundColor Magenta
    $TESTS_FAILED++
}
Write-Host ""

# Check Network Connectivity
Write-Host "Checking network loopback..." -ForegroundColor Yellow
try {
    $testResult = Test-NetConnection -ComputerName 127.0.0.1 -InformationLevel Quiet -ErrorAction Stop
    if ($testResult) {
        Write-Host "  ✓ PASS: Local loopback (127.0.0.1) is accessible" -ForegroundColor Green
        $TESTS_PASSED++
    }
    else {
        Write-Host "  ✗ FAIL: Local loopback (127.0.0.1) is not accessible" -ForegroundColor Red
        Write-Host "  ➤ SOLUTION: Check your network configuration and firewall settings" -ForegroundColor Magenta
        $TESTS_FAILED++
    }
}
catch {
    Write-Host "  ✗ FAIL: Failed to test local loopback" -ForegroundColor Red
    Write-Host "  ➤ SOLUTION: Check your network configuration" -ForegroundColor Magenta
    $TESTS_FAILED++
}
Write-Host ""

# Check Next.js Configuration
Write-Host "Checking Next.js configuration..." -ForegroundColor Yellow
$nextConfigPath = "next.config.js"
if (Test-Path -Path $nextConfigPath) {
    Write-Host "  ✓ PASS: next.config.js exists" -ForegroundColor Green
    $TESTS_PASSED++
}
else {
    Write-Host "  ✗ FAIL: next.config.js not found" -ForegroundColor Red
    Write-Host "  ➤ SOLUTION: Verify that next.config.js is in the ui directory" -ForegroundColor Magenta
    $TESTS_FAILED++
}
Write-Host ""

# Display summary
Write-Host "Diagnostic Summary:" -ForegroundColor Cyan
Write-Host "  ✓ $TESTS_PASSED tests passed" -ForegroundColor Green
if ($TESTS_WARNING -gt 0) {
    Write-Host "  ⚠ $TESTS_WARNING warnings" -ForegroundColor Yellow
}
if ($TESTS_FAILED -gt 0) {
    Write-Host "  ✗ $TESTS_FAILED tests failed" -ForegroundColor Red
    Write-Host "`nRecommendation: Run the start-ui.bat script to fix common issues" -ForegroundColor Yellow
}
else {
    Write-Host "`nAll tests passed!" -ForegroundColor Green
    Write-Host "You can now run start-ui.bat to start the UI server" -ForegroundColor Green
}

# Provide next steps
Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Run start-ui.bat to start the UI server" -ForegroundColor White
Write-Host "2. Access the UI at http://127.0.0.1:3000" -ForegroundColor White
Write-Host "3. Press Ctrl+C in the terminal to stop the server when done" -ForegroundColor White

Write-Host ""
Write-Host "Script execution completed" -ForegroundColor Cyan 