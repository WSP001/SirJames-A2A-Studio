#!/usr/bin/env python3
"""
Wire Chapter HTML v2 - Enhanced multi-line scene generator.

Generates scene HTML with ALL dialogue lines (like Chapter 1), not just the first line.
Includes "Play Story" button that plays all audio sequentially.

Usage:
    python tools/wire_chapter_html_v2.py --chapter 2
    python tools/wire_chapter_html_v2.py --all
    python tools/wire_chapter_html_v2.py --all --dry-run
"""

import json
import os
import argparse
from pathlib import Path

# Character display config
CHARACTER_CONFIG = {
    'narrator': {'name': '📖 Narrator', 'color': '#ffd700'},
    'sir_james': {'name': '⚔️ Sir James', 'color': '#4CAF50'},
    'claude': {'name': '🐕 Claude', 'color': '#FF9800'},
    'gramps': {'name': '👴 Gramps', 'color': '#9370DB'},
    'king_arthur': {'name': '👑 King Arthur', 'color': '#9370DB'},
    'sparky': {'name': '✨ Sparky', 'color': '#FFD700'},
}

def get_character_config(voice: str) -> dict:
    """Get character display name and color."""
    return CHARACTER_CONFIG.get(voice, {'name': voice.title(), 'color': '#ffd700'})


def find_audio_file(chapter_dir: Path, scene_num: int, line_idx: int, chapter_num: int, voice: str) -> str:
    """Find the audio file for a line, checking multiple naming conventions."""
    audio_dir = chapter_dir / 'audio'
    
    # Convention 1: 002-01-01.mp3 (chapter-scene-line)
    conv1 = f"{chapter_num:03d}-{scene_num:02d}-{line_idx:02d}.mp3"
    if (audio_dir / conv1).exists():
        return conv1
    
    # Convention 2: scene-001-001-narrator.mp3
    conv2 = f"scene-{scene_num:03d}-{line_idx:03d}-{voice}.mp3"
    if (audio_dir / 'voices' / conv2).exists():
        return f"voices/{conv2}"
    
    # Convention 3: Just check if it exists in audio folder
    if (audio_dir / conv2).exists():
        return conv2
    
    # Fallback: return the most likely format
    return conv1


