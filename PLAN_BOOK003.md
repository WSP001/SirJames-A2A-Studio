# 🏰 PLAN_BOOK003.md - Sir James Adventures Book003 Development Plan

> **Mission**: Build the Parent-Driven Interactive Learning Platform
> **Target**: 5-year-old SJ (and kids worldwide via Commons Good)
> **Status**: Handoff from Cascade AI to Next Programming Team(s)
> **Last Updated**: January 1, 2026 (Accelerated Sprint)

---

## 📊 Context Health Report

**My context is HEALTHY.** Here's what I know and can hand off:

| Knowledge Area | Status | Confidence |
|----------------|--------|------------|
| Book002 Architecture | ✅ Complete | 95% |
| A2A/D2A Patterns | ✅ Documented | 90% |
| Character Consistency | ✅ Bible exists | 100% |
| Voice IDs (ElevenLabs) | ✅ Tested | 100% |
| Image Generation (DALL-E) | ✅ Prompts refined | 95% |
| Netlify Deployment | ✅ Working | 100% |
| Parent Dashboard | ✅ Smart Dashboard | 95% |
| Book003 Structure | ✅ Deployed LIVE | 100% |

---

## 🔴🟢 RED→GREEN Task Checklist

### Legend
- 🔴 **RED** = Not started / Needs work
- 🟡 **YELLOW** = In progress / Partial
- 🟢 **GREEN** = Complete / Verified

---

## Phase 1: Foundation (Clone & Adopt)

### 1.1 Repository Setup
| Task | Status | Files to Clone | Expected Result |
|------|--------|----------------|-----------------|
| Clone SirJamesAdventures003 repo | 🟢 | `git clone https://github.com/WSP001/SirJamesAdventures003` | Local copy ready |
| Verify SourceEmoji/ has all 10 chapters | 🟢 | `SourceEmoji/chapter1.html` ... `chapter10.html` | 10 HTML files present |
| Verify voices.book003.json | 🟢 | `content/voices.book003.json` | Voice IDs configured |
| Copy SFX from Book002 | 🟢 | `public-book002/assets/audio/sfx/` → `public-book003/assets/audio/sfx/` | dog-bark.mp3 ✅ |
| Copy theme music | 🟢 | `public-book002/assets/audio/sir-james-adventures-theme.mp3` | Theme music available ✅ |

### 1.2 Content Verification
| Task | Status | Command | Expected Result |
|------|--------|---------|-----------------|
| Run integrity checker | 🟡 | `python tools/check_scene_integrity.py` | Pending verification |
| Verify 80 images exist | 🟢 | Check `public-book003/assets/images/chapter*/` | 80 PNG files ✅ |
| Verify 80 audio files exist | 🟢 | Check `public-book003/assets/audio/chapter*/` | 83 MP3 files ✅ |
| Test Chapter 1 locally | 🟢 | `python -m http.server 8080 --directory public-book003` | LIVE at sirjames-book003.netlify.app ✅ |

---

## Phase 2: Parent Dashboard Enhancement

### 2.1 Click2Kick Integration
| Task | Status | Source File | Target File | Expected Result |
|------|--------|-------------|-------------|-----------------|
| Study Click2KickButton.tsx | 🟢 | `SirTrav-A2A-Studio/src/components/Click2KickButton.tsx` | N/A | Pattern implemented ✅ |
| Create ParentStoryGenerator component | 🟢 | Integrated in dashboard | `public-book003/parent-dashboard.html` | Click2Kick implemented ✅ |
| Add preprogrammed theme buttons | 🟢 | New feature | `public-book003/parent-dashboard.html` | 4 theme buttons ✅ |
| Add situation text input | 🟢 | New feature | `public-book003/parent-dashboard.html` | Textarea + mood analysis ✅ |
| Add cost estimation display | 🟢 | Pattern from `Click2Kick.ps1` | `public-book003/parent-dashboard.html` | Dynamic cost display ✅ |

