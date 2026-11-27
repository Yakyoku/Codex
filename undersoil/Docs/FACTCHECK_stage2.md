# 事実確認の報告：ステージ2（生き物4種と土の要素2点の下書き）

- 確認日：2026-11-27
- 確認者：制作に関わっていない独立のサブエージェント（この報告書以外のファイルは変更していない）
- 対象：`Docs/REFERENCE/stage2-species-draft.md`（下書きの台帳。6枚の「初登場時の説明文」を含む）、`Docs/REFERENCE/species/{acanthamoeba,acrobeloides,nitrosospira,streptomyces}.md`（形の仕様書4点。主要な数値と、資料に帰している記述）
- 方法：資料の本文または要旨を自分で取得して読み、該当箇所を照合した。pmc.ncbi.nlm.nih.gov は開けないので、本文は Europe PMC の REST（`/rest/PMCxxxx/fullTextXML`）で取得した。開けなかった資料は「開けなかった」と書いた。要旨だけ、別の論文による引用だけ、別の生き物での結果だけで裏づけたものは「弱い確認」とした。写真（`build-cache/ref/stage2/`）は見ていない。写真の目測による値は、資料の本文に数値があるときだけ照合した。
- 判定は「確認／弱い確認／未確認／誤り」のいずれか。下書きが自分で「未確認」と書いている点は、原則として表に入れていない（新しく資料が見つかったものだけ入れた）。

## 1. 判定の集計

| 判定 | 件数 | 意味 |
|---|---|---|
| 確認 | 121（カード 29／台帳 68／仕様書 24） | 一次資料・公的資料の本文または要旨で裏づけた（計算で確かめたものを含む） |
| 弱い確認 | 15（カード 6／台帳 8／仕様書 1） | 別の論文による引用、別の生き物・別の条件での結果、または一般的な性質でのみ裏づけた |
| 未確認 | 17（カード 2／台帳 8／仕様書 7） | 今回、裏づける資料を開けなかった／開けた資料に書かれていなかった |
| 誤り | 2（カード 0／台帳 0／仕様書 2） | 資料や計算と合わない |

全体の評価：**生き物の取り違えや、明らかな作り話は見つからなかった。** 下書きは、確かめられなかった点を自分で「未確認」と書いており、その自己申告はおおむね正確だった。ただし、次の点は直す必要がある。

1. カードの文で、資料より強く言っているものが5つある（ニトロソスピラの「長さ約0.001mm」と「アメーバや線虫が出したアンモニウムを」、アクロベロイデスの「水の膜を進み」、根毛の「水と」、境界細胞の「ただよいます」）。
2. 仕様書に、資料と合わない値・記述が2つある（アカントアメーバのシストの目測値、ネグレリアを「近い仲間」とした点）。
3. **よい知らせが1つ：** 下書きがいちばん気にしていた「*Acrobeloides nanus* の日本での記録」は、茨城県つくば市の畑の記録（学会の講演要旨）が見つかった。属までの表示に下げる必要は、いまのところない（2-4 を参照）。

### 資料を開けたか

| 資料 | 結果 |
|---|---|
| Siddiqui & Khan 2012、Campolo ら 2025、Campolo ら 2021、Hernández-Ramírez ら 2026、Xuan ら 2017、de Schaetzen ら 2022、Song ら 2025、Rana ら 2020、García-Sánchez ら 2021、Morise ら 2012、Frézal & Félix 2015、Rice ら 2016、Nakagawa ら 2021、Sanders ら 2019、Zakalyukina ら 2024、Chanama ら 2023、Vurukonda ら 2018、Singh Mavi & Flärdh 2026、Bush ら 2022、Omelyanchuk ら 2024、Ropitaux ら 2020 | 開けた（Europe PMC で本文。**図の中の数値と補足の表は読めていない**） |
| Tomiyama ら 2001（J-STAGE の PDF） | 開けた（本文） |
| Olanrewaju & Babalola 2019（下書きが「Appl. Microbiol. Biotechnol. の総説 (2018)」と書いている総説） | 開けた（本文。Europe PMC、PMC6394478）。下書きは「検索結果の要約のみ」としていたが、本文で確認できた |
| 製品評価技術基盤機構（NITE）の MA-4680 のページ、LPSN（*Nitrosospira*、*Streptomyces* と上位の分類） | 開けた |
| Marciano-Cabral & Cabral 2003、Bird & Ryder 1993、Bird, De Ley & Bird 1993、Barka ら 2016、Fang-Yen ら 2010（下書きの PMC2996704）、Malvar ら 2017（仕様書の PMC5554071）、Grierson ら 2014、Kreuzer ら 2006、Rosenberg ら 2009、Bonkowski 2004、Leininger ら 2006、Kowalchuk & Stephen 2001、Becher ら 2020、Flärdh & Buttner 2009、Yagita & Endo 1990、Nguyen 2003、McLachlan ら 2019（下書きの CSIRO の資料） | **要旨のみ**（Europe PMC／OpenAlex。本文は開けなかった） |
| Watson 1971、Caradus 1979 | 要旨のみ（Springer のページ。下書きは「検索結果の要約のみ」としていたが、要旨の原文を確認できた） |
| Kim ら 2016（koreascience.or.kr） | **開けなかった**（要旨だけ OpenAlex で確認）。仕様書の線虫の細かい寸法は、この論文の本文に頼っているので照合できていない |
| Ferris, Venette & Lau 1997 | **開けなかった**（題名のみ。要旨も取得できず） |
| Bergey's Manual の *Nitrosospira* 属の記載、Jones ら 2009 | **開けなかった** |
| 追加で使った資料（下書きにないもの） | 荒城 2004（日本線虫学会第12回大会講演要旨、Jpn. J. Nematol. 34(2):113。J-STAGE の PDF を画像として読んだ）、Ferris ら 1998（Plant and Soil、要旨）、Verhagen ら 1993・1994（要旨）、Sexton & Tocheva 2020（Front. Microbiol.、本文）、Wang ら 2023（Front. Microbiol.、本文）、Corsaro 2025・Hamid ら 2024（シストの壁、本文）、Fuerst & Booton 2020（学名の経緯、本文）、Santos 2025（アメーバの分類、本文）、Groves ら 2026・Stéger & Palmgren 2022（根毛の寸法の引用、本文）、GBIF（学名と分布の記録） |

## 2. 誤り・未確認の一覧と、直す文の案

### 2-1. 「初登場時の説明文」— 直す必要があるもの

