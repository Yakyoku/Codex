"""ステージ7「脳」の模型。形の仕様書: Docs/REFERENCE/brain.md, atlas/*.md、実物の写真 Docs/REFERENCE/img/brain/。
   角のない、なめらかな曲面で。単位は µm（Blender の z が上）。
   pyramid     … 錐体細胞：涙形の細胞体（幅 約20µm）から、上へ太い1本の尖端樹状突起（だんだん細る）、横と下へ細い基底樹状突起が数本、
                  下へ細い軸索（写真⑪：尖端の幹が同じ向きにそろって林立する）
   soma_ghost  … 図鑑・区域C用の細胞体だけ（半透明で、中のもつれを見せる）
   tangle      … タウのもつれ：細胞体の中の、炎の形の細い線維の束（写真⑯）
   spine       … 樹状突起のとげ：細い首（長さ 約0.7µm・太さ 約0.2µm）の先に丸い頭（約0.5µm）のきのこ形（写真⑮）
   capillary   … 脳の毛細血管：太さ 約6µm、表面はゆるくでこぼこ、Y の字に分かれる（写真⑲）
   endfoot     … アストロサイトの終足：毛細血管を外から覆う、平たく丸い板（管に沿って曲がる）
   astrocyte   … アストロサイト：小さな体から、細い突起が放射状に多数（写真⑧：星形）
   pericyte    … 周皮細胞：管に張り付く豆形の体と、管を抱える細い腕（写真㉑）
   microglia_r … ふだんのミクログリア：小さな体から、節くれだった細い枝が4〜6本（写真㉓）
   microglia_a … 食べる状態のミクログリア：枝のない、丸くでこぼこした細胞（写真㉔）
   plaque      … アミロイドβのかたまり：細い線維の粒が、ぼやけた輪のように集まる（写真①・㉕。中央はやや空く）
   dystrophic  … かたまりの中の、ふくれた神経突起（黒いソーセージ形。写真①）
   myelin      … 髄鞘に包まれた軸索のひと続き（髄鞘の区間 約80µm、両端の絞輪でくびれる）
   oligo       … オリゴデンドロサイト：小さな体から腕を伸ばし、何本もの軸索に髄鞘を巻く（図鑑用）
   出力: assets/models/brain.raw.glb"""
import sys, os, math, json
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np, bpy
import irlib as L
from mathutils import Vector, noise
from shapes import join, tube, sweep, decimate
rng = np.random.default_rng(77)


def voxel_smooth(ob, size, it=10):
    L.select_only(ob)
    m = ob.modifiers.new("r", "REMESH"); m.mode = "VOXEL"; m.voxel_size = size; bpy.ops.object.modifier_apply(modifier=m.name)
    m = ob.modifiers.new("sm", "SMOOTH"); m.iterations = it; m.factor = 0.8; bpy.ops.object.modifier_apply(modifier=m.name)
    bpy.ops.object.shade_smooth(); return ob


def branch(p0, d0, length, r0, r1, n=14, wob=0.25, seed=0):
    """p0 から d0 の向きへ、ゆるく曲がりながら細くなる枝"""
    d0 = np.asarray(d0, float); d0 /= np.linalg.norm(d0); pts = []
    for i in range(n):
        t = i / (n - 1); off = np.array([math.sin(t * 3 + seed), math.cos(t * 2.3 + seed * 1.7), math.sin(t * 2.7 + seed * 0.6)]) * wob * length * 0.15 * t
        pts.append(np.asarray(p0, float) + d0 * t * length + off)
    return sweep("b", np.array(pts), lambda t, a: r0 + (r1 - r0) * t, nr=12, flat=1.0, sub=False)


