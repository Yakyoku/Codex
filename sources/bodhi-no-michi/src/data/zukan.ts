// 図鑑。出会った尊格の紹介。文は静的（外部入力なし）なので、summary などは <ruby> を含む HTML として描く。
export interface ZukanEntry {
  id: string;
  name: string;
  reading: string;
  rank: string;
  summary: string;
  attributes: { name: string; reading?: string; meaning: string }[];
  mudra: { name: string; reading?: string; meaning: string }[];
  note: string;
}

export const ZUKAN: ZukanEntry[] = [
  {
    id: 'kongorikishi',
    name: '金剛力士',
    reading: 'こんごうりきし',
    rank: '天部',
    summary:
      '寺の門の左右に立ち、仏の教えと<ruby>境内<rt>けいだい</rt></ruby>を守る二体一対の守護神。' +
      '<ruby>仁王<rt>におう</rt></ruby>とも呼ばれる。口を開いた<ruby>阿形<rt>あぎょう</rt></ruby>と、' +
      '口を結んだ<ruby>吽形<rt>うんぎょう</rt></ruby>が向かい合う。',
    attributes: [
      {
        name: '金剛杵',
        reading: 'こんごうしょ',
        meaning: '何ものにも砕かれない堅さを表す法具。迷いを打ち破る智慧のしるしとされる。',
      },
      {
        name: '天衣',
        reading: 'てんね',
        meaning: '肩から翻る細長い布。天部の尊にふさわしい装いとされる。',
      },
    ],
    mudra: [
      {
        name: '阿吽の口',
        reading: 'あうん',
        meaning:
          '「阿」は口を開いて出す初めの音、「吽」は口を閉じて終わる音。物事の始まりと終わり、また吐く息と吸う息を表すとされる。',
      },
      {
        name: '構えた手',
        meaning: '掌を開き、あるいは拳を握って、門前で邪なものを押しとどめる姿。形は像によって異なり、定まった印相ではない。',
      },
    ],
    note:
      '東大寺南大門の像の様式を手本にした本作の造形。' +
      '本作の章立てと六波羅蜜（ろくはらみつ）との対応は、本作の解釈です。',
  },
  {
    id: 'jizo',
    name: '地蔵菩薩',
    reading: 'じぞうぼさつ',
    rank: '菩薩',
    summary:
      '<ruby>釈迦<rt>しゃか</rt></ruby>の<ruby>入滅<rt>にゅうめつ</rt></ruby>ののち、' +
      '<ruby>弥勒<rt>みろく</rt></ruby>菩薩が現れるまでの間、人々を救うとされる菩薩。' +
      '道ばたの石の像として親しまれ、旅人や子どもを見守ると信じられてきた。',
    attributes: [
      {
        name: '錫杖',
        reading: 'しゃくじょう',
        meaning: '頭に輪のついた杖。音を響かせて歩き、どこへでも救いに赴くことを表すとされる。',
      },
      {
        name: '宝珠',
        reading: 'ほうじゅ',
        meaning: '願いをかなえるとされる珠。苦しみを除き、願いを満たす働きを表す。',
      },
    ],
    mudra: [
      {
        name: '与願印',
        reading: 'よがんいん',
        meaning: '掌を前に向けて下げる形。願いを聞き届けることを表す。宝珠や錫杖を持つ像も多く、手の形には諸説ある。',
      },
    ],
    note: '本作では、歩みを記す場所と道案内の役を担います（本作の解釈）。',
  },
];