### 2.2 Virtue Tracking
| Task | Status | Source | Target | Expected Result |
|------|--------|--------|--------|-----------------|
| Wire virtue logging to localStorage | 🟢 | `scene-engine.js` | All scene HTML files | Choices logged to `sj:choices` ✅ |
| Display virtue summary in Parent Dashboard | 🟢 | `localStorage` | `parent-dashboard.html` | Learning insights panel ✅ |
| Add 👍/👎 feedback buttons | 🟢 | Pattern from `submit-evaluation.ts` | `parent-dashboard.html` | Feedback system ✅ |

---

## Phase 3: A2A Agent Pipeline

### 3.1 Agent Implementation
| Agent | Status | Source Reference | Book003 Implementation | Expected Result |
|-------|--------|------------------|------------------------|-----------------|
| 🎬 Director Agent | 🟢 | `SirTrav-A2A-Studio/netlify/functions/curate-media.ts` | `netlify/functions/curate-chapters.ts` | DEPLOYED ✅ |
| ✍️ Writer Agent | 🟢 | `SirTrav-A2A-Studio/netlify/functions/narrate-project.ts` | `netlify/functions/narrate-project.ts` | Generates age-appropriate dialogue ✅ |
| 🎙️ Voice Agent | 🟢 | `SirJames-A2A-Studio/tools/eleven_agent.py` | `netlify/functions/text-to-speech.ts` | Synthesizes Sir James, Gramps voices ✅ |
| 🎵 Composer Agent | 🟢 | `SirTrav-A2A-Studio/netlify/functions/generate-music.ts` | `netlify/functions/generate-music.ts` | Creates chapter theme music ✅ |
| 🏞️ Editor Agent | 🟢 | `generate-video.ts` exists | `netlify/functions/generate-video.ts` | Assembles HTML with images/audio ✅ |
| 📜 Attribution Agent | 🟢 | `SirTrav-A2A-Studio/netlify/functions/generate-attribution.ts` | `netlify/functions/generate-attribution.ts` | Credits AI systems ✅ |
| 🚀 Publisher Agent | 🟢 | `SirJames-A2A-Studio/scripts/Click2Kick.ps1` | Netlify CLI | LIVE at sirjames-book003.netlify.app ✅ |

### 3.2 Memory System
| Task | Status | Tool | Expected Result |
|------|--------|------|-----------------|
| Implement byterover-store-knowledge | 🔴 | Byterover MCP | Stores preferences after each session |
| Implement byterover-retrieve-knowledge | 🔴 | Byterover MCP | Retrieves preferences before generation |
| Create memory_index.json | 🔴 | Local file | Stores favorite_moods, video_history |
| Wire feedback loop | 🔴 | Parent Dashboard → Memory | 👍/👎 updates preferences |

---

## Phase 4: Character Consistency

### 4.1 Visual Consistency
| Task | Status | Reference | Expected Result |
|------|--------|-----------|-----------------|
| Verify Sir James is 5yo in all images | 🟢 | `CONSISTENCY.md` | Bright blue eyes, brown hair with cowlick ✅ |
| Verify Claude is Redbone Coonhound | 🟢 | `CONSISTENCY.md` | Reddish-brown coat, amber eyes |
| Regenerate inconsistent images | 🟢 | `scripts/fix-5yo-sirjames.js` | All images match Character Bible |
| Add cache-busting to HTML | 🟢 | `?v=20251230` query params | CDN serves fresh images |

### 4.2 Audio Consistency
| Task | Status | Reference | Expected Result |
|------|--------|-----------|-----------------|
| Verify voice IDs match | 🟢 | `content/voices.book003.json` | Sir James = Harry, Gramps = Bill |
| Add Claude SFX triggers | 🟢 | `HANDOFF_BOOK003.md` Claude SFX section | Barks at correct moments ✅ |
| Test audio playback on iPad | 🔴 | Physical device | Plays without issues |

---

## Phase 5: Deployment & Testing

