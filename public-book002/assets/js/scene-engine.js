/**
 * Sir James Adventures - Scene Engine v1.0
 * Shared JS module for all chapter pages
 * 
 * Features:
 * - Scene navigation (showScene, nextScene, prevScene)
 * - Virtue choice tracking (makeChoice)
 * - Audio playback (single Play/Pause button)
 * - Chapter completion (completeChapter)
 * - localStorage persistence
 * 
 * Commons Good Compliance:
 * - Age-appropriate UX (5-year-old friendly)
 * - 48px+ touch targets
 * - Clear, predictable navigation
 */

(function() {
  'use strict';

  // ============================================================
  // CONFIGURATION
  // ============================================================
  
  const STORAGE_KEYS = {
    choices: 'sj:choices',
    progress: 'sj:progress',
    virtues: 'sj:virtues',
    sessionId: 'sj:session_id'
  };

  const BOOK_VERSION = 'Book002';

  // ============================================================
  // SESSION MANAGEMENT
  // ============================================================

  function getSessionId() {
    let sessionId = sessionStorage.getItem(STORAGE_KEYS.sessionId);
    if (!sessionId) {
      sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem(STORAGE_KEYS.sessionId, sessionId);
    }
    return sessionId;
  }

  // ============================================================
  // VIRTUE TRACKING
  // ============================================================

  function getVirtues() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.virtues);
      return stored ? JSON.parse(stored) : { courage: 0, wisdom: 0, trust: 0 };
    } catch (e) {
      return { courage: 0, wisdom: 0, trust: 0 };
    }
  }

  function saveVirtues(virtues) {
    localStorage.setItem(STORAGE_KEYS.virtues, JSON.stringify(virtues));
  }

  function incrementVirtue(virtue) {
    const virtues = getVirtues();
    if (virtues.hasOwnProperty(virtue)) {
      virtues[virtue]++;
      saveVirtues(virtues);
    }
    return virtues;
  }

  function updateVirtueDisplay() {
    const virtues = getVirtues();
    const display = document.getElementById('virtue-display');
    if (display) {
      display.innerHTML = `
        <span class="virtue-badge courage">💎 Courage: ${virtues.courage}</span>
        <span class="virtue-badge wisdom">🥇 Wisdom: ${virtues.wisdom}</span>
        <span class="virtue-badge trust">🏅 Trust: ${virtues.trust}</span>
      `;
    }
  }

  // ============================================================
  // CHOICE LOGGING
  // ============================================================

  function logChoice(chapter, scene, virtue, label) {
    const choice = {
      book: BOOK_VERSION,
      chapter: chapter,
      scene: scene,
      virtue: virtue,
      label: label,
      timestamp: new Date().toISOString(),
      session_id: getSessionId()
    };

    // Get existing choices
    let choices = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.choices);
      choices = stored ? JSON.parse(stored) : [];
    } catch (e) {
      choices = [];
    }

    // Add new choice
    choices.push(choice);
    localStorage.setItem(STORAGE_KEYS.choices, JSON.stringify(choices));

    // Increment virtue counter
    incrementVirtue(virtue);
    updateVirtueDisplay();

    console.log('Choice logged:', choice);
    return choice;
  }

  // ============================================================
  // SCENE NAVIGATION
  // ============================================================

  let currentSceneIndex = 0;
  let totalScenes = 0;
  let chapterNumber = 1;

  function initScenes(chapter, sceneCount) {
    chapterNumber = chapter;
    totalScenes = sceneCount;
    currentSceneIndex = 0;
    
    // Hide all scenes except first
    const scenes = document.querySelectorAll('.scene');
    scenes.forEach((scene, idx) => {
      scene.style.display = idx === 0 ? 'block' : 'none';
    });

    updateNavigationButtons();
    updateVirtueDisplay();
  }

  function showScene(sceneId) {
    const scenes = document.querySelectorAll('.scene');
    scenes.forEach(scene => {
      scene.style.display = scene.id === sceneId ? 'block' : 'none';
    });

    // Update current index
    const targetScene = document.getElementById(sceneId);
    if (targetScene) {
      currentSceneIndex = Array.from(scenes).indexOf(targetScene);
    }

    updateNavigationButtons();
    
    // Stop any playing audio
    const audios = document.querySelectorAll('audio');
    audios.forEach(a => a.pause());
  }

  function nextScene() {
    const scenes = document.querySelectorAll('.scene');
    if (currentSceneIndex < scenes.length - 1) {
      currentSceneIndex++;
      scenes.forEach((scene, idx) => {
        scene.style.display = idx === currentSceneIndex ? 'block' : 'none';
      });
      updateNavigationButtons();
    }
  }

  function prevScene() {
    const scenes = document.querySelectorAll('.scene');
    if (currentSceneIndex > 0) {
      currentSceneIndex--;
      scenes.forEach((scene, idx) => {
        scene.style.display = idx === currentSceneIndex ? 'block' : 'none';
      });
      updateNavigationButtons();
    }
  }

  function updateNavigationButtons() {
    const scenes = document.querySelectorAll('.scene');
    const prevBtn = document.getElementById('prev-scene-btn');
    const nextBtn = document.getElementById('next-scene-btn');
    const completeSection = document.getElementById('chapter-complete');

    if (prevBtn) {
      prevBtn.style.display = currentSceneIndex > 0 ? 'inline-block' : 'none';
    }

    if (nextBtn) {
      nextBtn.style.display = currentSceneIndex < scenes.length - 1 ? 'inline-block' : 'none';
    }

    // Show chapter complete section on last scene
    if (completeSection) {
      completeSection.style.display = currentSceneIndex === scenes.length - 1 ? 'block' : 'none';
    }
  }

  // ============================================================
  // CHOICE HANDLING
  // ============================================================

  function makeChoice(virtue, nextSceneId, label) {
    // Log the choice
    logChoice(chapterNumber, currentSceneIndex + 1, virtue, label);

    // Navigate to next scene
    if (nextSceneId) {
      showScene(nextSceneId);
    } else {
      nextScene();
    }
  }

  function continueStory(nextSceneId) {
    if (nextSceneId) {
      showScene(nextSceneId);
    } else {
      nextScene();
    }
  }

  // ============================================================
  // CHAPTER COMPLETION
  // ============================================================

  function completeChapter(chapterNum) {
    // Save progress
    let progress = {};
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.progress);
      progress = stored ? JSON.parse(stored) : {};
    } catch (e) {
      progress = {};
    }

    progress[`chapter${chapterNum}`] = {
      completed: true,
      completedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));

    console.log(`Chapter ${chapterNum} completed!`);
  }

  function goToNextChapter(currentChapter) {
    completeChapter(currentChapter);
    const nextChapter = currentChapter + 1;
    if (nextChapter <= 10) {
      window.location.href = `../chapter${String(nextChapter).padStart(2, '0')}/scene-001/index.html`;
    } else {
      // All chapters complete - go to celebration or dashboard
      window.location.href = '../../index.html';
    }
  }

  function goToChapterList() {
    window.location.href = '../../index.html';
  }

  // ============================================================
  // AUDIO PLAYBACK (Single Play/Pause Button)
  // ============================================================

  function initAudioPlayer(audioId, buttonId) {
    const audio = document.getElementById(audioId);
    const btn = document.getElementById(buttonId);

    if (!audio || !btn) return;

    btn.addEventListener('click', function() {
      if (audio.paused) {
        audio.play();
        btn.textContent = '⏸ Pause';
        btn.classList.add('playing');
      } else {
        audio.pause();
        btn.textContent = '🔊 Play Story';
        btn.classList.remove('playing');
      }
    });

    audio.addEventListener('ended', function() {
      btn.textContent = '🔊 Play Story';
      btn.classList.remove('playing');
    });
  }

  // Simple version for scenes with single audio
  function toggleAudio(audioElement, buttonElement) {
    if (audioElement.paused) {
      audioElement.play();
      buttonElement.textContent = '⏸ Pause';
      buttonElement.classList.add('playing');
    } else {
      audioElement.pause();
      buttonElement.textContent = '🔊 Play Story';
      buttonElement.classList.remove('playing');
    }
  }

  // ============================================================
  // EXPOSE PUBLIC API
  // ============================================================

  window.SirJamesEngine = {
    // Scene navigation
    initScenes: initScenes,
    showScene: showScene,
    nextScene: nextScene,
    prevScene: prevScene,

    // Choices & virtues
    makeChoice: makeChoice,
    continueStory: continueStory,
    logChoice: logChoice,
    getVirtues: getVirtues,
    updateVirtueDisplay: updateVirtueDisplay,

    // Chapter management
    completeChapter: completeChapter,
    goToNextChapter: goToNextChapter,
    goToChapterList: goToChapterList,

    // Audio
    initAudioPlayer: initAudioPlayer,
    toggleAudio: toggleAudio,

    // Session
    getSessionId: getSessionId
  };

})();
