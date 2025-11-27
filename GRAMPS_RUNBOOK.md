# How Gramps Runs the Sir James Project (Book002)

This is a simple runbook for Roberto ("Gramps") so he does not need to remember a million commands.

**Goal:** Open one clean shell, use a few safe commands, and ship joy to a 5-year-old.

---

## 1. Open the Clean Sir James Shell

**Best way:**

1. On Windows, go to the Desktop
2. Double-click: `sirjames-dev.cmd`

You should see a PowerShell window where:

- The folder is already `SirJames-A2A-Studio`
- Python is ready
- There is no extra Windsurf / Docker / SeaTrace text

If you see a lot of "Windsurf / DevShell / SeaTrace" banners, close that window and try again from the Desktop shortcut.

---

## 2. Check What Is Ready

Inside the `sirjames-dev` shell, type:

```powershell
status
```

This should show:

- Which chapters have images
- Which chapters have audio
- Which chapters are fully wired and playable

If `status` ever breaks or looks strange, **stop and ask a programmer** to fix it. Do not run raw Python yourself.

---

## 3. Preview the Book Locally

To test Book002 on your own machine:

```powershell
serve
```

Then, in a browser (or on an iPad on the same Wi-Fi), open:

```text
http://127.0.0.1:8888
```

**Programmer responsibilities for `serve`:**

- Landing page shows the Chapter Board with cards and images
- Each chapter card links to `/chapter0X/scene-001/`
- "Tap to Listen" plays narration for that scene

If something does not load or play, **stop and call the programmer.**

---

## 4. Generate New Assets (Advanced, but Safe)

Use this **only if a programmer has told you it is okay** and there is enough API credit.

### Images (DALL-E)

Example: regenerate images for Chapter 3:

```powershell
img 3
```

If `img` is not available:

```powershell
python tools/images_generate.py --chapter 3 --size 1792x1024 --quality hd --max-usd 1.00
```

### Audio (ElevenLabs)

Example: regenerate audio for Chapter 3:

```powershell
audio 3
```

If `audio` is not available:

```powershell
python tools/eleven_agent.py synth --chapter 3 --max-usd 1.00
```

If the voice sounds too old, too loud, or just "not right for a 5-year-old," **stop and tell the programmer.** You never need to adjust prompts or API settings.

---

## 5. Deploying to Netlify (For Sir James to Test)

**Rule 1:** Only deploy when a programmer has said "Yes, it is safe to deploy now."

Once they confirm:

1. Open `sirjames-dev` (Desktop shortcut)
2. Run:

```powershell
deploy
```

3. Wait until the script prints a clear "success" message
4. Open the live site:

```text
https://sirjames-book002-final.netlify.app
```

5. On the iPad, you can go directly to:

```text
https://sirjames-book002-final.netlify.app/chapter01/scene-001/
```

A programmer should document exactly what `deploy` does and guarantee it only updates the correct Netlify site and Book002 content.

---

## 6. What Gramps Should NOT Touch

To keep everything safe:

- ❌ Do not edit `.env.local` unless a programmer is on a call with you and tells you exactly what to change
- ❌ Do not run raw git commands like `git reset`, `git push --force`, or `git pull` with extra flags
- ❌ Do not delete folders under `public-book002` unless a programmer says "yes, delete that folder now"
- ❌ Do not paste API keys into chat, email, screenshots, or documents

If something looks scary, confusing, or different than usual, **stop and ask.**

---

## 7. When to Call the Programmer

Call or message your programmer when:

- Any command in this runbook fails or shows an error
- A chapter is missing images or audio in the local preview
- Sir James finds a bug on the iPad (wrong image, wrong audio, broken button)
- You want a new feature (new chapter board visuals, new animations, new buttons, etc.)

**Your job is to dream, review, and approve.**  
**Their job is to wire the robots so it all works.** 💛

---

## Quick Deploy Checklist (Book002 → Netlify)

Everything below should be true **before** Roberto/Gramps runs `deploy`.

### 1. Assets Are Ready (Programmer)

Programmer should confirm:

- [ ] All 10 chapters have:
  - [ ] 8 HD images each in `public-book002/chapter0X/images/`
  - [ ] Audio files in `public-book002/chapter0X/audio/`
- [ ] Thought bubble icons exist in `public-book002/assets/thought_icons/`
- [ ] Chapter HTML pages exist at `public-book002/chapter0X/scene-00Y/index.html`
- [ ] The landing Chapter Board page shows all chapter cards with HD art

### 2. Local Preview Looks Correct (Gramps)

Gramps should:

1. Open the clean dev shell (`sirjames-dev.cmd` on Desktop)
2. Run: `serve`
3. Open: `http://127.0.0.1:8888` in a browser
4. Click into one chapter and check:
   - HD image is visible
   - "Tap to Listen" button works
   - Voice sounds right for a 5-year-old
   - "Next Scene / Previous Scene" navigation works

If anything looks or sounds wrong, **stop and call the programmer. Do not deploy.**

### 3. Run the Deploy (Gramps)

After programmer confirmation:

1. Open `sirjames-dev`
2. Run: `deploy`
3. Wait for the success message
4. Test on iPad at: `https://sirjames-book002-final.netlify.app`

### 4. What Gramps Should Never Have to Touch

Gramps should never need to run or edit:

- ❌ `netlify link`
- ❌ `netlify.toml`
- ❌ `.env.local`
- ❌ Any API keys or secret values

If any of these are required, a programmer must do it.

---

## Command Reference (Safe Commands for Gramps)

| Command  | What It Does                            |
|----------|-----------------------------------------|
| `status` | Show project status dashboard           |
| `serve`  | Start local preview on port 8888        |
| `deploy` | Deploy Book002 to Netlify production    |
| `img`    | Generate DALL-E images for a chapter    |
| `audio`  | Generate ElevenLabs audio for a chapter |
| `icons`  | Generate thought-bubble icon images     |

---

**Last Updated:** November 26, 2025
