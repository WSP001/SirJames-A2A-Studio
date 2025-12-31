# 🚀 NEXT PROGRAMMING TEAM CHEAT SHEET

> **From**: Cascade AI (Previous Programming Team)
> **To**: Next Programming Team(s)
> **Date**: December 31, 2025
> **Mission**: Turn RED tasks GREEN according to PLAN_BOOK003.md

---

## 📊 WSP001 Repository Map

### Repositories You'll Work With

| Repo | Purpose | Status | Clone Command |
|------|---------|--------|---------------|
| **SirJames-A2A-Studio** | Book002 Engine (LIVE) | ✅ Production | `git clone https://github.com/WSP001/SirJames-A2A-Studio` |
| **SirTrav-A2A-Studio** | 7-Agent Pipeline Reference | ✅ v2.0.1 | `git clone https://github.com/WSP001/SirTrav-A2A-Studio` |
| **SirJamesAdventures003** | Book003 Development | 🟡 Scaffolded | `git clone https://github.com/WSP001/SirJamesAdventures003` |
| **WSP2agent** | Agent Templates | 📖 Reference | Private - ask WSP001 for access |

### Branches to Merge (SirJames-A2A-Studio)

| Branch | Purpose | Action |
|--------|---------|--------|
| `codex/clarify-asset-validation-process-documentation` | Asset validation docs | Review & merge |
| `codex/add-unit-tests-for-virtue-tracker` | Virtue tracker tests | Review & merge |
| `feat/book002-ch3-consolidation` | Chapter 3 fixes | Already merged |
| `chore/book001-verification-gates` | Verification gates | Review for patterns |
| `feature/unlock-all-chapters` | Chapter unlocking | Review for patterns |

### Branches to Merge (SirTrav-A2A-Studio)

| Branch | Purpose | Action |
|--------|---------|--------|
| `feat/progress-blobs` | Progress persistence | Review & merge |
| `claude/add-upload-intake-function-p5Z23` | Upload function | Review & merge |
| `copilot/scaffold-d2a-video-pipeline` | D2A pipeline scaffold | Study patterns |

---

## 🎯 The A2A → D2A → U2A Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SIR JAMES ADVENTURES ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  USER2AGENT (U2A)                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Parent Dashboard                                                 │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │   │
│  │  │ Text Input      │  │ Theme Buttons   │  │ Feedback 👍/👎  │  │   │
│  │  │ "My child needs │  │ [Courage]       │  │ [Rate Story]    │  │   │
│  │  │  to learn..."   │  │ [Kindness]      │  │                 │  │   │
│  │  └─────────────────┘  │ [Sharing]       │  └─────────────────┘  │   │
│  │                       │ [Honesty]       │                        │   │
│  │                       └─────────────────┘                        │   │
│  │                              │                                    │   │
│  │                    ┌─────────▼─────────┐                         │   │
│  │                    │   CLICK2KICK      │                         │   │
│  │                    │   [Generate]      │                         │   │
│  │                    └─────────┬─────────┘                         │   │
│  └──────────────────────────────┼───────────────────────────────────┘   │
│                                 │                                        │
│  DOC2AGENT (D2A)                │                                        │
│  ┌──────────────────────────────▼───────────────────────────────────┐   │
│  │  Documentation Files (HANDOFF_BOOK003.md, CONSISTENCY.md)         │   │
│  │  ┌─────────────────────────────────────────────────────────────┐ │   │
│  │  │ Character Bible → DALL-E Prompts → Consistent Images        │ │   │
│  │  │ Voice Config → ElevenLabs → Consistent Audio                │ │   │
│  │  │ Virtue Taxonomy → Story Choices → Learning Outcomes         │ │   │
│  │  └─────────────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────┬───────────────────────────────────┘   │
│                                 │                                        │
│  AGENT2AGENT (A2A)              │                                        │
│  ┌──────────────────────────────▼───────────────────────────────────┐   │
│  │  7-Agent Sequential Pipeline                                      │   │
│  │                                                                   │   │
│  │  🎬 Director ──▶ ✍️ Writer ──▶ 🎙️ Voice ──▶ 🎵 Composer         │   │
│  │       │                                                           │   │
│  │       ▼                                                           │   │
│  │  🎞️ Editor ──▶ 📜 Attribution ──▶ 🚀 Publisher                   │   │
│  │                                                                   │   │
│  └──────────────────────────────┬───────────────────────────────────┘   │
│                                 │                                        │
│  OUTPUT                         │                                        │
│  ┌──────────────────────────────▼───────────────────────────────────┐   │
│  │  Interactive Story (HTML + Images + Audio)                        │   │
│  │  ┌─────────────────────────────────────────────────────────────┐ │   │
│  │  │ Child plays through scenes → Makes virtue choices →          │ │   │
│  │  │ Progress tracked → Parent sees dashboard → Feedback loop     │ │   │
│  │  └─────────────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Files to Copy (Exact Paths)

