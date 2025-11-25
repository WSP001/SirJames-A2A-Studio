# Sir James Book002 — Build & Deploy Cheatsheet

Fast commands for local build (Windows-friendly), asset generation, video assembly, and Netlify deploy — plus fixes for the most common errors.

---

## TL;DR (copy-paste)

```powershell
# Open a NEW PowerShell at repo root (SirJames-A2A-Studio)

# UTF-8 (Windows-safe for this shell)
chcp 65001 > $null
$env:PYTHONUTF8="1"; $env:PYTHONIOENCODING="utf-8"
[Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8

# 1) Validate & test
python tools/local_agent_clean.py validate
python tools/local_agent_clean.py test

# 2) (Once) Link this repo to the correct Netlify site
# Use your site id; for sirjames-book002-final it's:
npx netlify link --id ce3948ba-cece-4258-8f71-c1a9187f7a25
npx netlify status

# 3) Generate REAL assets for Chapter 1
python tools/images_generate.py --chapter 1
python tools/eleven_agent.py synth --chapter 1 --max-usd 0.60

# 4) Build → Render → Assemble (Ken Burns + audio mix)
.\build\render_chapter.ps1 -Chapters 1 -Music

# 5) Deploy the static site to Netlify (production)
npx netlify deploy --dir="public-book002" --prod --message "Book002 Chapter 1"
```

---

## Prerequisites

### Required Tools

