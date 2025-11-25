#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Builds manifest.json for Book002 chapters by scanning the chapter folder.
- Derives scene list from existing files (images, voice, music, captions)
- Duration hint = voice WAV length + 1s pad, fallback 12s
- Writes: public-book002/chapterNN/manifest.json
"""

import sys
import os

# Fix Windows console Unicode encoding
os.environ.setdefault("PYTHONIOENCODING", "utf-8")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

import argparse
import json
import re
from pathlib import Path
import contextlib
import wave

SCENE_RE = re.compile(r"scene-(\d{3})", re.IGNORECASE)

def wav_duration_seconds(path: Path) -> float:
    """Get duration of a WAV file in seconds"""
    try:
        with contextlib.closing(wave.open(str(path), 'rb')) as w:
            frames = w.getnframes()
            rate = w.getframerate()
            return frames / float(rate) if rate else 0.0
    except Exception:
        return 0.0

def index_by_id(paths):
    """Index file paths by scene ID"""
    out = {}
    for p in paths:
        m = SCENE_RE.search(p.name)
        if m:
            out[m.group(1)] = p
    return out

def main():
    ap = argparse.ArgumentParser(description="Build chapter manifest.json")
    ap.add_argument("--chapter", type=int, required=True, help="Chapter number, e.g. 1")
    ap.add_argument("--width", type=int, default=1920, help="Video width (default: 1920)")
    ap.add_argument("--height", type=int, default=1080, help="Video height (default: 1080)")
    ap.add_argument("--fps", type=int, default=30, help="Frames per second (default: 30)")
    ap.add_argument("--music-bed-db", type=int, default=-15, help="Music bed volume in dB (default: -15)")
    ap.add_argument("--pad-seconds", type=float, default=1.0, help="Padding after voice (default: 1.0)")
    ap.add_argument("--fallback-duration", type=float, default=12.0, help="Default scene duration (default: 12.0)")
    args = ap.parse_args()

    print("[MANIFEST] SIR JAMES BOOK002 - BUILD MANIFEST")
    print("=" * 60)
    print(f"Chapter: {args.chapter}")

    root = Path(__file__).resolve().parents[1]  # project root
    chap_dir = root / "public-book002" / f"chapter{args.chapter:02d}"
    
    if not chap_dir.exists():
        print(f"[ERROR] Chapter folder not found: {chap_dir}", file=sys.stderr)
        sys.exit(1)

    # Scan for assets
    images_dir = chap_dir / "images"
    audio_dir = chap_dir / "audio"
    captions_dir = chap_dir / "captions"

    images = list(images_dir.glob("scene-*.png")) + list(images_dir.glob("scene-*.jpg")) if images_dir.exists() else []
    voices = list(audio_dir.glob("scene-*-voice.wav")) + list(audio_dir.glob("*.mp3")) if audio_dir.exists() else []
    music = list(audio_dir.glob("scene-*-music.wav")) if audio_dir.exists() else []
    caps = list(captions_dir.glob("scene-*.vtt")) if captions_dir.exists() else []

    # Index by scene id
    idx_images = index_by_id(images)
    idx_voice = index_by_id(voices)
    idx_music = index_by_id(music)
    idx_caps = index_by_id(caps)

    # Also check for narration batch to get scene titles
    narration_file = chap_dir / "_narration_batch.json"
    scene_titles = {}
    if narration_file.exists():
        try:
            with open(narration_file, 'r', encoding='utf-8') as f:
                narration_data = json.load(f)
                for scene in narration_data.get("scenes", []):
                    scene_id = scene.get("scene", "").replace("scene-", "")
                    scene_titles[scene_id] = scene.get("title", f"Scene {int(scene_id)}")
        except Exception as e:
            print(f"[WARN] Could not read narration batch: {e}")

    # Determine all scene IDs
    scene_ids = sorted(set(idx_images.keys()) | set(idx_voice.keys()) | set(idx_caps.keys()))
    
    # If no assets found, create default 8 scenes
    if not scene_ids:
        print("[INFO] No scene assets found. Creating default 8-scene manifest.")
        scene_ids = [f"{i:03d}" for i in range(1, 9)]

    print(f"[INFO] Found {len(scene_ids)} scenes")

    scenes = []
    for sid in scene_ids:
        img = idx_images.get(sid)
        vce = idx_voice.get(sid)
        mus = idx_music.get(sid)
        cap = idx_caps.get(sid)

        # Calculate duration from voice file or use fallback
        dur = wav_duration_seconds(vce) + args.pad_seconds if vce else args.fallback_duration
        
        # Get title from narration batch or use default
        title = scene_titles.get(sid, f"Scene {int(sid)}")

        scenes.append({
            "id": sid,
            "title": title,
            "image": f"images/{img.name}" if img else None,
            "voice": f"audio/{vce.name}" if vce else None,
            "music": f"audio/{mus.name}" if mus else None,
            "captions": f"captions/{cap.name}" if cap else None,
            "duration_hint_sec": round(dur, 3),
            "transition": "crossfade"
        })

    manifest = {
        "chapter": args.chapter,
        "title": f"Sir James Adventures - Chapter {args.chapter:02d}",
        "scenes": scenes,
        "video": {
            "width": args.width,
            "height": args.height,
            "fps": args.fps,
            "loudness": "ebu-r128",
            "music_bed_db": args.music_bed_db
        }
    }

    out_path = chap_dir / "manifest.json"
    out_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    
    print(f"\n[OK] Wrote {out_path}")
    print(f"     Scenes: {len(scenes)}")
    print(f"     Video: {args.width}x{args.height} @ {args.fps}fps")

if __name__ == "__main__":
    main()
