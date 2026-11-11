# ASTRAL RELAY MOBILE R06

MOTION R05の30改善を保持し、2D・通常3D表示へスマートフォン操作を追加改善。旧r05固定ZIPとGit履歴は保持。編集場所は既存公開用チェックアウト（消失した元正本の復旧ではない）。

## 操作

- スマホ・タブレット: 左スティックで移動、右FIREを押し続けて射撃、FOCUSで精密移動。移動と射撃を同時タッチ可能。自動射撃は従来の設定から選択可能。
- PC: マウス・キーボード使用時は自動モードの操作パッドを非表示。ウィンドウが狭いだけでは表示しない。標準パッドの実入力でも非表示にする。
- ハイブリッドPC: 画面をタッチすると自動表示。キーボードの移動キー、マウスクリック、パッドの入力へ切り替えると非表示。
- 設定 → 画面のタッチ操作 → 自動／表示／非表示。選択はそのページ内だけで保持し、新しい保存データの読込・書込を追加しない。VR中はDOMの操作パッドを隠す。
- スマホ縦持ちでは戦域下に専用操作領域を確保。横持ちは戦域左右の余白を使用。safe-areaと動的ビューポートを考慮し、戦域の480:700比率と見える範囲を維持。
- 非表示への切替、ポーズ、再試行、フォーカス喪失、画面回転では入力を解除。指ごとに移動・射撃の所有権を管理し、別の指の離脱で解除しない。

ブラウザで遊ぶWeb版の対応。ネイティブアプリ/APK/App Store配布やオフラインインストール機能を追加したものではない。

## 検査・ビルド

```sh
node games/astral-relay-arcade/motion-source/build.mjs
node games/astral-relay-spatial/motion-source/build.mjs
node --test --test-isolation=none --test-reporter=spec games/astral-relay-arcade/motion-source/motion.test.mjs games/astral-relay-arcade/motion-source/touch.test.mjs
```

62件成功（既存49 + タッチ13）、両静的ビルド成功。ポインター所有権、同時操作、キャンセル/キャプチャ失敗、表示切替、パッド活動、XR表示抑止、保存非干渉、再試行を検査。描画はCanvas命令とThree.jsシーン、入力は模擬DOMイベントでの検査。スマホ/iPad実機、実ブラウザの配置・試聴、4060 Ti/Quest FPS、物理パッドは未確認。既知のブラウザ起動拒否や中止された取得処理は反復しない。

今回のPCパッド変更は「操作パッドを隠す検知」だけで、既存パッド入力の割当・ゲームルールは保持。motion-release.jsonに現行R06の入力hash、ソースrevision、build UTCと実行時ファイルhashを保存。mobile-distribution.jsonはR06パッケージ全ファイル一覧（自身を除く）。MOTION-R05.md、motion-validation.txt、motion-distribution.jsonは前版の履歴資料。

## 公開状態

ローカル保存のみ。前工程のGitHub `git pull --rebase origin main` がユーザー中止となり、通信再開が未確認のためpush/Actions/Netlify公開は実行していない。旧公開サイトを新版として案内しない。再開時は最新AGENTSを確認し、同じ2フォルダだけをGitHubへpush、Actionsと本番hashを検証する。直接Netlify公開・新サイト・新認証は行わない。
