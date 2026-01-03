# 🏰 U2A PARENTS DASHBOARD ENGINEERING GUIDE
## Frontend → Middleware → Backend in Sequential Order

> **Version:** 1.0  
> **Date:** January 2, 2026  
> **Architecture:** U2A (User-to-Agent) + A2A (Agent-to-Agent) + D2A (Doc-to-Agent)  
> **Battle Cry:** For the Commons Good! 🏰⚔️🐕✨

---

## 📋 TABLE OF CONTENTS

1. [Architecture Overview](#1-architecture-overview)
2. [API Sequential Order](#2-api-sequential-order)
3. [FRONTEND Engineering](#3-frontend-engineering)
4. [MIDDLEWARE Engineering](#4-middleware-engineering)
5. [BACKEND Engineering](#5-backend-engineering)
6. [Scene Card Metrics Schema](#6-scene-card-metrics-schema)
7. [Click2Kick Pipeline](#7-click2kick-pipeline)
8. [RED→GREEN Task Checklist](#8-redgreen-task-checklist)

---

## 1. ARCHITECTURE OVERVIEW

### The Complete U2A Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PARENTS DASHBOARD (U2A)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Mood Input  │→ │Theme Select │→ │ Click2Kick  │→ │ Metrics Dashboard   │ │
│  │ 😊😢😰😠🤩😤│  │ 💎❤️🤝⭐   │  │    ⚔️       │  │ Virtues|Knighthood │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ POST /api/v1/curate-chapters
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MIDDLEWARE (U2A Protocol Engine)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │Request Parser│→ │Context Mgr   │→ │Tool Registry │→ │Agent Coordinator│ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ Agent Loop: gather → action → verify → repeat
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AGENT LAYER (A2A Pipeline)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Director │→ │  Writer  │→ │  Voice   │→ │  Music   │→ │Editor→Publish│  │
│  │  Agent   │  │  Agent   │  │  Agent   │  │  Agent   │  │   Agents     │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER (PostgreSQL + Redis)                    │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐ │
│  │ Children  │  │  Stories  │  │  Virtues  │  │ Scene     │  │ Feedback  │ │
│  │ Profiles  │  │  Content  │  │  Progress │  │ Metrics   │  │ Learning  │ │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Innovation: Scene Card Metrics

Based on Chapters 6-10 literacy structure, every scene produces a **Scene Card**:

```json
{
  "story_fields": {
    "chapter": 6,
    "scene": 1,
    "scene_title": "Fork in the River",
    "setting": "River splits into three shimmering channels",
    "characters": ["Sir James", "Claude", "Sparky", "Gramps"]
  },
  "literacy_fields": {
    "reading_level_band": "Early → Developing",
    "focus_skill": "CVC word families, direction words",
    "target_words": ["cat", "bat", "hat", "log", "fog", "dog", "up", "down"],
    "spelling_task_type": "choose-letters"
  },
  "interaction_metrics": {
    "word_recognition": { "attempts": 0, "correct_first_try": 0, "hints_used": 0 },
    "spelling_attempts": { "per_word": {}, "keyboard_used": false },
    "auto_read_vs_self_read_ratio": 0.0,
    "dashboard_actions": []
  }
}
```

---

## 2. API SEQUENTIAL ORDER

### The Correct Order for U2A Protocol

```
PHASE 1: SESSION INITIALIZATION (FREE - No AI)
──────────────────────────────────────────────
POST /api/v1/session/init
├── Load child profile from database
├── Load previous virtue scores
├── Load knighthood level
├── Create session context
└── Return: sessionId, childProfile, context

PHASE 2: MOOD ANALYSIS (FREE - Client-side)
──────────────────────────────────────────────
POST /api/v1/analyze-mood
├── Parse parent's mood selection + situation text
├── Extract keywords for theme matching
├── Generate suggested themes (client-side logic)
└── Return: suggestedThemes[], moodAnalysis

PHASE 3: STORY GENERATION (Click2Kick) - ~$0.65
──────────────────────────────────────────────
POST /api/v1/curate-chapters
├── Director Agent (GPT-4) → $0.03
│   ├── Input: mood, theme, child profile, virtue focus
│   └── Output: story plan, scene order, virtue opportunities
│
├── Writer Agent (GPT-4) → $0.05
│   ├── Input: story plan, character bible
│   └── Output: narrative text, dialogue, choices
│
├── PARALLEL EXECUTION:
│   ├── Voice Agent (ElevenLabs) → $0.15
│   │   └── Output: narration audio URLs
│   │
│   └── Music Agent (Suno) → $0.10
│       └── Output: background music URL
│
├── Editor Agent (Local) → FREE
│   ├── Check character consistency
│   ├── Validate virtue points
│   └── Normalize audio levels
│
└── Publisher Agent (Local) → FREE
    ├── Generate HTML scenes
    ├── Wire audio/images
    └── Return: storyPackage

PHASE 4: STORY PLAYBACK & METRICS (FREE)
──────────────────────────────────────────────
GET /api/v1/story/:storyId
├── Return story package for playback
├── WebSocket: real-time scene progress
└── Log interaction metrics per scene

PHASE 5: FEEDBACK LOOP (FREE)
──────────────────────────────────────────────
POST /api/v1/submit-evaluation
├── Parent rating (1-5 stars)
├── Engagement indicators
├── Scene-level metrics
├── Update learning profile
└── Return: recommendations, insights

PHASE 6: METRICS RETRIEVAL (FREE)
──────────────────────────────────────────────
GET /api/v1/metrics/:childId
├── Virtue progress (all 8 virtues)
├── Knighthood level + points
├── Scene card summaries
├── Reading level progression
└── Parent dashboard aggregates
```

---

## 3. FRONTEND ENGINEERING

### 3.1 File Structure

```
public-book003/
├── parent-dashboard.html          # Main U2A interface
├── assets/
│   ├── css/
│   │   ├── dashboard.css          # Dashboard styling
│   │   └── scene-cards.css        # Scene card components
│   ├── js/
│   │   ├── u2a-client.js          # U2A Protocol client
│   │   ├── mood-analyzer.js       # Client-side mood analysis
│   │   ├── scene-engine.js        # Story playback engine
│   │   ├── metrics-display.js     # Charts and visualizations
│   │   └── websocket-manager.js   # Real-time updates
│   └── images/
│       └── icons/                 # UI icons
└── story-player/
    └── player.html                # Child-facing story player
```

### 3.2 Parents Dashboard HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sir James Adventures - Parents Dashboard</title>
  <link rel="stylesheet" href="assets/css/dashboard.css">
</head>
<body>
  <div class="dashboard-container">
    
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- HEADER: Child Profile & Knighthood Status -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <header class="dashboard-header">
      <div class="child-profile">
        <img id="childAvatar" src="assets/images/default-avatar.png" alt="Child Avatar">
        <div class="child-info">
          <h1 id="childName">Sir James</h1>
          <div class="knighthood-badge" id="knighthoodBadge">
            <span class="badge-icon">🛡️</span>
            <span class="badge-text">Page</span>
            <span class="badge-points">0 pts</span>
          </div>
        </div>
      </div>
      <div class="session-status">
        <span class="status-indicator online"></span>
        <span id="sessionId">Session: --</span>
      </div>
    </header>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- SECTION 1: Mood Analysis Input (U2A Entry Point) -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <section class="dashboard-section" id="moodSection">
      <h2>📝 How is your child feeling today?</h2>
      
      <div class="mood-selector">
        <button class="mood-btn" data-mood="happy" data-emoji="😊">
          <span class="emoji">😊</span>
          <span class="label">Happy</span>
        </button>
        <button class="mood-btn" data-mood="sad" data-emoji="😢">
          <span class="emoji">😢</span>
          <span class="label">Sad</span>
        </button>
        <button class="mood-btn" data-mood="anxious" data-emoji="😰">
          <span class="emoji">😰</span>
          <span class="label">Anxious</span>
        </button>
        <button class="mood-btn" data-mood="angry" data-emoji="😠">
          <span class="emoji">😠</span>
          <span class="label">Angry</span>
        </button>
        <button class="mood-btn" data-mood="excited" data-emoji="🤩">
          <span class="emoji">🤩</span>
          <span class="label">Excited</span>
        </button>
        <button class="mood-btn" data-mood="frustrated" data-emoji="😤">
          <span class="emoji">😤</span>
          <span class="label">Frustrated</span>
        </button>
      </div>
      
      <div class="situation-input">
        <label for="situationContext">Describe the situation (optional):</label>
        <textarea 
          id="situationContext" 
          placeholder="e.g., My child is nervous about starting school tomorrow..."
          rows="3"
        ></textarea>
        <div class="char-count"><span id="charCount">0</span>/500</div>
      </div>
      
      <div class="ai-suggestions" id="aiSuggestions">
        <!-- Populated by mood-analyzer.js -->
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- SECTION 2: Theme Selection (AI-Suggested) -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <section class="dashboard-section hidden" id="themeSection">
      <h2>🎯 Recommended Story Themes</h2>
      
      <div class="theme-cards">
        <div class="theme-card" data-theme="courage-quest" data-virtue="courage">
          <div class="theme-icon">💎</div>
          <h3>Courage Quest</h3>
          <p>Sir James learns to face his fears bravely</p>
          <div class="virtue-badge courage">Courage</div>
          <div class="literacy-info">
            <span class="reading-level">Early → Developing</span>
            <span class="word-count">15 target words</span>
          </div>
        </div>
        
        <div class="theme-card" data-theme="kindness-kingdom" data-virtue="kindness">
          <div class="theme-icon">❤️</div>
          <h3>Kindness Kingdom</h3>
          <p>Helping others throughout the land</p>
          <div class="virtue-badge kindness">Kindness</div>
          <div class="literacy-info">
            <span class="reading-level">Developing</span>
            <span class="word-count">12 target words</span>
          </div>
        </div>
        
        <div class="theme-card" data-theme="trust-bridge" data-virtue="trust">
          <div class="theme-icon">🤝</div>
          <h3>Trust Bridge</h3>
          <p>Building friendship and cooperation</p>
          <div class="virtue-badge trust">Trust</div>
          <div class="literacy-info">
            <span class="reading-level">Developing → Bridge</span>
            <span class="word-count">18 target words</span>
          </div>
        </div>
        
        <div class="theme-card" data-theme="honesty-harbor" data-virtue="honesty">
          <div class="theme-icon">⭐</div>
          <h3>Honesty Harbor</h3>
          <p>The power of telling the truth</p>
          <div class="virtue-badge honesty">Honesty</div>
          <div class="literacy-info">
            <span class="reading-level">Bridge-to-Fluency</span>
            <span class="word-count">20 target words</span>
          </div>
        </div>
      </div>
      
      <!-- Parent Chat Input (Custom Guidance) -->
      <div class="parent-chat-input">
        <label for="parentGuidance">💬 Add your own guidance (optional):</label>
        <textarea 
          id="parentGuidance" 
          placeholder="e.g., Include a scene about sharing toys with siblings..."
          rows="2"
        ></textarea>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- SECTION 3: Click2Kick Button (Agentic Trigger) -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <section class="dashboard-section hidden" id="click2kickSection">
      <div class="generation-preview">
        <h2>📊 Story Preview</h2>
        <div class="preview-stats">
          <div class="stat">
            <span class="stat-label">Theme</span>
            <span class="stat-value" id="previewTheme">--</span>
          </div>
          <div class="stat">
            <span class="stat-label">Virtue Focus</span>
            <span class="stat-value" id="previewVirtue">--</span>
          </div>
          <div class="stat">
            <span class="stat-label">Estimated Time</span>
            <span class="stat-value" id="previewTime">~2 min</span>
          </div>
          <div class="stat">
            <span class="stat-label">Est. Cost</span>
            <span class="stat-value" id="previewCost">$0.65</span>
          </div>
        </div>
      </div>
      
      <button id="click2kickBtn" class="click2kick-btn">
        <span class="btn-icon">⚔️</span>
        <span class="btn-text">Generate Sir James Adventure</span>
        <span class="btn-subtitle">Personalized for your child</span>
      </button>
      
      <!-- Agent Progress (Real-time WebSocket) -->
      <div class="agent-progress hidden" id="agentProgress">
        <div class="progress-bar">
          <div class="progress-fill" id="progressFill"></div>
        </div>
        <div class="progress-text" id="progressText">Preparing your story...</div>
        
        <div class="agent-steps">
          <div class="agent-step" data-agent="director">
            <span class="agent-icon">🎬</span>
            <span class="agent-name">Director</span>
            <span class="agent-status">Waiting...</span>
          </div>
          <div class="agent-step" data-agent="writer">
            <span class="agent-icon">✍️</span>
            <span class="agent-name">Writer</span>
            <span class="agent-status">Waiting...</span>
          </div>
          <div class="agent-step" data-agent="voice">
            <span class="agent-icon">🎙️</span>
            <span class="agent-name">Voice</span>
            <span class="agent-status">Waiting...</span>
          </div>
          <div class="agent-step" data-agent="music">
            <span class="agent-icon">🎵</span>
            <span class="agent-name">Music</span>
            <span class="agent-status">Waiting...</span>
          </div>
          <div class="agent-step" data-agent="editor">
            <span class="agent-icon">🎞️</span>
            <span class="agent-name">Editor</span>
            <span class="agent-status">Waiting...</span>
          </div>
          <div class="agent-step" data-agent="publisher">
            <span class="agent-icon">🚀</span>
            <span class="agent-name">Publisher</span>
            <span class="agent-status">Waiting...</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- SECTION 4: Story Player (After Generation) -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <section class="dashboard-section hidden" id="storyPlayerSection">
      <h2>📖 Story Ready!</h2>
      
      <div class="story-player">
        <div class="story-cover" id="storyCover">
          <!-- Cover image dynamically loaded -->
        </div>
        <div class="story-controls">
          <button id="playStoryBtn" class="play-btn">
            <span>▶️</span> Play Story
          </button>
          <button id="sendToChildBtn" class="send-btn">
            <span>📱</span> Send to Child's Device
          </button>
        </div>
      </div>
      
      <!-- Scene Cards Preview -->
      <div class="scene-cards-preview" id="sceneCardsPreview">
        <h3>📋 Scene Cards</h3>
        <div class="scene-cards-container" id="sceneCardsContainer">
          <!-- Populated by JavaScript -->
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- SECTION 5: Metrics Dashboard -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <section class="dashboard-section" id="metricsSection">
      <h2>📊 Learning Progress</h2>
      
      <!-- Virtue Progress -->
      <div class="metrics-panel virtues-panel">
        <h3>🏅 Virtue Development</h3>
        <div class="virtue-bars">
          <div class="virtue-bar" data-virtue="courage">
            <span class="virtue-label">💎 Courage</span>
            <div class="bar-container">
              <div class="bar-fill" id="courageBar" style="width: 0%"></div>
            </div>
            <span class="virtue-count" id="courageCount">0</span>
          </div>
          <div class="virtue-bar" data-virtue="kindness">
            <span class="virtue-label">❤️ Kindness</span>
            <div class="bar-container">
              <div class="bar-fill" id="kindnessBar" style="width: 0%"></div>
            </div>
            <span class="virtue-count" id="kindnessCount">0</span>
          </div>
          <div class="virtue-bar" data-virtue="honesty">
            <span class="virtue-label">⭐ Honesty</span>
            <div class="bar-container">
              <div class="bar-fill" id="honestyBar" style="width: 0%"></div>
            </div>
            <span class="virtue-count" id="honestyCount">0</span>
          </div>
          <div class="virtue-bar" data-virtue="trust">
            <span class="virtue-label">🤝 Trust</span>
            <div class="bar-container">
              <div class="bar-fill" id="trustBar" style="width: 0%"></div>
            </div>
            <span class="virtue-count" id="trustCount">0</span>
          </div>
          <div class="virtue-bar" data-virtue="wisdom">
            <span class="virtue-label">🥇 Wisdom</span>
            <div class="bar-container">
              <div class="bar-fill" id="wisdomBar" style="width: 0%"></div>
            </div>
            <span class="virtue-count" id="wisdomCount">0</span>
          </div>
        </div>
      </div>
      
      <!-- Knighthood Progression -->
      <div class="metrics-panel knighthood-panel">
        <h3>⚔️ Knighthood Journey</h3>
        <div class="knighthood-levels">
          <div class="level" data-level="page">
            <span class="level-icon">🛡️</span>
            <span class="level-name">Page</span>
            <span class="level-range">0-99 pts</span>
          </div>
          <div class="level" data-level="squire">
            <span class="level-icon">⚔️</span>
            <span class="level-name">Squire</span>
            <span class="level-range">100-299 pts</span>
          </div>
          <div class="level" data-level="knight">
            <span class="level-icon">🏰</span>
            <span class="level-name">Knight</span>
            <span class="level-range">300-599 pts</span>
          </div>
          <div class="level" data-level="champion">
            <span class="level-icon">👑</span>
            <span class="level-name">Champion</span>
            <span class="level-range">600-999 pts</span>
          </div>
          <div class="level" data-level="legend">
            <span class="level-icon">✨</span>
            <span class="level-name">Legend</span>
            <span class="level-range">1000+ pts</span>
          </div>
        </div>
        <div class="knighthood-progress">
          <div class="progress-bar">
            <div class="progress-fill" id="knighthoodProgress" style="width: 0%"></div>
          </div>
          <span class="progress-text" id="knighthoodText">0 / 100 points to Squire</span>
        </div>
      </div>
      
      <!-- Literacy Metrics (from Scene Cards) -->
      <div class="metrics-panel literacy-panel">
        <h3>📚 Reading Progress</h3>
        <div class="literacy-stats">
          <div class="stat-card">
            <span class="stat-icon">📖</span>
            <span class="stat-value" id="wordsLearned">0</span>
            <span class="stat-label">Words Learned</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon">✏️</span>
            <span class="stat-value" id="spellingAccuracy">0%</span>
            <span class="stat-label">Spelling Accuracy</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon">🎯</span>
            <span class="stat-value" id="selfReadRatio">0%</span>
            <span class="stat-label">Self-Read Ratio</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon">📈</span>
            <span class="stat-value" id="readingLevel">Emergent</span>
            <span class="stat-label">Reading Level</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- SECTION 6: Feedback Form -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <section class="dashboard-section hidden" id="feedbackSection">
      <h2>💬 How was the story?</h2>
      
      <div class="feedback-form">
        <div class="rating-stars">
          <span class="star" data-rating="1">⭐</span>
          <span class="star" data-rating="2">⭐</span>
          <span class="star" data-rating="3">⭐</span>
          <span class="star" data-rating="4">⭐</span>
          <span class="star" data-rating="5">⭐</span>
        </div>
        
        <div class="engagement-checks">
          <label>
            <input type="checkbox" id="childLaughed"> 
            Child laughed or smiled
          </label>
          <label>
            <input type="checkbox" id="askedQuestions"> 
            Child asked questions
          </label>
          <label>
            <input type="checkbox" id="wantedMore"> 
            Child wanted more stories
          </label>
          <label>
            <input type="checkbox" id="usedNewWords"> 
            Child used new words
          </label>
        </div>
        
        <div class="feedback-buttons">
          <button class="feedback-btn positive" id="thumbsUp">👍 Helpful</button>
          <button class="feedback-btn negative" id="thumbsDown">👎 Needs Work</button>
        </div>
        
        <textarea 
          id="feedbackComment" 
          placeholder="Any additional comments..."
          rows="2"
        ></textarea>
        
        <button id="submitFeedbackBtn" class="submit-btn">Submit Feedback</button>
      </div>
      
      <!-- AI Recommendations -->
      <div class="ai-recommendations hidden" id="aiRecommendations">
        <h3>🤖 Recommendations for Next Story</h3>
        <ul id="recommendationsList">
          <!-- Populated by JavaScript -->
        </ul>
      </div>
    </section>
    
  </div>

  <!-- Scripts -->
  <script src="assets/js/u2a-client.js"></script>
  <script src="assets/js/mood-analyzer.js"></script>
  <script src="assets/js/scene-engine.js"></script>
  <script src="assets/js/metrics-display.js"></script>
  <script src="assets/js/websocket-manager.js"></script>
  <script src="assets/js/dashboard-main.js"></script>
</body>
</html>
```

### 3.3 U2A Client JavaScript

```javascript
// assets/js/u2a-client.js
// U2A Protocol Client - Handles all API communication

class SirJamesU2AClient {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
    this.sessionId = null;
    this.childId = null;
    this.context = {};
    this.ws = null;
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 1: SESSION INITIALIZATION
  // ═══════════════════════════════════════════════════════════════
  async initializeSession(childId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/session/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId })
      });
      
      if (!response.ok) throw new Error('Session initialization failed');
      
      const data = await response.json();
      this.sessionId = data.sessionId;
      this.childId = childId;
      this.context = data.context;
      
      // Connect WebSocket for real-time updates
      this.connectWebSocket();
      
      return data;
    } catch (error) {
      console.error('[U2A] Session init error:', error);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: MOOD ANALYSIS
  // ═══════════════════════════════════════════════════════════════
  async analyzeMood(mood, situationContext = '') {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/analyze-mood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          mood,
          situationContext
        })
      });
      
      if (!response.ok) throw new Error('Mood analysis failed');
      
      const data = await response.json();
      
      // Update context with mood analysis
      this.context.currentMood = mood;
      this.context.situationContext = situationContext;
      this.context.suggestedThemes = data.suggestedThemes;
      
      return data;
    } catch (error) {
      console.error('[U2A] Mood analysis error:', error);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 3: STORY GENERATION (Click2Kick)
  // ═══════════════════════════════════════════════════════════════
  async generateStory(theme, virtueFocus, parentGuidance = '') {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/curate-chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          childId: this.childId,
          theme,
          virtueFocus,
          parentGuidance,
          mood: this.context.currentMood,
          situationContext: this.context.situationContext,
          childProfile: this.context.childProfile
        })
      });
      
      if (!response.ok) throw new Error('Story generation failed');
      
      const data = await response.json();
      
      // Store current story
      this.context.currentStory = data.story;
      
      return data;
    } catch (error) {
      console.error('[U2A] Story generation error:', error);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 4: GET STORY
  // ═══════════════════════════════════════════════════════════════
  async getStory(storyId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/story/${storyId}`);
      
      if (!response.ok) throw new Error('Story fetch failed');
      
      return await response.json();
    } catch (error) {
      console.error('[U2A] Story fetch error:', error);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 5: SUBMIT FEEDBACK
  // ═══════════════════════════════════════════════════════════════
  async submitFeedback(feedbackData) {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/submit-evaluation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          storyId: this.context.currentStory?.storyId,
          ...feedbackData
        })
      });
      
      if (!response.ok) throw new Error('Feedback submission failed');
      
      return await response.json();
    } catch (error) {
      console.error('[U2A] Feedback error:', error);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 6: GET METRICS
  // ═══════════════════════════════════════════════════════════════
  async getMetrics() {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/metrics/${this.childId}`);
      
      if (!response.ok) throw new Error('Metrics fetch failed');
      
      return await response.json();
    } catch (error) {
      console.error('[U2A] Metrics error:', error);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // WEBSOCKET: REAL-TIME UPDATES
  // ═══════════════════════════════════════════════════════════════
  connectWebSocket() {
    const wsUrl = this.baseUrl.replace('http', 'ws') + '/ws';
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      console.log('[U2A] WebSocket connected');
      this.ws.send(JSON.stringify({ 
        type: 'subscribe', 
        sessionId: this.sessionId 
      }));
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleWebSocketMessage(data);
    };
    
    this.ws.onerror = (error) => {
      console.error('[U2A] WebSocket error:', error);
    };
    
    this.ws.onclose = () => {
      console.log('[U2A] WebSocket closed');
      // Reconnect after delay
      setTimeout(() => this.connectWebSocket(), 3000);
    };
  }

  handleWebSocketMessage(data) {
    switch (data.type) {
      case 'agent_progress':
        // Dispatch event for UI to handle
        window.dispatchEvent(new CustomEvent('agentProgress', { detail: data }));
        break;
      case 'story_complete':
        window.dispatchEvent(new CustomEvent('storyComplete', { detail: data }));
        break;
      case 'metrics_update':
        window.dispatchEvent(new CustomEvent('metricsUpdate', { detail: data }));
        break;
      default:
        console.log('[U2A] Unknown message type:', data.type);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SCENE METRICS: Log interaction data
  // ═══════════════════════════════════════════════════════════════
  async logSceneMetrics(sceneId, metrics) {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/scene-metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          storyId: this.context.currentStory?.storyId,
          sceneId,
          metrics
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('[U2A] Scene metrics error:', error);
      // Don't throw - metrics logging shouldn't break the experience
    }
  }
}

