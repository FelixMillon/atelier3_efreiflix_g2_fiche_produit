# PowerShell script for deploying the shell application to Vercel

Write-Host "Building the shell application..." -ForegroundColor Green
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Exiting..." -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green

# Check if Vercel CLI is installed
$vercelInstalled = $null
try {
    $vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
} catch {
    $vercelInstalled = $null
}

if ($null -eq $vercelInstalled) {
    Write-Host "Vercel CLI is not installed. Installing..." -ForegroundColor Yellow
    npm install -g vercel
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Vercel CLI. Please install it manually with 'npm install -g vercel'." -ForegroundColor Red
        exit 1
    }
}

Write-Host "Deploying to Vercel..." -ForegroundColor Green
Write-Host "You may be prompted to log in if you haven't already." -ForegroundColor Yellow

# Deploy to Vercel
vercel --prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed. Please check the error messages above." -ForegroundColor Red
    exit 1
}

Write-Host "Deployment successful!" -ForegroundColor Green
Write-Host "Your application should now be available at: https://mfe-g2-shell.vercel.app/" -ForegroundColor Cyan 