L.reset(); objs = []
# ---- 錐体細胞 ----
def soma_shape(name, scale=1.0):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=32, radius=1.0); s = bpy.context.object; s.name = name
    for v in s.data.vertices:   # 涙形：上がとがって尖端の幹につながり、下はふっくら
        z = v.co.z; k = (1 - 0.8 * max(0, z) ** 0.9) * (1 - 0.25 * max(0, -z) ** 2)   # 上へとがる三角錐、下はやや平ら
        v.co.x *= 9 * k; v.co.y *= 8 * k; v.co.z = z * (13 if z > 0 else 7)
        v.co *= scale
    bpy.ops.object.shade_smooth(); return s
parts = [soma_shape("pyr_soma")]
zs = np.linspace(0, 1, 30)
parts.append(sweep("apical", np.stack([1.2 * np.sin(zs * 3), 0.8 * np.sin(zs * 2 + 1), 10 + zs * 140], 1), lambda t, a: 1.6 - 1.0 * t, nr=14, flat=1.0, sub=False))
for k in range(3):   # 尖端の幹から斜めに出る枝
    z0 = 40 + k * 32; a = k * 2.2
    parts.append(branch((0, 0, z0), (math.cos(a), math.sin(a), 1.1), 45, 0.55, 0.22, seed=k))
for k in range(6):   # 基底樹状突起：横へ放射状、ゆるく下がる
    a = k * math.pi * 2 / 6 + 0.3
    parts.append(branch((math.cos(a) * 5, math.sin(a) * 5, -3), (math.cos(a), math.sin(a), -0.25), 55 + 10 * (k % 2), 0.8, 0.25, seed=k + 5))
parts.append(branch((0, 0, -10), (0.05, 0, -1), 60, 0.45, 0.3, wob=0.1, seed=11))   # 軸索
pyr = join(parts, "pyramid"); voxel_smooth(pyr, 0.35, 8); decimate(pyr, 26000); objs.append(pyr)
objs.append(soma_shape("soma_ghost")); voxel_smooth(objs[-1], 0.4, 4); decimate(objs[-1], 6000)
# タウのもつれ：細胞体の中に、核の横から先端へ向かう炎の形の線維の束
parts = []
for i in range(26):
    oy, ox = rng.normal(0, 1.0), rng.normal(0, 1.4); ph = rng.uniform(0, 6)
    pts = [(ox * (1 - 0.6 * t) + 0.6 * math.sin(t * 5 + ph), oy * (1 - 0.6 * t), -4 + t * 16) for t in np.linspace(0, 1, 9)]
    parts.append(tube(pts, 0.16, "t", 1, taper=[0.6, 1, 1, 1, 0.9, 0.8, 0.6, 0.4, 0.2]))
tg = join(parts, "tangle"); decimate(tg, 8000); objs.append(tg)
# とげ（きのこ形）
xs = np.linspace(0, 1, 10)
sp = sweep("spine", np.stack([0 * xs, 0 * xs, xs * 0.75], 1), lambda t, a: 0.11 + 0.17 * max(0, (t - 0.55) / 0.45) ** 0.6 if t < 0.97 else 0.22, nr=10, flat=1.0, sub=False)
bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=10, radius=0.26, location=(0, 0, 0.82)); hd = bpy.context.object; hd.scale = (1, 1, 0.85)
objs.append(join([sp, hd], "spine"))
# ---- 毛細血管（Y 字）と、終足・周皮細胞 ----
xs = np.linspace(-60, 60, 50)
c1 = sweep("cap_a", np.stack([xs, 1.5 * np.sin(xs / 17), 0.8 * np.sin(xs / 23)], 1), lambda t, a: 3.0 * (1 + 0.06 * math.sin(t * 31) + 0.04 * noise.noise(Vector((t * 12, a, 0)))), nr=20, flat=1.0, sub=False)
bs = np.linspace(0, 1, 24)
c2 = sweep("cap_b", np.stack([5 + bs * 50, 2 + bs ** 1.4 * 34, bs * 4], 1), lambda t, a: 2.8 * (1 + 0.06 * math.sin(t * 23)), nr=20, flat=1.0, sub=False)
cap = join([c1, c2], "capillary"); voxel_smooth(cap, 0.3, 6); decimate(cap, 24000); objs.append(cap)
# 終足：管（半径 約3.4）に沿って曲がった、丸い平たい板
verts, faces = [], []; nu, nv = 8, 6
for i in range(nu + 1):
    for j in range(nv + 1):
        u = (i / nu - 0.5) * 2; w = (j / nv - 0.5) * 2; rr = max(0, 1 - u * u - w * w)
        ang = w * 1.05; R = 3.45 + 0.35 * math.sqrt(rr)
        verts.append((u * 3.2, math.sin(ang) * R, math.cos(ang) * R))
