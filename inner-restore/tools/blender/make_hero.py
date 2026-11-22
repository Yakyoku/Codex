"""主人公（第5版）：持ち主の参考画像 Docs/REFERENCE/hero/reference-v3.jpg に沿った潜行士。作り事の存在。
   参考画像の要点：中くらいの紫のボディスーツの上に、淡いラベンダーの「厚みのある装甲の板」を重ねる。
     胸当て／腹の段／背中／腰の板／お尻の板／肩当て／上腕の板／籠手／太ももの板／ひざ当て／すね当て／装甲ブーツ。
     丸いヘルメットと黒い大きなバイザー、背中の小さなユニット。運動選手のような、しっかりした体つき。
   作り方：
     1. 体を「距離の式」で定義し、マーチングキューブで継ぎ目のない1枚の曲面にする
     2. 装甲の板も同じ式から作る：体の表面から少し浮いた薄い殻と、板の形（箱・球・帯）の重なりを、細かい格子で切り出す
     3. ボーンを入れ、体は自動の重み、板は「いちばん近い体の点」の重みを写して、体と一緒に曲がるようにする
     4. 陰（AO）を頂点の色に焼き込み（色と掛け合わせる）、GLB で書き出す
   身長 2.0（ヘルメットの上端）。Blender は z が上、正面は -Y、+X が本人の左。
   出力: assets/models/diver.raw.glb, assets/models/diver.blend"""
import sys, os, math, time
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np, bpy, bmesh
from mathutils import Vector, Quaternion, kdtree
import irlib as L
from skimage.measure import marching_cubes

T0 = time.time()
# ---------------- 距離の式の部品 ----------------
def round_cone(P, a, b, r1, r2):
    a, b = np.asarray(a, np.float32), np.asarray(b, np.float32)
    ba = b - a; l2 = float(ba @ ba); rr = r1 - r2; a2 = l2 - rr * rr; il2 = 1.0 / l2
    pa = P - a; y = pa @ ba; z = y - l2
    x = pa * l2 - y[:, None] * ba; x2 = (x * x).sum(1); y2 = y * y * l2; z2 = z * z * l2
    k = np.sign(rr) * rr * rr * x2
    return np.where(np.sign(z) * a2 * z2 > k, np.sqrt(x2 + z2) * il2 - r2,
           np.where(np.sign(y) * a2 * y2 < k, np.sqrt(x2 + y2) * il2 - r1, (np.sqrt(x2 * a2 * il2) + y * rr) * il2 - r1))
def ellipsoid(P, c, r):
    q = (P - np.asarray(c, np.float32)); r = np.asarray(r, np.float32)
    k0 = np.linalg.norm(q / r, axis=1); k1 = np.linalg.norm(q / (r * r), axis=1)
    return k0 * (k0 - 1.0) / np.maximum(k1, 1e-6)
def smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0, 1); return b * (1 - h) + a * h - k * h * (1 - h)
def smax(a, b, k): return -smin(-a, -b, k)
def box(P, c, h, r=0.0):
    q = np.abs(P - np.asarray(c, np.float32)) - np.asarray(h, np.float32)
    return np.linalg.norm(np.maximum(q, 0), axis=1) + np.minimum(q.max(1), 0) - r
def sph(P, c, r): return np.linalg.norm(P - np.asarray(c, np.float32), axis=1) - r
def zband(P, z0, z1): return np.maximum(z0 - P[:, 2], P[:, 2] - z1)
def half(P, n, d):   # n·P < d の側が内側
    return (P @ np.asarray(n, np.float32)) - d
def lerp(a, b, t): return tuple(np.asarray(a) * (1 - t) + np.asarray(b) * t)

# ---------------- 体つき（運動選手のような、しっかりした体） ----------------
S = {}
for side, sx in (("L", 1), ("R", -1)):
    S[side] = dict(sh=(sx * 0.196, 0.006, 1.545), el=(sx * 0.258, 0.016, 1.29), wr=(sx * 0.296, -0.004, 1.05), hd=(sx * 0.306, -0.018, 0.9),
                   hip=(sx * 0.092, 0.0, 0.975), kn=(sx * 0.104, -0.006, 0.53), an=(sx * 0.108, 0.016, 0.118), toe=(sx * 0.112, -0.17, 0.034))
