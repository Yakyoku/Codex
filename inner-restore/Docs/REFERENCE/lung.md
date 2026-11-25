# 肺（ステージ3）の資料

調査日：2026-11-25。ステージ3「肺」に登場させるもの（気管支の樹、ぶどうの房のような肺胞、沈着した粒子、ガス交換、呼吸に合わせて変わる流れと地形）の、実際の構造・大きさ・動き・見え方・不調の仕組みをまとめた。
対象ごとの「形の仕様書」は `atlas/` にある（末尾の一覧を参照）。台帳の下書きは `atlas_lung_draft.json`。

## この文書の読み方

各記述の末尾に、確かめ方の印を付けた（`eye.md`・`nose.md` と同じ）。

- 【全文】… 資料の本文を取得して、該当箇所を自分で読んだ。
- 【要旨】… 論文の要旨（アブストラクト）だけを読んだ。本文は読めていない。
- 【抜粋】… 検索結果に出た抜粋だけで確認した。本文は読めていない。採用前に再確認が望ましい。
- 【計算】… 資料の数値から、この文書の中で計算した値。資料に直接は書かれていない。
- 【未確認】… 今回の調査では出所を確かめられなかった。事実として使わないこと。

調査の制約：
- PubMed の要旨と PubMed Central（PMC）のオープンアクセス本文は、NCBI の公開 API（E-utilities）で取得した。Wikipedia は本文を取得できた（要約つきの取得。数値は原文の引用で確かめた）。
- Wikipedia／Wikimedia Commons の API は途中から回数制限（429）がかかった。Commons はファイルの説明ページ（ライセンス・作者）だけを読み、**画像そのものは今回1枚も見ていない**（【画像】の印はない）。
- NCBI Bookshelf（StatPearls）と一部の教科書サイトは自動取得を拒否された（403）。呼吸数・1回換気量・赤血球の通過時間は抜粋か二次資料に頼っている。
- 肺胞の中を生きたまま撮った研究は、ほとんどがマウス。ヒトの値ではないものには「（マウス）」と書いた。

---

## 1. 全体の構造：気道の木

- 気管から肺胞までの枝分かれは、平均 **23 世代**。各世代で枝がおよそ2本ずつに分かれ、末端は 2²³ ≒ 約 800万本の「肺胞嚢」になる。実際の世代数は場所により **約18〜30** と幅がある。【全文】[Hsia2016]
- 前半 **約14〜16世代** は空気を運ぶだけの「導管部」。その先の **約8世代** が、壁に肺胞が付いた「呼吸部」（細葉＝アシナス）。【全文】[Hsia2016]　Wikipedia でも、導管部は第1〜16分岐、肺胞が現れるのは第16〜23分岐とする。【全文】[Wiki-Bronchiole]
- ヒトの肺には細葉が **約3万個**。【全文】[Hsia2016][Knudsen2018]　→ 1細葉あたりの肺胞は 約1万6千個。【計算】（4.8億 ÷ 3万）
- 移り変わりはなだらか。滑らかだった細気管支の壁に、肺胞が1〜2個ぽつりと現れる所（移行細気管支）が細葉の入口。そこから約3世代の**呼吸細気管支**で壁の肺胞が増え、やがて全周が肺胞で囲まれた**肺胞道**になる。【全文】[Hsia2016]
- 気道の太さ（Weibel のモデル、平均値）：【全文】[Hsia2016]（表3・表4）

| 世代 | 名前の目安 | 直径 | 長さ |
|---|---|---|---|
| 0 | 気管 | 18 mm | 120 mm |
| 1 | 主気管支 | 12.2 mm | 47.6 mm |
| 8 | 小さな気管支 | 1.86 mm | 6.4 mm |
| 12 | 細気管支 | 0.95 mm | 3.3 mm |
| 15〜16 | 終末細気管支のあたり | 0.50 mm | 1.3〜1.4 mm |
| 17〜19 | 呼吸細気管支 | 0.49〜0.38 mm | 0.8〜1.1 mm |
| 20〜22 | 肺胞道 | 0.36〜0.31 mm | 0.70 mm |
| 23 | 肺胞嚢 | 0.29 mm | 0.70 mm |

  - 細葉の中では、世代ごとの太さはあまり変わらない（0.50 → 0.29 mm）。【全文】[Hsia2016]
  - Wikipedia：細気管支は直径 約1 mm 以下、終末細気管支は 0.5 mm 以下、呼吸細気管支は 0.5 mm。1本の細気管支から終末細気管支が 50〜80本。【全文】[Wiki-Bronchiole]
  - 細気管支の壁には軟骨がなく、平滑筋の層が取り巻く。【全文】[Wiki-Bronchiole]
- **空気の流れの速さ**：安静時の吸気で、気管 約1 m/秒、1次の呼吸細気管支では **1 cm/秒未満**。断面積の合計が奥ほど増える（第23世代で 7,530 cm²）ため、100倍以上遅くなる。運動時は最大で10倍速い。【全文】[Hsia2016]
- 細葉の奥では、空気は「流れ」ではなく**拡散**（分子がばらばらに広がる動き）で進む。流れから拡散に切り替わる場所は、安静時で 第18世代 あたり、運動時は 第21世代 あたりまで奥へずれる。【全文】[Hsia2016]（図66の説明文）
  → ゲームでは「入口の細気管支は風が強く、肺胞の中はほとんど風がない」と描くのが実際に近い。

ゲーム内の尺度の目安（主人公 2 µm、髪の毛 約70〜80 µm、赤血球 約7.8 µm）：

| もの | 大きさ | 比べると |
|---|---|---|
| 終末細気管支の直径 | 約 0.5 mm 以下 | 髪の毛 約6〜7本分【計算】 |
| 肺胞道・肺胞嚢の直径 | 約 0.3 mm | 髪の毛 約4本分【計算】 |
| 肺胞1個 | 直径 約 200 µm（200〜500 µm とする資料も） | 髪の毛 約2.5〜3本分、主人公 約100人分【計算】 |
| 血液と空気を隔てる壁 | 薄い所 0.2〜0.6 µm | 主人公の身長の 約10分の1〜3分の1【計算】 |
| 毛細血管の太さ | 約 5〜7 µm（資料により 3〜10 µm） | 赤血球とほぼ同じ |
| I型肺胞上皮細胞 | 1個で 約 5,000 µm² を覆う | 直径 約 80 µm の円と同じ面積【計算】 |
| II型肺胞上皮細胞 | 一辺 約 9〜10 µm の立方体に近い | 赤血球 約1個分【計算】 |
| 肺胞マクロファージ | 直径 約 21 µm（浮かせて測った値） | 赤血球 約2.7個分、主人公 約10人分【計算】 |
| 層板小体（サーファクタントの包み） | 直径 約 1 µm | 主人公の半分ほど【計算】 |
| PM2.5 | 直径 2.5 µm 以下 | 赤血球の 約3分の1以下【計算】 |

