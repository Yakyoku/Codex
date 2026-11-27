# HANDOFF（引き継ぎ）— 2026-11-25 更新

## 公開 URL
- 本番：https://inner-restore-web-20261122.netlify.app/ （VR：/vr/、進捗：/progress/、診断：/diag/）
- 下書き：https://inner-restore-web-20261122-draft.netlify.app/ （まだ一度も公開していない）
- 本番への公開は 2 回（第1部、M1 第1版）。Netlify のクレジット消費は計 約30 の見込み。
- Netlify サイト ID：本番 `df57e5ce-3511-45aa-854e-a1198fe2ce16`、下書き `9da4a676-781d-48cc-8114-d8a3ae8a1735`（チーム slug `fujita-takashi`）

## 環境の準備手順（新しいセッションの最初に）
1. `bash inner-restore/scripts/setup.sh`（bpy 5.3.0 を venv `~/.venvs/inner-restore` に、npm の依存を入れる）
2. `cd inner-restore && npm run build && npx vitest run`
3. 画面の確認：`node scripts/shot.mjs out.png "/?backend=webgl&sim=20&frames=3" 960 540`（sim=自動操作で進める秒数。frames=描くコマ数）
4. VR の確認：`node scripts/check-vr.mjs <出力フォルダ>`
5. 公開：Netlify の連携機能（MCP）の `deploy-site` に siteId を渡して proxy-path をもらい、`bash scripts/deploy.sh prod|draft "<proxy-path>"`
   - **デプロイ1回で Netlify のクレジットを 15 使う**（月 3,000、チーム全体で共有）。節目だけ公開する。

## 現状（マイルストーン）
- 第1部：完了。M0：ほぼ完了（残り＝同梱フォントの切り出し）。
- M1（見た目の確立）：画面版・VR 版とも第1版が動く。**持ち主の実機確認待ち**。
  - 網膜の内側の面の一区画（150×110µm）。健康度マップ → 白濁／透明、血流、脈動、光、音、患者の視界が連動。
  - 浄化ビーム、スキャン、紹介カード5種（赤血球・血管内皮細胞・周皮細胞・ミュラー細胞・硝子体）、図鑑（一覧のみ）、一時停止、全画面、タッチ・ゲームパッド・キーボード＋マウス。
  - VR：座位、スティック移動（なめらか／一瞬で進む）、30°ずつの回転、移動中の視野絞り、バイザーの縁、右手のビーム、左手首の端末（見るとスキャン）、世界に置く紹介パネル・字幕・患者の窓。

## 決定事項
- リポジトリは `Yakyoku/Codex` のブランチ `claude/inner-restore-game-dev-pu5f2t`、フォルダ `inner-restore/` の中だけ。
- 下書きは別サイト（MCP 経由のデプロイは常に本番になるため）。
- メッシュ圧縮は meshopt（bpy 5.3 に Draco がない）。読み込み時に量子化を実寸に戻す（`dequantize`）。
- 主人公は身長 2µm、知覚加速 ×200（血流の速さ 1.7mm/s を 8.5µm/s として見せる）。
- 赤血球の変形は CPU 側で形を作っておく（InstancedMesh で positionNode を使うと、インスタンスの位置まで変形されるため）。

## 実機の結果（持ち主の iPad）
- 2026-11-22：iPad Safari、WebGPU・モバイル高画質で 16fps、文字が小さすぎる。→ 対策：毎コマのノイズ計算を焼き込み画像に置換、PC 高画質以外はクリアコート・光の筋・主人公の灯りを外す、光を1つ減らす、描画解像度の自動調整（`src/core/dynres.ts`、モバイルは ×1.1 から開始）、文字を約1.5倍に。再確認待ち。

## 操作の不具合（2026-11-22、持ち主の iPhone）
- 横向きの iPhone で主人公が動かない → 左上の表示が左半分の 40% を覆い、タッチを受け止めていた。表示だけの部品はタッチを通すよう修正（3% に）、横向きのスマートフォンでは左上の表示を小さく。ゲームパッドは Safari ではボタンを1回押すまで認識されないため、認識時に画面で知らせ、タイトルでも A／× で開始できるようにした。