PARTS = []
def part(name, f): PARTS.append((name, f))
part("torso", lambda P: smin(smin(smin(ellipsoid(P, (0, 0.004, 1.035), (0.172, 0.118, 0.12)), ellipsoid(P, (0, 0.006, 1.245), (0.106, 0.08, 0.13)), 0.055),
                                   ellipsoid(P, (0, 0.002, 1.415), (0.15, 0.105, 0.165)), 0.05), ellipsoid(P, (0, 0.012, 1.56), (0.178, 0.084, 0.06)), 0.04))
part("glute", lambda P: np.minimum(ellipsoid(P, (0.074, 0.046, 0.995), (0.088, 0.084, 0.096)), ellipsoid(P, (-0.074, 0.046, 0.995), (0.088, 0.084, 0.096))))
part("bust", lambda P: np.minimum(ellipsoid(P, (0.066, -0.068, 1.458), (0.062, 0.052, 0.058)), ellipsoid(P, (-0.066, -0.068, 1.458), (0.062, 0.052, 0.058))))
part("neck", lambda P: np.minimum(round_cone(P, (0, 0.01, 1.58), (0, 0.004, 1.71), 0.058, 0.052), ellipsoid(P, (0, 0.0, 1.79), (0.085, 0.095, 0.1))))
for side, sx in (("L", 1), ("R", -1)):
    J = S[side]
    part("delt" + side, lambda P, sx=sx: ellipsoid(P, (sx * 0.196, 0.004, 1.545), (0.068, 0.072, 0.076)))
    part("uarm" + side, lambda P, J=J: round_cone(P, J["sh"], J["el"], 0.054, 0.043))
    part("farm" + side, lambda P, J=J, sx=sx: smin(round_cone(P, J["el"], J["wr"], 0.045, 0.031), ellipsoid(P, (sx * 0.27, 0.008, 1.212), (0.047, 0.049, 0.08)), 0.02))
    part("hand" + side, lambda P, J=J, sx=sx: smin(smin(ellipsoid(P, (sx * 0.304, -0.014, 0.988), (0.021, 0.043, 0.056)),
                                                         round_cone(P, (sx * 0.306, -0.018, 0.95), (sx * 0.309, -0.024, 0.878), 0.018, 0.012), 0.012),
                                                    round_cone(P, (sx * 0.294, -0.044, 1.0), (sx * 0.288, -0.068, 0.96), 0.012, 0.009), 0.01))
    part("thigh" + side, lambda P, J=J, sx=sx: smin(round_cone(P, J["hip"], J["kn"], 0.098, 0.058), ellipsoid(P, (sx * 0.11, -0.006, 0.83), (0.082, 0.09, 0.14)), 0.03))
    part("knee" + side, lambda P, J=J: ellipsoid(P, (J["kn"][0], J["kn"][1] - 0.008, J["kn"][2]), (0.055, 0.056, 0.062)))
    part("shin" + side, lambda P, J=J, sx=sx: smin(round_cone(P, J["kn"], J["an"], 0.053, 0.035), ellipsoid(P, (sx * 0.105, 0.03, 0.4), (0.057, 0.061, 0.118)), 0.025))
    part("foot" + side, lambda P, J=J, sx=sx: np.maximum(smin(smin(ellipsoid(P, (sx * 0.11, -0.065, 0.044), (0.05, 0.12, 0.044)), ellipsoid(P, (sx * 0.108, 0.034, 0.052), (0.046, 0.054, 0.052)), 0.02),
                                                              ellipsoid(P, (sx * 0.108, 0.016, 0.112), (0.042, 0.044, 0.066)), 0.02), -P[:, 2] + 0.002))
