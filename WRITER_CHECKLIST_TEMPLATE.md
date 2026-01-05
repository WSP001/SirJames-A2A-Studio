# ✍️ WRITER CHECKLIST TEMPLATE
## Sir James Adventures - Loop-Ready Scene Writing Guide

> **Version:** 3.5.1  
> **For:** Narrative Designers, Writers, Content Creators  
> **Purpose:** Create scenes that feed the Parent Dashboard while staying fun

---

## 📋 SCENE WRITING CHECKLIST

For every interactive scene, writers MUST provide:

### ✅ BASE NARRATIVE (Required)

- [ ] **2-3 Narrator lines** - Set the mood and problem
- [ ] **1 Sir James line** - Name the choice tension ("Should I run or plan?")
- [ ] **1 Gramps line** - Frame as values decision, NOT right/wrong
- [ ] **Setting description** - Where are we? What do we see/hear/smell?

### ✅ LOOP ENTRIES (Required)

- [ ] **Claude idle hint** - Sensory/safety clue (triggers after 5-7s)
- [ ] **Gramps risk reflection** - Gentle reframe if bold choice made
- [ ] **Sparky safety/phonics reminder** - Playful correction
- [ ] **Narrator parent template** - Uses `${parent_text}` placeholder
- [ ] **Sir James planner success** - Celebration for planning/teamwork
- [ ] **Sir James brave-learning success** - Celebration for bold choice (no shame!)

### ✅ METADATA (Required)

- [ ] **Scene ID** - Format: `ch{N}_sc{N}_{short_name}`
- [ ] **Chapter number** - 1-10
- [ ] **Mode** - `survival` (Ch 1-5) or `literacy` (Ch 6-10)
- [ ] **Focus skill** - What are we measuring?
- [ ] **Style tags** - What choices reveal about the child

---

## 📝 TEMPLATE: SURVIVAL SCENE (Chapters 1-5)

Copy this template for any survival-style scene:

```json
{
  "scene_id": "ch{N}_sc{N}_{short_name}",
  "chapter": {N},
  "title": "{Scene Title}",

  "base": {
    "narrator": [
      "{Line 1: Set the scene - what does the child see?}",
      "{Line 2: Introduce the tension or challenge}"
    ],
    "sir_james": [
      "{Line: Name the choice - 'Should I X or Y?'}"
    ],
    "gramps": [
      "{Line: Frame as values, not right/wrong - 'A knight always...'}"
    ]
  },

  "loops": {
    "claude_idle_hint": {
      "actor": "Claude",
      "text": "(Sniffing/Looking) *Woof!* {Sensory hint about the safe/wise choice}",
      "emotion": "helpful",
      "sfx": "dog_sniff"
    },
    "gramps_risk_reflection": {
      "actor": "Gramps",
      "text": "{Gentle reframe - 'Quick feet can be brave, but...' - no shaming}",
      "emotion": "gentle_guidance"
    },
    "sparky_safety_reminder": {
      "actor": "Sparky",
      "text": "Zzzzt! {Playful safety reminder with energy}",
      "emotion": "playful_warning"
    },
    "narrator_parent_injection": {
      "actor": "Narrator",
      "template": "A calm thought drifts through: \"${parent_text}\"",
      "emotion": "warm_supportive"
    },
    "sir_james_planner_success": {
      "actor": "Sir James",
      "text": "{Celebration for planning/teamwork - 'Our plan worked!'}",
      "emotion": "proud_confident"
    },
    "sir_james_brave_learning": {
      "actor": "Sir James",
      "text": "{Reflection on bold choice - 'That was fast! Next time I might...' - growth mindset}",
      "emotion": "reflective_growth"
    }
  }
}
```

---

## 📝 TEMPLATE: LITERACY SCENE (Chapters 6-10)

Copy this template for any literacy-style scene:

