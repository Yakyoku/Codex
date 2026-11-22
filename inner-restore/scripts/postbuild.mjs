// ビルド後の仕上げ：配信設定、進捗ページ、容量の内訳の記録
import fs from 'node:fs'; import path from 'node:path'; import zlib from 'node:zlib';
const root = path.resolve(import.meta.dirname, '..'); const dist = path.join(root, 'dist');
// Netlify の配信設定（_headers）。圧縮は Netlify が自動で行う（brotli/gzip）。
fs.writeFileSync(path.join(dist, '_headers'), `/assets/*
  Cache-Control: public, max-age=31536000, immutable
/static/*
  Cache-Control: public, max-age=0, must-revalidate
/*.html
  Cache-Control: no-cache
/
  Cache-Control: no-cache
/vr/
  Cache-Control: no-cache
/diag/
  Cache-Control: no-cache
/progress/*
  Cache-Control: no-cache
/*
  X-Content-Type-Options: nosniff
  Cross-Origin-Opener-Policy: same-origin
`);
// ビルドなしで公開するための netlify.toml（公開物の中に置く）
fs.writeFileSync(path.join(dist, 'netlify.toml'), `[build]\n  publish = "."\n  command = ""\n`);
if (fs.existsSync(path.join(root, 'progress'))) fs.cpSync(path.join(root, 'progress'), path.join(dist, 'progress'), { recursive: true });
// 容量の内訳
const kinds = { program: /\.(js|css|html)$/, texture: /\.(webp|png|jpg|jpeg|ktx2)$/, mesh: /\.(glb|bin)$/, audio: /\.(m4a|mp3|ogg|opus|wav)$/, font: /\.(woff2?|ttf|otf)$/, video: /\.(mp4|webm)$/ };
const sum = {}; const files = [];
const walk = (d) => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) walk(p); else files.push(p); } };
walk(dist);
for (const f of files) {
  const rel = path.relative(dist, f); if (rel.startsWith('progress')) continue;
  const buf = fs.readFileSync(f);
  const comp = /\.(js|css|html|glb|json|svg|txt)$/.test(f) ? zlib.brotliCompressSync(buf, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }).length : buf.length;
  const k = Object.keys(kinds).find((k) => kinds[k].test(f)) ?? 'other';
  sum[k] = sum[k] || { raw: 0, comp: 0, n: 0 }; sum[k].raw += buf.length; sum[k].comp += comp; sum[k].n++;
}
const total = Object.values(sum).reduce((a, b) => ({ raw: a.raw + b.raw, comp: a.comp + b.comp }), { raw: 0, comp: 0 });
const rec = { at: new Date().toISOString(), total, sum };
fs.mkdirSync(path.join(root, 'Docs', 'build-sizes'), { recursive: true });
fs.appendFileSync(path.join(root, 'Docs', 'build-sizes', 'history.jsonl'), JSON.stringify(rec) + '\n');
console.log('容量（圧縮後の目安 / 元）:');
for (const [k, v] of Object.entries(sum)) console.log(`  ${k.padEnd(8)} ${(v.comp / 1024).toFixed(0).padStart(7)} KB / ${(v.raw / 1024).toFixed(0).padStart(7)} KB  (${v.n} files)`);
console.log(`  合計     ${(total.comp / 1024).toFixed(0).padStart(7)} KB / ${(total.raw / 1024).toFixed(0).padStart(7)} KB`);
