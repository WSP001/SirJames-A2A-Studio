#!/usr/bin/env python3
"""
Generate Claude's Thought Bubble Icons using DALL-E 3
HD images to replace emojis - Disney Pixar style
Cost: ~$0.20 total (5 images @ $0.04 each for 1024x1024)
"""

import os
import sys
import json
import requests
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv

# Project configuration - match images_generate.py
PROJECT_ROOT = Path(__file__).parent.parent
# Force override any existing env var with .env.local value
load_dotenv(PROJECT_ROOT / '.env.local', override=True)

def get_openai_client():
    """Initialize OpenAI client - same as images_generate.py"""
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

CLIENT = get_openai_client()
if not CLIENT:
    sys.exit(1)

# Output directory - use PROJECT_ROOT for correct path
OUTPUT_DIR = PROJECT_ROOT / "public-book002" / "assets" / "thought_icons"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Thought bubble icon definitions
THOUGHT_ICONS = {
    "thought_icon_insight": {
        "prompt": "Golden glowing lightbulb with small pawprint embossed on glass, soft magical golden glow radiating outward, warm and inviting, Disney Pixar 3D animation style, professional quality, transparent background effect, centered composition, 512x512 icon",
        "meaning": "Helpful insight - suggests virtuous direction"
    },
    "thought_icon_question": {
        "prompt": "Soft fluffy white cloud shaped like a question mark, gentle silver and blue shimmer, curious and wondering expression, magical sparkles, Disney Pixar 3D animation style, professional quality, transparent background effect, centered composition, 512x512 icon",
        "meaning": "Uncertainty - encourages pause and reflection"
    },
    "thought_icon_heart": {
        "prompt": "Warm glowing heart with gentle pink and red gradient, soft magical sparkles surrounding it, caring and kind feeling, love and empathy symbol, Disney Pixar 3D animation style, professional quality, transparent background effect, centered composition, 512x512 icon",
        "meaning": "Empathy - highlights emotional impact"
    },
    "thought_icon_caution": {
        "prompt": "Gentle amber caution triangle symbol with soft warm glow, not scary but protective feeling, friendly warning, Disney Pixar 3D animation style, professional quality, child-friendly, transparent background effect, centered composition, 512x512 icon",
        "meaning": "Concern - warns of poor choice gently"
    },
    "thought_icon_joy": {
        "prompt": "Sparkling golden star burst with colorful magical confetti, celebration feeling, happy and bright, joyful energy, Disney Pixar 3D animation style, professional quality, transparent background effect, centered composition, 512x512 icon",
        "meaning": "Joy - signals playful celebration"
    }
}

def generate_icon(name: str, prompt: str) -> bool:
    """Generate a single thought bubble icon using DALL-E 3"""
    print(f"\n[{name}] Generating...")
    print(f"  Prompt: {prompt[:60]}...")
    
    try:
        # Use OpenAI client like images_generate.py
        response = CLIENT.images.generate(
            model="dall-e-3",
            prompt=prompt,
            n=1,
            size="1024x1024",  # Square for icons
            quality="standard"  # $0.04 per image
        )
        
        image_url = response.data[0].url
        
        # Download image
        img_response = requests.get(image_url, timeout=60)
        if img_response.status_code != 200:
            print("  [ERROR] Failed to download image")
            return False
        
        # Save image
        output_path = OUTPUT_DIR / f"{name}.png"
        with open(output_path, 'wb') as f:
            f.write(img_response.content)
        
        print(f"  [OK] Saved: {output_path}")
        return True
        
    except Exception as e:
        print(f"  [ERROR] {e}")
        return False

def main():
    print("=" * 60)
    print(" CLAUDE THOUGHT BUBBLE ICONS - DALL-E GENERATION")
    print("=" * 60)
    print(f"Output: {OUTPUT_DIR}")
    print(f"Icons to generate: {len(THOUGHT_ICONS)}")
    print(f"Estimated cost: ${len(THOUGHT_ICONS) * 0.04:.2f}")
    print("=" * 60)
    
    success_count = 0
    total_cost = 0.0
    
    for name, config in THOUGHT_ICONS.items():
        if generate_icon(name, config['prompt']):
            success_count += 1
            total_cost += 0.04
    
    print("\n" + "=" * 60)
    print(" SUMMARY")
    print("=" * 60)
    print(f"  Generated: {success_count}/{len(THOUGHT_ICONS)}")
    print(f"  Total cost: ${total_cost:.2f}")
    print(f"  Output: {OUTPUT_DIR}")
    
    # Save generation log
    log_path = OUTPUT_DIR / "_generation_log.json"
    with open(log_path, 'w') as f:
        json.dump({
            "generated_at": datetime.now().isoformat(),
            "icons": list(THOUGHT_ICONS.keys()),
            "success_count": success_count,
            "total_cost": total_cost,
            "output_dir": str(OUTPUT_DIR)
        }, f, indent=2)
    
    print(f"  Log: {log_path}")
    
    if success_count == len(THOUGHT_ICONS):
        print("\n[SUCCESS] All thought bubble icons generated!")
        return 0
    else:
        print(f"\n[WARNING] {len(THOUGHT_ICONS) - success_count} icons failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
