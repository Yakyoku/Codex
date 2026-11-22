# 赤血球（形の仕様書）

印の意味：【全文】本文を読んだ／【要旨】要旨のみ／【抜粋】検索結果の抜粋のみ（本文未読）／【画像】画像を見た／【計算】資料の数値からの計算／【未確認】出所を確かめられなかった。

## 名前（日本語・英語）
赤血球／red blood cell（RBC）、erythrocyte

## 種類（細胞・組織・器官・物質）
細胞（核のない血液細胞）

## 実際の大きさ（数値と、髪の毛の太さ約70〜100µm などとの比較）
- 直径 7.82 µm、いちばん厚い所 約 2.57〜2.58 µm、中央のいちばん薄い所 0.81 µm、表面積 約 135 µm²、体積 約 94 µm³（±14）。
  Evans & Fung（1972）の、等張（300 mOsm）の液の中での測定。
  直径 7.82 µm は【全文】[Fischer2022] の比較表、表面積と体積は【抜粋】[BioNumbers]、厚みは下の式からの【計算】。
- ほかの資料：直径 6.2〜8.2 µm、最大の厚み 2〜2.5 µm、中央の厚み 0.8〜1 µm。【全文】[Wiki-RBC]
- 血漿の中で測ると、中央のくぼみは Evans & Fung の形より浅い（中央と縁の厚みの比が 0.55 前後。Evans & Fung は 0.314）。【全文】[Fischer2022]
- 髪の毛（太さ 約 70〜100 µm。頭髪の実測の平均は 約 70 µm、範囲 60〜80 µm【抜粋】[BioNumbers-Hair]）の、約 9〜13分の1。
  髪の毛の断面の直径に、赤血球が 約 9〜13個並ぶ。

## 形と比率（3Dモデルを作れる精度で数値と言葉で）
- 両面の中央がくぼんだ円盤（両凹円盤）。断面はダンベル形で、縁は輪（トーラス）状に丸く厚い。【全文】[Wiki-RBC]
- **Evans & Fung の形状式**（軸対称。r は中心軸からの距離、z は中央の面からの高さ。厚みは 2z）：

  ```
  z(r) = ± (R0 / 2) · sqrt(1 − (r/R0)²) · [ C0 + C1·(r/R0)² + C2·(r/R0)⁴ ]
  R0 = 3.91 µm,  C0 = 0.207,  C1 = 2.003,  C2 = −1.123
  ```

  同じ式の媒介変数の形：`x = R0·sin χ`、`z = (R0/2)·(0.207 + 2.003·sin²χ − 1.123·sin⁴χ)·cos χ`。【全文】[Rydquist2022]（Evans & Fung の形として引用）
  - 6桁の係数（C0 = 0.207161、C1 = 2.002558、C2 = −1.122762）は広く引用される値だが、原論文は読めていない（PubMed に要旨なし）。
    別の論文に、同じ係数を別の尺度で書いた値（0.05179025、2.002558、−4.491048。4倍・4分の1の関係で一致）がある。【抜粋】
  - 6桁の係数でこの式を数値積分すると、体積 94.1 µm³、表面積 134.1 µm² となり、Evans & Fung の実測（94 µm³、135 µm²）と合う。【計算】
- 式から求めた厚みの分布【計算】：

  | 中心からの距離 r (µm) | 0 | 0.5 | 1.0 | 1.5 | 2.0 | 2.5 | 2.74 | 3.0 | 3.5 | 3.8 | 3.91 |
  |---|---|---|---|---|---|---|---|---|---|---|---|
  | 厚み 2z (µm) | 0.81 | 0.93 | 1.26 | 1.72 | 2.20 | 2.52 | 2.57（最大） | 2.50 | 1.90 | 1.01 | 0 |

- 比率：直径：最大の厚み：中央の厚み ≒ 9.7：3.2：1。いちばん厚い所は、半径の約 70%（中心から 2.74 µm）にある輪。
- 個体差：直径と面積には 10% 前後のばらつきがある（投影面積の変動係数 約 0.10）。【全文】[Fischer2022]

## 表面のつくり
- なめらかで、突起や模様はない。膜はタンパク質と脂質でできていて、しなやかで、破れにくい。【全文】[Wiki-RBC]
- 表面の細かな質感（生体での光り方）：【未確認】

## 内部に見えるもの
- 何も見えない。核も小器官もない（作られる途中で核を捨てる）。中身は、ほぼヘモグロビンの濃い液。1個に 約 2億7千万分子。【全文】[Wiki-RBC]

## 色と透け具合（生体での見え方）
- 赤い色はヘモグロビンのヘムによる。酸素と結びついていると鮮やかな赤（緋色）、酸素を手放すと暗い赤（ワイン色）。
  血漿だけなら麦わら色。【全文】[Wiki-RBC]
