(function () {
  const AUTO_KEY = 'sjBook002AdventureMode';
  const MUSIC_KEY = 'sjBook002MusicEnabled';
  const ADVANCE_DELAY_MS = 1400;
  const MUSIC_SRC = '/assets/audio/theme-song.mp3';

  const pathMatch = window.location.pathname.match(/chapter(\d{2})\/scene-(\d{3})/);
  if (!pathMatch) return;

  const chapterNumber = Number(pathMatch[1]);
  const sceneNumber = Number(pathMatch[2]);
  const audioElements = Array.from(document.querySelectorAll('audio[data-line], audio#narration'));
  const playButton = document.getElementById('playAllBtn') || document.getElementById('playBtn');
  const primaryNav = document.querySelector('.nav-button.primary');
  const previousNav = document.querySelector('.navigation .nav-button:not(.primary)');

  let isStoryFlowRunning = false;
  let touchStartX = 0;
  let touchStartY = 0;

  function nextSceneHref() {
    if (sceneNumber < 8) {
      return `../scene-${String(sceneNumber + 1).padStart(3, '0')}/index.html`;
    }
    if (chapterNumber < 10) {
      return `../../chapter${String(chapterNumber + 1).padStart(2, '0')}/scene-001/index.html`;
    }
    return '../../index.html';
  }

  function nextSceneText() {
    if (sceneNumber < 8) return 'Next Scene';
    if (chapterNumber < 10) return `Chapter ${chapterNumber + 1}`;
    return 'All Chapters';
  }

  function installNextChapterNav() {
    if (!primaryNav) return;
    primaryNav.href = nextSceneHref();
    primaryNav.textContent = nextSceneText();
    primaryNav.setAttribute('aria-label', `Go to ${nextSceneText()}`);
  }

  function ensureMusic() {
    let music = document.getElementById('storyFlowMusic');
    if (music) return music;

    music = document.createElement('audio');
    music.id = 'storyFlowMusic';
    music.src = MUSIC_SRC;
    music.loop = true;
    music.preload = 'auto';
    music.volume = 0.14;
    document.body.appendChild(music);
    return music;
  }

  async function startMusic() {
    sessionStorage.setItem(MUSIC_KEY, '1');
    const music = ensureMusic();
    try {
      await music.play();
    } catch (error) {
      showTapHint('Tap Start Adventure to allow music on this device.');
    }
  }

  function stopAllAudio() {
    audioElements.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  function setCurrentLine(audio) {
    document.querySelectorAll('.narration-box').forEach((box) => {
      box.classList.remove('is-current');
      box.style.opacity = '0.62';
    });

    const box = audio && (audio.closest('.narration-box') || document.querySelector('.narration-box'));
    if (box) {
      box.classList.add('is-current');
      box.style.opacity = '1';
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function clearCurrentLine() {
    document.querySelectorAll('.narration-box').forEach((box) => {
      box.classList.remove('is-current');
      box.style.opacity = '1';
    });
  }

  function showTapHint(text) {
    let hint = document.getElementById('storyFlowHint');
    if (!hint) {
      hint = document.createElement('div');
      hint.id = 'storyFlowHint';
      hint.className = 'story-flow-hint';
      const controls = document.querySelector('.audio-controls') || document.querySelector('.scene-container');
      controls.appendChild(hint);
    }
    hint.textContent = text;
    hint.hidden = false;
  }

  function hideTapHint() {
    const hint = document.getElementById('storyFlowHint');
    if (hint) hint.hidden = true;
  }

  function goNext() {
    window.location.href = nextSceneHref();
  }

  async function playSceneAndAdvance() {
    if (isStoryFlowRunning) {
      stopAllAudio();
      isStoryFlowRunning = false;
      if (playButton) playButton.textContent = 'Start Adventure';
      return;
    }

    if (!audioElements.length) {
      setTimeout(goNext, ADVANCE_DELAY_MS);
      return;
    }

    sessionStorage.setItem(AUTO_KEY, '1');
    isStoryFlowRunning = true;
    hideTapHint();
    if (playButton) playButton.textContent = 'Pause';
    await startMusic();

    for (const audio of audioElements) {
      if (!isStoryFlowRunning) return;
      setCurrentLine(audio);
      try {
        audio.currentTime = 0;
        await audio.play();
        await new Promise((resolve) => {
          audio.onended = resolve;
          audio.onerror = resolve;
        });
      } catch (error) {
        showTapHint('Tap Start Adventure to continue playback.');
        isStoryFlowRunning = false;
        if (playButton) playButton.textContent = 'Start Adventure';
        return;
      }
    }

    clearCurrentLine();
    isStoryFlowRunning = false;
    if (playButton) playButton.textContent = 'Next';
    setTimeout(goNext, ADVANCE_DELAY_MS);
  }

  function installAdventureButton() {
    if (!playButton) return;
    playButton.textContent = 'Start Adventure';
    playButton.setAttribute('aria-label', 'Start automatic story playback');
    playButton.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        playSceneAndAdvance();
      },
      true
    );
  }

  function installSwipeAndKeyboard() {
    document.addEventListener(
      'touchstart',
      (event) => {
        const touch = event.changedTouches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      },
      { passive: true }
    );

    document.addEventListener(
      'touchend',
      (event) => {
        const touch = event.changedTouches[0];
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;
        if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.4) return;

        if (dx < 0) {
          goNext();
        } else if (previousNav) {
          window.location.href = previousNav.href;
        }
      },
      { passive: true }
    );

    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') goNext();
      if (event.key === 'ArrowLeft' && previousNav) window.location.href = previousNav.href;
    });
  }

  function installStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .narration-box.is-current {
        outline: 4px solid rgba(255, 215, 0, 0.9);
        box-shadow: 0 0 24px rgba(255, 215, 0, 0.35);
      }
      .story-flow-hint {
        margin: 12px auto 0;
        max-width: 520px;
        padding: 12px 16px;
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.48);
        color: #fff;
        font-size: 1rem;
        line-height: 1.4;
      }
    `;
    document.head.appendChild(style);
  }

  function tryResumeAdventureMode() {
    if (sessionStorage.getItem(AUTO_KEY) !== '1') return;
    setTimeout(() => {
      playSceneAndAdvance();
    }, 450);
  }

  installStyles();
  installNextChapterNav();
  installAdventureButton();
  installSwipeAndKeyboard();

  if (sessionStorage.getItem(MUSIC_KEY) === '1') {
    ensureMusic();
  }
  tryResumeAdventureMode();
})();
