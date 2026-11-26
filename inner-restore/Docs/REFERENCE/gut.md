# 腸（ステージ4）の資料

調査日：2026-11-26。ステージ4「腸」に登場させるもの（絨毛の草原、陰窩、吸収上皮細胞と微絨毛、粘液の層、パネート細胞、腸内細菌の群れ、短鎖脂肪酸、ぜん動）の、実際の構造・大きさ・動き・見え方・不調の仕組みをまとめた。
対象ごとの「形の仕様書」は `atlas/` にある（末尾の一覧を参照）。台帳の下書きは `atlas_gut_draft.json`。

## この文書の読み方

各記述の末尾に、確かめ方の印を付けた（`eye.md`・`nose.md`・`lung.md` と同じ）。

- 【全文】… 資料の本文を取得して、該当箇所を自分で読んだ。
- 【要旨】… 論文の要旨（アブストラクト）だけを読んだ。本文は読めていない。
- 【抜粋】… 検索結果に出た抜粋だけで確認した。本文は読めていない。採用前に再確認が望ましい。
- 【計算】… 資料の数値から、この文書の中で計算した値。資料に直接は書かれていない。
- 【未確認】… 今回の調査では出所を確かめられなかった。事実として使わないこと。

調査の制約：
- PubMed の要旨と PubMed Central（PMC）のオープンアクセス本文は、NCBI の公開 API（E-utilities）で取得した。Europe PMC の検索 API も使った。
- Wikipedia は本文を取得できた（要約つきの取得。数値は原文の引用で確かめた）。【全文】と書いたものの一部はこの方法による。
- NCBI Bookshelf（StatPearls）、PMC の図表ページ、Britannica、一部の大学の教材サイトは自動取得を拒否された（403／503）。絨毛の太さ・密度、細菌の大きさの一部は抜粋に頼っている。
- Wikimedia Commons の API は回数制限（429）がかかった。ファイルの説明ページ（ライセンス・作者）だけを読み、**画像そのものは今回1枚も見ていない**。
- 粘液の層の研究の多くはマウス・ラット。ヒトの値ではないものには「（マウス）」「（ラット）」と書いた。

---

## 1. 全体の構造：小腸と大腸

- 小腸の長さ：十二指腸 20〜25 cm、空腸 約2.5 m、回腸 約3 m。成人の直径 2.5〜3 cm。【全文】[Wiki-SI]
  挿管や X 線の研究のまとめでは、口から肛門まで 約5 m、その3分の2が小腸。人による差が大きい。内径の平均は小腸 2.5 cm、大腸 4.8 cm。【要旨】[Helander2014]
- 内側の表面積：消化管全体で 約 **32 m²**、うち大腸は 約2 m²。教科書によくある「テニスコート（260〜300 m²）」は大きすぎ、実際は「バドミントンコートの半分」。【要旨】[Helander2014]
  Wikipedia（小腸）は 約30 m²。【全文】[Wiki-SI]　300〜400 m² とする古い記述も残る。【全文】[Gelberg2017]
- 面積を増やす3段のしくみ：①輪状ひだ（小腸の壁の常設のひだ）で 約1.6倍、②絨毛と③微絨毛を合わせて 60〜120倍。大腸には絨毛がなく、微絨毛で 約6.5倍。【要旨】[Helander2014]
- 小腸の粘膜：外へ突き出す「ひだ・絨毛」と、内へくぼむ短い管「陰窩（いんか）」からなる。陰窩は幹細胞（新しい細胞のもと）の守られた住みか。【全文】[SIU-SI]
- 十二指腸の絨毛はやや平たく、空腸の絨毛は長く指の形に近い。【全文】[SIU-SI]　絨毛は空腸でいちばん高く、十二指腸では高さがばらつく。【全文】[PathOutlines-SI]
- 絨毛の高さと陰窩の深さは、口から遠い側（下流）ほど低くなり、杯細胞（粘液をつくる細胞）は増える。【全文】[Gelberg2017][PathOutlines-SI]
- 大腸には絨毛がなく、陰窩が並ぶ平らな面。大腸の陰窩は 1 mm² に約100個、1個に 約1,725〜2,530個の細胞（別の資料で1,500〜4,900個）、底に幹細胞が 5〜6個。【全文】[Wiki-Crypt]
  → 陰窩の口どうしの間隔はおよそ 100 µm。【計算】（1 mm² に100個 → 1個あたり 0.01 mm²）

ゲーム内の尺度の目安（主人公 2 µm、髪の毛 約70〜80 µm、赤血球 約7.8 µm）：

| もの | 大きさ | 比べると |
|---|---|---|
| 絨毛の高さ | 約 0.5〜1.6 mm（空腸で 0.35〜0.6 mm とする資料も） | 主人公 約175〜800人分、髪の毛 約5〜20本分【計算】 |
| 絨毛の太さ | 約 110〜135 µm（空腸、抜粋） | 髪の毛 約1.5〜2本分【計算】 |
| 絨毛どうしの間隔 | 1 mm² に 20〜40本（抜粋）→ 中心間 約 160〜220 µm | すき間は 数十〜100 µm ほど【計算】 |
| 大腸の陰窩の口の間隔 | 約 100 µm | 髪の毛 約1.3本分【計算】 |
| 吸収上皮細胞の幅 | 約 11 µm（模型研究の値、抜粋） | 赤血球 約1.4個分【計算】 |
| 微絨毛 | 長さ 約1 µm（1〜3 µm）、太さ 約0.1 µm | 主人公の半分の高さの細い毛【計算】 |
| 糖衣（微絨毛の先の綿毛状の膜） | 約 1 µm | 微絨毛の長さとほぼ同じ |
| 大腸の内側の粘液層（ヒト） | 200〜300 µm | 主人公 約100〜150人分【計算】 |
| アッカーマンシア | 約 0.6×0.7 µm の楕円（抜粋） | 主人公の 約3分の1【計算】 |
| バクテロイデス | 幅 0.5〜0.8 µm、長さ 1.5〜4.5 µm の棒（抜粋） | 主人公とほぼ同じ長さの細い棒【計算】 |
| ビフィズス菌 | 幅 0.5〜1.3 µm、長さ 1.5〜8 µm（抜粋）。枝分かれやY字 | 主人公と同じ〜4倍ほど【計算】 |
| 大腸菌 | 長さ 約2 µm、太さ 0.25〜1.0 µm | 主人公と同じ長さ【計算】 |

---

## 2. 絨毛（じゅうもう）：草原の「草」

- 小腸の内側から突き出す、指のような小さな突起。壁は細胞1層。【全文】[Wiki-Villus]
- **高さ**：ヒトで 約 **0.5〜1.6 mm**。【全文】[Wiki-Villus]　「約 0.5 mm の指のようなひだ」。【全文】[Crawley2014]　空腸で高さ 350〜600 µm、直径 110〜135 µm。【抜粋】[Britannica]
  インドネシアの小規模な研究では、空腸 約342 µm、回腸末端 約235 µm（人数が少なく参考程度）。【抜粋】