```json
{
  "scene_id": "ch{N}_sc{N}_{short_name}",
  "chapter": {N},
  "title": "{Scene Title}",

  "base": {
    "narrator": [
      "{Line 1: Set the scene with the reading challenge}",
      "{Line 2: Present the words/letters to read}"
    ],
    "sir_james": [
      "{Line: Show thinking process - 'I need to find the word that...'}"
    ]
  },

  "loops": {
    "claude_phonics_hint": {
      "actor": "Claude",
      "text": "(Action) *Woof!* {Sound out the target - 'D-D-Down starts with duh!'}",
      "emotion": "helpful_excited",
      "sfx": "dog_bark"
    },
    "sparky_phonics_correction": {
      "actor": "Sparky",
      "text": "Zzzzt! {Correct the error - 'That starts with U! We need D!'}",
      "emotion": "encouraging"
    },
    "narrator_parent_injection": {
      "actor": "Narrator",
      "template": "The wind whispers what your grown-up says: \"${parent_text}\"",
      "emotion": "warm_supportive"
    },
    "sir_james_fast_success": {
      "actor": "Sir James",
      "text": "{Quick mastery celebration - 'I knew it! [WORD]!'}",
      "emotion": "confident_proud"
    },
    "sir_james_persistence_success": {
      "actor": "Sir James",
      "text": "{Earned success celebration - 'We figured it out together!'}",
      "emotion": "relieved_happy"
    }
  }
}
```

---

## 🎭 CHARACTER VOICE GUIDE

### Sir James (5 years old)
- **Tone:** Curious, brave, sometimes uncertain
- **Vocabulary:** Simple words, short sentences
- **Examples:**
  - ✅ "Should we run or make a plan?"
  - ✅ "I feel brave and ready!"
  - ❌ "I shall deliberate upon our options." (too formal)

