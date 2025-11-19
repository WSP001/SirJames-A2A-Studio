#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Sir James A2A Studio - Quick Pipeline Test

.DESCRIPTION
    Tests all critical functions in the A2A pipeline locally.
    Run this after starting the dev server (npm run dev).

.EXAMPLE
    .\TEST_PIPELINE.ps1
#>

Write-Host "🎯 Sir James A2A Studio - Pipeline Test" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Configuration
$baseUrl = "http://localhost:8888/.netlify/functions"
$testsPassed = 0
$testsFailed = 0

function Test-Function {
    param(
        [string]$Name,
        [string]$Endpoint,
        [hashtable]$Body
    )
    
    Write-Host "🧪 Testing: $Name" -ForegroundColor Yellow
    
    try {
        $jsonBody = $Body | ConvertTo-Json -Depth 10
        $response = Invoke-WebRequest -Uri "$baseUrl/$Endpoint" `
            -Method POST `
            -Body $jsonBody `
            -ContentType "application/json" `
            -TimeoutSec 30 `
            -ErrorAction Stop
        
        $content = $response.Content | ConvertFrom-Json
        
        if ($response.StatusCode -eq 200 -or $content.ok) {
            Write-Host "   ✅ PASS - Status: $($response.StatusCode)" -ForegroundColor Green
            Write-Host "   Response: $($response.Content.Substring(0, [Math]::Min(100, $response.Content.Length)))..." -ForegroundColor Gray
            $script:testsPassed++
            return $true
        } else {
            Write-Host "   ❌ FAIL - Unexpected response" -ForegroundColor Red
            Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
            $script:testsFailed++
            return $false
        }
    }
    catch {
        Write-Host "   ❌ FAIL - Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "   Response: $responseBody" -ForegroundColor Gray
        }
        $script:testsFailed++
        return $false
    }
    
    Write-Host ""
}

# Check if server is running
Write-Host "🔍 Checking if dev server is running..." -ForegroundColor Cyan
try {
    $ping = Invoke-WebRequest -Uri "http://localhost:8888" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Dev server is running!`n" -ForegroundColor Green
}
catch {
    Write-Host "❌ Dev server is NOT running!" -ForegroundColor Red
    Write-Host "Please start it with: npm run dev`n" -ForegroundColor Yellow
    exit 1
}

# Test 1: Chapter Curator
Test-Function `
    -Name "Chapter Curator (curate-chapters)" `
    -Endpoint "curate-chapters" `
    -Body @{
        chapterNumber = 1
        emojiList = @('🏰', '🌲', '⚔️', '💎')
        theme = 'adventure'
    }

# Test 2: Story Narrator
Test-Function `
    -Name "Story Narrator (narrate-project)" `
    -Endpoint "narrate-project" `
    -Body @{
        projectId = 'book002-chapter1-test'
        theme = 'adventure'
    }

# Test 3: Progress Tracker
Test-Function `
    -Name "Progress Tracker (progress)" `
    -Endpoint "progress" `
    -Body @{
        projectId = 'book002-chapter1-test'
    }

# Test 4: Publisher (read-only check)
Test-Function `
    -Name "Publisher (publish - dry run)" `
    -Endpoint "publish" `
    -Body @{
        projectId = 'book002-chapter1-test'
        dryRun = $true
    }

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "📊 TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Passed: $testsPassed" -ForegroundColor Green
Write-Host "❌ Failed: $testsFailed" -ForegroundColor Red

if ($testsFailed -eq 0) {
    Write-Host "`n🎉 ALL TESTS PASSED! Pipeline is ready!" -ForegroundColor Green
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Add ElevenLabs API key to .env.local" -ForegroundColor White
    Write-Host "  2. Add Netlify auth token to .env.local" -ForegroundColor White
    Write-Host "  3. Run full Chapter 1 generation" -ForegroundColor White
    Write-Host "  4. Deploy to production" -ForegroundColor White
    exit 0
} else {
    Write-Host "`n⚠️  SOME TESTS FAILED" -ForegroundColor Yellow
    Write-Host "Check the errors above and fix configuration." -ForegroundColor White
    Write-Host "Common issues:" -ForegroundColor Cyan
    Write-Host "  - Missing API keys in .env.local" -ForegroundColor White
    Write-Host "  - Dev server not fully started" -ForegroundColor White
    Write-Host "  - TypeScript compilation errors" -ForegroundColor White
    exit 1
}
