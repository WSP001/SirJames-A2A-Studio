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
| **Outfit** | Royal blue tunic with silver Celtic trim | ✅ |
| **Accessories** | Brown leather belt, brass buckle, wooden practice sword | ✅ |
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
| **Collar** | Royal blue with brass "Claude" tag | ✅ |
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

## 👴 GRAMPS (The Wise Mentor)

| Attribute | Value | IMMUTABLE |
|-----------|-------|-----------|
| **Age** | 65-70 years old | ✅ |
| **Role** | Ex-knight, grandfather, mentor | ✅ |
| **Hair** | Silver/grey | ✅ |
| **Facial Hair** | Silver beard, kind eyes | ✅ |
| **Outfit** | Simple robes, walking staff | ✅ |
| **Home** | Puzzle-stone cottage at forest edge | ✅ |
| **Personality** | Patient teacher, full of wisdom, gentle guidance | ✅ |

**Voice:** Warm, grandfatherly, like a beloved storyteller  
**Character Token:** `gramps-elder`

> **Note:** Gramps is based on the author (Scott Echols) who wrote himself into the narrative as Sir James's grandfather.

---

## 🐿️ SPARKY (The Magical Squirrel)

| Attribute | Value | IMMUTABLE |
|-----------|-------|-----------|
| **Species** | Red squirrel | ✅ |
| **Fur** | Bright red with white chest patch | ✅ |
| **Features** | Bushy tail, alert eyes | ✅ |
| **Magic** | Sparkles surround him | ✅ |

**Character Token:** `sparky-squirrel`

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
| **Sir James** | Young, brave, 8-10 year old | Curious, courageous |
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
2. **Claude communicates via THOUGHT BUBBLES** - Not spoken dialogue
3. **Gramps is the author's self-insert** - Treat with respect
4. **All content is age-appropriate** - Target audience: 5-8 years
5. **Virtues are central** - Courage, Wisdom, Trust in every chapter

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

**Version:** 1.1.0  
**Updated:** November 26, 2025  
**Authority:** Creative Director (Scott Echols / Gramps)

