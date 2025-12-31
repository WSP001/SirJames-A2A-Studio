# 🤖 D2A API STRUCTURE - Documentation to Agent Flow

## Sir James Adventures Book003 - API-Structured Instructions

> **Purpose**: This document structures ALL API calls in the correct format  
> so the next programming team can copy-paste directly into their code.  
> **Pattern**: Documentation → Agent → API → Output → Memory

---

## 📡 API ENDPOINTS REGISTRY

### 1. OpenAI (DALL-E 3 Images)

```yaml
endpoint: https://api.openai.com/v1/images/generations
method: POST
headers:
  Authorization: Bearer ${OPENAI_API_KEY}
  Content-Type: application/json
```

### 2. ElevenLabs (Voice Synthesis)

```yaml
endpoint: https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
method: POST
headers:
  xi-api-key: ${ELEVENLABS_API_KEY}
  Content-Type: application/json
```

### 3. Suno (Music Generation)

```yaml
endpoint: https://api.suno.ai/v1/generate
method: POST
headers:
  Authorization: Bearer ${SUNO_API_KEY}
  Content-Type: application/json
```

### 4. Netlify Functions (A2A Pipeline)

```yaml
endpoints:
  director: /.netlify/functions/curate-chapters
  writer: /.netlify/functions/narrate-project
  voice: /.netlify/functions/text-to-speech
  composer: /.netlify/functions/generate-music
  editor: /.netlify/functions/compile-chapter
  attribution: /.netlify/functions/generate-attribution
  publisher: /.netlify/functions/publish
  feedback: /.netlify/functions/submit-evaluation
method: POST
headers:
  Content-Type: application/json
```

---

## 🎨 DALL-E 3 IMAGE GENERATION

### Request Structure

```json
{
  "model": "dall-e-3",
  "prompt": "<USE SIR_JAMES_PROMPT_TEMPLATE>",
  "n": 1,
  "size": "1792x1024",
  "quality": "hd",
  "style": "vivid"
}
```

### Sir James Prompt Template (COPY THIS EXACTLY)

```javascript
const SIR_JAMES_IMAGE_PROMPT = (scene, action) => `
Disney Pixar 3D animation style, photorealistic CGI rendering, 
4K ultra-detailed, warm golden hour cinematic lighting, magical fantasy atmosphere, 
child-friendly, professional quality matching theatrical animation standards.

SCENE: ${scene}

CHARACTERS:
Sir James: a tiny 5-year-old boy knight with:
- BRIGHT BLUE EYES (CRITICAL - must be vivid blue, NOT green or brown)
- Sandy brown messy hair with a slight cowlick on top
- Rosy pink cheeks with an innocent sweet smile
- Very small child proportions (kindergarten age, about 3.5 feet tall)
- Royal blue medieval tunic with silver Celtic knotwork trim
- Brown leather belt with a small pouch
- Brown leather boots
- Carrying a small wooden practice sword
- Expression: curious, brave, innocent

Claude the dog: a loyal Redbone Coonhound with:
- Rich reddish-brown coat (NOT dark brown or black)
- Long floppy ears that hang past his chin
- Soulful amber-brown eyes with intelligence
- Royal blue collar with a silver heart-shaped tag
- Proud but friendly posture
- Standing protectively near Sir James

ACTION: ${action}

CRITICAL: The boy MUST look like a TINY 5-YEAR-OLD (kindergarten age) with BRIGHT BLUE EYES. 
NOT a teenager, NOT a young adult. Very small child proportions.
`;
```

### JavaScript Implementation

```javascript
const generateSirJamesImage = async (scene, action) => {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: SIR_JAMES_IMAGE_PROMPT(scene, action),
      n: 1,
      size: '1792x1024',
      quality: 'hd',
      style: 'vivid'
    })
  });
  
  const data = await response.json();
  return data.data[0].url; // Returns image URL
};

// Usage:
// const imageUrl = await generateSirJamesImage(
//   "Crystal cave with glowing blue and purple gems",
//   "Sir James reaching toward a glowing crystal while Claude watches protectively"
// );
```

