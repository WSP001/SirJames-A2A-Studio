
# Check-NetlifyToken.ps1
# Verifies that NETLIFY_AUTH_TOKEN is present and valid

$ErrorActionPreference = "Stop"
Write-Host "`n🔍 CHECKING NETLIFY AUTH TOKEN..." -ForegroundColor Cyan

# 1. Check Local Environment
if ($env:NETLIFY_AUTH_TOKEN) {
    Write-Host "✅ Local NETLIFY_AUTH_TOKEN detected in session." -ForegroundColor Green
} else {
    # Try loading from .env.local
    if (Test-Path "..\.env.local") {
         $tokenLine = Get-Content "..\.env.local" | Select-String "NETLIFY_AUTH_TOKEN"
         if ($tokenLine) {
             Write-Host "✅ Local NETLIFY_AUTH_TOKEN found in .env.local." -ForegroundColor Green
         } else {
             Write-Host "❌ NETLIFY_AUTH_TOKEN missing from .env.local" -ForegroundColor Red
         }
    } elseif (Test-Path ".env.local") {
        $tokenLine = Get-Content ".env.local" | Select-String "NETLIFY_AUTH_TOKEN"
        if ($tokenLine) {
            Write-Host "✅ Local NETLIFY_AUTH_TOKEN found in .env.local." -ForegroundColor Green
        } else {
            Write-Host "❌ NETLIFY_AUTH_TOKEN missing from .env.local" -ForegroundColor Red
            Write-Host "👉 Action: Add it to .env.local" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ .env.local file not found." -ForegroundColor Red
    }
}

# 2. Check Netlify CLI Login
Write-Host "`n🔍 Checking Netlify CLI Status..." -ForegroundColor Cyan
try {
    $status = netlify status --json | ConvertFrom-Json
    if ($status.account.name) {
        Write-Host "✅ Netlify CLI logged in as: $($status.account.name)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Netlify CLI not logged in." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Could not run 'netlify status'. Is Netlify CLI installed?" -ForegroundColor Yellow
}

Write-Host "`n🎉 Check Complete!" -ForegroundColor Cyan