| # | カード | 今の文 | 判定 | 理由 | 直す文の案 |
|---|---|---|---|---|---|
| A | ニトロソスピラ | 「長さ約0.001mm、ばねのように巻いた細菌です。」 | 弱い確認 | 資料の値は「固く巻いた細胞は長さ1.5〜2.5µm、太さ0.8〜1.0µm」（Watson 1971 の要旨。*N. briensis*）。町田市の株（Tomiyama ら 2001）の本文には、太さ0.2〜0.3µm・3〜6回巻きとあるだけで、巻いた全体の長さは書かれていない。「約0.001mm（1µm）」は資料の範囲の下の端より小さい。 | 「長さ約0.002mm、ばねのように固く巻いた細菌です。」 |
| B | ニトロソスピラ | 「アメーバや線虫が出したアンモニウムを亜硝酸に変え、」 | 弱い確認 | アンモニウムを亜硝酸に変えることは確認（Kowalchuk & Stephen 2001）。「細菌を食べる生き物が出した分を硝化菌が使う」ことは、鞭毛虫と *Nitrosomonas europaea* の実験でだけ裏づけがある（Verhagen ら 1993：鞭毛虫がいると、アンモニア酸化の力が4〜5倍）。アメーバ・線虫と *Nitrosospira* の組み合わせの資料はない。しかも、**植物の根があるとこの効果は見られなかった**（Verhagen ら 1994：根のほうがアンモニウムを取る力が強く、硝化菌の数は200分の1に減った）。根のまわりが舞台なので、言い切るのは強すぎる。 | 「土の中のアンモニウム（アメーバや線虫が出したものもふくむ）を亜硝酸に変え、窒素が硝酸（根が吸える形の一つ）になる最初の一歩を担います。」 |
| C | アクロベロイデス | 「体をくねらせて水の膜を進み、」 | 未確認（水の膜）／弱い確認（くねらせて） | 本種の動き方の資料は1つもない（下書きも「未確認」と書いている）。くねって進むことは、別種 *C. elegans* の資料（Fang-Yen ら 2010 の要旨「undulatory」）と線虫一般の性質による。「水の膜」は、仕様書が自分で「線虫が水の膜を必要とすることは、今回、資料で確かめていない」と書いており、カードと食い違う。 | 資料を1つ足してから今の文を使う。足せないあいだは「体をくねらせて土のすき間を進み、細菌を飲みこんで食べ、余った窒素を出します。」 |
| D | 根毛 | 「水とリンなどの養分を吸います。」 | 未確認（水）／確認（リンなどの養分） | 養分を集めることは確認（Grierson ら 2014 の要旨「important for acquisition of nutrients」。McLachlan ら 2019 の要旨：根毛をふくめた表面積とリンの吸収に相関）。**水を吸うことは、今回開けた資料のどこにも書かれていなかった。** | 資料を1つ足してから今の文を使う。足せないあいだは「根が土にふれる面を大きく広げ、リンなどの養分を集めます。」 |
| E | 根の粘液と境界細胞 | 「境界細胞がその中にただよいます。」 | 弱い確認 | 境界細胞が粘液に包まれていることは確認。ただし Ropitaux ら 2020 は、粘液の多糖が「細かい網を作って境界細胞を包み、互いにつなぎとめている」と書いている。「ただよう（流れ動く）」は資料の姿と少し違う。 | 「…はがれた生きた細胞『境界細胞』が、その中に散らばっています。」 |

### 2-2. 「初登場時の説明文」— 資料とは合うが、注意が要るもの

| # | カード | 今の文 | 判定 | 理由 | 文の案 |
|---|---|---|---|---|---|
| F | アカントアメーバ | 「余った窒素を根が使える形で出します。」 | 確認（注意つき） | Kreuzer ら 2006 の要旨「食べられた細菌からの養分の放出と根の形の変化の結果、イネの地上部の窒素が45%ふえた」。Siddiqui & Khan 2012 の本文「アカントアメーバと細菌がいる土は、炭素・窒素・リンの無機化が多い」。どちらも実験室の結果。窒素がふえた理由は「養分の放出」と「根の形の変化」の両方とされ、放出だけの効果ではない。 | 文は変えなくてよい。図鑑の詳しい説明に「実験室で確かめられた働き」と添える。 |
| G | アカントアメーバ | 「土の粒の上をはい、」 | 弱い確認 | 面の上をはうこと（Siddiqui & Khan 2012：固い面と、水と空気の境目で同じ動き方）と、土にいること（同）は確認。「土の粒の上をはう」姿そのものを見た資料はない。 | 変えなくてよい。 |
| H | アクロベロイデス | 「余った窒素を出します。」 | 確認（注意つき） | Ferris ら 1998 の要旨「細菌食の線虫は、成長に必要な分をこえて取りこんだ窒素を出す。おもにアンモニウムの形」。細菌食の線虫全体の性質で、本種だけを測った値ではない。 | 変えなくてよい。 |
| I | 根毛 | 「太さ約0.01mm（髪の毛の8分の1）」 | 弱い確認 | シロイヌナズナの値（「太さ約10µm、長さ1mm以上」。Grierson ら 2014 を引く Groves ら 2026 と Stéger & Palmgren 2022 の本文で確認。Grierson の本文そのものは開けなかった）。**シロツメクサの値ではない**（下書きも明記）。 | 「太さ約0.01mm（別の植物シロイヌナズナの値）」と図鑑の詳しい説明に書く。 |
| J | ストレプトマイセス | 「太さ約0.001mmの糸」 | 確認 | 下書きは「写真の目測。資料の数値は未確認」としていたが、資料が見つかった：Sexton & Tocheva 2020 の本文「*S. coelicolor* や *S. venezuelae* の細胞は太さ約1µm。*S. albus* の糸は0.5µm 未満」。種によって0.5〜1µm。 | 変えなくてよい。台帳の「△（目測）」を、この資料に置きかえる。 |

### 2-3. 仕様書（`Docs/REFERENCE/species/*.md`）— 誤り

| # | ファイル・箇所 | 今の文 | 判定 | 理由 | 直す文の案 |
|---|---|---|---|---|---|
| K | acanthamoeba.md「写真から読み取った形」「寸法」 | シストの直径「土の株（Xuan）の写真で約20〜23µm（目測）」、内の壁の「角の数は4〜7」 | 誤り | Xuan ら 2017 の本文に実測がある：「シストの直径は12.0〜18.8µm、腕の数は4〜6」。目測は本文の値より大きい。 | 「土の株（Xuan ら 2017）のシストは直径12.0〜18.8µm、内の壁の角は4〜6個（本文の実測）」。モデルの推奨値（直径16µm、六角形）はそのままでよい。 |
| L | acanthamoeba.md「足してはいけないもの」 | 「近い仲間の *Naegleria* は鞭毛を持つ姿になるが」 | 誤り（軽い） | ネグレリアは、アカントアメーバ（アメーボゾア）とは別の大きな系統（エクスカバータのヘテロロボサ）に入る（Santos 2025 の分類表）。「近い仲間」ではない。鞭毛の姿になることは合っている（Siddiqui & Khan 2012 の文献表の題名「Amoeboflagellate Genus Naegleria」）。 | 「別の系統の自由生活アメーバ *Naegleria* は鞭毛を持つ姿になるが、アカントアメーバにはその姿がない」 |

### 2-4. 下書きの台帳と仕様書 — 未確認・注記・新しく分かったこと

