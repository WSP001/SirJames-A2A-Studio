#!/usr/bin/env python3
"""
Sir James Book002 - ElevenLabs Voice Synthesis Agent
Generates character voice narration from batch JSON
"""

import sys
import os

# Fix Windows console Unicode encoding
os.environ.setdefault("PYTHONIOENCODING", "utf-8")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

import json
import argparse
import time
from pathlib import Path
from dotenv import load_dotenv

# Project configuration
PROJECT_ROOT = Path(__file__).parent.parent
# Force override any existing env var with .env.local value
load_dotenv(PROJECT_ROOT / '.env.local', override=True)

# Cost estimates (USD per 1000 characters)
ELEVEN_COST_PER_1K_CHARS = 0.30  # Approximate for standard tier

def get_elevenlabs_client():
    """Initialize ElevenLabs client"""
    api_key = os.environ.get('ELEVENLABS_API_KEY')
    if not api_key:
        print("[ERROR] ELEVENLABS_API_KEY not set in environment")
        return None
    return api_key

def get_voice_id(voice_name):
    """Get voice ID from environment or defaults"""
    voice_map = {
        "narrator": os.environ.get('VOICEID_NARRATOR', 'pNInz6obpgDQGcFmaJgB'),  # Adam
        "sir_james": os.environ.get('VOICEID_SIR_JAMES', 'ErXwobaYiN019PkySvjV'),  # Antoni
        "claude": os.environ.get('VOICEID_CLAUDE', 'VR6AewLTigWG4xSOukaG'),  # Arnold
        "gramps": os.environ.get('VOICEID_GRAMPS', 'TxGEqnHWrfWFTfGW9XjX'),  # Josh
    }
    return voice_map.get(voice_name.lower(), voice_map["narrator"])

def estimate_cost(text_lines):
    """Calculate estimated cost for voice synthesis"""
    total_chars = sum(len(line.get("text", "")) for line in text_lines)
    return (total_chars / 1000) * ELEVEN_COST_PER_1K_CHARS

def synthesize_speech(api_key, voice_id, text, output_path, settings):
    """Generate speech using ElevenLabs API"""
    try:
        import requests
        
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
        
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": api_key
        }
        
        data = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": settings.get("stability", 0.5),
                "similarity_boost": settings.get("similarity_boost", 0.75),
                "style": settings.get("style", 0.5),
                "use_speaker_boost": True
            }
        }
        
        response = requests.post(url, json=data, headers=headers, timeout=60)
        
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                f.write(response.content)
            return True
        else:
            print(f"[ERROR] API returned {response.status_code}: {response.text[:100]}")
            return False
            
    except Exception as e:
        print(f"[ERROR] Speech synthesis failed: {e}")
        return False

def load_narration_batch(chapter_num):
    """Load narration batch from JSON file"""
    batch_file = PROJECT_ROOT / "public-book002" / f"chapter{chapter_num:02d}" / "_narration_batch.json"
    
    if not batch_file.exists():
        print(f"[ERROR] Narration batch not found: {batch_file}")
        return None
    
    with open(batch_file, 'r', encoding='utf-8') as f:
        return json.load(f)

