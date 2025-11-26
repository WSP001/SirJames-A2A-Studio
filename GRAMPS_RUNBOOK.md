# How Gramps Runs the Sir James Project (Book002)

This is a simple runbook for Roberto ("Gramps") so he doesn't have to remember a million commands.

The idea: **open one clean shell, use a few safe commands, ship joy to a 5-year-old.**

---

## 1. Open the Clean Sir James Shell

**Best way:**

1. On Windows, go to the Desktop
2. Double-click: `sirjames-dev.cmd`

You should see a PowerShell window open where:

- The folder is already: `SirJames-A2A-Studio`
- Python is ready to use
- No extra Windsurf / Docker / SeaTrace noise

If you ever see a lot of "Windsurf / DevShell" banners, close that window and start again from the Desktop shortcut.

---

## 2. Check What's Ready

Inside the `sirjames-dev` shell, type:

```powershell
status
```

This shows:

- Which chapters have images
- Which chapters have audio
- Which chapters are fully wired and playable

If this command ever breaks, a programmer should fix `status` for you rather than asking you to run raw Python.

---

## 3. Preview the Book Locally

To run the local preview (for testing on your own machine):

```powershell
serve
```

Then, in a browser (or iPad on the same network), open:

```
http://127.0.0.1:8888
```

Your programmer should keep this wired so:

- The landing page shows the Chapter Board with images
- Each chapter link goes to `/chapter0X/scene-001/`
- You can click "Tap to Listen" and hear the narration

---

## 4. Generate New Assets (Advanced, But Safe)

If you ever need to regenerate assets and have enough API credit:

### Images (DALL-E)

Example: regenerate images for Chapter 3:

```powershell
img 3
```

Or, if the helper is not available:

```powershell
python tools/images_generate.py --chapter 3 --size 1792x1024 --quality hd --max-usd 1.00
```

### Audio (ElevenLabs)

Example: regenerate audio for Chapter 3:

```powershell
audio 3
```

Or the direct form:

```powershell
python tools/eleven_agent.py synth --chapter 3 --max-usd 1.00
```

**Important:** If something looks wrong (voice sounds too old, volume off, etc.), tell the programmer. You don't have to debug prompts yourself.

---

## 5. Deploying to Netlify (For Sir James to Test)

**Rule #1:** Only deploy when a programmer has confirmed the deploy command is safe.

Once they confirm, your flow should be:

1. Open `sirjames-dev` (Desktop shortcut)
2. Run:

```powershell
deploy
```

3. Wait for the script to say success
4. Open the live site:

```
https://sirjames-book002-final.netlify.app
```

5. On iPad, go directly to:

```
https://sirjames-book002-final.netlify.app/chapter01/scene-001/
```

A programmer should document exactly what `deploy` does and make sure it only affects the correct Netlify site and Book002 content.

---

## 6. What Gramps Should NOT Touch

To keep things safe:

- ❌ Don't edit `.env.local` unless a programmer tells you exactly what to change
- ❌ Don't run raw git commands like `git reset`, `git push --force`, etc.
- ❌ Don't delete folders under `public-book002` unless a programmer says it's okay
- ❌ Don't paste API keys into chat or screenshots

If something feels scary or confusing, stop and ask.

---

## 7. When to Call the Programmer

Call or message your programmer when:

- A command in this runbook suddenly fails
- A chapter is missing images or audio in the preview
- Sir James finds a bug on the iPad
- You want a new feature (e.g. new chapter board visuals, new animations, etc.)

**Your job is to dream, review, and approve.**
**Their job is to wire the robots so it all works.** 💛

---

## Quick Deploy Checklist (Book002 → Netlify)

This is what should be true **before** Roberto/Gramps runs a deploy.

### 1. Assets Are Ready

Programmer responsibilities:

- [ ] All 10 chapters have:
  - [ ] 8 HD images each in `public-book002/chapter0X/images/`
  - [ ] Audio in `public-book002/chapter0X/audio/`
- [ ] Thought bubble icons exist in `public-book002/assets/thought_icons/`
- [ ] Chapter HTML pages exist: `public-book002/chapter0X/scene-00Y/index.html`
- [ ] Landing **Chapter Board** page shows cards with HD art

### 2. Local Preview Looks Correct

For Gramps:

1. Open the clean dev shell (`sirjames-dev.cmd` on Desktop)
2. Run: `serve`
3. In a browser, open `http://127.0.0.1:8888`
4. Click into a chapter:
   - HD image visible
   - "Tap to Listen" button works
   - Audio voice feels appropriate for a 5-year-old
   - Navigation "Next Scene / Previous Scene" works

If anything looks or sounds wrong, **stop and call the programmer.**

### 3. Run the Deploy

After the programmer confirms everything:

1. Open `sirjames-dev` (Desktop shortcut)
2. Run: `deploy`
3. Wait for success message
4. Test on iPad at: `https://sirjames-book002-final.netlify.app`

### 4. What Gramps Should Never Have to Touch

- ❌ `netlify link`
- ❌ `netlify.toml`
- ❌ `.env.local`
- ❌ API keys

If any of those are needed, the programmer should do it.

---

## Command Reference

| Command  | What It Does                          |
|----------|---------------------------------------|
| `status` | Show project status dashboard         |
| `serve`  | Start local preview on :8888          |
| `deploy` | Deploy Book002 to Netlify production  |
| `img`    | Generate DALL-E images                |
| `audio`  | Generate ElevenLabs audio             |
| `icons`  | Generate thought bubble icons         |

---

**Last Updated:** November 26, 2025
