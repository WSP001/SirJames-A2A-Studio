# 📦 PRECEDING PROGRAMMERS' INVENTORY
## Useful Files, Assets, and Patterns for Sir James Adventures

> **Purpose**: Catalog all preceding programmer work that can be reused
> **Goal**: RED→GREEN task acceleration through asset reuse
> **Created**: January 2, 2026

---

## 🎯 INVENTORY SUMMARY

| Category | Files Found | Applies To | Status |
|----------|-------------|------------|--------|
| **Scene Manifests** | 1 | Image/Audio Generation | ✅ REUSABLE |
| **DALL-E Prompts** | 35+ | Character Consistency | ✅ REUSABLE |
| **SSML Audio Scripts** | 10+ | ElevenLabs TTS | ✅ REUSABLE |
| **Docker Organization** | 1 | DevOps Pipeline | ✅ REUSABLE |
| **TestFlight Guide** | 1 | iOS Deployment | ✅ REUSABLE |
| **Workflow Guide** | 1 | Programmer Onboarding | ✅ REUSABLE |
| **Workspace Inventory** | 2 | Project Discovery | ✅ REFERENCE |
| **Commit Instructions** | 1 | Git Workflow | ⚠️ SeaTrace-specific |
| **Dev Shell Launcher** | 1 | Quick Start | ✅ REUSABLE |

---

## 📁 FILE-BY-FILE INVENTORY

### 1. Scene Manifest (DALL-E + Audio Prompts)

**Location**: `C:\Users\Roberto002\OneDrive\Desktop\SirJames_Interactive_Bundle\scene_manifest.json`

**Contains**:
- **Background Prompts** (22 scenes)
- **Character Prompts** (9 characters)
- **UI Button Prompts** (10 buttons)
- **SSML Audio Scripts** (10+ voice lines)

**APPLIES TO**: Book003+ image and audio generation

**REUSABLE PROMPTS**:

```json
{
  "backgrounds": {
    "gramps_polygonal_dwelling_woods_edge": "An octagonal stone dwelling at the edge of an enchanted forest...",
    "chapter1_forest_path": "Winding forest path leading deeper into the Whispering Woods...",
    "chapter1_magical_clearing": "Enchanted forest clearing with sparkling light..."
  },
  "characters": {
    "char_sir_james": "Sir James, a 5-year-old boy knight, tousled brown hair, blue tunic with star...",
    "char_gramps": "Gramps, an elderly retired knight with white beard, simple tunic...",
    "char_sparky": "Sparky, a small dragon, size of a house cat, vibrant purple scales...",
    "char_claude": "Claude, a Redbone Coonhound, blue bandana, alert, loyal companion..."
  }
}
```

**ACTION**: ✅ Copy prompts to `CHARACTER_API_TEMPLATES.md` for consistency

---

### 2. SIR_JAMES_PRECEDING_WORK_GUIDE.md

**Location**: `C:\Users\Roberto002\OneDrive\Sir James\SIR_JAMES_PRECEDING_WORK_GUIDE.md`

**Contains**:
- Original working emoji version location
- Key scripts discovered
- Workflow documentation
- Markdown format standards

**KEY SCRIPTS FOUND**:

