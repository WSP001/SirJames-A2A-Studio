# TEAM_HANDOFF.md — Sir James Book002 Deploy

## 1. What’s Ready

**Project:** `SirJames-A2A-Studio` (Book002 – Image/Audio)  
**Repo:** `WSP001/SirJames-A2A-Studio`  
**Host:** `sirjames-book002-final.netlify.app`

Infra status:
- **✅ Netlify site + env vars configured**
- **✅ GitHub repo wired to main branch**
- **✅ Safety gates:** `Verify-BuildEnv.ps1`, `scripts/Check-NetlifyToken.ps1`
- **✅ Python + Node pinned and dependencies locked**
- **✅ Agents + telemetry wired (see `AGENTS.md`)  
- **⏳ CI/CD GitHub Actions:** workflow exists, runs once you push to `main`

MCP / extra tooling is **not required** for deploy. Focus only on: Node, Python, Netlify, GitHub.

---

## 2. Secrets & Environment Map

### 2.1 Netlify Environment (Source of Truth for Deploys)

In Netlify → Site Settings → Environment variables you should see:

- `NETLIFY_AUTH_TOKEN`  
  - **Scope:** All scopes · 5 values in 5 deploy contexts  
  - **Contexts:**
    - ✅ Production  
    - ✅ Deploy Previews  
    - ✅ Branch deploys  
    - ✅ Preview Server & Agent Runners  
    - ✅ Local development (Netlify CLI)
- `NETLIFY_SITE_ID` — All scopes, same value in all contexts
- `OPENAI_API_KEY` — All scopes
- `ELEVENLABS_API_KEY` — All scopes
- `BOOK_VERSION` — All scopes (`BOOK002_MULTIMEDIA`)
- `PYTHON_VERSION` — All scopes (`3.12.4`)
- `NODE_ENV` — All scopes (`production` or `development`, depending on stage)
- `SUNO_API_KEY` / `GEMINI_API_KEY` — **optional**, can be empty for now.

Whenever you change any values, **edit** existing keys; do not create duplicates.

### 2.2 Local `.env.local` (Developer Machines)

File: `SirJames-A2A-Studio/.env.local`

Contains (for local-only use):
- `OPENAI_API_KEY=...`
- `ELEVENLABS_API_KEY=...`
- `SUNO_API_KEY=...` (optional)
- `GEMINI_API_KEY=...` (optional)
- `NETLIFY_AUTH_TOKEN=...`  
- `NETLIFY_SITE_ID=...`  
- `BOOK_VERSION=BOOK002_MULTIMEDIA`
- `NODE_ENV=development`
- `PYTHON_VERSION=3.12.4`

> **Important:** `.env.local` is **not committed**. Use it for local runs; Netlify uses its own env store.

### 2.3 GitHub Secrets (For CI/CD)

In GitHub → Repo → Settings → Secrets and variables → Actions:

- `NETLIFY_AUTH_TOKEN`  
- (Optionally later) `OPENAI_API_KEY`, `ELEVENLABS_API_KEY`, etc., if workflows need them.

For now, **only the Netlify token is required** to allow Actions to deploy.

---

## 3. Safety Gates & Commands

### 3.1 Token Gate (Check-NetlifyToken.ps1)

From project root:
```powershell
cd "C:\Users\Roberto002\OneDrive\Sir James\LOGIC SirJames_Interactive_Prototype_With_Chapter10\SirJames-A2A-Studio"
.\u005cscripts\Check-NetlifyToken.ps1
```
Expected output when healthy:
- `✅ Local NETLIFY_AUTH_TOKEN found in .env.local.`  
- `✅ Netlify CLI logged in as: <your account>`

If `.env.local` is missing the token, the script will tell you exactly that.

### 3.2 Build Env Gate (Verify-BuildEnv.ps1)

From project root:
```powershell
.\u005cVerify-BuildEnv.ps1
```
What it checks:
- Required env vars present (`OPENAI_API_KEY`, `ELEVENLABS_API_KEY`, `BOOK_VERSION`, `PYTHON_VERSION`, `NODE_ENV`, `NETLIFY_SITE_ID`, `NETLIFY_AUTH_TOKEN`)
- Python runtime pinned to `3.12.4`
- (Optional) Netlify site match

**If it prints a list of missing variables:**
- Confirm they are present either in:
  - Netlify env UI (for deploys), and/or  
  - Local `.env.local` (for dev)  
- For local shells, you may need to export variables or rely on scripts that load `.env.local`.

Gate rule for team: **Do not deploy if `Verify-BuildEnv.ps1` fails.**

---

## 4. Local Dev & Test Flow

### 4.1 Install Dependencies

```powershell
cd "C:\Users\Roberto002\OneDrive\Sir James\LOGIC SirJames_Interactive_Prototype_With_Chapter10\SirJames-A2A-Studio"

npm ci
pip install -r requirements.txt
```

If `npm ci` hits EPERM / file-in-use issues on Windows:
- Close any running `netlify dev` or watcher processes.
- Make sure no antivirus is locking `node_modules`.
- As a last resort: delete `node_modules` and re-run `npm ci`.

### 4.2 Run Environment Validation

```powershell
.\u005cVerify-BuildEnv.ps1
```
Fix any reported missing vars before moving on.

### 4.3 Start Local Netlify Dev Server

```powershell
netlify dev
```
Then open:
- `http://localhost:8888`

Validate:
- `/.netlify/functions/telemetry` returns JSON
- UI CostMeter shows costs and under-budget status
- No visible "missing API key" errors in the browser console

---

## 5. Production Deploy Flow (Manual CLI)

Once gates pass locally:

```powershell
netlify deploy --prod --site sirjames-book002-final
```

Expected CLI messages on success:
- `✔ Finished processing build request`
- `✔ Deploy is live!`  
- `Live URL: https://sirjames-book002-final.netlify.app`

### Post-Deploy Validation (Live Site)

1. Visit: `https://sirjames-book002-final.netlify.app`
2. Open DevTools → Network tab
3. Confirm these endpoints return `200 OK`:
   - `/telemetry`
   - `/analytics` (if implemented)
   - `/virtue-tracker`

---

## 6. Optional: GitHub Actions Auto-Deploy

Prereqs:
- `.github/workflows/deploy.yml` exists on `main`
- `NETLIFY_AUTH_TOKEN` configured in GitHub Secrets

Trigger a test deploy:
```powershell
git add .
git commit -m "trigger deploy test"
git push origin main
```

Then in GitHub → **Actions** tab, watch the workflow jobs:
1. Environment verification
2. Build + tests
3. Deploy via Netlify token

If all jobs are green, future merges to `main` auto-deploy.

---

## 7. What to Tell the Team (Short Version)

- **Secrets:** All core keys (OpenAI, ElevenLabs, Netlify token, site id, book version, env) are configured in Netlify with **all scopes** enabled.
- **Local dev:** Use `.env.local` in `SirJames-A2A-Studio/` for local keys. Do not commit.
- **Gates:**
  - `scripts/Check-NetlifyToken.ps1` — verifies token + CLI login
  - `Verify-BuildEnv.ps1` — blocks unsafe deploys (missing keys, wrong Python version)
- **Deploy:**
  - Manual: `netlify deploy --prod --site sirjames-book002-final`
  - Auto (optional): push to `main` and let GitHub Actions run.
- **Policies:**
  - No deploys if env gate fails.  
  - No secrets in git.  
  - Commons Good telemetry must stay enabled.

This file is the **single-page handoff** for engineers joining or resuming work on Sir James Book002.