### From SirTrav-A2A-Studio → SirJames-A2A-Studio

```bash
# 1. Copy the 7 Agent Functions
cp -r SirTrav-A2A-Studio/netlify/functions/*.ts SirJames-A2A-Studio/netlify/functions/

# Key files:
# - curate-media.ts      → Director Agent (Vision AI)
# - narrate-project.ts   → Writer Agent (GPT-4)
# - text-to-speech.ts    → Voice Agent (ElevenLabs)
# - generate-music.ts    → Composer Agent (Suno)
# - compile-video.ts     → Editor Agent (FFmpeg)
# - generate-attribution.ts → Attribution Agent
# - publish.ts           → Publisher Agent
# - submit-evaluation.ts → Feedback Loop (CRITICAL!)
# - progress.ts          → SSE Progress Streaming

# 2. Copy the UI Components
cp -r SirTrav-A2A-Studio/src/components/*.tsx SirJames-A2A-Studio/src/components/

# Key files:
# - Click2KickButton.tsx  → Pipeline trigger button
# - CreativeHub.tsx       → Upload + orchestration
# - PipelineProgress.tsx  → Progress display
# - ResultsPreview.tsx    → Video preview + feedback

# 3. Copy the Pipeline Scripts
cp -r SirTrav-A2A-Studio/pipelines/ SirJames-A2A-Studio/pipelines/

# Key files:
# - a2a_manifest.yml      → D2A orchestration manifest
# - run-manifest.mjs      → Manifest executor
# - ffmpeg_compile.mjs    → Video assembly
```

### From SirJames-A2A-Studio → SirJamesAdventures003

```bash
# 1. Copy SFX files
cp -r SirJames-A2A-Studio/public-book002/assets/audio/sfx/ \
      SirJamesAdventures003/public-book003/assets/audio/sfx/

# 2. Copy theme music
cp SirJames-A2A-Studio/public-book002/assets/audio/sir-james-adventures-theme.mp3 \
   SirJamesAdventures003/public-book003/assets/audio/

# 3. Reference (DO NOT COPY - just read)
# - CONSISTENCY.md (Character Bible)
# - HANDOFF_BOOK003.md (Full handoff)
# - PLAN_BOOK003.md (RED→GREEN checklist)
```

---

## 🔧 Code Templates

### 1. Parent Dashboard with Click2Kick (HTML/JS)

