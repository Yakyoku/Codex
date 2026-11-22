# INNER RESTORE — 技術設計書（TECH）

## 公開先
| | サイト名 | サイト ID | URL |
|---|---|---|---|
| 本番 | inner-restore-web-20261122 | `df57e5ce-3511-45aa-854e-a1198fe2ce16` | https://inner-restore-web-20261122.netlify.app/ |
| 下書き | inner-restore-web-20261122-draft | `9da4a676-781d-48cc-8114-d8a3ae8a1735` | https://inner-restore-web-20261122-draft.netlify.app/ |

- Netlify チーム：nocturne（slug `fujita-takashi`、Pro）。
- 公開は `bash scripts/deploy.sh draft|prod "<proxy-path>"`。`<proxy-path>` は Netlify の連携機能（MCP の `deploy-site` に siteId を渡す）が毎回発行する一時 URL。
  この連携のコマンドは常に「そのサイトの本番」に公開するため、**下書きは別サイト**に分けた（同一サイトの下書き URL は API トークンがないと作れない）。
- 配置：画面版 `/`、VR 版 `/vr/`、進捗 `/progress/`、診断 `/diag/`。
- 配信設定：`dist/_headers`（`scripts/postbuild.mjs` が生成）。`/assets/*`（ハッシュ付き）は1年・immutable、HTML は no-cache、`/static/*`（ハッシュなしの素材）は毎回再検証。圧縮は Netlify が自動（brotli を確認済み）。

## 環境（2026-11-22 に確認）
| 項目 | 値 |
|---|---|
| OS / CPU / メモリ / ディスク | Linux 6.18 x86_64 / 4コア / 15GB / 空き 60GB / GPU なし |
| Node / npm | 22.23.5 / 10.9.9 |
| Python / pip | 3.13.18 / 24.0（venv: `~/.venvs/inner-restore`） |
| git / gh / ffmpeg / ImageMagick | 2.43.0 / 2.89.0 / 6.1.1 / 6.9.12 |
| Chrome（Playwright 同梱） | Chrome for Testing 153（Playwright 1.63、`/opt/node-tools`） |
| ネットワーク | npm・PyPI・GitHub・Netlify API・Wikipedia・NCBI・OpenStax・polyhaven・freesound・unpkg に到達（200/301）。この環境は想定より広く届く |

## 使うライブラリ（版を固定）
| 用途 | ライブラリ | 版 | 指示書との違い |
|---|---|---|---|
| 描画 | three（`three/webgpu` の WebGPURenderer＋TSL） | 0.187.0（r187、確認時の最新） | なし |
| ビルド | Vite / TypeScript | 8.3.8 / 7.0.2 | なし |
| モデル | bpy（Blender の Python モジュール） | 5.3.0 | なし |
| 素材の最適化 | @gltf-transform/cli・core・functions | 4.5.1 | メッシュ圧縮は **Draco ではなく meshopt**（下記） |
| VR の模擬 | iwer | 2.8.0 | — |
| テスト | vitest | 5.1.1 | — |

### 指示書と違う点・確かめた制約
- **bpy 5.3.0 には Draco の書き出しライブラリが入っていない**（`libbf_intern_draco_bridge.so` が無い）。メッシュの圧縮は glTF Transform 側で行う。
  方式は meshopt を採用（復号器が約 30KB と小さく、Draco の wasm 約 300KB を同梱せずに済む。量子化＋brotli で十分小さい）。
- **TSL の型定義が厳しく**、式の合成でコンパイルが通らないため、シェーダー記述の中だけ `src/core/tsl.ts` 経由で型を緩めている。
- **この環境の WebGPU**：SwiftShader のアダプターで初期化・描画ループは動く（フレームは進む）が、
  three r187 がパイプライン作成時に行う `popErrorScope()` が「Instance dropped in popErrorScope」で失敗し、未処理の例外が2件出る。
  画面はスクリーンショットでも 2D キャンバスへの写し取りでも真っ黒。**この環境では WebGPU の「エラーゼロ」は確認できていない**。
  WebGL 2 ではエラー0。実機の WebGPU は診断ページの `err=` で確かめる。
