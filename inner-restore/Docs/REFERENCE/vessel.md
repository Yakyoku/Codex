# 血管（ステージ5）の資料

調査日：2026-11-26。ステージ5「血管」に登場させるもの（動脈の壁の層、細動脈・細静脈・毛細血管、静脈の弁、血流と脈、血液の成分、内皮の表面の糖の層、プラークができる流れ、血栓）の、実際の構造・大きさ・動き・見え方・不調の仕組みをまとめた。
対象ごとの「形の仕様書」は `atlas/` にある（末尾の一覧を参照）。台帳の下書きは `atlas_vessel_draft.json`。
赤血球・血管内皮細胞・血小板・好中球はすでに台帳にある（`rbc` `endothelial` `platelet` `neutrophil`）。ここでは重ねて書かず、必要なところで参照する。

## この文書の読み方

各記述の末尾に、確かめ方の印を付けた（`eye.md`・`nose.md`・`lung.md`・`gut.md` と同じ）。

- 【全文】… 資料の本文を取得して、該当箇所を自分で読んだ。
- 【要旨】… 論文の要旨（アブストラクト）だけを読んだ。本文は読めていない。
- 【抜粋】… 検索結果に出た抜粋だけで確認した。本文は読めていない。採用前に再確認が望ましい。
- 【計算】… 資料の数値から、この文書の中で計算した値。資料に直接は書かれていない。
- 【未確認】… 今回の調査では出所を確かめられなかった。事実として使わないこと。

調査の制約：
- Wikipedia（英語版）は記事の原文（ウィキ記法）を取得して読んだ。【全文】の多くはこの方法による。
- PubMed の要旨は NCBI の公開 API（E-utilities）で、PMC のオープンアクセス本文は Europe PMC と NCBI の API で取得した。
- Wikimedia Commons は検索 API に回数制限（429）がかかった。ファイルの説明ページ（ライセンス・作者・説明文）だけを読み、**画像そのものは今回1枚も見ていない**。
- 血流の細かな研究（細胞のいない層、糖の層、白血球の転がり）の多くはラット・マウス・ハムスター。ヒトでない値には「（ラット）」などと書いた。
- 正常な冠動脈の内膜と外膜の厚みは、ヒトの実測値を確かめられなかった（第2節）。

### ゲーム内の尺度の目安（主人公 2 µm、髪の毛 約70〜80 µm、赤血球 約7.8 µm）

主人公を身長 170 cm の人とみなすと、倍率は 約 85万倍。【計算】（170 cm ÷ 2 µm）

| もの | 実際の大きさ | 主人公から見ると（170 cm の人に置きかえ） |
|---|---|---|
| HDL の粒 | 直径 約5〜20 nm | 約0.4〜1.7 cm（豆つぶ）【計算】 |
| LDL の粒 | 直径 約20〜27.5 nm | 約1.7〜2.3 cm（ビー玉）【計算】 |
| フィブリンの繊維 | 太さ 約100 nm | 約8.5 cm（太いロープ・水道管）【計算】 |
| 内皮の表面の糖の層 | 毛細血管 約0.2〜0.5 µm／小動脈 2〜3 µm | 約17〜43 cm／約1.7〜2.6 m【計算】 |
| 血小板 | 直径 約2〜3 µm | 約1.7〜2.6 m【計算】 |
| 赤血球 | 直径 約7.8 µm | 約6.6 m【計算】 |
| 単球 | 直径 約15〜22 µm（塗り広げた標本） | 約13〜19 m【計算】 |
| 平滑筋細胞 | 長さ 約56 µm、幅 約4 µm（ブタ冠動脈） | 長さ 約48 m、幅 約3.3 m【計算】 |
| 薄い線維性の膜（破れやすいプラークのふた） | 65 µm 未満 | 55 m 未満【計算】 |
| 冠動脈の中膜 | 厚み 約0.2 mm | 約170 m【計算】 |
| 冠動脈（左前下行枝の根もと）の内腔 | 直径 約3.7 mm（抜粋） | 約3.1 km【計算】 |

---

## 1. 血管の種類と太さ

- 大動脈は直径 約25〜30 mm、毛細血管は 約5 µm（0.005 mm）。【全文】[Wiki-BV]
- 動脈は、直径 10 mm より太いものは多くが弾性型（壁に弾性線維が多い）、0.1〜10 mm は筋型（壁に平滑筋が多い）。【全文】[Wiki-Artery]
  筋型動脈（例：橈骨動脈・大腿動脈）は、内膜に薄い内皮下層とはっきりした内弾性板があり、中膜に平滑筋が最大40層ほど重なる。外弾性板は太い筋型動脈にだけある。【全文】[Wiki-MuscArt]
- 細動脈：直径 10〜50 µm。神経が多く、平滑筋に囲まれる。【全文】[Wiki-Micro]
- 毛細血管：5〜10 µm【全文】[Wiki-Capillary]、5〜8 µm【全文】[Wiki-Micro]。壁は内膜だけ（内皮細胞と基底膜）。【全文】[Wiki-Capillary]
- 細静脈：10〜200 µm。【全文】[Wiki-Micro]
  毛細血管のすぐ後の細静脈は 10〜30 µm で、平滑筋の層がなく、周皮細胞に巻かれる。50 µm を超えると平滑筋をもち（筋性細静脈）、1 mm ほどまで太くなる。【全文】[Wiki-Vein]
- 静脈は動脈より平滑筋と結合組織が少なく、内腔が広い。全身の血液の 約70% が静脈にある。【全文】[Wiki-Vein]
- 冠動脈（心臓を養う動脈）の内腔：左主幹部 4.5 ± 0.5 mm、左前下行枝の根もと 3.7 ± 0.4 mm、先の方 1.9 ± 0.4 mm。【抜粋】[Dodge1992]（原著の本文・要旨の数値は未確認。著者ページの引用）
  病理標本 230 切片の平均の血管径は 2.90 ± 0.96 mm。【全文】[Konishi2023]

## 2. 動脈の壁：3つの層

内側から、内膜・中膜・外膜の3層。【全文】[Wiki-Artery]

### 内膜（いちばん内側）
- 内皮細胞1層と、その下のわずかな結合組織、外側の境の**内弾性板**からなる。血流に直接ふれるのは内皮。【全文】[Wiki-Intima][Wiki-IEL]
  血流の乱れる場所では、内膜にマクロファージ（食べる細胞）も見られる。【全文】[Wiki-Intima]
- **内弾性板**：弾性の膜で、内膜の外側の縁。筋型動脈では厚くはっきり見え、細動脈では薄く途切れがち、静脈ではとても薄い。【全文】[Wiki-IEL]
  細長い小さな孔が点々とあいた「穴あきの膜」で、弾性線維はおもに長さの方向に走る。死後には縦のしわに縮む。【全文】[Wiki-Intima]
  高齢になると、内膜の線維化で内弾性板が2重になることがある。【全文】[Wiki-IEL]