// Global instance
window.u2aClient = new SirJamesU2AClient();
```

### 3.4 Dashboard Main JavaScript

```javascript
// assets/js/dashboard-main.js
// Main Dashboard Controller

document.addEventListener('DOMContentLoaded', async () => {
  const client = window.u2aClient;
  
  // State
  let selectedMood = null;
  let selectedTheme = null;
  let currentRating = 0;
  
  // ═══════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════
  async function initialize() {
    // Get childId from URL or localStorage
    const childId = new URLSearchParams(window.location.search).get('childId') 
                   || localStorage.getItem('sj:childId') 
                   || 'demo-child';
    
    try {
      const sessionData = await client.initializeSession(childId);
      
      // Update UI with child profile
      updateChildProfile(sessionData.childProfile);
      updateKnighthoodBadge(sessionData.knighthood);
      updateMetricsDisplay(sessionData.metrics);
      
      // Show mood section
      showSection('moodSection');
      
    } catch (error) {
      console.error('Initialization failed:', error);
      showError('Failed to initialize session');
    }
  }
  
  // ═══════════════════════════════════════════════════════════════
  // MOOD SELECTION
  // ═══════════════════════════════════════════════════════════════
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      // Remove previous selection
      document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
      
      // Select this mood
      btn.classList.add('selected');
      selectedMood = btn.dataset.mood;
      
      // Get situation context
      const situationContext = document.getElementById('situationContext').value;
      
      try {
        // Analyze mood and get suggestions
        const result = await client.analyzeMood(selectedMood, situationContext);
        
        // Update AI suggestions
        updateAISuggestions(result.suggestedThemes);
        
        // Show theme section
        showSection('themeSection');
        
      } catch (error) {
        console.error('Mood analysis failed:', error);
      }
    });
  });
  
  // Character count for situation input
  document.getElementById('situationContext').addEventListener('input', (e) => {
    document.getElementById('charCount').textContent = e.target.value.length;
  });
  
  // ═══════════════════════════════════════════════════════════════
  // THEME SELECTION
  // ═══════════════════════════════════════════════════════════════
  document.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
      // Remove previous selection
      document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('selected'));
      
      // Select this theme
      card.classList.add('selected');
      selectedTheme = card.dataset.theme;
      
      // Update preview
      document.getElementById('previewTheme').textContent = card.querySelector('h3').textContent;
      document.getElementById('previewVirtue').textContent = card.dataset.virtue;
      
      // Show Click2Kick section
      showSection('click2kickSection');
    });
  });
  
  // ═══════════════════════════════════════════════════════════════
  // CLICK2KICK - STORY GENERATION
  // ═══════════════════════════════════════════════════════════════
  document.getElementById('click2kickBtn').addEventListener('click', async () => {
    if (!selectedTheme) {
      alert('Please select a theme first');
      return;
    }
    
    const btn = document.getElementById('click2kickBtn');
    btn.disabled = true;
    
    // Show progress
    document.getElementById('agentProgress').classList.remove('hidden');
    
    // Get parent guidance
    const parentGuidance = document.getElementById('parentGuidance')?.value || '';
    
    try {
      const result = await client.generateStory(
        selectedTheme,
        document.querySelector('.theme-card.selected')?.dataset.virtue || 'courage',
        parentGuidance
      );
      
      // Story complete - show player
      showStoryPlayer(result.story);
      
    } catch (error) {
      console.error('Story generation failed:', error);
      showError('Story generation failed. Please try again.');
    } finally {
      btn.disabled = false;
    }
  });
  
  // ═══════════════════════════════════════════════════════════════
  // WEBSOCKET EVENT HANDLERS
  // ═══════════════════════════════════════════════════════════════
  window.addEventListener('agentProgress', (e) => {
    const { agent, status, progress } = e.detail;
    
    // Update progress bar
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = status;
    
    // Update agent step
    const agentStep = document.querySelector(`[data-agent="${agent}"]`);
    if (agentStep) {
      agentStep.classList.add('active');
      agentStep.querySelector('.agent-status').textContent = status;
    }
  });
  
  window.addEventListener('storyComplete', (e) => {
    const { story } = e.detail;
    showStoryPlayer(story);
  });
  
  window.addEventListener('metricsUpdate', (e) => {
    updateMetricsDisplay(e.detail.metrics);
  });
  
  // ═══════════════════════════════════════════════════════════════
  // FEEDBACK SUBMISSION
  // ═══════════════════════════════════════════════════════════════
  document.querySelectorAll('.star').forEach((star, index) => {
    star.addEventListener('click', () => {
      currentRating = index + 1;
      document.querySelectorAll('.star').forEach((s, i) => {
        s.classList.toggle('selected', i < currentRating);
      });
    });
  });
  
  document.getElementById('submitFeedbackBtn').addEventListener('click', async () => {
    const feedbackData = {
      rating: currentRating,
      engagement: {
        childLaughed: document.getElementById('childLaughed').checked,
        askedQuestions: document.getElementById('askedQuestions').checked,
        wantedMore: document.getElementById('wantedMore').checked,
        usedNewWords: document.getElementById('usedNewWords').checked
      },
      comment: document.getElementById('feedbackComment').value
    };
    
    try {
      const result = await client.submitFeedback(feedbackData);
      
      // Show recommendations
      showRecommendations(result.recommendations);
      
      // Update metrics
      updateMetricsDisplay(result.updatedMetrics);
      
    } catch (error) {
      console.error('Feedback submission failed:', error);
    }
  });
  
  // ═══════════════════════════════════════════════════════════════
  // UI HELPER FUNCTIONS
  // ═══════════════════════════════════════════════════════════════
  function showSection(sectionId) {
    document.getElementById(sectionId).classList.remove('hidden');
  }
  
  function updateChildProfile(profile) {
    if (profile) {
      document.getElementById('childName').textContent = profile.name || 'Sir James';
      if (profile.avatarUrl) {
        document.getElementById('childAvatar').src = profile.avatarUrl;
      }
    }
  }
  
  function updateKnighthoodBadge(knighthood) {
    if (knighthood) {
      const badge = document.getElementById('knighthoodBadge');
      badge.querySelector('.badge-text').textContent = knighthood.level;
      badge.querySelector('.badge-points').textContent = `${knighthood.points} pts`;
    }
  }
  
  function updateMetricsDisplay(metrics) {
    if (!metrics) return;
    
    // Update virtue bars
    Object.entries(metrics.virtues || {}).forEach(([virtue, value]) => {
      const bar = document.getElementById(`${virtue}Bar`);
      const count = document.getElementById(`${virtue}Count`);
      if (bar) bar.style.width = `${Math.min(value, 100)}%`;
      if (count) count.textContent = value;
    });
    
    // Update literacy stats
    if (metrics.literacy) {
      document.getElementById('wordsLearned').textContent = metrics.literacy.wordsLearned || 0;
      document.getElementById('spellingAccuracy').textContent = `${metrics.literacy.spellingAccuracy || 0}%`;
      document.getElementById('selfReadRatio').textContent = `${metrics.literacy.selfReadRatio || 0}%`;
      document.getElementById('readingLevel').textContent = metrics.literacy.readingLevel || 'Emergent';
    }
    
    // Update knighthood progress
    if (metrics.knighthood) {
      const progress = (metrics.knighthood.points % 100) / 100 * 100;
      document.getElementById('knighthoodProgress').style.width = `${progress}%`;
      document.getElementById('knighthoodText').textContent = 
        `${metrics.knighthood.points} / ${metrics.knighthood.nextLevelPoints} points to ${metrics.knighthood.nextLevel}`;
    }
  }
  
  function updateAISuggestions(suggestions) {
    const container = document.getElementById('aiSuggestions');
    if (suggestions && suggestions.length > 0) {
      container.innerHTML = `
        <div class="suggestion-box">
          <h4>🤖 AI Suggests:</h4>
          <p>${suggestions[0].reason}</p>
        </div>
      `;
    }
  }
  
  function showStoryPlayer(story) {
    showSection('storyPlayerSection');
    document.getElementById('agentProgress').classList.add('hidden');
    
    // Set story cover
    if (story.coverUrl) {
      document.getElementById('storyCover').innerHTML = 
        `<img src="${story.coverUrl}" alt="Story Cover">`;
    }
    
    // Populate scene cards
    populateSceneCards(story.scenes);
    
    // Show feedback section
    showSection('feedbackSection');
  }
  
  function populateSceneCards(scenes) {
    const container = document.getElementById('sceneCardsContainer');
    container.innerHTML = scenes.map(scene => `
      <div class="scene-card-mini" data-scene="${scene.scene}">
        <div class="scene-header">
          <span class="scene-number">Scene ${scene.scene}</span>
          <span class="scene-title">${scene.scene_title}</span>
        </div>
        <div class="scene-literacy">
          <span class="reading-level">${scene.literacy_fields?.reading_level_band || 'N/A'}</span>
          <span class="word-count">${scene.literacy_fields?.target_words?.length || 0} words</span>
        </div>
      </div>
    `).join('');
  }
  
  function showRecommendations(recommendations) {
    const container = document.getElementById('aiRecommendations');
    const list = document.getElementById('recommendationsList');
    
    if (recommendations && recommendations.length > 0) {
      list.innerHTML = recommendations.map(r => `<li>${r}</li>`).join('');
      container.classList.remove('hidden');
    }
  }
  
  function showError(message) {
    alert(message); // Replace with better error UI
  }
  
  // Initialize
  initialize();
});
```

---

## 4. MIDDLEWARE ENGINEERING

### 4.1 File Structure

```
middleware/
├── u2a-protocol/
│   ├── request-parser.ts        # Parse incoming requests
│   ├── context-manager.ts       # Manage session context
│   ├── agent-coordinator.ts     # Orchestrate A2A pipeline
│   └── tool-registry.ts         # Register and execute tools
├── models/
│   ├── types.ts                 # TypeScript interfaces
│   ├── virtue-system.ts         # Virtue tracking logic
│   └── knighthood-system.ts     # Knighthood progression
├── services/
│   ├── database-service.ts      # PostgreSQL connection
│   └── cache-service.ts         # Redis caching
└── index.ts                     # Main middleware entry
```

### 4.2 Request Parser

```typescript
// middleware/u2a-protocol/request-parser.ts

