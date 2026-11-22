# 目（ステージ1）の資料

調査日：2026-11-22。ステージ1「目」に登場させるものの、実際の構造・大きさ・色・不調の仕組みをまとめた。
対象ごとの「形の仕様書」は `atlas/` にある（末尾の一覧を参照）。

## この文書の読み方

各記述の末尾に、確かめ方の印を付けた。

- 【全文】… 資料の本文を取得して、該当箇所を自分で読んだ。
- 【要旨】… 論文の要旨（アブストラクト）だけを読んだ。本文は読めていない。
- 【抜粋】… 検索結果に出た抜粋だけで確認した。本文は読めていない。採用前に再確認が望ましい。
- 【画像】… 写真そのものを画像として取得し、自分で見た。
- 【計算】… 資料の数値から、この文書の中で計算した値。資料に直接は書かれていない。
- 【未確認】… 今回の調査では出所を確かめられなかった。事実として使わないこと。

調査の制約：NCBI Bookshelf（StatPearls）と PubMed Central の閲覧ページは、この環境からは自動取得が拒否された（ブラウザ確認画面になる）。
そのため StatPearls は1つも読めていない。PubMed の要旨と、オープンアクセス論文の本文は NCBI の公開 API（E-utilities）経由で取得した。
Webvision、OpenStax、Wikipedia は本文を取得できた。

---

## 1. 全体の大きさと、光の通り道

- 眼球は、前後の長さ 24〜25 mm、横幅 24 mm、容積 約 6.5 mL のほぼ球形。【全文】[WV-Gross]
- 光の通り道（前から後ろへ）：
  **涙の膜 → 角膜 → 前房（房水）→ 瞳孔（虹彩の穴）→ 水晶体 → 硝子体 → 網膜（内側の面から入り、厚みを貫いて視細胞へ）→ 網膜色素上皮（残りの光を吸収）**。
  【全文】[WV-Simple][OpenStax]
- 屈折力：角膜 約 43 D、水晶体（遠くを見ているとき）約 20 D、目全体 約 60 D、調節による変化 約 8 D。
  屈折率：空気 1.000、水 1.333、角膜 1.376。瞳孔の直径 1〜8 mm。【全文】[WV-Facts]
- 光を曲げる主役は角膜（空気との境目）で、水晶体はピント合わせを受け持つ。【全文】[WV-Facts][OpenStax]
- 見える光の波長：370〜730 nm。明るい所での感度の頂点 555 nm、暗い所で 507 nm。【全文】[WV-Facts]

ゲーム内の尺度の目安（髪の毛の太さ 約 70 µm と比べる。髪の出所は各仕様書を参照）：

| もの | 大きさ | 髪の毛（約70 µm）との比 |
|---|---|---|
| 角膜の中央の厚み | 約 520〜565 µm | 約 8本分 |
| 水晶体 | 直径 約 10 mm、厚み 約 4 mm | 厚みで 約 57本分 |
| 硝子体の奥行き | 眼球の約5分の4（体積 約 4 mL） | — |
| 網膜の厚み | 0.1〜0.32 mm（場所による） | 1.5〜4.5本分 |
| 網膜毛細血管の内径 | 約 5〜8 µm | 約 10分の1 |
| 赤血球の直径 | 約 7.8 µm | 約 9分の1 |

---

## 2. 角膜（cornea）

- 透明な、血管のない膜。中央の厚みは 約 520 µm（別資料で 551〜565 µm）。縁では 約 670 µm。【抜粋】[Wiki-Cornea ほか]
- 5層（前から）：上皮（約 50 µm）／ボーマン層（8〜14 µm、細胞なし）／実質／デスメ膜（5〜20 µm、年齢で厚くなる）／内皮（厚み 約 5 µm の1層）。
  【全文】[Wiki-Cornea]（上皮とボーマン層の数値は【抜粋】）
- 実質：角膜の厚みの最大 90%。主に I 型コラーゲンの細線維が規則正しく並んだ層（ラメラ）が 約 200 枚、1枚 1.5〜2.5 µm。
  ラメラの間に、角膜実質細胞（keratocyte）がまばらに挟まる。【全文】[Wiki-Cornea]
- 内皮：ミトコンドリアの多い、ほぼ六角形の細胞が1層に敷き詰まる。成人の密度 約 2,400〜3,200 個/mm²。
  水を汲み出して実質を「やや乾いた」状態に保ち、透明さを守る。【全文】[Wiki-CornealEndo]
- 透明の理由：細いコラーゲン細線維が、光の波長より十分に細かい間隔で規則的に並ぶため、散乱が打ち消される。
  【全文】[Wiki-Cornea]（細線維の径と間隔の数値は【未確認】）
- 生体での見え方：無色透明。斜めから細い光を当てる（細隙灯）と、うっすら灰白色の光の帯として断面が見える程度。【未確認】（一般的な臨床知識。今回、文献では確かめていない）

## 3. 水晶体（lens）