## 2026-11-22 夜の持ち主の要望への対応
- 患者の視界：`tools/blender/make_patient_view.py` を作り直し（朝の病室、Nishita の空と日差し、空気中の光の筋、透けるカーテン、遠くの木々、浅いピント、後処理のにじみと周辺減光、1920×1080、約15〜20分）。全画面に切り替わるとき、まぶしい光でにじんだ状態からピントが合う演出（`main.ts` の finish）。
- 浄化の光線：`src/game/beam.ts`（芯・外側の光・流れるうねり・らせん状の粒・当たった所の光の輪と舞い上がる粒）。スキャンは主人公から広がる波紋（`retina.ts` の scanRing）。
- 主人公の動き：`diver.ts` の関節をすべて2次のばねで追従。腰の傾きと振れ、肩の逆ひねり、一本線の歩き、腕の遅れ、頭の安定、加速の前傾、曲がるときの傾き、止まったときの重心と呼吸。
- 主人公の色：`diver.ts` の restyle（真珠のような光の干渉、つやの層、縁の光、明るい紫）。光の干渉は PC 高画質とモバイル高画質だけ。

## 主人公のアニメーション（持ち主の参考の姿勢 `Docs/REFERENCE/hero/poses-v1.jpg`）
- `tools/blender/make_anims.py`：diver.blend を開き、idle（腰に手・重心・呼吸）・walk・run・squat・crouch を作って diver.raw.glb に書き出す（make_hero.py の後に必ず実行）。
  歩き・走りは4つの要所の姿勢×左右を曲線でつなぐ。しゃがみ・片ひざ・腰に手は IK（足と手の目標、ひざ・ひじの向きは自動で探す）で求めてキーに焼き付け。
- 確認：`render_poses.py`（参考と同じ4つの姿勢）、`render_anim_video.py`（毎秒30コマの動画）。
- ゲーム：`diver.ts` が AnimationMixer で重みを混ぜる（速さで idle/walk/run、スキャンで crouch、長く立ち止まると squat）。歩き・走りの再生速度は進む速さに合わせる（WALK_SPEED 1.5、RUN_SPEED 3.6）。構え・前傾・曲がるときの傾きは上乗せ。
- 移動の速さを見直し：走り 3.1、ダッシュ 4.2、構え中は 0.265 倍（＝歩き 0.82）、スキャン中は 0.35 倍。
- 持ち主の指摘（横向き・こちらへ向かう時の足が変、ガニ股）への対応：ひざの向く角度を探す前にひざが前へ曲がる姿勢を作る（目標が原点だと内側・横へ曲がった）、
  足の左右の位置を中心線の近く（歩き 3cm・走り 4.5cm）に、ひざは内側へ寄せて前へ、腰の揺れとひねりを大きく、腕は体の近く。
  ゲームでは体の向いている方向へだけ進み、向きが大きくずれている間は先に向きを変える。前傾・曲がる時の傾きは胸から上だけ（骨盤に掛けると足が浮く）。
  構えて動くときは脚が進む方向・上半身が狙う方向へひねる。滑りの計測：/tmp の slip.mjs 相当（W.__force で入力を固定して1コマずつ進め、床に着いた足の水平移動を測る）。
- 歩き・走りは `make_anims.py` の loco()：足の軌道（着地中は地面に固定して一定の速さで後ろへ、離地中は弧）を毎コマ決め、IK で脚を求めて焼き付ける。
  関節の角度だけで作った版は、足が地面に着かず「スキップ」のように見えた（持ち主の指摘）。歩幅は脚が届く範囲（歩き 0.62、走り 0.76）。
  ゲームの WALK_SPEED 0.91・RUN_SPEED 3.17 は、この歩幅で足が滑らない速さ（数値で確認済み）。

