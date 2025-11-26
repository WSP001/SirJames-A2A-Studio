# ==========================================
# SIR JAMES STUDIO: COLAB SETUP MASTER
# ==========================================
# COPY THIS ENTIRE CELL INTO GOOGLE COLAB
# This script handles all setup steps with proper error handling

import os
import sys
import subprocess

# ==========================================
# STEP 1: SET API KEY
# ==========================================
print("=" * 60)
print("STEP 1: Configuring Gemini API Key")
print("=" * 60)

os.environ['GEMINI_API_KEY'] = "AIzaSyD2A0y6Me8F6FWRQNzkshSkcsz-QrAWYYo"
print("[OK] Gemini API Key Configured")

# ==========================================
# STEP 2: MOUNT GOOGLE DRIVE
# ==========================================
print("\n" + "=" * 60)
print("STEP 2: Mounting Google Drive")
print("=" * 60)

try:
    from google.colab import drive
    
    if not os.path.exists('/content/drive'):
        drive.mount('/content/drive')
        print("[OK] Google Drive Mounted")
    else:
        print("[OK] Drive already mounted")
except Exception as e:
    print(f"[ERROR] Drive mount failed: {e}")
    print("[ACTION] Please authorize Drive access when prompted")

# ==========================================
# STEP 3: NAVIGATE TO PROJECT
# ==========================================
print("\n" + "=" * 60)
print("STEP 3: Locating Project Directory")
print("=" * 60)

# Adjust this path if your folder name is different in Drive
project_path = '/content/drive/MyDrive/Sir James/LOGIC SirJames_Interactive_Prototype_With_Chapter10/SirJames-A2A-Studio'

if os.path.exists(project_path):
    os.chdir(project_path)
    print(f"[OK] Working Directory: {os.getcwd()}")
else:
    print(f"[WARNING] Path not found: {project_path}")
    print("[ACTION] Please verify the folder path in the Files sidebar on the left.")
    print("\nTo find your project:")
    print("1. Click the folder icon on the left sidebar")
    print("2. Navigate to: drive > MyDrive > Sir James")
    print("3. Right-click on 'SirJames-A2A-Studio' > Copy path")
    print("4. Update 'project_path' variable above with the correct path")
    
    # List available directories to help user
    base_path = '/content/drive/MyDrive/Sir James'
    if os.path.exists(base_path):
        print(f"\n[INFO] Contents of {base_path}:")
        try:
            for item in os.listdir(base_path):
                item_path = os.path.join(base_path, item)
                if os.path.isdir(item_path):
                    print(f"  [DIR]  {item}")
                else:
                    print(f"  [FILE] {item}")
        except Exception as e:
            print(f"[ERROR] Could not list directory: {e}")

# ==========================================
# STEP 4: INSTALL DEPENDENCIES
# ==========================================
print("\n" + "=" * 60)
print("STEP 4: Installing Dependencies")
print("=" * 60)

def run_pip_install(package_spec):
    """Install packages with proper error handling"""
    try:
        subprocess.run(
            [sys.executable, "-m", "pip", "install"] + package_spec.split(),
            check=True,
            capture_output=True,
            text=True
        )
        return True
    except subprocess.CalledProcessError as e:
        print(f"[WARNING] Install issue: {e.stderr}")
        return False

# Install from requirements.txt if available
if os.path.exists("requirements.txt"):
    print("[INFO] Installing from requirements.txt...")
    run_pip_install("-r requirements.txt")
else:
    print("[WARNING] requirements.txt not found, installing core packages...")
    run_pip_install("google-generativeai==0.7.2")

# Install Microsoft Graph SDKs for OneDrive
print("[INFO] Installing Microsoft Graph SDKs...")
run_pip_install("msgraph-sdk msal azure-identity")

print("[OK] Dependencies installation complete")
print("[IMPORTANT] If you see 'Restart Session' button above, click it!")
print("            Then re-run this cell to verify packages loaded correctly.")

# ==========================================
# STEP 5: VALIDATE GEMINI CONNECTION
# ==========================================
print("\n" + "=" * 60)
print("STEP 5: Testing Gemini 1.5 Pro Connection")
print("=" * 60)

try:
    import google.generativeai as genai
    
    genai.configure(api_key=os.environ['GEMINI_API_KEY'])
    model = genai.GenerativeModel('gemini-1.5-pro')
    
    print("[INFO] Sending test prompt to Gemini...")
    response = model.generate_content("Hello! Confirm you are active and ready.")
    
    print(f"[SUCCESS] Gemini Response: {response.text.strip()}")
    print("\n[OK] Gemini 1.5 Pro is connected and operational!")
    
except ImportError as e:
    print(f"[ERROR] Module not found: {e}")
    print("[ACTION] Click 'Runtime > Restart Session' and re-run this cell")
except Exception as e:
    print(f"[ERROR] Gemini connection failed: {e}")
    print("[ACTION] Verify your API key is correct")

# ==========================================
# STEP 6: GPU CHECK
# ==========================================
print("\n" + "=" * 60)
print("STEP 6: GPU Availability Check")
print("=" * 60)

try:
    gpu_info = subprocess.check_output("nvidia-smi", shell=True).decode()
    if "Tesla T4" in gpu_info or "GPU" in gpu_info:
        print("[OK] GPU Detected - Ready for heavy processing")
        print("[INFO] You can run image generation and audio processing here")
    else:
        print("[WARNING] No GPU detected")
        print("[ACTION] Go to Runtime > Change runtime type > Select T4 GPU")
except subprocess.CalledProcessError:
    print("[WARNING] nvidia-smi not available")
    print("[ACTION] Enable GPU: Runtime > Change runtime type > Hardware accelerator > GPU")
# ==========================================
# SETUP COMPLETE
# ==========================================
print("\n" + "=" * 60)
print("SETUP COMPLETE - ENVIRONMENT READY")
print("=" * 60)
print("\nNext Steps:")
print("1. If you saw 'Restart Session' warning, click it and re-run this cell")
print("2. Run validation scripts in the 'scripts/' folder")
print("3. Execute agent workflows for Book002 generation")
print("\nYour environment is configured for:")
print("  - Gemini 1.5 Pro API calls")
print("  - Google Drive file access")
print("  - GPU-accelerated processing (if enabled)")
print("  - Microsoft Graph/OneDrive integration")
