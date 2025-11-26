# ==============================================================================
# 🚀 MASTER COLAB WORKFLOW CHECK SCRIPT
# ==============================================================================
# COPY AND PASTE THIS ENTIRE CELL INTO YOUR GOOGLE COLAB NOTEBOOK.
#
# This script performs the following:
# 1. Mounts Google Drive to access your project files.
# 2. Checks if a T4 GPU is active.
# 3. Installs all production dependencies from requirements.txt.
# 4. Installs OneDrive/Microsoft Graph SDKs.
# 5. Validates your Gemini 1.5 Pro API connection.
# ==============================================================================

import os
import sys
import subprocess
from google.colab import drive

# --- CONFIGURATION ---
# UPDATE THIS PATH to match where your project is in Google Drive
PROJECT_ROOT_DRIVE = (
    "/content/drive/MyDrive/Sir James/"
    "LOGIC SirJames_Interactive_Prototype_With_Chapter10/SirJames-A2A-Studio"
)
# ---------------------


def run_command(command):
    """Run shell command and print output."""
    try:
        subprocess.run(command, shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Command failed: {command}\nError: {e}")
        # Don't exit, some pip installs might warn but succeed


def main():
    print("╔══════════════════════════════════════════════════════════════╗")
    print("║     SIR JAMES A2A STUDIO - COLAB WORKFLOW VERIFICATION       ║")
    print("╚══════════════════════════════════════════════════════════════╝\n")

    # 1. MOUNT GOOGLE DRIVE
    print("📂 Step 1: Mounting Google Drive...")
    if not os.path.exists('/content/drive'):
        drive.mount('/content/drive')
    else:
        print("   ✅ Drive already mounted.")

    # 2. GPU CHECK
    print("\n🖥️  Step 2: Checking GPU Status...")
    try:
        gpu_info = subprocess.check_output("nvidia-smi", shell=True).decode()
        if "Tesla T4" in gpu_info or "GPU" in gpu_info:
            print("   ✅ GPU Detected (Ready for heavy processing).")
        else:
            print("   ⚠️  No GPU detected. Go to Runtime > Change runtime type.")
    except subprocess.CalledProcessError:
        print("   ⚠️  nvidia-smi failed. Ensure you are in a GPU runtime.")

    # 3. LOCATE PROJECT
    print(f"\n📍 Step 3: Locating Project at: {PROJECT_ROOT_DRIVE}")
    if os.path.exists(PROJECT_ROOT_DRIVE):
        os.chdir(PROJECT_ROOT_DRIVE)
        print(f"   ✅ Working Directory set to: {os.getcwd()}")
    else:
        print("   ❌ Path not found! Please verify 'PROJECT_ROOT_DRIVE'.")
        print("      Using default '/content' for now.")
        os.chdir("/content")

    # 4. INSTALL DEPENDENCIES
    print("\n📦 Step 4: Installing Dependencies...")

    # Install from requirements.txt
    if os.path.exists("requirements.txt"):
        print("   Installing from requirements.txt...")
        run_command(f"{sys.executable} -m pip install -r requirements.txt")
    else:
        print("   ⚠️ requirements.txt missing. Installing core libs...")
        run_command(
            f"{sys.executable} -m pip install google-generativeai "
            "numpy pandas pillow requests"
        )

    # Install OneDrive/Graph SDKs
    print("   Installing Microsoft Graph SDKs...")
    run_command(
        f"{sys.executable} -m pip install msgraph-sdk msal azure-identity"
    )

    # 5. VALIDATE GEMINI INTEGRATION
    print("\n🤖 Step 5: Validating Gemini 1.5 Pro Integration...")

    # Check for API Key in Environment (Colab Secrets or .env)
    api_key = os.environ.get("GEMINI_API_KEY")

    # Try loading from .env.local if not in env
    if not api_key and os.path.exists(".env.local"):
        print("   Loading .env.local...")
        # Simple parser for .env
        with open(".env.local", "r") as f:
            for line in f:
                if line.startswith("GEMINI_API_KEY="):
                    api_key = line.strip().split("=", 1)[1].strip("'\"")
                    os.environ["GEMINI_API_KEY"] = api_key
                    break

    if api_key:
        print("   ✅ GEMINI_API_KEY found.")
        # Run the validation script
        if os.path.exists("scripts/validate_gemini.py"):
            run_command(f"{sys.executable} scripts/validate_gemini.py")
        else:
            # Inline validation if script missing
            try:
                import google.generativeai as genai
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel('gemini-1.5-pro')
                resp = model.generate_content("System check: status?")
                print(f"   ✅ Gemini Response: {resp.text.strip()}")
            except Exception as e:
                print(f"   ❌ Gemini Validation Failed: {e}")
    else:
        print("   ❌ GEMINI_API_KEY not found!")
        print("      Action: Upload .env.local to Colab or set it in Secrets.")

    print("\n✅ WORKFLOW CHECK COMPLETE.")
    print("   If ModuleNotFoundError for 'msgraph', RESTART RUNTIME.")


if __name__ == "__main__":
    main()
