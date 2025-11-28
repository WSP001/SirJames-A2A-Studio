/**
 * Generate a single audio line using ElevenLabs TTS
 * 
 * Usage:
 *   $env:ELEVENLABS_API_KEY="your_key"
 *   $env:VOICE_ID="voice_id_from_elevenlabs"
 *   node scripts/generate_line.mjs
 * 
 * Or with inline params:
 *   node scripts/generate_line.mjs --text="Hello!" --voice="abc123" --out="test.mp3"
 */

import fs from "fs/promises";

// Parse command line args
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, val] = arg.replace(/^--/, '').split('=');
  acc[key] = val;
  return acc;
}, {});

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) throw new Error("Missing ELEVENLABS_API_KEY environment variable");

const VOICE_ID = args.voice || process.env.VOICE_ID;
if (!VOICE_ID) throw new Error("Missing VOICE_ID (use --voice=xxx or $env:VOICE_ID)");

const TEXT = args.text || process.env.TEXT || "I'm ready for adventure!";
const OUT = args.out || process.env.OUT || "test_output.mp3";

// Voice settings (can be overridden)
const settings = {
  stability: parseFloat(args.stability) || 0.74,
  similarity_boost: parseFloat(args.similarity) || 0.9,
  style: parseFloat(args.style) || 0.18,
  use_speaker_boost: true
};

const payload = {
  text: TEXT,
  model_id: "eleven_multilingual_v2",
  voice_settings: settings
};

console.log(`🎤 Generating TTS...`);
console.log(`   Voice ID: ${VOICE_ID}`);
console.log(`   Text: "${TEXT.substring(0, 50)}${TEXT.length > 50 ? '...' : ''}"`);
console.log(`   Output: ${OUT}`);

const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`, {
  method: "POST",
  headers: { 
    "xi-api-key": API_KEY, 
    "Content-Type": "application/json" 
  },
  body: JSON.stringify(payload)
});

if (!res.ok) {
  const errorText = await res.text();
  throw new Error(`TTS failed: ${res.status} ${errorText}`);
}

const buf = Buffer.from(await res.arrayBuffer());
await fs.writeFile(OUT, buf);
console.log(`✅ Wrote ${OUT} (${(buf.length / 1024).toFixed(1)} KB)`);
