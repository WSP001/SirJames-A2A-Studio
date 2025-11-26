#!/usr/bin/env python3
"""
Split enhanced_image_prompts.json into per-scene JSON files.
Also fixes Sir James's eye color from "emerald green" to "blue".

Output: prompts/book002/json/chXX-scYYY.json (80 files total)
"""

import json
import os
import re
from pathlib import Path

# Paths
SCRIPT_DIR = Path(__file__).parent
REPO_ROOT = SCRIPT_DIR.parent
ENHANCED_PROMPTS = REPO_ROOT / "assets" / "prompts" / "book002" / "enhanced" / "enhanced_image_prompts.json"
OUTPUT_DIR = REPO_ROOT / "prompts" / "book002" / "json"

# Eye color fix: Sir James has BLUE eyes, not emerald green
EYE_COLOR_FIXES = [
    ("Bright emerald green eyes", "Bright blue eyes"),
    ("emerald green eyes", "blue eyes"),
    # Don't catch generic "green eyes" as it might affect other characters
]


def fix_eye_color(text: str) -> str:
    """Fix Sir James's eye color from green to blue."""
    for old, new in EYE_COLOR_FIXES:
        text = text.replace(old, new)
    return text


def extract_scene_id(chapter: int, scene: int) -> str:
    """Generate consistent scene ID: sjb2::02::003::prompt::v1"""
    return f"sjb2::{chapter:02d}::{scene:03d}::prompt::v1"


def main():
    print("=" * 60)
    print("SPLITTING ENHANCED PROMPTS INTO PER-SCENE FILES")
    print("=" * 60)
    
    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Load enhanced prompts
    if not ENHANCED_PROMPTS.exists():
        print(f"ERROR: Cannot find {ENHANCED_PROMPTS}")
        return 1
    
    with open(ENHANCED_PROMPTS, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Extract metadata and global style
    metadata = data.get("metadata", {})
    global_style = data.get("global_style", {})
    character_consistency = data.get("character_consistency", {})
    
    # Fix eye color in character consistency
    if "sir_james" in character_consistency:
        desc = character_consistency["sir_james"].get("description", "")
        character_consistency["sir_james"]["description"] = fix_eye_color(desc)
    
    chapter_prompts = data.get("chapter_prompts", {})
    
    files_created = 0
    chapters_processed = 0
    
    for chapter_key, chapter_data in chapter_prompts.items():
        # Extract chapter number from key like "chapter_01"
        match = re.match(r"chapter_(\d+)", chapter_key)
        if not match:
            print(f"  SKIP: Invalid chapter key: {chapter_key}")
            continue
        
        chapter_num = int(match.group(1))
        chapters_processed += 1
        
        theme = chapter_data.get("theme", f"Chapter {chapter_num}")
        color_scheme = chapter_data.get("color_scheme", "")
        environment = chapter_data.get("environment", "")
        scenes = chapter_data.get("scenes", {})
        
        print(f"\nChapter {chapter_num}: {theme}")
        print(f"  Scenes found: {len(scenes)}")
        
        for scene_key, scene_prompt in scenes.items():
            # Extract scene number from key like "scene_001"
            scene_match = re.match(r"scene_(\d+)", scene_key)
            if not scene_match:
                print(f"    SKIP: Invalid scene key: {scene_key}")
                continue
            
            scene_num = int(scene_match.group(1))
            
            # Fix eye color in prompt
            fixed_prompt = fix_eye_color(scene_prompt)
            
            # Build per-scene JSON
            scene_data = {
                "scene_id": extract_scene_id(chapter_num, scene_num),
                "chapter": chapter_num,
                "scene": scene_num,
                "theme": theme,
                "color_scheme": color_scheme,
                "environment": environment,
                "prompt": fixed_prompt,
                "global_style": global_style,
                "character_consistency": character_consistency,
                "metadata": {
                    "source": "enhanced_image_prompts.json",
                    "version": metadata.get("version", "2.0"),
                    "quality_level": metadata.get("quality_level", "professional")
                }
            }
            
            # Write to file
            filename = f"ch{chapter_num:02d}-sc{scene_num:03d}.json"
            filepath = OUTPUT_DIR / filename
            
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(scene_data, f, indent=2, ensure_ascii=False)
            
            files_created += 1
            print(f"    Created: {filename}")
    
    print("\n" + "=" * 60)
    print(f"COMPLETE: {files_created} scene files created")
    print(f"Chapters processed: {chapters_processed}")
    print(f"Output directory: {OUTPUT_DIR}")
    print("=" * 60)
    
    # Verify we have 80 files (10 chapters x 8 scenes)
    expected = 80
    if files_created < expected:
        print(f"\nWARNING: Expected {expected} files, got {files_created}")
        print("Some chapters may have fewer than 8 scenes in the source.")
    
    return 0


if __name__ == "__main__":
    exit(main())
