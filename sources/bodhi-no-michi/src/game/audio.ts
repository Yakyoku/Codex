// 音のすべて。素材ファイルなし。Web Audio API だけで合成する。
// 方針：安い電子音にしない（長い残響・非整数倍音・ゆらぎ・やわらかい立ち上がり・間）。
import type { AudioEngine, ChapterMusic, SfxName, SfxOpts, Surface, Vec3 } from './contracts';

export type BeatInfo = { bpm: number; phase: number };
export type GameAudio = AudioEngine & { getBeat(): BeatInfo };

interface Dest { dry: AudioNode; wet: AudioNode }
interface StripOpts { end?: number; bag?: AudioNode[]; pan?: number; pos?: Vec3 }
interface BurstOpts {
  f: number; f1?: number; f2?: number; q?: number; type?: BiquadFilterType;
  peak: number; attack: number; decay: number; buf?: AudioBuffer;
}
interface Bar { t: number; dur: number; bpm: number }
interface Scene {
  id: 'title' | 'prologue';
  mus: Dest; amb: Dest;
  fades: GainNode[]; nodes: AudioNode[]; srcs: AudioScheduledSourceNode[]; cost: number;
  droneLevel: GainNode; ambLevel: GainNode;
  pulse: GainNode | null; koto1: GainNode | null; koto2: GainNode | null;
  fifth: GainNode | null; dis: GainNode | null;
  wind: { f: BiquadFilterNode; g: GainNode }[];
  nextWind: number; nextBell: number; nextRin: number; nextShaku: number;
  nextBird: number; nextCreak: number; nextBar: number; bar: number; bars: Bar[];
}

// 同時発音の上限（iPhone 向け）。音楽は効果音のために余裕を残す
const MAX_COST = 88;
const MUSIC_COST = 60;
const LOOKAHEAD = 0.5;

const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// 都節（陰旋法）D: D Eb G A Bb
const SHAKU_SCALE = [62, 63, 67, 69, 70, 74, 75, 79];
const SHAKU_REST = [0, 3, 5]; // 落ち着く音（D4, A4, D5）
// 箏のオスティナート（4小節 × 8分音符4つ。0 は休み）
const KOTO1 = [50, 57, 62, 57, 63, 57, 62, 0, 50, 57, 62, 57, 58, 57, 55, 0];
const KOTO2 = [0, 69, 0, 74, 0, 70, 0, 69, 0, 67, 0, 74, 0, 75, 74, 0];
const BPM = [54, 54, 60, 66];
// 梵鐘の部分音（非整数倍）
const BELL_R = [0.5, 1, 1.19, 1.56, 2.0, 2.51, 2.66, 3.01, 4.1];
const BELL_A = [0.55, 1, 0.5, 0.4, 0.45, 0.25, 0.22, 0.18, 0.1];
const BELL_D = [14, 12, 10.5, 9.5, 8.5, 7.5, 7, 6.5, 6];
// 効果音ごとの [長さ(秒), 残響の量]
const SFX_INFO: Record<SfxName, [number, number]> = {
  swingLight: [0.5, 0.18], swingHeavy: [0.8, 0.2], hit: [1.8, 0.4], guard: [0.6, 0.25],
  perfectGuard: [3.4, 0.6], hurt: [0.6, 0.15], dodge: [0.4, 0.12], breathIn: [2.2, 0.25],
  breathOut: [2.2, 0.25], bell: [18, 0.6], inka: [30, 0.75], step: [0.5, 0.14],
  uiSelect: [1.4, 0.3], uiOpen: [0.5, 0.15], page: [0.4, 0.12], conch: [3.8, 0.55],
  voiceA: [2.6, 0.55], voiceUn: [2.6, 0.5], stomp: [1.4, 0.35], windup: [1.0, 0.4], rin: [6.5, 0.6],
};

// ───────── バッファ生成（一度だけ） ─────────
function makeNoise(ctx: BaseAudioContext, sec: number, pinkish: boolean): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * sec);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    if (!pinkish) { d[i] = w * 0.7; continue; }
    // Paul Kellet のピンクノイズ近似
    b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.969 * b2 + w * 0.153852; b3 = 0.8665 * b3 + w * 0.3104856;
    b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
    d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.12;
    b6 = w * 0.115926;
  }
  // ループの継ぎ目をなじませる
  const x = Math.min(4096, len >> 2);
  for (let i = 0; i < x; i++) {
    const k = i / x;
    d[len - x + i] = d[len - x + i] * (1 - k) + d[i] * k;
  }
  return buf;
}

// 堂内〜山あいの長い残響。高域ほど早く消える
function makeImpulse(ctx: BaseAudioContext, sec: number): AudioBuffer {
  const sr = ctx.sampleRate;
  const len = Math.floor(sr * sec);
  const buf = ctx.createBuffer(2, len, sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const t = i / sr;
      const env = Math.pow(1 - t / sec, 1.5) * Math.exp(-t * 1.2);
      const onset = 1 - Math.exp(-t / 0.03);
      const a = 0.07 + 0.85 * Math.exp(-t * 0.9); // 時間とともに暗くなる
      lp += a * (Math.random() * 2 - 1 - lp);
      d[i] = (lp / Math.sqrt(a / (2 - a))) * env * onset * 0.5;
    }
    // 初期反射を少しだけ
    for (let k = 0; k < 6; k++) {
      const idx = Math.floor(sr * (0.012 + 0.019 * k + Math.random() * 0.012));
      if (idx < len) d[idx] += (Math.random() < 0.5 ? -1 : 1) * 0.5 * Math.pow(0.78, k);
    }
  }
  return buf;
}

// 箏の一音（Karplus-Strong を前もって計算）
function makeKoto(ctx: BaseAudioContext, f: number): AudioBuffer {
  const sr = ctx.sampleRate;
  const sec = clamp(2.6 - f / 500, 1.3, 2.4);
  const len = Math.floor(sr * sec);
  const buf = ctx.createBuffer(1, len, sr);
  const d = buf.getChannelData(0);
  const b = 0.42;                       // ループ内ローパスの強さ
  const N = sr / f - b;                 // フィルタの遅れを補正
  const rl = Math.floor(N) + 3;
  const ring = new Float32Array(rl);
  // 励振：やわらげたノイズ＋弾く位置の櫛
  let lp = 0;
  for (let i = 0; i < rl; i++) { lp += 0.55 * (Math.random() * 2 - 1 - lp); ring[i] = lp; }
  const comb = Math.max(1, Math.floor(N / 5));
  for (let i = rl - 1; i >= comb; i--) ring[i] -= ring[i - comb] * 0.7;
  const g = Math.pow(10, -3 / (f * sec * 1.1));
  let w = 0, prev = 0;
  for (let i = 0; i < len; i++) {
    let rp = w - N; while (rp < 0) rp += rl;
    const i0 = Math.floor(rp), fr = rp - i0;
    const x = ring[i0 % rl] * (1 - fr) + ring[(i0 + 1) % rl] * fr;
    const y = ((1 - b) * x + b * prev) * g;
    prev = x; ring[w] = y; d[i] = y * 0.9; w = (w + 1) % rl;
  }
  const fade = Math.floor(len * 0.2);
  for (let i = 0; i < fade; i++) d[len - 1 - i] *= i / fade;
  return buf;
}