- 眼底写真では、血管は動脈が明るい赤、静脈が太く暗い赤に見える。【画像】（Wikimedia Commons の健常眼底写真）
- 1個の赤血球を単独で見たときの色と透け具合（薄い所ほど色が淡く、中央が透けて見えること）：【未確認】
  （薄い円盤なので光をよく通す、という一般的な説明は今回の資料では確かめていない）
- 生きた人の網膜の毛細血管を流れる赤血球の撮影（補償光学）は、赤外光などの単色で行われるので、色の資料にはならない。

## 動き方（速度などの数値があれば）
- **網膜の毛細血管での速さ（ヒト、生体）**：15本の毛細血管の平均 1.70 mm/s（最小 0.93、最大 3.32 mm/s）。【全文】[Warner2021]
  別の研究：毛細血管で 0.73〜2.52 mm/s【抜粋】。同じ毛細血管を流れる白血球の平均は 1.30 ± 0.40 mm/s【全文】[Martin2009]（白血球の値なので参考）。
  → 目安は **約 1〜3 mm/s、代表値 1.5〜2 mm/s**。自分の直径の 約 200倍の距離を毎秒進む。【計算】
- 拍動：速さは心拍に合わせて脈打つ。【全文】[Gu2021][Martin2009]
- 並び方：毛細血管の中では1列。長さ 1 mm あたり平均 約 60個（62.0 ± 20.1）。50 µm あたり 1〜5個、最も多いのは 3個。【全文】[Gu2021]
  → 赤血球の中心どうしの間隔は平均 約 16 µm（直径の約2倍）。間は血漿。【計算】
- **変形（パラシュート型・スリッパ型）**：
  - 毛細血管の中の「パラシュート型（傘型）」は、軸対称の形ではなく、元の両凹円盤の上流側の端が圧力の差で平たく押された形。
    【要旨】[Skalak1969]（ヒトの赤血球の観察）
  - 管の中の流れでは、速さが上がるにつれ、円盤型 → （境目の速さでは一時的にスリッパ型）→ パラシュート型へ移る（円筒形の管での計算）。【抜粋】
  - 幅 約 10〜12 µm の四角い微小流路の実験では、主に2つの形に落ち着く。
    **クロワッサン型（＝パラシュート型の、四角い流路での呼び名）**：左右対称。流路の中心線上を流れ、遅い流れ（約 5 mm/s 未満）で多い。
    **スリッパ型**：非対称。中心から壁寄りにずれて流れ、速い流れ（約 5 mm/s 超）で 70〜80% を占める。
    スリッパ型では膜が中身の周りを回る（タンクトレッド運動）。【全文】[Nouaman2024]【抜粋】[Guckenberger2018]
  - 生きた人の網膜の毛細血管（内径 3.2〜8.4 µm、123本）では、管が細いほど、赤血球は丸い形から細長い形へ、
    流れに対して横向きから流れに沿った向きへ変わる。【抜粋】[Bedggood2023]
  - 以上から、網膜の毛細血管（流速 約 1〜3 mm/s、内径 約 5〜7 µm）では、**進む向きに凸、後ろがくぼんだパラシュート型と、
    片側に傾いたスリッパ型が混じる**と考えるのが妥当。ただし、網膜の毛細血管の中での形の割合を直接示した資料は読めていない。【未確認】
- 体を一巡りする時間は平均 約 60秒。寿命 約 100〜120日。毎秒 約 240万個が新しく作られる。【全文】[Wiki-RBC]

## 周囲との並び方（密度・間隔・向き）
- 毛細血管の中：1列。間隔は上のとおり。細い管ほど、長軸を流れの向きにそろえる。【抜粋】[Bedggood2023]
- 太い血管の中：中心寄りに集まって流れ、小さな血小板を壁ぎわへ押しやる。【抜粋】（`platelet.md` を参照）
- 毛細血管の中の赤血球の体積の割合（ヘマトクリット）は、太い血管より低い（ファーレウス効果）。【全文】[Gu2021]
- 血液中の赤血球の数（1 µL あたり）：【未確認】（今回の資料から数値を拾えていない）

## 体の中での働き
- 肺で酸素を受け取り、全身の組織へ運んで手放す。ヘモグロビンが酸素と結びつく。【全文】[Wiki-RBC]
- 網膜では、内側の層の神経細胞に酸素を届ける。血流が短い間止まるだけでも、網膜の光への反応は大きく落ちる。【全文】[Grimes2025]

## ほかの細胞との関係
- 内皮細胞：毛細血管の内径（約 5〜7 µm）は赤血球の直径（7.8 µm）と同じか、より細い。赤血球は変形して、内皮の壁をこするように通る。
- 血小板：赤血球が中心を流れることで、血小板は壁ぎわへ寄せられる。
- 古くなった赤血球はマクロファージに回収される。【全文】[Wiki-RBC]

