// 台帳 Docs/ATLAS.md を、ゲームが使うデータ（src/data/atlas.json）から作る。台帳とゲームの中身を一致させるため、手で書き分けない。
import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const d = JSON.parse(fs.readFileSync(path.join(root, 'src/data/atlas.json'), 'utf8'));
const spec = { rbc: 'rbc.md', endothelial: 'endothelial_cell.md', pericyte: 'pericyte.md', muller: 'muller_cell.md', vitreous: 'vitreous.md' };
let md = `# 体内図鑑の台帳（ATLAS）\n\nこのファイルは \`node scripts/build-atlas-doc.mjs\` が \`src/data/atlas.json\` から作る。**台帳にないものはゲームに登場させない。**\n` +
  `姿の根拠は \`Docs/REFERENCE/atlas/\` の「形の仕様書」（出所の URL つき）。写真を見て確かめたかどうかは、各仕様書の「確認の方法と未確認の点」に書いてある。\n\n` +
  `| 名前 | 英語名 | 種類 | 実際の大きさ | 登場 |\n|---|---|---|---|---|\n` + d.entries.map((e) => `| ${e.ja} | ${e.en} | ${e.kind} | ${e.size} | ${e.stage} |`).join('\n') + '\n';
for (const e of d.entries) {
  md += `\n## ${e.ja}（${e.en}）\n- 種類：${e.kind}\n- 実際の大きさ：${e.size}（身近なものとの比較：${e.compare}）\n- 姿と色の特徴：${e.look}\n- 動き方：${e.move}\n- 体の中での働き：${e.role}\n- ほかとの関係：${e.relation}\n- 登場ステージ：${e.stage}（区域A：網膜の内側の面）\n- 初登場時の説明文：「${e.intro}」\n- 参考にした資料の出所：\`Docs/REFERENCE/atlas/${spec[e.id]}\` の出所一覧\n`;
}
md += `\n## まだ登場していないが、形の仕様書があるもの（ステージ1の後半で使う）\n桿体（rod.md）、錐体（cone.md）、網膜色素上皮（rpe.md）、水晶体線維細胞（lens_fiber.md）、血小板（platelet.md）、ミトコンドリア（mitochondrion.md）、網膜毛細血管（retinal_capillary.md）\n`;
fs.writeFileSync(path.join(root, 'Docs/ATLAS.md'), md); console.log('ATLAS.md', d.entries.length);
