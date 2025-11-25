#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Render per-scene MP4s using FFmpeg with a gentle Ken Burns effect and audio mix.
- Requires manifest.json from build_manifest.py
- Voice is loudness-normalized (EBU R128). Optional music bed ducked under voice.
- Output: public-book002/chapterNN/video/scene-###.mp4
"""

import sys
import os

# Fix Windows console Unicode encoding
os.environ.setdefault("PYTHONIOENCODING", "utf-8")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

import argparse
import json
import shutil
import subprocess
from pathlib import Path

def run(cmd, capture=True):
    """Run a command and handle errors"""
    if capture:
        proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    else:
        proc = subprocess.run(cmd, text=True)
    
    if proc.returncode != 0:
        if capture and proc.stderr:
            print(proc.stderr[:500], file=sys.stderr)
        raise RuntimeError(f"FFmpeg failed: {' '.join(str(c) for c in cmd[:5])}...")
    return proc

def main():
    ap = argparse.ArgumentParser(description="Render scene videos")
    ap.add_argument("--chapter", type=int, required=True, help="Chapter number")
    ap.add_argument("--music", action="store_true", help="Mix music bed if present")
    ap.add_argument("--crf", type=int, default=18, help="Video quality (lower=better, default: 18)")
    ap.add_argument("--preset", default="faster", help="Encoding preset (default: faster)")
    ap.add_argument("--scene", type=int, help="Render specific scene only")
    args = ap.parse_args()

    print("[RENDER] SIR JAMES BOOK002 - SCENE VIDEO RENDERING")
    print("=" * 60)
    print(f"Chapter: {args.chapter}")
    print(f"Music bed: {args.music}")
    print(f"CRF: {args.crf}")

    if not shutil.which("ffmpeg"):
        print("[ERROR] ffmpeg not found. Install FFmpeg and ensure it's on PATH.", file=sys.stderr)
        sys.exit(1)

    root = Path(__file__).resolve().parents[1]
    chap = root / "public-book002" / f"chapter{args.chapter:02d}"
    manf = chap / "manifest.json"
    
    if not manf.exists():
        print(f"[ERROR] manifest.json not found at {manf}. Run build_manifest.py first.", file=sys.stderr)
        sys.exit(1)

    manifest = json.loads(manf.read_text(encoding="utf-8"))
    video_dir = chap / "video"
    temp_dir = chap / "temp"
    video_dir.mkdir(parents=True, exist_ok=True)
    temp_dir.mkdir(parents=True, exist_ok=True)

    width = manifest["video"]["width"]
    height = manifest["video"]["height"]
    fps = manifest["video"]["fps"]
    music_db = manifest["video"].get("music_bed_db", -15)

    scenes = manifest["scenes"]
    if args.scene:
        scenes = [s for s in scenes if s["id"] == f"{args.scene:03d}"]
        if not scenes:
            print(f"[ERROR] Scene {args.scene} not found in manifest")
            sys.exit(1)

    success_count = 0
    total_scenes = len(scenes)

    for i, sc in enumerate(scenes, 1):
        sid = sc["id"]
        img = sc.get("image")
        voice = sc.get("voice")
        music = sc.get("music") if args.music else None
        dur = max(1.0, float(sc.get("duration_hint_sec", 12.0)))

        print(f"\n[{i}/{total_scenes}] Scene {sid}: {sc.get('title', 'Untitled')}")

        if not img:
            print(f"  [SKIP] No image for scene {sid}", file=sys.stderr)
            continue

        img_p = chap / img
        if not img_p.exists():
            print(f"  [SKIP] Image not found: {img_p}", file=sys.stderr)
            continue

        out_vid = video_dir / f"scene-{sid}.mp4"
        tmp_vid = temp_dir / f"scene-{sid}-vid.mp4"

        try:
            # 1) Create subtle Ken Burns video from still image
            print(f"  [1/3] Creating Ken Burns video ({dur:.1f}s)...")
            run([
                "ffmpeg", "-y",
                "-loop", "1", "-t", str(dur), "-i", str(img_p),
                "-filter_complex",
                f"scale={width}:{height}:force_original_aspect_ratio=increase,crop={width}:{height},zoompan=z='min(zoom+0.0008,1.06)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s={width}x{height}",
                "-r", str(fps), "-pix_fmt", "yuv420p",
                "-c:v", "libx264", "-preset", args.preset, "-crf", str(args.crf),
                str(tmp_vid)
            ])

            # 2) Handle audio (voice + optional music)
            audio_input = None
            if voice:
                vce_p = chap / voice
                if vce_p.exists():
                    tmp_vce = temp_dir / f"scene-{sid}-voice-norm.wav"
                    
                    print(f"  [2/3] Normalizing voice (EBU R128)...")
                    run([
                        "ffmpeg", "-y",
                        "-i", str(vce_p),
                        "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
                        str(tmp_vce)
                    ])
                    audio_input = tmp_vce

                    # 3) Mix music under voice if present
                    if music:
                        mus_p = chap / music
                        if mus_p.exists():
                            tmp_mix = temp_dir / f"scene-{sid}-mix.wav"
                            print(f"  [2b/3] Mixing music bed ({music_db}dB)...")
                            run([
                                "ffmpeg", "-y",
                                "-i", str(tmp_vce), "-i", str(mus_p),
                                "-filter_complex",
                                f"[1:a]volume={music_db}dB[a1];[0:a][a1]amix=inputs=2:duration=first[mout]",
                                "-map", "[mout]",
                                str(tmp_mix)
                            ])
                            audio_input = tmp_mix

            # 4) Mux A/V to final MP4
            print(f"  [3/3] Muxing final video...")
            if audio_input and audio_input.exists():
                run([
                    "ffmpeg", "-y",
                    "-i", str(tmp_vid), "-i", str(audio_input),
                    "-c:v", "copy",
                    "-c:a", "aac", "-b:a", "192k",
                    "-shortest",
                    str(out_vid)
                ])
            else:
                # No audio - just copy video
                shutil.copy(tmp_vid, out_vid)

            print(f"  [OK] -> {out_vid.name}")
            success_count += 1

        except Exception as e:
            print(f"  [FAILED] {e}", file=sys.stderr)
            continue

    # Cleanup temp files
    print(f"\n[CLEANUP] Removing temp files...")
    for f in temp_dir.glob("*"):
        try:
            f.unlink()
        except:
            pass

    print("\n" + "=" * 60)
    print(f"[SUMMARY] Rendered {success_count}/{total_scenes} scenes")
    print(f"[OUTPUT] {video_dir}")

    return 0 if success_count == total_scenes else 1

if __name__ == "__main__":
    sys.exit(main())