// ───────── 本体（AudioContext ができてから作る） ─────────
function buildCore(ctx: AudioContext) {
  const sr = ctx.sampleRate;
  const white = makeNoise(ctx, 2, false);
  const pink = makeNoise(ctx, 5, true);
  const kotoCache = new Map<number, AudioBuffer>();

  const gain = (v: number) => { const g = ctx.createGain(); g.gain.value = v; return g; };
  const biq = (type: BiquadFilterType, f: number, q = 0.707) => {
    const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b;
  };
  const osc = (type: OscillatorType, f: number, cents = 0) => {
    const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = cents; return o;
  };
  const noise = (buf: AudioBuffer, rate = 1) => {
    const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.playbackRate.value = rate; return s;
  };
  const panner = (p: number): AudioNode | null => {
    if (typeof ctx.createStereoPanner !== 'function') return null;
    const n = ctx.createStereoPanner(); n.pan.value = clamp(p, -1, 1); return n;
  };

  // ── マスター：各バス → ダック → ローパス → コンプレッサー → 出力
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14; comp.knee.value = 12; comp.ratio.value = 6;
  comp.attack.value = 0.004; comp.release.value = 0.25;
  const duckLP = biq('lowpass', 20000, 0.5);
  const duckGain = gain(1);
  const pre = gain(0.85);
  pre.connect(duckGain); duckGain.connect(duckLP); duckLP.connect(comp); comp.connect(ctx.destination);
  // 共有の畳み込み残響
  const conv = ctx.createConvolver();
  conv.buffer = makeImpulse(ctx, 4.6);
  const revRet = gain(0.9);
  conv.connect(revRet); revRet.connect(pre);

  const mkBus = (): { dest: Dest; vol: GainNode; volW: GainNode } => {
    const vol = gain(1), volW = gain(1);
    vol.connect(pre); volW.connect(conv);
    return { dest: { dry: vol, wet: volW }, vol, volW };
  };
  const sfxBus = mkBus(), ambBus = mkBus(), musBus = mkBus();
  // 音楽だけ「心」のフィルタとトレモロを通す
  const fMax = Math.min(19000, sr * 0.45);
  const mindLP = biq('lowpass', fMax, 0.5), mindLPw = biq('lowpass', fMax, 0.5);
  const trem = gain(1), tremDepth = gain(0);
  const tremLfo = osc('sine', 5.3);
  tremLfo.connect(tremDepth); tremDepth.connect(trem.gain); tremLfo.start();
  mindLP.connect(trem); trem.connect(musBus.vol); mindLPw.connect(musBus.volW);
  const musDest: Dest = { dry: mindLP, wet: mindLPw };

  // ── 後片づけ：鳴り終わったノードを切り離す
  let active = 0;
  let garbage: { end: number; cost: number; nodes: AudioNode[] }[] = [];
  const track = (end: number, cost: number, ...nodes: AudioNode[]) => {
    active += cost; garbage.push({ end, cost, nodes });
  };
  const sweep = (now: number) => {
    if (!garbage.length) return;
    const keep: typeof garbage = [];
    for (const g of garbage) {
      if (g.end > now) { keep.push(g); continue; }
      active -= g.cost;
      for (const n of g.nodes) { try { n.disconnect(); } catch { /* 済み */ } }
    }
    garbage = keep;
  };
  const room = (cost: number, music = false) => active + cost <= (music ? MUSIC_COST : MAX_COST);

  const setPannerPos = (p: PannerNode, v: Vec3) => {
    if (p.positionX !== undefined) { p.positionX.value = v[0]; p.positionY.value = v[1]; p.positionZ.value = v[2]; }
    else p.setPosition(v[0], v[1], v[2]);
  };

  // 入口ひとつ → （定位）→ 直接音 と 残響送り
  const strip = (dest: Dest, dry: number, wet: number, o: StripOpts = {}): GainNode => {
    const inp = gain(1);
    const nodes: AudioNode[] = [inp];
    let node: AudioNode = inp;
    if (o.pos) {
      const p = ctx.createPanner();
      p.panningModel = 'HRTF'; p.distanceModel = 'inverse';
      p.refDistance = 3; p.rolloffFactor = 0.6; p.maxDistance = 400;
      setPannerPos(p, o.pos);
      inp.connect(p); node = p; nodes.push(p);
    } else if (o.pan) {
      const p = panner(o.pan);
      if (p) { inp.connect(p); node = p; nodes.push(p); }
    }
    const d = gain(dry), w = gain(wet);
    node.connect(d); d.connect(dest.dry); node.connect(w); w.connect(dest.wet);
    nodes.push(d, w);
    if (o.bag) o.bag.push(...nodes); else track(o.end ?? ctx.currentTime + 2, 0, ...nodes);
    return inp;
  };

  // ── 基本の声
  // やわらかく立ち上がり、指数的に消える包絡（decay でほぼ無音）
  const ad = (p: AudioParam, t: number, peak: number, attack: number, decay: number) => {
    p.setValueAtTime(0, t);
    p.linearRampToValueAtTime(peak, t + attack);
    p.setTargetAtTime(0, t + attack, decay / 5);
  };
  const tone = (out: AudioNode, t: number, f: number, peak: number, attack: number, decay: number,
    type: OscillatorType = 'sine', f1?: number, bend?: number) => {
    const o = osc(type, f);
    if (f1 !== undefined) {
      o.frequency.setValueAtTime(f, t);
      o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + (bend ?? decay));
    }
    const g = gain(0); ad(g.gain, t, peak, attack, decay);
    o.connect(g); g.connect(out);
    const end = t + attack + decay * 1.2 + 0.02;
    o.start(t); o.stop(end); track(end + 0.1, 1, o, g);
  };
  const burst = (out: AudioNode, t: number, b: BurstOpts) => {
    const buf = b.buf ?? white;
    const s = noise(buf);
    const f = biq(b.type ?? 'bandpass', b.f, b.q ?? 1);
    if (b.f1 !== undefined) {
      f.frequency.setValueAtTime(b.f, t);
      f.frequency.exponentialRampToValueAtTime(b.f1, t + Math.max(0.01, b.attack));
      if (b.f2 !== undefined) f.frequency.exponentialRampToValueAtTime(b.f2, t + b.attack + b.decay);
    }
    const g = gain(0); ad(g.gain, t, b.peak, b.attack, b.decay);
    s.connect(f); f.connect(g); g.connect(out);
    const end = t + b.attack + b.decay * 1.2 + 0.02;
    s.start(t, Math.random() * (buf.duration - 0.1)); s.stop(end); track(end + 0.1, 1, s, f, g);
  };

  // 梵鐘：非整数倍の部分音＋うなり＋撞木の柔らかい当たり
  const bonsho = (out: AudioNode, t: number, f0: number, peak: number, scale: number) => {
    for (let i = 0; i < BELL_R.length; i++) {
      const f = f0 * BELL_R[i] * (1 + rnd(-0.002, 0.002));
      const a = peak * BELL_A[i] * 0.16;
      tone(out, t, f, a, i < 2 ? 0.018 : 0.007, BELL_D[i] * scale);
      if (i < 4) tone(out, t, f + rnd(0.25, 0.9), a * 0.6, 0.02, BELL_D[i] * scale * 0.9);
    }
    burst(out, t, { type: 'lowpass', f: 320, q: 0.6, peak: peak * 0.35, attack: 0.004, decay: 0.09 });
  };
  // 鈴（りん）：澄んだ高い音。近い2音のうなり
  const rin = (out: AudioNode, t: number, f: number, peak: number, decay = 5) => {
    tone(out, t, f, peak * 0.22, 0.004, decay);
    tone(out, t, f + rnd(1.2, 2.4), peak * 0.17, 0.004, decay * 0.95);
    tone(out, t, f * 2.71, peak * 0.05, 0.003, decay * 0.4);
    tone(out, t, f * 5.2, peak * 0.018, 0.002, decay * 0.14);
    burst(out, t, { type: 'highpass', f: 4000, peak: peak * 0.04, attack: 0.001, decay: 0.012 });
  };
  // 箏
  const koto = (out: AudioNode, t: number, midi: number, vel: number, pan: number) => {
    let buf = kotoCache.get(midi);
    if (!buf) { buf = makeKoto(ctx, mtof(midi)); kotoCache.set(midi, buf); }
    const s = ctx.createBufferSource(); s.buffer = buf;
    s.playbackRate.setValueAtTime(1.012, t);          // 弾いた直後のわずかな音程の落ち
    s.playbackRate.linearRampToValueAtTime(1, t + 0.09);
    const lp = biq('lowpass', 1800 + vel * 3600, 0.6);
    const g = gain(vel);
    s.connect(lp); lp.connect(g);
    const p = panner(pan);
    if (p) { g.connect(p); p.connect(out); } else g.connect(out);
    s.start(t);
    track(t + buf.duration + 0.1, 1, s, lp, g, ...(p ? [p] : []));
  };
  // 尺八：三角波＋息の音。しゃくり上げ、育つビブラート
  const shaku = (out: AudioNode, t: number, f: number, dur: number, peak: number, from?: number) => {
    const o1 = osc('triangle', f), o2 = osc('sine', f * 2);
    const start = 1200 * Math.log2((from ?? f * 0.945) / f);
    const lfo = osc('sine', rnd(4.4, 5.2)), vib = gain(0);
    lfo.frequency.linearRampToValueAtTime(5.6, t + dur);
    vib.gain.setValueAtTime(0, t + dur * 0.35);
    vib.gain.linearRampToValueAtTime(rnd(16, 30), t + dur);
    lfo.connect(vib);
    for (const o of [o1, o2]) {
      o.detune.setValueAtTime(start, t);
      o.detune.setTargetAtTime(0, t, rnd(0.04, 0.09));
      o.detune.setTargetAtTime(-35, t + dur - 0.25, 0.2); // 終わりに少し沈む
      vib.connect(o.detune);
    }
    const h = gain(0.2), lp = biq('lowpass', f * 3.2, 0.7), g = gain(0);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.16);
    g.gain.setTargetAtTime(peak * 0.78, t + 0.16, 0.5);
    g.gain.setTargetAtTime(0, t + dur - 0.3, 0.13);
    o1.connect(lp); o2.connect(h); h.connect(lp); lp.connect(g); g.connect(out);
    // 息
    const n = noise(white), bp = biq('bandpass', f * 2.1, 1.3), gb = gain(0);
    gb.gain.setValueAtTime(0, t);
    gb.gain.linearRampToValueAtTime(peak * 0.5, t + 0.05);
    gb.gain.setTargetAtTime(peak * 0.07, t + 0.05, 0.12);
    gb.gain.setTargetAtTime(0, t + dur - 0.3, 0.12);
    n.connect(bp); bp.connect(gb); gb.connect(out);
    const end = t + dur + 0.7;
    for (const s of [o1, o2, lfo]) { s.start(t); s.stop(end); }
    n.start(t, Math.random()); n.stop(end);
    track(end + 0.1, 4, o1, o2, lfo, vib, h, lp, g, n, bp, gb);
  };
  // 太鼓のような鼓動（阿＝強、吽＝弱）
  const taiko = (out: AudioNode, t: number, strong: boolean) => {
    const a = strong ? 1 : 0.5;
    tone(out, t, strong ? 96 : 82, 0.85 * a, 0.004, 0.55, 'sine', strong ? 46 : 42, 0.14);
    tone(out, t, 160, 0.16 * a, 0.003, 0.14, 'triangle', 92, 0.1);
    burst(out, t, { type: 'lowpass', f: 520, q: 0.7, peak: 0.3 * a, attack: 0.003, decay: 0.09 });
  };
  // 鳥：鶯（ホー…ホケキョ）または短いさえずり
  const bird = (out: AudioNode, t: number) => {
    const o = osc('sine', 1300), g = gain(0);
    const fq = o.frequency, a = g.gain;
    const k = rnd(0.92, 1.1);
    let end: number;
    a.setValueAtTime(0, t);
    if (Math.random() < 0.6) {
      fq.setValueAtTime(1240 * k, t); fq.linearRampToValueAtTime(1330 * k, t + 0.85);
      a.linearRampToValueAtTime(0.5, t + 0.75); a.linearRampToValueAtTime(0, t + 0.93);
      const seg: [number, number, number, number][] = [[1.0, 2100, 3300, 0.1], [1.13, 3300, 2500, 0.09], [1.25, 2900, 1900, 0.22]];
      for (const [dt, f0, f1, d] of seg) {
        fq.setValueAtTime(f0 * k, t + dt); fq.exponentialRampToValueAtTime(f1 * k, t + dt + d);
        a.setValueAtTime(0, t + dt); a.linearRampToValueAtTime(0.55, t + dt + 0.02);
        a.linearRampToValueAtTime(0, t + dt + d);
      }
      end = t + 1.6;
    } else {
      const n = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        const dt = i * 0.17;
        fq.setValueAtTime(4300 * k, t + dt); fq.exponentialRampToValueAtTime(3000 * k, t + dt + 0.1);
        a.setValueAtTime(0, t + dt); a.linearRampToValueAtTime(0.35, t + dt + 0.015);
        a.linearRampToValueAtTime(0, t + dt + 0.11);
      }
      end = t + n * 0.17 + 0.1;
    }
    o.connect(g); g.connect(out); o.start(t); o.stop(end); track(end + 0.1, 1, o, g);
  };
  // 遠くの木のきしみ
  const creak = (out: AudioNode, t: number) => {
    const d = rnd(0.35, 0.7);
    const o = osc('sawtooth', rnd(24, 34)), bp = biq('bandpass', rnd(240, 420), 9), g = gain(0);
    o.frequency.exponentialRampToValueAtTime(rnd(11, 16), t + d);
    bp.frequency.linearRampToValueAtTime(bp.frequency.value * rnd(0.8, 1.25), t + d);
    ad(g.gain, t, 0.5, d * 0.4, d * 0.6);
    o.connect(bp); bp.connect(g); g.connect(out);
    o.start(t); o.stop(t + d * 1.3); track(t + d * 1.3 + 0.1, 1, o, bp, g);
  };

  // ───────── 場面（章ごとの持続音） ─────────
  let scene: Scene | null = null;
  let phase = 0, mind = 1;

  const stopScene = (s: Scene) => {
    const now = ctx.currentTime;
    for (const g of s.fades) { g.gain.cancelScheduledValues(now); g.gain.setTargetAtTime(0, now, 0.7); }
    for (const src of s.srcs) { try { src.stop(now + 4.5); } catch { /* 済み */ } }
    track(now + 16, 0, ...s.nodes); // 予約済みの音が鳴り終わってから切る
    active -= s.cost;
  };

  const startScene = (id: 'title' | 'prologue'): Scene => {
    const now = ctx.currentTime;
    const nodes: AudioNode[] = [], srcs: AudioScheduledSourceNode[] = [];
    const fades = [gain(0), gain(0), gain(0), gain(0)];
    fades[0].connect(musDest.dry); fades[1].connect(musDest.wet);
    fades[2].connect(ambBus.dest.dry); fades[3].connect(ambBus.dest.wet);
    for (const g of fades) g.gain.setTargetAtTime(1, now, 0.8);
    nodes.push(...fades);
    const mus: Dest = { dry: fades[0], wet: fades[1] }, amb: Dest = { dry: fades[2], wet: fades[3] };
    const run = <T extends OscillatorNode | AudioBufferSourceNode>(s: T, off = 0): T => {
      if (s instanceof AudioBufferSourceNode) s.start(now, off); else s.start(now);
      srcs.push(s); nodes.push(s); return s;
    };
    const lfoTo = (f: number, depth: number, p: AudioParam) => {
      const l = run(osc('sine', f)), d = gain(depth);
      l.connect(d); d.connect(p); nodes.push(d);
    };

    // 声明を思わせる低い持続音（言葉ではない）：鋸歯波 → フォルマント
    const droneBus = strip(mus, 0.85, 0.4, { bag: nodes });
    const droneLevel = gain(0.0001);
    const breath = gain(0.72), mix = gain(0.6), dLP = biq('lowpass', 1900, 0.5);
    const body = biq('lowpass', 230, 0.5), bodyG = gain(0.28);
    const formants: BiquadFilterNode[] = [];
    const F: [number, number, number][] = [[420, 5, 1.4], [760, 7, 0.9], [2300, 8, 0.22]];
    for (const [f, q, a] of F) {
      const bp = biq('bandpass', f, q), g = gain(a);
      mix.connect(bp); bp.connect(g); g.connect(dLP); formants.push(bp); nodes.push(bp, g);
    }
    mix.connect(body); body.connect(bodyG); bodyG.connect(dLP);
    dLP.connect(breath); breath.connect(droneLevel); droneLevel.connect(droneBus);
    nodes.push(droneLevel, breath, mix, dLP, body, bodyG);
    const D2 = mtof(38), A2 = mtof(45);
    const voices: [OscillatorType, number, number, number][] = [
      ['sawtooth', D2, -6, 1], ['sawtooth', D2, 5, 1], ['triangle', A2, 3, 0.9], ['sawtooth', D2 * 2, -2, 0.35],
    ];
    const drift: OscillatorNode[] = [];
    for (const [type, f, c, a] of voices) {
      const o = run(osc(type, f, c)), g = gain(a);
      o.connect(g); g.connect(mix); nodes.push(g); drift.push(o);
    }
    lfoTo(0.07, 0.26, breath.gain);                 // ゆっくりした息づかい
    lfoTo(0.05, 70, formants[1].frequency);         // 母音がゆっくり移ろう
    lfoTo(0.031, 40, formants[0].frequency);
    lfoTo(0.11, 4, drift[1].detune);                // わずかな音程のゆらぎ
    let cost = 8;

    let pulse: GainNode | null = null, koto1: GainNode | null = null, koto2: GainNode | null = null;
    let fifth: GainNode | null = null, dis: GainNode | null = null;
    if (id === 'prologue') {
      const layer = (dry: number, wet: number) => {
        const g = gain(0); g.connect(strip(mus, dry, wet, { bag: nodes })); nodes.push(g); return g;
      };
      pulse = layer(0.9, 0.22); koto1 = layer(0.75, 0.4); koto2 = layer(0.6, 0.45);
      // 高い五度の層（第三段）
      fifth = gain(0); fifth.connect(mix); nodes.push(fifth);
      run(osc('sawtooth', mtof(57), 4)).connect(fifth);
      run(osc('triangle', mtof(64), -5)).connect(fifth);
      // 心が乱れたときの濁り（三全音の塊）
      dis = gain(0);
      const disLP = biq('lowpass', 520, 0.7);
      run(osc('sawtooth', mtof(44), 9)).connect(disLP);
      run(osc('sawtooth', mtof(51), -13)).connect(disLP);
      disLP.connect(dis); dis.connect(droneBus); nodes.push(dis, disLP);
      cost += 4;
    }

    // 環境音：杉木立の風（左右で別の揺れ）
    const ambLevel = gain(id === 'title' ? 0.55 : 1);
    ambLevel.connect(strip(amb, 1, 0.16, { bag: nodes })); nodes.push(ambLevel);
    const wind: Scene['wind'] = [];
    for (const side of [-0.75, 0.75]) {
      const s = run(noise(pink, rnd(0.8, 1.1)), Math.random() * 4);
      const f = biq('bandpass', rnd(350, 600), 0.7), g = gain(0.5);
      const p = panner(side);
      s.connect(f); f.connect(g);
      if (p) { g.connect(p); p.connect(ambLevel); nodes.push(p); } else g.connect(ambLevel);
      nodes.push(f, g); wind.push({ f, g });
    }
    cost += 2;
    if (id === 'prologue') {
      // 遠い沢
      const s = run(noise(white, 0.9), Math.random());
      const bp = biq('bandpass', 2400, 0.9), hp = biq('highpass', 900), fl = gain(0.6), g = gain(0.06);
      const p = panner(-0.45);
      lfoTo(9.3, 0.15, fl.gain); lfoTo(6.1, 0.12, fl.gain);
      s.connect(bp); bp.connect(hp); hp.connect(fl); fl.connect(g);
      if (p) { g.connect(p); p.connect(ambLevel); nodes.push(p); } else g.connect(ambLevel);
      nodes.push(bp, hp, fl, g);
      cost += 3;
    }
    active += cost;

    return {
      id, mus, amb, fades, nodes, srcs, cost, droneLevel, ambLevel, pulse, koto1, koto2, fifth, dis, wind,
      nextWind: now, nextBell: now + rnd(2.5, 5), nextRin: now + rnd(9, 16), nextShaku: now + rnd(5, 9),
      nextBird: now + rnd(6, 14), nextCreak: now + rnd(20, 45), nextBar: now + 0.3, bar: 0, bars: [],
    };
  };

  // 段階ごとの層（約2秒でなじむ）
  const applyPhase = () => {
    const s = scene; if (!s) return;
    const now = ctx.currentTime, tc = 0.6;
    const ph = s.id === 'prologue' ? phase : 0;
    const set = (g: GainNode | null, v: number) => g?.gain.setTargetAtTime(v, now, tc);
    set(s.droneLevel, s.id === 'title' ? 0.5 : [0.3, 0.46, 0.5, 0.55][ph]);
    set(s.ambLevel, s.id === 'title' ? 0.55 : [1, 0.6, 0.55, 0.5][ph]);
    set(s.pulse, ph >= 1 ? 1 : 0); set(s.koto1, ph >= 1 ? 1 : 0);
    set(s.koto2, ph >= 2 ? 1 : 0); set(s.fifth, ph >= 3 ? 0.55 : 0);
  };
  const applyMind = () => {
    const now = ctx.currentTime, c = mind;
    const f = Math.min(fMax, 1200 * Math.pow(16, c));
    mindLP.frequency.setTargetAtTime(f, now, 0.4);
    mindLPw.frequency.setTargetAtTime(f, now, 0.4);
    tremDepth.gain.setTargetAtTime((1 - c) * 0.11, now, 0.4);
    scene?.dis?.gain.setTargetAtTime(Math.pow(1 - c, 1.5) * 0.4, now, 0.6);
  };

  // ───────── 生成音楽のスケジューラ ─────────
  const shakuPhrase = (s: Scene, t0: number): number => {
    const n = 2 + Math.floor(Math.random() * 4);
    let idx = pick(SHAKU_REST), t = t0, prev: number | undefined;
    const pan = rnd(-0.3, 0.3);
    const notes: [number, number, number, number | undefined][] = [];
    for (let i = 0; i < n; i++) {
      const last = i === n - 1;
      if (last) idx = pick(SHAKU_REST);
      const f = mtof(SHAKU_SCALE[idx]);
      const dur = last ? rnd(2.6, 4.2) : pick([0.6, 0.9, 1.4, 2.0]);
      const legato = prev !== undefined && Math.random() < 0.5;
      notes.push([t, f, dur, legato ? prev : undefined]);
      t += dur * 0.93 + (Math.random() < 0.3 ? rnd(0.3, 0.9) : 0); // 間
      prev = f;
      idx = clamp(idx + pick([-2, -1, -1, 1, 1, 2]), 0, SHAKU_SCALE.length - 1);
    }
    const bus = strip(s.mus, 0.7, 0.6, { end: t + 6, pan });
    const peak = rnd(0.1, 0.15);
    for (const [nt, f, dur, from] of notes) shaku(bus, nt, f, dur, peak * rnd(0.85, 1.1), from);
    return t;
  };

  const scheduleBars = (s: Scene, horizon: number) => {
    while (s.nextBar < horizon) {
      const ph = clamp(phase, 0, 3);            // 速さは小節の頭でだけ変わる
      const bpm = BPM[ph], beat = 60 / bpm, t0 = s.nextBar;
      s.bars.push({ t: t0, dur: beat * 2, bpm });
      if (s.bars.length > 4) s.bars.shift();
      if (ph >= 1 && s.pulse && room(6, true)) { taiko(s.pulse, t0, true); taiko(s.pulse, t0 + beat, false); }
      for (let k = 0; k < 4; k++) {
        const i = (s.bar % 4) * 4 + k, t = t0 + k * beat * 0.5 + rnd(0, 0.009);
        if (ph >= 1 && s.koto1 && KOTO1[i] && room(1, true)) koto(s.koto1, t, KOTO1[i], rnd(0.4, 0.55) * (k === 0 ? 1.2 : 1), -0.3);
        if (ph >= 2 && s.koto2 && KOTO2[i] && Math.random() < 0.85 && room(1, true)) koto(s.koto2, t + 0.004, KOTO2[i], rnd(0.3, 0.42), 0.35);
      }
      if (s.bar % 8 === 0 && ph >= 1) {         // フレーズの頭
        if (ph >= 3 && room(14, true)) bonsho(strip(s.mus, 0.5, 0.6, { end: t0 + 14 }), t0, mtof(50), 0.6, 0.7);
        else if (Math.random() < 0.6 && room(5, true)) rin(strip(s.mus, 0.5, 0.7, { end: t0 + 7, pan: rnd(-0.4, 0.4) }), t0, mtof(pick([86, 93])), 0.5);
      }
      s.bar++; s.nextBar += beat * 2;
    }
  };

  const tick = () => {
    const now = ctx.currentTime;
    sweep(now);
    const s = scene;
    if (!s || document.hidden || ctx.state !== 'running') return;
    const hz = now + LOOKAHEAD;
    const pro = s.id === 'prologue', ph = pro ? phase : 0;
    // 風のゆらぎ
    if (now >= s.nextWind) {
      for (const w of s.wind) {
        w.f.frequency.setTargetAtTime(rnd(260, 900), now, 1.6);
        w.g.gain.setTargetAtTime(rnd(0.22, 0.8), now, 1.8);
      }
      s.nextWind = now + rnd(2, 4.5);
    }
    // 梵鐘（探索とタイトルだけ。試練中は小節に合わせる）
    if (s.nextBell < hz) {
      const t = Math.max(s.nextBell, now + 0.05);
      if (ph === 0 && room(14, true)) bonsho(strip(s.mus, 0.55, 0.65, { end: t + 18 }), t, mtof(50), pro ? 0.55 : 0.8, 1);
      s.nextBell = t + (pro ? rnd(22, 36) : rnd(12, 18));
    }
    if (s.nextRin < hz) {
      const t = Math.max(s.nextRin, now + 0.05);
      if (ph === 0 && room(5, true)) rin(strip(s.mus, 0.5, 0.7, { end: t + 7, pan: rnd(-0.5, 0.5) }), t, mtof(pick([86, 89, 93])), 0.45);
      s.nextRin = t + rnd(11, 26);
    }
    if (s.nextShaku < hz) {
      const t = Math.max(s.nextShaku, now + 0.05);
      const end = room(8, true) ? shakuPhrase(s, t) : t;
      s.nextShaku = end + (!pro ? rnd(7, 14) : ph === 0 ? rnd(10, 20) : ph === 1 ? rnd(8, 14) : rnd(3, 7));
    }
    if (pro) {
      if (s.nextBar < now - 0.05) s.nextBar = now + 0.1; // 復帰時に追いかけない
      scheduleBars(s, hz);
      if (s.nextBird < hz) {
        const t = Math.max(s.nextBird, now + 0.05);
        if (room(1, true)) bird(strip(s.amb, 0.035, 0.07, { end: t + 3, pan: rnd(-0.9, 0.9) }), t);
        s.nextBird = t + rnd(9, 26) * (ph === 0 ? 1 : 2);
      }
      if (s.nextCreak < hz) {
        const t = Math.max(s.nextCreak, now + 0.05);
        if (room(1, true)) creak(strip(s.amb, 0.05, 0.1, { end: t + 2, pan: rnd(-0.8, 0.8) }), t);
        s.nextCreak = t + rnd(25, 60);
      }
    }
  };
  setInterval(tick, 100);

  // 画面が隠れたら止め、戻ったら再開（iOS の中断にも備える）
  const wake = () => { if (!document.hidden && ctx.state !== 'running') ctx.resume().catch(() => { /* 次の操作で */ }); };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) ctx.suspend().catch(() => { /* 無視 */ }); else wake();
  });
  window.addEventListener('pointerdown', wake, { passive: true });
  window.addEventListener('touchend', wake, { passive: true });

  // ───────── 効果音 ─────────
  const step = (o: AudioNode, t: number, surface: Surface, p: number) => {
    const r = rnd(0.88, 1.12) * p, a = rnd(0.8, 1);
    switch (surface) {
      case 'stone':
        burst(o, t, { f: 3000 * r, q: 1, peak: 0.16 * a, attack: 0.001, decay: 0.02 });
        burst(o, t, { type: 'lowpass', f: 520 * r, peak: 0.3 * a, attack: 0.002, decay: 0.06 });
        tone(o, t, 125 * r, 0.3 * a, 0.002, 0.07, 'sine', 70 * r);
        break;
      case 'earth':
        burst(o, t, { type: 'lowpass', f: 360 * r, peak: 0.36 * a, attack: 0.008, decay: 0.11, buf: pink });
        tone(o, t, 88 * r, 0.26 * a, 0.006, 0.09, 'sine', 55 * r);
        break;
      case 'wood':
        tone(o, t, 215 * r, 0.3 * a, 0.002, 0.1, 'sine', 150 * r);
        tone(o, t, 330 * r, 0.1 * a, 0.002, 0.05, 'triangle');
        burst(o, t, { f: 430 * r, q: 4, peak: 0.4 * a, attack: 0.002, decay: 0.07 });
        break;
      case 'water':
        burst(o, t, { f: 1900 * r, f1: 1500 * r, f2: 700 * r, q: 0.9, peak: 0.28 * a, attack: 0.012, decay: 0.28 });
        burst(o, t + 0.05, { type: 'highpass', f: 3500, peak: 0.08 * a, attack: 0.01, decay: 0.18 });
        tone(o, t + 0.03, 520 * r, 0.05 * a, 0.004, 0.07, 'sine', 950 * r);
        break;
    }
  };

  const sfx = (name: SfxName, opts: SfxOpts = {}) => {
    if (ctx.state !== 'running') return;
    const [dur, wet] = SFX_INFO[name];
    const big = name === 'inka' || name === 'bell';
    if (!big && !room(8)) return;                   // 鳴らしすぎを防ぐ
    const t = ctx.currentTime + 0.012;
    const p = opts.pitch ?? 1, g = opts.gain ?? 1;
    const o = strip(sfxBus.dest, g, g * wet, { end: t + dur + 1, pos: opts.pos });
    switch (name) {
      case 'swingLight': case 'swingHeavy': {
        // 錫杖の風切り＋金輪のかすかな音
        const h = name === 'swingHeavy', d = h ? 0.46 : 0.24, b = (h ? 0.55 : 1) * p;
        burst(o, t, { f: 800 * b, f1: 2600 * b, f2: 1100 * b, q: 1.6, peak: h ? 0.5 : 0.38, attack: d * 0.45, decay: d * 0.55 });
        for (let i = 0; i < (h ? 5 : 4); i++) tone(o, t + rnd(0.02, d * 0.8), rnd(3200, 7200) * b ** 0.3, rnd(0.012, 0.03), 0.002, rnd(0.07, 0.16));
        break;
      }
      case 'hit': {
        // 青銅に当たる澄んだ「コーン」＋木の当たり
        const f = 520 * p * rnd(0.98, 1.02);
        burst(o, t, { type: 'lowpass', f: 950, peak: 0.4, attack: 0.002, decay: 0.035 });
        tone(o, t, 185 * p, 0.3, 0.002, 0.07, 'sine', 110 * p);
        tone(o, t, f, 0.3, 0.004, 1.2); tone(o, t, f * 1.004, 0.18, 0.004, 1.1);
        tone(o, t, f * 2.76, 0.13, 0.003, 0.85); tone(o, t, f * 5.4, 0.05, 0.002, 0.45);
        tone(o, t, f * 8.93, 0.02, 0.002, 0.22);
        break;
      }
      case 'guard':
        burst(o, t, { f: 520 * p, q: 2, peak: 0.5, attack: 0.002, decay: 0.06 });
        tone(o, t, 142 * p, 0.4, 0.002, 0.1, 'sine', 95 * p);
        tone(o, t, 330 * p, 0.14, 0.002, 0.16, 'triangle');
        tone(o, t, 1250 * p, 0.04, 0.003, 0.28);
        break;
      case 'perfectGuard': {
        // 澄んだ鈴の音＝ご褒美
        const f = mtof(91) * p;
        rin(o, t, f, 1.1, 2.5);
        [2, 3, 4.02].forEach((m, i) => tone(o, t + 0.05 + i * 0.09, f * m, 0.022 / (i + 1), 0.3, 1.9));
        break;
      }
      case 'hurt':
        tone(o, t, 112 * p, 0.5, 0.004, 0.2, 'sine', 56 * p);
        burst(o, t, { type: 'lowpass', f: 300, peak: 0.4, attack: 0.004, decay: 0.12, buf: pink });
        burst(o, t + 0.04, { f: 1200 * p, q: 0.8, peak: 0.07, attack: 0.04, decay: 0.3 });
        break;
      case 'dodge':
        [0, 0.07, 0.16].forEach((dt, i) =>
          burst(o, t + dt, { f: rnd(2400, 4000) * p, q: 0.7, peak: 0.16 - i * 0.04, attack: 0.012, decay: rnd(0.06, 0.1) }));
        break;
      case 'breathIn': case 'breathOut': {
        const inn = name === 'breathIn';
        const a = (inn ? 520 : 1350) * p, b = (inn ? 1450 : 430) * p;
        const mid = Math.sqrt(a * b);
        burst(o, t, { f: a, f1: mid, f2: b, q: 1.2, peak: 0.16, attack: 0.6, decay: 1.0 });
        burst(o, t, { f: a * 2.5, f1: mid * 2.5, f2: b * 2.5, q: 1.5, peak: 0.05, attack: 0.6, decay: 1.0 });
        break;
      }
      case 'bell': bonsho(o, t, mtof(50) * p, 0.9, 1); break;
      case 'inka': {
        // 大梵鐘＋ゆっくり立ちのぼる五音の光
        bonsho(o, t, mtof(38) * p, 1.15, 1.6);
        tone(o, t, mtof(50) * p, 0.07, 0.03, 16);
        const L = gain(1), R = gain(1), pl = panner(-0.5), pr = panner(0.5);
        if (pl && pr) { L.connect(pl); pl.connect(o); R.connect(pr); pr.connect(o); } else { L.connect(o); R.connect(o); }
        track(t + dur, 0, L, R, ...(pl && pr ? [pl, pr] : []));
        [74, 76, 78, 81, 83, 86].forEach((m, i) => {
          const f = mtof(m) * p, tt = t + 1.2 + i * 0.65, out = i % 2 ? R : L;
          tone(out, tt, f, 0.03, 2.6, 9); tone(out, tt, f * 1.0018, 0.022, 3, 8);
        });
        break;
      }
      case 'step': step(o, t, opts.surface ?? 'stone', p); break;
      case 'uiSelect':
        burst(o, t, { f: 1900 * p, q: 3, peak: 0.3, attack: 0.001, decay: 0.02 });
        tone(o, t, 880 * p, 0.12, 0.001, 0.04, 'sine', 700 * p);
        tone(o, t, 2093 * p, 0.03, 0.004, 0.9); tone(o, t, 2095.5 * p, 0.022, 0.004, 0.85);
        break;
      case 'uiOpen':
        burst(o, t, { f: 1500 * p, f1: 3000 * p, f2: 4200 * p, q: 0.8, peak: 0.15, attack: 0.1, decay: 0.2 });
        break;
      case 'page':
        burst(o, t, { f: 3000 * p, f1: 2400 * p, f2: 1800 * p, q: 0.9, peak: 0.14, attack: 0.04, decay: 0.13 });
        burst(o, t + 0.14, { f: 5000 * p, q: 1.2, peak: 0.09, attack: 0.004, decay: 0.05 });
        break;
      case 'conch': {
        // 法螺貝：せり上がって伸び、ゆったり揺れる
        const f = 233 * p, end = t + 3.2;
        const o1 = osc('sawtooth', f, -4), o2 = osc('sawtooth', f, 6), lfo = osc('sine', 3.1), vib = gain(0);
        const lp = biq('lowpass', 480, 6), gg = gain(0);
        for (const x of [o1, o2]) {
          x.frequency.setValueAtTime(f * 0.8, t); x.frequency.setTargetAtTime(f, t, 0.22);
          vib.connect(x.detune); x.connect(lp);
        }
        vib.gain.setValueAtTime(0, t + 0.6); vib.gain.linearRampToValueAtTime(34, t + 2.4);
        lp.frequency.setValueAtTime(480, t); lp.frequency.setTargetAtTime(1150 * p, t, 0.5);
        gg.gain.setValueAtTime(0, t); gg.gain.linearRampToValueAtTime(0.16, t + 0.3);
        gg.gain.setTargetAtTime(0.2, t + 0.3, 0.6); gg.gain.setTargetAtTime(0, t + 2.4, 0.16);
        lfo.connect(vib); lp.connect(gg); gg.connect(o);
        for (const x of [o1, o2, lfo]) { x.start(t); x.stop(end); }
        track(end + 0.1, 3, o1, o2, lfo, vib, lp, gg);
        burst(o, t, { f: 900 * p, q: 1, peak: 0.04, attack: 0.25, decay: 1.6 });
        break;
      }
      case 'voiceA': case 'voiceUn': {
        // 阿＝開いた明るい響き／吽＝閉じた低いうなり（どちらも言葉ではない）
        const A = name === 'voiceA', end = t + 2.2;
        const fs = A ? [mtof(50), mtof(57), mtof(62)] : [mtof(38), mtof(45)];
        const fm: [number, number, number][] = A ? [[800, 5, 1.6], [1200, 6, 1.1], [2600, 7, 0.3]] : [[300, 4, 2.2], [1000, 6, 0.12]];
        const mix = gain(0.5), gg = gain(0), lp = biq('lowpass', A ? 4200 : 520, 0.6);
        const srcs: OscillatorNode[] = fs.map((f, i) => {
          const x = osc('sawtooth', f * p, i % 2 ? 7 : -6);
          x.frequency.setValueAtTime(f * p * (A ? 0.965 : 1.02), t); x.frequency.setTargetAtTime(f * p, t, 0.25);
          x.connect(mix); return x;
        });
        const fn: AudioNode[] = [];
        for (const [f, q, a] of fm) {
          const bp = biq('bandpass', f, q), ga = gain(a);
          mix.connect(bp); bp.connect(ga); ga.connect(lp); fn.push(bp, ga);
        }
        lp.connect(gg); gg.connect(o);
        gg.gain.setValueAtTime(0, t);
        gg.gain.linearRampToValueAtTime(A ? 0.3 : 0.34, t + (A ? 0.55 : 0.3));
        gg.gain.setTargetAtTime(0, t + (A ? 1.0 : 1.1), A ? 0.2 : 0.17);
        for (const x of srcs) { x.start(t); x.stop(end); }
        track(end + 0.1, srcs.length, ...srcs, mix, gg, lp, ...fn);
        if (A) {
          burst(o, t, { f: 1500 * p, q: 0.8, peak: 0.04, attack: 0.5, decay: 0.8 });
          [74, 81, 88].forEach((m, i) => { tone(o, t + 0.12, mtof(m) * p, 0.07 / (i + 1), 0.02, 1.6); });
          tone(o, t + 0.12, mtof(74) * p * 1.003, 0.04, 0.02, 1.5);
        } else {
          tone(o, t + 0.05, mtof(62) * p, 0.07, 0.02, 1.7); tone(o, t + 0.05, mtof(62) * p + 1.1, 0.05, 0.02, 1.6);
          tone(o, t + 0.05, mtof(62) * p * 2.51, 0.015, 0.01, 0.8);
        }
        break;
      }
      case 'stomp':
        tone(o, t, 92 * p, 0.95, 0.005, 0.85, 'sine', 42 * p, 0.22);
        burst(o, t, { type: 'lowpass', f: 230, peak: 0.6, attack: 0.01, decay: 0.75, buf: pink });
        burst(o, t, { f: 900 * p, q: 0.8, peak: 0.12, attack: 0.002, decay: 0.07 });
        break;
      case 'windup':
        // 攻撃の予兆：吸い込む空気と立ちのぼる光
        burst(o, t, { f: 600 * p, f1: 3800 * p, q: 2, peak: 0.2, attack: 0.62, decay: 0.12 });
        tone(o, t, 880 * p, 0.05, 0.6, 0.14, 'sine', 1760 * p, 0.68);
        tone(o, t, 1318 * p, 0.03, 0.62, 0.14, 'sine', 2640 * p, 0.7);
        break;
      case 'rin': rin(o, t, mtof(86) * p, 1, 5); break;
    }
  };

  // ───────── 外向きの操作 ─────────
  return {
    ctx, sfx,
    setVolumes(v: { music: number; sfx: number; ambience: number }) {
      const now = ctx.currentTime;
      const set = (b: { vol: GainNode; volW: GainNode }, x: number) => {
        const y = clamp(x, 0, 1);
        b.vol.gain.setTargetAtTime(y, now, 0.05); b.volW.gain.setTargetAtTime(y, now, 0.05);
      };
      set(musBus, v.music); set(sfxBus, v.sfx); set(ambBus, v.ambience);
    },
    setListener(pos: Vec3, fw: Vec3, up: Vec3) {
      const l = ctx.listener;
      if (l.positionX !== undefined) {
        l.positionX.value = pos[0]; l.positionY.value = pos[1]; l.positionZ.value = pos[2];
        l.forwardX.value = fw[0]; l.forwardY.value = fw[1]; l.forwardZ.value = fw[2];
        l.upX.value = up[0]; l.upY.value = up[1]; l.upZ.value = up[2];
      } else {
        l.setPosition(pos[0], pos[1], pos[2]);
        l.setOrientation(fw[0], fw[1], fw[2], up[0], up[1], up[2]);
      }
    },
    playChapter(id: ChapterMusic) {
      if ((scene?.id ?? 'none') === id) return;
      if (scene) stopScene(scene);
      scene = id === 'none' ? null : startScene(id);
      applyPhase(); applyMind();
    },
    setPhase(n: number) { phase = clamp(Math.round(n), 0, 3); applyPhase(); },
    setMind(c: number) { mind = clamp(c, 0, 1); applyMind(); },
    setDucked(d: boolean) {
      const now = ctx.currentTime;
      duckGain.gain.setTargetAtTime(d ? 0.316 : 1, now, 0.15);   // 約 -10dB
      duckLP.frequency.setTargetAtTime(d ? 900 : 20000, now, 0.15);
    },
    getBeat(): BeatInfo {
      const s = scene;
      if (!s || s.id !== 'prologue') return { bpm: 0, phase: 0 };
      const now = ctx.currentTime;
      for (let i = s.bars.length - 1; i >= 0; i--) {
        const b = s.bars[i];
        if (b.t <= now) return { bpm: b.bpm, phase: clamp((now - b.t) / b.dur, 0, 0.9999) };
      }
      return { bpm: s.bars[0]?.bpm ?? BPM[phase], phase: 0 };
    },
  };
}

