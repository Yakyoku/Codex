"""MakeHuman（CC0）のベースの人体に体型の調整データを掛け合わせ、主人公の体の土台を作る。
   曲線を強調した、しなやかな女性の体（くびれ、腰回り、お尻、太もも、長い脚）。顔はヘルメットの中で見えない。
   出力: assets/models/mh_body.npz（頂点・面・UV・関節の位置）。座標は Blender の向き（z が上、正面 -Y）、身長（頭頂）1.83。"""
import numpy as np, os, re
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MH = os.path.join(ROOT, "assets", "makehuman")
# 体型の調整（重み）
W = {
    "caucasian-female-young": 1 / 3, "african-female-young": 1 / 3, "asian-female-young": 1 / 3,   # 女性・若い（人種は平均）
    "universal-female-young-maxmuscle-minweight": 0.35,     # 引き締まった運動選手の体
    "female-young-averagemuscle-averageweight-maxheight": 0.45,
    "female-young-averagemuscle-averageweight-idealproportions": 1.0,
    "female-young-averagemuscle-averageweight-maxcup-averagefirmness": 0.32,
    "hip-scale-horiz-incr": 0.45, "buttocks-volume-incr": 0.55, "hip-waist-up": 0.25,
    "stomach-pregnant-decr": 0.6, "torso-vshape-decr": 0.35, "torso-scale-horiz-decr": 0.18,
    "upperlegs-height-incr": 0.35, "lowerlegs-height-incr": 0.35,
    "l-upperleg-muscle-incr": 0.4, "r-upperleg-muscle-incr": 0.4, "l-lowerleg-muscle-incr": 0.3, "r-lowerleg-muscle-incr": 0.3,
    "l-upperarm-fat-decr": 0.4, "r-upperarm-fat-decr": 0.4, "neck-scale-horiz-decr": 0.3,
}
V, VT, F, FT, G = [], [], [], [], []
group = None; gfaces = {}
for line in open(os.path.join(MH, "base.obj")):
    if line.startswith("v "): V.append([float(x) for x in line.split()[1:4]])
    elif line.startswith("vt "): VT.append([float(x) for x in line.split()[1:3]])
    elif line.startswith("g "): group = line.split()[1]
    elif line.startswith("f "):
        idx = [p.split("/") for p in line.split()[1:]]
        gfaces.setdefault(group, []).append(([int(a[0]) - 1 for a in idx], [int(a[1]) - 1 for a in idx]))
V = np.array(V); VT = np.array(VT)
for name, w in W.items():
    for line in open(os.path.join(MH, "targets", name + ".target")):
        if line.startswith("#") or not line.strip(): continue
        i, dx, dy, dz = line.split(); V[int(i)] += w * np.array([float(dx), float(dy), float(dz)])
body = gfaces["body"]
joints = {}
for g, fs in gfaces.items():
    if g.startswith("joint-"):
        ids = sorted({i for f, _ in fs for i in f}); joints[g[6:]] = V[ids].mean(0)
# 体の面に使われる頂点だけを残す
used = sorted({i for f, _ in body for i in f}); remap = -np.ones(len(V), int); remap[used] = np.arange(len(used))
Vb = V[used]
# 向き：MakeHuman は y が上・正面 +z → Blender は z が上・正面 -y。身長を 1.83 に
def conv(p): return np.stack([p[..., 0], -p[..., 2], p[..., 1]], -1)
Vb = conv(Vb); J = {k: conv(v) for k, v in joints.items()}
zmin = Vb[:, 2].min(); h = Vb[:, 2].max() - zmin; s = 1.83 / h
Vb = (Vb - [0, 0, zmin]) * s; J = {k: (v - [0, 0, zmin]) * s for k, v in J.items()}
faces = [remap[np.array(f)] for f, _ in body]; fuv = [np.array(t) for _, t in body]
np.savez_compressed(os.path.join(ROOT, "assets", "models", "mh_body.npz"), verts=Vb.astype(np.float32),
                    faces=np.array([f.tolist() + [-1] * (4 - len(f)) for f in faces]), fuv=np.array([t.tolist() + [-1] * (4 - len(t)) for t in fuv]),
                    uv=VT.astype(np.float32), jn=np.array(list(J.keys())), jp=np.array(list(J.values()), np.float32))
print("verts", len(Vb), "faces", len(faces), "height", round(Vb[:, 2].max(), 3), "joints", len(J))
for k in ("pelvis", "spine-3", "spine-1", "neck", "head", "l-upper-leg", "l-knee", "l-ankle", "l-shoulder", "l-elbow", "l-hand", "l-clavicle"):
    if k in J: print(k, np.round(J[k], 3))
