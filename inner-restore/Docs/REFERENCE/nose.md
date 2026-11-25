# 鼻（ステージ2）の資料

調査日：2026-11-25。ステージ2「鼻」に登場させるもの（線毛の森、粘液の川、嗅細胞）の、実際の構造・大きさ・動き・色・不調の仕組みをまとめた。
対象ごとの「形の仕様書」は `atlas/` にある（末尾の一覧を参照）。台帳の下書きは `atlas_nose_draft.json`。

## この文書の読み方

各記述の末尾に、確かめ方の印を付けた（`eye.md` と同じ）。

- 【全文】… 資料の本文を取得して、該当箇所を自分で読んだ。
- 【要旨】… 論文の要旨（アブストラクト）だけを読んだ。本文は読めていない。
- 【抜粋】… 検索結果に出た抜粋だけで確認した。本文は読めていない。採用前に再確認が望ましい。
- 【画像】… 写真そのものを画像として取得し、自分で見た。
- 【計算】… 資料の数値から、この文書の中で計算した値。資料に直接は書かれていない。
- 【未確認】… 今回の調査では出所を確かめられなかった。事実として使わないこと。

調査の制約：NCBI Bookshelf（StatPearls、Purves『Neuroscience』）と Thieme の論文ページは、この環境からは自動取得が拒否された（ブラウザ確認画面）。
PubMed の要旨と、PubMed Central のオープンアクセス本文は NCBI の公開 API（E-utilities）経由で取得した。Wikipedia、J-STAGE は本文を取得できた。
Wikimedia Commons は途中から取得の回数制限（429）がかかり、画像は一部しか見られていない（9章）。

---

## 1. 全体の構造と大きさ

- 鼻腔は鼻中隔で左右2つに分かれる。それぞれの外側の壁から、3枚の棚のような張り出し（鼻甲介：下・中・上）が出て、その脇のすき間を鼻道と呼ぶ。【全文】[Wiki-NasalCavity]
- 入口（鼻前庭）は皮膚と同じ角化した重層扁平上皮で、奥へ入ると呼吸上皮に変わる。【全文】[Wiki-NasalCavity]
- 鼻腔の大部分は**呼吸部**（線毛のある呼吸上皮）。**嗅部**は天井と、鼻中隔の上部、上鼻甲介（と中鼻甲介の内側面の一部）に限られる。【全文】[Wiki-NasalCavity][Wiki-OlfMucosa]
- 面積：
  - 呼吸上皮（線毛のある上皮）：約 120 cm²。【全文】[Beule2010]　鼻の粘膜全体の表面積として 約 160 cm² という値もある。【全文】[Gizurarson2015]
  - 嗅上皮：約 5 cm²（Wikipedia の2項目）。【全文】[Wiki-OlfEpi][Wiki-OlfMucosa]　ほかの資料では 2.5 cm²、10 cm²、2〜10 cm² と幅がある。【抜粋】
    → 呼吸上皮のほうが **20倍以上** 広い。【計算】（120 cm² ÷ 2.5〜5 cm² ≒ 24〜48倍。10 cm² なら 12倍）
  - 嗅上皮は鼻の穴から 約 7 cm 奥・上にある。【全文】[Wiki-OlfEpi]
- 嗅上皮は一様な面ではなく、呼吸上皮の島がまだらに混じる。年齢とともに呼吸上皮への置き換わりが増える。【要旨】[Morrison1990][Paik1992]
- 粘膜の厚み（上皮の下の層を含む）：0.3〜5 mm。下鼻甲介の内側面で最も厚い。上皮だけの高さは 40〜100 µm。【全文】[Beule2010]
- 下鼻甲介と鼻中隔には静脈の網（静脈叢）があり、鼻サイクル（左右が交互に腫れて空気の通りが入れ替わる）の「膨らむ組織」として働く。鼻サイクルは 約 2.5 時間ごと、70〜90%の人で見られる。【全文】[Beule2010][Wiki-NasalCavity]
- 鼻は吸った空気を体温 ±1度近くまで温め、加湿する。【全文】[Wiki-NasalCavity]　直径 15 µm を超える粒子の 95% を取り除く。【全文】[Beule2010]

ゲーム内の尺度の目安（髪の毛 約 70〜80 µm、赤血球 約 7.8 µm と比べる）：

| もの | 大きさ | 比べると |
|---|---|---|
| 呼吸上皮の高さ | 40〜100 µm | 髪の毛の太さの 約 0.5〜1.4本分【計算】 |
| 線毛細胞の高さ | 15〜20 µm | 赤血球 約 2〜2.5個分【計算】 |
| 線毛の長さ | 5〜7 µm（資料により 4〜10 µm） | 赤血球の直径とほぼ同じ【計算】 |
| 線毛の太さ | 0.2〜0.3 µm | 髪の毛の 約 250〜400分の1【計算】 |
| 粘液の層（全体） | 10〜15 µm（資料により 0.5〜70 µm） | 赤血球 約 1.5〜2個分【計算】 |
| 線毛のまわりの層（PCL） | 約 6〜7 µm | 線毛の長さとほぼ同じ |
| 好中球 | 直径 12〜15 µm（平らに広がったとき） | 赤血球の 約 1.5〜2倍【計算】 |
| 黄色ブドウ球菌 | 直径 約 0.5〜1.5 µm | 線毛の長さの 約 5〜10分の1【計算】 |
| インフルエンザウイルス | 直径 約 80〜120 nm | 線毛の太さの半分ほど【計算】 |

---

## 2. 呼吸上皮（線毛のある多列円柱上皮）

- 正式名：多列線毛円柱上皮（pseudostratified ciliated columnar epithelium）。すべての細胞が基底膜に足をつけているが、核の高さがそろわないため、何層にも重なって見える（「多列」＝見かけの重層）。【全文】[Wiki-RespEpi][Beule2010]
- 細胞の種類（鼻の呼吸粘膜）：【全文】[Beule2010]
  - 線毛のない円柱細胞：最大 70%。表面に微絨毛（細かい突起）が 300〜400本。乾燥を防ぐ。
  - 線毛細胞：20〜50%。1個に線毛が 200〜300本。
  - 杯細胞：5〜15%。
  - 基底細胞：基底膜の上にあり、表面には届かない。
  ※ 気道全体の一般論では「線毛細胞は 50〜80%」とされ [Wiki-RespEpi]、気管で 47%、細い気道で 73% という測定もある [Tilley2015]。**鼻の値（20〜50%）とは食い違う**。部位と数え方による。【全文】
