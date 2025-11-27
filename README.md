# Sir James A2A Studio (Book002 Engine)

> **⚠️ IMPORTANT:** Book001 (emoji version) is **content-frozen**. All new work happens in Book002 in this repo. Do not edit Book001 content.

**The "Memory Keepers" Engine.**  
This repository contains the **High-Fidelity Automated Pipeline** (A2A Studio) for producing *Sir James' Adventures*. It implements a Doc-to-Agent (D2A) workflow where specialized AI agents collaborate to produce cinematic storybooks.

> **LIVE NOW:** [sirjames-book002-final.netlify.app](https://sirjames-book002-final.netlify.app)

---

## 🚦 Project Status: High-Fidelity Build

| Component | Status | Tech Stack |
|-----------|--------|------------|
| **Orchestration** | ✅ Active | Google Gemini 2.5 Flash |
| **Visuals** | 🟡 In Progress | DALL-E 3 (via Batch Script) |
| **Audio** | 🟡 In Progress | ElevenLabs (Character Finetunes) |
| **Music** | 🟡 In Progress | Suno AI (via Composer Agent) |
| **Attribution** | ✅ Ready | Commons Good License Engine |

### Chapter Progress

| Chapter | Images | Audio | HTML | Status |
|---------|--------|-------|------|--------|
| **Chapter 1** | ✅ 8/8 | ✅ 25/25 | ✅ 8/8 | **LIVE** |
| **Chapter 2** | ✅ 8/8 | 🟡 Ready | 🔴 | Images done |
| **Chapter 3** | ✅ 8/8 | 🔴 | 🔴 | Images done |
| **Chapter 4** | ✅ 8/8 | 🔴 | 🔴 | Images done |
| Chapter 5-10 | 🔴 | 🔴 | 🔴 | Run batch script |

---

## 🛠️ The 7-Agent Pipeline

We have moved beyond simple scripts to a robust multi-agent system managed by the **Creative Hub**:

1. **Director Agent** (`Gemini`): Breaks story concepts into scenes, enforces `CONSISTENCY.md` (e.g., Sir James' blue eyes).
2. **Writer Agent** (`Gemini`): Drafts screenplays with mood/tone tags for TTS.
3. **Voice Agent** (`ElevenLabs`): Synthesizes distinct character voices (Narrator, Sir James, Gramps, Claude).
4. **Composer Agent** (`Gemini` -> `Suno`): Generates musical briefs and Suno prompts for scoring.
5. **Editor Agent** (`FFmpeg`): *[Pending]* Assembles A/V layers with LUFS gating.
6. **Attribution Agent** (`System`): Generates `commons_spec.json` for CC-BY-NC-SA 4.0 compliance.
7. **Publisher Agent** (`Netlify`): Deploys the final interactive storybook.

---

## 👨‍💻 Developer Insights & Protocols

### 1. The "No-Mock" Policy
To ensure Book002 meets the high-quality bar, the **Creative Hub now enforces API Key validation** before starting the pipeline.
- **Required Keys:** `OPENAI_API_KEY`, `ELEVENLABS_API_KEY`, `GEMINI_API_KEY`
- **Why:** We cannot risk generating "placeholder" artifacts in the production build. If keys are missing, the pipeline halts.

### 2. Consistency is Code
We don't just prompt; we enforce.
- **Visuals:** Sir James must be consistently rendered with *blue eyes* and *royal blue tunic*.
- **Audio:** Claude must be a *Redbone Coonhound* (specific bark profile).
- **Source of Truth:** Refer to `CONSISTENCY.md` for the immutable ruleset.

### 3. The Commons Wrapper
We are building for the Commons. Every generation bundle includes a `commons_spec.json`. This file contains:
- Full creative credits (Human + AI Agents).
- License assertions (CC-BY-NC-SA 4.0).
- Raw prompt data (for reproducibility).

### 4. Voice System (ElevenLabs)
Multi-character voice synthesis with per-line caching. See **[docs/VOICE_SYSTEM.md](docs/VOICE_SYSTEM.md)** for:
- Voice IDs & settings for all characters
- JSON script format with character tagging
- SFX support for Claude (dog sounds)
- Cost estimation & migration strategy

---

## 🚀 Quick Start (Book002 Workflow)

### 1. Environment Setup
Ensure your `.env.local` is populated:
```env
OPENAI_API_KEY=sk-...         # DALL-E 3 images
ELEVENLABS_API_KEY=xi...      # Voice synthesis
GEMINI_API_KEY=AIza...        # Orchestration (optional)
```

> **Note:** API keys are for LOCAL asset generation only. Do NOT add them to Netlify.

### 2. Using `sirjames-dev` (Clean Local Dev Shell)

This project includes a **lightweight dev shell** for Roberto/Gramps and contributors.

**Goal:** Jump straight into `SirJames-A2A-Studio` with Python ready, **no noisy Windsurf/Docker banners**.

#### How to Start the Dev Shell

**Recommended for Roberto:**
- Double-click `sirjames-dev.cmd` on the Desktop
- OR press `Win + R`, type: `sirjames-dev`

This opens a clean PowerShell session:
- Working directory = `SirJames-A2A-Studio`
- Python ready
- No Windsurf "DevShell" banner spam

> **Note:** Running PowerShell inside Windsurf may still show Windsurf's injected profile.
> For a truly clean experience, launch via Desktop shortcut or `Win + R`.

#### Shortcut Commands (inside sirjames-dev)

| Command  | Description                          |
|----------|--------------------------------------|
| `status` | Show high-level Book002 asset status |
| `img`    | Run DALL-E image generation helper   |
| `audio`  | Run ElevenLabs audio generation      |
| `icons`  | Generate Claude thought-bubble icons |
| `serve`  | Start local preview on :8888         |
| `deploy` | Deploy Book002 to Netlify (with confirmation) |

### 3. Asset Generation

```powershell
# Inside sirjames-dev shell:
img 3      # Generate images for Chapter 3
audio 3    # Generate audio for Chapter 3
icons      # Generate thought bubble icons
```

Or use the direct commands:
```powershell
python tools/images_generate.py --chapter 3 --size 1792x1024 --quality hd --max-usd 1.00
python tools/eleven_agent.py synth --chapter 3 --max-usd 1.00
```

### 4. Test Locally

```powershell
serve
# Opens: http://127.0.0.1:8888
```

### 5. Deploy to Netlify

```powershell
deploy
# Runs pre-flight checks, asks for confirmation, then deploys
```

---

## 🌐 Netlify Deployment Requirements (Book002)

### Target

- **Site:** `sirjames-book002-final` (Netlify)
- **Live URL:** https://sirjames-book002-final.netlify.app
- **Source repo:** https://github.com/WSP001/SirJames-A2A-Studio
- **App type:** Static site, no framework build required
- **Publish directory:** `public-book002/`

This project **does not need** a complex build step for Book002.
Everything is pre-generated into `public-book002` by our Python tools.

### Netlify Configuration

In `netlify.toml`:
```toml
[build]
  command = "echo 'Book002 static deploy - no build required'"
  publish = "public-book002"

[dev]
  command = "npx http-server public-book002 -p 5173"
  targetPort = 5173
  port = 8888
```

### Netlify CLI Wiring

Requirements:
1. Netlify CLI installed: `npm install -g netlify-cli`
2. Local folder linked to site (one-time setup by programmer):
   ```bash
   netlify login
   netlify link    # choose site: sirjames-book002-final
   ```

After linking, the `deploy` command in `sirjames-dev` runs:
```bash
netlify deploy --prod --dir=public-book002 --message "Book002: Gramps deploy via sirjames-dev"
```

### Environment Variables

For **local asset generation only** (NOT required on Netlify):
- `OPENAI_API_KEY` – used by `tools/images_generate.py`
- `ELEVENLABS_API_KEY` – used by `tools/eleven_agent.py`

These should live in `.env.local` on the local machine.

**Important:**
- ❌ Do not commit `.env.local`
- ❌ Do not copy these keys into Netlify environment vars
- Book002 is a pre-generated static experience – Netlify serves assets only

---

## 📁 Project Structure

```
SirJames-A2A-Studio/
├── public-book002/              # DEPLOYED CONTENT
│   ├── chapter01/
│   │   ├── images/              # DALL-E generated PNGs
│   │   ├── audio/               # ElevenLabs MP3s
│   │   ├── scene-001/           # Scene HTML (wired)
│   │   ├── _media_prompts.json
│   │   └── _narration_batch.json
│   └── index.html
├── prompts/book002/json/        # 80 per-scene prompt JSONs
├── assets/prompts/book002/      # Enhanced prompt sources
├── tools/
│   ├── images_generate.py       # DALL-E image generation
│   ├── eleven_agent.py          # ElevenLabs TTS generation
│   ├── wire_chapter_html.py     # Batch-wire scenes to assets
│   └── split_prompts_to_scenes.py
├── scripts/
│   ├── Generate-AllImages.ps1   # Batch image generation
│   └── Click2Kick.ps1           # User-friendly menu
├── AGENTS.md                    # 7-Agent pipeline definitions
├── BOOK002_STATUS.md            # Detailed progress tracker
└── CONSISTENCY.md               # Character canon rules
```

---

## 💰 Cost Tracking

| Asset Type | Per Unit | Per Chapter | 10 Chapters |
|------------|----------|-------------|-------------|
| DALL-E 3 HD (1792x1024) | $0.08 | $0.64 | $6.40 |
| ElevenLabs TTS | ~$0.03/line | $0.78 | $7.80 |
| GPT-4 prompts | $0.01 | $0.03 | $0.30 |
| **Total** | - | **~$1.45** | **~$14.50** |

**Current spend:** ~$2.56 (Chapters 1-4 images + Chapter 1 audio)

---

## 🎭 Characters (Canon)

| Character | Description | Voice |
|-----------|-------------|-------|
| **Sir James** | 5yo boy, **blue eyes**, royal blue tunic, wooden sword | ElevenLabs Child |
| **Claude** | Redbone Coonhound, reddish-brown, royal blue collar | ElevenLabs Deep |
| **Gramps** | Ex-knight mentor, silver beard, puzzle-stone cottage | ElevenLabs Elder |
| **Sparky** | Magical brown squirrel with sparkles | ElevenLabs Bright |
| **Guardian** | Ethereal branch-figure, gentle green glow | ElevenLabs Mystical |

---

## 🌟 Virtues System

Each chapter teaches one of three virtues through choices:

- **Courage** - Facing fears, standing up for others
- **Wisdom** - Thinking before acting, learning from mistakes
- **Trust** - Believing in friends, asking for help

---

## 📅 Roadmap (The "Full Workload")

- [x] **Phase 1:** Lock foundations & Freeze Book001.
- [x] **Phase 2:** Consolidate Prompts (Split into 80 per-scene JSONs).
- [ ] **Phase 3:** Generate HD Images (Chapters 5-10 remaining).
- [ ] **Phase 4:** Generate Audio (ElevenLabs batching).
- [ ] **Phase 5:** Wire HTML Templates.
- [ ] **Phase 6:** Progress Tracking & Dashboard.
- [ ] **Phase 7:** Final Polish & Netlify Deploy.

---

## 📚 Related Documentation

- [AGENTS.md](./AGENTS.md) - 7-Agent pipeline definitions
- [BOOK002_STATUS.md](./BOOK002_STATUS.md) - Detailed chapter status
- [CONSISTENCY.md](./CONSISTENCY.md) - Character canon rules
- [Docs/BOOK002_IMAGE_AUDIO_PLAN.md](./Docs/BOOK002_IMAGE_AUDIO_PLAN.md) - Full plan

---

## ⚖️ Commons Good Compliance

- **Transparency:** All costs logged to telemetry
- **Privacy:** No PII stored
- **Attribution:** AI systems credited (OpenAI, ElevenLabs, Suno)
- **Ethics:** Age-appropriate content (5-8 years)
- **Accessibility:** ARIA labels, keyboard navigation
- **License:** CC-BY-NC-SA 4.0 (Commons Good)

---

> **Mission:** *"Build the memory before the masterpiece."*

*Built with ❤️ for the Commons Good.*
