/**
 * Generate all audio lines for a scene using ElevenLabs TTS
 * 
 * Reads:
 *   - content/voices.json (character → voice_id + settings)
 *   - prompts/scripts/chapter01/scene-001.json (line list)
 * 
 * Writes:
 *   - content/out/chapter01/scene-001/scene-001-001-narrator.mp3
 *   - content/out/chapter01/scene-001/scene-001-002-king_arthur.mp3
 *   - etc.
 * 
 * Usage:
 *   $env:ELEVENLABS_API_KEY="your_key"
 *   node scripts/generate_scene.mjs
 * 
 * Or with custom paths:
 *   node scripts/generate_scene.mjs --scene=prompts/scripts/chapter01/scene-002.json
 */

import fs from "fs/promises";
import path from "path";

// Parse command line args
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, val] = arg.replace(/^--/, '').split('=');
  acc[key] = val;
  return acc;
}, {});

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) throw new Error("Missing ELEVENLABS_API_KEY environment variable");

// Paths
const VOICES_JSON = args.voices || process.env.VOICES_JSON || "content/voices.json";
const SCENE_JSON = args.scene || process.env.SCENE_JSON || "prompts/scripts/chapter01/scene-001.json";
const OUT_DIR = args.out || process.env.OUT_DIR || "content/out/chapter01/scene-001";

console.log(`🎬 Scene Audio Generator`);
console.log(`   Voices: ${VOICES_JSON}`);
console.log(`   Scene: ${SCENE_JSON}`);
console.log(`   Output: ${OUT_DIR}`);
console.log(``);

// Load config files
const voices = JSON.parse(await fs.readFile(VOICES_JSON, "utf8"));
const scene = JSON.parse(await fs.readFile(SCENE_JSON, "utf8"));

// Create output directory
await fs.mkdir(OUT_DIR, { recursive: true });

// TTS function
async function tts(voiceId, text, settings, outPath) {
  const payload = {
    text,
    model_id: "eleven_multilingual_v2",
    voice_settings: settings || {
      stability: 0.72,
      similarity_boost: 0.9,
      style: 0.18,
      use_speaker_boost: true
    }
  };

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`TTS failed ${res.status}: ${errorText}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(outPath, buf);
  return buf.length;
}

// Process each line
let generated = 0;
let skipped = 0;

for (const line of scene.lines) {
  // Skip SFX (Claude uses audio files, not TTS)
  if (line.sfx) {
    console.log(`⏭️  SFX: ${line.sfx} (no TTS needed)`);
    skipped++;
    continue;
  }

  // Skip empty text
  if (!line.text || line.text.trim() === "") {
    console.log(`⏭️  Empty text for ${line.character}`);
    skipped++;
    continue;
  }

  // Get voice profile
  const profile = voices[line.character];
  if (!profile || !profile.voice_id) {
    console.warn(`⚠️  No voice_id for character "${line.character}"; skipping`);
    skipped++;
    continue;
  }

  // Check for placeholder voice IDs
  if (profile.voice_id.startsWith("LIB_") || profile.voice_id.startsWith("DESIGNED_")) {
    console.warn(`⚠️  Placeholder voice_id "${profile.voice_id}" for ${line.character}`);
    console.warn(`   → Replace with real ElevenLabs voice ID in voices.json`);
    skipped++;
    continue;
  }

  // Generate filename
  const sceneId = scene.scene_id.split("/").at(-1) || "scene";
  const safeChar = line.character.replace(/[^a-z0-9_]/gi, "_");
  const outFile = path.join(OUT_DIR, `${sceneId}-${line.id}-${safeChar}.mp3`);

  try {
    console.log(`🎤 ${line.character}: "${line.text.substring(0, 40)}${line.text.length > 40 ? '...' : ''}"`);
    const bytes = await tts(profile.voice_id, line.text, profile.settings, outFile);
    console.log(`   ✅ ${outFile} (${(bytes / 1024).toFixed(1)} KB)`);
    generated++;
  } catch (err) {
    console.error(`   ❌ Failed: ${err.message}`);
  }
}

console.log(``);
console.log(`📊 Summary:`);
console.log(`   Generated: ${generated} files`);
console.log(`   Skipped: ${skipped} (SFX/empty/placeholder)`);
console.log(`   Output: ${OUT_DIR}`);