---

## 2. 細気管支：粘液線毛エスカレーターの終わりと、クラブ細胞

- 細気管支の上皮は、はじめ「線毛のある単層円柱上皮」。終末細気管支では「線毛のある単層立方上皮」になり、クラブ細胞を含む。呼吸細気管支も線毛のある立方上皮に、線毛のないクラブ細胞が混じる。【全文】[Wiki-Bronchiole]
- 細い気道（第6世代以降）では、線毛細胞が上皮の 73% を占める（気管では 47%）。線毛の長さは上気道で 6〜7 µm、細い気道で 約 4 µm。【全文】[Tilley2015]
- 杯細胞（粘液をつくる細胞）は奥へ行くほど減り、代わりにクラブ細胞が増える。【全文】[Wiki-ClubCell]　→ 粘液の層は奥ほど薄くなると考えられるが、細気管支での厚みの数値は【未確認】。
- **粘液線毛エスカレーター**：線毛の上の粘液が、吸いこんだ粒子や微生物を捕まえて喉の方へ運ぶ。【全文】[Tilley2015]　気道（線毛のある所）に付いた水に溶けない粒子は、数時間で運び出される。【要旨】[Pavia1991]
- **肺胞には線毛がない**。肺胞に付いた水に溶けない粒子は主にマクロファージが片付け、その速さは非常に遅く、生体での半減期は **数か月**。【要旨】[Pavia1991]　マクロファージによる除去は「数週間から数年」とする論文もある。【全文】[Detampel2019]
  - 粒子を食べたマクロファージの出口は、①近くの細気管支まで移動してエスカレーターに乗る、②肺の組織の中へ入りリンパ管へ、の2つが挙げられている。【抜粋】　「マクロファージに入った粒子は粘液線毛の道で肺を出る」との記述。【全文】[Detampel2019]
  → ゲームでは「肺胞の奥は掃除の流れが届かない場所。マクロファージが粒子を抱えて、線毛の森（細気管支）の入口まで運ぶ」という構図が実際に近い。

### クラブ細胞（旧名クララ細胞）
- 立方形で、内腔に向いた面が**ふくらんで（ドーム状に）出っぱる**。線毛はなく、粘液もつくらない。【全文】[Rokicki2016]　Wikipedia では「低い円柱〜立方形で、短い微絨毛を持つ」。【全文】[Wiki-ClubCell]
- 頭の側に滑面・粗面小胞体とミトコンドリアが多い。直径 約 0.3 µm の濃い顆粒を 1細胞に 約6個 持つ。核は細胞の 約30% を占め、しわが多い。【全文】[Rokicki2016]
  ※ 顆粒が「基底膜の近く（底の側）」にあると書かれているが、一般には頭の側に多いとされる。食い違いの可能性あり。【未確認】
- ヒトの気道上皮細胞の 約9%。気管・主気管支・葉気管支・区域気管支にはほとんどおらず、11〜22% が終末細気管支にいる。【全文】[Rokicki2016]
- 働き：保護たんぱく CC16（ウテログロビン）などを分泌する。シトクロム P-450 という酵素で、吸いこんだ有害物質（たばこの煙の成分、オゾンなど）を分解する。自分自身と線毛細胞のもとになる（前駆細胞）。【全文】[Rokicki2016][Wiki-ClubCell]
- サーファクタントに似た成分の液を出し、上から来た粘液の分解を助ける。【全文】[Wiki-ClubCell]
- 細胞の高さ・幅の実測値：【未確認】

---

## 3. 肺胞道・肺胞嚢・肺胞（ぶどうの房）

- 肺胞道は、呼吸細気管支から分かれる枝。1本の細気管支（呼吸細気管支）から 2〜11本、1本の肺胞道は 5〜6個の肺胞嚢に開き、肺胞嚢には肺胞が房のように集まって開く。【全文】[Wiki-Alveolus]
- **肺胞道には自分の壁がない**。「壁」は肺胞の入口の輪が並んだ網そのもの。入口の輪には弾性線維・コラーゲン線維と平滑筋が集まり、肺胞道をばねのように巻いている。【全文】[Knudsen2018]
  → 見た目：中央の通路（肺胞道）の周りに、丸い入口がびっしり開いた筒。入口の縁がやや太い輪になる。
- **数**：成人の肺6例で平均 **4.8億個**（2.74億〜7.9億個、肺が大きいほど多い）。【要旨】[Ochs2004]　Wikipedia（肺）では 3億〜5億個。【全文】[Wiki-Lung]
- **大きさ**：1個の体積は平均 4.2×10⁶ µm³（3.3〜4.8×10⁶ µm³）で、肺の大きさにかかわらずほぼ一定。肺組織 1 mm³ に約170個。【要旨】[Ochs2004]
  → 同じ体積の球なら直径 約 **200 µm**（185〜209 µm）。【計算】
  Wikipedia は直径 200〜500 µm とする。【全文】[Wiki-Alveolus]　感染モデル研究の文献値は半径 116.5 µm（直径 約 233 µm）。【全文】[Blickensdorf2019]
- 形：完全な球ではなく、入口の開いた「4分の3球」や「切り取った球」として扱われる。【全文】[Pollmacher2015][Chang2015]　隣の肺胞と壁（肺胞中隔）を共有し、多面体に近い形で押し合う。【未確認】（教科書的な記述。今回の資料では数値で確かめていない）
- **表面積**：電子顕微鏡で測ると 約 **130 m²**（若い成人7人、±12）。光学顕微鏡による古い値（教科書によくある 70〜80 m²）は表面のこまかな凹凸を拾えておらず小さい。【全文】[Hsia2016]
  Wikipedia（肺胞）は 70〜80 m²、Wikipedia（肺）は 50〜75 m² と 70〜145 m² を併記。Knudsen は 約140 m²。【全文】[Wiki-Alveolus][Wiki-Lung][Knudsen2018]
  - 生きた肺では表面の液の層の下に隠れる部分があり、「空気に出ている面」は 68〜88 m²。【全文】[Hsia2016]
- 肺の体積の 約90% が肺胞のある部分（実質）。本物の組織は 10% 未満（数百 g）。【全文】[Knudsen2018]

---

## 4. 肺胞の壁と、血液と空気を隔てる壁（血液空気関門）

