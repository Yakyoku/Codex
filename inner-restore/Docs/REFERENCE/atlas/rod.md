# 桿体（形の仕様書）

印の意味：【全文】本文を読んだ／【要旨】要旨のみ／【抜粋】検索結果の抜粋のみ（本文未読）／【画像】画像を見た／【計算】資料の数値からの計算／【未確認】出所を確かめられなかった。

## 名前（日本語・英語）
桿体（かんたい）、桿体細胞／rod、rod photoreceptor cell

## 種類（細胞・組織・器官・物質）
細胞（光を受け取る神経細胞＝視細胞。暗い所での視覚を担う）

## 実際の大きさ（数値と、髪の毛の太さ約70〜100µm などとの比較）
- 外節（光を受ける部分）：ヒトで直径 約 2 µm、長さ 約 25 µm（別資料で 20 µm）。【抜粋】[BioNumbers-ROS]（Rodieck 1998、Rieke & Baylor 1998 を引用）
  哺乳類の範囲：長さ 20〜30 µm、直径 1.2〜2.0 µm。【抜粋】
  マウス（実測）：長さ 23.8 µm、直径 1.32 µm。【全文】[Nickell2007]
- 内節：ヒトの周辺部の網膜で直径 約 2 µm。【全文】[WV-Photo]　内節の長さ：【未確認】
- シナプス側の終末（桿体小球 spherule）：直径 3〜5 µm の小さな丸いふくらみ。【全文】[WV-Photo]
- 細胞全体の長さ（外節の先端からシナプス終末まで）：【未確認】（視細胞の層＝内節＋外節の厚みは OCT で 約 88 µm【抜粋】だが、これは錐体の多い中心部の値）
- 髪の毛（約 70〜100 µm）と比べると、外節の太さは 35〜50分の1。髪の毛の断面の中に、桿体の外節が 1,000本以上並ぶ計算。【計算】

## 形と比率（3Dモデルを作れる精度で数値と言葉で）
- 細長い4つの部分が1列につながる（色素上皮側から硝子体側へ）：【全文】[WV-Photo]
  1. **外節**：太さの変わらない円柱。長さ：直径 ≒ 12：1。中に円板がぎっしり積み重なる。
  2. **連結線毛**：外節と内節をつなぐ、ごく細いくびれ。
  3. **内節**：外節とほぼ同じ太さ（約 2 µm）の円柱。外節寄りの半分（エリプソイド）に細長いミトコンドリアが詰まり、
     細胞体寄り（ミオイド）にタンパク質を作る小器官がある。
  4. **細胞体**（核）と、細い軸索、その先の小球（3〜5 µm）。
- 錐体と比べると、桿体は「やや長く、細い」。外節は円柱（錐体の外節は円錐）。【全文】[Wiki-Rod][OpenStax][WV-Photo]
- **円板**：
  - 平たい袋（2枚の膜が縁でつながったもの）。桿体では、外節の根元以外の円板は外の膜から切り離され、外節の膜の中に独立して浮いている
    （ポーカーのチップを積んだ形）。【全文】[WV-Photo]
  - 数：桿体の外節は「1,000枚を超える」円板の積み重ね。【抜粋】　種を問わない一般値として「最大 2,000枚」。【全文】[Nickell2007]（Daemen 1973 を引用）
    マウスの実測は平均 810枚。【全文】[Nickell2007]
  - 間隔（1枚ぶんの繰り返しの長さ）：約 28 nm。【抜粋】[BioNumbers-Disc]（Rodieck 1998。種は明記なし）
    マウスでは 23.8 µm ÷ 810枚 ≒ 29 nm で、ほぼ一致する。【計算】
  - ヒトの桿体（外節 25 µm）なら、25,000 nm ÷ 28 nm ≒ **約 900枚**。【計算】（ヒトでの実測の枚数は【未確認】）
  - マウスの細部：円板の直径 1.27 µm（外節の直径 1.32 µm より少し小さい）。隣り合う円板の間のすき間 14 nm、
    円板の縁と外の膜の間 17 nm。円板の縁はヘアピン状に折り返し、曲率半径 12 nm。円板には縁から切れ込み（インシジュア）が1本入る。
    【全文】[Nickell2007][Poege2021]
- 模型の作り方の目安：直径 2 µm・長さ 25 µm の円柱（外節）の中に、円板を 28 nm 間隔で約 900枚（円板どうしのすき間はマウスで 14 nm なので、円板1枚の厚みも 14 nm 前後【計算】）。
  その下に、同じ太さの内節。主人公の大きさ（細胞大）からは、円板1枚ずつは見分けられず、外節の側面に細かな横縞があるように見える程度。

