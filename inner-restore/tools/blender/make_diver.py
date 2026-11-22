"""主人公：医療用ナノスーツの潜行士（第2版）。作り事の存在。
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
mat("armor", (0.80, 0.79, 0.76), 0.28, coat=0.7)          # 白い陶器質の装甲
mat("armor2", (0.16, 0.17, 0.18), 0.38, coat=0.4)         # 黒鉛色の副装甲
mat("suit", (0.018, 0.02, 0.022), 0.78)                   # インナースーツ（ゴム質）
mat("metal", (0.55, 0.56, 0.58), 0.24, 1.0)               # チタンの輪
mat("glass", (0.03, 0.05, 0.06), 0.03, coat=1.0, alpha=0.32)
mat("inner", (0.002, 0.002, 0.003), 1.0)
mat("glow", (0.2, 0.75, 0.68), 0.4, emit=((0.25, 0.9, 0.8), 3.0))
mat("lamp", (1, 0.95, 0.85), 0.3, emit=((1.0, 0.93, 0.8), 9.0))

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
FR = lambda a, i: math.cos(a) > 0.05          # 前半分
BK = lambda a, i: math.cos(a) < -0.05         # 後ろ半分
OUT = lambda sx: (lambda a, i: (math.sin(a) * sx > -0.35))   # 外側寄り

# ---------- 骨盤（根）----------
pelvis = join("pelvis", [
    loft("pv", "suit", [((0, 0, 0.84), 0.12, 0.10), ((0, 0, 0.88), 0.175, 0.125, 2.4), ((0, 0, 0.96), 0.185, 0.13, 2.4), ((0, 0, 1.02), 0.165, 0.118, 2.3)]),
    loft("pvA", "armor", [((0, 0, 0.865), 0.182, 0.132, 2.4), ((0, 0, 0.93), 0.193, 0.139, 2.4), ((0, 0, 0.985), 0.186, 0.134, 2.4)], cap=False, keep=lambda a, i: abs(math.cos(a)) > 0.25, solid=0.014, bevel=0.004),
    torus("belt", "metal", (0, 0, 1.0), 0.168, 0.013, scale=(1.08, 0.78, 1)),
    box("buckle", "armor2", (0.07, 0.025, 0.045), (0, -0.132, 0.995), 0.006),
] + bellows("ab", (0, 0, 1.02), (0, 0, 1.14), 0.15, 4, (1.06, 0.78, 1)), (0, 0, 0.95))
# ---------- 胸 ----------
chestC = dens([((0, 0.005, 1.12), 0.165, 0.118, 2.3), ((0, 0.0, 1.2), 0.19, 0.135, 2.4), ((0, -0.005, 1.32), 0.225, 0.155, 2.5), ((0, -0.005, 1.44), 0.245, 0.16, 2.5), ((0, 0, 1.52), 0.225, 0.145, 2.4), ((0, 0.01, 1.58), 0.15, 0.115, 2.2), ((0, 0.01, 1.615), 0.105, 0.095)])
grow = lambda secs, k, z0=None, z1=None: [((c[0], c[1], c[2]), rx + k, ry + k, *e) for (c, rx, ry, *e) in secs if (z0 is None or c[2] >= z0) and (z1 is None or c[2] <= z1)]
chest = join("chest", [
    loft("ch", "suit", chestC),
    loft("chF", "armor", grow(chestC, 0.01, 1.335, 1.54), cap=False, keep=lambda a, i: math.cos(a) > 0.1, solid=0.024, bevel=0.006),
    loft("chF2", "armor", grow(chestC, 0.008, 1.185, 1.315), cap=False, keep=lambda a, i: math.cos(a) > 0.32, solid=0.018, bevel=0.005),
    loft("chB", "armor", grow(chestC, 0.008, 1.2, 1.53), cap=False, keep=lambda a, i: math.cos(a) < -0.3, solid=0.018, bevel=0.005),
    loft("chS", "armor2", grow(chestC, 0.006, 1.2, 1.45), cap=False, keep=lambda a, i: -0.25 < math.cos(a) < 0.06, solid=0.012, bevel=0.004),
    loft("ridge", "armor2", [((0, -0.176, 1.535), 0.012, 0.01, 3), ((0, -0.186, 1.5), 0.02, 0.014, 3), ((0, -0.191, 1.42), 0.024, 0.016, 3), ((0, -0.188, 1.345), 0.016, 0.012, 3)], seg=12),
    cyl("core", "metal", 0.03, 0.016, (0.105, -0.176, 1.455), (0.25, -1, 0.1), bevel=0.003), cyl("coreG", "glow", 0.02, 0.006, (0.107, -0.186, 1.456), (0.25, -1, 0.1), bevel=0.002),
    box("tag", "armor2", (0.06, 0.008, 0.016), (-0.11, -0.176, 1.47), 0.002), box("tagG", "glow", (0.02, 0.008, 0.006), (-0.125, -0.178, 1.445), 0.001),
    torus("collar", "metal", (0, 0.01, 1.625), 0.128, 0.02, scale=(1, 0.95, 1)), torus("collar2", "armor2", (0, 0.01, 1.6), 0.14, 0.022, scale=(1.05, 0.95, 1)),
], (0, 0, 1.13))
parent(chest, pelvis)
# ---------- 背中のユニット ----------
hose = lambda sx: loft("hose", "suit", [((sx * 0.1, 0.2, 1.56), 0.022, 0.022), ((sx * 0.13, 0.19, 1.63), 0.022, 0.022), ((sx * 0.135, 0.12, 1.67), 0.022, 0.022), ((sx * 0.125, 0.06, 1.655), 0.022, 0.022)], seg=12)
pack = join("pack", [
    loft("pk", "armor", [((0, 0.2, 1.1), 0.1, 0.05, 3), ((0, 0.215, 1.16), 0.15, 0.085, 3.2), ((0, 0.225, 1.34), 0.165, 0.095, 3.2), ((0, 0.22, 1.5), 0.15, 0.085, 3.2), ((0, 0.2, 1.57), 0.1, 0.05, 3)]),
    box("pkP", "armor2", (0.2, 0.03, 0.2), (0, 0.31, 1.36), 0.012), box("pkG", "glow", (0.012, 0.006, 0.13), (0, 0.327, 1.36), 0.002),
    cyl("pkV1", "armor2", 0.012, 0.16, (-0.05, 0.327, 1.36), bevel=0.003), cyl("pkV2", "armor2", 0.012, 0.16, (0.05, 0.327, 1.36), bevel=0.003),
    hose(1), hose(-1),
] + [o for sx in (1, -1) for o in (
    loft("nac", "armor", [((sx * 0.19, 0.24, 1.08), 0.03, 0.03), ((sx * 0.19, 0.24, 1.12), 0.05, 0.05), ((sx * 0.19, 0.24, 1.3), 0.055, 0.055), ((sx * 0.19, 0.24, 1.42), 0.04, 0.04), ((sx * 0.19, 0.24, 1.46), 0.02, 0.02)], seg=20),
    cyl("noz", "metal", 0.042, 0.05, (sx * 0.19, 0.24, 1.065), r2=0.03), cyl("nozI", "inner", 0.034, 0.02, (sx * 0.19, 0.24, 1.045)),
    torus("nacR", "metal", (sx * 0.19, 0.24, 1.33), 0.056, 0.006))], (0, 0.16, 1.36))
parent(pack, chest)
# ---------- 頭（ドーム型バイザーのヘルメット）----------
HC = (0, -0.005, 1.8)
head = join("head", [
    half(sph("shell", "armor", 0.2, HC, (1, 1.04, 1.02)), lambda v: v.y > 0.03 - 0.5 * max(0, v.z - 1.86) or v.z < 1.67),
    sph("dome", "glass", 0.192, HC, (1, 1.03, 1.01)),
    sph("in", "inner", 0.125, (0, 0.005, 1.79), (0.92, 1.02, 1.12)),
    loft("neck", "suit", [((0, 0.01, 1.6), 0.075, 0.07), ((0, 0.01, 1.7), 0.07, 0.068)], seg=16),
    torus("rimA", "metal", (0, 0.03, 1.8), 0.2, 0.011, axis=(0, 1, 0.3), scale=(1, 1, 1)),
    box("crest", "armor2", (0.05, 0.2, 0.02), (0, 0.06, 1.995), 0.008),
] + [o for sx in (1, -1) for o in (
    cyl("ear", "armor2", 0.05, 0.035, (sx * 0.198, 0.03, 1.79), (1, 0, 0)), cyl("earM", "metal", 0.03, 0.045, (sx * 0.2, 0.03, 1.79), (1, 0, 0)),
    box("lampB", "armor2", (0.04, 0.07, 0.035), (sx * 0.17, -0.06, 1.93), 0.008), cyl("lamp", "lamp", 0.014, 0.012, (sx * 0.17, -0.098, 1.93), (0, 1, 0), bevel=0.002))], (0, 0.01, 1.63))
parent(head, chest)
objs = [pelvis, chest, pack, head]
for side, sx in (("L", 1), ("R", -1)):
    S, E, Wp = (sx * 0.295, 0, 1.47), (sx * 0.33, 0.005, 1.17), (sx * 0.335, -0.01, 0.9)
    uaC = dens([((sx * 0.3, 0, 1.45), 0.066, 0.068), ((sx * 0.315, 0, 1.36), 0.07, 0.072), ((sx * 0.325, 0.003, 1.26), 0.064, 0.066), ((sx * 0.33, 0.005, 1.2), 0.058, 0.06)])
    ua = join("upperArm" + side, [
        sph("sh", "suit", 0.083, S), loft("ua", "suit", uaC, seg=20),
        loft("uaA", "armor", grow(uaC, 0.008, 1.215, 1.4), seg=20, cap=False, keep=lambda a, i, sx=sx: math.sin(a) * sx > -0.55, solid=0.015, bevel=0.004),
        half(sph("pau", "armor", 0.118, (sx * 0.31, 0, 1.47), (1.05, 1.1, 0.78)), lambda v, sx=sx: v.z > 1.44 and v.x * sx > 0.2),
        torus("pauR", "armor2", (sx * 0.31, 0, 1.445), 0.112, 0.008, scale=(1.04, 1.1, 1)),
        torus("shR", "metal", (sx * 0.262, 0, 1.47), 0.07, 0.008, axis=(1, 0, 0.15 * sx)),
    ], S); parent(ua, chest)
    faC = dens([((sx * 0.33, 0.004, 1.13), 0.052, 0.054), ((sx * 0.333, 0, 1.06), 0.06, 0.064, 2.2), ((sx * 0.335, -0.006, 0.96), 0.058, 0.062, 2.3), ((sx * 0.335, -0.01, 0.915), 0.05, 0.052)])
    extra = ([cyl("em", "armor2", 0.022, 0.2, (sx * 0.4, -0.01, 1.0), bevel=0.004), cyl("emM", "metal", 0.027, 0.03, (sx * 0.4, -0.01, 0.905)), cyl("emL", "glow", 0.017, 0.012, (sx * 0.4, -0.01, 0.886), bevel=0.002),
              box("emB", "armor2", (0.03, 0.05, 0.1), (sx * 0.378, -0.01, 1.03), 0.008)] if side == "R" else
             [box("dp", "armor2", (0.07, 0.022, 0.12), (sx * 0.335, -0.072, 1.01), 0.008), box("dpS", "glow", (0.05, 0.004, 0.085), (sx * 0.335, -0.085, 1.012), 0.002)])
    fa = join("foreArm" + side, bellows("el", (sx * 0.329, 0.005, 1.205), (sx * 0.331, 0.004, 1.135), 0.05, 3) + [
        loft("fa", "suit", faC, seg=20), loft("faA", "armor", grow(faC, 0.009, 0.93, 1.1), seg=20, cap=False, solid=0.014, bevel=0.004),
        torus("wr", "metal", (sx * 0.335, -0.01, 0.905), 0.05, 0.008)] + extra, E); parent(fa, ua)
    # 手：手のひら＋まとめた3本の指＋親指（少し握った形）
    fing = lambda k: loft("fg", "suit", [((sx * (0.318 + 0.017 * k), -0.012, 0.815), 0.0125, 0.0135), ((sx * (0.318 + 0.017 * k), -0.022, 0.775), 0.012, 0.013), ((sx * (0.318 + 0.017 * k), -0.04, 0.745), 0.0105, 0.0115), ((sx * (0.318 + 0.017 * k), -0.052, 0.735), 0.006, 0.007)], seg=10, sub=1)
    hand = join("hand" + side, [
        loft("pm", "suit", [((sx * 0.335, -0.01, 0.9), 0.036, 0.03), ((sx * 0.335, -0.008, 0.86), 0.042, 0.022, 2.6), ((sx * 0.335, -0.01, 0.815), 0.04, 0.02, 2.6), ((sx * 0.335, -0.012, 0.8), 0.03, 0.014)], seg=16),
        loft("pmA", "armor", [((sx * 0.335, 0.002, 0.885), 0.04, 0.024, 2.6), ((sx * 0.335, 0.002, 0.83), 0.04, 0.022, 2.6)], seg=16, cap=False, keep=lambda a, i: math.cos(a) < -0.2, solid=0.008, bevel=0.003),
        fing(0), fing(1), fing(2),
        loft("th", "suit", [((sx * 0.3, -0.018, 0.87), 0.014, 0.015), ((sx * 0.282, -0.034, 0.84), 0.013, 0.014), ((sx * 0.278, -0.05, 0.808), 0.007, 0.008)], seg=10),
    ], Wp); parent(hand, fa)
    H, Kn, An = (sx * 0.105, 0, 0.88), (sx * 0.112, -0.005, 0.5), (sx * 0.115, 0.01, 0.115)
    thC = dens([((sx * 0.105, 0, 0.87), 0.092, 0.098), ((sx * 0.107, -0.004, 0.76), 0.094, 0.102, 2.2), ((sx * 0.11, -0.006, 0.64), 0.082, 0.088), ((sx * 0.112, -0.005, 0.55), 0.068, 0.072)])
    th = join("thigh" + side, [
        sph("hp", "suit", 0.096, H), loft("th", "suit", thC, seg=24),
        loft("thA", "armor", grow(thC, 0.009, 0.565, 0.83), seg=24, cap=False, keep=lambda a, i, sx=sx: math.cos(a) > -0.2 or math.sin(a) * sx > 0.3, solid=0.016, bevel=0.005),
        loft("thS", "armor2", grow(thC, 0.006, 0.58, 0.8), seg=24, cap=False, keep=lambda a, i, sx=sx: math.cos(a) < -0.32 and math.sin(a) * sx < 0.2, solid=0.01, bevel=0.004),
    ], H); parent(th, pelvis)
    shC = dens([((sx * 0.112, -0.003, 0.46), 0.064, 0.068), ((sx * 0.113, 0.008, 0.38), 0.072, 0.082, 2.2), ((sx * 0.114, 0.01, 0.26), 0.062, 0.07), ((sx * 0.115, 0.01, 0.17), 0.052, 0.058)])
    sh = join("shin" + side, bellows("kn", (sx * 0.112, -0.005, 0.545), (sx * 0.112, -0.004, 0.465), 0.06, 3) + [
        loft("sh", "suit", shC, seg=24), loft("shA", "armor", grow(shC, 0.009, 0.18, 0.445), seg=24, cap=False, keep=lambda a, i: math.cos(a) > -0.35, solid=0.015, bevel=0.005),
        loft("shB", "armor2", grow(shC, 0.006, 0.2, 0.43), seg=24, cap=False, keep=lambda a, i: math.cos(a) < -0.5, solid=0.01, bevel=0.004),
        half(sph("kc", "armor", 0.062, (sx * 0.112, -0.03, 0.5), (0.95, 1, 1.15)), lambda v: v.y < -0.045),
        torus("anR", "metal", (sx * 0.115, 0.01, 0.165), 0.055, 0.008),
    ], Kn); parent(sh, th)
    ft = join("foot" + side, bellows("an", (sx * 0.115, 0.01, 0.16), (sx * 0.115, 0.01, 0.1), 0.048, 2) + [
        loft("bt", "armor", [((sx * 0.115, 0.085, 0.05), 0.045, 0.04, 2.6), ((sx * 0.115, 0.04, 0.062), 0.062, 0.058, 2.6), ((sx * 0.117, -0.05, 0.058), 0.066, 0.05, 2.8), ((sx * 0.119, -0.14, 0.045), 0.062, 0.036, 2.8), ((sx * 0.12, -0.19, 0.036), 0.04, 0.024, 2.6)], seg=20),
        loft("sole", "suit", [((sx * 0.115, 0.095, 0.012), 0.044, 0.014, 3.5), ((sx * 0.116, 0.03, 0.012), 0.066, 0.014, 3.5), ((sx * 0.119, -0.12, 0.012), 0.068, 0.014, 3.5), ((sx * 0.12, -0.2, 0.014), 0.04, 0.012, 3.5)], seg=20, sub=0),
        box("toe", "armor2", (0.1, 0.05, 0.02), (sx * 0.12, -0.16, 0.058), 0.008),
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