import { U2ARequest, RequestType, ParsedRequest } from '../models/types';

export class RequestParser {
  /**
   * Parse incoming U2A request and determine type
   */
  parse(request: U2ARequest): ParsedRequest {
    const requestType = this.inferRequestType(request);
    
    return {
      type: requestType,
      sessionId: request.sessionId,
      childId: request.childId,
      payload: this.sanitizePayload(request),
      timestamp: new Date().toISOString(),
      metadata: {
        userAgent: request.headers?.['user-agent'],
        origin: request.headers?.['origin']
      }
    };
  }

  /**
   * Infer request type from endpoint and payload
   */
  private inferRequestType(request: U2ARequest): RequestType {
    const { endpoint, payload } = request;
    
    if (endpoint.includes('session/init')) return 'session_init';
    if (endpoint.includes('analyze-mood')) return 'mood_analysis';
    if (endpoint.includes('curate-chapters')) return 'story_generation';
    if (endpoint.includes('submit-evaluation')) return 'feedback';
    if (endpoint.includes('metrics')) return 'metrics_query';
    if (endpoint.includes('scene-metrics')) return 'scene_metrics';
    
    return 'unknown';
  }

  /**
   * Sanitize and validate payload
   */
  private sanitizePayload(request: U2ARequest): Record<string, any> {
    const { payload } = request;
    
    // Remove any potentially harmful fields
    const sanitized = { ...payload };
    delete sanitized.__proto__;
    delete sanitized.constructor;
    
    // Validate required fields based on request type
    this.validatePayload(sanitized, request.endpoint);
    
    return sanitized;
  }

