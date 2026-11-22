"""主人公（第7版）：写実的な人体（MakeHuman・CC0）を土台にした潜行士。作り事の存在。
   持ち主の指示：参考画像 Docs/REFERENCE/hero/reference-v3.jpg（ラベンダーのスーツ・丸いヘルメット・黒いバイザー）に沿い、
   四角を使わず曲線美を強調すること（方向は「曲線を強調した、しなやかな運動選手の女性の体」。既存作品のキャラクターの意匠は写さない）。
   作り方：
     1. tools/mh_body.py が作った体（assets/models/mh_body.npz）を読み込む。体の表面そのものが紫のボディスーツ
     2. 体の表面から「符号つき距離」を作り、体の曲線に沿う装甲の板を、表面から少し浮いた薄い殻として切り出す
        （胸・くびれに沿うコルセット・背骨に沿う背中・木の葉形の腰・肩・上腕・籠手・らせん状の太もも・ひざ・すね・ブーツ・手袋）
     3. ボーンを入れて自動の重み。板は近い体の点の重みを写す。ヘルメット・背中のユニット・手の道具はボーンに取り付け
     4. 陰（AO）を頂点の色に焼き込み、GLB で書き出す
   Blender は z が上、正面は -Y、+X が本人の左。出力: assets/models/diver.raw.glb, assets/models/diver.blend"""
import sys, os, math, time
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np, bpy
from mathutils import Vector, kdtree
from scipy.spatial import cKDTree
from scipy.interpolate import PchipInterpolator
import irlib as L
from skimage.measure import marching_cubes

T0 = time.time()
D = np.load(os.path.join(L.OUT_MODELS, "mh_body.npz"))
BV = D["verts"].astype(np.float32); BF = D["faces"]; FUV = D["fuv"]; UV = D["uv"]; J = dict(zip([str(x) for x in D["jn"]], D["jp"]))

# ---------------- 体の表面の符号つき距離（密な点と法線から） ----------------
tris = []
for f in BF:
    f = [i for i in f if i >= 0]
    tris.append((f[0], f[1], f[2]))
    if len(f) == 4: tris.append((f[0], f[2], f[3]))
tris = np.array(tris)
vn = np.zeros_like(BV)
A, B, C = BV[tris[:, 0]], BV[tris[:, 1]], BV[tris[:, 2]]
fn = np.cross(B - A, C - A)
for k in range(3): np.add.at(vn, tris[:, k], fn)
vn /= np.linalg.norm(vn, axis=1, keepdims=True) + 1e-9
area = np.linalg.norm(fn, axis=1) / 2
rng = np.random.default_rng(1)
ns = np.maximum(1, (area / (0.0024 ** 2)).astype(int))
ti = np.repeat(np.arange(len(tris)), ns)
r1, r2 = rng.random(len(ti)), rng.random(len(ti)); s1 = np.sqrt(r1)
w0, w1, w2 = 1 - s1, s1 * (1 - r2), s1 * r2
SP = (A[ti] * w0[:, None] + B[ti] * w1[:, None] + C[ti] * w2[:, None]).astype(np.float32)
SN = vn[tris[ti, 0]] * w0[:, None] + vn[tris[ti, 1]] * w1[:, None] + vn[tris[ti, 2]] * w2[:, None]
SN /= np.linalg.norm(SN, axis=1, keepdims=True) + 1e-9
TREE = cKDTree(SP)
def sdf(P):
    d, i = TREE.query(P, k=1, workers=-1)
    s = np.sign(((P - SP[i]) * SN[i]).sum(1)); s[s == 0] = 1
    return (d * s).astype(np.float32)
print("SAMPLES", len(SP), round(time.time() - T0, 1))

# ---------------- 体の寸法を測る（胴の断面、くびれ・腰・胸の高さ） ----------------
zs = np.arange(0.9, 1.6, 0.01); TA, TB, TY = [], [], []
for z in zs:
    lim = 0.2 if z < 1.42 else 0.17
    m = (np.abs(BV[:, 2] - z) < 0.007) & (np.abs(BV[:, 0]) < lim)
    p = BV[m]; TA.append(np.abs(p[:, 0]).max()); TB.append((p[:, 1].max() - p[:, 1].min()) / 2); TY.append((p[:, 1].max() + p[:, 1].min()) / 2)
