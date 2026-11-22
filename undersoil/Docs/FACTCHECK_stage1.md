# 事実確認の報告：ステージ1（生き物5種と土の要素5点）

- 確認日：2026-11-22
- 確認者：制作に関わっていない独立のサブエージェント（この報告書以外のファイルは変更していない）
- 対象：`Docs/SPECIES.md`、`src/data/species/*.json`（10枚のカード）、`Docs/REFERENCE/species/*.md`（5点、主要な数値の抜き取り）
- 方法：資料のページを自分で取得して本文を読み、該当箇所を照合した。開けなかった資料は「開けなかった」と書いた。Wikipedia など二次資料だけで裏づけたものは「弱い確認」とした。

## 1. 判定の集計

| 判定 | 件数 | 意味 |
|---|---|---|
| 確認 | 135（カード 43／台帳 58／仕様書 34） | 一次資料・公的資料の本文で裏づけた（計算で確かめたものを含む） |
| 弱い確認 | 25（カード 11／台帳 12／仕様書 2） | 二次資料（Wikipedia など）、検索結果の要約、または同じ仲間の一般的な性質でのみ裏づけた |
| 未確認 | 18（カード 2／台帳 7／仕様書 9） | 今回、裏づける資料を開けなかった／資料に書かれていなかった |
| 誤り | 1（カード 1／台帳 0／仕様書 0） | 資料や計算と合わない |

全体の評価：**明らかな作り話や、生き物の取り違えは見つからなかった。** カードの文で直すべき点は3つ（クマムシの「竹林」と「7倍」、コルポダの「水が戻ると」）。枯草菌の「数分で」は資料どおりだが、誤解を避ける言い換えを勧める。

### 資料を開けたか

| 資料 | 結果 |
|---|---|
| Plazi（クマムシ記載文、コルポダ） | 開けた（`/GgServer/xhtml/` の経路。表の中身は含まれない） |
| PMC：Setlow 2014、Pandey 2013、Guttenplan 2013、Plomp 2005、Funadani 2013、Sogame 2013、Nirody 2021、Halberg 2013、Tecon & Or 2017 | 開けた（本文） |
| PMC：Hara 2021、Mukherjee & Kearns 2014、Sugiura 2024 | PMC は機械判定の画面になり開けず。Europe PMC／PMC の OAI 経由で本文を取得 |
| PMC：Dechesne 2010 | 要旨は Europe PMC で確認。本文の数値は取得ツールの要約で確認（本文を直接は読めていない） |
| BOSO-Micro（arXiv 2105.11503） | PDF を開けた（表を確認） |
| USDA Handbook 314、USDA Plant Guide、UC IPM、国立環境研究所（2ページ）、LPSN、長野県 PDF | 開けた |
| Zootaxa 5134 の表（体長の平均、爪の寸法）、Sugiura 2019（生活史） | **開けなかった** |
| BacMap、東京家政大学 PDF（画像のみ）、農研機構 PDF（画像のみ）、慶應義塾プレスリリース PDF | **開けなかった／読めなかった** |
| Ping 2013、Tisdall & Oades 1982、Totsche 2018、Le Bissonnais 1996、Nelson 2004、Satognon & Akuku 2026 | 要旨のみ（Europe PMC／Crossref） |
| Griffiths 1986、Darbyshire 1994、Carrera 2007 | 題名のみ（Crossref） |

## 2. 誤り・未確認の一覧と、直す文の案

### 2-1. ゲーム内カード（`src/data/species/*.json`）— 直す必要があるもの

| # | ファイル・項目 | 今の文 | 判定 | 理由 | 直す文の案 |
|---|---|---|---|---|---|
| A | `paramacrobiotus-metropolitanus.json` intro | 「東京の竹林の落ち葉から見つかったクマムシです。」 | 未確認 | 記載文の採集地は「Tokyo, Nishi-Tokyo city, Tozenji temple; urban cemetery; bamboo leaf litter」。竹の落ち葉であることは確かだが、「竹林」とは書かれていない（寺の墓地）。 | 「東京の寺で、竹の落ち葉の中から見つかったクマムシです。」 |
| B | `paramacrobiotus-metropolitanus.json` sizeCompare | 「髪の毛の太さの 7 倍」 | 誤り（軽い） | 同じカードの「約 0.5 mm」を基準の 0.08 mm で割ると 6.25 倍。7 倍になるのは平均 0.54 mm を使った場合（6.75 倍）だが、その平均値は今回、表を開けず確認できなかった（体長の範囲 393〜711 µm は確認）。 | 「髪の毛の太さの 6〜7 倍」 |
| C | `colpoda.json` intro | 「水が戻ると殻を破って泳ぎ出し、細菌を食べます。」 | 未確認 | Funadani ら 2013 では、脱出は「植物の抽出液（小麦の葉の煮出し液）や銅クロロフィリン」で引き起こされる。水だけで起きるとは書かれていない。台帳（SPECIES.md）自身も「水だけで起きるとは確かめられていない」としており、カードと食い違う。 | 「乾いた土では丸い殻に閉じこもって眠り、水が落ち葉などの成分を運んでくると、殻を破って泳ぎ出し、細菌を食べます。」 |

### 2-2. ゲーム内カード — 資料とは合うが、言い換えを勧めるもの

| # | ファイル・項目 | 今の文 | 判定 | 理由 | 文の案 |
|---|---|---|---|---|---|
| D | `bacillus-subtilis.json` intro | 「水が養分を運んでくると、数分で目を覚まします。」 | 確認（注意つき） | Setlow 2014 の要旨に「return to life within minutes」とあり、文としては合う。ただし同じ論文に「待ち時間は芽胞ごとに数分から24時間以上」とあり、Pandey ら 2013 の実測は「始まるまで平均63±56分、変化そのものは3.5±0.9分」。全部の芽胞が数分で目覚めるように読めるのは強すぎる。 | 「水が養分を運んでくると、早いものは数分で目を覚まします。」 |
| E | `bacillus-subtilis.json`／`pseudomonas-fluorescens.json` sizeCompare | 「髪の毛の太さの 25 分の 1」 | 確認（計算） | 80 µm ÷ 3 µm ＝ 26.7。およその値として正しいが、「約」がない。 | 「髪の毛の太さの 約 25 分の 1」 |
| F | `colpoda.json` sizeCompare | 「髪の毛の太さほど」 | 確認（計算） | 60 µm ÷ 80 µm ＝ 0.75。「ほど」で許される範囲。より正確にするなら右の案。 | 「髪の毛の太さより少し小さい」 |
| G | `clay.json` intro | 「薄い板の形の鉱物です。」 | 弱い確認 | 層状の粘土鉱物（カオリナイトなど）には当てはまる。ただし台帳が自分で書いているとおり、舞台の関東ロームの粘土は板の形ではないアロフェンが主体とされる（この点は東京家政大学 PDF が画像のみで、今回確認できず）。 | 「岩が風化してできた、ごく細かい鉱物です。薄い板の形のものが多く、表面に養分と水を引きつけ、腐植と結びついて団粒の芯になります。」 |

