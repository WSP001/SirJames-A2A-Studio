# 🎮 RUNTIME IMPLEMENTATION GUIDE
## Sir James Adventures Book003 - Loop System Integration

> **Version:** 3.5.1  
> **For:** Engineers, Frontend Devs, Backend Devs  
> **Purpose:** Wire scene loops → Parent Dashboard metrics

---

## 📋 OVERVIEW

This guide explains how to implement the **event-driven loop system** that connects:

```
┌─────────────────────────────────────────────────────────────────┐
│                    RUNTIME FLOW DIAGRAM                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   scene_manifest.json ──────► Scene Engine ──────► Child UI     │
│          │                        │                    │        │
│          │                        │                    │        │
│          ▼                        ▼                    ▼        │
│   narration_loops.json ◄───── Loop Engine ◄───── User Events   │
│          │                        │                    │        │
│          │                        │                    │        │
│          ▼                        ▼                    ▼        │
│   Audio Files ◄───────────── Metric Logger ──► Parent Dashboard │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 CORE ENGINE CLASS

### `LoopEngine.js`

```javascript
/**
 * LoopEngine - Handles all interaction loops for Sir James scenes
 * 
 * Commons Good Compliance:
 * - Cost: No external API calls (all local)
 * - Attribution: Part of Sir James A2A Studio
 * - Privacy: No PII stored, only style metrics
 */
class LoopEngine {
  constructor(sceneManifest, narrationLoops) {
    this.manifest = sceneManifest;
    this.narration = narrationLoops;
    this.attempts = 0;
    this.idleTimer = null;
    this.loopsFired = [];
    this.sessionId = localStorage.getItem('sj:session_id') || this.generateSessionId();
  }

