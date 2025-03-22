# PineScript Project - Server Troubleshooting Script
# This script diagnoses connection issues with the Next.js server

$ErrorActionPreference = "SilentlyContinue"
Write-Host "`nPineScript Project - Server Diagnostic Tool" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "`nRunning comprehensive diagnostics...`n" -ForegroundColor Yellow

# 1. Check Node.js installation
Write-Host "1. Checking Node.js installation:" -ForegroundColor White
try {
    $nodeVersion = node -v
    $npmVersion = npm -v
    Write-Host "   ✓ Node.js installed: $nodeVersion" -ForegroundColor Green
    Write-Host "   ✓ npm installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Node.js not properly installed" -ForegroundColor Red
    Write-Host "     SOLUTION: Install Node.js from https://nodejs.org/" -ForegroundColor Yellow
}

# 2. Check Next.js installation
Write-Host "`n2. Checking Next.js installation:" -ForegroundColor White
if (Test-Path -Path "node_modules/next") {
    Write-Host "   ✓ Next.js is installed" -ForegroundColor Green
    try {
        $packageJson = Get-Content -Path "package.json" -Raw | ConvertFrom-Json
        $nextVersion = $packageJson.dependencies.next -replace '[\^~]', ''
        Write-Host "   ✓ Next.js version: $nextVersion" -ForegroundColor Green
    } catch {
        Write-Host "   ! Could not determine Next.js version" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ✗ Next.js is not installed" -ForegroundColor Red
    Write-Host "     SOLUTION: Run 'npm install' in the ui directory" -ForegroundColor Yellow
}

# 3. Check port 3000 availability
Write-Host "`n3. Checking port 3000 status:" -ForegroundColor White
try {
    $connections = Get-NetTCPConnection -LocalPort 3000 -ErrorAction Stop
    if ($connections) {
        $processIds = $connections.OwningProcess
        foreach ($pid in $processIds) {
            $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "   ✓ Port 3000 is in use by: $($process.ProcessName) (PID: $pid)" -ForegroundColor Green
                
                # Check if it's our Next.js server
                if ($process.ProcessName -eq "node") {
                    Write-Host "     This appears to be a Node.js process (likely our Next.js server)" -ForegroundColor Green
                } else {
                    Write-Host "     This is NOT a Node.js process - may be blocking our server" -ForegroundColor Yellow
                    Write-Host "     SOLUTION: Stop this process or use a different port" -ForegroundColor Yellow
                }
            }
        }
    } else {
        Write-Host "   ✗ Port 3000 is not in use by any process" -ForegroundColor Red
        Write-Host "     SOLUTION: Start the Next.js server" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ! Could not check port status. May require administrative privileges." -ForegroundColor Yellow
}

# 4. Check IPv4 settings
Write-Host "`n4. Checking network interface configuration:" -ForegroundColor White
try {
    $interfaces = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" }
    if ($interfaces) {
        foreach ($interface in $interfaces) {
            Write-Host "   - Interface: $($interface.InterfaceAlias)" -ForegroundColor White
            Write-Host "     IP Address: $($interface.IPAddress)" -ForegroundColor White
        }
        
        # Check if 127.0.0.1 is available
        $loopback = Get-NetIPAddress -IPAddress 127.0.0.1 -ErrorAction SilentlyContinue
        if ($loopback) {
            Write-Host "   ✓ Loopback address 127.0.0.1 is available" -ForegroundColor Green
        } else {
            Write-Host "   ✗ Loopback address 127.0.0.1 is not available" -ForegroundColor Red
            Write-Host "     SOLUTION: Check network configuration" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ! No active network interfaces found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ! Could not check network interfaces" -ForegroundColor Yellow
}

# 5. Check localhost resolution
Write-Host "`n5. Testing localhost resolution:" -ForegroundColor White
try {
    $resolvedAddresses = [System.Net.Dns]::GetHostAddresses("localhost")
    $ipv4Address = $resolvedAddresses | Where-Object { $_.AddressFamily -eq 'InterNetwork' } | Select-Object -First 1
    
    if ($ipv4Address) {
        $ipString = $ipv4Address.ToString()
        if ($ipString -eq "127.0.0.1") {
            Write-Host "   ✓ localhost resolves correctly to 127.0.0.1" -ForegroundColor Green
        } else {
            Write-Host "   ✗ localhost resolves to $ipString instead of 127.0.0.1" -ForegroundColor Red
            Write-Host "     SOLUTION: Run hosts-fix.ps1 as Administrator" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ✗ localhost does not resolve to an IPv4 address" -ForegroundColor Red
        Write-Host "     SOLUTION: Run hosts-fix.ps1 as Administrator" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ✗ Failed to resolve localhost: $_" -ForegroundColor Red
    Write-Host "     SOLUTION: Run hosts-fix.ps1 as Administrator" -ForegroundColor Yellow
}

# 6. Try direct HTTP connection to 127.0.0.1:3000
Write-Host "`n6. Testing direct HTTP connection to 127.0.0.1:3000:" -ForegroundColor White
try {
    $request = [System.Net.WebRequest]::Create("http://127.0.0.1:3000")
    $request.Timeout = 3000
    $response = $request.GetResponse()
    
    $statusCode = [int]$response.StatusCode
    $statusDescription = $response.StatusDescription
    
    if ($statusCode -eq 200) {
        Write-Host "   ✓ Successfully connected to server (Status: $statusCode $statusDescription)" -ForegroundColor Green
    } else {
        Write-Host "   ! Connected but received status code: $statusCode $statusDescription" -ForegroundColor Yellow
    }
    
    $response.Close()
} catch [System.Net.WebException] {
    $ex = $_.Exception
    if ($ex.Status -eq [System.Net.WebExceptionStatus]::ConnectFailure) {
        Write-Host "   ✗ Connection refused - server is not responding" -ForegroundColor Red
        Write-Host "     SOLUTION: Make sure the server is running" -ForegroundColor Yellow
    } elseif ($ex.Status -eq [System.Net.WebExceptionStatus]::Timeout) {
        Write-Host "   ✗ Connection timed out" -ForegroundColor Red
        Write-Host "     SOLUTION: Check firewall settings or server status" -ForegroundColor Yellow
    } else {
        Write-Host "   ✗ HTTP request failed: $($ex.Message)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Failed to make HTTP request: $_" -ForegroundColor Red
}

# 7. Check firewall status
Write-Host "`n7. Checking Windows Firewall status:" -ForegroundColor White
try {
    $firewallProfiles = Get-NetFirewallProfile | Select-Object Name, Enabled
    foreach ($profile in $firewallProfiles) {
        $status = if ($profile.Enabled) { "Enabled" } else { "Disabled" }
        Write-Host "   - $($profile.Name) profile: $status" -ForegroundColor White
    }
    
    Write-Host "   * If connection issues persist, try temporarily disabling the firewall" -ForegroundColor Yellow
    Write-Host "     or adding an exception for port 3000" -ForegroundColor Yellow
} catch {
    Write-Host "   ! Could not check firewall status" -ForegroundColor Yellow
}

# 8. Check for .env.local and Next.js config
Write-Host "`n8. Checking configuration files:" -ForegroundColor White
if (Test-Path -Path ".env.local") {
    Write-Host "   ✓ .env.local file exists" -ForegroundColor Green
    $envContent = Get-Content -Path ".env.local" -Raw
    if ($envContent -match "PORT=3000" -and $envContent -match "HOSTNAME=127.0.0.1") {
        Write-Host "   ✓ .env.local has correct host and port settings" -ForegroundColor Green
    } else {
        Write-Host "   ✗ .env.local may have incorrect settings" -ForegroundColor Red
        Write-Host "     SOLUTION: Update .env.local with correct settings" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ✗ .env.local file is missing" -ForegroundColor Red
    Write-Host "     SOLUTION: Create .env.local with proper settings" -ForegroundColor Yellow
}

if (Test-Path -Path "next.config.js") {
    Write-Host "   ✓ next.config.js exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ next.config.js is missing" -ForegroundColor Red
    Write-Host "     SOLUTION: Create a proper next.config.js file" -ForegroundColor Yellow
}

# Summary and recommendations
Write-Host "`n========== DIAGNOSTIC SUMMARY ==========`n" -ForegroundColor Cyan

Write-Host "Based on the diagnostics, here are the recommended steps:" -ForegroundColor White

Write-Host "`n1. Try our simplified server script:" -ForegroundColor Green
Write-Host "   .\start-server-fixed.ps1" -ForegroundColor White

Write-Host "`n2. If that doesn't work, fix localhost resolution as Administrator:" -ForegroundColor Green
Write-Host "   Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor White
Write-Host "   Then run: .\hosts-fix.ps1" -ForegroundColor White

Write-Host "`n3. If you still encounter issues, try accessing via direct IP:" -ForegroundColor Green
Write-Host "   http://127.0.0.1:3000 (instead of http://localhost:3000)" -ForegroundColor White

Write-Host "`n4. For persistent issues, try temporarily disabling Windows Firewall" -ForegroundColor Green
Write-Host "   or check for other software that might block connections" -ForegroundColor White

Write-Host "`n=========================================" -ForegroundColor Cyan 