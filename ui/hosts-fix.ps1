# PineScript Project - Localhost Resolution Fix
# NOTE: This script must be run as Administrator

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "This script needs to be run as Administrator." -ForegroundColor Red
    Write-Host "Please right-click on PowerShell and select 'Run as Administrator', then run this script again." -ForegroundColor Yellow
    exit 1
}

# Define hosts file path
$hostsFile = "$env:SystemRoot\System32\drivers\etc\hosts"

# Check if hosts file exists
if (-not (Test-Path $hostsFile)) {
    Write-Host "Hosts file not found at $hostsFile" -ForegroundColor Red
    exit 1
}

# Read current hosts file content
try {
    $hostsContent = Get-Content -Path $hostsFile -ErrorAction Stop
    Write-Host "Successfully read hosts file." -ForegroundColor Green
} catch {
    Write-Host "Failed to read hosts file: $_" -ForegroundColor Red
    exit 1
}

# Check if localhost entry already exists
$localhostEntryExists = $false
$localhostPattern = '^\s*127\.0\.0\.1\s+localhost\s*$'

foreach ($line in $hostsContent) {
    if ($line -match $localhostPattern) {
        $localhostEntryExists = $true
        Write-Host "Localhost entry already exists in hosts file." -ForegroundColor Green
        break
    }
}

# Add localhost entry if it doesn't exist
if (-not $localhostEntryExists) {
    try {
        # Make backup of hosts file
        $backupFile = "$hostsFile.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        Copy-Item -Path $hostsFile -Destination $backupFile -ErrorAction Stop
        Write-Host "Created backup of hosts file at $backupFile" -ForegroundColor Green
        
        # Add localhost entry
        Add-Content -Path $hostsFile -Value "`n127.0.0.1 localhost" -ErrorAction Stop
        Write-Host "Successfully added localhost entry to hosts file." -ForegroundColor Green
    } catch {
        Write-Host "Failed to update hosts file: $_" -ForegroundColor Red
        exit 1
    }
} 

# Flush DNS cache to ensure changes take effect
try {
    Write-Host "Flushing DNS cache..." -ForegroundColor Yellow
    Clear-DnsClientCache
    Write-Host "DNS cache flushed successfully." -ForegroundColor Green
} catch {
    Write-Host "Warning: Failed to flush DNS cache: $_" -ForegroundColor Yellow
    Write-Host "You may need to restart your computer for changes to take effect." -ForegroundColor Yellow
}

# Test localhost resolution
try {
    Write-Host "`nTesting localhost resolution..." -ForegroundColor Yellow
    $resolvedIp = [System.Net.Dns]::GetHostAddresses("localhost") | 
                  Where-Object { $_.AddressFamily -eq 'InterNetwork' } | 
                  Select-Object -ExpandProperty IPAddressToString
    
    if ($resolvedIp -eq "127.0.0.1") {
        Write-Host "SUCCESS: 'localhost' resolves to 127.0.0.1" -ForegroundColor Green
    } else {
        Write-Host "WARNING: 'localhost' resolves to $resolvedIp instead of 127.0.0.1" -ForegroundColor Yellow
        Write-Host "You may need to restart your computer for changes to take effect." -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: Failed to resolve 'localhost': $_" -ForegroundColor Red
    Write-Host "You may need to restart your computer." -ForegroundColor Yellow
}

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Try running the server: .\start-server.ps1" -ForegroundColor White
Write-Host "2. Test connectivity: .\server-test.ps1" -ForegroundColor White
Write-Host "3. Access the application at: http://127.0.0.1:3000 or http://localhost:3000" -ForegroundColor White 