- 肺胞と肺胞の間の壁（**肺胞中隔**）の中に毛細血管の網があり、その両面を肺胞の上皮が覆う。上皮と毛細血管の内皮のあいだに、厚さの変わる「間質」がある。【全文】[Knudsen2018]
- 壁には**薄い側**と**厚い側**がある。薄い側では上皮と内皮が1枚の基底膜を共有し、間質はほぼない（1 µm を大きく下回る）。厚い側にはコラーゲン線維・弾性線維・線維芽細胞・細胞の核がある。ヒトでは壁の面の 約半分が薄い側。【全文】[Knudsen2018][Hsia2016]
- **厚さ**：
  - 組織の壁（上皮＋間質＋内皮）：算術平均 2.2 µm、調和平均（拡散のしやすさを表す平均）**0.62 µm**。【全文】[Hsia2016]（表1）
  - 血漿の層まで含めた全体の調和平均：1.11 µm。【全文】[Hsia2016]
  - Wikipedia：膜全体は 最も薄い所 **0.2 µm**〜厚い所 0.6 µm。【全文】[Wiki-Alveolus]
  - Hsia は「最も薄い所でわずか 0.3 µm」とも書く。【全文】[Hsia2016]　Knudsen は「拡散の壁 約 2 µm」（算術平均の意味）。【全文】[Knudsen2018]
  → **「薄い所 0.2〜0.6 µm、平均すると 約 2 µm」**と覚えるのが安全。【計算】
- 上皮の表面は、厚さ 約 200 nm（ラット）の液の層で覆われ、空気に直接さらされていない。液の層は「水の層（下相）」と、その表面の「サーファクタントの膜」からなる。【全文】[Knudsen2018]

---

## 5. 毛細血管とガス交換

- 肺胞中隔の毛細血管は、短く太い区間が網目につながり、「**柱の立った平たい血の層（シート）**」のように働く。柱（ポスト）の中に結合組織が通る。【全文】[Muhlfeld2021][Hsia2016]
  区間の長さは太さと同じくらいで、長さで数えることには意味がないとされる。【全文】[Muhlfeld2021]
- 毛細血管の網は肺胞の面積の 約70% を覆う。【全文】[Wiki-Alveolus]
- 毛細血管の表面積 約 115 m²、容積 約 194 mL（成人）。【全文】[Hsia2016]
  → 円柱とみなすと平均の太さは 約 6.7 µm。【計算】（直径 ≒ 4×容積÷表面積）
  資料の幅：3〜5 µm、5〜10 µm、3〜10 µm、モデル値 6.75 µm。【抜粋】
- 赤血球（直径 約7.8 µm）は毛細血管とほぼ同じ太さなので、原則として**1列**で通る。ただし細かな網の中を曲がりくねって進み、決まった道筋を「かたまり（小包）」になって流れる。【全文】[Hsia2016]
  一直線の管を1列で、というより「網目から網目へ転がるように」流れる、という見方もある。【全文】[Hsia2016]
- **通過時間**：安静時、赤血球が肺の毛細血管にいる時間は 約 **0.75 秒**。【全文】[BioNumbers101731]（原典 Nunn『Applied Respiratory Physiology』1993 は未読）　0.75〜1.0 秒とする資料もある。【抜粋】
  - 酸素は 約 0.25 秒で肺胞の空気と釣り合い、残りの 約0.5秒は予備。【抜粋】
  - 運動時のイヌで約0.3秒。【全文】[Hsia2016]
- 酸素の通りにくさは、壁（膜）と赤血球の中とでほぼ半分ずつ。【全文】[Hsia2016]
- 肺全体の酸素の拡散能（通しやすさ）は 約150〜200 mL/分/mmHg（形の測定からの計算）。【全文】[Hsia2016]
  → ゲームの「ガス交換の再開」は、①壁が薄い、②毛細血管に赤血球が流れている、③肺胞に空気が入れ替わる、の3つがそろうことで表せる。【計算】

---

## 6. I型肺胞上皮細胞（I型肺胞細胞、扁平上皮）

- 肺胞の表面の **約95%**（Wikipedia は「95%超」）を、薄く広がった細胞の膜で覆う。【全文】[Knudsen2018][Wiki-Alveolus]
- 数では肺胞の細胞の 8%。1個の体積 平均 1,764 µm³、覆う面積 平均 **5,098 µm²**。大きい細胞の一つ。【要旨】[Crapo1982]
  → 面積を円にすると直径 約 80 µm。平均の厚みは 約 0.35 µm（体積÷面積、核の部分も含む）。【計算】
- 最も薄い所で 約 25 nm。【全文】[Wiki-Alveolus]
- 細胞の本体（核のある部分）は毛細血管のあいだのくぼみにしまわれ、薄い膜の部分だけが毛細血管の上に広がる。これで壁の平均の厚みを小さく保つ。枝分かれした細胞質の葉を広げて大きな面積を覆う。【全文】[Hsia2016]
- 1個の細胞が壁を越えて、**2つ以上の肺胞に面する**ことがある。【全文】[Knudsen2018]
- 隣どうし・II型細胞との間は、密着結合（すき間をふさぐつなぎ目）でつながる。【全文】[Knudsen2018][Fehrenbach2001]
- 1つの肺胞あたりの数（モデル用の推定）：39〜45個、または48個。【全文】[Pollmacher2014][Blickensdorf2019]
- 呼吸で引き伸ばされる。細胞膜のひだが伸びて横の張力を受け止め、直径 1 µm 未満の膜の破れなら細胞は死なずに修復できる。【全文】[Knudsen2018]

## 7. II型肺胞上皮細胞（II型肺胞細胞、立方上皮）

- 立方形（さいころ形に近い）。**頭の面に微絨毛**（短い突起）があり、細胞の中に**層板小体**（サーファクタントをしまう小袋）を持つ。この4つ（層板小体・頭の微絨毛・細胞どうしのつなぎ目・立方形）が、I型と見分ける決め手。【全文】[Fehrenbach2001]
- 薄いI型細胞の膜のあいだに、**1個ずつ**散らばって混じる。【全文】[Knudsen2018]
- **肺胞の角（すみ）**が典型的な居場所。【全文】[Fehrenbach2001]　コーンの孔の縁をつくることが多い。【全文】[Wiki-PoresKohn]（Cordingley 1972 の引用【抜粋】）
- 数では肺胞の細胞の 16%（I型の約2倍）だが、覆う面積は表面の 7%。体積はI型の半分。【要旨】[Crapo1982]　I型：II型の数の比は 約1：2。【全文】[Knudsen2018]
  → 体積 約 880 µm³。立方体なら一辺 約 9.6 µm。【計算】　モデル研究では一辺 9.34 µm、直径 9.3 µm。【全文】[Blickensdorf2019][Pollmacher2015]
