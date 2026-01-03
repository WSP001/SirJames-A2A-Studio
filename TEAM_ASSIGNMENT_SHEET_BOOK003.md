# 🏰 TEAM ASSIGNMENT SHEET - BOOK003
## Coach-Style Step-by-Step Runbook for Programming Teams

> **Version:** 1.0  
> **Date:** January 2, 2026  
> **Architecture:** U2A + A2A + D2A  
> **Battle Cry:** For the Commons Good! 🏰⚔️🐕✨

---

## 📋 TEAM LEADS & RESPONSIBILITIES

| Role | Lead | Primary Files | Gate |
|------|------|---------------|------|
| **Backend Lead** | TBD | `netlify/functions/*.ts` | GATE 1 |
| **Middleware Lead** | TBD | `middleware/u2a-protocol/*.ts` | GATE 2 |
| **Frontend Lead** | TBD | `public-book003/*.html`, `assets/js/*.js` | GATE 3 |
| **Agents Lead** | TBD | `netlify/functions/lib/*.ts`, `.claude/skills/*` | GATE 5 |
| **DevOps Lead** | TBD | `netlify.toml`, `.github/workflows/*`, deploy scripts | GATE 6 |

---

## 0️⃣ THE "WHY" BEHIND THE ORDER

We build **in API sequential order** because each step produces state the next step depends on:

```
/session/init     → Creates sessionId + context (needed everywhere)
/analyze-mood     → Cheap/fast personalization gate (feeds story plan)
/curate-chapters  → Expensive agent pipeline (AFTER mood/theme selected)
/story/:storyId   → Playback (AFTER story generated)
/submit-evaluation → Feedback loop (AFTER playback)
/metrics/:childId → Aggregated metrics (AFTER feedback)
```

**RULE:** Never skip ahead. Each gate must pass before the next begins.

---

## 1️⃣ CANONICAL API ORDER (Golden Path Contract)

### 6-Step Minimum Sequence

| Step | Endpoint | Method | Cost | Phase |
|------|----------|--------|------|-------|
| 1 | `/api/v1/session/init` | POST | FREE | Session |
| 2 | `/api/v1/analyze-mood` | POST | FREE | Personalization |
| 3 | `/api/v1/curate-chapters` | POST | ~$0.65 | Generation |
| 4 | `/api/v1/story/:storyId` | GET | FREE | Playback |
| 5 | `/api/v1/submit-evaluation` | POST | FREE | Feedback |
| 6 | `/api/v1/metrics/:childId` | GET | FREE | Metrics |

### Required for Dashboard Truthfulness

| Endpoint | Purpose |
|----------|---------|
| `POST /api/v1/scene-metrics` | Per-scene logging during playback |
| `POST /api/v1/transfer-check` | Bridge Ch.1-5 skills → Ch.6-10 literacy |

### ⚠️ IMPORTANT: Resolve `/api/v1/*` vs `/api/*` Mismatch

**Decision:** Treat `/api/v1/*` as canonical (matches engineering guide).

For Netlify, implement ONE router function (`/.netlify/functions/api`) that dispatches to `/api/v1/*` handlers.

---

## 2️⃣ DAY-1 SETUP COMMANDS (Copy-Paste for All Teams)

### 2.1 Clone + Verify Handoff Docs

```bash
git clone https://github.com/WSP001/SirJames-A2A-Studio.git
cd SirJames-A2A-Studio

# Verify these files exist:
ls ROUND_3_FINAL_HANDOFF.md D2A_API_STRUCTURE.md PLAN_BOOK003.md
```

### 2.2 Create Skill Directories (D2A/U2A)

```bash
mkdir -p .claude/skills/parent-dashboard
mkdir -p .claude/skills/story-generator
mkdir -p .claude/skills/feedback-loop
```

### 2.3 Install Dependencies

```bash
npm install
pip install -r requirements.txt
```

### 2.4 Environment Variables (Local)

```bash
cat > .env.local << 'EOF'
OPENAI_API_KEY=...
ELEVENLABS_API_KEY=...
SUNO_API_KEY=...
GEMINI_API_KEY=...
U2A_ENABLED=true
FEEDBACK_LOOP=enabled
EOF

python tools/check_api_keys.py
```

### 2.5 🔴 GRAMPS NOTE (Don't Forget!)

Before Netlify deploy, add keys in **Netlify Site → Site settings → Environment variables**:

- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`
- `SUNO_API_KEY`
- `GEMINI_API_KEY`

**Why:** Production builds call APIs server-side only, never in frontend JS.

---

# 🚦 GATE-BY-GATE IMPLEMENTATION

---

## GATE 1 — BACKEND TEAM

### 📋 Definition of Done

- [ ] All 6 endpoints return valid JSON (stubs OK initially)
- [ ] `session/init` returns `sessionId`, `context`, `childProfile`
- [ ] `curate-chapters` accepts theme, virtueFocus, parentGuidance
- [ ] `submit-evaluation` accepts rating, engagement, comment
- [ ] `metrics/:childId` returns virtues, knighthood, literacy stats
- [ ] API Contract document written (OpenAPI/Swagger or Markdown)

### 📁 Files to Create

```
netlify/functions/
├── session-init.ts          # POST /api/v1/session/init
├── analyze-mood.ts          # POST /api/v1/analyze-mood
├── curate-chapters.ts       # POST /api/v1/curate-chapters
├── get-story.ts             # GET /api/v1/story/:storyId
├── submit-evaluation.ts     # POST /api/v1/submit-evaluation
├── get-metrics.ts           # GET /api/v1/metrics/:childId
├── scene-metrics.ts         # POST /api/v1/scene-metrics
└── transfer-check.ts        # POST /api/v1/transfer-check
```

### 📝 session-init.ts Response Schema

```typescript
interface SessionInitResponse {
  sessionId: string;
  context: {
    childProfile: {
      id: string;
      name: string;
      age: number;
      avatarUrl?: string;
    };
    knighthood: {
      level: 'Page' | 'Squire' | 'Knight' | 'Champion' | 'Legend';
      points: number;
      nextLevelPoints: number;
    };
    virtues: {
      courage: number;
      kindness: number;
      honesty: number;
      trust: number;
      wisdom: number;
    };
    previousBooks: string[];
  };
}
```

### ✅ Outcome Test

```bash
# Test session init
curl -X POST http://localhost:8888/.netlify/functions/session-init \
  -H "Content-Type: application/json" \
  -d '{"childId": "demo-child"}'

# Expected: {"sessionId": "sess_...", "context": {...}}
```

---

## GATE 2 — MIDDLEWARE TEAM

### 📋 Definition of Done

- [ ] Request Parser validates all required fields
- [ ] Context Manager stores/retrieves session context
- [ ] Tool Registry registers all agent tools
- [ ] WebSocket manager broadcasts progress updates
- [ ] Calling `session/init` stores context; later calls retrieve it

### 📁 Files to Create

```
middleware/
├── u2a-protocol/
│   ├── request-parser.ts      # Infer type, sanitize, validate
│   ├── context-manager.ts     # Session init, load profile, cache
│   ├── agent-coordinator.ts   # Orchestrate A2A pipeline
│   └── tool-registry.ts       # Register tools, validate inputs
├── models/
│   ├── types.ts               # TypeScript interfaces
│   ├── virtue-system.ts       # Virtue tracking logic
│   └── knighthood-system.ts   # Knighthood progression
└── services/
    ├── database-service.ts    # PostgreSQL connection
    └── cache-service.ts       # Redis caching
```

### 📝 Request Types

```typescript
type RequestType = 
  | 'session_init'
  | 'mood_analysis'
  | 'story_generation'
  | 'feedback'
  | 'metrics_query'
  | 'scene_metrics';
```

### ✅ Outcome Test

```bash
# Init session, then verify context is stored
curl -X POST http://localhost:8888/.netlify/functions/session-init \
  -d '{"childId": "test-child"}'

# Later call should retrieve same context
curl -X POST http://localhost:8888/.netlify/functions/analyze-mood \
  -d '{"sessionId": "sess_...", "mood": "happy"}'
```

---

## GATE 3 — FRONTEND TEAM

### 📋 Definition of Done (F1-F9)

- [ ] **F1** `parent-dashboard.html` scaffold with all sections
- [ ] **F2** CSS styling (responsive, 48px+ touch targets)
- [ ] **F3** `u2a-client.js` API client class with all 6 phases
- [ ] **F4** Mood analyzer UI (6 emoji buttons + situation textarea)
- [ ] **F5** Dashboard controller (state management, section flow)
- [ ] **F6** WebSocket progress UI (agent steps, progress bar)
- [ ] **F7** Scene cards display (literacy metrics visible)
- [ ] **F8** Feedback form UI (stars, checkboxes, submit)
- [ ] **F9** Metrics charts (virtue bars, knighthood progress, literacy stats)

### 📁 Files to Create

```
public-book003/
├── parent-dashboard.html
├── assets/
│   ├── css/
│   │   ├── dashboard.css
│   │   └── scene-cards.css
│   ├── js/
│   │   ├── u2a-client.js
│   │   ├── mood-analyzer.js
│   │   ├── scene-engine.js
│   │   ├── metrics-display.js
│   │   ├── websocket-manager.js
│   │   └── dashboard-main.js
│   └── images/icons/
└── story-player/
    └── player.html