- 寸法：線毛細胞の高さ 15〜20 µm、幅 15 µm。微絨毛は長さ 0.5〜4 µm、太さ 約 0.1 µm。上皮の下に、直径 0.025 mm の毛細血管の網と、1.6〜10 µm の基底膜。【全文】[Beule2010]
  ※ 同じ資料が「場所によるばらつきが大きく、参考値にとどまる」と断っている。幅 15 µm は線毛の密度から計算した値（約 6〜8 µm、`atlas/ciliated_cell.md`）と合わない。
- 上皮が傷つくと、24時間ほどで周りの細胞が 1時間に 約 20 µm の速さで傷口へ移動してふさぐ。【全文】[Beule2010]

## 3. 運動する線毛（motile cilia）

- 長さ：
  - 上気道で 6〜7 µm、細い気道で 4 µm。【全文】[Tilley2015]
  - 鼻：5〜10 µm（同じ資料の別の箇所で「ヒトの線毛は約 6 µm」）。【全文】[Beule2010]　約 5 µm。【全文】[Gizurarson2015]
  - 伸びきった線毛の高さを 7 µm として測っている研究もある（ヒト気管支上皮の培養）。【全文】[Button2012]
  - → **5〜7 µm を代表値**とする。
- 太さ：0.2〜0.3 µm（250 nm、0.3 µm）。【全文】[Tilley2015][Beule2010][Gizurarson2015]
- 1細胞あたりの本数：200〜300本【全文】[Tilley2015][Beule2010]／約 200本【全文】[Wiki-RespEpi][Fahy2010]／100〜250本【全文】[Gizurarson2015]。
- 密度：表面 1 µm² あたり 6〜8本（ウサギ気管などの古典的な値。モデル研究の表から）。【全文】[Xu2019]（原典 Sleigh、Sanderson & Sleigh は未読）
- 内部：「9+2」構造。周りに微小管の2本組が9組、中心に2本。外側の組どうしはダイニン腕（ATPを使うモーター）とネキシンでつながり、中心とは放射状のスポークでつながる。ダイニン腕が隣の組を滑らせることで曲がる。【全文】[Beule2010][Tilley2015]
- 表面には線毛自身の膜がある。線毛には膜につながった大きな糖たんぱく（MUC4）が生えている。【全文】[Beule2010][Kesimer2013]
- 拍動数（CBF）：
  - 鼻の線毛（ブラシでこすり取った細胞、高速ビデオ）：大人 平均 11.5 Hz（95%信頼区間 10.3〜12.7）、子ども 12.8 Hz。【要旨】[Chilvers2003]
  - 鼻の正常範囲 7〜12 Hz。【全文】[Beule2010]　12〜15 Hz（毎分 約 1,000回）。【全文】[Gizurarson2015]
  - 気道一般：10〜20 Hz【全文】[Wiki-RespEpi]、12〜15 Hz【全文】[Tilley2015]、8〜15 Hz【全文】[Knowles2002]。
  - 測定温度で大きく変わる（32°C で 6.3〜9.0 Hz という研究もある）。【抜粋】
  - → **代表値 10〜12 Hz、範囲 7〜15 Hz**。1回の打ち方は 約 0.07〜0.14 秒。【計算】
- 打ち方（2つの動き）：
  - **有効打（パワーストローク）**：ほぼまっすぐに伸びた硬い姿勢で、速く、力強く振る。先端が粘液の層の下面に刺さり、粘液を一方向に押す。【全文】[Tilley2015][Xu2019][Knowles2002]
  - **回復打（リカバリーストローク）**：線毛が曲がり、細胞の表面近くに身をかがめて、ゆっくり元の位置へ戻る。このとき先端は粘液の下（PCL の中）を通るので、粘液を押し戻さない。【全文】[Tilley2015][Xu2019]
  - 有効打と回復打の時間の割合：【未確認】
- **メタクロナール波**（隣どうしが少しずつ遅れて打つことで生まれる波）：
  - 線毛は協調した波で打ち、粘液を喉の方向へ運ぶ。【全文】[Tilley2015][Beule2010]
  - 哺乳類の気管の試料では、波長は 約 50 µm、波の進む速さは粘液の運ばれる速さの 4〜8倍。拍動数は 6種で 10〜15 Hz。【全文】[Burn2022]
  - ただし、ヒトの蝶形骨洞の粘膜では 約 6 µm という、ずっと短い波長も報告されている（Yi ほか 2000、[Burn2022] での引用）。【全文】→ **波長は 6〜50 µm と資料で大きく違う**。
  - 波の向きと有効打の向きの関係（哺乳類の気道は「逆向き＝アンチプレクティック」とされる）：ウサギ気管の記述として【抜粋】。ヒトの鼻では【未確認】。
  - 波の向き・相関は場所ごとにばらつき、相関は1波長ほどで薄れる。【全文】[Burn2022]

## 4. 粘液（mucus）

### 4.1 二層の構造

- 線毛の上を、2層の液がおおう：【全文】[Beule2010][Button2012][Fahy2010]
  1. **線毛のまわりの層（PCL：periciliary layer）**：線毛が打つための、さらさらした層。厚み 約 6〜7 µm＝伸ばした線毛の高さとほぼ同じ。
     鼻で「6 µm」【全文】[Beule2010]、気道全体で「約 7 µm」【全文】[Fahy2010][Button2012]。杯細胞や線毛のない細胞の上では 約 3 µm。【全文】[Gizurarson2015]
  2. **ゲルの層（粘液層）**：粘り気のある層。上に乗って運ばれる。
- 鼻の粘液全体の厚み：**10〜15 µm**。【全文】[Beule2010][Gizurarson2015]
  気道全体では 7〜10 µm（電子顕微鏡）から 0.5〜70 µm まで、固定法と測り方で大きく違う。【全文】[Kesimer2013]　太い気道ではゲル層が最大 50 µm にもなる。【全文】[Fahy2010]
- 新しい見方（gel-on-brush モデル）：PCL はただの水ではなく、線毛と細胞の表面に生えた膜型ムチン（MUC1、MUC4、MUC16）などが「ブラシ」のように密に詰まった層。網目は 20〜40 nm で、直径 40 nm 以上の粒子や、粘液のムチン（半径 150〜200 nm）は PCL に入れない。だから粘液は線毛の先の上に別の層として浮く。【全文】[Button2012][Kesimer2013]
  → インフルエンザウイルス（直径 80〜120 nm）も、この網で細胞の表面に届きにくくなると考えられている。【全文】[Button2012]

