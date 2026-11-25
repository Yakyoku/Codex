// ナレーションを AI の声で前もって録る（持ち主の音声会話の仕組み voice-buddy の、短命の鍵を発行する窓口を使う）。
//   node scripts/record-voices.mjs [声 …]（省略時 marin shimmer coral sage）
// 流れ：ゲームを ?narration で開いて台本（すべての言葉）を取り出す → 声ごとに鍵をもらい、OpenAI のリアルタイム音声に「一字一句そのまま読み上げて」と頼む
//   → 音（24kHz）を受け取り、書き起こしが台本と合っているか確かめて（合わなければ録り直し）、AAC にして public/static/voice/<声>/<識別子>.m4a に置く。
// 既にある音は録り直さない。最後に、4つの声すべてそろった言葉の一覧を manifest.json に書く。
import { launch, ORIGIN, waitReady } from './lib-browser.mjs';
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
const VOICES = process.argv.slice(2).length ? process.argv.slice(2) : ['marin', 'shimmer', 'coral', 'sage'];
const OUT = path.resolve(import.meta.dirname, '../public/static/voice'); fs.mkdirSync(OUT, { recursive: true });
const SITE = 'https://inner-restore-web-20261122.netlify.app';
const token = (voice) => JSON.parse(execFileSync('curl', ['-s', '-X', 'POST', 'https://voice-buddy-yk.netlify.app/api/realtime-token', '-H', 'content-type: application/json', '-H', `Origin: ${SITE}`, '--data', JSON.stringify({ voice, speed: 'normal', mode: 'ptt' })]).toString());
const norm = (s) => s.replace(/[\s、。・「」（）！？…ー―〜,.!?()"'：:；;]/g, '');
const sim = (a, b) => { a = norm(a); b = norm(b); const m = a.length, n = b.length; if (!m || !n) return 0; let prev = Array(n + 1).fill(0).map((_, j) => j);
  for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; } return 1 - prev[n] / Math.max(m, n); };
const { browser, page, logs } = await launch({ width: 400, height: 300 });
await page.goto(ORIGIN + '/?zone=retina&noentry&post=off&narration'); await waitReady(page, '__irReady', 300000);
await page.waitForFunction(() => !!window.__narration, null, { timeout: 120000 });
const lines = await page.evaluate(() => window.__narration);
console.log('台本', lines.length, '行');
const INSTR = 'あなたはナレーター専用です。ユーザーから渡された日本語の文章を、一字一句変えず、省かず、付け足さず、そのまま読み上げてください。前置き・返事・説明は一切しないでください。落ち着いた、やさしく、はっきりした声で、自然な速さで読みます。漢字は文脈に合う読みで読みます。µm は「マイクロメートル」、nm は「ナノメートル」と読みます。';
async function connect(voice) {
  const t = token(voice); if (!t.value) throw new Error('鍵をもらえませんでした: ' + JSON.stringify(t));
  console.log(voice, 'model', t.model, '残り', t.remaining);
  await page.evaluate(async ({ key, model, instr }) => {
    const ws = new WebSocket(`wss://api.openai.com/v1/realtime?model=${model}`, ['realtime', 'openai-insecure-api-key.' + key]);
    window.__rt = { ws, handlers: [] };
    ws.onmessage = (e) => { const ev = JSON.parse(e.data); for (const h of window.__rt.handlers) h(ev); };
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('ws error')); setTimeout(() => rej(new Error('ws timeout')), 20000); });
    ws.send(JSON.stringify({ type: 'session.update', session: { type: 'realtime', instructions: instr, output_modalities: ['audio'], audio: { input: { turn_detection: null } } } }));
    await new Promise((r) => setTimeout(r, 800));
  }, { key: t.value, model: t.model, instr: INSTR });
}
async function say(text, strict) {
  return page.evaluate(({ text, instr }) => new Promise((resolve) => {
    const rt = window.__rt; const chunks = []; let tr = ''; let done = false;
    const h = (ev) => {
      if (ev.type === 'response.output_audio.delta' || ev.type === 'response.audio.delta') chunks.push(ev.delta);
      else if (ev.type === 'response.output_audio_transcript.done' || ev.type === 'response.audio_transcript.done') tr = ev.transcript;
      else if (ev.type === 'response.done') { done = true; rt.handlers = rt.handlers.filter((x) => x !== h); resolve({ chunks, tr, status: ev.response?.status, err: ev.response?.status_details }); }
      else if (ev.type === 'error') { rt.handlers = rt.handlers.filter((x) => x !== h); resolve({ chunks: [], tr: '', status: 'error', err: ev.error }); }
    };
    rt.handlers.push(h);
    rt.ws.send(JSON.stringify({ type: 'response.create', response: { conversation: 'none', output_modalities: ['audio'], instructions: instr, input: [{ type: 'message', role: 'user', content: [{ type: 'input_text', text: `次の文章を、そのまま読み上げてください。\n「${text}」` }] }] } }));
    setTimeout(() => { if (!done) resolve({ chunks, tr, status: 'timeout' }); }, 90000);
  }), { text, instr: strict ? INSTR + ' 前回、文章と違う読み方をしました。今回は文章の文字どおりに読んでください。' : INSTR });
}
const bad = [];
for (const voice of VOICES) {
  const dir = path.join(OUT, voice); fs.mkdirSync(dir, { recursive: true });
  const todo = lines.filter((l) => !fs.existsSync(path.join(dir, l.key + '.m4a')));
  if (!todo.length) { console.log(voice, 'すべて録音済み'); continue; }
  await connect(voice); let started = Date.now();
  for (const l of todo) {
    if (Date.now() - started > 480000) { await page.evaluate(() => window.__rt.ws.close()); await connect(voice); started = Date.now(); }   // 1回の会話は10分まで
    let r, s = 0;
    for (let tries = 0; tries < 3; tries++) {
      r = await say(l.text, tries > 0);
      if (r.status === 'error' || r.status === 'timeout') { console.log('  失敗', r.status, JSON.stringify(r.err)?.slice(0, 200)); await page.evaluate(() => window.__rt.ws.close()).catch(() => {}); await connect(voice); started = Date.now(); continue; }
      s = sim(r.tr, l.text); if (s >= 0.9) break;
      console.log(`  ずれ ${s.toFixed(2)}：${r.tr.slice(0, 40)}…`);
    }
    if (!r.chunks.length) { bad.push({ voice, key: l.key, text: l.text, why: 'no audio' }); continue; }
    if (s < 0.9) bad.push({ voice, key: l.key, text: l.text, said: r.tr, sim: s });
    const pcm = Buffer.concat(r.chunks.map((c) => Buffer.from(c, 'base64')));
    const raw = path.join(dir, l.key + '.pcm'); fs.writeFileSync(raw, pcm);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 's16le', '-ar', '24000', '-ac', '1', '-i', raw, '-af', 'silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse', '-c:a', 'aac', '-b:a', '28k', path.join(dir, l.key + '.m4a')]);
    fs.rmSync(raw);
    console.log(voice, l.key, (pcm.length / 48000).toFixed(1) + '秒', s.toFixed(2));
  }
  await page.evaluate(() => window.__rt?.ws.close()).catch(() => {});
}
const keys = lines.filter((l) => VOICES.concat(['marin', 'shimmer', 'coral', 'sage']).every((v) => fs.existsSync(path.join(OUT, v, l.key + '.m4a')))).map((l) => l.key);
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify({ voices: ['marin', 'shimmer', 'coral', 'sage'], keys }, null, 0));
fs.writeFileSync(path.join(OUT, 'review.json'), JSON.stringify(bad, null, 1));
console.log('完了：そろった言葉', keys.length, '/', lines.length, '　要確認', bad.length, 'console', [...new Set(logs.errors)].slice(0, 3));
await browser.close();
