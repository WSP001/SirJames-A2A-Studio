#!/usr/bin/env python3
"""
Wire Chapter HTML - Connects scene HTML files to real image/audio assets.

This script reads _narration_batch.json and generates properly wired HTML
for each scene, replacing placeholder content with real assets.

Usage:
    python tools/wire_chapter_html.py --chapter 1
    python tools/wire_chapter_html.py --chapter 1 --scene 2
    python tools/wire_chapter_html.py --all
"""

import json
import os
import argparse
from pathlib import Path

# Template for scene HTML
SCENE_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sir James Adventures - Chapter {chapter} - {scene_title}</title>
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }}
        .scene-container {{
            flex: 1;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
        }}
        .scene-title {{
            font-size: 1.8em;
            text-align: center;
            margin-bottom: 15px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }}
        .scene-image {{
            width: 100%;
            max-height: 50vh;
            object-fit: contain;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            margin-bottom: 20px;
        }}
        .narration-box {{
            background: rgba(0,0,0,0.4);
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 20px;
            -webkit-backdrop-filter: blur(10px);
            backdrop-filter: blur(10px);
        }}
        .narration-text {{
            font-size: 1.4em;
            line-height: 1.6;
            text-align: center;
        }}
        .character-name {{
            font-weight: bold;
            color: #ffd700;
            display: block;
            margin-bottom: 10px;
        }}
        .audio-controls {{
            text-align: center;
            margin: 15px 0;
        }}
        .play-btn {{
            background: linear-gradient(135deg, #ffd700, #ff8c00);
            border: none;
            color: #333;
            padding: 15px 40px;
            font-size: 1.2em;
            font-weight: bold;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(255,215,0,0.4);
            transition: transform 0.2s, box-shadow 0.2s;
        }}
        .play-btn:hover {{
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(255,215,0,0.6);
        }}
        .play-btn:active {{
            transform: scale(0.98);
        }}
        .navigation {{
            display: flex;
            justify-content: space-between;
            gap: 15px;
            margin-top: auto;
            padding: 20px 0;
        }}
        .nav-button {{
            flex: 1;
            background: rgba(255,255,255,0.2);
            border: 2px solid white;
            color: white;
            padding: 15px 25px;
            border-radius: 50px;
            text-decoration: none;
            text-align: center;
            font-size: 1.1em;
            font-weight: bold;
            transition: all 0.3s ease;
        }}
        .nav-button:hover {{
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }}
        .nav-button.primary {{
            background: linear-gradient(135deg, #4CAF50, #45a049);
            border-color: #4CAF50;
        }}
        @media (max-width: 600px) {{
            .scene-title {{ font-size: 1.4em; }}
            .narration-text {{ font-size: 1.2em; }}
            .play-btn {{ padding: 12px 30px; font-size: 1em; }}
        }}
    </style>
</head>
<body>
    <div class="scene-container">
        <h1 class="scene-title">{scene_title}</h1>
        
        <img src="../images/{image_file}" 
             alt="{image_alt}"
             class="scene-image">
        
        <div class="narration-box">
            <div class="narration-text">
                <span class="character-name">{character}:</span>
                {narration_text}
            </div>
        </div>
        
        <div class="audio-controls">
            <button class="play-btn" id="playBtn" aria-label="Play narration">
                ▶ Tap to Listen
            </button>
            <audio id="narration" preload="auto">
                <source src="../audio/{audio_file}" type="audio/mpeg">
            </audio>
        </div>
        
        <div class="navigation">
            <a href="{prev_link}" class="nav-button">{prev_text}</a>
            <a href="{next_link}" class="nav-button primary">{next_text}</a>
        </div>
    </div>
    
    <script>
        const audio = document.getElementById('narration');
        const playBtn = document.getElementById('playBtn');
        let isPlaying = false;
        
        playBtn.addEventListener('click', function() {{
            if (isPlaying) {{
                audio.pause();
                playBtn.textContent = '▶ Tap to Listen';
                isPlaying = false;
            }} else {{
                audio.play().then(() => {{
                    playBtn.textContent = '⏸ Pause';
                    isPlaying = true;
                }}).catch(e => {{
                    console.log('Audio play failed:', e);
                    playBtn.textContent = '▶ Tap Again';
                }});
            }}
        }});
        
        audio.addEventListener('ended', function() {{
            playBtn.textContent = '▶ Play Again';
            isPlaying = false;
        }});
        
        document.addEventListener('touchstart', function() {{
            audio.load();
        }}, {{ once: true }});
    </script>
</body>
</html>
'''

def get_character_display(voice: str) -> str:
    """Convert voice ID to display name."""
    mapping = {
        'narrator': 'Narrator',
        'sir_james': 'Sir James',
        'claude': 'Claude',
        'gramps': 'Gramps',
        'sparky': 'Sparky'
    }
    return mapping.get(voice, 'Narrator')


def wire_chapter(chapter_num: int, scene_num: int = None, dry_run: bool = False):
    """Wire HTML files for a chapter to use real assets."""
    
    repo_root = Path(__file__).parent.parent
    chapter_dir = repo_root / 'public-book002' / f'chapter{chapter_num:02d}'
    
    # Load narration batch
    narration_file = chapter_dir / '_narration_batch.json'
    if not narration_file.exists():
        print(f"[ERROR] No _narration_batch.json found for Chapter {chapter_num}")
        return False
    
    with open(narration_file, 'r', encoding='utf-8') as f:
        narration_data = json.load(f)
    
    # Load media prompts for image alt text
    prompts_file = chapter_dir / '_media_prompts.json'
    prompts_data = {}
    if prompts_file.exists():
        with open(prompts_file, 'r', encoding='utf-8') as f:
            prompts_data = json.load(f)
    
    scenes = narration_data.get('scenes', [])
    total_scenes = len(scenes)
    
    print(f"\n[CHAPTER] {chapter_num}: {narration_data.get('title', 'Unknown')}")
    print(f"   Found {total_scenes} scenes to wire\n")
    
    for i, scene in enumerate(scenes):
        scene_id = scene.get('scene', 'scene-001')
        scene_num_str = scene_id.replace('scene-', '')
        scene_idx = int(scene_num_str)
        
        # Skip if specific scene requested
        if scene_num and scene_idx != scene_num:
            continue
        
        scene_title = scene.get('title', f'Scene {scene_idx}')
        lines = scene.get('lines', [])
        
        # Get first line for display
        first_line = lines[0] if lines else {'voice': 'narrator', 'text': '...'}
        character = get_character_display(first_line.get('voice', 'narrator'))
        narration_text = first_line.get('text', '...')
        
        # Get audio file (first line ID)
        audio_file = f"{first_line.get('id', f'{scene_num_str}-01')}.mp3"
        
        # Get image file
        image_file = f"scene-{scene_num_str}.png"
        
        # Get image alt from prompts
        image_alt = f"Scene {scene_idx} illustration"
        for prompt_scene in prompts_data.get('scenes', []):
            if prompt_scene.get('scene') == scene_id:
                image_alt = prompt_scene.get('prompt', image_alt)[:150]
                break
        
        # Navigation
        if scene_idx == 1:
            prev_link = "../index.html"
            prev_text = "← Chapter"
        else:
            prev_link = f"../scene-{scene_idx-1:03d}/index.html"
            prev_text = "← Previous"
        
        if scene_idx >= total_scenes:
            next_link = "../index.html"
            next_text = "Finish Chapter →"
        else:
            next_link = f"../scene-{scene_idx+1:03d}/index.html"
            next_text = "Next Scene →"
        
        # Generate HTML
        html_content = SCENE_TEMPLATE.format(
            chapter=chapter_num,
            scene_title=scene_title,
            image_file=image_file,
            image_alt=image_alt,
            character=character,
            narration_text=narration_text,
            audio_file=audio_file,
            prev_link=prev_link,
            prev_text=prev_text,
            next_link=next_link,
            next_text=next_text
        )
        
        # Write HTML
        scene_dir = chapter_dir / f'scene-{scene_num_str}'
        scene_dir.mkdir(exist_ok=True)
        html_file = scene_dir / 'index.html'
        
        if dry_run:
            print(f"   [DRY] Would write: {html_file}")
        else:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(html_content)
            print(f"   [OK] Wired: scene-{scene_num_str} -> {image_file} + {audio_file}")
    
    return True


def main():
    parser = argparse.ArgumentParser(description='Wire chapter HTML to real assets')
    parser.add_argument('--chapter', '-c', type=int, help='Chapter number (1-10)')
    parser.add_argument('--scene', '-s', type=int, help='Specific scene number')
    parser.add_argument('--all', '-a', action='store_true', help='Wire all chapters')
    parser.add_argument('--dry-run', '-n', action='store_true', help='Show what would be done')
    
    args = parser.parse_args()
    
    print("\n[WIRE] Sir James Book002 - HTML Wiring Tool")
    print("=" * 50)
    
    if args.all:
        for ch in range(1, 11):
            wire_chapter(ch, dry_run=args.dry_run)
    elif args.chapter:
        wire_chapter(args.chapter, args.scene, dry_run=args.dry_run)
    else:
        print("Usage: python wire_chapter_html.py --chapter 1")
        print("       python wire_chapter_html.py --all")
        return
    
    print("\n[DONE] All scenes wired!")
    print("\nNext steps:")
    print("  1. Test locally: open public-book002/chapter01/scene-001/index.html")
    print("  2. Deploy: netlify deploy --dir=public-book002 --prod")


if __name__ == '__main__':
    main()