### 4.2 中身

- 水が 約 95%（[Wiki-Mucus][Gizurarson2015]）、97%（気道一般、[Fahy2010]）、90%（鼻、[Beule2010]）。残りは糖たんぱく（ムチン 2〜4%）、塩類、脂質、抗体など。【全文】
- 健康な粘液の固形分は 約 3% で、**卵の白身くらいの粘り**。病気で固形分が最大 15% まで増えると、ねばねばして運べなくなる。【全文】[Fahy2010]
- ゲルを作る主なムチンは MUC5AC（主に杯細胞）と MUC5B（主に粘膜下腺）。【全文】[Fahy2010][Wiki-GobletCell]
- 鼻の分泌物には IgA（抗体）が多く、全たんぱく質の最大 50%。リゾチームなどの抗菌物質も含む。【全文】[Beule2010][Wiki-Mucus]
- 鼻の粘液は弱い酸性（pH 5.5〜6.5）。【全文】[Gizurarson2015]
- 作るところ：杯細胞、粘膜下腺、血管からしみ出す液、涙。【全文】[Beule2010]
- 健康な鼻の粘液は透明でさらさら。【全文】[Wiki-Mucus]

### 4.3 流れ（粘液線毛クリアランス）

- 向き：**喉（咽頭）へ向かって後ろ向き**。下気道では上向き、鼻では後ろ・下向きに運ばれ、飲み込まれる。【全文】[Wiki-RespEpi][Wiki-MCC][Beule2010]
  - 鼻の中の道筋：鼻中隔では後ろ下方の軟口蓋へ、鼻腔の床では後ろへ（途中で外側か内側へそれる）、下鼻甲介では外側へ、それから後ろへ。【全文】[Gizurarson2015]
  - 副鼻腔の中では、必ず本来の出口（自然口）へ向かう。上顎洞などからの流れは半月裂孔を通り、蝶形骨洞の流れは後部篩骨洞から後鼻孔へ。【全文】[Beule2010]
- 速さ（鼻）：
  - 2〜25 mm/分。【全文】[Beule2010]
  - 平均 6 mm/分（範囲 2.3〜12.0）、平均 6.4 mm/分、平均 8.1 mm/分（140人）、大人 12.7 mm/分。【抜粋】
  - サッカリン試験（下鼻甲介の前に置いた粒が喉で甘く感じるまで）：平均 9〜15 分。正常は 20 分以内、30 分を超えると遅い。【全文】[Austero2022]【抜粋】
  - 気道一般：4〜20 mm/分【全文】[Tilley2015]、気管で 6〜20 mm/分【全文】[Wiki-MCC]。
  - 一方、ある総説は鼻の前のほうを「1〜2 mm/時、8〜10 mm/時」と書き、同じ総説が「後ろで最大 10 mm/分」とも書く。**単位が食い違っており不採用**。【全文】[Gizurarson2015]
  - → **代表値 5〜10 mm/分（範囲 2〜25 mm/分）**。6 mm/分 は 秒速 100 µm。線毛が 1回打つ（10〜12 Hz）ごとに、粘液は 約 8〜10 µm、つまり線毛1本の長さほど進む。【計算】
  - 髪の毛の太さ（約 75 µm）で言えば、1秒に 1〜2本分。【計算】
- 粘液の敷物は 20〜30 分ごとに入れ替わる。【全文】[Gizurarson2015]
- 最もよく働くのは 37°C、湿度 100%。【全文】[Beule2010]

### 4.4 粘液にとらえられるもの

- ちり、汚染物質、アレルゲン（花粉など）、細菌、ウイルス。【全文】[Wiki-Mucus][Fahy2010][Beule2010]
- 大きさの目安：
  - 花粉：最も小さいワスレナグサで 2.5〜5 µm。【全文】[Wiki-Pollen]　一般的な花粉の大きさの範囲は【未確認】。
  - 黄色ブドウ球菌：直径 0.5〜1.5 µm、ぶどうの房のような塊。【抜粋】[Wiki-SA]　人口の 21〜30% が長く保菌し、鼻の穴はその主な場所。【全文】[Wiki-SA]
  - 健康な鼻（中鼻道）からも、コアグラーゼ陰性ブドウ球菌（69%）、コリネバクテリウム（25%）、黄色ブドウ球菌（31%）などが培養される。【全文】[Beule2010]
  - インフルエンザウイルス：直径 80〜120 nm。【全文】[Button2012]
- 健康な粘液の網目は 約 500 nm。脱水した病的な粘液では 約 150 nm に縮み、細菌が閉じ込められて膜（バイオフィルム）を作りやすくなり、好中球も動きにくくなる。【全文】[Fahy2010]（嚢胞性線維症での記述）

## 5. 杯細胞と粘膜下腺

- **杯細胞**：上の半分（頂部）が、粘液の粒（顆粒）でふくらんだ杯（ワイングラスの器）の形。下の半分は細い茎。核と小器官は根元に寄る。高さは幅の 約 4倍。【全文】[Wiki-GobletCell]
  - 顆粒の直径は最大 約 1 µm。【全文】[Fahy2010]（気道の分泌細胞の図の説明）
  - 主に「穏やかな放出（開口分泌）」。刺激（ちり、煙）で放出が増える。【全文】[Wiki-GobletCell]
  - 鼻（下鼻甲介）の密度：平均 6,499 個/mm²（健常 12人）。通年性のアレルギー性・非アレルギー性鼻炎でも 約 6,800 個/mm² で、差はなかった。分布はむらがあり、隣り合う場所でも大きく違う。【要旨】[Berger1997]
  - → 平均の間隔は 約 12 µm（正方に並べた場合）。【計算】
  - 炎症の物質（IL-13）やウイルスへの防御反応（インターフェロン）は、新しい細胞を線毛細胞より杯細胞へ向かわせる（杯細胞化生）。【全文】[Tilley2015][Chen2020]
- **粘膜下腺**：上皮の下（粘膜固有層）にある房状の腺。管を通って表面に分泌する。粘液細胞が腺の体積の 約 60%。主に MUC5B を出す。病気では腺が最大 4倍に大きくなる。【全文】[Fahy2010]（気道一般の記述）
  - 鼻には「たくさんの粘膜下腺と杯細胞」がある（数は書かれていない）。【全文】[Gizurarson2015]

## 6. 嗅上皮（においを感じる上皮）

