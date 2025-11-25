#!/usr/bin/env python3
"""
Test Gemini API Connection
Fixes model version issue and validates API key
"""

import os
import sys

# Set API key
GEMINI_API_KEY = "AIzaSyD2A0y6Me8F6FWRQNzkshSkcsz-QrAWYYo"
os.environ['GEMINI_API_KEY'] = GEMINI_API_KEY

print("=" * 60)
print("GEMINI API CONNECTION TEST")
print("=" * 60)

# Check if google-generativeai is installed
try:
    import google.generativeai as genai
    print("[OK] google-generativeai module found")
except ImportError:
    print("[ERROR] google-generativeai not installed")
    print("[ACTION] Run: pip install google-generativeai==0.7.2")
    sys.exit(1)

# Configure API
try:
    genai.configure(api_key=GEMINI_API_KEY)
    print("[OK] API key configured")
except Exception as e:
    print(f"[ERROR] Failed to configure API: {e}")
    sys.exit(1)

# List available models
print("\n[INFO] Listing available Gemini models...")
try:
    models = genai.list_models()
    gemini_models = [m for m in models if 'gemini' in m.name.lower()]
    
    print(f"[OK] Found {len(gemini_models)} Gemini models:")
    for model in gemini_models:
        print(f"  - {model.name}")
        if hasattr(model, 'supported_generation_methods'):
            methods = model.supported_generation_methods
            print(f"    Methods: {', '.join(methods)}")
except Exception as e:
    print(f"[WARNING] Could not list models: {e}")

# Test with correct model name
print("\n[INFO] Testing API with gemini-pro...")
try:
    # Try gemini-pro first (more widely available)
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Say 'API connection successful' in exactly 3 words")
    
    print("[SUCCESS] Gemini API is working!")
    print(f"[RESPONSE] {response.text.strip()}")
    
except Exception as e:
    print(f"[ERROR] API test failed: {e}")
    print("\n[INFO] Trying alternative model: gemini-1.5-flash...")
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content("Say 'API connection successful' in exactly 3 words")
        
        print("[SUCCESS] Gemini API is working (using gemini-1.5-flash)!")
        print(f"[RESPONSE] {response.text.strip()}")
        
    except Exception as e2:
        print(f"[ERROR] Alternative model also failed: {e2}")
        print("\n[RECOMMENDATION] Use 'gemini-pro' or 'gemini-1.5-flash' instead of 'gemini-1.5-pro'")
        sys.exit(1)

# Test Sir James use case
print("\n[INFO] Testing Sir James curation scenario...")
try:
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = """Act as a video editor. Given this chapter theme:
    
Theme: Castle Adventure
Scenes: 8 scenes about Sir James beginning his quest

Generate a JSON array with 3 scene descriptions. Format:
[
  {"scene": 1, "title": "...", "description": "..."},
  {"scene": 2, "title": "...", "description": "..."},
  {"scene": 3, "title": "...", "description": "..."}
]

Output ONLY the JSON array, no markdown formatting."""

    response = model.generate_content(prompt)
    text = response.text.strip()
    
    # Try to parse as JSON
    import json
    try:
        data = json.loads(text)
        print("[SUCCESS] Gemini can generate structured JSON for Sir James!")
        print(f"[INFO] Generated {len(data)} scene descriptions")
        print(f"[SAMPLE] {data[0]['title']}")
    except json.JSONDecodeError:
        # Remove markdown if present
        if '```' in text:
            text = text.replace('```json', '').replace('```', '').strip()
            data = json.loads(text)
            print("[SUCCESS] Gemini can generate JSON (with markdown cleanup)")
            print(f"[INFO] Generated {len(data)} scene descriptions")
        else:
            print("[WARNING] Response is not valid JSON, but API works")
            
except Exception as e:
    print(f"[ERROR] Sir James scenario test failed: {e}")

# Summary
print("\n" + "=" * 60)
print("TEST COMPLETE")
print("=" * 60)
print("\n[RECOMMENDATION] For Sir James agents, use:")
print("  Model: 'gemini-pro' (most stable)")
print("  Alternative: 'gemini-1.5-flash' (faster, cheaper)")
print("  Avoid: 'gemini-1.5-pro' (not available in v1beta API)")
print("\n[NEXT STEP] Update curate-media.ts and narrate-project.ts")
print("  Change: 'gemini-1.5-pro' -> 'gemini-pro'")