  generateSessionId() {
    const id = `sj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sj:session_id', id);
    return id;
  }

  // ═══════════════════════════════════════════════════════════════
  // SCENE LIFECYCLE
  // ═══════════════════════════════════════════════════════════════

  async startScene() {
    console.log(`[LoopEngine] Starting scene: ${this.manifest.id}`);
    
    // 1. Play base narration
    await this.playBaseNarration();
    
    // 2. Show child UI
    this.renderChildUI();
    
    // 3. Start idle timer
    this.startIdleTimer();
    
    // 4. Log scene start
    this.logMetric('scene_started', {
      sceneId: this.manifest.id,
      chapter: this.manifest.chapter,
      mode: this.manifest.mode
    });
  }

  async playBaseNarration() {
    const base = this.narration.base;
    
    // Play narrator lines
    for (const line of base.narrator || []) {
      await this.playLine('narrator', line);
    }
    
    // Play character lines
    for (const line of base.sir_james || []) {
      await this.playLine('sir_james', line);
    }
    
    for (const line of base.gramps || []) {
      await this.playLine('gramps', line);
    }
  }

  renderChildUI() {
    const ui = this.manifest.child_ui;
    const container = document.getElementById('interaction-container');
    
    if (ui.interaction_type === 'choice_buttons') {
      container.innerHTML = this.renderChoiceButtons(ui);
    } else if (ui.interaction_type === 'tap_word') {
      container.innerHTML = this.renderTapWords(ui);
    }
    // Add more UI types as needed
  }

  // ═══════════════════════════════════════════════════════════════
  // IDLE TIMER SYSTEM
  // ═══════════════════════════════════════════════════════════════

  startIdleTimer() {
    const idleSupport = this.manifest.loops?.support?.find(s => s.trigger.startsWith('timer_'));
    if (!idleSupport) return;
    
    const seconds = parseInt(idleSupport.trigger.replace('timer_', '').replace('s', ''));
    
    this.idleTimer = setTimeout(() => {
      this.fireIdleSupport(idleSupport);
    }, seconds * 1000);
    
    console.log(`[LoopEngine] Idle timer set for ${seconds}s`);
  }

  clearIdleTimer() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  async fireIdleSupport(support) {
    console.log(`[LoopEngine] Firing idle support: ${support.id}`);
    
    // Get the narration line
    const loopLine = this.narration.loops[support.line_id];
    if (!loopLine) {
      console.warn(`[LoopEngine] Loop line not found: ${support.line_id}`);
      return;
    }
    
    // Play the support line
    await this.playLoopLine(loopLine);
    
    // Log the metric
    this.logMetric('loop_support_fired', {
      sceneId: this.manifest.id,
      loopId: support.id,
      actor: support.actor,
      metric_flag: support.metric_flag,
      trigger: support.trigger
    });
    
    this.loopsFired.push(support.id);
    
    // Restart idle timer (with longer delay)
    this.startIdleTimer();
  }

  // ═══════════════════════════════════════════════════════════════
  // CHOICE HANDLING
  // ═══════════════════════════════════════════════════════════════

  async handleChoice(choiceId) {
    this.clearIdleTimer();
    this.attempts++;
    
    console.log(`[LoopEngine] Choice made: ${choiceId} (attempt ${this.attempts})`);
    
    const choice = this.manifest.child_ui.choices.find(c => c.id === choiceId);
    if (!choice) return;
    
    // Check for risk/error support loops
    const riskSupport = this.manifest.loops?.support?.find(s => 
      s.trigger === `choice_${choiceId}_first` && this.attempts === 1
    );
    
    if (riskSupport) {
      await this.fireRiskSupport(riskSupport);
      return; // Let child reconsider
    }
    
    // Check for repeated risk
    const repeatSupport = this.manifest.loops?.support?.find(s =>
      s.trigger === `choice_${choiceId}_multiple` && this.attempts > 1
    );
    
    if (repeatSupport) {
      await this.fireRiskSupport(repeatSupport);
    }
    
    // Process the choice
    await this.processChoice(choice);
  }

  async fireRiskSupport(support) {
    const loopLine = this.narration.loops[support.line_id];
    if (loopLine) {
      await this.playLoopLine(loopLine);
    }
    
    this.logMetric('loop_support_fired', {
      sceneId: this.manifest.id,
      loopId: support.id,
      actor: support.actor,
      metric_flag: support.metric_flag,
      trigger: support.trigger
    });
    
    this.loopsFired.push(support.id);
  }

  async processChoice(choice) {
    // Find matching celebration
    const celebrations = this.manifest.loops?.celebration || {};
    let celebrationKey = null;
    let celebration = null;
    
    for (const [key, cel] of Object.entries(celebrations)) {
      // Evaluate condition (simplified - real impl would use proper parser)
      const condition = cel.condition;
      if (condition.includes(choice.id) || 
          (condition.includes('attempts == 1') && this.attempts === 1) ||
          (condition.includes('attempts > 1') && this.attempts > 1)) {
        celebrationKey = key;
        celebration = cel;
        break;
      }
    }
    
    if (celebration) {
      const loopLine = this.narration.loops[celebration.line_id];
      if (loopLine) {
        await this.playLoopLine(loopLine);
      }
      
      this.logMetric('loop_celebration', {
        sceneId: this.manifest.id,
        celebrationType: celebrationKey,
        metric_flag: celebration.metric_flag,
        choiceId: choice.id,
        styleTag: choice.style_tag,
        attempts: this.attempts
      });
    }
    
    // Log the choice
    this.logMetric('choice_made', {
      sceneId: this.manifest.id,
      choiceId: choice.id,
      styleTag: choice.style_tag,
      attempts: this.attempts,
      loopsFired: this.loopsFired
    });
    
    // Route to next scene
    this.routeToNext();
  }

  // ═══════════════════════════════════════════════════════════════
  // PARENT INJECTION
  // ═══════════════════════════════════════════════════════════════

  async handleParentInjection(parentText) {
    const injection = this.manifest.loops?.parent_injection;
    if (!injection) return;
    
    console.log(`[LoopEngine] Parent injection: "${parentText}"`);
    
    const loopLine = this.narration.loops[injection.line_id];
    if (loopLine && loopLine.template) {
      const text = loopLine.template.replace('${parent_text}', parentText);
      await this.playLine('narrator', text);
    }
    
    this.logMetric('loop_parent_injected', {
      sceneId: this.manifest.id,
      metric_flag: injection.metric_flag,
      parentTextLength: parentText.length
    });
  }

  handleParentControl(controlId, value) {
    console.log(`[LoopEngine] Parent control: ${controlId} = ${value}`);
    
    // Store in session
    const controls = JSON.parse(localStorage.getItem('sj:parent_controls') || '{}');
    controls[controlId] = value;
    localStorage.setItem('sj:parent_controls', JSON.stringify(controls));
    
    // Special handling for calm button
    if (controlId === 'calm_tone_button' && value) {
      this.handleParentInjection('Take a deep breath. You\'re doing great.');
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // AUDIO PLAYBACK
  // ═══════════════════════════════════════════════════════════════

  async playLine(actor, text) {
    // In production, this would play pre-recorded audio
    // For now, we'll use a placeholder
    console.log(`[${actor.toUpperCase()}]: ${text}`);
    
    // Show text in UI
    const textDisplay = document.getElementById('narration-text');
    if (textDisplay) {
      textDisplay.textContent = text;
      textDisplay.dataset.actor = actor;
    }
    
    // Simulate audio duration
    await this.delay(text.length * 50); // ~50ms per character
  }

  async playLoopLine(loopLine) {
    const text = loopLine.text || loopLine.template;
    await this.playLine(loopLine.actor.toLowerCase(), text);
    
    // Play SFX if specified
    if (loopLine.sfx) {
      this.playSFX(loopLine.sfx);
    }
  }

  playSFX(sfxId) {
    const sfxMap = {
      'dog_sniff': 'assets/audio/sfx/dog-sniff.mp3',
      'dog_bark': 'assets/audio/sfx/dog-bark.mp3',
      'dog_happy_bark': 'assets/audio/sfx/dog-happy.mp3',
      'dog_alert': 'assets/audio/sfx/dog-alert.mp3',
      'sparky_zap': 'assets/audio/sfx/sparky-zap.mp3',
      'dog_curious': 'assets/audio/sfx/dog-whine.mp3',
      'dog_paw_clap': 'assets/audio/sfx/paw-clap.mp3'
    };
    
    const audioPath = sfxMap[sfxId];
    if (audioPath) {
      const audio = new Audio(audioPath);
      audio.play().catch(e => console.warn('SFX play failed:', e));
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // METRICS & LOGGING
  // ═══════════════════════════════════════════════════════════════

  logMetric(eventType, data) {
    const metric = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      eventType,
      ...data
    };
    
    console.log('[METRIC]', metric);
    
    // Store locally
    const metrics = JSON.parse(localStorage.getItem('sj:metrics') || '[]');
    metrics.push(metric);
    localStorage.setItem('sj:metrics', JSON.stringify(metrics));
    
    // Send to backend (if available)
    this.sendMetricToBackend(metric);
  }

  async sendMetricToBackend(metric) {
    try {
      await fetch('/.netlify/functions/scene-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric)
      });
    } catch (e) {
      console.warn('Failed to send metric to backend:', e);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ROUTING
  // ═══════════════════════════════════════════════════════════════

  routeToNext() {
    const routing = this.manifest.routing;
    const nextScene = routing.on_complete || routing.on_success;
    
    if (nextScene) {
      console.log(`[LoopEngine] Routing to: ${nextScene}`);
      window.location.href = `/${nextScene.replace(/_/g, '/')}/`;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  renderChoiceButtons(ui) {
    return `
      <div class="choice-prompt">${ui.prompt_text}</div>
      <div class="choice-buttons">
        ${ui.choices.map(c => `
          <button 
            class="choice-btn ${c.recommended ? 'recommended' : ''}"
            data-choice-id="${c.id}"
            data-style-tag="${c.style_tag}"
            onclick="loopEngine.handleChoice('${c.id}')"
          >
            ${c.label}
          </button>
        `).join('')}
      </div>
    `;
  }

  renderTapWords(ui) {
    return `
      <div class="choice-prompt">${ui.prompt_text}</div>
      <div class="tap-words">
        ${ui.choices.map(c => `
          <button 
            class="word-btn ${c.correct ? 'correct' : 'incorrect'}"
            data-word-id="${c.id}"
            onclick="loopEngine.handleWordTap('${c.id}', ${c.correct})"
          >
            ${c.label}
          </button>
        `).join('')}
      </div>
    `;
  }

  async handleWordTap(wordId, isCorrect) {
    this.clearIdleTimer();
    this.attempts++;
    
    if (!isCorrect) {
      // Fire error support
      const errorSupport = this.manifest.loops?.support?.find(s => 
        s.trigger === 'tap_wrong_word'
      );
      
      if (errorSupport) {
        const loopLine = this.narration.loops[errorSupport.line_id];
        if (loopLine) {
          await this.playLoopLine(loopLine);
        }
        
        this.logMetric('loop_support_fired', {
          sceneId: this.manifest.id,
          loopId: errorSupport.id,
          metric_flag: errorSupport.metric_flag,
          wordTapped: wordId
        });
      }
      
      // Restart idle timer
      this.startIdleTimer();
      return;
    }
    
    // Correct answer - fire celebration
    const celebrations = this.manifest.loops?.celebration || {};
    const celebrationKey = this.attempts === 1 ? 'fast_success' : 'persistence_success';
    const celebration = celebrations[celebrationKey];
    
    if (celebration) {
      const loopLine = this.narration.loops[celebration.line_id];
      if (loopLine) {
        await this.playLoopLine(loopLine);
      }
      
      this.logMetric('loop_celebration', {
        sceneId: this.manifest.id,
        celebrationType: celebrationKey,
        metric_flag: celebration.metric_flag,
        wordId,
        attempts: this.attempts
      });
    }
    
    this.routeToNext();
  }
}

// Export for use
window.LoopEngine = LoopEngine;
```

---

## 📊 BACKEND METRICS ENDPOINT

### `netlify/functions/scene-metrics.ts`

```typescript
import { Handler } from '@netlify/functions';

interface SceneMetric {
  timestamp: string;
  sessionId: string;
  eventType: string;
  sceneId: string;
  metric_flag?: string;
  choiceId?: string;
  styleTag?: string;
  attempts?: number;
  loopsFired?: string[];
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const metric: SceneMetric = JSON.parse(event.body || '{}');
    
    // Validate required fields
    if (!metric.sessionId || !metric.eventType || !metric.sceneId) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing required fields' }) 
      };
    }

    // Log to console (in production, send to analytics service)
    console.log('[SCENE_METRIC]', JSON.stringify(metric));

    // Aggregate for Parent Dashboard
    const dashboardUpdate = aggregateForDashboard(metric);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        dashboardUpdate 
      })
    };
  } catch (error) {
    console.error('Metric processing error:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Internal server error' }) 
    };
  }
};

function aggregateForDashboard(metric: SceneMetric) {
  // Build dashboard-friendly summary
  const summary: any = {
    sessionId: metric.sessionId,
    lastScene: metric.sceneId,
    lastEvent: metric.eventType
  };

  // Style tracking for survival chapters
  if (metric.styleTag) {
    summary.styleProfile = {
      tag: metric.styleTag,
      timestamp: metric.timestamp
    };
  }

  // Support usage tracking
  if (metric.eventType === 'loop_support_fired') {
    summary.supportUsed = {
      flag: metric.metric_flag,
      scene: metric.sceneId
    };
  }

  // Celebration tracking
  if (metric.eventType === 'loop_celebration') {
    summary.celebration = {
      type: metric.metric_flag,
      attempts: metric.attempts,
      scene: metric.sceneId
    };
  }

  return summary;
}
```

---

## 🎯 EVENT → LOOP → METRIC MAPPING

### Quick Reference Table

| Event | Loop Triggered | Metric Flag | Dashboard Display |
|-------|---------------|-------------|-------------------|
| `timer_5s` (no action) | `idle_support` | `attention_nudge` | "Needed a hint" |
| `timer_7s` (no action) | `idle_support` | `hesitation_baseline` | "Took time to decide" |
| `choice_rush_forward_first` | `gramps_risk_reflection` | `risk_reframed_gently` | "Chose bold path" |
| `choice_rush_forward_multiple` | `sparky_safety_reminder` | `repeated_risk_style` | "Prefers action" |
| `tap_wrong_word` | `sparky_phonics_correction` | `phonics_hint_needed` | "Learning phonics" |
| `parent_chat_or_calm_button` | `narrator_parent_injection` | `parent_reflection_used` | "Parent helped" |
| `choice == plan_first` | `sir_james_planner_success` | `strategy_teamwork_style` | "Planner style" |
| `attempts == 1` | `sir_james_fast_success` | `mastery_high` | "Quick learner" |
| `attempts > 1` | `sir_james_persistence_success` | `persistence_high` | "Persistent learner" |

---

## 🖥️ PARENT DASHBOARD INTEGRATION

### Dashboard receives these aggregated metrics:

```javascript
// Example dashboard data structure
const dashboardData = {
  sessionId: "sj_1704567890_abc123",
  childName: "Sir James",
  currentChapter: 3,
  currentScene: "ch3_sc3_mist_corridor",
  
  // Style Profile (Survival Chapters 1-5)
  styleProfile: {
    planning_vs_rushing: {
      planner_team: 4,      // times chose planning
      bold_risk: 2,         // times chose rushing
      social_consult: 3     // times asked team
    },
    support_usage: {
      claude_hints: 5,
      gramps_guidance: 2,
      sparky_reminders: 1,
      parent_injections: 3
    }
  },
  
  // Literacy Profile (Chapters 6-10)
  literacyProfile: {
    direction_words: { mastery: 0.85, attempts_avg: 1.2 },
    word_families: { mastery: 0.72, attempts_avg: 1.8 },
    blends: { mastery: 0.65, attempts_avg: 2.1 },
    sentences: { mastery: 0.58, attempts_avg: 2.5 }
  },
  
  // Virtue Tracking
  virtues: {
    courage: 12,
    wisdom: 8,
    trust: 6,
    kindness: 4
  },
  
  // Parent Prompts (suggested discussion topics)
  parentPrompts: [
    "Ask: When do we make a plan at home before we do something?",
    "Practice: Point to things that are UP and things that are DOWN."
  ]
};
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Frontend Team
- [ ] Implement `LoopEngine` class
- [ ] Wire idle timer system
- [ ] Handle choice button clicks
- [ ] Handle word tap interactions
- [ ] Play loop audio lines
- [ ] Send metrics to backend
- [ ] Display parent injection text

### Backend Team
- [ ] Create `scene-metrics.ts` endpoint
- [ ] Aggregate metrics for dashboard
- [ ] Store session data
- [ ] Expose dashboard API

### Audio Team
- [ ] Record all loop lines per scene
- [ ] Name files matching `line_id` values
- [ ] Include SFX files

### QA Team
- [ ] Test idle timer triggers
- [ ] Test error correction loops
- [ ] Test parent injection flow
- [ ] Verify metrics logging
- [ ] Test on iPad + Android

---

**For the Commons Good!** 🏰⚔️🐕✨