- **絨毛と陰窩の長さの比**：3〜5 対 1。【全文】[PathOutlines-SI]
- **密度**：1 mm² に 20〜40本（部位の記載なし）。【抜粋】（出所の教材サイトは取得拒否）　→ 中心どうしの間隔 約 160〜220 µm。【計算】
  健康な成人の空腸・回腸の計測研究（24例・25例）は、絨毛の高さ・幅・陰窩の密度を測り、空腸と回腸で高さに有意な差はないとした。数値の表は読めていない。【要旨】[Trbojevic2010]
- 形：鉛筆のような細い絨毛と、木の葉のような平たい絨毛がある。【全文】[Ensari2018]
- 中身：中心に細い動脈が1本上がり、先端で毛細血管の房に分かれる。静脈は上3分の1あたりから始まる。中央にリンパ管（乳び管）が1本通る。【全文】[Ensari2018][SIU-SI]
- **動く**：絨毛の芯には縦に並ぶ平滑筋があり、1本ずつ縮むと考えられている。標本で見える「もみの木」のような段々の輪郭や、走査電顕で見える横じわがその跡とされる。【全文】[Ensari2018]　ただし「縮む」は推定を含む。【全文】[SIU-SI]（"presumably" と書かれている）
  縮む速さ・回数：【未確認】
- 上皮は先端へ向かって押し上げられ、約5日で先端からはがれ落ちる。【全文】[Ensari2018]　はがれる場所が本当に先端だけかは、まだはっきりしない。【全文】[Ensari2018]
  → 0.5 mm を4〜5日で上るとすると、細胞は1時間に 約4〜5 µm 進む（主人公の背丈2つ分ほど）。【計算】

---

## 3. 陰窩（いんか）と、上皮の入れ替わり

- 陰窩は、絨毛の根元のあいだに開く小さな井戸。底に幹細胞があり、上皮のすべての細胞はここから生まれる。【全文】[Ensari2018][SIU-SI]
- 小腸の上皮の細胞：吸収上皮細胞（80%以上）、杯細胞、内分泌細胞、パネート細胞、房細胞（タフト細胞）、M細胞など。【全文】[Ensari2018][Wiki-IE]
- **入れ替わり**：上皮は 4〜5日ごとに入れ替わる。【全文】[Wiki-IE]　分化した細胞は3〜5日で先端に達してはがれる。【全文】[Wallaeys2023]　陰窩から表面まで3〜8日。【全文】[PathOutlines-SI]　吸収細胞と杯細胞は 約4日ごとにすべて入れ替わる。【全文】[SIU-SI]
- 陰窩の上部の細胞は、2日ほど増えながら成熟する（増殖帯）。【全文】[Wallaeys2023]
- 大腸の陰窩：長さ 約75〜110細胞、周囲 約23細胞。【全文】[Wiki-Crypt]

---

## 4. 吸収上皮細胞と微絨毛（刷子縁）

### 吸収上皮細胞（エンテロサイト）
- 単層の円柱上皮（背の高い柱の形の細胞が1列に並ぶ）。【全文】[Wiki-Enterocyte]　栄養を吸収する唯一の細胞で、上皮でいちばん数が多い。【全文】[Crawley2014]
- 働き：ナトリウム・カルシウム・鉄などのイオン、水、糖・ペプチド・アミノ酸・脂質の吸収。回腸で胆汁酸やビタミンB12を取りこむ。【全文】[Wiki-Enterocyte]
- 大きさ：ヒト空腸の模型研究で、細胞の上端（密着結合の高さ）の半径 5.5 µm、細胞の体積 約 2,450 µm³。【抜粋】[Pappenheimer2003]　別の計測で体積 約 1,400 µm³。【抜粋】[Crowe1993]（BioNumbers 経由）
  → 幅 約 11 µm。体積から逆算すると、高さはおよそ 15〜26 µm（円柱とみなした場合）。【計算】（模型の値なので参考程度）
  直接測った高さ：【未確認】
- セリアック病（小麦のたんぱくへの過敏）では、細胞が背の低い立方形になり、体積が小さくなる。【要旨】[Crowe1993]

### 微絨毛と刷子縁
- 吸収上皮細胞の頭の面に、細い毛のような突起（微絨毛）がびっしり並ぶ。この並びを「刷子縁（ブラシの縁）」と呼ぶ。【全文】[Wiki-Microvillus]
- **長さ 約1 µm、太さ 約0.1 µm**。【全文】[Wiki-Villus][Ensari2018]（Commons の電顕写真の説明文も同じ値）
  資料による幅：部位により 1〜3 µm、太さ 約100 nm。【全文】[Crawley2014]　1.5〜2 µm。【全文】[PathOutlines-SI]　長さはそろっている。【全文】[Wiki-Microvillus][BioNumbers111734]
- 正面から見ると、**六角形の格子**のようにきちんと詰まって並ぶ。先端どうしが接着たんぱくでつながり、そろった長さと密な並びを保つ。【全文】[Crawley2014]
- 芯は、アクチン（細胞の骨組みをつくるたんぱくの糸）の束。20〜30本【全文】[Wiki-Microvillus]、または 30〜40本で、先端から見て時計回りにわずかにねじれる。【全文】[Crawley2014]
- 先端から小さな袋（小胞）を放出する。【全文】[Crawley2014]
- **1細胞あたりの数**：「約 3,6000（±450）本」（未発表データ。桁の誤記で 3,600 本か 36,000 本か判断できない）【全文】[Ensari2018]　「約600本」（動物種の記載なし）【全文】[Gelberg2017]　→ 食い違いが大きい。【未確認】
  微絨毛による面積の増加は 約10〜20倍。【全文】[Ensari2018]
- **糖衣（グリコカリックス）**：微絨毛の表面を覆う、糖の多い綿毛のような膜。膜を貫く粘液たんぱく（MUC3・MUC12・MUC17）でできていて、刷子縁から 約 **1 µm** 外へ伸びる。細菌は通りにくく、消化途中の栄養は通りやすいと考えられる（すき間の大きさは未研究）。【全文】[Pelaseyed2014][Johansson2013]
  糖衣には糖やたんぱくを分解する酵素がある。【全文】[Wiki-Enterocyte]

---

## 5. 杯細胞と粘液の層（小腸は1層、大腸は2層）

- 杯細胞は粘液をつくり、上皮を中身から守り、すべりをよくする。【全文】[Wiki-IE]　回腸の下部に向かって多くなり、絨毛の先端に向かっては減る。【全文】[PathOutlines-SI]
  （杯細胞の形は鼻の資料 `atlas/goblet_cell.md` が使える）
