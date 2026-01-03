# 🚀 PRODUCTION DEPLOYMENT CHECKLIST - Book003 Parents Dashboard
## Enterprise-Grade U2A Interactive Dashboard

> **Version:** 1.0  
> **Date:** January 3, 2026  
> **Target:** Production-ready deployment with Gemini API integration  
> **Site:** sirjames-book003.netlify.app (or existing sirjames-book002-final)

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### 1. NETLIFY ENVIRONMENT VARIABLES (Required)

Go to: **Netlify Dashboard → Site Settings → Environment Variables**

| Variable | Value | Scope | Status |
|----------|-------|-------|--------|
| `GEMINI_API_KEY` | `AIzaSyD2A0y6Me8F6FWRQNzkshSkcsz-QrAWYYo` | Functions | ⬜ Add |
| `OPENAI_API_KEY` | (your key) | Functions | ✅ Already set |
| `ELEVENLABS_API_KEY` | (your key) | Functions | ✅ Already set |
| `NEON_DATABASE_URL` | (from Neon dashboard) | Functions | ⬜ Add |
| `U2A_ENABLED` | `true` | All | ⬜ Add |
| `FEEDBACK_LOOP` | `enabled` | All | ⬜ Add |
| `BOOK_VERSION` | `BOOK003` | All | ⬜ Add |

### 2. VOICE IDs (Already Set - Verify)

| Variable | Value | Purpose |
|----------|-------|---------|
| `VOICEID_SIR_JAMES` | `SOYHLrjzK2X1ezoPC6cr` | Harry (young boy) |
| `VOICEID_NARRATOR` | `XrExE9yKIg1WjnnlVkGX` | Matilda (female) |
| `VOICEID_GRAMPS` | `pqHfZKP75CvOlQylNhV4` | Bill (elderly male) |
| `VOICEID_KING_ARTHUR` | `JBFqnCBsd6RMkjVDRZzb` | George (British) |

---

## 🔧 STEP-BY-STEP NETLIFY SETUP

### Step 1: Add GEMINI_API_KEY

1. Go to: https://app.netlify.com/sites/sirjames-book002-final/settings/env
2. Click **Add a variable**
3. Enter:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `AIzaSyD2A0y6Me8F6FWRQNzkshSkcsz-QrAWYYo`
4. **Scopes:** Select `Functions`
5. **Deploy contexts:** All (Production, Deploy Previews, Branch deploys, Local dev)
6. Click **Create variable**

### Step 2: Add U2A_ENABLED

1. Click **Add a variable**
2. Enter:
   - **Key:** `U2A_ENABLED`
   - **Value:** `true`
3. **Scopes:** Select `All scopes`
4. Click **Create variable**

### Step 3: Add FEEDBACK_LOOP

1. Click **Add a variable**
2. Enter:
   - **Key:** `FEEDBACK_LOOP`
   - **Value:** `enabled`
3. **Scopes:** Select `All scopes`
4. Click **Create variable**

### Step 4: Add BOOK_VERSION

1. Click **Add a variable**
2. Enter:
   - **Key:** `BOOK_VERSION`
   - **Value:** `BOOK003`
3. **Scopes:** Select `All scopes`
4. Click **Create variable**

---

## 🗄️ NEON DATABASE SETUP (For Attribution Tracking)

### Step 1: Create Neon Account
1. Go to: https://neon.tech
2. Sign up with GitHub or email
3. Create project: `sirjames-adventures`

### Step 2: Get Connection String
After creating project, copy the connection string:
```
postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Step 3: Add to Netlify
1. In Netlify, add variable:
   - **Key:** `NEON_DATABASE_URL`
   - **Value:** (paste connection string)
   - **Scope:** Functions

### Step 4: Run Database Schema
In Neon SQL Editor, run the schema from `U2A_PARENTS_DASHBOARD_ENGINEERING_GUIDE.md` Section 5.2:

```sql
-- Core tables for Parents Dashboard
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  age INTEGER CHECK (age >= 3 AND age <= 12),
  reading_level VARCHAR(50) DEFAULT 'Emergent',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE virtues (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  emoji VARCHAR(10),
  description TEXT
);

