// Netlify への公開（dist/ をそのまま上げる。Netlify 側ではビルドしない）
//   node scripts/deploy.mjs draft   … 下書き用の URL（https://draft--<サイト名>.netlify.app）に公開。本番は変わらない
//   node scripts/deploy.mjs prod    … 本番に公開
// 認証は次のどちらか（どちらもリポジトリには入れない）：
//   NETLIFY_PROXY（または build-cache/proxy.txt）… Claude の Netlify 連携の deploy-site が返す一時的な proxy の URL
//   NETLIFY_AUTH_TOKEN … Netlify の個人用トークン
import { readFileSync, writeFileSync, existsSync, rmSync, mkdirSync, cpSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
const mode = process.argv[2];
if (mode !== 'draft' && mode !== 'prod') { console.error('使い方: node scripts/deploy.mjs draft|prod'); process.exit(2); }
const root = new URL('..', import.meta.url).pathname;
const site = JSON.parse(readFileSync(join(root, 'netlify-site.json'), 'utf8'));
const proxyFile = join(root, 'build-cache/proxy.txt');
const proxy = (process.env.NETLIFY_PROXY ?? (existsSync(proxyFile) ? readFileSync(proxyFile, 'utf8') : '')).trim().replace(/\/$/, '');
const token = process.env.NETLIFY_AUTH_TOKEN;
if (!proxy && !token) { console.error('NETLIFY_PROXY（Netlify 連携の deploy-site で取得）か NETLIFY_AUTH_TOKEN が必要です'); process.exit(2); }
const base = proxy ? proxy + '/api/v1' : 'https://api.netlify.com/api/v1';
const headers = { 'user-agent': 'netlify-mcp', ...(proxy ? {} : { authorization: 'Bearer ' + token }) };

// dist/ の写しに「ビルドしない」設定を添えて zip にする
const stage = join(root, 'build-cache/deploy'), zip = join(root, 'build-cache/deploy.zip');
rmSync(stage, { recursive: true, force: true }); rmSync(zip, { force: true }); mkdirSync(stage, { recursive: true });
cpSync(join(root, 'dist'), stage, { recursive: true });
writeFileSync(join(stage, 'netlify.toml'), '[build]\n  publish = "."\n  command = ""\n');
execFileSync('python3', ['-c', 'import shutil,sys; shutil.make_archive(sys.argv[2][:-4], "zip", sys.argv[1])', stage, zip]);
const buf = readFileSync(zip);
console.log(`zip ${(buf.length / 1048576).toFixed(2)} MB → ${site.name}（${mode === 'prod' ? '本番' : '下書き'}）`);

const form = new FormData();
form.append('zip', new Blob([buf], { type: 'application/zip' }), 'deploy.zip');
const q = mode === 'prod' ? '' : '?branch=draft';
let res;
for (let i = 0; i < 4; i++) {
  try { res = await fetch(`${base}/sites/${site.siteId}/builds${q}`, { method: 'POST', headers, body: form }); if (res.ok || res.status < 500) break; } catch (e) { if (i === 3) throw e; }
  await new Promise((r) => setTimeout(r, 2000 * 2 ** i));
}
if (!res.ok) { console.error(`公開に失敗: ${res.status} ${(await res.text()).slice(0, 300)}\n（403 の場合は proxy の期限切れ。deploy-site で取り直す）`); process.exit(1); }
const { deploy_id: id } = await res.json();
let d = {};
for (let n = 0; n < 120; n++) {
  d = await (await fetch(`${base}/deploys/${id}`, { headers })).json().catch(() => ({}));
  if (d.state === 'ready') break;
  if (d.state === 'error') { console.error('deploy error: ' + d.error_message); process.exit(1); }
  await new Promise((r) => setTimeout(r, 3000));
}
if (d.state !== 'ready') { console.error('時間切れ: state=' + d.state); process.exit(1); }
console.log(`DEPLOYED ${mode} id=${id} permalink=https://${id}--${site.name}.netlify.app`);
console.log(mode === 'prod' ? site.url : `https://draft--${site.name}.netlify.app`);
