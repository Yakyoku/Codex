#!/usr/bin/env bash
# ビルドして Netlify に公開する。  bash scripts/deploy.sh draft|prod
set -euo pipefail
cd "$(dirname "$0")/.."
npm run build
node scripts/deploy.mjs "${1:-draft}"