fa, fb, fy = PchipInterpolator(zs, TA), PchipInterpolator(zs, TB), PchipInterpolator(zs, TY)
def prof(z):
    zc = np.clip(z, zs[0], zs[-1]); return fa(zc).astype(np.float32), fb(zc).astype(np.float32), fy(zc).astype(np.float32)
TA = np.array(TA)
mw = (zs > 1.1) & (zs < 1.35); Z_WAIST = float(zs[mw][np.argmin(TA[mw])])
mh = (zs > 0.98) & (zs < 1.12); Z_HIP = float(zs[mh][np.argmax(TA[mh])])
mb = (BV[:, 2] > 1.3) & (BV[:, 2] < 1.55) & (np.abs(BV[:, 0]) < 0.12); Z_BUST = float(BV[mb][np.argmin(BV[mb][:, 1]), 2])
Z_SH = float(J["l-shoulder"][2]); Z_CLAV = float(J["l-clavicle"][2]); Z_NECK = float(J["neck"][2])
print("LANDMARKS waist", Z_WAIST, "hip", Z_HIP, "bust", round(Z_BUST, 3), "shoulder", round(Z_SH, 3))

S = {}
for side, pre in (("L", "l-"), ("R", "r-")):
    S[side] = dict(sh=J[pre + "shoulder"], el=J[pre + "elbow"], wr=J[pre + "hand"], hd=J[pre + "finger-3-4"],
                   hip=J[pre + "upper-leg"], kn=J[pre + "knee"], an=J[pre + "ankle"], toe=J[pre + "foot-2"])

# ---------------- 形の部品 ----------------
def ellipsoid(P, c, r):
    q = (P - np.asarray(c, np.float32)); r = np.asarray(r, np.float32)
    k0 = np.linalg.norm(q / r, axis=1); k1 = np.linalg.norm(q / (r * r), axis=1)
    return k0 * (k0 - 1.0) / np.maximum(k1, 1e-6)
def smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0, 1); return b * (1 - h) + a * h - k * h * (1 - h)
def smax(a, b, k): return -smin(-a, -b, k)
def sph(P, c, r): return np.linalg.norm(P - np.asarray(c, np.float32), axis=1) - r
def zband(P, z0, z1): return np.maximum(z0 - P[:, 2], P[:, 2] - z1)
def lerp(a, b, t): return np.asarray(a) * (1 - t) + np.asarray(b) * t
def limb_frame(P, a, b):
    """手足の軸に沿った座標：t（a=0 → b=1）、軸のまわりの角度 φ（0=外側, -π/2=前）、軸からの距離 r"""
    a = np.asarray(a, np.float32); b = np.asarray(b, np.float32); ab = b - a; L2 = float(ab @ ab); ah = ab / math.sqrt(L2)
    t = ((P - a) @ ab) / L2; c = a + t[:, None] * ab; r = P - c
    sx = 1.0 if (a[0] + b[0]) > 0 else -1.0
    out = np.array([sx, 0, 0], np.float32); out -= (out @ ah) * ah; out /= np.linalg.norm(out)
    back = np.array([0, 1, 0], np.float32); back -= (back @ ah) * ah; back -= (back @ out) * out; back /= np.linalg.norm(back)
    limb_frame.r = np.linalg.norm(r, axis=1)
    return t, np.arctan2(r @ back, r @ out)
def window(phi, c, w, scale=0.06):
    return (np.abs(np.angle(np.exp(1j * (phi - c)))) - w) * scale

# ---------------- 装甲の板の設計図（体の曲線に沿って流れる形） ----------------
PL = []
def plate(name, region, off=0.0038, th=0.0036, mat="armor", tris=1400): PL.append((name, region, off, th, mat, tris))
def breast(P):
    a, b, y0 = prof(P[:, 2]); x, y, z = P[:, 0], P[:, 1], P[:, 2]
    return smax(smax(smax(Z_BUST - 0.062 + 1.8 * x * x - z, z - (Z_CLAV + 0.012), 0.008), np.abs(x) - a * 0.84, 0.01), y - y0 + 0.012, 0.01)
