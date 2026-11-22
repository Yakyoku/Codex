"""主人公：医療用ナノスーツの潜行士（第3版）。作り事の存在。
   設計：黒いインナースーツ（蛇腹の関節）の上に、白い陶器質の装甲板を重ねた大気圧潜水服。大きなドーム型バイザー、背中に生命維持・推進ユニット。
   右前腕に浄化の発振器、左前腕に端末。顔は描かない（バイザーの奥は暗い）。
   形は「断面を連ねた曲面（ロフト）」で作り、関節ごとに別オブジェクトにして親子付けする（硬い装甲なので剛体の部品で動かす）。
   身長 2.0。Blender は z が上、正面は -Y。出力: assets/models/diver.raw.glb, assets/textures/diver_ao.png, assets/preview/diver.jpg"""
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
import bpy, numpy as np
from mathutils import Vector
import irlib as L

L.reset()
M = {}
def mat(name, col, rough, metal=0.0, emit=None, coat=0.0, alpha=1.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*col, 1); b.inputs["Roughness"].default_value = rough; b.inputs["Metallic"].default_value = metal
    if coat: b.inputs["Coat Weight"].default_value = coat; b.inputs["Coat Roughness"].default_value = 0.08
    if emit: b.inputs["Emission Color"].default_value = (*emit[0], 1); b.inputs["Emission Strength"].default_value = emit[1]
    if alpha < 1: b.inputs["Alpha"].default_value = alpha
    M[name] = m; return m
mat("armor", (0.50, 0.40, 0.80), 0.24, coat=0.8)          # ラベンダー色の装甲板
mat("armor2", (0.25, 0.16, 0.50), 0.3, coat=0.6)         # 一段濃い紫の副装甲
mat("suit", (0.085, 0.05, 0.19), 0.42, coat=0.35)          # 濃い紫のインナースーツ（継ぎ目に見える）
mat("metal", (0.5, 0.48, 0.58), 0.25, 1.0)
mat("glass", (0.004, 0.004, 0.008), 0.035, coat=1.0)      # 黒いバイザー
mat("inner", (0.03, 0.02, 0.05), 0.8)
mat("glow", (0.6, 0.4, 0.95), 0.4, emit=((0.62, 0.38, 1.0), 3.5))
mat("lamp", (1, 0.95, 0.9), 0.3, emit=((1.0, 0.94, 0.86), 9.0))

def loft(name, m, secs, seg=28, cap=True, keep=None, solid=0.0, bevel=0.0, sub=1):
    """secs: [(中心(x,y,z), 横の半幅, 前後の半幅, 角の丸さ指数)]。keep(角度rad, 断面番号)->bool で面を残す範囲を選ぶ（装甲板の切り出し）"""
    if sub and len(secs) > 8: sub = 0          # 細かく補間済みの曲面は、これ以上分割しない（ポリゴン数の節約）
    C = np.array([s[0] for s in secs], float); n = len(C)
    T = np.gradient(C, axis=0); T /= np.linalg.norm(T, axis=1)[:, None]
    V, F = [], []
    for i in range(n):
        t = T[i]; ref = np.array([0, -1.0, 0]) if abs(t[1]) < 0.85 else np.array([0, 0, 1.0])
        f = ref - t * (t @ ref); f /= np.linalg.norm(f); s = np.cross(t, f)
        rx, ry, e = secs[i][1], secs[i][2], (secs[i][3] if len(secs[i]) > 3 else 2.0)
        for j in range(seg):
            a = 2 * math.pi * j / seg; ca, sa = math.cos(a), math.sin(a)
            V.append(C[i] + f * (np.sign(ca) * abs(ca) ** (2 / e) * ry) + s * (np.sign(sa) * abs(sa) ** (2 / e) * rx))
    for i in range(n - 1):
        for j in range(seg):
            if keep and not keep(2 * math.pi * (j + 0.5) / seg, i): continue
            j2 = (j + 1) % seg; F.append((i * seg + j, i * seg + j2, (i + 1) * seg + j2, (i + 1) * seg + j))
    if cap and not keep:
        V.append(C[0]); V.append(C[-1]); a0, a1 = len(V) - 2, len(V) - 1
        for j in range(seg):
            j2 = (j + 1) % seg; F.append((a0, j2, j)); F.append((a1, (n - 1) * seg + j, (n - 1) * seg + j2))
    ob = L.mesh_object(name, np.array(V), F)
    used = {i for f in F for i in f}
    if len(used) < len(V):
        L.select_only(ob); bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT"); bpy.ops.mesh.delete_loose(); bpy.ops.object.mode_set(mode="OBJECT")
    L.select_only(ob); bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT"); bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode="OBJECT")
    ob.data.materials.append(M[m])
    if solid: md = ob.modifiers.new("so", "SOLIDIFY"); md.thickness = solid; md.offset = 1
    if bevel: md = ob.modifiers.new("b", "BEVEL"); md.width = bevel; md.segments = 2; md.limit_method = "ANGLE"
    if sub: md = ob.modifiers.new("s", "SUBSURF"); md.levels = sub; md.render_levels = sub
    return ob
