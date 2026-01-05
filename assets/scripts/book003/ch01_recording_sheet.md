# 🎙️ CHAPTER 1 RECORDING SHEET
## Sir James Adventures - Whispering Woods

> **For:** Voice Team / AI Voice Generator  
> **Chapter:** 1 - Whispering Woods  
> **Theme:** Baseline Safety & Listening  
> **Total Lines:** 25

---

## 📋 VOICE ID REFERENCE

| Character | Voice | ElevenLabs ID |
|-----------|-------|---------------|
| Sir James | Harry (young) | `SOYHLrjzK2X1ezoPC6cr` |
| Narrator | Matilda (female) | `XrExE9yKIg1WjnnlVkGX` |
| Gramps | Bill (old male) | `pqHfZKP75CvOlQylNhV4` |
| Claude | SFX only | N/A |
| Sparky | High-pitched energetic | TBD |
| Forest Guide | Mysterious ethereal | TBD |

---

## 🎬 SCENE 1: The Fork in the Path

| Line ID | Character | Script Text | Emotion | Purpose |
|---------|-----------|-------------|---------|---------|
| `ch01_sc01_prime` | Narrator | "Two paths lie ahead. The Sunny Path is wide and bright. The Shadowy Shortcut is dark and fast. Tap the path you choose." | Intriguing | Main Prompt |
| `ch01_sc01_idle` | Claude | "(Sniffing) *Woof!* The sunny path smells like warm strawberries. The dark one smells like... cold wet moss." | Helpful | Idle Support |
| `ch01_sc01_win_fast` | Sir James | "Adventure awaits! Let's go!" | Confident | High Mastery |
| `ch01_sc01_win_slow` | Sir James | "Hmm... okay team. I've decided. We go this way." | Thoughtful | High Persistence |

**SFX Needed:** `dog_sniff.mp3`

---

## 🎬 SCENE 2: The First Whisper

| Line ID | Character | Script Text | Emotion | Purpose |
|---------|-----------|-------------|---------|---------|
| `ch01_sc02_prime` | Narrator | "The trees are whispering a secret. Listen close... 'The... mossy... rock... is... safe...'" | Mysterious | Main Prompt |
| `ch01_sc02_idle` | Gramps | "Did you hear that, James? Use your ears. Not the thorn... the rock." | Gentle | Idle Support |
| `ch01_sc02_err` | Sparky | "Zzzzt! Ouchy! That's a sharp thorn! The trees said 'Mossy Rock'!" | Energetic | Error Correction |
| `ch01_sc02_win_fast` | Sir James | "Got it! To the rock!" | Relieved | High Mastery |
| `ch01_sc02_win_slow` | Sir James | "I had to listen really hard, but I heard it. The rock is safe." | Proud | High Persistence |

**SFX Needed:** `sparky_zap.mp3`, `tree_whisper.mp3`

---

## 🎬 SCENE 3: The Riddle or The Answer

| Line ID | Character | Script Text | Emotion | Purpose |
|---------|-----------|-------------|---------|---------|
| `ch01_sc03_prime` | Forest Guide | "I can show you the way. Do you want a Riddle to solve? Or should I just tell you the answer?" | Mysterious | Main Prompt |
| `ch01_sc03_idle` | Claude | "*Whine...* I just want to find the snacks. Can we ask for help?" | Uncertain | Idle Support |
| `ch01_sc03_win_fast` | Sir James | "I know what I want! Let's do it!" | Confident | High Mastery |
| `ch01_sc03_win_slow` | Sir James | "Okay... I think I'll try this one." | Thoughtful | High Persistence |

**SFX Needed:** `dog_whine.mp3`

---

## 🎬 SCENE 4: The Hollow Log Boom

