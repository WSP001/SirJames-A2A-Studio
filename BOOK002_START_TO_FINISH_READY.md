# Book002 Start-to-Finish Ready Map

This is the operating map for finishing Sir James Adventures Book002 from Chapter 1 through Chapter 10. It resolves the older scattered programmer notes into one file-level checklist.

## Mission

Build the memory before the masterpiece: keep the book complete, transparent, age-appropriate, low-cost, and easy to verify.

## Narrative-Only Direction

Do not invent a new book. This map protects the existing Book002 production structure.

When changing the story, use the same main characters and same chapter/scene file marks. The intended edit path is:

1. Change narrative text in `public-book002/chapterNN/_narration_batch.json`.
2. Keep existing character identities unless the user explicitly approves a new character.
3. Keep existing image, audio, prompt, and navigation paths stable unless a specific asset replacement is requested.
4. Regenerate scene HTML with `python tools/wire_chapter_html_v2.py --chapter N` or `--all`.
5. Validate with `node tools/validate-assets.js`.

## Current Local Result

The local Book002 public output is complete across 10 chapters and 80 scenes:

- Chapters: `public-book002/chapter01` through `public-book002/chapter10`
- Scenes: `scene-001` through `scene-008` in every chapter
- Images: `images/scene-001.png` through `scene-008.png` in every chapter
- Audio: chapter-level `audio/` folders with generated MP3 files
- Narration source: `_narration_batch.json` in every chapter
- Prompt source: `prompts/book002/json/chNN-scXXX.json` for every scene

## Verified Marks

| Check | Command | Result |
|---|---|---|
| Asset integrity | `node tools/validate-assets.js` | Passed with 0 errors and 0 warnings |
| Package build | `npm run build` | Passed; Vite generated `dist/` |

## Chapter-by-Chapter Marks

| Chapter | Public Folder | Prompt Range | Scene Pages | Images | Audio | Go Mark |
|---:|---|---|---:|---:|---:|---|
| 01 | `public-book002/chapter01/` | `ch01-sc001` to `ch01-sc008` | 8/8 | 8/8 | Present | Go |
| 02 | `public-book002/chapter02/` | `ch02-sc001` to `ch02-sc008` | 8/8 | 8/8 | Present | Go |
| 03 | `public-book002/chapter03/` | `ch03-sc001` to `ch03-sc008` | 8/8 | 8/8 | Present | Go |
| 04 | `public-book002/chapter04/` | `ch04-sc001` to `ch04-sc008` | 8/8 | 8/8 | Present | Go |
| 05 | `public-book002/chapter05/` | `ch05-sc001` to `ch05-sc008` | 8/8 | 8/8 | Present | Go |
| 06 | `public-book002/chapter06/` | `ch06-sc001` to `ch06-sc008` | 8/8 | 8/8 | Present | Go |
| 07 | `public-book002/chapter07/` | `ch07-sc001` to `ch07-sc008` | 8/8 | 8/8 | Present | Go |
| 08 | `public-book002/chapter08/` | `ch08-sc001` to `ch08-sc008` | 8/8 | 8/8 | Present | Go |
| 09 | `public-book002/chapter09/` | `ch09-sc001` to `ch09-sc008` | 8/8 | 8/8 | Present | Go |
| 10 | `public-book002/chapter10/` | `ch10-sc001` to `ch10-sc008` | 8/8 | 8/8 | Present | Go |

## File Marks to Trust

Use these as the source of truth instead of older scattered claims:

| Mark | Meaning |
|---|---|
| `BOOK002_STATUS.md` | Human-readable readiness state |
| `BOOK002_START_TO_FINISH_READY.md` | Operational start-to-finish map |
| `public-book002/chapters.json` | Chapter metadata used by the public book |
| `prompts/book002/json/` | Per-scene prompt source for all 80 scenes |
| `public-book002/chapterNN/_narration_batch.json` | Per-chapter narration and dialogue source |
| `public-book002/chapterNN/_interaction_loops.json` | Per-chapter interaction loop source |
| `public-book002/chapterNN/scene-XXX/index.html` | User-facing scene pages |
| `tools/wire_chapter_html_v2.py` | Regenerates chapter and scene HTML from narration batches |
| `tools/validate-assets.js` | Verifies scene folders, local images, local audio, navigation markers, and CDN-safe filenames |
| `netlify.toml` | Deployment routing and static output settings |

## Commons Good Readiness Gates

Before release, the book should pass these gates:

1. **Completeness:** 10 chapters, 80 scenes, 80 images, audio references, and chapter navigation are present.
2. **Transparency:** Cost and telemetry surfaces remain available through `netlify/functions/telemetry.ts`, `netlify/functions/lib/telemetry.ts`, and `src/components/CostMeter.tsx`.
3. **Attribution:** `netlify/functions/generate-attribution.ts` and any visible attribution page/metadata are reviewed before production deploy.
4. **Privacy:** Do not add real child/user personal data to public scene content, logs, telemetry, or manifests.
5. **Ethics:** Keep the language and imagery PG and appropriate for ages 5-8.
6. **Accessibility:** Verify keyboard/touch navigation, readable text sizes, alt text, and audio controls on the final deployed site.
7. **Cost:** Keep any regeneration run under the target of less than $1.00 per chapter.

## Finish Order

Use this order when preparing the final release:

1. Re-run file integrity if assets change: `node tools/validate-assets.js`
2. Re-run the app shell build if source changes: `npm run build`
3. Review locally: `netlify dev` or static review of `public-book002/`
4. Deploy production: `netlify deploy --prod --dir=public-book002 --no-build`
5. Check production: open `https://sirjames-book002-final.netlify.app`
6. iPad QA: tap-to-play audio, next/previous scene navigation, chapter navigation, readability
7. Release mark: tag or note the deployment as `book002-start-to-finish-ready`

## Known Session Note

The AGENTS.md instruction requires Byterover retrieval/storage before and after significant work. In this session, `byterover-retrieve-knowledge` was not available and no Byterover MCP server was present in the MCP catalog. This file is the local fallback memory record for the audit.
