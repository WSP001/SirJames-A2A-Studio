# 🏰 Book003.5 Acting Master Directive

**Date:** May 24, 2026  
**Version:** 2.0.0  
**Author:** Cascade AI (Acting Sir James Adventures Master Assist)  
**Story:** Sir James's Pre-Knight School Graduation  
**Repository:** WSP001/SirJames-A2A-Studio (main branch)  
**Production:** https://sirjames-book002-final.netlify.app

---

## 🎯 Role

Act as the **Sir James Adventures Book003.5 Master Assist** — the conductor who:
1. Knows every file, every character, every challenge
2. Integrates the Swift KnightSchool modules into the web platform
3. Ensures 5-year-old SJ has a fun, auto-playing, no-button-clicking experience
4. Keeps the Parent Dashboard fed with measurable metrics
5. Maintains character consistency across all image generation

---

## 📖 STORY PREMISE: Book003.5

**Sir James has just graduated pre-kindergarten!** But in his world, pre-kindergarten IS Knight School. This book celebrates his first year of training at the Castle Courtyard Knight School, where he learns virtues through challenges — Reading, Listening, Typing, and Memory — all disguised as knightly quests.

### The Entourage

| Character | Role in Book003.5 |
|-----------|-------------------|
| **Sir James** (5yo) | The graduate! Personified as himself, celebrating his first year |
| **Claude** 🐕 | Loyal companion, reads SJ's mind via thought bubbles |
| **Gramps** 👴 | Background mentor, ex-knight with real sword on his back |
| **Sparky** 🐿️ | Energetic encourager, blitz speed between scenes |
| **Finnian** 🦊 | Red Fox trickster, tries to lead SJ down wrong paths |
| **Whindle** 🦉 | Owl sage, provides listening challenges and riddles |
| **The Guardian** 🌳 | Forest protector, appears in nature chapters |

### The Red Fox Mechanic

Finnian the Red Fox appears in select scenes trying to lure Sir James off the right path. When this happens:
1. Claude's thought bubble triggers a WARNING icon (⚠️ amber caution)
2. A choice appears: Follow Finnian OR ask Gramps/listen to Claude
3. Wrong path → gentle redirect (NOT punishment, just redirection)
4. Right path → virtue points + celebration
5. Finnian slinks away but FORESHADOWS his return in later chapters

---

## ⚙️ Operating Order