```

### ✅ Outcome Test (Against Stub Endpoints)

A parent can complete the full flow:

1. ✅ Choose mood → see suggested themes
2. ✅ Click theme card → see preview stats
3. ✅ Click Click2Kick → see agent progress UI
4. ✅ Story completes → see scene cards preview
5. ✅ Submit feedback → see recommendations
6. ✅ Metrics update in real-time

---

## GATE 4 — WEBSOCKET TEAM

### 📋 Definition of Done

- [ ] WebSocket connection established on session init
- [ ] `agent_progress` messages update UI in real-time
- [ ] `story_complete` message triggers story player display
- [ ] `metrics_update` message refreshes metrics panel
- [ ] Reconnection logic on disconnect (3s delay)

### 📝 Message Types

```typescript
interface WebSocketMessage {
  type: 'agent_progress' | 'story_complete' | 'metrics_update';
  sessionId: string;
  data: {
    agent?: string;      // For agent_progress
    status?: string;     // Current status text
    progress?: number;   // 0-100 percentage
    story?: StoryPackage; // For story_complete
    metrics?: Metrics;   // For metrics_update
  };
}
```

### ✅ Outcome Test

During generation, dashboard visibly updates progress without page refresh.

---

## GATE 5 — AGENTS TEAM

### 📋 Definition of Done (A1-A6)

- [ ] **A1** Director Agent: Plans story arc based on mood/theme/profile
- [ ] **A2** Writer Agent: Generates narrative, dialogue, choices
- [ ] **A3** Voice Agent: Creates narration audio via ElevenLabs
- [ ] **A4** Music Agent: Creates background music via Suno
- [ ] **A5** Editor Agent: Validates character consistency, virtue points
- [ ] **A6** Publisher Agent: Packages scenes, wires audio/images

### 📁 Files to Create

```
netlify/functions/lib/
├── director-agent.ts
├── writer-agent.ts
├── voice-agent.ts
├── music-agent.ts
├── editor-agent.ts
└── publisher-agent.ts

.claude/skills/
├── parent-dashboard/
│   └── skill.md           # Theme extraction, mood analysis
├── story-generator/
│   └── skill.md           # Narrative generation rules
└── feedback-loop/
    └── skill.md           # Learning profile updates