### 6.1 細胞の種類

ヒトの嗅上皮は、多列円柱の上皮で、主に4種類の細胞からなる。【要旨】[Moran1982][Morrison1990]

1. **嗅細胞（嗅神経細胞、olfactory sensory/receptor neuron）**
   - 両端に突起を持つ神経細胞（双極細胞）。細胞体は上皮の中ほど〜下のほうに並ぶ。【要旨】[Morrison1990]
   - 細い樹状突起を表面へのばし、先端が丸くふくらむ（**嗅小胞、嗅ノブ**＝knob）。ノブから**動かない線毛**が生える。【要旨】[Moran1982]【全文】[Wiki-ORN][Butowt2023]
   - 線毛の数：10〜30本（ダイニン腕を欠く＝自分では打たない）【要旨】[Moran1982]、20〜35本【全文】[Wiki-ORN]、10〜15本【全文】[Butowt2023]。
   - 線毛の長さ：**最大 100 µm** に達し、粘液の中を表面と平行に広がる。【全文】[Butowt2023][Wiki-ORN]　「5〜20 µm」という値もある。【抜粋】
     隣どうしの嗅細胞の線毛は、粘液の中で網目（メッシュ）を作る。【要旨】[McClintock2020]
   - においの受け手（嗅覚受容体）は線毛の膜にある。ヒトの機能する受容体の遺伝子は 約 400種類。1個の成熟した嗅細胞は、原則として1種類の受容体だけを使う。【全文】[Wiki-ORN]
   - 信号の伝わり方：受容体 → Golf → cAMP → 陽イオンの通り道（CNG チャネル）が開く → カルシウムが塩素イオンの通り道を開き、信号を増やす。【全文】[Wiki-ORN]
   - 軸索は細く、髄鞘（電線の被覆）がない。篩板（頭蓋の底の、ふるいのような骨）の穴を通って、脳の嗅球の糸球体へ届く。【全文】[Wiki-ORN][Wiki-OlfEpi]
   - 数：ヒトで 約 1,000万【全文】[Butowt2023]、1,000万〜2,000万【全文】[Wiki-ORN]。
     → 面積を 2.5〜10 cm² とすると、密度は 1 mm² に 約 1万〜8万個。【計算】（資料ごとの面積の差が大きいので、幅のある目安）
   - ノブの直径、細胞体の大きさ：【未確認】（細胞体 4〜6 µm という抜粋はあるが、出所を確かめていない）
   - 線毛の根元（ノブ）にはミトコンドリアが少なく、線毛はミトコンドリアを持たない。線毛のエネルギーは、粘液の中のブドウ糖を取り込んで作る。そのブドウ糖は支持細胞とボウマン腺が、血管から運んで粘液へ出す（説として）。【全文】[Butowt2023]
   - 作り替わり：嗅細胞は一生を通じて基底細胞から作り直される（神経細胞としては珍しい）。【全文】[Wiki-ORN][McClintock2020]
     入れ替わりの周期は 約 30〜90日【全文】[Butowt2023]、嗅上皮は 6〜8週ごとに入れ替わる【全文】[Wiki-OlfEpi]、成熟したものは数か月生きることもある【全文】[Wiki-ORN]。
     新しい嗅細胞ができるまで 2〜3週、さらに軸索が嗅球に届くまでに（げっ歯類で）5〜7日。【全文】[Butowt2023]
2. **支持細胞（sustentacular cell）**
   - 上皮の表面から基底膜まで縦に貫く細胞。表面は微絨毛でおおわれ、嗅細胞の線毛と入り混じる。基底側の突起は基底膜に届く。成熟した嗅細胞の1本1本を、ぴったり包む。【全文】[Butowt2023]
   - 核は上皮の最も表面寄りの層に並ぶ（非神経性の細胞は上皮の頂部の層）。【全文】[Wiki-OlfEpi]
   - 呼吸上皮の杯細胞とはまったく違い、粘液を大量に出す細胞ではない。表面の粘液に物質を出したり、取り込んだりする。【要旨】[Moran1982]
   - 働き：嗅細胞を物理的・代謝の面で支える、粘液のイオン組成を整える、異物の解毒、においの分子の片付け、においを運ぶたんぱく（OBP）を作る。【全文】[Butowt2023][Wiki-OlfEpi]
   - 数は嗅細胞とほぼ同じ（約 1,000万）。【全文】[Butowt2023]
3. **基底細胞（basal cell）**：基底膜の上やその近くにある幹細胞。嗅細胞と支持細胞を作り直す。【要旨】[Moran1982]【全文】[Wiki-OlfMucosa]
   - 平たく、ゆっくり分裂する予備の「水平基底細胞」（p63 を持つ）と、丸い「球状基底細胞」の2種類。【全文】[Wiki-OlfEpi]
4. **微絨毛細胞**：表面に短い微絨毛の房を出し、根元から軸索のような細い突起をのばす、洋なし形の細胞。働きは分かっていない。【要旨】[Moran1982][Morrison1990]

- **ボウマン腺（嗅腺）**：嗅上皮の下（粘膜固有層）にある腺。腺房から管が上皮を貫いて表面に開く。ゲルを作るムチン MUC5B を出し、においを運ぶたんぱくも作る、とされる。古いにおいを洗い流す。【全文】[Wiki-OlfGland][Wiki-OlfEpi]
  - 1細胞ずつ網羅した遺伝子発現の比較で、ボウマン腺の細胞は呼吸上皮の粘膜下腺の杯細胞（粘液細胞）に対応する（96%）。【全文】[Brann2020]

### 6.2 嗅粘液と、においの分子

- 嗅上皮も粘液におおわれ、においの分子は粘液に溶けてから線毛の受容体に結びつく。粘液は支持細胞とボウマン腺が作る。【全文】[Butowt2023][Wiki-OlfMucosa]
- 嗅粘液の厚み：5〜30 µm。【抜粋】（出所を確かめていない）
- **においの分子**：空気中に揮発する化学物質。【全文】[Wiki-Odor]
  - たいていは分子量 300 以下の小さな有機分子（「目安」であり、じゃこうのように大きい例や、硫化水素のような無機の気体の例外もある）。【抜粋】
  - 1つの分子は多くの受容体に認識され、異なる分子は受容体の組み合わせで区別される（組み合わせの符号）。【全文】[Wiki-Odor]
  - 「ヒトは1兆種類のにおいを区別できる」という報告があるが、【全文】[Wiki-Odor] その計算方法には批判もある【未確認】ため、ゲームでは使わない。
