# HANDOFF（引き継ぎ）

最終更新：2026-11-22（セッション1の終わり）

## 現状（どこまでできたか）
- 手順0、第1部（環境と公開経路）＝完了。
- 第2部：GDD・TECH・WEB_BUDGET・SPECIES（ステージ1分）＝作成済み。
- **M0 基盤＝ほぼ完了**（残り：ハブなし、KTX2 の検討、音の形式の確認）。
- **M1 見た目の確立＝途中**。できているもの：
  - 種のまわりの土の一区画（`src/game/world.ts`、配置は `src/data/stage1.layout.json`）
  - 乾いた状態 → 湿った状態の変化（土の活力システム `src/sim/soil.ts` が、粒の濡れ・水の橋・細菌の群れを動かす）
  - 地上の発芽（`src/game/surface.ts`、芽生えは `assets/blender/clover_seedling.py` のシェイプキー）
  - 読み込み画面、紹介カード（`src/ui/card.ts`）、設定（`src/ui/settings.ts`）、VR 版（`src/pages/vr.ts`。同じ区画で見回す・歩く）
- M1 の残り：下の「次の一手」。

## 公開 URL
- 画面版：https://undersoil-web-20261122.netlify.app/
- VR 版：https://undersoil-web-20261122.netlify.app/vr/
- 進捗：https://undersoil-web-20261122.netlify.app/progress/
- 実機診断：https://undersoil-web-20261122.netlify.app/diag/
- 下書き：https://draft--undersoil-web-20261122.netlify.app/
- Netlify のサイト ID：57c0d6c8-e672-427f-921f-c452c33f9b43（サイト名 undersoil-web-20261122）

## 環境の準備（新しいセッションの最初に）
1. `bash undersoil/scripts/setup.sh`
2. `cd undersoil && npm test && npm run build`
3. 絵の確認：`node scripts/shot.mjs <名前> "/?cam=0.3&wet=1&t=1&clean&freeze=3" 960 540` → `shots/<名前>.png` を見る
   - `cam`=道のりの位置 0〜1、`wet`=全区画の濡れ 0〜1、`pos=x,y,z,lx,ly,lz`=カメラ直接指定、`scene=surface&g=0〜1`=地上の場面、`tier=pc-high|mobile-high|compat|vr`、`nopost`
   - ソフトウェア描画は重いので、必ず `freeze=3`（3コマ描いて止める）を付ける
4. VR の確認：`node scripts/check-vr.mjs`　／　動画：`node scripts/video.mjs m1 8 480 270`（約15分。**撮影中は `npm run build` をしない**）
5. 素材の作り直し：`bash scripts/build-assets.sh [grains|plants|tex|all]`
6. 公開：Netlify 連携の deploy-site（siteId 指定）で proxy の URL を取り、`build-cache/proxy.txt` に保存 → `node scripts/deploy.mjs draft|prod`（`npm run build` のあと）

## 決定事項
- リポジトリは Yakyoku/Codex、本体は `undersoil/`、ブランチは `claude/undersoil-web-game-2niuh3`（main には push しない）。公開は Netlify 連携で直接。
- Netlify は新しいサイト `undersoil-web-20261122`（持ち主の指示）。本番デプロイは 1 回 15 クレジットなので節目だけ。下書きは 0。
- 縮尺：地下は 1 単位 = 10 µm（主人公 2 単位）。地上の場面は 1 単位 = 1 mm。
- メッシュの圧縮は meshopt（Draco はデコーダーが二重に入るのでやめた）。テクスチャは WebP。
- 粒の UV は `cube_uv`（6方向の展開）。`smart_project` は塊の形を数千の島に割り、法線の焼き込みが壊れるので使わない。
- 粒の法線と AO は1枚の画像（RG=法線、B=AO）。GLB には接線を入れる。
- ステージ1の生き物：シロツメクサ、枯草菌、シュードモナスの仲間、コルポダ、トウキョウチョウメイムシ（オニクマムシから差し替え）。
- 目覚めの引き金は「水が、種からしみ出した養分を運ぶこと」（GDD の 8）。

