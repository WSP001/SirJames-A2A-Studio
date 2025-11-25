#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Generate build.json provenance file for Sir James Book002 chapters.
Records git SHA, tool versions, costs, and checksums for reproducibility.
"""

import sys
import os

# Fix Windows console Unicode encoding
os.environ.setdefault("PYTHONIOENCODING", "utf-8")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

import argparse
import json
import hashlib
import subprocess
import platform
from pathlib import Path
from datetime import datetime, timezone

PROJECT_ROOT = Path(__file__).resolve().parents[1]

def get_git_info():
    """Get current git SHA and branch"""
    try:
        sha = subprocess.run(
            ["git", "rev-parse", "HEAD"],
            capture_output=True, text=True, cwd=PROJECT_ROOT
        ).stdout.strip()[:12]
        
        branch = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            capture_output=True, text=True, cwd=PROJECT_ROOT
        ).stdout.strip()
        
        return sha or "unknown", branch or "unknown"
    except Exception:
        return "unknown", "unknown"

def get_tool_version(cmd):
    """Get version string from a command"""
    try:
        result = subprocess.run(
            cmd, capture_output=True, text=True, timeout=10
        )
        return result.stdout.strip().split('\n')[0][:50]
    except Exception:
        return "not installed"

def sha256_file(filepath):
    """Calculate SHA256 hash of a file"""
    if not filepath.exists():
        return None
    
    sha256 = hashlib.sha256()
    with open(filepath, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            sha256.update(chunk)
    return sha256.hexdigest()

def count_files(directory, pattern):
    """Count files matching pattern in directory"""
    if not directory.exists():
        return 0
    return len(list(directory.glob(pattern)))

def main():
    ap = argparse.ArgumentParser(description="Generate build.json provenance file")
    ap.add_argument("--chapter", type=int, required=True, help="Chapter number")
    ap.add_argument("--title", default=None, help="Chapter title (optional)")
    ap.add_argument("--images-cost", type=float, default=0.32, help="Image generation cost USD")
    ap.add_argument("--voices-cost", type=float, default=0.53, help="Voice synthesis cost USD")
    args = ap.parse_args()

    print("[BUILD.JSON] SIR JAMES BOOK002 - PROVENANCE GENERATOR")
    print("=" * 60)
    print(f"Chapter: {args.chapter}")

    chapter_dir = PROJECT_ROOT / "public-book002" / f"chapter{args.chapter:02d}"
    if not chapter_dir.exists():
        print(f"[ERROR] Chapter directory not found: {chapter_dir}")
        sys.exit(1)

    # Get git info
    git_sha, git_branch = get_git_info()
    
    # Get tool versions
    python_version = platform.python_version()
    ffmpeg_version = get_tool_version(["ffmpeg", "-version"])
    node_version = get_tool_version(["node", "--version"])
    
    # Count assets
    images_dir = chapter_dir / "images"
    audio_dir = chapter_dir / "audio"
    video_dir = chapter_dir / "video"
    
    image_count = count_files(images_dir, "scene-*.png") + count_files(images_dir, "scene-*.jpg")
    audio_count = count_files(audio_dir, "*.mp3") + count_files(audio_dir, "*.wav")
    
    # Get image files list
    image_files = []
    if images_dir.exists():
        for ext in ["*.png", "*.jpg"]:
            image_files.extend([f"images/{f.name}" for f in sorted(images_dir.glob(ext))])
    
    # Calculate checksums
    video_file = video_dir / f"chapter-{args.chapter:02d}.mp4"
    manifest_file = chapter_dir / "manifest.json"
    
    video_sha = sha256_file(video_file)
    manifest_sha = sha256_file(manifest_file)
    
    # Get chapter title from manifest if not provided
    title = args.title
    if not title and manifest_file.exists():
        try:
            with open(manifest_file, 'r', encoding='utf-8') as f:
                manifest_data = json.load(f)
                title = manifest_data.get("title", f"Chapter {args.chapter}")
        except:
            title = f"Chapter {args.chapter}"
    
    # Calculate total cost
    total_cost = args.images_cost + args.voices_cost
    
    # Build the provenance object
    build_json = {
        "$schema": "https://sirjames-book002-final.netlify.app/schemas/build.json",
        "version": "1.0.0",
        "project": "Sir James Adventures Book002",
        "chapter": args.chapter,
        "title": title or f"Chapter {args.chapter}",
        
        "provenance": {
            "git_sha": git_sha,
            "git_branch": git_branch,
            "build_timestamp": datetime.now(timezone.utc).isoformat(),
            "builder": os.environ.get("USERNAME", os.environ.get("USER", "unknown")),
            "machine": platform.node(),
            "os": f"{platform.system()} {platform.release()}"
        },
        
        "tools": {
            "python_version": python_version,
            "node_version": node_version.replace("v", "") if node_version.startswith("v") else node_version,
            "ffmpeg_version": ffmpeg_version.split(" ")[2] if "ffmpeg version" in ffmpeg_version.lower() else ffmpeg_version[:20]
        },
        
        "assets": {
            "images": {
                "count": image_count,
                "model": "dall-e-3",
                "size": "1024x1024",
                "quality": "standard",
                "cost_usd": args.images_cost,
                "files": image_files
            },
            "voices": {
                "count": audio_count,
                "provider": "elevenlabs",
                "model": "eleven_monolingual_v1",
                "cost_usd": args.voices_cost,
                "voices_used": {
                    "narrator": os.environ.get("VOICEID_NARRATOR", "pNInz6obpgDQGcFmaJgB"),
                    "sir_james": os.environ.get("VOICEID_SIR_JAMES", "ErXwobaYiN019PkySvjV"),
                    "claude": os.environ.get("VOICEID_CLAUDE", "VR6AewLTigWG4xSOukaG"),
                    "gramps": os.environ.get("VOICEID_GRAMPS", "TxGEqnHWrfWFTfGW9XjX")
                }
            },
            "video": {
                "exists": video_file.exists(),
                "format": "mp4",
                "codec": "h264",
                "resolution": "1920x1080",
                "fps": 30,
                "audio_codec": "aac",
                "audio_bitrate": "192k",
                "loudness": "ebu-r128",
                "output": f"video/chapter-{args.chapter:02d}.mp4" if video_file.exists() else None
            }
        },
        
        "costs": {
            "images_usd": args.images_cost,
            "voices_usd": args.voices_cost,
            "total_usd": round(total_cost, 2),
            "budget_target_usd": 1.00,
            "under_budget": total_cost <= 1.00
        },
        
        "quality": {
            "audio_peak_dbfs": -1.5,
            "audio_loudness_lufs": -16,
            "video_crf": 18,
            "accessibility": {
                "alt_text": True,
                "captions_vtt": (chapter_dir / "captions").exists()
            }
        },
        
        "commons_good": {
            "transparency": True,
            "attribution": True,
            "cost_tracking": True,
            "age_appropriate": "5-8 years",
            "content_rating": "PG"
        },
        
        "checksums": {
            "chapter_video_sha256": video_sha,
            "manifest_sha256": manifest_sha
        }
    }
    
    # Write build.json
    output_file = chapter_dir / "build.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(build_json, f, indent=2, ensure_ascii=False)
    
    print(f"\n[OK] Generated: {output_file}")
    print(f"     Git SHA: {git_sha}")
    print(f"     Images: {image_count}")
    print(f"     Audio: {audio_count}")
    print(f"     Video: {'Yes' if video_file.exists() else 'No'}")
    print(f"     Total Cost: ${total_cost:.2f}")
    print(f"     Under Budget: {'Yes' if total_cost <= 1.00 else 'No'}")

if __name__ == "__main__":
    main()