- **におい分子結合たんぱく（OBP）**：粘液に出される小さな水溶性たんぱく（10〜30 kDa、典型 約 14 kDa）。脊椎動物ではリポカリンの仲間。水に溶けにくいにおい分子を、粘液の中で受容体まで運ぶと考えられている。【全文】[Wiki-OBP]

### 6.3 色

- 嗅粘膜は、桃色の呼吸粘膜に比べて**やや厚く、色が淡い黄褐色**。【全文】[Wiki-OlfMucosa]
  黄褐色の原因として、Wikipedia の鼻腔の項目は（組織標本での）リポフスチン色素を挙げる。【全文】[Wiki-NasalCavity]　生体での色の原因が何かは、ほかの資料では確かめていない【未確認】。

---

## 7. 炎症と感染で何が起こるか

### 7.1 鼻炎・かぜ（ウイルス感染）

- かぜの主な原因のライノウイルスは、ふつう鼻の上皮をあまり壊さない。症状は主に、ウイルスへの体の反応（炎症の物質の放出）による。【全文】[Wiki-Cold]
- 炎症の物質は血管を広げ、血管の透過性（中身のしみ出しやすさ）を高めて、**むくみ（浮腫）**を起こす。粘液腺の分泌も増える。【全文】[Beule2010][Wiki-AR][Allergy2016]
  - 炎症が起きると、血管からしみ出す液とそのたんぱくが粘液の中で増える。【全文】[Beule2010]
- **好中球が集まる**：実験的なライノウイルス感染（喘息のある人での実験）で、鼻の IL-8（好中球を呼ぶ物質）と G-CSF が増え、血液中の好中球が増える。【要旨】[Jarjour2000]　ライノウイルスに感染した上皮は、好中球を呼ぶ物質（ENA-78）を出す。【要旨】[Donninger2003]
- **線毛の異常**：子どもの急性ウイルス性上気道炎では、鼻の上皮に、微小管の並びが乱れた形の悪い線毛が、病気の初期に、まだらに見られた。回復期（感染の 2〜10週後）に、上皮と線毛の構造は元に戻った。【要旨】[Carson1985]
  - 乳児の細気管支炎（RS ウイルスなど）の後、鼻の生検では、線毛の消失と上皮の異常が平均 13〜17週続いた。拍動数は最初 0.5 Hz（4人）、3週後 10.9 Hz、6週後 12.0 Hz。【要旨】[Wong2005]
  - 感染の後の検査では、拍動数が変わらないまま、打ち方の乱れ（ジスキネジア）が増える例がある（コロナウイルス、RS ウイルス）。【抜粋】
  - 健康な人の鼻の試料でも、縁の 約 10%（6〜24%）に乱れた打ち方の線毛が見られる。【要旨】[Chilvers2003]
  - ウイルスの成分をまねた物質（Poly(I:C)）を培養した鼻の上皮に与えると、線毛細胞への分化が抑えられて杯細胞が増え、線毛が短くなり、拍動数も落ちた。【全文】[Chen2020]
  - 気道の線毛は、細菌（緑膿菌、モラクセラなど）が付着する標的にもなる。【全文】[Tilley2015]
- 粘液の色：感染のとき、黄色や緑色になることがある。緑色は、白血球（好中球）が出す鉄を含む酵素ミエロペルオキシダーゼのヘム（緑色）による。【全文】[Wiki-Mucus][Wiki-Neutrophil]
  ただし色だけでは、ウイルスか細菌かは区別できない。【全文】[Wiki-Cold]
- かぜの症状はふつう1週間ほどで治まり、長くて3週間。【全文】[Wiki-Cold]

### 7.2 アレルギー性鼻炎

- 肥満細胞がヒスタミンなどを出し、血管が広がり、粘液腺が分泌し、神経が刺激される。【全文】[Wiki-AR]
- 内視鏡では、粘膜のむくみで**青白く（ときに青みがかって）ぶよぶよした**下鼻甲介、腫れた鼻甲介、糸を引く粘液が見られる。むくみと青みは重症度と関係した。【全文】[Wiki-AR][Allergy2016]
  ただし「青白い」だけでアレルギーとは決められない。【全文】[Allergy2016]

### 7.3 副鼻腔炎

- 副鼻腔の中の粘液は自然口へ向かって運ばれる。【全文】[Beule2010]　子どもは年に 6〜8回ウイルス性の上気道炎にかかり、その 5〜13% が細菌性の副鼻腔炎に進む。【全文】[Beule2010]
- 粘液線毛クリアランスが生まれつき働かない病気（原発性線毛機能不全症）では、慢性副鼻腔炎、鼻づまり、中耳炎、下気道の感染をくり返す。【全文】[Tilley2015]
- 慢性副鼻腔炎の組織の変化の詳細（数値）：【未確認】（今回は一次資料を読めていない）

### 7.4 ウイルス感染後に、においが消える仕組み（慎重に）

- 新型コロナウイルス（SARS-CoV-2）の感染で、においが急に消えることが多い。
- **嗅細胞そのものは、ウイルスの入口のたんぱく（ACE2、TMPRSS2）をほとんど持たない**。持っているのは**支持細胞**、基底細胞（水平基底細胞）、ボウマン腺などの、神経ではない細胞。【全文】[Brann2020]
- 亡くなった患者の嗅粘膜を調べた研究で、主に感染していたのは支持細胞だった。嗅細胞への感染の証拠は見つからず、嗅球も保たれていた。著者は「支持細胞の支えが一時的に足りなくなることで、嗅細胞は感染せずに働けなくなる」と推定している。【要旨】[Khan2021]
- 支持細胞が壊れた後に起こること（動物での観察を中心とした総説）：【全文】[Butowt2023]
  - 2〜3時間で支持細胞と嗅細胞が離れ、ノブがふくらんで崩れ、**嗅線毛が引っ込む（脱線毛）**。
  - 受容体の遺伝子の働きが 2〜4日で下がる（マウス・ハムスター・ゼブラフィッシュ）。
  - 基底の幹細胞が 3日ほどで分裂を始め、新しい支持細胞が 4〜8日で現れる。
  - ヒトでのにおいの消失は平均 7〜10日ほどで、急に戻ることが多い。
  - 著者は、においが急に戻ることから、新しい嗅細胞の補充より、**生き残った嗅細胞が線毛を生やし直す**ことが主だろうと考えている（**仮説**）。
  - 粘液の量や中身の変化、粘液へのブドウ糖の供給の低下も、候補の仕組みとして挙げられている（**仮説**）。
  - においを失うには、嗅細胞の 90% 以上が働かなくなる必要があると（動物実験からの推定で）考えられている。【全文】[Butowt2023]