  private validatePayload(payload: any, endpoint: string): void {
    if (endpoint.includes('curate-chapters')) {
      if (!payload.theme) throw new Error('Theme is required');
      if (!payload.virtueFocus) throw new Error('Virtue focus is required');
    }
    
    if (endpoint.includes('submit-evaluation')) {
      if (typeof payload.rating !== 'number') throw new Error('Rating must be a number');
    }
  }
}
```

### 4.3 Context Manager

```typescript
// middleware/u2a-protocol/context-manager.ts

import { CacheService } from '../services/cache-service';
import { DatabaseService } from '../services/database-service';
import { UserContext, ChildProfile, SessionHistory } from '../models/types';

export class ContextManager {
  private cache: CacheService;
  private db: DatabaseService;
  private TTL_SECONDS = 3600; // 1 hour

  constructor(cache: CacheService, db: DatabaseService) {
    this.cache = cache;
    this.db = db;
  }

  /**
   * Initialize session and load context
   */
  async initializeSession(childId: string): Promise<{ sessionId: string; context: UserContext }> {
    // Generate session ID
    const sessionId = this.generateSessionId();
    
    // Load child profile from database
    const childProfile = await this.loadChildProfile(childId);
    
    // Load session history
    const sessionHistory = await this.loadSessionHistory(childId);
    
    // Load current goals
    const currentGoals = await this.loadCurrentGoals(childId);
    
    // Build context
    const context: UserContext = {
      childProfile,
      sessionHistory,
      currentGoals,
      createdAt: new Date().toISOString()
    };
    
    // Cache context
    await this.cache.set(`session:${sessionId}`, context, this.TTL_SECONDS);
    
    return { sessionId, context };
  }