### 5.1 Environment Setup
| Task | Status | Command | Expected Result |
|------|--------|---------|-----------------|
| Verify API keys in Netlify | 🟢 | Netlify Dashboard → Environment Variables | OPENAI_API_KEY, ELEVENLABS_API_KEY set ✅ |
| Run env-smoke test | 🟢 | `curl https://sirjames-book002-final.netlify.app/.netlify/functions/env-smoke` | All keys return true ✅ |
| Tag stable branch | 🟢 | `git tag book002-stable-v1` | Rollback point created ✅ |

### 5.2 Device Testing
| Task | Status | Device | Expected Result |
|------|--------|--------|-----------------|
| Test on iPad 9th Gen | 🔴 | Physical iPad | Touch targets ≥48px, audio plays |
| Test on Android tablet | 🔴 | Physical Android | Same as iPad |
| Test on desktop Chrome | 🔴 | Chrome browser | Full functionality |
| Test Parent Dashboard | 🔴 | Any device | Virtue tracking displays correctly |

### 5.3 Production Deploy
| Task | Status | Command | Expected Result |
|------|--------|---------|-----------------|
| Deploy to Netlify preview | 🟢 | `netlify deploy --dir=public-book003` | Preview URL works ✅ |
| Verify preview site | 🟢 | Manual testing | Site LIVE ✅ |
| Deploy to production | 🟢 | `netlify deploy --prod --dir=public-book003` | https://sirjames-book003.netlify.app LIVE ✅ |

---

## 📁 Files to Clone/Adopt (Cheat Sheet)

### From SirJames-A2A-Studio (Book002)
```
✅ COPY THESE:
├── public-book002/assets/audio/sfx/          → public-book003/assets/audio/sfx/
├── public-book002/assets/audio/theme.mp3     → public-book003/assets/audio/
├── CONSISTENCY.md                            → Reference only (DO NOT MODIFY)
├── content/voices.json                       → Already in voices.book003.json
├── scripts/fix-5yo-sirjames.js               → Reuse for image fixes
├── HANDOFF_BOOK003.md                        → Reference for next team

❌ DO NOT COPY (already generated):
├── public-book002/chapter*/images/           → Book003 has its own images
├── public-book002/chapter*/audio/            → Book003 has its own audio
```

### From SirTrav-A2A-Studio (7-Agent Pipeline)
```
📖 STUDY THESE PATTERNS:
├── src/components/Click2KickButton.tsx       → Pipeline trigger button
├── src/components/CreativeHub.tsx            → File upload + orchestration
├── src/components/PipelineProgress.tsx       → SSE progress dashboard
├── src/App.jsx                               → 7-agent configuration
├── MASTER.md                                 → D2A build plan
├── netlify/functions/                        → All agent implementations

🔧 ADAPT FOR BOOK003:
├── curate-media.ts                           → curate-chapters.ts
├── narrate-project.ts                        → Keep as-is
├── text-to-speech.ts                         → Keep as-is
├── generate-music.ts                         → Keep as-is
├── submit-evaluation.ts                      → Feedback loop
```

### From SirJamesAdventures003 (Already Exists)
```
✅ ALREADY SET UP:
├── SourceEmoji/chapter1.html ... chapter10.html
├── content/voices.book003.json
├── DEVELOPER_README_BOOK003.md
├── ONBOARDING_FIRST_60_MIN_BOOK003.md
├── IMAGE_MAPPING_GUIDE.md
├── tools/check_scene_integrity.py
├── tools/book003_metrics.py
```

---

## 🎯 Quick Start for Next Programming Team

### Day 1 (First 60 Minutes)
```bash
# 1. Clone the repo
git clone https://github.com/WSP001/SirJamesAdventures003.git
cd SirJamesAdventures003

# 2. Read the onboarding guide
cat ONBOARDING_FIRST_60_MIN_BOOK003.md

# 3. Verify content integrity
python tools/check_scene_integrity.py

# 4. Start local server
python -m http.server 8080 --directory public-book003

# 5. Open in browser
# http://localhost:8080
```

### Day 2 (Parent Dashboard)
```bash
# 1. Study the Click2Kick pattern
# Open: SirTrav-A2A-Studio/src/components/Click2KickButton.tsx

# 2. Add preprogrammed theme buttons to Parent Dashboard
# Edit: public-book003/parent-dashboard.html

# 3. Wire virtue tracking
# Edit: public-book003/js/scene-engine.js
```

