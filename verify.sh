#!/bin/bash
echo "=== Git Info ==="
git rev-parse HEAD
echo ""
echo "=== Key Files ==="
find . -name "*.js" -type f | wc -l
echo ""
echo "=== Feature Files ==="
ls -la backend/src/services/ 2>/dev/null
ls -la frontend/js/ 2>/dev/null
echo ""
echo "=== Package Version ==="
grep version package.json
echo ""
echo "=== Environment ==="
ls -la .env 2>/dev/null