| Script | Location | Purpose |
|--------|----------|---------|
| `html_to_emoji_md.py` | `SirJamesAdventures003\tools\` | Converts emoji HTML to structured markdown |
| `generate_assets.py` | Root | Generates HD images and audio |
| `wire_chapter_html_v2.py` | `SirJames-A2A-Studio\tools\` | Generates HTML from markdown |

**WORKFLOW DISCOVERED**:
```
SourceEmoji → html_to_emoji_md.py → generate_assets.py → wire_chapter_html_v2.py → Netlify
```

**ACTION**: ✅ Already integrated into current pipeline

---

### 3. Docker Organization Guide

**Location**: `C:\Users\Roberto002\Desktop\DOCKER_ORGANIZATION.md`

**Contains**:
- Project separation strategy (Sir James vs SeaTrace)
- Docker compose file locations
- Label-based tagging system
- DevShell.ps1 integration functions

**REUSABLE PATTERNS**:

```powershell
# Sir James Docker commands
function Start-DockerProject {
    param([ValidateSet("SirJames","SeaTrace003","SeaTrace002")][string]$Project)
    $paths = @{
        SirJames = "$env:USERPROFILE\OneDrive\Sir James\LOGIC SirJames_Interactive_Prototype_With_Chapter10"
    }
    Push-Location $paths[$Project]
    docker compose up -d
    Pop-Location
}
```

**ACTION**: ✅ Add to DevShell.ps1 for asset pipeline automation

---

### 4. TestFlight Deployment Guide

**Location**: `C:\Users\Roberto002\OneDrive\Desktop\SirJames_Interactive_Test\WINDSURF_PROGRAMMER_GUIDE.md`

**Contains**:
- Fastlane configuration for iOS builds
- GitHub Actions workflow for TestFlight
- App Store Connect integration

**APPLIES TO**: Future iOS app deployment

**KEY FILES TO CREATE**:
- `fastlane/Fastfile.swift`
- `fastlane/Appfile`
- `.github/workflows/ios-release.yml`

**ACTION**: 📋 Save for Book003 iOS deployment phase

---

### 5. Dev Shell Launcher

**Location**: `C:\Users\Roberto002\Desktop\sirjames-dev.cmd`

**Contains**:
```batch
@echo off
REM SIRJAMES-DEV - Quick launcher for clean dev shell
powershell -ExecutionPolicy Bypass -File "%USERPROFILE%\sirjames-dev.ps1"
```

**ACTION**: ✅ Already documented in GRAMPS_RUNBOOK.md

---

### 6. Workspace Inventory Reports

**Location**: `C:\Users\Roberto002\Desktop\SirJames_Reports\`

**Files**:
- `workspace_inventory_20251121_200804.csv`
- `workspace_inventory_20251121_210817.csv`

**DISCOVERED WORKSPACES**:

| Folder | Path | Content Type |
|--------|------|--------------|
| LOGIC SirJames_Interactive_Prototype_With_Chapter10 | OneDrive\Sir James\ | Generated Content |
| SirJames_Book001 | OneDrive\Sir James\ | Generated Content |
| SirJames_Interactive_Prototype_Expanded | OneDrive\Sir James\ | Chapter Definitions |
| SirJames_Interactive_Prototype_With_Dashboard | OneDrive\Sir James\ | Generated Content |
| SirJamesAdventures001 | OneDrive\Sir James\ | Chapter Definitions |

**ACTION**: ✅ Use for asset discovery and consolidation

---

### 7. Book002 Pipeline Completion Report

**Location**: `C:\Users\Roberto002\OneDrive\Sir James\🎯 SIR JAMES ADVENTURES BOOK002 - C.txt`

**Contains**:
- Complete asset pipeline execution log
- 216 assets generated (64 images + 64 audio + 64 markdown)
- Python-first workflow established
- Final 10% completion task list

**KEY ACHIEVEMENTS**:
- ✅ 16 scene files generated
- ✅ 19 atomic timelines
- ✅ 35 DALL-E prompts ready
- ✅ 105 consolidated assets
- ✅ Python-first approach (bypasses PowerShell issues)

**FORESHADOWING IDEAS FOUND**:
- Claude & Gramps interactions with autonomous foreshadowing
- Narrator bubble thoughts and overlay scenes
- Parents Dashboard for context and foreshadowing logic

**ACTION**: ✅ Apply foreshadowing patterns to Book003

---

### 8. Project Separation Strategy

**Location**: `C:\Users\Roberto002\OneDrive\Sir James\Sir James Adventure final 1 -10 book.txt`

**Contains**:
- Project separation strategy (Sir James vs SeaTrace)
- Chapter structure analysis
- Missing files checklist
- Windsurf Master instructions

**RECOMMENDED STRUCTURE**:
```
SirJamesAdventures/
├── chapters/
│   ├── Chapter01_ToyQuest/
│   ├── Chapter02_ForestFork/
│   └── ... (Chapters 03-10)
├── docs/
│   ├── DirectorsCut_AllChapters.md
│   └── ProducerWrap_Summary.md
└── assets/
    ├── artwork/
    ├── audio/
    └── animations/