def dens(secs, step=0.028):
    """断面の列を、なめらかに（Catmull-Rom）細かく補間する。装甲板を高さで切り出すときの精度を上げる"""
    A = np.array([[*c, rx, ry, (e[0] if e else 2.0)] for (c, rx, ry, *e) in secs], float)
    P = np.vstack([2 * A[0] - A[1], A, 2 * A[-1] - A[-2]]); out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        n = max(1, int(round(np.linalg.norm(p2[:3] - p1[:3]) / step)))
        for t in np.linspace(0, 1, n, endpoint=False):
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    out.append(A[-1])
    return [((q[0], q[1], q[2]), max(q[3], 1e-3), max(q[4], 1e-3), q[5]) for q in out]
def torus(name, m, c, R, r, axis=(0, 0, 1), scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=36, minor_segments=10, location=c)
    ob = bpy.context.object; ob.name = name; ob.rotation_euler = Vector((0, 0, 1)).rotation_difference(Vector(axis)).to_euler(); ob.scale = scale
    bpy.ops.object.transform_apply(rotation=True, scale=True); ob.data.materials.append(M[m])
    for p in ob.data.polygons: p.use_smooth = True
    return ob
def sph(name, m, r, c, scale=(1, 1, 1), seg=40):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=c, segments=seg, ring_count=seg // 2); ob = bpy.context.object; ob.name = name; ob.scale = scale
    bpy.ops.object.transform_apply(scale=True); ob.data.materials.append(M[m])
    for p in ob.data.polygons: p.use_smooth = True
    return ob
def cyl(name, m, r, h, c, axis=(0, 0, 1), r2=None, bevel=0.006, verts=28):
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r, radius2=r if r2 is None else r2, depth=h, location=c); ob = bpy.context.object; ob.name = name
    ob.rotation_euler = Vector((0, 0, 1)).rotation_difference(Vector(axis)).to_euler(); bpy.ops.object.transform_apply(rotation=True); ob.data.materials.append(M[m])
    md = ob.modifiers.new("b", "BEVEL"); md.width = bevel; md.segments = 2; md.limit_method = "ANGLE"
    for p in ob.data.polygons: p.use_smooth = True
    return ob
def box(name, m, size, c, bevel=0.012, sub=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=c); ob = bpy.context.object; ob.name = name; ob.scale = size; bpy.ops.object.transform_apply(scale=True); ob.data.materials.append(M[m])
    md = ob.modifiers.new("b", "BEVEL"); md.width = bevel; md.segments = 3
    if sub: md = ob.modifiers.new("s", "SUBSURF"); md.levels = sub
    for p in ob.data.polygons: p.use_smooth = True
    return ob
def half(ob, test):
    """球などから、条件に合う側だけ残す（test(頂点座標)->残すなら True）"""
    L.select_only(ob); me = ob.data
    import bmesh
    bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.delete(bm, geom=[v for v in bm.verts if not test(v.co)], context="VERTS"); bm.to_mesh(me); bm.free(); return ob
def join(name, parts, pivot):
    for o in bpy.context.scene.objects: o.select_set(False)
    for p in parts:
        bpy.context.view_layer.objects.active = p
        for md in list(p.modifiers): bpy.ops.object.modifier_apply(modifier=md.name)
        p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]; bpy.ops.object.join(); ob = parts[0]; ob.name = name; ob.data.name = name
    bpy.context.scene.cursor.location = pivot; bpy.ops.object.origin_set(type="ORIGIN_CURSOR"); return ob
def parent(ch, pa): ch.parent = pa; ch.matrix_parent_inverse = pa.matrix_world.inverted()
def bellows(prefix, c0, c1, R, n, scale=(1, 1, 1), r=None):
    c0, c1 = np.array(c0, float), np.array(c1, float); ax = c1 - c0
    return [torus(f"{prefix}{i}", "suit", tuple(c0 + ax * (i + 0.5) / n), R, r or np.linalg.norm(ax) / n * 0.62, tuple(ax), scale) for i in range(n)]
