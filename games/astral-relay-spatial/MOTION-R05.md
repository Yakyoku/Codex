# ASTRAL RELAY • MOTION R05

公開基準: `cf150b2536706f7bb8c2d58d1af5b12b289b12ea`（4K r03）。2026-11-11、公開中の2D/3D rendererをHTTPS取得しGitHub同ファイルとSHA256一致確認。

重要: 環境変更後 `/workspace/astral-relay` は存在しない。今回の編集元は既存公開用チェックアウト `/workspace/codex-publish-astral-relay`。元TypeScript正本の復旧とは扱わない。公開済みJSを保全し、その描画層と読みやすい追加ES Modulesを当該ゲーム内に保存した。未公開performance-r04のソース/ZIPは復旧できておらず、その保存非干渉診断機能を収録したとは主張しない。`?verify=1` は今回の公開版で安全な検証モードではない。

## 30項目の製品変更台帳

全行が2D・3Dの両方に適用。純粋な文書やテストだけの項目は数えていない。修正前の根拠は保存した公開renderer。各行の意味的検査は `motion.test.mjs` の同じM番号で実行。実画面による主観品質評価とは別判定。

|ID|提案|公開版の問題|実装後|変更箇所・検査ID|
|---|---|---|---|---|
|M01|自機の横移動バンク|方向転換しても姿勢が一定|横速度に応じて傾斜し、停止時は指数応答で水平へ復帰|Motion.track / ship / x / M01|
|M02|自機の前後ピッチ|前進・後退が同じ姿勢|前後速度に応じた小さなピッチ、2Dは縦方向の投影変化|Motion.track / ship / x / M02|
|M03|速度に応じた推進炎|固定振幅の正弦波のみ|加速・減速に遅れて追従する推進長と微小な揺らぎ|Motion.pose.engine / engine meshes / M03|
|M04|翼端航行灯|機体細部に時間的な変化がない|低周波の航行灯。機体の輪郭を保つ小さな点光|Motion.pose.light / motionLight / M04|
|M05|精密移動の翼姿勢|FOCUS点以外は通常時と同じ|精密移動時に翼部が段階的に閉じる|Motion.update.fin / motionWing / M05|
|M06|強化時の機体サイズ移行|合体時にサイズが瞬時に切り替わる|強化倍率へ滑らかに移行、解除時も戻る|Motion.update.scale / M06|
|M07|射撃反動|連射中も自機が静止した造形|射撃イベントで小さな後退反動を加え素早く減衰|Motion.event.shot / kick / M07|
|M08|被弾姿勢回復|復帰位置へ切り替わるだけ|復帰機体の短い反動と減衰。元の被弾・残機処理は不変|Motion.event.damage / kick / M08|
|M09|復帰保護の視認性|12Hzで機体全体が消える|機体は表示し続け、保護リングと穏やかな呼吸動作を表示|renderer shield / MotionScene.draw / M09|
|M10|敵の進行方向旋回|2Dは常に下、3Dは自機と同方向|速度方向へ最短角で旋回、毎秒3rad以内に制限|Motion.track.yaw / M10|
|M11|敵の横旋回バンク|編隊の軌道に姿勢が伴わない|横速度に連動したバンクを両版に適用|Motion.track.roll / M11|
|M12|ダートの可動翼|小型機が同じ姿勢変化|ダート専用の速い応答と小さな翼動作|Motion.pose.wing / M12|
|M13|オーブの姿勢周期|オーブは色以外ほぼ共通機体|緩やかなヨーとロール周期で異なる飛行特性を表現|Motion.pose.spin / M13|
|M14|キャリアの重量感|大型機と小型機の動きの反応が同じ|キャリアの姿勢応答を遅くし、3Dサイズを2Dに合わせる|Motion.track rate / ship scale / M14|
|M15|補助機の浮遊姿勢|補助機が他機と同様に平坦移動|小振幅の上下浮遊。見た目のみ最大2論理px|Motion.pose.hover / M15|
|M16|補助機の誘導ビーコン|回収対象が色のみで区別される|周期的な楕円リングと推進の明滅を追加|Motion.pose.beacon / details2D / MotionScene / M16|
|M17|空中敵の発射予兆|敵弾が前兆なく発生する|実際に射撃する敵だけ、射撃カウント終盤に砲口リング|Motion.update.warning / M17|
|M18|地上装甲の着弾反応|地上物が命中しても姿勢不変|HP減少時の小さな装甲反動・傾きから復元|Motion.track.hit / ground branches / M18|
|M19|隠し標的の展開|進捗が数字中心、3D高さが即時変化|命中進捗に応じ、装甲回転・開き・高さが段階的に展開|Motion.update.reveal / M19|
|M20|コアの組立運動|2Dは直線的な収縮、3Dは単体の結び目|4つの随伴部品が滑らかに収束、3Dにも組立を実装|Motion.pose.coreRadius / M20|
|M21|コア弱点時間の動作|弱点時間が主に色と文字|2〜4.2秒の既存判定時間だけ輪郭が穏やかに脈動|Motion.pose.corePulse / M21|
|M22|砲口発光|自機の発射位置に演出なし|短い方向付き砲口発光、0.13秒で消去|shot effect / M22|
|M23|自弾の短い軌跡|弾が独立した棒のみ|弾の後方に限定した薄い短い軌跡|details2D shots / MotionScene shots / M23|
|M24|敵弾の方向表現|弾が方向を持たない円・球|2Dは速度方向の短い尾、3Dは速度に沿った伸長|details2D bullets / MotionScene bullets / M24|
|M25|命中火花|2Dにimpact演出なし、3D event空|短命の放射状火花を両版に追加|impact effect / M25|
|M26|爆発の時間構成|2Dは同じ拡大円、3Dは破壊描画なし|短い発光芯→広がる衝撃波→減衰へ分離|explode effect / M26|
|M27|破片の慣性|2Dは直線的な点、3Dはなし|減速、回転、緩い落下、フェードを持つ破片|particle / explode debris / M27|
|M28|合体吸収運動|2Dは爆発と似た拡大円、3Dはなし|6つの光粒が自機へ螺旋状に収束|merge effect / M28|
|M29|ボーナス浮上表示|汎用の拡大円のみ|ひし形の光がイージング付きで浮上し消える|bonus / formation effect / M29|
|M30|エクステンド軌道表示|音のみで描画イベントがない|3つのリングが自機の周囲を回って消える|extend effect / M30|

