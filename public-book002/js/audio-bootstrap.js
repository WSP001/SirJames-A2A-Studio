/**
 * Sir James Book002 - Audio Bootstrap
 * Dynamically loads intermission + audio-settings if not already present
 * Use this for legacy pages not yet using base template
 */
(function() {
  function hasScript(src) {
    return Array.from(document.scripts).some(function(s) {
      return s.src && s.src.includes(src);
    });
  }
  
  function loadScript(src) {
    return new Promise(function(resolve) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = resolve; // Continue even if load fails
      document.head.appendChild(s);
    });
  }
  
  async function bootstrap() {
    // Load shared scripts if not present
    if (!hasScript('/js/intermission.js')) {
      await loadScript('/js/intermission.js');
    }
    if (!hasScript('/js/audio-settings.js')) {
      await loadScript('/js/audio-settings.js');
    }
    
    // Auto-wire narration audio tags
    document.querySelectorAll('audio[data-role="narration"]').forEach(function(a) {
      a.addEventListener('play', function() {
        document.dispatchEvent(new Event('audio:scene:playing'));
      });
      a.addEventListener('ended', function() {
        document.dispatchEvent(new Event('audio:scene:ended'));
      });
    });
  }
  
  // Run bootstrap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