names = [n for n, _ in PARTS]
BLEND = {"torso": 0.0, "glute": 0.035, "bust": 0.03, "neck": 0.03}
def sdf(P, labels=False):
    vals = np.stack([f(P) for _, f in PARTS], 1)
    if labels: return vals.argmin(1)
    d = vals[:, 0]
    for i, (n, _) in enumerate(PARTS[1:], start=1):
        d = smin(d, vals[:, i], BLEND.get(n, 0.022 if n.startswith(("delt", "uarm", "thigh")) else 0.016))
    return d

def grid_field(fn, lo, hi, vox):
    lo = np.asarray(lo, np.float32); hi = np.asarray(hi, np.float32)
    n = (np.ceil((hi - lo) / vox)).astype(int) + 1
    xs, ys, zs = [lo[i] + np.arange(n[i], dtype=np.float32) * vox for i in range(3)]
    vol = np.empty(tuple(n), np.float32); X, Y = np.meshgrid(xs, ys, indexing="ij")
    for k in range(n[2]):
        P = np.stack([X.ravel(), Y.ravel(), np.full(X.size, zs[k], np.float32)], 1); vol[:, :, k] = fn(P).reshape(n[0], n[1])
    return vol, lo
BLO, BHI = (-0.42, -0.24, -0.01), (0.42, 0.22, 1.86)
vol, lo = grid_field(sdf, BLO, BHI, 0.0042)
verts, faces, _, _ = marching_cubes(vol, 0.0, spacing=(0.0042,) * 3); verts += lo
print("BODY_MC", len(faces), round(time.time() - T0, 1))

