#!/usr/bin/env python3
"""
Sir James Adventures - Local Agent CLI
Helper tool for Book002 workflows, validation, and project management
"""

import os
import sys
import json
import subprocess
import argparse
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv

# Project configuration
PROJECT_ROOT = Path(__file__).parent.parent

# Load environment variables from .env.local
load_dotenv(PROJECT_ROOT / '.env.local')
DOCS_DIR = PROJECT_ROOT / "Docs"
SCRIPTS_DIR = PROJECT_ROOT / "scripts"
NETLIFY_FUNCTIONS = PROJECT_ROOT / "netlify" / "functions"

class LocalAgent:
    """Sir James Book002 local helper agent"""
    
    def __init__(self):
        self.project_root = PROJECT_ROOT
        self.docs_dir = DOCS_DIR
        self.scripts_dir = SCRIPTS_DIR
        self.functions_dir = NETLIFY_FUNCTIONS
    
    def show_help(self):
        """Display help information"""
        print("=" * 60)
        print("SIR JAMES ADVENTURES - LOCAL AGENT")
        print("=" * 60)
        print("\nAvailable commands:")
        print("  setup      - Show project setup overview")
        print("  validate   - Run validation checks")
        print("  status     - Show current project status")
        print("  generate   - Generate chapter content")
        print("  test       - Test API connections")
        print("  deploy     - Prepare for deployment")
        print("\nExamples:")
        print("  python tools/local_agent.py setup")
        print("  python tools/local_agent.py validate --chapter 1")
        print("  python tools/local_agent.py generate --chapter 1 --images")
    
    def show_setup(self):
        """Display project setup overview"""
        print("\n" + "=" * 60)
        print("SIR JAMES BOOK002 - SETUP OVERVIEW")
        print("=" * 60)
        
        print("\n[PROJECT] Project Structure:")
        print(f"  Root: {self.project_root}")
        print(f"  Docs: {self.docs_dir}")
        print(f"  Scripts: {self.scripts_dir}")
        print(f"  Functions: {self.functions_dir}")
        
        print("\n[ENV] Environment Variables:")
        env_vars = {
            'GEMINI_API_KEY': os.environ.get('GEMINI_API_KEY', 'NOT SET'),
            'OPENAI_API_KEY': os.environ.get('OPENAI_API_KEY', 'NOT SET'),
            'ELEVENLABS_API_KEY': os.environ.get('ELEVENLABS_API_KEY', 'NOT SET'),
            'SUNO_API_KEY': os.environ.get('SUNO_API_KEY', 'NOT SET'),
            'NETLIFY_AUTH_TOKEN': os.environ.get('NETLIFY_AUTH_TOKEN', 'NOT SET')
        }
        
        for key, value in env_vars.items():
            status = "[OK]" if value != 'NOT SET' else "[MISSING]"
            print(f"  {status} {key}: {'SET' if value != 'NOT SET' else 'MISSING'}")
        
        print("\n[DOCS] Key Documentation:")
        key_docs = [
            'AGENTS.md',
            'BOOK002_IMAGE_AUDIO_PLAN.md',
            'HYBRID_PLAN.md',
            'PROJECT_STRUCTURE.md',
            'PRODUCTION_READY.md'
        ]
        
        for doc in key_docs:
            doc_path = self.project_root / doc
            status = "[OK]" if doc_path.exists() else "[MISSING]"
            print(f"  {status} {doc}")
        
        print("\n[START] Quick Start Commands:")
        print("  1. Set API keys: See .env.local")
        print("  2. Test connections: python tools/local_agent.py test")
        print("  3. Validate setup: python tools/local_agent.py validate")
        print("  4. Generate Chapter 1: python tools/local_agent.py generate --chapter 1")
    
    def validate(self, chapter=None):
        """Run validation checks"""
        print("\n" + "=" * 60)
        print("SIR JAMES BOOK002 - VALIDATION")
        print("=" * 60)
        
        # Check environment
        print("\n[1/5] Environment Check:")
        required_vars = ['GEMINI_API_KEY', 'OPENAI_API_KEY']
        optional_vars = ['ELEVENLABS_API_KEY', 'SUNO_API_KEY']
        
        all_good = True
        for var in required_vars:
            if os.environ.get(var):
                print(f"  [OK] {var} configured")
            else:
                print(f"  [MISSING] {var} missing")
                all_good = False
        
        for var in optional_vars:
            if os.environ.get(var):
                print(f"  [OK] {var} configured")
            else:
                print(f"  [OPTIONAL] {var} optional but recommended")
        
        # Check dependencies
        print("\n[2/5] Dependencies Check:")
        try:
            import google.generativeai as genai
            print("  [OK] google-generativeai installed")
        except ImportError:
            print("  [MISSING] google-generativeai missing")
            all_good = False
        
        try:
            import openai
            print("  [OK] openai installed")
        except ImportError:
            print("  [MISSING] openai missing")
            all_good = False
        
        # Check Netlify functions
        print("\n[3/5] Netlify Functions Check:")
        required_functions = ['curate-media.ts', 'narrate-project.ts']
        for func in required_functions:
            func_path = self.functions_dir / func
            if func_path.exists():
                print(f"  [OK] {func}")
            else:
                print(f"  [MISSING] {func} missing")
                all_good = False
        
        # Check chapter structure
        print("\n[4/5] Chapter Structure Check:")
        if chapter:
            chapter_dir = self.project_root / "public-book002" / f"chapter{chapter:02d}"
            if chapter_dir.exists():
                print(f"  [OK] Chapter {chapter} directory exists")
                # Check for scene files
                scene_files = list(chapter_dir.glob("scene-*/index.html"))
                print(f"  [OK] Found {len(scene_files)} scene files")
            else:
                print(f"  [MISSING] Chapter {chapter} directory missing")
        else:
            print("  [INFO] Specify --chapter N to validate specific chapter")
        
        # Check documentation
        print("\n[5/5] Documentation Check:")
        docs_to_check = [
            'AGENTS.md',
            'Docs/BOOK002_IMAGE_AUDIO_PLAN.md',
            'HYBRID_PLAN.md'
        ]
        
        for doc in docs_to_check:
            doc_path = self.project_root / doc
            if doc_path.exists():
                print(f"  [OK] {doc}")
            else:
                print(f"  [MISSING] {doc} missing")
        
        # Summary
        print("\n" + "-" * 60)
        if all_good:
            print("[SUCCESS] VALIDATION PASSED - Ready for Book002 generation!")
        else:
            print("[FAILED] VALIDATION FAILED - Fix issues before proceeding")
        print("-" * 60)
        
        return all_good
    
    def test_connections(self):
        """Test API connections"""
        print("\n" + "=" * 60)
        print("SIR JAMES BOOK002 - API CONNECTION TESTS")
        print("=" * 60)
        
        # Test Gemini
        print("\n[1/4] Testing Gemini API...")
        try:
            import google.generativeai as genai
            api_key = os.environ.get('GEMINI_API_KEY')
            if api_key:
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel('gemini-2.5-flash')
                response = model.generate_content("Say 'test successful' in 3 words")
                print(f"  [SUCCESS] Gemini: {response.text.strip()}")
            else:
                print("  [FAILED] Gemini: API key not set")
        except Exception as e:
            print(f"  [ERROR] Gemini: {e}")
        
        # Test OpenAI
        print("\n[2/4] Testing OpenAI API...")
        try:
            import openai
            api_key = os.environ.get('OPENAI_API_KEY')
            if api_key:
                client = openai.OpenAI(api_key=api_key)
                response = client.models.list()
                print(f"  [SUCCESS] OpenAI: Connected ({len(list(response))} models available)")
            else:
                print("  [FAILED] OpenAI: API key not set")
        except Exception as e:
            print(f"  [ERROR] OpenAI: {e}")
        
        # Test ElevenLabs (if available)
        print("\n[3/4] Testing ElevenLabs API...")
        api_key = os.environ.get('ELEVENLABS_API_KEY')
        if api_key:
            print("  [SUCCESS] ElevenLabs: API key configured")
            print("  [INFO] Voice synthesis test requires actual generation")
        else:
            print("  [OPTIONAL] ElevenLabs: API key not set (optional for Phase 1)")
        
        # Test Suno (if available)
        print("\n[4/4] Testing Suno API...")
        api_key = os.environ.get('SUNO_API_KEY')
        if api_key:
            print("  [SUCCESS] Suno: API key configured")
            print("  [INFO] Music generation test requires actual generation")
        else:
            print("  [OPTIONAL] Suno: API key not set (optional for Phase 1)")
        
        print("\n" + "-" * 60)
        print("API tests complete!")
        print("-" * 60)
    
    def generate_chapter(self, chapter, images_only=False):
        """Generate chapter content"""
        print(f"\n" + "=" * 60)
        print(f"SIR JAMES BOOK002 - GENERATE CHAPTER {chapter}")
        print("=" * 60)
        
        # Validate chapter number
        if not (1 <= chapter <= 10):
            print(f"[ERROR] Invalid chapter number: {chapter} (must be 1-10)")
            return False
        
        # Check if orchestrate_book002_clean.py exists
        orchestrate_script = self.project_root.parent / "orchestrate_book002_clean.py"
        if not orchestrate_script.exists():
            print(f"[ERROR] Orchestration script not found: {orchestrate_script}")
            return False
        
        print(f"\n[GENERATE] Generating Chapter {chapter}...")
        print(f"  Images only: {images_only}")
        print(f"  Script: {orchestrate_script}")
        
        try:
            # Run the orchestration script
            cmd = [
                sys.executable, 
                str(orchestrate_script),
                "--chapter", str(chapter)
            ]
            
            if images_only:
                cmd.append("--images-only")
            
            print(f"\n[RUN] Running command: {' '.join(cmd)}")
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                print("[SUCCESS] Generation completed successfully!")
                print(result.stdout)
            else:
                print("[FAILED] Generation failed!")
                print(result.stderr)
                return False
                
        except Exception as e:
            print(f"[ERROR] Error running generation: {e}")
            return False
        
        # Check output
        output_dir = self.project_root / "public-book002" / f"chapter{chapter:02d}"
        if output_dir.exists():
            scene_files = list(output_dir.glob("scene-*/index.html"))
            image_files = list(output_dir.glob("scene-*/images/*.png"))
            print(f"\n[RESULT] Generated:")
            print(f"  Scenes: {len(scene_files)}")
            print(f"  Images: {len(image_files)}")
            print(f"  Location: {output_dir}")
        
        return True
    
    def show_status(self):
        """Show current project status"""
        print("\n" + "=" * 60)
        print("SIR JAMES BOOK002 - PROJECT STATUS")
        print("=" * 60)
        
        # Check generated chapters
        print("\n[CHAPTERS] Generated Chapters:")
        public_dir = self.project_root / "public-book002"
        if public_dir.exists():
            chapters = [d for d in public_dir.iterdir() if d.is_dir() and d.name.startswith("chapter")]
            chapters.sort()
            
            for chapter in chapters:
                scene_count = len(list(chapter.glob("scene-*/index.html")))
                image_count = len(list(chapter.glob("scene-*/images/*.png")))
                audio_count = len(list(chapter.glob("scene-*/audio/*.mp3")))
                
                status = "[COMPLETE]" if scene_count == 8 else "[PARTIAL]"
                print(f"  {status} {chapter.name}: {scene_count} scenes, {image_count} images, {audio_count} audio")
        else:
            print("  [NONE] No chapters generated yet")
        
        # Check API status
        print("\n[API] API Configuration:")
        apis = {
            'Gemini': os.environ.get('GEMINI_API_KEY'),
            'OpenAI': os.environ.get('OPENAI_API_KEY'),
            'ElevenLabs': os.environ.get('ELEVENLABS_API_KEY'),
            'Suno': os.environ.get('SUNO_API_KEY')
        }
        
        for api, key in apis.items():
            if key:
                print(f"  [OK] {api}: Configured")
            else:
                print(f"  [MISSING] {api}: Not configured")
        
        # Recent activity
        print("\n[ACTIVITY] Recent Activity:")
        status_file = self.project_root / "BOOK002_STATUS.md"
        if status_file.exists():
            stat = status_file.stat()
            modified = datetime.fromtimestamp(stat.st_mtime)
            print(f"  [DOC] Status updated: {modified.strftime('%Y-%m-%d %H:%M')}")
        
        print("\n[NEXT] Next Steps:")
        print("  1. Run 'python tools/local_agent.py validate' to check setup")
        print("  2. Run 'python tools/local_agent.py test' to verify APIs")
        print("  3. Run 'python tools/local_agent.py generate --chapter 1' to start")
    
    def prepare_deploy(self):
        """Prepare for deployment"""
        print("\n" + "=" * 60)
        print("SIR JAMES BOOK002 - DEPLOYMENT PREPARATION")
        print("=" * 60)
        
        # Check Netlify configuration
        netlify_toml = self.project_root / "netlify.toml"
        if netlify_toml.exists():
            print("[OK] netlify.toml found")
        else:
            print("[MISSING] netlify.toml missing")
        
        # Check functions
        print("\n[FUNCTIONS] Netlify Functions:")
        functions = list(self.functions_dir.glob("*.ts"))
        for func in functions:
            print(f"  [OK] {func.name}")
        
        # Check build output
        print("\n[BUILD] Build Output:")
        public_dir = self.project_root / "public-book002"
        if public_dir.exists():
            total_files = len(list(public_dir.rglob("*")))
            print(f"  [OK] {total_files} files in public-book002/")
        else:
            print("[MISSING] No build output found")
        
        # Deployment checklist
        print("\n[CHECKLIST] Deployment Checklist:")
        checklist = [
            "Environment variables set in Netlify dashboard",
            "All API keys configured",
            "Functions tested locally",
            "Build output verified",
            "Domain configured (if custom)",
            "HTTPS enabled"
        ]
        
        for item in checklist:
            print(f"  [ ] {item}")
        
        print("\n[DEPLOY] Deploy Command:")
        print("  netlify deploy --prod")

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Sir James Book002 Local Agent")
    parser.add_argument('command', choices=['setup', 'validate', 'status', 'test', 'generate', 'deploy', 'help'],
                       help='Command to execute')
    parser.add_argument('--chapter', type=int, help='Chapter number (1-10)')
    parser.add_argument('--images-only', action='store_true', help='Generate images only')
    
    args = parser.parse_args()
    
    agent = LocalAgent()
    
    if args.command == 'help' or args.command == 'setup':
        agent.show_help()
        if args.command == 'setup':
            agent.show_setup()
    elif args.command == 'validate':
        agent.validate(args.chapter)
    elif args.command == 'status':
        agent.show_status()
    elif args.command == 'test':
        agent.test_connections()
    elif args.command == 'generate':
        if not args.chapter:
            print("[ERROR] --chapter required for generate command")
            sys.exit(1)
        agent.generate_chapter(args.chapter, args.images_only)
    elif args.command == 'deploy':
        agent.prepare_deploy()

if __name__ == "__main__":
    main()
