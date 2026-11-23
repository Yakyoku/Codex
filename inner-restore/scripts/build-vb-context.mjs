// 音声会話の先生（voice-buddy）が読む要点JSONを、台帳（atlas.json）と区域の課題から作る → public/voice-buddy-context.json
//   node scripts/build-vb-context.mjs
import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const atlas = JSON.parse(fs.readFileSync(path.join(root, 'src/data/atlas.json'), 'utf8'));
const READ = { rbc: 'せっけっきゅう', endothelial: 'けっかんないひさいぼう', pericyte: 'しゅうひさいぼう', muller: 'みゅらーさいぼう', vitreous: 'しょうしたい', lens_fiber: 'すいしょうたいせんいさいぼう',
  crystallin_aggregate: 'くりすたりんのかたまり', rod: 'かんたい', cone: 'すいたい', rpe: 'もうまくしきそじょうひさいぼう', mitochondrion: 'みとこんどりあ', fovea: 'ちゅうしんか', platelet: 'けっしょうばん', drusen: 'どるーぜん' };
const ctx = {
  schema_version: '1.0', id: 'inner-restore-eye', unit: 'ステージ1「目」：網膜・水晶体・視細胞をめぐって治す', subject: '理科', grade: 3,
  source: { file: 'index.html', kind: '実物', title: 'INNER RESTORE（体内紀行）', note: 'https://inner-restore-web-20261122.netlify.app/　細胞の大きさに縮んだ潜行士が、患者の目の中を治していく3Dゲーム。細胞・組織は実在のもの、主人公と道具と治し方は作り事。' },
  goals: [
    '目の中のつくり（硝子体・網膜の毛細血管・水晶体・視細胞・黄斑）と、それぞれの細胞の働きを知る。',
    '血が届かない・タンパクが固まる・沈着物がたまる、といった不調で、目の見え方が悪くなるしくみを知る。',
    '細胞の本当の大きさ（赤血球は髪の毛の太さの約10分の1）を、くらべて実感する。',
  ],
  key_terms: atlas.entries.map((e) => ({ term: e.ja, reading: READ[e.id] ?? e.ja, explanation: `${e.intro}（大きさ：${e.size}。${e.compare}）` })),
  misconceptions: [
    { id: 'destroy', pattern: '悪いところは「こわせばよい」と考える。', hint_direction: 'このゲームでは、もとは体の一部だったものは、こわさずに元にもどす（浄化）ことをたずねる。' },
    { id: 'scan-color', pattern: 'スキャンのオレンジや青緑の色を、細胞そのものの色だと思う。', hint_direction: 'スーツの画面が、健康かどうかを色で知らせている表示だと気づかせる。' },
    { id: 'size', pattern: '細胞は目に見えるくらい大きいと思う。', hint_direction: '髪の毛の太さ（約70〜80µm）とくらべると、赤血球はその約10分の1、と大きさをくらべさせる。' },
    { id: 'where-blocked', pattern: 'どこを治せばよいか分からず、あちこちを浄化して進まない。', hint_direction: 'スキャンで出る光の柱（病巣）と、そこに書かれた原因を見るよう、問いかける。' },
    { id: 'real-treatment', pattern: 'ゲームの治し方（光線）が、本当の病院の治療だと思う。', hint_direction: '主人公と道具と治し方は作り事で、本当の治療はお医者さんが決めることを伝える。' },
  ],
  questions: [
    { id: 'retina-task', prompt: '区域A 網膜の内側の面：白く濁った網膜の血流を取り戻す。止まった赤血球の塊（閉塞点）が3か所ある。', answer: 'スキャンで閉塞点を見つけ、浄化の光を当て続けて塊をほぐす。ほぐすと血が流れ、まわりも治せる。', reason: '血が届かないと網膜は白く濁る。塊がほぐれると血流が戻る。', tags: ['where-blocked', 'destroy'] },
    { id: 'retina-plug', prompt: '閉塞点（止まった赤血球の塊）をほぐす。', answer: '塊に光を当て続ける（約3秒）。', reason: '塊がほぐれると、その先へ血が届く。', tags: ['where-blocked'] },
    { id: 'lens-task', prompt: '区域B 水晶体：固まったクリスタリン（透明なタンパク）の粒で白く濁り、瞳の光が奥へ届かない。濃い粒の塊が3か所ある。', answer: '塊をほどき、濁りを晴らして、光を層の奥まで通す。', reason: '水晶体が濁ると光が散って、ぼやけて見える（白内障）。', tags: ['where-blocked'] },
    { id: 'lens-plug', prompt: '固まったタンパクの塊（凝集の核）をほどく。', answer: '塊に光を当て続ける。', reason: '塊がほどけると光が奥へ通る。', tags: ['where-blocked'] },
    { id: 'photo-task', prompt: '区域C 視細胞の森：光を受ける桿体と錐体の外節が傷んで短くなっている。奥の黄斑の中心には、色素上皮の下の沈着物（ドルーゼン）が3つある。', answer: '視細胞を治しながら進み、ドルーゼンをほどく。ほどいている間に広がる弱らせる波から、まわりの視細胞を守る。', reason: '視細胞が光を受けられないと、見えにくくなる。中心窩に光が届くと、くっきり見える。', tags: ['where-blocked', 'scan-color'] },
    { id: 'photo-plug', prompt: 'ドルーゼン（色素上皮の下の沈着物）をほどく。', answer: 'ドルーゼンに光を当て続ける。', reason: 'ほどけると、中心窩の錐体に光が届く。', tags: ['where-blocked'] },
  ],
  extensions: [
    '暗い所で目が慣れてくると、だんだん見えるようになるのは、どの細胞のおかげかな？（桿体）',
    '色が分かるのは、どの細胞のはたらきかな？（錐体）',
    '赤血球は、自分より細い血管をどうやって通りぬけるのかな？',
    '水晶体はどうして透明でいられるのかな？',
    'おうちの人の目の写真（眼底写真）が、だいだい色に見えるのはなぜだろう？',
  ],
  conversation_notes: [
    'これは3Dのゲーム。問題の選択肢はない。いまの区域の「課題」を、答えを言わずにヒントで手伝う。',
    'ゲームの操作：歩く・泳ぐ（上へ／下へ）・スキャン（病巣が光の柱で出る）・浄化（光を当て続ける）。操作方法はたずねられたら答えてよい。',
    '主人公（潜行士）と光線と治し方は作り事。実在の病気の治療法としては話さない。目の病気の心配は、お医者さんに相談するよう伝える。',
    '細胞の数値や事実は key_terms に書かれた範囲で話す。ほかの数値は言わない。',
    '遊ぶのは子どもも大人もいる。やさしい言葉で、むずかしい言葉にはひと言の言いかえを添える。',
    '字幕と読み上げが流れている間は、それが終わるのを待ってから話す。',
  ],
  needs_check: [
    '要確認：ゲームなので「正解・不正解」はない。answered は「塊をほどいた」ときだけ correct:true で送る。',
    '要確認：VR 版（/vr/）には先生のボタンを出していない（ヘッドセットの中では画面のボタンが使えないため）。',
  ],
};
fs.writeFileSync(path.join(root, 'public/voice-buddy-context.json'), JSON.stringify(ctx, null, 1));
console.log('voice-buddy-context.json', ctx.key_terms.length, 'terms', ctx.questions.length, 'tasks');
