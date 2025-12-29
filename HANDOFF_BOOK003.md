# 📋 HANDOFF DOCUMENTATION FOR BOOK003

> **For the next programmer** - Read this FIRST before doing anything.
> This document will save you thousands of tokens and hours of searching.

---

## 🎯 Project Overview

**Sir James Adventures** is a children's interactive storybook series for ages 5-8.

| Book | Status | URL |
|------|--------|-----|
| Book001 | ✅ Complete (Emoji version) | Legacy |
| Book002 | ✅ Complete (Image/Audio version) | https://sirjames-book002-final.netlify.app |
| Book003 | 🚧 Planned | TBD |

**Repository:** https://github.com/WSP001/SirJames-A2A-Studio

---

## 📁 CRITICAL FILES - READ THESE FIRST

### 1. Character Bible (SOURCE OF TRUTH)
**File:** `CONSISTENCY.md`

This is the **authoritative source** for all character descriptions. DO NOT invent your own.

### 2. Agent System Documentation
**File:** `AGENTS.md`

Defines all 7 core agents, 3 system agents, and 2 utility agents.

### 3. Pre-Written Image Prompts
**Directory:** `assets/prompts/book002/enhanced/`
- `enhanced_image_prompts.json` - All 80 scene prompts
- `enhanced_audio_prompts.json` - Audio generation prompts
- `atomic_prompts_complete.json` - Complete atomic prompts

**Per-Scene JSON:** `prompts/book002/json/ch{NN}-sc{NNN}.json`

### 4. Narration Scripts (Scene Content)
**Location:** `public-book002/chapter{NN}/_narration_batch.json`

Contains exact dialogue, emotions, and scene settings for each chapter.

---

## 👦 CHARACTER SPECIFICATIONS (From CONSISTENCY.md)

### Sir James (The Young Knight)
| Attribute | Value | IMMUTABLE |
|-----------|-------|-----------|
| **Age** | **5 years old** | ✅ |
| **Hair** | Brown with natural cowlick on right side | ✅ |
| **Eyes** | **BRIGHT BLUE** (NOT green, NOT brown) | ✅ |
| **Skin** | Fair with natural rosy cheeks | ✅ |
| **Outfit** | Royal blue tunic with silver Celtic trim | ✅ |
| **Accessories** | Brown leather belt, brass buckle, wooden practice sword | ✅ |

### Claude (The Royal Redbone Coonhound)
| Attribute | Value | IMMUTABLE |
|-----------|-------|-----------|
| **Breed** | Redbone Coonhound | ✅ |
| **Coat** | Rich reddish-brown | ✅ |
| **Eyes** | Intelligent amber | ✅ |
| **Collar** | Royal blue with brass "Claude" tag | ✅ |
| **Special** | Telepathic bond - communicates via THOUGHT BUBBLES | ✅ |

### Gramps (The Wise Mentor)
| Attribute | Value | IMMUTABLE |
|-----------|-------|-----------|
| **Age** | 65-70 years old | ✅ |
| **Hair** | Silver/grey with silver beard | ✅ |
| **Outfit** | Simple robes, walking staff | ✅ |
| **Note** | Based on author Scott Echols (self-insert) | ✅ |

### Sparky (The Magical Squirrel)
| Attribute | Value | IMMUTABLE |
|-----------|-------|-----------|
| **Species** | Red squirrel | ✅ |
| **Fur** | Bright red with white chest patch | ✅ |
| **Features** | Bushy tail, alert eyes, sparkles surround him | ✅ |

---

## 🔑 API KEYS & SERVICES

### Location
- **Local:** `.env.local` (git-ignored)
- **Production:** Netlify Environment Variables
- **Secrets:** GitHub Secrets, Azure Key Vault

### Required Keys
| Service | Key Name | Purpose |
|---------|----------|---------|
| OpenAI | `OPENAI_API_KEY` | DALL-E 3 images, GPT-4 prompts |
| ElevenLabs | `ELEVENLABS_API_KEY` | Voice synthesis |
| Suno | `SUNO_API_KEY` | Music generation |
| Gemini | `GEMINI_API_KEY` | Creative intelligence |