```html
<!-- public-book003/parent-dashboard.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sir James - Parent Dashboard</title>
    <style>
        :root {
            --brand-blue: #1e40af;
            --brand-gold: #f59e0b;
            --success-green: #10b981;
        }
        
        .dashboard-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            font-family: 'Segoe UI', system-ui, sans-serif;
        }
        
        .situation-input {
            width: 100%;
            min-height: 100px;
            padding: 15px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            font-size: 16px;
            resize: vertical;
        }
        
        .theme-buttons {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin: 20px 0;
        }
        
        .theme-btn {
            padding: 16px 24px;
            border: 2px solid var(--brand-blue);
            border-radius: 12px;
            background: white;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.2s;
        }
        
        .theme-btn:hover {
            background: var(--brand-blue);
            color: white;
        }
        
        .theme-btn.selected {
            background: var(--brand-blue);
            color: white;
        }
        
        .click2kick-btn {
            width: 100%;
            padding: 20px;
            background: linear-gradient(135deg, var(--brand-blue), #3b82f6);
            color: white;
            border: none;
            border-radius: 16px;
            font-size: 20px;
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .click2kick-btn:hover {
            transform: scale(1.02);
            box-shadow: 0 10px 40px rgba(30, 64, 175, 0.3);
        }
        
        .click2kick-btn:disabled {
            background: #9ca3af;
            cursor: not-allowed;
            transform: none;
        }
        
        .cost-estimate {
            display: flex;
            justify-content: space-between;
            padding: 12px 16px;
            background: #f3f4f6;
            border-radius: 8px;
            margin: 16px 0;
        }
        
        .pipeline-progress {
            margin-top: 24px;
        }
        
        .agent-step {
            display: flex;
            align-items: center;
            padding: 12px;
            margin: 8px 0;
            border-radius: 8px;
            background: #f9fafb;
        }
        
        .agent-step.active {
            background: #dbeafe;
            border-left: 4px solid var(--brand-blue);
        }
        
        .agent-step.complete {
            background: #d1fae5;
            border-left: 4px solid var(--success-green);
        }
        
        .agent-icon {
            font-size: 24px;
            margin-right: 12px;
        }
        
        .feedback-section {
            margin-top: 32px;
            padding: 20px;
            background: #fffbeb;
            border-radius: 12px;
        }
        
        .feedback-btn {
            padding: 12px 24px;
            margin: 8px;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            cursor: pointer;
        }
        
        .feedback-btn.good {
            background: var(--success-green);
            color: white;
        }
        
        .feedback-btn.bad {
            background: #ef4444;
            color: white;
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <h1>👨‍👩‍👦 Parent Dashboard</h1>
        <p>Customize Sir James's next adventure based on what your child needs to learn.</p>
        
        <!-- Situation Input -->
        <section>
            <h2>📝 Describe the Situation</h2>
            <textarea 
                id="situationInput" 
                class="situation-input"
                placeholder="Example: My child is struggling with sharing toys with their sibling..."
            ></textarea>
        </section>
        
        <!-- Theme Buttons -->
        <section>
            <h2>🎯 Select a Theme (or let AI choose)</h2>
            <div class="theme-buttons">
                <button class="theme-btn" data-theme="courage" data-virtue="💎">
                    💎 Courage
                </button>
                <button class="theme-btn" data-theme="kindness" data-virtue="❤️">
                    ❤️ Kindness
                </button>
                <button class="theme-btn" data-theme="sharing" data-virtue="🤝">
                    🤝 Sharing
                </button>
                <button class="theme-btn" data-theme="honesty" data-virtue="⭐">
                    ⭐ Honesty
                </button>
                <button class="theme-btn" data-theme="patience" data-virtue="🕐">
                    🕐 Patience
                </button>
                <button class="theme-btn" data-theme="respect" data-virtue="🙏">
                    🙏 Respect
                </button>
            </div>
        </section>
        
        <!-- Cost Estimate -->
        <div class="cost-estimate">
            <span>💰 Estimated Cost:</span>
            <span id="costEstimate">$0.60</span>
            <span>⏱️ Estimated Time:</span>
            <span id="timeEstimate">~2 minutes</span>
        </div>
        
        <!-- Click2Kick Button -->
        <button id="click2kickBtn" class="click2kick-btn">
            🚀 CLICK2KICK - Generate Story
        </button>
        
        <!-- Pipeline Progress -->
        <div id="pipelineProgress" class="pipeline-progress" style="display: none;">
            <h2>📊 Agent Orchestration</h2>
            <div class="agent-step" data-agent="director">
                <span class="agent-icon">🎬</span>
                <span>Director Agent - Curating scenes...</span>
            </div>
            <div class="agent-step" data-agent="writer">
                <span class="agent-icon">✍️</span>
                <span>Writer Agent - Drafting narrative...</span>
            </div>
            <div class="agent-step" data-agent="voice">
                <span class="agent-icon">🎙️</span>
                <span>Voice Agent - Synthesizing audio...</span>
            </div>
            <div class="agent-step" data-agent="composer">
                <span class="agent-icon">🎵</span>
                <span>Composer Agent - Creating music...</span>
            </div>
            <div class="agent-step" data-agent="editor">
                <span class="agent-icon">🎞️</span>
                <span>Editor Agent - Assembling story...</span>
            </div>
            <div class="agent-step" data-agent="attribution">
                <span class="agent-icon">📜</span>
                <span>Attribution Agent - Adding credits...</span>
            </div>
            <div class="agent-step" data-agent="publisher">
                <span class="agent-icon">🚀</span>
                <span>Publisher Agent - Deploying...</span>
            </div>
        </div>
        
        <!-- Feedback Section -->
        <div id="feedbackSection" class="feedback-section" style="display: none;">
            <h2>📊 How did your child like the story?</h2>
            <p>Your feedback helps Sir James learn and improve!</p>
            <button class="feedback-btn good" data-rating="good">👍 Great!</button>
            <button class="feedback-btn bad" data-rating="bad">👎 Needs Work</button>
        </div>
        
        <!-- Virtue Tracking -->
        <section id="virtueTracking" style="margin-top: 32px;">
            <h2>🏆 Virtue Progress</h2>
            <div id="virtueStats"></div>
        </section>
    </div>
    
    <script>
        // ============================================
        // SIR JAMES PARENT DASHBOARD - CLICK2KICK
        // ============================================
        
        const AGENTS = [
            { id: 'director', name: 'Director', icon: '🎬', duration: 2000 },
            { id: 'writer', name: 'Writer', icon: '✍️', duration: 3000 },
            { id: 'voice', name: 'Voice', icon: '🎙️', duration: 4000 },
            { id: 'composer', name: 'Composer', icon: '🎵', duration: 3000 },
            { id: 'editor', name: 'Editor', icon: '🎞️', duration: 2000 },
            { id: 'attribution', name: 'Attribution', icon: '📜', duration: 1000 },
            { id: 'publisher', name: 'Publisher', icon: '🚀', duration: 2000 }
        ];
        
        let selectedTheme = null;
        let pipelineRunning = false;
        
        // Theme button selection
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedTheme = btn.dataset.theme;
            });
        });
        
        // Click2Kick button
        document.getElementById('click2kickBtn').addEventListener('click', async () => {
            if (pipelineRunning) return;
            
            const situation = document.getElementById('situationInput').value;
            if (!situation && !selectedTheme) {
                alert('Please describe a situation or select a theme.');
                return;
            }
            
            pipelineRunning = true;
            document.getElementById('click2kickBtn').disabled = true;
            document.getElementById('click2kickBtn').textContent = '⏳ Agents Working...';
            document.getElementById('pipelineProgress').style.display = 'block';
            
            // Run pipeline simulation (replace with real API calls)
            for (let i = 0; i < AGENTS.length; i++) {
                const agent = AGENTS[i];
                const step = document.querySelector(`[data-agent="${agent.id}"]`);
                
                step.classList.add('active');
                await sleep(agent.duration);
                step.classList.remove('active');
                step.classList.add('complete');
            }
            
            // Show feedback section
            document.getElementById('feedbackSection').style.display = 'block';
            document.getElementById('click2kickBtn').textContent = '✅ Story Ready!';
            pipelineRunning = false;
            
            // Log to localStorage for virtue tracking
            logVirtueChoice(selectedTheme || 'auto', situation);
        });
        
        // Feedback buttons
        document.querySelectorAll('.feedback-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const rating = btn.dataset.rating;
                await submitFeedback(rating, selectedTheme);
                alert(`Thank you for your feedback! Sir James will learn from this.`);
            });
        });
        
        // Helper functions
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        function logVirtueChoice(theme, situation) {
            const choices = JSON.parse(localStorage.getItem('sj:choices') || '[]');
            choices.push({
                timestamp: new Date().toISOString(),
                theme,
                situation,
                book: 'Book003'
            });
            localStorage.setItem('sj:choices', JSON.stringify(choices));
            updateVirtueStats();
        }
        
        async function submitFeedback(rating, theme) {
            // In production, call the submit-evaluation endpoint
            const feedback = {
                projectId: `book003-${Date.now()}`,
                rating,
                theme,
                timestamp: new Date().toISOString()
            };
            
            // Store locally for now
            const history = JSON.parse(localStorage.getItem('sj:feedback') || '[]');
            history.push(feedback);
            localStorage.setItem('sj:feedback', JSON.stringify(history));
            
            // TODO: Call real API
            // await fetch('/.netlify/functions/submit-evaluation', {
            //     method: 'POST',
            //     body: JSON.stringify(feedback)
            // });
        }
        
        function updateVirtueStats() {
            const choices = JSON.parse(localStorage.getItem('sj:choices') || '[]');
            const stats = {};
            
            choices.forEach(c => {
                if (c.theme) {
                    stats[c.theme] = (stats[c.theme] || 0) + 1;
                }
            });
            
            const html = Object.entries(stats)
                .map(([theme, count]) => `<div>${theme}: ${count} stories</div>`)
                .join('');
            
            document.getElementById('virtueStats').innerHTML = html || '<p>No stories generated yet.</p>';
        }
        
        // Initialize
        updateVirtueStats();
    </script>
</body>
</html>
```

