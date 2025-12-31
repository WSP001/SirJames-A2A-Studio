# 🚀 QUICK REFERENCE CHEAT SHEET

## Sir James Adventures Book003 - Copy-Paste Ready Commands

---

## 📋 DAY 1 - FIRST 30 MINUTES

```bash
# Clone everything you need
git clone https://github.com/WSP001/SirJamesAdventures003.git
cd SirJamesAdventures003

# Verify content exists
ls SourceEmoji/chapter*.html
# Should see: chapter1.html through chapter10.html

# Run integrity check
python tools/check_scene_integrity.py
# Should exit with code 0

# Start local server
python -m http.server 8080 --directory public-book003
# Open: http://localhost:8080
```

---

## 🔧 ENVIRONMENT SETUP

```bash
# Create .env.local file
cat > .env.local << 'EOF'
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
ELEVENLABS_API_KEY=sk_YOUR_KEY_HERE
SUNO_API_KEY=YOUR_KEY_HERE
EOF

# Verify keys work
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $(grep OPENAI .env.local | cut -d= -f2)"
```

---

## 📁 KEY FILE LOCATIONS

```text
SirJamesAdventures003/
├── SourceEmoji/              # Canonical story scripts (READ ONLY)
├── public-book003/           # What gets deployed
│   ├── index.html            # Landing page
│   ├── parent-dashboard.html # Parent controls
│   ├── chapter01/            # Chapter 1 scenes
│   │   └── scene-001/index.html
│   └── assets/
│       ├── images/           # DALL-E images
│       ├── audio/            # ElevenLabs audio
│       └── js/scene-engine.js
├── netlify/functions/        # A2A Agents
├── tools/                    # Verification scripts
└── content/voices.book003.json  # Voice IDs
```

---

## 👦 SIR JAMES - CRITICAL SPECS

| Attribute | Value | ⚠️ CRITICAL |
|-----------|-------|-------------|
| Age | 5 years old | NOT a teenager! |
| Eyes | BRIGHT BLUE | NOT green or brown! |
| Height | 3.5 feet | Kindergarten size |
| Outfit | Royal blue tunic | Silver Celtic trim |

---

## 🐕 CLAUDE THE DOG - CRITICAL SPECS

| Attribute | Value | ⚠️ CRITICAL |
|-----------|-------|-------------|
| Breed | Redbone Coonhound | |
| Coat | Reddish-brown | NOT dark brown! |
| Eyes | Intelligent amber | |
| Voice | SFX ONLY | NO human TTS! |

---

## 🎙️ VOICE IDS (ElevenLabs)

```javascript
const VOICES = {
  "Sir James": "SOYHLrjzK2X1ezoPC6cr",
  "Narrator":  "XrExE9yKIg1WjnnlVkGX",
  "Gramps":    "pqHfZKP75CvOlQylNhV4"
};
```

---

## 🎨 DALL-E PROMPT (COPY EXACTLY)

```text
Disney Pixar 3D animation style, 4K ultra-detailed.

Sir James: tiny 5-year-old boy with BRIGHT BLUE EYES, 
sandy brown hair with cowlick, rosy cheeks, 
royal blue tunic with silver Celtic trim.

Claude: loyal Redbone Coonhound with rich reddish-brown coat,
intelligent amber eyes, royal blue collar.

CRITICAL: Boy MUST be 5-YEAR-OLD with BLUE EYES. NOT a teenager.
```

---

## 💰 COST TARGETS

| Per Chapter | Target |
|-------------|--------|
| Images (8) | $0.32 |
| Voice | $0.08 |
| Music | $0.10 |
| **Total** | **< $0.60** |

---

## 🚀 DEPLOYMENT COMMANDS

```bash
# Preview deploy
netlify deploy --dir=public-book003

# Production deploy
netlify deploy --prod --dir=public-book003

# Check deployment
curl -I https://sirjames-book003.netlify.app
```

---

## 🧪 SMOKE TEST

```bash
# Quick verification
curl -s https://sirjames-book003.netlify.app/ | grep -q "Sir James" && echo "✅ Landing OK"
curl -s https://sirjames-book003.netlify.app/parent-dashboard.html | grep -q "Parent" && echo "✅ Dashboard OK"
curl -s https://sirjames-book003.netlify.app/chapter01/scene-001/index.html | grep -q "scene" && echo "✅ Chapter 1 OK"
```

---

## 🔴 RED TASKS (DO THESE)

- [ ] `python tools/check_scene_integrity.py` - Must pass
- [ ] Copy SFX files: `cp -r ../SirJames-A2A-Studio/public-book002/assets/audio/sfx/ public-book003/assets/audio/`
- [ ] Create `parent-dashboard.html` (template in ROUND_3_FINAL_HANDOFF.md)
- [ ] Create `netlify/functions/curate-chapters.ts` (template provided)
- [ ] Test on iPad (touch targets ≥48px)

---

## 📞 SITE URLS

| Site | URL |
|------|-----|
| Book001 (Emoji) | https://sir-james-adventuers001.netlify.app |
| Book002 (Image/Audio) | https://sirjames-book002-final.netlify.app |
| Book003 (Target) | https://sirjames-book003.netlify.app |

---

## 🛡️ DO NOT MODIFY

- `CONSISTENCY.md` - Character Bible (IMMUTABLE)
- `SourceEmoji/` - Original scripts (READ ONLY)
- Book001/Book002 sites - PROTECTED

---

## 🆘 IF SOMETHING BREAKS

```bash
# 1. Check integrity
python tools/check_scene_integrity.py --verbose

# 2. Check for missing files
find public-book003 -name "*.png" | wc -l  # Should be 80
find public-book003 -name "*.mp3" | wc -l  # Should be 80

# 3. Check Netlify logs
netlify logs

# 4. Restore from stable tag
git checkout book003-stable-v1
```

---

## 🎵 THE KNIGHT'S CREED

> *"Back in the days of old, a young knight named Sir James set forth on a quest...*  
> *Each adventure teaches a virtue, each iteration improves the tale."*

**For the Commons Good!** 🏰⚔️🐕✨

---

**Created**: December 31, 2025  
**Author**: Cascade AI Assistant