plate("breast", breast, 0.0042, 0.004, tris=2400)
def corset(P):
    a, b, y0 = prof(P[:, 2]); x, y, z = P[:, 0], P[:, 1], P[:, 2]
    return smax(smax(smax(np.abs(x) - a * (0.4 + 0.9 * np.maximum(0, z - (Z_WAIST + 0.05))), z - (Z_BUST - 0.078), 0.008), (Z_HIP - 0.01) + 2.0 * np.abs(x) - z, 0.01), y - y0 + 0.02, 0.01)
plate("corset", corset, 0.0036, 0.0036, tris=1600)
def backp(P):
    a, b, y0 = prof(P[:, 2]); x, y, z = P[:, 0], P[:, 1], P[:, 2]
    w = 0.03 + 0.42 * np.maximum(0, z - (Z_WAIST - 0.04)) + 1.2 * np.maximum(0, z - (Z_BUST - 0.02)) ** 1.5
    return smax(smax(np.abs(x) - w, zband(P, Z_WAIST - 0.06, Z_SH + 0.05), 0.01), -(y - y0) + 0.02, 0.01)
plate("back", backp, 0.0038, 0.0036, tris=1600)
for side, sx in (("L", 1), ("R", -1)):
    Sj = S[side]
    def hipp(P, sx=sx):
        a, b, y0 = prof(P[:, 2]); x, y, z = P[:, 0], P[:, 1], P[:, 2]
        hz = 0.075 * np.clip(1 - ((y - y0) / (b * 0.55)) ** 2, 0, 1)
        return smax(smax(a * 0.72 - x * sx, np.abs(z - (Z_HIP + 0.03)) - hz, 0.01), np.abs(y - y0) - b * 0.55, 0.01)
    plate("pauld" + side, lambda P, Sj=Sj, sx=sx: smax(sph(P, Sj["sh"] + np.array([sx * 0.02, 0, 0.02]), 0.075), Sj["sh"][2] - 0.01 - P[:, 2], 0.012), 0.0045, 0.0045, tris=900)
    def uarm(P, Sj=Sj):
        t, phi = limb_frame(P, Sj["el"], Sj["sh"]); r = limb_frame.r
        return smax(smax(window(phi, 0.0, 0.9 + 0.3 * t, 0.05), np.maximum(0.18 - t, t - 0.72) * 0.25, 0.006), r - 0.075, 0.004)
    plate("uarm" + side, uarm, 0.0036, 0.0034, tris=700)
    def gaunt(P, Sj=Sj):
        t, phi = limb_frame(P, Sj["wr"], Sj["el"]); r = limb_frame.r; top = 0.72 + 0.12 * np.cos(phi)
        return smax(smax(-(t - 0.06) * 0.25, (t - top) * 0.25, 0.006), r - 0.065, 0.004)
    plate("gaunt" + side, gaunt, 0.0042, 0.0042, tris=1100)
    def thigh(P, Sj=Sj):
        t, phi = limb_frame(P, Sj["kn"], Sj["hip"]); c = -1.05 + 0.85 * t; r = limb_frame.r
        return smax(smax(window(phi, c, 0.85 + 0.25 * np.sin(np.pi * t), 0.08), np.maximum(0.16 - t, t - (0.84 - 0.12 * np.cos(phi))) * 0.4, 0.008), r - 0.13, 0.004)
    plate("thigh" + side, thigh, 0.0038, 0.0036, tris=1500)
    plate("knee" + side, lambda P, Sj=Sj: smax(ellipsoid(P, (Sj["kn"][0], Sj["kn"][1] - 0.045, Sj["kn"][2] + 0.01), (0.05, 0.05, 0.075)), P[:, 1] - Sj["kn"][1] + 0.012, 0.01), 0.0055, 0.0055, tris=800)
    def shin(P, Sj=Sj):
        t, phi = limb_frame(P, Sj["an"], Sj["kn"]); r = limb_frame.r
        return smax(smax(window(phi, -np.pi / 2, 0.45 + 0.5 * t, 0.06), np.maximum(0.25 - t, t - 0.84) * 0.4, 0.008), r - 0.085, 0.004)
    plate("shin" + side, shin, 0.0038, 0.0036, tris=900)
    plate("boot" + side, lambda P, Sj=Sj: smax(sph(P, (Sj["an"][0], Sj["an"][1] - 0.05, 0.07), 0.2), P[:, 2] - (Sj["an"][2] + 0.12 - 0.45 * np.maximum(0, P[:, 1] - Sj["an"][1])), 0.01), 0.0045, 0.0055, tris=1600)
    def glove(P, Sj=Sj):
        t, phi = limb_frame(P, Sj["wr"], Sj["hd"]); r = limb_frame.r
        return smax(smax(-(t + 0.08) * 0.2, (t - 1.15) * 0.2, 0.006), r - 0.06, 0.004)
    plate("glove" + side, glove, 0.0026, 0.003, tris=1200)

