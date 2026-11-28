// 音の仕組み（Web Audio API）。素材ファイルは使わず、その場で合成する（容量 0）。
// 土の活力（0〜1）ひとつで、乾いた音（風と砂）→ 湿った音（しずく、ピアノの単音、澄んだ和音）へ移る。
// ブラウザの決まりで、音は最初のクリック（「クリックして開始」）のあとにしか鳴らせない。

type Mode = 'soil' | 'surface';
export interface AudioEngine {
  start(): void;
  setVitality(v: number): void;
  setMode(m: Mode): void;
  /** 地上の場面の成長（0〜1）。子葉が開く瞬間に和音を開く */
  setGrowth(g: number): void;
  chime(): void;
  /** 効果音：水をまく、水の橋がつながる、乾きの風、区画の目覚め */
  fx(kind: 'pour' | 'link' | 'wind' | 'awake'): void;
  /** つながっている水の橋（つながった順）。値は区域（0＝A 細菌、1＝B コルポダ、2＝C 種の岸）。1 本ごとに旋律の音が 1 つ増え、区域で楽器が変わる */
  setBridges(zones: number[]): void;
  /** 旋律の k 番目の音が、delay 秒後に鳴る（同じ瞬間に、その橋を光らせるため） */
  onNote: ((k: number, delay: number) => void) | null;
  /** 近くにいる生き物（0〜1）：細菌のさざめき、コルポダの繊毛の音、クマムシの足音 */
  setNear(bact: number, colp: number, tardi: number): void;
  /** 自分がつないだ順の旋律（区域の列）を、通して鳴らす。長さ（秒）を返す */
  playSong(zones: number[]): number;
  /** 目覚め：重なってきた単音が、1 つの和音にまとまる */
  awaken(): void;
  setMuted(m: boolean): void;
  /** タブが隠れたときに止め、戻ったら再開する（消音の設定とは別） */
  pause(p: boolean): void;
  muted: boolean;
  /** 確認用：いまの橋の本数と、目覚めの和音が鳴ったか */
  state(): { bridges: number; awoken: boolean; running: boolean };
  update(dt: number): void;
}

// ステージ1の主題：ピアノの単音。ペンタトニック（D の音階）で、どの音が重なっても濁らない
const SCALE = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25, 739.99, 880.0];
const CHORD = [146.83, 220.0, 293.66, 369.99, 440.0, 587.33]; // D の和音（開いた配置）

// 水の橋の旋律：橋が 1 本つながるごとに、この順で音が 1 つずつ加わる（最初は 1 音、8 本で 8 音のフレーズ）
const MOTIF = [0, 4, 2, 5, 3, 7, 4, 8, 6, 5, 7, 8].map((i) => SCALE[i]);

function noiseBuffer(ctx: AudioContext, sec: number, color: 'white' | 'brown' | 'pink') {
  const n = Math.floor(ctx.sampleRate * sec), buf = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch); let last = 0, b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      if (color === 'white') d[i] = w;
      else if (color === 'brown') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
      else { b0 = 0.997 * b0 + w * 0.029591; b1 = 0.985 * b1 + w * 0.032534; b2 = 0.95 * b2 + w * 0.048056; d[i] = (b0 + b1 + b2 + w * 0.05) * 0.9; }
    }
  }
  return buf;
}

/** 部屋の響き（土の中のこもった空間）：減衰する雑音から作るインパルス応答 */
function reverbBuffer(ctx: AudioContext, sec: number, damp: number) {
  const n = Math.floor(ctx.sampleRate * sec), buf = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) { const d = buf.getChannelData(ch); let lp = 0; for (let i = 0; i < n; i++) { lp += (Math.random() * 2 - 1 - lp) * damp; d[i] = lp * Math.pow(1 - i / n, 3); } }
  return buf;
}

/** iPhone・iPad の Safari では、Web Audio の音は消音モードのときに鳴らない。
 *  音声セッションの種類を「再生」にすると、消音モードでも鳴る（動画アプリと同じ扱い）。古い OS 向けに、無音の <audio> を流す方法も併用する。 */
