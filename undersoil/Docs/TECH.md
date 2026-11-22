# UNDERSOIL 技術設計書（TECH）

最終更新：2026-11-22（第1部 完了時点）

## 1. 環境（2026-11-22 に確認）
| 項目 | 値 |
|---|---|
| OS | Linux 6.18（x86_64）、画面なし |
| CPU / メモリ / ディスク | 4 コア / 15 GB / 空き約 60 GB |
| GPU | なし（Chrome はソフトウェア描画の SwiftShader） |
| Node / npm | 22.23.5 / 10.9.9 |
| Python / pip | 3.13.18 / 24.0 |
| ffmpeg / ImageMagick | 6.1.1 / 6.9.12（コマンドは `convert`） |
| Chrome / Playwright | Chrome for Testing 153（Playwright 同梱、`/opt/pw-browsers`） |
| git / gh | 2.43 / 2.89（gh は検索専用。GitHub の操作は連携機能で行う） |
| 日本語フォント | IPA ゴシックのみ（VR のパネル用の文字描画に使う候補） |

### ネットワーク
届く：npm、PyPI、GitHub、Netlify（サイトと連携機能）、download.blender.org、jsDelivr、Wikimedia / Wikipedia、iNaturalist、NCBI、農研機構、Poly Haven。
届かない・拒否：Netlify の API へ直接（認証情報がないため 401）、GBIF（403）、Google Fonts（404）。
→ 参考写真は Wikimedia などから取得して「見る」ことができる。ただしゲームの素材はすべて自作し、外部の素材は同梱しない。

## 2. 採用した道具と版（固定）
| 用途 | 道具 | 版 | 確認結果 |
|---|---|---|---|
| 描画 | three（`three/webgpu` の WebGPURenderer、TSL） | 0.187.0（r187。npm の最新の正式版） | WebGL 2 で絵が出る。WebGPU は初期化と描画が進む |
| ビルド | Vite / TypeScript | 8.3.8 / 5.9 系 | 4 ページの複数入口ビルド |
| テスト | Vitest | 4 系 | （M0 で単体テストを追加） |
| モデル | bpy（Blender の Python モジュール） | 5.3.0 | 形づくり・AO 焼き込み（Cycles CPU）・GLB 書き出し・4方向の確認描画 |
| 最適化 | @gltf-transform/cli | 4.5.1 | Draco＋WebP。269 KB → 37 KB |
| VR の模擬 | iwer | 2.8.0 | Quest 3 相当で「入る・見回す・終了」を自動確認 |
| 公開 | Netlify 連携（deploy-site の一時 proxy）＋ `scripts/deploy.mjs` | – | 本番・下書きとも成功 |

- npm は依存の解決で落ちることがあるため `.npmrc` に `legacy-peer-deps=true` を入れている。
- netlify-cli は使わない（入れると npm が落ちる。認証トークンもない）。

## 3. 確かめた制約
- **WebGPU の絵はこの環境では見られない**：スクリーンショットも、キャンバスの読み戻しも真っ白／真っ黒になる。見た目は WebGL 2 で確認する。
- **WebGPU の既知の現象**：この環境でだけ、パイプライン作成時のエラー確認（`popErrorScope`）が約1秒後に「Instance dropped」で打ち切られる。
  検証エラーではなく描画は続く。Three.js を使わない最小コードでは出ない。実機で出るかどうかは **未確認**（診断ページの「エラー」で確かめる）。
- **fps はこの環境では無意味**（ソフトウェア描画で 1〜2 fps）。
- **VR のエミュレーター**は `XRWebGLLayer.framebuffer` が null になり、Three.js の WebGL 2 側が例外を出す。確認用スクリプトの中だけで回避している
  （`scripts/check-vr.mjs` の SHIM）。実機は Layers API の経路で、ここを通らない見込みだが **実機で未確認**。
- 焼き込みの所要時間の目安：5,120 面・AO 512px・24 サンプルで 1.4 秒。確認用の描画 384px×4 枚で約 5 秒。