| Tool | Purpose | Install |
|------|---------|---------|
| **Python 3.10+** | Run generation scripts | [python.org](https://python.org) |
| **Node.js 18+** | Netlify CLI | [nodejs.org](https://nodejs.org) |
| **FFmpeg** | Video rendering | [ffmpeg.org](https://ffmpeg.org) |

### API Keys (in `.env.local`)

```env
OPENAI_API_KEY=sk-...        # DALL-E image generation
ELEVENLABS_API_KEY=sk_...    # Voice synthesis
GEMINI_API_KEY=AIza...       # Story analysis (optional)
```

### Voice IDs (in `.env.local`)

```env
VOICEID_NARRATOR=pNInz6obpgDQGcFmaJgB
VOICEID_SIR_JAMES=ErXwobaYiN019PkySvjV
VOICEID_CLAUDE=VR6AewLTigWG4xSOukaG
VOICEID_GRAMPS=TxGEqnHWrfWFTfGW9XjX
```

---

## Pipeline Steps

### Step 1: Generate Images (DALL-E)

```powershell
# Dry run - see costs first
python tools/images_generate.py --chapter 1 --plan

# Generate images (~$0.32 for 8 scenes)
python tools/images_generate.py --chapter 1 --model dall-e-3 --size 1024x1024
```

**Options:**
- `--model`: `dall-e-2` or `dall-e-3` (default)
- `--size`: `1024x1024`, `1024x1792`, `1792x1024`
- `--quality`: `standard` or `hd`
- `--max-usd`: Budget limit (default: $1.00)
- `--scene N`: Generate specific scene only

### Step 2: Generate Voices (ElevenLabs)

```powershell
# Dry run - see costs first
python tools/eleven_agent.py plan --chapter 1 --max-usd 0.60

# Generate voices (~$0.53 for 25 lines)
python tools/eleven_agent.py synth --chapter 1 --max-usd 0.60
```

**Options:**
- `--max-usd`: Budget limit (default: $0.50)
- `--scene N`: Generate specific scene only
- `--voice`: Test specific voice (`narrator`, `sir_james`, `claude`, `gramps`)

### Step 3: Build Manifest

```powershell
python tools/build_manifest.py --chapter 1
```

Creates `manifest.json` with scene metadata, durations, and video settings.

### Step 4: Render Scene Videos

```powershell
# Without music
python tools/render_scene_videos.py --chapter 1

# With music bed
python tools/render_scene_videos.py --chapter 1 --music
```

**Options:**
- `--music`: Mix background music under voice
- `--crf N`: Video quality (lower = better, default: 18)
- `--scene N`: Render specific scene only

### Step 5: Assemble Chapter Video

```powershell
# Fast concat (no re-encode)
python tools/assemble_chapter_video.py --chapter 1

# Re-encode (for transitions)
python tools/assemble_chapter_video.py --chapter 1 --reencode
```

### Step 6: Deploy to Netlify

```powershell
# Check current site link
npx netlify status

# Deploy draft
npx netlify deploy --dir="public-book002"

# Deploy to production
npx netlify deploy --dir="public-book002" --prod
```

---

## Flywheel Script Parameters

```powershell
.\build\render_chapter.ps1 [options]
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `-Chapters` | int[] | `@(1)` | Chapter numbers to build |
| `-Music` | switch | off | Include music bed in videos |
| `-Reencode` | switch | off | Re-encode on assembly |
| `-Deploy` | switch | off | Deploy to Netlify after build |
| `-SiteId` | string | - | Netlify Site ID |
| `-Prod` | switch | off | Deploy to production |
| `-DryRun` | switch | off | Show plan without executing |
| `-ImgBudget` | double | 1.00 | Max USD for images |
| `-VoiceBudget` | double | 0.60 | Max USD for voices |
| `-ImageModel` | string | `dall-e-3` | DALL-E model |
| `-ImageSize` | string | `1024x1024` | Image dimensions |

---

## Output Structure

```
public-book002/
  chapter01/
    _media_prompts.json      # Image generation prompts
    _narration_batch.json    # Voice synthesis scripts
    manifest.json            # Build metadata
    index.html               # Chapter landing page
    images/
      scene-001.png          # DALL-E generated images
      scene-002.png
      ...
    audio/
      001-01.mp3             # Voice lines
      001-02.mp3
      scene-001-voice.wav    # Normalized voice
      scene-001-music.wav    # Background music (optional)
    video/
      scene-001.mp4          # Per-scene videos
      scene-002.mp4
      ...
      chapter-01.mp4         # Full chapter video
    scene-001/
      index.html             # Scene page
    scene-002/
      index.html
    ...
```

---

## Cost Estimates

| Asset | Count | Cost per Unit | Total |
|-------|-------|---------------|-------|
| DALL-E 3 images | 8 | $0.04 | $0.32 |
| ElevenLabs voice | 25 lines | ~$0.02 | $0.53 |
| **Chapter Total** | - | - | **~$0.85** |

**Budget target:** < $1.00 per chapter ✅

---

## Common Errors & Solutions

### `[ERROR] OPENAI_API_KEY not set`

**Cause:** API key not in `.env.local` or not loaded.

**Fix:**
```powershell
# Verify .env.local exists and has the key
cat .env.local | Select-String "OPENAI"

# Ensure dotenv is loading
python -c "from dotenv import load_dotenv; load_dotenv('.env.local'); import os; print(os.environ.get('OPENAI_API_KEY', 'NOT SET')[:10])"
```

### `[ERROR] ffmpeg not found`

**Cause:** FFmpeg not installed or not on PATH.

**Fix:**
```powershell
# Windows (with Chocolatey)
choco install ffmpeg

# Or download from https://ffmpeg.org/download.html
# Add to PATH: C:\ffmpeg\bin
```

### `UnicodeEncodeError: 'charmap' codec`

**Cause:** Windows console not set to UTF-8.

**Fix:**
```powershell
# Run at start of session
chcp 65001 > $null
$env:PYTHONUTF8="1"
$env:PYTHONIOENCODING="utf-8"
[Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8
```

### `[ERROR] manifest.json not found`

**Cause:** Build manifest not generated yet.

**Fix:**
```powershell
python tools/build_manifest.py --chapter 1
```

### `[ERROR] No scene videos to assemble`

**Cause:** Scene videos not rendered yet.

**Fix:**
```powershell
# First render scenes
python tools/render_scene_videos.py --chapter 1

# Then assemble
python tools/assemble_chapter_video.py --chapter 1
```

### `Rate limit exceeded` (OpenAI/ElevenLabs)

**Cause:** Too many API requests too quickly.

**Fix:**
- Wait a few minutes and retry
- Use `--scene N` to generate one scene at a time
- Check your API usage dashboard

### `Estimated cost exceeds budget`

**Cause:** Generation would exceed your set budget limit.

**Fix:**
```powershell
# Increase budget
python tools/images_generate.py --chapter 1 --max-usd 2.00

# Or generate fewer scenes
python tools/images_generate.py --chapter 1 --scene 1
```

---

## Netlify Deployment

### First-time Setup

```powershell
# List your sites
npx netlify sites:list

# Link this repo to your site
npx netlify link --id YOUR_SITE_ID

# Or interactive setup
npx netlify init
```

### Environment Variables

Set these in Netlify Dashboard → Site Settings → Environment Variables:

- `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`

### Deploy Commands

```powershell
# Draft deploy (preview URL)
npx netlify deploy --dir="public-book002"

# Production deploy
npx netlify deploy --dir="public-book002" --prod

# With message
npx netlify deploy --dir="public-book002" --prod --message "Book002 Ch1 release"
```

---

## CI/CD Integration

### GitHub Actions (`.github/workflows/book002.yml`)

```yaml
name: Book002 Build

on:
  pull_request:
    paths: ['public-book002/**', 'tools/**']
  push:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r requirements.txt
      - run: python tools/local_agent_clean.py validate

  dry-run:
    runs-on: ubuntu-latest
    needs: validate
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
      - run: pip install -r requirements.txt
      - run: python tools/images_generate.py --chapter 1 --plan
      - run: python tools/eleven_agent.py plan --chapter 1 --max-usd 0.60

  deploy:
    runs-on: ubuntu-latest
    needs: validate
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx netlify deploy --dir="public-book002" --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## Definition of Done (per chapter)

- [ ] `validate` passes (env, docs, functions)
- [ ] `manifest.json` present and consistent
- [ ] 8+ image assets exist and match prompts
- [ ] 100% narration synthesized (no missing lines)
- [ ] All per-scene videos render without FFmpeg errors
- [ ] Chapter MP4 assembled and plays end-to-end
- [ ] Cost report logged and under budget target
- [ ] Deployed preview uploaded

---

## Support

- **Repository:** [WSP001/SirJames-A2A-Studio](https://github.com/WSP001/SirJames-A2A-Studio)
- **Production Site:** [sirjames-book002-final.netlify.app](https://sirjames-book002-final.netlify.app)
- **Documentation:** See `Docs/BOOK002_IMAGE_AUDIO_PLAN.md`

---

*Last updated: November 2025*