for i in range(nu):
    for j in range(nv):
        a = i * (nv + 1) + j; faces.append((a, a + nv + 1, a + nv + 2, a + 1))
ef = L.mesh_object("endfoot", np.array(verts), faces); L.select_only(ef)
m = ef.modifiers.new("s", "SOLIDIFY"); m.thickness = 0.3; bpy.ops.object.modifier_apply(modifier=m.name)
m = ef.modifiers.new("sub", "SUBSURF"); m.levels = 1; bpy.ops.object.modifier_apply(modifier=m.name); bpy.ops.object.shade_smooth(); objs.append(ef)
# アストロサイト：小さな体と、放射状の細い突起（体内では立体の星形）
parts = []
bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, radius=3.5); parts.append(bpy.context.object)
for k in range(16):
    d = Vector(rng.normal(size=3)).normalized(); parts.append(branch(tuple(d * 2.5), tuple(d), rng.uniform(14, 24), 0.7, 0.18, n=10, wob=0.4, seed=k))
ast = join(parts, "astrocyte"); voxel_smooth(ast, 0.22, 6); decimate(ast, 14000); objs.append(ast)
# 周皮細胞：豆形の体と、管を抱える腕
parts = []
bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, radius=1.0); pb = bpy.context.object
for v in pb.data.vertices: v.co.x *= 4.5; v.co.y *= 2.2; v.co.z *= 1.2; v.co.z += 4.4
parts.append(pb)
for k, x0 in enumerate((-6, -2, 2, 6)):
    pts = [(x0 + 0.6 * math.sin(t * 3), math.sin(t * 2.6 * (1 if k % 2 else -1)) * 3.9, math.cos(t * 2.6) * 3.9) for t in np.linspace(0, 1, 12)]
    parts.append(tube(pts, 0.35, "a", 2, taper=[1, 1, .9, .9, .8, .7, .6, .5, .4, .35, .3, .25]))
per = join(parts, "pericyte"); voxel_smooth(per, 0.15, 5); decimate(per, 9000); objs.append(per)
# ミクログリア（ふだん：節くれだった細い枝）
parts = []
bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, radius=1.0); mb = bpy.context.object
for v in mb.data.vertices: v.co.x *= 4.0; v.co.y *= 2.6; v.co.z *= 2.2
parts.append(mb)
for k in range(5):
    a = k * 2 * math.pi / 5 + rng.uniform(-0.3, 0.3); d = (math.cos(a), math.sin(a), rng.uniform(-0.3, 0.3)); ln = rng.uniform(14, 22)
    parts.append(branch((math.cos(a) * 2.5, math.sin(a) * 2, 0), d, ln, 0.6, 0.15, n=12, wob=0.6, seed=k))
    for s in (0.45, 0.75):   # 小枝
        p = (math.cos(a) * ln * s, math.sin(a) * ln * s, 0); b2 = (math.cos(a + 0.9), math.sin(a + 0.9), 0.2)
        parts.append(branch(p, b2, ln * 0.35, 0.3, 0.12, n=6, wob=0.5, seed=k + s))
