Write-Host "Simple PowerShell script test" -ForegroundColor Green
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Green

# Check if port 3000 is in use
$connections = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($null -ne $connections -and $connections.Count -gt 0) {
    Write-Host "Port 3000 is in use" -ForegroundColor Red
} else {
    Write-Host "Port 3000 is available" -ForegroundColor Green
}

# Check Node.js installation
try {
    $nodeVersion = node -v
    Write-Host "Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found" -ForegroundColor Red
}

Write-Host "Test completed" -ForegroundColor Green 