- 両面が凸の透明な構造。成人で直径 約 10 mm、厚み 約 4 mm（調節と年齢で変わる）。前面より後面のほうが強く曲がる。【全文】[Wiki-Lens]
- 外から内へ：水晶体嚢（基底膜）→ 前面だけにある1層の上皮 → 線維細胞の層（皮質）→ 中心の核。【全文】[Wiki-Lens]
- 線維細胞は、玉ねぎのように同心の層を作る。赤道で切ると断面は六角形で、蜂の巣のように見える。【全文】[Wiki-Lens]
- 新しい線維は赤道部の上皮から作られ、外側へ積み重なる。古い線維ほど中心にあり、一生捨てられない。【全文】[Wiki-Lens]
- 成熟した線維には核も小器官もない。瞳孔の奥にあたる領域の細胞から、光を散らす核や小器官が計画的に取り除かれる。
  【要旨・抜粋】[Bassnett2011] 【全文】[Wiki-Lens]
- 屈折率は中心で 約 1.406、外側の層で 約 1.386。【全文】[Wiki-Lens]
- 血管はない。栄養は房水から受ける。【全文】[Wiki-Cataract]
- 詳細は `atlas/lens_fiber.md`。

## 4. 硝子体（vitreous body）

- 水晶体と網膜の間を満たす、透明なゲル。眼球の体積の約5分の4（約 4 mL）。【全文】[Wiki-Vitreous]
- 98〜99%が水（別資料で 98〜99.7%）。血管はない。細胞はごくわずか（硝子体細胞）。【全文】[Wiki-Vitreous][Phillips2022]
- 細いコラーゲン細線維のまばらな網に、ヒアルロン酸の網が重なってゲルになる。屈折率 1.336。粘り気は水の2〜4倍。【全文】[Wiki-Vitreous]【要旨】[Bishop2000]
- 詳細は `atlas/vitreous.md`。

## 5. 網膜（retina）

### 5.1 大きさと厚み

- 鋸状縁から鋸状縁まで 約 32 mm。面積 約 1,094 mm²。【全文】[WV-Facts]
- 厚み（場所による）：中心窩の底で最も薄く 0.10 mm（縮みの少ない標本で 0.15〜0.20 mm）、中心窩の縁で最も厚く 0.23 mm（同 0.32 mm）、
  周辺へ薄くなり、鋸状縁で 0.08 mm。【全文】[WV-Facts]
  ※ Webvision の別の章は「網膜は約 0.5 mm」と書くが [WV-Simple]、実測値を並べた章 [WV-Facts] の最大値は 0.32 mm。**資料内で食い違う**。仕様には実測値のほうを使う。
- 生体（OCT）での中心の厚み：平均 278 µm（266〜291）。【全文】[Nieves2017]
- 視角1度は網膜上で 約 288 µm。【全文】[WV-Facts]

### 5.2 10層の並び（硝子体側 → 脈絡膜側。光はこの順に進む）

| 順 | 層（日本語／英語） | 中身 |
|---|---|---|
| 1 | 内境界膜 ILM | ミュラー細胞の終足と基底膜。硝子体との境 |
| 2 | 神経線維層 NFL | 神経節細胞の軸索。視神経乳頭へ向かって弧を描く |
| 3 | 神経節細胞層 GCL | 神経節細胞の細胞体 |
| 4 | 内網状層 IPL | シナプスの層 |
| 5 | 内顆粒層 INL | 双極細胞・水平細胞・アマクリン細胞・ミュラー細胞の細胞体 |
| 6 | 外網状層 OPL | 視細胞と次の神経のシナプス。中心部では斜めに走る錐体の軸索（ヘンレ線維層）を含む |
| 7 | 外顆粒層 ONL | 桿体と錐体の細胞体（核） |
| 8 | 外境界膜 ELM | ミュラー細胞と視細胞の接着帯が並んだ線（膜ではない） |
| 9 | 視細胞層 | 桿体・錐体の内節と外節 |
| 10 | 網膜色素上皮 RPE | 色素を持つ1層の上皮 |

【全文】[Wiki-Retina][WV-Simple]

- **光の向き**：光は 1 → 9 の順に、透明な神経の層をすべて貫いてから、いちばん奥の視細胞に届く（網膜は「裏返し」の構造）。
  信号は逆向きに、視細胞 → 双極細胞 → 神経節細胞 → 視神経へ流れる。【全文】[WV-Simple][OpenStax]
- 各層の厚みの例（OCT、中心窩を含む中央の区画、健常100眼の平均）：NFL 11.4 µm、GCL 13.3、IPL 19.4、INL 18.2、OPL 23.3、ONL 92.0、
  視細胞層 88.3、RPE 16.7。【抜粋】（出典は韓国の Spectralis OCT の研究。本文未読。中心窩を含むため内側の層が薄い値になっている）
- 別の健常群（OCT、中央）：NFL 12.6 µm、GCL 17.6、IPL 22.0。【全文】[Nieves2017]
- 組織標本（中心窩から 1 mm）：GCL が網膜の厚みの 17〜21%、INL が 18〜19%、OPL（ヘンレ線維層を含む）が 14〜17%。
  標本の縮みは全体で中央値 14.5%、中心窩で 29%。【要旨】[Curcio2011]
