"""ステージ6「心臓」の模型。形の仕様書: Docs/REFERENCE/heart.md, atlas/*.md、実物の写真 Docs/REFERENCE/img/heart/。
   角のない、なめらかな曲面で。単位は µm（Blender の z が上、x が線維の向き）。
   myofiber    … 心筋線維のひと続き：太さ 約16µm、長さ 約120µm。断面は少しつぶれた楕円、ゆるくうねる（写真①：線維は平行に走り、うねる）
   myofiber_y  … 枝分かれする心筋線維：途中で Y の字に分かれ、となりの線維とつながる（写真①：枝分かれして網をつくる）
   cardiomyocyte … 図鑑用の心筋細胞1つ：長さ 約100µm・太さ 約20µm、両端が段のついた介在板で切れ、片方の端が二股に分かれる
   cm_nucleus  … 細胞の中央にある、細長い核（写真②：核は中央に1つ）
   collagen    … 線維化のコラーゲンの束：細い線維が何十本も、ゆるく波打ちながら平行に並ぶ（写真⑤：波打つ線維）
   fibroblast  … 心臓の線維芽細胞：平たく、細い突起をのばす星形
   chorda      … 腱索：先に向かって細くなるひもで、途中で3本に枝分かれ。表面に、長さの向きの細い筋（写真⑩）
   capillary   … 毛細血管のひと続き（直径 約6µm、線維のすき間を線維と同じ向きに走る）
   purkinje    … プルキンエ線維の細胞の列：心筋より太く（約30µm）、淡い、短い円柱が連なる
   sa_cell     … 洞結節の細胞：細く、くねった紡錘形（長さ 約25µm・太さ 約8µm）
   出力: assets/models/heart.raw.glb"""
import sys, os, math, json
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np, bpy
import irlib as L
from mathutils import Vector, noise
rng = np.random.default_rng(66)


def join(objs, name):
    L.select_only(objs[0]); [o.select_set(True) for o in objs[1:]]; bpy.context.view_layer.objects.active = objs[0]; bpy.ops.object.join()
    o = bpy.context.object; o.name = name; bpy.ops.object.shade_smooth(); return o


def tube(pts, r, name="t", res=3, taper=None):
    cu = bpy.data.curves.new(name, "CURVE"); cu.dimensions = "3D"; sp = cu.splines.new("NURBS"); sp.points.add(len(pts) - 1)
    for k, q in enumerate(pts):
        sp.points[k].co = (*q, 1); sp.points[k].radius = taper[k] if taper else 1
    sp.use_endpoint_u = True; sp.order_u = 4; sp.resolution_u = 10; cu.bevel_depth = r; cu.bevel_resolution = res; cu.use_fill_caps = True
    co = bpy.data.objects.new(name, cu); bpy.context.scene.collection.objects.link(co)
    L.select_only(co); bpy.ops.object.convert(target="MESH"); return bpy.context.object


def sweep(name, path, radius_fn, nr=28, flat=0.82, groove=0.0, ngroove=0, sub=True):
    """path: (N,3) の点列。radius_fn(t, a) で半径。断面は楕円（flat）、長さの向きの筋（groove）。両端は半球で丸く閉じる"""
    path = np.asarray(path, float); n = len(path)
    rings = []   # (中心, 向き, 半径の倍率, t)
    def frame(i):
        d = path[min(n - 1, i + 1)] - path[max(0, i - 1)]; return d / np.linalg.norm(d)
    d0, d1 = frame(0), frame(n - 1); r0, r1 = radius_fn(0, 0), radius_fn(1, 0)
    NC = 6
    for k in range(NC, 0, -1):
        th = k / NC * math.pi / 2 * 0.97; rings.append((path[0] - d0 * r0 * math.sin(th), d0, math.cos(th), 0.0))
    for i in range(n): rings.append((path[i], frame(i), 1.0, i / (n - 1)))
    for k in range(1, NC + 1):
        th = k / NC * math.pi / 2 * 0.97; rings.append((path[-1] + d1 * r1 * math.sin(th), d1, math.cos(th), 1.0))
    verts, faces = [], []
    for (p, d, m, t) in rings:
        up = np.array([0, 0, 1.0]) if abs(d[2]) < 0.95 else np.array([1.0, 0, 0])
        s_ = np.cross(d, up); s_ /= np.linalg.norm(s_); u = np.cross(s_, d)
        for j in range(nr):
            a = 2 * math.pi * j / nr
            r = radius_fn(t, a) * m
            if ngroove: r *= 1 - groove * (0.5 + 0.5 * math.cos(a * ngroove)) ** 4
            verts.append(p + s_ * math.cos(a) * r + u * math.sin(a) * r * flat)
    R = len(rings)
    for i in range(R - 1):
        for j in range(nr):
            a, b = i * nr + j, i * nr + (j + 1) % nr
            faces.append((a, a + nr, b + nr, b))
    c0 = len(verts); verts.append(rings[0][0] - rings[0][1] * 0.01); c1 = len(verts); verts.append(rings[-1][0] + rings[-1][1] * 0.01)
    for j in range(nr):
        faces.append((c0, j, (j + 1) % nr)); a, b = (R - 1) * nr + j, (R - 1) * nr + (j + 1) % nr; faces.append((a, c1, b))
    ob = L.mesh_object(name, np.array(verts), faces)
    L.select_only(ob)
    if sub:
        m = ob.modifiers.new("sub", "SUBSURF"); m.levels = 1; bpy.ops.object.modifier_apply(modifier=m.name)
    bpy.ops.object.shade_smooth()
    return ob


