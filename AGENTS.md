---
title: "AGENTS.md – Sir James Adventures Book002 Multimedia"
version: 1.3.1
maintainer: "Scott Echols / WSP001"
updated: "2025-11-19"
mission: "Build the memory before the masterpiece."
description: "Defines all active and planned agents powering the Sir James Adventures Book002 Image/Audio pipeline."
repository: "WSP001/SirJames-A2A-Studio"
license: "Commons Good / MIT Hybrid"
primary_host: "sirjames-book002-final.netlify.app"
---

# 🧠 AGENTS.md — Sir James Adventures Book002

> This document defines every autonomous agent, its role, dependencies, and communication rules  
> for **Book002 (Image/Audio Multimedia)** — the AI-powered pipeline that converts emoji-based chapters  
> into fully immersive learning experiences with DALL-E images, ElevenLabs voices, and Suno music.

---

## 🎯 Purpose

To provide a consistent, machine-readable guide for all developers and AI assistants (Byterover MCP, Windsurf, Copilot, etc.)  
so they understand:
- **What roles exist** in the 7-agent pipeline
- **How data flows** between agents
- **Which safeguards apply** (Commons Good compliance)
- **How costs are tracked** (target: <$1.00/chapter)

---

## 🧩 Core Agents (7)

| Agent | Description | Key Functions | Tools |
|:--|:--|:--|:--|
| 🎬 **Chapter Curator** | Converts emoji list → DALL-E image prompts | `curate-chapters.ts` | OpenAI GPT-4, Byterover MCP |
| ✍️ **Story Narrator** | Generates age-appropriate narrative text | `narrate-project.ts` | GPT-4-Turbo, Memory Store |
| 🗣 **Voice Agent** | Synthesizes Sir James, Claude, Gramps voices | `text-to-speech.ts` | ElevenLabs API (3 voices) |
| 🎵 **Music Composer** | Creates chapter background music | `generate-music.ts` | Suno API |
| 🎞 **Chapter Compiler** | Assembles HTML chapters with images/audio | (planned) | Vite build system |
| ✨ **Attribution Agent** | Credits AI systems + Commons Good metadata | `generate-attribution.ts` | Local FS, Netlify Storage |
| 🌐 **Publisher Agent** | Deploys to Netlify + updates dashboards | `publish.ts` | Netlify Functions, Netlify CLI |

---

## ⚙️ System Agents (3)

| Agent | Description | Core Files |
|:--|:--|:--|
| 🧠 **Memory Agent** | Stores chapter preferences and learning patterns | `byterover-store-knowledge`, `byterover-retrieve-knowledge` |
| 📊 **Telemetry Agent** | Tracks costs, runtimes, success rates | `telemetry.ts`, `analytics.ts` |
| 💎 **Virtue Tracker Agent** | Monitors learning virtues (courage, kindness, curiosity) | `virtue-tracker.ts` |

---

## 🧰 Utility Agents (2)

| Agent | Role | Tools |
|:--|:--|:--|
| 🔐 **Secrets Manager** | Validates API keys before deploy | `Verify-BuildEnv.ps1`, `verify-buildenv.sh` |
| ⚡ **Worker Runner** | Executes scheduled background jobs | `worker_runner.py`, `worker_manifest.yml` |

---

## 🔄 Agent Communication Rules

### **1. Knowledge Storage**
Every agent calls `byterover-store-knowledge` after completing work:
```typescript
await byterover.store("curator", { 
  chapterNumber: 1,
  imageCount: 8,
  theme: "Castle Adventure",
  preferredStyle: "bright cartoon"
});
```

### **2. Knowledge Retrieval**
Before starting, agents query previous context:
```typescript
const prefs = await byterover.retrieve("curator.preferences");
const lastTheme = prefs?.theme || "adventure";
```

### **3. Telemetry Logging**
All agents write to `telemetry.ts`:
```typescript
import { startAgent, endAgent, estimateDalleCost } from './lib/telemetry';

const trackingId = startAgent('curator');
// ... do work ...
const cost = estimateDalleCost(imageCount);
endAgent('curator', true, cost, imageCount);
```

### **4. Cost Tracking**
Target: **< $1.00 per chapter**