- **中心窩から離れた場所での、各層の絶対的な厚み（µm）の一覧は【未確認】**（機器と区分法で変わり、1つの表にまとまった資料を読めていない）。

### 5.3 中心窩と黄斑

- 視神経乳頭：約 1.86 × 1.75 mm の白っぽい円。中心窩はその縁から耳側へ 約 3.4 mm。【全文】[WV-Facts]
- 中心窩（縁から縁まで）1.2〜1.5 mm。中央の窪み（中心小窩）は直径 約 200 µm で、ここは錐体だけの薄い層になる。【全文】[WV-Facts][WV-Simple]
- 桿体のない領域の直径：250〜750 µm と資料で幅がある（Curcio 1990 は平均 350 µm）。【全文】[WV-Facts]【要旨】[Curcio1990]
- 血管のない領域（中心窩無血管域）：直径 450〜600 µm。【全文】[WV-Simple]
- 黄斑の黄色は、錐体の軸索（ヘンレ線維層）にあるカロテノイド（ルテイン、ゼアキサンチン）による。【全文】[WV-Simple]

### 5.4 網膜の血管と毛細血管網

- 網膜には2系統の血液が来る。網膜中心動脈（内側の層を養う）と、脈絡膜の血管（外側の層を養う）。
  目に来る血流の 65〜85% は脈絡膜へ、残り 20〜30% が網膜中心動脈へ。【全文】[WV-Simple]
- **外側の網膜（視細胞の層）には血管がない**。視細胞は、色素上皮の後ろにある脈絡毛細血管板から、ブルッフ膜と色素上皮を通して養われる。【全文】[WV-Simple][Lutty2010]
- 毛細血管網の層（黄斑の周りでは最大4つ）：【全文】[Campbell2017]【要旨】[Chan2012]

| 名前 | ある深さ | 形 |
|---|---|---|
| 放射状乳頭周囲毛細血管網 RPCP | 神経線維層（乳頭の周りだけ） | 神経線維に沿って長くまっすぐ、枝分かれ・つながりが少ない |
| 表層血管網 SVP | 主に神経節細胞層 | 太い動脈・静脈と毛細血管が混じる |
| 中間毛細血管網 ICP | 内網状層と内顆粒層の境（内顆粒層の内側の縁） | 小葉状の網。立体的 |
| 深層毛細血管網 DCP | 内顆粒層と外網状層の境（内顆粒層の外側の縁） | 小葉状で、1枚の平面に近い |

- 網と網の間には毛細血管のない層があり、表層の細動脈・細静脈から出た縦の枝がそこを貫いてつなぐ。【全文】[Campbell2017]
- 中心窩無血管域の縁では、3つの網が1つの輪にまとまる。周辺部では ICP と DCP が1つになる。【全文】[Campbell2017]
- 毛細血管は神経線維層から外網状層まであり、まれに外顆粒層まで入る。【全文】[WV-Simple]
- 毛細血管の内径、網目の間隔、流れの速さは `atlas/retinal_capillary.md`。
- 毛細血管は連続型（穴がない）で、内皮細胞どうしが密着結合でつながり、**内側の血液網膜関門**を作る。
  色素上皮の密着結合が**外側の血液網膜関門**を作る。【全文】[Huang2020][WV-RPE]

### 5.5 生体では網膜は透明

- 網膜の神経の層は生体では透明で、検眼鏡で見たとき、眼底の見え方にほとんど寄与しない。【抜粋】（眼科の教材。本文未読）
  Wikipedia は「部分的に透明」と書く。【全文】[Wiki-Retina]
- 細胞はほぼ透明だが、形と屈折率が違う「位相物体」なので、本来は光を散らす。ミュラー細胞は漏斗の形で、周りより屈折率が高く、
  光の進む向きに並んでいて、網膜の表面から視細胞まで散乱の少ない光の通り道になる。【要旨】[Franze2007]
- 中心窩では内側の層が脇へ押しのけられ、光がほぼ直接、錐体に届く。【全文】[WV-Simple][OpenStax]
- 虚血になると、この透明さが失われる（7.2 を参照）。

## 6. 網膜色素上皮・ブルッフ膜・脈絡膜

- 網膜色素上皮（RPE）：色素顆粒（メラノソーム）を持つ六角形の細胞が、密着結合でつながった1層の敷石。視細胞の外節と脈絡膜の血流の間にある。【全文】[WV-RPE]
  詳細は `atlas/rpe.md`。
- ブルッフ膜：色素上皮と脈絡毛細血管板の間の、厚み 2〜4 µm の膜。5層（色素上皮の基底膜／内コラーゲン層／弾性線維層／外コラーゲン層／脈絡毛細血管板の基底膜）。
  年齢とともに厚くなり、物質の行き来が遅くなる。【全文】[Wiki-Bruch]
- 脈絡膜：網膜と強膜の間の、血管に富んだ層。厚みは Wikipedia で後極 0.2 mm・周辺 0.1 mm【全文】[Wiki-Choroid]、
  生体計測では若い成人の中心窩の下で 約 250〜350 µm【抜粋】。**資料で食い違う**（標本と生体の違い、年齢、近視の度合いで変わる）。
