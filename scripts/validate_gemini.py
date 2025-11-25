"""
Validation Script for Gemini Integration.

Run this locally or in a CI environment to verify Gemini API key presence
and basic connectivity.
"""

import os
import sys
import google.generativeai as genai
from dotenv import load_dotenv


def validate_gemini_integration():
    print("🔍 Validating Gemini Integration...")

    # Load environment variables
    load_dotenv('.env.local')

    api_key = os.getenv('GEMINI_API_KEY')

    if not api_key:
        print("❌ GEMINI_API_KEY not found in environment variables.")
        sys.exit(1)

    print("✅ GEMINI_API_KEY found.")

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')

        print("[TEST] Testing connection to Gemini 2.5-Flash...")
        response = model.generate_content("Hello, are you operational?")

        if response and response.text:
            print(f"✅ Gemini Response: {response.text[:50]}...")
            print("✅ Integration Validation Successful!")
        else:
            print("⚠️ Received empty response from Gemini.")

    except Exception as e:
        print(f"❌ Failed to connect to Gemini: {e}")
        sys.exit(1)


if __name__ == "__main__":
    validate_gemini_integration()