- 主成分は大きな糖たんぱく MUC2。【要旨】[Johansson2008]
- **正常な粘液は完全に透明**で、扱うとすぐ縮んでしまうため、長く研究が遅れた。【全文】[Pelaseyed2014]　生体の観察でも「半透明で切れ目なく続く」。【要旨】[Atuma2001]（ラット）

### 小腸：1層のゆるい粘液
- 小腸の粘液は1層だけで、上皮にくっついておらず、簡単に取り除ける。絨毛のあいだを満たし、ふつうは絨毛の先も覆う。【全文】[Pelaseyed2014]
- 細菌が通り抜けられるが、拡散を妨げる壁として働く。細菌が上皮に届くには、粘液の流れに逆らって進まなければならない。ふつう細菌が上皮に触れるのは絨毛の先端だけ。【全文】[Pelaseyed2014]
- 抗菌物質（パネート細胞と吸収上皮細胞が出す）を高い濃度で含み、上皮とパイエル板に届く細菌の数を抑える。【全文】[Pelaseyed2014][Johansson2013]
- 厚さ（ラットの生体）：空腸で全体 約 123 µm。しっかりくっついた層は 約 20 µm か、ない。【要旨】[Atuma2001]

### 大腸：2層の粘液
- 内側の層：**密で、上皮にしっかりくっつき、細菌がいない**。外側の層：内側の層がゆるんでふくらんだもので、動きやすく、細菌がすむ。2層のたんぱくの組成は同じ。【要旨】[Johansson2008]（マウス）
- 厚さ：マウスの遠位大腸で内側の層 約 50 µm、ヒトで **200〜300 µm**。【全文】[Pelaseyed2014]　「マウスで50 µm、ヒトで数百 µm、細菌と上皮を隔てる」。【全文】[Johansson2013]
  ラットの生体：大腸の粘液は全体 約 830 µm（消化管でいちばん厚い）、しっかりくっついた層 約 116 µm。【要旨】[Atuma2001]
  マウスでは2層合わせて上皮から 150 µm。【要旨】[Johansson2008]
- 内側の層は、**0.5 µm の粒まで通さない**（細菌と同じ大きさのビーズで確かめた）。もっと小さな分子は通る。【全文】[Pelaseyed2014]
- ヒトの S 状結腸の生検でも、内側の層が細菌やビーズを上皮から隔てていた。【要旨】[Johansson2014]
- **入れ替わり**：内側の層は、表面の杯細胞が上皮の側から絶えず足していて、**1〜2時間ごと**（約1時間）に入れ替わる。この速さが細菌を寄せつけない理由のひとつ。【全文】[Pelaseyed2014][Johansson2013]（マウス）
- 陰窩の上部の杯細胞は粘液を大量にためていて、危険があると一度に放出し、陰窩に入った細菌を洗い流す（血流が止まったあとの実験）。粘液の顆粒の入れ替わりは表面の杯細胞で 約3時間、陰窩の杯細胞で 6〜8時間。【全文】[Johansson2013][Pelaseyed2014]（マウス）
- **粘液がないと**：MUC2 を欠くマウスでは、細菌が上皮にじかに触れ、陰窩の奥まで入り、炎症とがんが起こる。【要旨】[Johansson2008]

---

## 6. パネート細胞：陰窩の底の門番

- 小腸全体と虫垂の、陰窩の底にいる。幹細胞のあいだに挟まって並ぶ。【全文】[Wiki-Paneth][Wallaeys2023]
- 1つの陰窩に平均 **5〜12個**（ヒト）。【全文】[Wiki-Paneth]　マウスでは 5〜16個。【全文】[Wallaeys2023]　小腸の下流ほど多い。【全文】[PathOutlines-SI][Wallaeys2023]
- **形**：ピラミッド形（底が広く、頭がすぼまる）。粗面小胞体とゴルジ体が発達し、頭の側に分泌顆粒が集まる。【全文】[Wallaeys2023]
  大きく、光をよく屈折する顆粒が細胞の大部分を占める。【全文】[Wiki-Paneth]
  細胞と顆粒の寸法：【未確認】
- **顆粒の中身**：αディフェンシン（細菌の膜に穴をあける小さなたんぱく。ヒトでは HD5 と HD6）、リゾチーム（細菌の壁を溶かす酵素）など。【全文】[Wiki-Paneth][Wallaeys2023]
  HD6 は、自分で集まって**細い網（ナノネット）**をつくり、細菌を捕まえる。【全文】[Wallaeys2023]
- **放出**：細菌やその成分、神経の伝達物質に似た薬で顆粒を陰窩の中へ放出する。マウスでは薬の注射から 7分後に放出が見えた。【全文】[Wallaeys2023]（Commons の図の説明文）
- 寿命：約57日【全文】[Wiki-Paneth]、約2か月【全文】[Wallaeys2023]（上皮の中でいちばん長い）。約21日とする資料もある（動物種の記載なし）。【全文】[Gelberg2017]
- 陰窩の粘液はパネート細胞の分泌物と混ざり、陰窩をふつう**無菌**に保つ。【全文】[Pelaseyed2014][Johansson2013]
- 不調のとき：クローン病の回腸でパネート細胞の死が増える、顆粒の形がくずれる、などの報告。【全文】[Wallaeys2023]

---

## 7. M細胞とパイエル板（短く）

- パイエル板は、リンパ球の集まり（リンパ濾胞）が粘膜にまとまったもの。ヒトでは楕円形で、回腸にいくほど多く、少なくとも46%が回腸の最後の 25 cm に集まる。数は胎児で 約60、思春期に最大 約240、その後減る。【全文】[Jung2010]
- 表面は「濾胞関連上皮」というドーム状の上皮で覆われ、粘液が少なく、消化酵素も少ない。ここに M細胞（microfold：小さなひだの細胞）がいる。【全文】[Jung2010]
- M細胞は、腸の中身から抗原（免疫が見分ける目印）を取りこみ、下の免疫細胞へ渡す。【全文】[Wiki-IE][SIU-SI]　底にくぼみがあり、そこにリンパ球が入る。【全文】[Gelberg2017]
- 濾胞関連上皮は絨毛の上皮と違い、立方形の細胞。【全文】[SIU-SI]　パイエル板の近くの絨毛は短く、ゆがむことがある。【全文】[PathOutlines-SI]

---

## 8. 密着結合（細胞どうしの継ぎ目）

- 上皮の細胞どうしを頭の側でぴったり閉じる帯。主にクローディンとオクルディンという膜たんぱくでできている（約35種類のたんぱくが関わる）。【全文】[Wiki-IE]
- 細胞のすき間を通る道（傍細胞路）を調節し、イオンは通すが大きな分子は通さない。【全文】[Wiki-IE][Gelberg2017]
- 見た目：細胞の頭の面のふちを取り巻く、細い継ぎ目の線として描くのが実際に近い。【計算】（太さの数値は今回確かめていない【未確認】）