- 脈絡膜の血管は3層（外から：太い動静脈／中くらいの細動静脈／内側の毛細血管床）。【全文】[WV-Simple]
- 脈絡毛細血管板（choriocapillaris）：ブルッフ膜のすぐ外にある1層の毛細血管。内腔は広く平たく、直径 20〜50 µm。
  後極では蜂の巣状（小葉状）につながる。壁に小さな窓（有窓）があり、窓の多くは網膜側を向く。【全文】[Lutty2010]
  生体（OCTA）での血管径は平均 22.8 µm（9.6〜40.2）。【抜粋】
  → 網膜の毛細血管（内径 約 5〜8 µm、窓なし）とは、太さも壁のつくりも違う。

## 7. 代表的な不調の、実際の仕組み

治し方はゲームの作り事。ここに書くのは、実際に起きることだけ。

### 7.1 白内障（水晶体の濁り）

- 水晶体は主に水とクリスタリンというタンパク質でできている。【全文】[Wiki-Cataract]
- 水晶体の線維細胞はタンパク質を作り直せないので、クリスタリンは一生使い続けられ、年齢とともに傷みが積もる
  （脱アミド化、酸化、切断、架橋など）。【全文】[Lampi2014]【抜粋】（αクリスタリンの修飾についての総説）
- 傷んだクリスタリンは形が崩れ、互いにくっついて、水に溶けない大きなかたまり（高分子量の凝集体）になる。
  このかたまりが光を散らし、濁りになる。【全文】[Lampi2014]【抜粋】
- αクリスタリンは、ほかのタンパク質の凝集を防ぐ「分子シャペロン」として働くが、年齢とともに使い尽くされ、修飾されて働きが落ちる。【抜粋】
- 紫外線と酸化ストレスが主な要因。【全文】[Wiki-Cataract]【抜粋】
- 見え方【画像】：細隙灯の写真（Wikimedia Commons「Cataract in human eye」）では、黒いはずの瞳孔の奥が、灰白色〜乳白色に濁って見える。
- 核白内障で水晶体が黄色〜褐色を帯びること：【未確認】（今回、出所を確かめていない）

### 7.2 網膜の虚血／毛細血管の閉塞と無灌流

**(a) 急な虚血で網膜が白く濁る**

- 網膜中心動脈が詰まると、内側の網膜が虚血になり、まず強くむくむ。約1か月かけてむくみが引き、内側の網膜は薄く萎縮する。【全文】[EyeWiki-RAO]
- 白くなる理由：血流が止まった細胞に水が入り込んで膨らみ（細胞の中のむくみ）、内側の網膜の透明さが損なわれる。
  神経節細胞層がいちばん厚い中心窩の周りで、濁りが最も強くなる。【全文】[McLeod2012][EyeWiki-RAO]
- 中心窩は内側の層がないので濁らず、下の脈絡膜の赤が透けて「桜実紅斑（cherry-red spot）」になる。
  外側の網膜は脈絡膜から養われるので、この時点では生きている。白濁が現れるまで数時間かかる。【全文】[EyeWiki-RAO]
- 血流がわずかでも残れば、組織は生きて透明さを保てる。【全文】[McLeod2012]
- 見え方【画像】：網膜中心動脈閉塞の眼底写真（Wikimedia Commons）では、橙赤色だった眼底が、乳白色〜淡い黄緑がかった白に変わり、
  中心に小さな橙赤の点が残る。血管は細く見える。
- 綿花様白斑（cotton wool spot）：神経線維層の小さな虚血で、軸索の中の物質の流れが止まり、たまって膨らんだ所。
  ふわっとした不透明な白い斑点として見え、4〜12週で消えることがある。【全文】[Wiki-CWS]
  見え方【画像】：糖尿病網膜症の眼底写真では、縁のぼやけた黄白色の斑点。

**(b) 毛細血管が少しずつ失われる（糖尿病網膜症の初期の仕組み）**

- 健康な網膜の毛細血管では、内皮細胞と周皮細胞の数の比が 約 1:1。糖尿病では 約 4:1 まで周皮細胞が減る。【全文】[DEsposito2025][Arboleda2015]
- 周皮細胞の脱落は、糖尿病網膜症で最も早く現れる形の変化の1つ。動物の研究では、周皮細胞が先に消え、続いて内皮細胞が消えて、
  **細胞のない、血の流れない毛細血管（acellular capillary）**が残る。ヒトでの正確な順序は確定していない。【全文】[Hammes2011]
- 周皮細胞を失った毛細血管は不安定になり、内皮の働きが乱れ、血液成分が漏れ、小さなこぶ（毛細血管瘤）ができる。
  毛細血管瘤は、細胞のない毛細血管の周りに集まって見つかる。【全文】[DEsposito2025][Hammes2011]