# ---------------- 装甲の板の設計図 ----------------
# 各板：(名前, 板の形の式, 体からの浮き, 厚み, 材質, 目標の三角形数)
PL = []
def plate(name, region, off=0.005, th=0.0045, mat="armor", tris=1400): PL.append((name, region, off, th, mat, tris))
plate("breast", lambda P: smax(smax(box(P, (0, -0.05, 1.45), (0.135, 0.09, 0.098), 0.012), half(P, (0, 1, 0), 0.01), 0.01), -half(P, (0, 0, 1), 1.375), 0.008), 0.0055, 0.005, tris=2400)
plate("abs1", lambda P: smax(box(P, (0, -0.07, 1.31), (0.058, 0.07, 0.03), 0.008), half(P, (0, 1, 0), -0.02), 0.006), 0.0045, 0.0045, tris=500)
plate("abs2", lambda P: smax(box(P, (0, -0.07, 1.236), (0.054, 0.07, 0.028), 0.008), half(P, (0, 1, 0), -0.02), 0.006), 0.0045, 0.0045, tris=500)
plate("abs3", lambda P: smax(box(P, (0, -0.07, 1.168), (0.05, 0.07, 0.024), 0.008), half(P, (0, 1, 0), -0.02), 0.006), 0.0045, 0.0045, tris=400)
plate("back", lambda P: smax(box(P, (0, 0.06, 1.445), (0.128, 0.08, 0.1), 0.012), -half(P, (0, 1, 0), 0.012), 0.01), 0.0055, 0.005, tris=1600)
plate("lback", lambda P: smax(box(P, (0, 0.06, 1.25), (0.075, 0.07, 0.07), 0.01), -half(P, (0, 1, 0), 0.03), 0.01), 0.0045, 0.0045, tris=700)
plate("belt", lambda P: zband(P, 1.112, 1.138), 0.004, 0.006, "accent", tris=900)
for side, sx in (("L", 1), ("R", -1)):
    J = S[side]
    plate("hip" + side, lambda P, sx=sx: smax(box(P, (sx * 0.16, 0.0, 1.055), (0.04, 0.075, 0.042), 0.014), -half(P, (sx, 0, 0), 0.115), 0.01), 0.005, 0.005, tris=600)
    plate("glute" + side, lambda P, sx=sx: smax(box(P, (sx * 0.078, 0.1, 1.0), (0.055, 0.06, 0.06), 0.016), -half(P, (0, 1, 0), 0.06), 0.01), 0.0045, 0.004, tris=700)
    plate("pauld" + side, lambda P, J=J, sx=sx: smax(sph(P, (J["sh"][0] + sx * 0.012, J["sh"][1], J["sh"][2] + 0.012), 0.088), half(P, (0, 0, -1), -(J["sh"][2] - 0.04)), 0.01), 0.007, 0.006, tris=1000)
    plate("uarm" + side, lambda P, J=J, sx=sx: smax(smax(round_cone(P, J["sh"], J["el"], 0.09, 0.09), zband(P, J["el"][2] + 0.05, J["sh"][2] - 0.085), 0.008), -half(P, (sx, 0, 0), abs(J["sh"][0]) - 0.0), 0.012), 0.005, 0.0045, tris=700)
    plate("gaunt" + side, lambda P, J=J: smax(round_cone(P, J["el"], J["wr"], 0.09, 0.09), zband(P, J["wr"][2] + 0.012, J["el"][2] - 0.045), 0.008), 0.0065, 0.006, tris=1200)
    plate("thigh" + side, lambda P, J=J, sx=sx: smax(smax(round_cone(P, J["hip"], J["kn"], 0.15, 0.15), zband(P, J["kn"][2] + 0.075, J["hip"][2] - 0.05), 0.01),
                                                      np.minimum(half(P, (0, 1, 0), 0.02), -half(P, (sx, 0, 0), abs(J["hip"][0]) + 0.035)), 0.012), 0.0055, 0.005, tris=1400)
    plate("knee" + side, lambda P, J=J: smax(sph(P, (J["kn"][0], J["kn"][1] - 0.035, J["kn"][2]), 0.068), half(P, (0, 1, 0), J["kn"][1] - 0.008), 0.01), 0.008, 0.008, tris=900)
    plate("shin" + side, lambda P, J=J: smax(smax(round_cone(P, J["kn"], J["an"], 0.12, 0.12), zband(P, J["an"][2] + 0.085, J["kn"][2] - 0.065), 0.01), half(P, (0, 1, 0), 0.03), 0.012), 0.0055, 0.005, tris=1000)
    plate("boot" + side, lambda P, J=J: smax(sph(P, (J["an"][0], -0.05, 0.08), 0.24), zband(P, -0.05, 0.205), 0.01), 0.006, 0.0075, tris=1800)
    plate("glove" + side, lambda P, J=J: smax(round_cone(P, J["wr"], J["hd"], 0.08, 0.08), zband(P, J["hd"][2] - 0.05, J["wr"][2] - 0.012), 0.006), 0.003, 0.004, tris=900)

def build_plate(name, region, off, th, tris, vox=0.0026):
    # 大まかな格子で、板のある範囲を探す
    xs = np.arange(BLO[0], BHI[0], 0.0042); ys = np.arange(BLO[1], BHI[1], 0.0042); zs = np.arange(BLO[2], BHI[2], 0.0042)
    n = vol.shape; Xg, Yg, Zg = np.meshgrid(lo[0] + np.arange(n[0]) * 0.0042, lo[1] + np.arange(n[1]) * 0.0042, lo[2] + np.arange(n[2]) * 0.0042, indexing="ij")
    near = np.abs(vol - off) < 0.02
    idx = np.argwhere(near)
    P = np.stack([Xg[near], Yg[near], Zg[near]], 1).astype(np.float32)
    inside = region(P) < 0.01
    if not inside.any(): return None
    q = P[inside]; blo = q.min(0) - 0.015; bhi = q.max(0) + 0.015
    f = lambda Q: smax(np.abs(sdf(Q) - off) - th / 2, region(Q), 0.0022)
    pv, plo = grid_field(f, blo, bhi, vox)
    if pv.min() >= 0: return None
    v, fc, _, _ = marching_cubes(pv, 0.0, spacing=(vox,) * 3); v += plo
    ob = L.mesh_object(name, v, [tuple(x[::-1]) for x in fc], smooth=True)
    L.select_only(ob)
    bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT"); bpy.ops.mesh.remove_doubles(threshold=1e-5); bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode="OBJECT")
    md = ob.modifiers.new("sm", "SMOOTH"); md.factor = 0.5; md.iterations = 3
    md = ob.modifiers.new("dec", "DECIMATE"); md.ratio = min(1.0, tris / max(1, len(fc)))
    for m in list(ob.modifiers): bpy.ops.object.modifier_apply(modifier=m.name)
    return ob

