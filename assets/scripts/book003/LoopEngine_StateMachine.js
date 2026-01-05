/**
 * LoopEngine State Machine
 * Sir James Adventures Book003 - Enterprise Runtime
 * 
 * THE NERVES: This is the actual runtime logic that makes loops fire.
 * 
 * Commons Good Compliance:
 * - Cost: No external API calls (all local)
 * - Attribution: Part of Sir James A2A Studio
 * - Privacy: No PII stored, only style metrics
 * 
 * @version 3.5.1
 * @author WSP001 Programming Team
 */

// ═══════════════════════════════════════════════════════════════════════════
// STATE MACHINE CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const STATES = {
  LOADING: 'LOADING',
  PLAYING_PRIME: 'PLAYING_PRIME',
  WAITING: 'WAITING',
  SUPPORT: 'SUPPORT',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
  COMPLETE: 'COMPLETE'
};

const EVENTS = {
  SCENE_LOADED: 'SCENE_LOADED',
  AUDIO_ENDED: 'AUDIO_ENDED',
  IDLE_TIMEOUT: 'IDLE_TIMEOUT',
  USER_TAP_CORRECT: 'USER_TAP_CORRECT',
  USER_TAP_WRONG: 'USER_TAP_WRONG',
  USER_CHOICE: 'USER_CHOICE',
  PARENT_OVERRIDE: 'PARENT_OVERRIDE',
  SUPPORT_ENDED: 'SUPPORT_ENDED'
};

// ═══════════════════════════════════════════════════════════════════════════
// LOOP ENGINE CLASS
// ═══════════════════════════════════════════════════════════════════════════