| # | ファイル・箇所 | 今の文 | 判定 | 理由 | 直す文の案 |
|---|---|---|---|---|---|
| M | 下書き アクロベロイデス「正直に書くこと」「未確認」 | 「日本での種の記録を確認できていない」 | 弱い確認（記録が見つかった） | **荒城雅昭（農業環境技術研究所）2004「不耕起・堆肥連用圃場の土壌線虫の多様性（第8報）—細菌食性線虫の属レベルのリスト—」日本線虫学会第12回大会講演要旨、Jpn. J. Nematol. 34(2):113** に、同研究所（茨城県つくば市）の構内の畑で「個体数が比較的多く主要、もしくは常在的な線虫」の一つとして *Acrobeloides nanus* の名がある。関東地方の記録である。ただし、学会の講演要旨（査読のある論文ではない）で、著者自身が「まだ完全なものとは言えない」と書いている。畑の記録で、草地・シロツメクサの根のまわりではない。GBIF には日本の記録が0件。 | 「日本での種の記録は、茨城県つくば市の畑の1件（学会の講演要旨）を確認した。草地・シロツメクサの根のまわりでの記録は未確認」。種名の表示は続けてよい。 |
| N | 下書き アクロベロイデス「土の中での働き」 | 「近縁の *Acrobeloides bodenheimeri* は、畑の根圏で窒素を出すおもな種の一つ」（Ferris ら 1997、「要旨で確認」） | 未確認 | Ferris ら 1997 は題名しか取得できなかった（Europe PMC、OpenAlex、Semantic Scholar のどれにも要旨がない）。 | 確認できるまで図鑑に出さない。「細菌食の線虫は、余った窒素をおもにアンモニウムの形で出す」は Ferris ら 1998 の要旨で言える。 |
| O | 下書き アクロベロイデス「動き方」／acrobeloides.md「動き」 | *C. elegans* の「毎秒0.14〜0.2mm、波は1秒に0.3〜0.7回」「波の長さは体長の約0.65倍」「泳ぐとき1秒に1.5〜2回、体長の約1.5倍」 | 未確認 | Fang-Yen ら 2010 と Malvar ら 2017 は要旨しか開けず、要旨に数値はない（下書きも「検索結果の要約」と明記）。 | ゲームの仮の値（△）の扱いのままにし、図鑑に数値を出さない。 |
| P | acrobeloides.md 寸法表 | 「側面のすじ：縦に走るすじが3本（途中で5本に分かれ、肛門の前で3本に戻る）」 | 未確認（要旨と食い違う） | Kim ら 2016 の本文は開けなかった。要旨には「five lateral incisures with middle incisure extending to the tail tip（側面のすじは5本で、まん中の1本が尾の先までのびる）」とあり、「3本」とは書かれていない。 | 本文を確かめるまで「側面に縦のすじが5本（Kim ら 2016 の要旨）」。 |
| Q | acrobeloides.md 寸法表 | 頭の幅6.6〜7.9µm、口の筒の長さ、輪のすじ1.6〜2.2µm、尾の輪8〜13本、乳頭6＋4個、卵巣1本 ほか（Kim ら 2016） | 未確認 | Kim ら 2016 の本文は開けなかった。要旨で確認できたのは「唇の突起が低くて丸い」「尾の先が丸い」だけ。 | 値は変えなくてよいが、「本文を事実確認で照合できていない」と仕様書に書く。 |
| R | 下書き アクロベロイデス「正直に書くこと」 | 「分布の一覧（韓国の記載論文）に日本は入っていない」「*A. buetschlii* との見分けは長く議論されている」「オスは知られていない」 | 未確認 | 3つとも Kim ら 2016 の本文に頼る記述で、照合できなかった。単為生殖であること（Song ら 2025 の本文「parthenogenetic」）は確認。 | — |
| S | acrobeloides.md 資料 | 別種 *A. saeedi*「メス1.06〜1.57mm」 | 弱い確認 | Rana ら 2020 の本文（ほかの種との比較）では「1.03-1.57 mm」。表の値は読めていない。 | 「メス約1.0〜1.6mm」 |
| T | 下書き アカントアメーバ「実際の大きさ」／acanthamoeba.md 寸法表 | 「ATCC 30010 の実測の平均は19.6µm」 | 未確認 | Campolo ら 2025 の本文で確認できたのは、8つの株の平均が16.0〜25.8µm（T5 が最小、T7 と T18 が最大）であることまで。19.6 は図の中の値で、読めなかった。 | 「8つの株の平均は16〜26µm」 |
| U | acanthamoeba.md 寸法表「シストの壁」 | 「外の壁（しわがある…）と内の壁（…星形・多角形・丸・だ円）」の根拠が Siddiqui & Khan 2012 | 確認（出所の直しが必要） | 内容は正しい（Corsaro 2025、Hamid ら 2024、Xuan ら 2017 の本文：第2群は、しわのある外の壁と、星形・多角形・三角・丸・だ円の内の壁）。ただし **Siddiqui & Khan 2012 の本文には「しわ」「星形」という語がない**（二重の壁、たんぱく質と多糖／セルロース、すき間、出口は確認）。 | 根拠の欄を「Xuan ら 2017、Hamid ら 2024」に直す。 |
| V | 下書き アカントアメーバ「実際の大きさ」 | 「休眠の姿（シスト）は直径13〜23µm」 | 確認（注記が必要） | Siddiqui & Khan 2012 の本文どおり。ただし同じ文は栄養体も「13〜23µm」としており（「a vegetative trophozoite stage with a diameter of 13-23 μm and dormant cyst stage of 13-23 μm」）、栄養体の値はほかの資料（25〜40、12〜50）と合わない。原文の書き誤りの疑いがある。 | シストの値は「10〜25µm（Campolo ら 2025）」を主にし、13〜23 は併記にとどめる。 |
| W | 下書き 採用の一覧 アカントアメーバ | 「イネとシロイヌナズナの根圏の実験で、細菌の顔ぶれを変え、植物の窒素を増やすことが示されている」 | 弱い確認 | 窒素が45%ふえたのはイネ（Kreuzer ら 2006）。シロイヌナズナ（Rosenberg ら 2009）の要旨は「植物の成長によい影響」とあるだけで、窒素とは書いていない。 | 「イネとシロイヌナズナの根圏の実験で、細菌の顔ぶれを変え、イネでは植物の窒素を増やすことが示されている」 |
| X | 下書き アカントアメーバ「関係」 | 「シュードモナスは、数は変わらないが顔ぶれが入れ替わった」 | 弱い確認 | Rosenberg ら 2009 の要旨で「数が変わらなかった」のは「ガンマプロテオバクテリア」と「アンモニア酸化細菌」。シュードモナスについて書かれているのは「顔ぶれと、身を守る遺伝子（gacA）の変化」。 | 「シュードモナスをふくむガンマプロテオバクテリアは、数は変わらないが、シュードモナスの顔ぶれが入れ替わった」 |
| Y | 下書き アカントアメーバ「正直に書くこと」 | 関東の土での記録 | 未確認 | 下書きの申告どおり。今回さがしても見つからなかった。Yagita & Endo 1990 の要旨は「日本の、目の感染・レンズの容器・土から」の8株とあるだけで、土の株の採集地は分からない。 | 下書きの書き方のままでよい。 |
| Z | 下書き ニトロソスピラ「分類」 | 「ニトロソモナス目 ニトロソモナス科」 | 弱い確認（注記が必要） | LPSN では、Nitrosomonadales は「異名（synonym）」で、正しい名は Spirillales（スピリルム目）とされ、ニトロソモナス科はその下に置かれている。Rice ら 2016 など論文では今も Nitrosomonadales が使われている。 | 「ニトロソモナス目（LPSN では Spirillales の異名）」 |
| AA | 下書き ニトロソスピラ「姿と色の特徴」 | 「ふつうの光学顕微鏡では小さな棒や粒にしか見えない（らせんと分かるのは電子顕微鏡）」 | 弱い確認 | Watson 1971 の要旨：「固く巻いているので、位相差顕微鏡では、らせんではなく棒か円筒に見える。ときどき巻きがほどけ、そのときは位相差顕微鏡でもらせんがはっきり見える」。「電子顕微鏡でしか分からない」は強すぎる。 | 「ふつうは小さな棒や粒にしか見えない。巻きがほどけたときだけ、光学顕微鏡（位相差）でもらせんと分かる」 |
| AB | 下書き ニトロソスピラ「実際の大きさ」／nitrosospira.md | 属の記載「太さ0.3〜0.4µm」「3〜20回巻き」「丸い形 直径0.8〜1.2µm」 | 未確認 | Bergey's Manual は開けなかった（下書きも「検索結果の要約だけ」と明記）。同じ値を書いた別の資料も見つけられなかった。 | 図鑑には町田の株の値（太さ0.2〜0.3µm、3〜6回巻き）だけを出す。 |
| AC | nitrosospira.md 寸法表「鞭毛」 | 「本数・長さ・付く位置の資料の値は未確認」 | 確認（資料が見つかった） | Watson 1971 の要旨：*N. briensis* は「1〜6本の鞭毛（長さ3〜5µm）で、不規則に動く」。 | 「*N. briensis*：鞭毛1〜6本、長さ3〜5µm（Watson 1971）」と書き足せる。 |
| AD | 下書き ニトロソスピラ「土の中での働き」 | 「亜硝酸は別の細菌（*Nitrobacter* 属など）が**すぐに**硝酸に変える」 | 弱い確認 | 亜硝酸を別の細菌が硝酸に変えること（Sanders ら 2019、Tomiyama ら 2001）は確認。「すぐに」を示す資料は開けていない。 | 「すぐに」を取る。 |
| AE | 下書き ストレプトマイセス「学名」「分類」 | 「命名者と年は…未確認」「綱・目の名前は今回確かめていない」 | 確認（資料が見つかった） | LPSN：*Streptomyces* Waksman and Henrici 1943（基準種 *S. albus*）。上位は ストレプトマイセス科 → キタサトスポラ目（Kitasatosporales。Streptomycetales はその異名）→ アクチノマイセス綱（Actinomycetes）→ アクチノマイセトータ門。 | 台帳に移すときに書き足す。 |
| AF | 下書き アカントアメーバ「学名」 | 「命名者と年は…未確認」 | 弱い確認（資料が見つかった） | Fuerst & Booton 2020 の本文：Douglas が1930年に「*Hartmannella castellanii*」として記載し、Volkonsky が1931年に新しい属 *Acanthamoeba* を立てた。「(Douglas, 1930) Volkonsky, 1931」という書き方と合う。命名者つきの学名を1行で書いた資料は開けていない。 | 今の書き方でよい。 |
| AG | 下書き ストレプトマイセス「未確認」 | 「土1gに100万〜10億個、95%以上がこの属」 | 未確認 | Barka ら 2016 は要旨しか開けず、要旨にこの数値はない。 | 図鑑に出さない（下書きもカードに入れていない）。 |
| AH | 下書き 根の粘液「土の中での働き」 | 「根が土の中を進むときの潤滑と、根の先の保護」 | 未確認（潤滑）／確認（保護） | 病原菌から根の先を守ること（Ropitaux ら 2020、Omelyanchuk ら 2024）は確認。「潤滑」は、今回開けた2つの本文に出てこなかった。 | 資料を1つ足すか、「潤滑」を取る。 |
| AI | 下書き 根毛「姿と色の特徴」 | 「根の先端のすぐ後ろから生えはじめ、根にびっしり並ぶ」「土の粒に当たると、すき間に沿って曲がる」 | 未確認 | 今回開けた資料（要旨）に記載なし。後者は下書きも「シロツメクサでの観察は未確認」としている。 | 図鑑の文に使うなら資料を足す。 |
| AJ | streptomyces.md 寸法表 | 「集まりの大きさ：16時間で面積 約10万〜20万µm²」 | 未確認 | Singh Mavi & Flärdh 2026 の図の説明で確認できたのは「30℃、16時間、スケール50µm、面積を測った」ことまで。面積の数値は図の中にあり、読めなかった。 | 「16時間で、さしわたし数百µm」（スケールからの目測）と書く。 |