front = lambda lo, hi: (lambda a, i: (math.cos(a) > lo) and (hi is None or True))
grow = lambda secs, k, z0=None, z1=None: [((c[0], c[1], c[2]), rx + k, ry + k, *e) for (c, rx, ry, *e) in secs if (z0 is None or c[2] >= z0) and (z1 is None or c[2] <= z1)]
FR = lambda a, i: math.cos(a) > 0.05          # 前半分
BK = lambda a, i: math.cos(a) < -0.05         # 後ろ半分
OUT = lambda sx: (lambda a, i: (math.sin(a) * sx > -0.35))   # 外側寄り

# ---------- 第3版：持ち主の参考画像（Docs/REFERENCE/hero/reference-v3.jpg）に基づく、体の線に沿った細身のスーツ ----------
G = lambda secs, k, z0=None, z1=None: grow(secs, k, z0, z1)
def plate(name, secs, k, z0, z1, keep, m="armor", t=0.011, seg=28):
    # 板は体の面にほぼ沿わせ、ごく薄くする（継ぎ目は色の切り替わりと浅い段差で見せる）
    return loft(name, m, G(secs, min(k, 0.002), z0, z1), seg=seg, cap=False, keep=keep, solid=min(t, 0.004), bevel=0.0012)
# 骨盤（根）
pvC = dens([((0, 0.005, 0.915), 0.07, 0.075), ((0, 0.005, 0.95), 0.135, 0.105, 2.3), ((0, 0.008, 1.0), 0.17, 0.12, 2.3), ((0, 0.006, 1.06), 0.16, 0.112, 2.2), ((0, 0.004, 1.12), 0.118, 0.09, 2.1), ((0, 0.003, 1.14), 0.112, 0.086)], 0.02)
pelvis = join("pelvis", [
    loft("pv", "suit", pvC),
    plate("pvS", pvC, 0.006, 0.965, 1.1, lambda a, i: abs(math.sin(a)) > 0.45 and math.cos(a) > -0.75),
    plate("pvF", pvC, 0.006, 0.955, 1.075, lambda a, i: math.cos(a) > 0.86, "armor2"),
    plate("pvB", pvC, 0.006, 0.99, 1.1, lambda a, i: math.cos(a) < -0.8),
    torus("belt", "armor2", (0, 0.004, 1.125), 0.106, 0.007, scale=(1.1, 0.82, 1)),
], (0, 0, 1.0))
# 胸
chestC = dens([((0, 0.003, 1.12), 0.116, 0.088, 2.1), ((0, 0.002, 1.2), 0.1, 0.08, 2.1), ((0, -0.002, 1.3), 0.134, 0.099, 2.3), ((0, -0.008, 1.4), 0.156, 0.113, 2.3), ((0, -0.014, 1.47), 0.166, 0.122, 2.3),
               ((0, -0.006, 1.535), 0.172, 0.108, 2.3), ((0, 0.004, 1.59), 0.15, 0.084, 2.2), ((0, 0.01, 1.63), 0.085, 0.068), ((0, 0.012, 1.68), 0.052, 0.054)], 0.02)
