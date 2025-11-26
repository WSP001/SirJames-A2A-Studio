<#
.SYNOPSIS
    Batch generate DALL-E images for Sir James Book002 Chapters 5-10
    
.DESCRIPTION
    Generates HD images (1792x1024) for all remaining chapters.
    Chapters 1-4 already complete. This script does 5-10.
    
    Estimated cost: ~$3.84 (6 chapters × 8 images × $0.08)
    
.EXAMPLE
    .\scripts\Generate-AllImages.ps1
    
.NOTES
    Author: Sir James Adventures Team
    Date: November 26, 2025
    Requires: OPENAI_API_KEY in .env.local
#>

param(
    [int]$StartChapter = 5,
    [int]$EndChapter = 10,
    [string]$Size = "1792x1024",
    [string]$Quality = "hd",
    [float]$MaxUsdPerChapter = 1.00,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $ScriptRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " SIR JAMES BOOK002 - BATCH IMAGE GEN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Chapters: $StartChapter to $EndChapter"
Write-Host "Size: $Size"
Write-Host "Quality: $Quality"
Write-Host "Budget per chapter: `$$MaxUsdPerChapter"
Write-Host ""

$totalChapters = $EndChapter - $StartChapter + 1
$estimatedTotal = $totalChapters * 0.64
Write-Host "Estimated total cost: `$$estimatedTotal" -ForegroundColor Yellow
Write-Host ""

if ($DryRun) {
    Write-Host "[DRY RUN] Would generate images for chapters $StartChapter-$EndChapter" -ForegroundColor Magenta
    exit 0
}

# Confirm before proceeding
$confirm = Read-Host "Proceed with image generation? (y/N)"
if ($confirm -ne 'y' -and $confirm -ne 'Y') {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

$successCount = 0
$failCount = 0
$totalCost = 0

for ($chapter = $StartChapter; $chapter -le $EndChapter; $chapter++) {
    Write-Host ""
    Write-Host "----------------------------------------" -ForegroundColor Green
    Write-Host " CHAPTER $chapter" -ForegroundColor Green
    Write-Host "----------------------------------------" -ForegroundColor Green
    
    $cmd = "python `"$RepoRoot\tools\images_generate.py`" --chapter $chapter --size $Size --quality $Quality --max-usd $MaxUsdPerChapter"
    Write-Host "Running: $cmd" -ForegroundColor DarkGray
    
    try {
        & python "$RepoRoot\tools\images_generate.py" --chapter $chapter --size $Size --quality $Quality --max-usd $MaxUsdPerChapter
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Chapter $chapter complete!" -ForegroundColor Green
            $successCount++
            $totalCost += 0.64
        } else {
            Write-Host "[FAILED] Chapter $chapter had errors" -ForegroundColor Red
            $failCount++
        }
    } catch {
        Write-Host "[ERROR] Chapter $chapter failed: $_" -ForegroundColor Red
        $failCount++
    }
    
    # Brief pause between chapters
    if ($chapter -lt $EndChapter) {
        Write-Host "Waiting 5 seconds before next chapter..." -ForegroundColor DarkGray
        Start-Sleep -Seconds 5
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " BATCH COMPLETE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Successful: $successCount chapters" -ForegroundColor Green
Write-Host "Failed: $failCount chapters" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })
Write-Host "Total cost: ~`$$totalCost"
Write-Host ""
Write-Host "Images saved to: $RepoRoot\public-book002\chapter*\images\"