## 3. 全項目の表

判定の列は「確認／弱い確認／未確認／誤り」のいずれか。

### 3-1. 「初登場時の説明文」（6枚）

| ID | カード・項目 | 文・数値 | 判定 | 出所と該当箇所 |
|---|---|---|---|---|
| C01 | アカントアメーバ 名前 | *Acanthamoeba castellanii* | 確認 | Fuerst & Booton 2020（PMC7400246）：Castellani の見つけたアメーバを Douglas 1930 が記載、Volkonsky 1931 が *Acanthamoeba* 属を提案 |
| C02 | 同 | 大きさ約0.03mm | 確認 | Wang ら 2023（PMC10113681）「The trophozoite varies in size from 25 to 40 μm in diameter (Marciano-Cabral and Cabral, 2003)」。de Schaetzen ら 2022：*A. castellanii* の半径は平均15.3µm（＝直径約31µm）。※Campolo ら 2025 の自動計測では株の平均16〜26µm と小さめ |
| C03 | 同 | 髪の毛の太さの3分の1ほど | 確認 | 計算：80÷3＝27µm |
| C04 | 同 | とげのような細い足を出して | 確認 | Siddiqui & Khan 2012「spine-like structures (now known as acanthopodia) on its surface」 |
| C05 | 同 | 土の粒の上をはい | 弱い確認 | 同「movement … similar both at solid substrata and water-air interface」「isolated from … soil」。土の粒の上での観察ではない（2-2 の G） |
| C06 | 同 | 細菌を包みこんで食べ | 確認 | Marciano-Cabral & Cabral 2003 要旨「Trophozoites feed on bacteria, yeast, and algae」。de Schaetzen ら 2022「prior to phagocytosis」 |
| C07 | 同 | 余った窒素を根が使える形で出します | 確認 | Kreuzer ら 2006 要旨「As a consequence of nutrient release from grazed bacteria and changes in root architecture, the nitrogen content of rice shoots increased by 45%」。Siddiqui & Khan 2012「nitrogen mineralization by Acanthamoeba」。実験室の結果（2-2 の F） |
| C08 | アクロベロイデス 名前 | *Acrobeloides nanus* | 確認 | GBIF「Acrobeloides nanus (de Man, 1880) Anderson, 1968」ACCEPTED、Cephalobidae、Rhabditida。Kim ら 2016 要旨も同じ |
| C09 | 同 | 体長約0.4mm | 確認 | Song ら 2025 表1：本種の基準値408.6±29.0（335.3〜442.3）µm、韓国の分離株391.9±28.8（351.9〜419.7）µm |
| C10 | 同 | 髪の毛の太さの5倍ほど | 確認 | 計算：409÷80＝5.1 |
| C11 | 同 | 線虫（糸のように細長い動物） | 確認 | 同 表1：体長÷太さ＝19.2（17.1〜21.5） |
| C12 | 同 | 体をくねらせて | 弱い確認 | 本種の資料なし。別種 *C. elegans*：Fang-Yen ら 2010 要旨「undulatory movements」（2-1 の C） |
| C13 | 同 | 水の膜を進み | 未確認 | 今回開けた資料に記載なし。仕様書も「確かめていない」と書いている（2-1 の C） |
| C14 | 同 | 細菌を飲みこんで食べ | 確認 | Bird & Ryder 1993 要旨「ingestion and breakdown of P. corrugata in the pharynx of A. nanus and bacterial passage through the nematode intestine」 |
| C15 | 同 | 余った窒素を出します | 確認 | Ferris ら 1998（Plant and Soil）要旨「Bacterial feeding nematodes excrete N assimilated in excess of that required for growth … mainly as NH4+」。細菌食の線虫全体として（2-2 の H） |
| C16 | ニトロソスピラ 名前 | *Nitrosospira* 属 | 確認 | LPSN「Nitrosospira Winogradsky and Winogradsky 1933 (Approved Lists 1980)」 |
| C17 | 同 | 長さ約0.001mm | 弱い確認 | Watson 1971 要旨「1.5–2.5 μ long and 0.8–1.0 μ wide」。町田の株の長さは本文に記載なし（2-1 の A） |
| C18 | 同 | ばねのように巻いた細菌 | 確認 | Tomiyama ら 2001「spiral, 0.2–0.3 μm in width, with between 3 and 6 turns」。Nakagawa ら 2021「tightly coiled cell shape」 |
| C19 | 同 | アメーバや線虫が出したアンモニウムを | 弱い確認 | Verhagen ら 1993 要旨（鞭毛虫と *Nitrosomonas europaea*）。根があると効果なし（Verhagen ら 1994）。2-1 の B |
| C20 | 同 | アンモニウムを亜硝酸に変え | 確認 | Kowalchuk & Stephen 2001 要旨「use the conversion of ammonia to nitrite as their sole energy source」 |
| C21 | 同 | 窒素が硝酸になる最初の一歩を担います | 確認 | Leininger ら 2006 要旨「Ammonia oxidation is the first step in nitrification … results in the formation of nitrate」 |
| C22 | 同 | 硝酸（根が吸える形の一つ） | 確認 | 同「The increase in nitrate availability in soils is important for plant nutrition」 |
| C23 | ストレプトマイセス 名前 | *Streptomyces* 属 | 確認 | LPSN「Streptomyces Waksman and Henrici 1943 (Approved Lists 1980)」 |
| C24 | 同 | 太さ約0.001mmの糸 | 確認 | Sexton & Tocheva 2020（PMC7541840）「S. coelicolor and S. venezuelae produce cells that are too thick (∼ 1 μm) … S. albus vegetative hyphae are <0.5 μm in diameter」（2-2 の J） |
| C25 | 同 | 糸をのばして枝分かれする細菌（放線菌） | 確認 | Zakalyukina ら 2024「multicellular bacteria that form extensively branched substrate mycelia and develop aerial hyphae with chains of spores」。Flärdh & Buttner 2009 要旨「filamentous bacteria」 |
| C26 | 同 | 土の匂いのもと「ゲオスミン」を作り | 確認 | Becher ら 2020 要旨「the soil-smelling terpenoids geosmin and 2-methylisoborneol」「geosmin biosynthesis genes among virtually all species of Streptomyces」 |
| C27 | 同 | 抗生物質を作る仲間も多くいます | 確認 | Barka ら 2016 要旨（放線菌は、いま使われる天然由来の抗生物質の約3分の2を作る）。Olanrewaju & Babalola 2019「a good source of bioactive compounds, antibiotics」 |
| C28 | 根毛 | 根の表面の細胞が1個ずつ外へのびた…管 | 確認 | Grierson ら 2014 要旨「Roots hairs are cylindrical extensions of root epidermal cells」 |
| C29 | 同 | 太さ約0.01mm | 弱い確認 | シロイヌナズナの値。Groves ら 2026「approximately 10 μm in diameter and can grow to be 1 mm or more in length (Grierson et al. 2014)」（2-2 の I） |
| C30 | 同 | 髪の毛の8分の1 | 確認 | 計算：80÷10＝8 |
| C31 | 同 | 根が土にふれる面を大きく広げ | 確認 | Caradus 1979 要旨「11% calculated increase in the volume of soil explored by root hairs」。McLachlan ら 2019 要旨「total surface area of the root hair cylinder」 |
| C32 | 同 | リンなどの養分を吸います | 確認 | Grierson ら 2014 要旨「important for acquisition of nutrients」。McLachlan ら 2019 要旨（根毛をふくむ表面積とリンの吸収：R²＝0.69） |
| C33 | 同 | 水（を吸います） | 未確認 | 今回開けた資料に記載なし（2-1 の D） |
| C34 | 根の粘液と境界細胞 | 根の先は糖でできた粘液を出し | 確認 | Ropitaux ら 2020「mucilage contained pectin, cellulose, … two hemicellulosic polysaccharides」。Nguyen 2003 要旨「the secretion of mucilage」 |
| C35 | 同 | 根冠からはがれた生きた細胞「境界細胞」 | 確認 | Omelyanchuk ら 2024「the outermost layer of the root cap detaches as individual viable border cells」 |
| C36 | 同 | その中にただよいます | 弱い確認 | 同「The mucilage that the border cells are embedded in」。Ropitaux ら 2020「dense fibrillary network embedding BCs and holding them together」（2-1 の E） |
| C37 | 同 | 根のまわりの微生物を引きよせます | 確認 | Omelyanchuk ら 2024「serves both to attract microorganisms promoting plant growth and to protect plants from pathogens」 |