### 2. Submit Evaluation Agent (TypeScript)

```typescript
// netlify/functions/submit-evaluation.ts
// Adapted from SirTrav-A2A-Studio for Sir James Adventures

import type { Handler } from '@netlify/functions';

interface EvaluationRequest {
  projectId: string;
  rating: 'good' | 'bad';
  theme?: string;
  virtue?: string;
  childAge?: number;
  comments?: string;
}

interface MemoryIndex {
  version: string;
  last_updated: string;
  user_preferences: {
    favorite_themes: string[];
    favorite_virtues: string[];
    disliked_themes: string[];
  };
  story_history: Array<{
    projectId: string;
    rating: 'good' | 'bad';
    theme?: string;
    virtue?: string;
    timestamp: string;
  }>;
}

// In production, use Netlify Blobs or external storage
let memoryStore: MemoryIndex = {
  version: '1.0.0',
  last_updated: new Date().toISOString(),
  user_preferences: {
    favorite_themes: [],
    favorite_virtues: [],
    disliked_themes: []
  },
  story_history: []
};

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const request: EvaluationRequest = JSON.parse(event.body || '{}');
    
    if (!request.projectId || !request.rating) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'projectId and rating required' })
      };
    }

    // Update preferences based on feedback
    const prefs = memoryStore.user_preferences;
    
    if (request.rating === 'good') {
      // Learn from positive feedback
      if (request.theme && !prefs.favorite_themes.includes(request.theme)) {
        prefs.favorite_themes.push(request.theme);
      }
      if (request.virtue && !prefs.favorite_virtues.includes(request.virtue)) {
        prefs.favorite_virtues.push(request.virtue);
      }
      // Remove from disliked if previously marked
      prefs.disliked_themes = prefs.disliked_themes.filter(t => t !== request.theme);
    } else {
      // Learn from negative feedback
      if (request.theme && !prefs.disliked_themes.includes(request.theme)) {
        prefs.disliked_themes.push(request.theme);
      }
    }

    // Add to history
    memoryStore.story_history.push({
      projectId: request.projectId,
      rating: request.rating,
      theme: request.theme,
      virtue: request.virtue,
      timestamp: new Date().toISOString()
    });

    memoryStore.last_updated = new Date().toISOString();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Feedback recorded. Sir James will learn from this!',
        preferences: prefs
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
```