- 毛細血管の基底膜が厚くなる。ヒトの網膜で、正常 292 ± 24 nm に対し糖尿病 583 ± 39 nm。【全文】[Roy2020]（Bianchi 2016 の値を表から引用）
- 無灌流の区域が広がると、虚血になった網膜が VEGF などを出し、異常な新生血管ができる（増殖網膜症）。【全文】[Hammes2011]
- ヒトの提供眼での実測（乳頭周囲）：毛細血管の内径は対照 6.6 ± 0.9 µm → 糖尿病 9.1 ± 1.2 µm に拡張。
  毛細血管どうしの間隔は対照 99.5 ± 13.7 µm → 糖尿病 133.3 ± 82.8 µm（最大 564 µm）に広がる（＝網目が抜ける）。【全文】[An2020]
- 白血球が毛細血管に詰まること（白血球うっ滞）、「周皮細胞のゴースト」という所見：【未確認】（今回、出所を読めていない）

### 7.3 視細胞外節の障害

- 外節の円板は絶えず作り直される。根元で新しい円板が足され、古い円板は先端へ押し上げられ、先端でちぎれて色素上皮に食べられる。
  桿体は朝（明るくなった直後）、錐体は暗くなったときに、まとめて先端を落とす。【全文】[WV-Photo]
- 網膜が色素上皮からはがれる（網膜剥離）と、はがれた範囲のすべての視細胞で外節が崩れて短くなる。これが最も早く目立つ障害。
  網膜を戻せば、外節の変性は元に戻りうる。色素上皮の先端の突起も形を変える。【全文】[WV-Detach]
- 色素上皮が外節の先端を食べられない場合（MERTK という受容体の異常など）、食べ残しの膜のかけらが視細胞と色素上皮の間にたまり、
  酸素や栄養の受け渡しを妨げ、視細胞が死んでいく。【抜粋】
- 網膜色素変性では、多くは桿体に関わる遺伝子の異常で、周辺部の桿体から変性が始まる。【全文】[WV-Simple]
- 加齢黄斑変性では、色素上皮が変性し、ドルーゼン（白い斑点状の沈着）ができ、中心窩の錐体が失われる。【全文】[WV-Simple]
- 強い光や酸化ストレスが外節を直接傷める仕組み：【未確認】（今回、出所を読めていない）

### 7.4 健康な状態と病んだ状態の見た目の差（事実に基づく候補）

| 場所 | 健康 | 病んだ状態 | 根拠 |
|---|---|---|---|
| 水晶体 | 無色透明。線維が規則正しく並ぶ | 灰白色〜乳白色の濁り（タンパクの凝集による散乱） | 7.1 |
| 網膜（内側） | 透明で、奥の橙赤色が透ける | 乳白色に濁る。中心窩だけ赤が残る | 7.2(a) |
| 毛細血管 | 赤血球が1列で流れる。網目の間隔 約 100 µm | 流れが止まる。血球のいない空の管。網目が抜け、間隔が広がる。残った管は太くなる | 7.2(b) |
| 毛細血管の壁 | 周皮細胞が周りの 85% 以上を覆う | 周皮細胞が抜け落ちる。こぶ（毛細血管瘤） | 7.2(b) |
| 視細胞 | 外節がそろって長く伸びる | 外節が短く崩れる。色素上皮との間に膜のかけらがたまる | 7.3 |

---

## 8. 眼底が橙赤色に見える理由（生体での色）

- 検眼鏡で見る眼底の橙赤色は、**脈絡膜の血液（ヘモグロビン）**と、**色素上皮と脈絡膜のメラニン**で決まる。
  光は透明な網膜を通り抜け、色素上皮と脈絡膜で一部が吸収され、脈絡膜の血管と強膜で跳ね返って戻ってくる。【抜粋】（眼科の教材と反射モデルの論文。本文未読）
- 色の個人差の主な原因は脈絡膜のメラニンの量。色素が濃いほど暗い眼底に、薄いほど明るく赤い眼底になり、
  色素がほとんどない場合は脈絡膜の血管が透けて見える。【抜粋】
- ヒトの眼底（色素の薄い人）は赤い。ほかの霊長類では青・緑・黄・橙などもある。【全文】[Wiki-Fundus]
- 自分で見た写真【画像】：
  - 健常な眼底写真（Wikimedia Commons「Fundus photograph of normal left eye」）：全体が均一な橙赤色。黄斑は少し暗い赤褐色。
    視神経乳頭は淡い黄色〜桃色の円。血管は乳頭から放射状に枝分かれし、静脈は太く暗い赤、動脈はやや細く明るい赤。網膜そのものの色や模様は見えない。
  - Webvision の眼底写真（Fig. 14）：橙〜黄橙色。中心窩の周りがわずかに黄色い（黄斑色素）。
  - 単色光の眼底像と OCT（Webvision Fig. 13a）：中心窩の窪みと層構造が断面で見える（OCT の色は疑似カラーなので色の参考にはしない）。
- 主人公が網膜の中から見る場合の色（上の事実からの整理）：
  神経の層や細胞は無色透明に近い。色を持つのは、(1) 血管の中の赤血球（赤）、(2) 色素上皮と脈絡膜（暗褐色〜黒褐色のメラニン）、
  (3) 暗い所での桿体外節の淡い赤紫（ロドプシン）、(4) 黄斑の淡い黄色（カロテノイド）。
  瞳から入る光は前（硝子体側）から来て、奥（色素上皮側）は暗く、橙赤〜赤褐色の反射が返ってくる。