### 3-2. 下書きの台帳（`Docs/REFERENCE/stage2-species-draft.md`）

| ID | 箇所 | 文・数値 | 判定 | 出所と該当箇所 |
|---|---|---|---|---|
| D01 | 採用の一覧 | *C. elegans* は、野外でふえているのは腐った果実や茎で、土や堆肥では主に休眠の幼虫（ダウアー） | 確認 | Frézal & Félix 2015「originally isolated in rich soil or compost, where it is mostly found in a non-feeding stage called the dauer」「feeding and reproducing stages … in decomposing plant material, such as fruits and thick herbaceous stems」 |
| D02 | 同 | *Acrobeloides* 属は日本の畑で多い細菌食の線虫（属まで） | 確認 | Morise ら 2012 本文（岡田・原田 2007 の引用）「two abundant nematode genera Acrobeloides (bacterial feeder) and Pratylenchus」。日本線虫学会第12回大会講演要旨（岡田ら 2004）にも大豆畑の *Acrobeloides* 属の記述。※Morise らの畑は愛知県豊橋市 |
| D03 | 同 | *A. nanus* は世界に広く分布、シュードモナスを食べる、乾燥に耐える | 確認 | Song ら 2025「cosmopolitan」。Bird & Ryder 1993 要旨。Bird ら 1993 要旨「anhydrobiotic capabilities」 |
| D04 | 同 | 日本での種の記録は未確認 | 弱い確認 | 記録が見つかった（荒城 2004、茨城県つくば市）。2-4 の M |
| D05 | 同 | 畑の表土でいちばん多いアンモニア酸化細菌は一貫して *Nitrosospira* 属 | 確認 | Rice ら 2016「The most numerous AOB isolated or detected by non-cultural methods in aerobic agricultural surface soils are consistently members of the Nitrosospira genus」 |
| D06 | 同 | 東京都町田市のイネの根の表面から分離された株（NRS527） | 確認 | Tomiyama ら 2001「rice was collected from a paddy field in Tokyo Machida City in mid-July and mid-August, 1997」。Nakagawa ら 2021「isolated from the rhizoplane of paddy rice roots」 |
| D07 | 同 | *Nitrobacter* が同じイネの根から一緒に分離 | 確認 | Tomiyama ら 2001「Nitrosospira sp. NRS527 and Nitrobacter sp. NRB5220」 |
| D08 | 同 | ゲオスミンを作る遺伝子は、この属のほぼすべての種にある | 確認 | Becher ら 2020 要旨「virtually all species of Streptomyces」 |
| D09 | 同 | 日本の土（静岡県伊東市）から分離された種もある | 確認 | NITE のページ（開けた）「isolated by Omura et al. of the Kitasato Institute from the soil sample collected in Ito City, Shizuoka Pref.」 |
| D10 | 同 | イネとシロイヌナズナで…植物の窒素を増やす | 弱い確認 | 窒素はイネだけ（2-4 の W） |
| D11 | 「一緒にいる」範囲 | 線虫が食べることで、フィチン酸からのリンの放出が進む（寒天の上の実験。線虫はマダガスカルの土から） | 確認 | García-Sánchez ら 2021「solid medium containing phytate」「The grazer activity seemed to be crucial to enhance phytate mineralization」「Lazaina … Madagascar」。枯草菌168株も本文どおり |
| D12 | 同 | アメーバを入れても、アンモニア酸化細菌の数は変わらず、放線菌の仲間はふえた | 確認 | Rosenberg ら 2009 要旨「Actinobacteria, Nitrospira, Verrucomicrobia and Planctomycetes increased … betaproteobacterial ammonia oxidizers and Gammaproteobacteria did not change in abundance」 |
| D13 | アカントアメーバ 大きさ | 栄養体25〜40µm（総説）、資料によって12〜50µm | 確認 | Wang ら 2023、Campolo ら 2025「generally cited as being 12 to 50µm」 |
| D14 | 同 | ATCC 30010 の平均19.6µm | 未確認 | 図の中の値（2-4 の T） |
| D15 | 同 | シスト13〜23µm | 確認 | Siddiqui & Khan 2012。注記あり（2-4 の V） |
| D16 | 同 姿 | 透明でなめらかな広い仮足、アカントポディア | 確認 | Siddiqui & Khan 2012「formation of a hyaline pseudopodium」「acanthopodia」 |
| D17 | 同 | 収縮胞（水を外へ出す。1個〜数個）、食胞、核は1個 | 確認 | 同「one or more prominent contractile vacuoles, whose function is to expel water」「digestive vacuoles」「normally possesses a single nucleus」 |
| D18 | 同 | シストは二重の壁。外はしわ、内は星形〜多角形、間にすき間 | 確認 | 二重・すき間：Siddiqui & Khan 2012。しわ・星形：Xuan ら 2017「thick, wrinkled ectocysts and … polygonal endocysts」、Hamid ら 2024（2-4 の U） |
| D19 | 同 動き | 速さ毎秒0.1〜0.8µm | 確認 | Siddiqui & Khan 2012「approximately 0.8 μm/second」。Campolo ら 2021「12.1 µm/min (0.20 µm/s)」「peak of 0.40 µm/s」。Hernández-Ramírez ら 2026「0.205 µm/s compared with 0.117 µm/s」 |
| D20 | 同 | 1分で体1個分ほど | 確認 | 計算：0.2〜0.8µm×60秒＝12〜48µm |
| D21 | 同 | Hernández-Ramírez ら 2026：個々の細胞で毎秒0.05〜0.33µm | 未確認 | 図の点の読み取り。本文で確認できたのは平均（0.117、刺激があると0.205）だけ |
| D22 | 同 働き | 「微生物ループ」 | 確認 | Bonkowski 2004 要旨「nutrients released from consumed bacterial biomass, that is, the 'microbial loop'」 |
| D23 | 同 | イネで苗の窒素が45%ふえ、根の枝分かれの形も変わった | 確認 | Kreuzer ら 2006 要旨。正確には「イネの地上部（shoots）の窒素」 |
| D24 | 同 | 食べ物がなくなったり乾いたりするとシストになる | 弱い確認 | Siddiqui & Khan 2012「Exposure to harsh conditions result in cellular differentiation into a double-walled cyst form」。きっかけの中身（飢え・乾燥）は本文に書かれていない |
| D25 | 同 関係 | ベータプロテオバクテリアとフィルミクテスが大きく減り | 確認 | Rosenberg ら 2009 要旨「most pronounced in Betaproteobacteria and Firmicutes」。※イネ（Kreuzer ら 2006）では逆に「ベータプロテオバクテリアが得をした」と書かれている。植物によって結果が違う |
| D26 | 同 | シュードモナスは、数は変わらないが顔ぶれが入れ替わった | 弱い確認 | 2-4 の X |
| D27 | 同 正直に | 角膜炎（コンタクトレンズ）、脳炎（免疫が弱った人） | 確認 | Siddiqui & Khan 2012、Marciano-Cabral & Cabral 2003 要旨 |
| D28 | 同 | 日本の土から *A. castellanii* または *A. polyphaga* の株（Yagita & Endo 1990） | 確認 | 要旨「Eight isolates, identified as either Acanthamoeba castellanii or A. polyphaga from human eye infections, contact lens containers, and soil in Japan」 |
| D29 | 同 | 総説に「アメーバがいる土は炭素・窒素・リンの無機化が多い」 | 確認 | Siddiqui & Khan 2012「significantly greater mineralization of carbon, nitrogen, and phosphorous」 |
| D30 | アクロベロイデス 分類 | 桿線虫目 ケファロブス科 | 確認 | GBIF、Kim ら 2016 要旨。和名は未確認（下書きの申告どおり） |
| D31 | 同 大きさ | 体長335〜442µm（平均409）、太さ17〜25µm（平均21）、尾21〜25µm（平均23） | 確認 | Song ら 2025 表1（本種の基準値の列）：408.6±29.0（335.3〜442.3）、21.3±2.1（17.1〜24.5）、23.4±1.4（20.5〜25.4） |
| D32 | 同 | 髪の毛の4〜5.5倍の長さ、太さは4分の1ほど、長さは太さの約19倍 | 確認 | 計算：335÷80＝4.2、442÷80＝5.5、21÷80＝0.26。表1：19.2 |
| D33 | 同 姿 | 唇の突起は低い円錐形、尾は先が丸い | 確認 | Kim ら 2016 要旨「low and blunt labial probolae … bluntly rounded tail」。「3つ」は本文未確認 |
| D34 | 同 | 輪のすじ1.6〜2.2µm、食道の細部 | 未確認 | Kim ら 2016 の本文は開けなかった（2-4 の Q） |
| D35 | 同 動き | *C. elegans* の速さ・波の数値 | 未確認 | 2-4 の O |
| D36 | 同 働き | 細菌は線虫より窒素の割合が高いので、余った窒素をアンモニウムなどの形で出す | 確認 | Ferris ら 1998 要旨（C15 と同じ）。「窒素の割合が高いので」という理由づけは、要旨の「成長に必要な分をこえて取りこんだ窒素」に当たる |
| D37 | 同 | *A. bodenheimeri* は畑の根圏で窒素を出すおもな種の一つ | 未確認 | 2-4 の N |
| D38 | 同 | 動き回って細菌を運び、フィチン酸の分解を進める | 確認 | García-Sánchez ら 2021「nematode migration within both zones allowed the proliferation of bacteria」 |
| D39 | 同 | 乾眠 | 確認 | Bird ら 1993 要旨「anhydrobiotic capabilities」 |
| D40 | 同 関係 | *P. corrugata* を飲みこんで食道でこわす、*P. fluorescens* 由来の光る物質が腸にたまる | 確認 | Bird & Ryder 1993 要旨 |
| D41 | 同 | 韓国の研究では *P. fluorescens* をえさに飼われている | 確認 | Song ら 2025「1% agar plate containing a bacterial lawn of Pseudomonas fluorescens ANU101」 |
| D42 | 同 正直に | 韓国（ジャガイモ畑、キュウリ畑）、オーストラリア（農地と乾燥地）の記録 | 確認 | Song ら 2025、Bird & Ryder 1993 要旨「widespread in agricultural and arid soils throughout Australia」 |
| D43 | 同 | 分布の一覧に日本なし、*A. buetschlii* との議論、オスは知られていない | 未確認 | 2-4 の R |
| D44 | 同 | メスだけでふえる（単為生殖） | 確認 | Song ら 2025「parthenogenetic soil nematode」 |
| D45 | 同 未確認 | 15℃で約125時間、35℃で約40時間 | 確認 | Bird ら 1993 要旨「At 15 C, hatching occurs in about 125 hours and at 35 and 37.5 C after about 40 hours」 |
| D46 | ニトロソスピラ 学名・分類 | 基準種 *N. briensis* Winogradsky & Winogradsky 1933、ニトロソモナス科、グラム陰性 | 確認 | LPSN。Rice ら 2016 表1「Gram stain: negative」。目の名は注記あり（2-4 の Z） |
| D47 | 同 大きさ | 太さ0.2〜0.4µm、3〜6回巻き | 確認 | Tomiyama ら 2001（0.2〜0.3µm、3〜6回）。0.4µm と「多いもので20回」は未確認（2-4 の AB） |
| D48 | 同 | 巻いた全体は長さ約1〜2.5µm、太さ約0.8〜1µm | 確認 | Watson 1971 要旨（1.5〜2.5×0.8〜1.0µm）。下の端の「約1µm」は写真の目測 |
| D49 | 同 | 枯草菌やシュードモナスより小さい | 確認 | 計算：ステージ1の値（長さ約3µm）との比較 |
| D50 | 同 姿 | 芽胞は作らない、動く株（C-128） | 確認 | Rice ら 2016 表1「Motility: motile」「Sporulation: Non-sporulating」 |
| D51 | 同 | NRS527株は鞭毛がなく動かない | 確認 | Tomiyama ら 2001「lacking flagella … non-motile in wet mounts」 |
| D52 | 同 | マイクロコロニー、粘り気のある物質に包まれる | 確認 | Sanders ら 2019「Nitrosospira and Nitrospira microcolonies」「some cells were surrounded by extracellular polymeric substances (EPS)」 |
| D53 | 同 | 光学顕微鏡では棒や粒にしか見えない（らせんと分かるのは電子顕微鏡） | 弱い確認 | 2-4 の AA |
| D54 | 同 動き | 直径1〜2mmの集まりになるまで4〜5週間 | 確認 | Tomiyama ら 2001「colonies 1.0–2.0 mm in diameter appeared at 4–5 weeks」 |
| D55 | 同 働き | そのエネルギーだけで生きる、炭素は二酸化炭素から | 確認 | Kowalchuk & Stephen 2001 要旨「Chemolitho-autotrophic … sole energy source」。Rice ら 2016「chemolithoautotrophic」 |
| D56 | 同 | 亜硝酸は別の細菌がすぐに硝酸に変える | 弱い確認 | 2-4 の AD |
| D57 | 同 正直に | アンモニア酸化アーキアのほうが遺伝子の数ではずっと多い | 確認 | Leininger ら 2006 要旨「up to 3,000-fold more abundant than bacterial amoA genes」 |
| D58 | 同 | 硝酸は水に流されやすく、地下水の汚れの原因にもなる | 確認 | 同「considerable impact on groundwater pollution owing to leaching」 |
| D59 | 同 | 植物はアンモニウムのままでも窒素を吸える | 確認 | Verhagen ら 1994 要旨「roots of Plantago lanceolata were more competitive for limiting amounts of ammonium than Nitrosomonas europaea」 |
| D60 | 同 出所 | 本属は土、下水処理場、淡水、海に広く分布 | 確認 | Nakagawa ら 2021 本文 |
| D61 | ストレプトマイセス 分類 | アクチノマイセトータ門、ストレプトマイセス科、グラム陽性 | 確認 | LPSN。Zakalyukina ら 2024「Gram-stain-positive」（2-4 の AE） |
| D62 | 同 大きさ | 胞子0.7〜0.9µm（*S. sirii*）、数珠つなぎ | 確認 | Zakalyukina ら 2024「globular spores of 0.67–0.90 µm in diameter」 |
| D63 | 同 | 16時間で直径 数百µmの集まり | 弱い確認 | Singh Mavi & Flärdh 2026 の図の説明「imaged after 16 h of incubation at 30 °C … Scale bar, 50 µm」。大きさは目測（2-4 の AJ） |
| D64 | 同 姿 | 基生菌糸と気菌糸、気菌糸が胞子の数珠に変わる | 確認 | Zakalyukina ら 2024、Flärdh & Buttner 2009 要旨「sporulating aerial mycelium」 |
| D65 | 同 | 数珠はまっすぐ／らせん、表面はなめらか／いぼ状、色は白〜灰色 | 確認 | Chanama ら 2023「straight chains of nonmotile cylindrical spores with smooth surface」。Zakalyukina ら 2024「curly sporophores with a warty surface」「white to grey aerial mycelium」 |
| D66 | 同 動き | 動かない、先端成長、枝分かれ | 確認 | Singh Mavi & Flärdh 2026「build their cell walls in restricted zones at hyphal tips」「hyphal branching」。胞子は「nonmotile」（Chanama ら 2023） |
| D67 | 同 働き | ゲオスミンと 2-メチルイソボルネオール | 確認 | Becher ら 2020 要旨。※2-MIB の遺伝子があるのは約50%の種 |
| D68 | 同 | トビムシを引きよせ、食べられ、ふんと体の表面で胞子が運ばれる | 確認 | 同「F. candida feeds on the Streptomyces colonies and disseminates spores both via faecal pellets and through adherence to its hydrophobic cuticle」 |
| D69 | 同 | ゲオスミンは胞子を作る時期の集まりが出す | 確認 | 同「constraining emission of the odorants to sporulating colonies」 |
| D70 | 同 | *S. avermitilis* は寄生虫の薬のもと | 確認 | NITE「producer of anthelmintic macrolide "avermectin"」 |
| D71 | 同 | 根のまわりと根の表面にもよくすみつく | 確認 | Olanrewaju & Babalola 2019 本文「Most Streptomyces are efficient rhizosphere and rhizoplane colonizers」 |
| D72 | 同 正直に | ジャガイモのそうか病を起こす種がいる | 確認 | Vurukonda ら 2018「ten plant pathogenic species, most of which are causal agents of the common scab of potatoes」。種名 *S. scabiei* は今回開けた本文では未照合 |
| D73 | 同 出所 | *S. sirii* は竹の根圏の土から、*S. antimicrobicus* は粘土質の土から | 確認 | Zakalyukina ら 2024（ロシア・シリウス）、Chanama ら 2023（タイ・チョンブリー県の水田） |
| D74 | 根毛 大きさ | 長さは1mm以上になることがある（シロイヌナズナ） | 弱い確認 | Grierson ら 2014 を引く Groves ら 2026 の本文（C29 と同じ） |
| D75 | 同 | サブタレニアンクローバーで0.19〜0.33mm | 確認 | McLachlan ら 2019 要旨「root hair length (0.19–0.33 mm)」 |
| D76 | 同 働き | シロツメクサでは根毛の長さが遺伝し、長い株を選び出せる。選び出しで50µmふえた | 確認 | Caradus 1979 要旨「An increase of 50 μm … realised heritability … 0.33 … 0.44」 |
| D77 | 同 姿 | 根の先端のすぐ後ろから生えはじめ、びっしり並ぶ | 未確認 | 2-4 の AI |
| D78 | 境界細胞 大きさ | ダイズで3つの型（細長いものは長さが幅の5.5倍以上） | 確認 | Ropitaux ら 2020「spherical (1 ≤ R < 2), intermediate (2 ≤ R < 5.5) and elongated (R ≥ 5.5)」 |
| D79 | 同 姿 | はがれた後も生きている（数日〜数週間）、自分でも粘液を出す | 確認 | Omelyanchuk ら 2024「several days in Arabidopsis … to several weeks in maize」「Living border cells are the primary producers of mucilage」 |
| D80 | 同 働き | 潤滑 | 未確認 | 2-4 の AH |
| D81 | 同 | 微生物を引きよせ、病原菌から根の先を守る。死んだ境界細胞は微生物のえさになる | 確認 | 同「death of border cells in the soil produces cellular debris, which serves as a nutrient source for the microbiota」。Ropitaux ら 2020（疫病菌の遊走子を防ぐ） |
| D82 | 同 | 光合成で作った炭素の約17%を根から土へ。大半は微生物の呼吸 | 確認 | Nguyen 2003 要旨「On average, 17% of the net C fixed by photosynthesis is lost by roots and recovered as rhizosphere respiration (12%) and soil residues (5%)」。下書きは「検索結果の要約のみ」としていたが、要旨で確認できた |
| D83 | 同 正直に | 若い根1本で800個〜17,000個、エンドウでは1日に約3,000〜4,000個 | 確認 | Omelyanchuk ら 2024「800 in Bromus carinatus … to 17,000 in Zea mays」「the root system of a single pea plant produces approximately 3,000–4,000 border cells per day」。※3,000〜4,000個は「エンドウ1株の根全体で」 |
| D84 | 同 関係 | 根圏の細菌は根から出る炭素を主なえさにし、それを原生動物が食べる | 確認 | Bonkowski 2004 要旨「exudates fuelling mainly free-living rhizobacteria. Rhizobacteria are strongly top-down regulated by microfaunal grazers, particularly protozoa」 |