---

## 🎙️ ELEVENLABS VOICE SYNTHESIS

### Voice ID Registry

```javascript
const VOICE_IDS = {
  SIR_JAMES: 'SOYHLrjzK2X1ezoPC6cr',  // Harry (young boy)
  NARRATOR:  'XrExE9yKIg1WjnnlVkGX',  // Matilda (female narrator)
  GRAMPS:    'pqHfZKP75CvOlQylNhV4',  // Bill (elderly male)
  KING_ARTHUR: 'JBFqnCBsd6RMkjVDRZzb' // George (British male)
};
```

### Request Structure

```json
{
  "text": "<dialogue or narration text>",
  "model_id": "eleven_multilingual_v2",
  "voice_settings": {
    "stability": 0.5,
    "similarity_boost": 0.75,
    "style": 0.5,
    "use_speaker_boost": true
  }
}
```

### JavaScript Implementation

```javascript
const generateVoice = async (text, character) => {
  const voiceId = VOICE_IDS[character.toUpperCase()] || VOICE_IDS.NARRATOR;
  
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5,
        use_speaker_boost: true
      }
    })
  });
  
  // Returns audio buffer
  const audioBuffer = await response.arrayBuffer();
  return audioBuffer;
};

// Usage:
// const audio = await generateVoice(
//   "The young knight gazed at the forest path ahead...",
//   "NARRATOR"
// );
```

---

## 🎬 A2A PIPELINE SEQUENCE

### Sequential Flow (MUST FOLLOW THIS ORDER)

```text
1. Director    → Selects chapters/scenes based on parent input
2. Writer      → Generates dialogue for selected scenes
3. Voice       → Synthesizes audio from dialogue
4. Composer    → Creates background music
5. Editor      → Assembles HTML with assets
6. Attribution → Adds Commons Good credits
7. Publisher   → Deploys to Netlify
```

### Pipeline Orchestrator

```javascript
const runA2APipeline = async (parentRequest) => {
  const telemetry = { startTime: Date.now(), steps: [] };
  
  try {
    // Step 1: Director
    console.log('[A2A] Starting Director Agent...');
    const directorOutput = await callAgent('curate-chapters', parentRequest);
    telemetry.steps.push({ agent: 'director', duration: Date.now() - telemetry.startTime });
    
    // Step 2: Writer
    console.log('[A2A] Starting Writer Agent...');
    const writerOutput = await callAgent('narrate-project', {
      chapters: directorOutput.selectedChapters,
      mood: directorOutput.mood
    });
    telemetry.steps.push({ agent: 'writer', duration: Date.now() - telemetry.startTime });
    
    // Step 3: Voice
    console.log('[A2A] Starting Voice Agent...');
    const voiceOutput = await callAgent('text-to-speech', {
      dialogues: writerOutput.dialogues
    });
    telemetry.steps.push({ agent: 'voice', duration: Date.now() - telemetry.startTime });
    
    // Step 4: Composer
    console.log('[A2A] Starting Composer Agent...');
    const composerOutput = await callAgent('generate-music', {
      mood: directorOutput.mood,
      chapters: directorOutput.selectedChapters
    });
    telemetry.steps.push({ agent: 'composer', duration: Date.now() - telemetry.startTime });
    
    // Step 5: Editor
    console.log('[A2A] Starting Editor Agent...');
    const editorOutput = await callAgent('compile-chapter', {
      scenes: writerOutput.scenes,
      audio: voiceOutput.audioFiles,
      music: composerOutput.musicFiles
    });
    telemetry.steps.push({ agent: 'editor', duration: Date.now() - telemetry.startTime });
    
    // Step 6: Attribution
    console.log('[A2A] Starting Attribution Agent...');
    const attributionOutput = await callAgent('generate-attribution', {
      agents: ['director', 'writer', 'voice', 'composer', 'editor'],
      costs: calculateCosts(telemetry)
    });
    telemetry.steps.push({ agent: 'attribution', duration: Date.now() - telemetry.startTime });
    
    // Step 7: Publisher
    console.log('[A2A] Starting Publisher Agent...');
    const publisherOutput = await callAgent('publish', {
      htmlFiles: editorOutput.htmlFiles,
      credits: attributionOutput.credits
    });
    telemetry.steps.push({ agent: 'publisher', duration: Date.now() - telemetry.startTime });
    
    // Log complete telemetry
    telemetry.totalDuration = Date.now() - telemetry.startTime;
    console.log('[A2A] Pipeline complete!', telemetry);
    
    return {
      success: true,
      storyUrl: publisherOutput.deployUrl,
      telemetry: telemetry
    };
    
  } catch (error) {
    console.error('[A2A] Pipeline failed:', error);
    return {
      success: false,
      error: error.message,
      telemetry: telemetry
    };
  }
};

const callAgent = async (agentName, payload) => {
  const response = await fetch(`/.netlify/functions/${agentName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    throw new Error(`Agent ${agentName} failed: ${response.status}`);
  }
  
  return response.json();
};
```

---

## 📊 VIRTUE TRACKING API

### localStorage Schema

```javascript
// sj:choices - Array of virtue choice records
{
  "book": "Book003",
  "chapter": 1,
  "scene": 3,
  "virtue": "courage",
  "label": "Declare readiness for any challenge!",
  "timestamp": "2025-12-31T12:00:00Z",
  "session_id": "sj-1735646400-abc123xyz"
}