---

## 9. 腸内細菌：場所ごとの数

- 中身 1 mL あたりの細菌の数（目安）：【全文】[Sender2016]（表1）

| 場所 | 細菌の濃度 | 細菌どうしの平均の間隔 |
|---|---|---|
| 胃・十二指腸・空腸 | 10³〜10⁴ 個/mL | 約 0.5〜1 mm【計算】 |
| 回腸 | 10⁸ 個/mL | 約 20 µm【計算】 |
| 大腸 | **10¹¹ 個/mL** | 約 **2 µm**【計算】 |

  （間隔は 1 mL ＝ 10¹² µm³ を細菌の数で割り、その立方根をとった。均一に散らばると仮定）
  → 大腸の中身では、細菌が**主人公の背丈ほどの間隔で**ぎっしり詰まっている。【計算】
- 胃と小腸の上部で少ないのは、胃の強い酸と、中身の流れが速いため。【全文】[Sender2016]
- 体全体の細菌は 約 3.8×10¹³個（ヒトの細胞の数と同じくらい）、重さ 約 0.2 kg。ほぼすべてが大腸にいる。大腸の中身 約 0.4 L、その重さの 約半分が細菌。【全文】[Sender2016]
- 腸の細菌の平均の重さは 約 5 pg（湿重量）で、教科書の「1 µm³・1 pg」より数倍大きい。【全文】[Sender2016]
- 粘液の中の分布：小腸では粘液を細菌が通れるが、大腸の内側の層には細菌がいない（第5節）。

---

## 10. 代表的な常在菌（実在の属・種）

| 名前 | 形 | 大きさ | 酸素 | すむ所・特徴 |
|---|---|---|---|---|
| バクテロイデス属 *Bacteroides* | 胞子をつくらない棒（桿菌）。種によっては形がふぞろい | 幅 0.5〜0.8 µm × 長さ 1.5〜4.5 µm【抜粋】（*B. fragilis* で 0.5〜1.5 × 1.0〜6.0 µm【抜粋】） | 偏性嫌気性（酸素があると育たない）。一時的には耐える | 糞便 1 g に 10¹⁰〜10¹¹個。植物や宿主の多糖を食べ、酢酸・プロピオン酸をつくる【全文】[Wiki-Bacteroides] |
| ビフィズス菌（ビフィドバクテリウム属）*Bifidobacterium* | 枝分かれした棒、Y字・V字、こん棒状。条件でまっすぐな棒にも変わる | 0.5〜1.3 × 1.5〜8.0 µm【抜粋】 | 嫌気性 | 赤ちゃんの腸でいちばん多い属。母乳のオリゴ糖を分解する株がある【全文】[Wiki-Bifido] |
| アッカーマンシア・ムシニフィラ *Akkermansia muciniphila* | 楕円（卵形）。1個または2個で並ぶ | 粘液で育てると 約 0.64 × 0.69 µm【抜粋】 | 偏性嫌気性 | 粘液の中にすむ。粘液を唯一の食べ物にできる。全体の 1〜4%【全文】[Zhang2019] |
| フィーカリバクテリウム・プラウスニッツィイ *Faecalibacterium prausnitzii* | 棒 | 【未確認】 | 酸素にきわめて弱い | 健康な成人で全体の 約5%（最大15%）。酪酸をつくる主な菌【全文】[Wiki-Faecali] |
| ラクトバチルス属（乳酸桿菌）*Lactobacillus* | 棒 | 【未確認】 | 酸素に耐える嫌気性 | 乳酸をつくる。2020年に多くの種が別の属に分けられた【全文】[Wiki-Lacto] |
| 大腸菌 *Escherichia coli* | 棒。周りじゅうに鞭毛があり泳ぐ | 長さ 約2 µm、太さ 0.25〜1.0 µm【全文】 | 通性嫌気性（酸素があってもなくても育つ） | 腸の細菌の 約0.1%。ほとんどの株は無害【全文】[Wiki-Ecoli] |

### 補足
- **バクテロイデス**：グラム陰性、運動するかしないかは種による。*B. fragilis* は日和見病原体（体が弱ったときや腸の壁が傷ついたときに病気を起こす）。【全文】[Wiki-Bacteroides][Commons の CDC 写真の説明文]
  細胞の大きさは育つ条件ですみかによって変わり、長さ 1〜10 µm の幅があるとの2025年の研究。【抜粋】
- **ビフィズス菌**：グラム陽性、運動しない。名前の「ビフィド」は「二つに分かれた」の意で、最初の分離株がY字形だったことから。【全文】[Wiki-Bifido]
  ただし枝分かれは属全体の性質ではない。*B. adolescentis* はどんな条件でもY字を保つが、*B. animalis* はずっと棒のまま。塩・pH・カルシウムで形が変わる。【全文】[Dhanashree2017]
  乳児の腸の菌は3歳ごろに大人の構成になる。【全文】[Wiki-Bifido]
- **アッカーマンシア**：2004年にオランダの Derrien と de Vos が発見。グラム陰性、運動しない、胞子をつくらない。粘液の上で育つと莢膜（細胞を包む膜）をつくり、かたまりになる。【要旨】[Derrien2004]　粘液で育てると表面に糸のような構造が見える。【抜粋】
  BHI 培地では 約 0.83 µm × 1 µm と、条件で大きさが変わる。【抜粋】
  盲腸で最も多い。90%ほどの健康な人がもつ。生後1年で大人と同じ量になり、高齢で減る。【全文】[Zhang2019][Wiki-Akk]
  肥満・2型糖尿病・腸の炎症（潰瘍性大腸炎）で少ないという報告が多いが、逆の報告（2型糖尿病で多い）や、関係なしとする報告もある。ヒトで「原因」かは確かめられていない。【全文】[Zhang2019][Wiki-Akk]
- **フィーカリバクテリウム**：クローン病（腸の慢性の炎症）の手術後の再発が多い人で、この菌が少ない。培養細胞やマウスでは炎症を抑える働きが見られた。【要旨】[Sokol2008]　酪酸・ギ酸・D-乳酸をつくり、水素はつくらない。【要旨】[Duncan2002]
- **「善玉菌」という言葉**：科学の分類名ではない。ビフィズス菌を潰瘍性大腸炎の治療に足すと寛解（症状が落ち着くこと）が多い、という関連の報告はあるが、過敏性腸症候群への効果ははっきりしない。【全文】[Wiki-Bifido]
  → ゲームでは「腸の壁を守る側に働く菌」という言い方にし、薬のような効き目は約束しない。

---

## 11. 短鎖脂肪酸と酪酸