1. Read `CONSISTENCY.md` (v2.0.0 — updated with all characters)
2. Read `BOOK003_5_MASTER_STATUS.md` (what's complete)
3. Read `FORESHADOWING_AGENT_STRUCTURE.md` (book-to-book links)
4. Confirm Book002 is the reusable engine baseline
5. Integrate KnightSchool challenges from Swift → Web
6. Configure auto-play audio (NO button clicks for SJ)
7. Generate scenes with updated character specs
8. Validate with `node scripts/validate_interaction_loops.mjs`

---

## 🚫 Hard Rules

- Do not mix Sir James with SeaTrace or World Seafood Producers
- Do not claim backend/API/AI integrations unless implemented and tested
- Do not invent new main characters to replace the established entourage
- Do not rewrite Book001 or Book002 canon casually
- Do not generate final story text before the platform is ready
- **Keep the 5-year-old reader in mind on every scene**
- **NO button clicks to start audio** — scenes auto-play
- **Gramps is NOT feeble** — he is a retired knight, strong and capable
- **Sir James has BLUE eyes** — never green, never brown
- **Finnian is NOT evil** — just misguided, represents temptation

---

## 🎮 KNIGHT SCHOOL CHALLENGES (Swift → Web Integration)

### Source Files (Previous Team's iOS Work)

```
C:\WSP001\OneDrive\Desktop\SirJames_Interactive_Bundle\Sources\KnightSchoolModules\
├── KnightlyReadingRhythmChallenge.swift   → 449 lines
├── KnightlyListeningChallenge.swift       → 578 lines
├── KnightlyTypingChallenge.swift          → 556 lines
├── KnightlyMemoryPatternChallenge.swift   → 551 lines
├── KnightSchoolModules_Scene_Integration_Guide.md → 370 lines
└── TypingChallengeSceneIntegration.json   → Scene config
```

### What We Extract (Game Logic, NOT UI)

| Swift Concept | Web Equivalent | File |
|---------------|----------------|------|
| `ReadingStory` struct | JSON story objects in `_interaction_loops.json` | Loop system |
| `KnightlyReadingRhythmViewModel` | `LoopEngine_StateMachine.js` reading mode | Already built |
| `KnightlyListeningViewModel` | `knight_school_challenges.js` listening mode | NEW |
| `KnightlyTypingViewModel` | `knight_school_challenges.js` typing mode | NEW |
| `KnightlyMemoryPatternViewModel` | `knight_school_challenges.js` memory mode | NEW |
| `GameProgressManager` | `scene-engine.js` + localStorage | Already built |
| `ParentDashboardMetrics` | `parent-dashboard.html` + Netlify functions | Needs update |
| `SwipeInteractionManager` | Touch handlers in scene HTML | Needs update |

### Challenge → Chapter Mapping (from Integration Guide)

| Chapter | Scene | Challenge | Trigger | Virtue Rewards |
|---------|-------|-----------|---------|----------------|
| 3 | Sc3: Tree of Trust | Memory Pattern | After telling truth | Honesty +3, Memory +2, Trust +2 |
| 3 | Sc7: Cave of Echoes | Listening | Entering cave | Listening +3, Focus +2 |
| 4 | Sc2: Ancient Scroll | Reading Rhythm | Discovering scroll | Scholarship +3, Literacy +2, Focus +1 |
| 4 | Sc5: Training Yard | Typing | Visiting yard | Discipline +3, Focus +2, Precision +2 |
| 5 | Sc2: Echo Bridge | Listening (medium) | Crossing fog bridge | Trust +3, Listening +3, Courage +1 |
| 5 | Sc6: Star Crystal Cave | Memory Pattern | Crystal formation | Observation +3, Memory +3, Wisdom +2 |
| 7 | Sc3: Archivists | Typing | Organizing scrolls | Organization +3, Helpfulness +2, Literacy +2 |
| 7 | Sc5: Story Circle | Reading Rhythm | Storytelling circle | Listening +3, Reading +3, Wisdom +2 |
| 9 | Sc2: Knight School Gates | ALL FOUR CHALLENGES | Final test | Combined rewards + Dedication +5 |

---

## 🔊 AUTO-PLAY CONFIGURATION

### The Problem We're Solving
A 5-year-old should NOT have to click buttons to start audio. The Swift code already does this:
```swift
// SceneView.swift line 36-37
.onAppear {
    narrator.speak(scene.narration)
}
```

### Web Implementation
```javascript
// In scene-engine.js or LoopEngine_StateMachine.js
onSceneLoad(sceneData) {
    // 1. Auto-play narration immediately
    this.playAudio(sceneData.audio.prime);
    
    // 2. After narration ends, show Claude thought bubble (3 sec delay)
    this.onAudioEnd(() => {
        setTimeout(() => claude.showThought(sceneData.claude_hint), 3000);
    });
    
    // 3. After idle timeout, play support audio
    this.startIdleTimer(sceneData.idle_timeout_ms || 8000);
    
    // 4. On success, auto-transition to next scene
    this.onSuccess(() => {
        this.playAudio(sceneData.audio.celebration);
        this.onAudioEnd(() => this.navigateToNextScene());
    });
}
```

### iPad 9th Gen Requirements
- Touch targets: ≥48px (Apple HIG minimum)
- No hover states (touch only)
- Safari WebKit audio autoplay: Use `AudioContext.resume()` on first user interaction
- Font size: ≥24px for story text
- Viewport: `width=device-width, initial-scale=1, maximum-scale=1`

---

## 🎨 IMAGE GENERATION PROMPT (Updated for Book003.5)

```
BOOK003.5 KNIGHT SCHOOL SCENE - Chapter X Scene Y

CHARACTER ATOMICS (MUST MATCH EXACTLY):

SIR JAMES (5 years old):
- Brown hair with distinctive natural cowlick on right side
- Bright BLUE eyes (NOT green), wide and curious
- Fair skin with natural rosy cheeks
- "Cyber-Chivalric" training suit: royal blue padded gambeson
  with white cross on chest
- Blue-and-silver plated leather pauldrons, gauntlets, greaves
- Wooden practice longsword with blue-painted crossguard
- Small, compact, confident posture
- Wide, innocent, determined smile

CLAUDE THE DOG:
- Loyal Redbone Coonhound companion
- Reddish-brown coat, medium-sized
- Intelligent amber eyes, noble bearing
- Royal blue collar with brass "SJA" logo tag
- Seated attentively beside Sir James
- Heads tilted in synchronization (telepathic bond)

GRAMPS (BACKGROUND ONLY - Easter Egg):
- Late 60s, strong build (NOT feeble — retired knight)
- Full gray beard, weathered but gentle face
- Green tweed cap, retired knight's tunic over plain clothes
- Real knight's sword strapped over his back
- Leaning on substantial gnarled walking staff
- Standing in background near octagonal stone wall
- Observing with gentle, patient expression

SCENE SETTING: Castle Courtyard - "Knight School" Training Grounds
- Inner courtyard of ancient, well-preserved stone castle
- Large octagonal unique stone fits together like solid puzzle
- Flattened, clean dirt training arena
- Behind Gramps: octagonal granite cottage (armory/residence)
- Child-sized wooden training tools scattered around
- Warm, soft, golden-hour sunlight from high above battlements
- Long shadows, dust motes in air, wonder and playful energy

FORESHADOWING BACKGROUND:
- Stone archway in far background
- Sign pointing toward "THE FOREST OF HIDDEN TRUTHS"
- Subtle, ethereal blue glow emanating from the path

DASHBOARD OVERLAY (Lower Corner):
- Stylized open leather-bound book as interactive dashboard
- Left page: "MASTERING FIRST PRINCIPLES: COURAGE"
- Right page: Virtue vector map with arrow toward "WORTHINESS"

TECHNICAL:
- Style: Disney Pixar 3D animation, photorealistic-meets-whimsical
- Quality: 4K ready, HD landscape (1792x1024)
- Consistency: 95%+ character match across ALL scenes
```

---

## 📁 FILE STRUCTURE

### What's Built (In SirJames-A2A-Studio)

```
assets/
├── prompts/book003/
│   ├── LOOP_SCHEMA_MASTER.md              ✅
│   ├── ch01_interaction_loops_complete.json ✅ (Template)
│   ├── ch06_interaction_loops_complete.json ✅ (Literacy Bridge)
│   └── narration_loops_enhanced.json       ✅
├── scripts/book003/
│   ├── LoopEngine_StateMachine.js          ✅ (Works for ALL chapters)
│   ├── ch01_recording_sheet.md             ✅
│   └── ch06_recording_sheet.md             ✅
├── manifests/
│   ├── scene_manifest.json                 ✅
│   └── scene_manifest_enhanced.json        ✅
public-book002/
├── chapter{01-10}/
│   └── _interaction_loops.json             ✅ (Skeleton for all 10)
scripts/
├── validate_interaction_loops.mjs          ✅
```

### What Needs Building

```
assets/scripts/book003/
├── knight_school_challenges.js             🔴 NEW (converted from Swift)
├── auto_play_config.json                   🔴 NEW
├── ch02_interaction_loops_complete.json     🔴
├── ch03_interaction_loops_complete.json     🔴
├── ch04_interaction_loops_complete.json     🔴
├── ch05_interaction_loops_complete.json     🔴
├── ch07_interaction_loops_complete.json     🔴
├── ch08_interaction_loops_complete.json     🔴
├── ch09_interaction_loops_complete.json     🔴
├── ch10_interaction_loops_complete.json     🔴
├── ch{02-10}_recording_sheet.md            🔴 (8 files)
public-book002/
├── js/knight-school-engine.js              🔴 NEW (web challenge runner)
```

---

## 📊 PARENT DASHBOARD IMPROVEMENTS

### From Swift ParentDashboardSpecifications.md (319 lines of specs!)

| Feature | Current Status | Book003.5 Target |
|---------|---------------|------------------|
| Story Progress Map | Basic | Visual chapter map with completion % |
| Skill Radar Chart | Missing | Literacy, Motor, Cognitive, Virtue axes |
| Knight School Metrics | Missing | Per-challenge: accuracy, speed, attempts |
| Virtue Development | Basic localStorage | Detailed with decision history |
| Session Controls | Missing | Play duration limits, break reminders |
| Export Reports | Missing | PDF progress reports for parents |
| Difficulty Override | Missing | Parent can adjust challenge difficulty |
| Accessibility | Partial | Extended time, visual guides, parent assist mode |

### Metrics to Log Per Challenge

```javascript
parentDashboard.recordMetrics({
    challengeType: 'reading_rhythm',    // or listening, typing, memory
    timeSpent: 45,                      // seconds
    attemptsCount: 2,
    completionSuccess: true,
    virtuesExercised: ['Literacy', 'Focus', 'Patience'],
    skillProgress: {
        accuracy: 0.85,
        speed: 1.2,                     // words per second
        memory: 0.90
    },
    knightSchoolPoints: 7
});
```

---

## 📋 CHAPTER-BY-CHAPTER WORK REMAINING

### Chapters with Complete Muscle (DONE)
| Ch | Theme | Status |
|----|-------|--------|
| 1 | Survival Baseline | ✅ Complete JSON + Recording Sheet |
| 6 | Literacy Bridge (Word Families) | ✅ Complete JSON + Recording Sheet |

### Chapters Needing Complete Muscle
| Ch | Theme | Knight School Challenge | Priority |
|----|-------|----------------------|----------|
| 2 | Patterns & Curiosity | Memory Pattern (intro) | HIGH |
| 3 | Teamwork & Strategy | Memory Pattern + Listening | HIGH |
| 4 | Communication | Reading Rhythm + Typing | HIGH |
| 5 | Memory & Transfer | Listening + Memory Pattern | MEDIUM |
| 7 | Blends & Spelling | Typing + Reading Rhythm | HIGH |
| 8 | Sentences | Reading Rhythm | MEDIUM |
| 9 | Review & All Challenges | ALL FOUR (Knight School Gates) | HIGH |
| 10 | Graduation & Book004 Seeding | Celebration + Foreshadowing | HIGH |

---

## 🚀 DEPLOYMENT

### Repository
- **Repo:** `WSP001/SirJames-A2A-Studio`
- **Branch:** `main`
- **Remote:** `origin` (GitHub via GitKraken Pro)
- **Production:** Netlify at `sirjames-book002-final.netlify.app`

### Deploy Commands
```bash
# Validate
node scripts/validate_interaction_loops.mjs

# Preview
netlify dev

# Deploy
netlify deploy --prod
```

### GitKraken Pro Lens
- Open GitKraken → File → Open Repo
- Path: `C:\Users\Roberto002\OneDrive\Sir James\LOGIC SirJames_Interactive_Prototype_With_Chapter10\SirJames-A2A-Studio`
- Branch: `main`
- Remote: `origin` → `https://github.com/WSP001/SirJames-A2A-Studio`

---

## 🔗 KEY REFERENCE FILES

| Document | Purpose |
|----------|---------|
| `CONSISTENCY.md` v2.0.0 | Character Bible (IMMUTABLE) — updated with all characters |
| `BOOK003_5_MASTER_STATUS.md` | Session status and remaining work |
| `FORESHADOWING_AGENT_STRUCTURE.md` | Book-to-book narrative links |
| `RUNTIME_IMPLEMENTATION_GUIDE.md` | LoopEngine docs for engineers |
| `PLAN_BOOK003.md` | Original RED→GREEN checklist |
| `AGENTS.md` | 7-agent pipeline definitions |

### Source Files from Previous Team (READ ONLY)
| Path | Content |
|------|---------|
| `C:\WSP001\...\SirJames_Interactive_Test\Sources\` | Full SwiftUI iOS app |
| `C:\WSP001\...\SirJames_Interactive_Bundle\Sources\KnightSchoolModules\` | 4 challenge modules |
| `C:\WSP001\...\Sources\ParentDashboardSpecifications.md` | 319-line dashboard spec |
| `C:\WSP001\...\Sources\GameProgressManager.swift` | Virtue tracking + foreshadowing |

---

**For the Commons Good!** 🏰⚔️🐕✨

