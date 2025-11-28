#!/usr/bin/env node
/**
 * Build a JSON map the frontend can use to swap narrator-only audio
 * for character-specific lines, with clean fallbacks.
 *
 * Inputs:
 *   content/out/chapter01/scene-001/*.mp3  (already generated)
 * Outputs:
 *   public-book002/chapter01/audio/scene-001.map.json
 */
import { promises as fs } from "fs";
import path from "path";

const SCENE = process.env.SCENE || "chapter01/scene-001";
const [chapter, scene] = SCENE.split("/");
const OUT_DIR = path.join("content", "out", SCENE);
const PUB_DIR = path.join("public-book002", chapter, "audio");
const MAP_PATH = path.join(PUB_DIR, `${scene}.map.json`);

// Utility: zero-padded line number extraction: scene-001-003-sir_james.mp3
const lineFromName = (name) => {
  const m = name.match(/scene-\d+-(\d+)-/);
  return m ? m[1] : null;
};

const charFromName = (name) => {
  const m = name.match(/scene-\d+-\d+-(.+)\.mp3$/);
  return m ? m[1] : null;
};

(async () => {
  console.log(`🎬 Building audio map for ${SCENE}`);
  console.log(`   Source: ${OUT_DIR}`);
  console.log(`   Output: ${MAP_PATH}`);
  
  await fs.mkdir(PUB_DIR, { recursive: true });

  // Collect all files for scene
  let files;
  try {
    files = await fs.readdir(OUT_DIR);
  } catch (e) {
    console.error(`❌ Cannot read ${OUT_DIR}:`, e.message);
    process.exit(1);
  }
  
  const mp3s = files.filter(f => f.endsWith(".mp3"));
  console.log(`   Found ${mp3s.length} MP3 files`);

  // Build line→file map with character info
  /** @type {Record<string, {file: string, character: string}>} */
  const byLine = {};
  
  for (const f of mp3s) {
    const line = lineFromName(f);
    const char = charFromName(f);
    if (!line || !char) continue;
    byLine[line] = { file: f, character: char };
  }

  // Copy all scene files to public audio folder
  const pubSceneDir = path.join(PUB_DIR, "voices");
  await fs.mkdir(pubSceneDir, { recursive: true });
  
  for (const f of mp3s) {
    await fs.copyFile(path.join(OUT_DIR, f), path.join(pubSceneDir, f));
    console.log(`   📁 Copied ${f}`);
  }

  // Emit map
  const map = {
    scene: scene,
    chapter: chapter,
    base: `/${chapter}/audio/voices/`,
    generated: new Date().toISOString(),
    lines: byLine
  };

  await fs.writeFile(MAP_PATH, JSON.stringify(map, null, 2));
  console.log(`✅ Wrote ${MAP_PATH} with ${Object.keys(byLine).length} line(s).`);
})();