- 注意：これらは「最も有力な説」であって、すべてが確定したわけではない。鼻づまり（嗅裂のむくみ）による一時的な嗅覚低下も、仕組みの候補の一つとして挙げられている。【全文】[Butowt2023]
- ゲームでの扱いの提案：「ウイルスが嗅細胞を直接壊す」とは描かない。「支える細胞が傷み、嗅細胞の線毛が縮む → 支持細胞が回復し、線毛が生え直して、においが戻る」なら資料に沿う。

---

## 8. 健康なとき と 病気のときの見え方（ゲームで見せる違い）

| | 健康 | 炎症・感染のとき | 確かめ方 |
|---|---|---|---|
| 線毛 | 長さのそろった線毛がすき間なく立ち、波になって打つ（10〜12 Hz） | 線毛のない「はげた」まだらの場所、短い線毛、ばらばらの打ち方（ジスキネジア）、形のおかしい線毛 | 【全文】[Tilley2015]【要旨】[Carson1985][Wong2005]【画像】(9章) |
| 粘液の川 | 透明でさらさらした薄い層（10〜15 µm）が、喉へ一定の向きに流れる（5〜10 mm/分） | 量が増え、固形分が増えてねばねばし、流れが滞る。黄色〜緑色に濁る | 【全文】[Beule2010][Fahy2010][Wiki-Mucus] |
| 粘膜の表面 | 平らで桃色の呼吸粘膜。上のほうに淡い黄褐色の嗅粘膜 | むくんで厚く盛り上がる。アレルギーでは青白く、ぶよぶよ | 【全文】[Wiki-OlfMucosa][Wiki-AR][Allergy2016] |
| 白血球 | ほとんど見えない | 好中球が組織や粘液の中に集まり、這い回る | 【要旨】[Jarjour2000]【全文】[Fahy2010] |
| 杯細胞 | 線毛細胞の間に点々と | （慢性の炎症・ウイルス反応で）増えて目立つ | 【全文】[Tilley2015][Chen2020]（ただし鼻炎で密度が変わらなかった研究もある【要旨】[Berger1997]） |
| 嗅上皮 | 支持細胞に包まれた嗅細胞のノブから、長い線毛が粘液の中に広がる | 支持細胞が傷み、ノブがふくらんで崩れ、線毛が引っ込む | 【全文】[Butowt2023] |

- 「線毛の波のリズムを整える」の根拠：健康な線毛は協調した波で打ち、粘液を運ぶ。病気では波が乱れ、運びが悪くなる。【全文】[Tilley2015][Burn2022]
- 「炎症を鎮める」の根拠：炎症の物質が血管を広げてむくみを起こし、分泌を増やす。【全文】[Beule2010][Wiki-AR]

## 9. 生きた組織の色（染色の色は使わない）

- 呼吸粘膜：**桃色**（pinkish）。【全文】[Wiki-OlfMucosa]　血管が豊富で、上皮のすぐ下に毛細血管の網がある。【全文】[Beule2010][Wiki-NasalCavity]
- 嗅粘膜：**淡い黄褐色**（yellowish-brown）。【全文】[Wiki-OlfMucosa]
- 粘液：健康なときは透明。感染で黄〜緑。【全文】[Wiki-Mucus]
- 膿（好中球が主体）：白っぽい〜黄色っぽい。【全文】[Wiki-Neutrophil]
- アレルギー性鼻炎の粘膜：青白い、青みがかる。【全文】[Wiki-AR][Allergy2016]
- 炎症の粘膜が「赤く」なる（発赤）：内視鏡の所見の項目として「粘膜の発赤」があることは確かめた【全文】[Allergy2016] が、ウイルス性鼻炎で赤くなる、という記述そのものは今回の資料では確かめていない【未確認】。
- 細胞1個ずつの色：線毛、粘液、上皮細胞はほぼ無色透明と考えられる【未確認】（生体を細胞の大きさで見た色の資料はない）。電子顕微鏡写真の色はすべて後から付けた「疑似カラー」で、本当の色ではない。【画像】

## 10. 参考画像（Wikimedia Commons）

ライセンスは Commons の API で確かめた。CC BY-SA は「同じ条件での再配布」が必要なので、ゲームに素材として入れる場合は注意。比べる目的で見るだけなら問題ない。