# ---------------- Blender で組み立て ----------------
L.reset()
M = {}
def mat(name, col, rough, metal=0.0, coat=0.0, emit=None):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*col, 1); b.inputs["Roughness"].default_value = rough; b.inputs["Metallic"].default_value = metal
    if coat: b.inputs["Coat Weight"].default_value = coat; b.inputs["Coat Roughness"].default_value = 0.1
    if emit: b.inputs["Emission Color"].default_value = (*emit[0], 1); b.inputs["Emission Strength"].default_value = emit[1]
    m["base"] = list(col); M[name] = m; return m
# 色は参考画像から（線形の値）。明暗の差は小さく、どちらも紫の仲間
mat("armor", (0.6, 0.52, 0.86), 0.28, 0.3, 0.55)      # 淡いラベンダーの装甲（真珠のようなつや）
mat("suit", (0.15, 0.09, 0.4), 0.38, 0.15, 0.35)        # 中くらいの紫のボディスーツ
mat("accent", (0.07, 0.04, 0.2), 0.35, 0.2, 0.3)      # 濃いめの紫（ベルト・靴底・小物）
mat("visor", (0.004, 0.003, 0.008), 0.04, 0.0, 1.0)  # 黒いバイザー
mat("glow", (0.55, 0.25, 1.0), 0.4, emit=((0.58, 0.26, 1.0), 3.2))

body = L.mesh_object("body", verts, [tuple(f[::-1]) for f in faces], smooth=True)
L.select_only(body)
bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT"); bpy.ops.mesh.remove_doubles(threshold=1e-5); bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode="OBJECT")
md = body.modifiers.new("sm", "SMOOTH"); md.factor = 0.6; md.iterations = 6
md = body.modifiers.new("dec", "DECIMATE"); md.ratio = 17000 / max(1, len(faces))
for m in list(body.modifiers): bpy.ops.object.modifier_apply(modifier=m.name)
body.data.materials.append(M["suit"]); body.data.materials.append(M["accent"])
# 体の首まわりは濃いめの紫に（ヘルメットの下からのぞく部分）
Vb = np.array([v.co[:] for v in body.data.vertices], np.float32); lb = np.array(names)[sdf(Vb, labels=True)]
for p in body.data.polygons:
    if lb[p.vertices[0]] == "neck": p.material_index = 1
for p in body.data.polygons: p.use_smooth = True

plates = []
for (nm, reg, off, th, mt, tris) in PL:
    ob = build_plate(nm, reg, off, th, tris)
    if ob is None: print("PLATE_EMPTY", nm); continue
    ob.data.materials.append(M[mt])
    if nm.startswith("boot"):   # 靴底は濃いめの紫
        ob.data.materials.append(M["accent"])
        for p in ob.data.polygons:
            if p.center.z < 0.024: p.material_index = 1
    plates.append(ob)
print("PLATES", len(plates), round(time.time() - T0, 1))

# ---------------- ボーンと重み ----------------
arm_d = bpy.data.armatures.new("rig"); rig = bpy.data.objects.new("rig", arm_d); bpy.context.scene.collection.objects.link(rig)
L.select_only(rig); bpy.ops.object.mode_set(mode="EDIT"); EB = arm_d.edit_bones
def bone(name, h, t, parent=None):
    b = EB.new(name); b.head = h; b.tail = t
    if parent: b.parent = EB[parent]; b.use_connect = False