  /**
   * Get context for existing session
   */
  async getContext(sessionId: string): Promise<UserContext | null> {
    // Try cache first
    const cached = await this.cache.get(`session:${sessionId}`);
    if (cached) return cached as UserContext;
    
    return null;
  }

  /**
   * Update context with new data
   */
  async updateContext(sessionId: string, updates: Partial<UserContext>): Promise<UserContext> {
    const context = await this.getContext(sessionId);
    if (!context) throw new Error('Session not found');
    
    const updatedContext = { ...context, ...updates };
    await this.cache.set(`session:${sessionId}`, updatedContext, this.TTL_SECONDS);
    
    return updatedContext;
  }

  /**
   * Append to agent memory within context
   */
  async appendAgentMemory(sessionId: string, memory: any): Promise<void> {
    const context = await this.getContext(sessionId);
    if (!context) throw new Error('Session not found');
    
    context.agentMemory = context.agentMemory || [];
    context.agentMemory.push({
      ...memory,
      timestamp: new Date().toISOString()
    });
    
    await this.cache.set(`session:${sessionId}`, context, this.TTL_SECONDS);
  }

  /**
   * Save context to database (on session end)
   */
  async persistContext(sessionId: string): Promise<void> {
    const context = await this.getContext(sessionId);
    if (!context) return;
    
    // Save relevant data to database
    await this.db.query(`
      INSERT INTO session_history (child_id, context_data, ended_at)
      VALUES ($1, $2, NOW())
    `, [context.childProfile.id, JSON.stringify(context)]);
    
    // Clear from cache
    await this.cache.delete(`session:${sessionId}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // PRIVATE HELPERS
  // ═══════════════════════════════════════════════════════════════
  
  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async loadChildProfile(childId: string): Promise<ChildProfile> {
    const result = await this.db.query(`
      SELECT c.*, 
             json_agg(DISTINCT v.*) as virtues,
             k.level as knighthood_level,
             k.points as knighthood_points
      FROM children c
      LEFT JOIN virtue_progress v ON c.id = v.child_id
      LEFT JOIN knighthood k ON c.id = k.child_id
      WHERE c.id = $1
      GROUP BY c.id, k.level, k.points
    `, [childId]);
    
    if (result.rows.length === 0) {
      throw new Error('Child not found');
    }
    
    return result.rows[0];
  }

  private async loadSessionHistory(childId: string): Promise<SessionHistory> {
    const result = await this.db.query(`
      SELECT 
        COUNT(s.id) as chapters_completed,
        MAX(s.mood) as last_mood,
        array_agg(DISTINCT v.virtue_id) as recent_virtues
      FROM stories s
      LEFT JOIN story_virtue_awards v ON s.id = v.story_id
      WHERE s.child_id = $1
        AND s.created_at > NOW() - INTERVAL '30 days'
      GROUP BY s.child_id
    `, [childId]);
    
    return result.rows[0] || {
      chaptersCompleted: 0,
      lastMood: null,
      recentVirtues: []
    };
  }

  private async loadCurrentGoals(childId: string): Promise<any> {
    const result = await this.db.query(`
      SELECT target_virtue, knighthood_progress, next_milestone
      FROM learning_goals
      WHERE child_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `, [childId]);
    
    return result.rows[0] || {
      targetVirtue: 'courage',
      knighthoodProgress: 0,
      nextMilestone: 'Page'
    };
  }
}
```

### 4.4 Agent Coordinator

```typescript
// middleware/u2a-protocol/agent-coordinator.ts

import { EventEmitter } from 'events';
import { DirectorAgent } from '../../agents/director-agent';
import { WriterAgent } from '../../agents/writer-agent';
import { VoiceAgent } from '../../agents/voice-agent';
import { MusicAgent } from '../../agents/music-agent';
import { EditorAgent } from '../../agents/editor-agent';
import { PublisherAgent } from '../../agents/publisher-agent';
import { StoryPlan, StoryPackage, AgentResult } from '../models/types';

export class AgentCoordinator extends EventEmitter {
  private director: DirectorAgent;
  private writer: WriterAgent;
  private voice: VoiceAgent;
  private music: MusicAgent;
  private editor: EditorAgent;
  private publisher: PublisherAgent;

  constructor() {
    super();
    this.director = new DirectorAgent();
    this.writer = new WriterAgent();
    this.voice = new VoiceAgent();
    this.music = new MusicAgent();
    this.editor = new EditorAgent();
    this.publisher = new PublisherAgent();
  }

  /**
   * Orchestrate the full A2A pipeline
   * 
   * Flow: Director → Writer → [Voice + Music] → Editor → Publisher
   */
  async orchestrateStoryGeneration(input: StoryGenerationInput): Promise<StoryPackage> {
    const startTime = Date.now();
    
    try {
      // ═══════════════════════════════════════════════════════════
      // STEP 1: DIRECTOR AGENT (Story Planning)
      // ═══════════════════════════════════════════════════════════
      this.emitProgress('director', 'Planning story...', 10);
      
      const storyPlan = await this.director.execute({
        mood: input.mood,
        theme: input.theme,
        virtueFocus: input.virtueFocus,
        childProfile: input.childProfile,
        parentGuidance: input.parentGuidance,
        sessionHistory: input.sessionHistory
      });
      
      this.emitProgress('director', 'Story plan complete', 20);
      
      // ═══════════════════════════════════════════════════════════
      // STEP 2: WRITER AGENT (Content Generation)
      // ═══════════════════════════════════════════════════════════
      this.emitProgress('writer', 'Writing narrative...', 25);
      
      const narrative = await this.writer.execute({
        storyPlan,
        characterBible: await this.loadCharacterBible(),
        targetWordList: storyPlan.targetWords,
        readingLevel: input.childProfile.readingLevel
      });
      
      this.emitProgress('writer', 'Narrative complete', 40);
      
      // ═══════════════════════════════════════════════════════════
      // STEP 3: PARALLEL - Voice + Music Agents
      // ═══════════════════════════════════════════════════════════
      this.emitProgress('voice', 'Generating audio...', 45);
      this.emitProgress('music', 'Composing music...', 45);
      
      const [voiceResult, musicResult] = await Promise.all([
        this.voice.execute({
          narrative: narrative.chapters,
          characterVoices: await this.loadVoiceConfig()
        }),
        this.music.execute({
          mood: input.mood,
          theme: input.theme,
          duration: narrative.estimatedDuration
        })
      ]);
      
      this.emitProgress('voice', 'Audio complete', 65);
      this.emitProgress('music', 'Music complete', 65);
      
      // ═══════════════════════════════════════════════════════════
      // STEP 4: EDITOR AGENT (Quality Control)
      // ═══════════════════════════════════════════════════════════
      this.emitProgress('editor', 'Quality review...', 70);
      
      const editedContent = await this.editor.execute({
        narrative,
        voiceAssets: voiceResult.audioUrls,
        musicAsset: musicResult.trackUrl,
        virtueRequirements: storyPlan.virtueOpportunities
      });
      
      this.emitProgress('editor', 'Quality approved', 85);
      
      // ═══════════════════════════════════════════════════════════
      // STEP 5: PUBLISHER AGENT (Final Assembly)
      // ═══════════════════════════════════════════════════════════
      this.emitProgress('publisher', 'Packaging story...', 90);
      
      const storyPackage = await this.publisher.execute({
        editedContent,
        storyPlan,
        childId: input.childId,
        sessionId: input.sessionId
      });
      
      this.emitProgress('publisher', 'Story ready!', 100);
      
      // Log telemetry
      this.logTelemetry({
        duration: Date.now() - startTime,
        agentSteps: 5,
        success: true
      });
      
      return storyPackage;
      
    } catch (error) {
      this.emitProgress('error', `Failed: ${error.message}`, 0);
      this.logTelemetry({
        duration: Date.now() - startTime,
        success: false,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Emit progress event for WebSocket broadcast
   */
  private emitProgress(agent: string, status: string, progress: number): void {
    this.emit('progress', { agent, status, progress, timestamp: Date.now() });
  }

  /**
   * Load character bible for consistency
   */
  private async loadCharacterBible(): Promise<any> {
    // Load from CONSISTENCY.md or database
    return {
      SIR_JAMES: {
        age: 5,
        eyes: 'BRIGHT BLUE',
        hair: 'Sandy brown with cowlick',
        outfit: 'Royal blue tunic with silver Celtic trim'
      },
      CLAUDE: {
        breed: 'Redbone Coonhound',
        coat: 'Rich reddish-brown',
        communication: 'SFX only'
      },
      GRAMPS: {
        age: '65-70',
        hair: 'Silver/grey with beard',
        outfit: 'Brown robes'
      }
    };
  }

  /**
   * Load voice configuration
   */
  private async loadVoiceConfig(): Promise<any> {
    return {
      'Sir James': 'SOYHLrjzK2X1ezoPC6cr',
      'Narrator': 'XrExE9yKIg1WjnnlVkGX',
      'Gramps': 'pqHfZKP75CvOlQylNhV4',
      'Claude': null // SFX only
    };
  }

  private logTelemetry(data: any): void {
    console.log('[AgentCoordinator] Telemetry:', data);
  }
}

interface StoryGenerationInput {
  sessionId: string;
  childId: string;
  mood: string;
  theme: string;
  virtueFocus: string;
  childProfile: any;
  parentGuidance?: string;
  sessionHistory: any;
}
```

---

## 5. BACKEND ENGINEERING

### 5.1 API Routes

```typescript
// api/routes.ts

import { Router } from 'express';
import { RequestParser } from '../middleware/u2a-protocol/request-parser';
import { ContextManager } from '../middleware/u2a-protocol/context-manager';
import { AgentCoordinator } from '../middleware/u2a-protocol/agent-coordinator';
import { DatabaseService } from '../middleware/services/database-service';
import { CacheService } from '../middleware/services/cache-service';

const router = Router();
const parser = new RequestParser();
const db = new DatabaseService();
const cache = new CacheService();
const contextManager = new ContextManager(cache, db);
const agentCoordinator = new AgentCoordinator();

// ═══════════════════════════════════════════════════════════════
// PHASE 1: SESSION INITIALIZATION
// ═══════════════════════════════════════════════════════════════
router.post('/api/v1/session/init', async (req, res) => {
  try {
    const { childId } = req.body;
    
    if (!childId) {
      return res.status(400).json({ error: 'childId is required' });
    }
    
    const { sessionId, context } = await contextManager.initializeSession(childId);
    
    // Get metrics for dashboard
    const metrics = await getChildMetrics(childId);
    const knighthood = await getKnighthoodStatus(childId);
    
    res.json({
      sessionId,
      context,
      childProfile: context.childProfile,
      knighthood,
      metrics
    });
    
  } catch (error) {
    console.error('Session init error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// PHASE 2: MOOD ANALYSIS
// ═══════════════════════════════════════════════════════════════
router.post('/api/v1/analyze-mood', async (req, res) => {
  try {
    const { sessionId, mood, situationContext } = req.body;
    
    // Update context with mood
    await contextManager.updateContext(sessionId, {
      currentMood: mood,
      situationContext
    });
    
    // Generate theme suggestions based on mood
    const suggestedThemes = generateThemeSuggestions(mood, situationContext);
    
    res.json({
      suggestedThemes,
      moodAnalysis: {
        mood,
        intensity: analyzeMoodIntensity(situationContext),
        keywords: extractKeywords(situationContext)
      }
    });
    
  } catch (error) {
    console.error('Mood analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// PHASE 3: STORY GENERATION (Click2Kick)
// ═══════════════════════════════════════════════════════════════
router.post('/api/v1/curate-chapters', async (req, res) => {
  try {
    const { 
      sessionId, childId, theme, virtueFocus, 
      parentGuidance, mood, situationContext, childProfile 
    } = req.body;
    
    // Get full context
    const context = await contextManager.getContext(sessionId);
    
    // Subscribe client to WebSocket for progress updates
    // (handled by WebSocket manager separately)
    
    // Orchestrate agent pipeline
    const storyPackage = await agentCoordinator.orchestrateStoryGeneration({
      sessionId,
      childId,
      mood: mood || context?.currentMood,
      theme,
      virtueFocus,
      childProfile: childProfile || context?.childProfile,
      parentGuidance,
      sessionHistory: context?.sessionHistory
    });
    
    // Save story to database
    const storyId = await saveStory(childId, storyPackage);
    
    // Update context with story
    await contextManager.updateContext(sessionId, {
      currentStory: { storyId, ...storyPackage }
    });
    
    res.json({
      success: true,
      story: {
        storyId,
        ...storyPackage
      }
    });
    
  } catch (error) {
    console.error('Story generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// PHASE 4: GET STORY
// ═══════════════════════════════════════════════════════════════
router.get('/api/v1/story/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;
    
    const story = await db.query(`
      SELECT s.*, 
             json_agg(sc.*) as scenes,
             json_agg(sa.*) as assets
      FROM stories s
      LEFT JOIN story_scenes sc ON s.id = sc.story_id
      LEFT JOIN story_assets sa ON s.id = sa.story_id
      WHERE s.id = $1
      GROUP BY s.id
    `, [storyId]);
    
    if (story.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    res.json(story.rows[0]);
    
  } catch (error) {
    console.error('Story fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// PHASE 5: SUBMIT FEEDBACK
// ═══════════════════════════════════════════════════════════════
router.post('/api/v1/submit-evaluation', async (req, res) => {
  try {
    const { sessionId, storyId, rating, engagement, comment } = req.body;
    
    // Save feedback
    await db.query(`
      INSERT INTO feedback (story_id, rating, engagement, comment, created_at)
      VALUES ($1, $2, $3, $4, NOW())
    `, [storyId, rating, JSON.stringify(engagement), comment]);
    
    // Update child's virtue progress based on story completion
    const context = await contextManager.getContext(sessionId);
    const updatedMetrics = await updateVirtueProgress(
      context?.childProfile?.id,
      storyId,
      engagement
    );
    
    // Generate recommendations
    const recommendations = generateRecommendations(
      context?.childProfile,
      updatedMetrics,
      engagement
    );
    
    res.json({
      success: true,
      recommendations,
      updatedMetrics
    });
    
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// PHASE 6: GET METRICS
// ═══════════════════════════════════════════════════════════════
router.get('/api/v1/metrics/:childId', async (req, res) => {
  try {
    const { childId } = req.params;
    
    const metrics = await getChildMetrics(childId);
    const knighthood = await getKnighthoodStatus(childId);
    const literacy = await getLiteracyMetrics(childId);
    
    res.json({
      virtues: metrics.virtues,
      knighthood,
      literacy,
      storiesCompleted: metrics.storiesCompleted,
      lastActivity: metrics.lastActivity
    });
    
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// SCENE METRICS (Per-scene interaction logging)
// ═══════════════════════════════════════════════════════════════
router.post('/api/v1/scene-metrics', async (req, res) => {
  try {
    const { sessionId, storyId, sceneId, metrics } = req.body;
    
    // Save scene-level metrics
    await db.query(`
      INSERT INTO scene_metrics (
        story_id, scene_id, 
        word_recognition, spelling_attempts, 
        auto_read_ratio, dashboard_actions,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `, [
      storyId, 
      sceneId, 
      JSON.stringify(metrics.word_recognition),
      JSON.stringify(metrics.spelling_attempts),
      metrics.auto_read_vs_self_read_ratio,
      JSON.stringify(metrics.dashboard_actions)
    ]);
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('Scene metrics error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function generateThemeSuggestions(mood: string, situation: string): any[] {
  const themeMap: Record<string, string[]> = {
    'anxious': ['courage-quest', 'trust-bridge'],
    'angry': ['kindness-kingdom', 'honesty-harbor'],
    'sad': ['kindness-kingdom', 'trust-bridge'],
    'happy': ['courage-quest', 'honesty-harbor'],
    'excited': ['courage-quest', 'trust-bridge'],
    'frustrated': ['perseverance-path', 'wisdom-woods']
  };
  
  const themes = themeMap[mood] || ['courage-quest'];
  
  return themes.map(theme => ({
    theme,
    reason: `Based on your child's ${mood} mood, we recommend ${theme.replace('-', ' ')}`
  }));
}

