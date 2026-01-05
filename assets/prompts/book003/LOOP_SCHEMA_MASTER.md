# 🔄 LOOP SCHEMA MASTER - Sir James Adventures Book003

> **Version:** 1.0.0  
> **Purpose:** Define the standard loop structure for ALL interactive scenes  
> **Audience:** Writers, Programmers, QA Team

---

## 📋 THE LOOP SYSTEM OVERVIEW

Every interactive scene in Book003 follows this pattern:

```
┌─────────────────────────────────────────────────────────────────┐
│                     SCENE INTERACTION FLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   1. BASE NARRATIVE plays                                        │
│              ↓                                                   │
│   2. CHILD INTERACTION expected                                  │
│              ↓                                                   │
│   ┌─────────┴─────────┐                                         │
│   │                   │                                         │
│   ▼                   ▼                                         │
│ [IDLE 5-10s]    [WRONG TAP]    [PARENT CLICK]                   │
│   │                   │              │                          │
│   ▼                   ▼              ▼                          │
│ SUPPORT LOOP    ERROR LOOP    PARENT INJECTION                  │
│ (Claude hint)   (Sparky help)  (Narrator template)              │
│   │                   │              │                          │
│   └─────────┬─────────┴──────────────┘                          │
│             ▼                                                    │
│   3. CORRECT RESPONSE                                            │
│              ↓                                                   │
│   ┌─────────┴─────────┐                                         │
│   │                   │                                         │
│   ▼                   ▼                                         │
│ [attempts==1]   [attempts>1]                                    │
│   │                   │                                         │
│   ▼                   ▼                                         │
│ FAST SUCCESS   PERSISTENCE SUCCESS                              │
│              ↓                                                   │
│   4. METRIC EVENT sent to dashboard                              │
│              ↓                                                   │
│   5. ROUTE to next scene                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 FILE STRUCTURE

```
public-book002/
├── chapter01/
│   ├── _narration_batch.json      # Existing dialogue
│   ├── _interaction_loops.json    # NEW: Loop definitions
│   └── ...
├── chapter02/
│   ├── _narration_batch.json
│   ├── _interaction_loops.json
│   └── ...
...
```

---

## 🎯 CHAPTER TYPES & LOOP PATTERNS

### SURVIVAL CHAPTERS (1-5)

| Chapter | Theme | Primary Loop Focus |
|---------|-------|-------------------|
| 1 | Baseline & Safety | `hesitation_baseline`, `safety_preference` |
| 2 | Patterns & Curiosity | `pattern_recognition`, `metacognition` |
| 3 | Teamwork & Strategy | `trust_decision`, `role_assignment` |
| 4 | Communication | `tone_awareness`, `clarity_seeking` |
| 5 | Memory & Transfer | `skill_connection`, `api_understanding` |

### LITERACY CHAPTERS (6-10)

| Chapter | Theme | Primary Loop Focus |
|---------|-------|-------------------|
| 6 | Word Families | `phonics_hint`, `direction_words` |
| 7 | Blends & Spelling | `blend_recognition`, `spelling_support` |
| 8 | Sentences | `sentence_comprehension`, `functional_reading` |
| 9 | Adjectives | `adjective_matching`, `description_building` |
| 10 | Review & Transfer | `mixed_review`, `book004_seeding` |

---

## 📐 JSON SCHEMA DEFINITION

### interaction_loops.json Structure

```jsonc
{
  "chapter_id": "ch01_whispering_woods",
  "book": "book003",
  "theme": "Baseline Safety & Listening",
  "skill_focus": "survival-sense",
  "scenes": [
    {
      "scene_id": "ch01_sc01",
      "title": "Scene Title",
      "interaction_loop": {
        "challenge_id": "unique_challenge_name",
        "primary_prompt": "NARRATOR: The prompt text...",
        "ui_type": "choice_binary | tap_object | emotion_selector | virtue_selector | tap_word",
        "options": [
          { "id": "option_a", "label": "Label A", "icon": "🌟", "correct": true },
          { "id": "option_b", "label": "Label B", "icon": "🌲", "correct": false }
        ],
        "states": {
          "idle_support": {
            "trigger": "Xs_no_action",
            "actor": "Claude | Sparky | Gramps",
            "audio_file": "chXX_scYY_actor_hint.mp3",
            "line": "The hint dialogue...",
            "metric_flag": "metric_name"
          },
          "error_support": {
            "trigger": "tap_wrong_item",
            "actor": "Sparky",
            "audio_file": "chXX_scYY_sparky_error.mp3",
            "line": "The error correction dialogue...",
            "action": "Visual feedback description",
            "metric_flag": "error_metric_name"
          },
          "parent_override": {
            "trigger": "dashboard_control_id",
            "narrator_template": "NARRATOR: ${parent_text}",
            "metric_flag": "parent_metric_name"
          },
          "success": {
            "trigger": "correct_action",
            "line_fast": "SIR JAMES: Fast success line...",
            "line_slow": "SIR JAMES: Persistence success line...",
            "metric_mapping": {
              "option_a": "skill: value_a",
              "option_b": "skill: value_b"
            },
            "metric_score": "score_name"
          }
        }
      }
    }
  ]
}
```

---

## 🎭 ACTOR ROLES IN LOOPS

| Actor | Role | When Used | Voice |
|-------|------|-----------|-------|
| **Claude** | Sensory/Context hints | Idle support, emotional moments | SFX only (thought bubbles) |
| **Sparky** | Visual/Phonics hints | Error correction, letter help | TTS (energetic) |
| **Gramps** | Wisdom/Strategy hints | Complex decisions, life lessons | TTS (warm, old) |
| **Narrator** | Parent injection template | Parent dashboard input | TTS (Matilda) |
| **Sir James** | Success reactions | Fast/Persistence celebration | TTS (Harry) |

---

## 📊 METRIC FLAGS REFERENCE

### Survival Chapters (1-5)
- `hesitation_baseline` - Child paused before first choice
- `safety_preference` - Chose safe vs adventurous path
- `listening_support_needed` - Needed auditory hint
- `auditory_miss` - Tapped wrong after hearing clue
- `decision_paralysis` - Long pause on binary choice
- `emotional_articulation_delay` - Slow to identify feeling
- `regulation_assistance` - Parent helped calm down
- `reflection_prompt_needed` - Needed help with metacognition
- `trust_decision` - Chose to trust teammate
- `role_assignment` - How they assigned team roles
- `planning_vs_action` - Preference for planning or rushing

### Literacy Chapters (6-10)
- `phonics_hint_needed` - Needed sound/letter help
- `semantic_vs_phonetic_error` - Type of reading error
- `visual_support_used` - Needed visual cue
- `direction_word_mastery` - up/down/left/right recognition
- `blend_recognition` - Consonant blend skill
- `spelling_support` - Needed spelling help
- `sentence_comprehension` - Understanding full sentences
- `adjective_matching` - Descriptive word skill
- `mastery_level` - Fast success indicator
- `persistence_level` - Earned success indicator

---

## 🔧 RUNTIME IMPLEMENTATION

### Frontend Event Handlers

```javascript
// Scene engine loop handler
class LoopEngine {
  constructor(sceneData) {
    this.scene = sceneData;
    this.attempts = 0;
    this.idleTimer = null;
  }

