#!/usr/bin/env bash
# ============================================================
# Sir James Book002 - Environment Verification Gate (Bash)
# Ensures safe deployment by validating environment and runtime
# Works on Linux, macOS, Netlify, and WSL
# ============================================================

set -e

EXPECTED_SITE="sirjames-book002-final"
REQUIRED_VARS=(
  BOOK_VERSION
  ELEVENLABS_API_KEY
  OPENAI_API_KEY
  NETLIFY_AUTH_TOKEN
  NETLIFY_SITE_ID
  PYTHON_VERSION
  NODE_ENV
)

echo ""
echo "🧭 Sir James Book002 - Environment Verification"
echo "------------------------------------------------"

MISSING=()

# 1️⃣ Verify environment variables
for VAR in "${REQUIRED_VARS[@]}"; do
  VALUE="${!VAR}"
  if [ -z "$VALUE" ]; then
    echo "❌ Missing environment variable: $VAR"
    MISSING+=("$VAR")
  else
    echo "✅ $VAR detected"
  fi
done

# 2️⃣ Check Python version lock
if [ -f ".python-version" ]; then
  VERSION=$(<.python-version)
  if [[ "$VERSION" == 3.12* ]]; then
    echo "✅ Python version pinned to $VERSION"
  else
    echo "⚠️ Python version mismatch ($VERSION). Expected 3.12.x"
    MISSING+=(".python-version-mismatch")
  fi
else
  echo "❌ Missing .python-version file"
  MISSING+=(".python-version")
fi

# 3️⃣ Verify Netlify site context
if command -v netlify >/dev/null 2>&1; then
  STATUS=$(netlify status 2>/dev/null || true)
  if echo "$STATUS" | grep -q "$EXPECTED_SITE"; then
    echo "✅ Connected to correct Netlify site: $EXPECTED_SITE"
  else
    echo "❌ Netlify site mismatch or not logged in!"
    MISSING+=("NETLIFY_SITE_MISMATCH")
  fi
else
  echo "⚠️ Netlify CLI not found (install with 'npm install -g netlify-cli')"
  MISSING+=("NETLIFY_CLI")
fi

# 4️⃣ Decision gate
if [ "${#MISSING[@]}" -gt 0 ]; then
  echo ""
  echo "🚫 Environment verification failed."
  echo "Fix the following before deploying:"
  for ITEM in "${MISSING[@]}"; do
    echo "   - $ITEM"
  done
  exit 1
fi

echo ""
echo "🎉 All checks passed! Safe to deploy."
echo "Run:  netlify deploy --prod --site=$EXPECTED_SITE"
echo ""
exit 0
