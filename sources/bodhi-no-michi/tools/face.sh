#!/bin/bash
# 顔の確認：焼き→ビルド→正面・斜め・横
cd "$(dirname "$0")/.."
npx tsx tools/bake.ts $1 | tail -3 && npx vite build 2>&1 | grep -E 'error' ; V=$2; TY=${3:-1.86}; D=${4:-0.85}
node tools/shots.mjs "?view=$V&dist=$D&ty=$TY&yaw=0&pitch=0" .shots/f1.png 640 640 4500 &
node tools/shots.mjs "?view=$V&dist=$D&ty=$TY&yaw=0.6&pitch=0.05" .shots/f2.png 640 640 4500 &
node tools/shots.mjs "?view=$V&dist=$D&ty=$TY&yaw=1.45&pitch=0" .shots/f3.png 640 640 4500 & wait
python3 -c "
from PIL import Image
a=[Image.open('.shots/f%d.png'%i) for i in (1,2,3)]
c=Image.new('RGB',(1920,640)); [c.paste(im,(i*640,0)) for i,im in enumerate(a)]; c.save('.shots/face.png')"