### 2-3. `Docs/SPECIES.md` と `Docs/REFERENCE/species/*.md` — 誤り・未確認・注記

| # | ファイル・箇所 | 今の文 | 判定 | 理由 | 直す文の案 |
|---|---|---|---|---|---|
| H | SPECIES.md トウキョウチョウメイムシ「初登場時の説明文」 | 「東京の竹林の落ち葉から見つかりました」 | 未確認 | 上の A と同じ。 | 「東京の寺で、竹の落ち葉の中から見つかりました」 |
| I | SPECIES.md 同「実際の大きさ」／tardigrade.md 寸法表 | 「平均540µm」「標準偏差75」「ホロタイプは485µm」「髪の毛の太さの約7倍」 | 未確認 | 範囲（393〜711 µm）は記載文の本文で確認。平均・標準偏差・ホロタイプの値は表にあり、今回開けなかった。 | 表を確認できるまで「体長0.4〜0.7mm（髪の毛の太さの5〜9倍）」と書くのが安全。 |
| J | SPECIES.md コルポダ「初登場時の説明文」 | 「水が戻ると殻を破って泳ぎ出し」 | 未確認 | 上の C と同じ。 | C の案と同じ。 |
| K | SPECIES.md 枯草菌「分類」 | 「バシラス目」 | 弱い確認（注記が必要） | LPSN では Bacillales は「synonym」で、正しい名は Caryophanales（カリオファノン目）とされる。旧来の名としては通用する。 | 「バシラス目（LPSN では Caryophanales の異名）」 |
| L | SPECIES.md 枯草菌／bacillus-subtilis.md | 「細胞1個に約20本の付け根」 | 確認（注記が必要） | Mukherjee & Kearns 2014 の総説は「approximately 20」。その元の実測（Guttenplan ら 2013）は「平均26±6個（42細胞）」。 | 「細胞1個に約20〜26個の付け根」 |
| M | SPECIES.md 差し替えの一覧・理由 | 「オニクマムシは…肉食性の種」 | 弱い確認 | 英語版 Wikipedia は「omnivorous predator（藻類・ワムシ・線虫を食べる）」。捕食性であることは合うが、「肉食性」と言い切る一次資料は今回確認していない。 | 「ワムシや線虫などを食べる捕食性の種」 |
| N | tardigrade.md | 「9〜11日でふ化し、さらに約11日で成熟する」 | 未確認 | Hara 2021 の補足図・Sugiura 2019 にあると思われるが、今回開けなかった。 | 確認できるまで図鑑や字幕に日数を出さない。 |
| O | tardigrade.md | 爪の高さ（約7〜16µm ほか）、口の管の太さ（7.6〜12.0µm） | 未確認 | 表の値で、今回開けなかった（口の管の長さ 40〜58.4 µm は本文で確認）。 | — |
| P | tardigrade.md／SPECIES.md | 「爪が2本ずつ（外側と内側）」 | 未確認 | 記載文の本文で確認できたのは「hufelandi 型（Y字形）」「主枝に補助のとげ2つ」「半月形の台（lunule）はなめらか」まで。脚1本あたりの爪の数は、今回読めた本文には明記がなかった（チョウメイムシ科の一般的な特徴とされる）。 | モデルは変えなくてよいが、出所を1つ足すこと。 |
| Q | colpoda.md 寸法表 | 繊毛の列「約33〜35列」の根拠に国立環境研究所を併記／「北米の個体群は平均36.8列」「平均70.4µm」 | 未確認（一部） | 33〜35列は Kim ら 2016 で確認。国立環境研究所のページの値は「29-34 ciliary grooves」で、少し違う。北米の値は表にあり、今回開けなかった。 | 「約33〜35列（Kim ら 2016）。別の文献では29〜34本の溝（国立環境研究所）」 |
| R | pseudomonas-fluorescens.md／SPECIES.md | 「Pf-5株は複数の極鞭毛」「芽胞は作らない（BacMap）」 | 未確認 | BacMap に接続できなかった。英語版 Wikipedia に「has multiple flagella」とあるのみ（弱い裏づけ）。 | — |
| S | SPECIES.md 粘土鉱物・砂粒 | 「立川ローム層でアロフェン50%超」「重い鉱物の50%以上が輝石」 | 未確認 | 東京家政大学の PDF は画像のみで本文を読めなかった（台帳も「検索結果の要約」と明記している）。 | 数値を図鑑に出さない。 |
| T | trifolium-repens.md | 「20℃で半数が発芽するまで約6.5日」「黄色い種子は秋に硬実が多く…（農研機構）」 | 未確認 | 農研機構の PDF は画像のみで読めなかった。6.5日の原文も未確認。 | 図鑑や字幕に出さない（仕様書も同じ注意を書いている）。 |
| U | SPECIES.md シロツメクサ | 「発芽直後の子葉…3〜5mm」 | 未確認 | 台帳自身が「未確認、写真からの目測」と明記。資料の値は見つからなかった。 | — |
| V | bacillus-subtilis.md | 「炭疽菌の芽胞（長さ1.26〜1.67µm）」（Carrera 2007） | 未確認 | 題名しか確認できなかった。 | — |

## 3. 全項目の表

判定の列は「確認／弱い確認／未確認／誤り」のいずれか。

### 3-1. ゲーム内カード（`src/data/species/*.json`）