### Voice IDs (ElevenLabs)
| Character | Voice Name | ID |
|-----------|------------|-----|
| Sir James | Harry (young) | `SOYHLrjzK2X1ezoPC6cr` |
| Narrator | Matilda (female) | `XrExE9yKIg1WjnnlVkGX` |
| King Arthur | George (british) | `JBFqnCBsd6RMkjVDRZzb` |
| Gramps | Bill (old male) | `pqHfZKP75CvOlQylNhV4` |
| Claude | SFX only (no TTS) | - |

---

## 📂 FILE STRUCTURE

```
SirJames-A2A-Studio/
├── CONSISTENCY.md          # CHARACTER BIBLE - READ FIRST
├── AGENTS.md               # Agent system documentation
├── HANDOFF_BOOK003.md      # THIS FILE
├── .env.local              # API keys (git-ignored)
├── netlify.toml            # Netlify configuration
│
├── public-book002/         # DEPLOYED CONTENT
│   ├── index.html          # Landing page
│   ├── chapters.json       # Chapter metadata
│   ├── chapter{NN}/        # Chapter folders (01-10)
│   │   ├── _narration_batch.json  # Scene scripts
│   │   ├── images/         # DALL-E generated images
│   │   │   └── scene-{NNN}.png
│   │   ├── audio/          # ElevenLabs TTS + SFX
│   │   │   └── {NNN}-{NN}-{NN}.mp3
│   │   └── scene-{NNN}/    # Scene HTML pages
│   │       └── index.html
│   └── assets/
│       ├── audio/          # Theme music, SFX
│       └── images/         # Shared images
│
├── assets/
│   └── prompts/book002/enhanced/  # Pre-written prompts
│
├── prompts/book002/json/   # Per-scene JSON prompts
│
├── scripts/                # Generation scripts
│   ├── regenerate-accurate-sirjames.js  # Image regeneration
│   ├── generate_book002_assets.py       # Full pipeline
│   └── generate_scene.mjs               # TTS generation
│
├── tools/                  # Utility tools
│   ├── images_generate.py  # DALL-E image generator
│   ├── split_prompts_to_scenes.py  # Prompt splitter
│   └── wire_chapter_html_v2.py     # HTML generator
│
└── netlify/functions/      # Serverless functions
    ├── curate-chapters.ts
    ├── text-to-speech.ts
    ├── generate-music.ts
    └── telemetry.ts
```

---

## 🛠 KEY SCRIPTS

### Image Generation
```bash
# Regenerate all 80 images
node scripts/regenerate-accurate-sirjames.js 1 10

# Regenerate specific chapter
node scripts/regenerate-accurate-sirjames.js 3 3

# Fix single failed image
node scripts/fix-ch1-sc6.js
```

### Voice Generation
```bash
# Generate TTS for a scene
node scripts/generate_scene.mjs --chapter 1 --scene 1
```

### Deployment
```bash
# Deploy to production
netlify deploy --prod --dir=public-book002

# Preview deploy
netlify deploy --dir=public-book002
```

### Environment Verification
```powershell
# Windows
.\Verify-BuildEnv.ps1

# Mac/Linux
./verify-buildenv.sh
```

---

## ⚠️ KNOWN ISSUES & GOTCHAS

### 1. Image Age Consistency
**Problem:** DALL-E often generates teenagers instead of 5-year-olds.
**Solution:** Use explicit terms like "kindergarten-age", "toddler-like proportions", "3.5 feet tall", "chubby baby cheeks".

### 2. Conflicting Source Files
**Problem:** `enhanced_image_prompts.json` says "8-10 years old" and "emerald green eyes".
**Solution:** ALWAYS use `CONSISTENCY.md` as the authoritative source. It says **5 years old** and **BRIGHT BLUE eyes**.

### 3. Netlify CDN Caching
**Problem:** After regenerating images, Netlify may show old cached versions.
**Solution:** The CDN hashes by content, so if the file content is truly different, it will update. Clear browser cache if needed.

### 4. Claude's Voice
**Problem:** Claude the dog does NOT speak with a human voice.
**Solution:** Claude communicates via THOUGHT BUBBLES only. Narrator describes his thoughts.

---

## 📋 REMAINING TASKS FOR BOOK002

### Parent Dashboard
- [ ] Wire virtue logging from scenes into localStorage
- [ ] Display virtue logs in Parent Dashboard
- [ ] Keys: `sj:choices`, `sj:progress`, `sj:virtues`, `sj:session_id`