// sj:progress - Object tracking chapter completion
{
  "chapter1": { "completed": true, "timestamp": "2025-12-31T12:30:00Z" },
  "chapter2": { "completed": false }
}

// sj:virtues - Object with virtue counts
{
  "courage": 5,
  "wisdom": 3,
  "trust": 2
}

// sj:session_id - Unique session identifier
"sj-1735646400-abc123xyz"
```

### Virtue Logging Function (COPY THIS)

```javascript
const logVirtue = (chapter, scene, virtue, label) => {
  // Get existing choices
  const choices = JSON.parse(localStorage.getItem('sj:choices') || '[]');
  
  // Add new choice
  choices.push({
    book: 'Book003',
    chapter: chapter,
    scene: scene,
    virtue: virtue,
    label: label,
    timestamp: new Date().toISOString(),
    session_id: getSessionId()
  });
  
  // Save back
  localStorage.setItem('sj:choices', JSON.stringify(choices));
  
  // Update virtue counts
  const virtues = JSON.parse(localStorage.getItem('sj:virtues') || '{}');
  virtues[virtue] = (virtues[virtue] || 0) + 1;
  localStorage.setItem('sj:virtues', JSON.stringify(virtues));
  
  return { success: true, totalChoices: choices.length };
};

const getSessionId = () => {
  let id = localStorage.getItem('sj:session_id');
  if (!id) {
    id = `sj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sj:session_id', id);
  }
  return id;
};
```

---

## 🔄 FEEDBACK LOOP API

### Request Structure

```json
{
  "type": "positive",
  "theme": "courage",
  "situation": "My child struggles with sharing...",
  "timestamp": "2025-12-31T12:00:00Z",
  "virtues": { "courage": 5, "wisdom": 3 },
  "session_id": "sj-1735646400-abc123xyz"
}
```

### Response Structure

```json
{
  "success": true,
  "message": "Feedback recorded for learning loop",
  "learningApplied": "reinforce"
}
```

### Implementation

```javascript
const submitFeedback = async (type, context) => {
  const payload = {
    type: type,
    theme: context.theme,
    situation: context.situation,
    timestamp: new Date().toISOString(),
    virtues: JSON.parse(localStorage.getItem('sj:virtues') || '{}'),
    session_id: localStorage.getItem('sj:session_id')
  };
  
  const response = await fetch('/.netlify/functions/submit-evaluation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  return response.json();
};

// Usage:
// await submitFeedback('positive', { theme: 'courage', situation: 'sharing toys' });
```

---

## 💰 COST TRACKING API

### Cost Constants

```javascript
const API_COSTS = {
  DALL_E_3_HD: 0.04,              // Per image (1792x1024)
  ELEVENLABS_PER_CHAR: 0.000015,  // Per character
  GPT4_TURBO_INPUT: 0.01,         // Per 1K tokens
  GPT4_TURBO_OUTPUT: 0.03,        // Per 1K tokens
  SUNO_GENERATION: 0.10           // Per music generation
};
```

### Cost Calculator

```javascript
const calculatePipelineCost = (scenes) => {
  const costs = {
    images: scenes * API_COSTS.DALL_E_3_HD,
    voice: scenes * 500 * API_COSTS.ELEVENLABS_PER_CHAR,  // ~500 chars/scene
    prompts: scenes * 0.2 * API_COSTS.GPT4_TURBO_INPUT,   // ~200 tokens/scene
    music: API_COSTS.SUNO_GENERATION
  };
  
  costs.total = Object.values(costs).reduce((a, b) => a + b, 0);
  
  return {
    breakdown: costs,
    formatted: `$${costs.total.toFixed(2)}`,
    underBudget: costs.total < 1.00  // Target: < $1/chapter
  };
};

// Usage:
// const cost = calculatePipelineCost(8);
// console.log(cost.formatted);  // "$0.60"
// console.log(cost.underBudget); // true
```

---

## 🛡️ ERROR HANDLING PATTERNS

### Retry with Exponential Backoff

```javascript
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`[Retry] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Usage:
// const result = await retryWithBackoff(() => generateSirJamesImage(scene, action));
```

### Agent Error Response

```javascript
const handleAgentError = (agentName, error) => {
  return {
    success: false,
    agent: agentName,
    error: {
      message: error.message,
      code: error.code || 'UNKNOWN',
      timestamp: new Date().toISOString()
    },
    recovery: {
      canRetry: !['AUTH_FAILED', 'RATE_LIMITED'].includes(error.code),
      fallbackAvailable: agentName !== 'director'  // Director has no fallback
    }
  };
};
```

---

## 📋 ENVIRONMENT VARIABLES

### Required .env.local

```bash
# OpenAI (DALL-E 3)
OPENAI_API_KEY=sk-proj-...

# ElevenLabs (Voice)
ELEVENLABS_API_KEY=sk_...

# Suno (Music) - Optional
SUNO_API_KEY=...

# Netlify
NETLIFY_AUTH_TOKEN=...
NETLIFY_SITE_ID=...
```

### Netlify Environment Variables (Dashboard)

```bash
OPENAI_API_KEY=sk-proj-...
ELEVENLABS_API_KEY=sk_...
SUNO_API_KEY=...
```

---

## ✅ API VERIFICATION CHECKLIST

Before going live, verify each API:

```bash
# 1. Test OpenAI
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
# Expected: 200 OK with model list

# 2. Test ElevenLabs
curl https://api.elevenlabs.io/v1/voices \
  -H "xi-api-key: $ELEVENLABS_API_KEY"
# Expected: 200 OK with voice list

# 3. Test Netlify Functions (local)
netlify dev
curl -X POST http://localhost:8888/.netlify/functions/curate-chapters \
  -H "Content-Type: application/json" \
  -d '{"situation":"test","theme":"courage"}'
# Expected: 200 OK with director output
```

---

**For the Commons Good!** 🏰⚔️🐕✨

**Created**: December 31, 2025  
**Author**: Cascade AI Assistant  
**Purpose**: D2A (Documentation-to-Agent) API Reference