### 3-3. 形の仕様書（`Docs/REFERENCE/species/*.md`。資料に帰している数値と記述の抜き取り）

| ID | 仕様書 | 項目 | 判定 | 出所と該当箇所 |
|---|---|---|---|---|
| S01 | acanthamoeba.md | 8つの株の平均は16.0〜25.8µm | 確認 | Campolo ら 2025 図3の説明文「The sizes range from 16.0 to 25.8 microns, with T5 displaying the smallest and T18 the largest」 |
| S02 | 同 | シスト10〜25µm（別の資料） | 確認 | 同「cysts are slightly smaller at 10 to 25µm in diameter」 |
| S03 | 同 | 土の株のシスト約20〜23µm（目測）、角の数4〜7 | 誤り | Xuan ら 2017 本文「12.0 to 18.8 μm … four to six」（2-3 の K） |
| S04 | 同 | シストの壁の成分（外：たんぱく質と多糖、内：セルロース）、出口（ふたがある） | 確認 | Siddiqui & Khan 2012「outer walls consists of proteins and polysaccharides, while the inner wall possesses cellulose」「opercula in the centre of ostioles」 |
| S05 | 同 | 壁の形（しわ、星形・多角形・丸・だ円）の出所を Siddiqui & Khan 2012 としている | 確認 | 内容は確認。出所の直しが必要（2-4 の U） |
| S06 | 同 | リソソーム、グリコーゲンを含む袋、ミトコンドリア | 確認 | Siddiqui & Khan 2012 |
| S07 | 同 | 速さ：平均約0.12µm、刺激があると約0.2µm（*A. castellanii*） | 確認 | Hernández-Ramírez ら 2026「0.205 µm/s compared with 0.117 µm/s」 |
| S08 | 同 | *A. polyphaga* で最大毎秒0.40µm（大腸菌があるとき） | 確認 | Campolo ら 2021「ATCC 30461 (Acanthamoeba polyphaga …)」「E. coli … peak of 0.40 µm/s at 1.5 h」 |
| S09 | 同 | 毎秒0.20µmで12時間進むと約8.6mm | 確認 | 計算：0.2×43,200＝8,640µm。同論文も「12時間でレンズ（22〜25mm）の約40%」 |
| S10 | 同 | 細菌を表面に集めてからまとめて取りこむ（リステリア菌） | 確認 | de Schaetzen ら 2022「"backpacking" strategy to trap and aggregate bacterial prey prior to phagocytosis」 |
| S11 | 同 | 計算に使われた栄養体の半径は15.5µm | 確認 | 同「with radius ra = 15.5 μm」（実測の平均は15.3µm） |
| S12 | 同 | Xuan の株は「土と水道水から」「T4型を含む」 | 確認 | Xuan ら 2017（中国・延吉。T4、T5、T16） |
| S13 | 同 | 近い仲間の *Naegleria* | 誤り | 2-3 の L |
| S14 | acrobeloides.md | 韓国の別の分離株352〜420µm（平均392）、口から食道の終わりまで体長の3.4分の1、肛門の位置の太さ約13µm | 確認 | Song ら 2025 表1：391.9（351.9〜419.7）、BL/M to E 3.4、肛門の幅12.5〜12.9 |
| S15 | 同 | 本種の写真は韓国のキュウリ畑の土から。図の「M（オス）」の印は本文と合わない | 確認 | 同「cucumber … farm in Gunwi, Korea」。図1の説明文に「testis for males (‘M’)」とあり、本文は「parthenogenetic」。仕様書の指摘は正しい |
| S16 | 同 | 頭の幅、口の筒、輪のすじ、乳頭、生殖器（Kim ら 2016） | 未確認 | 2-4 の Q |
| S17 | 同 | 側面のすじ3本 | 未確認 | 要旨は「5本」（2-4 の P） |
| S18 | 同 | *A. saeedi* はメス1.06〜1.57mm、体長が約3倍 | 弱い確認 | Rana ら 2020 本文「1.03-1.57 … mm」（2-4 の S） |
| S19 | 同 | *C. elegans* の波・速さの数値 | 未確認 | 2-4 の O |
| S20 | 同 | 食道でこわれ、腸を通る | 確認 | Bird & Ryder 1993 要旨 |
| S21 | nitrosospira.md | NRS527株：太さ0.2〜0.3µm、3〜6回巻き、短いらせんは短い棒に見える | 確認 | Tomiyama ら 2001「Short spirals have the appearance of short rods cells」 |
| S22 | 同 | NRS527株には細胞の内側にたたまれた膜がない | 確認 | 同 要旨「Intracytoplasmic membranes, a characteristic of ammmonia-oxidizing bacteria are absent」 |
| S23 | 同 | ゲルの上の集まりは「赤みがかった」色、10リットルから1〜1.5g | 確認 | 同「circular, reddish (NRS527) … colonies」「from a 10-L mass culture, nearly 1.0–1.5 grams (wet weight)」 |
| S24 | 同 | *N. briensis*：長さ1.5〜2.5µm、太さ0.8〜1.0µm（Watson 1971。「検索結果の要約のみ」） | 確認 | Watson 1971 の要旨の原文で確認 |
| S25 | 同 | 属の記載：太さ0.3〜0.4µm、3〜20回、丸い形0.8〜1.2µm | 未確認 | 2-4 の AB |
| S26 | 同 | C-128株は米国の畑の土から | 確認 | Rice ら 2016「fertilized blueberry patch in East Falmouth, Massachusetts」 |
| S27 | 同 | C-128株の写真に鞭毛1〜3本 | 未確認 | 図は読めていない。*N. briensis* に鞭毛があること自体は Watson 1971 の要旨で確認（1〜6本。2-4 の AC） |
| S28 | 同 | 形の幅は条件と元気さで変わる。シベリアの土 | 確認 | Sanders ら 2019「varied from short curved rods to long coiled spirals … depending on the surrounding conditions and their fitness」「Lena River Delta in North-East Siberia」 |
| S29 | streptomyces.md | 胞子0.67〜0.90µm、らせんに巻く、いぼ | 確認 | Zakalyukina ら 2024 |
| S30 | 同 | 糸の仕切りと、胞子になるときの仕切りの2種類 | 確認 | Bush ら 2022「two modes of cell division: formation of cross-walls in hyphae … and septation for release of unicellular spores」 |
| S31 | 同 | 16時間で面積約10万〜20万µm² | 未確認 | 2-4 の AJ |
| S32 | 同 | 1本の数珠の胞子は多いもので100個ほど | 未確認 | 仕様書の申告どおり（検索結果の要約のみ）。今回も資料を開けていない |
| S33 | 同 | 水をはじくさや、気菌糸 | 確認 | Flärdh & Buttner 2009 要旨「a hydrophobic sheath that allow cells to escape from the surface tension」 |
| S34 | 同 | 糸の太さ0.5〜1µm（目測 △） | 確認 | Sexton & Tocheva 2020（2-2 の J）。「△」を外せる |