- 正常な内膜の厚み（ヒト冠動脈）：【未確認】
  - 超音波（血管内エコー）の研究では、内膜の厚みが **0.5 mm 以上** の所を「動脈硬化」と定義した。移植心の提供者（平均33歳）262人の 51.9% に見られ、20歳未満で17%、50歳以上で85%。動脈硬化のある人の内膜の厚みは平均 1.08 ± 0.48 mm。【要旨】[Tuzcu2001]
  - → 若い健康な冠動脈の内膜は 0.5 mm より薄い、と言えるが、正常値そのものは確かめていない。
  - 正常な冠動脈では内膜がとても薄く、超音波では内弾性板の明るい反射として見えるだけ、という記述がある。【抜粋】
- 内膜は年齢とともに厚くなる（適応的な内膜の肥厚）。病理標本（平均60歳、10人）の 47% がこの状態。【全文】[Konishi2023]

### 中膜（まん中）
- 平滑筋細胞、弾性組織、コラーゲン線維からなる。【全文】[Wiki-Artery][Wiki-Media]
- 小さな動脈では平滑筋が細い束になり、層状に、**管をぐるりと巻くように**並ぶ。層の数は、いちばん細い動脈で1層、やや太いもので3〜4層、最大6層。【全文】[Wiki-Media]（古い Gray 解剖学の記述）
  筋型動脈では最大40層。【全文】[Wiki-MuscArt]
- **ヒト冠動脈の中膜の厚み**：中央値 **0.202 mm**（四分位 0.149〜0.263 mm）。病理標本 230 切片（非心臓死の10人、平均60.4歳）。太い枝ほど、根もとほど厚い。【全文】[Konishi2023]
  同じ論文が引く先行研究：病変のない所 平均 202.9 µm、動脈硬化のある所 平均 88.4 µm（プラークの下では中膜が薄くなる）。【全文】[Konishi2023]
  → 中膜 0.2 mm は 主人公 約100人分、赤血球 約26個分、髪の毛 約2.7本分。【計算】

### 外膜（いちばん外側）
- コラーゲン線維と弾性線維のゆるい結合組織。動脈では外弾性板に支えられる。まわりの器官に血管をつなぎとめる。【全文】[Wiki-Externa]
- 太い動脈には、壁そのものを養う小さな血管（**血管の血管**、vasa vasorum）が通る。【全文】[Wiki-Artery]　外膜には、リンパ管・血管の血管・神経もある。【全文】[Wiki-MuscArt]
- 静脈では外膜がいちばん厚い層。太い動脈でも中膜より厚いことがある。【全文】[Wiki-Externa]
- ヒト冠動脈の外膜の厚み：【未確認】

### 中膜の平滑筋細胞の形（詳しくは `atlas/smooth_muscle_cell.md`）
- 紡錘形（まん中が太く、両端が細い）で、核は1個。【全文】[Wiki-SM]
- ブタ冠動脈：長さ **56.0 ± 10.3 µm**、幅 **3.9 ± 0.7 µm**、核の長さ 15.0 ± 4.7 µm、縦横比 14.7 ± 3.5。管の周方向から 18.7° ± 10.9° ずれて、らせん状に並ぶ。【全文】[Chen2013]（ブタ）

## 3. 静脈の弁

- 中くらい〜太い静脈にある一方通行の弁。脚では、筋肉が縮んで静脈を押すしくみ（筋ポンプ）が戻りを助ける。【全文】[Wiki-Vein]
- 形：**2枚の帆（尖）**からなる。内膜の一部が管の両側から内側へ折れこんでできる。帆はコラーゲンと弾性線維で補強され、表面は内皮に覆われる。【全文】[Wiki-Vein]
  - 帆の、静脈の壁に向いた面では内皮細胞が横向き、血液が流れる面では流れの向きに縦に並ぶ。【全文】[Wiki-Vein]
  - 帆は、ふくらんだ縁で壁に付き、へこんだ自由縁は流れの向き（心臓側）を向く。【全文】[Wiki-Vein]
  - 弁の付く所で壁が両側にふくらみ、心臓側にお椀形のくぼみ（**弁洞**）ができる。逆流しかけると、まず弁洞に血が満ちて帆が閉じる。【全文】[Wiki-Vein]
  - 弁洞の内皮細胞は、弁のない所の2倍まで伸びられる。【全文】[Wiki-Vein]
- 静脈の弁の 約95% は、直径 300 µm 未満の小さな静脈にある。【全文】[Wiki-Vein]
- 1枚・3枚の帆の弁（大きさのそろわないもの）もある。【全文】[Bazigou2013]
- 動き（健康な人20人の超音波）：開く 0.27 秒 → 開いたまま釣り合う 0.65 秒 → 閉じる 0.41 秒 → 閉じたまま 0.45 秒。開いている間、帆の先は流れの中で **0.1〜1.6 mm** の幅でひとりでに震える。弁洞では渦ができて、血がよどむのを防ぐ。いっぱいに開いても、弁のところの内腔は下流より 約35% せまく、中央に速い流れ（噴流）ができる。【要旨】[Lurie2003]
- 弁が閉じなくなると、静脈の圧が上がり、立ったときのむくみ、静脈瘤、脚の潰瘍、血栓につながる。【全文】[Bazigou2013]
- 静脈の血栓は弁のところから始まりうる（数個の血小板が弁の縁に付き、さらに血小板と赤血球が集まる図）。【全文】[Wiki-Thrombus]（図の説明文）
- 帆の厚み・長さの実測値：【未確認】

## 4. 血流の速さ、流れ方、脈

### 速さ
- 血管の種類ごとの平均の速さ（教科書の表）：大動脈 **40 cm/s**（断面積の合計 3〜5 cm²）、毛細血管 **0.03 cm/s ＝ 0.3 mm/s**（合計 4,500〜6,000 cm²）、上下の大静脈 **15 cm/s**（14 cm²）。速さは断面積の合計に反比例する。【全文】[Wiki-Hemo]
- ヒトの爪の根もとの毛細血管で測った赤血球の速さ（健康な14人）：安静時 **0.9 ± 0.4 mm/s**、血流を1分止めてから戻した直後の最大 1.7 ± 0.9 mm/s。この毛細血管の太さは、行きの脚 10.8 µm、折り返し 16.3 µm、帰りの脚 12.3 µm。【要旨】[Aguiar2006]
  → 毛細血管の速さは 0.3〜1 mm/s ほど。主人公にとっては 1秒に体の 150〜450倍の距離。【計算】
- 動脈では、心臓が縮む時期の速さが、ゆるむ時期より速い。その差の度合いは心臓から遠いほど小さくなる。【全文】[Wiki-Hemo]
- 中くらいの動脈（冠動脈など）の平均の速さ：【未確認】

### 層になった流れ（層流）と、壁ぎわの「赤血球のいない層」
- ふつうの血流は層流で、**中心がいちばん速く、壁ぎわがいちばん遅い**。【全文】[Wiki-Hemo]
- 毛細血管では、細さと遅さのためにレイノルズ数（流れの乱れやすさ）がとても小さく、層流になる。【全文】[Wiki-Hemo]
- 壁のでこぼこ（脂肪のたまり）が流れの滑らかさを下げ、乱れた流れ（乱流）を起こしうる。【全文】[Wiki-Hemo]
- **細胞のいない層（cell-free layer）**：細い血管では赤血球と血漿が分かれ、壁ぎわに赤血球のいない血漿の層ができる。ラットの細動脈（内径 10〜50 µm）で、平均の厚みは **0.8〜3.1 µm**（太いほど厚い）。厚みは時間とともに平均の 30〜70% 揺れ、向かい合う壁で逆に動く。【要旨】[Kim2007]（ラット）
  ヒト網膜の毛細血管網のコンピューター模型でも、壁ぎわに 0.8〜1.8 µm の赤血球のいない層ができる。【要旨】[Ebrahimi2024]（模型）
  → 主人公（2 µm）は、細動脈の壁ぎわの「赤血球のいない層」にちょうど収まる大きさ。【計算】