---

## 9. 参考写真を画像として見られたか

**見られた。** この環境では、Webvision と Wikimedia Commons の画像ファイルを取得し、画像として表示して確認できた。見たものは次のとおり。

| 画像 | 出所 | 見て分かったこと |
|---|---|---|
| 健常な眼底のカラー写真 | Wikimedia Commons: Fundus photograph of normal left eye | 眼底の橙赤色、血管と乳頭の色（8章） |
| 黄斑のカラー眼底写真 | Webvision Simple Anatomy, Fig. 14 | 黄斑の黄色み |
| 眼底像＋OCT断面 | Webvision Simple Anatomy, Fig. 13a | 中心窩の窪みの形 |
| 網膜中心動脈閉塞の眼底写真 | Wikimedia Commons: Cherry red spot in patient with CRAO | 網膜の乳白色の濁りと桜実紅斑 |
| 糖尿病網膜症の眼底写真 | Wikimedia Commons: Fundus Proliferative retinopathy EDA01 | 綿花様白斑、異常な血管 |
| 白内障の細隙灯写真 | Wikimedia Commons: Cataract in human eye | 瞳孔の奥の灰白色の濁り |
| 中心窩の錐体モザイク（接線方向の切片、微分干渉） | Webvision Photoreceptors, Fig. 13/19 | 錐体の六角形の詰まり方、S錐体が大きいこと |
| 霊長類の錐体モザイク（免疫染色） | Webvision Photoreceptors, Fig. 17 | 周辺部で大きな錐体の周りを小さな桿体が囲む並び（色は染色なので不採用） |
| サルの黄斑の毛細血管の鋳型（走査電顕） | Webvision Simple Anatomy, Fig. 19 | 網目の形、動脈の周りの毛細血管のない帯 |
| 色素上皮の光顕写真と模式図 | Webvision RPE, Fig. 1 | 色素上皮・外節・脈絡毛細血管板の位置関係（染色の色は不採用） |

**見られていないもの**：生きた網膜の細胞を補償光学で撮った画像（毛細血管を流れる赤血球、生体の色素上皮のモザイク）、
水晶体線維の走査電顕写真、周皮細胞の写真、硝子体・血小板・ミトコンドリアの写真。これらの仕様書は文章の記述だけから書いた。
対象ごとの確認の方法は、各仕様書の最後の節に書いた。

---

## 10. 特に確かめられなかった点（まとめ）

- StatPearls（NCBI Bookshelf）は取得できず、1つも読めていない。
- 網膜各層の、場所ごとの絶対的な厚みの一覧。
- 角膜のコラーゲン細線維の径と間隔。
- 核白内障の黄色〜褐色の着色。
- 白血球うっ滞、周皮細胞のゴースト。
- 光・酸化ストレスによる外節の直接の障害の仕組み。
- 内皮細胞の厚みと核のふくらみの数値、周皮細胞の細胞体と突起の寸法、ヒトの水晶体線維の長さ、
  色素上皮の微絨毛の長さと「1日に外節の約10%を貪食」という数値（各仕様書を参照）。

## 11. 資料間で食い違った数値（まとめ）

| 項目 | 値A | 値B | 扱い |
|---|---|---|---|
| 網膜の厚み | 約 0.5 mm [WV-Simple] | 0.08〜0.32 mm [WV-Facts] | 実測の B を使う |
| 脈絡膜の厚み | 0.1〜0.2 mm [Wiki-Choroid] | 中心窩の下 250〜350 µm（生体）【抜粋】 | 100〜350 µm の範囲 |
| 角膜中央の厚み | 約 520 µm | 551〜565 µm | 520〜565 µm の範囲 |
| 錐体の総数 | 640万（Osterberg 1935）[WV-Facts] | 460万（Curcio 1990） | 460万〜640万 |
| 桿体の総数 | 1.1〜1.25億（Osterberg）[WV-Facts] | 9,200万（Curcio 1990） | 0.9〜1.25億 |
| 中心窩の錐体の最高密度 | 147,000/mm²（Osterberg） | 平均 199,000（100,000〜324,000）（Curcio 1990） | 10万〜32万、代表値 約 20万 |
| 桿体のない領域の直径 | 250 µm | 750 µm（Curcio は 350 µm） | 250〜750 µm、代表値 350 µm |
| 中心窩の錐体の内節の径 | 約 1.5 µm [WV-Photo] | 約 2.5 µm【抜粋】 | 1.5〜2.5 µm |
| 毛細血管の内径（ヒト網膜） | 6.6 ± 0.9 µm（標本）[An2020] | 3.2〜8.4 µm（生体）【抜粋】／約 8 µm【抜粋】 | 約 3〜8 µm、代表値 5〜7 µm |
| 色素上皮の密度（中心窩） | 4,220 ± 727/mm²（標本） | 6,026 ± 1,590/mm²（生体） | 4,000〜6,000/mm² |
| 赤血球の直径 | 7.82 µm（Evans & Fung） | 6.2〜8.2 µm [Wiki-RBC]、8.1 µm（血漿中）[Fischer2022] | 代表値 7.8 µm |
| 硝子体の水の比率 | 98〜99% | 98〜99.7% | 98〜99.7% |
| 血小板の直径 | 2〜3 µm [Wiki-Platelet] | 2〜4 µm【抜粋】 | 2〜4 µm |

