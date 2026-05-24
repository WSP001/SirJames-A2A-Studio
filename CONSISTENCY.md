# 🎭 CHARACTER CONSISTENCY BIBLE

> **Source of Truth** for all Sir James Adventures character rendering.  
> All image generation, audio synthesis, and narrative content MUST reference this document.

---

## 👦 SIR JAMES (The Young Knight)

| Attribute | Value | IMMUTABLE |
|-----------|-------|-----------|
| **Age** | 5 years old | ✅ |
| **Hair** | Brown with natural cowlick on right side | ✅ |
| **Eyes** | **BRIGHT BLUE** (NOT green) | ✅ |
| **Skin** | Fair with natural rosy cheeks | ✅ |
| **Outfit** | "Cyber-Chivalric" training suit: royal blue padded gambeson with white cross on chest, blue-and-silver plated leather pauldrons, gauntlets, and greaves | ✅ |
| **Accessories** | Brown leather belt, brass buckle, wooden practice longsword with blue-painted crossguard | ✅ |
| **Build** | Small, compact, confident posture | ✅ |
| **Expression** | Kind, determined, curious | ✅ |

**Character Token:** `sirjames-actor`

---

## 🐕 CLAUDE (The Royal Redbone Coonhound)

| Attribute | Value | IMMUTABLE |
|-----------|-------|-----------|
| **Breed** | Redbone Coonhound | ✅ |
| **Coat** | Rich reddish-brown | ✅ |
| **Eyes** | Intelligent amber | ✅ |
| **Size** | Medium-sized hunting dog | ✅ |
| **Collar** | Royal blue with brass "SJA" (Sir James Adventures) logo tag | ✅ |
| **Bearing** | Noble, alert ears, wagging tail | ✅ |

### 🧠 SPECIAL ABILITY: Telepathic Bond

**Claude can read Sir James's mind** and communicates through:

- **THOUGHT BUBBLES** - Claude's thoughts appear as visual thought bubbles in scenes
- **Mental Connection** - Claude understands Sir James's feelings and intentions
- **Silent Guidance** - Claude offers wisdom without speaking aloud
- **Emotional Support** - Claude senses when Sir James needs encouragement

**Voice Representation:**
- Claude does NOT speak with a human voice
- Claude's "voice" is rendered as **thought bubble text** in visuals
- Audio narration describes Claude's thoughts: *"Claude thought to himself..."*
- Narrator interprets Claude's feelings for young listeners

### 💭 Thought Bubble Animation System

**Animation States:**
| State | Trigger | Description |
|-------|---------|-------------|
| `Idle_Blink` | Default | Relaxed state with blinking/nose wiggle |
| `Idle_Listen` | Narration playing | Head tilt while listening |
| `Idle_Sniff` | Scene idle | Light sniffing loop |
| `Bubble_Appear` | `showThought()` | Bubble grows from Claude's head |
| `Bubble_Pulse` | Bubble visible | Gentle pulse to attract attention |
| `Bubble_Disappear` | Decision made | Fades out |

**Thought Bubble Icon Types (HD DALL-E Images - NO emojis):**

| Image File | Visual | Meaning |
|------------|--------|---------|
| `thought_icon_insight.png` | Golden lightbulb + pawprint | Suggests virtuous direction |
| `thought_icon_question.png` | Fluffy question cloud | Pause and reflect |
| `thought_icon_heart.png` | Warm glowing heart | Emotional impact |
| `thought_icon_caution.png` | Gentle amber caution | Warns of poor choice |
| `thought_icon_joy.png` | Sparkling star burst | Playful/celebration |

**Timing:**
- Bubble appears **3 seconds** after narration ends
- Tap for optional voice hint or enhanced visual cue
- Alt-text required for accessibility

**Code Hooks:**
```javascript
claude.showThought('empathy')  // Shows heart bubble
claude.onClick()               // Triggers voice hint
claude.reset()                 // Returns to idle
claude.animate()               // Current mood loop
```

**Character Token:** `claude-hound`

---

## 👴 GRAMPS (The Retired Knight / Wise Mentor)