**Current breakdown:**
- 🎨 DALL-E images: $0.32 (8 images @ $0.04 each)
- 🗣 ElevenLabs TTS: $0.15 (narration)
- ✍️ GPT-4 prompts: $0.03 (narrative generation)
- 🎵 Suno music: $0.10 (background audio)
- **Total:** $0.60 ✅ **Under budget!**

### **5. Virtue Feedback**
`virtue-tracker.ts` updates `/parent-dashboard.html`:
- 🏅 **Story Explorer** (10 chapters completed)
- 🎨 **Imagination Builder** (created drawings)
- 💬 **Discussion Starter** (reflection questions answered)

---

## 🛡 Commons Good Compliance

Every agent must uphold these principles:

| Principle | Implementation |
|:--|:--|
| **Transparency** | All costs logged to `/telemetry` endpoint |
| **Privacy** | No personal data; Sir James is a character name only |
| **Attribution** | Every AI system credited (OpenAI, ElevenLabs, Suno) |
| **Ethics** | Content rated PG (ages 5-8); age-appropriate themes |
| **Sustainability** | Cost target < $1.00/chapter verified by Telemetry |
| **Accessibility** | ARIA labels, keyboard navigation, screen reader support |

---

## 🧱 Tool Stack Overview

| Category | Primary | Secondary | Cost |
|:--|:--|:--|:--|
| **Text Generation** | OpenAI GPT-4-Turbo | Gemini 1.5 Pro | $0.03/ch |
| **Image Generation** | DALL-E 3 (HD 1792x1024) | - | $0.32/ch |
| **Voice Synthesis** | ElevenLabs (3 voices) | - | $0.15/ch |
| **Music Generation** | Suno API | - | $0.10/ch |
| **Memory System** | Byterover MCP | Redis (future) | Free |
| **Metrics** | Custom Telemetry | Netlify Analytics | Free |
| **Hosting** | Netlify Functions | Heroku (backup) | Free tier |
| **CI/CD** | GitHub Actions | - | Free |
| **Build** | Vite + TypeScript | - | Free |

**Total:** ~$0.60/chapter ✅

---

## 🚀 Current Agent Status

### **✅ Implemented (Book002 MVP)**
- ✅ Chapter Curator (`curate-chapters.ts`)
- ✅ Telemetry Agent (`telemetry.ts`)
- ✅ Cost Tracking Dashboard (`CostMeter.tsx`)
- ✅ Secrets Manager (both PS1 + Bash)
- ✅ Memory Agent (Byterover MCP integration)

### **⏳ In Progress**
- ⏳ Story Narrator (adapt from SirTrav)
- ⏳ Voice Agent (needs ElevenLabs voice IDs)
- ⏳ Music Composer (needs Suno API key)
- ⏳ Chapter Compiler (HTML assembly)
- ⏳ Publisher Agent (Netlify deployment)

### **📋 Planned (Phase 2)**
- 📋 Attribution Agent
- 📋 Virtue Tracker Agent
- 📋 Worker Runner (scheduled jobs)

---

## 🧩 Future Agents (Phase 2+)

| Agent | Role | Why Add It |
|:--|:--|:--|
| 🧩 **Reflection Agent** | Generates parent/child discussion prompts | Closes learning loop |
| 🪄 **Personalization Agent** | Greets returning users dynamically | Improves engagement |
| 🧰 **Backup Agent** | Automates weekly vault backups to S3 | Data durability |
| 📈 **Impact Reporter** | Monthly Commons Good transparency report | Public accountability |
| 🎨 **Art Director Agent** | Ensures character consistency across images | Visual quality |
| 📚 **Curriculum Agent** | Maps chapters to educational standards | Learning objectives |

---

## ⚙️ Developer Commands

| Action | Command | Location |
|:--|:--|:--|
| **Install dependencies** | `npm ci && pip install -r requirements.txt` | Root |
| **Run locally** | `netlify dev` | Opens on port 8888 |
| **Verify environment** | `.\Verify-BuildEnv.ps1` | Windows |
| **Verify environment** | `./verify-buildenv.sh` | Mac/Linux |
| **Test pipeline** | `.\TEST_PIPELINE.ps1` | Tests all agents |
| **Deploy production** | `netlify deploy --prod` | Requires auth token |
| **Run background tasks** | `python worker_runner.py` | Future feature |

---

## 📜 Code Conventions