def main():
    parser = argparse.ArgumentParser(description='Generate ElevenLabs voice narration for Sir James Book002')
    parser.add_argument('command', choices=['synth', 'plan', 'test'], help='Command to run')
    parser.add_argument('--chapter', type=int, default=1, help='Chapter number (1-10)')
    parser.add_argument('--scene', type=int, help='Generate specific scene only (1-8)')
    parser.add_argument('--max-usd', type=float, default=0.50, help='Maximum budget in USD')
    parser.add_argument('--voice', help='Test specific voice (narrator, sir_james, claude, gramps)')
    parser.add_argument('--text', help='Test text to synthesize')
    
    args = parser.parse_args()
    
    print("[VOICE] SIR JAMES BOOK002 - VOICE SYNTHESIS")
    print("=" * 60)
    
    # Test command - synthesize a single test phrase
    if args.command == 'test':
        api_key = get_elevenlabs_client()
        if not api_key:
            return 1
        
        voice = args.voice or 'narrator'
        text = args.text or "Hello! I am Sir James, and this is a voice test."
        voice_id = get_voice_id(voice)
        
        print(f"Testing voice: {voice} (ID: {voice_id})")
        print(f"Text: {text}")
        
        output_file = PROJECT_ROOT / "public-book002" / "voice_test.mp3"
        
        if synthesize_speech(api_key, voice_id, text, output_file, {}):
            print(f"[OK] Test audio saved: {output_file}")
            return 0
        else:
            print("[FAILED] Voice test failed")
            return 1
    
    # Load narration batch
    batch_data = load_narration_batch(args.chapter)
    if not batch_data:
        return 1
    
    scenes = batch_data.get("scenes", [])
    settings = batch_data.get("settings", {})
    
    # Filter to specific scene if requested
    if args.scene:
        scenes = [s for s in scenes if s["scene"] == f"scene-{args.scene:03d}"]
        if not scenes:
            print(f"[ERROR] Scene {args.scene} not found")
            return 1
    
    # Collect all lines
    all_lines = []
    for scene in scenes:
        for line in scene.get("lines", []):
            all_lines.append({
                "scene": scene["scene"],
                "id": line["id"],
                "voice": line["voice"],
                "text": line["text"],
                "emotion": line.get("emotion", "neutral")
            })
    
    estimated_cost = estimate_cost(all_lines)
    
    print(f"Chapter: {args.chapter}")
    print(f"Scenes: {len(scenes)}")
    print(f"Lines: {len(all_lines)}")
    print(f"Estimated cost: ${estimated_cost:.2f}")
    print(f"Max Budget: ${args.max_usd:.2f}")
    print("=" * 60)
    
    if estimated_cost > args.max_usd:
        print(f"\n[WARNING] Estimated cost (${estimated_cost:.2f}) exceeds budget (${args.max_usd:.2f})")
        print("[INFO] Use --max-usd to increase budget or --scene to generate fewer lines")
        return 1
    
    # Plan command - show what would be generated
    if args.command == 'plan':
        print("\n[DRY RUN] Lines that would be synthesized:")
        for line in all_lines:
            voice_id = get_voice_id(line["voice"])
            print(f"\n  {line['id']} ({line['voice']}):")
            print(f"    Voice ID: {voice_id}")
            print(f"    Text: {line['text'][:60]}...")
            print(f"    Emotion: {line['emotion']}")
        print(f"\n[DRY RUN] Total estimated cost: ${estimated_cost:.2f}")
        return 0
    
    # Synth command - generate audio
    if args.command == 'synth':
        api_key = get_elevenlabs_client()
        if not api_key:
            return 1
        
        # Create output directory
        chapter_dir = PROJECT_ROOT / "public-book002" / f"chapter{args.chapter:02d}"
        audio_dir = chapter_dir / "audio"
        audio_dir.mkdir(parents=True, exist_ok=True)
        
        print(f"\n[GENERATE] Starting voice synthesis...")
        success_count = 0
        total_cost = 0
        
        for i, line in enumerate(all_lines, 1):
            voice_id = get_voice_id(line["voice"])
            output_file = audio_dir / f"{line['id']}.mp3"
            
            print(f"\n[{i}/{len(all_lines)}] {line['id']} ({line['voice']})")
            print(f"  Text: {line['text'][:50]}...")
            
            if synthesize_speech(api_key, voice_id, line["text"], output_file, settings):
                print(f"  [OK] Saved: {output_file.name}")
                success_count += 1
                total_cost += (len(line["text"]) / 1000) * ELEVEN_COST_PER_1K_CHARS
            else:
                print(f"  [FAILED] Synthesis failed")
            
            # Rate limiting
            if i < len(all_lines):
                time.sleep(1)
        
        # Summary
        print("\n" + "=" * 60)
        print("[SUMMARY] Voice Synthesis Complete")
        print("=" * 60)
        print(f"  Successful: {success_count}/{len(all_lines)}")
        print(f"  Total cost: ${total_cost:.2f}")
        print(f"  Output: {audio_dir}")
        
        # Save generation log
        log_file = chapter_dir / "_audio_log.json"
        log_data = {
            "chapter": args.chapter,
            "lines_generated": success_count,
            "total_cost": total_cost,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        with open(log_file, 'w', encoding='utf-8') as f:
            json.dump(log_data, f, indent=2)
        
        return 0 if success_count == len(all_lines) else 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
