# Start-UI-Clean.ps1
# A robust script to kill any process using port 3001 and start the Next.js server

# Function to check if running as administrator
function Test-Admin {
    $currentUser = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $currentUser.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Function to find and kill processes using port 3001
function Clear-Port3001 {
    Write-Host "Checking for processes using port 3001..." -ForegroundColor Cyan
    
    try {
        # Try to get TCP connections using port 3001
        $connections = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
        
        if ($connections) {
            foreach ($conn in $connections) {
                $process = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
                
                if ($process) {
                    Write-Host "Found process using port 3001: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Yellow
                    Write-Host "Stopping process..." -ForegroundColor Yellow
                    
                    Stop-Process -Id $process.Id -Force
                    Write-Host "Process terminated." -ForegroundColor Green
                }
            }
        } else {
            Write-Host "No processes found using port 3001 via network connections." -ForegroundColor Green
        }
    } catch {
        Write-Host "Error checking network connections: $_" -ForegroundColor Red
    }
    
    # Alternative method: Find Node.js processes that might be using the port
    Write-Host "Checking for Node.js processes that might be using port 3001..." -ForegroundColor Cyan
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    
    if ($nodeProcesses) {
        Write-Host "Found Node.js processes. Terminating them to ensure port 3001 is available..." -ForegroundColor Yellow
        foreach ($proc in $nodeProcesses) {
            Write-Host "Stopping Node.js process (PID: $($proc.Id))..." -ForegroundColor Yellow
            Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
        }
        Write-Host "All Node.js processes terminated." -ForegroundColor Green
    } else {
        Write-Host "No Node.js processes found." -ForegroundColor Green
    }
    
    # Wait a moment for processes to fully terminate
    Start-Sleep -Seconds 2
    
    # Verify the port is now available
    try {
        $testServer = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Parse("127.0.0.1"), 3001)
        $testServer.Start()
        $testServer.Stop()
        Write-Host "Port 3001 is now available." -ForegroundColor Green
        return $true
    } catch {
        Write-Host "Port 3001 is still in use! Please restart your computer if the issue persists." -ForegroundColor Red
        return $false
    }
}

# Main script execution
Clear-Host
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  NEXT.JS SERVER LAUNCHER (CLEAN)   " -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will:"
Write-Host "  1. Kill any process using port 3001"
Write-Host "  2. Verify port 3001 is available"
Write-Host "  3. Start the Next.js server"
Write-Host ""

# Check if we're admin for more reliable process killing
if (-not (Test-Admin)) {
    Write-Host "NOTE: This script is not running as Administrator." -ForegroundColor Yellow
    Write-Host "Some processes may not be killable without admin rights." -ForegroundColor Yellow
    Write-Host ""
}

# Clear port 3001
$portCleared = Clear-Port3001

if ($portCleared) {
    # Change to the ui directory and start the Next.js server
    Write-Host ""
    Write-Host "Starting Next.js server..." -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    
    # Navigate to UI directory and start server
    Set-Location -Path "$PSScriptRoot\ui"
    
    # Start the Next.js development server
    npm run dev
} else {
    Write-Host ""
    Write-Host "Failed to clear port 3001. Cannot start Next.js server." -ForegroundColor Red
    Write-Host "Try restarting your computer to release all network resources." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
} 