bone("pelvis", (0, 0, 0.99), (0, 0, 1.15)); bone("chest", (0, 0, 1.15), (0, 0, 1.6), "pelvis"); bone("head", (0, 0.004, 1.64), (0, 0.004, 1.95), "chest")
for side in "LR":
    J = S[side]
    bone("upperArm" + side, J["sh"], J["el"], "chest"); bone("foreArm" + side, J["el"], J["wr"], "upperArm" + side); bone("hand" + side, J["wr"], J["hd"], "foreArm" + side)
    bone("thigh" + side, J["hip"], J["kn"], "pelvis"); bone("shin" + side, J["kn"], J["an"], "thigh" + side); bone("foot" + side, J["an"], J["toe"], "shin" + side)
bpy.ops.object.mode_set(mode="OBJECT")
for o in bpy.context.scene.objects: o.select_set(False)
body.select_set(True); rig.select_set(True); bpy.context.view_layer.objects.active = rig
bpy.ops.object.parent_set(type="ARMATURE_AUTO")
unw = sum(1 for v in body.data.vertices if not any(g.weight > 0.01 for g in v.groups))
print("WEIGHTS unweighted", unw, "of", len(body.data.vertices))
# 板の重み：いちばん近い体の点（数点の平均）から写す
kd = kdtree.KDTree(len(body.data.vertices))
for v in body.data.vertices: kd.insert(v.co, v.index)
kd.balance()
gname = {g.index: g.name for g in body.vertex_groups}
bw = [{gname[g.group]: g.weight for g in v.groups} for v in body.data.vertices]
for ob in plates:
    vg = {}
    for v in ob.data.vertices:
        acc = {}; tot = 0
        for (co, i, d) in kd.find_n(v.co, 4):
            w = 1.0 / (d + 1e-4); tot += w
            for k, x in bw[i].items(): acc[k] = acc.get(k, 0) + x * w
        for k, x in acc.items():
            if x / tot > 0.01:
                if k not in vg: vg[k] = ob.vertex_groups.new(name=k)
                vg[k].add([v.index], x / tot, "REPLACE")
# 板を体に合体（1つのスキンのメッシュ、材質は複数）
for o in bpy.context.scene.objects: o.select_set(False)
for o in plates: o.select_set(True)
body.select_set(True); bpy.context.view_layer.objects.active = body
bpy.ops.object.join()

# ---------------- 硬い部品：ヘルメット、背中のユニット、手の道具 ----------------
def usph(name, m, r, c, scale=(1, 1, 1), seg=40):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=c, segments=seg, ring_count=seg // 2); ob = bpy.context.object; ob.name = name; ob.scale = scale
    bpy.ops.object.transform_apply(scale=True); ob.data.materials.append(M[m])
    for p in ob.data.polygons: p.use_smooth = True
    return ob
def torus(name, m, c, R, r, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=40, minor_segments=10, location=c); ob = bpy.context.object; ob.name = name; ob.scale = scale
    bpy.ops.object.transform_apply(scale=True); ob.data.materials.append(M[m])
    for p in ob.data.polygons: p.use_smooth = True
    return ob
def cyl(name, m, r, h, c, axis=(0, 0, 1), r2=None, verts=24):
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r, radius2=r if r2 is None else r2, depth=h, location=c); ob = bpy.context.object; ob.name = name
    ob.rotation_euler = Vector((0, 0, 1)).rotation_difference(Vector(axis)).to_euler(); bpy.ops.object.transform_apply(rotation=True); ob.data.materials.append(M[m])
    md = ob.modifiers.new("b", "BEVEL"); md.width = 0.003; md.segments = 2; md.limit_method = "ANGLE"
    for p in ob.data.polygons: p.use_smooth = True
    return ob
def rbox(name, m, size, c, sub=2):
    bpy.ops.mesh.primitive_cube_add(size=1, location=c); ob = bpy.context.object; ob.name = name; ob.scale = size; bpy.ops.object.transform_apply(scale=True); ob.data.materials.append(M[m])
    md = ob.modifiers.new("b", "BEVEL"); md.width = min(size) * 0.42; md.segments = 4
    md = ob.modifiers.new("s", "SUBSURF"); md.levels = sub
    for p in ob.data.polygons: p.use_smooth = True
    return ob