---

## 出所一覧

- [WV-Gross] Kolb H. Gross Anatomy of the Eye. Webvision. https://webvision.med.utah.edu/book/part-i-foundations/gross-anatomy-of-the-ey/
- [WV-Simple] Kolb H. Simple Anatomy of the Retina. Webvision. https://webvision.med.utah.edu/book/part-i-foundations/simple-anatomy-of-the-retina/
- [WV-Facts] Kolb H. Facts and Figures Concerning the Human Retina. Webvision. https://webvision.med.utah.edu/book/part-xiii-facts-and-figures-concerning-the-human-retina/
- [WV-Photo] Kolb H. Photoreceptors. Webvision. https://webvision.med.utah.edu/book/part-ii-anatomy-and-physiology-of-the-retina/photoreceptors/
- [WV-RPE] Strauss O. The Retinal Pigment Epithelium. Webvision. https://webvision.med.utah.edu/book/part-ii-anatomy-and-physiology-of-the-retina/the-retinal-pigment-epithelium/
- [WV-Detach] Fisher SK ほか. Cellular Remodeling in Mammalian Retina Induced by Retinal Detachment. Webvision. https://webvision.med.utah.edu/book/part-xii-cell-biology-of-retinal-degenerations/cellular-remodeling-in-mammalian-retina-induced-by-retinal-detachment/
- [OpenStax] OpenStax Anatomy and Physiology 2e, 14.1 Sensory Perception. https://openstax.org/books/anatomy-and-physiology-2e/pages/14-1-sensory-perception
- [Campbell2017] Campbell JP ほか. Detailed Vascular Anatomy of the Human Retina by Projection-Resolved OCT Angiography. Sci Rep 2017;7:42201. https://pmc.ncbi.nlm.nih.gov/articles/PMC5301488/
- [Chan2012] Chan G ほか. Quantitative morphometry of perifoveal capillary networks in the human retina. IOVS 2012;53:5502. https://pubmed.ncbi.nlm.nih.gov/22815351/
- [An2020] An D ほか. Non-Proliferative Diabetic Retinopathy Is Characterized by Nonuniform Alterations of Peripapillary Capillary Networks. IOVS 2020. https://pmc.ncbi.nlm.nih.gov/articles/PMC7401967/
- [Nieves2017] Nieves-Moreno M ほか. Normative database for separate inner retinal layers thickness using SD-OCT in Caucasian population. PLoS ONE 2017. https://pmc.ncbi.nlm.nih.gov/articles/PMC5498048/
- [Curcio2011] Curcio CA ほか. Human chorioretinal layer thicknesses measured in macula-wide, high-resolution histologic sections. IOVS 2011. https://pubmed.ncbi.nlm.nih.gov/21873658/
- [Curcio1990] Curcio CA ほか. Human photoreceptor topography. J Comp Neurol 1990;292:497. https://pubmed.ncbi.nlm.nih.gov/2324310/
- [Franze2007] Franze K ほか. Müller cells are living optical fibers in the vertebrate retina. PNAS 2007;104:8287. https://pmc.ncbi.nlm.nih.gov/articles/PMC1895942/
- [Huang2020] Huang H. Pericyte-Endothelial Interactions in the Retinal Microvasculature. Int J Mol Sci 2020;21:7413. https://pmc.ncbi.nlm.nih.gov/articles/PMC7582747/
- [Lutty2010] Lutty GA ほか. Development of the human choriocapillaris. Eye 2010. https://pmc.ncbi.nlm.nih.gov/articles/PMC4848024/
- [Bassnett2011] Bassnett S, Shi Y, Vrensen GFJM. Biological glass: structural determinants of eye lens transparency. Phil Trans R Soc B 2011. https://pmc.ncbi.nlm.nih.gov/articles/PMC3061108/
- [Lampi2014] Lampi KJ ほか. Lens β-crystallins: the role of deamidation and related modifications in aging and cataract. Prog Biophys Mol Biol 2014. https://pmc.ncbi.nlm.nih.gov/articles/PMC4374893/
- [Bishop2000] Bishop PN. Structural macromolecules and supramolecular organisation of the vitreous gel. Prog Retin Eye Res 2000;19:323. https://pubmed.ncbi.nlm.nih.gov/10749380/
- [Phillips2022] Phillips JD ほか. Structure and Mechanics of the Vitreoretinal Interface. J Mech Behav Biomed Mater 2022. https://pmc.ncbi.nlm.nih.gov/articles/PMC9552593/
- [EyeWiki-RAO] American Academy of Ophthalmology EyeWiki. Retinal Artery Occlusion. https://eyewiki.org/Retinal_Artery_Occlusion
- [McLeod2012] McLeod D, Beatty S. Partial central retinal artery occlusion offers a unique insight into the ischemic penumbra. Clin Ophthalmol 2012. https://pmc.ncbi.nlm.nih.gov/articles/PMC3259095/
- [DEsposito2025] D'Esposito F ほか. Pericytes as Key Players in Retinal Diseases: A Comprehensive Narrative Review. Biology 2025. https://pmc.ncbi.nlm.nih.gov/articles/PMC12292761/
- [Arboleda2015] Arboleda-Velasquez JF ほか. From pathobiology to the targeting of pericytes for the treatment of diabetic retinopathy. Curr Diab Rep 2015. https://pmc.ncbi.nlm.nih.gov/articles/PMC5599150/
- [Hammes2011] Hammes HP ほか. Diabetic Retinopathy: Targeting Vasoregression. Diabetes 2011;60:9. https://pmc.ncbi.nlm.nih.gov/articles/PMC3012202/
- [Roy2020] Roy S, Kim D. Retinal capillary basement membrane thickening: Role in the pathogenesis of diabetic retinopathy. Prog Retin Eye Res 2020. https://pmc.ncbi.nlm.nih.gov/articles/PMC8590904/
- [Fischer2022] Fischer TM. The Shape of Human Red Blood Cells Suspended in Autologous Plasma and Serum. Cells 2022. https://pmc.ncbi.nlm.nih.gov/articles/PMC9222013/
- Wikipedia（補助）：[Wiki-Cornea] https://en.wikipedia.org/wiki/Cornea ／ [Wiki-CornealEndo] https://en.wikipedia.org/wiki/Corneal_endothelium ／
  [Wiki-Lens] https://en.wikipedia.org/wiki/Lens_(vertebrate_anatomy) ／ [Wiki-Vitreous] https://en.wikipedia.org/wiki/Vitreous_body ／
  [Wiki-Retina] https://en.wikipedia.org/wiki/Retina ／ [Wiki-Bruch] https://en.wikipedia.org/wiki/Bruch%27s_membrane ／
  [Wiki-Choroid] https://en.wikipedia.org/wiki/Choroid ／ [Wiki-Cataract] https://en.wikipedia.org/wiki/Cataract ／
  [Wiki-CWS] https://en.wikipedia.org/wiki/Cotton_wool_spots ／ [Wiki-Fundus] https://en.wikipedia.org/wiki/Fundus_(eye) ／
  [Wiki-RBC] https://en.wikipedia.org/wiki/Red_blood_cell ／ [Wiki-Platelet] https://en.wikipedia.org/wiki/Platelet
