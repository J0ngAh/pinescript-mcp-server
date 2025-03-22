# Ultra-simple HTTP server in PowerShell
# This script starts a very basic HTTP listener

Write-Host "Simple PowerShell HTTP Server" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host ""

# Check if port 8080 is already in use
try {
    $connections = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($connection in $connections) {
            try {
                $process = Get-Process -Id $connection.OwningProcess -ErrorAction Stop
                Write-Host "Stopping process on port 8080: $($process.ProcessName) (PID: $($connection.OwningProcess))" -ForegroundColor Yellow
                Stop-Process -Id $connection.OwningProcess -Force -ErrorAction Stop
                Write-Host "Process stopped" -ForegroundColor Green
            }
            catch {
                Write-Host "Failed to stop process: $_" -ForegroundColor Red
            }
        }
    }
}
catch {
    Write-Host "Error checking port: $_" -ForegroundColor Red
}

# Create a simple HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://+:8080/")

try {
    # Start the listener
    $listener.Start()
    
    Write-Host "HTTP server is running on port 8080" -ForegroundColor Green
    Write-Host "Try accessing: http://localhost:8080" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    
    # Handle requests until stopped
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Log the request
        Write-Host "$($request.HttpMethod) $($request.Url.PathAndQuery) from $($request.RemoteEndPoint.Address)" -ForegroundColor Magenta
        
        # Create a simple HTML response
        $html = @"
<!DOCTYPE html>
<html>
<head>
    <title>PowerShell HTTP Server</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; }
        h1 { color: #0066cc; }
        pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>PowerShell HTTP Server is Working!</h1>
    <p>This page is being served from a PowerShell HTTP listener.</p>
    <p>Current time: $(Get-Date)</p>
    <p>Request path: $($request.Url.PathAndQuery)</p>
    <p>Client IP: $($request.RemoteEndPoint.Address)</p>
    
    <h2>Request Headers</h2>
    <pre>
$($request.Headers | Format-Table | Out-String)
    </pre>
</body>
</html>
"@
        
        # Convert the HTML to bytes
        $buffer = [System.Text.Encoding]::UTF8.GetBytes($html)
        
        # Configure response
        $response.ContentType = "text/html; charset=utf-8"
        $response.ContentLength64 = $buffer.Length
        $response.StatusCode = 200
        
        # Set cache prevention headers
        $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
        $response.Headers.Add("Pragma", "no-cache")
        $response.Headers.Add("Expires", "0")
        
        # Send the response
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
        $response.OutputStream.Close()
    }
}
catch {
    Write-Host "Server error: $_" -ForegroundColor Red
    
    if ($_.Exception.Message -like "*Access is denied*") {
        Write-Host "`nPermission issue detected. Try running this script as Administrator." -ForegroundColor Yellow
    }
    
    if ($_.Exception.Message -like "*conflicts with an existing registration*") {
        Write-Host "`nPort 8080 is already in use by another application." -ForegroundColor Yellow
    }
}
finally {
    # Stop and dispose of the listener
    if ($listener -and $listener.IsListening) {
        $listener.Stop()
        $listener.Close()
        Write-Host "`nServer stopped" -ForegroundColor Yellow
    }
} 