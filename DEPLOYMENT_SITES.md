# 🧭 Sir James Adventures - Deployment Sites Reference

> **CRITICAL: Book 001 and Book 002 are SEPARATE sites. Never merge their assets or folders.**

---

## 📚 Site Overview

| Book | Purpose | Output Type | Netlify Site | Publish Directory |
|------|---------|-------------|--------------|-------------------|
| **Book 001** | Emoji edition — text-only prototype | Static HTML + emojis | `sir-james-adventuers001.netlify.app` | `PROTECTED_BOOK001_EMOJI_MASTER/` |
| **Book 002** | Image + Audio edition — DALL-E + ElevenLabs | HTML + PNG + MP3 | `sirjames-book002-final.netlify.app` | `SirJames-A2A-Studio/public-book002/` |

---

## 🔗 Live URLs

### Book 001 (Emoji Edition)
```
https://sir-james-adventuers001.netlify.app
```
- **Purpose:** Training and reference for tone, pacing, and story logic
- **Status:** Protected master — NEVER overwrite
- **Assets:** Text + emojis only (no images/audio)

### Book 002 (Image/Audio Edition)
```
https://sirjames-book002-final.netlify.app
https://sirjames-book002-final.netlify.app/chapter01/scene-001/
```
- **Purpose:** Production multimedia version
- **Status:** Active development via A2A Studio pipeline
- **Assets:** 84 HD images + 251 audio files

---

## 🚀 Deployment Commands

### Deploy Book 002 (Image/Audio)
```powershell
# ALWAYS use --no-build and specify the FULL path to SirJames-A2A-Studio
netlify deploy --prod --no-build `
  --dir="c:\Users\Roberto002\OneDrive\Sir James\LOGIC SirJames_Interactive_Prototype_With_Chapter10\SirJames-A2A-Studio\public-book002" `
  --message "Your deploy message here"
```

### ⚠️ WRONG (deploys from outer folder with placeholders)
```powershell
# DO NOT USE - this deploys the wrong folder!
netlify deploy --prod --dir=public-book002
```

---

## 📁 Folder Structure

```
LOGIC SirJames_Interactive_Prototype_With_Chapter10/
├── PROTECTED_BOOK001_EMOJI_MASTER/     ← Book 001 (DO NOT MODIFY)
│   ├── index.html
│   ├── chapter1.html
│   └── emoji-site-guardian.txt
│
├── SirJames-A2A-Studio/                ← Book 002 (Active Development)
│   ├── public-book002/                 ← DEPLOY THIS FOLDER
│   │   ├── index.html                  ← Chapter Board
│   │   ├── chapters.json
│   │   ├── chapter01/
│   │   │   ├── images/scene-001.png    ← HD DALL-E images
│   │   │   ├── audio/001-01.mp3        ← ElevenLabs narration
│   │   │   └── scene-001/index.html
│   │   ├── chapter02/ ... chapter10/
│   │   └── parent-dashboard.html
│   └── netlify.toml
│
└── public-book002/                     ← WRONG FOLDER (placeholders only)
```

---

## 🧪 Testing Checklist

### Book 002 QA (Before Sharing with Sir James)

| Test | URL | Expected |
|------|-----|----------|
| Chapter Board | `/` | 10 chapter cards with HD images |
| Chapter 1 Scene 1 | `/chapter01/scene-001/` | HD image + audio plays |
| Navigation | Any scene | 🏠 All Chapters button works |
| Scene flow | Scene 1-8 | Next/Back navigation works |
| Final scene | Scene 8 | 🏠 Done! returns to chapters |

### Test on Windows 11 Pro
1. Open Edge/Chrome
2. Navigate to live URL
3. Test each chapter card
4. Verify images load (not purple background)
5. Verify audio plays (tap "▶ Tap to Listen")

---

## 🔐 Golden Rules

1. **Never merge Book 001 and Book 002 assets**
2. **Always deploy Book 002 from `SirJames-A2A-Studio/public-book002/`**
3. **Book 001 is READ-ONLY reference** — protected master
4. **Test locally before deploying** — use `netlify dev`
5. **Use `--no-build` flag** — assets are pre-built

---

## 📊 Asset Counts

| Book | Images | Audio | HTML Pages |
|------|--------|-------|------------|
| Book 001 | 0 | 0 | ~10 |
| Book 002 | 84 | 251 | 80+ scenes |

---

## 🛠️ Troubleshooting

### Purple background, no images?
→ Deployed from wrong folder. Use full path to `SirJames-A2A-Studio/public-book002/`

### Audio not playing?
→ Check filename pattern: `001-01.mp3` (scene-line format)

### Chapter Board shows "Coming Soon"?
→ Check `chapters.json` has `status: "ready"` for all chapters

---

**Last Updated:** November 26, 2025
**Maintainer:** Roberto / Gramps
