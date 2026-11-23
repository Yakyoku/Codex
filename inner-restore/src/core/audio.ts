// 音：Web Audio API を直接使い、その場で合成する（M1 の仮の音。素材ファイルは使わない）。
// ユーザーの操作のあとで start() を呼ぶこと。
export class GameAudio {
  ctx: AudioContext | null = null;
  private master!: GainNode; private muffle!: BiquadFilterNode;
  private drone: { o: OscillatorNode; g: GainNode; sick: number; well: number }[] = [];
  private flowG!: GainNode; private beamG!: GainNode; private lastBeat = 0;
  volume = 0.8;
  start() {
    if (this.ctx) { void this.ctx.resume(); return; }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const c = (this.ctx = new AC());
    this.master = c.createGain(); this.master.gain.value = this.volume;
    const comp = c.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
    this.muffle = c.createBiquadFilter(); this.muffle.type = 'lowpass'; this.muffle.frequency.value = 900; this.muffle.Q.value = 0.4;
    this.muffle.connect(comp); comp.connect(this.master); this.master.connect(c.destination);
    // 持続音：病んだ状態は半音でぶつかる濁った響き、健康な状態は開いた協和音（目の主題＝ガラス質の音）
    const tones: [number, number][] = [[110, 110], [116.54, 164.81], [155.56, 220], [233.08, 277.18], [311.13, 329.63]];
    for (const [sick, well] of tones) {
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = sick;
      const g = c.createGain(); g.gain.value = 0.0; o.connect(g); g.connect(this.muffle); o.start();
      const l = c.createOscillator(); l.frequency.value = 0.07 + Math.random() * 0.1; const lg = c.createGain(); lg.gain.value = 0.012; l.connect(lg); lg.connect(g.gain); l.start();
      this.drone.push({ o, g, sick, well });
    }
    // 血流：低く濾した雑音
    const noise = this.noise(4);
    const ns = c.createBufferSource(); ns.buffer = noise; ns.loop = true;
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260;
    this.flowG = c.createGain(); this.flowG.gain.value = 0; ns.connect(lp); lp.connect(this.flowG); this.flowG.connect(this.muffle); ns.start();
    // 浄化ビーム：やわらかな帯域の雑音＋高い純音
    const bs = c.createBufferSource(); bs.buffer = noise; bs.loop = true;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1900; bp.Q.value = 2.5;
    this.beamG = c.createGain(); this.beamG.gain.value = 0; bs.connect(bp); bp.connect(this.beamG);
    const sh = c.createOscillator(); sh.frequency.value = 880; const shg = c.createGain(); shg.gain.value = 0.25; sh.connect(shg); shg.connect(this.beamG); sh.start();
    this.beamG.connect(this.muffle); bs.start();
  }
  private noise(sec: number) {
    const c = this.ctx!; const b = c.createBuffer(1, c.sampleRate * sec, c.sampleRate); const d = b.getChannelData(0); let last = 0;
    for (let i = 0; i < d.length; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
    return b;
  }
  /** 毎フレーム：健康度・流れ・ビームの状態を音に反映する */
  update(mean: number, flow: number, beam: boolean, heartPhase: number) {
    const c = this.ctx; if (!c) return; const t = c.currentTime;
    this.master.gain.setTargetAtTime(this.volume, t, 0.1);
    this.muffle.frequency.setTargetAtTime(700 + 5200 * mean * mean, t, 0.4);
    this.drone.forEach((d, i) => {
      d.o.frequency.setTargetAtTime(d.sick + (d.well - d.sick) * smooth(mean), t, 0.8);
      d.g.gain.setTargetAtTime((i === 0 ? 0.11 : 0.05) * (0.7 + 0.3 * mean), t, 0.5);
    });
    this.flowG.gain.setTargetAtTime(0.02 + 0.3 * flow, t, 0.5);
    this.beamG.gain.setTargetAtTime(beam ? 0.05 : 0, t, 0.08);
    // 心拍：位相が一回りするたびに、低い二つの音（ドッ・クン）
    const beat = Math.floor(heartPhase / (Math.PI * 2));
    if (beat !== this.lastBeat) { this.lastBeat = beat; this.thump(t, 58, 0.5); this.thump(t + 0.16, 46, 0.32); }
  }
  private thump(t: number, f: number, g: number) {
    const c = this.ctx!; const o = c.createOscillator(); const e = c.createGain();
    o.frequency.setValueAtTime(f * 1.6, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.08);
    e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(g, t + 0.02); e.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    o.connect(e); e.connect(this.master); o.start(t); o.stop(t + 0.35);
  }
  /** ガラス質の短い音（紹介・図鑑登録）。freqs を少しずつずらして鳴らす */
  chime(freqs = [1318.5, 1975.5], gain = 0.12) {
    const c = this.ctx; if (!c) return; const t = c.currentTime;
    freqs.forEach((f, i) => {
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f; const e = c.createGain();
      const s = t + i * 0.11; e.gain.setValueAtTime(0.0001, s); e.gain.exponentialRampToValueAtTime(gain, s + 0.01); e.gain.exponentialRampToValueAtTime(0.0001, s + 1.6);
      o.connect(e); e.connect(this.master); o.start(s); o.stop(s + 1.7);
    });
  }
  /** 浄化の光が病んだ組織に触れた瞬間：やわらかく「ぽっ」と当たる音 */
  hit() { const c = this.ctx; if (!c) return; this.thump(c.currentTime, 220, 0.18); this.chime([987.8], 0.03); }
  /** 一区切り回復したとき：小さく和音が開く（回復の手応え） */
  restored(step: number) { const base = [392, 440, 493.9, 523.3, 587.3, 659.3][step % 6]; this.chime([base, base * 1.5, base * 2], 0.05); }
  /** 回復の瞬間：和音が開く */
  resolve() { this.chime([220, 277.18, 329.63, 440, 554.37, 659.25], 0.09); }
  suspend(on: boolean) { if (this.ctx) void (on ? this.ctx.suspend() : this.ctx.resume()); }
}
const smooth = (x: number) => x * x * (3 - 2 * x);

/** ナレーション（仮の音声）：ブラウザの読み上げ機能。使えない機器では字幕だけになる */
export function speak(text: string, enabled = true) {
  try {
    if (!enabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = 'ja-JP'; u.rate = 0.95; u.pitch = 0.9; u.volume = 0.9;
    const v = window.speechSynthesis.getVoices().find((x) => x.lang.startsWith('ja'));
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  } catch { /* 読み上げなしで続ける */ }
}
