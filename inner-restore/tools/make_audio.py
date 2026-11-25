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
# ---- ステージ2「鼻」 ----
# 線毛の森：吸う息・吐く息のような、ゆっくり満ち引きする空気の音（4秒ごと）＋細かくそろった打つ音（線毛の拍子、0.55 回/秒の柔らかい刻み）
breath = lp(pink(len(t)), 900) * (0.35 + 0.65 * (0.5 + 0.5 * np.sin(2 * np.pi * t / 4.0)) ** 2); breath /= np.abs(breath).max()
tick = np.zeros_like(t)
for k in range(int((T + XF) * 0.55) + 1):
    t0 = k / 0.55; m = (t > t0) & (t < t0 + 0.4); x = t[m] - t0; tick[m] += np.sin(2 * np.pi * 520 * x) * np.exp(-x / 0.06) * 0.25
save("cilia", pad([196, 293.66, 392], 0.25) + 0.35 * breath + tick)
# 粘液の川：低く流れる音と、ときどき浮かぶ泡のような音
flow2 = lp(pink(len(t)), 220); flow2 /= np.abs(flow2).max()
save("mucus", pad([130.81, 196, 261.63], 0.3) + 0.4 * flow2 + bells(14, 300, 600, 0.04, 0.5))
# 嗅上皮：においの分子が届くたびに、色の違う澄んだ音が重なる
save("olfactory", pad([220, 329.63, 440, 554.37], 0.3, 0.2) + bells(36, 700, 2000, 0.045, 1.4) + 0.06 * lp(pink(len(t)), 1200))
# ---- ステージ3「肺」：8秒で1回の呼吸（吸う 40%・吐く 60%）に合わせた空気の音 ----
ph = (t % 8.0) / 8.0
breath8 = np.where(ph < 0.4, np.sin(ph / 0.4 * np.pi), 0.7 * np.sin((ph - 0.4) / 0.6 * np.pi))
air = lp(pink(len(t)), 1400) * (0.15 + 0.85 * breath8 ** 2); air /= np.abs(air).max()
save("bronchiole", pad([174.61, 261.63, 349.23], 0.25) + 0.45 * air)
save("alveolus", pad([146.83, 220, 293.66, 440], 0.35, 0.2) + 0.4 * air + bells(10, 900, 1500, 0.03, 2))
save("alvwall", pad([110, 164.81, 220], 0.4) + 0.35 * air + 0.1 * lp(pink(len(t)), 300))
