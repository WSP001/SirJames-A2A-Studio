#!/usr/bin/env python3
"""
Update HTML files to reference generated assets
"""

from pathlib import Path
import re


def update_html_file(html_file: Path, chapter_num: int, scene_num: int):
    """Update a single HTML file with correct asset paths"""

    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Update image path
    old_image_pattern = r'src="\.\./images/scene-\d+\.png"'
    new_image_src = (
        f'src="../assets/images/chapter{chapter_num}-'
        f'scene-{scene_num:03d}.png"'
    )
    content = re.sub(old_image_pattern, f'src="{new_image_src}"', content)

    # Update audio paths
    old_audio_pattern = r'src="\.\./audio/scene-\d+\.mp3"'
    new_audio_src = (
        f'src="../assets/audio/chapter{chapter_num}-'
        f'scene-{scene_num:03d}-narration.mp3"'
    )
    content = re.sub(old_audio_pattern, f'src="{new_audio_src}"', content)

    # Remove DALL-E pending text if present
    content = re.sub(
        r'<p>.*?DALL-E pending.*?</p>', '', content, flags=re.IGNORECASE
    )

    # Write back
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✅ Updated {html_file.name}")


def main():
    base_dir = Path(__file__).parent.parent / "public-book002"

    for chapter in range(1, 11):
        chapter_dir = base_dir / f"chapter{chapter:02d}"

        if not chapter_dir.exists():
            continue

        print(f"\n📖 Updating Chapter {chapter}")

        # Find all scene HTML files
        for scene_file in chapter_dir.glob("scene-*/index.html"):
            scene_num = int(scene_file.parent.name.split("-")[1])
            update_html_file(scene_file, chapter, scene_num)


if __name__ == "__main__":
    main()