## 初登場時の説明文の案（1〜2文、専門用語には言い換えを添える。大人向けの落ち着いた口調）
「赤血球。直径は髪の毛の太さの約10分の1。ヘモグロビン（酸素を運ぶ赤いタンパク質）を詰めた、核のないやわらかな円盤で、
自分より細い毛細血管を、形を変えながら通り抜けて酸素を届けます。」

## 出所一覧
- [EvansFung1972] Evans E, Fung YC. Improved measurements of the erythrocyte geometry. Microvasc Res 1972;4:335-47. https://pubmed.ncbi.nlm.nih.gov/4635577/ （要旨なし。原論文は未読）
- [Rydquist2022] Rydquist G, Esmaily M. A cell-resolved, Lagrangian solver for modeling red blood cell dynamics in macroscale flows. J Comput Phys 2022. https://pmc.ncbi.nlm.nih.gov/articles/PMC9580997/
- [Fischer2022] Fischer TM. The Shape of Human Red Blood Cells Suspended in Autologous Plasma and Serum. Cells 2022. https://pmc.ncbi.nlm.nih.gov/articles/PMC9222013/
- [BioNumbers] 表面積 https://bionumbers.hms.harvard.edu/bionumber.aspx?id=101715 ／ 体積 https://bionumbers.hms.harvard.edu/bionumber.aspx?id=101712
- [BioNumbers-Hair] 頭髪の直径 https://bionumbers.hms.harvard.edu/bionumber.aspx?id=114258 ／ https://bionumbers.hms.harvard.edu/bionumber.aspx?id=106856
- [Skalak1969] Skalak R, Branemark PI. Deformation of red blood cells in capillaries. Science 1969;164:717-9. https://pubmed.ncbi.nlm.nih.gov/5778020/
- [Nouaman2024] Nouaman M ほか. Confinement effect on the microcapillary flow and shape of red blood cells. Biomicrofluidics 2024. https://pmc.ncbi.nlm.nih.gov/articles/PMC10994673/
- [Guckenberger2018] Guckenberger A ほか. Numerical–experimental observation of shape bistability of red blood cells flowing in a microchannel. Soft Matter 2018;14:2032. https://pubs.rsc.org/en/content/articlehtml/2018/sm/c7sm02272g
- [Warner2021] Warner RL ほか. Measuring Temporal and Spatial Variability of Red Blood Cell Velocity in Human Retinal Vessels. IOVS 2021. https://pmc.ncbi.nlm.nih.gov/articles/PMC8648047/
- [Martin2009] Martin JA, Roorda A. Pulsatility of Parafoveal Capillary Leukocytes. Exp Eye Res 2009. https://pmc.ncbi.nlm.nih.gov/articles/PMC2696158/
- [Gu2021] Gu B ほか. In vivo measurement of the lineal density of red blood cells in human retinal capillaries using high-speed adaptive optics ophthalmoscopy. Opt Lett 2021. https://pmc.ncbi.nlm.nih.gov/articles/PMC10214498/
- [Bedggood2023] Bedggood P, Ding Y, Metha A. Changes to the shape, orientation and packing of red cells as a function of retinal capillary size. Opt Lett 2023（研究者ページ）https://findanexpert.unimelb.edu.au/scholarlywork/1847559-changes%20to%20the%20shape-%20orientation%20and%20packing%20of%20red%20cells%20as%20a%20function%20of%20retinal%20capillary%20size
- [Grimes2025] Grimes WN ほか. Layer-specific anatomical and physiological features of the retina's neurovascular unit. Curr Biol 2025. https://pmc.ncbi.nlm.nih.gov/articles/PMC11867051/
- [Wiki-RBC] https://en.wikipedia.org/wiki/Red_blood_cell

## 確認の方法と未確認の点
- **確認の方法**：形と寸法は、文章と式の記述から書いた。式は別の論文に引用された形で確かめ、6桁の係数は自分で数値積分して、
  実測の体積・表面積と合うことを確かめた。赤血球そのものの写真（生体・光学顕微鏡）は見ていない。
  色は、眼底写真で血管の色を見たこと【画像】と、Wikipedia の記述による。
- **未確認の点**：
  - Evans & Fung の原論文の本文（6桁の係数、直径・厚みの原記載）。
  - 網膜の毛細血管の中での、パラシュート型とスリッパ型の割合。Bedggood らの本文（形の実測値）。
  - 1個の赤血球の、生体での色と透け具合。表面の光り方。
  - 血液 1 µL あたりの赤血球の数。
- **食い違い**：直径は 7.82 µm（Evans & Fung）と 6.2〜8.2 µm（Wikipedia）。中央のくぼみの深さは、塩類の液（Evans & Fung、比 0.314）と
  血漿（Fischer、比 約 0.55）で違う。体の中は血漿なので、くぼみは Evans & Fung の式よりやや浅い可能性がある。