def join(name, parts):
    for o in bpy.context.scene.objects: o.select_set(False)
    for p in parts:
        bpy.context.view_layer.objects.active = p
        for md in list(p.modifiers): bpy.ops.object.modifier_apply(modifier=md.name)
        p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]; bpy.ops.object.join(); parts[0].name = name; parts[0].data.name = name; return parts[0]
def oval_patch(name, m, ax, az, R, cz, sy=1.06, sz=1.04, lift=0.0, r0=0.0, rings=12, seg=56):
    Vv, F = [], []
    for i, r in enumerate(np.linspace(r0, 1, rings + 1)):
        for j in range(seg):
            a = 2 * math.pi * j / seg; x = ax * r * math.cos(a); dz = az * r * math.sin(a)
            yy = -math.sqrt(max(1e-6, 1 - (x / R) ** 2 - (dz / (R * sz)) ** 2)) * R * sy
            q = np.array([x, yy, dz]); n = q / np.linalg.norm(q)
            Vv.append((x + n[0] * lift, yy + n[1] * lift, cz + dz + n[2] * lift))
    for i in range(rings):
        for j in range(seg):
            j2 = (j + 1) % seg; F.append((i * seg + j, (i + 1) * seg + j, (i + 1) * seg + j2, i * seg + j2))
    ob = L.mesh_object(name, np.array(Vv), F); ob.data.materials.append(M[m])
    L.select_only(ob); bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT"); bpy.ops.mesh.remove_doubles(threshold=1e-5); bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode="OBJECT")
    return ob
HCZ = 1.81; HR = 0.146
rimv = oval_patch("vrimO", "armor", 0.13, 0.106, HR, HCZ - 0.004, lift=0.0055, r0=0.88, rings=3)
md = rimv.modifiers.new("so", "SOLIDIFY"); md.thickness = 0.006; md.offset = 1
helmet = join("helmet", [
    usph("hs", "armor", HR, (0, 0, HCZ), (1, 1.06, 1.04), 44),
    oval_patch("visor", "visor", 0.12, 0.097, HR, HCZ - 0.004, lift=0.0045),
    rimv,
    cyl("earL", "accent", 0.034, 0.018, (HR * 0.99, 0.014, HCZ - 0.01), (1, 0, 0)), cyl("earR", "accent", 0.034, 0.018, (-HR * 0.99, 0.014, HCZ - 0.01), (1, 0, 0)),
    torus("neckRing", "armor", (0, 0.006, 1.672), 0.07, 0.017, (1.06, 1.0, 1)),
    torus("neckRing2", "accent", (0, 0.006, 1.648), 0.066, 0.011, (1.06, 1.0, 1)),
])
pack = join("pack", [
    rbox("pk", "armor", (0.16, 0.08, 0.2), (0, 0.128, 1.445)),
    rbox("pkS", "accent", (0.09, 0.014, 0.13), (0, 0.168, 1.445), 1),
    cyl("pkL", "armor", 0.026, 0.19, (0.098, 0.128, 1.44)), cyl("pkR", "armor", 0.026, 0.19, (-0.098, 0.128, 1.44)),
    cyl("pkLb", "accent", 0.022, 0.02, (0.098, 0.128, 1.338)), cyl("pkRb", "accent", 0.022, 0.02, (-0.098, 0.128, 1.338)),
    rbox("pkG", "glow", (0.05, 0.006, 0.008), (0, 0.176, 1.49), 1),
])
# 右手に握る浄化の道具：柄＋紫に光る短い刃（浄化の光の出口）
HD = S["R"]["hd"]; WR = S["R"]["wr"]
axis = (np.array(HD) - np.array(WR)); axis /= np.linalg.norm(axis)
grip = np.array(lerp(WR, HD, 0.42)) + np.array([0, -0.03, 0])
tool = join("tool", [
    cyl("hilt", "accent", 0.013, 0.13, tuple(grip), tuple(axis)),
    cyl("guard", "armor", 0.024, 0.014, tuple(grip + axis * 0.07), tuple(axis)),
    cyl("blade", "glow", 0.012, 0.34, tuple(grip + axis * 0.245), tuple(axis), r2=0.005, verts=12),
])
def attach(ob, bone_name):
    mw = ob.matrix_world.copy(); ob.parent = rig; ob.parent_type = "BONE"; ob.parent_bone = bone_name; ob.matrix_world = mw
