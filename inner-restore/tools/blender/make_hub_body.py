"""全身マップ（ハブ）の人体：患者・灯（あかり）。MakeHuman（CC0）のベースの体を、体型の調整なし（中性的な体）でそのまま使う。
   面を減らして軽くし、なめらかにして GLB に。器官の目印の位置の計算に使う関節の位置を JSON に書く。
   出力: public/static/models/hub_body.glb（tools/pack-glb.mjs で最適化）, public/static/data/hub.json（y が上、正面 +z、身長 1.7）"""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np, bpy
import irlib as L
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MH = os.path.join(ROOT, "assets", "makehuman")
V, gf = [], {}; g = None
for line in open(os.path.join(MH, "base.obj")):
    if line.startswith("v "): V.append([float(x) for x in line.split()[1:4]])
    elif line.startswith("g "): g = line.split()[1]
    elif line.startswith("f "): gf.setdefault(g, []).append([int(p.split("/")[0]) - 1 for p in line.split()[1:]])
V = np.array(V)
J = {k[6:]: V[sorted({i for f in fs for i in f})].mean(0) for k, fs in gf.items() if k.startswith("joint-")}
body = gf["body"]; used = sorted({i for f in body for i in f}); remap = -np.ones(len(V), int); remap[used] = np.arange(len(used))
Vb = V[used]; ymin = Vb[:, 1].min(); s = 1.7 / (Vb[:, 1].max() - ymin)
norm = lambda p: ((p - [0, ymin, 0]) * s)
Vb = norm(Vb); J = {k: norm(v) for k, v in J.items()}
# Blender は z が上・正面 -y。three（y が上・正面 +z）へは書き出しで戻る
conv = lambda p: np.stack([p[..., 0], -p[..., 2], p[..., 1]], -1)
L.reset()
ob = L.mesh_object("hub_body", conv(Vb), [remap[f].tolist() for f in body], smooth=True)
L.select_only(ob)
m = ob.modifiers.new("dec", "DECIMATE"); m.ratio = 0.45; bpy.ops.object.modifier_apply(modifier=m.name)
m = ob.modifiers.new("sm", "SMOOTH"); m.factor = 0.4; m.iterations = 2; bpy.ops.object.modifier_apply(modifier=m.name)
bpy.ops.object.shade_smooth()
mat = bpy.data.materials.new("body"); ob.data.materials.append(mat)
size = L.export_glb([ob], os.path.join(L.OUT_MODELS, "hub_body.raw.glb"))
keep = ["l-eye", "r-eye", "head", "neck", "spine-1", "spine-2", "spine-3", "spine-4", "pelvis", "l-clavicle", "r-clavicle", "l-shoulder", "r-shoulder", "l-hand", "r-hand", "l-elbow", "r-elbow", "l-upper-leg", "r-upper-leg", "l-knee", "r-knee", "l-ankle", "r-ankle"]
out = {k: [round(float(x), 4) for x in J[k]] for k in keep if k in J}
os.makedirs(os.path.join(ROOT, "public", "static", "data"), exist_ok=True)
json.dump({"height": 1.7, "joints": out}, open(os.path.join(ROOT, "public", "static", "data", "hub.json"), "w"), ensure_ascii=False, indent=1)
print("STATS", json.dumps({"raw_bytes": size, "tris": sum(len(p.vertices) - 2 for p in ob.data.polygons), "joints": len(out)}))