- 血小板は大きな赤血球に押されて壁ぎわへ寄る（`atlas/platelet.md`）。

### 脈と脈波
- 脈拍は成人で 1分に 60〜100回、1拍 0.6〜1秒。首・手首・ももの付け根・膝の裏・くるぶし・足の甲で触れる。【全文】[Wiki-Pulse]
- 成人の正常な安静時の血圧は 120/80 mmHg 未満（米国の基準）。【全文】[Wiki-BP]
- **脈波**（心臓の拍出で生じる圧の波）は、血液そのものよりずっと速く動脈の壁を伝わる。首〜ももの付け根で測る脈波の速さ（健康で血圧が正常な人 1,455人）：30歳未満 平均 6.2 m/s、40代 7.2 m/s、50代 8.3 m/s、60代 10.3 m/s、70歳以上 10.9 m/s。年齢と血圧で速くなる（壁が硬くなるため）。【全文】[RVASC2010]
  10 m/s を超えると臓器の障害の目印とされる（欧州高血圧学会）。【全文】[Wiki-PWV]
  → 大動脈の血液の平均 40 cm/s に比べ、脈波は 15〜25倍速い。【計算】

### 内皮の並び方と流れ
- まっすぐな部分では、内皮細胞は流れの向きに細長く並ぶ。【全文】[Wiki-Endo][Davies2009]
- 枝分かれ・分岐・曲がり角では流れが渦を巻いて乱れ、内皮の並ぶ向きがそろわない。**こうした場所に動脈硬化ができやすい**。【全文】[Davies2009]

## 5. 血液の成分と大きさ

- 血液の 約55% が血漿。血漿は淡い琥珀色〜黄色の液体で、水が最大95%、タンパク質が 6〜8%（アルブミン・グロブリン・フィブリノゲンなど）。【全文】[Wiki-Plasma]
- 赤血球が血液の体積の 40〜45%、白血球は 約1%。【全文】[Wiki-WBC]　ヘマトクリット（赤血球の割合）男性 38〜52%、女性 37〜47%。【全文】[Wiki-Blood]
- 血小板の数：1 µL に 15万〜40万個。【全文】[Wiki-Platelet]

| 成分 | 大きさ | 印 |
|---|---|---|
| 赤血球 | 直径 約7.8 µm（台帳 `rbc`） | — |
| 好中球 | 12〜15 µm（標本に貼りついた状態）。浮かせた状態では平均 8.85 µm | 【全文】[Wiki-WBC][Wiki-Neutrophil] |
| 好酸球 | 12〜15 µm（好中球よりやや大きい） | 【全文】[Wiki-WBC] |
| 好塩基球 | 12〜15 µm（好中球よりやや小さい） | 【全文】[Wiki-WBC] |
| リンパ球 | 小 7〜8 µm／大 12〜15 µm。核が赤血球ほどの大きさ | 【全文】[Wiki-WBC][Wiki-Lympho] |
| 単球 | 15〜22 µm【全文】[Wiki-Monocyte]／15〜30 µm【全文】[Wiki-WBC]。血液中でいちばん大きい細胞 | 食い違いあり |
| 血小板 | 直径 約2〜3 µm（台帳 `platelet`） | — |
| フィブリノゲン（固まる前の材料） | 棒状 9 × 47.5 × 6 nm。血漿に 150〜400 mg/dL | 【全文】[Wiki-Fibrinogen] |
| LDL | 直径 22〜27.5 nm【全文】[Wiki-LDL]／20〜25 nm【全文】[Wiki-Lipoprotein] | 食い違いあり |
| HDL | 直径 5〜17 nm【全文】[Wiki-HDL]／10〜20 nm【全文】[Wiki-Lipoprotein] | 食い違いあり |
| VLDL | 30〜90 nm | 【全文】[Wiki-Lipoprotein] |
| カイロミクロン | 100〜1,000 nm | 【全文】[Wiki-Lipoprotein] |

- 白血球の割合（成人）：好中球 62%、リンパ球 30%、単球 5.3%、好酸球 2.3%、好塩基球 0.4%（表の値）。【全文】[Wiki-WBC]
- 白血球の大きさは、塗り広げて乾かした標本の値が多い。流れている（浮いている）状態の値はもっと小さい（好中球で 8.85 µm）。単球の浮いた状態の値：【未確認】
- 標本の色（「淡いピンクの顆粒」など）は染色の色。生体の色ではない。

## 6. 内皮の表面の糖の層（グリコカリックス）

- 内皮の表面を覆う、糖鎖とタンパクの層。血漿のタンパクを取りこんで、はっきりした境のない、たえず入れ替わる層になっている（内皮表面層とも呼ぶ）。膜に付いたヒアルロン酸は 1 µm を超える長さになりうる。【全文】[Reitsma2007]
- 厚み：
  - 骨格筋の毛細血管（ハムスター）で **0.4〜0.5 µm**。この層のせいで、赤血球が通れる幅（3.9 µm）は管の内径（5.1 µm）より狭い。白血球（5.1 µm）は管の断面いっぱいを使う。【要旨】[Vink1996]（ハムスター）
  - 毛細血管 0.2〜0.5 µm、小動脈 2〜3 µm、頸動脈 4.5 µm（血管が太いほど厚い、とする研究）。【全文】[Reitsma2007]
  - マウス頸動脈：まっすぐ流れる所 399 ± 174 nm、分岐の手前の流れが乱れる所 73 ± 36 nm（薄い）。【全文】[Reitsma2007]（マウス）
- 働き：血管の透過性を決め、血球と壁のくっつきを弱め、血流の力（ずり応力）を感じとって内皮へ伝える。白血球を転がす接着分子（P-セレクチン）は表面から 約38 nm しか出ておらず、糖の層より短い。【全文】[Reitsma2007]
- 糖の層の厚みと、内膜／中膜の比には逆の関係がある（動脈硬化の起こりやすい所ほど薄い）。【全文】[Reitsma2007]
- 生体での色・見え方：【未確認】（光学顕微鏡では直接見えず、蛍光色素や赤血球の通る幅から間接に測る。【要旨】[Vink1996]）
- → 主人公（2 µm）にとって、毛細血管の糖の層はひざ下ほど、小動脈では背丈ほどの「茂み」。【計算】

## 7. プラーク（粥腫）ができる流れ

### 7-1. 事実として確かめられていること
1. **LDL が動脈硬化を起こす**：遺伝・疫学・臨床試験の200を超える研究（200万人以上）で、LDL コレステロールにさらされる量と期間に比例して危険が増え、LDL を下げると減る。「LDL が原因であることは疑いなく確立している」。【要旨】[Ference2017]
2. **LDL が内膜にたまる**：LDL は内皮を通り抜けて内膜にたまる。損なわれていない内皮を細胞の中を通って運ばれる（トランスサイトーシス）ことが、内膜への沈着に寄与するとわかった（受容体 SR-BI と ALK1 が担う。炎症で増える）。【要旨】[Ho2023]
   内膜に引き止められた（プロテオグリカンに結びついた）LDL が反応の連鎖を起こす、という「引き止め仮説」は、中心的な考え方とされる。結びつきにくくした LDL では、マウスの病変が少ない。【要旨】[Williams1998]
