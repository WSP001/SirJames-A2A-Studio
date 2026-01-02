# 🎭 CHARACTER API TEMPLATES
## API-Ready Markdown for Consistent Character Generation

> **Purpose**: Feed these templates directly to AI APIs (DALL-E, ElevenLabs, GPT-4)
> **Goal**: Same characters, same voices, same look across ALL books

---

## 📋 HOW TO USE THIS FILE

1. **Copy the character block** you need
2. **Paste into your API prompt**
3. **Add scene-specific details** (setting, action)
4. **Generate** - character will be consistent!

---

# 👦 SIR JAMES (The Young Knight)

## Image Generation (DALL-E 3)

```markdown
## CHARACTER: SIR JAMES
- Age: 5 years old (CRITICAL: specify "5-year-old" to prevent aging up)
- Hair: Brown with distinctive natural cowlick on right side
- Eyes: BRIGHT BLUE (NOT green, NOT brown)
- Skin: Fair with natural rosy cheeks
- Outfit: Royal blue tunic with silver Celtic trim patterns
- Belt: Brown leather belt with brass buckle
- Weapon: Wooden practice sword with carved handle at side
- Build: Small, compact, confident posture
- Expression: Kind, determined, curious

STYLE: Disney Pixar 3D animation, professional broadcast quality
```

## Voice Generation (ElevenLabs)

```json
{
  "character": "sir_james",
  "voice_id": "SOYHLrjzK2X1ezoPC6cr",
  "voice_name": "Harry",
  "style": "Young, brave, curious",
  "age_sound": "8-10 year old boy",
  "emotion": "Adventurous, hopeful, sometimes nervous but courageous"
}
```

## Narrative Style (GPT-4)

```markdown
## SIR JAMES DIALOGUE RULES
- Speaks with wonder and curiosity
- Uses simple words (5-8 year old vocabulary)
- Shows bravery even when scared
- Often asks questions
- Expresses feelings openly

EXAMPLE LINES:
- "Then our quest begins! Let's find the Great Tree!"
- "I feel proud because I was honest, even when it was hard."
- "Claude, do you think we can do this?"
- "Gramps always says a true knight faces his fears!"
```

---

# 🐕 CLAUDE (The Royal Redbone Coonhound)

## Image Generation (DALL-E 3)

```markdown
## CHARACTER: CLAUDE THE DOG
- Breed: Redbone Coonhound
- Coat: Rich reddish-brown, medium-sized hunting dog
- Eyes: Intelligent amber, soulful expression
- Ears: Long, floppy, alert
- Tail: Wagging, expressive
- Collar: Royal blue with brass "Claude" tag
- Bearing: Noble, loyal, always by Sir James's side
- Special: Thought bubble above head when "speaking"

STYLE: Disney Pixar 3D animation, professional broadcast quality
```

## Voice Generation (SFX Only)

```json
{
  "character": "claude",
  "voice_id": null,
  "voice_type": "SFX_ONLY",
  "sfx_files": [
    "dog-bark.mp3",
    "dog-whine.mp3", 
    "dog-happy.mp3",
    "dog-alert.mp3"
  ],
  "note": "Claude does NOT speak - uses thought bubbles + SFX"
}
```

## Narrative Style (GPT-4)

```markdown
## CLAUDE THOUGHT BUBBLE RULES
- Claude communicates via THOUGHT BUBBLES (not spoken words)
- Narrator interprets Claude's thoughts
- Thoughts are shown in *italics*
- Claude offers silent wisdom and support

EXAMPLE LINES (as thought bubbles):
- *"Another day, another chance for adventure... or maybe just a nap."*
- *"I sense something magical ahead..."*
- *"My boy needs me. I won't let him down."*

NARRATOR INTERPRETATION:
- "Claude's eyes seemed to say..."
- "Sir James could feel Claude thinking..."
- "Claude tilted his head as if to ask..."
```

---

# 👴 GRAMPS (The Wise Mentor)

## Image Generation (DALL-E 3)

```markdown
## CHARACTER: GRAMPS
- Age: 65-70 years old
- Role: Ex-knight, grandfather, wise mentor
- Hair: Silver/grey, slightly thinning
- Facial Hair: Silver beard, neatly trimmed
- Eyes: Kind, warm, twinkling with wisdom
- Skin: Weathered but warm
- Outfit: Simple brown/tan robes, comfortable
- Accessory: Wooden walking staff with carved top
- Home: Puzzle-stone cottage at forest edge
- Personality: Patient teacher, gentle guidance, full of stories

STYLE: Disney Pixar 3D animation, professional broadcast quality
NOTE: Based on author Scott Echols - treat with respect
```

