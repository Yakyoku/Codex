#!/bin/bash
# 絵の点検用に 6 種類以上の画面を撮って 1 枚にまとめる。 使い方: tools/review.sh <出力名>
cd "$(dirname "$0")/.."
O=${1:-round}; D=docs/art-review/prologue; mkdir -p $D .shots
S() { node tools/shots.mjs "$1" .shots/$O-$2.png ${3:-960} ${4:-540} ${5:-14000} 1 2>&1 | grep -v -E 'toNonIndexed|AudioContext'; }
S "?ui=0&cam=-0.6,2.6,13.2,0,3.6,-17&fov=48" wide &
S "?ui=0&cam=2.0,2.2,-6,6.3,3.4,-18&fov=44" a-full &
S "?ui=0&cam=5.3,5.0,-14.4,6.25,5.45,-17.9&fov=30" a-face &
S "?ui=0&cam=-5.3,5.0,-14.4,-6.25,5.45,-17.9&fov=30" un-face &
wait
S "?ui=0&cam=2.6,1.7,0.2,1.0,1.15,2.5&fov=40" monk &
S "?auto=court&bot=1&speed=3" trial 960 540 100000 &
S "?auto=begin&bot=1&ui=0" steps 960 540 22000 &
S "" title &
wait
python3 - <<P
from PIL import Image
n=['wide','a-full','a-face','un-face','monk','trial','steps','title']
import os
os.makedirs('public/gallery',exist_ok=True)
for k in n:
    try: Image.open('.shots/$O-%s.png'%k).convert('RGB').save('public/gallery/%s.jpg'%k,quality=86)
    except Exception as e: print(k,e)
c=Image.new('RGB',(1920,2160),'white')
for i,k in enumerate(n):
    try: c.paste(Image.open('.shots/$O-%s.png'%k).resize((960,540)),((i%2)*960,(i//2)*540))
    except Exception as e: print(k,e)
c.save('$D/$O.jpg',quality=88); c.resize((1280,1440)).save('.shots/$O-sheet.png')
P