```

**ACTION**: ✅ Structure already implemented in SirJames-A2A-Studio

---

## 🔴→🟢 RED TO GREEN TASK MAPPING

### How Preceding Work Accelerates Current Tasks

| RED Task | Preceding Asset | GREEN Action |
|----------|-----------------|--------------|
| Generate Book003 images | `scene_manifest.json` prompts | Copy DALL-E prompts |
| Create character consistency | `char_*` prompts | Use atomic character specs |
| Generate audio narration | SSML scripts | Adapt for ElevenLabs |
| Deploy to TestFlight | `WINDSURF_PROGRAMMER_GUIDE.md` | Follow fastlane setup |
| Docker asset pipeline | `DOCKER_ORGANIZATION.md` | Use docker compose patterns |
| Onboard new programmers | `SIR_JAMES_PRECEDING_WORK_GUIDE.md` | Reference workflow |

---

## 🎨 REUSABLE DALL-E PROMPTS

### Background Scenes (Copy-Paste Ready)

```
gramps_cottage: "Cozy cottage nestled beneath a weeping willow tree, with smoke curling from chimney, elderly knight stirring pot of tea by small fire, carved log seats, mossy path, young boy with dog approaching, warm afternoon light, children's storybook illustration style, 16:9 aspect ratio, no text."

chapter1_magical_clearing: "Enchanted forest clearing with sparkling light, colorful wildflowers, mystical atmosphere, children's storybook illustration style, 16:9 aspect ratio, no text."

bg_ch3_sc4_tree_of_trust: "Magnificent ancient tree with glowing blue patterns on bark, magical clearing, mystical atmosphere, children's storybook illustration style, 16:9 aspect ratio, no text."
```

### Character Prompts (Copy-Paste Ready)

```
char_sir_james: "Sir James, a 5-year-old boy knight, tousled brown hair, blue tunic with star, small red cape, wooden practice sword, curious expression, transparent background, children's book illustration style."

char_gramps: "Gramps, an elderly retired knight with white beard, simple tunic with faded knight's insignia, kind eyes, leaning on wooden staff, transparent background, children's book illustration style."

char_sparky: "Sparky, a small dragon, size of a house cat, vibrant purple scales, friendly yellow eyes, small wings, playful stance, transparent background, children's book illustration style."

char_claude: "Claude, a Redbone Coonhound, blue bandana, alert, loyal companion, friendly expression, transparent background, children's book illustration style."
```

---

## 🔊 REUSABLE SSML AUDIO SCRIPTS

### Narrator Voice (en-GB-Neural2-F)

```xml
<speak>
  <prosody rate="slow" pitch="-1st">
    Sunlight dappled through the leaves as Sir James polished his wooden practice sword outside Gramps's unique dwelling.
    <break time="300ms"/>
    The structure, a perfect octagonal formation of fitted stones with a small tower, stood proudly at the forest edge.
  </prosody>
</speak>
```

### Gramps Voice (en-GB-Neural2-D)

```xml
<speak>
  <prosody rate="medium" pitch="-2st" volume="medium">
    Remember, James.
    <break time="200ms"/>
    A true knight is always prepared for adventure.
    <break time="300ms"/>
    But adventure doesn't mean rushing into danger without thinking.
  </prosody>
