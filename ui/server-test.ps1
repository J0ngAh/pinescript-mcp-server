# PineScript Project Server Test Script
# Tests connectivity to the Next.js development server

# Function to send HTTP request and check response
function Test-ServerConnection {
    param (
        [string]$Url,
        [string]$Description
    )
    
    Write-Host "Testing $Description ($Url)..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
        $statusCode = $response.StatusCode
        
        if ($statusCode -eq 200) {
            Write-Host "SUCCESS: Connection to $Url successful (Status: $statusCode)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "WARNING: Connection to $Url returned status code $statusCode" -ForegroundColor Yellow
            return $false
        }
    } catch {
        Write-Host "ERROR: Failed to connect to $Url - $_" -ForegroundColor Red
        return $false
    }
}

# Function to check if port is in use
function Test-PortInUse {
    param (
        [int]$Port
    )
    
    try {
        $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        if ($connections) {
            Write-Host "SUCCESS: Port $Port is in use by process ID(s): $($connections.OwningProcess -join ', ')" -ForegroundColor Green
            return $true
        } else {
            Write-Host "ERROR: Port $Port is not in use by any process" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "ERROR: Failed to check port $Port - $_" -ForegroundColor Red
        return $false
    }
}

# Function to verify hostname resolution
function Test-HostnameResolution {
    param (
        [string]$Hostname
    )
    
    Write-Host "Testing hostname resolution for $Hostname..." -ForegroundColor Yellow
    
    try {
        $resolved = Resolve-DnsName -Name $Hostname -ErrorAction SilentlyContinue
        if ($resolved) {
            Write-Host "SUCCESS: $Hostname resolves to $($resolved.IPAddress)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "ERROR: Failed to resolve $Hostname" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "ERROR: DNS resolution failed for $Hostname - $_" -ForegroundColor Red
        return $false
    }
}

# Display test header
Write-Host "`n==== PineScript Project Server Test ====`n" -ForegroundColor Cyan

# Check if server is running on port 3000
$portInUse = Test-PortInUse -Port 3000
if (-not $portInUse) {
    Write-Host "`nSERVER IS NOT RUNNING ON PORT 3000. Please start the server first with ./start-server.ps1" -ForegroundColor Red
    exit 1
}

# Test hostname resolution
$localhostResolved = Test-HostnameResolution -Hostname "localhost"

# Test direct IP connection
$ipSuccess = Test-ServerConnection -Url "http://127.0.0.1:3000" -Description "Direct IP connection"

# Test localhost connection
$localhostSuccess = Test-ServerConnection -Url "http://localhost:3000" -Description "Localhost connection"

# Test all major routes
$routes = @(
    @{ Path = "/"; Description = "Home page" },
    @{ Path = "/strategies"; Description = "Strategies page" },
    @{ Path = "/backtest-results"; Description = "Backtest Results page" },
    @{ Path = "/analyze"; Description = "Analyze page" }
)

$routeResults = @()
foreach ($route in $routes) {
    $url = "http://127.0.0.1:3000" + $route.Path
    $success = Test-ServerConnection -Url $url -Description $route.Description
    $routeResults += [PSCustomObject]@{
        Route = $route.Path
        Description = $route.Description
        Success = $success
    }
}

# Display test summary
Write-Host "`n==== Test Summary ====`n" -ForegroundColor Cyan
$portStatus = if($portInUse) { "Yes" } else { "No" }
$portColor = if($portInUse) { "Green" } else { "Red" }
Write-Host "Server running on port 3000: $portStatus" -ForegroundColor $portColor

$resolvedStatus = if($localhostResolved) { "Yes" } else { "No" }
$resolvedColor = if($localhostResolved) { "Green" } else { "Red" }
Write-Host "Localhost resolves correctly: $resolvedStatus" -ForegroundColor $resolvedColor

$ipStatus = if($ipSuccess) { "Success" } else { "Failed" }
$ipColor = if($ipSuccess) { "Green" } else { "Red" }
Write-Host "Direct IP connection (127.0.0.1): $ipStatus" -ForegroundColor $ipColor

$localhostStatus = if($localhostSuccess) { "Success" } else { "Failed" }
$localhostColor = if($localhostSuccess) { "Green" } else { "Red" }
Write-Host "Localhost connection: $localhostStatus" -ForegroundColor $localhostColor

Write-Host "`nRoute Tests:" -ForegroundColor Cyan
foreach ($result in $routeResults) {
    $resultStatus = if($result.Success) { "Success" } else { "Failed" }
    $resultColor = if($result.Success) { "Green" } else { "Red" }
    Write-Host "$($result.Route) ($($result.Description)): $resultStatus" -ForegroundColor $resultColor
}

Write-Host "`n==== Recommendations ====`n" -ForegroundColor Cyan

if (-not $localhostResolved) {
    Write-Host "- Update your hosts file to ensure localhost resolves to 127.0.0.1" -ForegroundColor Yellow
    Write-Host "  Run PowerShell as Administrator and execute:" -ForegroundColor Yellow
    Write-Host "  Add-Content -Path '$env:SystemRoot\System32\drivers\etc\hosts' -Value '127.0.0.1 localhost'" -ForegroundColor Gray
}

if (-not $ipSuccess -and $portInUse) {
    Write-Host "- Check Windows Firewall settings for port 3000" -ForegroundColor Yellow
    Write-Host "- Restart the server with './start-server.ps1'" -ForegroundColor Yellow
}

if ($localhostResolved -and -not $localhostSuccess -and $ipSuccess) {
    Write-Host "- Your hosts file might have incorrect localhost configuration" -ForegroundColor Yellow
}

Write-Host "`n==== End of Tests ====`n" -ForegroundColor Cyan 