## 4. 「よくできた話」として特に疑って調べた点

- **「アメーバが細菌を食べて、余った窒素を根に返す」**：実験で裏づけがある（イネ、窒素45%増）。ただし実験室の結果で、窒素がふえた理由には「根の形が変わった」こともふくまれる。シロツメクサ、野外の草地では未確認。
- **「アメーバや線虫が出したアンモニウムを、ニトロソスピラが亜硝酸に変える」**：きれいにつながる話だが、この組み合わせの資料はない。近い実験（鞭毛虫と *Nitrosomonas*）では、**根があると硝化は進まなかった**（根がアンモニウムを先に取る）。カードの言い切りは弱める必要がある（2-1 の B）。
- **「線虫がリンの流れを速める」**：*Acrobeloides* 属の一種（マダガスカルの土から）と枯草菌の、寒天の上の実験で確認。本種（*A. nanus*）での実験ではない。カードはリンに触れておらず、この扱いで正しい。
- **「*Acrobeloides nanus* は日本にいるのか」**：つくば市の畑の記録（学会の講演要旨、2004年）が見つかった。関東の記録なので、舞台には合う。ただし査読のある論文での記録は見つけていない。
- **「ニトロソスピラは東京都町田市で見つかっている」**：本文で確認。ただし水田のイネの根で、草地ではない（下書きも明記）。
- **「ストレプトマイセスは土の匂いのもと」**：確認。匂いを出すのは胞子を作る時期だけ、という下書きの注意も資料どおり。
- **「エバーメクチンのもとは静岡県伊東市の土」**：NITE のページを開いて確認。
- **「関東の草地のシロツメクサの根のまわりに4種が一緒にいる」**：下書きの申告どおり、そう書いた資料はない。関東の記録があるのは、ニトロソスピラ（町田市・水田）とアクロベロイデス（つくば市・畑）の2つ。アカントアメーバとストレプトマイセスは、日本の土の記録まで（伊東市は関東ではない）。
- **根毛が「水を吸う」**：よく言われることだが、今回開けた資料には書かれていなかった。資料を足すまで言い切らないのが安全。