## 既知の問題・やり残し
1. **WebGPU はこの環境で絵を確認できず、`popErrorScope` の失敗（Instance dropped）が2件出る**。実機の /diag/ の `err=` で確認が必要。
2. 毛細血管の網目の間隔が実際（約100µm）より狭い（約40〜50µm）。区画を広げて直す。
3. 内皮細胞の核は「内腔側へ盛り上がる」。いまは色の濃さだけで示している（内側の面のメッシュがない）。
4. 潜行士は第7版。持ち主の指示：参考画像に沿う／四角を使わず曲線美を強調／「全く似ていない」と繰り返し指摘あり（具体的な既存作品の名前を挙げての依頼だが、その主人公の意匠は写さない方針を持ち主に伝えた）。体の土台を数式から MakeHuman（CC0）の写実的な人体に変更：`tools/mh_body.py`（体型の調整の重み W）→ `assets/models/mh_body.npz` → `make_hero.py`（表面の符号つき距離で曲線に沿う装甲の板、骨、ヘルメットは頭の大きさに合わせる）。安静の姿勢は腕を斜めに開いた形なので、ゲーム側（`diver.ts` の ARM_DOWN・LEG_IN）と確認用の描画で補正している。
5. 後処理は `src/core/post.ts` で実装済み（実機での重さは未確認）。WebGPU 上乗せ（GPU 計算の群れ）は未実装。
6. 音は実行時合成の仮のもの。Python 合成＋ffmpeg の素材化、出力先（テレビ／ヘッドホン／VR）の切り替え、立体音響は未実装。
7. 図鑑の3Dビューア、セーブの書き出し・読み込み、設定画面（M4）、同梱フォントは未実装。
8. VR：iwer は描画先に null を返し three r187 が落ちるため、確認スクリプト側で WeakMap を回避している（実機の経路とは別）。
   VR の実機での表示・fps・酔いは未確認。コントローラーの見た目は簡易な前腕。
9. 台帳の事実確認は反映済み（誤り0、未確認2件を削除、言い換え14件）。赤血球1個の色は「淡い」のが実際で、いまのモデルは赤が濃すぎる可能性がある（要見直し）。内境界膜の表面は、終足を覆うなめらかな基底膜（敷石模様は膜のすぐ下）。
10. 動画は毎秒6コマ・480×270（この環境の描画が1コマ数秒〜20秒かかるため）。

## 次の一手
1. 持ち主の実機診断（iPad／iPhone → PC → Quest 3）の結果を `Docs/DEVICE_RESULTS.md` に記録し、予算表を見直す。
2. 既知の問題 2・3・4 を直す。後処理を入れて「映像の基準」を詰める（比較画像を進捗ページへ）。
3. M2（操作の確立）：泳ぎ、スキャンの診断表示、命中時の反応、VR の手の操作の仕上げ、調整つまみ。

## 2026-11-23 体内映像の実写化（第1回）
- 参考：Wikimedia Commons の眼底写真（CC0）と爪の毛細血管の顕微鏡映像（CC BY 4.0、見比べのみ）。
- `src/stages/eye/retina.ts`：背景・霧を健康度で変わる暖かい光に（黒をやめた）／内境界膜は半透明＋神経線維の筋／深部は眼底の橙赤色＋網膜内の散乱層2枚／血管壁ほぼ透明・周皮細胞は控えめ／赤血球は深紅（つや・映り込み抑制）／硝子体の線は削除、浮遊粒は少なく小さく。
- `src/core/post.ts`（新規）：RenderPipeline。pc-high＝ピント（主人公に自動で合わせる）＋光のにじみ、mobile-high＝光のにじみ、全段階で色調・周辺減光・粒子感。`?post=off` で無効、`?post=full` で強制（確認用）。
- 未確認：実機 WebGPU での見え方と速さ（この環境の WebGPU は画面が真っ黒になるため WebGL 2 で確認）。