## Voice Generation (ElevenLabs)

```json
{
  "character": "gramps",
  "voice_id": "pqHfZKP75CvOlQylNhV4",
  "voice_name": "Bill",
  "style": "Elderly, wise, patient grandfather",
  "age_sound": "65-70 year old man",
  "emotion": "Warm, encouraging, gentle wisdom, pride in grandson"
}
```

## Narrative Style (GPT-4)

```markdown
## GRAMPS DIALOGUE RULES
- Speaks slowly, thoughtfully
- Uses metaphors and stories to teach
- Never lectures - guides through questions
- Calls Sir James "my boy" or "young knight"
- References his own knighthood days
- Always encouraging, never critical

EXAMPLE LINES:
- "A knight's heart must be as ready as his shield, James."
- "Even brave knights learn from honest mistakes, my boy."
- "When I was a young squire, I faced a similar challenge..."
- "What does your heart tell you, young knight?"
- "Remember, true courage isn't the absence of fear..."
```

---

# 🐿️ SPARKY (The Magical Squirrel)

## Image Generation (DALL-E 3)

```markdown
## CHARACTER: SPARKY THE SQUIRREL
- Species: Red squirrel (European red squirrel style)
- Fur: Bright red-orange with white chest patch
- Tail: Large, bushy, expressive
- Eyes: Bright, alert, mischievous
- Size: Small, fits in palm of hand
- Magic: Surrounded by golden sparkles/glitter
- Personality: Playful, quick, helpful guide
- Movement: Quick, darting, energetic

STYLE: Disney Pixar 3D animation, professional broadcast quality
```

## Voice Generation (ElevenLabs)

```json
{
  "character": "sparky",
  "voice_id": "TBD_HIGH_PITCHED_VOICE",
  "voice_name": "TBD",
  "style": "Quick, chirpy, excited",
  "age_sound": "Young, energetic",
  "emotion": "Playful, helpful, sometimes mischievous"
}
```

## Narrative Style (GPT-4)

```markdown
## SPARKY DIALOGUE RULES
- Speaks quickly, excitedly
- Uses short sentences
- Often repeats words for emphasis
- Helpful but sometimes distracted
- Knows forest secrets

EXAMPLE LINES:
- "This way, this way! Follow me!"
- "Ooh, ooh! I know a secret path!"
- "Careful, careful! The bridge is old!"
- "Sparkles mean magic is near!"
- "Quick quick! Before the sun sets!"
```

---

# 🎙️ NARRATOR (The Storyteller)

## Voice Generation (ElevenLabs)

```json
{
  "character": "narrator",
  "voice_id": "XrExE9yKIg1WjnnlVkGX",
  "voice_name": "Matilda",
  "style": "Warm grandmother storyteller",
  "age_sound": "Adult female, nurturing",
  "emotion": "Wonder, encouragement, gentle excitement"
}
```

## Narrative Style (GPT-4)

```markdown
## NARRATOR RULES
- Third person perspective
- Warm, inviting tone
- Describes scenes vividly but simply
- Interprets Claude's thoughts
- Guides emotional moments
- Uses sensory details (sounds, colors, feelings)

EXAMPLE LINES:
- "Sunlight dappled through the leaves as Sir James polished his wooden practice sword..."
- "Claude's tail wagged slowly, as if he sensed the adventure ahead..."
- "The forest seemed to whisper secrets only brave knights could hear..."
```

---

# 🔮 FORESHADOWING STRUCTURE

## Book-to-Book Connection Template

```markdown
## FORESHADOWING AGENT TEMPLATE

### End of Book [N] - Plant the Seed
At the end of each book, include a foreshadowing moment:

STRUCTURE:
1. **Resolution**: Current adventure concludes
2. **Reflection**: Character learns virtue lesson
3. **Hint**: Mysterious element appears
4. **Question**: Narrator poses wonder about future
5. **Cliffhanger**: Something new is discovered

EXAMPLE (End of Book001 → Book002):
---
🏆 **Celebration & Reflection**

Sir James smiled as Gramps placed a hand on his shoulder.
"You've learned much today, young knight," Gramps said warmly.

Claude's ears perked up suddenly. He stared toward the Whispering Woods.

*"What is it, boy?"* Sir James wondered.

In the distance, a faint golden light flickered between the ancient trees.

"Gramps," Sir James whispered, "what's that light?"

Gramps's eyes grew thoughtful. "That, my boy, is a story for another day..."

**[FORESHADOW_TAG: whispering_woods_mystery]**
**[NEXT_BOOK: Book002]**
**[VIRTUE_PREVIEW: courage_to_explore]**
---
```