### 3. Director Agent for Sir James (TypeScript)

```typescript
// netlify/functions/curate-chapters.ts
// Director Agent adapted for Sir James Adventures Book003

import type { Handler } from '@netlify/functions';

interface CurateRequest {
  projectId: string;
  parentInput: string;
  selectedTheme?: string;
  childAge?: number;
}

interface Scene {
  sceneId: string;
  title: string;
  virtue: 'courage' | 'wisdom' | 'trust' | 'kindness' | 'honesty';
  narratorText: string;
  sirJamesDialogue: string;
  claudeThought: string;
  grampsAdvice?: string;
  choices: Array<{
    label: string;
    virtue: string;
    nextScene: string;
  }>;
}

// Character consistency from CONSISTENCY.md
const CHARACTER_BIBLE = {
  sirJames: {
    age: 5,
    eyes: 'bright blue',
    hair: 'brown with cowlick',
    outfit: 'royal blue tunic with silver Celtic trim',
    personality: 'curious, brave, kind'
  },
  claude: {
    breed: 'Redbone Coonhound',
    coat: 'reddish-brown',
    eyes: 'intelligent amber',
    collar: 'royal blue with silver tag',
    voice: 'SFX only (bark, whine, happy)'
  },
  gramps: {
    age: '65+',
    hair: 'silver/grey with beard',
    outfit: 'simple robes, walking staff',
    personality: 'wise, patient, loving'
  }
};

// Theme to virtue mapping
const THEME_VIRTUE_MAP: Record<string, string> = {
  'courage': 'courage',
  'kindness': 'kindness',
  'sharing': 'trust',
  'honesty': 'wisdom',
  'patience': 'wisdom',
  'respect': 'trust'
};

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const request: CurateRequest = JSON.parse(event.body || '{}');
    
    // Determine virtue from theme or parent input
    const virtue = request.selectedTheme 
      ? THEME_VIRTUE_MAP[request.selectedTheme] || 'courage'
      : analyzeParentInput(request.parentInput);

    // Generate scene outline (in production, call GPT-4)
    const scenes = generateSceneOutline(virtue, request.parentInput);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        projectId: request.projectId,
        virtue,
        characterBible: CHARACTER_BIBLE,
        scenes,
        metadata: {
          agent: 'director',
          version: '1.0',
          timestamp: new Date().toISOString()
        }
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

function analyzeParentInput(input: string): string {
  // Simple keyword matching (in production, use GPT-4)
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('shar') || lowerInput.includes('toy')) return 'trust';
  if (lowerInput.includes('brave') || lowerInput.includes('fear')) return 'courage';
  if (lowerInput.includes('kind') || lowerInput.includes('nice')) return 'kindness';
  if (lowerInput.includes('truth') || lowerInput.includes('lie')) return 'wisdom';
  
  return 'courage'; // default
}

function generateSceneOutline(virtue: string, parentInput: string): Scene[] {
  // Template scenes (in production, generate with GPT-4)
  return [
    {
      sceneId: 'scene-001',
      title: 'The Morning Challenge',
      virtue: virtue as any,
      narratorText: `Sir James woke up to a beautiful morning in the kingdom...`,
      sirJamesDialogue: `"Claude, today feels like an adventure day!"`,
      claudeThought: `*wags tail excitedly*`,
      grampsAdvice: `"Remember, young knight, every challenge is a chance to grow."`,
      choices: [
        { label: 'Face the challenge bravely!', virtue: 'courage', nextScene: 'scene-002a' },
        { label: 'Think carefully first...', virtue: 'wisdom', nextScene: 'scene-002b' }
      ]
    }
    // ... more scenes would be generated
  ];
}
```