- 腸内細菌が、食物繊維など消化されずに届いた炭水化物を発酵させてつくる。主なものは酢酸・プロピオン酸・酪酸。【全文】[Wiki-SCFA]
- 濃度（ヒト、急死した人の解剖）：回腸の終わりで 13 mmol/kg と少なく、大腸では盲腸 131 → 下行結腸 80 mmol/kg と下流ほど減る。pH は盲腸 5.6 → 下行結腸 6.6（酸が多いほど pH が低い）。どこでも酢酸が最も多い。【要旨】[Cummings1987]
  → 発酵は主に盲腸と上行結腸で起こる。【要旨】[Cummings1987]
  血液に移ると、酪酸は大腸の上皮が、プロピオン酸は肝臓が多く取りこむ。【要旨】[Cummings1987]
  酢酸・プロピオン酸・酪酸の比率（よく引かれる 60:20:20 など）：【未確認】
- **酪酸は大腸上皮のおもな燃料**：ヒトの大腸上皮細胞を取り出して調べると、酪酸だけを与えたときの酸素消費の **73%（上行結腸）、75%（下行結腸）** が酪酸による。ブドウ糖があっても 59%・72%。【要旨】[Roediger1980]　「酪酸は大腸上皮のおもなエネルギー源」。【全文】[Wiki-SCFA]
- 酪酸をつくる代表：フィーカリバクテリウム・プラウスニッツィイ。【全文】[Wiki-Faecali]
- 酪酸には炎症を抑える働きなどがある。【全文】[Wiki-Faecali]（詳しい仕組みは今回確かめていない）
- 酪酸そのものは小さな分子で、目には見えない。【計算】→ ゲームでは「光の粒」などの表現にとどめ、見える物体として置かない方が事実に沿う。

---

## 12. 不調のとき（ディスバイオシス：菌のバランスの乱れ と 炎症）

事実と仮説を分けて書く。

### 事実として観察されていること
- **粘液が細菌を通すようになる**：腸炎を起こすマウスのモデルはどれも、細菌が上皮に触れていた。活動期の潰瘍性大腸炎の患者の粘液は細菌の大きさのビーズをよく通し、寛解期の多くの患者では正常に近かった。【要旨】[Johansson2014]
  内側の粘液層を細菌が通れるようになると、大量の細菌が上皮に届き、炎症が起こる。【全文】[Pelaseyed2014]
  厚さは正常でも、性質が変わって通すようになるモデルがある（IL-10 を欠くマウス）。【要旨】[Johansson2014]
- **粘膜に細菌が増える**：腸に炎症のある患者の生検では粘膜の細菌が多く、病気が重いほど多い。多いときは厚い細菌の帯が粘膜に張りつく。【要旨】[Swidsinski2002]
- **菌の構成の変化**：炎症のある腸では、酸素に弱い菌（偏性嫌気性菌）が減り、酸素があっても育つ腸内細菌科（大腸菌の仲間）の割合が増える。マウスでは、炎症でできる硝酸を大腸菌が呼吸に使って増える。【要旨】[Winter2013]
  プロテオバクテリア門（大腸菌の仲間を含む大きなグループ）が持続して増えることが、乱れのしるしとされる。【要旨】[Shin2015]
- **食物繊維が足りないと**：食物繊維を与えないマウスでは、細菌が宿主の粘液を食べ物にして、大腸の粘液の壁が削られる。【要旨】[Desai2016]（マウス、人の腸の菌を組み合わせたモデル）
- **好中球と陰窩**：潰瘍性大腸炎の粘膜では、陰窩の形がくずれ、陰窩の中に膿のたまり（陰窩膿瘍）ができ、好中球やリンパ球が多く集まる。【全文】[Wiki-UC]
  内視鏡では粘膜が赤くなり、血管の模様が見えなくなり、もろくなる。【全文】[Wiki-UC]
- **絨毛が平たくなる**：セリアック病、熱帯スプルー、ジアルジアなどの感染で、絨毛の形が大きく変わり、重いと平らになる。これは「萎縮」ではなく組織の作り直しで、原因を除けば戻る。【全文】[Ensari2018]
  炎症性腸疾患（クローン病など）ではリンパ球が増えるが、平らになることはまれ。【全文】[Ensari2018]
- 小腸の「家事係」：空腹時の強い収縮の波（移動性運動群、第13節）が小腸の細菌を大腸へ送り、大腸の菌が回腸へ上がるのを防ぐ。これが弱ると小腸の細菌が増えやすい。【全文】[Wiki-MMC]

### 仮説・まだ確かでないこと
- 「粘液が細菌を通すこと」が多くの大腸の炎症の共通の原因、という考え。【全文】[Pelaseyed2014]（著者は "suggested" と書く）
- 腸の病気で粘膜の菌が変わるのは、炎症の結果ではなく宿主の反応の違いによる、という考え。【要旨】[Swidsinski2002]（"suggest"・"hypothesize"）
- アッカーマンシアやフィーカリバクテリウムを増やすと健康になる、という考え。ヒトでは関連が中心で、原因かどうかは確かでない。【全文】[Zhang2019][Wiki-Akk]【要旨】[Sokol2008]
- プロテオバクテリアの増加を病気のリスクの目印にする、という提案。【要旨】[Shin2015]

### ゲームで見せる違い（資料に沿った描き方）
| | 健康なとき | 不調のとき |
|---|---|---|
| 大腸の粘液 | 透明で厚い内側の層。細菌は外側の層にだけいる | 内側の層が薄く・ゆるくなり、細菌が上皮のすぐ近くまで来る |
| 細菌 | 棒・楕円・Y字のさまざまな形がまざる | 動きまわる棒（大腸菌の仲間）の割合が増え、粘膜に厚い帯をつくる |
| 陰窩 | 口が規則正しく並び、中は無菌 | 形がくずれ、好中球が集まる |
| 小腸の絨毛 | 指や葉の形の草原 | （病気の種類によっては）低く平らになる |
| 色 | 淡いピンクの粘膜に細い血管の網 | 赤みが増し、血管の網が見えにくくなる |

---

## 13. ぜん動と、腸の動き

- **リズムのもと**：腸の壁のカハール介在細胞（ペースメーカー役の細胞）が、ゆっくりした電気の波（徐波）をつくる。【全文】[Wiki-BER]
  頻度：胃 3回/分、十二指腸 11〜12回/分、回腸 9回/分。【全文】[Wiki-BER]
  → 十二指腸で 約5秒、回腸で 約7秒に1回。【計算】
