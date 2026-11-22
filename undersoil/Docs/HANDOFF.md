# HANDOFF（引き継ぎ）

最終更新：2026-11-22

## 現状
- 手順0（依頼文の保存）と第1部（環境と公開経路の確認）が完了。第2部（設計書 → M0 → M1）に着手。
- 公開中のものは「土の粒1種類」だけの経路確認用。ゲームの中身はまだない。

## 公開 URL
- 画面版：https://undersoil-web-20261122.netlify.app/
- VR 版：https://undersoil-web-20261122.netlify.app/vr/
- 進捗：https://undersoil-web-20261122.netlify.app/progress/
- 実機診断：https://undersoil-web-20261122.netlify.app/diag/
- 下書き：https://draft--undersoil-web-20261122.netlify.app/
- Netlify のサイト ID：57c0d6c8-e672-427f-921f-c452c33f9b43（サイト名 undersoil-web-20261122）

## 環境の準備（新しいセッションの最初に）
1. `bash undersoil/scripts/setup.sh`
2. `cd undersoil && npm run build && node scripts/check-part1.mjs && node scripts/check-vr.mjs`
3. 公開するとき：Netlify 連携の deploy-site で proxy の URL を取り、`build-cache/proxy.txt` に保存 → `bash scripts/deploy.sh draft|prod`（詳細は TECH.md の 7）

## 決定事項
- リポジトリは接続済みの Yakyoku/Codex を使う。本体は `undersoil/` の下。ブランチは `claude/undersoil-web-game-2niuh3`（main には push しない）。
- 公開は Netlify 連携で直接行う（main への push で動く GitHub Actions の経路は使わない）。
- Netlify は新しいサイト `undersoil-web-20261122` を使う（持ち主の指示。前日の Unity 版サイトには触らない）。
- 本番デプロイは 1 回 15 クレジットかかるので節目だけ。作業中は下書き（0 クレジット）。
- ステージ1の種はシロツメクサ（ステージ3の花畑につながる）。生き物の調査はサブエージェントが `Docs/SPECIES.md` と `Docs/REFERENCE/` に書く。

## 既知の問題・未確認
- WebGPU の実際の見た目・fps、Quest 3 で VR に入れるかは実機で未確認（持ち主に依頼中）。
- この環境の WebGPU でだけ「Instance dropped in popErrorScope」が出る（TECH.md の 3）。実機の診断ページで「エラー：なし」かを見る。
- Draco のデコーダーが `assets/` と `draco/` に二重に入っている（約 200 KB の無駄）。M0 で meshopt への切り替えを検討。

## 次の一手
1. Docs/GDD.md、Docs/WEB_BUDGET.md を書く。SPECIES.md と形の仕様書（サブエージェント作成）を確認し、別のサブエージェントに事実確認させる。
2. M0：品質段階の設定データ、読み込み画面、土の活力システムの試作と単体テスト。
3. M1：種のまわりの一区画を最終品質で。