mg = join(parts, "microglia_r"); voxel_smooth(mg, 0.15, 4)
for v in mg.data.vertices: v.co *= 1 + 0.06 * noise.noise(v.co * 1.5)   # 節・こぶ
decimate(mg, 12000); objs.append(mg)
bpy.ops.mesh.primitive_uv_sphere_add(segments=40, ring_count=24, radius=5.5); ma = bpy.context.object; ma.name = "microglia_a"
for v in ma.data.vertices: v.co *= 1 + 0.08 * noise.noise(v.co * 0.5) + 0.04 * noise.noise(v.co * 1.6)
bpy.ops.object.shade_smooth(); objs.append(ma)
# アミロイドβのかたまり：細い線維の短いきれはしが、ぼやけた輪（殻）に集まる。中心はやや少ない。単位の半径 10
parts = []
for i in range(1500):   # 写真①：細かな粒が、輪郭のぼやけた輪のように集まる（粒は線維の束。実物の1本の線維は 約10nm で見えない）
    r = 10 * (0.3 + 0.7 * rng.beta(5, 2)); d = Vector(rng.normal(size=3)).normalized(); d.z *= 0.65
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=1.0, location=tuple(d * r)); g = bpy.context.object
    g.scale = tuple(rng.uniform(0.09, 0.28, 3)); g.rotation_euler = tuple(rng.uniform(0, 6.3, 3)); parts.append(g)
pl = join(parts, "plaque"); objs.append(pl)
parts = []
for i in range(520):   # 写真①：細かな粒が、輪郭のぼやけた輪のように集まる（粒は線維の束。実物の1本の線維は 約10nm で見えない）
    r = 10 * (0.3 + 0.7 * rng.beta(5, 2)); d = Vector(rng.normal(size=3)).normalized(); d.z *= 0.65
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=1.0, location=tuple(d * r)); g = bpy.context.object
    g.scale = tuple(rng.uniform(0.13, 0.36, 3)); g.rotation_euler = tuple(rng.uniform(0, 6.3, 3)); parts.append(g)
pl2 = join(parts, "plaque_lo"); objs.append(pl2)
parts = []
for i in range(5):
    d = Vector(rng.normal(size=3)).normalized() * rng.uniform(0, 4); dd = Vector(rng.normal(size=3)).normalized()
    pts = [tuple(d + dd * (s - 0.5) * 4) for s in np.linspace(0, 1, 5)]
    parts.append(sweep("dn", np.array(pts), lambda t, a: 0.9 + 0.5 * math.sin(t * math.pi), nr=14, flat=0.9, sub=False))
dy = join(parts, "dystrophic"); voxel_smooth(dy, 0.12, 4); decimate(dy, 5000); objs.append(dy)
# 髄鞘の区間（長さ 約80µm）：両端でくびれる（絞輪）
xs = np.linspace(-41, 41, 60)
objs.append(sweep("myelin", np.stack([xs, 0.3 * np.sin(xs / 13), 0 * xs], 1), lambda t, a: 0.32 + 0.48 * min(1, (min(t, 1 - t) * 82 / 1.2)) ** 0.7, nr=16, flat=1.0))
# オリゴデンドロサイト（図鑑用）：小さな体から腕、その先に髄鞘の筒
parts = []
bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, radius=3.0, location=(0, 0, 8)); parts.append(bpy.context.object)
for k in range(4):
    y = (k - 1.5) * 6
    parts.append(tube([(0, 0, 8), (0, y * 0.5, 5), (0, y, 1.2)], 0.4, "arm", 2))
    xs = np.linspace(-12, 12, 20); parts.append(sweep(f"sh{k}", np.stack([xs, 0 * xs + y, 0 * xs], 1), lambda t, a: 0.9, nr=14, flat=1.0, sub=False))
og = join(parts, "oligo"); voxel_smooth(og, 0.18, 5); decimate(og, 12000); objs.append(og)
mat = bpy.data.materials.new("cell"); [o.data.materials.append(mat) for o in objs]
size = L.export_glb(objs, os.path.join(L.OUT_MODELS, "brain.raw.glb"))
print("STATS " + json.dumps({"bytes": size, "tris": {o.name: sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objs}}))
