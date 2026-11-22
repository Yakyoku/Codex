"""シェーダーで毎コマ計算していたノイズを、繰り返して貼れる 256×256 の画像にあらかじめ焼いておく（軽量化）。
   R=細胞の境目（ボロノイの縁, 8×8個）, G=細かいゆらぎ, B=大きな雲状のゆらぎ, A=中くらいのゆらぎ。どれも上下左右につながる。
   出力: public/static/img/noise.png"""
import numpy as np, os
from PIL import Image
N = 256; rng = np.random.default_rng(3)
def fbm(lo, hi, beta):
    f = np.fft.fftfreq(N)[:, None] ** 2 + np.fft.fftfreq(N)[None, :] ** 2
    f = np.sqrt(f) * N
    amp = np.where((f >= lo) & (f <= hi), 1.0 / np.maximum(f, 1) ** beta, 0)
    ph = np.exp(2j * np.pi * rng.random((N, N)))
    x = np.real(np.fft.ifft2(amp * ph)); x -= x.min(); return x / x.max()
# ボロノイの縁（F2-F1）。点は格子ごとに1つ、距離は周期的に測る
C = 8; pts = (np.stack(np.meshgrid(np.arange(C), np.arange(C), indexing="ij"), -1) + rng.random((C, C, 2))).reshape(-1, 2) / C
yy, xx = np.meshgrid(np.arange(N) / N, np.arange(N) / N, indexing="ij")
P = np.stack([yy, xx], -1).reshape(-1, 1, 2)
d = np.abs(P - pts[None]); d = np.minimum(d, 1 - d); d = np.sqrt((d ** 2).sum(-1)) * C
d.sort(axis=1); edge = (d[:, 1] - d[:, 0]).reshape(N, N)
edge = 1 - np.clip(edge / 0.45, 0, 1)               # 境目で 1
img = np.stack([edge, fbm(8, 96, 1.0), fbm(1, 10, 1.4), fbm(3, 32, 1.1)], -1)
out = os.path.join(os.path.dirname(__file__), "..", "public", "static", "img", "noise.png")
Image.fromarray((img * 255 + 0.5).astype(np.uint8), "RGBA").save(out, optimize=True)
print(out, os.path.getsize(out))
