# Book003 Component Checklist

**Date:** May 18, 2026
**Status:** Before story concept intake

## Gate 1: Separation

- [x] Sir James is treated as a personal book project.
- [x] SeaTrace and World Seafood Producers are not Sir James canon.
- [x] SirTrav may only be used as a generic pattern source after renaming and verification.
- [x] Legacy folders are reference material, not production systems.

## Gate 2: Proven Book002 Reuse

- [x] Reuse `public-book002/js/storyflow.js` concept for one-tap Adventure Mode.
- [x] Reuse chapter/scene folder pattern.
- [x] Reuse asset validation approach.
- [x] Reuse touch target and accessibility rules.
- [x] Reuse chapter-to-chapter auto navigation.
- [ ] Freeze current production Book002 into a dated release snapshot if a new archive is required.

## Gate 3: Book003 Workspace

- [ ] Create `public-book003/`.
- [ ] Add `public-book003/index.html`.
- [ ] Add `public-book003/chapters.json`.
- [ ] Add `public-book003/parent-dashboard.html`.
- [ ] Add `public-book003/js/storyflow.js`.
- [ ] Add chapter folders `chapter01` through `chapter10`.
- [ ] Add scene folders `scene-001` through `scene-008` in every chapter.
- [ ] Add empty or placeholder `images/`, `audio/`, `_narration_batch.json`, and `_interaction_loops.json` per chapter.

## Gate 4: Story Engine

- [x] Contract written in `BOOK003_STORY_ENGINE_CONTRACT.md`.
- [ ] Build or adapt the generator so it creates pages that load `storyflow.js`.
- [ ] Ensure the generator writes next-scene and next-chapter links.
- [ ] Ensure each generated scene has visible narration tied to audio.
- [ ] Ensure background music starts only after user tap.

## Gate 5: Parent Dashboard

- [ ] Decide whether Book003 dashboard is static/local-only or backend-connected.
- [ ] If local-only, remove API/backend claims from public text.
- [ ] Add progress, virtue summary, replay, music, and pace controls.
- [ ] Add reflection prompts for parent/child discussion.
- [ ] Add accessibility checks for mobile and iPad.
- [ ] Add local-only logging categories: story, interaction, system, accessibility, performance, error.
- [ ] Convert any legacy interactive tree ideas into the current `_interaction_loops.json` schema.

## Gate 6: Audio Pipeline

- [ ] Confirm voice IDs are current and allowed to use.
- [ ] Confirm Sir James young voice, narrator voice, Gramps voice, and Claude SFX rule.
- [ ] Add normalization target for narration/music mix.
- [ ] Add file naming rule per line.
- [ ] Add QA listen-through step.

## Gate 7: Image Pipeline

- [ ] Confirm character bible from `CONSISTENCY.md`.
- [ ] Confirm image style and aspect ratio.
- [ ] Confirm no character drift between scenes.
- [ ] Confirm all image files are local and referenced by HTML.
- [ ] Add human visual review for Sir James, Claude, Gramps, and Sparky.

## Gate 8: Story Intake

- [ ] Wait for the next Sir James Adventures subject from Scott.
- [ ] Convert subject into chapter outline only after Gates 1-7 are satisfied.
- [ ] Do not generate final prose before the outline, contract, and workspace agree.
