# Sir James Adventures Book002 - Consolidated Workflow

## Netlify Team Information
- **Team Name:** THE SeaTrace PROGRAMMING TEAM(S)
- **Slug:** wsp001
- **Team ID:** 67f001c090c3443a134ebc31
- **Plan:** Pro

---

## Deployed Sites (Your Netlify Account)

| Site | Status | Purpose |
|------|--------|---------|
| **sirjames-book002-final** | ✅ LIVE | Primary Book002 Image/Audio version |
| sirjamesadventure2024 | Active | Legacy/alternate site |
| sirtrav-a2a-studio | Active | Reference for A2A features |
| sirjames-book003 | Manual | Future book development |
| sirjamesadventures-book002 | Manual | Older Book002 attempt |

---

## Complete Asset Generation Pipeline

### Step 1: Source Content (Emoji → Narration)
**Source Files:**
- `SourceEmoji/chapterN.html` - Original emoji-based chapters (text source of truth)
- `public-book002/chapterNN/_narration_batch.json` - Structured dialogue for TTS

**Narration Batch Format:**
```json
{
  "chapter": 1,
  "title": "The Quest Begins",
  "scenes": [
    {
      "scene": "scene-001",
      "lines": [
        {"id": "001-01", "voice": "narrator", "text": "...", "emotion": "dramatic"},
        {"id": "001-02", "voice": "sir_james", "text": "...", "emotion": "heroic"}
      ]
    }
  ]
}
```

### Step 2: Character Consistency (CRITICAL)
**File:** `ENHANCED_PROMPT_LIBRARY.json`

| Character | Visual Constants |
|-----------|-----------------|
| **Sir James** | 5-year-old, brown hair with cowlick, emerald green eyes, royal blue tunic with silver Celtic trim, wooden practice sword |
| **Claude** | Red Bone Coonhound dog, loyal posture, blue collar with silver tag |
| **Sparky** | Mischievous red squirrel with fluffy tail |
| **Gramps** | 70-year-old, silver-white beard, forest-green work shirt, wooden walking staff |

**Art Direction:**
- Style: Digital painting, Pixar-quality 3D rendering
- Lighting: Warm cinematic lighting
- Quality: Ultra-detailed, 4K resolution
- Consistency: EXACT character match across all scenes

### Step 3: Image Generation (DALL-E 3)
**Scripts:**
- `scripts/generate_book002_assets.py` - Main asset generator
- `netlify/functions/curate-chapters.ts` - Emoji → DALL-E prompt converter

**Generated Assets:** 86 HD images in `public-book002/assets/images/`

### Step 4: Audio Generation (ElevenLabs)
**Scripts:**
- `tools/eleven_agent.py` - Python TTS agent
- `scripts/generate_scene.mjs` - Node.js scene audio generator
- `scripts/generate_line.mjs` - Single line TTS

**Voice Configuration:** `content/voices.json`

| Character | Voice ID | Notes |
|-----------|----------|-------|
| Sir James | `SOYHLrjzK2X1ezoPC6cr` | Harry + DSP pitch shift |
| Narrator | `XrExE9yKIg1WjnnlVkGX` | Matilda (female) |
| King Arthur | `JBFqnCBsd6RMkjVDRZzb` | George (british) |
| Gramps | `pqHfZKP75CvOlQylNhV4` | Bill (old male) |
| Claude | SFX only | Dog barks/whines |

**Generated Assets:** 86+ audio files in `public-book002/assets/audio/`

### Step 5: HTML Scene Wiring
**Script:** `tools/wire_chapter_html_v2.py`

Generates scene HTML with:
- All dialogue lines (not just first line)
- "Play Story" button for sequential audio playback
- Character-colored text boxes
- Navigation between scenes

### Step 6: Deployment
**Command:** `netlify deploy --prod --dir=public-book002 --no-build`

---

## Key Scripts Summary

| Script | Purpose | Command |
|--------|---------|---------|
| `generate_book002_assets.py` | Generate all images + audio | `python scripts/generate_book002_assets.py --all` |
| `eleven_agent.py` | ElevenLabs TTS | `python tools/eleven_agent.py synth --chapter 1` |
| `wire_chapter_html_v2.py` | Wire HTML scenes | `python tools/wire_chapter_html_v2.py --all` |
| `curate-chapters.ts` | Emoji → DALL-E prompts | Netlify Function |

---

## Current Asset Status

### Images (86 total)
- Chapter 1: 5 scenes ✅
- Chapter 2: 5 scenes ✅
- Chapter 3: 3 scenes ✅
- Chapter 4: 16 scenes ✅
- Chapter 5: 34 scenes ✅
- Chapter 6: 4 scenes ✅
- Chapter 7: 7 scenes ✅
- Chapter 8: 4 scenes ✅
- Chapter 9: 4 scenes ✅
- Chapter 10: 4 scenes ✅

### Audio (86+ files)
- Narration files for all chapters ✅
- Character dialogue where applicable ✅

---

## Cost Tracking (Per Chapter)
- DALL-E images: ~$0.32 (8 images @ $0.04 each)
- ElevenLabs TTS: ~$0.15 (narration)
- GPT-4 prompts: ~$0.03 (narrative generation)
- **Total:** ~$0.50-0.60/chapter

---

## Recommended Workflow (Optimized)

### For New Chapters:
1. **Create narration batch:** Edit `_narration_batch.json` with dialogue
2. **Generate images:** `python scripts/generate_book002_assets.py --chapter N`
3. **Generate audio:** `python tools/eleven_agent.py synth --chapter N`
4. **Wire HTML:** `python tools/wire_chapter_html_v2.py --chapter N`
5. **Deploy:** `netlify deploy --prod --dir=public-book002 --no-build`

### For Regenerating Specific Assets:
```bash
# Force regenerate chapter 1 images
python scripts/generate_book002_assets.py --chapter 1 --force

# Test single voice line
python tools/eleven_agent.py test --voice sir_james --text "Hello!"
```

---

## Environment Variables Required

```env
# .env.local
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=sk_...
GEMINI_API_KEY=... (optional, for enhanced prompts)
NETLIFY_AUTH_TOKEN=...
NETLIFY_SITE_ID=ce3948ba-cece-4258-8f71-c1a9187f7a25
```

---

## Live Site
**URL:** https://sirjames-book002-final.netlify.app

---

*Last Updated: December 27, 2025*
*Consolidated from 2 years of preceding programming team workflows*