def grid_field(fn, lo, hi, vox):
    lo = np.asarray(lo, np.float32); hi = np.asarray(hi, np.float32)
    n = (np.ceil((hi - lo) / vox)).astype(int) + 1
    xs, ys, zz = [lo[i] + np.arange(n[i], dtype=np.float32) * vox for i in range(3)]
    X, Y, Z = np.meshgrid(xs, ys, zz, indexing="ij")
    P = np.stack([X.ravel(), Y.ravel(), Z.ravel()], 1)
    return fn(P).reshape(tuple(n)), lo
def build_plate(name, region, off, th, tris, vox=0.0026):
    Q = SP + SN * off                                  # 表面から off だけ浮いた点で、板のある範囲を探す
    ins = region(Q) < 0.004
    if not ins.any(): return None
    q = Q[ins]; blo = q.min(0) - 0.012; bhi = q.max(0) + 0.012
    f = lambda P: smax(np.abs(sdf(P) - off) - th / 2, region(P), 0.0035)
    pv, plo = grid_field(f, blo, bhi, vox)
    if pv.min() >= 0: return None
    v, fc, _, _ = marching_cubes(pv, 0.0, spacing=(vox,) * 3); v += plo
    ob = L.mesh_object(name, v, [tuple(x[::-1]) for x in fc], smooth=True)
    L.select_only(ob)
    bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT"); bpy.ops.mesh.remove_doubles(threshold=1e-5); bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode="OBJECT")
    md = ob.modifiers.new("sm", "SMOOTH"); md.factor = 0.6; md.iterations = 8
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
mat("armor", (0.6, 0.52, 0.86), 0.28, 0.3, 0.55)
mat("suit", (0.15, 0.09, 0.4), 0.36, 0.15, 0.4)
mat("accent", (0.07, 0.04, 0.2), 0.35, 0.2, 0.3)
mat("visor", (0.004, 0.003, 0.008), 0.04, 0.0, 1.0)
mat("glow", (0.55, 0.25, 1.0), 0.4, emit=((0.58, 0.26, 1.0), 3.2))

faces = [tuple(i for i in f if i >= 0) for f in BF]
body = L.mesh_object("body", BV, faces, smooth=True)
uvl = body.data.uv_layers.new(name="UVMap")
k = 0
for p, fu in zip(body.data.polygons, FUV):
    for li, t in zip(p.loop_indices, [t for t in fu if t >= 0]): uvl.data[li].uv = tuple(UV[t])
body.data.materials.append(M["suit"])
L.select_only(body); bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT"); bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode="OBJECT")

plates = []
for (nm, reg, off, th, mt, tr) in PL:
    ob = build_plate(nm, reg, off, th, tr)
    if ob is None: print("PLATE_EMPTY", nm); continue
    ob.data.materials.append(M[mt])
    if nm.startswith("boot"):
        ob.data.materials.append(M["accent"])
        for p in ob.data.polygons:
            if p.center.z < 0.02: p.material_index = 1
    plates.append(ob)
print("PLATES", len(plates), round(time.time() - T0, 1))

# ---------------- ボーンと重み ----------------
arm_d = bpy.data.armatures.new("rig"); rig = bpy.data.objects.new("rig", arm_d); bpy.context.scene.collection.objects.link(rig)
L.select_only(rig); bpy.ops.object.mode_set(mode="EDIT"); EB = arm_d.edit_bones
def bone(name, h, t, parent=None):
    b = EB.new(name); b.head = tuple(h); b.tail = tuple(t)
    if parent: b.parent = EB[parent]; b.use_connect = False
