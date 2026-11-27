// 台帳 Docs/ATLAS.md を、ゲームが使うデータ（src/data/atlas.json）から作る。台帳とゲームの中身を一致させるため、手で書き分けない。
import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const d = JSON.parse(fs.readFileSync(path.join(root, 'src/data/atlas.json'), 'utf8'));
const alias = { endothelial: 'endothelial_cell', muller: 'muller_cell', myelin: 'myelin_axon', oligodendrocyte: 'myelin_axon', collagen_scar: 'cardiac_fibroblast', thrombus: 'fibrin' };
const stageDoc = { 目: 'eye.md', 鼻: 'nose.md', 肺: 'lung.md', 腸: 'gut.md', 血管: 'vessel.md', 心臓: 'heart.md', 脳: 'brain.md' };
// 出所：形の仕様書（atlas/<id>.md）があればそれ、なければ、その器官の調査資料
const src = (e) => { const f = `Docs/REFERENCE/atlas/${alias[e.id] ?? e.id}.md`; if (fs.existsSync(path.join(root, f))) return `\`${f}\` の出所一覧`; const st = Object.keys(stageDoc).find((k) => String(e.stage).includes(k)); return st && fs.existsSync(path.join(root, 'Docs/REFERENCE', stageDoc[st])) ? `\`Docs/REFERENCE/${stageDoc[st]}\` の出所一覧` : '`Docs/REFERENCE/` の調査資料'; };
let md = `# 体内図鑑の台帳（ATLAS）\n\nこのファイルは \`node scripts/build-atlas-doc.mjs\` が \`src/data/atlas.json\` から作る。**台帳にないものはゲームに登場させない。**\n` +
  `姿の根拠は \`Docs/REFERENCE/atlas/\` の「形の仕様書」（出所の URL つき）。写真を見て確かめたかどうかは、各仕様書の「確認の方法と未確認の点」に書いてある。\n\n` +
  `| 名前 | 英語名 | 種類 | 実際の大きさ | 登場 |\n|---|---|---|---|---|\n` + d.entries.map((e) => `| ${e.ja} | ${e.en} | ${e.kind} | ${e.size} | ${e.stage} |`).join('\n') + '\n';
for (const e of d.entries) {
  md += `\n## ${e.ja}（${e.en}）\n- 種類：${e.kind}\n- 実際の大きさ：${e.size}（身近なものとの比較：${e.compare}）\n- 姿と色の特徴：${e.look}\n- 動き方：${e.move}\n- 体の中での働き：${e.role}\n- ほかとの関係：${e.relation}\n- 登場ステージ：${e.stage}\n- 初登場時の説明文：「${e.intro}」\n- 参考にした資料の出所：${src(e)}\n`;
}
fs.writeFileSync(path.join(root, 'Docs/ATLAS.md'), md); console.log('ATLAS.md', d.entries.length);