### UX Polish
- [ ] Apply Play/Pause UX to all scenes (1 button, 48px+)
- [ ] Add Next Scene navigation for all chapters
- [ ] Add Chapter Complete → Next Chapter for chapters 2-10
- [ ] Full walkthrough on iPad + Android

### Scene Engine API
```javascript
SirJamesEngine.toggleAudio(audioEl, btnEl)
SirJamesEngine.makeChoice(virtue, nextSceneId, label)
SirJamesEngine.completeChapter(chapterNum)
SirJamesEngine.goToNextChapter(currentChapter)
```

---

## 🚀 BOOK003 PLANNING

### Source Priority (DO NOT REGENERATE)
1. **Emoji HTML** (`SourceEmoji/chapterN.html`) - Text source of truth
2. **Narration Batch** (`public-book002/chapterNN/_narration_batch.json`) - Voice/dialogue
3. **BOOK002_STAGING** - HD images + audio already generated

### Enhancements Planned
- Memory Compiler Agent (lineage tracking)
- Unified JSON schema (single source of truth)
- Semantic markdown controls (prose drives code)
- Smart API router (right tool, right time)
- Sync-score utility (music/narration alignment)

### Kid Navigation Rules
- "Next Scene →" within chapter (no dashboard bounce)
- "🚀 Next Chapter →" at chapter end (direct to next chapter)
- Touch targets ≥48px

---

## 💰 COST TRACKING

### Book002 Costs
| Service | Per Unit | Total |
|---------|----------|-------|
| DALL-E 3 HD | $0.08/image | ~$6.40 (80 images) |
| ElevenLabs TTS | ~$0.15/chapter | ~$1.50 |
| GPT-4 prompts | ~$0.03/chapter | ~$0.30 |
| Suno music | ~$0.10/chapter | ~$1.00 |
| **Total** | | **~$9.20** |

### Target: < $1.00 per chapter

---

## 📞 CONTACTS

- **Author/Creative Director:** Scott Echols (Gramps)
- **Repository:** https://github.com/WSP001/SirJames-A2A-Studio
- **Production:** https://sirjames-book002-final.netlify.app

---

## ✅ CHECKLIST FOR NEW PROGRAMMER

Before starting any work:

- [ ] Read `CONSISTENCY.md` (Character Bible)
- [ ] Read `AGENTS.md` (Agent System)
- [ ] Check `.env.local` has all required API keys
- [ ] Run `.\Verify-BuildEnv.ps1` to verify environment
- [ ] Review `public-book002/chapter01/_narration_batch.json` for scene format
- [ ] Check existing prompts in `assets/prompts/book002/enhanced/`

**RULE:** Always search for existing files before creating new ones. Previous programmers have done extensive work that should be reused.

---

---

## 🐕 CLAUDE BARK/SFX OPPORTUNITIES

Based on scanning all 10 chapters' narration scripts, here are all scenes where Claude barks, howls, whines, or makes sounds that should trigger SFX:

### SFX Files Available
```
/assets/audio/sfx/dog-bark.mp3   - Standard bark
/assets/audio/sfx/dog-whine.mp3  - Whine/concern
/assets/audio/sfx/dog-happy.mp3  - Happy sounds
```

### Chapter-by-Chapter Claude SFX Triggers

| Chapter | Scene | Narration Text | SFX Type |
|---------|-------|----------------|----------|
| **Ch1** | Scene 2 | "a familiar bark echoed through the courtyard" | 🔊 bark |
| **Ch1** | Scene 3 | "Claude barked twice, which Sir James knew meant 'Let's go!'" | 🔊 bark (x2) |
| **Ch1** | Scene 4 | "Claude whined softly, sensing how important this journey would be" | 🔊 whine |
| **Ch2** | Scene 1 | "Claude barked excitedly, his tail wagging" | 🔊 bark |
| **Ch2** | Scene 8 | "Claude barked happily" | 🔊 happy |
| **Ch3** | Scene 7 | "Claude barked in agreement" | 🔊 bark |
| **Ch3** | Scene 8 | "Claude wagged his tail happily" | 🔊 happy |
| **Ch4** | Scene 5 | "Claude howled along in his own special way" | 🔊 howl |
| **Ch4** | Scene 8 | "Claude barked happily" | 🔊 happy |
| **Ch6** | Scene 8 | "Claude barked in agreement" | 🔊 bark |
| **Ch7** | Scene 6 | "Claude barked joyfully and licked Sir James's face" | 🔊 happy |
| **Ch8** | Scene 3 | "Claude barked encouragingly" | 🔊 bark |
| **Ch9** | Scene 6 | "Claude howled happily" | 🔊 howl ✅ (already added) |
| **Ch10** | Scene 6 | "Claude stood beside him and barked once" | 🔊 bark ✅ (already added) |

