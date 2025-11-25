#!/usr/bin/env python3
"""
Sir James Book002 - DALL-E Image Generation
Generates scene images from media prompts JSON
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
load_dotenv(PROJECT_ROOT / '.env.local')

# Cost estimates (USD)
DALLE_COSTS = {
    "dall-e-3": {"1024x1024": 0.04, "1024x1792": 0.08, "1792x1024": 0.08},
    "dall-e-2": {"256x256": 0.016, "512x512": 0.018, "1024x1024": 0.02}
}

def get_openai_client():
    """Initialize OpenAI client"""
    try:
        import openai
        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key:
            print("[ERROR] OPENAI_API_KEY not set in environment")
            return None
        return openai.OpenAI(api_key=api_key)
    except ImportError:
        print("[ERROR] openai package not installed. Run: pip install openai")
        return None

def load_media_prompts(chapter_num):
    """Load media prompts from JSON file"""
    prompts_file = PROJECT_ROOT / "public-book002" / f"chapter{chapter_num:02d}" / "_media_prompts.json"
    
    if prompts_file.exists():
        with open(prompts_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    # Generate default prompts if file doesn't exist
    print(f"[INFO] No _media_prompts.json found, using default prompts for Chapter {chapter_num}")
    return generate_default_prompts(chapter_num)

def generate_default_prompts(chapter_num):
    """Generate default scene prompts for a chapter"""
    # Chapter 1 default prompts
    if chapter_num == 1:
        return {
            "chapter": 1,
            "title": "The Quest Begins",
            "style": "bright cartoon illustration, children's book style, warm colors, friendly atmosphere",
            "scenes": [
                {"scene": "scene-001", "prompt": "A young knight named Sir James standing proudly in a grand castle hall, receiving a quest scroll from a wise king, bright cartoon style, warm golden lighting"},
                {"scene": "scene-002", "prompt": "Sir James meeting Claude, a friendly Red Bone Coonhound dog with floppy ears, in a sunny castle courtyard, cartoon style, joyful reunion"},
                {"scene": "scene-003", "prompt": "Sir James and Claude packing adventure supplies into a leather satchel, maps and provisions visible, cozy castle room, cartoon illustration"},
                {"scene": "scene-004", "prompt": "Large wooden castle gates opening wide, Sir James and Claude stepping through into morning sunlight, epic perspective, cartoon adventure style"},
                {"scene": "scene-005", "prompt": "Sir James and Claude taking their first steps on a winding forest path, hopeful sunrise in background, cartoon illustration, sense of adventure"},
                {"scene": "scene-006", "prompt": "Dense enchanted forest trail with tall trees forming an archway, dappled sunlight, Sir James and Claude walking together, magical cartoon style"},
                {"scene": "scene-007", "prompt": "Sir James and Claude on a hilltop overlooking distant mountains, epic landscape view, sunset colors, cartoon adventure illustration"},
                {"scene": "scene-008", "prompt": "Cozy campsite at dusk, Sir James studying a map by firelight while Claude curls up nearby, peaceful evening scene, warm cartoon illustration"}
            ]
        }
    
    # Generic prompts for other chapters
    return {
        "chapter": chapter_num,
        "title": f"Chapter {chapter_num}",
        "style": "bright cartoon illustration, children's book style",
        "scenes": [
            {"scene": f"scene-{i:03d}", "prompt": f"Sir James adventure scene {i}, cartoon style"} 
            for i in range(1, 9)
        ]
    }

def estimate_cost(num_images, model, size):
    """Calculate estimated cost for image generation"""
    cost_per_image = DALLE_COSTS.get(model, {}).get(size, 0.04)
    return num_images * cost_per_image

def generate_image(client, prompt, model, size, quality):
    """Generate a single image using DALL-E"""
    try:
        response = client.images.generate(
            model=model,
            prompt=prompt,
            size=size,
            quality=quality,
            n=1
        )
        return response.data[0].url
    except Exception as e:
        print(f"[ERROR] Image generation failed: {e}")
        return None

def download_image(url, output_path):
    """Download image from URL and save to file"""
    try:
        import requests
        response = requests.get(url, timeout=60)
        response.raise_for_status()
        
        with open(output_path, 'wb') as f:
            f.write(response.content)
        return True
    except Exception as e:
        print(f"[ERROR] Failed to download image: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Generate DALL-E images for Sir James Book002')
    parser.add_argument('--chapter', type=int, required=True, help='Chapter number (1-10)')
    parser.add_argument('--model', default='dall-e-3', choices=['dall-e-2', 'dall-e-3'], help='DALL-E model')
    parser.add_argument('--quality', default='standard', choices=['standard', 'hd'], help='Image quality')
    parser.add_argument('--size', default='1024x1024', help='Image size (e.g., 1024x1024)')
    parser.add_argument('--plan', action='store_true', help='Dry run - show cost estimate only')
    parser.add_argument('--max-usd', type=float, default=1.00, help='Maximum budget in USD')
    parser.add_argument('--scene', type=int, help='Generate specific scene only (1-8)')
    
    args = parser.parse_args()
    
    print("[IMAGES] SIR JAMES BOOK002 - IMAGE GENERATION")
    print("=" * 60)
    print(f"Chapter: {args.chapter}")
    print(f"Model: {args.model}")
    print(f"Quality: {args.quality}")
    print(f"Size: {args.size}")
    print(f"Max Budget: ${args.max_usd:.2f}")
    print("=" * 60)
    
    # Load prompts
    prompts_data = load_media_prompts(args.chapter)
    scenes = prompts_data.get("scenes", [])
    style = prompts_data.get("style", "cartoon illustration")
    
    # Filter to specific scene if requested
    if args.scene:
        scenes = [s for s in scenes if s["scene"] == f"scene-{args.scene:03d}"]
        if not scenes:
            print(f"[ERROR] Scene {args.scene} not found")
            return 1
    
    num_images = len(scenes)
    estimated_cost = estimate_cost(num_images, args.model, args.size)
    
    print(f"\n[PLAN] Generation Plan:")
    print(f"  Images to generate: {num_images}")
    print(f"  Estimated cost: ${estimated_cost:.2f}")
    
    if estimated_cost > args.max_usd:
        print(f"\n[WARNING] Estimated cost (${estimated_cost:.2f}) exceeds budget (${args.max_usd:.2f})")
        print("[INFO] Use --max-usd to increase budget or --scene to generate fewer images")
        return 1
    
    if args.plan:
        print("\n[DRY RUN] Prompts that would be generated:")
        for scene in scenes:
            full_prompt = f"{scene['prompt']}, {style}"
            print(f"\n  {scene['scene']}:")
            print(f"    {full_prompt[:100]}...")
        print(f"\n[DRY RUN] Total estimated cost: ${estimated_cost:.2f}")
        return 0
    
    # Initialize OpenAI client
    client = get_openai_client()
    if not client:
        return 1
    
    # Create output directory
    chapter_dir = PROJECT_ROOT / "public-book002" / f"chapter{args.chapter:02d}"
    images_dir = chapter_dir / "images"
    images_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate images
    print(f"\n[GENERATE] Starting image generation...")
    success_count = 0
    total_cost = 0
    
    for i, scene in enumerate(scenes, 1):
        scene_name = scene["scene"]
        full_prompt = f"{scene['prompt']}, {style}"
        output_file = images_dir / f"{scene_name}.png"
        
        print(f"\n[{i}/{num_images}] Generating {scene_name}...")
        print(f"  Prompt: {full_prompt[:80]}...")
        
        # Generate image
        image_url = generate_image(client, full_prompt, args.model, args.size, args.quality)
        
        if image_url:
            # Download and save
            if download_image(image_url, output_file):
                print(f"  [OK] Saved: {output_file.name}")
                success_count += 1
                total_cost += DALLE_COSTS.get(args.model, {}).get(args.size, 0.04)
            else:
                print(f"  [FAILED] Could not save image")
        else:
            print(f"  [FAILED] Generation failed")
        
        # Rate limiting - wait between requests
        if i < num_images:
            time.sleep(2)
    
    # Summary
    print("\n" + "=" * 60)
    print("[SUMMARY] Image Generation Complete")
    print("=" * 60)
    print(f"  Successful: {success_count}/{num_images}")
    print(f"  Total cost: ${total_cost:.2f}")
    print(f"  Output: {images_dir}")
    
    # Save generation log
    log_file = chapter_dir / "_images_log.json"
    log_data = {
        "chapter": args.chapter,
        "model": args.model,
        "quality": args.quality,
        "size": args.size,
        "images_generated": success_count,
        "total_cost": total_cost,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    with open(log_file, 'w', encoding='utf-8') as f:
        json.dump(log_data, f, indent=2)
    
    return 0 if success_count == num_images else 1

if __name__ == "__main__":
    sys.exit(main())