| Line ID | Character | Script Text | Emotion | Purpose |
|---------|-----------|-------------|---------|---------|
| `ch01_sc04_prime` | Narrator | "BOOM! The log sounds like a drum! Sir James jumps back. How is he feeling?" | Dramatic | Main Prompt |
| `ch01_sc04_idle` | Sir James | "My heart is beating really fast like a bunny rabbit..." | Vulnerable | Idle Support |
| `ch01_sc04_calm` | Narrator | "Take a deep breath with Claude. In... 1, 2, 3. Out... 1, 2, 3. You are safe." | Soothing | Parent Calm Override |
| `ch01_sc04_win_fast` | Sir James | "Okay, I said it. I was scared. But I'm okay now." | Brave | High Mastery |
| `ch01_sc04_win_slow` | Sir James | "It took me a minute, but I figured out how I feel." | Reflective | High Persistence |

**SFX Needed:** `log_boom.mp3`, `heartbeat.mp3`

---

## 🎬 SCENE 5: The Virtue Reflection

| Line ID | Character | Script Text | Emotion | Purpose |
|---------|-----------|-------------|---------|---------|
| `ch01_sc05_prime` | Gramps | "You did well today, lad. What was your strongest power?" | Warm/Proud | Main Prompt |
| `ch01_sc05_idle` | Sparky | "You were so brave at the loud log! Zoom!" | Encouraging | Idle Support |
| `ch01_sc05_win_fast` | Sir James | "I choose... Courage! Because I kept going even when it was dark." | Proud | High Mastery |
| `ch01_sc05_win_slow` | Sir James | "Hmm... I think I was wise today. I listened to the trees." | Thoughtful | High Persistence |

**SFX Needed:** `sparky_zoom.mp3`, `campfire_crackle.mp3`

---

## 📁 OUTPUT FILE NAMING

All audio files should be saved to: `public-book002/chapter01/audio/`

```
chapter01/audio/
├── ch01_sc01_prime.mp3
├── ch01_sc01_idle.mp3
├── ch01_sc01_win_fast.mp3
├── ch01_sc01_win_slow.mp3
├── ch01_sc02_prime.mp3
├── ch01_sc02_idle.mp3
├── ch01_sc02_err.mp3
├── ch01_sc02_win_fast.mp3
├── ch01_sc02_win_slow.mp3
├── ch01_sc03_prime.mp3
├── ch01_sc03_idle.mp3
├── ch01_sc03_win_fast.mp3
├── ch01_sc03_win_slow.mp3
├── ch01_sc04_prime.mp3
├── ch01_sc04_idle.mp3
├── ch01_sc04_calm.mp3
├── ch01_sc04_win_fast.mp3
├── ch01_sc04_win_slow.mp3
├── ch01_sc05_prime.mp3
├── ch01_sc05_idle.mp3
├── ch01_sc05_win_fast.mp3
└── ch01_sc05_win_slow.mp3
```

---

## 🎵 SFX FILES NEEDED

| SFX ID | Description | File |
|--------|-------------|------|
| `dog_sniff` | Claude sniffing the air | `sfx/dog_sniff.mp3` |
| `dog_whine` | Claude uncertain whine | `sfx/dog_whine.mp3` |
| `sparky_zap` | Sparky's electric zap | `sfx/sparky_zap.mp3` |
| `sparky_zoom` | Sparky flying fast | `sfx/sparky_zoom.mp3` |
| `tree_whisper` | Ethereal tree whisper | `sfx/tree_whisper.mp3` |
| `log_boom` | Hollow log drum sound | `sfx/log_boom.mp3` |
| `heartbeat` | Fast heartbeat | `sfx/heartbeat.mp3` |
| `campfire_crackle` | Cozy campfire | `sfx/campfire_crackle.mp3` |

---

## ✅ RECORDING CHECKLIST

- [ ] All 22 voice lines recorded
- [ ] All 8 SFX files created
- [ ] Files named exactly as specified
- [ ] Audio normalized to -16 LUFS
- [ ] MP3 format, 128kbps minimum
- [ ] No background noise or clipping

---

**For the Commons Good!** 🏰⚔️🐕✨
