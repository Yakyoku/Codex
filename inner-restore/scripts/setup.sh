#!/usr/bin/env bash
# 新しいセッションの最初に実行する。必要な道具をまとめて入れ直す。
#   bash inner-restore/scripts/setup.sh
set -euo pipefail
cd "$(dirname "$0")/.."
VENV="${IR_VENV:-$HOME/.venvs/inner-restore}"
if [ ! -x "$VENV/bin/python" ]; then python3 -m venv "$VENV"; fi
"$VENV/bin/pip" install -q --upgrade pip
# Blender の Python モジュール（bpy）と、画像・音の合成に使うもの
"$VENV/bin/pip" install -q "bpy==5.3.0" numpy scipy pillow fonttools brotli
npm install --no-audit --no-fund
echo "--- 版の確認 ---"
node -v; "$VENV/bin/python" -c "import bpy;print('bpy',bpy.app.version_string)"
node -e "console.log('three', require('three/package.json').version)"
echo "Python: $VENV/bin/python"