| ID | カード・項目 | 文・数値 | 判定 | 出所と該当箇所 |
|---|---|---|---|---|
| J01 | trifolium-repens nameJa／sci | シロツメクサ／Trifolium repens | 確認 | 国立環境研究所 侵入生物DB https://www.nies.go.jp/biodiversity/invasive/DB/detail/80160.html 「和名 シロツメクサ…学名 Trifolium repens」 |
| J02 | 同 taxon | マメ科 シャジクソウ属 | 弱い確認 | マメ科は同DBで確認。「シャジクソウ属」は日本語版 Wikipedia「シロツメクサ」（二次資料） |
| J03 | 同 size | 種は 1〜1.5 mm | 確認 | USDA Handbook 314「Length and width are approximately equal, averaging about 1½ mm」（OCR では「li/^ mm」と崩れている）。下限の 1 mm は仕様書の写真目測による |
| J04 | 同 sizeCompare | ゴマ粒より小さい | 弱い確認 | 英語版 Wikipedia "Sesame"「Typically, the seeds are 3 to 4 mm」（二次資料） |
| J05 | 同 intro | ハート形の小さな種 | 確認 | USDA 314「broadly heart-shaped, triangular, or oval seed」 |
| J06 | 同 intro | 水を吸うとふくらんで根を出し、ふたばを地上へ持ち上げます | 確認 | USDA 314「The seedling is epigeal. Swelling of the cotyledons and growth of the radicle break the seedcoat…cotyledons and terminal bud are raised above the ground」 |
| J07 | 同 intro | 江戸時代にヨーロッパから来て | 確認 | 国立環境研究所「自然分布 ヨーロッパ」「1846年にオランダから渡来」。1846年（弘化3年）は江戸時代 |
| J08 | 同 intro | 日本中に広がった草です | 確認 | 同「国内移入分布 ほぼ全国」 |
| J09 | bacillus-subtilis nameJa／sci／taxon | 枯草菌／Bacillus subtilis／細菌 バシラス属 | 確認 | LPSN https://lpsn.dsmz.de/species/bacillus-subtilis 「Bacillus subtilis (Ehrenberg 1835) Cohn 1872」 |
| J10 | 同 size | 長さ 約 3 µm | 確認 | BOSO-Micro（arXiv 2105.11503）の表「Bacillus subtilis (2−4) × (0.7−0.8)」。Mukherjee & Kearns 2014 は「4 μm cell」。※英語版 Wikipedia は「4–10 µm」と書いており、資料によって幅がある |
| J11 | 同 sizeCompare | 髪の毛の太さの 25 分の 1 | 確認 | 計算：80÷3＝26.7。髪の太さは英語版 Wikipedia "Hair" で 17〜180 µm（二次資料）。80 µm はその範囲内。「約」を足すことを勧める（2-2 の E） |
| J12 | 同 intro | 棒の形の細菌です | 確認 | BOSO-Micro の寸法、Pandey 2013 の位相差像の記述 |
| J13 | 同 intro | 芽胞になって何年も眠り | 確認 | Setlow 2014 https://pmc.ncbi.nlm.nih.gov/articles/PMC3993344/ 「can remain in their dormant and resistant states for years」 |
| J14 | 同 intro | 水が養分を運んでくると（引き金は養分） | 確認 | 同「exposure to agents such as specific nutrients」「L-alanine…L-asparagine trigger germination」。「水が運ぶ」は演出上の説明で、資料の裏づけは養分が引き金である点まで |
| J15 | 同 intro | 数分で目を覚まします | 確認 | 同「return to life within minutes」。ただし「lag period…from a few minutes to >24 h」、Pandey 2013「Start of germination 63±56 min」「Germination time 3.5±0.9 min」。言い換えを勧める（2-2 の D） |
| J16 | pseudomonas-fluorescens nameJa／sci／taxon | シュードモナスの仲間／Pseudomonas fluorescens 群／細菌 シュードモナス属 | 確認 | LPSN https://lpsn.dsmz.de/species/pseudomonas-fluorescens 「Pseudomonas fluorescens Migula 1895」 |
| J17 | 同 size | 長さ 約 3 µm | 確認 | BOSO-Micro「Pseudomonas fluorescens 3.1 ± 0.8 × 0.9 ± 0.1…SBW25」 |
| J18 | 同 sizeCompare | 髪の毛の太さの 25 分の 1 | 確認 | 計算：80÷3.1＝25.8 |
| J19 | 同 intro | 体の端の鞭毛で（極鞭毛） | 弱い確認 | Ping 2013 要旨は「monotrichous…rotating a right-handed flagellum」「similarity to Caulobacter」まで。「端から生える」は属の一般的な性質で、今回開けた本文に明記はない（BacMap は接続できず） |
| J20 | 同 intro | 鞭毛（回して進む細い毛） | 確認 | Ping 2013 要旨「swims…by rotating a right-handed flagellum」 |
| J21 | 同 intro | 水の膜の中をすばやく泳ぐ | 確認 | BOSO-Micro「77.6 (max 102)」µm/s。Ping 2013 要旨「swims several times faster」（大腸菌との比較）。泳げるのはごく湿ったときだけ（Dechesne 2010 要旨） |
| J22 | 同 intro | 溶けにくいリンを溶かし、植物が使える形に変える仲間がいます | 確認 | Satognon & Akuku 2026 要旨（Crossref）「phosphate solubilization」を Pseudomonas spp. の働きとして列挙。要旨のみ |
| J23 | colpoda nameJa／sci／taxon | コルポダ／Colpoda cucullus／繊毛虫 コルポダ属 | 確認 | Plazi（Kim ら 2016）「Colpoda cucullus Müller, 1773」「Phylum Ciliophora…Genus Colpoda」 |
| J24 | 同 size | 長さ 約 0.06 mm | 確認 | 同「Size 60–70 × 40–50 μm in vivo」。国立環境研究所「40-110 um long」 |
| J25 | 同 sizeCompare | 髪の毛の太さほど | 確認 | 計算：60÷80＝0.75（2-2 の F） |
| J26 | 同 intro | そら豆の形をした繊毛虫 | 確認 | Plazi「broadly reniform」。国立環境研究所「Body distinctly reniform」 |
| J27 | 同 intro | 体じゅうの細かい毛で泳ぐ単細胞の生き物 | 確認 | Plazi「approximately 33–35 somatic kineties」「swimming in a spiral path」 |
| J28 | 同 intro | 乾いた土では丸い殻に閉じこもって眠り | 確認 | Funadani 2013「resting cysts that are resistant to drying and to high or low temperatures」。「丸い」はシストの形で、仕様書も写真未見としている |
| J29 | 同 intro | 水が戻ると殻を破って泳ぎ出し | 未確認 | 「殻を破る」は確認（同「ruptures the outermost cyst wall」）。「水が戻ると」は未確認：同「excystment is induced by the addition of plant extract…infusion of wheat leaves, or sodium copper chlorophyllin」（2-1 の C） |
| J30 | 同 intro | 細菌を食べます | 確認 | Funadani 2013／Sogame 2013「infusion of dried wheat leaves inoculated with…bacteria (Klebsiella pneumoniae)」 |
| J31 | paramacrobiotus nameJa | トウキョウチョウメイムシ | 確認 | Plazi（記載文）「refers to the Tokyo Metropolitan Area (Tokyo Cho-mei mushi in Japanese)」。カタカナ表記の使用例は未確認 |
| J32 | 同 sci | Paramacrobiotus metropolitanus | 確認 | 同上、Zootaxa 5134:92–112 の要旨（Europe PMC） |
| J33 | 同 taxon | 緩歩動物（クマムシ） チョウメイムシ科 | 弱い確認 | 学名の科は Plazi で確認（Family Macrobiotidae）。和名「チョウメイムシ科」は、群馬県立自然史博物館サイト掲載の研究報告 PDF「緩歩動物門 真クマムシ綱 ヨリヅメ目 チョウメイムシ科」で確認（専門の文献ではない）。慶應義塾の発表資料は開けなかった |
| J34 | 同 size | 体長 約 0.5 mm | 確認 | Plazi「393–711 μm in the new species」 |
| J35 | 同 sizeCompare | 髪の毛の太さの 7 倍 | 誤り | 計算：0.5÷0.08＝6.25。平均0.54mmなら6.75だが平均値は未確認（2-1 の B） |
| J36 | 同 intro | 東京の竹林の落ち葉から見つかった | 未確認 | Plazi「Tokyo, Nishi-Tokyo city, Tozenji temple; urban cemetery; bamboo leaf litter」。Hara 2021「collected from bamboo leaf litter at the Tozenji temple in Tokyo」。「竹林」の記述はない（2-1 の A） |
| J37 | 同 intro | 乾くと樽の形に縮んで乾眠に入り | 確認 | Hara 2021（Europe PMC 経由）「anhydrobiosis, with a contracted form called the ‘tun’」 |
| J38 | 同 intro | 乾眠（水をほぼ失ったまま生きのびる休眠） | 確認 | 同上。水の減り方の数値は別種（Halberg 2013「87 ± 5 % reduction in volume」） |
| J39 | 同 intro | 水が戻ると、また…歩き出します | 確認 | Hara 2021「proportion of active individuals after 1 h rehydration」「After 24 h…recovery rates were high (more than 60%)」 |
| J40 | 同 intro | 8本の脚 | 弱い確認 | 英語版 Wikipedia "Tardigrade"「four pairs of hollow unjointed legs」（門の共通の特徴。二次資料）。記載文は legs I–IV に言及 |
| J41 | aggregate intro | 土の粒と腐植が、微生物の出す「のり」や菌糸でくっついた小さなかたまり | 確認 | Tisdall & Oades 1982 要旨「transient, mainly polysaccharides…temporary, roots and fungal hyphae…persistent」 |
| J42 | 同 size／sizeCompare | 髪の毛の太さ以下〜数 mm／小さな団粒が集まって大きな団粒になる | 確認 | Totsche 2018 要旨「microaggregates…smaller than 250 µm」「composed of smaller building units」。Tisdall & Oades「macro-aggregates, defined as > 250 μm」 |
| J43 | 同 intro | すき間に水と空気をたくわえ、生き物のすみかになります | 確認 | Totsche 2018 要旨「provides a large variety of ecological niches」。Tecon & Or 2017（水と空気の分布） |
| J44 | water-film size | 平らな面で 10〜20 nm | 確認 | Tecon & Or 2017 https://pmc.ncbi.nlm.nih.gov/articles/PMC5812502/ 「–5 to –30 kPa…thickness of aqueous films on most smooth mineral surfaces is in the range of 10 to 20 nm」 |
| J45 | 同 sizeCompare | 細菌の太さの 50 分の 1 | 確認 | 計算：0.8 µm÷50＝16 nm |
| J46 | 同 intro | 粒の表面をおおう薄い水の層 | 確認 | 同上「adsorbed as thin liquid films on rough soil surfaces」 |
| J47 | 同 intro | すき間やくぼみにたまった水がつながったときだけ、細菌は泳いで移動できます | 確認 | 同「free swimming…limited to relatively narrow and infrequent range of wet condition near saturation」。Dechesne 2010 要旨「nearly ceased in liquid films…smaller than 1.5 microm」 |
| J48 | sand size | 0.02〜2 mm | 弱い確認 | 日本語版 Wikipedia「砂」「粗砂（2 mm - 0.2 mm）と細砂（0.2 mm - 0.02 mm）」、英語版 "Soil texture"（Atterberg の 20 µm、ISSS が採用）。公的資料は見つけられなかった |
| J49 | 同 intro | 岩が砕けてできた鉱物の粒…石英などからなり、土の骨組みになります | 弱い確認 | 日本語版 Wikipedia「土壌」「岩の破片と一次石英粒子によって構成」（二次資料） |
| J50 | 同 sizeCompare | 細菌から見れば、ビルのような岩 | 確認 | 計算：2 mm÷3 µm＝約670倍（身長1.7mの人にとっての約1100m）。0.02 mm なら約7倍。たとえとして大きい粒については成り立つ |
| J51 | clay size／sizeCompare | 0.002 mm より小さい／細菌と同じか、それより小さい | 弱い確認 | 日本語版 Wikipedia「土壌」「粘土は直径が 0.002 mm 以下」（二次資料）。細菌は長さ2〜4 µm（BOSO-Micro） |
| J52 | 同 intro | 岩が風化してできた、薄い板の形の鉱物 | 弱い確認 | 英語版 Wikipedia "Clay mineral"「sheet silicate (phyllosilicate) minerals」。アロフェンなど板でないものもある（2-2 の G） |
| J53 | 同 intro | 表面に養分と水を引きつけ | 弱い確認 | 同「to retain nutrient cations such as potassium and ammonium」 |
| J54 | 同 intro | 腐植と結びついて団粒の芯になります | 確認 | Totsche 2018 要旨「most important as microaggregate forming materials are the clay minerals and Fe- and Al-(hydr)oxides」。「芯」はたとえ |
| J55 | humus intro | 落ち葉や根が微生物に分解されてできた、黒っぽい有機物 | 弱い確認 | 英語版 Wikipedia "Humus"「characteristic black or dark brown color」（二次資料） |
| J56 | 同 intro | 土の粒をおおって団粒をつなぎ、水と養分をたくわえます | 確認 | Tisdall & Oades 1982 要旨（有機物が団粒を結びつける）。長野県 PDF「有機物の蓄積を促進し、土壌中の空隙…の確保」 |
| J57 | 同 intro | 黒い土は、腐植が多い土です | 確認 | 長野県環境保全研究所 PDF https://www.pref.nagano.lg.jp/kanken/johotekyo/midorinokoe/documents/p2.pdf 「黒色土は多量の有機物を含む真っ黒な腐植層を持つ」 |

