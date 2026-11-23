"""区域ごとの環境音（つなぎ目なくくり返す 24 秒）を、数式で合成して AAC（.m4a）にする。
   retina … 温かい和音の持続音と、ゆっくり満ち引きする流れの音（血流）
   lens   … ガラス質の高い響き（ゆっくり立ち上がる、わずかにずれた倍音）がきらめく
   photo  … 深い持続音と、ときどき光が当たるような小さな澄んだ音
   ゲーム側で、病んでいる間は高い音を削り（くぐもる）、治るほど澄ませる。出力: public/static/audio/<id>.m4a"""
import numpy as np, subprocess, os, wave
SR, T, XF = 32000, 24.0, 2.0
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "static", "audio")
rng = np.random.default_rng(7)
t = np.arange(int(SR * (T + XF))) / SR

def env(x, a, d):  # 立ち上がり a 秒、減衰 d 秒
    return np.clip(x / a, 0, 1) * np.exp(-np.maximum(0, x - a) / d)
def pink(n):
    w = rng.standard_normal(n); f = np.fft.rfft(w); k = np.arange(len(f)); f[1:] /= np.sqrt(k[1:]); return np.fft.irfft(f, n)
def lp(x, fc):
    f = np.fft.rfft(x); fr = np.fft.rfftfreq(len(x), 1 / SR); f *= 1 / (1 + (fr / fc) ** 4); return np.fft.irfft(f, len(x))
def pad(freqs, amp=0.1, beat=0.15):
    y = np.zeros_like(t)
    for i, f in enumerate(freqs):
        ph = rng.uniform(0, 6.28)
        for det in (-beat, beat):
            y += amp / len(freqs) * np.sin(2 * np.pi * (f + det) * t + ph) * (0.75 + 0.25 * np.sin(2 * np.pi * (0.03 + 0.02 * i) * t + ph))
    return y
def bells(n, lo, hi, amp, dec):
    y = np.zeros_like(t)
    for _ in range(n):
        t0 = rng.uniform(0, T); f = rng.uniform(lo, hi); x = t - t0; m = x > 0
        part = sum(np.sin(2 * np.pi * f * r * x[m]) / (k + 1) for k, r in enumerate((1, 2.76, 5.4)))
        y[m] += amp * env(x[m], 0.6, dec) * part
    return y
def loop(y):
    n, x = int(SR * T), int(SR * XF)
    out = y[:n].copy(); w = np.linspace(0, 1, x); out[:x] = out[:x] * w + y[n:n + x] * (1 - w); return out
def save(name, y):
    y = loop(y); y = y / (np.abs(y).max() + 1e-9) * 0.7
    wav = os.path.join(OUT, f"_{name}.wav")
    with wave.open(wav, "wb") as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((y * 32767).astype(np.int16).tobytes())
    m4a = os.path.join(OUT, f"{name}.m4a")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-c:a", "aac", "-b:a", "40k", m4a], check=True); os.remove(wav)
    print(name, os.path.getsize(m4a))

# 網膜：A の温かい和音（A2 E3 A3 C#4 E4）＋ゆっくり満ち引きする流れ
flow = lp(pink(len(t)), 300) * (0.6 + 0.4 * np.sin(2 * np.pi * t / 6.0)); flow /= np.abs(flow).max()
save("retina", pad([110, 164.81, 220, 277.18, 329.63], 0.5) + 0.22 * flow + bells(6, 600, 900, 0.03, 3))
# 水晶体：ガラス質のきらめき（高い倍音の鈴）＋淡い持続音（E4 B4）
save("lens", pad([329.63, 493.88, 659.25], 0.22, 0.4) + bells(40, 900, 2400, 0.05, 2.2) + 0.05 * lp(pink(len(t)), 2000))
# 視細胞：深い持続音（D2 A2 D3 F#3）＋ときどき光が当たる小さな音
save("photo", pad([73.42, 110, 146.83, 185], 0.6, 0.1) + bells(26, 1200, 1800, 0.035, 0.6) + 0.08 * lp(pink(len(t)), 500))