- 1つの肺胞あたりの数（モデル用の推定）：74〜84個、または84個。【全文】[Pollmacher2014][Blickensdorf2019]
- 働き：サーファクタントの全成分をつくり、しまい、放出し、大部分を回収して再利用する。下相の pH やカルシウムを調整する。増えて**I型に変わり**、肺胞の上皮を修復する（前駆細胞）。死んだII型細胞を食べて片付ける。【全文】[Fehrenbach2001][Knudsen2018]
- 胎児では 約26週から現れ、十分なサーファクタントが出るのは 約35週。【全文】[Wiki-Alveolus]

## 8. サーファクタント（肺の表面活性物質）

- 成分：重さで 約90% が脂質（その 80〜90% がリン脂質）、約10% がたんぱく質（SP-A、SP-B、SP-C、SP-D）。【全文】[Fehrenbach2001][Knudsen2018]　主成分 DPPC（ジパルミトイルホスファチジルコリン）が 約40%。【全文】[Wiki-Surfactant]
- **一生の流れ（形が変わる）**：【全文】[Knudsen2018][Fehrenbach2001]
  1. II型細胞の中の**層板小体**にしまわれる。層板小体は、脂質とたんぱくの**同心円の輪（たまねぎ状）**で、直径 約 1 µm。【全文】[Wiki-Surfactant]
  2. 細胞の頭から放出（開口分泌）される。
  3. 下相（水の層）の中で、**管状ミエリン**に変わる。管状ミエリンは、驚くほど規則正しい格子（網目）状の集まり。【全文】[Fehrenbach2001]　（胎児ラットで、直径 2〜3 µm の球状のかたまりを最大20個の層板小体が取り巻く。【抜粋】）
  4. 空気と水の境目に広がって**表面の膜**をつくる（単分子層）。【全文】[Wiki-Surfactant][Knudsen2018]
  5. 使い終わった分は小さな袋（小胞）になり、II型細胞が回収（再利用・分解）するか、マクロファージが食べる。【全文】[Knudsen2018]　DPPC の最大90% がII型細胞に回収され、残り約10% はマクロファージが消化する。肺胞内での半減期は 5〜10時間。【全文】[Wiki-Surfactant]
- **表面張力を下げる**：水の表面張力 約 70 mN/m に対し、肺の中では 約 25 mN/m。【全文】[Wiki-Surfactant]　息を吐き終わるときには **ほぼ 0 mN/m** まで下がり、肺胞がつぶれない。【全文】[Knudsen2018]
  - Wikipedia の表：肺が最大（全肺気量100%）で 約30 mN/m、40〜60% で 1〜6 mN/m、40% 未満で 1 mN/m 未満。【全文】[Wiki-Surfactant]
  - 吸うと表面が広がり、新しいサーファクタントが境目に入る。吐くと表面が縮み、膜の密度が高いまま保たれる。【全文】[Wiki-Surfactant]
- 表面張力が高いと（II型細胞の傷などで）、肺胞道が太くなり、肺胞の表面積が減る。【全文】[Knudsen2018]　サーファクタントは吐き終わりの肺胞の虚脱（無気肺）を防ぐ。不足すると新生児呼吸窮迫症候群になる。【全文】[Wiki-Surfactant]
- 見た目：表面の膜は分子1層ぶんの厚さで、主人公の大きさでも**見えない**。見えるとすれば、液面の張り・輝きとして。【計算】（厚さの実測値は【未確認】）

## 9. 肺胞マクロファージ（「ちりを食べる細胞」）

- 肺胞の中（空気側）にいる、壁から離れた白血球の仲間。別名「ダストセル（ちり細胞）」。ちりや微生物を呼吸の表面から取り除く。【全文】[Wiki-AM]
- **大きさ**：健康な非喫煙者から洗い出して浮かせた状態で、直径 **21.2 µm**、体積 約 4,990 µm³。ラット（13.1 µm）やサル（15.3 µm）より大きい。【要旨】[Krombach1997]
  モデル研究の文献値は半径 10.6 µm。【全文】[Blickensdorf2019]　壁に貼りついて広がったときの寸法：【未確認】
- **数**：肺胞の細胞の 3〜5%（非喫煙の女性）から 19% まで、人による差が大きい。【要旨】[Crapo1982]　喫煙者では肺の洗浄液中のマクロファージが非喫煙者の 4〜6倍。【全文】[Wiki-Emphysema]
  - 肺全体で 約 2.1×10⁹ 個とするモデル用の表。【全文】[Blickensdorf2019]　右上葉だけで 約 1.4×10⁹ 個（うち95% が肺胞側）とする実測。【抜粋】（Hume ほか 2020）→ 2つの値は食い違う可能性。
  - **肺胞のほうがマクロファージより多い**ので、マクロファージのいない肺胞がある。【要旨】[Neupane2020]　マウスでは、1個のマクロファージが平均 約3個の肺胞を受け持つ。【全文】[Liu2025]
  → ヒトでは「1つの肺胞に 0〜数個」。【計算】（2.1×10⁹ ÷ 4.8×10⁸ ≒ 4 だが、上の値の食い違いがあるので幅をとる）
- **動き**（マウスの生体観察）：
  - 肺胞の中と、肺胞の間を**コーンの孔を通って這い回る**（パトロール）。吸いこまれた細菌を感じとり、そちらへ向かい（走化性）、効率よく食べる。インフルエンザ感染では這う動きが鈍る。【要旨】[Neupane2020]
  - 這う速さ：平時 約 **0.5 µm/分**。ナノ粒子を吸うと 約 1 µm/分 に倍増し、24時間後も速いまま。向きはでたらめに見えるが、10〜20 µm 以内の粒子のかたまりには向かってまっすぐ進む。【全文】[Liu2025]
    → 200 µm の肺胞を横切るのに、平時で 約7時間、速いときで 約3時間。【計算】
  - 一方、壁に貼りついて動かず、上皮とすき間結合（細胞どうしの小さな通路）でつながる一群もいる。【要旨】[Westphalen2014]
  - モデル研究では 2〜6 µm/分 を仮定。【全文】[Pollmacher2015]（実測値ではない）
