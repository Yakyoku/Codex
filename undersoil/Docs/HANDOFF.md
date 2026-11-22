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

## 既知の問題・未確認
- **実機で未確認**：WebGPU の見た目と fps、iPad・iPhone での動作とメモリ、Quest 3 で VR に入れるか・72 fps が出るか・酔い。
- この環境の WebGPU でだけ「Instance dropped in popErrorScope」が出る（TECH の 3）。
- 三角形数：互換で約 95 万（目標 50 万）、PC 高画質で約 220 万（目標 150 万）。画面外の粒もインスタンスとして数えた値。区画ごとに分けて視錐台カリングを効かせる・遠い粒を LOD2 にする、で減らす。
- 近くで見ると、LOD1・LOD2 の粒の輪郭が角ばる。
- 水の橋（`src/game/water.ts`）は、絵としてまだ確認できていない（置かれているが、目立つ見え方になっていない）。
- 地上の場面の空が単調。被写界深度、朝露、遠景の草がまだない。
- 細菌は枯草菌の形の群れ1種類だけ。シュードモナスの泳ぎ分け、芽胞の姿はまだ。
- 音はまだ何もない（M3 の範囲。仕組みは M2 までに入れたい）。
- 関東の土（黒ボク土）に合わせて「石英」を火山ガラスなどに差し替えるかは未決（GDD の 8）。

## 次の一手（M1 を閉じるまで）
1. サブエージェントが作ったコルポダとクマムシのモデル（`public/models/creatures/`）を区画に置き、動かし、紹介カードを出す。確認用の画像を進捗ページに並べる。
2. `Docs/FACTCHECK_stage1.md`（第三者の事実確認）の「誤り」「未確認」を、台帳と `src/data/species/*.json` に反映する。
3. 種（吸水した種の表面）を区画の奥に置く。水の橋の見え方を直す。
4. 三角形数を予算に収める。VR の密度を実機の結果で決める。
5. 地上の場面の絵作り（空、被写界深度、朝露）。VR 版に地上の場面を入れる。
6. スクリーンショット5枚以上と動画を進捗ページに載せ、本番に公開し、持ち主に実機確認を頼む。