chest = join("chest", [
    loft("ch", "suit", chestC),
    plate("chU", chestC, 0.006, 1.385, 1.585, lambda a, i: math.cos(a) > 0.2, t=0.013),
    plate("chAb", chestC, 0.005, 1.16, 1.355, lambda a, i: math.cos(a) > 0.62, "armor2"),
    plate("chRib", chestC, 0.006, 1.24, 1.37, lambda a, i: 0.05 < math.cos(a) < 0.55),
    plate("chBk", chestC, 0.006, 1.29, 1.585, lambda a, i: math.cos(a) < -0.25, t=0.012),
    plate("chLb", chestC, 0.005, 1.15, 1.27, lambda a, i: math.cos(a) < -0.55, "armor2"),
    sph("bL", "armor", 0.07, (0.068, -0.086, 1.462), (1.0, 0.74, 0.92), 28), sph("bR", "armor", 0.07, (-0.068, -0.086, 1.462), (1.0, 0.74, 0.92), 28),
    loft("ster", "armor2", [((0, -0.128, 1.56), 0.01, 0.008, 3), ((0, -0.138, 1.5), 0.014, 0.01, 3), ((0, -0.126, 1.4), 0.012, 0.008, 3)], seg=10),
    cyl("core", "glow", 0.012, 0.006, (0, -0.132, 1.545), (0, -1, 0.25), bevel=0.002),
    torus("collar", "armor2", (0, 0.012, 1.655), 0.07, 0.013, scale=(1.05, 1, 1)),
], (0, 0, 1.14))
parent(chest, pelvis)
# 背中の小さなユニット
pack = join("pack", [
    loft("pk", "armor", [((0, 0.118, 1.33), 0.06, 0.03, 3), ((0, 0.135, 1.37), 0.1, 0.05, 3.2), ((0, 0.14, 1.47), 0.105, 0.055, 3.2), ((0, 0.13, 1.555), 0.085, 0.045, 3.2), ((0, 0.115, 1.585), 0.05, 0.025, 3)]),
    box("pkP", "armor2", (0.1, 0.02, 0.11), (0, 0.19, 1.46), 0.008), box("pkG", "glow", (0.05, 0.005, 0.01), (0, 0.202, 1.49), 0.002),
] + [o for sx in (1, -1) for o in (
    loft("cn", "armor2", [((sx * 0.105, 0.14, 1.34), 0.016, 0.016), ((sx * 0.105, 0.14, 1.36), 0.03, 0.03), ((sx * 0.105, 0.14, 1.53), 0.03, 0.03), ((sx * 0.105, 0.14, 1.56), 0.016, 0.016)], seg=16),
    torus("cnR", "metal", (sx * 0.105, 0.14, 1.5), 0.031, 0.004))], (0, 0.1, 1.45))
parent(pack, chest)
# 頭：丸いヘルメットと、顔を覆う黒い大きなバイザー
HC = (0, 0.0, 1.835)
def visor_patch(name, m, ax, az, R, rings=14, seg=48, r0=0.0, lift=0.0):
    """ヘルメットの球面の上に、楕円形（半径 ax, az）の面を作る。r0>0 なら輪（縁取り）になる"""
    V, F = [], []
    rs = np.linspace(r0, 1, rings + 1)
    for i, r in enumerate(rs):
        for j in range(seg):
            a = 2 * math.pi * j / seg; x = ax * r * math.cos(a); dz = az * r * math.sin(a)
            y = -math.sqrt(max(1e-6, 1 - (x / R) ** 2 - (dz / (R * 1.03)) ** 2)) * R * 1.05
            V.append((x, y - lift, 1.835 + 0.005 + dz))
    for i in range(rings):
        for j in range(seg):
            j2 = (j + 1) % seg; F.append((i * seg + j, (i + 1) * seg + j, (i + 1) * seg + j2, i * seg + j2))
    ob = L.mesh_object(name, np.array(V), F); ob.data.materials.append(M[m])
    L.select_only(ob); bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT"); bpy.ops.mesh.remove_doubles(threshold=1e-5); bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode="OBJECT")
    return ob
head = join("head", [
    sph("shell", "armor", 0.165, HC, (1, 1.05, 1.03), 48),
    visor_patch("visor", "glass", 0.124, 0.1, 0.165, lift=0.0035),
    visor_patch("vrim", "armor2", 0.137, 0.112, 0.165, rings=3, r0=0.9, lift=0.002),
    loft("neck", "suit", [((0, 0.012, 1.64), 0.055, 0.055), ((0, 0.01, 1.72), 0.06, 0.062)], seg=16),
    loft("crest", "armor2", [((0, -0.1, 1.975), 0.012, 0.006, 3), ((0, 0.0, 2.008), 0.016, 0.008, 3), ((0, 0.11, 1.965), 0.012, 0.006, 3)], seg=10),
] + [o for sx in (1, -1) for o in (
    cyl("ear", "armor2", 0.046, 0.022, (sx * 0.162, 0.02, 1.825), (1, 0, 0), bevel=0.004), cyl("earM", "metal", 0.024, 0.03, (sx * 0.164, 0.02, 1.825), (1, 0, 0), bevel=0.003))], (0, 0.012, 1.67))
