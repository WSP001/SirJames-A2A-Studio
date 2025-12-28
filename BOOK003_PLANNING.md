# 📚 Sir James Adventures Book003 - Planning Document

> **Mission:** "Build the memory before the masterpiece."

## 🎯 Book002 Patterns to Carry Forward

### ✅ What Worked (Book002 Success Patterns)

| Pattern | Implementation | Result |
|---------|---------------|--------|
| **Three-Plane Orchestration** | Creative → Execution → Governance | Clean separation of concerns |
| **Typed Hand-offs** | JSON/YAML between agents | Errors stay local, APIs swappable |
| **Multi-line Scene HTML** | `wire_chapter_html_v2.py` | Rich dialogue with sequential audio |
| **Cost Tracking** | <$1/chapter target | $0.60/chapter achieved |
| **Claude SFX** | `audio/sfx/dog-bark.mp3` | Character audio effects |

### 📁 File Structure (Proven)

```
public-book003/
├── chapters.json              # Master chapter metadata
├── index.html                 # Landing page with 10 chapter cards
├── chapter{NN}/
│   ├── _narration_batch.json  # Multi-line dialogue per scene
│   ├── _media_prompts.json    # DALL-E prompts + alt text
│   ├── index.html             # Chapter index with scene thumbnails
│   ├── images/
│   │   └── scene-{NNN}.png    # HD DALL-E images (1792x1024)
│   ├── audio/
│   │   ├── voices/            # ElevenLabs TTS per line
│   │   └── sfx/               # Sound effects (barks, etc.)
│   └── scene-{NNN}/
│       └── index.html         # Scene page with dialogue + audio
```

---

## 🧠 Book003 Enhancements (From Your Vision)

### 1. Memory Compiler Agent
```yaml
agent: memory_compiler
purpose: Track lineage, enable self-improvement
stores:
  - handoff_id: unique ID per agent output
  - project_id: "book003"
  - asset_id: per image/audio/html
  - lineage: which prompt → which asset
database: Firestore | SQLite | JSON index
```

### 2. Unified Schema (Single Source of Truth)
```json
{
  "project_id": "book003",
  "chapter": 1,
  "scene": 1,
  "narrative": {
    "script": "Sir James stood at the castle gate...",
    "tone": "adventurous",
    "voice_profile": {"model": "ElevenLabs-Harry", "pitch": 0}
  },
  "music": {
    "style": "whimsical orchestral",
    "tempo_bpm": 120,
    "engine": "Suno"
  },
  "visuals": {
    "style": "Disney/Pixar 3D",
    "lighting": "golden hour",
    "camera": "child eye level"
  },
  "virtues": ["courage", "wisdom", "trust"]
}
```

### 3. Semantic Markdown Controls
```markdown
![CUT](#transition=crossfade;duration=1.5)
🎵 **Cue:** Verse_2  <!-- triggers Suno marker -->
🗣️ **Voice:** "We raced the tide..." <!-- aligns ElevenLabs segment -->
💭 **Claude:** *Your courage grows stronger...* <!-- thought bubble -->
```

### 4. Smart API Router
```json
// config/a2a_router.json
{
  "text_generation": {"primary": "Gemini", "fallback": "Claude-Sonnet"},
  "audio_tts": {"primary": "ElevenLabs", "fallback": "Gemini-TTS"},
  "music": {"primary": "Suno", "fallback": "internal-MIDI"},
  "code_gen": {"primary": "Codex", "fallback": "Claude-Code"},
  "images": {"primary": "DALL-E-3", "fallback": "Midjourney"}
}
```

### 5. Sync-Score Utility
```python
# tools/sync_score.py
# Aligns narration pauses with music tempo
# Input: music_brief.tempo_bpm + storyline_markdown.json.durations
# Output: beat alignment markers for Gemini re-timing
```

---

## 🎭 Character System (Canonical)

