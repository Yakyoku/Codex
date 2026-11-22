"""継ぎ目なく並べられる細部用テクスチャを numpy で作る（外部の素材に頼らない）。
soil_detail.webp: R=細かい粒状感 G=中くらいのむら B=孔（暗い点）  / 512px"""
import numpy as np, os
from PIL import Image
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'tex'); os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)
def fbm(n, beta, seed):
    r = np.random.default_rng(seed); f = np.fft.fftfreq(n)[:, None] ** 2 + np.fft.fftfreq(n)[None, :] ** 2; f[0, 0] = 1
    spec = (r.normal(size=(n, n)) + 1j * r.normal(size=(n, n))) / f ** (beta / 2); spec[0, 0] = 0
    x = np.fft.ifft2(spec).real; x = (x - x.min()) / (x.max() - x.min()); return x
def worley(n, pts, seed):
    r = np.random.default_rng(seed); p = r.random((pts, 2)) * n; yy, xx = np.mgrid[0:n, 0:n]; d = np.full((n, n), 1e9)
    for px, py in p:
        dx = np.abs(xx - px); dx = np.minimum(dx, n - dx); dy = np.abs(yy - py); dy = np.minimum(dy, n - dy); d = np.minimum(d, np.hypot(dx, dy))
    return d / d.max()
n = 512
fine = fbm(n, 1.1, 1); fine = np.clip((fine - 0.5) * 2.2 + 0.5, 0, 1)
mid = fbm(n, 2.2, 2)
pores = 1 - np.clip(worley(n, 420, 3) * 3.2, 0, 1) ** 0.6; pores = np.clip(pores * 1.6 - 0.15, 0, 1) * (fbm(n, 1.8, 4) > 0.45)
img = np.dstack([fine, mid, pores]); Image.fromarray((img * 255).astype(np.uint8)).save(os.path.join(OUT, 'soil_detail.webp'), quality=88)
print('soil_detail.webp', os.path.getsize(os.path.join(OUT, 'soil_detail.webp')) // 1024, 'KB')
