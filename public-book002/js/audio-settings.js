/**
 * Sir James Book002 - Audio Settings Overlay
 * 10-line audio control widget with volume slider and mute toggle
 */
(function() {
  const d = document;
  const b = d.body;
  
  // Create overlay container
  const u = b.appendChild(d.createElement('div'));
  u.id = 'audio-ctl';
  u.style.cssText = 'position:fixed;right:10px;bottom:10px;background:rgba(255,255,255,0.85);padding:8px 12px;border-radius:12px;backdrop-filter:blur(6px);font:14px system-ui;display:flex;gap:8px;align-items:center;z-index:9999;box-shadow:0 2px 12px rgba(0,0,0,0.15)';
  u.innerHTML = '<button id="sj-mute" title="Mute/Unmute" style="all:unset;cursor:pointer;font-size:18px">🔊</button><input id="sj-vol" type="range" min="0" max="1" step="0.01" style="width:100px;cursor:pointer">';
  
  const v = u.querySelector('#sj-vol');
  const m = u.querySelector('#sj-mute');
  
  // Load saved settings
  v.value = localStorage.getItem('sj:vol') || '0.6';
  let muted = localStorage.getItem('sj:mut') === '1';
  
  function applyVolume() {
    d.querySelectorAll('audio').forEach(function(a) {
      a.volume = parseFloat(v.value);
      a.muted = muted;
    });
    // Also update theme volume
    if (window.SJ && SJ.theme) {
      SJ.theme.volume = parseFloat(v.value) * 0.5;
      SJ.theme.muted = muted;
    }
  }
  
  function updateIcon() {
    m.textContent = muted ? '🔇' : '🔊';
  }
  
  // Volume slider change
  v.oninput = function() {
    localStorage.setItem('sj:vol', v.value);
    applyVolume();
  };
  
  // Mute toggle
  m.onclick = function() {
    muted = !muted;
    localStorage.setItem('sj:mut', muted ? '1' : '0');
    updateIcon();
    applyVolume();
  };
  
  // Initialize
  updateIcon();
  applyVolume();
  
  // Re-apply when new audio elements are added
  const observer = new MutationObserver(function() {
    applyVolume();
  });
  observer.observe(d.body, { childList: true, subtree: true });
})();