3. **単球が入りこみ、マクロファージになる**：血液中の単球が内皮に付着し、内皮の下へ入りこみ、マクロファージに変わる。内皮の接着分子 VCAM-1 が単球を呼び、M-CSF がマクロファージへの変化に必要。【全文】[Wiki-Athero]
4. **泡沫細胞**：マクロファージは変化した LDL（酸化 LDL など）を食べ、取りこんだコレステロールをエステルにして細胞の中に脂肪の滴としてためる。この滴で細胞が泡のように見えるので「泡沫細胞」。【全文】[Wiki-Foam][Wiki-Athero]
   ヒト冠動脈では、泡沫細胞の **約50%** が平滑筋細胞に由来した（14人）。マクロファージの目印をもつ細胞の 約40% も平滑筋由来。【要旨】[Allahverdian2014]
5. **脂肪線条**：泡沫細胞の集まりで、肉眼で見える最初の病変。動脈の内面に、ふぞろいな**黄白色**のすじとして見える。T細胞・血小板・平滑筋細胞を含むこともある。すべてが進んだ病変になるわけではない。【全文】[Wiki-FS]
   先進国では10歳を超えるほぼ全員の大動脈に脂肪線条があり、冠動脈では思春期から始まる。【全文】[Wiki-FS]　朝鮮戦争で亡くなった兵士（平均22歳）の 77% に冠動脈の動脈硬化が見えた（1953年）。【全文】[Wiki-FS]
6. **平滑筋が内膜へ移り、線維性の膜（ふた）を作る**：中膜の平滑筋細胞が内膜へ移って増え、脂肪線条を覆う線維性の膜ができる。【全文】[Wiki-Athero]
   線維性の膜は、正常な内膜より厚く細胞の少ない線維の組織。平滑筋細胞・マクロファージ・泡沫細胞・リンパ球・コラーゲン・エラスチンからなる。【全文】[Wiki-Cap]
7. **壊死した芯（ネクロティックコア）**：泡沫細胞は死に、炎症を広げる。【全文】[Wiki-Athero]　破れやすいプラークは、薄い線維性の膜、大きな脂質に富む壊死した芯、炎症、新しくできた血管の血管、プラーク内の出血をもつ。【全文】[Wiki-VP]
   プラーク内の出血で、赤血球の膜（遊離コレステロールが多い）がたまり、壊死した芯が大きくなる。【全文】[Sakamoto2022]
8. **コレステロールの結晶**：プラークの中にあり、膜を裂き、炎症を起こすのに関わる。【全文】[Wiki-VP]　走査電顕で、結晶がプラークの表面から突き出し、赤血球に囲まれる像。結晶のまわりにマクロファージが集まり、とがった角が溶けて丸くなった結晶も見られた。【全文】[Abela2023]
   急性心筋梗塞の冠動脈から吸い出した血栓の 約5% がコレステロールの結晶だった。【全文】[Silvain2011]
   結晶の形と大きさ：【未確認】（板状とする一般的な記述はあるが、出所を確かめていない）
9. **石灰化**：進んだ病変でよく見られる。中膜の平滑筋の間やプラークの表面にできる。【全文】[Wiki-Athero][Sakamoto2022]
10. **外へ広がる変形（リモデリング）**：プラークが育つと壁が外へ広がり、内腔の太さは、プラークが壁の断面の 約40〜50% を占めるまで保たれる。だから長い間症状が出ない。【全文】[Wiki-Atheroma][Sakamoto2022]
11. **破れて血栓ができる**：線維性の膜が破れると、血を固まらせる力の強い芯の中身（組織因子を含む）が血液にふれ、血栓ができて冠動脈をふさぐ。突然死の冠動脈血栓 800例超の解剖で、原因は プラークの破裂 55〜60%、内皮のはがれ（びらん）30〜35%、石灰の結節 2〜7%。【全文】[Sakamoto2022]
    破れたプラークの膜の厚みは、破れた所の近くで **23 ± 19 µm**、95% が **65 µm 未満**。破れていない 65 µm 未満の膜をもつプラークを「薄い膜の線維性粥腫（TCFA）」と呼ぶ。【全文】[Sakamoto2022]
    破れやすいのは膜の肩（端）が多いが、運動中に亡くなった人では膜のまん中の破れも同じくらい多い。【全文】[Sakamoto2022]
    破れると、5 µm より大きなかけら（毛細血管を通れない）が下流へ流れ、小さな枝をふさぐ。【全文】[Wiki-Atheroma][Wiki-VP]
12. **くり返しの破れと治り**：症状の出ない破れと治りがくり返され、プラークが段階的に大きくなって狭くなる。【全文】[Wiki-VP][Sakamoto2022]

### 7-2. 仮説・まだ確かでないこと
- **酸化 LDL が主役か**：動物実験では LDL の酸化が関わるとされるが、抗酸化物質（ビタミンE）の大きな臨床試験の多くで心血管の病気は減らず、ヒトでの意義が疑問視されている（ビタミンEが体内でうまく働かなかっただけ、という反論もある）。【要旨】[Heinecke2003]
  Wikipedia は「最もよく記録された原動力は壁の中の酸化したリポタンパク」と書く。【全文】[Wiki-Athero]　→ ゲームでは「LDL が内膜にたまり、変化（酸化など）して、マクロファージに食べられる」と書くのが無難。【計算】
- **泡沫細胞の由来と性質**：マクロファージ由来と平滑筋由来の割合、炎症を起こす型と鎮める型があるかは研究中。【全文】[Wiki-Foam]
- **どのプラークが破れるか**：TCFA があっても破れるとは限らない。破れに変わるきっかけはまだ不明。【全文】[Sakamoto2022]　破れる前に「犯人」を見分ける方法はまだない。【全文】[Wiki-VP]
- **コレステロールの結晶が膜を突き破る**：結晶の成長で膜が裂けるとする研究グループの主張（電顕像）。仕組みとしては有力な一説。【全文】[Abela2023][Wiki-VP]
- **白血球が内皮を攻撃して始まる**という説は「仮説」と書かれ、出典の要求が付いている。【全文】[Wiki-Athero]　使わない。
- **治療でプラークは消えるか**：強いスタチンで2年間 LDL を下げると、冠動脈の動脈硬化の体積の割合は 約1% 減り、6〜7割の患者で縮んだ。【要旨】[Nicholls2011]　→ 実際の「縮み」はわずか。ゲームで一気に取り除くのは演出であることを、図鑑などで一言添えるとよい。

### 7-3. ゲームで見せる違い（健康な動脈と病んだ動脈：資料に沿った描き方）