### Implementation Notes
- Chapters 9 & 10 Scene 6 already have Claude SFX wired
- Remaining 12 scenes need SFX integration
- Consider adding `dog-howl.mp3` for howl moments

---

## 🚀 BOOK003 RECOMMENDATIONS

### 1. Interactive Branching Paths
Book001 (Emoji version) has interactive choice points where Sir James can take different paths. Book003 should restore these:
- **Courage vs Wisdom choices** at key moments
- **Trust decisions** that affect story outcomes
- Track choices in `sj:choices` localStorage

### 2. Introduce Sparky the Squirrel
Sparky is a mischievous character mentioned in Book001 but not yet in Book002:
- **Species:** Red squirrel
- **Personality:** Energetic, mischievous, helpful
- **Role:** Comic relief, guides Sir James to hidden paths
- **Voice:** Could use high-pitched ElevenLabs voice

### 3. Netlify Sites for Deployment
Existing Netlify deployments to consider:
- `sirjames-book002-final.netlify.app` - Current Book002 (PRODUCTION)
- `sirjames-adventures.netlify.app` - Legacy Book001
- Recommend: `sirjames-book003.netlify.app` for Book003

### 4. Parent Dashboard Enhancements
- ✅ Reset Progress button (just added)
- Add: Reading time tracking per session
- Add: Print-friendly activity sheets
- Add: Audio-only mode for car rides

### 5. Claude's Thought Bubble System
From `CONSISTENCY.md`, Claude communicates via thought bubbles:
```javascript
claude.showThought('empathy')  // 💓 Heart icon
claude.showThought('warning')  // ⚠️ Exclamation
claude.showThought('idea')     // 💡 Lightbulb
claude.showThought('question') // ❓ Question cloud
```

### 6. Virtue Tracking System
localStorage keys for virtue system:
- `sj:virtues` - Object with virtue counts
- `sj:choices` - Array of choice records
- `sj:progress` - Scene completion tracking

### 7. Cost Optimization
Book002 cost: ~$9.20 total
- DALL-E images: $6.40 (80 images)
- ElevenLabs TTS: $1.50
- GPT-4 prompts: $0.30
- Suno music: $1.00

For Book003, consider:
- Reuse Book002 images where scenes are similar
- Batch TTS generation to reduce API calls
- Use cached prompts from `assets/prompts/`

### 8. Missing Features to Add
- [ ] Sparky the Squirrel character
- [ ] Interactive choice points (from Book001)
- [ ] Claude thought bubble animations
- [ ] Virtue-based story branching
- [ ] Achievement badges for completing chapters
- [ ] Audio-only mode for accessibility

---

## 📚 EMOJI VERSION SOURCE FILES

For Book003, the original emoji scripts are in:
- `SourceEmoji/chapter1.html` through `chapter10.html`
- These contain the interactive choice points missing from Book002
- Use `html_to_emoji_md.py` to convert to Markdown format

---

## 🌐 NETLIFY SITES ANALYSIS

### Existing Sir James Sites

| Site Name | URL | Status | Purpose |
|-----------|-----|--------|---------|
| `sirjames-book002-final` | https://sirjames-book002-final.netlify.app | ✅ PRODUCTION | Book002 Image/Audio (CURRENT) |
| `sirjames-book003` | https://sirjames-book003.netlify.app | 🆕 RESERVED | Book003 Interactive (NEXT) |
| `sirjames-book002` | https://sirjames-book002.netlify.app | ⚠️ Legacy | Previous Book002 attempt |
| `sirjamesadventures-book002` | https://sirjamesadventures-book002.netlify.app | ⚠️ Legacy | Previous attempt |
| `sir-james-adventuers001` | https://sir-james-adventuers001.netlify.app | 📚 Book001 | Emoji version |
| `sirjamesadventure2024` | https://sirjamesadventure2024.netlify.app | ⚠️ Legacy | Old version |
| `sirjamesadventuers` | https://sirjamesadventuers.netlify.app | ⚠️ Legacy | Old version |