- Blender の Cycles（CPU）：512px・48サンプルの AO 焼き込み 約2〜3秒、512px×4方向の確認用画像 約12秒。

## 構成
```
inner-restore/
  index.html, vr/, diag/         … 各ページの入口（Vite の複数ページ構成）
  src/core/      … 描画エンジンの生成・端末判定・素材読み込み・健康度・入力・音・セーブ（共通基盤）
  src/materials/ … TSL のマテリアル（WebGL 2 でも成り立つ記述が土台）
  src/stages/    … ステージごとの中身（後から読み込む）
  src/data/      … 調整値（tuning.json）、登場するもののデータ（atlas.json）、文言（ja.json）
  tools/blender/ … モデルを作る bpy スクリプト（対象ごとに1本。irlib.py が共通部品）
  tools/pack-glb.mjs … 焼き込みテクスチャの取り付けと最適化（glTF Transform）
  assets/        … 生成した中間素材（raw GLB、焼き込み画像、確認用画像）
  public/static/ … 配信する素材（最適化済み GLB、音、画像）
  scripts/       … setup.sh、deploy.sh、postbuild、Playwright による確認
  tests/         … vitest の単体テスト
  Docs/          … 指示書、設計書、台帳、資料、引き継ぎ
```
- 単位：1 = 1µm（ステージ1）。VR では世界全体を縮尺して置き、プレイヤーの足場（rig）だけを動かす。
- 画面版と VR 版は同じステージのコードを使い、カメラ・操作・UI の表示方法・描画密度だけを差し替える。
- 品質段階：`pc-high` / `mobile-high` / `compat` / `vr`（`src/core/device.ts`）。URL の `?backend=webgl|webgpu` と設定で描画方式を選べる。

## 画面の確認方法
- `scripts/lib-browser.mjs`：Playwright が `https://ir.test/` への通信を `dist/` のファイルに差し替える（ローカルの Web サーバーは立てない）。
- Chrome の起動オプション：`--use-angle=swiftshader --use-gl=angle --enable-unsafe-swiftshader`（WebGL 2）、`--enable-unsafe-webgpu`（WebGPU）。
- `?t=秒` で時間を固定でき、同じ場面を同じ条件で撮れる。動画は時間を刻んで1コマずつ撮り、ffmpeg でつなぐ。
- この環境の fps は意味がない（GPU なし）。速さは `/diag/` の結果で判断する。

## Netlify のプランの上限（2026-11-22 に公式の料金ページと docs で確認。サブエージェントによる調査）
| 項目 | 内容 |
|---|---|
| プラン | Pro（クレジット制）。月 3,000 クレジット、繰り越しなし |
| 転送量 | 20 クレジット/GB（固定の GB 上限はなく、クレジット残高が上限。転送量だけなら約 150GB/月） |
| リクエスト | 2 クレジット/1万リクエスト |
| 本番デプロイ | 成功1回につき 15 クレジット（失敗は 0）。Deploy Preview とブランチデプロイは 0 |
| 超過時 | 残高ゼロでチームの全サイトが停止（`Site not available`）。自動チャージは既定でオフ |
| ファイル | 1ディレクトリ 54,000 ファイルまで。ZIP デプロイは展開 25,000 ファイルまで。1ファイルの最大サイズと1デプロイの容量上限は公式ページでは未確認 |
| API | デプロイは 1分3回・1日100回まで |
| サイト数 | 1チーム 500 まで |

**運用の決まり**：デプロイはチーム全体のクレジットを使う（1回 15。下書きサイトへの公開も、そのサイトの本番デプロイなので同じ）。
このため公開は節目だけに絞り、作業中の確認は Playwright（公開しない）で行う。1セッションあたりのデプロイは 10 回以内を目安にする。
手動（MCP 経由）の本番デプロイが実際に 15 クレジット引かれるかは公式文書では未確認。持ち主が請求画面で確かめられる。