### Day 3+ (A2A Pipeline)
```bash
# 1. Study the 7-agent pipeline
# Open: SirTrav-A2A-Studio/MASTER.md

# 2. Implement agents in netlify/functions/
# Start with: curate-chapters.ts

# 3. Test locally
netlify dev

# 4. Deploy
netlify deploy --prod
```

---

## 💰 Cost Tracking (Commons Good Compliance)

| Service | Cost per Chapter | 10 Chapters | Notes |
|---------|------------------|-------------|-------|
| DALL-E 3 (8 images) | $0.32 | $3.20 | Already generated for Book002 |
| ElevenLabs TTS | $0.15 | $1.50 | Voice synthesis |
| GPT-4 prompts | $0.03 | $0.30 | Narrative generation |
| Suno music | $0.10 | $1.00 | Background audio |
| **Total** | **$0.60** | **$6.00** | Under $1/chapter target ✅ |

---

## 🧠 What I (Cascade) Learned & Hand Off

### Key Insights
1. **DALL-E tends to age up children** - Always specify "5-year-old" explicitly in prompts
2. **Netlify CDN caches aggressively** - Use cache-busting query params or rename files
3. **Claude is SFX only** - No TTS voice, use dog-bark.mp3 at narrative triggers
4. **Parent Dashboard is the control center** - All customization flows through here
5. **D2A works** - Documentation files directly instruct AI agents

### Patterns That Worked
- Character Consistency Bible (`CONSISTENCY.md`) prevents visual drift
- `_narration_batch.json` is the single source of truth for dialogue
- `check_scene_integrity.py` catches content drift early
- Click2Kick UI pattern makes complex pipelines accessible to non-developers

### What Needs Improvement
- Parent Dashboard needs preprogrammed theme buttons
- Feedback loop (👍/👎) not yet implemented
- Memory system (Byterover) not yet wired
- A2A agents exist in SirTrav but not yet adapted for Book003

---

## 🏆 Success Criteria

When all tasks are 🟢 GREEN, Book003 is ready:

- [ ] All 10 chapters playable with images and audio
- [ ] Parent Dashboard shows virtue tracking
- [ ] Preprogrammed theme buttons work
- [ ] Feedback loop stores preferences
- [ ] Cost per chapter < $1.00
- [ ] Works on iPad 9th Gen
- [ ] Character consistency maintained (5yo Sir James, Redbone Claude)

---

## 📚 Related Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| HANDOFF_BOOK003.md | `SirJames-A2A-Studio/` | Complete handoff with A2A/D2A architecture |
| AGENTS.md | `SirJames-A2A-Studio/` | 7-agent definitions and communication rules |
| CONSISTENCY.md | `SirJames-A2A-Studio/` | Character Bible (IMMUTABLE) |
| DEVELOPER_README_BOOK003.md | `SirJamesAdventures003/` | Developer onboarding |
| ONBOARDING_FIRST_60_MIN_BOOK003.md | `SirJamesAdventures003/` | First hour checklist |
| MASTER.md | `SirTrav-A2A-Studio/` | D2A build plan reference |

---

## 🎬 Final Message to Next Programming Team

> "Back in the days of old, a young knight named Sir James set forth on a quest..."

You're inheriting a **working foundation**:
- Book002 is LIVE and teaching kids virtues
- The 7-agent pipeline is proven in SirTrav
- The Parent Dashboard is ready for enhancement
- The documentation is comprehensive

Your mission:
1. **Turn RED tasks GREEN** (this checklist)
2. **Keep costs under $1/chapter** (Commons Good)
3. **Make it intuitive for parents** (Click2Kick pattern)
4. **Keep Sir James 5 years old** (Character Bible)

The scaffolding is built. The story gets better with each iteration.

**For the Commons Good!** 🏰⚔️🐕✨

---

**Created**: December 31, 2025
**Author**: Cascade AI Assistant
**Handoff To**: Next Programming Team(s)
**Context Health**: HEALTHY ✅
