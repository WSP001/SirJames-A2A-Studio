<#
.SYNOPSIS
    Sir James Adventures - Click2Kick (C2K) Dev Switchboard
    User-friendly interface for parents, testers, and developers
    
.DESCRIPTION
    One-click launcher for Sir James Book002 Image/Audio pipeline.
    Designed for iPad testing workflow and parent dashboard integration.
    
    Commons Good Compliance:
    - Cost tracking per action
    - Age-appropriate content (5-8 years)
    - Transparent AI attribution
    - No PII stored
    
.NOTES
    Author: WSP001 / Sir James Adventures Team
    Version: 1.0.0
    Target: Book002 Image/Audio Version
#>

param(
    [switch]$NoMenu,
    [int]$Chapter = 1
)

# ============================================
# CONFIGURATION
# ============================================
$Script:ProjectRoot = Split-Path -Parent $PSScriptRoot
$Script:Book002Dir = Join-Path $ProjectRoot "public-book002"
$Script:ToolsDir = Join-Path $ProjectRoot "tools"
$Script:BuildDir = Join-Path $ProjectRoot "build"

# Ensure UTF-8 for Windows console
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$env:PYTHONUTF8 = "1"
$env:PYTHONIOENCODING = "utf-8"

# ============================================
# HELPER FUNCTIONS
# ============================================
function Write-C2K {
    param([string]$Message, [string]$Type = "Info")
    $colors = @{
        "Info"    = "Cyan"
        "Success" = "Green"
        "Warning" = "Yellow"
        "Error"   = "Red"
        "Action"  = "Magenta"
    }
    $prefix = @{
        "Info"    = "[i]"
        "Success" = "[OK]"
        "Warning" = "[!]"
        "Error"   = "[X]"
        "Action"  = "[>]"
    }
    Write-Host "$($prefix[$Type]) $Message" -ForegroundColor $colors[$Type]
}

function Show-Banner {
    Clear-Host
    Write-Host ""
    Write-Host "  ================================================" -ForegroundColor DarkCyan
    Write-Host "       SIR JAMES ADVENTURES - CLICK2KICK (C2K)" -ForegroundColor Cyan
    Write-Host "            Book002 Image/Audio Edition" -ForegroundColor DarkCyan
    Write-Host "  ================================================" -ForegroundColor DarkCyan
    Write-Host ""
    Write-Host "  For Parents, Testers & Developers" -ForegroundColor Gray
    Write-Host "  Target: iPad (9th Gen) + Parent Dashboard" -ForegroundColor Gray
    Write-Host ""
}

function Show-MainMenu {
    Write-Host "  -------- QUICK ACTIONS --------" -ForegroundColor White
    Write-Host ""
    Write-Host "    [1] Preview Chapter (Local Browser)" -ForegroundColor Green
    Write-Host "    [2] Test on Device (Start Server)" -ForegroundColor Green
    Write-Host "    [3] Check Environment Health" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  -------- BUILD ACTIONS --------" -ForegroundColor White
    Write-Host ""
    Write-Host "    [4] Generate Chapter Assets (Images + Audio)" -ForegroundColor Magenta
    Write-Host "    [5] Build Chapter Video" -ForegroundColor Magenta
    Write-Host "    [6] Full Pipeline (All Steps)" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "  -------- DEPLOY ACTIONS --------" -ForegroundColor White
    Write-Host ""
    Write-Host "    [7] Deploy to Netlify (Preview)" -ForegroundColor Blue
    Write-Host "    [8] Deploy to Netlify (Production)" -ForegroundColor Blue
    Write-Host ""
    Write-Host "  -------- PARENT DASHBOARD --------" -ForegroundColor White
    Write-Host ""
    Write-Host "    [9] View Cost Metrics" -ForegroundColor Cyan
    Write-Host "    [P] Parent Dashboard Preview" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "    [C] Change Chapter (Current: $Chapter)" -ForegroundColor Gray
    Write-Host "    [H] Help & Documentation" -ForegroundColor Gray
    Write-Host "    [0] Exit" -ForegroundColor Gray
    Write-Host ""
}