</speak>
```

### Claude Thought (en-US-Neural2-J)

```xml
<speak>
  <prosody rate="fast" pitch="+2st" volume="loud">
    Something's not right...
    <break time="200ms"/>
    <prosody rate="slow" pitch="-1st" volume="soft">
      I can sense it in my whiskers.
    </prosody>
  </prosody>
</speak>
```

---

## 🎯 PARENTS DASHBOARD INTEGRATION

### From Preceding Work

The preceding programmers established these Parents Dashboard features:

1. **Virtue Tracking** - Courage Gems, Wisdom Medals, Trust Tokens
2. **Progress Monitoring** - Chapter/scene completion
3. **Foreshadowing Logic** - Context for future adventures
4. **Click2Kick UI** - Pipeline trigger for asset generation

### Files to Reference

| Feature | File | Location |
|---------|------|----------|
| Virtue System | `virtue-tracker.ts` | `netlify/functions/` |
| Scene Engine | `scene-engine.js` | `public-book002/assets/js/` |
| Dashboard HTML | `parent-dashboard.html` | `public-book002/` |
| Click2Kick | `Click2KickButton.tsx` | `src/components/` |

---

## ⚠️ FILES NOT APPLICABLE

### SeaTrace-Specific (Do Not Use for Sir James)

| File | Reason |
|------|--------|
| `COMMIT_INSTRUCTIONS.md` | SeaTrace repo separation guide |
| `PRIVATE_ENTITLEMENTS_HANDOFF.md` | SeaTrace licensing |
| `SeaTrace003/` | Different project entirely |

---

## ✅ RECOMMENDED ACTIONS

### Immediate (Book003)

1. ✅ Copy `scene_manifest.json` prompts to `CHARACTER_API_TEMPLATES.md`
2. ✅ Adapt SSML scripts for ElevenLabs voice IDs
3. ✅ Use Docker organization patterns for asset pipeline
4. ✅ Reference workflow guide for onboarding

### Future (iOS Deployment)

1. 📋 Set up fastlane configuration
2. 📋 Create GitHub Actions workflow
3. 📋 Configure App Store Connect

### Parents Dashboard Refinement

1. 🔴 Wire virtue logging from scenes into localStorage
2. 🔴 Display virtue logs in Parent Dashboard
3. 🔴 Add Click2Kick button for pipeline trigger

---

## 📊 LEARNING CURVE X-FACTOR

### Sequential Order for New Programmers

```
LEVEL 1: ORIENTATION (Day 1)
├── Read: GRAMPS_RUNBOOK.md
├── Read: SIR_JAMES_PRECEDING_WORK_GUIDE.md
└── Run: sirjames-dev.cmd

LEVEL 2: UNDERSTANDING (Day 2-3)
├── Read: CONSISTENCY.md (Character Bible)
├── Read: CHARACTER_API_TEMPLATES.md
├── Read: FORESHADOWING_AGENT_STRUCTURE.md
└── Explore: scene_manifest.json

LEVEL 3: EXECUTION (Day 4-7)
├── Run: generate_assets.py
├── Run: wire_chapter_html_v2.py
├── Test: Local preview with `serve`
└── Deploy: `deploy` command

LEVEL 4: MASTERY (Week 2+)
├── Modify: DALL-E prompts for new scenes
├── Create: New chapter content
├── Optimize: API cost tracking
└── Extend: Parents Dashboard features
```

---

## 🔗 RELATED FILES

| File | Purpose |
|------|---------|
| `CHARACTER_API_TEMPLATES.md` | Character specs for APIs |
| `FORESHADOWING_AGENT_STRUCTURE.md` | Book-to-book continuity |
| `CONSISTENCY.md` | Immutable character bible |
| `GRAMPS_RUNBOOK.md` | Safe commands for Gramps |
| `MASTER_ASSET_INVENTORY_BOOK_GENERATION.md` | Asset locations |

---

**Version**: 1.0.0
**Created**: January 2, 2026
**For the Commons Good!** 🏰⚔️🐕✨