| 見るところ | 健康 | 病気 | 出所 |
|---|---|---|---|
| ① 壁の表面の色 | 白くなめらか | 盛り上がった黄色いプラーク（強い黄色ほど危険）。破れると表面が裂け、赤い血栓 | 【全文】[deFeyter1995]【要旨】[Ishibashi2007][Takano2010] |
| ② 内皮の並び | 流れの向きにそろって細長い | 分岐や曲がり角で向きがばらばら（ここに病変ができやすい） | 【全文】[Davies2009] |
| ③ 糖の層 | 厚い茂み（マウス頸動脈で 約0.4 µm） | 流れの乱れる所で薄い（約0.07 µm） | 【全文】[Reitsma2007]（マウス） |
| ④ 内膜の厚み | 薄い（冠動脈で 0.5 mm 未満） | 0.5 mm 以上、平均 約1 mm。下の中膜は薄くなる（約0.2 → 0.09 mm） | 【要旨】[Tuzcu2001]【全文】[Konishi2023] |
| ⑤ 壁の中 | 平滑筋が管を巻くように整列 | 泡のような泡沫細胞の群れ、黄色い脂の芯、とがった結晶、白い石灰 | 【全文】[Wiki-Athero][Wiki-Foam][Abela2023] |
| ⑥ 壁の上の白血球 | まばら | 単球が内皮に付着し、内皮の下へもぐりこむ | 【全文】[Wiki-Athero] |
| ⑦ 流れ | 層になった滑らかな流れ | プラークの下流で流れがはがれて渦を巻く | 【全文】[Davies2009][Wiki-Hemo] |

- プラークの黄色は、脂質に含まれるカロテンによる。コレステロール自体は白いので、白いプラークにも脂質がありうる。【全文】[deFeyter1995]
- 血管内視鏡（アンギオスコピー）の黄色の段階：0 白、1 淡い黄、2 黄、3 強い黄。【要旨】[J Invasive Cardiol 2006, PMID 16670449]
- 強い黄色のプラークは破れやすいとみなされ、治療で黄色が消えることはプラークの安定化を意味すると考えられている。【要旨】[Takano2010]

## 8. 血栓

- 血栓は2つの部分からなる：①固まった血小板と赤血球の栓、②架橋されたフィブリンの網。【全文】[Wiki-Thrombus]
- **白色血栓と赤色血栓**：動脈の血栓は血小板が多い「白色血栓」、静脈の血栓は赤血球が多い「赤色血栓」。【全文】[Wiki-Thrombus]
  血管内視鏡でも、白色血栓は血小板が多く、赤色血栓はフィブリンに赤血球と血小板が混ざる。【抜粋】（Springer の章）
- **ツァーンの線**：血流の速い所（心臓・大動脈）でできた血栓に多い、明暗の縞。明るい層は血小板とフィブリン、暗い（赤い）層は赤血球。灰色がかった赤に見える。生前にできた血栓にだけ見られる。【全文】[Wiki-Zahn][Wiki-Thrombus]
- **心筋梗塞の冠動脈血栓の中身**（吸い出した血栓45例の走査電顕）：フィブリン 55.9 ± 18%、血小板 16.8 ± 18%、赤血球 11.5 ± 9%、コレステロールの結晶 5.2 ± 8.4%、白血球 1.3 ± 2.0%。時間がたつほどフィブリンが増え（3時間未満 48% → 6時間超 67%）、血小板が減る（25% → 9%）。発症1時間以内の「新しい」血栓は血小板が多い。【全文】[Silvain2011]
- **血餅の収縮**：血栓は時間とともに縮み、外側にフィブリンと血小板の集まり、内側に押しつぶされて**多面体になった赤血球**がすき間なく並ぶ（ポリヘドロサイト）。患者の動脈血栓にも見られる。血小板の運動タンパクとフィブリンが、この力を生む。縮んだ血栓は水を通しにくく、溶けにくい。【要旨】[Cines2014]
- **フィブリンの網**：トロンビン（酵素）がフィブリノゲンを切ると、分子が半分ずつずれて2本鎖の原線維になり、長さの方向に伸び、横に束なって太い繊維になる。伸びる途中で枝分かれして3次元の網になる。【全文】[Ramanujam2024][Wiki-Fibrin]
  繊維は **長さ数 µm、太さ 約100 nm**。【全文】[Ramanujam2024]　→ 太さは赤血球の 約80分の1、髪の毛の 約750分の1。【計算】
  細い繊維がぎっしり枝分かれした網は溶けにくい。心筋梗塞・脳梗塞・静脈血栓の患者では網の構造が変わっていることが多い。【要旨】[Undas2011]
  繊維の太さの幅（細い〜太い）の実測の範囲：【未確認】（「約100 nm」以外の数値は確かめていない）
- 血栓ができる3つの条件（ウィルヒョウの三徴）：内皮の傷、流れのよどみや乱れ、血の固まりやすさ。【全文】[Wiki-Thrombus]
- 写真の参考：静脈カテーテルの表面で、フィブリンの網に赤血球がからまった走査電顕（下の表、CDC）。赤血球は中央のくぼんだ円盤のまま見え、フィブリンは不規則なかたまりにも見える。【全文】（Commons の説明文）

## 9. 単球と白血球の動き

- 単球は1〜3日血液を巡り、その後、組織へ入ってマクロファージや樹状細胞になる。【全文】[Wiki-Monocyte]
- 核は楕円で、くびれて豆形・腎臓形に見えることが多い。細胞質が広く、小胞（中で異物を処理する袋）が多い。【全文】[Wiki-Monocyte]
- 白血球が血管の外へ出る順序：①化学物質に呼ばれる → ②転がる（内皮のセレクチンと、白血球の糖鎖が付いては離れ、面ファスナーのように減速）→ ③しっかり付く → ④内皮を通り抜ける。【全文】[Wiki-Extrav]
- 転がる速さ（マウス精巣挙筋の細静脈、主に好中球）：P-セレクチンで 約40 µm/s、L-セレクチンで 約130 µm/s、E-セレクチンでは 3〜7 µm/s とゆっくり。【抜粋】（マウス、白血球一般。単球・動脈での値は【未確認】）
- 一部の単球は、炎症のない内皮の上を長い距離**這って見回る**（パトロール）。【要旨】[Auffray2007]（マウス）　ヒトでも見回りが示されている。【全文】[Wiki-Monocyte]
  這う速さ：【未確認】

## 10. 生きた組織の色（染色の色は使わない）

- 血液：酸素と結びついたヘモグロビンでは明るい赤、離れると暗い赤。【全文】[Wiki-Blood]　動脈血の酸素飽和度 98〜99%、静脈血 約75%。【全文】[Wiki-Blood]
- 血漿：淡い琥珀色〜黄色（ビリルビン・カロテノイドなどによる）。高コレステロールの人の血漿は白く濁る写真がある。【全文】[Wiki-Plasma]
- 正常な動脈の内面：**白い**（血管内視鏡で「正常な白い壁」）。安定した病変も白くなめらか。【全文】[deFeyter1995]
- プラーク：黄色（脂質のカロテン）。強い黄色ほど危険とされる。白いものもある。【全文】[deFeyter1995]【要旨】[Takano2010]
- 脂肪線条：ふぞろいな黄白色。【全文】[Wiki-FS]
- 血栓：赤色血栓は赤、白色血栓は白っぽい。ツァーンの線は灰色がかった赤に明暗の縞。【全文】[Wiki-Thrombus][Wiki-Zahn]
- 内皮細胞：無色透明（台帳 `endothelial`）。
- 平滑筋・外膜・静脈の弁の帆の生きた色：【未確認】（外科の写真では、静脈の弁は薄く半透明に見えると言われるが、出所を確かめていない）
- 皮膚の上から静脈が青く見えるのは、いくつかの理由が重なった見え方。【全文】[Wiki-Vein]　血管の中の血は青くない。

