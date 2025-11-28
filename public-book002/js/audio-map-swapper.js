/**
 * Audio Map Swapper - Sir James Adventures Book002
 * 
 * Automatically swaps narrator-only audio for character-specific voices
 * by loading a scene map JSON and rewriting audio sources at runtime.
 * 
 * Falls back gracefully if map is missing or files don't exist.
 */
(async function() {
  // Detect current scene from URL path
  const pathMatch = window.location.pathname.match(/\/(chapter\d+)\/scene-(\d+)/);
  if (!pathMatch) return; // Not a scene page
  
  const chapter = pathMatch[1];
  const sceneNum = pathMatch[2].padStart(3, "0");
  const mapUrl = `/${chapter}/audio/scene-${sceneNum}.map.json`;
  
  console.log(`[audio-map] Loading ${mapUrl}`);
  
  try {
    const res = await fetch(mapUrl, { cache: "no-store" });
    if (!res.ok) {
      console.log("[audio-map] No map found, using default audio");
      return;
    }
    
    const map = await res.json();
    const base = map.base || `/${chapter}/audio/voices/`;
    
    console.log(`[audio-map] Loaded map with ${Object.keys(map.lines || {}).length} lines`);

    // Pattern 1: Per-line audio elements with data-line attribute
    const lineEls = document.querySelectorAll('audio[data-line]');
    if (lineEls.length) {
      lineEls.forEach(el => {
        const line = (el.getAttribute("data-line") || "").padStart(3, "0");
        const entry = map.lines?.[line];
        if (entry?.file) {
          el.src = base + entry.file;
          console.log(`[audio-map] Line ${line}: ${entry.character}`);
        }
      });
      return;
    }

    // Pattern 2: Single scene audio element
    const sceneAudio = document.querySelector('audio#narration, audio[data-scene]');
    if (sceneAudio && map.combined) {
      sceneAudio.src = base + map.combined;
      console.log("[audio-map] Using combined track");
      return;
    }
    
    // Pattern 3: Audio source element inside audio tag
    const sourceEl = document.querySelector('audio source[type="audio/mpeg"]');
    if (sourceEl && map.combined) {
      sourceEl.src = base + map.combined;
      sourceEl.parentElement?.load();
      console.log("[audio-map] Updated source element");
    }
    
  } catch (e) {
    console.warn("[audio-map] Swap skipped:", e.message);
  }
})();
