#!/bin/bash
# Script to rebuild with latest code

cd ~/lifecycle-analysis || exit 1

echo "=== Fetching latest code ==="
git pull origin main

echo "=== Current commit ==="
COMMIT_SHA=$(git rev-parse HEAD)
echo "Commit SHA: $COMMIT_SHA"
git log -1 --oneline

echo "=== Verifying CacheToggle is in the file ==="
if grep -q "Use Cached Research" src/components/Phase3Results.jsx; then
    echo "✅ 'Use Cached Research' found in file"
else
    echo "❌ 'Use Cached Research' NOT found in file!"
    exit 1
fi

if grep -q "CacheToggleComponent" src/components/Phase3Results.jsx; then
    echo "✅ 'CacheToggleComponent' found in file"
else
    echo "❌ 'CacheToggleComponent' NOT found in file!"
    exit 1
fi

echo ""
echo "=== Triggering build with commit: $COMMIT_SHA ==="
gcloud builds submit --config=cloudbuild.yaml --substitutions=COMMIT_SHA=$COMMIT_SHA

echo ""
echo "=== Build triggered! Check the build logs above. ==="