## 2026-11-23 実写化 第2回 ＋ M2（操作の確立）
- 実写化：赤血球の流れ（区間ごとの速さのゆらぎ＋前に追いつかない＝詰まりと隙間、速さで伸び縮み）、パラシュート形、`scatterTex`（血管からの距離で赤い光のにじみを焼き込み）、カメラのわずかな揺れ・ピントの前後・露出の息づき（`?still` で止まる）。赤血球の間隔 `flow.spacing` 16→9。
- 初めの病み方：区域を3つに分けた閉塞点（`stage.cores`）を核に濁る。進み具合は始めの状態を 0% とする（`stage.progress()`）。`stage.cores` は M3 の「病巣の核」に使う予定。
- 泳ぎ：`make_anims.py` に swim（平泳ぎ風 48コマ）と float（ただよう 90コマ）。確認絵は `tools/blender/render_swim.py`。`diver.setSwim(on, pitch, roll)` で腰を中心に体を倒す。操作は Space/C、パッド A/B（速くは L3 に移動）、タッチの上へ／下へ。調整値は `tuning.player.swim*`。
- 診断：`src/game/diagnosis.ts`（画面版・VR 共用）。10×7 区画の平均で病巣を選び、血管の近さで原因（閉塞／虚血）を推定。
- 手応え：`src/core/feel.ts`（パッド振動・スマホ振動・VR 触覚）。`tuning.feel`（一瞬の間 0.07 秒×0.12 倍、揺れ、振動の強さ）。
- 調整つまみ：URL に `?tune`。
- VR：設定（向き・目の高さ・手で泳ぐ）は localStorage に保存。握って引くと反対へ進む（`tuning.vr.swimPull/swimDrag`）。エミュレーターで上昇を確認。
- 未確認：実機での泳ぎの気持ちよさ、振動、VR の手で泳ぐ酔いやすさ。
- 次：M3（ステージ1完成）＝病巣の核との対決、回復演出、音の素材化、図鑑の3Dビューア、入口から患者の変化までの通し。

## 2026-11-23 M3 着手：区域A の閉塞点
- `retina.ts` の `plugs`：`cores` の位置の血管に、止まった赤血球 9 個の塊。`stage.heal` の中で、7µm 以内に光が当たると hp が 3.2 秒で 0 → ほぐれる（`setOnPlug` で画面版・VR に知らせる）。
- ほぐれていない閉塞点の 22µm 以内は健康度の上限 0.3〜（`health.clampFn`）。進み具合は閉塞点が残る間 0.9 で止まる。
- 診断は閉塞点を最優先で示す。
- 通しプレイの自動確認：`node scripts/playthrough.mjs`（成功で終了コード 0）。
- M3 の残り：入口（硝子体を泳いで降りる）、区域B（水晶体）、区域C（視細胞の森）、病巣の核（黄斑の中心）、器官の再起動演出、音の素材化、図鑑の3Dビューア。区域B・C は調査と台帳への追加・事実確認から（PROMPTS の「ステージ追加」と同じ手順）。

## 2026-11-23 M3：ステージ1の道のりを通しで
- 区域の仕組み：`src/stages/zone.ts`（共通の形 ZoneStage・ZoneMeta、並び ZONES）。`?zone=retina|lens|photo`、続きは `src/core/save.ts`（localStorage `ir.save`）。区域を治しきると「次の区域へ」。VR も同じ。
- 入口：網膜の区域で、まだ着いていなければ硝子体の高さ 34µm から泳いで降りる（`?noentry` で省略）。
- 区域B `src/stages/eye/lens.ts`＋`tools/blender/make_lens.py`（六角形の帯＋ボール・ソケット、粒）。光の届く所 `reach` を中央の帯の健康度から求める。
- 区域C `src/stages/eye/photo.ts`＋`tools/blender/make_photo.py`（桿体・錐体・中心窩の錐体・色素上皮・ドルーゼン）。`collide` で柱に入れない（伸びた柱だけ）。ドルーゼンに当てると対決（7秒ごとの弱らせる波、`setOnPlug` の 'pulse'）。治しきると `bootR` の光の波。
- 音：`tools/make_audio.py` → `public/static/audio/<区域>.m4a`（各 約125KB、AAC 40kbps）。`audio.bed(url)`、健康度で高音を開く。
- 図鑑の3D：`src/game/viewer.ts`（模型のある9項目。物差し＝2µm）。
- 台帳：14項目。新しい9項目は別のサブエージェントで事実確認（`Docs/REFERENCE/atlas_new_checked.json`, `atlas_drusen_checked.json`）。
- 通しプレイ：`node scripts/playthrough.mjs`（3区域、成功で終了コード 0）。
- 未確認：実機の見た目・速さ（区域Bは透明な層の重なりが多く、iPhone で重い可能性）、VR の区域B・Cでの酔いやすさ、環境音の聞こえ方。
- 残り（M3 の仕上げ）：映像を本物の写真と見比べて詰める（区域B・C）、区域B の「光を導く」を VR でも手で導く形に、細胞の確認用の絵（図鑑の画像）、動画。その後 M4。