// ───────── 公開する入口。unlock 前はすべて何もしない（状態だけ覚える） ─────────
export function createAudio(): GameAudio {
  let core: ReturnType<typeof buildCore> | null = null;
  let unlocked = false;
  let pending: Promise<void> | null = null;
  const st = {
    vols: { music: 0.8, sfx: 0.9, ambience: 0.8 },
    chapter: 'none' as ChapterMusic, phase: 0, mind: 1, ducked: false,
  };

  return {
    get unlocked() { return unlocked; },
    unlock(): Promise<void> {
      if (unlocked) return Promise.resolve();
      if (pending) return pending;
      pending = (async () => {
        try {
          if (!core) {
            const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
            const AC = w.AudioContext ?? w.webkitAudioContext;
            if (!AC) return;
            const ctx = new AC();
            const resume = ctx.resume();        // ユーザー操作の中で先に呼ぶ（iOS）
            core = buildCore(ctx);
            await resume;
          } else {
            await core.ctx.resume();
          }
          core.setVolumes(st.vols); core.setDucked(st.ducked);
          core.setPhase(st.phase); core.setMind(st.mind);
          core.playChapter(st.chapter);
          unlocked = true;
        } catch (e) {
          console.warn('[audio] 音を有効にできませんでした', e);
        } finally {
          pending = null;
        }
      })();
      return pending;
    },
    setVolumes(v) { st.vols = { ...v }; if (unlocked) core?.setVolumes(v); },
    setListener(pos, forward, up) { if (unlocked) core?.setListener(pos, forward, up); },
    playChapter(id) { st.chapter = id; if (unlocked) core?.playChapter(id); },
    setPhase(n) { st.phase = n; if (unlocked) core?.setPhase(n); },
    setMind(c) { st.mind = c; if (unlocked) core?.setMind(c); },
    sfx(name, opts) { if (unlocked) core?.sfx(name, opts); },
    setDucked(d) { st.ducked = d; if (unlocked) core?.setDucked(d); },
    getBeat() { return unlocked && core ? core.getBeat() : { bpm: 0, phase: 0 }; },
  };
}
