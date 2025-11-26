# ============================================================
# SirJames-Dev.ps1 - Quiet Development Script
# ============================================================
# A clean, focused dev script for Sir James Adventures
# No Windsurf/Docker spam - just what you need
# ============================================================

param(
    [switch]$Serve,      # Start local dev server
    [switch]$Status,     # Show project status
    [switch]$Deploy,     # Deploy to Netlify
    [switch]$Help        # Show help
)

$ProjectRoot = "c:\Users\Roberto002\OneDrive\Sir James\LOGIC SirJames_Interactive_Prototype_With_Chapter10\SirJames-A2A-Studio"
$PublicDir = "$ProjectRoot\public-book002"

# Colors
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "📌 $msg" -ForegroundColor Cyan }
function Write-Warn { param($msg) Write-Host "⚠️ $msg" -ForegroundColor Yellow }

# ============================================================
# HELP
# ============================================================
if ($Help) {
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Gold
    Write-Host "║       SIR JAMES ADVENTURES - DEV COMMANDS                ║" -ForegroundColor Gold
    Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Gold
    Write-Host ""
    Write-Host "  -Serve     Start local dev server on port 8888"
    Write-Host "  -Status    Show chapter status dashboard"
    Write-Host "  -Deploy    Deploy to Netlify (production)"
    Write-Host "  -Help      Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\sirjames-dev.ps1 -Serve"
    Write-Host "  .\sirjames-dev.ps1 -Status"
    Write-Host ""
    exit
}

# ============================================================
# STATUS - Quick project overview
# ============================================================
if ($Status) {
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║       SIR JAMES BOOK002 - STATUS DASHBOARD               ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""

    # Count assets per chapter
    for ($i = 1; $i -le 10; $i++) {
        $chNum = $i.ToString("00")
        $chDir = "$PublicDir\chapter$chNum"
        
        $imgCount = 0
        $audioCount = 0
        
        if (Test-Path "$chDir\images") {
            $imgCount = (Get-ChildItem "$chDir\images\*.png" -ErrorAction SilentlyContinue).Count
        }
        if (Test-Path "$chDir\audio") {
            $audioCount = (Get-ChildItem "$chDir\audio\*.mp3" -ErrorAction SilentlyContinue).Count
        }
        
        $imgStatus = if ($imgCount -ge 8) { "✅" } else { "🔴" }
        $audioStatus = if ($audioCount -ge 20) { "✅" } else { "🔴" }
        
        Write-Host "  Ch $chNum  |  Images: $imgStatus ($imgCount/8)  |  Audio: $audioStatus ($audioCount/25)"
    }
    
    Write-Host ""
    Write-Host "  📁 Project: $ProjectRoot" -ForegroundColor DarkGray
    Write-Host ""
    exit
}

# ============================================================
# SERVE - Start local dev server
# ============================================================
if ($Serve) {
    Write-Host ""
    Write-Info "Starting local dev server..."
    Write-Host ""
    
    # Check if netlify CLI is available
    $netlifyPath = Get-Command netlify -ErrorAction SilentlyContinue
    
    if ($netlifyPath) {
        Write-Success "Using Netlify Dev"
        Write-Host "  🌐 http://localhost:8888" -ForegroundColor Yellow
        Write-Host ""
        Set-Location $ProjectRoot
        netlify dev --dir public-book002
    } else {
        # Fallback to Python http.server
        Write-Warn "Netlify CLI not found, using Python server"
        Write-Host "  🌐 http://localhost:8888" -ForegroundColor Yellow
        Write-Host ""
        Set-Location $PublicDir
        python -m http.server 8888
    }
    exit
}

# ============================================================
# DEPLOY - Deploy to Netlify
# ============================================================
if ($Deploy) {
    Write-Host ""
    Write-Info "Deploying to Netlify..."
    Write-Host ""
    
    Set-Location $ProjectRoot
    netlify deploy --dir public-book002 --prod
    
    Write-Host ""
    Write-Success "Deployment complete!"
    Write-Host "  🌐 https://sirjames-book002-final.netlify.app" -ForegroundColor Yellow
    Write-Host ""
    exit
}

# ============================================================
# DEFAULT - Show quick status
# ============================================================
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Gold
Write-Host "║       SIR JAMES ADVENTURES - BOOK 002                    ║" -ForegroundColor Gold
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Gold
Write-Host ""
Write-Host "  Use -Help to see available commands"
Write-Host "  Use -Status for chapter dashboard"
Write-Host "  Use -Serve to start dev server"
Write-Host ""