## 2026-11-23 読み上げの設定・音声会話の先生（voice-buddy）・M3 の仕上げ
- 読み上げ：`src/core/voice.ts`（声の選び方：女性の声の名前の一覧から。設定は localStorage `ir.voice`）。設定画面 `src/game/settings.ts`＋`ui.ts` の `#settings`。VR 版の字幕も読み上げる。
- 音声会話の先生：`index.html` の末尾で voice-buddy.js を読み込む（手順書 https://voice-buddy-yk.netlify.app/integrate.md）。要点JSONは `node scripts/build-vb-context.mjs` で台帳から作る（`public/voice-buddy-context.json`、課題6・用語14）。
  notify：紹介カード＝lesson_shown（`showCard`）、区域の開始＝question_shown（`<区域>-task`、`begin`）、塊をほどいた＝answered correct:true（`<区域>-plug`、`setOnPlug`）、区域を治しきった＝all_clear（`finish`）。
  先生のボタンが出たら `body.vb` でタッチのボタンを上へずらす。設定で非表示にできる（`ir.vb`）。VR 版には入れていない。
- M3 の仕上げ：区域B（細隙灯の見え方）、区域C（外節の先の明るい点・光の筋）、VR 区域Bの左手の「導きの光」、患者の視界の全画面表示の崩れ。
- 未確認：先生との会話（マイク）、端末ごとの声の種類、iPhone での区域B・C の重さ。
- 次：M4（全身マップ、セーブの書き出し・読み込み、タイトル、画面版と VR 版の行き来）。

## 2026-11-23 iPad で「コントローラーが動かない」への対応
- 原因（推定、この環境で再現）：初めて開いたときの入口（硝子体）で、主人公が区域の外の縁を向いて始まり、前へ進むとすぐ端で止まっていた。網膜の区域の開始の向きを、区域の中ほど（＋x）へ直した。
- 入口では何もしなくてもゆっくり沈む。区域の端に当たると案内を出す。
- 念のため：1コマの更新の失敗で止まらないようにし、失敗は画面右下に表示。映像の仕上げが失敗したら自動で切る。設定に「映像の仕上げ：入れる／切る」。
- 確認：`node scripts/check-touch.mjs`（iPad として開き、画面左をドラッグして、区域の中へ進むか）。
- 追記（同日）：持ち主「上下は動くが左右に動いているように見えない」。入口の高さ（34µm）では、まわりに目印がなく、泳ぐ速さ 2.4µm/s では動きが分からなかった。入口を 20µm に下げ、泳ぐ速さ 4.2µm/s・加速 3.0 に、体のまわりに流れる細かな粒（`nearMotes`）を足した。iPad 相当でスティックの前・右・左それぞれ進むことを確認。

## 2026-11-24 M4（外枠）
- タイトル `#tmenu`（start＝つづきから／はじめる、b-hub、b-new）。全身マップ `src/game/hub.ts`（HubView：画面のキャンバスに描く、器官の目印・選択、`buildHubModel` は VR と共用、`vitals`）。人体は `tools/blender/make_hub_body.py` → `hub_body.glb`＋`static/data/hub.json`（関節の位置）。
- セーブの書き出し：`IR1.` ＋ JSON の base64（進み具合・図鑑・紹介の設定）。設定画面の「進み具合（セーブ）」。
- 同梱フォント：`tools/make_font.py`（元のフォントは tools/fonts/README.md の場所から。文言を足したら再実行）。
- 画面版と VR 版の行き来：localStorage を共有。タイトル・一時停止に VR 版への入口、VR 版に区域の選択と「画面版に戻る」。
- 例外：音声会話の先生だけは外部サイトから読み込む（持ち主の指示）。LICENSES.md に記載。
- 次：M5 以降はステージ追加（持ち主の指示を受けてから。PROMPTS の「ステージ追加」）。それまでの間は、ステージ1の品質の底上げ（実機確認の結果の反映、動画、図鑑の画像）。

