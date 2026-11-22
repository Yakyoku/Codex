"""主人公（第6版：曲線を強調。第5版は角張っていたため作り直し）：持ち主の参考画像 Docs/REFERENCE/hero/reference-v3.jpg に沿った潜行士。作り事の存在。
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

# ---------------- 体つき（第6版：曲線を強調した、しなやかな体。砂時計形と、背中から腰へのゆるい S 字） ----------------
from scipy.interpolate import PchipInterpolator
# 胴の断面の輪郭：高さ z ごとの 横の半幅 a、前後の半幅 b、前後の中心 y0（S 字）
TZ = np.array([0.93, 0.975, 1.025, 1.085, 1.15, 1.215, 1.255, 1.3, 1.37, 1.44, 1.5, 1.555, 1.59, 1.615])
TA = np.array([0.125, 0.168, 0.182, 0.17, 0.132, 0.1, 0.094, 0.102, 0.126, 0.138, 0.142, 0.146, 0.105, 0.062])
TB = np.array([0.088, 0.108, 0.116, 0.108, 0.088, 0.077, 0.075, 0.079, 0.09, 0.096, 0.09, 0.076, 0.062, 0.05])
TY = np.array([0.006, 0.014, 0.018, 0.014, 0.004, -0.004, -0.007, -0.008, -0.006, -0.002, 0.004, 0.012, 0.012, 0.008])
fa, fb, fy = PchipInterpolator(TZ, TA), PchipInterpolator(TZ, TB), PchipInterpolator(TZ, TY)
def prof(z):
    zc = np.clip(z, TZ[0], TZ[-1]); return fa(zc).astype(np.float32), fb(zc).astype(np.float32), fy(zc).astype(np.float32)
def torso_sdf(P):
    a, b, y0 = prof(P[:, 2]); k = np.sqrt((P[:, 0] / a) ** 2 + ((P[:, 1] - y0) / b) ** 2)
    d = (k - 1) * np.minimum(a, b) * 0.95
    return smax(smax(d, TZ[0] - P[:, 2], 0.02), P[:, 2] - TZ[-1], 0.02)
S = {}
for side, sx in (("L", 1), ("R", -1)):
    S[side] = dict(sh=(sx * 0.182, 0.008, 1.545), el=(sx * 0.236, 0.02, 1.29), wr=(sx * 0.27, 0.0, 1.06), hd=(sx * 0.28, -0.014, 0.92),
                   hip=(sx * 0.086, 0.004, 0.985), kn=(sx * 0.098, -0.008, 0.545), an=(sx * 0.1, 0.022, 0.158), toe=(sx * 0.103, -0.135, 0.022))
PARTS = []
def part(name, f): PARTS.append((name, f))
part("torso", torso_sdf)
part("glute", lambda P: np.minimum(ellipsoid(P, (0.074, 0.05, 1.005), (0.084, 0.088, 0.1)), ellipsoid(P, (-0.074, 0.05, 1.005), (0.084, 0.088, 0.1))))
part("bust", lambda P: np.minimum(ellipsoid(P, (0.062, -0.07, 1.458), (0.064, 0.058, 0.06)), ellipsoid(P, (-0.062, -0.07, 1.458), (0.064, 0.058, 0.06))))
part("neck", lambda P: np.minimum(round_cone(P, (0, 0.012, 1.58), (0, 0.006, 1.72), 0.05, 0.043), ellipsoid(P, (0, 0.004, 1.79), (0.078, 0.088, 0.094))))
for side, sx in (("L", 1), ("R", -1)):
    J = S[side]
    part("delt" + side, lambda P, sx=sx: ellipsoid(P, (sx * 0.18, 0.006, 1.542), (0.056, 0.06, 0.064)))
    part("uarm" + side, lambda P, J=J: round_cone(P, J["sh"], J["el"], 0.046, 0.036))
    part("farm" + side, lambda P, J=J, sx=sx: smin(round_cone(P, J["el"], J["wr"], 0.037, 0.026), ellipsoid(P, (sx * 0.246, 0.012, 1.215), (0.04, 0.042, 0.075)), 0.02))
    part("hand" + side, lambda P, J=J, sx=sx: smin(smin(ellipsoid(P, (sx * 0.278, -0.01, 0.998), (0.018, 0.038, 0.05)),
                                                         round_cone(P, (sx * 0.28, -0.014, 0.962), (sx * 0.283, -0.02, 0.9), 0.015, 0.01), 0.012),
                                                    round_cone(P, (sx * 0.268, -0.038, 1.01), (sx * 0.262, -0.058, 0.975), 0.01, 0.0075), 0.01))
    # 太もも：付け根が豊かで、ひざへ向かって細くなる。外側と内側にふくらみ
    part("thigh" + side, lambda P, J=J, sx=sx: smin(smin(round_cone(P, J["hip"], J["kn"], 0.098, 0.052), ellipsoid(P, (sx * 0.108, -0.004, 0.86), (0.086, 0.094, 0.15)), 0.035),
                                                    ellipsoid(P, (sx * 0.07, 0.0, 0.84), (0.06, 0.08, 0.12)), 0.03))
    part("knee" + side, lambda P, J=J: ellipsoid(P, (J["kn"][0], J["kn"][1] - 0.006, J["kn"][2]), (0.048, 0.05, 0.058)))
    # すね：ふくらはぎの曲線をはっきり、足首は細く
    part("shin" + side, lambda P, J=J, sx=sx: smin(round_cone(P, J["kn"], J["an"], 0.048, 0.029), ellipsoid(P, (sx * 0.1, 0.034, 0.415), (0.054, 0.06, 0.12)), 0.03))
    # かかとの少し高い靴（足の甲が斜めになる）
    part("foot" + side, lambda P, J=J, sx=sx: np.maximum(smin(smin(round_cone(P, (sx * 0.1, 0.03, 0.115), (sx * 0.103, -0.1, 0.035), 0.036, 0.03),
                                                                   ellipsoid(P, (sx * 0.103, -0.12, 0.026), (0.036, 0.045, 0.026)), 0.02),
                                                              round_cone(P, (sx * 0.1, 0.05, 0.1), (sx * 0.1, 0.05, 0.012), 0.022, 0.016), 0.01), -P[:, 2] + 0.002))
names = [n for n, _ in PARTS]
BLEND = {"torso": 0.0, "glute": 0.04, "bust": 0.035, "neck": 0.03}
def sdf(P, labels=False):
    vals = np.stack([f(P) for _, f in PARTS], 1)
    if labels: return vals.argmin(1)
    d = vals[:, 0]
    for i, (n, _) in enumerate(PARTS[1:], start=1):
        d = smin(d, vals[:, i], BLEND.get(n, 0.024 if n.startswith(("delt", "uarm", "thigh")) else 0.016))
    return d

def grid_field(fn, lo, hi, vox):
    lo = np.asarray(lo, np.float32); hi = np.asarray(hi, np.float32)
    n = (np.ceil((hi - lo) / vox)).astype(int) + 1
    xs, ys, zs = [lo[i] + np.arange(n[i], dtype=np.float32) * vox for i in range(3)]
    vol = np.empty(tuple(n), np.float32); X, Y = np.meshgrid(xs, ys, indexing="ij")
    for k in range(n[2]):
        P = np.stack([X.ravel(), Y.ravel(), np.full(X.size, zs[k], np.float32)], 1); vol[:, :, k] = fn(P).reshape(n[0], n[1])
    return vol, lo
BLO, BHI = (-0.4, -0.24, -0.01), (0.4, 0.22, 1.86)
vol, lo = grid_field(sdf, BLO, BHI, 0.0042)
verts, faces, _, _ = marching_cubes(vol, 0.0, spacing=(0.0042,) * 3); verts += lo
print("BODY_MC", len(faces), round(time.time() - T0, 1))

# ---------------- 装甲の板の設計図（第6版：体の曲線に沿って流れる形。四角い板は使わない） ----------------
PL = []
def plate(name, region, off=0.0038, th=0.0036, mat="armor", tris=1400): PL.append((name, region, off, th, mat, tris))
def limb_frame(P, a, b):
    """手足の軸に沿った座標：t（a=0 → b=1）、軸からの角度 φ（0=外側, -π/2=前）"""
    a = np.asarray(a, np.float32); b = np.asarray(b, np.float32); ab = b - a; L2 = float(ab @ ab)
    t = ((P - a) @ ab) / L2; c = a + t[:, None] * ab; r = P - c
    sx = 1.0 if a[0] > 0 else -1.0
    limb_frame.r = np.linalg.norm(r, axis=1)      # 軸からの距離（同じ高さの胴体を板に含めないため）
    return t, np.arctan2(r[:, 1], r[:, 0] * sx)
def window(phi, c, w, scale=0.06):     # 角度の窓（内側が負）を、およそ距離に直す
    d = np.abs(np.angle(np.exp(1j * (phi - c)))) - w; return d * scale
# 胸：胸の下の縁は弧（両わきへ上がる）、上の縁は鎖骨の少し下
def breast(P):
    a, b, y0 = prof(P[:, 2]); x, y, z = P[:, 0], P[:, 1], P[:, 2]
    return smax(smax(smax(1.395 + 1.6 * x * x - z, z - 1.548, 0.008), np.abs(x) - a * 0.86, 0.01), y - y0 + 0.01, 0.01)
plate("breast", breast, 0.0042, 0.004, tris=2400)
# 腹：くびれに沿って細くなる「コルセット」の板。下の端は骨盤の前で V 字に
def corset(P):
    a, b, y0 = prof(P[:, 2]); x, y, z = P[:, 0], P[:, 1], P[:, 2]
    return smax(smax(smax(np.abs(x) - a * (0.42 + 0.9 * np.maximum(0, z - 1.3)), z - 1.375, 0.008), 1.02 + 2.2 * np.abs(x) - z, 0.01), y - y0 + 0.02, 0.01)
plate("corset", corset, 0.0036, 0.0036, tris=1600)
# 背中：背骨に沿って上へ広がる流線形
def backp(P):
    a, b, y0 = prof(P[:, 2]); x, y, z = P[:, 0], P[:, 1], P[:, 2]
    return smax(smax(np.abs(x) - (0.03 + 0.42 * np.maximum(0, z - 1.2) + 1.2 * np.maximum(0, z - 1.43) ** 1.5), zband(P, 1.18, 1.545), 0.01), -(y - y0) + 0.02, 0.01)
plate("back", backp, 0.0038, 0.0036, tris=1600)
for side, sx in (("L", 1), ("R", -1)):
    J = S[side]
    # 腰：腰の張りに沿う側面の板（くびれから腰骨の曲線をなぞる）
    def hipp(P, sx=sx):
        a, b, y0 = prof(P[:, 2]); x, y, z = P[:, 0], P[:, 1], P[:, 2]
        zc = 1.07; hz = 0.075 * np.clip(1 - ((y - y0) / (b * 0.55)) ** 2, 0, 1)   # 前後の端で細くなる、木の葉形の側面の板
        return smax(smax(a * 0.72 - x * sx, np.abs(z - zc) - hz, 0.01), np.abs(y - y0) - b * 0.55, 0.01)
    plate("hip" + side, hipp, 0.0036, 0.0034, tris=700)
    # お尻：丸みに沿った板
    # 肩：小さく丸い肩当て
    plate("pauld" + side, lambda P, J=J, sx=sx: smax(sph(P, (J["sh"][0] + sx * 0.01, J["sh"][1], J["sh"][2] + 0.01), 0.072), half(P, (0, 0, -1), -(J["sh"][2] - 0.025)), 0.012), 0.0045, 0.0045, tris=900)
    # 上腕：外側の流線形の板
    def uarm(P, J=J):
        t, phi = limb_frame(P, J["el"], J["sh"]); r = limb_frame.r
        return smax(smax(window(phi, 0.0, 0.9 + 0.3 * t, 0.05), np.maximum(0.18 - t, t - 0.72) * 0.25, 0.006), r - 0.075, 0.004)
    plate("uarm" + side, uarm, 0.0036, 0.0034, tris=700)
    # 籠手：手首へ細くなる。ひじ側の縁は斜め
    def gaunt(P, J=J):
        t, phi = limb_frame(P, J["wr"], J["el"]); top = 0.72 + 0.12 * np.cos(phi); r = limb_frame.r
        return smax(smax(-(t - 0.05) * 0.25, (t - top) * 0.25, 0.006), r - 0.065, 0.004)
    plate("gaunt" + side, gaunt, 0.0042, 0.0042, tris=1100)
    # 太もも：前から外側へ、らせん状に流れる長い板
    def thigh(P, J=J):
        t, phi = limb_frame(P, J["kn"], J["hip"]); c = -1.05 + 0.85 * t; r = limb_frame.r
        return smax(smax(window(phi, c, 0.85 + 0.25 * np.sin(np.pi * t), 0.08), np.maximum(0.16 - t, t - (0.86 - 0.12 * np.cos(phi))) * 0.4, 0.008), r - 0.13, 0.004)
    plate("thigh" + side, thigh, 0.0038, 0.0036, tris=1500)
    # ひざ：しずく形
    plate("knee" + side, lambda P, J=J: smax(ellipsoid(P, (J["kn"][0], J["kn"][1] - 0.04, J["kn"][2] + 0.008), (0.046, 0.05, 0.072)), P[:, 1] - J["kn"][1] + 0.01, 0.01), 0.0055, 0.0055, tris=800)
    # すね：前の細長い板。上で広く、足首へ細く
    def shin(P, J=J):
        t, phi = limb_frame(P, J["an"], J["kn"]); r = limb_frame.r
        return smax(smax(window(phi, -np.pi / 2, 0.45 + 0.5 * t, 0.06), np.maximum(0.2 - t, t - 0.84) * 0.4, 0.008), r - 0.085, 0.004)
    plate("shin" + side, shin, 0.0038, 0.0036, tris=900)
    # ブーツ：足を包み、上の縁は前で高く後ろで低い曲線
    plate("boot" + side, lambda P, J=J: smax(sph(P, (J["an"][0], -0.04, 0.09), 0.22), P[:, 2] - (0.205 - 0.45 * np.maximum(0, P[:, 1] - 0.0)), 0.01), 0.0045, 0.0055, tris=1600)
    plate("glove" + side, lambda P, J=J: smax(round_cone(P, J["wr"], J["hd"], 0.07, 0.07), zband(P, J["hd"][2] - 0.04, J["wr"][2] - 0.01), 0.006), 0.0028, 0.0034, tris=800)

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
    f = lambda Q: smax(np.abs(sdf(Q) - off) - th / 2, region(Q), 0.0035)
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
md = body.modifiers.new("dec", "DECIMATE"); md.ratio = 19000 / max(1, len(faces))
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
HCZ = 1.8; HR = 0.136
rimv = oval_patch("vrimO", "armor", 0.121, 0.099, HR, HCZ - 0.004, lift=0.0055, r0=0.88, rings=3)
md = rimv.modifiers.new("so", "SOLIDIFY"); md.thickness = 0.006; md.offset = 1
helmet = join("helmet", [
    usph("hs", "armor", HR, (0, 0, HCZ), (1, 1.06, 1.04), 44),
    oval_patch("visor", "visor", 0.111, 0.09, HR, HCZ - 0.004, lift=0.0045),
    rimv,
    cyl("earL", "accent", 0.034, 0.018, (HR * 0.99, 0.014, HCZ - 0.01), (1, 0, 0)), cyl("earR", "accent", 0.034, 0.018, (-HR * 0.99, 0.014, HCZ - 0.01), (1, 0, 0)),
    torus("neckRing", "armor", (0, 0.008, 1.668), 0.06, 0.014, (1.06, 1.0, 1)),
    torus("neckRing2", "accent", (0, 0.008, 1.648), 0.056, 0.009, (1.06, 1.0, 1)),
])
pack = join("pack", [
    usph("pk", "armor", 0.06, (0, 0.105, 1.46), (0.85, 0.5, 1.55), 32),
    usph("pkS", "accent", 0.02, (0, 0.134, 1.46), (0.6, 0.35, 3.2), 20),
    usph("pkL", "armor", 0.024, (0.058, 0.102, 1.42), (0.7, 0.7, 2.6), 20), usph("pkR", "armor", 0.024, (-0.058, 0.102, 1.42), (0.7, 0.7, 2.6), 20),
    rbox("pkG", "glow", (0.006, 0.004, 0.06), (0, 0.139, 1.46), 1),
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