| Character | Role | Voice ID | Notes |
|-----------|------|----------|-------|
| **Sir James** | 4-6 year old knight | `SOYHLrjzK2X1ezoPC6cr` (Harry) | Main protagonist |
| **Claude** | Redbone Coonhound | SFX only | Telepathic thought bubbles 💭 |
| **Gramps** | Retired knight mentor | `pqHfZKP75CvOlQylNhV4` (Bill) | Moral compass |
| **Sparky** | Mischievous squirrel | TBD | Comic relief |
| **Narrator** | Story guide | `XrExE9yKIg1WjnnlVkGX` (Matilda) | Female narrator |
| **King Arthur** | Royal authority | `JBFqnCBsd6RMkjVDRZzb` (George) | Quest giver |

### Claude's Thought Bubble System
- **Visual:** Comic cloud edge, white fill, gray border
- **Functions:** Reassurance, Guidance, Foreshadowing, Celebration
- **Detection:** `💭`, `*italic*`, "thought bubble", "telepathic"
- **Animation States:** `Idle_Blink`, `Bubble_Appear`, `Bubble_Pulse`, `Bubble_Disappear`

---

## 🛠️ Tools Created for Book002 (Reusable)

| Tool | Purpose | Location |
|------|---------|----------|
| `wire_chapter_html_v2.py` | Generate multi-line scene HTML | `tools/` |
| `build_manifest_index.py` | Create searchable content manifest | `tools/` |
| `generate_thought_icons.py` | DALL-E thought bubble icons | `tools/` |
| `Verify-BuildEnv.ps1` | Environment validation | Root |

---

## 📊 Book002 Final Stats

| Metric | Value |
|--------|-------|
| **Chapters** | 10 |
| **Scenes** | 80 |
| **HD Images** | 80 |
| **Audio Lines** | 250 |
| **Complete Scenes** | 79/80 |
| **Cost per Chapter** | ~$0.60 |
| **Total Cost** | ~$13 |
| **Deploy URL** | https://sirjames-book002-final.netlify.app |

---

## 🚀 Book003 Roadmap

### Phase 1: Foundation
- [ ] Create `public-book003/` structure
- [ ] Port `chapters.json` template
- [ ] Set up Memory Compiler agent
- [ ] Create unified schema validator

### Phase 2: Content Pipeline
- [ ] Write 10 new chapter narratives
- [ ] Generate DALL-E image prompts
- [ ] Create narration batch JSONs
- [ ] Add Claude thought bubble markers

### Phase 3: Asset Generation
- [ ] Generate HD images (DALL-E 3)
- [ ] Generate TTS audio (ElevenLabs)
- [ ] Add background music (Suno)
- [ ] Create sound effects

### Phase 4: Assembly
- [ ] Wire HTML for all scenes
- [ ] Build chapter index pages
- [ ] Create landing page
- [ ] Add parent dashboard

### Phase 5: Polish
- [ ] QA on iPad
- [ ] Tune voice settings
- [ ] Add sync-score alignment
- [ ] Deploy to Netlify

---

## 📝 Source Documents (For Narrative)

| Document | Location | Content |
|----------|----------|---------|
| Master Narrative | `1 10 Sir James CHAPTERs Narrator Adventures Flow.docx` | All 10 chapters base text |
| Story Blueprint | `SET UP SIR JAMES STORY BOOK.docx` | Scene breakdowns, decision trees |
| Production Manuscript | `MJ001SIR JAME STORIES OF ADVENTURES BOOK001.docx` | Actor lines, virtue tags |

---

## 🔗 Related Files

- `AGENTS.md` - Agent definitions and communication rules
- `BOOK002_STATUS.md` - Book002 completion dashboard
- `PRODUCTION_READY.md` - API keys and pipeline status
- `assets/manifests/project.index.json` - Searchable content manifest
- `assets/manifests/project.index.html` - Interactive manifest viewer

---

**Last Updated:** November 28, 2025  
**Next Action:** Start Book003 narrative writing when ready!