bone("pelvis", J["pelvis"], J["spine-3"]); bone("chest", J["spine-3"], J["neck"], "pelvis"); bone("head", J["neck"], J["head-2"], "chest")
for side in "LR":
    Sj = S[side]
    bone("upperArm" + side, Sj["sh"], Sj["el"], "chest"); bone("foreArm" + side, Sj["el"], Sj["wr"], "upperArm" + side); bone("hand" + side, Sj["wr"], Sj["hd"], "foreArm" + side)
    bone("thigh" + side, Sj["hip"], Sj["kn"], "pelvis"); bone("shin" + side, Sj["kn"], Sj["an"], "thigh" + side); bone("foot" + side, Sj["an"], Sj["toe"], "shin" + side)
bpy.ops.object.mode_set(mode="OBJECT")
for o in bpy.context.scene.objects: o.select_set(False)
body.select_set(True); rig.select_set(True); bpy.context.view_layer.objects.active = rig
bpy.ops.object.parent_set(type="ARMATURE_AUTO")
unw = sum(1 for v in body.data.vertices if not any(g.weight > 0.01 for g in v.groups))
print("WEIGHTS unweighted", unw, "of", len(body.data.vertices))
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
            for kk, x in bw[i].items(): acc[kk] = acc.get(kk, 0) + x * w
        for kk, x in acc.items():
            if x / tot > 0.01:
                if kk not in vg: vg[kk] = ob.vertex_groups.new(name=kk)
                vg[kk].add([v.index], x / tot, "REPLACE")
for o in bpy.context.scene.objects: o.select_set(False)
for o in plates: o.select_set(True)
body.select_set(True); bpy.context.view_layer.objects.active = body
bpy.ops.object.join()

# ---------------- 硬い部品：ヘルメット、背中のユニット、手の道具 ----------------
def usph(name, m, r, c, scale=(1, 1, 1), seg=40):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=tuple(c), segments=seg, ring_count=seg // 2); ob = bpy.context.object; ob.name = name; ob.scale = scale
    bpy.ops.object.transform_apply(scale=True); ob.data.materials.append(M[m])
    for p in ob.data.polygons: p.use_smooth = True
    return ob
def torus(name, m, c, R, r, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=40, minor_segments=10, location=tuple(c)); ob = bpy.context.object; ob.name = name; ob.scale = scale
    bpy.ops.object.transform_apply(scale=True); ob.data.materials.append(M[m])
    for p in ob.data.polygons: p.use_smooth = True
    return ob
def cyl(name, m, r, h, c, axis=(0, 0, 1), r2=None, verts=24):
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r, radius2=r if r2 is None else r2, depth=h, location=tuple(c)); ob = bpy.context.object; ob.name = name
    ob.rotation_euler = Vector((0, 0, 1)).rotation_difference(Vector(tuple(axis))).to_euler(); bpy.ops.object.transform_apply(rotation=True); ob.data.materials.append(M[m])
    md = ob.modifiers.new("b", "BEVEL"); md.width = 0.003; md.segments = 2; md.limit_method = "ANGLE"
    for p in ob.data.polygons: p.use_smooth = True
    return ob
def join(name, parts):
    for o in bpy.context.scene.objects: o.select_set(False)
    for p in parts:
        bpy.context.view_layer.objects.active = p
        for md in list(p.modifiers): bpy.ops.object.modifier_apply(modifier=md.name)
        p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]; bpy.ops.object.join(); parts[0].name = name; parts[0].data.name = name; return parts[0]
# 頭の大きさを測って、ヘルメットを合わせる
hv = BV[BV[:, 2] > Z_NECK + 0.035]
HC = (hv.max(0) + hv.min(0)) / 2; HE = (hv.max(0) - hv.min(0)) / 2
HR = float(max(HE[0] * 1.32, HE[1] * 1.12, HE[2] * 1.1)); HC[1] += 0.008; HC[2] += 0.006
def oval_patch(name, m, ax, az, lift=0.0, r0=0.0, rings=12, seg=56, sy=1.06, sz=1.04):
    Vv, F = [], []
    for i, r in enumerate(np.linspace(r0, 1, rings + 1)):
        for j in range(seg):
            a = 2 * math.pi * j / seg; x = ax * r * math.cos(a); dz = az * r * math.sin(a)
            yy = -math.sqrt(max(1e-6, 1 - (x / HR) ** 2 - (dz / (HR * sz)) ** 2)) * HR * sy
            q = np.array([x, yy, dz]); n = q / np.linalg.norm(q)
            Vv.append((HC[0] + x + n[0] * lift, HC[1] + yy + n[1] * lift, HC[2] - 0.004 + dz + n[2] * lift))
    for i in range(rings):
        for j in range(seg):
            j2 = (j + 1) % seg; F.append((i * seg + j, (i + 1) * seg + j, (i + 1) * seg + j2, i * seg + j2))
    ob = L.mesh_object(name, np.array(Vv), F); ob.data.materials.append(M[m])
    L.select_only(ob); bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT"); bpy.ops.mesh.remove_doubles(threshold=1e-5); bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode="OBJECT")
    return ob
