# 🔐 NETLIFY PRO + NEON DATABASE ENVIRONMENT GUIDE
## Multi-Project API Key Management for Sir James Adventures

> **Version:** 1.0  
> **Date:** January 3, 2026  
> **Purpose:** Set up environment variables across multiple Netlify sites with Neon database for Parents Dashboard attribution tracking

---

## 📋 TABLE OF CONTENTS

1. [How Netlify Environment Variables Work](#1-how-netlify-environment-variables-work)
2. [Multi-Project Strategy](#2-multi-project-strategy)
3. [Neon Database Setup](#3-neon-database-setup)
4. [Complete Variable Reference](#4-complete-variable-reference)
5. [Parents Dashboard Attribution Database](#5-parents-dashboard-attribution-database)
6. [iPad 9th Generation Optimization](#6-ipad-9th-generation-optimization)
7. [Cost Tracking During Testing](#7-cost-tracking-during-testing)

---

## 1. HOW NETLIFY ENVIRONMENT VARIABLES WORK

### Per-Site Variables (What You Have Now)

Each Netlify site has its **own** environment variables. They are NOT shared automatically.

```
Site: sirjames-book002-final.netlify.app
├── OPENAI_API_KEY = sk-proj-...
├── ELEVENLABS_API_KEY = sk_...
├── GEMINI_API_KEY = AIza...
└── (These only work for THIS site)

Site: your-other-project.netlify.app
├── OPENAI_API_KEY = (must set separately!)
├── ELEVENLABS_API_KEY = (must set separately!)
└── (Completely independent)
```

### Netlify Pro: Team-Level Shared Variables

With **Netlify Pro**, you can create **Shared Environment Variables** at the team level:

```
Team: WSP001
├── SHARED: OPENAI_API_KEY = sk-proj-...
├── SHARED: ELEVENLABS_API_KEY = sk_...
├── SHARED: GEMINI_API_KEY = AIza...
│
├── Site: sirjames-book002-final (inherits shared)
├── Site: sirjames-book003 (inherits shared)
└── Site: seatrace-project (inherits shared)
```

### How to Set Shared Variables (Netlify Pro)

1. Go to: **Team settings** → **Shared environment variables**
2. Click **Add variable**
3. Set **Key** (e.g., `OPENAI_API_KEY`)
4. Set **Value** (your API key)
5. Choose **Scopes**: `Functions` (recommended for API keys)
6. Choose **Deploy contexts**: All (Production, Deploy Previews, Branch deploys)

---

## 2. MULTI-PROJECT STRATEGY

### Recommended Setup for Sir James Projects

| Variable | Scope | Share Across Projects? |
|----------|-------|------------------------|
| `OPENAI_API_KEY` | Functions | ✅ Yes - Same key for all |
| `ELEVENLABS_API_KEY` | Functions | ✅ Yes - Same key for all |
| `GEMINI_API_KEY` | Functions | ✅ Yes - Same key for all |
| `SUNO_API_KEY` | Functions | ✅ Yes - Same key for all |
| `NEON_DATABASE_URL` | Functions | ✅ Yes - Shared database |
| `BOOK_VERSION` | All | ❌ No - Per-project |
| `NODE_ENV` | All | ✅ Yes - Usually "production" |

### Your Current Sites

| Site | Purpose | Status |
|------|---------|--------|
| `sirjames-book002-final.netlify.app` | Book002 Production | ✅ LIVE |
| `sirjames-book003.netlify.app` | Book003 Development | 🔧 Setup needed |
| (Your other project) | SeaTrace/Other | 🔧 Separate or shared |

---

## 3. NEON DATABASE SETUP

### What is Neon?

Neon is a **serverless PostgreSQL** database that works perfectly with Netlify Functions. It's ideal for:

- **Parents Dashboard attribution tracking** (thumbs up/down feedback)
- **Virtue progress storage** (cross-session persistence)
- **A2A pipeline telemetry** (cost tracking, timing)
- **Child profiles** (knighthood levels, reading progress)

### Step 1: Create Neon Account

1. Go to: https://neon.tech
2. Sign up (free tier available)
3. Create a new project: `sirjames-adventures`

### Step 2: Get Connection String

After creating your project, Neon provides a connection string:

```
postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Step 3: Add to Netlify

In Netlify Dashboard → Site settings → Environment variables:

| Key | Value | Scope |
|-----|-------|-------|
| `NEON_DATABASE_URL` | `postgresql://...` | Functions |
| `DATABASE_URL` | `postgresql://...` | Functions |

### Step 4: Create Tables

Run this SQL in Neon Console:

```sql
-- Parents Dashboard Attribution Tracking
CREATE TABLE feedback_rounds (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  book VARCHAR(20) NOT NULL,
  chapter INT NOT NULL,
  scene INT NOT NULL,
  feedback_type VARCHAR(10) CHECK (feedback_type IN ('thumbs_up', 'thumbs_down')),
  prompt_used TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Virtue Progress (persistent across sessions)
CREATE TABLE virtue_progress (
  id SERIAL PRIMARY KEY,
  child_id VARCHAR(100) NOT NULL,
  virtue VARCHAR(20) NOT NULL,
  points INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(child_id, virtue)
);

-- Knighthood Levels
CREATE TABLE knighthood (
  id SERIAL PRIMARY KEY,
  child_id VARCHAR(100) NOT NULL UNIQUE,
  level VARCHAR(20) DEFAULT 'Page',
  total_points INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- A2A Pipeline Telemetry
CREATE TABLE pipeline_runs (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  agent_name VARCHAR(50) NOT NULL,
  duration_ms INT,
  cost_usd DECIMAL(10,4),
  success BOOLEAN,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Parent Chat Input (for D2A learning)
CREATE TABLE parent_inputs (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  input_type VARCHAR(20), -- 'mood', 'situation', 'guidance'
  input_text TEXT,
  extracted_themes TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_feedback_session ON feedback_rounds(session_id);
CREATE INDEX idx_virtue_child ON virtue_progress(child_id);
CREATE INDEX idx_pipeline_session ON pipeline_runs(session_id);
```

---

## 4. COMPLETE VARIABLE REFERENCE

### For Sir James Book003 (Add These to Netlify)

| Variable | Value | Scope | Context |
|----------|-------|-------|---------|
| `OPENAI_API_KEY` | `sk-proj-...` | Functions | All |
| `ELEVENLABS_API_KEY` | `sk_...` | Functions | All |
| `GEMINI_API_KEY` | `AIzaSy...` | Functions | All |
| `SUNO_API_KEY` | (your key) | Functions | All |
| `NEON_DATABASE_URL` | `postgresql://...` | Functions | All |
| `BOOK_VERSION` | `BOOK003` | All | All |
| `NODE_ENV` | `production` | All | Production only |
| `U2A_ENABLED` | `true` | All | All |
| `FEEDBACK_LOOP` | `enabled` | All | All |

### Voice IDs (Can Be Shared)

| Variable | Value | Scope |
|----------|-------|-------|
| `VOICEID_SIR_JAMES` | `SOYHLrjzK2X1ezoPC6cr` | All |
| `VOICEID_NARRATOR` | `XrExE9yKIg1WjnnlVkGX` | All |
| `VOICEID_GRAMPS` | `pqHfZKP75CvOlQylNhV4` | All |
| `VOICEID_KING_ARTHUR` | `JBFqnCBsd6RMkjVDRZzb` | All |

### Storage Backend

| Variable | Value | Purpose |
|----------|-------|---------|
| `STORAGE_BACKEND` | `netlify_blobs` | Use Netlify Blobs for assets |
| `VAULT_PATH` | `/data/vault` | Asset storage path |

---

## 5. PARENTS DASHBOARD ATTRIBUTION DATABASE

### Thumbs Up/Down Feedback Loop

When a parent gives feedback on generated content:

```javascript
// netlify/functions/submit-feedback.ts
import { neon } from '@neondatabase/serverless';

export async function handler(event) {
  const sql = neon(process.env.NEON_DATABASE_URL);
  const { sessionId, chapter, scene, feedbackType, promptUsed, imageUrl } = JSON.parse(event.body);
  
  // Record feedback
  await sql`
    INSERT INTO feedback_rounds (session_id, book, chapter, scene, feedback_type, prompt_used, image_url)
    VALUES (${sessionId}, 'Book003', ${chapter}, ${scene}, ${feedbackType}, ${promptUsed}, ${imageUrl})
  `;
  
  // If thumbs_down, flag for A2A refinement
  if (feedbackType === 'thumbs_down') {
    // Queue for next D2A learning round
    await sql`
      INSERT INTO parent_inputs (session_id, input_type, input_text)
      VALUES (${sessionId}, 'refinement_needed', ${promptUsed})
    `;
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, learningApplied: feedbackType === 'thumbs_up' ? 'reinforce' : 'adjust' })
  };
}
```

### A2A Learning from Feedback

Before each generation round, the Director Agent queries past feedback:

```javascript
// netlify/functions/lib/director-agent.ts
const getPromptRefinements = async (chapter, scene) => {
  const sql = neon(process.env.NEON_DATABASE_URL);
  
  // Get thumbs_down prompts to avoid
  const badPrompts = await sql`
    SELECT prompt_used, COUNT(*) as dislike_count
    FROM feedback_rounds
    WHERE chapter = ${chapter} AND scene = ${scene} AND feedback_type = 'thumbs_down'
    GROUP BY prompt_used
    ORDER BY dislike_count DESC
    LIMIT 5
  `;
  
  // Get thumbs_up prompts to reinforce
  const goodPrompts = await sql`
    SELECT prompt_used, COUNT(*) as like_count
    FROM feedback_rounds
    WHERE chapter = ${chapter} AND scene = ${scene} AND feedback_type = 'thumbs_up'
    GROUP BY prompt_used
    ORDER BY like_count DESC
    LIMIT 5
  `;
  
  return {
    avoid: badPrompts.map(p => p.prompt_used),
    reinforce: goodPrompts.map(p => p.prompt_used)
  };
};
```

---

## 6. IPAD 9TH GENERATION OPTIMIZATION

### Screen Specifications

| Attribute | Value |
|-----------|-------|
| **Screen Size** | 10.2 inches |
| **Resolution** | 2160 x 1620 pixels |
| **Aspect Ratio** | 4:3 |
| **PPI** | 264 |

### CSS for iPad 9th Gen

```css
/* iPad 9th Generation (10.2") */
@media only screen 
  and (min-device-width: 810px) 
  and (max-device-width: 1080px)
  and (-webkit-min-device-pixel-ratio: 2) {
  
  /* Touch targets minimum 48px */
  .btn, .choice-btn, .mood-btn {
    min-height: 48px;
    min-width: 48px;
    padding: 12px 24px;
  }
  
  /* Scene images fit 4:3 aspect */
  .scene-image {
    width: 100%;
    max-width: 1080px;
    aspect-ratio: 16/9;
    object-fit: cover;
  }
  
  /* Text readable at arm's length */
  .story-text {
    font-size: 24px;
    line-height: 1.6;
  }
  
  /* Virtue badges visible */
  .virtue-badge {
    font-size: 18px;
    padding: 8px 16px;
  }
}
```

### Image Generation for iPad

When generating DALL-E images, use:

```javascript
const IPAD_OPTIMIZED_SETTINGS = {
  size: '1792x1024',  // HD landscape (fits 4:3 with letterbox)
  quality: 'hd',
  style: 'vivid'
};
```

---

## 7. COST TRACKING DURING TESTING

### Expected Testing Costs

| Phase | API Calls | Estimated Cost |
|-------|-----------|----------------|
| **Character Consistency Testing** | 20-50 DALL-E images | $0.80 - $2.00 |
| **Voice Line Testing** | 100-200 ElevenLabs chars | $0.01 - $0.03 |
| **Prompt Refinement** | 10-20 GPT-4 calls | $0.30 - $0.60 |
| **Full Chapter Test** | 8 scenes complete | ~$0.65 |
| **Total Testing Budget** | | **~$5-10** |

### Cost Tracking in Neon

```sql
-- View total costs by agent
SELECT 
  agent_name,
  COUNT(*) as runs,
  SUM(cost_usd) as total_cost,
  AVG(duration_ms) as avg_duration
FROM pipeline_runs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY agent_name
ORDER BY total_cost DESC;

-- View costs by session (for billing)
SELECT 
  session_id,
  SUM(cost_usd) as session_cost,
  COUNT(DISTINCT agent_name) as agents_used
FROM pipeline_runs
GROUP BY session_id
ORDER BY session_cost DESC
LIMIT 10;
```

### Telemetry Function

```javascript
// netlify/functions/lib/telemetry.ts
import { neon } from '@neondatabase/serverless';

export const logAgentRun = async (sessionId, agentName, durationMs, costUsd, success, errorMessage = null) => {
  const sql = neon(process.env.NEON_DATABASE_URL);
  
  await sql`
    INSERT INTO pipeline_runs (session_id, agent_name, duration_ms, cost_usd, success, error_message)
    VALUES (${sessionId}, ${agentName}, ${durationMs}, ${costUsd}, ${success}, ${errorMessage})
  `;
};

export const getSessionCost = async (sessionId) => {
  const sql = neon(process.env.NEON_DATABASE_URL);
  
  const result = await sql`
    SELECT SUM(cost_usd) as total_cost
    FROM pipeline_runs
    WHERE session_id = ${sessionId}
  `;
  
  return result[0]?.total_cost || 0;
};
```

---

## 🔑 QUICK SETUP CHECKLIST

### For Gramps (Before Book003.5)

- [ ] **Rotate exposed API keys** (OpenAI, ElevenLabs, Gemini, Netlify)
- [ ] **Create Neon account** at https://neon.tech
- [ ] **Create `sirjames-adventures` database**
- [ ] **Run SQL schema** (Section 3, Step 4)
- [ ] **Add `NEON_DATABASE_URL`** to Netlify
- [ ] **Add `GEMINI_API_KEY`** to Netlify (new rotated key)
- [ ] **Verify all keys** with `env-smoke.js` function

### Netlify Dashboard Path

```
app.netlify.com
└── Sites
    └── sirjames-book002-final (or book003)
        └── Site configuration
            └── Environment variables
                └── Add variable
```

---

## 📊 COMMONS GOOD ATTRIBUTION

The Neon database enables **transparent attribution** per Commons Good principles:

| Principle | Database Implementation |
|-----------|------------------------|
| **Transparency** | `pipeline_runs` table logs all costs |
| **Attribution** | `feedback_rounds` credits parent input |
| **Learning** | `parent_inputs` feeds D2A refinement |
| **Privacy** | `child_id` is anonymous session token |

---

**For the Commons Good!** 🏰⚔️🐕✨

*This guide ensures consistent environment setup across all Sir James Adventure projects.*