class LoopEngine {
  constructor(sceneData) {
    this.scene = sceneData;
    this.loop = sceneData.interaction_loop;
    this.state = STATES.LOADING;
    this.attempts = 0;
    this.hintsGiven = 0;
    this.idleTimer = null;
    this.sessionId = this.getSessionId();
    this.parentSocket = null;
    
    console.log(`[LoopEngine] Initialized for scene: ${this.scene.scene_id}`);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SESSION MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════

  getSessionId() {
    let id = localStorage.getItem('sj:session_id');
    if (!id) {
      id = `sj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('sj:session_id', id);
    }
    return id;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STATE MACHINE CORE
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Main state transition handler
   * @param {string} event - The event that triggered the transition
   * @param {object} payload - Optional data for the event
   */
  transition(event, payload = {}) {
    console.log(`[LoopEngine] Event: ${event} | Current State: ${this.state}`);

    switch (this.state) {
      case STATES.LOADING:
        if (event === EVENTS.SCENE_LOADED) {
          this.enterPlayingPrime();
        }
        break;

      case STATES.PLAYING_PRIME:
        if (event === EVENTS.AUDIO_ENDED) {
          this.enterWaiting();
        }
        break;

      case STATES.WAITING:
        if (event === EVENTS.IDLE_TIMEOUT) {
          this.enterSupport('idle');
        } else if (event === EVENTS.USER_TAP_CORRECT) {
          this.enterSuccess(payload);
        } else if (event === EVENTS.USER_TAP_WRONG) {
          this.enterSupport('error', payload);
        } else if (event === EVENTS.USER_CHOICE) {
          this.enterSuccess(payload);
        } else if (event === EVENTS.PARENT_OVERRIDE) {
          this.enterSupport('parent', payload);
        }
        break;

      case STATES.SUPPORT:
        if (event === EVENTS.SUPPORT_ENDED) {
          this.enterWaiting();
        }
        break;

      case STATES.SUCCESS:
        if (event === EVENTS.AUDIO_ENDED) {
          this.enterComplete();
        }
        break;

      default:
        console.warn(`[LoopEngine] Unhandled state: ${this.state}`);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STATE: PLAYING_PRIME
  // ═══════════════════════════════════════════════════════════════════════

  enterPlayingPrime() {
    this.state = STATES.PLAYING_PRIME;
    console.log(`[LoopEngine] STATE: PLAYING_PRIME`);

    const prompt = this.loop.primary_prompt;
    
    // Play the primary prompt audio
    this.playAudio(prompt.audio_file, () => {
      this.transition(EVENTS.AUDIO_ENDED);
    });

    // Display the prompt text
    this.displayText(prompt.actor, prompt.text);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STATE: WAITING (The "Listening" Phase)
  // ═══════════════════════════════════════════════════════════════════════

  enterWaiting() {
    this.state = STATES.WAITING;
    console.log(`[LoopEngine] STATE: WAITING`);

    // Render the UI based on type
    this.renderInteractionUI();

    // Start idle timer
    this.startIdleTimer();

    // Listen for parent socket messages
    this.listenForParentOverride();
  }

  startIdleTimer() {
    // Parse trigger like "7s_no_action" -> 7000ms
    const trigger = this.loop.states.idle_support?.trigger || '5s_no_action';
    const seconds = parseInt(trigger.match(/(\d+)s/)?.[1] || '5');
    const ms = seconds * 1000;

    console.log(`[LoopEngine] Idle timer set for ${seconds}s`);

    this.idleTimer = setTimeout(() => {
      this.transition(EVENTS.IDLE_TIMEOUT);
    }, ms);
  }

  clearIdleTimer() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  listenForParentOverride() {
    // WebSocket connection to Parent Dashboard
    // In production, this connects to your real-time service
    if (window.parentDashboardSocket) {
      window.parentDashboardSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'calm_down' || data.type === 'chat_hint') {
          this.clearIdleTimer();
          this.transition(EVENTS.PARENT_OVERRIDE, data);
        }
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STATE: SUPPORT (Idle, Error, or Parent)
  // ═══════════════════════════════════════════════════════════════════════

  enterSupport(type, payload = {}) {
    this.state = STATES.SUPPORT;
    this.hintsGiven++;
    console.log(`[LoopEngine] STATE: SUPPORT (${type}) | Hints: ${this.hintsGiven}`);

    let supportData;
    let metricFlag;

    switch (type) {
      case 'idle':
        supportData = this.loop.states.idle_support;
        metricFlag = supportData.metric_flag;
        break;

      case 'error':
        supportData = this.loop.states.error_support;
        metricFlag = supportData.metric_flag;
        this.attempts++;
        break;

      case 'parent':
        supportData = this.loop.states.parent_override;
        metricFlag = supportData.metric_flag;
        // Replace template with parent text
        if (supportData.template && payload.text) {
          supportData = {
            ...supportData,
            text: supportData.template.replace('${parent_input}', payload.text)
                                       .replace('${parent_text}', payload.text)
          };
        }
        break;
    }

    if (!supportData) {
      console.warn(`[LoopEngine] No support data for type: ${type}`);
      this.transition(EVENTS.SUPPORT_ENDED);
      return;
    }

    // Log the metric
    this.logMetric('loop_support_fired', {
      sceneId: this.scene.scene_id,
      supportType: type,
      metric_flag: metricFlag,
      hint_level: this.hintsGiven
    });

    // Play the support audio
    if (supportData.audio_file) {
      this.playAudio(supportData.audio_file, () => {
        this.transition(EVENTS.SUPPORT_ENDED);
      });
    } else {
      // No audio, just display text and continue
      setTimeout(() => {
        this.transition(EVENTS.SUPPORT_ENDED);
      }, 3000);
    }

    // Display the support text
    this.displayText(supportData.actor, supportData.text || supportData.line);

    // Visual cue: pulse the correct element
    if (supportData.visual_cue) {
      this.showVisualCue(supportData.visual_cue);
    }

    // Play SFX if specified
    if (supportData.sfx) {
      this.playSFX(supportData.sfx);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STATE: SUCCESS
  // ═══════════════════════════════════════════════════════════════════════

  enterSuccess(payload) {
    this.state = STATES.SUCCESS;
    this.clearIdleTimer();
    console.log(`[LoopEngine] STATE: SUCCESS | Attempts: ${this.attempts}`);

    const successData = this.loop.states.success;
    
    // Determine which line to play: fast (mastery) or slow (persistence)
    let lineData;
    if (this.attempts === 0) {
      // First try = mastery
      lineData = successData.lines?.fast || { text: successData.line_fast };
      this.logMetric('loop_celebration', {
        sceneId: this.scene.scene_id,
        celebrationType: 'mastery',
        attempts: this.attempts,
        hintsGiven: this.hintsGiven
      });
    } else {
      // Multiple tries = persistence
      lineData = successData.lines?.slow || { text: successData.line_slow };
      this.logMetric('loop_celebration', {
        sceneId: this.scene.scene_id,
        celebrationType: 'persistence',
        attempts: this.attempts,
        hintsGiven: this.hintsGiven
      });
    }

    // Log the choice/answer
    if (payload.choiceId) {
      const mapping = successData.metric_mapping?.[payload.choiceId];
      this.logMetric('choice_made', {
        sceneId: this.scene.scene_id,
        choiceId: payload.choiceId,
        styleMapping: mapping,
        attempts: this.attempts
      });
    }

    if (successData.metric_score) {
      this.logMetric('skill_score', {
        sceneId: this.scene.scene_id,
        skill: successData.metric_score,
        attempts: this.attempts,
        hintsGiven: this.hintsGiven
      });
    }

    // Play success audio
    if (lineData.audio_file) {
      this.playAudio(lineData.audio_file, () => {
        this.transition(EVENTS.AUDIO_ENDED);
      });
    } else {
      setTimeout(() => {
        this.transition(EVENTS.AUDIO_ENDED);
      }, 2000);
    }

    // Display success text
    this.displayText(lineData.actor || 'Sir James', lineData.text);

    // Show celebration animation
    this.showCelebration();
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STATE: COMPLETE
  // ═══════════════════════════════════════════════════════════════════════

  enterComplete() {
    this.state = STATES.COMPLETE;
    console.log(`[LoopEngine] STATE: COMPLETE`);

    // Log scene completion
    this.logMetric('scene_complete', {
      sceneId: this.scene.scene_id,
      totalAttempts: this.attempts,
      totalHints: this.hintsGiven
    });

    // Route to next scene
    const routing = this.scene.routing;
    if (routing.on_complete === 'chapter_complete') {
      this.completeChapter();
    } else {
      this.navigateToScene(routing.on_complete);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // UI RENDERING
  // ═══════════════════════════════════════════════════════════════════════

  renderInteractionUI() {
    const container = document.getElementById('interaction-container');
    if (!container) return;

    const uiType = this.loop.ui_type;
    const options = this.loop.options;

    switch (uiType) {
      case 'choice_binary':
        container.innerHTML = this.renderChoiceButtons(options);
        break;

      case 'tap_object':
        container.innerHTML = this.renderTapObjects(options);
        break;

      case 'emotion_selector':
        container.innerHTML = this.renderEmotionSelector(options);
        break;

      case 'virtue_selector':
        container.innerHTML = this.renderVirtueSelector(options);
        break;

      default:
        console.warn(`[LoopEngine] Unknown UI type: ${uiType}`);
    }
  }

  renderChoiceButtons(options) {
    return `
      <div class="choice-container">
        ${options.map(opt => `
          <button 
            class="choice-btn" 
            data-choice-id="${opt.id}"
            onclick="loopEngine.handleChoice('${opt.id}')"
          >
            ${opt.label}
          </button>
        `).join('')}
      </div>
    `;
  }

  renderTapObjects(options) {
    return `
      <div class="tap-container">
        ${options.map(opt => `
          <div 
            class="tap-object" 
            data-object-id="${opt.id}"
            data-correct="${opt.correct}"
            onclick="loopEngine.handleTap('${opt.id}', ${opt.correct})"
          >
            ${opt.label}
          </div>
        `).join('')}
      </div>
    `;
  }

  renderEmotionSelector(options) {
    return `
      <div class="emotion-container">
        ${options.map(opt => `
          <button 
            class="emotion-btn" 
            data-emotion-id="${opt.id}"
            onclick="loopEngine.handleChoice('${opt.id}')"
          >
            <span class="emoji">${opt.emoji}</span>
            <span class="label">${opt.label}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  renderVirtueSelector(options) {
    return `
      <div class="virtue-container">
        ${options.map(opt => `
          <button 
            class="virtue-btn" 
            data-virtue-id="${opt.id}"
            onclick="loopEngine.handleChoice('${opt.id}')"
          >
            <span class="label">${opt.label}</span>
            <span class="description">${opt.description}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // USER INPUT HANDLERS
  // ═══════════════════════════════════════════════════════════════════════

  handleChoice(choiceId) {
    console.log(`[LoopEngine] User choice: ${choiceId}`);
    this.clearIdleTimer();
    this.transition(EVENTS.USER_CHOICE, { choiceId });
  }

  handleTap(objectId, isCorrect) {
    console.log(`[LoopEngine] User tap: ${objectId} | Correct: ${isCorrect}`);
    this.clearIdleTimer();

    if (isCorrect) {
      this.transition(EVENTS.USER_TAP_CORRECT, { objectId });
    } else {
      this.transition(EVENTS.USER_TAP_WRONG, { objectId });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // AUDIO & VISUAL HELPERS
  // ═══════════════════════════════════════════════════════════════════════

  playAudio(audioFile, onEnd) {
    if (!audioFile) {
      if (onEnd) onEnd();
      return;
    }

    const audio = new Audio(audioFile);
    audio.onended = onEnd;
    audio.onerror = () => {
      console.warn(`[LoopEngine] Audio failed: ${audioFile}`);
      if (onEnd) onEnd();
    };
    audio.play().catch(e => {
      console.warn(`[LoopEngine] Audio play error:`, e);
      if (onEnd) onEnd();
    });
  }

  playSFX(sfxId) {
    const sfxMap = {
      'dog_sniff': 'assets/audio/sfx/dog_sniff.mp3',
      'dog_whine': 'assets/audio/sfx/dog_whine.mp3',
      'sparky_zap': 'assets/audio/sfx/sparky_zap.mp3',
      'sparky_zoom': 'assets/audio/sfx/sparky_zoom.mp3',
      'log_boom': 'assets/audio/sfx/log_boom.mp3'
    };

    const path = sfxMap[sfxId];
    if (path) {
      const audio = new Audio(path);
      audio.play().catch(e => console.warn('SFX error:', e));
    }
  }

  displayText(actor, text) {
    const textEl = document.getElementById('narration-text');
    const actorEl = document.getElementById('actor-name');
    
    if (textEl) textEl.textContent = text;
    if (actorEl) actorEl.textContent = actor;
  }

  showVisualCue(cueDescription) {
    // Add CSS class to trigger pulse animation
    const container = document.getElementById('interaction-container');
    if (container) {
      container.classList.add('visual-cue-active');
      setTimeout(() => {
        container.classList.remove('visual-cue-active');
      }, 3000);
    }
  }

  showCelebration() {
    const container = document.getElementById('celebration-container');
    if (container) {
      container.classList.add('celebrating');
      setTimeout(() => {
        container.classList.remove('celebrating');
      }, 2000);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // METRICS & LOGGING
  // ═══════════════════════════════════════════════════════════════════════

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

    // Send to backend
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
      console.warn('[LoopEngine] Metric send failed:', e);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // NAVIGATION
  // ═══════════════════════════════════════════════════════════════════════

  navigateToScene(sceneId) {
    console.log(`[LoopEngine] Navigating to: ${sceneId}`);
    // Convert scene ID to URL path
    const path = sceneId.replace(/_/g, '/').replace('ch', 'chapter');
    window.location.href = `/${path}/`;
  }

  completeChapter() {
    console.log(`[LoopEngine] Chapter complete!`);
    const nextChapter = this.scene.routing.next_chapter;
    
    // Log chapter completion
    this.logMetric('chapter_complete', {
      chapterId: this.scene.scene_id.split('_')[0],
      totalScenes: 5
    });

    // Show chapter complete UI
    const container = document.getElementById('interaction-container');
    if (container) {
      container.innerHTML = `
        <div class="chapter-complete">
          <h2>🎉 Chapter Complete!</h2>
          <p>Great job, Sir James!</p>
          <button onclick="window.location.href='/${nextChapter}/'">
            Next Chapter →
          </button>
        </div>
      `;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Start the scene - call this when the page loads
   */
  start() {
    console.log(`[LoopEngine] Starting scene: ${this.scene.scene_id}`);
    this.transition(EVENTS.SCENE_LOADED);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

// Export for use in scene pages
window.LoopEngine = LoopEngine;

// Usage example:
// const sceneData = await fetch('/chapter01/scene01.json').then(r => r.json());
// const loopEngine = new LoopEngine(sceneData);
// loopEngine.start();
