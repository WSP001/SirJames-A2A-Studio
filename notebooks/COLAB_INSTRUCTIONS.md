# ☁️ Hybrid Cloud Workflow: Colab + OneDrive

This guide explains how to offload heavy AI processing to **Google Colab (Free GPU)** while keeping your code managed in **OneDrive/Local VS Code**.

## 1. The Concept
*   **Code & Edit:** Locally in VS Code (synced to OneDrive).
*   **Sync:** Use Google Drive for Desktop to mirror your project, or mount OneDrive in Colab.
*   **Compute:** Run the heavy `requirements.txt` setup in Colab to get a powerful environment.

## 2. Setup Instructions

### Step A: Prepare the Colab Notebook
1.  Open [Google Colab](https://colab.research.google.com/).
2.  Create a **New Notebook**.
3.  Set Runtime type: **Runtime > Change runtime type > T4 GPU** (Free).

### Step B: Mount & Install (The Magic Cell)
Copy and paste this entire block into the first cell of your Colab notebook and run it.

```python
# 1. Mount Google Drive (where your project lives)
from google.colab import drive
drive.mount('/content/drive')

# 2. Navigate to Project (Adjust path if needed)
import os
project_path = '/content/drive/MyDrive/SirJames-A2A-Studio'

if not os.path.exists(project_path):
    print(f"⚠️ Path not found: {project_path}")
    print("Please locate your project in the Files sidebar and copy the path.")
else:
    os.chdir(project_path)
    print(f"✅ Working Directory: {os.getcwd()}")

# 3. Install Dependencies
# This installs everything defined in requirements.txt + OneDrive tools
!pip install -r requirements.txt
!pip install msgraph-sdk msal azure-identity

# 4. Fix Colab "Restart Required" Issue
print("\n🔄 NOTE: If you see a 'Restart Session' button above, click it!")
print("Then re-run this cell to confirm dependencies are loaded.")
```

### Step C: Validate Gemini (GPU/AI Test)
Once installed, run the validation script to check your Gemini Advanced 3.0 Pro connection.

```python
# Run the Python validation script
!python scripts/validate_gemini.py
```

## 3. Troubleshooting

### "ModuleNotFoundError: No module named 'msgraph'"
*   **Cause:** Colab requires a kernel restart after installing new packages.
*   **Fix:** Click **Runtime > Restart session**. Then re-run the installation cell.

### "Gemini API Key Not Found"
*   **Cause:** `.env.local` is not loaded in Colab automatically.
*   **Fix:**
    1.  Upload your `.env.local` to the Colab file browser (drag and drop).
    2.  OR set it manually in a cell:
        ```python
        import os
        os.environ['GEMINI_API_KEY'] = "your-key-here"
        ```

## 4. Running Heavy Workflows
Now you can run your heavy Python scripts or even Node pipelines (if Node is installed) using Colab's resources.

```python
# Example: Run a future python worker
!python workers/manifest_runner.py --gpu-enabled
```
