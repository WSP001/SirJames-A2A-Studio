# ==========================================
# FIND SIR JAMES WORKSPACES
# ==========================================
# Discovers all Sir James project folders and Git repos
# Based on preceding masters' workspace mapping

param(
    [string]$OneDriveRoot = "$env:USERPROFILE\OneDrive\Sir James",
    [string]$ProjectsRoot = "C:\Users\Roberto002\Projects\SirJames"
)

Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host "SIR JAMES WORKSPACE DISCOVERY" -ForegroundColor Cyan
Write-Host "=" * 80 -ForegroundColor Cyan

# Known workspace names from preceding masters
$workspaceNames = @(
    "LOGIC SirJames_Interactive_Prototype_With_Chapter10",
    "SirJames-A2A-Studio",
    "SirJamesAdventures001",
    "SirJames_Book001",
    "SirJames_Interactive_Prototype_Expanded",
    "SirJames_Interactive_Prototype_With_Dashboard",
    "SirJames_KnightFrameworkAssets"
)

# File patterns to identify Sir James content
$contentPatterns = @(
    "public-book002\Chapter*\*.html",
    "public-book002\Chapter*\manifests\*.json",
    "Chapter*.json",
    "orchestrate_book002.py",
    "complete_book002_pipeline.py",
    "AGENTS.md",
    "HYBRID_PLAN.md"
)

function Find-NamedWorkspaces {
    param(
        [string]$Root,
        [string[]]$Names
    )

    if (-not (Test-Path -LiteralPath $Root)) {
        Write-Host "[WARN] Root not found: $Root" -ForegroundColor Yellow
        return @()
    }

    Write-Host "[INFO] Searching under: $Root" -ForegroundColor Gray

    Get-ChildItem -Path $Root -Directory -ErrorAction SilentlyContinue |
        Where-Object { $Names -contains $_.Name } |
        ForEach-Object {
            # Check for key content
            $hasContent = $false
            $contentType = "Unknown"
            
            foreach ($pattern in $contentPatterns) {
                $files = Get-ChildItem -Path $_.FullName -Recurse -File -ErrorAction SilentlyContinue -Include ($pattern -split '\\')[-1]
                if ($files) {
                    $hasContent = $true
                    if ($pattern -like "*Chapter*.json") { $contentType = "Chapter Definitions" }
                    elseif ($pattern -like "*orchestrate*") { $contentType = "Python Pipeline" }
                    elseif ($pattern -like "*AGENTS.md") { $contentType = "Agent System" }
                    elseif ($pattern -like "*public-book002*") { $contentType = "Generated Content" }
                    break
                }
            }
            
            [PSCustomObject]@{
                Type        = "NamedFolder"
                Name        = $_.Name
                FullPath    = $_.FullName
                HasContent  = $hasContent
                ContentType = $contentType
                LastWrite   = $_.LastWriteTime
            }
        }
}

function Find-GitRepos {
    param(
        [string]$Root
    )

    if (-not (Test-Path -LiteralPath $Root)) {
        Write-Host "[WARN] Projects root not found: $Root" -ForegroundColor Yellow
        return @()
    }

    Write-Host "[INFO] Searching for .git repos under: $Root" -ForegroundColor Gray

    Get-ChildItem -Path $Root -Recurse -Directory -Filter ".git" -ErrorAction SilentlyContinue |
        ForEach-Object {
            $repoRoot = $_.Parent.FullName
            
            # Get remote URL if available
            $remoteUrl = "Unknown"
            try {
                $gitConfig = Join-Path $repoRoot ".git\config"
                if (Test-Path $gitConfig) {
                    $configContent = Get-Content $gitConfig -Raw
                    if ($configContent -match 'url = (.+)') {
                        $remoteUrl = $matches[1]
                    }
                }
            } catch {}
            
            [PSCustomObject]@{
                Type        = "GitRepo"
                Name        = Split-Path $repoRoot -Leaf
                FullPath    = $repoRoot
                HasContent  = $true
                ContentType = "Git Repository"
                Remote      = $remoteUrl
                LastWrite   = $_.Parent.LastWriteTime
            }
        } | Sort-Object FullPath -Unique
}

# Discover workspaces
$results = @()

