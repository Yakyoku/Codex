// ビルド結果の容量の内訳を記録する（gzip 後）。Docs/size-history.jsonl に1行ずつ追記する。
import { readdirSync, statSync, readFileSync, appendFileSync, writeFileSync } from 'node:fs';
import { gzipSync, brotliCompressSync } from 'node:zlib';
import { join, extname, relative } from 'node:path';
import { execSync } from 'node:child_process';
const DIST = new URL('../dist/', import.meta.url).pathname;
const KIND = { '.js': 'プログラム', '.css': 'プログラム', '.html': 'プログラム', '.wasm': 'プログラム', '.json': 'データ',
  '.glb': 'メッシュ', '.bin': 'メッシュ', '.webp': 'テクスチャ', '.png': 'テクスチャ', '.jpg': 'テクスチャ', '.ktx2': 'テクスチャ', '.hdr': 'テクスチャ',
  '.ogg': '音', '.mp3': '音', '.m4a': '音', '.wav': '音', '.woff2': 'フォント', '.mp4': '動画', '.webm': '動画' };
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const COMPRESSIBLE = new Set(['.js', '.css', '.html', '.json', '.wasm', '.glb', '.bin', '.svg']);
const rows = walk(DIST).map((p) => {
  const buf = readFileSync(p); const ext = extname(p);
  const wire = COMPRESSIBLE.has(ext) ? brotliCompressSync(buf).length : buf.length;
  return { path: relative(DIST, p), raw: buf.length, wire, kind: KIND[ext] ?? 'その他', progress: relative(DIST, p).startsWith('progress/') };
});
const game = rows.filter((r) => !r.progress);
const byKind = {};
for (const r of game) byKind[r.kind] = (byKind[r.kind] ?? 0) + r.wire;
const total = game.reduce((a, r) => a + r.wire, 0);
const kb = (n) => (n / 1024).toFixed(1) + ' KB';
console.log('== 容量の内訳（配信時の圧縮後の見積もり。進捗ページの画像と動画は除く）');
for (const [k, v] of Object.entries(byKind).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(8)} ${kb(v)}`);
console.log(`  合計     ${kb(total)}  （進捗ページ用 ${kb(rows.filter((r) => r.progress).reduce((a, r) => a + r.wire, 0))}）`);
console.log('== 大きい順'); for (const r of [...game].sort((a, b) => b.wire - a.wire).slice(0, 8)) console.log(`  ${kb(r.wire).padStart(10)}  ${r.path}`);
let commit = '?'; try { commit = execSync('git rev-parse --short HEAD').toString().trim(); } catch {}
appendFileSync(new URL('../Docs/size-history.jsonl', import.meta.url), JSON.stringify({ at: new Date().toISOString(), commit, total, byKind }) + '\n');
writeFileSync(join(DIST, 'size.json'), JSON.stringify({ total, byKind, files: game.map(({ path, raw, wire, kind }) => ({ path, raw, wire, kind })) }));
