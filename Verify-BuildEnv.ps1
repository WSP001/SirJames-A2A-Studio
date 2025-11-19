# ============================================================
# Sir James Book002 - Environment Verification Gate (PowerShell)
# Ensures safe deployment by validating environment and runtime
# ============================================================

$ErrorActionPreference = "Stop"
$EXPECTED_SITE = "sirjames-book002-final"
$REQUIRED_VARS = @(
    "BOOK_VERSION",
    "ELEVENLABS_API_KEY",
    "OPENAI_API_KEY",
    "NETLIFY_AUTH_TOKEN",
    "NETLIFY_SITE_ID",
    "PYTHON_VERSION",
    "NODE_ENV"
)

Write-Host ""
Write-Host "🧭 Sir James Book002 - Environment Verification" -ForegroundColor Cyan
Write-Host "------------------------------------------------"

$MISSING = @()

# 1️⃣ Verify environment variables
foreach ($VAR in $REQUIRED_VARS) {
    $VALUE = [Environment]::GetEnvironmentVariable($VAR)
    if (-not $VALUE) {
        Write-Host "❌ Missing environment variable: $VAR" -ForegroundColor Red
        $MISSING += $VAR
    } else {
        Write-Host "✅ $VAR detected" -ForegroundColor Green
    }
}

# 2️⃣ Check Python version lock
if (Test-Path ".python-version") {
    $VERSION = Get-Content ".python-version" -Raw
    $VERSION = $VERSION.Trim()
    if ($VERSION -like "3.12*") {
        Write-Host "✅ Python version pinned to $VERSION" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Python version mismatch ($VERSION). Expected 3.12.x" -ForegroundColor Yellow
        $MISSING += ".python-version-mismatch"
    }
} else {
    Write-Host "❌ Missing .python-version file" -ForegroundColor Red
    $MISSING += ".python-version"
}

# 3️⃣ Verify Netlify site context
if (Get-Command netlify -ErrorAction SilentlyContinue) {
    try {
        $STATUS = netlify status 2>$null
        if ($STATUS -match $EXPECTED_SITE) {
            Write-Host "✅ Connected to correct Netlify site: $EXPECTED_SITE" -ForegroundColor Green
        } else {
            Write-Host "❌ Netlify site mismatch or not logged in!" -ForegroundColor Red
            $MISSING += "NETLIFY_SITE_MISMATCH"
        }
    } catch {
        Write-Host "⚠️ Netlify CLI error (run 'netlify login')" -ForegroundColor Yellow
        $MISSING += "NETLIFY_AUTH"
    }
} else {
    Write-Host "⚠️ Netlify CLI not found (install with 'npm install -g netlify-cli')" -ForegroundColor Yellow
    $MISSING += "NETLIFY_CLI"
}

# 4️⃣ Decision gate
if ($MISSING.Count -gt 0) {
    Write-Host ""
    Write-Host "🚫 Environment verification failed." -ForegroundColor Red
    Write-Host "Fix the following before deploying:"
    foreach ($ITEM in $MISSING) {
        Write-Host "   - $ITEM" -ForegroundColor Yellow
    }
    exit 1
}

Write-Host ""
Write-Host "🎉 All checks passed! Safe to deploy." -ForegroundColor Green
Write-Host "Run:  netlify deploy --prod --site=$EXPECTED_SITE"
Write-Host ""
exit 0