| Attribute | Value | IMMUTABLE |
|-----------|-------|-----------|
| **Age** | Late 60s (65-70) | ✅ |
| **Role** | Retired knight, grandfather, mentor | ✅ |
| **Build** | Strong, capable, NOT feeble — an ex-knight who still wields from experience | ✅ |
| **Hair** | Silver/grey | ✅ |
| **Facial Hair** | Full gray beard, weathered but gentle face, kind eyes | ✅ |
| **Outfit** | Green tweed cap, retired knight's tunic over plain clothes | ✅ |
| **Weapon** | Real knight's sword strapped over his back (retired but capable) | ✅ |
| **Staff** | Substantial gnarled walking staff (leans on it, observing) | ✅ |
| **Home** | Octagonal granite cottage (puzzle-stone armory/residence) at forest edge | ✅ |
| **Personality** | Patient teacher, full of wisdom, gentle guidance, quietly strong | ✅ |
| **Scene Role** | Background/Easter egg — NOT a front-facing main character. Observes training with gentle, patient expression | ✅ |

**Voice:** Warm, grandfatherly, like a beloved storyteller — but with authority of experience  
**Character Token:** `gramps-elder`

> **Note:** Gramps is based on the author (Scott Echols) who wrote himself into the narrative as Sir James's grandfather. Though retired, he is NOT feeble — he's a veteran knight who chooses wisdom over force.

---

## 🐿️ SPARKY (The Magical Squirrel)

| Attribute | Value | IMMUTABLE |
|-----------|-------|-----------|
| **Species** | Red squirrel | ✅ |
| **Fur** | Bright red with white chest patch | ✅ |
| **Features** | Bushy tail, alert eyes | ✅ |
| **Magic** | Sparkles surround him, blitz speed | ✅ |
| **Personality** | Full of energy, bounces between scenes, encouraging | ✅ |

**Character Token:** `sparky-squirrel`

---

## 🦊 FINNIAN THE RED FOX (The Sly Trickster)

| Attribute | Value | IMMUTABLE |
|-----------|-------|-----------|
| **Species** | Red fox | ✅ |
| **Fur** | Russet-red with white-tipped tail | ✅ |
| **Eyes** | Cunning amber, narrow | ✅ |
| **Build** | Sleek, sly posture | ✅ |
| **Personality** | Sneaky, shady, tries to lead Sir James down the wrong pathway | ✅ |
| **Role** | Recurring antagonist — foreshadowed across chapters, comes and goes | ✅ |
| **Resolution** | Sir James must choose the RIGHT path (usually by asking Gramps or listening to Claude) | ✅ |

**Voice:** Smooth, persuasive, slightly whispery  
**Character Token:** `finnian-fox`

> **Note:** Finnian represents the temptation to take shortcuts. He is NOT evil — just misguided. In later books, he may learn from Sir James's example.

---

## 🦉 WHINDLE THE OWL (The Forest Sage)

| Attribute | Value | IMMUTABLE |
|-----------|-------|-----------|
| **Species** | Great horned owl | ✅ |
| **Feathers** | Mottled brown and grey with golden breast | ✅ |
| **Eyes** | Large, wise, golden-amber | ✅ |
| **Perch** | Usually on a high branch or stone archway | ✅ |
| **Personality** | Cryptic wisdom, speaks in riddles, watches from above | ✅ |
| **Role** | Provides listening challenges, hints at hidden truths | ✅ |
| **Catchphrase** | "Whooo listens well learns the forest's secrets." | ✅ |

**Voice:** Mystical, ancient, measured cadence  
**Character Token:** `whindle-owl`

---

## 🌳 THE GUARDIAN (Forest Protector)

| Attribute | Value | IMMUTABLE |
|-----------|-------|-----------|
| **Form** | Ethereal branch-figure | ✅ |
| **Glow** | Gentle green light | ✅ |
| **Voice** | Mystical, ancient, wise | ✅ |

**Character Token:** `guardian-spirit`

---

## 🎨 VISUAL STYLE REQUIREMENTS

### Art Direction
- **Style:** Disney Pixar 3D animation, warm and inviting
- **Quality:** Professional broadcast, 4K ultra-detailed
- **Lighting:** Soft natural lighting with magical golden hour ambiance
- **Palette:** Rich, saturated colors with child-friendly warmth
- **Mood:** Adventurous, magical, safe, inspiring for young knights