### 3-2. `Docs/SPECIES.md`

| ID | 節 | 記述 | 判定 | 出所と該当箇所 |
|---|---|---|---|---|
| S01 | シロツメクサ | 別名 クローバー、オランダゲンゲ | 確認 | 国立環境研究所「シロツメクサ, クローバー, オランダゲンゲ, オランダウマゴヤシ」 |
| S02 | 同 | 学名 Trifolium repens L. | 弱い確認 | 学名は国立環境研究所。命名者 L. は英語版 Wikipedia（二次資料） |
| S03 | 同 | マメ目 マメ科、多年草 | 確認 | 国立環境研究所「マメ科 (Fabaceae, Fabales…)」「多年草」 |
| S04 | 同 | 1ポンド約70万〜78万粒＝1粒約0.6mg | 確認 | USDA 314「approximately 700,000 per pound」、Plant Guide「approximately 776,000 seeds per pound」。計算：453.6g÷70万＝0.65mg、÷77.6万＝0.58mg |
| S05 | 同 | 成長した葉の柄は6〜20cm | 確認 | 国立環境研究所「柄は6～20cm」 |
| S06 | 同 | 種子はなめらか、黄色、ときに赤み、古くなると茶色 | 確認 | USDA 314「smooth and yellow or sometimes reddish. It changes to brown with age and weathering」 |
| S07 | 同 | 子葉は長だ円形で毛がなく、短い柄 | 確認 | UC IPM https://ipm.ucanr.edu/weeds-identification-gallery/white-clover/ 「Cotyledons…small, hairless, oval to oblong, and stalked」 |
| S08 | 同 | 最初の本葉は1枚の丸い葉、次から3小葉 | 確認 | UC IPM「first leaf is simple, round to oval」、USDA 314「first leaf…is simple, but thereafter…trifoliolate」 |
| S09 | 同 | 茎は地面をはい、節から根を出す | 確認 | 国立環境研究所「茎は地表をはって不定根を出す」 |
| S10 | 同 | 胚軸がかぎ形のまま伸び、光でまっすぐになる（地上子葉型） | 確認 | USDA 314「epigeal」「hypocotyl elongates and straightens…straightening of the arch in bright light」 |
| S11 | 同 | 種子が水を吸うと糖などがしみ出し微生物の活動を引き起こす（種子圏） | 確認 | Nelson 2004 要旨「carbon compounds released into the soil once the seed begins to hydrate. These seed exudations drive the microbial activities」。糖・アミノ酸という内訳は要旨にない |
| S12 | 同 | 1846年、オランダからの献上品の詰め物、のち牧草・緑肥・緑化用 | 確認 | 国立環境研究所「オランダからの献上の器物の間に詰め物…牧草，緑肥，緑化用として輸入」「1846年」 |
| S13 | 同 | 在来の草や畑の作物と競合、法的規制なし | 確認 | 同「在来種，畑作物との競合」「法的扱い 特になし」 |
| S14 | 同 | 子葉3〜5mm（目測） | 未確認 | 台帳も未確認と明記 |
| S15 | 枯草菌 | (Ehrenberg 1835) Cohn 1872 | 確認 | LPSN |
| S16 | 同 | バシロータ門…バシラス目 バシラス科 | 弱い確認 | 科は LPSN で確認。目は LPSN で「Bacillales…Taxonomic status: synonym, Correct name: Caryophanales」（2-3 の K） |
| S17 | 同 | 細胞 長さ2〜4µm、太さ0.7〜0.8µm | 確認 | BOSO-Micro |
| S18 | 同 | 芽胞 長さ約1〜1.9µm、太さ約0.5〜0.7µm | 確認 | Plomp 2005 表1「B. subtilis sg dried…713 [nm]…1.85 [µm]」。下限側（約1µm、0.5µm）は Carrera 2007 によるとされ、未確認 |
| S19 | 同 | 位相差で芽胞は光り、発芽すると数分で暗くなる | 確認 | Pandey 2013「transition…from phase-bright to phase-dark」「Germination time 3.5±0.9 min」 |
| S20 | 同 | 側面全体の鞭毛、付け根は約20 | 確認 | Mukherjee & Kearns 2014「approximately 20 flagellar basal bodies along the length of the 4 μm cell」。Guttenplan 2013 は「26 +/− 6」（2-3 の L） |
| S21 | 同 | 鞭毛の長さ約7.5µm | 確認 | BOSO-Micro「L = 7.5」 |
| S22 | 同 | 速さ毎秒20〜32µm（体の約7〜10倍） | 確認 | BOSO-Micro「(20 − 32)」。計算：÷3 µm |
| S23 | 同 | 束で泳ぎ、ほどけて向きを変える | 確認 | Mukherjee & Kearns 2014「tumbling to acquire a new trajectory. Running and tumbling…」 |
| S24 | 同 | 土1gに約100万個の芽胞 | 弱い確認 | 英語版 Wikipedia "Bacillus subtilis"「about 10^6 spores per gram」（二次資料） |
| S25 | 同 | 芽胞は水だけでは目覚めず、L-アラニンなどが引き金 | 確認 | Setlow 2014 |
| S26 | シュードモナス | Migula 1895 | 確認 | LPSN。英語版 Wikipedia は「(Flügge 1886) Migula 1895」と表記 |
| S27 | 同 | シュードモナドータ門…シュードモナス科、グラム陰性 | 弱い確認 | Satognon & Akuku 要旨「Gram-negative」。上位分類は今回 LPSN の該当ページを開いていない |
| S28 | 同 | 3.1±0.8µm × 約0.9µm、鞭毛1.5±1.1本、長さ8.4µm | 確認 | BOSO-Micro「N = 1.5 ± 1.1, L = 8.4 ± 1.3」 |
| S29 | 同 | 毎秒約78µm（最大102）、体の約25倍、枯草菌の2〜4倍 | 確認 | BOSO-Micro。計算：77.6÷3.1＝25、77.6÷(20〜32)＝2.4〜3.9 |
| S30 | 同 | 前進・後退・方向転換・とどまる、面の近くで円を描き遅くなる | 確認 | Ping 2013 要旨「run…backup…turn…reorient…flip…hover」「swam in circles near flat surfaces with reduced velocity」 |
| S31 | 同 | Pf-5株は数本の束 | 未確認 | BacMap に接続できず（2-3 の R） |
| S32 | 同 | シデロフォアや抗菌物質で病原菌を抑える株 | 確認 | Satognon & Akuku 要旨「siderophore-mediated iron acquisition…secretion of antimicrobial metabolites」 |
| S33 | 同 | 蛍光は色素ピオベルジン（紫外線で光る） | 弱い確認 | 英語版 Wikipedia「secretion of a soluble fluorescent pigment called pyoverdin, which is a type of siderophore」と、紫外線下の培地の写真（二次資料） |
| S34 | 同 | P. putida は −2kPa で鞭毛の効果がほぼなくなる | 確認 | Dechesne 2010 要旨「decreased sharply within a small range of water potential (0 to -2 kPa)」 |
| S35 | 同 | Colpoda steinii と Pseudomonas の培養実験の論文 | 確認 | Crossref：Griffiths 1986「…mixed cultures of the ciliate protozoan Colpoda steinii, the nematode Rhabditis sp. and the bacterium Pseudomonas fluorescens」（題名） |
| S36 | コルポダ | O.F. Müller, 1773 | 確認 | Plazi、国立環境研究所「O.F. Muller, 1773…or 1786」（年に異説あり） |
| S37 | 同 | 繊毛虫門 コルポダ綱 コルポダ目 コルポダ科 | 確認 | Plazi「Class Colpodea Order Colpodida Family Colpodidae」 |
| S38 | 同 | 長さ40〜110µm、60〜70×40〜50µm | 確認 | 国立環境研究所、Plazi |
| S39 | 同 | 体は平たく硬い、無色 | 確認 | Plazi「colorless, rigid」、国立環境研究所「dorso-ventrally flatten[ed]」 |
| S40 | 同 | 繊毛の列 約33〜35、刻み目8〜10 | 確認 | Plazi「33–35 somatic kineties」「Keel with 9–10 notches」、国立環境研究所「Anterior keel with 8-10 indentations; 29-34 ciliary grooves」 |
| S41 | 同 | 収縮胞は後ろ寄りに1つ、大核1つ | 確認 | Plazi「Contractile vacuole slightly ahead of posterior end」「One macronucleus」 |
| S42 | 同 | らせんを描いて泳ぐ | 確認 | Plazi「swimming in a spiral path」 |
| S43 | 同 | C. steinii で窒素とリンの排出 | 確認 | Crossref：Darbyshire 1994 の題名 |
| S44 | 同 | シストは乾燥・高温・凍結に耐える | 確認 | Funadani 2013「resistant to drying and to high or low temperatures」（「凍結」は「low temperatures」の言い換え） |
| S45 | 同 | 脱出は植物の抽出液で起こる | 確認 | 同上 |
| S46 | 同 | 約30分で収縮胞が動き、さらに約90分で泳ぎ出す | 確認 | 同「began at 30 min in the earliest case」、図の時刻「0…88.9…95.5 min after the contractile vacuole began to pulsate」 |
| S47 | 同 | 高知県の土の株（Nag-1） | 確認 | Sogame 2013「Colpoda cucullus (Nag-1 strain) collected from the soil surface in Kochi Prefecture」 |
| S48 | 同 | 世界各地に分布 | 確認 | Plazi「Distribution. North America, Europe, Japan, India, New Zealand, Australia, Antarctic, Korea」 |
| S49 | トウキョウチョウメイムシ | Sugiura, Matsumoto & Kunieda, 2022 | 確認 | Zootaxa 要旨、Plazi |
| S50 | 同 | 真クマムシ綱 近爪目 チョウメイムシ科 | 弱い確認 | 学名は Plazi。和名は日本語版 Wikipedia「近爪目（ヨリヅメ目）」、J33 の資料 |
| S51 | 同 | 393〜711µm | 確認 | Plazi |
| S52 | 同 | 平均540µm、約7倍 | 未確認 | 表を開けず（2-3 の I） |
| S53 | 同 | 卵 58〜90µm（突起込み82〜112µm） | 確認 | Plazi「58.1–90.1 μm」「81.7–112.1 μm」 |
| S54 | 同 | 表面はなめらか、模様・穴・粒なし | 確認 | Plazi「Smooth body cuticle without pores, sculpturing or granulation」 |
| S55 | 同 | 成体は白っぽい、子どもは透明、眼はない | 確認 | Plazi「whitish under dark-field illumination, the juvenile transparent…Eyes absent in live animals」 |
| S56 | 同 | Y字形の爪 | 確認 | Plazi「Claws of the hufelandi type (Y-shaped)」 |
| S57 | 同 | 爪が2本ずつ | 未確認 | 2-3 の P |
| S58 | 同 | 口は前端の少し下、口針と咽頭 | 確認 | Plazi「Mouth anteroventral…ten peribuccal lamellae」 |
| S59 | 同 | 歩く速さは別種で毎秒約160µm、体の約半分 | 確認 | Nirody 2021「163.0 ± 49.9 μm/s…0.48 ± 0.11 body lengths per」 |
| S60 | 同 | 樽に縮んで乾眠、水で復活 | 確認 | Hara 2021 |
| S61 | 同 | ゆっくり乾いた個体は1時間以内に動き出すものが多い、24時間後に6割以上 | 確認 | Hara 2021「proportion of active individuals after 1 h rehydration positively correlated with the duration」「more than 60%」。「多い」の具体的な割合は図にあり未読 |
| S62 | 同 | 発見場所は都市の寺の墓地の竹の落ち葉（西東京市） | 確認 | Plazi の Type locality |
| S63 | 同 | 説明文「東京の竹林の落ち葉」 | 未確認 | 2-3 の H |
| S64 | 同 | オニクマムシは主にコケにすむ肉食性 | 弱い確認 | 2-3 の M |
| S65 | 団粒 | 0.25mmを境にミクロ／マクロ | 確認 | Tisdall & Oades 要旨「> 250 μm」、Totsche 要旨 |
| S66 | 同 | 入れ子の各段（<2µm→2〜20→20〜250→>250） | 弱い確認 | 英語版 Wikipedia "Soil aggregate stability"「mesoaggregates (20-250 μm)…microaggregates (2-20 μm)」（呼び名は台帳と少し違う） |
| S67 | 同 | スレーキング、ミクロ団粒は何十年も残る | 確認 | Le Bissonnais 1996 要旨「slaking」、Totsche 要旨「survive slaking in water…persist in soils for several decades」 |
| S68 | 同 | マクロ団粒は根と菌糸、ミクロ団粒は分解されにくい有機物や金属イオン | 確認 | Tisdall & Oades 要旨 |
| S69 | 水の膜 | 10〜20nm、でこぼこの面では10倍以上 | 確認 | Tecon & Or「at least an order of magnitude thicker」 |
| S70 | 同 | −30kPa で半径最大約0.8µm | 確認 | 同「for α = 30° and matric potential of –30 kPa…R = 0.81 micron」（すき間の角度30度の場合） |
| S71 | 砂粒 | 粗砂2〜0.2mm、細砂0.2〜0.02mm | 弱い確認 | J48 と同じ |
| S72 | 同 | 石英は無色〜白、透明、貝殻状の割れ口 | 弱い確認 | 英語版 Wikipedia "Quartz"「Colorless…Conchoidal…Transparent to nearly opaque」 |
| S73 | 同 | 関東ロームは輝石50%以上 | 未確認 | 2-3 の S |
| S74 | 粘土鉱物 | 2µm未満（分野により4µm未満）、層状ケイ酸塩 | 弱い確認 | 英語版 Wikipedia "Clay mineral"「less than 4 micrometers」「sheet silicate」 |
| S75 | 同 | アロフェンが主体（立川ロームで50%超） | 未確認 | 2-3 の S。アロフェンが火山灰に多いことは長野県 PDF で確認 |
| S76 | 腐植 | 黒い色は春先の土を温めやすくする | 弱い確認 | 英語版 Wikipedia "Humus"「helps to warm cold soils in spring」 |
| S77 | 同 | 黒ボク土の腐植はススキなどイネ科の草に由来 | 確認 | 長野県 PDF「腐植はススキ等のイネ科草本に由来する」 |