## 持ち主からの指摘（2026-11-22）と対応
- 「発芽の葉にリアリティが全くない」→ 芽生えを写真4点と見比べて作り直した（`assets/blender/clover_seedling.py`、`src/game/surface.ts`）。確認記録は `REFERENCE/species/trifolium-repens.md` の末尾。
- 「地上の草木の品質が下がる懸念。実物と比較して作ること」→ `REFERENCE/PLANT_PROCESS.md` を定めた。**地上の植物は、この手順を通ってから公開する。**
- 「音が全くない」→ 音の仕組みを入れた（`src/audio/engine.ts`、GDD の 9）。画面版のみ。VR 版の音、効果音、音楽の層は未着手。
- 「より現実世界を再現して」→ 地上の場面を写真と見比べて直した：背景のぼけ（PC・モバイル高画質のみ）、細かい土の粒、赤みのある茶色と湿りのまだら、枯れ草・小枝・落ち葉のかけら（`src/game/litter.ts`）、子葉の平たい断面・つやのない質感・縁の色、本葉の向き、茎の地上部を短く。
- 「iPad で音が聞こえない」（2026-11-22）→ 原因の候補：①iOS の消音モードでは Web Audio が鳴らない ②風と雨を 300Hz 前後の低い音で作っていて、iPad のスピーカーで再生できない。対処：`navigator.audioSession.type = 'playback'` と無音の `<audio>` で消音モードでも鳴るようにし、音域を上げて音量を約2倍にした。開始時に和音が1つ鳴る。実機診断に「音を鳴らす」ボタンを追加。**実機で鳴るかは未確認（持ち主の返事待ち）**。
- 自動で巡るカメラが、まだ作っていない種のまわり（粒のない空き地）を向いて真っ暗になっていた → 巡る範囲を道の 2〜68% に絞った。
- 「音は聞こえた」（持ち主、iPad）。
- 「案内のパネルが大きすぎる」→ 紹介カードを小さく控えめなデザインにした（`src/ui/card.css`。幅 24em、文字 1.05vw、ガラス風の半透明）。
- 「大きい文字の漢字には、ふりがなをカッコで全部振る」→ カードの題名に（よみ）を付けた（種のデータの `title`）。**今後、大きい文字の漢字には必ず（よみ）を付ける。**
- 「開始直後、左側で2回ほど光り、光が残るバグのようなもの」→ この環境では再現できず。実機（WebGPU）だけで起きる可能性。候補を3つ潰した：①水の橋の、画面の写しを使う屈折をやめた（全段階で環境の映り込み）②ブルームの元を明るさ 3 で頭打ちにし、にじみの境目を上げた。濡れた粒のつやの鋭さを弱めた ③開始の暗転を 0.25 秒遅らせた。**直ったかは持ち主の確認待ち。**
- 「まだ AI っぽい。写真や動画を参考に作り直して」（iPhone Air で確認）→ 写真49点を集めて比較（`REFERENCE/seedling-realism.md`、写真は `build-cache/ref/realism/`。公開しない）。地上の場面を作り直した：
  連続した地面（`src/game/ground.ts`。細かい砂の2段のセル模様、くぼみの暗さ）、土のかたまりは 1/4、白っぽい昼の光で明暗の幅を広げた、芽を低く（子葉は地面すれすれに水平）、
  写真から測った色（子葉 #9FA576 前後、出たばかりは黄、本葉は黄緑）、子葉の小さく鋭いきらめき、カメラは 55°見下ろしで固定、落ちものを減らし芽の上を横切らない。
  **未対応**：早回し動画は Wikimedia の配信制限で取得できず、動き（各段階の時間配分、首振り、子葉の開き方）は未検証。本葉の形（腎臓形・先のくぼみ）はまだ写真と違う。
- 「iPhone で全画面にできない？」→ iPhone の Safari にはページの全画面がない。ホーム画面に追加すると全画面で開く（manifest、アイコン、`apple-mobile-web-app-capable`）。「全画面」ボタンでその手順を案内。数秒さわらないと操作パネルが薄くなる。横向きの小さな画面ではボタンを小さく。
- 土の中の絵は「いい」との評価。Quest 3 の確認は後日（持ち主）。

## 既知の問題・未確認
- **実機の結果**は `DEVICE_RESULTS.md`。iPad（Safari 27.2、WebGPU）は平均 60 fps・エラー 0 を確認（2026-11-22）。下位1% が 50 fps で、ときどき引っかかる。
- **実機で未確認**：iPhone、PC とテレビ、長時間のメモリ。**Quest 3 は後日、持ち主が確認する（依頼内容は DEVICE_RESULTS.md の末尾。次の報告でも忘れずに頼む）。**
- この環境の WebGPU でだけ「Instance dropped in popErrorScope」が出る（TECH の 3）。iPad の実機では出なかった。
- 三角形数：互換で約 95 万（目標 50 万）、PC 高画質で約 220 万（目標 150 万）。画面外の粒もインスタンスとして数えた値。区画ごとに分けて視錐台カリングを効かせる・遠い粒を LOD2 にする、で減らす。
- 近くで見ると、LOD1・LOD2 の粒の輪郭が角ばる。
- 水の橋（`src/game/water.ts`）は、絵としてまだ確認できていない（置かれているが、目立つ見え方になっていない）。
- 地上の場面の空が単調。被写界深度、朝露、遠景の草がまだない。
- 細菌は枯草菌の形の群れ1種類だけ。シュードモナスの泳ぎ分け、芽胞の姿はまだ。
- 音はまだ何もない（M3 の範囲。仕組みは M2 までに入れたい）。
- 関東の土（黒ボク土）に合わせて「石英」を火山ガラスなどに差し替えるかは未決（GDD の 8）。

## 次の一手（M1 を閉じるまで）
1. コルポダは区画に入った（`src/game/creatures.ts`。シスト ⇄ 泳ぐ。カードも出る）。残り：白っぽく見えすぎるので質感を詰める。**クマムシ（`public/models/creatures/tardigrade.glb`、シェイプキー tun / walk_a〜d、乾眠中は `tardigrade_tun_na.webp`）は未配置**。体長 56 単位で道（半径 6.5）に入らないので、種の岸の広い空間を作ってから置く。モデルの仕様は `Docs/REFERENCE/species/*.md` 末尾の「モデルの確認記録」。
2. `Docs/FACTCHECK_stage1.md` のうち、カードの文への指摘は反映済み。台帳・仕様書への指摘（枯草菌の目名、鞭毛の付け根の数、コルポダの繊毛の列の出典、オニクマムシの記述）を反映する。
3. 種（吸水した種の表面）を区画の奥に置く。水の橋の見え方を直す。
4. 三角形数を予算に収める。VR の密度を実機の結果で決める。
5. 地上の場面の絵作り（空、被写界深度、朝露）。VR 版に地上の場面を入れる。
6. スクリーンショット5枚以上と動画を進捗ページに載せ、本番に公開し、持ち主に実機確認を頼む。