### Recommended Site for Book003

**USE:** `sirjames-book003.netlify.app` (already reserved!)

The next programming team should:
1. Link this site to the `WSP001/SirJamesAdventures003` GitHub repo
2. Set up auto-deploy from `main` branch
3. Add environment variables (API keys)

---

## 🔒 WEBSITE PROTECTION STRATEGIES

To prevent future programmers from breaking the working Book002 site:

### 1. Branch Protection (GitHub)
```bash
# In GitHub repo settings:
Settings → Branches → Add rule
- Branch name pattern: main
- Require pull request reviews before merging
- Require status checks to pass
- Do not allow force pushes
```

### 2. Netlify Deploy Lock
```bash
# Lock production deploys (only owner can unlock)
netlify deploy:lock
```

### 3. Create Stable Tag
```bash
git tag -a book002-stable-v1.0 -m "Book002 production stable - DO NOT MODIFY"
git push origin book002-stable-v1.0
```

### 4. Netlify Deploy Contexts
In `netlify.toml`:
```toml
[context.production]
  command = "echo 'Production locked - use staging for testing'"
  
[context.branch-deploy]
  command = "echo 'Branch deploy allowed'"
```

### 5. Read-Only Mode (Recommended)
- Archive the `SirJames-A2A-Studio` repo after Book002 is complete
- Create new repo `SirJamesAdventures003` for Book003 work
- Keep Book002 site pointing to archived repo

---

## 📦 BOOK003 PRELIMINARY SETUP

### Files Already Available

The next programming team has a head start with these existing files:

**From Book002 (reusable):**
- `public-book002/assets/audio/sfx/` - Dog bark, whine, happy SFX
- `public-book002/assets/audio/sir-james-adventures-theme.mp3` - Theme music
- `CONSISTENCY.md` - Character bible (Sir James, Claude specs)
- `content/voices.json` - ElevenLabs voice IDs
- `scripts/` - Image/audio generation scripts

**From SirJamesAdventures003 repo:**
- `public-book003/chapter1/index_emoji_script.html` - Emoji source
- `content/voices.book003.json` - Voice configuration

### Recommended File Structure for Book003
```
SirJamesAdventures003/
├── public-book003/
│   ├── index.html              # Landing page
│   ├── parent-dashboard.html   # Parent dashboard
│   ├── chapter01/
│   │   ├── scene-001/
│   │   │   ├── index.html      # Scene with choices
│   │   │   └── choice-a.html   # Branching path A
│   │   │   └── choice-b.html   # Branching path B
│   │   └── images/
│   │   └── audio/
│   └── assets/
│       ├── css/scene-engine.css
│       ├── js/scene-engine.js
│       └── audio/sfx/
├── content/
│   ├── voices.book003.json
│   └── chapters/
│       └── chapter01.json      # Scene definitions with choices
├── scripts/
│   ├── generate-scene.mjs
│   └── wire-choices.js
├── CONSISTENCY.md              # Copy from Book002
├── netlify.toml
└── README.md
```

### API Keys Needed
```
OPENAI_API_KEY=sk-...          # DALL-E 3 images
ELEVENLABS_API_KEY=sk_...      # Voice generation
SUNO_API_KEY=...               # Music (optional)
```

### Quick Start Commands
```bash
# Clone Book003 repo
git clone https://github.com/WSP001/SirJamesAdventures003.git
cd SirJamesAdventures003

# Install dependencies
npm install

# Copy character consistency from Book002
cp ../SirJames-A2A-Studio/CONSISTENCY.md .

# Link to Netlify site
netlify link --name sirjames-book003

# Start local dev
netlify dev
```

---

## 🎵 THE BEST ADVENTURE IS YOU AND ME

*"A little seed grows, and did I tell you,*
*The best adventures are for you and me.*
*If a challenge comes our way,*
*We should listen to what our friends say.*
*Growing stronger every day.*
*Oh, Sir James is on a quest,*
*Putting friendship... Hooray!*
*Here we go—the best adventure is you and me!"*

---

**Last Updated:** December 29, 2025
**Author:** Cascade AI Assistant