- **ぜん動の波**：数秒続き、「秒速数 cm」で進む。【全文】[Wiki-Peristalsis]（教科書による速さの値は今回確かめていない【未確認】）
- **分節運動**：中身を前に送らず、こね混ぜる収縮。【全文】[Wiki-Peristalsis]
- **移動性運動群（MMC）**：空腹時に胃と小腸で 90〜230分ごとにくり返す。静かな時期（全体の40〜60%）→ 活動が増す時期（20〜30%）→ 数分（5〜10分）の最も強い収縮 → 落ち着く。食事で止まる。【全文】[Wiki-MMC]
- **大腸**：ふだんは収縮が少なく、1日に数回の大きな「総ぜん動（まとめて送る動き）」がある。回数は 1日1〜3回【全文】[Wiki-Peristalsis]、3〜4回【全文】[Wiki-BER] と資料で違う。食事がきっかけになることが多い。
- 大腸を通るのにかかる時間：ヒトで 30〜50時間。【全文】[Gelberg2017]
  小腸を通る時間：【未確認】
- 主人公の尺度では：絨毛の草原は数秒ごとにゆっくり押し寄せる波に揺れ、空腹時には1〜4時間に1度、数分間の強い波が来る。大腸はほとんど静かで、まれに大きな流れが来る。【計算】

---

## 14. 生きた組織の色（染色の色は使わない）

- 粘液：正常な粘液は**完全に透明**。【全文】[Pelaseyed2014]　半透明。【要旨】[Atuma2001]（ラット）
- 粘膜：内視鏡の図の説明で「ピンクの粘膜を背景に、枝分かれした血管の網」（回盲部）。【抜粋】　正常な粘膜は薄く透け、つやがあり、細い血管の網が見える（小児の内視鏡図の説明）。【抜粋】
  潰瘍性大腸炎では赤みが増し、血管の模様が見えなくなる（逆に言えば、正常では血管の模様が見える）。【全文】[Wiki-UC]
- 細胞そのもの：一つ一つは薄く、ほぼ無色に近いと考えられるが、生体での色の記述は確かめていない。【未確認】　ピンクは主に下の血液の色が透けたものと考えるのが自然。【計算】（推測）
- 細菌：生きた細菌そのものの色の記述は見つけていない。【未確認】　参考写真の多くは染色（グラム染色の紫・ピンク）か電顕（白黒）なので、色は使わない。
- パネート細胞の顆粒：「光をよく屈折する」【全文】[Wiki-Paneth] → 生体では、透明な細胞の頭の側に光る粒が詰まって見える、と描くのが資料に沿う。【計算】（「赤い顆粒」は染色の色）

---

## 15. 参考画像（Wikimedia Commons）

画像そのものは見ていない。説明ページのライセンスと作者だけを確かめた。

| ファイル | 内容 | ライセンス | 作者 |
|---|---|---|---|
| https://commons.wikimedia.org/wiki/File:Human_jejunum_microvilli_1_-_TEM.jpg | ヒト空腸の吸収上皮細胞の頭と微絨毛（透過電顕） | PD | Louisa Howard, Katherine Connollly（Dartmouth） |
| https://commons.wikimedia.org/wiki/File:Human_jejunum_microvilli_2_-_TEM.jpg | 同上。密に並ぶ微絨毛（長さ約1 µm、太さ0.1 µm と説明） | PD | Louisa Howard, Katherine Connollly |
| https://commons.wikimedia.org/wiki/File:Human_jejunum_microvilli_3_-_TEM.jpg | 同じシリーズ（ライセンス未確認。同じ作者の PD の可能性） | 【未確認】 | — |
| https://commons.wikimedia.org/wiki/File:The_villi_of_various_parts_of_the_small_intestine._Wellcome_L0001374.jpg | 十二指腸・空腸・回腸の絨毛と陰窩の図（1862年の教科書） | CC BY 4.0 | Wellcome Collection（Conrad Eckhard の教科書より） |
| https://commons.wikimedia.org/wiki/File:Histology_of_paneth_cells,_annotated.jpg | 陰窩の底のパネート細胞（H&E 染色。形と位置だけ参考に） | CC0 | Mikael Häggström |
| https://commons.wikimedia.org/wiki/File:Mouse_Paneth_cell_degranulation.webp | マウスのパネート細胞の顆粒と、放出7分後の陰窩（染色標本） | CC BY 4.0 | M.K. Holly, J.G. Smith（Viruses 2018） |
| https://commons.wikimedia.org/wiki/File:Scanning_electronic_micrograph_of_Akkermansia_muciniphila.png | アッカーマンシアの走査電顕 | CC BY 4.0 | Zhang T, Li Q, Cheng L, Buch H, Zhang F（Microb Biotechnol 2019） |
| https://commons.wikimedia.org/wiki/File:Representative_morphologic_characteristics_of_B._longum_subsp._longum_strains.jpg | ビフィズス菌（*B. longum*）の集落・グラム染色・走査電顕 | CC BY 4.0 | Zhao L ほか（Front Microbiol 2021） |
| https://commons.wikimedia.org/wiki/File:BacteroidesFragilis_Gram.jpg | バクテロイデスのグラム染色（形だけ参考に） | PD（米国政府 CDC） | CDC / Dr. V.R. Dowell, Jr. |

除外したもの（CC BY-SA のため）：`File:Bifidobacterium_pseudocatenulatum_iVE-2.tif`（走査電顕、CC BY-SA 4.0、Synbiotic Health / Auchtun2）、`File:Colonoscopy_splenic_flexure.jpg`（正常な大腸粘膜の内視鏡、CC BY-SA 4.0、melvil）。
見つからなかったもの：ヒトの絨毛の走査電顕（PD/CC0/CC BY）、生きた粘膜の色がわかる内視鏡写真（PD/CC0/CC BY）、大腸の2層の粘液の写真。【未確認】

---

## 16. ゲームの「患者の変化」の案（ブリーフに指定なし）

いずれも穏やかで、資料に沿う変化。病名は出さない。

1. **「おなかの痛みや張りがやわらぎ、お通じが落ち着く」**
   - 根拠：大腸の炎症（潰瘍性大腸炎）のおもな症状は腹痛と下痢。【全文】[Wiki-UC]　炎症のときは粘液が細菌を通し、細菌が上皮に届く。【要旨】[Johansson2014]　寛解期の多くの人では粘液が正常に近い。【要旨】[Johansson2014]
   - 描き方：粘液の層が厚く澄み直り、細菌が上皮から離れる → 患者のおなかが楽になる。
2. **「食欲が戻り、だるさが軽くなる」**
   - 根拠：同じ病気の症状に、食欲の低下とだるさがある。【全文】[Wiki-UC]
   - 描き方：炎症が引く → 食事をとれるようになる。
- 避けること：特定の菌や食品で病気が治ると言い切ること（ヒトでの因果は確かでない。第12節）。「善玉菌が増えたから治った」ではなく、「粘液の壁が戻り、炎症が引いた」を中心に描くのが事実に近い。

---

## 17. 特に確かめられなかった点（まとめ）

