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

---

## 🚀 Quick Start (Book002 Workflow)

### 1. Environment Setup
Ensure your `.env.local` is populated:
```env
OPENAI_API_KEY=sk-...         # DALL-E 3 images
ELEVENLABS_API_KEY=xi...      # Voice synthesis
GEMINI_API_KEY=AIza...        # Orchestration (optional)
NETLIFY_AUTH_TOKEN=...        # Deployment
```

### 2. Asset Generation (Batch)
For mass-production of remaining chapters:
```powershell
# Generate images for Chapters 5-10
.\scripts\Generate-AllImages.ps1

# Generate audio for Chapter 2
python tools/eleven_agent.py synth --chapter 2 --max-usd 1.00
```

### 3. Test Locally
```powershell
npx http-server public-book002 -p 8888
# Open: http://localhost:8888/chapter01/scene-001/
```

### 4. Deploy to Netlify
```powershell
npx netlify deploy --dir="public-book002" --prod --no-build
```

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
