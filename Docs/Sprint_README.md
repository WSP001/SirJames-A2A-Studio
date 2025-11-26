---
title: "Sprint README – Book001 → Book002 Conversion"
version: "1.0"
maintainer: "Scott Echols (WSP001)"
updated: "2025-11-25"
purpose: "Daily progress tracker and quick-start guide for converting Book001 emoji chapters into Book002 multimedia chapters."
tester: "Sir James (5-year-old grandson, personified as himself in the story)"
---

# 🚀 Sprint README — Book002 Multimedia Conversion

> **Goal:** Convert all **10 chapters** from **Book001 (Emoji Edition)** into **Book002 (Image + Audio Edition)** using **Chapter 03** as the canonical schema and asset template.  
> **Output:** 10 validated `prompt_bundle.json` files, matching images/audio assets, and verified Deploy Previews.  
> **Primary Tester:** Sir James himself — a 5-year-old on iPad (9th gen)  
> **Story Context:** Gramps (the grandfather) wrote this story about his grandson's adventures

---

## 📍 Project Root

```
C:\Users\Roberto002\OneDrive\Sir James\LOGIC SirJames_Interactive_Prototype_With_Chapter10\SirJames-A2A-Studio
```

**Launch via Click2Kick:**

```powershell
# GUI launcher (double-click in File Explorer)
.\Click2Kick.bat

# or directly from PowerShell
.\scripts\Click2Kick.ps1
```

**From the Click2Kick menu, use:**
- `1` Preview Chapter (Local Browser)
- `2` Test on Device (iPad URL)
- `3` Check Environment Health
- `4` Generate Chapter Assets (Images + Audio)
- `5` Build Chapter Video
- `6` Full Pipeline (All Steps)
- `7` Deploy Preview to Netlify
- `8` Deploy Production
- `9` View Cost Metrics
- `P` Open Parent Dashboard

---

## 🎭 Canonical Actors

| Actor | Emoji | Description | Voice ID |
|-------|-------|-------------|----------|
| **Sir James** | 👦 | 5-year-old boy, brave & curious | `VOICEID_SIR_JAMES` |
| **Claude** | 🐕 | Loyal hound companion | `VOICEID_CLAUDE` |
| **Gramps** | 🧓 | Ex-knight grandfather, storyteller | `VOICEID_GRAMPS` |
| **Sparky** | 🐿 | Mischievous squirrel friend | (narrator voice) |
| **Narrator** | 📖 | Warm, engaging storyteller | `VOICEID_NARRATOR` |

---

## 🧩 Daily Programmer Tasks

| Task | Owner | Script/Command | Output |
|------|-------|----------------|--------|
| Convert text | Converter Dev | `python tools/convert_book001_to_book002.py --all` | `/public-book002/ChapterXX/metadata/prompt_bundle.json` |
| Generate media | Asset Eng. | `python orchestrate_book002.py --range 01-10 --images --audio` | `/images/*.png`, `/audio/*.mp3` |
| Validate | CI Eng. | `python tools/validate_book002_prompts.py` | Schema & asset reports |
| Run QA locally | QA Lead | `netlify dev` → preview UI | Functional preview |
| Deploy preview | Netlify Ops | `netlify deploy --build --context=deploy-preview` | Temporary review URL |
| Promote to prod | Release Mgr | `netlify deploy --prod` | Live Book002 site |

---

## 🧭 Chapter Conversion Workflow

### Phase 1: Freeze Template
- Lock `schemas/book002_prompt.schema.json`
- Lock `public-book002/Chapter03` layout as reference

### Phase 2: Convert Chapters
- Strip emojis from Book001 text
- Map to canonical actors (Sir James 👦, Claude 🐕, Gramps 🧓, Sparky 🐿)
- Emit new `prompt_bundle.json` per chapter

### Phase 3: Generate Media Assets
- Create DALL-E 3 images via `images_generate.py`
- Create ElevenLabs narration via `eleven_agent.py`
- Track costs in `telemetry.ts`

### Phase 4: Validate + CI Check
- Run validators + unit tests
- CI matrix runs for all 10 chapters

### Phase 5: Preview → Review → Promote
- Use Netlify Deploy Previews
- QA each before merge to main
- Ship to Sir James (our 5-year-old tester!)