INSERT INTO virtues (name, emoji, description) VALUES
('courage', '💎', 'Bravery in facing fears'),
('kindness', '❤️', 'Showing care for others'),
('honesty', '⭐', 'Telling the truth'),
('trust', '🤝', 'Building reliable relationships'),
('wisdom', '🥇', 'Making thoughtful decisions');

CREATE TABLE virtue_progress (
  id SERIAL PRIMARY KEY,
  child_id UUID REFERENCES children(id),
  virtue_id INTEGER REFERENCES virtues(id),
  points INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(child_id, virtue_id)
);

CREATE TABLE knighthood (
  id SERIAL PRIMARY KEY,
  child_id UUID REFERENCES children(id) UNIQUE,
  level VARCHAR(50) DEFAULT 'Page',
  points INTEGER DEFAULT 0,
  achieved_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE feedback_rounds (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  book VARCHAR(20) NOT NULL,
  chapter INT NOT NULL,
  scene INT NOT NULL,
  feedback_type VARCHAR(10) CHECK (feedback_type IN ('thumbs_up', 'thumbs_down')),
  prompt_used TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pipeline_runs (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  agent_name VARCHAR(50) NOT NULL,
  duration_ms INT,
  cost_usd DECIMAL(10,4),
  success BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_feedback_session ON feedback_rounds(session_id);
CREATE INDEX idx_virtue_child ON virtue_progress(child_id);
CREATE INDEX idx_pipeline_session ON pipeline_runs(session_id);
```

---

## 🎯 API ENDPOINTS (Sequential Order)

Based on the U2A Engineering Guide, the Parents Dashboard uses this **6-phase API sequence**:

| Phase | Endpoint | Cost | Purpose |
|-------|----------|------|---------|
| 1 | `POST /api/v1/session/init` | FREE | Load child profile, virtues, knighthood |
| 2 | `POST /api/v1/analyze-mood` | FREE | Parse mood, suggest themes |
| 3 | `POST /api/v1/curate-chapters` | ~$0.65 | **Click2Kick** - Generate story |
| 4 | `GET /api/v1/story/:storyId` | FREE | Retrieve story for playback |
| 5 | `POST /api/v1/submit-evaluation` | FREE | Parent feedback (thumbs up/down) |
| 6 | `GET /api/v1/metrics/:childId` | FREE | Get virtue/knighthood metrics |

### Gemini Integration Points

The `GEMINI_API_KEY` is used in:

1. **Director Agent** - Story planning and scene selection
2. **Mood Analyzer** - Enhanced mood analysis with context
3. **D2A Learning** - Document-to-Agent prompt refinement

```javascript
// Example: Director Agent using Gemini
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const result = await model.generateContent({
  contents: [{
    role: 'user',
    parts: [{
      text: `Plan a Sir James adventure story for a ${mood} child...`
    }]
  }]
});
```

---

## 🖥️ IPAD 9TH GENERATION OPTIMIZATION

The Parents Dashboard is optimized for iPad 9th Gen (10.2" screen):

| Requirement | Implementation |
|-------------|----------------|
| **Touch targets** | Minimum 48px × 48px |
| **Font size** | 24px for story text |
| **Image aspect** | 16:9 (1792×1024 DALL-E HD) |
| **Viewport** | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |

### CSS Media Query
```css
@media only screen 
  and (min-device-width: 810px) 
  and (max-device-width: 1080px)
  and (-webkit-min-device-pixel-ratio: 2) {
  .btn, .choice-btn { min-height: 48px; min-width: 48px; }
  .story-text { font-size: 24px; line-height: 1.6; }
}
```

---

## 💰 COST TRACKING

### Per-Story Generation (~$0.65)

| Agent | API | Cost |
|-------|-----|------|
| Director | GPT-4 / Gemini | $0.03 |
| Writer | GPT-4 | $0.05 |
| Voice | ElevenLabs | $0.15 |
| Music | Suno | $0.10 |
| Images | DALL-E 3 HD | $0.32 |
| **Total** | | **~$0.65** |

### Testing Budget

| Phase | Estimated Cost |
|-------|----------------|
| Character consistency testing | $2-5 |
| Voice line testing | $0.50-1 |
| Full chapter test | $0.65 |
| **Total testing budget** | **~$5-10** |

---

## ✅ DEPLOYMENT VERIFICATION

### After Setting Environment Variables:

1. **Trigger a new deploy** in Netlify (or push a commit)

2. **Verify env-smoke endpoint:**
   ```
   https://sirjames-book002-final.netlify.app/.netlify/functions/env-smoke
   ```
   
   Expected response:
   ```json
   {
     "OPENAI_API_KEY": true,
     "ELEVENLABS_API_KEY": true,
     "GEMINI_API_KEY": true,
     "NEON_DATABASE_URL": true,
     "U2A_ENABLED": true
   }
   ```

3. **Test session init:**
   ```bash
   curl -X POST https://sirjames-book002-final.netlify.app/api/v1/session/init \
     -H "Content-Type: application/json" \
     -d '{"childId": "demo-child"}'
   ```

4. **Test on iPad 9th Gen:**
   - Open Safari on iPad
   - Navigate to dashboard URL
   - Verify 48px touch targets
   - Test mood selection flow

---

## 🔄 A2A FEEDBACK LOOP

The Parents Dashboard implements a **learning loop**:

```
Parent Input (mood, situation)
        ↓
    Mood Analyzer
        ↓
    Theme Suggestions
        ↓
    Click2Kick (Story Generation)
        ↓
    Story Playback
        ↓
    Parent Feedback (👍/👎)
        ↓
    Store in Neon DB
        ↓
    Next Story → Director queries past feedback
        ↓
    Avoid bad prompts, reinforce good ones
```

### Thumbs Up/Down Attribution

```javascript
// When parent gives feedback
await fetch('/api/v1/submit-evaluation', {
  method: 'POST',
  body: JSON.stringify({
    sessionId: 'sess_123',
    storyId: 'story_456',
    feedbackType: 'thumbs_up', // or 'thumbs_down'
    promptUsed: 'Sir James faces his fear of the dark cave...',
    engagement: {
      childLaughed: true,
      askedQuestions: true,
      wantedMore: true
    }
  })
});
```

---

## 📊 COMMONS GOOD METRICS

The Parents Dashboard tracks these Commons Good metrics:

| Metric | Table | Purpose |
|--------|-------|---------|
| **Cost per story** | `pipeline_runs` | Transparency |
| **Parent feedback** | `feedback_rounds` | Attribution |
| **Virtue progress** | `virtue_progress` | Learning outcomes |
| **Knighthood levels** | `knighthood` | Gamification |

### Dashboard Displays:
- 💎 Courage, ❤️ Kindness, ⭐ Honesty, 🤝 Trust, 🥇 Wisdom
- 🛡️ Page → ⚔️ Squire → 🏰 Knight → 👑 Champion → ✨ Legend
- 📚 Words Learned, ✏️ Spelling Accuracy, 🎯 Self-Read Ratio

---

## 🚀 FINAL DEPLOYMENT STEPS

### For Gramps (Before Going Live):

- [ ] **Add GEMINI_API_KEY to Netlify** (see Step 1 above)
- [ ] **Add U2A_ENABLED, FEEDBACK_LOOP, BOOK_VERSION** (see Steps 2-4)
- [ ] **Create Neon database** and add NEON_DATABASE_URL
- [ ] **Run database schema** in Neon SQL Editor
- [ ] **Trigger new deploy** in Netlify
- [ ] **Verify env-smoke** returns all `true`
- [ ] **Test on iPad 9th Gen** with Safari
- [ ] **Run first story generation** to verify costs

### After Deployment:

- [ ] Monitor costs in Neon `pipeline_runs` table
- [ ] Review parent feedback in `feedback_rounds` table
- [ ] Track virtue progress in `virtue_progress` table
- [ ] Celebrate! 🎉

---

## 🎯 EXPECTED FINAL OUTCOME

When deployment is complete, parents will be able to:

1. **Open Parents Dashboard** on iPad or browser
2. **Select child's mood** (😊😢😰😠🤩😤)
3. **Describe situation** (optional text input)
4. **Choose theme** (Courage Quest, Kindness Kingdom, etc.)
5. **Click2Kick** → Watch agent progress in real-time
6. **Play story** with child
7. **Give feedback** (thumbs up/down)
8. **View metrics** (virtues, knighthood, literacy)

The system learns from each interaction, improving story generation over time.

---

**For the Commons Good!** 🏰⚔️🐕✨

*This checklist ensures production-ready deployment of the U2A Parents Dashboard with proper Gemini API integration and Neon database attribution tracking.*
