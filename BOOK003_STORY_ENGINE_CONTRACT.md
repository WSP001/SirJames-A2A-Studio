# Book003 Story Engine Contract

**Date:** May 18, 2026
**Status:** Platform contract before new story writing

## Mission

Book003 must reuse the proven Book002 playback engine while improving clarity, parent guidance, accessibility, and production readiness. New story content starts only after the platform contract is satisfied.

## Book Shape

| Rule | Requirement |
|---|---|
| Chapters | 10 chapters |
| Scenes | 8 scenes per chapter |
| Audience | Ages 5-8, with a 5-year-old primary reader/listener |
| Main characters | Sir James, Claude, Gramps, Sparky unless a future subject requires a narrow exception |
| Reading style | Short lines, clear actions, concrete emotions |
| Virtue model | One primary virtue per chapter, visible through choices and consequences |
| Public claims | Story, learning, accessibility, attribution, and verified media only |

## Required Files Per Book

```text
public-book003/
  index.html
  chapters.json
  parent-dashboard.html
  js/
    storyflow.js
  assets/
    audio/
      theme-song.mp3
    covers/
  chapter01/
    index.html
    _narration_batch.json
    _interaction_loops.json
    _images_log.json
    _audio_log.json
    images/
      scene-001.png
    audio/
      001-01-01.mp3
    scene-001/
      index.html
```

Repeat the chapter folder through `chapter10/` and the scene folder through `scene-008/`.

## Narration Contract

Each scene must have:

- 1 scene title.
- 1 setting summary.
- 3-7 spoken lines for normal scenes.
- 1-3 characters speaking per scene unless the scene is a chapter finale.
- Short sentences suitable for read-aloud playback.
- One clear action or choice for the child.
- No hidden business, API, auth, ROI, or enterprise claims.

Each line must identify:

```json
{
  "speaker": "Sir James",
  "text": "I can be brave and kind at the same time.",
  "emotion": "steady",
  "audio": "001-01-01.mp3"
}
```

## Image Contract

Each scene must have:

- One image file named `scene-001.png` through `scene-008.png`.
- Consistent Sir James character design from `CONSISTENCY.md`.
- Clear subject in frame, not dark or overly abstract.
- Child-safe visual tone.
- No business imagery unless the story subject explicitly and safely calls for it.

## Audio Contract

Each scene must have:

- Narration or character voice audio wired to the visible text.
- Background music started only after a user tap because browsers block true autoplay.
- Music mixed lower than narration.
- Claude treated as SFX/thought-bubble behavior unless a deliberate future rule changes it.
- File names that match the narration batch and HTML.

## Navigation Contract

Book003 must keep the Book002 child-friendly flow:

- One initial `Start Adventure` tap.
- Sequential actor/narrator playback.
- Auto-advance scene after playback when Adventure Mode is active.
- Last scene advances to the next chapter.
- Final chapter returns to all chapters or completion screen.
- Swipe left/right and keyboard arrows.
- Manual next/back buttons remain as fallback.
- Touch targets at least 48px high.

## Parent Dashboard Contract

The dashboard must be real and modest:

- Show reading progress by chapter and scene.
- Show virtue focus and child-friendly reflection prompts.
- Store local-only feedback unless a verified backend exists.
- Include parent controls for music, pace, hints, and replay.
- Avoid claims about live AI generation, API integrations, or analytics unless those paths are implemented and tested.

## Interaction Tree Contract

Legacy interactive tree files may be reused as story logic references. They show useful patterns:

- Scene narration.
- Character dialogue.
- Claude thought-bubble lines.
- Parent/child decision questions.
- Choice outcomes.
- Virtue points.
- Next-scene routing.

Book003 should convert that pattern into the current `_interaction_loops.json` and scene-card metrics format. Do not copy the old files blindly; normalize them into the Book003 schema.

## Logging Contract

The legacy `SirJamesLogger.swift` pattern is useful as a vocabulary reference. Book003 should keep these logging categories:

- story
- interaction
- system
- accessibility
- performance
- error

For the public static site, logging should stay local and privacy-safe unless a verified backend exists.

## QA Contract

Book003 cannot be marked production-ready until:

- Asset validator passes.
- Build passes.
- At least Chapter 1 has browser smoke testing.
- Last scene of Chapter 1 points to Chapter 2.
- One full chapter is listened through on target device.
- Parent dashboard opens without console-breaking errors.
- A human marks any hard-for-5-year-old lines for simplification.
