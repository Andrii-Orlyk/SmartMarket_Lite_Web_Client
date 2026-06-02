#!/usr/bin/env bash
set -euo pipefail

echo "Frontend project doctor"
node --version
npm --version

test -f package.json || { echo "package.json missing"; exit 1; }
test -f package-lock.json || { echo "package-lock.json missing. Run npm install."; exit 1; }
test -f vite.config.ts || { echo "vite.config.ts missing"; exit 1; }
test -f eslint.config.js || { echo "eslint.config.js missing"; exit 1; }
test -f .env.example || { echo ".env.example missing"; exit 1; }
grep -q 'VITE_USE_MOCK_API' .env.example || { echo ".env.example must document VITE_USE_MOCK_API"; exit 1; }

echo "Doctor passed."