- 絨毛の太さ・密度（抜粋のみ）、絨毛が縮む速さ・回数。
- 吸収上皮細胞の高さの実測値（模型の値からの推定のみ）。
- 1細胞あたりの微絨毛の数（資料が大きく食い違う）。
- パネート細胞と顆粒の寸法。
- 密着結合の帯の太さ。
- フィーカリバクテリウム・ラクトバチルスの細胞の大きさ。バクテロイデス・ビフィズス菌・アッカーマンシアの大きさも抜粋のみ。
- 細菌の生体での色、粘膜の生体での色（抜粋のみ）。
- 短鎖脂肪酸の3種の比率。
- 小腸を通る時間、ぜん動の波の速さの教科書値。
- 小腸の粘液の厚さのヒトでの値（ラットの値のみ）。

## 18. 資料間で食い違った数値（まとめ）

| 項目 | 値 | 出所 |
|---|---|---|
| 絨毛の高さ | 0.5〜1.6 mm / 約0.5 mm / 空腸 350〜600 µm / 空腸 約342 µm・回腸 約235 µm | [Wiki-Villus][Crawley2014][Britannica]【抜粋】 |
| 微絨毛の長さ | 約1 µm / 1〜3 µm（部位による） / 1.5〜2 µm | [Wiki-Villus][Ensari2018][Crawley2014][PathOutlines-SI] |
| 微絨毛の芯のアクチン | 20〜30本 / 30〜40本 | [Wiki-Microvillus][Crawley2014] |
| 1細胞の微絨毛 | 「3,6000」（誤記） / 約600 | [Ensari2018][Gelberg2017] |
| 上皮の入れ替わり | 4〜5日 / 3〜5日 / 約4日 / 3〜8日 / 2〜3日 | [Wiki-IE][Wallaeys2023][SIU-SI][PathOutlines-SI][Gelberg2017] |
| パネート細胞の寿命 | 約57日 / 約2か月 / 約21日 | [Wiki-Paneth][Wallaeys2023][Gelberg2017] |
| 消化管の表面積 | 約32 m² / 約30 m² / 260〜300 m² / 300〜400 m² | [Helander2014][Wiki-SI][Gelberg2017] |
| 大腸の内側の粘液層 | ヒト 200〜300 µm / 数百 µm / ラット（くっついた層）約116 µm / マウス 約50 µm | [Pelaseyed2014][Johansson2013][Atuma2001] |
| アッカーマンシアの割合 | 1〜4% / 1〜3% | [Zhang2019][Wiki-Akk] |
| 大腸の総ぜん動 | 1日1〜3回 / 3〜4回 | [Wiki-Peristalsis][Wiki-BER] |

---

## 出所一覧