function Get-ChapterPath {
    param([int]$ChapterNum)
    $chapterFolder = "chapter{0:D2}" -f $ChapterNum
    return Join-Path $Book002Dir $chapterFolder
}

# ============================================
# ACTION FUNCTIONS
# ============================================

function Invoke-PreviewChapter {
    param([int]$ChapterNum)
    Write-C2K "Opening Chapter $ChapterNum in browser..." "Action"
    
    $chapterPath = Get-ChapterPath $ChapterNum
    $indexPath = Join-Path $chapterPath "index.html"
    
    if (Test-Path $indexPath) {
        Start-Process $indexPath
        Write-C2K "Chapter $ChapterNum opened in default browser" "Success"
    } else {
        Write-C2K "Chapter $ChapterNum not found at: $indexPath" "Error"
        Write-C2K "Run option [4] to generate chapter assets first" "Info"
    }
}

function Start-DevServer {
    Write-C2K "Starting local development server..." "Action"
    Write-C2K "iPad/Device Testing URL will be shown below" "Info"
    Write-Host ""
    
    # Get local IP for device testing
    $localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.*" } | Select-Object -First 1).IPAddress
    
    Write-Host "  ============================================" -ForegroundColor Green
    Write-Host "  LOCAL TESTING URLS:" -ForegroundColor Green
    Write-Host "  ============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Computer:  http://localhost:8080/chapter01/" -ForegroundColor White
    if ($localIP) {
        Write-Host "  iPad/Phone: http://${localIP}:8080/chapter01/" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Gray
    Write-Host ""
    
    Set-Location $Book002Dir
    npx http-server . -p 8080 --cors -c-1
}

function Test-EnvironmentHealth {
    Write-C2K "Running environment health check..." "Action"
    Write-Host ""
    
    $pythonPath = Join-Path $ToolsDir "local_agent_clean.py"
    & python $pythonPath validate
    
    Write-Host ""
    Write-C2K "Health check complete" "Success"
}

function Invoke-GenerateAssets {
    param([int]$ChapterNum)
    Write-C2K "Generating assets for Chapter $ChapterNum..." "Action"
    Write-Host ""
    
    # Show cost estimate first
    Write-Host "  ESTIMATED COSTS:" -ForegroundColor Yellow
    Write-Host "  - Images (DALL-E 3): ~`$0.32 (8 scenes)" -ForegroundColor Gray
    Write-Host "  - Voice (ElevenLabs): ~`$0.15" -ForegroundColor Gray
    Write-Host "  - Total: ~`$0.50 per chapter" -ForegroundColor Gray
    Write-Host ""
    
    $confirm = Read-Host "  Proceed with generation? (Y/N)"
    if ($confirm -ne 'Y' -and $confirm -ne 'y') {
        Write-C2K "Generation cancelled" "Warning"
        return
    }
    
    Write-C2K "Starting image generation..." "Action"
    $imagesScript = Join-Path $ToolsDir "images_generate.py"
    if (Test-Path $imagesScript) {
        & python $imagesScript --chapter $ChapterNum
    } else {
        Write-C2K "images_generate.py not found - skipping" "Warning"
    }
    
    Write-C2K "Starting voice synthesis..." "Action"
    $voiceScript = Join-Path $ToolsDir "eleven_agent.py"
    if (Test-Path $voiceScript) {
        & python $voiceScript synth --chapter $ChapterNum
    } else {
        Write-C2K "eleven_agent.py not found - skipping" "Warning"
    }
    
    Write-C2K "Asset generation complete for Chapter $ChapterNum" "Success"
}

function Invoke-BuildVideo {
    param([int]$ChapterNum)
    Write-C2K "Building video for Chapter $ChapterNum..." "Action"
    
    $renderScript = Join-Path $BuildDir "render_chapter.ps1"
    if (Test-Path $renderScript) {
        & $renderScript -Chapters $ChapterNum -Music
    } else {
        Write-C2K "render_chapter.ps1 not found" "Error"
    }
}

function Invoke-FullPipeline {
    param([int]$ChapterNum)
    Write-C2K "Running FULL pipeline for Chapter $ChapterNum..." "Action"
    Write-Host ""
    Write-Host "  This will:" -ForegroundColor Yellow
    Write-Host "  1. Validate environment" -ForegroundColor Gray
    Write-Host "  2. Generate images (DALL-E)" -ForegroundColor Gray
    Write-Host "  3. Generate voices (ElevenLabs)" -ForegroundColor Gray
    Write-Host "  4. Build scene videos (FFmpeg)" -ForegroundColor Gray
    Write-Host "  5. Assemble chapter video" -ForegroundColor Gray
    Write-Host "  6. Generate provenance (build.json)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Estimated cost: ~`$0.60" -ForegroundColor Yellow
    Write-Host "  Estimated time: 5-10 minutes" -ForegroundColor Yellow
    Write-Host ""
    
    $confirm = Read-Host "  Proceed? (Y/N)"
    if ($confirm -ne 'Y' -and $confirm -ne 'y') {
        Write-C2K "Pipeline cancelled" "Warning"
        return
    }
    
    $renderScript = Join-Path $BuildDir "render_chapter.ps1"
    if (Test-Path $renderScript) {
        & $renderScript -Chapters $ChapterNum -Music -DryRun:$false
    } else {
        Write-C2K "render_chapter.ps1 not found" "Error"
    }
}

function Invoke-DeployPreview {
    Write-C2K "Deploying to Netlify (Preview)..." "Action"
    Set-Location $ProjectRoot
    npx netlify deploy --dir="public-book002" --no-build
}

function Invoke-DeployProduction {
    Write-C2K "Deploying to Netlify (PRODUCTION)..." "Action"
    Write-Host ""
    Write-Host "  WARNING: This will update the LIVE site!" -ForegroundColor Red
    Write-Host "  URL: https://sirjames-book002-final.netlify.app" -ForegroundColor Yellow
    Write-Host ""
    
    $confirm = Read-Host "  Are you sure? (YES to confirm)"
    if ($confirm -ne 'YES') {
        Write-C2K "Production deploy cancelled" "Warning"
        return
    }
    
    Set-Location $ProjectRoot
    npx netlify deploy --dir="public-book002" --prod --no-build --message "Book002 production deploy via C2K"
}

function Show-CostMetrics {
    Write-C2K "Loading cost metrics..." "Action"
    Write-Host ""
    
    # Read build.json files for cost data
    $totalCost = 0
    $chapters = Get-ChildItem -Path $Book002Dir -Directory -Filter "chapter*"
    
    Write-Host "  ============================================" -ForegroundColor Cyan
    Write-Host "  BOOK002 COST METRICS (Commons Good Tracking)" -ForegroundColor Cyan
    Write-Host "  ============================================" -ForegroundColor Cyan
    Write-Host ""
    
    foreach ($ch in $chapters) {
        $buildJson = Join-Path $ch.FullName "build.json"
        if (Test-Path $buildJson) {
            $data = Get-Content $buildJson | ConvertFrom-Json
            $cost = if ($data.costs.total_usd) { $data.costs.total_usd } else { 0 }
            $totalCost += $cost
            Write-Host "  $($ch.Name): `$$cost" -ForegroundColor White
        } else {
            Write-Host "  $($ch.Name): (no build.json)" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    Write-Host "  ------------------------------------" -ForegroundColor Cyan
    Write-Host "  TOTAL SPENT: `$$totalCost" -ForegroundColor Yellow
    Write-Host "  BUDGET TARGET: < `$1.00 per chapter" -ForegroundColor Gray
    Write-Host ""
    
    if ($totalCost -lt 10) {
        Write-C2K "Cost tracking healthy - under budget!" "Success"
    } else {
        Write-C2K "Review costs - approaching budget limits" "Warning"
    }
}

function Show-ParentDashboard {
    Write-C2K "Opening Parent Dashboard preview..." "Action"
    
    $dashboardPath = Join-Path $Book002Dir "parent-dashboard.html"
    if (Test-Path $dashboardPath) {
        Start-Process $dashboardPath
    } else {
        Write-C2K "Parent Dashboard not yet created" "Warning"
        Write-Host ""
        Write-Host "  The Parent Dashboard will include:" -ForegroundColor Gray
        Write-Host "  - Reading progress metrics" -ForegroundColor Gray
        Write-Host "  - Virtue tracking (courage, kindness, curiosity)" -ForegroundColor Gray
        Write-Host "  - Discussion prompts for each chapter" -ForegroundColor Gray
        Write-Host "  - Achievement badges" -ForegroundColor Gray
        Write-Host ""
    }
}

function Show-Help {
    Write-Host ""
    Write-Host "  ============================================" -ForegroundColor Cyan
    Write-Host "  SIR JAMES ADVENTURES - HELP" -ForegroundColor Cyan
    Write-Host "  ============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  QUICK START:" -ForegroundColor Yellow
    Write-Host "  1. Run option [3] to check environment" -ForegroundColor White
    Write-Host "  2. Run option [1] to preview existing content" -ForegroundColor White
    Write-Host "  3. Run option [6] for full chapter build" -ForegroundColor White
    Write-Host ""
    Write-Host "  FOR IPAD TESTING:" -ForegroundColor Yellow
    Write-Host "  1. Run option [2] to start server" -ForegroundColor White
    Write-Host "  2. Note the iPad URL shown" -ForegroundColor White
    Write-Host "  3. Open that URL in Safari on iPad" -ForegroundColor White
    Write-Host ""
    Write-Host "  DOCUMENTATION:" -ForegroundColor Yellow
    Write-Host "  - build/README.md - Build pipeline guide" -ForegroundColor Gray
    Write-Host "  - AGENTS.md - Agent architecture" -ForegroundColor Gray
    Write-Host "  - Docs/BOOK002_IMAGE_AUDIO_PLAN.md - Full plan" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  SUPPORT:" -ForegroundColor Yellow
    Write-Host "  - GitHub: WSP001/SirJames-A2A-Studio" -ForegroundColor Gray
    Write-Host ""
}

function Change-Chapter {
    Write-Host ""
    $newChapter = Read-Host "  Enter chapter number (1-10)"
    if ($newChapter -match '^\d+$' -and [int]$newChapter -ge 1 -and [int]$newChapter -le 10) {
        $Script:Chapter = [int]$newChapter
        Write-C2K "Chapter changed to $Chapter" "Success"
    } else {
        Write-C2K "Invalid chapter number" "Error"
    }
}

# ============================================
# MAIN LOOP
# ============================================

# Ensure we're in the right directory
Set-Location $ProjectRoot

if ($NoMenu) {
    # Direct action mode (for automation)
    Write-C2K "Click2Kick ready - Chapter $Chapter" "Info"
    exit 0
}

do {
    Show-Banner
    Show-MainMenu
    
    $choice = Read-Host "  Select option"
    
    switch ($choice.ToUpper()) {
        '1' { Invoke-PreviewChapter -ChapterNum $Chapter; Pause }
        '2' { Start-DevServer }
        '3' { Test-EnvironmentHealth; Pause }
        '4' { Invoke-GenerateAssets -ChapterNum $Chapter; Pause }
        '5' { Invoke-BuildVideo -ChapterNum $Chapter; Pause }
        '6' { Invoke-FullPipeline -ChapterNum $Chapter; Pause }
        '7' { Invoke-DeployPreview; Pause }
        '8' { Invoke-DeployProduction; Pause }
        '9' { Show-CostMetrics; Pause }
        'P' { Show-ParentDashboard; Pause }
        'C' { Change-Chapter }
        'H' { Show-Help; Pause }
        '0' { 
            Write-C2K "Thank you for using Sir James Adventures!" "Success"
            Write-Host ""
            exit 0
        }
        default {
            Write-C2K "Invalid option - try again" "Warning"
            Start-Sleep -Seconds 1
        }
    }
} while ($true)