def decimate(ob, tris):
    L.select_only(ob); now = sum(len(p.vertices) - 2 for p in ob.data.polygons)
    if now > tris:
        m = ob.modifiers.new("d", "DECIMATE"); m.ratio = tris / now; bpy.ops.object.modifier_apply(modifier=m.name)
    bpy.ops.object.shade_smooth()


L.reset(); objs = []
# ---- 心筋線維（ゆるくうねる、楕円の断面。ところどころ核のふくらみ）----
xs = np.linspace(-60, 60, 61)
path = np.stack([xs, 0.9 * np.sin(xs / 23), 0.6 * np.sin(xs / 31 + 1)], 1)
objs.append(sweep("myofiber", path, lambda t, a: 8 * (1 + 0.05 * math.sin(t * 17) + 0.06 * math.exp(-((t - 0.5) / 0.06) ** 2) + 0.025 * noise.noise(Vector((t * 9, a, 0)))), flat=0.8))
# ---- 枝分かれする線維：幹から、なめらかに斜めへ分かれる ----
xs = np.linspace(-60, 60, 61)
trunk = sweep("yf_a", np.stack([xs, 0.6 * np.sin(xs / 25), 0 * xs], 1), lambda t, a: 8 * (1 - 0.18 * max(0, t - 0.55)), flat=0.8)
bs = np.linspace(0, 1, 30)
branch = sweep("yf_b", np.stack([bs * 62, 7 + bs ** 1.6 * 13, 0 * bs], 1) + np.array([-2, -6, 0]), lambda t, a: 6.4 * (1 - 0.1 * t), flat=0.8)
objs.append(join([trunk, branch], "myofiber_y"))
L.select_only(objs[-1]); m = objs[-1].modifiers.new("r", "REMESH"); m.mode = "VOXEL"; m.voxel_size = 0.5; bpy.ops.object.modifier_apply(modifier=m.name)
m = objs[-1].modifiers.new("sm", "SMOOTH"); m.iterations = 12; m.factor = 0.8; bpy.ops.object.modifier_apply(modifier=m.name); bpy.ops.object.shade_smooth()
# ---- 図鑑用の心筋細胞1つ（両端は段のついた介在板。片方は二股）----
def stepped_end(v, x0, sgn):
    """端の面を、階段状に（介在板は線維を横切るが、まっすぐでなく段がつく。写真②⑪）"""
    if (v.co.x - x0) * sgn > 0:
        step = 2.2 * math.floor((v.co.y + 10) / 6) % 2 + 1.4 * (1 if v.co.z > 0 else 0)
        v.co.x = x0 + sgn * step
xs = np.linspace(-50, 50, 51)
c1 = sweep("cm_a", np.stack([xs, 0 * xs, 0 * xs], 1), lambda t, a: 10 * (1 + 0.04 * math.sin(t * 13) + 0.08 * math.exp(-((t - 0.5) / 0.08) ** 2)), flat=0.75)
bs = np.linspace(0, 1, 20)
c2 = sweep("cm_b", np.stack([28 + bs * 26, 4 + bs ** 1.5 * 12, 0 * bs], 1), lambda t, a: 6.5, flat=0.75)
cm = join([c1, c2], "cardiomyocyte"); L.select_only(cm)
m = cm.modifiers.new("r", "REMESH"); m.mode = "VOXEL"; m.voxel_size = 0.5; bpy.ops.object.modifier_apply(modifier=m.name)
m = cm.modifiers.new("sm", "SMOOTH"); m.iterations = 10; m.factor = 0.8; bpy.ops.object.modifier_apply(modifier=m.name)
for v in cm.data.vertices:
    stepped_end(v, 48, 1); stepped_end(v, -48, -1)