---

## 🧪 Test Commands

### Quick Verification

```bash
# 1. Test Book002 is still working
curl https://sirjames-book002-final.netlify.app/chapters.json

# 2. Test SirTrav agents (reference)
curl https://sirtrav-a2a-studio.netlify.app/.netlify/functions/healthcheck

# 3. Run local integrity check
cd SirJamesAdventures003
python tools/check_scene_integrity.py

# 4. Start local server
python -m http.server 8080 --directory public-book003
```

### Smoke Test Script

```bash
#!/bin/bash
# scripts/smoke-test-book003.sh

BASE_URL=${1:-"http://localhost:8888"}

echo "🧪 Sir James Book003 Smoke Test"
echo "================================"

# Test healthcheck
echo -n "Testing healthcheck... "
HEALTH=$(curl -s "$BASE_URL/.netlify/functions/healthcheck")
if [[ $HEALTH == *"ok"* ]]; then
    echo "✅ PASS"
else
    echo "❌ FAIL"
fi

# Test submit-evaluation
echo -n "Testing submit-evaluation... "
EVAL=$(curl -s -X POST "$BASE_URL/.netlify/functions/submit-evaluation" \
    -H "Content-Type: application/json" \
    -d '{"projectId":"test-123","rating":"good","theme":"courage"}')
if [[ $EVAL == *"success"* ]]; then
    echo "✅ PASS"
else
    echo "❌ FAIL"
fi

# Test curate-chapters
echo -n "Testing curate-chapters... "
CURATE=$(curl -s -X POST "$BASE_URL/.netlify/functions/curate-chapters" \
    -H "Content-Type: application/json" \
    -d '{"projectId":"test-123","parentInput":"teach sharing","selectedTheme":"sharing"}')
if [[ $CURATE == *"scenes"* ]]; then
    echo "✅ PASS"
else
    echo "❌ FAIL"
fi

echo "================================"
echo "Smoke test complete!"
```