async function getChildMetrics(childId: string): Promise<any> {
  const result = await db.query(`
    SELECT 
      v.virtue_type, v.points,
      COUNT(DISTINCT s.id) as stories_completed,
      MAX(s.created_at) as last_activity
    FROM virtue_progress v
    LEFT JOIN stories s ON s.child_id = v.child_id
    WHERE v.child_id = $1
    GROUP BY v.virtue_type, v.points
  `, [childId]);
  
  const virtues: Record<string, number> = {};
  result.rows.forEach(row => {
    virtues[row.virtue_type] = row.points;
  });
  
  return {
    virtues,
    storiesCompleted: result.rows[0]?.stories_completed || 0,
    lastActivity: result.rows[0]?.last_activity
  };
}

async function getKnighthoodStatus(childId: string): Promise<any> {
  const result = await db.query(`
    SELECT level, points, privileges
    FROM knighthood
    WHERE child_id = $1
  `, [childId]);
  
  const row = result.rows[0] || { level: 'Page', points: 0, privileges: [] };
  
  const levels = ['Page', 'Squire', 'Knight', 'Champion', 'Legend'];
  const thresholds = [0, 100, 300, 600, 1000];
  
  const currentIndex = levels.indexOf(row.level);
  const nextLevel = levels[currentIndex + 1] || 'Legend';
  const nextThreshold = thresholds[currentIndex + 1] || 1000;
  
  return {
    level: row.level,
    points: row.points,
    privileges: row.privileges,
    nextLevel,
    nextLevelPoints: nextThreshold
  };
}

