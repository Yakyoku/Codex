#!/usr/bin/env bash
# 新しいセッションの最初に実行する。必要な道具をまとめて入れ直す。
#   bash undersoil/scripts/setup.sh
set -euo pipefail
cd "$(dirname "$0")/.."
echo "== Python（bpy ほか）"
python3 -c "import bpy" 2>/dev/null || pip install --break-system-packages -q "bpy==5.3.0"
python3 -c "import numpy, PIL, scipy" 2>/dev/null || pip install --break-system-packages -q numpy pillow scipy
echo "== Node（three / vite / gltf-transform / netlify-cli）"
if [ -f package-lock.json ]; then npm ci --no-audit --no-fund --silent; else npm install --no-audit --no-fund --silent; fi
echo "== 版"
node -v; python3 -c "import bpy;print('bpy',bpy.app.version_string)"
node -e "for(const p of ['three','vite','typescript','@gltf-transform/cli','iwer'])try{console.log(p,require(p+'/package.json').version)}catch(e){console.log(p,'?')}"
echo "Playwright: $(node -e "console.log(require('/opt/node-tools/node_modules/playwright/package.json').version)" 2>/dev/null || echo 'なし') / Chrome: $(google-chrome --version 2>/dev/null || echo 'なし')"