---

## 🧪 QA Checklist (Daily Stand-Up)

| Item | Expected Result | Status |
|------|-----------------|--------|
| Schema Validation | ✅ All `prompt_bundle.json` valid | ☐ |
| Image Assets | 8+ DALL-E images per chapter | ☐ |
| Audio Assets | Narration plays in browser | ☐ |
| Cost Tracking | < $0.60 per chapter | ☐ |
| Virtue Tracker Sync | Parent Dashboard updates instantly | ☐ |
| Accessibility | ARIA labels / emoji + text buttons | ☐ |
| Deploy Preview | 200 OK on all assets | ☐ |
| iPad Testing | Works on iPad 9th gen (Sir James) | ☐ |
| Prod Promotion | Netlify build = ✅ | ☐ |

---

## ⚙️ Environment Verification

Before deploys:

```powershell
# Windows
.\Verify-BuildEnv.ps1

# macOS/Linux
./verify-buildenv.sh
```

Must report:
- ✅ `OPENAI_API_KEY`
- ✅ `ELEVENLABS_API_KEY`
- ✅ `NETLIFY_AUTH_TOKEN`
- ✅ `PYTHON_VERSION` 3.12.x

---

## 📊 CI Matrix Summary

| Chapter | Build Time | Cost | Preview URL | QA Approved |
|---------|------------|------|-------------|-------------|
| 01 | ⏱ 2 min | 💰 $0.58 | (link) | ☐ |
| 02 | ⏱ 2 min | 💰 $0.60 | (link) | ☐ |
| 03 | ⏱ 2 min | 💰 $0.55 | (link) | ☐ |
| 04 | ⏱ 2 min | 💰 $0.58 | (link) | ☐ |
| 05 | ⏱ 2 min | 💰 $0.60 | (link) | ☐ |
| 06 | ⏱ 2 min | 💰 $0.57 | (link) | ☐ |
| 07 | ⏱ 2 min | 💰 $0.59 | (link) | ☐ |
| 08 | ⏱ 2 min | 💰 $0.58 | (link) | ☐ |
| 09 | ⏱ 2 min | 💰 $0.60 | (link) | ☐ |
| 10 | ⏱ 2 min | 💰 $0.59 | (link) | ☐ |

**Budget Target:** < $1.00 per chapter ✅

---

## 🧠 Memory & Commons Good Notes

- All agents log cost to `/telemetry`
- No personal data — Sir James is a fictional representation
- Attribution visible in `/attribution.html`
- Voice tone and illustrations rated G (ages 5–8)
- Netlify & GitHub secrets verified before each deploy
- Story written by Gramps for his grandson

---

## ✅ End-of-Day Routine

```powershell
# 1. Commit changes
git add .
git commit -m "daily progress: converted ch05, generated assets, validated OK"

# 2. Push to main
git push origin main

# 3. Verify CI passes
# 4. Review Deploy Preview
# 5. Update QA checklist
# 6. Test on iPad (ship to Sir James!)
```

---

## 📚 Related Docs

- **[AGENTS.md](../AGENTS.md)** – All agents & communication rules
- **[DEPLOYMENT_READY.md](../DEPLOYMENT_READY.md)** – Full deploy checklist
- **[WORKSPACE_FIX.md](../WORKSPACE_FIX.md)** – Folder setup & token guides
- **[BOOK002_IMAGE_AUDIO_PLAN.md](./BOOK002_IMAGE_AUDIO_PLAN.md)** – Detailed asset plan
- **[build/README.md](../build/README.md)** – Build commands & troubleshooting

---

## 🎯 Motto

> **"Build the memory before the masterpiece."**

Every build is part of Sir James' learning adventure — make it delightful, ethical, and under budget.

---

## 👨‍👦 About the Story

This is a story written by a grandfather (Gramps) about his grandson Sir James. The 5-year-old boy is both the main character AND our primary tester. When we ship to "Sir James," we're shipping to a real child who will experience his own adventure on an iPad.

**The magic:** A grandfather's love, turned into an interactive learning experience, powered by ethical AI, for the Commons Good.

---

*Last updated: November 25, 2025*