### Claude (Redbone Coonhound)
- **Tone:** Loyal, sensory-focused, supportive
- **Format:** Always in parentheses action + *Woof!*
- **Examples:**
  - ✅ "(Sniffing the air) *Woof!* I smell strawberries on the sunny path!"
  - ✅ "(Tilting head) *Whine...* I'm not sure about this..."
  - ❌ "I think we should go left." (Claude doesn't speak in sentences)

### Gramps (65+ years old)
- **Tone:** Wise, gentle, never judgmental
- **Vocabulary:** Warm, folksy, uses "lad" and "James"
- **Examples:**
  - ✅ "Every knight chooses how to face the fog, lad."
  - ✅ "Quick feet can be brave, but a quick map can be brave AND wise."
  - ❌ "That was the wrong choice." (never shame)

### Sparky (Magical firefly)
- **Tone:** Energetic, playful, helpful
- **Format:** Always starts with "Zzzzt!" or "Zoom!"
- **Examples:**
  - ✅ "Zzzzt! That's the -OG family! We need the -AT family!"
  - ✅ "Zoom! You found all the blend words!"
  - ❌ "You made an error." (too formal)

### Narrator
- **Tone:** Warm, descriptive, supportive
- **Role:** Sets scenes, delivers parent injections
- **Examples:**
  - ✅ "The mist curls like white smoke, hiding the path ahead."
  - ✅ "A calm thought drifts through: '${parent_text}'"

---

## 🎯 STYLE TAGS REFERENCE

### Survival Chapters (1-5)
Use these tags to label choices:

| Tag | Meaning | Dashboard Display |
|-----|---------|-------------------|
| `planner_team` | Chose to plan with team | "Planner style" |
| `bold_risk` | Chose quick/risky action | "Bold style" |
| `social_consult` | Asked team for input | "Collaborative style" |
| `cautious_safe` | Chose the safer option | "Cautious style" |
| `adventurous_risk` | Chose the exciting option | "Adventurous style" |

### Literacy Chapters (6-10)
Use these tags to label outcomes:

| Tag | Meaning | Dashboard Display |
|-----|---------|-------------------|
| `mastery_high` | Got it on first try | "Quick learner" |
| `persistence_high` | Got it after support | "Persistent learner" |
| `phonics_support` | Needed sound hints | "Learning phonics" |
| `visual_support` | Needed visual hints | "Visual learner" |

---

## 📊 METRIC FLAGS REFERENCE

Every loop line should have a `metric_flag` that tells the dashboard what happened:

### Support Metrics (when hints fire)
- `attention_nudge` - Idle timer fired
- `hesitation_baseline` - Long pause on first choice
- `risk_reframed_gently` - Bold choice got gentle guidance
- `repeated_risk_style` - Multiple bold choices
- `phonics_hint_needed` - Wrong word tapped
- `parent_reflection_used` - Parent injected text

### Celebration Metrics (when child succeeds)
- `strategy_teamwork_style` - Chose planning/teamwork
- `brave_but_learning` - Chose bold, reflected on it
- `direction_word_mastery` - Got direction word right
- `rhyme_mastery` - Got rhyming words right
- `blend_recognition` - Got consonant blend right

---

## ✅ QUALITY CHECKLIST

Before submitting a scene, verify:

### Content Quality
- [ ] All lines are short and speakable (under 20 words)
- [ ] No shaming language ("wrong", "bad", "mistake")
- [ ] Growth mindset in all outcomes
- [ ] Age-appropriate vocabulary (5-year-old level)
- [ ] Character voices are consistent

### Technical Quality
- [ ] Scene ID follows format: `ch{N}_sc{N}_{short_name}`
- [ ] All `line_id` values are unique
- [ ] Parent template uses `${parent_text}` exactly
- [ ] All required loop entries present
- [ ] Emotion tags are consistent

### Dashboard Integration
- [ ] Style tags assigned to all choices
- [ ] Metric flags assigned to all loops
- [ ] Parent prompts provided (2 discussion questions)
- [ ] Virtue mapping specified (courage/wisdom/trust)

---

## 📁 FILE NAMING CONVENTIONS

### Narration Files
```
assets/prompts/book003/narration_loops_enhanced.json
```

### Audio Files (when recorded)
```
chapter{NN}/audio/
├── scene-{NNN}_narration.mp3
├── scene-{NNN}_claude_idle_hint.mp3
├── scene-{NNN}_gramps_risk_reflection.mp3
├── scene-{NNN}_sparky_safety_reminder.mp3
├── scene-{NNN}_sir_james_planner_success.mp3
└── scene-{NNN}_sir_james_brave_learning.mp3
```

---

## 🔄 COPY-PASTE WORKFLOW

### Step 1: Copy the appropriate template
- Survival scene? Use the survival template above
- Literacy scene? Use the literacy template above

### Step 2: Fill in the blanks
- Replace all `{placeholder}` text with your content
- Keep the JSON structure exactly as shown

### Step 3: Run validation
```bash
node scripts/validate_interaction_loops.mjs
```

### Step 4: Submit for review
- Add to `narration_loops_enhanced.json`
- Create matching entry in `scene_manifest_enhanced.json`

---

## 📚 EXAMPLES BY CHAPTER TYPE

### Example: Chapter 1 (Baseline Safety)
See `ch1_sc1_path_choice` in `narration_loops_enhanced.json`

### Example: Chapter 3 (Teamwork Strategy)
See `ch3_sc3_mist_corridor` in `narration_loops_enhanced.json`

### Example: Chapter 6 (Direction Words)
See `ch6_sc1_river_fork` in `narration_loops_enhanced.json`

### Example: Chapter 7 (Consonant Blends)
See `ch7_sc1_base_camp` in `narration_loops_enhanced.json`

---

**For the Commons Good!** 🏰⚔️🐕✨

*Remember: Every scene should be fun for Sir James (the 5-year-old tester) while quietly feeding valuable learning data to the Parent Dashboard.*
