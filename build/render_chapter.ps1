<# 
.SYNOPSIS
  One-command flywheel for SirJames Book002 video build + (optional) deploy.

.DESCRIPTION
  - Validates local environment
  - Builds manifest.json for each chapter
  - Renders per-scene MP4s (with optional music bed)
  - Assembles the chapter video
  - Optionally deploys public-book002 to a specified Netlify site

.PARAMETER Chapters
  One or more chapter numbers. Default: 1

.PARAMETER Music
  Include music bed mix if present.

.PARAMETER Reencode
  Re-encode on assemble (prep for fancier transitions later).

.PARAMETER Deploy
  If set, deploys the public-book002 folder via Netlify CLI.

.PARAMETER SiteId
  Netlify Site ID to deploy to. If omitted, the repo's current netlify link is used.

.PARAMETER Prod
  If set, deploys with --prod (otherwise a draft deploy).

.PARAMETER DryRun
  If set, only runs validation and shows what would be done.

.PARAMETER ImgBudget
  Maximum budget for image generation in USD. Default: 1.00

.PARAMETER VoiceBudget
  Maximum budget for voice synthesis in USD. Default: 0.60

.EXAMPLE
  .\build\render_chapter.ps1 -Chapters 1 -Music

.EXAMPLE
  .\build\render_chapter.ps1 -Chapters 1,2 -Music -Deploy -SiteId abcdef01-2345-6789-abcd-ef0123456789 -Prod

.EXAMPLE
  .\build\render_chapter.ps1 -Chapters 1 -DryRun -ImgBudget 1.00 -VoiceBudget 0.60
#>

[CmdletBinding()]
param(
  [int[]] $Chapters = @(1),
  [switch] $Music,
  [switch] $Reencode,
  [switch] $Deploy,
  [string] $SiteId,
  [switch] $Prod,
  [switch] $DryRun,
  [double] $ImgBudget = 1.00,
  [double] $VoiceBudget = 0.60,
  [string] $ImageModel = "dall-e-3",
  [string] $ImageSize = "1024x1024"
)

$ErrorActionPreference = 'Stop'

function Write-Section($text) {
  Write-Host ""
  Write-Host ("=" * 72) -ForegroundColor DarkGray
  Write-Host ("  " + $text) -ForegroundColor Cyan
  Write-Host ("=" * 72) -ForegroundColor DarkGray
}

function Invoke-Step {
  param(
    [Parameter(Mandatory=$true)][string] $Title,
    [Parameter(Mandatory=$true)][string] $CommandLine
  )
  Write-Host ("[STEP] " + $Title) -ForegroundColor Green
  Write-Host ("       " + $CommandLine) -ForegroundColor DarkGray
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  
  # Run command directly in current process
  Invoke-Expression $CommandLine | Out-Null
  $exitCode = $LASTEXITCODE
  
  $sw.Stop()
  if ($null -ne $exitCode -and $exitCode -ne 0) {
    throw "Step failed ($Title) with exit code $exitCode."
  }
  Write-Host ("[OK]   " + $Title + "  (" + [Math]::Round($sw.Elapsed.TotalSeconds,2) + "s)") -ForegroundColor Green
}

# -------- 0) Normalize environment (UTF-8, paths) ---------------------------
Write-Section "INIT - Environment"
try {
  chcp 65001 > $null
} catch { }

$env:PYTHONUTF8 = "1"
$env:PYTHONIOENCODING = "utf-8"
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()

# repoRoot = parent of /build
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot  = Split-Path -Parent $ScriptDir
Set-Location $RepoRoot

Write-Host "Repo root: $RepoRoot"
Write-Host "Python:    $(Get-Command python -ErrorAction SilentlyContinue | ForEach-Object Source)"
Write-Host "FFmpeg:    $(Get-Command ffmpeg -ErrorAction SilentlyContinue | ForEach-Object Source)"
Write-Host "Node:      $(Get-Command node -ErrorAction SilentlyContinue | ForEach-Object Source)"

# -------- 1) Quick sanity checks -------------------------------------------
Write-Section "CHECK - Tooling & Files"
if (-not (Get-Command python -ErrorAction SilentlyContinue)) { throw "Python not found on PATH." }
if (-not (Test-Path "$RepoRoot\tools\local_agent_clean.py")) { throw "Missing tools\local_agent_clean.py" }
if (-not (Test-Path "$RepoRoot\tools\build_manifest.py"))    { throw "Missing tools\build_manifest.py" }
if (-not (Test-Path "$RepoRoot\tools\render_scene_videos.py")) { throw "Missing tools\render_scene_videos.py" }
if (-not (Test-Path "$RepoRoot\tools\assemble_chapter_video.py")) { throw "Missing tools\assemble_chapter_video.py" }
if (-not (Test-Path "$RepoRoot\.env.local")) { Write-Warning ".env.local not found - make sure API keys are set." }

# Check for FFmpeg (optional for video rendering)
$hasFFmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
if (-not $hasFFmpeg) {
  Write-Warning "FFmpeg not found - video rendering will be skipped."
}