## Foreshadowing JSON Schema

```json
{
  "foreshadow_id": "book001_to_book002",
  "source_book": "Book001",
  "target_book": "Book002",
  "planted_in_chapter": 10,
  "planted_in_scene": 8,
  "mystery_element": "golden_light_in_woods",
  "character_reaction": {
    "claude": "ears_perked_alert",
    "sir_james": "curious_wonder",
    "gramps": "knowing_smile"
  },
  "narrator_hint": "That is a story for another day...",
  "virtue_preview": "courage_to_explore",
  "resolved_in": {
    "book": "Book002",
    "chapter": 1,
    "scene": 1
  }
}
```

---

# 📚 SEQUENTIAL BOOK GENERATION TEMPLATE

## Book Series Continuity Schema

```json
{
  "series": "Sir James Adventures",
  "book_sequence": [
    {
      "book_id": "Book001",
      "title": "The Magic of the Truth Leaf",
      "theme": "Honesty and Self-Discovery",
      "primary_virtue": "honesty",
      "foreshadows_to": "Book002",
      "foreshadow_element": "whispering_woods_mystery"
    },
    {
      "book_id": "Book002", 
      "title": "The Whispering Woods",
      "theme": "Courage and Friendship",
      "primary_virtue": "courage",
      "resolves_from": "Book001",
      "foreshadows_to": "Book003",
      "foreshadow_element": "crystal_cavern_call"
    },
    {
      "book_id": "Book003",
      "title": "The Crystal Cavern",
      "theme": "Trust and Teamwork",
      "primary_virtue": "trust",
      "resolves_from": "Book002",
      "foreshadows_to": "Book004",
      "foreshadow_element": "dragon_riddle_prophecy"
    }
  ]
}
```

---

# 🎬 SCENE GENERATION TEMPLATE

## Complete Scene Prompt (All APIs)

```markdown
## SCENE GENERATION REQUEST

### Book: [BOOK_NUMBER]
### Chapter: [CHAPTER_NUMBER]  
### Scene: [SCENE_NUMBER]
### Theme: [CHAPTER_THEME]

---

## CHARACTERS PRESENT
[Include full character blocks from above for each character in scene]

## SETTING
- Location: [SPECIFIC LOCATION]
- Time of Day: [morning/afternoon/evening/night]
- Weather: [clear/cloudy/magical_mist/etc]
- Lighting: [natural/golden_hour/magical_glow/candlelight]
- Ambient Sound: [forest_birds/stream/wind/silence]

## ACTION
[What is happening in this scene]

## EMOTIONAL STATE
- Sir James: [curious/brave/nervous/determined/joyful]
- Claude: [alert/relaxed/protective/playful]
- [Other characters as needed]

## VIRTUE OPPORTUNITY
- Virtue: [courage/wisdom/trust/honesty/kindness]
- Choice A: [Brave choice] → +1 [virtue]
- Choice B: [Alternative choice] → +1 [other_virtue]

## FORESHADOWING (if final scene)
- Element: [mystery_hint]
- Next Book Connection: [Book_N+1]

---

## TECHNICAL REQUIREMENTS
- Image: 1792x1024, Disney Pixar 3D, 4K quality
- Audio: ElevenLabs voices per character specs
- Consistency: 95%+ character match
```

---

# ✅ QUALITY CHECKLIST

Before generating any scene, verify:

- [ ] Sir James has BLUE eyes (not green)
- [ ] Sir James is 5 years old (not older)
- [ ] Claude uses thought bubbles (not spoken words)
- [ ] Gramps is elderly with silver hair
- [ ] Sparky has magical sparkles
- [ ] All characters match their tokens
- [ ] Foreshadowing connects to next book
- [ ] Virtue opportunity is present
- [ ] Age-appropriate content (5-8 years)

---

**Version:** 1.0.0
**Created:** January 2, 2026
**For the Commons Good!** 🏰⚔️🐕✨
