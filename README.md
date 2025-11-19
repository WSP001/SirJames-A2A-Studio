# SirJamesAdventures003

Interactive virtue-choice storybook engine (Book003) for the Sir James Adventures series.

## Core Goals
- JSON-driven scenes (schema v3.0)
- Branching virtue choices: courage | wisdom | trust
- Accessible: ARIA roles, focus management, alt text, reduced motion respect
- Extensible: future chapters plug in via validated prompt bundles

## Quick Start (after PR merges)
```bash
npm install
npm run dev
```

## Schema v3.0 Highlights
- `version` const "3.0"
- `metadata` (narrative_theme, learning_objectives[])
- Scenes: id pattern `^ch\\d{2}_s\\d{3}$`, `scene_type` (narrative|decision|climax)
- Optional interactive block with `choices`
- Optional `educational_hint`, `background_audio_loop`

## Characters (Canon)
Sir James (blue eyes), Claude (Redbone Coonhound), Sparky (magical brown squirrel), Gramps (ex-knight mentor), Guardian (ethereal branch-figure).

## Scripts (planned)
- `dev`, `build`, `preview`
- `lint`, `format`, `typecheck`
- `test`, `validate:prompts`

## Roadmap
1. Base scaffold + schema validation
2. Chapter01 template content
3. Accessibility enhancements pass
4. Asset pipeline integration (future)

## License
MIT
ROJECT JUMPSTART SPEC: SirJamesAdventures003
Goal: Scaffold Book003 of the Sir James Adventures interactive virtue‑choice storybook system with a modern, accessible, JSON‑driven architecture; include character canon consistency, prompt schema evolution, testing harness, build + deploy workflow, and authoring tools. Generate an initial pull request containing the foundation (NOT full content).