Write-Host "[OK] All required tools found" -ForegroundColor Green

# -------- 2) Validate environment ------------------------------------------
Write-Section "VALIDATE - Project"
Invoke-Step -Title "Local validation" -CommandLine 'python tools/local_agent_clean.py validate'

# -------- 3) Per-chapter flywheel ------------------------------------------
foreach ($ch in $Chapters) {
  $chStr = "{0:d2}" -f $ch
  Write-Section "CHAPTER $chStr - Build Pipeline"

  # 3a) Generate images (if not dry run)
  if ($DryRun) {
    Write-Host "[DRY RUN] Image generation plan:" -ForegroundColor Yellow
    Invoke-Step -Title "Image plan (chapter $chStr)" -CommandLine "python tools/images_generate.py --chapter $ch --plan --model $ImageModel --size $ImageSize --max-usd $ImgBudget"
  } else {
    Write-Host "[INFO] Skipping image generation - run manually with:" -ForegroundColor DarkGray
    Write-Host "       python tools/images_generate.py --chapter $ch --model $ImageModel --size $ImageSize --max-usd $ImgBudget" -ForegroundColor DarkGray
  }

  # 3b) Generate voices (if not dry run)
  if ($DryRun) {
    Write-Host "[DRY RUN] Voice synthesis plan:" -ForegroundColor Yellow
    Invoke-Step -Title "Voice plan (chapter $chStr)" -CommandLine "python tools/eleven_agent.py plan --chapter $ch --max-usd $VoiceBudget"
  } else {
    Write-Host "[INFO] Skipping voice synthesis - run manually with:" -ForegroundColor DarkGray
    Write-Host "       python tools/eleven_agent.py synth --chapter $ch --max-usd $VoiceBudget" -ForegroundColor DarkGray
  }

  # 3c) Build manifest
  $buildCmd = "python tools/build_manifest.py --chapter $ch"
  Invoke-Step -Title "Build manifest (chapter $chStr)" -CommandLine $buildCmd

  # 3d) Render per-scene videos (if FFmpeg available and not dry run)
  if ($hasFFmpeg -and -not $DryRun) {
    $renderCmd = "python tools/render_scene_videos.py --chapter $ch"
    if ($Music.IsPresent) { $renderCmd += " --music" }
    Invoke-Step -Title "Render scenes (chapter $chStr)" -CommandLine $renderCmd

    # 3e) Assemble chapter video
    $assembleCmd = "python tools/assemble_chapter_video.py --chapter $ch"
    if ($Reencode.IsPresent) { $assembleCmd += " --reencode" }
    Invoke-Step -Title "Assemble chapter (chapter $chStr)" -CommandLine $assembleCmd

    # 3f) Success ping
    $outVid = Join-Path $RepoRoot "public-book002\chapter$chStr\video\chapter-$chStr.mp4"
    if (Test-Path $outVid) {
      Write-Host "[RESULT] Built: $outVid" -ForegroundColor Yellow
    } else {
      Write-Warning "Expected output not found: $outVid"
    }
  } elseif (-not $hasFFmpeg) {
    Write-Host "[SKIP] Video rendering skipped (FFmpeg not installed)" -ForegroundColor DarkGray
  } else {
    Write-Host "[DRY RUN] Video rendering would happen here" -ForegroundColor Yellow
  }
}

# -------- 4) Optional deploy ------------------------------------------------
if ($Deploy.IsPresent -and -not $DryRun) {
  Write-Section "DEPLOY - Netlify"
  
  # Check for Netlify CLI
  if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
    Write-Warning "npx not found - cannot deploy. Install Node.js first."
  } else {
    # Ensure repo is linked (or use user-supplied site id)
    if ($SiteId) {
      Invoke-Step -Title "Netlify link to site" -CommandLine "npx netlify link --id $SiteId"
    } else {
      Write-Host "[INFO] No -SiteId supplied; using existing Netlify link (if any)." -ForegroundColor DarkGray
      try { Invoke-Step -Title "Netlify status" -CommandLine "npx netlify status" } catch { }
    }

    $deployCmd = 'npx netlify deploy --dir="public-book002"'
    if ($Prod.IsPresent) { $deployCmd += " --prod" }

    Invoke-Step -Title "Deploy public-book002" -CommandLine $deployCmd
    Write-Host "[OK] Deploy complete." -ForegroundColor Green
  }
} elseif ($Deploy.IsPresent -and $DryRun) {
  Write-Host "[DRY RUN] Would deploy to Netlify" -ForegroundColor Yellow
}

Write-Section "DONE - Flywheel complete"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Generate images:  python tools/images_generate.py --chapter 1"
Write-Host "  2. Generate voices:  python tools/eleven_agent.py synth --chapter 1 --max-usd 0.60"
Write-Host "  3. Re-run flywheel:  .\build\render_chapter.ps1 -Chapters 1 -Music"
Write-Host "  4. Deploy:           npx netlify deploy --dir=`"public-book002`" --prod"
Write-Host ""