### **Commons Good Compliance Block**
Every agent file must include:
```typescript
/**
 * Commons Good Compliance
 * - Cost: under $1 per chapter
 * - Attribution: AI systems credited
 * - Transparency: logged via telemetry
 * - Privacy: no PII stored
 * - Ethics: age-appropriate content (5-8 years)
 */
```

### **File Organization**
```
netlify/functions/
├── lib/
│   ├── telemetry.ts       ← All agents import this
│   ├── memory.ts          ← Byterover MCP wrapper
│   └── storage.ts         ← Netlify file storage
├── curate-chapters.ts     ← Chapter Curator Agent
├── narrate-project.ts     ← Story Narrator Agent
├── text-to-speech.ts      ← Voice Agent
├── generate-music.ts      ← Music Composer Agent
├── generate-attribution.ts ← Attribution Agent
├── publish.ts             ← Publisher Agent
├── telemetry.ts           ← Telemetry endpoint
└── virtue-tracker.ts      ← Virtue Tracker Agent
```

### **Logging Standards**
- All agents log to `/logs/{agent}.json`
- All new agents append to `worker_manifest.yml`
- Never commit API keys (use `.env.local` or Netlify env vars)
- All PRs require `npm run lint && npm test` to pass

---

## 💡 Integration Checklist

### **For Each New Agent:**
- [ ] Create function in `netlify/functions/`
- [ ] Add telemetry tracking (`startAgent` / `endAgent`)
- [ ] Add cost estimation (if using external API)
- [ ] Add to `worker_manifest.yml` if scheduled
- [ ] Add Commons Good compliance block
- [ ] Write unit tests
- [ ] Update this AGENTS.md
- [ ] Add to CI/CD workflow validation

---

## 🧪 Testing Requirements

### **Agent Tests Must Cover:**
```typescript
// 1. Input validation
test('rejects invalid chapter number', () => { ... });

// 2. API integration (mocked)
test('calls OpenAI with correct params', () => { ... });

// 3. Cost tracking
test('logs cost to telemetry', () => { ... });

// 4. Error handling
test('gracefully handles API failure', () => { ... });

// 5. Memory integration
test('stores results in Byterover MCP', () => { ... });
```

---

## 📊 Agent Performance Targets

| Agent | Max Runtime | Max Cost | Success Rate |
|:--|:--|:--|:--|
| Chapter Curator | 5s | $0.03 | >95% |
| Story Narrator | 10s | $0.03 | >98% |
| Voice Agent | 30s | $0.15 | >99% |
| Music Composer | 60s | $0.10 | >90% |
| Chapter Compiler | 15s | $0.00 | >99% |
| Attribution Agent | 2s | $0.00 | 100% |
| Publisher Agent | 10s | $0.00 | >95% |

**Total pipeline:** < 2 minutes per chapter

---

## 🔖 Metadata

- **Version:** v1.3.1
- **Maintainer:** Scott Echols (WSP001)
- **Date Updated:** November 19, 2025
- **Repository:** [WSP001/SirJames-A2A-Studio](https://github.com/WSP001/SirJames-A2A-Studio)
- **License:** Commons Good / MIT Hybrid
- **Production Site:** [sirjames-book002-final.netlify.app](https://sirjames-book002-final.netlify.app)
- **Status:** 🚧 Active Development

---

## 🌍 Mission Statement

> **"Build the memory before the masterpiece."**

The Sir James Adventures series is a living testbed for teaching empathy, imagination, and resilience  
through AI-enhanced storytelling. Every chapter—whether Emoji-only or Audio/Visual—contributes to a  
growing "Memory Vault" designed to benefit future learners.

Our commitment:
- ✅ Age-appropriate content (5-8 years)
- ✅ Educational value (virtue-choice storytelling)
- ✅ Cost transparency (< $1.00/chapter target)
- ✅ Ethical AI use (proper attribution)
- ✅ Open architecture (Commons Good principles)

---

## 📚 Related Documentation

- **[DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md)** - Deployment checklist
- **[WORKSPACE_FIX.md](./WORKSPACE_FIX.md)** - Workspace setup guide
- **[PRODUCTION_READY.md](./PRODUCTION_READY.md)** - API keys & pipeline flow
- **[.github/workflows/deploy.yml](./.github/workflows/deploy.yml)** - CI/CD automation

---

**Last Updated:** November 19, 2025  
**Next Review:** After Chapter 1 generation completes