- **食べるもの**：ちり、細菌、古くなった余分なサーファクタント、細胞のかけら、ナノ粒子。【全文】[Liu2025][Wiki-AM]
- **ためこんだ色素の見え方**（色は染色ではなく、粒子そのものの色）：
  - 炭（すす・炭粉）：黒〜黒褐色の顆粒。喫煙者や長く都市に住む人に多い。【全文】[Wiki-AM]
  - 喫煙者のマクロファージ：黄色〜淡褐色の細かい顆粒（「喫煙者顆粒」）。偏光で光らない。たばこの燃えかすのすすが、ごく小さな黒い不透明な丸い点として混じることもある。【全文】[Wiki-AM][Jelic2017]
  - 炭鉱の炭粉：角ばった、ふぞろいな輪郭の黒い粒。【全文】[Jelic2017]
  - ヘモジデリン（出血や心不全で赤血球を食べた後の鉄）：褐色〜金色で、光を屈折してきらめく。【全文】[Wiki-AM]
  ※ これらは顕微鏡標本（H&E 染色）での見え方の記述。色素の色そのものは染色に左右されにくいが、背景の色は染色の色なので使わない。

## 10. コーンの孔（肺胞の壁の小窓）

- 隣り合う肺胞の壁にあいた、**丸い〜楕円の穴**。肺胞どうしの圧を等しくし、虚脱を防ぐ。液や細菌も通るので、肺炎が広がる道にもなる。【全文】[Wiki-PoresKohn]
- 生まれたときはなく、3〜4歳ごろにできる。1893年に Hans Kohn が記載。【全文】[Wiki-PoresKohn]
- マクロファージが肺胞から肺胞へ移る通り道。【要旨】[Neupane2020]
- 縁にII型細胞が加わることが多い。【全文】[Wiki-PoresKohn]
- **大きさ**：資料が大きく食い違う。
  - 切片で見える最小の直径 1.1〜2.2 µm（肺を膨らませるほど大きい。動物種は未確認）。【抜粋】（Mazzone & Kornblau 1981）
  - モデル研究の推定：直径 6 µm。【全文】[Pollmacher2015]
  - 10 µm 未満とする資料、10〜14 µm とする資料。【抜粋】
  → 「主人公（2 µm）がやっと通れる〜マクロファージ（約21 µm）が身を細くして通る」くらい。【計算】
- **数**：1つの肺胞に 約24個（モデル用の文献値）。【全文】[Pollmacher2014][Blickensdorf2019]
- 肺気腫の始まりに、コーンの孔が増えるという報告。【抜粋】（長崎大学、Int J COPD 2016）

---

## 11. 呼吸：吸う息と吐く息で何が変わるか（ゲームの「流れと地形」）

- **1回の呼吸量（1回換気量）**：健康な成人男性で 約 500 mL、女性で 約 400 mL、体重あたり 約 7 mL/kg。そのうち約 150 mL は気道に残る（死腔）ので、呼吸部に届くのは 約 350 mL。【抜粋】[StatPearls-TV]
- **呼吸数**：安静時の成人で 1分間に 12〜20回。【抜粋】（NCBI Bookshelf）→ 1呼吸 3〜5秒。【計算】
- **肺胞の大きさの変化は小さい**（ここは注意）：
  - 安静の呼吸で、肺胞の**長さ（直径など）の伸び縮みは 約 4%〜10%**。深いため息や運動では 20% 以上になりうる。【全文】[Knudsen2018]（Tschumperlin 1999、Mercer 1987、Gil 1979 などのまとめ）
    → 直径 200 µm なら、ふくらみの幅は 約 8〜20 µm（赤血球1〜2.5個分）。体積では 約12〜33% 増える。【計算】
  - 生きたマウス（X線で個々の肺胞を追跡）：肺胞の大きさは平均 58 µm（マウス）で、1回の呼吸で 0〜約25% ふくらみ、平均 **6.7%**。ふくらみ方は肺胞ごとにばらばら（ばらつき 70%）。肺の底のほうがよくふくらむ（8.7%、てっぺんは 5.7%）。【全文】[Chang2015]
  - **体積の変化の多くは肺胞道で起こる**。安静の呼吸の範囲では、主に肺胞道が広がり、肺胞そのものの変化は小さい。【全文】[Knudsen2018]　マウスでは1回換気量の 34% が肺胞のふくらみ、残り 66% が肺胞道の中央の通路の広がり。【全文】[Chang2015]
  - 肺胞の形の変え方として4つが考えられてきた：①肺胞が開いたり閉じたりする（動員・虚脱）、②風船のように一様に伸びる、③形が変わる、④壁のひだが**折りたたまれたり広がったり**する。【全文】[Knudsen2018]
  - 健康な肺では、ふつうの呼吸で**肺胞が丸ごと閉じたり開いたりすることはない**（生体での証拠がない）。吐いて体積が減るときは、壁にひだ（プリーツ）ができ、表面積が減る。【全文】[Knudsen2018]
  - 低い圧では肺胞道が細く、壁が折れ曲がって肺胞道へ張り出す。圧が上がると肺胞道が広がり、まわりの線維（ばね）が伸びる。【全文】[Knudsen2018]（ラットの観察）
  - 表面の膜が覆う「空気に出ている面」は、肺を40%から80%へふくらませる間に 80〜91 m² の範囲で変わる。【全文】[Hsia2016]
- **ゲームへの言い換え案**（すべて上の資料からの組み立て）：【計算】
  - 吸う息：細気管支から肺胞道へ、奥へ向かう弱い風。肺胞道が広がり、肺胞の入口の輪が開く。壁のひだが伸びて平らになる。肺胞は「ひと回り」（直径で数％〜1割）ふくらむ。
  - 吐く息：風が逆向きになり、肺胞道が細くなる。壁にひだが寄る。肺胞はつぶれない（サーファクタントのおかげ）。
  - 肺胞の奥ほど風は弱く、ほとんど止まっている（拡散の世界）。
  - 「肺胞が大きく膨らんだりしぼんだりする」描写は実際と違うので避ける。

---

## 12. 吸いこんだ細かな粒子（沈着物）

- **大きさと届く場所**：【全文】[Wiki-PM]
  - PM10（2.5〜10 µm）：鼻・喉・気管支など上の気道に付く。
  - **PM2.5（2.5 µm 以下）**：肺の奥まで入り、**細気管支と肺胞**に届く。
  - 超微粒子（0.1 µm＝100 nm 以下）：血液に入り、心臓や脳などにも届きうる。
  - 形がふぞろいな粒子は、同じ大きさの球より気道に付きやすい。
  - 大きさ別の沈着率の数値（ICRP モデルなど）：【未確認】