---

## 💰 Cost Estimation

```javascript
// lib/cost-estimator.js

const COSTS = {
  'dall-e-3': 0.04,      // per image (1792x1024)
  'elevenlabs': 0.018,   // per 1000 characters
  'gpt-4': 0.03,         // per 1000 tokens (input)
  'gpt-4-output': 0.06,  // per 1000 tokens (output)
  'suno': 0.10           // per song
};

function estimateChapterCost(scenes = 8) {
  return {
    images: scenes * COSTS['dall-e-3'],           // $0.32
    voice: 0.15,                                   // ~8000 chars
    prompts: 0.03,                                 // ~1000 tokens
    music: COSTS['suno'],                          // $0.10
    total: (scenes * COSTS['dall-e-3']) + 0.15 + 0.03 + COSTS['suno']
  };
}

// Example: estimateChapterCost(8) => { total: 0.60 }
```

---

## 🎯 Success Criteria Checklist

When you've completed the handoff, verify:

- [ ] `python tools/check_scene_integrity.py` returns exit code 0
- [ ] All 10 chapters load at https://sirjames-book003.netlify.app
- [ ] Parent Dashboard shows virtue tracking
- [ ] Click2Kick button triggers pipeline (even if simulated)
- [ ] Feedback (👍/👎) stores to localStorage
- [ ] Cost per chapter < $1.00
- [ ] Sir James is 5 years old in all images
- [ ] Claude is Redbone Coonhound (SFX only)
- [ ] Works on iPad 9th Gen (touch targets ≥48px)

---

## 📞 Contact & Support

- **GitHub**: https://github.com/WSP001
- **Live Sites**:
  - Book001 Emoji: https://sir-james-adventuers001.netlify.app
  - Book002 Final: https://sirjames-book002-final.netlify.app
  - Book003 (WIP): https://sirjames-book003.netlify.app

---

**Welcome to the team! For the Commons Good!** 🏰⚔️🐕✨

---

**Created**: December 31, 2025
**Author**: Cascade AI Assistant
**For**: Next Programming Team(s)
