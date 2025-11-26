# Sir James Adventures Book002 - Image/Audio Version

Interactive virtue-choice storybook with **DALL-E images** and **ElevenLabs audio narration** for ages 5-8.

> **LIVE NOW:** [sirjames-book002-final.netlify.app](https://sirjames-book002-final.netlify.app)

---

## Current Status

| Chapter | Images | Audio | HTML | Status |
|---------|--------|-------|------|--------|
| **Chapter 1** | 8/8 | 25/25 | 8/8 | **LIVE** |
| Chapter 2-10 | 0 | 0 | 0 | Pending |

---

## Quick Start

```powershell
# Double-click to launch menu
.\Click2Kick.bat

# Or run directly
.\scripts\Click2Kick.ps1
```

### Test Locally

```powershell
npx http-server public-book002 -p 8888
# Open: http://localhost:8888/chapter01/scene-001/
```

### Deploy to Netlify

```powershell
npx netlify deploy --dir="public-book002" --prod --no-build
```

---

## Project Structure

```
SirJames-A2A-Studio/
├── public-book002/           # DEPLOYED CONTENT
│   ├── chapter01/
│   │   ├── images/           # DALL-E generated PNGs
│   │   ├── audio/            # ElevenLabs MP3s
│   │   ├── scene-001/        # Scene HTML (wired)
│   │   ├── _media_prompts.json
│   │   └── _narration_batch.json
│   └── index.html
├── prompts/book002/json/     # Source prompts per chapter
├── tools/
│   ├── wire_chapter_html.py  # Batch-wire scenes to assets
│   ├── eleven_agent.py       # ElevenLabs TTS generation
│   └── dalle_agent.py        # DALL-E image generation
├── scripts/
│   └── Click2Kick.ps1        # User-friendly menu
└── AGENTS.md                 # Agent definitions
```

---

## Characters (Canon)

| Character | Description | Voice |
|-----------|-------------|-------|
| **Sir James** | 5yo boy, blue eyes, royal blue tunic, wooden sword | ElevenLabs Child |
| **Claude** | Redbone Coonhound, reddish-brown, royal blue collar | ElevenLabs Deep |
| **Gramps** | Ex-knight mentor, silver beard, puzzle-stone cottage | ElevenLabs Elder |
| **Sparky** | Magical brown squirrel with sparkles | ElevenLabs Bright |
| **Guardian** | Ethereal branch-figure, gentle green glow | ElevenLabs Mystical |

---

## Asset Generation Pipeline

### 1. Generate Images (DALL-E 3)

```powershell
python tools/dalle_agent.py --chapter 1
# Cost: ~$0.04/image, 8 images = $0.32/chapter
```

### 2. Generate Audio (ElevenLabs)

```powershell
python tools/eleven_agent.py --chapter 1
# Cost: ~$0.006/line, 25 lines = $0.15/chapter
```

### 3. Wire HTML to Assets

```powershell
python tools/wire_chapter_html.py --chapter 1
# Generates scene HTML with correct image/audio paths
```

---

## Cost Tracking

| Asset Type | Per Unit | Per Chapter | 10 Chapters |
|------------|----------|-------------|-------------|
| DALL-E 3 HD | $0.04 | $0.32 | $3.20 |
| ElevenLabs | $0.006 | $0.15 | $1.50 |
| GPT-4 prompts | $0.01 | $0.03 | $0.30 |
| **Total** | - | **$0.50** | **$5.00** |

---

## API Keys Required

Store in `.env.local` (git-ignored):

```env
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
GEMINI_API_KEY=...        # Optional, for validation
NETLIFY_AUTH_TOKEN=...    # For deployment
```

---

## Virtues System

Each chapter teaches one of three virtues through choices:

- **Courage** - Facing fears, standing up for others
- **Wisdom** - Thinking before acting, learning from mistakes  
- **Trust** - Believing in friends, asking for help

---

## Related Documentation

- [AGENTS.md](./AGENTS.md) - Agent pipeline definitions
- [BOOK002_STATUS.md](./BOOK002_STATUS.md) - Detailed chapter status
- [docs/BOOK002_IMAGE_AUDIO_PLAN.md](./docs/BOOK002_IMAGE_AUDIO_PLAN.md) - Full plan
- [docs/Sprint_README.md](./docs/Sprint_README.md) - Sprint workflow

---

## Commons Good Compliance

- **Transparency:** All costs logged
- **Privacy:** No PII stored
- **Attribution:** AI systems credited (OpenAI, ElevenLabs)
- **Ethics:** Age-appropriate content (5-8 years)
- **Accessibility:** ARIA labels, keyboard navigation

---

## License

MIT

---

> **Mission:** "Build the memory before the masterpiece."