### Technical Standards
- **Resolution:** 1792x1024 (HD landscape)
- **Consistency:** 95%+ character match across ALL scenes
- **Camera:** Medium shot, child-friendly perspective

---

## 🔊 AUDIO STYLE REQUIREMENTS

### Voice Guidelines

| Character | Voice Style | Emotion |
|-----------|-------------|---------|
| **Narrator** | Warm grandfather storyteller | Wonder, encouragement |
| **Sir James** | Young, brave, 5-year-old energy | Curious, courageous |
| **Gramps** | Elderly, wise, patient | Gentle wisdom, pride |
| **Claude** | *Thought bubbles only* | Loyal, supportive |

### Claude's Thought Bubble Audio
When Claude "speaks" through thought bubbles:
- Narrator says: *"Claude thought to himself..."*
- Or: *"Claude's eyes seemed to say..."*
- Or: *"Sir James could feel Claude thinking..."*

---

## ⚠️ CRITICAL RULES

1. **Sir James has BLUE eyes** - Never green, never brown
2. **Sir James is 5 years old** - Just graduated pre-kindergarten ("Knight School")
3. **Claude communicates via THOUGHT BUBBLES** - Not spoken dialogue
4. **Gramps is the author's self-insert** - Treat with respect; he is STRONG not feeble
5. **Gramps is a background character** - Easter egg presence, NOT front-facing
6. **Finnian the Red Fox** is sneaky but NOT evil — represents wrong-path temptation
7. **All content is age-appropriate** - Target audience: 5-8 years
8. **Virtues are central** - Courage, Wisdom, Trust in every chapter
9. **Auto-play audio** - Scenes play narration automatically; NO button clicks required for 5yo SJ
10. **iPad 9th Gen optimized** - Touch targets ≥48px, Safari-compatible, no hover states

---

## 📝 PROMPT TEMPLATE

When generating images, include:

```
ATOMIC CONSISTENCY REQUIREMENTS - Book002 Chapter X Scene Y

CHARACTER ATOMICS (MUST MATCH EXACTLY):
SIR JAMES:
- Brown hair with distinctive natural cowlick on right side
- Bright blue eyes, wide and curious
- Fair skin with natural rosy cheeks
- Royal blue tunic with silver Celtic trim patterns
- Brown leather belt with brass buckle
- Wooden practice sword with carved handle at side

CLAUDE THE DOG:
- Loyal redbone coonhound companion
- Reddish-brown coat, medium-sized
- Intelligent amber eyes, noble bearing
- Royal blue collar with brass "Claude" tag
- [If speaking] Thought bubble above head with text

TECHNICAL ATOMICS:
- Style: Disney Pixar 3D animation
- Quality: Professional broadcast, 4K
- Lighting: Warm cinematic
- Consistency: 95%+ character match
```

---

---

## 🎮 KNIGHT SCHOOL CHALLENGE TYPES

Four challenge types integrated from KnightSchool modules:

| Challenge | Description | Virtues | Chapter Integration |
|-----------|-------------|---------|--------------------|
| **Reading Rhythm** | Read-along with word highlighting | Literacy, Focus, Patience | Ch4 (Ancient Scroll), Ch7 (Story Circle) |
| **Listening** | Sound sequence memory game | Listening, Memory, Trust | Ch3 (Cave of Echoes), Ch5 (Echo Bridge) |
| **Typing** | Letter-by-letter word spelling | Discipline, Focus, Precision | Ch4 (Training Yard), Ch7 (Library) |
| **Memory Pattern** | Symbol pattern recall | Memory, Focus, Observation | Ch3 (Tree of Trust), Ch5 (Star Crystal) |

### Auto-Play Rules for Challenges
- Challenge narration starts automatically on scene load
- Claude thought bubble appears 3 seconds after narration
- Idle support triggers after 5-10 seconds of no input
- Success celebration plays automatically
- Next scene transitions automatically after celebration

---

**Version:** 2.0.0  
**Updated:** May 24, 2026  
**Authority:** Creative Director (Scott Echols / Gramps)