## 表面のつくり
- 外節の外面はなめらかな膜。円板は膜の内側にあり、表面には出ていない。【全文】[WV-Photo]
- 外節の先端は、色素上皮の細い突起（微絨毛）に包まれる。【全文】[WV-Photo][WV-RPE]
- 内節は、外境界膜の高さでミュラー細胞と接着帯で結ばれる。【全文】[WV-Glia]

## 内部に見えるもの
- 外節：円板の積み重ね（横縞）。円板の膜に、視物質ロドプシンが高い密度で埋まる（マウスで膜 1 µm² あたり 約 24,000分子）。【全文】[Nickell2007]
- 内節：長く細いミトコンドリアが、長軸に沿ってぎっしり並ぶ。サルの桿体では、エリプソイドの体積の 54〜66% がミトコンドリア。【全文】[WV-Photo]【要旨】[Hoang2002]
- 細胞体：核。

## 色と透け具合（生体での見え方）
- 細胞そのものは無色透明に近い。生体の眼底では、桿体の層は透けていて、1本ずつは見えない（補償光学を使うと見える）。
- 外節には視物質**ロドプシン（視紅）**がある。ロドプシンは青緑の光（約 500 nm）を最もよく吸収するので、**赤紫色（ばら色がかった紫）**に見える。
  名前はギリシャ語の「ばら」に由来する。【全文】[Wiki-Rhodopsin]
  → 暗い所で休んでいる桿体の外節は、淡い赤紫色を帯びる。光を受けると色が抜ける（退色）。
  退色の途中で黄色を経て無色になる、という細部は【未確認】。
- 1本の外節の色の濃さ（どのくらい淡いか）：【未確認】。直径 2 µm と細いので、1本ではごく淡く、束になって初めて色が分かる程度と考えられるが、資料では確かめていない。

## 動き方（速度などの数値があれば）
- 位置は動かない。
- 外節は絶えず作り直される。新しい円板が根元（線毛の所）で足され、古い円板は先端へ押し上げられ、先端のひとかたまりがちぎれて
  色素上皮に食べられる。桿体では、朝、明るくなった直後にまとめて起きる。【全文】[WV-Photo]
- 作り直しの速さ（1日に何枚、何日で全部入れ替わるか）：【未確認】
- 光への感度：光子1個に反応できる。錐体の約 100倍 敏感。【全文】[Wiki-Rod][WV-Photo]

## 周囲との並び方（密度・間隔・向き）
- 総数：ヒトの網膜1枚に平均 9,200万個（7,790万〜1億730万）。【要旨】[Curcio1990]　別資料で 1.1〜1.25億。【全文】[WV-Facts]
- **中心窩にはない**。桿体のない領域の直径は平均 0.35 mm（資料により 0.25〜0.75 mm）。【要旨】[Curcio1990]【全文】[WV-Facts]
- 密度は中心窩から外へ急に増え、中心から 約 4.5〜5 mm（18度）の輪で最大 約 160,000個/mm²。そこから周辺へゆっくり減る。
  全体の平均は 80,000〜100,000個/mm²。【全文】[WV-Facts][WV-Photo]【要旨】[Curcio1990]
- 中心どうしの間隔：密度 160,000/mm² で 約 2.7 µm、100,000/mm² で 約 3.4 µm（六角形に詰めた場合）。【計算】
  → 直径 2 µm の円柱が、ほぼすき間なく立ち並ぶ。
- 中心窩の外では、太い錐体1個の周りを、細い桿体が輪になって囲む。【全文】[WV-Photo]
  霊長類の錐体モザイクの写真でも、大きな錐体の周りを小さな多角形（桿体）が敷き詰めている。【画像】（Webvision Photoreceptors Fig. 17。染色標本なので色は不採用）
- 向き：長軸を光の来る向きにそろえて、網膜の面に垂直に立つ。外節の先が色素上皮側、シナプスが硝子体側。光は細胞体の側から入って外節に届く。【全文】[WV-Simple]
- 色素上皮の細胞1個が、周辺部で桿体 約 22本、密度の高い輪で 約 28本を受け持つ。【全文】[WV-Facts]

## 体の中での働き
- 暗い所での視覚（薄明かり・夜）。色の区別はしない。最もよく感じる波長は 約 500 nm（青緑）。【全文】[WV-Photo]
- 光がロドプシンに当たると、中のレチナールの形が変わり（11-シス → オールトランス）、信号の連鎖が始まる。【全文】[WV-Photo]