## 2026-11-25 ステージ1の品質の底上げ
- 図鑑：模型のなかった6項目（ミトコンドリア・血小板・内皮細胞・周皮細胞・ミュラー細胞・硝子体）を `tools/blender/make_atlas_extra.py` で作成。図鑑の画像は3D表示を撮って作る（`node scripts/atlas-images.mjs` → `public/static/img/atlas/<id>.jpg`）。
- 見どころの動画：`node scripts/video-highlights.mjs <出力.mp4>`（3区域。この環境では1コマ数秒かかるので、背景で動かす）。

## 2026-11-25 ステージ2「鼻」（M5）
- 区域：`src/stages/nose/airway.ts`（区域A 線毛の森 `cilia`、区域B 粘液の川 `mucus`）、`src/stages/nose/olfactory.ts`（区域C 嗅上皮 `olfactory`＋病巣の核）、共通部品 `common.ts`（線毛の森：1枚の形にまとめ、頂点の計算で有効打・回復打・波を作る）。
- ステージの仕組み：`ZONES` に `stage`、`STAGES`、`stageZones()`。区域の meta に `perception`（知覚加速。鼻は ×20）、`scaleNote`、`patient: 'smell'`。区域の `drift`（流れに乗る）、`beat`（拍子。照準の輪が脈打ち、拍子に合わせると治りやすい）、`setDiver`。
- 模型：`tools/blender/make_nose.py`（粘液栓・ほこり・黄色ブドウ球菌の房・好中球と核・嗅細胞の先・図鑑用の線毛細胞・杯細胞・線毛の断面・支持細胞）。音：`make_audio.py` に cilia・mucus・olfactory。
- 台帳：鼻の8項目（事実確認：誤り4・削除2・言い換え14）。GDD 6-2 に設計。
- 未確認：実機での線毛の森の重さ（頂点 約70万＝PC 高画質）、VR の拍子の分かりやすさ。

## 2026-11-25 鼻の見た目の直し・AI の声
- 持ち主「ギザギザ感が多い」→ 走査電顕の写真と見比べ：線毛を丸い管（`common.ts` の ciliaField、断面5角・法線つき）、ほこりを丸い粒、好中球をひだ＋偽足の平たい細胞（細い突起は取りやめ）、粘液を濡れたつやの面（うねり）に。
- 先生と話すボタン（voice-buddy）は外した。ナレーションは AI の声：`node scripts/record-voices.mjs`（voice-buddy の /api/realtime-token で短命の鍵 → OpenAI のリアルタイム音声に一字一句読ませる → 書き起こしで照合 → `public/static/voice/<声>/<識別子>.m4a`、`manifest.json`）。台本は `?narration`（`src/core/narration.ts`）。言葉を変えたら再実行（変わった行だけ録る）。1回の実行で鍵を4〜8回使う（1日100回まで）。
- 再生：`src/core/voice.ts`（`ai:<声>` を選ぶと録った音、なければ端末の声）。速さは再生速度（音の高さは保つ）。

## 2026-11-25 ステージ3「肺」
- 区域：細気管支 `bronchiole`（`nose/airway.ts` の variant 'L'：クラブ細胞・呼吸の流れ）、肺胞の中 `alveolus`／肺胞の壁 `alvwall`（`lung/alveolus.ts`）。模型 `tools/blender/make_lung.py`、音 `make_audio.py`（8秒周期の息）。
- 呼吸：8秒で1回（吸う40%・吐く60%）。`drift` で流れ、`beat` で照準の輪（吐く息で脈打つ）、吐く息で治りやすい。区域Bは壁が伸び縮み（約5%）。患者の変化 `patient: 'breath'`（呼吸の波形）。
- 台帳：肺の8項目（事実確認済み）。GDD 6-3。
- 次のステージ：腸（持ち主の確認後）。

