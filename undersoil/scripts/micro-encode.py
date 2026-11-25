"""拡大像の動画を作る：Blender（Cycles）で描いたコマ assets/out/micro/<種>/f*.png を、顕微鏡の写真らしく仕上げて動画にする。
  ・細菌（bacillus, pseudomonas）：写真は位相差顕微鏡なので、明視野の像を位相差の見え方に変換する
      （位相差の特徴：細胞は暗い灰色、まわりに明るいにじみ〈ハロー〉、芽胞は白く光る）
  ・全部：周辺が少し暗い（対物レンズの周辺減光）、細かいざらつき（カメラのノイズ）
出力: public/micro/<種>.webm（VP9）、<種>.mp4（H.264、iPhone 用）、<種>.webp（最初のコマ。読み込み中の表示）
実行: python3 scripts/micro-encode.py <種> [<種> ...]"""
import sys, os, glob, subprocess, shutil
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PUB = os.path.join(ROOT, 'public', 'micro'); os.makedirs(PUB, exist_ok=True)

def blur(a, r):
    im = Image.fromarray(np.clip(a * 255, 0, 255).astype(np.uint8)); return np.asarray(im.filter(ImageFilter.GaussianBlur(r)), np.float32) / 255

def phase(rgb):
    L = rgb.mean(2); b = float(np.median(L)); d = np.clip(b - L, 0, 1); bright = np.clip(L - b, 0, 1)
    out = 0.55 - 1.6 * d + 3.2 * np.clip(blur(d, 3) - d, 0, 1) - 0.6 * np.clip(d - blur(d, 3), 0, 1) + 1.4 * bright
    out = np.clip(out, 0, 1)
    return np.stack([out * 0.98, out * 0.99, out], 2)

def finish(rgb, seed):
    h, w = rgb.shape[:2]; y, x = np.mgrid[0:h, 0:w]; r2 = ((x - w / 2) / (w / 2)) ** 2 + ((y - h / 2) / (h / 2)) ** 2
    rgb = rgb * (1 - 0.10 * r2)[..., None]
    rng = np.random.default_rng(seed); rgb = rgb + rng.normal(0, 0.012, rgb.shape[:2])[..., None]
    return np.clip(rgb, 0, 1)

for kind in sys.argv[1:]:
    src = sorted(glob.glob(os.path.join(ROOT, 'assets', 'out', 'micro', kind, 'f*.png')))
    tmp = os.path.join(ROOT, 'assets', 'out', 'micro', kind + '_post'); shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp)
    for i, f in enumerate(src):
        a = np.asarray(Image.open(f).convert('RGB'), np.float32) / 255
        if kind in ('bacillus', 'pseudomonas'): a = phase(a)
        a = finish(a, i)
        Image.fromarray((a * 255 + 0.5).astype(np.uint8)).save(os.path.join(tmp, f'p{i:04d}.png'))
    fps = '16'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', fps, '-i', os.path.join(tmp, 'p%04d.png'), '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '36', '-pix_fmt', 'yuv420p', '-an', os.path.join(PUB, kind + '.webm')], check=True)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', fps, '-i', os.path.join(tmp, 'p%04d.png'), '-c:v', 'libx264', '-crf', '26', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', os.path.join(PUB, kind + '.mp4')], check=True)
    Image.open(os.path.join(tmp, 'p0000.png')).save(os.path.join(PUB, kind + '.webp'), quality=82)
    print(kind, len(src), 'frames', {e: os.path.getsize(os.path.join(PUB, kind + e)) // 1024 for e in ('.webm', '.mp4', '.webp')}, 'KB')