## 11. 参考画像（Wikimedia Commons）

画像そのものは見ていない。説明ページのライセンスと作者と説明文だけを確かめた。

| ファイル | 内容 | ライセンス | 作者 |
|---|---|---|---|
| https://commons.wikimedia.org/wiki/File:Blood_clot_in_scanning_electron_microscopy.jpg | 血管内カテーテルの内面で、フィブリンの網にからまった赤血球（走査電顕、2,858倍） | PD（作者による） | Janice Carr（CDC） |
| https://commons.wikimedia.org/wiki/File:SEM_blood_cells.jpg | ヒトの血液の走査電顕：赤血球・血小板・白血球 | PD（米国政府） | Bruce Wetzel, Harry Schaefer（National Cancer Institute） |
| https://commons.wikimedia.org/wiki/File:Atherosclerosis,_aorta,_gross_pathology_PHIL_846_lores.jpg | 解剖で取り出した大動脈の重い動脈硬化（肉眼。固定標本） | PD（米国政府 CDC） | CDC PHIL 846 |
| https://commons.wikimedia.org/wiki/File:Histopathology_of_progressive_atherosclerotic_lesions.jpg | 病変の進み方：内膜の肥厚 → 線維性の膜をもつ粥腫（壊死した芯）→ 石灰化（H&E 染色。形と層の比率だけ参考に） | CC BY 4.0 | Yang WJ ほか（Front Neurol 2017） |
| https://commons.wikimedia.org/wiki/File:Histopathology_of_cholesterolosis,_with_annotated_foam_cell.jpg | 泡沫細胞（胆のうの例。染色標本。泡のような細胞の形だけ参考に） | CC BY 4.0 | K C Geetika, Talwar OP（原図）、Mikael Häggström（注記） |
| https://commons.wikimedia.org/wiki/File:Monocyte_(cell).jpg | 単球（染色した血液標本） | CC0 | Makysm |
| https://commons.wikimedia.org/wiki/File:Gray448.png | 小さな動脈と静脈の断面（内皮・内弾性板・中膜・外膜。Gray 解剖学の図） | PD（古い図） | Henry Gray／Henry Vandyke Carter |
| https://commons.wikimedia.org/wiki/File:Venous_valve.svg | 静脈の弁の模式図 | PD（作者による） | Was a bee |
| https://commons.wikimedia.org/wiki/File:Blausen_0055_ArteryWallStructure.png | 動脈の壁の構造の図解 | CC BY 3.0 | BruceBlaus（Blausen Medical） |
| https://commons.wikimedia.org/wiki/File:Blausen_0053_Artery_NormalvsDiseasedVessel.png | 正常な動脈と血栓のある病んだ動脈の比較図 | CC BY 3.0 | BruceBlaus |
| https://commons.wikimedia.org/wiki/File:Atherosclerosis_2011.jpg | 動脈硬化の図解 | PD（米国政府） | NHLBI（NIH） |

除外したもの（CC BY-SA、または不明のため）：`File:Red_Blood_Cells_In_Clot.png`（CC BY-SA 4.0）、`File:Фибриновый_сгусток_в_крови,_сканирующая_электронная_микроскопия..jpg`（CC BY-SA 3.0）、`File:Pulmonary_thromboembolus,_recent_(3626658803).jpg`（ツァーンの線、CC BY-SA 2.0、Yale Rosen）、`File:Fibrous_cap.webp`（CC BY-SA 4.0）、`File:IVUS_of_CAD.png`（血管内エコー、CC BY-SA 2.5）、`File:Venous_valve_00013.gif`（弁が開閉する超音波の動画。ライセンスの記載を確かめられず）。
見つからなかったもの：PD/CC0/CC BY の血管内エコー・光干渉断層（OCT）・血管内視鏡の画像、正常な冠動脈の生体のカラー写真、単球の走査電顕、静脈の弁の生体写真。【未確認】

---

## 12. ゲームの「患者の変化」の案（ブリーフに指定なし）

いずれも穏やかで、資料に沿う変化。病名は出さない。次のステージが心臓なので、胸の症状（心電図）は心臓に残し、ここでは**手足の末端**を使う案を先にした。

1. **「冷えて青白かった足先に温かさと血色が戻り、足の甲の脈がはっきり触れるようになる」**（第1案）
   - 根拠：脚の動脈が狭くなる病気（末梢動脈疾患）では、皮膚が冷たい・青みがかる、足の脈が弱いか触れない、足の指の冷えやしびれ、歩くと脚が痛み休むと治まる（間欠性跛行）。【全文】[Wiki-PAD][Wiki-IC]
     血栓やかけらが下流の細い枝をふさぐと、その先の組織への血流が失われる。【全文】[Wiki-Atheroma]
   - 描き方：プラークと血栓を取り除き流れが戻る → 窓の中で、患者の足先に赤みが差し、指先の脈（拍動の波形）が戻る。「歩いても脚が痛まない」を添えてもよい。
2. **「脚のむくみと重だるさが引く」**（静脈の弁を直す場面を入れる場合）
   - 根拠：静脈の弁が閉じなくなると、静脈の圧が上がり、立ったときに脚がむくみ、静脈瘤ができる。弁のところは血栓のできやすい場所でもある。【全文】[Bazigou2013][Wiki-Thrombus]
   - 描き方：弁の帆が再びぴたりと閉じ、逆流が止まる → 患者のふくらはぎのむくみが引く。
- 避けること：「血圧が下がる」「脈拍が整う」は、プラークや血栓を取り除いた直接の結果としては確かめていない。言い切らない。【未確認】
- 実際の治療でプラークが縮むのは2年で 約1%（第7-2節）。「取り除く」はゲームの演出。

---

## 13. 特に確かめられなかった点（まとめ）

- 正常なヒト冠動脈の**内膜と外膜の厚み**（中膜 約0.2 mm だけ確認。内膜は「0.5 mm 以上で動脈硬化」という定義からの推定のみ）。
- 冠動脈の内腔の値（Dodge 1992）は原著を読めず、抜粋のみ。
- 中くらいの動脈・細動脈・静脈の血流の速さ（大動脈・毛細血管・大静脈だけ確認）。
- 単球の、浮いた状態の大きさ、内皮の上を這う速さ・転がる速さ（ヒト・動脈で）。
- 泡沫細胞の大きさ（マクロファージは 約21 µm【全文】[Wiki-Macrophage]。泡沫細胞の実測は未確認）。
- コレステロールの結晶の形と大きさ。
- フィブリンの繊維の太さの範囲（約100 nm の代表値のみ）。
- 静脈の弁の帆の厚み・長さ、生きた色。
- 平滑筋・外膜・糖の層の生体での色。
- ヒトの動脈での「細胞のいない層」の厚み（ラットの細動脈と、ヒト網膜の模型のみ）。

## 14. 資料間で食い違った数値（まとめ）