bpy.ops.object.shade_smooth(); objs.append(cm)
bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=1.0); n = bpy.context.object; n.name = "cm_nucleus"
for v in n.data.vertices: v.co.x *= 8; v.co.y *= 2.6; v.co.z *= 2.2
bpy.ops.object.shade_smooth(); objs.append(n)
# ---- コラーゲンの束：細い線維が平行に、ゆるく波打つ（長さ 60µm、太さ 約10µm の束）----
parts = []
for i in range(56):   # 細い線維が束にぎっしり並び、そろって波打つ（写真⑤）。束全体が一つの波を共有し、1本ずつ少しずれる
    oy, oz = rng.normal(0, 1.7), rng.normal(0, 1.0); ph = 0.8 + rng.normal(0, 0.25); amp = 1.0 + rng.normal(0, 0.15)
    pts = [(x, oy + amp * math.sin(x / 4.2 + ph) + 0.15 * math.sin(x / 1.7 + i), oz + 0.35 * math.cos(x / 5.5 + ph)) for x in np.linspace(-30, 30, 15)]
    parts.append(tube(pts, rng.uniform(0.16, 0.3), "c", 1, taper=[0.15 + 0.85 * math.sin(math.pi * k / 14) ** 0.5 for k in range(15)]))
objs.append(join(parts, "collagen"))
# ---- 線維芽細胞：平たい星形（中央に核のふくらみ、細い突起）----
parts = []
bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=1.0); b = bpy.context.object
for v in b.data.vertices: v.co.x *= 9; v.co.y *= 4; v.co.z *= 1.6
parts.append(b)
for k in range(5):
    a = k * 2 * math.pi / 5 + rng.uniform(-0.3, 0.3); ln = rng.uniform(14, 22)
    pts = [(math.cos(a) * s * ln + 0.8 * math.sin(s * 5), math.sin(a) * s * ln, 0.4 * math.sin(s * 3)) for s in np.linspace(0.2, 1, 6)]
    parts.append(tube(pts, 0.9, "p", 2, taper=[1, 0.85, 0.7, 0.5, 0.35, 0.2]))
fb = join(parts, "fibroblast"); L.select_only(fb)
m = fb.modifiers.new("r", "REMESH"); m.mode = "VOXEL"; m.voxel_size = 0.35; bpy.ops.object.modifier_apply(modifier=m.name)
m = fb.modifiers.new("sm", "SMOOTH"); m.iterations = 8; m.factor = 0.7; bpy.ops.object.modifier_apply(modifier=m.name); bpy.ops.object.shade_smooth(); objs.append(fb)
# ---- 腱索：根元（下）から先（上）へ細くなり、3本に枝分かれ。長さの向きの細い筋 ----
zs = np.linspace(0, 1, 40)
trunk = sweep("ch_a", np.stack([3 * np.sin(zs * 2), 0 * zs, zs * 160], 1), lambda t, a: 30 * (1 - 0.35 * t), flat=1.0, groove=0.05, ngroove=14)
parts = [trunk]
for k in range(3):
    a = k * 2.1 + 0.4; bs = np.linspace(0, 1, 26)
    pts = np.stack([np.cos(a) * bs ** 1.3 * 70, np.sin(a) * bs ** 1.3 * 70, 150 + bs * 120], 1)
    parts.append(sweep(f"ch_b{k}", pts, lambda t, a2: 13 * (1 - 0.45 * t), flat=1.0, groove=0.05, ngroove=10))
ch = join(parts, "chorda"); L.select_only(ch)
m = ch.modifiers.new("r", "REMESH"); m.mode = "VOXEL"; m.voxel_size = 0.5; bpy.ops.object.modifier_apply(modifier=m.name)
m = ch.modifiers.new("sm", "SMOOTH"); m.iterations = 10; m.factor = 0.8; bpy.ops.object.modifier_apply(modifier=m.name); bpy.ops.object.shade_smooth(); objs.append(ch)
# ---- 毛細血管・プルキンエ線維・洞結節の細胞 ----
xs = np.linspace(-60, 60, 41)
objs.append(sweep("capillary", np.stack([xs, 0.6 * np.sin(xs / 19), 0.4 * np.sin(xs / 27)], 1), lambda t, a: 3.0, flat=1.0))
parts = []
for k in range(4):   # 短い太い円柱が、介在板でつながって列になる
    xs = np.linspace(-14, 14, 15) + k * 30 - 45
    parts.append(sweep(f"pk{k}", np.stack([xs, 0 * xs, 0 * xs], 1), lambda t, a: 15 * (1 + 0.05 * math.sin(t * 9)), flat=0.85))
objs.append(join(parts, "purkinje"))
zs = np.linspace(0, 1, 30)
objs.append(sweep("sa_cell", np.stack([zs * 26 - 13, 2.2 * np.sin(zs * 6.3), 1.2 * np.sin(zs * 4)], 1), lambda t, a: 4 * math.sin(math.pi * (0.06 + 0.88 * t)) ** 0.8, flat=0.85))
for o, nt in (("myofiber_y", 24000), ("cardiomyocyte", 30000), ("collagen", 14000), ("chorda", 30000), ("fibroblast", 8000)):
    decimate(bpy.data.objects[o], nt)
mat = bpy.data.materials.new("cell"); [o.data.materials.append(mat) for o in objs]
size = L.export_glb(objs, os.path.join(L.OUT_MODELS, "heart.raw.glb"))
print("STATS " + json.dumps({"bytes": size, "tris": {o.name: sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objs}}))
