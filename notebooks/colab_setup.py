# Google Colab Setup for Sir James A2A Studio
# This script mounts Google Drive and OneDrive, installs dependencies, and sets up the environment.

import os
import sys
import subprocess

def setup_environment():
    print("🚀 Starting Colab Environment Setup...")

    # 1. Mount Google Drive
    try:
        from google.colab import drive
        drive.mount('/content/drive')
        print("✅ Google Drive mounted.")
    except ImportError:
        print("⚠️ Not running in Google Colab, skipping Drive mount.")

    # 2. Install System Dependencies (7zip, GraphViz, etc.)
    print("\n📦 Installing System Dependencies...")
    system_packages = [
        "libarchive-dev", "graphviz", "libfluidsynth1", "ffmpeg"
    ]
    # Using apt-get via subprocess for better control/logging
    subprocess.run(["apt-get", "-qq", "update"], check=True)
    subprocess.run(["apt-get", "-qq", "install", "-y"] + system_packages, check=True)
    print("✅ System dependencies installed.")
    
    # 3. Install Python Dependencies from requirements.txt
    # We'll write a temporary requirements file if one doesn't exist in the current path
    # but ideally, we should point to the one in the mounted drive.
    
    # Assumption: Project is cloned/located at a specific path in Drive.
    # User might need to adjust PROJECT_ROOT.
    PROJECT_ROOT = "/content/drive/MyDrive/SirJames-A2A-Studio" 
    
    if os.path.exists(os.path.join(PROJECT_ROOT, 'requirements.txt')):
        print(f"\n📦 Installing Python Dependencies from {PROJECT_ROOT}/requirements.txt...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", os.path.join(PROJECT_ROOT, 'requirements.txt')], check=True)
    else:
        print(f"\n⚠️ requirements.txt not found at {PROJECT_ROOT}. Installing core packages directly.")
        core_packages = [
            "numpy==1.26.4", "pandas==2.2.2", "Pillow==10.2.0", 
            "python-dotenv==1.0.1", "PyYAML==6.0.2", "openai==1.53.0", 
            "elevenlabs>=1.0.0", "google-generativeai==0.7.2", 
            "boto3==1.35.20", "requests==2.32.3", "soundfile==0.12.1"
        ]
        subprocess.run([sys.executable, "-m", "pip", "install"] + core_packages, check=True)

    # 4. Install OneDrive Connectivity (msgraph-sdk)
    print("\n☁️ Installing OneDrive Connectivity Tools...")
    subprocess.run([sys.executable, "-m", "pip", "install", "msgraph-sdk", "msal", "azure-identity"], check=True)
    
    print("\n✅ Setup Complete! You may need to restart the runtime if imports fail.")

if __name__ == "__main__":
    setup_environment()