| 画像 | ライセンス | 作者 | 見たか／分かること |
|---|---|---|---|
| [Bronchiolar epithelium 4 - SEM.jpg](https://commons.wikimedia.org/wiki/File:Bronchiolar_epithelium_4_-_SEM.jpg)（気管の上皮、走査電顕、10,000倍） | Public domain | Louisa Howard（Dartmouth） | 【画像】線毛細胞の上に、長さのそろった円柱状の線毛がびっしり並び、同じ方向へ寝ている。隣の線毛のない細胞の表面は、短い丸い粒（微絨毛）でおおわれ、線毛の約 5分の1以下の高さ。スケール 2 µm から、線毛の太さは 約 0.2〜0.3 µm と読める。白黒。 |
| [Bronchiolar epithelium 3 - SEM.jpg](https://commons.wikimedia.org/wiki/File:Bronchiolar_epithelium_3_-_SEM.jpg) | Public domain | Charles Daghlian | 未見（説明文：線毛細胞と線毛のない細胞が混じる） |
| [Influenza A virions on cilia human nasal epithelium SEM high magnification.jpg](https://commons.wikimedia.org/wiki/File:Influenza_A_virions_on_cilia_human_nasal_epithelium_SEM_high_magnification.jpg)（ヒトの鼻の上皮の線毛とインフルエンザウイルス） | CC BY 4.0 | Phage1990 | 【画像】線毛（疑似カラーの紫）は先が丸い、なめらかな円柱。その上に、線毛の太さほどの小さな球（ウイルス、疑似カラーの緑）が点々と付く。根元に微絨毛（疑似カラーの青）。色は付けたもの。 |
| [Bronchiolar area cilia cross-sections 1.jpg](https://commons.wikimedia.org/wiki/File:Bronchiolar_area_cilia_cross-sections_1.jpg)（線毛の断面、透過電顕、マウス） | Public domain | Louisa Howard, Michael Binder | 未見（説明文：線毛の断面。9+2 の構造を見る用） |
| [Neutrophil with anthrax copy.jpg](https://commons.wikimedia.org/wiki/File:Neutrophil_with_anthrax_copy.jpg)（炭疽菌を飲み込む好中球、走査電顕） | CC BY 2.5 | Volker Brinkmann | 【画像】好中球は、ひだ（波打つ膜のフリル）の多い不規則な形で、細長く伸びて棒状の細菌に取りつく。後ろには細い尾（ウロポッド）。スケール 5 µm。色は疑似カラー（黄色＝好中球、橙＝細菌）。 |
| [Olfact epithelium.svg](https://commons.wikimedia.org/wiki/File:Olfact_epithelium.svg)（嗅上皮の模式図） | CC BY-SA 3.0 | Joanna Kośmider | 未見 |
| [Head olfactory nerve.jpg](https://commons.wikimedia.org/wiki/File:Head_olfactory_nerve.jpg)（頭部と嗅神経の図） | CC BY 2.5 | Patrick J. Lynch | 未見 |
| [Nasal endoscopy maxillary ostium recirculation.jpg](https://commons.wikimedia.org/wiki/File:Nasal_endoscopy_maxillary_ostium_recirculation.jpg)（鼻の内視鏡写真、上顎洞の出口と粘液） | CC BY-SA 4.0 | Dr atilla | 取得を試みたが回数制限で見られなかった。生きた粘膜の色を確かめる候補。 |

**見られていないもの**：健康な鼻の粘膜の内視鏡カラー写真（色の確認）、ヒトの嗅上皮の電子顕微鏡写真（ノブと線毛）、杯細胞の写真、
粘液の層を断面で見た写真。これらの記述は文章の資料だけから書いた。

---

## 11. 特に確かめられなかった点（まとめ）

- 有効打と回復打の時間の割合。ヒトの鼻でのメタクロナール波の波長と向き（6 µm と 50 µm の食い違い）。
- 嗅ノブの直径、嗅細胞の細胞体・軸索の太さ、嗅上皮の厚み（60〜70 µm という値は信頼できる出所で確かめられなかった）。
- 嗅粘液の厚み（5〜30 µm は抜粋のみ）。
- 嗅粘膜の黄褐色の、生体での原因。
- ウイルス性鼻炎で粘膜が赤くなること（臨床的には一般的と思われるが、資料では確かめていない）。
- 慢性副鼻腔炎の組織変化の数値。一般的な花粉の大きさの範囲。
- StatPearls（NCBI Bookshelf）は読めていない。

## 12. 資料間で食い違った数値（まとめ）

| 項目 | 値 | 扱い |
|---|---|---|
| 線毛の長さ | 4〜7 µm（気道）、5〜10 µm／約 6 µm（鼻、同じ総説の中で2通り）、約 5 µm | 代表 5〜7 µm |
| 1細胞の線毛の本数 | 100〜250、約 200、200〜300 | 約 200〜300 |
| 拍動数 | 鼻 7〜12 Hz、11.5 Hz（大人）、12〜15 Hz、気道 8〜15／10〜20 Hz、32°C で 6.3〜9.0 Hz | 代表 10〜12 Hz、範囲 7〜15 Hz |
| 粘液の層の厚み | 鼻 10〜15 µm、気道 7〜10 µm、0.5〜70 µm、太い気道で最大 50 µm | 鼻 10〜15 µm |
| PCL の厚み | 6 µm（鼻）、約 7 µm（気道）、3 µm（杯細胞の上） | 6〜7 µm |
| 鼻のクリアランス速度 | 2〜25 mm/分、平均 6、6.4、8.1、12.7 mm/分。総説の「mm/時」は単位の誤りと見て不採用 | 代表 5〜10 mm/分 |
| 線毛細胞の割合 | 鼻 20〜50%、気道 50〜80%、気管 47%〜細い気道 73% | 部位による |
| 粘液の水分 | 90%、95%、97% | 90〜97% |
| 嗅上皮の面積 | 2.5、5、10、2〜10 cm² | 代表 約 5 cm²、範囲 2.5〜10 cm² |
| 嗅細胞の数 | 約 1,000万、1,000万〜2,000万 | 1,000万〜2,000万 |
| 嗅細胞1個の線毛 | 10〜15、10〜30、20〜35本 | 10〜30本 |
| 嗅線毛の長さ | 最大 100 µm、5〜20 µm | 数十 µm、最大 100 µm |
| 嗅細胞の入れ替わり | 30〜90日、6〜8週 | 1〜3か月 |
| メタクロナール波の波長 | 約 50 µm（哺乳類の気管）、約 6 µm（ヒトの蝶形骨洞） | 未確定 |

---

## 出所一覧

- [Beule2010] Beule AG. Physiology and pathophysiology of respiratory mucosa of the nose and the paranasal sinuses. GMS Curr Top Otorhinolaryngol Head Neck Surg 2010;9:Doc07. https://pmc.ncbi.nlm.nih.gov/articles/PMC3199822/
- [Gizurarson2015] Gizurarson S. The effect of cilia and the mucociliary clearance on successful drug delivery. Biol Pharm Bull 2015;38(4). https://www.jstage.jst.go.jp/article/bpb/38/4/38_b14-00398/_html
- [Tilley2015] Tilley AE, Walters MS, Shaykhiev R, Crystal RG. Cilia dysfunction in lung disease. Annu Rev Physiol 2015;77:379–406. https://pmc.ncbi.nlm.nih.gov/articles/PMC4465242/
- [Knowles2002] Knowles MR, Boucher RC. Mucus clearance as a primary innate defense mechanism for mammalian airways. J Clin Invest 2002;109:571–577. https://www.jci.org/articles/view/15217
- [Button2012] Button B ほか. A periciliary brush promotes the lung health by separating the mucus layer from airway epithelia. Science 2012;337:937–941. https://pmc.ncbi.nlm.nih.gov/articles/PMC3633213/
- [Kesimer2013] Kesimer M ほか. Molecular organization of the mucins and glycocalyx underlying mucus transport over mucosal surfaces of the airways. Mucosal Immunol 2013. https://pmc.ncbi.nlm.nih.gov/articles/PMC3637662/
- [Fahy2010] Fahy JV, Dickey BF. Airway mucus function and dysfunction. N Engl J Med 2010;363:2233–2247. https://pmc.ncbi.nlm.nih.gov/articles/PMC4048736/
- [Chilvers2003] Chilvers MA, Rutman A, O'Callaghan C. Functional analysis of cilia and ciliated epithelial ultrastructure in healthy children and young adults. Thorax 2003;58:333–338. https://pubmed.ncbi.nlm.nih.gov/12668798/
- [Burn2022] Burn A ほか. A quantitative interspecies comparison of the respiratory mucociliary clearance mechanism. Eur Biophys J 2022;51:51–65. https://pmc.ncbi.nlm.nih.gov/articles/PMC8827335/
- [Xu2019] Xu L, Jiang Y. Mathematical modeling of mucociliary clearance: a mini-review. Cells 2019;8:736. https://pmc.ncbi.nlm.nih.gov/articles/PMC6678682/
- [Austero2022] Austero RM, Gelera JE. Evaluation of nasal mucociliary clearance using saccharin test versus charcoal test among Filipinos. Cureus 2022. https://pmc.ncbi.nlm.nih.gov/articles/PMC8916846/
- [Berger1997] Berger G, Marom Z, Ophir D. Goblet cell density of the inferior turbinates in patients with perennial allergic and nonallergic rhinitis. Am J Rhinol 1997. https://pubmed.ncbi.nlm.nih.gov/9209597/
- [Chen2020] Chen Q, Tan KS ほか. Host antiviral response suppresses ciliogenesis and motile ciliary functions in the nasal epithelium. Front Cell Dev Biol 2020. https://pmc.ncbi.nlm.nih.gov/articles/PMC7779769/
- [Carson1985] Carson JL, Collier AM, Hu SS. Acquired ciliary defects in nasal epithelium of children with acute viral upper respiratory infections. N Engl J Med 1985;312:463–468. https://pubmed.ncbi.nlm.nih.gov/3969108/
- [Wong2005] Wong JY, Rutman A, O'Callaghan C. Recovery of the ciliated epithelium following acute bronchiolitis in infancy. Thorax 2005;60:582–587. https://pubmed.ncbi.nlm.nih.gov/15994267/
- [Jarjour2000] Jarjour NN, Gern JE ほか. The effect of an experimental rhinovirus 16 infection on bronchial lavage neutrophils. J Allergy Clin Immunol 2000. https://pubmed.ncbi.nlm.nih.gov/10856152/
- [Donninger2003] Donninger H ほか. Rhinovirus induction of the CXC chemokine ENA-78 in bronchial epithelium. J Infect Dis 2003. https://pubmed.ncbi.nlm.nih.gov/12751040/
- [Allergy2016] Ziade GK ほか. Reliability assessment of the endoscopic examination in patients with allergic rhinitis. Allergy Rhinol 2016. https://pmc.ncbi.nlm.nih.gov/articles/PMC5244268/
- [Moran1982] Moran DT, Rowley JC, Jafek BW, Lovell MA. The fine structure of the olfactory mucosa in man. J Neurocytol 1982;11:721–746. https://pubmed.ncbi.nlm.nih.gov/7143026/
- [Morrison1990] Morrison EE, Costanzo RM. Morphology of the human olfactory epithelium. J Comp Neurol 1990;297:1–13. https://pubmed.ncbi.nlm.nih.gov/2376627/
- [Paik1992] Paik SI ほか. Human olfactory biopsy: the influence of age and receptor distribution. Arch Otolaryngol Head Neck Surg 1992. https://pubmed.ncbi.nlm.nih.gov/1627295/
- [McClintock2020] McClintock TS ほか. Maturation of the olfactory sensory neuron and its cilia. Chem Senses 2020. https://pmc.ncbi.nlm.nih.gov/articles/PMC8133333/
- [Butowt2023] Butowt R, Bilinska K, von Bartheld CS. Olfactory dysfunction in COVID-19: new insights into the underlying mechanisms. Trends Neurosci 2023;46:75–90. https://pmc.ncbi.nlm.nih.gov/articles/PMC9666374/
- [Brann2020] Brann DH, Tsukahara T, Weinreb C ほか. Non-neuronal expression of SARS-CoV-2 entry genes in the olfactory system suggests mechanisms underlying COVID-19-associated anosmia. Sci Adv 2020;6:eabc5801. https://pmc.ncbi.nlm.nih.gov/articles/PMC10715684/ （PMID 32937591）
- [Khan2021] Khan M ほか. Visualizing in deceased COVID-19 patients how SARS-CoV-2 attacks the respiratory and olfactory mucosae but spares the olfactory bulb. Cell 2021;184:5932–5949. https://pubmed.ncbi.nlm.nih.gov/34798069/
- Wikipedia（英語版）：[Wiki-NasalCavity] https://en.wikipedia.org/wiki/Nasal_cavity ／ [Wiki-RespEpi] https://en.wikipedia.org/wiki/Respiratory_epithelium ／
  [Wiki-MCC] https://en.wikipedia.org/wiki/Mucociliary_clearance ／ [Wiki-Mucus] https://en.wikipedia.org/wiki/Mucus ／
  [Wiki-GobletCell] https://en.wikipedia.org/wiki/Goblet_cell ／ [Wiki-OlfEpi] https://en.wikipedia.org/wiki/Olfactory_epithelium ／
  [Wiki-OlfMucosa] https://en.wikipedia.org/wiki/Olfactory_mucosa ／ [Wiki-OlfGland] https://en.wikipedia.org/wiki/Olfactory_glands ／
  [Wiki-ORN] https://en.wikipedia.org/wiki/Olfactory_receptor_neuron ／ [Wiki-Odor] https://en.wikipedia.org/wiki/Odor ／
  [Wiki-OBP] https://en.wikipedia.org/wiki/Odorant-binding_protein ／ [Wiki-Neutrophil] https://en.wikipedia.org/wiki/Neutrophil ／
  [Wiki-Cold] https://en.wikipedia.org/wiki/Common_cold ／ [Wiki-AR] https://en.wikipedia.org/wiki/Allergic_rhinitis ／
  [Wiki-Pollen] https://en.wikipedia.org/wiki/Pollen ／ [Wiki-SA] https://en.wikipedia.org/wiki/Staphylococcus_aureus

## 形の仕様書の一覧（atlas/）

`ciliated_cell.md`（線毛細胞）、`cilium.md`（線毛）、`goblet_cell.md`（杯細胞）、`mucus.md`（粘液）、`olfactory_neuron.md`（嗅細胞）、
`sustentacular_cell.md`（支持細胞）、`basal_cell.md`（基底細胞）、`neutrophil.md`（好中球）