## 進捗ページの「全体の進み具合」（2026-11-26、持ち主の依頼）
- `Docs/progress.json` の `overview`（13項目、重みの合計100、done は 0〜1）。作業が進んだら、その都度 done と state を更新してから公開する。進捗ページを共有するときは、この％も報告に書く。

## 2026-11-26 ステージ4「腸」
- 区域：`src/stages/gut/villi.ts`（villi・colon・crypt）。模型 `tools/blender/make_gut.py`（絨毛の先・陰窩の口・パネート細胞・4種の細菌）。音（6秒のぜん動）。患者の変化 `patient: 'comfort'`。
- 勢力図：細菌は場所の健康度で種類が入れかわる。群れ（plugs）が残る間は、健康度0.5未満の所が少しずつ下がる（creep）。
- 進捗ページの全体：ステージ4 完了で 70%（次はステージ5「血管」）。

## 2026-11-26 ステージ5「血管」
- 区域：`src/stages/vessel/artery.ts`（valve・plaque・clot）。模型 `tools/blender/make_vessel.py`。音（拍動）。患者の変化 `patient: 'circulation'`。拍動は `beat`（約8.6秒）、`drift` で押される。
- 進捗ページの全体：ステージ5 完了で 78%（次はステージ6「心臓」）。
- 容量：音声ファイル（AI の声）が 約15MB に増えた。どれも読み上げるときに1つずつ読む（最初の読み込みには入らない）。

## 2026-11-26 ステージ6「心臓」
- 区域：`src/stages/heart/heart.ts`（endo＝心内膜とプルキンエ線維・myo＝心筋の並び・scar＝傷あとの迷路と病巣の核）。模型 `tools/blender/make_heart.py`（心筋線維・枝分かれ線維・図鑑用の心筋細胞・コラーゲンの束・線維芽細胞・腱索・毛細血管・プルキンエ線維・洞結節の細胞）。音（不規則な心音）。患者の変化 `patient: 'rhythm'`（`main.ts` の心電図。病は間隔ばらばら＋幅の広い余計な拍、治ると P・QRS・T のそろった波）。
- リズム：`heart.ts` の lastBeat/nextBeat。病の度合い（1−進み具合）だけ間隔が揺れ、余計な拍（0.45 拍後）が入る。伝導の波 `waveX` は線維ごとの `blockX`（インスタンス属性）で止まる。縮むと横縞の間隔（サルコメア）が詰まる。
- 実物の写真（`Docs/REFERENCE/img/heart/`、13枚）で決めた見た目は GDD 6-6。見比べて直した所：コラーゲンを細い線維の束（端が細る）に、床の模様を規則的でない筋に、心内膜を濡れたつやに、プルキンエ線維を膜に覆われた畝に。
- 台帳：心臓の8項目（事実確認：誤り7・削除6・言い換え13）。
- 進捗ページの全体：ステージ6 完了で 86%（次はステージ7「脳」）。

## 2026-11-26 映像のリアリティの共通のしかけ
- `src/core/realism.ts`：`addRealism(stage, renderer, tier, {shadows})`（探照灯 PointLight・足もとの影・漂う粒・主光源の影）と `organic(mat, noiseTex, {scale,bump,sss,planar})`（細かな凹凸＝bumpMap、光の透け）。画面版 `main.ts` と VR 版 `vr.ts` から呼ぶ。影は pc-high のみ（`?shadows` で他の段階でも試せる、`?shadows=0` で切る）。`?real=off` で全部切る。
- `post.ts`：レンズの色のにじみ（pc-high・mobile-high）。GTAO は `?ao` のときだけ（ざらつきが出るので標準は切。直すならノイズ除去 DenoiseNode を検討）。
- `assets.ts` の makeEnvironment に小さく強い光源を追加（濡れた面の点の照り返し）。
- organic を入れた面：鼻の上皮、肺胞の壁、腸の床（A・C）、血管の床、心臓の床（A・C）と心筋。目のステージは材質を変えていない（共通のしかけだけ）。
- 未確認：WebGPU での見え方、影つきの PC 実機の速さ、スマホの重さ（粒 240個＋光1つ）。重ければ `addRealism` の motes を減らす。