- **何でできているか**：【全文】[Wiki-PM]
  - PM2.5 の重さの 30〜50% は、硫酸塩・硝酸塩・アンモニウム塩（二次生成の無機粒子）。
  - すす（黒色炭素・有機炭素）は、炭素からなる細かい〜超微細な粒子。**黒く、フラクタル状（ぶどうの房や鎖が枝分かれしたような）の集まり**。
  - セメント・黄砂・火山灰などは、ふぞろいな形で、灰色〜褐色。燃えかすの煙と水滴は白い球。
  - 有害な成分として多環芳香族炭化水素、重金属（ヒ素・カドミウム・鉛）など。
- **シリカ（石英などの鉱物の粉）・ケイ酸塩**：
  - 1 µm 未満〜2 µm のごく小さな粒と、細長い・板状の大きめのケイ酸塩の粒。偏光で光る（複屈折）。炭鉱労働者の肺では、すべての人の肺胞のマクロファージにシリカ／ケイ酸塩の粒があった。【全文】[Jelic2017]
  - 偏光を使わない、ふつうの光での色：【未確認】（鉱物としては無色〜白っぽい透明と考えられるが、資料で確かめていない）
- **炭粉沈着（炭粉症、アントラコーシス）**：黒い炭の色素をためたマクロファージ。年齢・都市生活・炭鉱労働と関係する。【全文】[Wiki-AM]　炭鉱の病変（炭粉斑）は、炭粉を抱えたマクロファージの集まりで、まわりを小さな肺気腫が囲むことが多い。【抜粋】
- **喫煙**：呼吸細気管支とまわりの肺胞の中に、褐色の顆粒とすすの黒い点を持つマクロファージが集まる（呼吸細気管支炎）。【全文】[Jelic2017]【抜粋】
- 粒子のその後：マクロファージが取り込む（無機粒子は肺胞の表面で 0.6〜7時間で取り込まれるという報告【抜粋】）。マウスでは、肺胞の壁に付いたシリカのナノ粒子のかたまりの半分が 30分で見えなくなり、上皮の細胞を通り抜ける途中の姿が電顕で見られた。【全文】[Detampel2019]（マウス、溶液で入れた実験）
- ゲームでの見せ方の案：肺胞の壁や角にくっついた、黒いすすの房・角ばった黒い粒・小さな透明の鉱物のかけら。マクロファージの中に黒い点がたまっていく。【計算】

---

## 13. 健康なとき と 病気のときの見え方（ゲームで見せる違い）

| | 健康 | 不調（粒子がたまった・壊れた） | 出所 |
|---|---|---|---|
| 1. 肺胞の壁 | 薄く、平ら。毛細血管は肺胞へ出っぱらない | 壁が厚くなる（線維化）。炭鉱労働者では線維化、喫煙・粉じんで間質の線維化 | 【全文】[Knudsen2018][Jelic2017]、壁が広がる例【全文】[Wiki-Alveolus] |
| 2. 肺胞の形 | 丸い部屋が房のように並ぶ | 壁が壊れて隣とつながり、大きな空間になる（肺気腫）。表面積が減る。大きな袋（ブラ）ができることも | 【全文】[Wiki-Emphysema] |
| 3. マクロファージ | 少なく、ところどころに1個ずつ。中は明るい | 数が増え（喫煙者で4〜6倍）、黒や褐色の粒をためこみ、群れをつくる | 【全文】[Wiki-Emphysema][Wiki-AM]【要旨】[Crapo1982] |
| 4. 壁の上の粒子 | ほとんどない | すすの房、角ばった炭粉、鉱物のかけらが付く | 【全文】[Wiki-PM][Jelic2017] |
| 5. 肺胞の中身 | 空気。壁は薄い液の層だけ | 液がたまる（肺水腫）、サーファクタントがたまる（肺胞たんぱく症）、肺炎で細胞や線維素が満ちる | 【全文】[Wiki-Alveolus][Wiki-PoresKohn] |
| 6. 表面の張り | サーファクタントが張り、吐いてもつぶれない | 表面張力が上がり、肺胞道が太く、表面積が減る。つぶれる（無気肺） | 【全文】[Knudsen2018][Wiki-Surfactant] |
| 7. 呼吸の動き | 壁のひだがたたまれ・広がる。肺は弾む | 弾力が失われ、息を吐き出しにくい（肺気腫） | 【全文】[Wiki-Emphysema][Knudsen2018] |
| 8. コーンの孔 | 小さな丸い窓 | 数が増える（肺気腫の始まり） | 【抜粋】 |

「患者の変化＝呼吸が深くなる」の根拠：粒子が片付き、壁が薄く、表面張力が低く保たれれば、肺はよくふくらみ、ガス交換の面が広がる。【計算】（上の表の組み合わせ。回復の速さの数値は【未確認】）

---

## 14. 生きた組織の色（染色の色は使わない）

- 生体での肺胞の色を直接書いた資料は見つからなかった。【未確認】
- 組み立て（推測）：壁はごく薄く透明に近い。その中を赤血球が流れるので、**赤血球の赤がうっすら透ける網目**に見えるはず（毛細血管が面積の 約70% を覆う【全文】[Wiki-Alveolus]）。空気側は薄い液の膜で、光を反射して濡れたように見えるはず。【未確認】
- 赤血球の色は、1個では淡く、集まるほど濃い赤（既存の台帳 `rbc`）。
- 粒子の色：すすは黒、喫煙者顆粒は黄〜淡褐色、炭粉は黒〜黒褐色、ヘモジデリンは褐色〜金色。【全文】[Wiki-AM][Wiki-PM]
- 電子顕微鏡写真の色付き画像は、後から付けた疑似カラー。組織標本のピンクや紫は染色の色。どちらも生体の色として使わない。

---

## 15. 参考画像（Wikimedia Commons ほか）

ライセンスが PD／CC0／CC BY のものだけを挙げる。**説明ページ（ライセンス・作者）は読んだが、画像そのものは見ていない。** 使う前に画像を確認すること。

