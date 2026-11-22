# 菩提への道 ― 水彩曼荼羅（ソース）

水彩画の世界で、仏教の尊格の試練を受けて歩む修行者の 3D アクション。three.js + TypeScript + Vite。
公開物は `games/bodhi-no-michi/`（このフォルダの `npm run build` の出力）。

## 作り方
```
npm install
npx tsx tools/bake.ts      # 造形（SDF）をメッシュに焼く → public/models/*.bin
npm run build              # 型検査 → ../../games/bodhi-no-michi/ へ出力
node tools/shots.mjs '?auto=court&bot=1' out.png 1280 720 30000   # 画面写真（サーバー不要）
node tools/play.mjs '?auto=begin&bot=1&speed=6' 200 320 180       # 自動操作で通し確認
tools/review.sh round3     # 絵の点検用の 8 画面
```

## 構成
- `src/engine/watercolor.ts` 透明水彩の物体シェーダー、空、染み（霧・光・影）
- `src/engine/post.ts` 2D 用の後処理（Kuwahara・輪郭線・紙端）
- `src/engine/sdf.ts` 距離関数による造形と Surface Nets（尊格・人物をコードで彫る）
- `src/engine/humanoid.ts` 姿勢の補間、足の接地（IK）、揺れもの（ばね）
- `src/models/*.def.ts` 造形の定義（金剛力士・蓮・地蔵）
- `src/scenes/prologue.ts` 序章の舞台
- `src/game/prologue.ts` 序章の進行と法戦／`boot.ts` 起動・題字・保存／`vr.ts` WebXR
- `src/game/audio.ts` Web Audio による合成（音楽・環境音・効果音）
- `src/ui/` DOM の UI（和紙・墨・朱）／`src/data/zukan.ts` 図鑑

## URL の合図
`?art=1` 調整パネル／`?mode=A|B|C` 絵づくりの案／`?artv=にじみ,溜まり,粒,紙目,線,彩度`／
`?view=nio|un|monk` 造形を回して見る／`?auto=begin|jizo|court&bot=1` 自動操作／`?cam=x,y,z,tx,ty,tz` 静止構図
