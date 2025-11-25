/**
 * Sir James Book002 - Theme Intermission Controller
 * Plays theme music ~15s after narration ends, stops when next scene plays
 */
(function() {
  window.SJ = window.SJ || {};
  
  // Initialize theme audio
  SJ.theme = SJ.theme || new Audio('/media/SirJamesThemeSong008.wav');
  SJ.theme.loop = true;
  
  // Get saved volume (default 0.6)
  const savedVol = parseFloat(localStorage.getItem('sj:vol')) || 0.6;
  SJ.theme.volume = savedVol * 0.5; // Theme plays at half user volume
  
  let intermissionTimer = null;
  
  function playTheme() {
    if (document.hidden) return;
    SJ.theme.play().catch(function() {
      // Autoplay blocked - user needs to interact first
    });
  }
  
  function stopTheme() {
    SJ.theme.pause();
    SJ.theme.currentTime = 0;
  }
  
  // When narration starts playing, stop theme immediately
  document.addEventListener('audio:scene:playing', function() {
    clearTimeout(intermissionTimer);
    stopTheme();
  });
  
  // When narration ends, start 15s countdown to theme
  document.addEventListener('audio:scene:ended', function() {
    clearTimeout(intermissionTimer);
    intermissionTimer = setTimeout(playTheme, 15000);
  });
  
  // Stop theme when tab is hidden
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      stopTheme();
    }
  });
  
  // Expose for external control
  SJ.playTheme = playTheme;
  SJ.stopTheme = stopTheme;
})();