## 4. リポジトリの構成
このリポジトリ（Yakyoku/Codex）は複数のゲームの置き場所なので、UNDERSOIL は `undersoil/` にまとめている。作業ブランチは `claude/undersoil-web-game-2niuh3`。
```
undersoil/
  Docs/            設計書・台帳・引き継ぎ
  assets/blender/  モデルを作る bpy スクリプト（lib/common.py が共通関数）
  assets/out/      書き出した GLB（最適化前） / assets/preview/ 確認用の画像
  public/          そのまま配信するもの（models/、draco/、progress/、_headers）
  src/core/        共通基盤（端末判定、描画エンジン、読み込み、fps）
  src/pages/       各ページの入口（画面版・VR 版・診断・進捗）
  index.html, vr/, diag/, progress/   4 つの入口
  scripts/         setup.sh / deploy.sh / deploy.mjs / check-*.mjs / size-report.mjs
  shots/           自動で撮ったスクリーンショット
```

## 5. 描画方式の選び方
- `src/core/renderer.ts`：WebGPU を第一に試し、使えない・初期化に失敗した場合は WebGL 2 に切り替える。
  WebGPU の起動中にページが止まった場合、次の起動では自動で WebGL 2 にする（`sessionStorage` の印）。
- `?renderer=auto|webgpu|webgl2` と保存済みの設定で手動指定できる。VR 版は常に WebGL 2。
- 品質段階（`src/core/platform.ts`）：PC 高画質／モバイル高画質／互換／VR。

## 6. 画面の確認方法（ローカルの Web サーバーは立てない）
- `scripts/lib/browser.mjs`：Playwright の経路の差し替えで、`dist/` を `https://undersoil.test/` から読み込ませる。
- `node scripts/check-part1.mjs`：4 ページ × 2 方式を開き、エラー・404 を数え、スクリーンショットを `shots/` に保存。
- `node scripts/check-vr.mjs`：WebXR エミュレーターで VR の出入りを確認。
- 各ページは `window.__state` に状態を出す（自動操作の待ち合わせ用）。

## 7. Netlify
| 項目 | 値 |
|---|---|
| サイト名 | undersoil-web-20261122 |
| サイト ID | 57c0d6c8-e672-427f-921f-c452c33f9b43 |
| チーム | nocturne（slug: fujita-takashi、Pro） |
| 本番 | https://undersoil-web-20261122.netlify.app |
| 下書き | https://draft--undersoil-web-20261122.netlify.app |
| 配置 | 画面版 `/`、VR 版 `/vr/`、進捗 `/progress/`、実機診断 `/diag/` |

- 似た名前の既存サイト（触らない）：`undersoil-web-20261121`（前日の Unity 版）、`undersoil-progress-tf`。
- **公開の手順**（Claude のセッションから）：
  1. Netlify 連携の `deploy-site`（siteId 指定）を呼び、返ってきた proxy の URL を `build-cache/proxy.txt` に保存する（数分で期限切れ。リポジトリには入れない）。
  2. `bash scripts/deploy.sh draft`（下書き）または `bash scripts/deploy.sh prod`（本番）。
  - 仕組み：`dist/` を zip にして `POST /api/v1/sites/<id>/builds` に送る。`?branch=draft` を付けるとブランチデプロイになり、本番は変わらない。
  - proxy で通るのはこの送信と `GET /deploys/<id>` だけ（ほかの API は 403）。
- 配信設定（`public/_headers`）：`/assets/*` は1年・immutable、HTML は no-cache、`/models/*` は毎回確認。Brotli 圧縮が効いていることを確認済み。
- **プランの上限**（2026-11-22 に公式ページで確認。クレジット制の Pro と推定。実際の段階は請求画面で要確認）：
  - 月 3,000 クレジットから。転送 20 クレジット/GB（転送だけなら約 150 GB/月）、リクエスト 2 クレジット/1万件、
    **本番デプロイ 1 回 15 クレジット、ブランチ（下書き）デプロイは 0**。使い切るとチームの全サイトが止まる。
  - 1 ディレクトリ 54,000 ファイルまで。zip 方式は 25,000 ファイルまで。デプロイは 3 回/分・100 回/日まで。
  - 1 ファイルの最大サイズ・デプロイ全体の最大サイズ・zip の最大サイズは公式に明記なし（**未確認**）。1 ファイル 10 MB 以下を目安に分割する。
  - → 作業中は下書きに出し、本番は節目だけにする（月 20 回で 300 クレジット）。
