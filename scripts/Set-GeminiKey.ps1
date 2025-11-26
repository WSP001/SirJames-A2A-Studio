# ==========================================
# SET GEMINI API KEY SECURELY
# ==========================================
# This script sets your Gemini API key in the environment
# and saves it to .env.local for persistence

param(
    [string]$GeminiKey = "YOUR_GEMINI_API_KEY_HERE"
)

Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "GEMINI API KEY CONFIGURATION" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

# Project root
$projectRoot = "c:\Users\Roberto002\OneDrive\Sir James\LOGIC SirJames_Interactive_Prototype_With_Chapter10\SirJames-A2A-Studio"
$envFile = Join-Path $projectRoot ".env.local"

# 1. Set in current session
$env:GEMINI_API_KEY = $GeminiKey
Write-Host "[OK] Gemini API key set in current PowerShell session" -ForegroundColor Green

# 2. Save to .env.local
if (Test-Path $envFile) {
    # Read existing .env.local
    $envContent = Get-Content $envFile -Raw
    
    # Check if GEMINI_API_KEY already exists
    if ($envContent -match 'GEMINI_API_KEY=') {
        # Update existing key
        $envContent = $envContent -replace 'GEMINI_API_KEY=.*', "GEMINI_API_KEY=$GeminiKey"
        Write-Host "[OK] Updated existing GEMINI_API_KEY in .env.local" -ForegroundColor Green
    } else {
        # Append new key
        $envContent += "`nGEMINI_API_KEY=$GeminiKey"
        Write-Host "[OK] Added GEMINI_API_KEY to .env.local" -ForegroundColor Green
    }
    
    Set-Content -Path $envFile -Value $envContent -NoNewline
} else {
    # Create new .env.local
    $envContent = @"
# Sir James Adventures Book002 - Environment Variables
# Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# Gemini API Key (for curation and narration)
GEMINI_API_KEY=$GeminiKey

# OpenAI API Key (for DALL-E images)
# OPENAI_API_KEY=sk-proj-...

# ElevenLabs API Key (for voice synthesis)
# ELEVENLABS_API_KEY=...

# Suno API Key (for music generation)
# SUNO_API_KEY=...

# Netlify Auth Token (for deployment)
# NETLIFY_AUTH_TOKEN=...
"@
    
    Set-Content -Path $envFile -Value $envContent
    Write-Host "[OK] Created new .env.local with GEMINI_API_KEY" -ForegroundColor Green
}

# 3. Verify the key works
Write-Host "`n[INFO] Testing Gemini API connection..." -ForegroundColor Cyan

try {
    # Check if Python is available
    $pythonCmd = Get-Command python -ErrorAction SilentlyContinue
    
    if ($pythonCmd) {
        # Create temporary test script
        $testScript = @"
import os
import sys

# Set key from parameter
os.environ['GEMINI_API_KEY'] = '$GeminiKey'

try:
    import google.generativeai as genai
    genai.configure(api_key=os.environ['GEMINI_API_KEY'])
    model = genai.GenerativeModel('gemini-1.5-pro')
    response = model.generate_content("Say 'API key verified' in 3 words")
    print(f"[SUCCESS] Gemini Response: {response.text.strip()}")
    sys.exit(0)
except ImportError:
    print("[WARNING] google-generativeai not installed")
    print("[ACTION] Run: pip install google-generativeai==0.7.2")
    sys.exit(1)
except Exception as e:
    print(f"[ERROR] Gemini API test failed: {e}")
    sys.exit(1)
"@
        
        $tempFile = Join-Path $env:TEMP "test_gemini.py"
        Set-Content -Path $tempFile -Value $testScript
        
        # Run test
        $result = & python $tempFile 2>&1
        Write-Host $result
        
        Remove-Item $tempFile -ErrorAction SilentlyContinue
    } else {
        Write-Host "[WARNING] Python not found - skipping API test" -ForegroundColor Yellow
        Write-Host "[INFO] Key saved, but not verified" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[WARNING] Could not test API key: $_" -ForegroundColor Yellow
}

# 4. Summary
Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
Write-Host "CONFIGURATION COMPLETE" -ForegroundColor Green
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "`nGemini API Key Status:"
Write-Host "  [OK] Set in current session: `$env:GEMINI_API_KEY" -ForegroundColor Green
Write-Host "  [OK] Saved to: $envFile" -ForegroundColor Green
Write-Host "`nTo verify in Python:"
Write-Host "  python -c `"import os; print(os.environ.get('GEMINI_API_KEY', 'NOT SET'))`""
Write-Host "`nTo use in scripts:"
Write-Host "  PowerShell: `$env:GEMINI_API_KEY"
Write-Host "  Python:     os.environ['GEMINI_API_KEY']"
Write-Host "  TypeScript: process.env.GEMINI_API_KEY"