## 補間・設定・安全性

30項目に加え、固定120Hzの物理ステップ直後の位置を保存し、描画時の余剰時間で自機・敵・自弾・敵弾を補間。ゲーム本体は変更しない。復帰テレポートは補間せず、ポーズ中は姿勢と演出時間を固定。イベント上限96、3Dの追加表示オブジェクト上限160、再使用プールを使用。これらはGPU性能達成の証拠ではない。

設定ダイアログの「動き: 標準/控えめ」で傾斜・揺らぎ・破片量を軽減。OSのreduced-motionも初期値に反映。VR内B設定のMOTIONも同じ設定を操作できる。ユーザー保存データへ新しい読込・書込は追加しない。既存ゲームのスコア保存機能は従来どおり動作する。

## ビルドと検査

リポジトリのルートで:

```sh
node games/astral-relay-arcade/motion-source/build.mjs
node games/astral-relay-spatial/motion-source/build.mjs
node --test --test-isolation=none --test-reporter=spec games/astral-relay-arcade/motion-source/motion.test.mjs
```

新規ライブラリは不要。既存のThree.jsとCanvas2Dを使用し、ゲーム本体の入力・得点・衝突処理は公開JSから保持。`ASTRAL_SOURCE_REVISION` を設定するとビルドmanifestにソースcommitを記録する。新規出力のJS名はSHA256の先頭12桁を含む。古いassetsは保持する。`motion-release.json` にinputHash/buildUTC/ソースrevision/必要な配信ファイルhash/site IDを記録。自己参照を除く全ファイルのhashは `motion-distribution.json` を参照。

## 検査結果と限界

49検査成功。M01〜M30に加え、保存非干渉（追加Motionモジュールのみ）、再試行、ポーズ、全種類の2D描画命令、実Three.jsモデル構築、カメラ不変、プール上限、5分相当のCPUシミュレーション、補間、GAME OVER/リトライ/得点重複/合体/周回/隠し標的/連鎖ボーナス、公開版ルールとPCパッド処理の一致、配信hashを確認した。

2DテストはCanvasの描画コマンド記録、3Dテストは実Three.jsのシーンとモデルを生成しWebGLRendererのみ模擬。実際の画面を見た検査でもGPU FPS測定でもない。以前の39/48テスト一式は元正本消失で再実行できず、今回の49検査と混同しない。

途中検査: Node既定テストランナーの子プロセス実行は詳細のない `test failed` で終了。Node標準の同一プロセス実行に変更して検査可能になった。旋回上限の検査で急旋回を検出→毎秒3rad制限を追加→成功。3D版の定数宣言を2Dと同じ形と想定したコード一致検査は抽出に失敗→抽出方法を訂正→成功。

ブラウザ実画面/試聴/4060 Ti実測/物理パッド/Quest立体視・FPS/iPadは未確認。現在のChromium sandbox helperは `nobody:4755` で正常起動条件を満たさず、過去の起動拒否は反復しない。前回ユーザーが中止したFirefox取得は再試行しない。クラウドにブラウザ操作ツールは現在ない。制限解除や安全機能無効化は行っていない。アクセスできない実機を3回試験したとの記録は作らない。

## 公開と引き継ぎ

公開はGitHub `Yakyoku/Codex` のこの2フォルダだけ→既存GitHub Actions `netlify-deploy.yml`→既存専用サイト。直接Netlify deployはしない。

- 2D: astral-relay-arcade / e3e58594-14bb-49ce-9374-6cb5128e20d9
- 3D: astral-relay-spatial / d26fbd41-5e66-4df2-8533-5153a2221ed2

アプリ検査と公開検証は別判定。Actions成功と本番ファイル一致の証拠は公開後のリリース受領記録に保存する。見た目が「プロ水準」との主観的な保証は、実画面評価が残るため行わない。

PC操作はWASD/矢印、Space/Z射撃、Shift精密移動、Escポーズ。標準パッドは左スティック、A/右トリガー射撃、左トリガー精密移動、Startポーズ。これら既存処理は一致確認済み、物理接続は未確認。