Write-Host "`n[STEP 1] Scanning OneDrive for Sir James workspaces..." -ForegroundColor Cyan
$results += Find-NamedWorkspaces -Root $OneDriveRoot -Names $workspaceNames

Write-Host "`n[STEP 2] Scanning for Git repositories..." -ForegroundColor Cyan
$results += Find-GitRepos -Root $ProjectsRoot

# Also check if there are Git repos in OneDrive
$results += Find-GitRepos -Root $OneDriveRoot

if ($results.Count -eq 0) {
    Write-Host "`n[ERROR] No Sir James workspaces found!" -ForegroundColor Red
    Write-Host "[ACTION] Verify paths:" -ForegroundColor Yellow
    Write-Host "  OneDrive: $OneDriveRoot"
    Write-Host "  Projects: $ProjectsRoot"
    exit 1
}

# Display results
Write-Host "`n" + ("=" * 80) -ForegroundColor Green
Write-Host "WORKSPACES DISCOVERED: $($results.Count)" -ForegroundColor Green
Write-Host ("=" * 80) -ForegroundColor Green

# Group by type
$byType = $results | Group-Object Type

foreach ($group in $byType) {
    Write-Host "`n[$($group.Name)] - $($group.Count) found" -ForegroundColor Cyan
    $group.Group | Sort-Object LastWrite -Descending | Format-Table -AutoSize @(
        @{Label="Name"; Expression={$_.Name}; Width=50},
        @{Label="Content"; Expression={$_.ContentType}; Width=20},
        @{Label="Last Modified"; Expression={$_.LastWrite.ToString("yyyy-MM-dd HH:mm")}; Width=16}
    )
}

# Identify primary workspace
$primary = $results | Where-Object { 
    $_.Name -eq "LOGIC SirJames_Interactive_Prototype_With_Chapter10" -or
    $_.Name -eq "SirJames-A2A-Studio"
} | Sort-Object LastWrite -Descending | Select-Object -First 1

if ($primary) {
    Write-Host "`n" + ("=" * 80) -ForegroundColor Yellow
    Write-Host "PRIMARY WORKSPACE (Most Recent)" -ForegroundColor Yellow
    Write-Host ("=" * 80) -ForegroundColor Yellow
    Write-Host "Name:     $($primary.Name)" -ForegroundColor Green
    Write-Host "Path:     $($primary.FullPath)" -ForegroundColor Green
    Write-Host "Type:     $($primary.ContentType)" -ForegroundColor Green
    Write-Host "Modified: $($primary.LastWrite)" -ForegroundColor Green
    
    # Quick commands
    Write-Host "`n[QUICK COMMANDS]" -ForegroundColor Cyan
    Write-Host "  cd `"$($primary.FullPath)`""
    Write-Host "  code `"$($primary.FullPath)`""
}

# Save detailed report
$reportDir = Join-Path $env:USERPROFILE "Desktop\SirJames_Reports"
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null

$csvPath = Join-Path $reportDir "workspace_inventory_$(Get-Date -Format 'yyyyMMdd_HHmmss').csv"
$results | Export-Csv -NoTypeInformation -Path $csvPath

Write-Host "`n[REPORT SAVED]" -ForegroundColor Green
Write-Host "  CSV: $csvPath"

# Check for key files in primary workspace
if ($primary) {
    Write-Host "`n[KEY FILES CHECK]" -ForegroundColor Cyan
    
    $keyFiles = @(
        "AGENTS.md",
        "HYBRID_PLAN.md",
        "BOOK002_STATUS.md",
        "orchestrate_book002.py",
        "requirements.txt",
        ".env.local"
    )
    
    foreach ($file in $keyFiles) {
        $filePath = Join-Path $primary.FullPath $file
        if (Test-Path $filePath) {
            $fileInfo = Get-Item $filePath
            Write-Host "  [OK] $file ($($fileInfo.Length) bytes)" -ForegroundColor Green
        } else {
            Write-Host "  [MISSING] $file" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n" + ("=" * 80) -ForegroundColor Cyan
Write-Host "DISCOVERY COMPLETE" -ForegroundColor Cyan
Write-Host ("=" * 80) -ForegroundColor Cyan