- 単球の直径：15〜22 µm［Wiki-Monocyte］／15〜30 µm［Wiki-WBC の表］。どちらも標本の値と思われる。代表値は 15〜20 µm とする。
- LDL：22〜27.5 nm［Wiki-LDL］／20〜25 nm［Wiki-Lipoprotein］。別の研究では小さい LDL を 19.0〜20.5 nm、大きい LDL を 20.6〜22 nm とする。【全文】[Wiki-LDL]　代表値は 約20〜25 nm。
- HDL：5〜17 nm［Wiki-HDL］／10〜20 nm［Wiki-Lipoprotein］。
- 毛細血管の太さ：5〜10 µm［Wiki-Capillary］／5〜8 µm［Wiki-Micro］／約5 µm［Wiki-BV］。
- 毛細血管の速さ：0.3 mm/s（教科書の表）／0.9 ± 0.4 mm/s（爪の根もとの実測）。
- 糖の層：毛細血管 0.2〜0.5 µm、小動脈 2〜3 µm、頸動脈 4.5 µm（太い血管で厚いという測定）と、マウス頸動脈 0.4 µm（同じ総説の中で、測り方により異なる）。

---

## 出所一覧

論文・総説
- [Konishi2023] Konishi T ほか, Virmani R, Finn AV. The histological analysis of the coronary medial thickness: implications for percutaneous coronary intervention. PLoS One 2023;18:e0283840. https://pmc.ncbi.nlm.nih.gov/articles/PMC10065270/ （本文、CC BY 4.0）
- [Dodge1992] Dodge JT Jr, Brown BG, Bolson EL, Dodge HT. Lumen diameter of normal human coronary arteries. Circulation 1992;86:232–246. （数値は検索結果の抜粋のみ）
- [Tuzcu2001] Tuzcu EM ほか. High prevalence of coronary atherosclerosis in asymptomatic teenagers and young adults: evidence from intravascular ultrasound. Circulation 2001;103:2705–2710. https://pubmed.ncbi.nlm.nih.gov/11390341/ （要旨）
- [Chen2013] Chen H ほか, Kassab GS. Microstructural constitutive model of active coronary media. Biomaterials 2013;34:7575–7583. https://pmc.ncbi.nlm.nih.gov/articles/PMC4012690/ （本文、ブタ）
- [Vink1996] Vink H, Duling BR. Identification of distinct luminal domains for macromolecules, erythrocytes, and leukocytes within mammalian capillaries. Circ Res 1996;79:581–589. https://pubmed.ncbi.nlm.nih.gov/8781491/ （要旨、ハムスター）
- [Reitsma2007] Reitsma S ほか. The endothelial glycocalyx: composition, functions, and visualization. Pflugers Arch 2007;454:345–359. https://pmc.ncbi.nlm.nih.gov/articles/PMC1915585/ （本文）
- [Kim2007] Kim S, Kong RL, Popel AS, Intaglietta M, Johnson PC. Temporal and spatial variations of cell-free layer width in arterioles. Am J Physiol Heart Circ Physiol 2007;293:H1526–1535. https://pubmed.ncbi.nlm.nih.gov/17526647/ （要旨、ラット）
- [Ebrahimi2024] Ebrahimi S ほか. A high-fidelity computational model for predicting blood cell trafficking and 3D capillary hemodynamics in retinal microvascular networks. Invest Ophthalmol Vis Sci 2024;65(13):37. https://pubmed.ncbi.nlm.nih.gov/39546289/ （要旨、模型）
- [Aguiar2006] Aguiar T ほか, Bouskela E. Nailfold videocapillaroscopy in primary Sjögren's syndrome. Angiology 2006;57:593–599. https://pubmed.ncbi.nlm.nih.gov/17067982/ （要旨。健康な対照群の値を使った）
- [RVASC2010] The Reference Values for Arterial Stiffness' Collaboration. Determinants of pulse wave velocity in healthy people and in the presence of cardiovascular risk factors: 'establishing normal and reference values'. Eur Heart J 2010;31:2338–2350. https://pmc.ncbi.nlm.nih.gov/articles/PMC2948201/ （本文、表4）
- [Davies2009] Davies PF. Hemodynamic shear stress and the endothelium in cardiovascular pathophysiology. Nat Clin Pract Cardiovasc Med 2009;6:16–26. https://pmc.ncbi.nlm.nih.gov/articles/PMC2851404/ （本文）
- [Lurie2003] Lurie F, Kistner RL, Eklof B, Kessler D. Mechanism of venous valve closure and role of the valve in circulation: a new concept. J Vasc Surg 2003;38:955–961. https://pubmed.ncbi.nlm.nih.gov/14603200/ （要旨）
- [Bazigou2013] Bazigou E, Makinen T. Flow control in our vessels: vascular valves make sure there is no way back. Cell Mol Life Sci 2013;70:1055–1066. https://pmc.ncbi.nlm.nih.gov/articles/PMC3578722/ （本文）
- [Ference2017] Ference BA ほか. Low-density lipoproteins cause atherosclerotic cardiovascular disease. 1. Evidence from genetic, epidemiologic, and clinical studies. A consensus statement from the European Atherosclerosis Society Consensus Panel. Eur Heart J 2017;38:2459–2472. https://pubmed.ncbi.nlm.nih.gov/28444290/ （要旨）
- [Ho2023] Ho TWW, Henry A, Lee WL. LDL transcytosis by the arterial endothelium—atherosclerosis by a thousand cuts? Curr Atheroscler Rep 2023;25:457–465. https://pubmed.ncbi.nlm.nih.gov/37358804/ （要旨）
- [Williams1998] Williams KJ, Tabas I. The response-to-retention hypothesis of atherogenesis reinforced. Curr Opin Lipidol 1998;9:471–474. https://pubmed.ncbi.nlm.nih.gov/9812202/ （要旨）
- [Heinecke2003] Heinecke JW. Clinical trials of vitamin E in coronary artery disease: is it time to reconsider the low-density lipoprotein oxidation hypothesis? Curr Atheroscler Rep 2003;5:83–87. https://pubmed.ncbi.nlm.nih.gov/12573190/ （要旨）
- [Allahverdian2014] Allahverdian S ほか, Francis GA. Contribution of intimal smooth muscle cells to cholesterol accumulation and macrophage-like cells in human atherosclerosis. Circulation 2014;129:1551–1559. https://pubmed.ncbi.nlm.nih.gov/24481950/ （要旨）
- [Sakamoto2022] Sakamoto A ほか, Virmani R, Finn AV. Vulnerable plaque in patients with acute coronary syndrome: identification, importance, and management. US Cardiol Rev 2022;16:e01. https://pmc.ncbi.nlm.nih.gov/articles/PMC11588187/ （本文、CC BY-NC）
- [Abela2023] Abela GS ほか. Cholesterol crystals induce mechanical trauma, inflammation, and neo-vascularization in solid cancers as in atherosclerosis. Am Heart J Plus 2023;35:100317. https://pmc.ncbi.nlm.nih.gov/articles/PMC10655498/ （本文）
- [Nicholls2011] Nicholls SJ ほか. Effect of two intensive statin regimens on progression of coronary disease (SATURN). N Engl J Med 2011;365:2078–2087. https://pubmed.ncbi.nlm.nih.gov/22085316/ （要旨）
- [deFeyter1995] de Feyter PJ ほか, Roelandt JRTC. Ischemia-related lesion characteristics in patients with stable or unstable angina: a study with intracoronary angioscopy and ultrasound. Circulation 1995;92:1408–1413. https://repub.eur.nl/pub/5071/ （本文 PDF）
- [Takano2010] Takano M, Mizuno K. Coronary angioscopic evaluation for serial changes of luminal appearance after pharmacological and catheter interventions. Circ J 2010;74:240–245. https://pubmed.ncbi.nlm.nih.gov/20019412/ （要旨）
- [Ishibashi2007] Ishibashi F ほか. High yellow color intensity by angioscopy with quantitative colorimetry to identify high-risk features in culprit lesions of patients with acute coronary syndromes. Am J Cardiol 2007;100:1207–1211. https://pubmed.ncbi.nlm.nih.gov/17920358/ （題名と書誌のみ確認）
- [J Invasive Cardiol 2006] 急性冠症候群の血管内視鏡研究（黄色の段階 0〜3 の定義）. J Invasive Cardiol 2006;18:220–224. https://pubmed.ncbi.nlm.nih.gov/16670449/ （要旨）
- [Silvain2011] Silvain J ほか, Weisel JW, Montalescot G. Composition of coronary thrombus in acute myocardial infarction. J Am Coll Cardiol 2011;57:1359–1367. https://pmc.ncbi.nlm.nih.gov/articles/PMC3071619/ （本文）
- [Cines2014] Cines DB ほか, Weisel JW. Clot contraction: compression of erythrocytes into tightly packed polyhedra and redistribution of platelets and fibrin. Blood 2014;123:1596–1603. https://pmc.ncbi.nlm.nih.gov/articles/PMC3945867/ （要旨）
- [Ramanujam2024] Ramanujam RK ほか, Weisel JW. Rupture mechanics of blood clots: influence of fibrin network structure on the rupture resistance. Acta Biomater 2024. https://pmc.ncbi.nlm.nih.gov/articles/PMC12068891/ （本文）
- [Undas2011] Undas A, Ariëns RA. Fibrin clot structure and function: a role in the pathophysiology of arterial and venous thromboembolic diseases. Arterioscler Thromb Vasc Biol 2011;31:e88–99. https://pubmed.ncbi.nlm.nih.gov/21836064/ （要旨）
- [Auffray2007] Auffray C ほか. Monitoring of blood vessels and tissues by a population of monocytes with patrolling behavior. Science 2007;317:666–670. https://pubmed.ncbi.nlm.nih.gov/17673663/ （要旨、マウス）
- 白血球の転がる速さ（マウス）：PMC の論文群の検索結果の抜粋のみ（https://pmc.ncbi.nlm.nih.gov/articles/PMC2851240 ほか）。
- 血管内視鏡の白色／赤色血栓の説明：Springer の章（https://rd.springer.com/chapter/10.1007/978-4-431-55546-9_6）の抜粋のみ。