- 【抜粋】だけで確かめた記述の出所（本文は未読。採用前に再確認が望ましい）：
  - 角膜の厚みと層：https://pmc.ncbi.nlm.nih.gov/articles/PMC4655862 ／ https://pathologyoutlines.com/topic/eyecorneaanatomy.html
  - 網膜各層の厚み（OCT）：https://synapse.koreamed.org/articles/1010506
  - 脈絡膜の厚み（生体）と脈絡毛細血管板の径（OCTA）：https://pmc.ncbi.nlm.nih.gov/articles/PMC4501794 ／ https://pmc.ncbi.nlm.nih.gov/articles/PMC5710392
  - 眼底の色の成り立ち、網膜が透明であること：https://discovery-pp.ucl.ac.uk/1557239/1/MC_OPO2017.pdf ／
    https://www.ucl.ac.uk/brain-sciences/ioo/research/research-labs-and-groups/carr-lab/retina-and-retinal-pigment-epithelium-rpe ／
    https://fr.slideshare.net/Eyenirvaan/basic-opthalmoscopy-findings-isha-dave
  - クリスタリンの凝集とαクリスタリン：https://pmc.ncbi.nlm.nih.gov/articles/PMC8052307 ／ https://link.springer.com/content/pdf/10.1134/S000629792203004X.pdf
  - 色素上皮の貪食の障害（MERTK）：https://pmc.ncbi.nlm.nih.gov/articles/PMC7066375/ ／ https://pmc.ncbi.nlm.nih.gov/articles/PMC6302181
- 画像：Wikimedia Commons https://commons.wikimedia.org/wiki/File:Fundus_photograph_of_normal_left_eye.jpg ／
  https://commons.wikimedia.org/wiki/File:Cherry_red_spot_in_patient_with_central_retinal_artery_occlusion_(CRAO).jpg ／
  https://commons.wikimedia.org/wiki/File:Fundus_Proliferative_retinopathy_EDA01.JPG ／
  https://commons.wikimedia.org/wiki/File:Cataract_in_human_eye.png

## 形の仕様書の一覧（`atlas/`）

`rbc.md` 赤血球 ／ `endothelial_cell.md` 網膜毛細血管の内皮細胞 ／ `pericyte.md` 周皮細胞 ／ `retinal_capillary.md` 網膜毛細血管 ／
`rod.md` 桿体 ／ `cone.md` 錐体 ／ `rpe.md` 網膜色素上皮 ／ `lens_fiber.md` 水晶体線維細胞 ／ `vitreous.md` 硝子体 ／
`platelet.md` 血小板 ／ `mitochondrion.md` ミトコンドリア ／ `muller_cell.md` ミュラー細胞