attach(helmet, "head"); attach(pack, "chest"); attach(tool, "handR")
def empty(name, loc, bone_name):
    e = bpy.data.objects.new(name, None); e.location = loc; bpy.context.scene.collection.objects.link(e); bpy.context.view_layer.update(); attach(e, bone_name); return e
empty("emitterTip", tuple(grip + axis * 0.42), "handR")
empty("lampMount", (0.09, -0.12, 1.9), "head")

# ---------------- AO を頂点の色に焼き込み、材質の色と掛け合わせる ----------------
meshes = [body, helmet, pack, tool]
for ob in meshes:
    ca = ob.data.color_attributes.new("ao", "FLOAT_COLOR", "POINT"); ob.data.color_attributes.active_color = ca
sc = bpy.context.scene; sc.render.bake.target = "VERTEX_COLORS"; sc.cycles.samples = 64
for o in bpy.context.scene.objects: o.select_set(False)
for o in meshes: o.select_set(True)
bpy.context.view_layer.objects.active = body
t1 = time.time(); bpy.ops.object.bake(type="AO", use_clear=True)
for ob in meshes:
    me = ob.data; n = len(me.vertices)
    ao = np.empty(n * 4, np.float32); me.color_attributes["ao"].data.foreach_get("color", ao); ao = ao.reshape(n, 4)[:, 0]
    base = np.ones((n, 3), np.float32); cnt = np.zeros(n)
    for p in me.polygons:
        c = np.array(me.materials[p.material_index]["base"], np.float32) if "base" in me.materials[p.material_index] else np.ones(3, np.float32)
        for i in p.vertices: base[i] = c if cnt[i] == 0 else base[i]; cnt[i] += 1
    col = base * (0.38 + 0.62 * ao)[:, None]
    ca = me.color_attributes.new("Col", "FLOAT_COLOR", "POINT"); ca.data.foreach_set("color", np.concatenate([col, np.ones((n, 1), np.float32)], 1).ravel())
    me.color_attributes.remove(me.color_attributes["ao"]); me.color_attributes.active_color = me.color_attributes["Col"]
# 材質の色は白にして、頂点の色（色×陰）を使う。光る部分だけは材質の色を残す
for k, m in M.items():
    if k == "glow": continue
    nt = m.node_tree; b = nt.nodes["Principled BSDF"]; ca = nt.nodes.new("ShaderNodeVertexColor"); ca.layer_name = "Col"
    nt.links.new(ca.outputs["Color"], b.inputs["Base Color"])
print("TRIS", sum(len(p.vertices) - 2 for o in meshes for p in o.data.polygons), "AO_s", round(time.time() - t1, 1), "total_s", round(time.time() - T0, 1))
for o in bpy.context.scene.objects: o.select_set(False)
for o in meshes + [rig] + [o for o in bpy.context.scene.objects if o.type == "EMPTY"]: o.select_set(True)
bpy.context.view_layer.objects.active = rig
bpy.ops.export_scene.gltf(filepath=os.path.join(L.OUT_MODELS, "diver.raw.glb"), export_format="GLB", use_selection=True, export_skins=True, export_animations=False,
                          export_yup=True, export_apply=False, export_attributes=False, export_vertex_color="NAME", export_vertex_color_name="Col", export_all_vertex_colors=False)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(L.OUT_MODELS, "diver.blend"))
print("OK")