## 2026-11-27 ステージ7「脳」と締めくくり
- 区域：`src/stages/brain/brain.ts`（bbb＝血液脳関門・cortex＝神経細胞の森・amyloid＝アミロイドβのかたまりと病巣の核）。模型 `tools/blender/make_brain.py`（錐体細胞・もつれ・とげ・毛細血管・終足・アストロサイト・周皮細胞・ミクログリア2形・かたまり・ふくれた突起・髄鞘・オリゴデンドロサイト）。管や枝の共通の道具は `tools/blender/shapes.py`（make_heart.py と共用）。音（電子音と弦、4秒の発火）。患者の変化 `patient: 'conscious'`（脳波と呼びかけへの反応）。
- 締めくくり：`main.ts` の `playEnding()`。最後の器官の最後の区域を治しきると、患者の目覚め → 記録映像（`public/static/img/ending/<区域>.jpg`、`node scripts/ending-shots.mjs` で撮り直せる）＋灯先生の言葉（`lines.ts` の end1〜end8）→ 治療完了。確認用 `window.__ending()`。締めくくりの間は後ろの3Dを描かない。
- 進捗ページの全体：ステージ7 完了で 94%（残りは実機での確認と調整）。

## 2026-11-27 全体の採点と修正・描画の予算
- 採点：`Docs/REVIEW_2026-11-27.md`（制作に関わっていないサブエージェント）。上位5つのうち、明るさの基調・不具合・待ち時間・画面の表示を修正。主人公の見た目の変更（つや消しの灰色）は見送り（持ち主の確認待ち）。残りの指摘（器官ごとの持続音の音色、基本図形に見える模型、患者の写真が7器官で同じ）は未対応。
- 明るさ：`realism.ts` の LOOK（半球光 ×0.55、主光源 ×0.8、霧と背景 ×0.72、映りこみ ×0.8、探照灯 20）。区域が毎コマ書き直す値に後から掛ける。`post.ts` の色調は黒の持ち上げを弱めた。
- 軽い模型：`assets.ts` の `setLowModels`（pc-high 以外は `<名前>.lo.glb`）。作り方 `node tools/pack-glb.mjs <raw> <lo> --plain 1 --ratio 0.3 --error 0.004 --keep <簡略化しない模型>`（heart: collagen,collagen_lo／brain: plaque,plaque_lo,tangle／vessel: fibrin,fibrin_lo。VR だけ photo.lo も使う）。模型を作り直したら lo も作り直す。
- 測定：`node scripts/measure-zones.mjs`（画面版＝互換と VR の三角形・描画回数。結果は `Docs/build-sizes/zone-tris.json`）。
- 区域の移動：`?zone=…&go=1` でタイトルを挟まずに始まる。患者の変化の演出は 6.5秒後から押して飛ばせる。

## 2026-11-27 採点の残りの指摘
- 音色：`audio.ts` の `theme`（start() の前に器官の id を入れる。TH の表）。
- 患者の窓：`tools/blender/make_patient_view.py` の `VIEW=smell|breath|comfort|circulation|rhythm`（`W=1280 H=720 SAMPLES=48` で約3分）→ `public/static/img/patient_<VIEW>.jpg`。画面版 `main.ts`・VR 版 `vr.ts` が `M.patient` で選ぶ。
- 豆知識：`ui.ts` の `TIPS_BY`（器官ごと）。
- 見送り中：主人公の見た目の変更（持ち主の判断待ち）。

## 2026-11-27 実機のスクリーンショットを受けた修正
- 全身マップ：`hub.ts` の体は、奥行きだけを先に描く（`bodyDepth`）＋表の面だけを加算で光らせる。目印は depthTest なし。顔の目印（目 r0.02、鼻 r0.012）を小さく。
- スマホ横向き（`@media (max-height:520px)`、`ui.css`）：紹介カードは上中央に小さく（英語名・比較・くわしい説明の3行目以降・閉じ方の案内は省く）、字幕は下に3行まで、右のボタンの位置は ui.css の末尾の同じ media で上書き。確認用の再現は scratchpad の phone.mjs と同じ手順（850×390・タッチ）。
- 主人公の見た目の案（?suit=matte|grey）は、持ち主の判断待ちのまま。