- [Helander2014] Helander HF, Fändriks L. Surface area of the digestive tract – revisited. Scand J Gastroenterol 2014;49:681–689. https://pubmed.ncbi.nlm.nih.gov/24694282/ （要旨）
- [Crawley2014] Crawley SW, Mooseker MS, Tyska MJ. Shaping the intestinal brush border. J Cell Biol 2014;207:441–451. https://pmc.ncbi.nlm.nih.gov/articles/PMC4242837/ （本文）
- [Ensari2018] Ensari A, Marsh MN. Exploring the villus. Gastroenterol Hepatol Bed Bench 2018;11:181–190. https://pmc.ncbi.nlm.nih.gov/articles/PMC6040026/ （本文）
- [Trbojevic2010] Trbojević-Stanković JB ほか. Morphometric study of healthy jejunal and ileal mucosa in adult and aged subjects. Histol Histopathol 2010;25:153–158. https://pubmed.ncbi.nlm.nih.gov/20017102/ （要旨）
- [Crowe1993] Crowe PT, Marsh MN. Morphometric analysis of small intestinal mucosa. IV. Determining cell volumes. Virchows Arch A 1993;422:459–466. https://pubmed.ncbi.nlm.nih.gov/8333150/ （要旨。体積の値は BioNumbers 111219 の抜粋）
- [Pappenheimer2003] Pappenheimer JR, Michel CC. Role of villus microcirculation in intestinal absorption of glucose. J Physiol 2003;553:561–574. https://pmc.ncbi.nlm.nih.gov/articles/PMC2343570/ （表1の値は検索結果の抜粋のみ）
- [Pelaseyed2014] Pelaseyed T ほか, Hansson GC. The mucus and mucins of the goblet cells and enterocytes provide the first defense line of the gastrointestinal tract and interact with the immune system. Immunol Rev 2014;260:8–20. https://pmc.ncbi.nlm.nih.gov/articles/PMC4281373/ （本文）
- [Johansson2013] Johansson MEV, Sjövall H, Hansson GC. The gastrointestinal mucus system in health and disease. Nat Rev Gastroenterol Hepatol 2013;10:352–361. https://pmc.ncbi.nlm.nih.gov/articles/PMC3758667/ （本文）
- [Johansson2008] Johansson MEV ほか. The inner of the two Muc2 mucin-dependent mucus layers in colon is devoid of bacteria. PNAS 2008;105:15064–15069. https://pubmed.ncbi.nlm.nih.gov/18806221/ （要旨、マウス）
- [Johansson2014] Johansson MEV ほか. Bacteria penetrate the normally impenetrable inner colon mucus layer in both murine colitis models and patients with ulcerative colitis. Gut 2014;63:281–291. https://pubmed.ncbi.nlm.nih.gov/23426893/ （要旨）
- [Atuma2001] Atuma C, Strugala V, Allen A, Holm L. The adherent gastrointestinal mucus gel layer: thickness and physical state in vivo. Am J Physiol Gastrointest Liver Physiol 2001;280:G922–929. https://pubmed.ncbi.nlm.nih.gov/11292601/ （要旨、ラット）
- [Wallaeys2023] Wallaeys C, Garcia-Gonzalez N, Libert C. Paneth cells as the cornerstones of intestinal and organismal health: a primer. EMBO Mol Med 2023;15:e16427. https://pmc.ncbi.nlm.nih.gov/articles/PMC9906427/ （本文）
- [Jung2010] Jung C, Hugot JP, Barreau F. Peyer's patches: the immune sensors of the intestine. Int J Inflam 2010;2010:823710. https://pmc.ncbi.nlm.nih.gov/articles/PMC3004000/ （本文）
- [Gelberg2017] Gelberg H. Pathophysiological mechanisms of gastrointestinal toxicity. In: Comprehensive Toxicology, 3rd ed. 2018（2016改訂）. https://pmc.ncbi.nlm.nih.gov/articles/PMC7173509/ （本文。動物種をまたいだ記述が多い）
- [Sender2016] Sender R, Fuchs S, Milo R. Revised estimates for the number of human and bacteria cells in the body. PLoS Biol 2016;14:e1002533. https://pmc.ncbi.nlm.nih.gov/articles/PMC4991899/ （本文）
- [Derrien2004] Derrien M, Vaughan EE, Plugge CM, de Vos WM. Akkermansia muciniphila gen. nov., sp. nov., a human intestinal mucin-degrading bacterium. Int J Syst Evol Microbiol 2004;54:1469–1476. https://pubmed.ncbi.nlm.nih.gov/15388697/ （要旨。細胞の寸法は検索結果の抜粋）
- [Zhang2019] Zhang T, Li Q, Cheng L, Buch H, Zhang F. Akkermansia muciniphila is a promising probiotic. Microb Biotechnol 2019;12:1109–1125. https://pmc.ncbi.nlm.nih.gov/articles/PMC6801136/ （本文）
- [Duncan2002] Duncan SH ほか. Growth requirements and fermentation products of Fusobacterium prausnitzii, and a proposal to reclassify it as Faecalibacterium prausnitzii gen. nov., comb. nov. Int J Syst Evol Microbiol 2002;52:2141–2146. https://pubmed.ncbi.nlm.nih.gov/12508881/ （要旨）
- [Sokol2008] Sokol H ほか. Faecalibacterium prausnitzii is an anti-inflammatory commensal bacterium identified by gut microbiota analysis of Crohn disease patients. PNAS 2008;105:16731–16736. https://pubmed.ncbi.nlm.nih.gov/18936492/ （要旨）
- [Dhanashree2017] Dhanashree, Rajashekharan S, Krishnaswamy B, Kammara R. Bifid shape is intrinsic to Bifidobacterium adolescentis. Front Microbiol 2017;8:478. https://www.frontiersin.org/journals/microbiology/articles/10.3389/fmicb.2017.00478/full （本文）
- [Cummings1987] Cummings JH, Pomare EW, Branch WJ, Naylor CP, Macfarlane GT. Short chain fatty acids in human large intestine, portal, hepatic and venous blood. Gut 1987;28:1221–1227. https://pubmed.ncbi.nlm.nih.gov/3678950/ （要旨）
- [Roediger1980] Roediger WE. Role of anaerobic bacteria in the metabolic welfare of the colonic mucosa in man. Gut 1980;21:793–798. https://pubmed.ncbi.nlm.nih.gov/7429343/ （要旨）
- [Swidsinski2002] Swidsinski A ほか. Mucosal flora in inflammatory bowel disease. Gastroenterology 2002;122:44–54. https://pubmed.ncbi.nlm.nih.gov/11781279/ （要旨）
- [Winter2013] Winter SE ほか, Bäumler AJ. Host-derived nitrate boosts growth of E. coli in the inflamed gut. Science 2013;339:708–711. https://pubmed.ncbi.nlm.nih.gov/23393266/ （要旨、マウス）
- [Shin2015] Shin NR, Whon TW, Bae JW. Proteobacteria: microbial signature of dysbiosis in gut microbiota. Trends Biotechnol 2015;33:496–503. https://pubmed.ncbi.nlm.nih.gov/26210164/ （要旨）
- [Desai2016] Desai MS ほか, Martens EC. A dietary fiber-deprived gut microbiota degrades the colonic mucus barrier and enhances pathogen susceptibility. Cell 2016;167:1339–1353. https://pubmed.ncbi.nlm.nih.gov/27863247/ （要旨、マウス）
- [PathOutlines-SI] PathologyOutlines.com「Small bowel – Normal histology」https://www.pathologyoutlines.com/topic/smallbowelnormalhistology.html （本文）
- [SIU-SI] Southern Illinois University School of Medicine, Histology「Small intestine」https://histology.siu.edu/erg/smallint.htm （本文）
- [BioNumbers111734] BioNumbers ID 111734「Length of microvilli of enterocyte」約1 µm（原典 Young B ほか, Wheater's Functional Histology 6th ed., p.269）https://bionumbers.hms.harvard.edu/bionumber.aspx?id=111734
- [Britannica] Encyclopaedia Britannica「Human digestive system – Absorption」（検索結果の抜粋のみ。本文は取得拒否）
- Wikipedia（英語版）：[Wiki-Villus] https://en.wikipedia.org/wiki/Intestinal_villus ／ [Wiki-Microvillus] https://en.wikipedia.org/wiki/Microvillus ／
  [Wiki-Crypt] https://en.wikipedia.org/wiki/Intestinal_crypt ／ [Wiki-Paneth] https://en.wikipedia.org/wiki/Paneth_cell ／ [Wiki-IE] https://en.wikipedia.org/wiki/Intestinal_epithelium ／
  [Wiki-Enterocyte] https://en.wikipedia.org/wiki/Enterocyte ／ [Wiki-SI] https://en.wikipedia.org/wiki/Small_intestine ／ [Wiki-Bifido] https://en.wikipedia.org/wiki/Bifidobacterium ／
  [Wiki-Bacteroides] https://en.wikipedia.org/wiki/Bacteroides ／ [Wiki-Akk] https://en.wikipedia.org/wiki/Akkermansia_muciniphila ／ [Wiki-Faecali] https://en.wikipedia.org/wiki/Faecalibacterium_prausnitzii ／
  [Wiki-Lacto] https://en.wikipedia.org/wiki/Lactobacillus ／ [Wiki-Ecoli] https://en.wikipedia.org/wiki/Escherichia_coli ／ [Wiki-SCFA] https://en.wikipedia.org/wiki/Short-chain_fatty_acid ／
  [Wiki-UC] https://en.wikipedia.org/wiki/Ulcerative_colitis ／ [Wiki-BER] https://en.wikipedia.org/wiki/Basal_electrical_rhythm ／ [Wiki-MMC] https://en.wikipedia.org/wiki/Migrating_motor_complex ／
  [Wiki-Peristalsis] https://en.wikipedia.org/wiki/Peristalsis
- 抜粋のみ：絨毛の密度 20〜40本/mm²（教材サイト、取得拒否）、細菌の寸法（microbe-canvas.com のビフィズス菌、Lecturio・EOL のバクテロイデス、Derrien 2004 本文のアッカーマンシア）、2025年 Cell Reports のバクテロイデスの形の多様性、内視鏡の色（PMC の図の説明文）。

## 形の仕様書の一覧（atlas/）

`villus.md`（絨毛）、`enterocyte.md`（吸収上皮細胞）、`microvilli.md`（微絨毛）、`paneth_cell.md`（パネート細胞）、`gut_mucus.md`（腸の粘液）、
`bifidobacterium.md`（ビフィズス菌）、`bacteroides.md`（バクテロイデス）、`akkermansia.md`（アッカーマンシア）、`enterobacteria.md`（腸内細菌科・大腸菌の仲間：不調のときに増えやすい菌）
杯細胞は鼻の `goblet_cell.md`、好中球は `neutrophil.md` を流用できる。