## ほかの細胞との関係
- 網膜色素上皮：外節の先端を包み、ちぎれた古い円板を食べて分解する。視物質の部品（レチナール）を作り直して返す。【全文】[WV-Photo][WV-RPE]
- ミュラー細胞：外境界膜で接着する。【全文】[WV-Glia]
- 双極細胞・水平細胞：小球でシナプスを作る。隣の錐体とはギャップ結合でつながる。【全文】[WV-Photo]
- 血管：桿体の層には血管がない。酸素は色素上皮の向こうの脈絡毛細血管板から来る。【全文】[WV-Simple]
- **病気のとき**：網膜剥離では外節が崩れて短くなる（戻せば回復しうる）。網膜色素変性では周辺部の桿体から変性が始まり、
  夜盲から視野が狭くなる。【全文】[WV-Detach][WV-Simple]

## 初登場時の説明文の案（1〜2文、専門用語には言い換えを添える。大人向けの落ち着いた口調）
「桿体（かんたい）。暗い所で光を感じる細胞で、太さは髪の毛の約40分の1。先端の外節には、光を捉える膜の円板が
およそ千枚も積み重なり、わずかな光も逃しません。片目に約1億個が並んでいます。」

## 出所一覧
- [WV-Photo] Kolb H. Photoreceptors. Webvision. https://webvision.med.utah.edu/book/part-ii-anatomy-and-physiology-of-the-retina/photoreceptors/
- [WV-Facts] https://webvision.med.utah.edu/book/part-xiii-facts-and-figures-concerning-the-human-retina/
- [WV-Simple] https://webvision.med.utah.edu/book/part-i-foundations/simple-anatomy-of-the-retina/
- [WV-RPE] https://webvision.med.utah.edu/book/part-ii-anatomy-and-physiology-of-the-retina/the-retinal-pigment-epithelium/
- [WV-Glia] https://webvision.med.utah.edu/book/part-ii-anatomy-and-physiology-of-the-retina/glial-cells-of-the-retina/
- [WV-Detach] https://webvision.med.utah.edu/book/part-xii-cell-biology-of-retinal-degenerations/cellular-remodeling-in-mammalian-retina-induced-by-retinal-detachment/
- [Curcio1990] Curcio CA ほか. Human photoreceptor topography. J Comp Neurol 1990. https://pubmed.ncbi.nlm.nih.gov/2324310/
- [Hoang2002] Hoang QV ほか. Photoreceptor inner segments in monkey and human retina. Vis Neurosci 2002. https://pubmed.ncbi.nlm.nih.gov/12511073/
- [Nickell2007] Nickell S ほか. Three-dimensional architecture of murine rod outer segments determined by cryoelectron tomography. J Cell Biol 2007. https://pmc.ncbi.nlm.nih.gov/articles/PMC2064290/
- [Poege2021] Pöge M ほか. Determinants shaping the nanoscale architecture of the mouse rod outer segment. eLife 2021. https://pmc.ncbi.nlm.nih.gov/articles/PMC8758146/
- [BioNumbers-ROS] https://bionumbers.hms.harvard.edu/bionumber.aspx?id=109779 ／ [BioNumbers-Disc] https://bionumbers.hms.harvard.edu/bionumber.aspx?id=109782
- [OpenStax] https://openstax.org/books/anatomy-and-physiology-2e/pages/14-1-sensory-perception
- [Wiki-Rod] https://en.wikipedia.org/wiki/Rod_cell ／ [Wiki-Rhodopsin] https://en.wikipedia.org/wiki/Rhodopsin

## 確認の方法と未確認の点
- **確認の方法**：寸法は文章の記述から書いた。並び方は、霊長類の錐体モザイクの写真（Webvision Fig. 17）を画像として見て、
  錐体の周りを桿体が囲む様子を確かめた。桿体1本の縦の姿（電子顕微鏡写真）は、ページの図として存在するが、画像としては見ていない。
  生きた人の桿体の画像（補償光学）は見ていない。
- **未確認の点**：
  - ヒトの桿体の円板の実測の枚数（約 900枚は計算値）。ヒトでの円板の間隔。
  - 内節の長さ、細胞全体の長さ、核の大きさ。
  - 外節の作り直しの速さ。
  - 1本の外節の色の濃さ、退色の途中の色。
- **食い違い**：総数は 9,200万（Curcio 1990）と 1.1〜1.25億（Osterberg 1935）。外節の長さは 25 µm と 20 µm。
  円板の数は「1,000枚超」「最大 2,000枚」（種を問わない一般値）と、マウス実測 810枚。ヒトは 約 900〜1,000枚として扱う。