parent(head, chest)
objs = [pelvis, chest, pack, head]
for side, sx in (("L", 1), ("R", -1)):
    S, E, Wp = (sx * 0.212, 0.002, 1.572), (sx * 0.262, 0.004, 1.285), (sx * 0.298, -0.018, 1.02)
    uaC = dens([((sx * 0.214, 0.002, 1.565), 0.056, 0.058), ((sx * 0.228, 0.002, 1.5), 0.054, 0.058), ((sx * 0.243, 0.003, 1.4), 0.048, 0.051), ((sx * 0.258, 0.004, 1.31), 0.041, 0.043)], 0.02)
    ua = join("upperArm" + side, [
        sph("sh", "suit", 0.062, S, seg=24), loft("ua", "suit", uaC, seg=20),
        plate("uaA", uaC, 0.005, 1.335, 1.5, lambda a, i, sx=sx: math.sin(a) * sx > -0.3, seg=20),
        sph("pau", "armor", 0.066, (sx * 0.218, 0.002, 1.578), (1.0, 1.05, 0.95), 28),
    ], S); parent(ua, chest)
    faC = dens([((sx * 0.264, 0.004, 1.265), 0.04, 0.042), ((sx * 0.276, 0.0, 1.19), 0.047, 0.05), ((sx * 0.288, -0.01, 1.1), 0.042, 0.045), ((sx * 0.297, -0.017, 1.03), 0.033, 0.035)], 0.02)
    extra = ([loft("em", "armor2", [((sx * 0.33, -0.012, 1.2), 0.008, 0.008), ((sx * 0.336, -0.014, 1.17), 0.015, 0.015), ((sx * 0.345, -0.02, 1.06), 0.014, 0.014), ((sx * 0.347, -0.022, 1.04), 0.008, 0.008)], seg=12),
              cyl("emL", "glow", 0.009, 0.01, (sx * 0.348, -0.023, 1.034), (sx * 0.08, -0.03, -1), bevel=0.002)] if side == "R" else
             [box("dp", "armor2", (0.05, 0.014, 0.08), (sx * 0.283, -0.052, 1.13), 0.005), box("dpS", "glow", (0.034, 0.004, 0.055), (sx * 0.283, -0.061, 1.132), 0.002)])
    fa = join("foreArm" + side, [
        sph("el", "suit", 0.045, E, seg=20), half(sph("elP", "armor2", 0.05, (E[0], E[1] + 0.012, E[2]), (1, 1, 1.15), 20), lambda v: v.y > 0.035),
        loft("fa", "suit", faC, seg=20), plate("faA", faC, 0.005, 1.06, 1.235, lambda a, i: True, seg=20),
        torus("wr", "armor2", (sx * 0.297, -0.017, 1.035), 0.034, 0.006)] + extra, E); parent(fa, ua)
    fing = lambda k: loft("fg", "suit", [((sx * (0.286 + 0.013 * k), -0.02, 0.95), 0.0095, 0.0105), ((sx * (0.287 + 0.013 * k), -0.03, 0.915), 0.009, 0.01), ((sx * (0.288 + 0.013 * k), -0.046, 0.89), 0.008, 0.009), ((sx * (0.288 + 0.013 * k), -0.056, 0.882), 0.0045, 0.005)], seg=10, sub=1)
    hand = join("hand" + side, [
        loft("pm", "suit", [((sx * 0.298, -0.018, 1.025), 0.028, 0.024), ((sx * 0.299, -0.017, 0.99), 0.033, 0.017, 2.6), ((sx * 0.3, -0.019, 0.955), 0.031, 0.015, 2.6), ((sx * 0.3, -0.02, 0.943), 0.023, 0.011)], seg=16),
        plate("pmA", [((sx * 0.299, -0.01, 1.01), 0.031, 0.019, 2.6), ((sx * 0.3, -0.011, 0.962), 0.031, 0.017, 2.6)], 0.0, None, None, lambda a, i: math.cos(a) < -0.2, t=0.006, seg=16),
        fing(0), fing(1), fing(2), fing(3),
        loft("th", "suit", [((sx * 0.27, -0.024, 1.0), 0.011, 0.012), ((sx * 0.256, -0.038, 0.975), 0.01, 0.011), ((sx * 0.252, -0.052, 0.948), 0.0055, 0.006)], seg=10),
    ], Wp); parent(hand, fa)
    H, Kn, An = (sx * 0.088, 0.004, 0.955), (sx * 0.096, -0.004, 0.53), (sx * 0.102, 0.012, 0.115)
    thC = dens([((sx * 0.088, 0.004, 0.95), 0.086, 0.094), ((sx * 0.09, 0.002, 0.86), 0.09, 0.098, 2.1), ((sx * 0.093, -0.002, 0.72), 0.077, 0.084), ((sx * 0.095, -0.004, 0.61), 0.063, 0.067), ((sx * 0.096, -0.004, 0.555), 0.056, 0.059)], 0.022)
    th = join("thigh" + side, [
        sph("hp", "suit", 0.088, H, seg=24), loft("th", "suit", thC, seg=24),
        plate("thA", thC, 0.005, 0.6, 0.905, lambda a, i, sx=sx: math.cos(a) > 0.0 or math.sin(a) * sx > 0.45, seg=24, t=0.012),
        plate("thB", thC, 0.004, 0.62, 0.86, lambda a, i, sx=sx: math.cos(a) < -0.35 and math.sin(a) * sx < 0.3, "armor2", seg=24),
    ], H); parent(th, pelvis)
    shC = dens([((sx * 0.096, -0.003, 0.505), 0.053, 0.056), ((sx * 0.098, 0.01, 0.42), 0.059, 0.069, 2.1), ((sx * 0.1, 0.012, 0.3), 0.048, 0.054), ((sx * 0.101, 0.012, 0.2), 0.04, 0.044), ((sx * 0.102, 0.012, 0.145), 0.038, 0.042)], 0.022)
    sh = join("shin" + side, [
        sph("kn", "suit", 0.057, Kn, seg=20), half(sph("kc", "armor", 0.064, (Kn[0], Kn[1] - 0.012, Kn[2]), (0.95, 1, 1.25), 24), lambda v: v.y < -0.03),
        loft("sh", "suit", shC, seg=24),
        plate("shA", shC, 0.005, 0.17, 0.475, lambda a, i: math.cos(a) > -0.2, seg=24, t=0.012),
        plate("shB", shC, 0.004, 0.24, 0.45, lambda a, i: math.cos(a) < -0.45, "armor2", seg=24),
        torus("anR", "armor2", (sx * 0.102, 0.012, 0.15), 0.041, 0.006),
    ], Kn); parent(sh, th)
    ft = join("foot" + side, [
        sph("an", "suit", 0.04, An, seg=16),
        loft("bt", "armor", [((sx * 0.102, 0.07, 0.06), 0.034, 0.04, 2.5), ((sx * 0.102, 0.03, 0.075), 0.046, 0.056, 2.5), ((sx * 0.104, -0.045, 0.06), 0.05, 0.042, 2.6), ((sx * 0.106, -0.12, 0.044), 0.047, 0.03, 2.6), ((sx * 0.107, -0.165, 0.034), 0.03, 0.02, 2.5)], seg=20),
        loft("sole", "armor2", [((sx * 0.102, 0.08, 0.016), 0.034, 0.017, 3.5), ((sx * 0.103, 0.02, 0.014), 0.05, 0.015, 3.5), ((sx * 0.106, -0.1, 0.012), 0.051, 0.013, 3.5), ((sx * 0.107, -0.172, 0.013), 0.03, 0.012, 3.5)], seg=20, sub=0),
    ], An); parent(ft, sh)
    objs += [ua, fa, hand, th, sh, ft]