let unlocked = false;
function unlockIOS() {
  if (unlocked) return; unlocked = true;
  try { const as = (navigator as unknown as { audioSession?: { type: string } }).audioSession; if (as) as.type = 'playback'; } catch { /* noop */ }
  try {
    // 0.1 秒の無音の WAV（その場で作る）を、くり返し再生する
    const sr = 8000, n = 800, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
    const w = (o: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
    const el = document.createElement('audio'); el.src = URL.createObjectURL(new Blob([buf], { type: 'audio/wav' })); el.loop = true; el.setAttribute('playsinline', ''); el.volume = 0.01;
    void el.play().catch(() => { /* 対応していない場合は何もしない */ });
  } catch { /* noop */ }
}

export function createAudio(): AudioEngine {
  let ctx: AudioContext | null = null;
  let master: GainNode, music: GainNode, sfx: GainNode, verb: ConvolverNode, verbIn: GainNode;
  let dryBed: GainNode, wetBed: GainNode, surfBed: GainNode, under: BiquadFilterNode, rainLp: BiquadFilterNode, windBp: BiquadFilterNode, leafBp: BiquadFilterNode;
  let vit = 0, mode: Mode = 'soil', growth = 0, chordDone = false, noteT = 1.5, bridges = 0, zones: number[] = [], motifT = 2, awoken = false, nb = 0, nc = 0, nt = 0, fizzT = 0, stepT = 0, stepL = false, cilia: GainNode | null = null, dripT = 0.8, grainT = 0.2, gust = 0;
  const api: AudioEngine = {
    muted: false,
    state: () => ({ bridges, awoken, running: !!ctx && ctx.state === 'running' }),
    start() {
      unlockIOS();
      if (ctx) { void ctx.resume(); return; }
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext; if (!AC) return;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = api.muted ? 0 : 1.0;
      // 小さな音量でも大事な音が聞こえるように、全体を軽く圧縮する
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -24; comp.ratio.value = 4; comp.attack.value = 0.01; comp.release.value = 0.3;
      master.connect(comp).connect(ctx.destination);
      verb = ctx.createConvolver(); verb.buffer = reverbBuffer(ctx, 3.2, 0.25); verbIn = ctx.createGain(); verbIn.gain.value = 0.5; verbIn.connect(verb).connect(master);
      music = ctx.createGain(); music.gain.value = 0.9; music.connect(master); music.connect(verbIn);
      sfx = ctx.createGain(); sfx.gain.value = 1.0; sfx.connect(master); sfx.connect(verbIn);
      // 土の中の音は、地面を通して聞こえるので高い音が削れる
      under = ctx.createBiquadFilter(); under.type = 'lowpass'; under.frequency.value = 2600; under.Q.value = 0.3; under.connect(master);
      const loop = (buf: AudioBuffer, gain: number, dest: AudioNode, rate = 1) => { const s = ctx!.createBufferSource(); s.buffer = buf; s.loop = true; s.playbackRate.value = rate; const g = ctx!.createGain(); g.gain.value = gain; s.connect(g).connect(dest); s.start(); return g; };
      const brown = noiseBuffer(ctx, 6, 'brown'), pink = noiseBuffer(ctx, 5, 'pink'), white = noiseBuffer(ctx, 4, 'white');
      // 乾いた土：頭上を渡るくぐもった風（低い帯域の雑音が、ゆっくり強弱する）
      dryBed = ctx.createGain(); dryBed.gain.value = 0; dryBed.connect(under);
      windBp = ctx.createBiquadFilter(); windBp.type = 'bandpass'; windBp.frequency.value = 700; windBp.Q.value = 0.5; windBp.connect(dryBed);
      loop(pink, 1.4, windBp);
      // 湿った土：頭上から響く、くぐもった雨のような水の気配
      wetBed = ctx.createGain(); wetBed.gain.value = 0; wetBed.connect(under);
      rainLp = ctx.createBiquadFilter(); rainLp.type = 'lowpass'; rainLp.frequency.value = 1800; rainLp.connect(wetBed);
      loop(pink, 0.5, rainLp);
      // 地上：風と、葉ずれ（高めの帯域の雑音）
      surfBed = ctx.createGain(); surfBed.gain.value = 0; surfBed.connect(master);
      const surfWind = ctx.createBiquadFilter(); surfWind.type = 'bandpass'; surfWind.frequency.value = 800; surfWind.Q.value = 0.4; surfWind.connect(surfBed); loop(pink, 0.9, surfWind, 1.0);
      // 開始の合図：鳴っていることがすぐ分かるように、静かな和音を1つ
      setTimeout(() => { if (ctx) [293.66, 440, 587.33].forEach((f, i) => piano(f, ctx!.currentTime + 0.05 + i * 0.12, 0.22, 5)); }, 300);
      // コルポダの繊毛：帯域をしぼった雑音を、毎秒 7 回ほど細かく揺らす
      { const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1700; bp.Q.value = 2.5; cilia = ctx.createGain(); cilia.gain.value = 0;
        const trem = ctx.createGain(); trem.gain.value = 0.6; const lfo = ctx.createOscillator(); lfo.frequency.value = 7; const lg = ctx.createGain(); lg.gain.value = 0.4; lfo.connect(lg).connect(trem.gain); lfo.start();
        loop(pink, 0.8, bp); bp.connect(trem).connect(cilia).connect(sfx); }
      leafBp = ctx.createBiquadFilter(); leafBp.type = 'bandpass'; leafBp.frequency.value = 3800; leafBp.Q.value = 0.8; leafBp.connect(surfBed); loop(white, 0.09, leafBp);
    },
    setVitality(v) { vit = Number.isFinite(v) ? v : 0; },
    setMode(m) { if (m !== mode) { mode = m; growth = 0; chordDone = false; } },
    setGrowth(g) { growth = g; },
    pause(p) { if (!ctx) return; if (p) void ctx.suspend(); else void ctx.resume(); },
    onNote: null,
    setBridges(zs) {
      const n = Math.min(MOTIF.length, zs.length);
      if (ctx && n > bridges) {   // 新しい音：まず加わった音を少し強く鳴らし、すぐ後に、増えたフレーズを通して聞かせる
        const t = ctx.currentTime; voice(zs[n - 1], MOTIF[n - 1], t + 0.05, 0.24, 5); api.onNote?.(n - 1, 0.05); motifT = 1.6;
      }
      bridges = n; zones = zs.slice(0, n);
    },
    setNear(b, c, d) { nb = fin(b); nc = fin(c); nt = fin(d); },
    playSong(zs) {
      if (!ctx || !zs.length) return 0; const t = ctx.currentTime + 0.1, step = 0.36;
      zs.forEach((z, k) => voice(z, MOTIF[k % MOTIF.length] * (k >= MOTIF.length ? 2 : 1), t + k * step, 0.2, 3.5));
      const end = t + zs.length * step + 0.3; CHORD.forEach((f, i) => piano(f, end + i * 0.05, 0.16, 7));
      return zs.length * step + 3;
    },
    awaken() {
      if (!ctx || awoken) return; awoken = true; const t = ctx.currentTime;
      // ここまでの単音を速く重ね、低い D の和音に解決する
      MOTIF.slice(0, Math.max(3, bridges)).forEach((f, i) => piano(f, t + i * 0.07, 0.12, 6));
      CHORD.forEach((f, i) => piano(f, t + 0.7 + i * 0.05, 0.2, 8));
      bell(1174.66, t + 0.9, 0.05, 4, sfx);
    },
    setMuted(m) { api.muted = m; if (ctx) master.gain.setTargetAtTime(m ? 0 : 1.0, ctx.currentTime, 0.1); },
    chime() {
      // 新しい生き物の紹介：短く上品な2音（鐘のような倍音）
      if (!ctx) return; const t = ctx.currentTime;
      [[880, 0], [1318.5, 0.16]].forEach(([f, dt]) => bell(f, t + dt, 0.12, 2.2, sfx));
    },
    fx(kind) {
      if (!ctx) return; const t = ctx.currentTime;
      if (kind === 'pour') { for (let k = 0; k < 4; k++) bell(1100 + Math.random() * 900, t + k * 0.06 + Math.random() * 0.03, 0.05, 0.35, sfx); }          // ぽたぽたと落ちる水
      else if (kind === 'link') { [[587.33, 0], [739.99, 0.1], [880, 0.2], [1174.66, 0.32]].forEach(([f, d]) => bell(f, t + d, 0.09, 1.8, sfx)); }           // 上っていく 4 音：つながった
      else if (kind === 'awake') { [[440, 0], [659.25, 0.18]].forEach(([f, d]) => bell(f, t + d, 0.08, 2.6, sfx)); }
      else { const src = ctx.createBufferSource(); src.buffer = noiseBuffer(ctx, 3, 'pink'); const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.setValueAtTime(500, t); bp.frequency.linearRampToValueAtTime(1500, t + 1.4); bp.frequency.linearRampToValueAtTime(600, t + 3); bp.Q.value = 0.8;
        const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.5, t + 1.2); g.gain.linearRampToValueAtTime(0.0001, t + 3); src.connect(bp); bp.connect(g); g.connect(sfx); src.start(t); src.stop(t + 3.1); }   // 吹きこむ風
    },
    update(dt) {
      if (!ctx || ctx.state !== 'running') return;
      if (!Number.isFinite(dt) || dt < 0) dt = 0; if (!Number.isFinite(vit)) vit = 0; if (!Number.isFinite(gust)) gust = 0;   // VR の描画ループは、時刻が渡らないコマがある
      const t = ctx.currentTime, soil = mode === 'soil' ? 1 : 0;
      gust += dt * 0.13;
      const gustAmt = 0.55 + 0.45 * Math.sin(gust) * Math.sin(gust * 0.37 + 1);
      dryBed.gain.setTargetAtTime(soil * (1 - vit) * 0.5 * gustAmt + 0.0001, t, 0.4);
      windBp.frequency.setTargetAtTime(500 + 600 * gustAmt, t, 0.6);
      wetBed.gain.setTargetAtTime(soil * vit * 0.32 + 0.0001, t, 0.6);
      surfBed.gain.setTargetAtTime((1 - soil) * (0.22 + 0.2 * gustAmt) + 0.0001, t, 0.8);
      leafBp.frequency.setTargetAtTime(3200 + 1600 * gustAmt, t, 0.5);
      if (soil) {
        // 乾いた土：ときどき砂粒がこすれる、細かい音
        grainT -= dt; if (grainT <= 0) { grainT = 0.05 + Math.random() * 0.4 / (0.2 + (1 - vit)); if (Math.random() < 1 - vit) grain(t); }
        // 湿った土：水のしずく。活力が上がるほど増える
        dripT -= dt; if (dripT <= 0) { dripT = 0.6 + Math.random() * 3.5 * (1.2 - vit); if (vit > 0.08) drip(t, vit); }
        // ピアノの単音：活力が上がるほど、音の数と高さが増える
        // 水の橋の旋律：つながった本数だけの音を、間をあけてくり返す（1 本なら 1 音、増えるほどフレーズになる）
        if (bridges > 0) { motifT -= dt; if (motifT <= 0) { const step = 0.42; motifT = bridges * step + 3.2;
          for (let k = 0; k < bridges; k++) { voice(zones[k] ?? 0, MOTIF[k], t + k * step, 0.11 + vit * 0.06, 3.5); api.onNote?.(k, k * step); } } }
        // 近くの生き物の音
        fizzT -= dt; if (nb > 0.05 && fizzT <= 0) { fizzT = 0.03 + Math.random() * 0.25 / nb; fizz(t, nb); }   // 細菌：細かいさざめき（数が多いほど密に）
        cilia?.gain.setTargetAtTime(nc * 0.16 + 0.0001, t, 0.3);                                                // コルポダ：体じゅうの繊毛が水をかく、やわらかい音
        stepT -= dt; if (nt > 0.05 && stepT <= 0) { stepT = 0.55 + Math.random() * 0.25; stepL = !stepL; footstep(t, nt, stepL); }   // クマムシ：ゆっくりした足音
        // ピアノの単音：活力が上がるほど、音の数と高さが増える（旋律が鳴っている間は控えめに）
        noteT -= dt; if (noteT <= 0) { noteT = 2.6 + Math.random() * 3.2 - vit * 1.6 + bridges * 0.5; if (vit > 0.15) { const top = Math.min(SCALE.length - 1, 2 + Math.floor(vit * (SCALE.length - 2))); piano(SCALE[Math.floor(Math.random() * (top + 1))], t, 0.16 + vit * 0.1); } }
      } else {
        // 地上：子葉が開く瞬間に、和音が大きく開く
        if (!chordDone && growth > 0.64) { chordDone = true; CHORD.forEach((f, i) => piano(f, t + i * 0.09, 0.2, 7)); }
        noteT -= dt; if (noteT <= 0) { noteT = 3 + Math.random() * 3; if (growth > 0.3) piano(SCALE[Math.floor(Math.random() * SCALE.length)] * 2, t, 0.08); }
      }
    },
  };

  const fin = (v: number) => (Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0);
  /** 区域ごとの楽器：A＝ピアノ、B＝木琴に近い音（倍音が 4 倍・10 倍で、すぐ消える）、C＝鐘の響き */
  function voice(z: number, f: number, t: number, vol: number, len: number) {
    if (z === 1) marimba(f, t, vol * 1.2); else if (z === 2) { bell(f, t, vol * 0.55, len * 1.3, music); piano(f / 2, t, vol * 0.35, len); } else piano(f, t, vol, len);
  }
  function marimba(f: number, t: number, vol: number) {
    const g = ctx!.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
    const pan = ctx!.createStereoPanner(); pan.pan.value = (Math.random() - 0.5) * 0.6; g.connect(pan).connect(music);
    [[1, 1, 1.1], [3.99, 0.3, 0.25], [10.1, 0.08, 0.08]].forEach(([h, a, d]) => { const o = ctx!.createOscillator(); o.frequency.value = f * h; const og = ctx!.createGain(); og.gain.setValueAtTime(a, t); og.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(og).connect(g); o.start(t); o.stop(t + 1.2); });
  }
  /** 細菌のさざめき：ごく短く高い、かすかなはじけ */
  function fizz(t: number, k: number) {
    const o = ctx!.createOscillator(), g = ctx!.createGain(), pan = ctx!.createStereoPanner(); const f = 3500 + Math.random() * 4000;
    o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 0.7, t + 0.02);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.012 + 0.02 * k, t + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    pan.pan.value = (Math.random() - 0.5) * 1.8; o.connect(g).connect(pan).connect(sfx); o.start(t); o.stop(t + 0.05);
  }
  /** クマムシの足音：やわらかく低い、短い音を左右交互に */
  function footstep(t: number, k: number, left: boolean) {
    const o = ctx!.createOscillator(), g = ctx!.createGain(), pan = ctx!.createStereoPanner();
    o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(55, t + 0.12);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.18 * k, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    pan.pan.value = left ? -0.35 : 0.35; o.connect(g).connect(pan).connect(sfx); o.start(t); o.stop(t + 0.2);
  }
  /** ピアノに似た音：倍音を重ね、速く立ち上がってゆっくり減衰する */
  function piano(f: number, t: number, vol: number, len = 4) {
    const g = ctx!.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(vol * 0.35, t + 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    const lp = ctx!.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(f * 6, t); lp.frequency.exponentialRampToValueAtTime(f * 1.5, t + len * 0.7);
    const pan = ctx!.createStereoPanner(); pan.pan.value = (Math.random() - 0.5) * 0.6;
    g.connect(lp).connect(pan).connect(music);
    [[1, 1], [2, 0.42], [3, 0.18], [4.02, 0.08], [5.03, 0.04]].forEach(([h, a]) => { const o = ctx!.createOscillator(); o.type = 'sine'; o.frequency.value = f * h * (1 + (Math.random() - 0.5) * 0.002); const og = ctx!.createGain(); og.gain.value = a; o.connect(og).connect(g); o.start(t); o.stop(t + len + 0.1); });
  }
  function bell(f: number, t: number, vol: number, len: number, dest: AudioNode) {
    const g = ctx!.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + len); g.connect(dest);
    [[1, 1], [2.76, 0.35], [5.4, 0.12]].forEach(([h, a]) => { const o = ctx!.createOscillator(); o.frequency.value = f * h; const og = ctx!.createGain(); og.gain.value = a; o.connect(og).connect(g); o.start(t); o.stop(t + len); });
  }
  /** 水のしずく：短く、音程が上へ滑る正弦波（空気の泡が水面で振動する音） */
  function drip(t: number, v: number) {
    const f0 = 600 + Math.random() * 900, o = ctx!.createOscillator(), g = ctx!.createGain(), pan = ctx!.createStereoPanner();
    o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * (1.6 + Math.random()), t + 0.06);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.09 + 0.06 * v, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12 + Math.random() * 0.08);
    pan.pan.value = (Math.random() - 0.5) * 1.6; o.connect(g).connect(pan).connect(sfx); o.start(t); o.stop(t + 0.25);
  }
  /** 砂粒のこすれ：ごく短い、高い帯域の雑音のはじけ */
  function grain(t: number) {
    const n = Math.floor(ctx!.sampleRate * 0.03), b = ctx!.createBuffer(1, n, ctx!.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 6);
    const s = ctx!.createBufferSource(); s.buffer = b; const bp = ctx!.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2500 + Math.random() * 3500; bp.Q.value = 2;
    const g = ctx!.createGain(); g.gain.value = 0.05 + Math.random() * 0.05; const pan = ctx!.createStereoPanner(); pan.pan.value = (Math.random() - 0.5) * 1.8;
    s.connect(bp).connect(g).connect(pan).connect(under); s.start(t);
  }
  return api;
}