Core Concept
Create an interactive children’s storybook web application (Book003) where each chapter consists of scenes with:
Image prompt text (for external generative tools)
Alt text (accessibility)
Audio cue identifiers
Optional interactive virtue-choice blocks (courage | wisdom | trust) branching to next scene IDs
All story content must be externalized as JSON bundles validated by a JSON Schema (version 3.0). The runtime consumes these bundles to render HTML/JS views.
Tech Stack
Frontend: TypeScript + Vite + lightweight, framework-lite architecture (no heavy React unless essential; prefer modular web components or minimal functional components).
Styling: CSS Modules or utility-first (e.g., PostCSS + custom tokens) with a design tokens file.
Accessibility: ARIA roles, focus management, keyboard navigation, reduced motion respect, color contrast.
Build: Vite config with separate dev + production modes.
Lint/Format: ESLint (typescript + accessibility plugin), Prettier, stylelint (if using global styles).
Testing: Vitest + Playwright (basic smoke navigation + accessibility assertions).
CI: GitHub Actions (lint, type-check, unit tests, schema validation).
Deployment: Provide Netlify-compatible build (build command: vite build; output: dist/). Include a netlify.toml stub.
Canon & Character Consistency (Must be encoded once)
Central canonical file (e.g., src/canon/characters.ts + docs/CHARACTER_CONSISTENCY_GUIDE.md) with:
Sir James: blue eyes, light brown hair (cowlick), royal blue tunic, wooden practice sword, red cape
Claude: royal bloodline, Redbone Coonhound (reddish-brown coat), intelligent eyes, royal blue collar
Gramps: ex-knight mentor, silver-white beard, puzzle-stone cottage motif
Sparky: small brown squirrel with magical sparkles (schema allows legacy “firefly” but Book003 uses squirrel)
Guardian: ethereal branch-figure with gentle green glow
Include guidance for prompt phrasing for image generation (structured descriptors + mood + lighting + aspect ratio).
JSON Schema (book003_prompt.schema.json)
Introduce schema version: 3.0 (const). Differences vs prior (v2.0) expected:
Add field scene_type: enum [narrative, decision, climax]
Add an optional field educational_hint (string) in interactive blocks
Add optional field background_audio_loop (string) per scene
Add global metadata block: { version, chapter, narrative_theme, learning_objectives[] }
Keep interactive.choices[*].virtue restricted to courage | wisdom | trust
Enforce scene id pattern: ^ch\d{2}_s\d{3}$
Provide $defs for character objects to reduce repetition (sir_james, claude, gramps, sparky, guardian)
Required top-level keys: version, chapter, metadata, characters, scenes
characters.sparky.species enum: [squirrel, firefly]
Include a validator script (scripts/validate_prompts.ts) using ajv (strict mode). Fail CI if invalid. Pass with message if no JSON files yet.
Initial Content (Templates Only)
Include:
content/Chapter01/metadata/prompt_bundle.template.json (3 sample scenes: intro narrative, decision scene with choices, climax). Use placeholder text and next_scene references.
Do NOT add final production storylines—samples only.
Provide content/README.md explaining how to duplicate Chapter folders (Chapter02, etc.) and fill out bundles.
Runtime Loader
Implement a content loader (src/runtime/contentLoader.ts) that:
Fetches a chapter’s prompt bundle JSON
Validates shape locally (lightweight assertion subset separate from full schema)
Normalizes optional fields (e.g., ensures interactive presence is checked safely)
Rendering Layer
Implement minimal page flow:
index.html: Lists available chapters (starting with “Chapter 01 (Template)” flagged as DRAFT)
Chapter view (single page app style or multi-page approach—choose simplest):
Renders current scene (title, descriptive text placeholder, alt text placeholder)
If an interactive block exists: show virtue choice buttons with accessible labels + data-virtue attribute
“Next” button for non-interactive scenes
Basic state store (src/state/storyState.ts) tracking current scene ID and choice history
Provide a stub analytics hook interface (no real tracking)
Accessibility & UX Essentials
Focus ring visible
Skip-to-content link
Semantic landmarks (main, nav, footer)
aria-live region for scene transitions
Keyboard navigation for choices (arrow keys cycle, Enter activates)
Testing Requirements
Add tests covering:
Schema validator passes template
contentLoader loads the template and returns a structured object
Scene navigation state increments correctly
Interactive choice updates the state (virtue recorded)
Basic Playwright test: load index, open Chapter 01, navigate scenes, activate a virtue choice, assert next scene ID appears
CI / GitHub Actions
Create .github/workflows/ci.yml with jobs:
install + typecheck
lint + format check (no unformatted files)
test (vitest)
playwright (headless)
schema validation script
Only run Playwright on push/PR to main or feature branches; allow matrix with Node 20 & 22. Cache npm dependencies.
Scripts (package.json)
dev, build, preview
lint, format, format: check
test, test: watch
validate: prompts
validate:all (runs lint + type + test + schema)
Documentation
Create:
README.md (project overview, architecture, how to add a new chapter, schema evolution notes)
docs/ARCHITECTURE.md (layered overview: content -> loader -> state -> renderer)
docs/SCHEMA_EVOLUTION.md (explain jump from v2.0 to v3.0 and forward-compat guidelines)
docs/CONTENT_PIPELINE.md (how prompts → images/audio assets integration placeholders)
docs/ACCESSIBILITY_CHECKLIST.md
docs/CHARACTER_CONSISTENCY_GUIDE.md (see Canon)
Developer Experience
Provide a .editorconfig
Provide tsconfig with strict turned on
Provide eslint + prettier configs (no unused vars, no implicit any, import ordering)
Provide sample environment file .env.example (e.g., FUTURE_API_BASE=)
Netlify / Deployment
netlify.toml:
[build]
command = "npm run build"
publish = "dist"
Redirect root / → /index.html; add security headers stub.

Quality Gates / Non-Goals

NO proprietary assets or large media files
NO real analytics or networked persistence yet
DO NOT auto-generate all chapters—just Chapter01 template
Keep total initial PR lean but coherent & runnable
Deliverables Summary (First PR Must Contain)
package.json + lock
Vite config
tsconfig.*
src/runtime/contentLoader.ts
src/state/storyState.ts
src/components/ (basic: SceneView, ChoiceButtons, Navigation)
public/index.html + favicon placeholder
content/Chapter01/metadata/prompt_bundle.template.json
schemas/book003_prompt.schema.json
scripts/validate_prompts.ts
docs/ (all listed)
README.md
.github/workflows/ci.yml
netlify.toml
.editorconfig, .eslintrc.cjs (or .js), .prettierrc, .gitignore
Tests (unit + one Playwright spec)
README Key Sections (outline)
Vision
Quick Start
Adding a Chapter
Schema v3.0 Overview
Accessibility Commitments
Character Canon
Testing & CI
Deployment
Helpful Implementation Notes for Copilot
Favor composable functions and small modules
Use dependency injection pattern where future asset loaders may plug in
Provide types: Scene, InteractiveChoice, PromptBundle, CharacterSet, StoryState
Guard against invalid scene IDs gracefully (fallback + console.warn)
Provide a TODO comment block where future audio/image pipelines will integrate
License
MIT
END OF SPEC — Please generate an initial pull request implementing all above; mark anything incomplete with clearly labeled TODO comments (minimize them).