def generate_scene_html(chapter_num: int, scene_data: dict, scene_idx: int, total_scenes: int, chapter_title: str, chapter_dir: Path) -> str:
    """Generate full HTML for a scene with all dialogue lines."""
    
    scene_title = scene_data.get('title', f'Scene {scene_idx}')
    lines = scene_data.get('lines', [])
    
    # Build narration boxes HTML
    narration_boxes = []
    for i, line in enumerate(lines, 1):
        voice = line.get('voice', 'narrator')
        text = line.get('text', '...')
        line_id = line.get('id', f'{chapter_num:03d}-{scene_idx:02d}-{i:02d}')
        
        char_config = get_character_config(voice)
        audio_file = find_audio_file(chapter_dir, scene_idx, i, chapter_num, voice)
        
        # Claude is SFX only (no audio)
        if voice == 'claude':
            box_html = f'''
        <!-- Line {i:03d}: {voice.title()} -->
        <div class="narration-box" data-line="{i:03d}">
            <div class="narration-text">
                <span class="character-name" style="color: {char_config['color']};">{char_config['name']}:</span>
                {text}
            </div>
        </div>'''
        else:
            box_html = f'''
        <!-- Line {i:03d}: {voice.title()} -->
        <div class="narration-box" data-line="{i:03d}">
            <div class="narration-text">
                <span class="character-name" style="color: {char_config['color']};">{char_config['name']}:</span>
                {text}
            </div>
            <audio data-line="{i:03d}" preload="auto" src="../audio/{audio_file}"></audio>
        </div>'''
        
        narration_boxes.append(box_html)
    
    narration_html = '\n'.join(narration_boxes)
    
    # Navigation links
    if scene_idx == 1:
        prev_link = "../index.html"
        prev_text = "⬅️ Chapter"
    else:
        prev_link = f"../scene-{scene_idx-1:03d}/index.html"
        prev_text = "⬅️ Previous"
    
    if scene_idx >= total_scenes:
        next_link = "../../index.html"
        next_text = "🏠 All Chapters"
    else:
        next_link = f"../scene-{scene_idx+1:03d}/index.html"
        next_text = "Next ➡️"
    
    # Full HTML template
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sir James Adventures - Chapter {chapter_num} - {chapter_title}</title>
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
            min-height: 48px;
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
        .home-button {{
            display: block;
            background: linear-gradient(135deg, #ffd700, #ff8c00);
            color: #333;
            padding: 18px 30px;
            min-height: 48px;
            border-radius: 50px;
            text-decoration: none;
            text-align: center;
            font-size: 1.3em;
            font-weight: bold;
            margin-bottom: 15px;
            box-shadow: 0 4px 15px rgba(255,215,0,0.4);
            transition: all 0.3s ease;
        }}
        .home-button:hover {{
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(255,215,0,0.6);
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
            border: 3px solid white;
            color: white;
            padding: 18px 25px;
            min-height: 48px;
            border-radius: 50px;
            text-decoration: none;
            text-align: center;
            font-size: 1.2em;
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
            font-size: 1.3em;
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
        
        <img src="../images/scene-{scene_idx:03d}.png" 
             alt="{scene_title} - Sir James Adventures"
             class="scene-image">
        {narration_html}

        <!-- Play All Button -->
        <div class="audio-controls">
            <button class="play-btn" id="playAllBtn" aria-label="Play all narration">
                ▶️ Play Story
            </button>
        </div>
        
        <!-- Big Home Button for easy navigation back to all chapters -->
        <a href="../../index.html" class="home-button">🏠 All Chapters</a>
        
        <div class="navigation">
            <a href="{prev_link}" class="nav-button">{prev_text}</a>
            <a href="{next_link}" class="nav-button primary">{next_text}</a>
        </div>
    </div>
    
    <script>
        // Collect all audio elements in order
        const audioElements = Array.from(document.querySelectorAll('audio[data-line]'));
        const playAllBtn = document.getElementById('playAllBtn');
        let currentIndex = 0;
        let isPlaying = false;

        // Play all lines sequentially
        async function playAll() {{
            if (isPlaying) {{
                // Stop all
                audioElements.forEach(a => {{ a.pause(); a.currentTime = 0; }});
                playAllBtn.textContent = '▶️ Play Story';
                isPlaying = false;
                currentIndex = 0;
                return;
            }}

            isPlaying = true;
            playAllBtn.textContent = '⏸ Pause';

            for (let i = currentIndex; i < audioElements.length; i++) {{
                if (!isPlaying) break;
                currentIndex = i;
                const audio = audioElements[i];
                
                // Highlight current line
                document.querySelectorAll('.narration-box').forEach(box => box.style.opacity = '0.6');
                audio.closest('.narration-box').style.opacity = '1';
                
                try {{
                    await audio.play();
                    await new Promise(resolve => {{
                        audio.onended = resolve;
                    }});
                }} catch (e) {{
                    console.log('Audio play failed:', e);
                }}
            }}

            // Reset when done
            document.querySelectorAll('.narration-box').forEach(box => box.style.opacity = '1');
            playAllBtn.textContent = '▶️ Play Again';
            isPlaying = false;
            currentIndex = 0;
        }}

        playAllBtn.addEventListener('click', playAll);

        // Allow tapping individual lines to play just that line
        document.querySelectorAll('.narration-box[data-line]').forEach(box => {{
            box.style.cursor = 'pointer';
            box.addEventListener('click', function(e) {{
                if (e.target.closest('audio')) return;
                const audio = this.querySelector('audio');
                if (audio) {{
                    // Stop any playing audio
                    audioElements.forEach(a => {{ a.pause(); a.currentTime = 0; }});
                    audio.play().catch(e => console.log('Tap play failed:', e));
                }}
            }});
        }});

        // iOS audio unlock
        document.addEventListener('touchstart', function() {{
            audioElements.forEach(a => a.load());
        }}, {{ once: true }});
    </script>
</body>
</html>
'''
    return html


def generate_chapter_index(chapter_num: int, chapter_title: str, scenes: list) -> str:
    """Generate chapter index page with scene list."""
    
    scene_links = []
    for i, scene in enumerate(scenes, 1):
        scene_title = scene.get('title', f'Scene {i}')
        scene_links.append(f'''
        <a href="scene-{i:03d}/index.html" class="scene-card">
            <div class="scene-number">Scene {i}</div>
            <div class="scene-title">{scene_title}</div>
            <img src="images/scene-{i:03d}.png" alt="{scene_title}" class="scene-thumb">
        </a>''')
    
    scenes_html = '\n'.join(scene_links)
    
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sir James Adventures - Chapter {chapter_num}: {chapter_title}</title>
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            padding: 20px;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
        }}
        h1 {{
            text-align: center;
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }}
        .chapter-subtitle {{
            text-align: center;
            font-size: 1.3em;
            margin-bottom: 30px;
            opacity: 0.9;
        }}
        .home-link {{
            display: block;
            text-align: center;
            margin-bottom: 30px;
        }}
        .home-link a {{
            background: linear-gradient(135deg, #ffd700, #ff8c00);
            color: #333;
            padding: 15px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            font-size: 1.2em;
            display: inline-block;
            box-shadow: 0 4px 15px rgba(255,215,0,0.4);
            transition: all 0.3s ease;
        }}
        .home-link a:hover {{
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(255,215,0,0.6);
        }}
        .scenes-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 25px;
        }}
        .scene-card {{
            background: rgba(255,255,255,0.15);
            border-radius: 20px;
            padding: 20px;
            text-decoration: none;
            color: white;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            -webkit-backdrop-filter: blur(10px);
            backdrop-filter: blur(10px);
        }}
        .scene-card:hover {{
            transform: translateY(-5px);
            background: rgba(255,255,255,0.25);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }}
        .scene-number {{
            font-size: 0.9em;
            opacity: 0.8;
            margin-bottom: 5px;
        }}
        .scene-title {{
            font-size: 1.2em;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
        }}
        .scene-thumb {{
            width: 100%;
            height: 180px;
            object-fit: cover;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }}
        .start-btn {{
            display: block;
            text-align: center;
            margin-top: 30px;
        }}
        .start-btn a {{
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 20px 60px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            font-size: 1.4em;
            display: inline-block;
            box-shadow: 0 4px 15px rgba(76,175,80,0.4);
            transition: all 0.3s ease;
        }}
        .start-btn a:hover {{
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(76,175,80,0.6);
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>Chapter {chapter_num}</h1>
        <div class="chapter-subtitle">{chapter_title}</div>
        
        <div class="home-link">
            <a href="../index.html">🏠 All Chapters</a>
        </div>
        
        <div class="scenes-grid">
            {scenes_html}
        </div>
        
        <div class="start-btn">
            <a href="scene-001/index.html">▶️ Start Chapter</a>
        </div>
    </div>
</body>
</html>
'''
    return html


def wire_chapter(chapter_num: int, dry_run: bool = False):
    """Wire all HTML files for a chapter."""
    
    repo_root = Path(__file__).parent.parent
    chapter_dir = repo_root / 'public-book002' / f'chapter{chapter_num:02d}'
    
    # Load narration batch
    narration_file = chapter_dir / '_narration_batch.json'
    if not narration_file.exists():
        print(f"[SKIP] Chapter {chapter_num}: No _narration_batch.json found")
        return False
    
    with open(narration_file, 'r', encoding='utf-8') as f:
        narration_data = json.load(f)
    
    chapter_title = narration_data.get('title', f'Chapter {chapter_num}')
    scenes = narration_data.get('scenes', [])
    total_scenes = len(scenes)
    
    print(f"\n[CHAPTER {chapter_num}] {chapter_title}")
    print(f"   Scenes: {total_scenes}")
    
    # Generate chapter index
    index_html = generate_chapter_index(chapter_num, chapter_title, scenes)
    index_file = chapter_dir / 'index.html'
    
    if dry_run:
        print(f"   [DRY] Would write: {index_file}")
    else:
        with open(index_file, 'w', encoding='utf-8') as f:
            f.write(index_html)
        print(f"   [OK] Chapter index: {index_file.name}")
    
    # Generate scene pages
    for i, scene in enumerate(scenes, 1):
        scene_html = generate_scene_html(
            chapter_num, scene, i, total_scenes, chapter_title, chapter_dir
        )
        
        scene_dir = chapter_dir / f'scene-{i:03d}'
        scene_dir.mkdir(exist_ok=True)
        scene_file = scene_dir / 'index.html'
        
        if dry_run:
            print(f"   [DRY] Would write: scene-{i:03d}/index.html")
        else:
            with open(scene_file, 'w', encoding='utf-8') as f:
                f.write(scene_html)
            print(f"   [OK] Scene {i}: {scene.get('title', 'Untitled')}")
    
    return True


def main():
    parser = argparse.ArgumentParser(description='Wire chapter HTML v2 - Multi-line scenes')
    parser.add_argument('--chapter', '-c', type=int, help='Chapter number (1-10)')
    parser.add_argument('--all', '-a', action='store_true', help='Wire all chapters')
    parser.add_argument('--dry-run', '-n', action='store_true', help='Show what would be done')
    parser.add_argument('--skip-chapter1', action='store_true', help='Skip Chapter 1 (already wired)')
    
    args = parser.parse_args()
    
    print("\n" + "=" * 60)
    print(" SIR JAMES BOOK002 - HTML WIRING TOOL v2")
    print(" Multi-line scenes with Play Story button")
    print("=" * 60)
    
    if args.all:
        start = 2 if args.skip_chapter1 else 1
        for ch in range(start, 11):
            wire_chapter(ch, dry_run=args.dry_run)
    elif args.chapter:
        wire_chapter(args.chapter, dry_run=args.dry_run)
    else:
        print("\nUsage:")
        print("  python tools/wire_chapter_html_v2.py --chapter 2")
        print("  python tools/wire_chapter_html_v2.py --all")
        print("  python tools/wire_chapter_html_v2.py --all --skip-chapter1")
        print("  python tools/wire_chapter_html_v2.py --all --dry-run")
        return
    
    print("\n" + "=" * 60)
    print(" DONE!")
    print("=" * 60)
    print("\nNext steps:")
    print("  1. Test locally: netlify dev")
    print("  2. Open: http://localhost:8888")
    print("  3. Deploy: netlify deploy --dir=public-book002 --prod")


if __name__ == '__main__':
    main()