| ファイル | 内容 | ライセンス | 作者 |
|---|---|---|---|
| [File:Macrophage_in_the_alveolus_Lung_-_TEM.jpg](https://commons.wikimedia.org/wiki/File:Macrophage_in_the_alveolus_Lung_-_TEM.jpg) | 肺胞の中のマクロファージ（透過電顕、哺乳類）。核、ゴルジ体、ミトコンドリア | PD | Louisa Howard（Dartmouth 電顕施設） |
| [File:Alveolar_sac_region_of_the_lung_-_TEM.jpg](https://commons.wikimedia.org/wiki/File:Alveolar_sac_region_of_the_lung_-_TEM.jpg) | マウスの肺胞嚢のあたり（透過電顕）。サーファクタントの小袋を持つ細胞、赤血球の入った毛細血管、薄い内皮 | PD | Louisa Howard, Michael Binder |
| [File:Histopathology_of_a_smoker's_macrophage.jpg](https://commons.wikimedia.org/wiki/File:Histopathology_of_a_smoker%27s_macrophage.jpg) | 喫煙者のマクロファージ（光学顕微鏡、染色あり。形と顆粒の様子だけ参考に） | CC0 | Mikael Häggström |
| [File:Synchrotron-x-ray-imaging-of-pulmonary-alveoli-in-respiration-in-live-intact-mice-srep08760-s2.ogv](https://commons.wikimedia.org/wiki/File:Synchrotron-x-ray-imaging-of-pulmonary-alveoli-in-respiration-in-live-intact-mice-srep08760-s2.ogv) | 生きたマウスの肺胞が呼吸で動く様子（X線動画、7.9秒） | CC BY 4.0 | Chang S ほか（Sci Rep 2015） |
| [File:Particle-dynamics-and-deposition-in-true-scale-pulmonary-acinar-models-srep14071-s2.ogv](https://commons.wikimedia.org/wiki/File:Particle-dynamics-and-deposition-in-true-scale-pulmonary-acinar-models-srep14071-s2.ogv) | 実物大の細葉モデルの中での粒子の動きと沈着（動画、4.1秒。中身は未確認） | CC BY 4.0 | Fishler R ほか（Sci Rep 2015） |
| [File:Bronchiolar_epithelium_4_-_SEM.jpg](https://commons.wikimedia.org/wiki/File:Bronchiolar_epithelium_4_-_SEM.jpg) | 細気管支の上皮（走査電顕）。`nose.md` の調査で画像を見て PD と確認済み | PD | （`nose.md` 参照） |
| [Wellcome Collection「Alveoli. SEM」](https://wellcomecollection.org/works/a5azfeu6) | 肺の内面、肺胞の走査電顕（Commons ではない） | CC BY 4.0【抜粋】 | David Gregory & Debbie Marshall【抜粋】 |

除外したもの（CC BY-SA のため）：`File:Carbon_laden_macrophages_in_lung,_H&E_100X.jpg`（CC BY-SA 4.0、Calicut Medical College）、`File:Alveolar_wall.jpg`（CC BY-SA 4.0、Cruithne9）、`File:Normal_lung_Alveoli_(3678762542).jpg`（CC BY-SA 2.0、Yale Rosen）。
候補だが未確認：`File:Golgi_in_the_cytoplasm_of_a_macrophage_in_the_alveolus_(lung)_-_TEM.jpg`（同じ作者の PD の可能性。ライセンス未確認）。Commons のカテゴリ「Alveolar macrophages」「Pulmonary alveoli」に他の候補がある。
II型細胞・層板小体・クラブ細胞・炭粉沈着の、PD／CC0／CC BY の画像は見つけられなかった。【未確認】

---

## 16. 特に確かめられなかった点（まとめ）

- 肺胞の生体での色（推測のみ）。
- 肺胞マクロファージが壁に広がったときの寸法、ヒトでの這う速さ（マウスの値のみ）。
- ヒトの1肺胞あたりのマクロファージ数（総数の資料が食い違う）。
- コーンの孔の直径（1〜14 µm と大きく食い違う）。
- 層板小体の1細胞あたりの数、管状ミエリンの網目の間隔、表面の膜の厚さ。
- クラブ細胞の高さ・幅。
- 細気管支の粘液層の厚さ、細気管支での線毛の打つ速さ。
- 粒子の大きさ別の沈着率（ICRP モデルの数値）。
- シリカ粒子のふつうの光での見え方。
- 呼吸数・1回換気量・赤血球の通過時間は、抜粋か二次資料（原典の教科書は未読）。

## 17. 資料間で食い違った数値（まとめ）

| 項目 | 値 | 出所 |
|---|---|---|
| 肺胞の数 | 4.8億（2.74〜7.9億） / 3〜5億 / 約5億 | [Ochs2004][Wiki-Lung] |
| 肺胞の直径 | 約200 µm（体積からの計算） / 200〜500 µm / 約233 µm | [Ochs2004]【計算】[Wiki-Alveolus][Blickensdorf2019] |
| 肺胞の表面積 | 130 m²（電顕） / 140 m² / 70〜80 m² / 50〜75 m² / 70〜145 m² | [Hsia2016][Knudsen2018][Wiki-Alveolus][Wiki-Lung] |
| 血液空気関門の厚さ | 0.2〜0.6 µm / 調和平均0.62 µm / 算術平均2.2 µm / 最薄0.3 µm | [Wiki-Alveolus][Hsia2016] |
| I型の覆う割合 | 約95% / 95%超（II型は7%） | [Knudsen2018][Wiki-Alveolus][Crapo1982] |
| 毛細血管の太さ | 3〜5 / 5〜10 / 3〜10 µm / 約6.7 µm（計算） | 【抜粋】[Hsia2016]【計算】 |
| 呼吸での肺胞の伸び | 長さで4〜10%（深呼吸で20%超） / マウス大きさで平均6.7%（0〜25%） | [Knudsen2018][Chang2015] |
| マクロファージの数 | 肺全体2.1×10⁹ / 右上葉だけで1.4×10⁹ | [Blickensdorf2019]【抜粋】 |
| コーンの孔の直径 | 1.1〜2.2 µm / 6 µm / <10 µm / 10〜14 µm | 【抜粋】[Pollmacher2015] |
| 赤血球の通過時間 | 0.75秒 / 0.75〜1.0秒 | [BioNumbers101731]【抜粋】 |

---

## 出所一覧

- [Hsia2016] Hsia CCW, Hyde DM, Weibel ER. Lung structure and the intrinsic challenges of gas exchange. Compr Physiol 2016;6:827–895. https://pmc.ncbi.nlm.nih.gov/articles/PMC5026132/ （本文）
- [Knudsen2018] Knudsen L, Ochs M. The micromechanics of lung alveoli: structure and function of surfactant and tissue components. Histochem Cell Biol 2018;150:661–676. https://pmc.ncbi.nlm.nih.gov/articles/PMC6267411/ （本文）
- [Ochs2004] Ochs M, Nyengaard JR ほか. The number of alveoli in the human lung. Am J Respir Crit Care Med 2004;169:120–124. https://pubmed.ncbi.nlm.nih.gov/14512270/ （要旨）
- [Crapo1982] Crapo JD, Barry BE, Gehr P, Bachofen M, Weibel ER. Cell number and cell characteristics of the normal human lung. Am Rev Respir Dis 1982;126:332–337. https://pubmed.ncbi.nlm.nih.gov/7103258/ （要旨）
- [Fehrenbach2001] Fehrenbach H. Alveolar epithelial type II cell: defender of the alveolus revisited. Respir Res 2001;2:33–46. https://pmc.ncbi.nlm.nih.gov/articles/PMC59567/ （本文）
- [Rokicki2016] Rokicki W, Rokicki M, Wojtacha J, Dżeljijli A. The role and importance of club cells (Clara cells) in the pathogenesis of some respiratory diseases. Kardiochir Torakochirurgia Pol 2016;13:26–30. https://pmc.ncbi.nlm.nih.gov/articles/PMC4860431/ （本文）
- [Krombach1997] Krombach F ほか. Cell size of alveolar macrophages: an interspecies comparison. Environ Health Perspect 1997;105 Suppl 5:1261–1263. https://pubmed.ncbi.nlm.nih.gov/9400735/ （要旨）
- [Neupane2020] Neupane AS ほか. Patrolling alveolar macrophages conceal bacteria from the immune system to maintain homeostasis. Cell 2020;183:110–125. https://pubmed.ncbi.nlm.nih.gov/32888431/ （要旨）
- [Westphalen2014] Westphalen K ほか. Sessile alveolar macrophages communicate with alveolar epithelium to modulate immunity. Nature 2014;506:503–506. https://pubmed.ncbi.nlm.nih.gov/24463523/ （要旨）
- [Liu2025] Liu Q, Yang L ほか, Rehberg M. Alveolar macrophages initiate the spatially targeted recruitment of neutrophils after nanoparticle inhalation. Sci Adv 2025;11:eadx8586. https://pmc.ncbi.nlm.nih.gov/articles/PMC12594175/ （本文、マウス）
- [Chang2015] Chang S, Kwon N ほか, Tsuda A. Synchrotron x-ray imaging of pulmonary alveoli in respiration in live intact mice. Sci Rep 2015;5:8760. https://pmc.ncbi.nlm.nih.gov/articles/PMC4348649/ （本文、マウス）
- [Pollmacher2014] Pollmächer J, Figge MT. Agent-based model of human alveoli predicts chemotactic signaling by epithelial cells during early Aspergillus fumigatus infection. PLoS One 2014;9:e111630. https://pmc.ncbi.nlm.nih.gov/articles/PMC4216106/ （本文。表の数値の一部は数式形式で読めず）
- [Pollmacher2015] Pollmächer J, Figge MT. Deciphering chemokine properties by a hybrid agent-based model of Aspergillus fumigatus infection in human alveoli. Front Microbiol 2015;6:503. https://pmc.ncbi.nlm.nih.gov/articles/PMC4446573/ （本文。モデル用の推定値）
- [Blickensdorf2019] Blickensdorf M, Timme S, Figge MT. Comparative assessment of aspergillosis by virtual infection modeling in murine and human lung. Front Immunol 2019;10:142. https://pmc.ncbi.nlm.nih.gov/articles/PMC6370618/ （本文。表1は文献値の集約）
- [Muhlfeld2021] Mühlfeld C. Stereology and three-dimensional reconstructions to analyze the pulmonary vasculature. Histochem Cell Biol 2021. https://pmc.ncbi.nlm.nih.gov/articles/PMC8397636/ （本文）
- [Jelic2017] Jelic TM ほか. Coal mine dust desquamative chronic interstitial pneumonia: a precursor of dust-related diffuse fibrosis and of emphysema. Int J Occup Environ Med 2017;8:153–165. https://pmc.ncbi.nlm.nih.gov/articles/PMC5576734/ （本文）
- [Pavia1991] Pavia D. Bronchoalveolar clearance. Respiration 1991;58 Suppl 1:13–17. https://pubmed.ncbi.nlm.nih.gov/1925072/ （要旨）
- [Detampel2019] Detampel P, Ganguly A ほか, Amrein MW. In vivo clearance of nanoparticles by transcytosis across alveolar epithelial cells. PLoS One 2019;14:e0223339. https://pmc.ncbi.nlm.nih.gov/articles/PMC6768543/ （本文の該当箇所、マウス）
- [Tilley2015] Tilley AE, Walters MS, Shaykhiev R, Crystal RG. Cilia dysfunction in lung disease. Annu Rev Physiol 2015;77:379–406. https://pmc.ncbi.nlm.nih.gov/articles/PMC4465242/ （本文。`nose.md` と共通）
- [BioNumbers101731] BioNumbers ID 101731「typical transit time for erythrocyte in pulmonary capillary」0.75 s（原典 Nunn JF. Applied Respiratory Physiology, 1993）. https://bionumbers.hms.harvard.edu/bionumber.aspx?id=101731
- [StatPearls-TV] StatPearls「Physiology, Tidal Volume」https://www.ncbi.nlm.nih.gov/books/NBK482502/ （抜粋のみ。本文は取得拒否）
- Wikipedia（英語版）：[Wiki-Alveolus] https://en.wikipedia.org/wiki/Pulmonary_alveolus ／ [Wiki-Bronchiole] https://en.wikipedia.org/wiki/Bronchiole ／
  [Wiki-AM] https://en.wikipedia.org/wiki/Alveolar_macrophage ／ [Wiki-Surfactant] https://en.wikipedia.org/wiki/Pulmonary_surfactant ／
  [Wiki-PoresKohn] https://en.wikipedia.org/wiki/Pores_of_Kohn ／ [Wiki-PM] https://en.wikipedia.org/wiki/Particulate_matter ／
  [Wiki-Emphysema] https://en.wikipedia.org/wiki/Emphysema ／ [Wiki-ClubCell] https://en.wikipedia.org/wiki/Club_cell ／ [Wiki-Lung] https://en.wikipedia.org/wiki/Lung
- 抜粋のみ：Mazzone & Kornblau 1981（コーンの孔の大きさ）、Hume ほか 2020（マクロファージの立体計測）、Cordingley 1972、長崎大学 Int J COPD 2016;11:2287（コーンの孔と肺気腫）。

## 形の仕様書の一覧（atlas/）

`alveolus.md`（肺胞）、`type1_pneumocyte.md`（I型肺胞上皮細胞）、`type2_pneumocyte.md`（II型肺胞上皮細胞）、`alveolar_macrophage.md`（肺胞マクロファージ）、
`surfactant.md`（サーファクタント）、`alveolar_capillary.md`（肺胞の毛細血管）、`club_cell.md`（クラブ細胞）、`particle_pm.md`（吸いこんだ細かな粒子）