async function getLiteracyMetrics(childId: string): Promise<any> {
  const result = await db.query(`
    SELECT 
      COUNT(DISTINCT word) as words_learned,
      AVG(spelling_accuracy) as spelling_accuracy,
      AVG(self_read_ratio) as self_read_ratio,
      MAX(reading_level) as reading_level
    FROM scene_metrics sm
    JOIN stories s ON sm.story_id = s.id
    WHERE s.child_id = $1
  `, [childId]);
  
  return result.rows[0] || {
    wordsLearned: 0,
    spellingAccuracy: 0,
    selfReadRatio: 0,
    readingLevel: 'Emergent'
  };
}

export default router;
```

### 5.2 Database Schema

```sql
-- database/schema.sql
-- Sir James Book003 - U2A Architecture Database Schema

-- ═══════════════════════════════════════════════════════════════
-- CHILDREN & PROFILES
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  age INTEGER CHECK (age >= 3 AND age <= 12),
  avatar_url TEXT,
  reading_level VARCHAR(50) DEFAULT 'Emergent',
  learning_style VARCHAR(50),
  favorite_themes TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- VIRTUE SYSTEM
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE virtues (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  emoji VARCHAR(10),
  description TEXT,
  color VARCHAR(20)
);

-- Seed virtues
INSERT INTO virtues (name, emoji, description, color) VALUES
('courage', '💎', 'Bravery in facing fears', '#3b82f6'),
('kindness', '❤️', 'Showing care for others', '#ef4444'),
('honesty', '⭐', 'Telling the truth', '#eab308'),
('trust', '🤝', 'Building reliable relationships', '#22c55e'),
('wisdom', '🥇', 'Making thoughtful decisions', '#a855f7'),
('perseverance', '💪', 'Never giving up', '#f97316'),
('empathy', '🩷', 'Understanding others feelings', '#ec4899'),
('generosity', '🎁', 'Sharing with others', '#06b6d4');

CREATE TABLE virtue_progress (
  id SERIAL PRIMARY KEY,
  child_id UUID REFERENCES children(id),
  virtue_id INTEGER REFERENCES virtues(id),
  points INTEGER DEFAULT 0,
  tier VARCHAR(20) DEFAULT 'Bronze',
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(child_id, virtue_id)
);

-- ═══════════════════════════════════════════════════════════════
-- KNIGHTHOOD PROGRESSION
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE knighthood_levels (
  id SERIAL PRIMARY KEY,
  level_name VARCHAR(50) NOT NULL UNIQUE,
  min_points INTEGER NOT NULL,
  max_points INTEGER,
  icon VARCHAR(10),
  privileges TEXT[]
);

INSERT INTO knighthood_levels (level_name, min_points, max_points, icon, privileges) VALUES
('Page', 0, 99, '🛡️', ARRAY['Basic stories', 'Choose mood']),
('Squire', 100, 299, '⚔️', ARRAY['Choose themes', 'Unlock Lancelot character']),
('Knight', 300, 599, '🏰', ARRAY['Lead quests', 'Round Table access']),
('Champion', 600, 999, '👑', ARRAY['Custom adventures', 'Mentor badge']),
('Legend', 1000, NULL, '✨', ARRAY['All privileges', 'Guide others']);