rimv = oval_patch("vrimO", "armor", HR * 0.89, HR * 0.73, lift=0.0055, r0=0.88, rings=3)
md = rimv.modifiers.new("so", "SOLIDIFY"); md.thickness = 0.006; md.offset = 1
NZ = Z_NECK + 0.02
helmet = join("helmet", [
    usph("hs", "armor", HR, HC, (1, 1.06, 1.04), 44),
    oval_patch("visor", "visor", HR * 0.81, HR * 0.66, lift=0.0045),
    rimv,
    cyl("earL", "accent", HR * 0.24, 0.018, (HC[0] + HR * 0.99, HC[1] + 0.012, HC[2] - 0.01), (1, 0, 0)), cyl("earR", "accent", HR * 0.24, 0.018, (HC[0] - HR * 0.99, HC[1] + 0.012, HC[2] - 0.01), (1, 0, 0)),
    torus("neckRing", "armor", (0, float(prof(np.array([NZ]))[2][0]) if False else float(J["neck"][1]) + 0.004, NZ + 0.012), 0.058, 0.013, (1.06, 1.0, 1)),
])
a_, b_, y_ = prof(np.array([1.45], np.float32)); BACKY = float(y_[0] + b_[0])
pack = join("pack", [
    usph("pk", "armor", 0.058, (0, BACKY + 0.026, 1.45), (0.85, 0.5, 1.55), 32),
    usph("pkS", "accent", 0.02, (0, BACKY + 0.054, 1.45), (0.6, 0.35, 3.2), 20),
    usph("pkL", "armor", 0.023, (0.056, BACKY + 0.022, 1.41), (0.7, 0.7, 2.6), 20), usph("pkR", "armor", 0.023, (-0.056, BACKY + 0.022, 1.41), (0.7, 0.7, 2.6), 20),
])
WR, HD = np.array(S["R"]["wr"]), np.array(S["R"]["hd"])
axis = (HD - WR) / np.linalg.norm(HD - WR)
grip = lerp(WR, HD, 0.38)
tool = join("tool", [
    cyl("hilt", "accent", 0.012, 0.12, grip, axis),
    cyl("guard", "armor", 0.022, 0.012, grip + axis * 0.064, axis),
    cyl("blade", "glow", 0.011, 0.32, grip + axis * 0.23, axis, r2=0.004, verts=12),
])
def attach(ob, bone_name):
    mw = ob.matrix_world.copy(); ob.parent = rig; ob.parent_type = "BONE"; ob.parent_bone = bone_name; ob.matrix_world = mw
attach(helmet, "head"); attach(pack, "chest"); attach(tool, "handR")
def empty(name, loc, bone_name):
    e = bpy.data.objects.new(name, None); e.location = tuple(loc); bpy.context.scene.collection.objects.link(e); bpy.context.view_layer.update(); attach(e, bone_name); return e
empty("emitterTip", grip + axis * 0.4, "handR")
empty("lampMount", (HC[0] + HR * 0.6, HC[1] - HR * 0.75, HC[2] + HR * 0.55), "head")

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
    base = np.ones((n, 3), np.float32); seen = np.zeros(n, bool)
    for p in me.polygons:
        c = np.array(me.materials[p.material_index]["base"], np.float32)
        for i in p.vertices:
            if not seen[i]: base[i] = c; seen[i] = True
    col = base * (0.38 + 0.62 * ao)[:, None]
    ca = me.color_attributes.new("Col", "FLOAT_COLOR", "POINT"); ca.data.foreach_set("color", np.concatenate([col, np.ones((n, 1), np.float32)], 1).ravel())
    me.color_attributes.remove(me.color_attributes["ao"]); me.color_attributes.active_color = me.color_attributes["Col"]
for kk, m in M.items():
    if kk == "glow": continue
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