### 3-3. `Docs/REFERENCE/species/*.md`（3Dモデルを決める数値の抜き取り）

| ID | ファイル | 数値・記述 | 判定 | 出所と該当箇所 |
|---|---|---|---|---|
| R01 | bacillus-subtilis.md | 細胞 2〜4µm × 0.7〜0.8µm | 確認 | BOSO-Micro |
| R02 | 同 | 芽胞 約1.85µm × 約0.71µm（乾燥、202個） | 確認 | Plomp 2005 表1「202 713 … 1.85」 |
| R03 | 同 | 鞭毛は側面全体、付け根約20、格子に近い並び | 確認 | Mukherjee & Kearns 2014「grid-like organization」、Guttenplan 2013「basal bodies occupy a grid…discouraged at the poles」「26 +/− 6」 |
| R04 | 同 | 鞭毛 長さ7.5µm、本数約12、1巻き約2.2µm | 確認 | BOSO-Micro「N ≈ 12, L = 7.5, λ=2.186」 |
| R05 | 同 | 待ち時間63±56分、変化3〜4分、最初の分裂まで254±34分、分裂62分 | 確認 | Pandey 2013 表「63±56…3.5±0.9…254±34…62±14」 |
| R06 | 同 | 中身の体積が1.5〜2倍 | 確認 | Setlow 2014「spore core increases 1.5- to 2-fold」 |
| R07 | 同 | 炭疽菌の芽胞1.26〜1.67µm（Carrera） | 未確認 | 題名のみ |
| R08 | pseudomonas-fluorescens.md | 3.1±0.8 × 0.9±0.1µm、鞭毛1.5±1.1本、8.4±1.3µm、2.5巻き、1.76µm、0.39µm | 確認 | BOSO-Micro「nw = 2.5, λ = 1.76, h = 0.39」 |
| R09 | 同 | 右巻き、1本（monotrichous） | 確認 | Ping 2013 要旨 |
| R10 | 同 | 鞭毛は片方の端だけ | 弱い確認 | J19 と同じ |
| R11 | 同 | Pf-5株は複数の極鞭毛、芽胞なし | 未確認 | BacMap に接続できず |
| R12 | 同 | 毎秒77.6µm（最大102）、回転2.4 | 確認 | BOSO-Micro「77.6 (max 102)…Ω = 2.4」（単位は仕様書どおり未確認） |
| R13 | 同 | −0.5kPa で毎時521µm、−2.0kPa で14µm | 確認 | Dechesne 2010 本文（取得ツールの要約で確認）「521 μm/h…(−0.5 kPa)」「14 μm/h at −2.0 kPa」 |
| R14 | colpoda.md | 60〜70×40〜50µm、染色標本60〜78×43〜53µm | 確認 | Plazi。仕様書の「平均63.8（60〜68）」は表の値で未読 |
| R15 | 同 | 繊毛の列33〜35、刻み目9〜10（8〜10） | 確認 | Plazi、国立環境研究所（2-3 の Q） |
| R16 | 同 | 北米の個体群 平均70.4µm、36.8列 | 未確認 | 表を開けず |
| R17 | 同 | 大核11.6×10.8µm、小核2.5×2.0µm、放出体1×0.5µm | 確認 | Plazi |
| R18 | 同 | 繊毛は多くが2本ずつ対 | 確認 | 国立環境研究所「cilia mostly paired」 |
| R19 | 同 | コルポダ sp. の繊毛10.7µm（推定） | 確認 | BOSO-Micro「Colpoda sp.…ℓ = 10.7?」 |
| R20 | 同 | 脱出の順番と時間（30分→約30分→約50分→5〜7分、合計約95分） | 確認 | Funadani 2013「stopped approximately 30 min after it began to pulsate」、時刻 44→88.9→95.5分 |
| R21 | 同 | 殻はふたが開くのでなく破れる | 確認 | 同「ruptures the outermost cyst wall (ectocyst) due to inner pressure」 |
| R22 | tardigrade.md | 体長393〜711µm | 確認 | Plazi |
| R23 | 同 | 平均540、標準偏差75、ホロタイプ485 | 未確認 | 表を開けず |
| R24 | 同 | 口の管 40.0〜58.4µm | 確認 | Plazi「40–58.4 μm in the new species」 |
| R25 | 同 | 爪の高さ、口の管の太さ | 未確認 | 表を開けず |
| R26 | 同 | 眼はない | 確認 | Plazi「Eyes absent in live animals」 |
| R27 | 同 | 脚4対、体節（頭1＋胴4） | 弱い確認 | 英語版 Wikipedia "Tardigrade" |
| R28 | 同 | 爪：hufelandi 型、Y字、補助のとげ2つ、なめらかな半月形の台 | 確認 | Plazi「two distinct accessory points…Lunules smooth」 |
| R29 | 同 | 爪は脚1本に2本 | 未確認 | 2-3 の P |
| R30 | 同 | 脚I〜IIIの内側のこぶ、脚IVの内側の粒 | 確認 | Plazi、Zootaxa 要旨「cuticular bulge on the inner side of legs I–III, and granulation on the inner side of legs IV」 |
| R31 | 同 | 口のまわりに10枚のひだ、硬い部品3つ＋小1つ | 確認 | Plazi「ten peribuccal lamellae」「third macroplacoid…Microplacoid present」 |
| R32 | 同 | 卵：突起は円すい形、卵黄は黄色、ばらばらに産む | 確認 | Plazi「Eggs laid freely, yellow yolk…transparent conical processes」 |
| R33 | 同 | 歩く速さ163±50、0.48±0.11、やわらかい足場で91 | 確認 | Nirody 2021「160.5 ± 57.8…on the 50-kPa…vs. 91.0 ± 32.0 μm/s on the 10-kPa」 |
| R34 | 同 | 磨いたガラスではほとんど歩けない | 確認 | 同「considerable difficulty…on standard, polished glass slides」 |
| R35 | 同 | 別種で体積87±5%減 | 確認 | Halberg 2013「87 ± 5 % (n=17)」 |
| R36 | 同 | トレハロースが2日で平均24倍 | 確認 | Hara 2021「increased 24 times on average」 |
| R37 | 同 | 9〜11日でふ化、約11日で成熟 | 未確認 | 2-3 の N |
| R38 | trifolium-repens.md | 種子 約1.5mm、長さと幅がほぼ同じ、胚が種子を満たす | 確認 | USDA 314「embryos fill the entire cavity of the seed and there is no visible endosperm」 |
| R39 | 同 | へそ・幼根の張り出し（非対称な形） | 確認 | 同「tip of the thick radicle is strongly divergent」「hilum between the two lobes」 |
| R40 | 同 | 硬実、30年以上、適温10〜20℃、高温で発芽しにくい | 確認 | 同「remain viable in the soil for 30 years or longer」「50° to 68° F」「High temperatures inhibit germination」 |
| R41 | 同 | 子葉：長だ円形、毛なし、柄あり | 確認 | UC IPM「small, hairless, oval to oblong, and stalked」 |
| R42 | 同 | 子葉の寸法3〜5×2〜2.5mm、最初の本葉5〜7mm | 未確認 | 写真の目測（仕様書も明記） |
| R43 | 同 | 最初の本葉は単葉、丸〜卵形、幅が広いことも | 確認 | UC IPM「simple, round to oval, often broader than long」 |
| R44 | 同 | ほふく茎は6〜8週間後 | 確認 | USDA 314「within 6 to 8 weeks into stolons」 |
| R45 | 同 | 20℃で約6.5日、農研機構の硬実の記述 | 未確認 | 2-3 の T |

## 4. 「よくできた話」として特に疑って調べた点

- **「江戸時代に、オランダからの献上品の詰め物として来た」**：国立環境研究所のデータベースに同じ内容がある（1846年）。確認。
- **「芽胞は数分で目を覚ます」**：総説の要旨どおり。ただし、待ち時間は芽胞ごとに大きく違う（平均は約1時間、長いものは1日以上）。「早いものは」を足すことを勧める。
- **「東京の竹林」**：竹の落ち葉は確か。場所は寺の墓地で、「竹林」は資料にない。
- **「水が戻ると」目覚める（コルポダ）**：実験では植物の成分が引き金。枯草菌のカードは「水が養分を運んでくると」と正しく書いているので、そろえるのがよい。
- **クマムシの眼**：本種の記載文に「生きた個体に眼はない」と明記。確認。
- **「蛍光性」の細菌が光る**：台帳は「光らせない」と正しく書いている。カードにも光る記述はない。
- **水の膜 10〜20 nm**：総説の本文どおり（ほどよく湿った土の、なめらかな鉱物の面での値）。