CREATE TABLE knighthood (
  id SERIAL PRIMARY KEY,
  child_id UUID REFERENCES children(id) UNIQUE,
  level VARCHAR(50) REFERENCES knighthood_levels(level_name),
  points INTEGER DEFAULT 0,
  privileges TEXT[],
  achieved_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- STORIES & SCENES
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id),
  theme VARCHAR(100),
  mood VARCHAR(50),
  virtue_focus VARCHAR(50),
  parent_guidance TEXT,
  story_plan JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE story_scenes (
  id SERIAL PRIMARY KEY,
  story_id UUID REFERENCES stories(id),
  chapter INTEGER,
  scene INTEGER,
  scene_title VARCHAR(200),
  setting TEXT,
  characters TEXT[],
  narrative_text TEXT,
  choices JSONB,
  -- Literacy fields (from Scene Card)
  reading_level_band VARCHAR(50),
  focus_skill VARCHAR(100),
  target_words TEXT[],
  spelling_task_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE story_assets (
  id SERIAL PRIMARY KEY,
  story_id UUID REFERENCES stories(id),
  scene_id INTEGER REFERENCES story_scenes(id),
  asset_type VARCHAR(50), -- 'audio', 'music', 'image'
  asset_url TEXT,
  duration_seconds FLOAT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- SCENE METRICS (Per-scene interaction tracking)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE scene_metrics (
  id SERIAL PRIMARY KEY,
  story_id UUID REFERENCES stories(id),
  scene_id INTEGER REFERENCES story_scenes(id),
  -- Word recognition
  word_recognition JSONB, -- { attempts, correct_first_try, hints_used }
  -- Spelling
  spelling_attempts JSONB, -- { per_word: { word: attempts }, keyboard_used }
  -- Reading mode
  auto_read_ratio FLOAT, -- 0.0 to 1.0
  -- Parent actions
  dashboard_actions JSONB, -- ['More Support', 'Replay Scene', etc.]
  created_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- FEEDBACK & LEARNING
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  story_id UUID REFERENCES stories(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  engagement JSONB, -- { childLaughed, askedQuestions, wantedMore, usedNewWords }
  comment TEXT,
  recommendations TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- SESSION HISTORY
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE session_history (
  id SERIAL PRIMARY KEY,
  child_id UUID REFERENCES children(id),
  context_data JSONB,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════
-- INDEXES FOR PERFORMANCE
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX idx_virtue_progress_child ON virtue_progress(child_id);
CREATE INDEX idx_stories_child ON stories(child_id);
CREATE INDEX idx_stories_created ON stories(created_at DESC);
CREATE INDEX idx_scene_metrics_story ON scene_metrics(story_id);
CREATE INDEX idx_feedback_story ON feedback(story_id);
```

---

## 6. SCENE CARD METRICS SCHEMA

Based on Chapters 6-10 literacy structure:

```typescript
// models/scene-card.ts

export interface SceneCard {
  // Story fields
  story_fields: {
    chapter: number;
    scene: number;
    scene_title: string;
    setting: string;
    characters: string[];
  };
  
  // Literacy fields
  literacy_fields: {
    reading_level_band: ReadingLevel;
    focus_skill: string;
    target_words: string[];
    spelling_task_type: SpellingTaskType;
  };
  
  // Interaction metrics (populated during playback)
  interaction_metrics: {
    word_recognition: WordRecognitionMetrics;
    spelling_attempts: SpellingMetrics;
    auto_read_vs_self_read_ratio: number;
    dashboard_actions: DashboardAction[];
  };
}

export type ReadingLevel = 
  | 'Emergent'
  | 'Early'
  | 'Early → Developing'
  | 'Developing'
  | 'Developing → Bridge'
  | 'Bridge-to-Fluency'
  | 'Consolidation';

export type SpellingTaskType = 
  | 'none'
  | 'trace'
  | 'choose-letters'
  | 'fill-missing'
  | 'free-try';

export interface WordRecognitionMetrics {
  attempts: number;
  correct_first_try: number;
  hints_used: number;
}

export interface SpellingMetrics {
  per_word: Record<string, number>; // word -> attempt count
  keyboard_used: boolean;
}

export type DashboardAction = 
  | 'More Support'
  | 'Harder Next Time'
  | 'Replay Scene'
  | 'Skip Scene'
  | 'Show Pictures'
  | 'Words Only'
  | 'Slower Narration';
```

---

## 7. CLICK2KICK PIPELINE

### Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CLICK2KICK PIPELINE - Sequential API Order                                  │
└─────────────────────────────────────────────────────────────────────────────┘

Step 1: Parent clicks "Generate Sir James Adventure" button
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│  POST /api/v1/curate-chapters                                              │
│  Body: { sessionId, childId, theme, virtueFocus, mood, parentGuidance }   │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│  AGENT COORDINATOR STARTS                                                   │
│  WebSocket: { type: 'agent_progress', agent: 'director', progress: 10 }   │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ├─────────────────────────────────────────────────────────────────┐
        │                                                                  │
        ▼                                                                  │
┌─────────────────────┐                                                    │
│  🎬 DIRECTOR AGENT  │ GPT-4 → $0.03                                      │
│  ─────────────────  │                                                    │
│  Input:             │                                                    │
│  • mood + theme     │                                                    │
│  • child profile    │                                                    │
│  • parent guidance  │                                                    │
│  ─────────────────  │                                                    │
│  Output:            │                                                    │
│  • story_plan       │                                                    │
│  • scene_order      │                                                    │
│  • virtue_opps      │                                                    │
│  • target_words     │                                                    │
└─────────┬───────────┘                                                    │
          │                                                                │
          ▼                                                                │
┌─────────────────────┐                                                    │
│  ✍️ WRITER AGENT    │ GPT-4 → $0.05                                      │
│  ─────────────────  │                                                    │
│  Input:             │                                                    │
│  • story_plan       │                                                    │
│  • character_bible  │                                                    │
│  • reading_level    │                                                    │
│  ─────────────────  │                                                    │
│  Output:            │                                                    │
│  • chapters[]       │                                                    │
│  • scenes[]         │                                                    │
│  • dialogue         │                                                    │
│  • choices          │                                                    │
└─────────┬───────────┘                                                    │
          │                                                                │
          ├─────────────────┬─────────────────┐                            │
          │                 │                 │                            │
          ▼                 ▼                 │                            │
┌─────────────────┐ ┌─────────────────┐       │                            │
│  🎙️ VOICE AGENT │ │  🎵 MUSIC AGENT │       │ PARALLEL                   │
│  ────────────── │ │  ────────────── │       │                            │
│  ElevenLabs    │ │  Suno           │       │                            │
│  $0.15         │ │  $0.10          │       │                            │
│  ────────────── │ │  ────────────── │       │                            │
│  Output:       │ │  Output:        │       │                            │
│  • audio_urls[]│ │  • track_url    │       │                            │
└────────┬────────┘ └────────┬────────┘       │                            │
         │                   │                │                            │
         └─────────┬─────────┘                │                            │
                   │                          │                            │
                   ▼                          │                            │
        ┌─────────────────────┐               │                            │
        │  🎞️ EDITOR AGENT    │ Local → FREE  │                            │
        │  ─────────────────  │               │                            │
        │  Checks:            │               │                            │
        │  • Character match  │               │                            │
        │  • Virtue points    │               │                            │
        │  • Audio levels     │               │                            │
        │  ─────────────────  │               │                            │
        │  Output:            │               │                            │
        │  • edited_content   │               │                            │
        │  • quality_score    │               │                            │
        └─────────┬───────────┘               │                            │
                  │                           │                            │
                  ▼                           │                            │
        ┌─────────────────────┐               │                            │
        │  🚀 PUBLISHER AGENT │ Local → FREE  │                            │
        │  ─────────────────  │               │                            │
        │  Actions:           │               │                            │
        │  • Generate HTML    │               │                            │
        │  • Wire audio/imgs  │               │                            │
        │  • Save to DB       │               │                            │
        │  ─────────────────  │               │                            │
        │  Output:            │               │                            │
        │  • story_package    │               │                            │
        │  • story_url        │               │                            │
        │  • scene_cards[]    │               │                            │
        └─────────┬───────────┘               │                            │
                  │                           │                            │
                  ▼                           │                            │
┌───────────────────────────────────────────────────────────────────────────┐
│  RESPONSE                                                                  │
│  { success: true, story: { storyId, coverUrl, scenes[], sceneCards[] } }  │
│  WebSocket: { type: 'story_complete', storyId, storyUrl }                 │
└───────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│  PARENT DASHBOARD UPDATES:                                                 │
│  • Shows story player                                                      │
│  • Displays scene cards preview                                            │
│  • Shows feedback section                                                  │
│  • Updates metrics (after playback)                                        │
└───────────────────────────────────────────────────────────────────────────┘

💰 TOTAL COST: ~$0.65 per story generation
⏱️ TOTAL TIME: ~90-120 seconds
```

---

## 8. RED→GREEN TASK CHECKLIST

### FRONTEND Tasks

| # | Task | Status | Priority | Deliverable |
|---|------|--------|----------|-------------|
| F1 | Create parent-dashboard.html | 🔴 RED | HIGH | Complete HTML structure |
| F2 | Create dashboard.css styling | 🔴 RED | HIGH | Responsive CSS |
| F3 | Implement u2a-client.js | 🔴 RED | HIGH | API client class |
| F4 | Implement mood-analyzer.js | 🔴 RED | MEDIUM | Mood analysis UI |
| F5 | Implement dashboard-main.js | 🔴 RED | HIGH | Controller logic |
| F6 | Add WebSocket progress UI | 🔴 RED | MEDIUM | Real-time updates |
| F7 | Add scene cards display | 🔴 RED | MEDIUM | Literacy metrics UI |
| F8 | Add feedback form | 🔴 RED | MEDIUM | Rating + engagement |
| F9 | Add metrics charts | 🔴 RED | LOW | Charts.js visualizations |

### MIDDLEWARE Tasks

| # | Task | Status | Priority | Deliverable |
|---|------|--------|----------|-------------|
| M1 | Implement request-parser.ts | 🔴 RED | HIGH | Parse U2A requests |
| M2 | Implement context-manager.ts | 🔴 RED | HIGH | Session management |
| M3 | Implement agent-coordinator.ts | 🔴 RED | HIGH | A2A orchestration |
| M4 | Implement tool-registry.ts | 🔴 RED | MEDIUM | Tool execution |
| M5 | Set up Redis caching | 🔴 RED | MEDIUM | Cache service |
| M6 | Set up WebSocket server | 🔴 RED | MEDIUM | Real-time updates |

### BACKEND Tasks

| # | Task | Status | Priority | Deliverable |
|---|------|--------|----------|-------------|
| B1 | Create database schema | 🔴 RED | HIGH | PostgreSQL tables |
| B2 | Implement /session/init | 🔴 RED | HIGH | Session endpoint |
| B3 | Implement /analyze-mood | 🔴 RED | HIGH | Mood endpoint |
| B4 | Implement /curate-chapters | 🔴 RED | HIGH | Story generation |
| B5 | Implement /submit-evaluation | 🔴 RED | HIGH | Feedback endpoint |
| B6 | Implement /metrics/:childId | 🔴 RED | HIGH | Metrics endpoint |
| B7 | Implement /scene-metrics | 🔴 RED | MEDIUM | Scene tracking |
| B8 | Create database migrations | 🔴 RED | MEDIUM | Knex/TypeORM |
| B9 | Seed virtue + knighthood data | 🔴 RED | MEDIUM | Initial data |

### AGENT Tasks

| # | Task | Status | Priority | Deliverable |
|---|------|--------|----------|-------------|
| A1 | Implement DirectorAgent | 🔴 RED | HIGH | Story planning |
| A2 | Implement WriterAgent | 🔴 RED | HIGH | Narrative generation |
| A3 | Implement VoiceAgent | 🔴 RED | HIGH | ElevenLabs TTS |
| A4 | Implement MusicAgent | 🔴 RED | MEDIUM | Suno composition |
| A5 | Implement EditorAgent | 🔴 RED | MEDIUM | Quality control |
| A6 | Implement PublisherAgent | 🔴 RED | HIGH | Final assembly |

---

## 📊 SUMMARY

### Architecture Layers

1. **FRONTEND** (U2A Interface)
   - Parent Dashboard with mood input, theme selection, Click2Kick
   - Real-time agent progress via WebSocket
   - Scene cards with literacy metrics
   - Virtue + Knighthood progress visualization

2. **MIDDLEWARE** (U2A Protocol Engine)
   - Request parsing and validation
   - Session context management (Redis cache)
   - Agent coordination and orchestration
   - WebSocket broadcast for progress updates

3. **BACKEND** (A2A Pipeline + Data)
   - REST API endpoints (6 phases)
   - PostgreSQL database with scene metrics
   - 6 specialized agents for story generation
   - Feedback loop for continuous learning

### API Sequential Order

```
1. POST /api/v1/session/init       → Initialize session
2. POST /api/v1/analyze-mood       → Analyze mood + suggest themes
3. POST /api/v1/curate-chapters    → Generate story (Click2Kick)
4. GET  /api/v1/story/:storyId     → Retrieve story for playback
5. POST /api/v1/submit-evaluation  → Submit feedback
6. GET  /api/v1/metrics/:childId   → Get learning metrics
```

### Scene Card Structure (Chapters 6-10)

Every scene produces a card with:
- **Story fields**: chapter, scene, title, setting, characters
- **Literacy fields**: reading level, focus skill, target words, spelling task
- **Interaction metrics**: word recognition, spelling, read ratio, actions

---

**For the Commons Good!** 🏰⚔️🐕✨

*This engineering guide provides the complete blueprint for implementing the U2A Parents Dashboard with proper Frontend → Middleware → Backend separation and correct API sequential order.*
