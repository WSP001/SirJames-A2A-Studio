#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Assemble chapter video from per-scene MP4s.
- Default: safe concat (no re-encode).
- Optional re-encode with xfade/acrossfade is easy to add later.
- Output: public-book002/chapterNN/video/chapter-NN.mp4
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

def run(cmd):
    """Run a command and handle errors"""
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if proc.returncode != 0:
        print(proc.stderr[:500], file=sys.stderr)
        raise RuntimeError("FFmpeg failed")
    return proc

def main():
    ap = argparse.ArgumentParser(description="Assemble chapter video")
    ap.add_argument("--chapter", type=int, required=True, help="Chapter number")
    ap.add_argument("--reencode", action="store_true", help="Force re-encode (prep for fancy transitions)")
    ap.add_argument("--crf", type=int, default=18, help="Video quality (default: 18)")
    ap.add_argument("--preset", default="faster", help="Encoding preset (default: faster)")
    args = ap.parse_args()

    print("[ASSEMBLE] SIR JAMES BOOK002 - CHAPTER VIDEO ASSEMBLY")
    print("=" * 60)
    print(f"Chapter: {args.chapter}")
    print(f"Re-encode: {args.reencode}")

    if not shutil.which("ffmpeg"):
        print("[ERROR] ffmpeg not found on PATH.", file=sys.stderr)
        sys.exit(1)

    root = Path(__file__).resolve().parents[1]
    chap = root / "public-book002" / f"chapter{args.chapter:02d}"
    manf = chap / "manifest.json"
    
    if not manf.exists():
        print(f"[ERROR] manifest.json not found: {manf}", file=sys.stderr)
        sys.exit(1)

    manifest = json.loads(manf.read_text(encoding="utf-8"))
    video_dir = chap / "video"
    video_dir.mkdir(parents=True, exist_ok=True)
    out_chapter = video_dir / f"chapter-{args.chapter:02d}.mp4"

    # Gather scenes in order
    scene_files = []
    for sc in manifest["scenes"]:
        sid = sc["id"]
        f = video_dir / f"scene-{sid}.mp4"
        if not f.exists():
            print(f"[WARN] missing {f.name}, skipping", file=sys.stderr)
            continue
        scene_files.append(f)

    if not scene_files:
        print("[ERROR] No scene videos to assemble.", file=sys.stderr)
        sys.exit(1)

    print(f"[INFO] Assembling {len(scene_files)} scene videos...")

    # Create concat file list
    filelist = video_dir / "filelist.txt"
    
    # Write file list with proper escaping for FFmpeg
    with open(filelist, 'w', encoding='utf-8') as f:
        for p in scene_files:
            # Escape single quotes and use forward slashes
            escaped_path = str(p).replace("\\", "/").replace("'", "'\\''")
            f.write(f"file '{escaped_path}'\n")

    try:
        if not args.reencode:
            # Concat demuxer (no re-encode) - fastest
            print("[METHOD] Stream copy (no re-encode)")
            run([
                "ffmpeg", "-y",
                "-f", "concat", "-safe", "0",
                "-i", str(filelist),
                "-c", "copy",
                str(out_chapter)
            ])
        else:
            # Re-encode concat (for future transitions)
            print("[METHOD] Re-encoding for transitions")
            run([
                "ffmpeg", "-y",
                "-f", "concat", "-safe", "0",
                "-i", str(filelist),
                "-c:v", "libx264", "-preset", args.preset, "-crf", str(args.crf),
                "-c:a", "aac", "-b:a", "192k",
                str(out_chapter)
            ])

        # Get file size
        size_mb = out_chapter.stat().st_size / (1024 * 1024)
        
        print("\n" + "=" * 60)
        print(f"[OK] Assembled -> {out_chapter.name}")
        print(f"     Size: {size_mb:.1f} MB")
        print(f"     Scenes: {len(scene_files)}")
        
        # Cleanup filelist
        filelist.unlink()
        
        return 0

    except Exception as e:
        print(f"[ERROR] Assembly failed: {e}", file=sys.stderr)
        return 1

if __name__ == "__main__":
    sys.exit(main())
