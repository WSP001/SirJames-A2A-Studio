# 🎭 Sir James Voice System

> Multi-character voice synthesis using ElevenLabs TTS + SFX

---

## 📁 File Structure

```
SirJames-A2A-Studio/
├── content/
│   ├── voices.json              ← Voice IDs & settings for all characters
│   ├── sfx/
│   │   └── claude/              ← Dog SFX files (barks, woofs, whines)
│   └── out/                     ← Generated audio output
│       └── chapter01/
│           └── scene-001/
│               ├── 001-narrator.mp3
│               ├── 002-king_arthur.mp3
│               ├── 003-sir_james.mp3
│               └── 004-claude_sfx.mp3
│
└── prompts/
    └── scripts/
        ├── voice-samples.json   ← Sample clips for approval
        └── chapter01/
            └── scene-001.json   ← Per-scene dialogue scripts
```

---

## 🎤 Characters & Voices

| Character | Voice Source | Voice ID | Notes |
|-----------|--------------|----------|-------|
| **Sir James** | ElevenLabs Library | `LIB_BELLA` | Youthful, bright (5-year-old boy) |
| **Claude** | SFX Files | N/A | Dog barks/woofs (not TTS) |
| **Gramps** | ElevenLabs Library | `LIB_ANTONI` | Warm baritone narrator |
| **Narrator** | ElevenLabs Library | `LIB_RACHEL` | Neutral storyteller |
| **King Arthur** | ElevenLabs Library | `LIB_ARNOLD` | Royal, measured |

> **Note:** `LIB_*` are placeholder IDs. Replace with real ElevenLabs voice IDs.

---

## ⚙️ Voice Settings

| Setting | Sir James | Gramps | Narrator | King Arthur |
|---------|-----------|--------|----------|-------------|
| **stability** | 0.78 | 0.72 | 0.75 | 0.70 |
| **similarity_boost** | 0.90 | 0.88 | 0.85 | 0.86 |
| **style** | 0.20 | 0.15 | 0.10 | 0.18 |
| **use_speaker_boost** | true | true | true | true |
| **wpm_target** | 160 | 150 | 155 | 150 |

---

## 📝 Script Format (JSON)

Each scene has a JSON script file with tagged dialogue:

```json
{
  "scene_id": "chapter01/scene-001",
  "title": "The Quest Begins",
  "lines": [
    { "id": "001", "character": "narrator", "text": "In the great hall..." },
    { "id": "002", "character": "king_arthur", "text": "Young Sir James..." },
    { "id": "003", "character": "sir_james", "text": "I am ready!" },
    { "id": "004", "character": "claude", "sfx": "dog_bark_excited_01", "text": "" }
  ]
}
```

### Line Properties

| Property | Required | Description |
|----------|----------|-------------|
| `id` | ✅ | Unique line ID (for caching) |
| `character` | ✅ | Character name (matches voices.json) |
| `text` | ✅ | Dialogue text (empty for SFX) |
| `sfx` | ❌ | SFX asset name (for Claude) |
| `emotion` | ❌ | Optional emotion hint |
| `pause_ms` | ❌ | Pause after line (ms) |

---

## 🐕 Claude SFX Library

Claude uses pre-recorded SFX instead of TTS:

| SFX ID | File | Usage |
|--------|------|-------|
| `dog_bark_excited_01` | `sfx/claude/bark_excited_01.mp3` | Happy/excited moments |
| `dog_bark_alert_01` | `sfx/claude/bark_alert_01.mp3` | Warning/alert |
| `dog_whine_sad_01` | `sfx/claude/whine_sad_01.mp3` | Sad moments |
| `dog_woof_happy_01` | `sfx/claude/woof_happy_01.mp3` | Greeting/acknowledgment |
| `dog_pant_01` | `sfx/claude/pant_01.mp3` | Running/tired |

---

## 🔄 Audio Generation Workflow

### 1. Generate Voice Samples (Approval)
```bash
curl -X POST "$URL/.netlify/functions/narrate-project" \
  -H "Content-Type: application/json" \
  -d @prompts/scripts/voice-samples.json
```

### 2. Generate Scene Audio
```bash
curl -X POST "$URL/.netlify/functions/narrate-project" \
  -H "Content-Type: application/json" \
  -d @prompts/scripts/chapter01/scene-001.json
```

### 3. Output Files
```
content/out/chapter01/scene-001/
├── 001-narrator.mp3
├── 002-king_arthur.mp3
├── 003-sir_james.mp3
└── 004-claude_sfx.mp3
```

---

## 💰 Cost Estimation

| Metric | Value |
|--------|-------|
| Avg chars per line | 90 |
| Lines per scene | ~3-5 |
| Total scenes | 80 |
| Estimated chars | ~25,920 |
| With 20% overhead | ~31,000 |

> Hash cache means re-runs of unchanged lines cost $0.

---

## 🔄 Migration Strategy (Existing Audio)

| Line Type | Action |
|-----------|--------|
| **Narrator lines** | ✅ Keep existing (already paid) |
| **Dialogue lines** | 🔁 Regenerate with character voices |
| **Claude SFX** | 🆕 Add SFX files |

### Logic in `narrate-project`:
```javascript
if (character === 'narrator' && fileExists(lineId)) {
  reuse(); // Keep existing narrator audio
} else if (character === 'claude') {
  fetchSFX(line.sfx); // Use SFX file
} else {
  synthesize(line); // Generate TTS
}
```

---

## 🧪 Testing Checklist

- [ ] Replace `LIB_*` placeholders with real ElevenLabs voice IDs
- [ ] Generate voice samples for approval
- [ ] Approve Sir James voice (youthful, 5-year-old)
- [ ] Approve Gramps voice (warm grandfather)
- [ ] Approve King Arthur voice (royal, kind)
- [ ] Add Claude SFX files to `content/sfx/claude/`
- [ ] Test full scene generation
- [ ] Verify audio plays in browser

---

## 🔐 Environment Variables

```env
ELEVENLABS_API_KEY=your_api_key_here
BUDGET_MAX_TTS_CHARS_PER_RUN=50000
DRY_RUN=false
```

---

## 📚 Related Files

- `content/voices.json` - Voice configuration
- `prompts/scripts/voice-samples.json` - Sample generation request
- `prompts/scripts/chapter01/scene-001.json` - Scene 1 script
- `netlify/functions/narrate-project.ts` - Audio generation function

---

**Last Updated:** November 26, 2025
