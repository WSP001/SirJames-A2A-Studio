#!/usr/bin/env python3
"""
Sir James Adventures - Book002 Asset Generator
Generates all missing images and audio for Book002

Usage:
    python generate_book002_assets.py --chapter 1
    python generate_book002_assets.py --all
"""

import os
import sys
import json
import requests
from pathlib import Path
from typing import Dict, List
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent.parent / ".env.local")

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))


class Book002AssetGenerator:
    def __init__(self, force: bool = False):
        self.force = force
        self.base_dir = Path(__file__).parent.parent
        self.source_dir = Path(
            "../../SIR_JAMES_BOOK001_WORKING_MASTER/chapters"
        )
        self.output_dir = self.base_dir / "public-book002/assets"
        self.images_dir = self.output_dir / "images"
        self.audio_dir = self.output_dir / "audio"

        # Create directories
        self.images_dir.mkdir(parents=True, exist_ok=True)
        self.audio_dir.mkdir(parents=True, exist_ok=True)

        # Load API keys
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.elevenlabs_key = os.getenv("ELEVENLABS_API_KEY")
        self.gemini_key = os.getenv("GEMINI_API_KEY")

        if not self.openai_key:
            print("❌ OPENAI_API_KEY not found in environment")
            sys.exit(1)
        if not self.elevenlabs_key:
            print("❌ ELEVENLABS_API_KEY not found in environment")
            sys.exit(1)
        if not self.gemini_key:
            print("⚠️ GEMINI_API_KEY not found - falling back to templates")
        else:
            import google.generativeai as genai
            genai.configure(api_key=self.gemini_key)
            self.model = genai.GenerativeModel('nano-banana-pro-preview')

    def extract_scene_data(self, chapter_file: Path) -> List[Dict]:
        """Extract scene data from HTML chapter file"""
        scenes = []

        with open(chapter_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Simple extraction - in production, use proper HTML parsing
        import re

        # Find all scene divs
        scene_pattern = r'<div class="scene">(.*?)</div>'
        scene_matches = re.findall(scene_pattern, content, re.DOTALL)

        for i, scene_html in enumerate(scene_matches, 1):
            # Extract narration
            narration_match = re.search(
                r'<strong>Narration:</strong> (.*?)</p>', scene_html
            )
            narration = (
                narration_match.group(1) if narration_match else ""
            )

            # Extract dialogue
            dialogue_match = re.search(
                r'<strong>Dialogue:</strong> (.*?)</p>', scene_html
            )
            dialogue = dialogue_match.group(1) if dialogue_match else ""

            scenes.append({
                "scene_number": i,
                "narration": narration,
                "dialogue": dialogue
            })

        return scenes

    def generate_image_prompt(self, chapter: int, scene: Dict) -> str:
        """Generate DALL-E prompt for scene"""
        # Strict Character Descriptions based on Reference Images
        sir_james = (
            "Sir James (a cute 5-year-old boy knight with messy brown hair, "
            "wearing a blue tunic with silver trim, brown pants, and brown "
            "boots, holding a wooden sword)"
        )
        claude = (
            "Claude (a loyal brown Coonhound dog with royal posture, "
            "wearing a blue collar with a silver tag)"
        )
        sparky = (
            "Sparky (a mischievous, energetic red squirrel with a fluffy tail)"
        )
        gramps = (
            "Gramps (a kind older man with a full white beard and hair, "
            "wearing a forest-green tunic with brown leather belt and boots)"
        )

        # Combined context for prompts
        characters = f"{sir_james}, {claude} the dog"
        if ("Sparky" in scene.get('narration', '') or
                "Sparky" in scene.get('dialogue', '')):
            characters += f", {sparky} the squirrel"
        if ("Gramps" in scene.get('narration', '') or
                "Gramps" in scene.get('dialogue', '')):
            characters += f", {gramps}"

        # Use Gemini if available
        if hasattr(self, 'model') and self.gemini_key:
            try:
                prompt_request = (
                    f"Create a DALL-E 3 image prompt for a children's "
                    f"book scene. Chapter {chapter}, Scene "
                    f"{scene['scene_number']}.\n"
                    f"Narration: {scene['narration']}\n"
                    f"Dialogue: {scene['dialogue']}\n\n"
                    f"CRITICAL VISUAL RULES:\n"
                    f"1. MAIN CHARACTER: {sir_james}. HE MUST LOOK EXACTLY "
                    f"5 YEARS OLD.\n"
                    f"2. LOYAL COMPANION: {claude}.\n"
                    f"3. IF PRESENT: {sparky}.\n"
                    f"4. IF PRESENT: {gramps}.\n"
                    f"5. STYLE: 3D animated movie style (Pixar-esque), "
                    f"vibrant colors, soft lighting, high detail, 4K.\n"
                    f"6. NO TEXT in the image.\n"
                    f"7. Provide ONLY the prompt text, no intro/outro."
                )

                response = self.model.generate_content(prompt_request)
                if response.text:
                    return response.text.strip()
            except Exception as e:
                print(f"    ⚠️ Gemini prompt generation failed: {e}")
                # Fall back to templates below

        base_prompts = {
            1: f"{sir_james} standing in a medieval castle courtyard with "
               f"{claude}, looking brave",
            2: f"{sir_james} walking through an enchanted forest with "
               f"{claude}, sunlight filtering through trees",
            3: f"{sir_james} and {claude} approaching a wise old wizard in a "
               f"mystical forest clearing, magical sparkles in the air, "
               f"{sparky} peeking from a branch",
            4: f"{sir_james} discovering a glowing crystal in an underground "
               f"cave with {claude}, illuminating the darkness",
            5: f"{sir_james} helping a lost baby dragon find its way home, "
               f"showing kindness and courage, {claude} watching protectively",
            6: f"{sir_james} crossing a rainbow bridge over a sparkling "
               f"river with {claude}, {sparky} scampering ahead",
            7: f"{sir_james} in a magical garden with talking flowers and "
               f"butterflies, wonder and awe on his face",
            8: f"{sir_james} sailing on a cloud ship across a starry night "
               f"sky with {claude}, dreams of adventure in his eyes",
            9: f"{sir_james} celebrating with friends in a castle hall, "
               f"banners and joy all around, {claude} sitting proudly",
            10: f"{sir_james} being knighted by King Arthur, becoming a "
                f"true knight of the realm, {claude} by his side"
        }

        base_prompt = base_prompts.get(
            chapter, f"{characters} on an adventure"
        )

        # Add style guidance
        full_prompt = (
            f"{base_prompt}.\n"
            "Style: 3D animated movie style, vibrant colors, "
            "soft edges, gentle lighting, detailed textures.\n"
            "Medium: Digital 3D render.\n"
            "Mood: Whimsical, adventurous, child-friendly.\n"
            "Quality: High detail, 4K, colorful."
        )

        return full_prompt

    def generate_image(self, prompt: str, output_path: Path) -> bool:
        """Generate image using DALL-E 3"""
        headers = {
            "Authorization": f"Bearer {self.openai_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "dall-e-3",
            "prompt": prompt,
            "n": 1,
            "size": "1024x1024",
            "quality": "hd",
            "style": "vivid"
        }
        
        try:
            response = requests.post(
                "https://api.openai.com/v1/images/generations",
                headers=headers,
                json=payload,
                timeout=60
            )
            response.raise_for_status()

            image_url = response.json()["data"][0]["url"]

            # Download image
            img_response = requests.get(image_url, timeout=30)
            img_response.raise_for_status()

            with open(output_path, "wb") as f:
                f.write(img_response.content)

            return True

        except (requests.exceptions.RequestException, OSError) as e:
            print(f"    ❌ Error generating image: {e}")
            return False

    def generate_audio(
        self, text: str, voice_id: str, output_path: Path
    ) -> bool:
        """Generate audio using ElevenLabs"""
        headers = {
            "xi-api-key": self.elevenlabs_key,
            "Content-Type": "application/json"
        }

        payload = {
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.75,
                "similarity_boost": 0.75,
                "style": 0.5,
                "use_speaker_boost": True
            }
        }

        try:
            response = requests.post(
                f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
                headers=headers,
                json=payload,
                timeout=30
            )
            response.raise_for_status()

            with open(output_path, "wb") as f:
                f.write(response.content)

            return True

        except (requests.exceptions.RequestException, OSError) as e:
            print(f"    ❌ Error generating audio: {e}")
            return False

    def process_chapter(self, chapter_num: int):
        """Process a single chapter"""
        print(f"\n📖 Processing Chapter {chapter_num}")
        print("=" * 50)

        chapter_file = self.source_dir / f"chapter{chapter_num}.html"
        if not chapter_file.exists():
            print(f"❌ Chapter file not found: {chapter_file}")
            return

        scenes = self.extract_scene_data(chapter_file)
        print(f"📝 Found {len(scenes)} scenes")

        # Generate images
        print("\n🎨 Generating images...")
        for scene in scenes:
            scene_num = scene["scene_number"]
            image_file = (
                self.images_dir /
                f"chapter{chapter_num}-scene-{scene_num:03d}.png"
            )

            if image_file.exists() and not self.force:
                print(f"  ⏭️  Scene {scene_num}: Image already exists")
                continue

            prompt = self.generate_image_prompt(chapter_num, scene)
            print(f"  🎨 Scene {scene_num}: Generating image...")

            if self.generate_image(prompt, image_file):
                print(f"    ✅ Saved to {image_file}")
            else:
                print("    ❌ Failed to generate image")

            time.sleep(1)  # Rate limiting

        # Generate audio
        print("\n🎤 Generating audio...")
        voice_map = {
            "narrator": "pNInz6obpgDQGcFmaJgB",
            "sir_james": "ErXwobaYiN019PkySvjV",
            "claude": "VR6AewLTigWG4xSOukaG",
            "gramps": "TxGEqnHWrfWFTfGW9XjX"
        }
        
        for scene in scenes:
            scene_num = scene["scene_number"]

            # Generate narration
            if scene["narration"]:
                audio_file = (
                    self.audio_dir /
                    f"chapter{chapter_num}-scene-{scene_num:03d}-narration.mp3"
                )

                if not audio_file.exists() or self.force:
                    print(f"  🎤 Scene {scene_num}: Generating narration...")
                    success = self.generate_audio(
                        scene["narration"], voice_map["narrator"], audio_file
                    )
                    if success:
                        print(f"    ✅ Saved to {audio_file}")
                    else:
                        print("    ❌ Failed to generate narration")
                    time.sleep(0.5)

            # Generate dialogue if present
            if scene["dialogue"]:
                # Parse dialogue and generate for each character
                try:
                    dialogue_data = json.loads(scene["dialogue"])
                    for item in dialogue_data:
                        if isinstance(item, dict) and "character" in item:
                            character = item["character"].lower()
                            text = item.get("text", item.get("thought", ""))

                            if character in voice_map and text:
                                audio_file = (
                                    self.audio_dir /
                                    f"chapter{chapter_num}-scene-"
                                    f"{scene_num:03d}-{character}.mp3"
                                )

                                if not audio_file.exists() or self.force:
                                    print(
                                        f"  🎤 Scene {scene_num}: Generating "
                                        f"{character} dialogue..."
                                    )
                                    success = self.generate_audio(
                                        text, voice_map[character], audio_file
                                    )
                                    if success:
                                        print(f"    ✅ Saved to {audio_file}")
                                    else:
                                        print(
                                            f"    ❌ Failed to generate "
                                            f"{character} dialogue"
                                        )
                                    time.sleep(0.5)
                except Exception:
                    pass  # Skip if dialogue parsing fails

    def process_all(self):
        """Process all chapters"""
        for chapter in range(1, 11):
            self.process_chapter(chapter)
            print("\\n⏳ Waiting 10 seconds before next chapter...")
            time.sleep(10)


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Generate Book002 assets")
    parser.add_argument(
        "--chapter", type=int, help="Chapter number to process"
    )
    parser.add_argument(
        "--all", action="store_true", help="Process all chapters"
    )
    parser.add_argument(
        "--force", action="store_true", help="Overwrite existing assets"
    )

    args = parser.parse_args()

    generator = Book002AssetGenerator(force=args.force)

    if args.all:
        generator.process_all()
    elif args.chapter:
        generator.process_chapter(args.chapter)
    else:
        print("Please specify --chapter N or --all")


if __name__ == "__main__":
    main()