  startScene() {
    // Play base narrative
    this.playNarration(this.scene.interaction_loop.primary_prompt);
    
    // Start idle timer
    const idleTime = parseInt(this.scene.interaction_loop.states.idle_support.trigger);
    this.idleTimer = setTimeout(() => this.fireIdleSupport(), idleTime * 1000);
  }

  fireIdleSupport() {
    const support = this.scene.interaction_loop.states.idle_support;
    this.playAudio(support.audio_file);
    this.sendMetric(support.metric_flag);
  }

  handleChoice(choiceId) {
    clearTimeout(this.idleTimer);
    this.attempts++;
    
    const option = this.scene.interaction_loop.options.find(o => o.id === choiceId);
    
    if (option.correct) {
      this.fireSuccess();
    } else {
      this.fireErrorSupport();
    }
  }

  fireErrorSupport() {
    const error = this.scene.interaction_loop.states.error_support;
    this.playAudio(error.audio_file);
    this.sendMetric(error.metric_flag);
  }

  fireSuccess() {
    const success = this.scene.interaction_loop.states.success;
    const line = this.attempts === 1 ? success.line_fast : success.line_slow;
    this.playLine(line);
    this.sendMetric(success.metric_score, { attempts: this.attempts });
  }

  handleParentOverride(parentText) {
    const override = this.scene.interaction_loop.states.parent_override;
    const line = override.narrator_template.replace('${parent_text}', parentText);
    this.playLine(line);
    this.sendMetric(override.metric_flag);
  }

  sendMetric(flag, data = {}) {
    fetch('/api/v1/scene-metrics', {
      method: 'POST',
      body: JSON.stringify({
        sceneId: this.scene.scene_id,
        metric_flag: flag,
        attempts: this.attempts,
        ...data
      })
    });
  }
}
```

---

## ✅ WRITER CHECKLIST

For each interactive scene, writers MUST provide:

- [ ] **Primary prompt** - The narrator setup
- [ ] **Options** - 2-4 choices with labels and icons
- [ ] **Claude idle hint** - Sensory/context clue (5-10s trigger)
- [ ] **Sparky error hint** - Phonics/visual correction
- [ ] **Parent injection template** - `${parent_text}` placeholder
- [ ] **Fast success line** - Confident Sir James reaction
- [ ] **Persistence success line** - Proud-of-effort Sir James reaction

---

## 🚀 GENERATION ORDER

Files will be generated in this order:

1. `chapter01/_interaction_loops.json` - Baseline & Safety
2. `chapter02/_interaction_loops.json` - Patterns & Curiosity
3. `chapter03/_interaction_loops.json` - Teamwork & Strategy
4. `chapter04/_interaction_loops.json` - Communication
5. `chapter05/_interaction_loops.json` - Memory & Transfer
6. `chapter06/_interaction_loops.json` - Word Families (BRIDGE)
7. `chapter07/_interaction_loops.json` - Blends & Spelling
8. `chapter08/_interaction_loops.json` - Sentences
9. `chapter09/_interaction_loops.json` - Adjectives
10. `chapter10/_interaction_loops.json` - Review & Transfer

---

**For the Commons Good!** 🏰⚔️🐕✨
