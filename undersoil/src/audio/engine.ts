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
  setMuted(m: boolean): void;
  /** タブが隠れたときに止め、戻ったら再開する（消音の設定とは別） */
  pause(p: boolean): void;
  muted: boolean;
  update(dt: number): void;
}

// ステージ1の主題：ピアノの単音。ペンタトニック（D の音階）で、どの音が重なっても濁らない
const SCALE = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25, 739.99, 880.0];
const CHORD = [146.83, 220.0, 293.66, 369.99, 440.0, 587.33]; // D の和音（開いた配置）

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

export function createAudio(): AudioEngine {
  let ctx: AudioContext | null = null;
  let master: GainNode, music: GainNode, sfx: GainNode, verb: ConvolverNode, verbIn: GainNode;
  let dryBed: GainNode, wetBed: GainNode, surfBed: GainNode, under: BiquadFilterNode, rainLp: BiquadFilterNode, windBp: BiquadFilterNode, leafBp: BiquadFilterNode;
  let vit = 0, mode: Mode = 'soil', growth = 0, chordDone = false, noteT = 1.5, dripT = 0.8, grainT = 0.2, gust = 0;
  const api: AudioEngine = {
    muted: false,
    start() {
      if (ctx) { void ctx.resume(); return; }
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext; if (!AC) return;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = api.muted ? 0 : 0.9;
      // 小さな音量でも大事な音が聞こえるように、全体を軽く圧縮する
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.3;
      master.connect(comp).connect(ctx.destination);
      verb = ctx.createConvolver(); verb.buffer = reverbBuffer(ctx, 3.2, 0.25); verbIn = ctx.createGain(); verbIn.gain.value = 0.5; verbIn.connect(verb).connect(master);
      music = ctx.createGain(); music.gain.value = 0.55; music.connect(master); music.connect(verbIn);
      sfx = ctx.createGain(); sfx.gain.value = 0.8; sfx.connect(master); sfx.connect(verbIn);
      // 土の中の音は、地面を通して聞こえるので高い音が削れる
      under = ctx.createBiquadFilter(); under.type = 'lowpass'; under.frequency.value = 1400; under.Q.value = 0.3; under.connect(master);
      const loop = (buf: AudioBuffer, gain: number, dest: AudioNode, rate = 1) => { const s = ctx!.createBufferSource(); s.buffer = buf; s.loop = true; s.playbackRate.value = rate; const g = ctx!.createGain(); g.gain.value = gain; s.connect(g).connect(dest); s.start(); return g; };
      const brown = noiseBuffer(ctx, 6, 'brown'), pink = noiseBuffer(ctx, 5, 'pink'), white = noiseBuffer(ctx, 4, 'white');
      // 乾いた土：頭上を渡るくぐもった風（低い帯域の雑音が、ゆっくり強弱する）
      dryBed = ctx.createGain(); dryBed.gain.value = 0; dryBed.connect(under);
      windBp = ctx.createBiquadFilter(); windBp.type = 'bandpass'; windBp.frequency.value = 320; windBp.Q.value = 0.6; windBp.connect(dryBed);
      loop(brown, 0.9, windBp);
      // 湿った土：頭上から響く、くぐもった雨のような水の気配
      wetBed = ctx.createGain(); wetBed.gain.value = 0; wetBed.connect(under);
      rainLp = ctx.createBiquadFilter(); rainLp.type = 'lowpass'; rainLp.frequency.value = 700; rainLp.connect(wetBed);
      loop(pink, 0.35, rainLp);
      // 地上：風と、葉ずれ（高めの帯域の雑音）
      surfBed = ctx.createGain(); surfBed.gain.value = 0; surfBed.connect(master);
      const surfWind = ctx.createBiquadFilter(); surfWind.type = 'lowpass'; surfWind.frequency.value = 600; surfWind.connect(surfBed); loop(brown, 0.5, surfWind, 1.3);
      leafBp = ctx.createBiquadFilter(); leafBp.type = 'bandpass'; leafBp.frequency.value = 3800; leafBp.Q.value = 0.8; leafBp.connect(surfBed); loop(white, 0.05, leafBp);
    },
    setVitality(v) { vit = v; },
    setMode(m) { if (m !== mode) { mode = m; growth = 0; chordDone = false; } },
    setGrowth(g) { growth = g; },
    pause(p) { if (!ctx) return; if (p) void ctx.suspend(); else void ctx.resume(); },
    setMuted(m) { api.muted = m; if (ctx) master.gain.setTargetAtTime(m ? 0 : 0.9, ctx.currentTime, 0.1); },
    chime() {
      // 新しい生き物の紹介：短く上品な2音（鐘のような倍音）
      if (!ctx) return; const t = ctx.currentTime;
      [[880, 0], [1318.5, 0.16]].forEach(([f, dt]) => bell(f, t + dt, 0.12, 2.2, sfx));
    },
    update(dt) {
      if (!ctx || ctx.state !== 'running') return;
      const t = ctx.currentTime, soil = mode === 'soil' ? 1 : 0;
      gust += dt * 0.13;
      const gustAmt = 0.55 + 0.45 * Math.sin(gust) * Math.sin(gust * 0.37 + 1);
      dryBed.gain.setTargetAtTime(soil * (1 - vit) * 0.5 * gustAmt + 0.0001, t, 0.4);
      windBp.frequency.setTargetAtTime(240 + 260 * gustAmt, t, 0.6);
      wetBed.gain.setTargetAtTime(soil * vit * 0.28 + 0.0001, t, 0.6);
      surfBed.gain.setTargetAtTime((1 - soil) * (0.22 + 0.2 * gustAmt) + 0.0001, t, 0.8);
      leafBp.frequency.setTargetAtTime(3200 + 1600 * gustAmt, t, 0.5);
      if (soil) {
        // 乾いた土：ときどき砂粒がこすれる、細かい音
        grainT -= dt; if (grainT <= 0) { grainT = 0.05 + Math.random() * 0.4 / (0.2 + (1 - vit)); if (Math.random() < 1 - vit) grain(t); }
        // 湿った土：水のしずく。活力が上がるほど増える
        dripT -= dt; if (dripT <= 0) { dripT = 0.6 + Math.random() * 3.5 * (1.2 - vit); if (vit > 0.08) drip(t, vit); }
        // ピアノの単音：活力が上がるほど、音の数と高さが増える
        noteT -= dt; if (noteT <= 0) { noteT = 2.6 + Math.random() * 3.2 - vit * 1.6; if (vit > 0.15) { const top = Math.min(SCALE.length - 1, 2 + Math.floor(vit * (SCALE.length - 2))); piano(SCALE[Math.floor(Math.random() * (top + 1))], t, 0.16 + vit * 0.1); } }
      } else {
        // 地上：子葉が開く瞬間に、和音が大きく開く
        if (!chordDone && growth > 0.64) { chordDone = true; CHORD.forEach((f, i) => piano(f, t + i * 0.09, 0.2, 7)); }
        noteT -= dt; if (noteT <= 0) { noteT = 3 + Math.random() * 3; if (growth > 0.3) piano(SCALE[Math.floor(Math.random() * SCALE.length)] * 2, t, 0.08); }
      }
    },
  };

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