Wikipedia（英語版）
[Wiki-Artery] https://en.wikipedia.org/wiki/Artery ／ [Wiki-BV] https://en.wikipedia.org/wiki/Blood_vessel ／ [Wiki-Intima] https://en.wikipedia.org/wiki/Tunica_intima ／
[Wiki-Media] https://en.wikipedia.org/wiki/Tunica_media ／ [Wiki-Externa] https://en.wikipedia.org/wiki/Tunica_externa ／ [Wiki-IEL] https://en.wikipedia.org/wiki/Internal_elastic_lamina ／
[Wiki-MuscArt] https://en.wikipedia.org/wiki/Muscular_artery ／ [Wiki-Micro] https://en.wikipedia.org/wiki/Microcirculation ／ [Wiki-Capillary] https://en.wikipedia.org/wiki/Capillary ／
[Wiki-Vein] https://en.wikipedia.org/wiki/Vein ／ [Wiki-Hemo] https://en.wikipedia.org/wiki/Hemodynamics ／ [Wiki-PWV] https://en.wikipedia.org/wiki/Pulse_wave_velocity ／
[Wiki-Pulse] https://en.wikipedia.org/wiki/Pulse ／ [Wiki-BP] https://en.wikipedia.org/wiki/Blood_pressure ／ [Wiki-Blood] https://en.wikipedia.org/wiki/Blood ／
[Wiki-Plasma] https://en.wikipedia.org/wiki/Blood_plasma ／ [Wiki-WBC] https://en.wikipedia.org/wiki/White_blood_cell ／ [Wiki-Monocyte] https://en.wikipedia.org/wiki/Monocyte ／
[Wiki-Neutrophil] https://en.wikipedia.org/wiki/Neutrophil ／ [Wiki-Lympho] https://en.wikipedia.org/wiki/Lymphocyte ／ [Wiki-Macrophage] https://en.wikipedia.org/wiki/Macrophage ／
[Wiki-Platelet] https://en.wikipedia.org/wiki/Platelet ／ [Wiki-Lipoprotein] https://en.wikipedia.org/wiki/Lipoprotein ／ [Wiki-LDL] https://en.wikipedia.org/wiki/Low-density_lipoprotein ／
[Wiki-HDL] https://en.wikipedia.org/wiki/High-density_lipoprotein ／ [Wiki-Fibrinogen] https://en.wikipedia.org/wiki/Fibrinogen ／ [Wiki-Fibrin] https://en.wikipedia.org/wiki/Fibrin ／
[Wiki-Thrombus] https://en.wikipedia.org/wiki/Thrombus ／ [Wiki-Zahn] https://en.wikipedia.org/wiki/Lines_of_Zahn ／ [Wiki-Athero] https://en.wikipedia.org/wiki/Atherosclerosis ／
[Wiki-Atheroma] https://en.wikipedia.org/wiki/Atheroma ／ [Wiki-VP] https://en.wikipedia.org/wiki/Vulnerable_plaque ／ [Wiki-Cap] https://en.wikipedia.org/wiki/Fibrous_cap ／
[Wiki-Foam] https://en.wikipedia.org/wiki/Foam_cell ／ [Wiki-FS] https://en.wikipedia.org/wiki/Fatty_streak ／ [Wiki-SM] https://en.wikipedia.org/wiki/Smooth_muscle ／
[Wiki-Endo] https://en.wikipedia.org/wiki/Endothelium ／ [Wiki-Extrav] https://en.wikipedia.org/wiki/Leukocyte_extravasation ／ [Wiki-PAD] https://en.wikipedia.org/wiki/Peripheral_artery_disease ／
[Wiki-IC] https://en.wikipedia.org/wiki/Intermittent_claudication ／ [Wiki-CAD] https://en.wikipedia.org/wiki/Coronary_artery_disease

## 形の仕様書の一覧（atlas/）

- `atlas/artery_wall.md` 動脈の壁（内膜・内弾性板・中膜・外膜）
- `atlas/smooth_muscle_cell.md` 平滑筋細胞
- `atlas/monocyte.md` 単球
- `atlas/foam_cell.md` 泡沫細胞
- `atlas/ldl.md` LDL
- `atlas/fibrin.md` フィブリン（と血栓）
- `atlas/plaque.md` プラーク
- `atlas/vein_valve.md` 静脈の弁
- 既存：`atlas/rbc.md` `atlas/endothelial_cell.md` `atlas/platelet.md` `atlas/neutrophil.md`
