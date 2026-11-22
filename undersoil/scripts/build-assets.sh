#!/usr/bin/env bash
# 素材を作り直して public/ に置く。  bash scripts/build-assets.sh [grains|tex|all]
set -euo pipefail
cd "$(dirname "$0")/.."
what="${1:-all}"
opt() { npx gltf-transform meshopt "$1" "$2" --level medium >/dev/null && echo "  $(basename "$2") $(($(stat -c%s "$2")/1024))KB"; }
if [ "$what" = all ] || [ "$what" = tex ]; then python3 assets/gen_textures.py; fi
if [ "$what" = all ] || [ "$what" = grains ]; then
  [ "${SKIP_BLENDER:-0}" = 1 ] || python3 assets/blender/soil_grains.py --no-preview 2>&1 | grep -E "^\[grain|Error|Traceback" || true
  mkdir -p public/models/grains
  for f in assets/out/grains/*.glb; do opt "$f" "public/models/grains/$(basename "$f")"; done
  for f in assets/out/grains/*_na.png; do convert "$f" -quality 90 -define webp:method=6 "public/models/grains/$(basename "${f%.png}").webp"; done
  du -sh public/models/grains
fi