bpy.context.view_layer.update()
for o in objs:
    for p in o.data.polygons: p.use_smooth = True

# ---------- AO を1枚に焼き込む（全部品で共有する UV）----------
for o in bpy.context.scene.objects: o.select_set(False)
for o in objs: o.select_set(True)
bpy.context.view_layer.objects.active = objs[0]
bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT")
bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.004)
bpy.ops.object.mode_set(mode="OBJECT")
img = L.new_image("ao", 1024, (1, 1, 1, 1))
import time; t0 = time.time()
sc = bpy.context.scene; sc.cycles.samples = 40
saved = {}
for o in objs:
    saved[o.name] = [s.material for s in o.material_slots]
    for s in o.material_slots:
        m = s.material; nt = m.node_tree
        tex = nt.nodes.get("bakeTex") or nt.nodes.new("ShaderNodeTexImage"); tex.name = "bakeTex"; tex.image = img; nt.nodes.active = tex
bpy.ops.object.bake(type="AO", margin=6, use_clear=True)
a = L.image_to_np(img)[..., 0]
L.save_png(np.stack([a, a, a], -1), os.path.join(L.OUT_TEX, "diver_ao.png"))
for m in M.values():
    n = m.node_tree.nodes.get("bakeTex")
    if n: m.node_tree.nodes.remove(n)
print("TRIS", sum(len(p.vertices) - 2 for o in objs for p in o.data.polygons), "AO_s", round(time.time() - t0, 1))
L.export_glb(objs, os.path.join(L.OUT_MODELS, "diver.raw.glb"))
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(L.OUT_MODELS, "diver.blend"))
