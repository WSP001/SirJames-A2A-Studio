# 📋 Book002 Release Engineering Runbook

**Version:** 1.0.0  
**Last Updated:** December 27, 2024  
**Status:** ✅ Book002 Complete - Ready for Final QA

---

## 🎯 Mission

Ship Book002 cleanly and safely (no overwrites), and set up Book003 reuse.

---

## 🧯 P0 — Safety Rules (Prevents Overwrites + Lost Work)

### ✅ Immutable "Gold" Snapshot

- [x] Git tag created: `book002-complete-2024-12-27`
- [x] Releases folder: `releases/book002_2024-12-27/`
- [x] Key docs preserved:
  - `SCATTERED_FILES_INVENTORY.md`
  - `BOOK002_CONSOLIDATED_WORKFLOW.md`
  - `A2A_GOLD_MINE_DISCOVERY.md`

### Branch Discipline

```
main = deployable only
feat/* = work branches, squash merge
```

### Recovery Commands

```bash
# Restore to known good state
git checkout book002-complete-2024-12-27

# View all tags
git tag -l

# Create new safety tag before changes
git tag -a book002-pre-change-YYYY-MM-DD -m "Before [description]"
```

---

## 🔐 P1 — Secrets Boundary (Keys Only in Netlify Functions)

### ✅ Rules

- **NEVER** put API keys in client JS
- Keys used **only** inside `netlify/functions/`
- `env-smoke.js` reports **true/false** only, never echoes values

### Verification

```bash
# Check env-smoke endpoint
curl https://sirjames-book002-final.netlify.app/.netlify/functions/env-smoke
```

Expected response:
```json
{
  "ready": true,
  "keys": {
    "OPENAI_API_KEY": true,
    "GEMINI_API_KEY": true,
    "ELEVENLABS_API_KEY": true
  }
}
```

### Required Netlify Environment Variables

| Variable | Purpose | Format |
|----------|---------|--------|
| `OPENAI_API_KEY` | DALL-E 3 images | `sk-...` |
| `GEMINI_API_KEY` | Prompt enhancement | `AIza...` |
| `ELEVENLABS_API_KEY` | Voice synthesis | `sk_...` |

---

## 🧪 P2 — Asset Integrity Gates

### Run Validator

```bash
node tools/validate-assets.js
```

### Checks Performed

- ✅ Every chapter has `scene-001..008` folders
- ✅ Every scene references existing `../images/scene-XXX.png`
- ✅ Every scene has expected audio files
- ✅ No invalid filenames (`# ? %` etc.)
- ✅ Generates `manifest.json` for deterministic lookup

### CI Integration (Future)

Add to `.github/workflows/deploy.yml`:
```yaml
- name: Validate Assets
  run: node tools/validate-assets.js
```

---

## 🧒 P3 — Kid-Proof UX Rules

### Canonical Template

See `templates/scene-template.html` for the single source of truth.

### Required Elements

| Element | Requirement |
|---------|-------------|
| Play button | Single `🔊 Play Story` ⇄ `⏸ Pause` |
| Touch targets | Minimum **48px** height |
| Chapter end | Primary: `🚀 Next Chapter →` |
| Navigation | Secondary: `🏠 All Chapters` |
| Contrast | High contrast text on dark background |

### Character Classes (CSS)

```css
.char-narrator { color: #ffd700; }    /* 📖 Gold */
.char-sir-james { color: #4CAF50; }   /* ⚔️ Green */
.char-claude { color: #8B4513; }      /* 🐕 Brown */
.char-gramps { color: #9370DB; }      /* 👴 Purple */
.char-sparky { color: #FF6B35; }      /* 🐿️ Orange */
```

---

## 🎵 P4 — Audio Polish + iPad Reality

### Autoplay Fallback

Template includes hidden overlay that shows if autoplay blocked:

```html
<div class="autoplay-fallback hidden" id="autoplayFallback">
    <button onclick="startAudio()">🔊 Tap to Start Story</button>
</div>
```

### Audio Normalization Target

- **-16 LUFS** for consistent perceived volume
- Theme music and narration should match

### Stop Behavior

```javascript
audio.pause();
audio.currentTime = 0;
// Also stop playlist timer
```

---

## 🖼️ P5 — Chapter Card Image Strategy

### Two-Step Approach

1. **First:** Fix only 10 chapter card images (first impression)
2. **Then:** Evaluate per-scene images for consistency

### Character Spec (Strict)

**Sir James:**
- 5-year-old boy
- Bright blue eyes
- Brown hair with cowlick
- Royal blue tunic with silver Celtic trim
- Brown boots

**Claude:**
- Redbone Coonhound
- Reddish-brown coat
- Floppy ears
- Soulful eyes

### Legacy Preservation

```bash
# Before regenerating, backup existing
mkdir -p public-book002/assets/images/_legacy
cp public-book002/assets/images/chapter*.png public-book002/assets/images/_legacy/
```

---

## 🧭 P6 — Parent Dashboard (Minimal Viable)

### Scope

- [x] Virtue tracking (localStorage)
- [ ] Export "Download progress" JSON button
- [ ] 3-5 discussion prompts per chapter (static JSON)

### localStorage Keys

```javascript
const STORAGE_KEYS = {
    choices: 'sj:choices',
    progress: 'sj:progress',
    virtues: 'sj:virtues',
    session: 'sj:session_id'
};
```

### Data Structure

```json
{
  "virtues": [
    {"virtue": "courage", "chapter": 1, "scene": 3, "timestamp": "..."}
  ],
  "progress": {
    "ch1": 8, "ch2": 5, "lastVisit": "..."
  }
}
```

---

## 📦 P7 — Book003 Template Packaging

### Template Structure

```
templates/
├── scene-template.html      # Canonical scene HTML
├── manifest.schema.json     # Asset manifest schema
└── README.md                # Usage instructions

tools/
├── validate-assets.js       # Asset integrity checker
├── wire_chapter_html_v2.py  # Scene generator
└── build_manifest_index.py  # Manifest builder
```

### New Book Command (Future)

```bash
npm run new:book -- --book 003
```

---

## ✅ Final Checklist

### Before Deploy

- [ ] Run `node tools/validate-assets.js` - no errors
- [ ] Verify `env-smoke` returns all keys true
- [ ] Test on iPad Safari (autoplay fallback works)
- [ ] Test chapter-to-chapter navigation flow
- [ ] Verify theme music plays and stops correctly

### After Deploy

- [ ] Create Git tag: `book002-deployed-YYYY-MM-DD`
- [ ] Update `BOOK002_STATUS.md`
- [ ] Notify stakeholders

---

## 🔗 Key URLs

| Resource | URL |
|----------|-----|
| **Production** | https://sirjames-book002-final.netlify.app |
| **Env Smoke** | https://sirjames-book002-final.netlify.app/.netlify/functions/env-smoke |
| **Netlify Dashboard** | https://app.netlify.com/projects/sirjames-book002-final |
| **GitHub Repo** | https://github.com/WSP001/SirJames-A2A-Studio |

---

## 📞 Emergency Recovery

```bash
# If something breaks, restore immediately:
git checkout book002-complete-2024-12-27
netlify deploy --prod --dir=public-book002

# Then investigate on a branch:
git checkout -b fix/investigate-issue
```

---

**For the Commons Good** 🏰✨