```

### 📝 Pipeline Order

```
Director → Writer → [Voice + Music (parallel)] → Editor → Publisher
```

### ✅ Outcome Test

Given situation "sharing toys", system extracts theme keywords and routes to story generation (template-based OK initially).

---

## GATE 6 — DEVOPS TEAM

### 📋 Definition of Done

- [ ] `netlify.toml` configured with redirects for `/dashboard` and `/api/*`
- [ ] All environment variables set in Netlify
- [ ] `python tools/check_scene_integrity.py` passes
- [ ] `netlify dev` runs locally without errors
- [ ] Preview deploy works
- [ ] Production deploy works
- [ ] `/dashboard` loads parent dashboard
- [ ] Story generation works end-to-end

### 📁 Files to Verify/Create

```
netlify.toml                    # Redirects, functions config
.github/workflows/deploy.yml    # CI/CD automation
tools/check_scene_integrity.py  # Integrity verification
tools/check_api_keys.py         # API key verification
```

### 📝 netlify.toml Pattern

```toml
[build]
  command = "npm run build"
  publish = "public-book003"
  functions = "netlify/functions"

[[redirects]]
  from = "/dashboard"
  to = "/parent-dashboard.html"
  status = 200

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### ✅ Deployment Commands

```bash
# Local test
python tools/check_scene_integrity.py
netlify dev
# Open: http://localhost:8888/parent-dashboard.html

# Test endpoint
curl -X POST http://localhost:8888/.netlify/functions/curate-chapters \
  -H "Content-Type: application/json" \
  -d '{"situation": "child struggles with sharing", "theme": "sharing"}'

# Preview deploy
netlify deploy --dir=public-book003

# Production deploy
netlify deploy --prod --dir=public-book003
```

---

## 3️⃣ MASTER CHECKLIST (Print This!)

### ✅ Setup (Everyone)

- [ ] Clone repo + verify handoff docs
- [ ] Create `.claude/skills/*` directories
- [ ] Add `.env.local` + verify keys
- [ ] Netlify env vars include all API keys

### ✅ Backend (GATE 1)

- [ ] Implement 6 endpoints (stubs OK)
- [ ] Return required session payload fields
- [ ] API Contract document written

### ✅ Middleware (GATE 2)

- [ ] request-parser.ts
- [ ] context-manager.ts
- [ ] agent-coordinator.ts
- [ ] tool-registry.ts

### ✅ Frontend (GATE 3)

- [ ] F1-F9 completed in order
- [ ] Full flow works against stub endpoints

### ✅ WebSocket (GATE 4)

- [ ] Real-time progress updates working

### ✅ Agents (GATE 5)

- [ ] A1-A6 implemented
- [ ] Pipeline produces story package

### ✅ Deploy (GATE 6)

- [ ] Run integrity check
- [ ] `netlify dev` passes
- [ ] Preview deploy, test, then prod deploy

---

## 4️⃣ SCENE CARD METRICS SCHEMA

Every scene produces a **Scene Card** for the Parents Dashboard:

```json
{
  "story_fields": {
    "chapter": 6,
    "scene": 1,
    "scene_title": "Fork in the River",
    "setting": "River splits into three shimmering channels",
    "characters": ["Sir James", "Claude", "Sparky", "Gramps"]
  },
  "literacy_fields": {
    "reading_level_band": "Early → Developing",
    "focus_skill": "CVC word families, direction words",
    "target_words": ["cat", "bat", "hat", "log", "fog", "dog", "up", "down"],
    "spelling_task_type": "choose-letters"
  },
  "interaction_metrics": {
    "word_recognition": { "attempts": 0, "correct_first_try": 0, "hints_used": 0 },
    "spelling_attempts": { "per_word": {}, "keyboard_used": false },
    "auto_read_vs_self_read_ratio": 0.0,
    "dashboard_actions": []
  }
}
```

---

## 5️⃣ VIRTUE & KNIGHTHOOD SYSTEM

### Virtue Points

| Virtue | Icon | Earned By |
|--------|------|-----------|
| Courage | 💎 | Brave choices, facing fears |
| Kindness | ❤️ | Helping others, sharing |
| Honesty | ⭐ | Telling truth, admitting mistakes |
| Trust | 🤝 | Teamwork, relying on friends |
| Wisdom | 🥇 | Thoughtful choices, asking questions |

### Knighthood Levels

| Level | Points | Icon |
|-------|--------|------|
| Page | 0-99 | 🛡️ |
| Squire | 100-299 | ⚔️ |
| Knight | 300-599 | 🏰 |
| Champion | 600-999 | 👑 |
| Legend | 1000+ | ✨ |

---

## 6️⃣ COST TRACKING

### Per-Chapter Cost Target: < $1.00

| Agent | API | Cost |
|-------|-----|------|
| Director | GPT-4 | $0.03 |
| Writer | GPT-4 | $0.05 |
| Voice | ElevenLabs | $0.15 |
| Music | Suno | $0.10 |
| Editor | Local | FREE |
| Publisher | Local | FREE |
| **Total** | | **~$0.65** ✅ |

---

## 7️⃣ WHAT I (CASCADE) CANNOT DO

### 🔴 Requires User/Team Action

| Task | Who | Why |
|------|-----|-----|
| Add API keys to Netlify | Gramps/DevOps | Security - keys must be added manually |
| Create Netlify site | DevOps | Requires Netlify account access |
| Purchase API credits | Gramps | Requires payment method |
| Test on real iPad/Android | QA Team | Requires physical devices |
| Approve production deploy | Gramps | Final sign-off required |
| Rotate exposed API keys | Gramps | Security - immediate action needed |

### ✅ What I CAN Do

- Write all code files
- Create documentation
- Generate test commands
- Build scene manifests
- Create API contracts
- Design UI components
- Write agent logic

---

## 8️⃣ STANDUP TEMPLATE

### Daily Standup Questions

1. **What gate are you working on?** (1-6)
2. **What did you complete yesterday?**
3. **What will you complete today?**
4. **Any blockers?**

### Weekly Gate Review

| Gate | Status | Blocker | Owner |
|------|--------|---------|-------|
| GATE 1 Backend | 🔴/🟡/🟢 | | Backend Lead |
| GATE 2 Middleware | 🔴/🟡/🟢 | | Middleware Lead |
| GATE 3 Frontend | 🔴/🟡/🟢 | | Frontend Lead |
| GATE 4 WebSocket | 🔴/🟡/🟢 | | Frontend Lead |
| GATE 5 Agents | 🔴/🟡/🟢 | | Agents Lead |
| GATE 6 Deploy | 🔴/🟡/🟢 | | DevOps Lead |

---

## 📚 SOURCE FILES (Quick Links)

| Document | Purpose |
|----------|---------|
| `BOOK003_COMPLETE_BLUEPRINT.md` | Full 10-chapter story arc |
| `U2A_PARENTS_DASHBOARD_ENGINEERING_GUIDE.md` | Frontend/Middleware/Backend code |
| `chapter01-05_scene_manifest.json` | Foundation Skills scenes |
| `chapter06-10_scene_manifest.json` | Literacy Skills scenes |
| `PLAN_BOOK003.md` | RED→GREEN task checklist |
| `D2A_API_STRUCTURE.md` | API-structured instructions |
| `CONSISTENCY.md` | Character Bible (IMMUTABLE) |

---

**For the Commons Good!** 🏰⚔️🐕✨

*This document is the single source of truth for team assignments and gate definitions.*
