"""ステージ5「血管」の模型。形の仕様書: Docs/REFERENCE/vessel.md, atlas/*.md。角のない、なめらかな曲面で。
   leaflet  … 静脈の弁の弁尖：壁から張り出す、ポケットのように丸くくぼんだ薄い膜（単位の大きさ）
   plaque   … プラーク：内膜の下にたまって盛り上がる、なだらかな丘（単位の大きさ）
   foam     … 泡沫細胞：脂質のしずくをたくさん抱えてふくらんだ細胞（外形。図鑑用に半透明）＋ foam_drops（しずく）
   monocyte … 単球：丸い細胞（直径 約15µm）＋ monocyte_nuc（くびれた豆の形の核）
   smc      … 平滑筋細胞：両端の細い紡錘形（長さ 約100µm に縮めずに単位の形で）
   fibrin   … フィブリンの網：太さ 約0.1µm の細い線維が、ゆるく曲がりながら交わる（見えるよう太くして描く。20µm 四方）
   単位は µm。出力: assets/models/vessel.raw.glb"""
import sys, os, math, json
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np, bpy
import irlib as L
from mathutils import Vector, noise
rng = np.random.default_rng(55)
def join(objs, name):
    L.select_only(objs[0]); [o.select_set(True) for o in objs[1:]]; bpy.context.view_layer.objects.active = objs[0]; bpy.ops.object.join()
    o = bpy.context.object; o.name = name; bpy.ops.object.shade_smooth(); return o
def tube(pts, r, name="t", res=2):
    cu = bpy.data.curves.new(name, "CURVE"); cu.dimensions = "3D"; sp = cu.splines.new("NURBS"); sp.points.add(len(pts) - 1)
    for k, q in enumerate(pts): sp.points[k].co = (*q, 1)
    sp.use_endpoint_u = True; cu.bevel_depth = r; cu.bevel_resolution = res; co = bpy.data.objects.new(name, cu); bpy.context.scene.collection.objects.link(co)
    L.select_only(co); bpy.ops.object.convert(target="MESH"); return bpy.context.object
L.reset(); objs = []
# 弁尖：半円の付け根から、ポケット状にふくらむ薄い膜（x：流れの向き、y：横、z：高さ）
verts, faces = [], []; nu, nv = 40, 20
for i in range(nu + 1):
    a = math.pi * i / nu
    for j in range(nv + 1):
        t = j / nv
        y = math.cos(a) * (1 - 0.35 * t); z = math.sin(a) * (1 - 0.1 * t) * (0.15 + 0.85 * t) if False else math.sin(a) * (0.2 + 0.8 * t)
        x = t * 1.0 - 0.25 * math.sin(a) * math.sin(t * math.pi)   # ポケットのくぼみ
        verts.append((x, y, z * 0.9))
for i in range(nu):
    for j in range(nv):
        a = i * (nv + 1) + j; faces.append((a, a + 1, a + nv + 2, a + nv + 1))
lf = L.mesh_object("leaflet", np.array(verts), faces); L.select_only(lf)
m = lf.modifiers.new("s", "SOLIDIFY"); m.thickness = 0.02; bpy.ops.object.modifier_apply(modifier=m.name)
m = lf.modifiers.new("sub", "SUBSURF"); m.levels = 1; bpy.ops.object.modifier_apply(modifier=m.name); bpy.ops.object.shade_smooth(); objs.append(lf)
# プラーク：なだらかな丘
bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=1.0); p = bpy.context.object; p.name = "plaque"
for v in p.data.vertices:
    if v.co.z < 0: v.co.z = 0
    v.co.z *= 0.35; v.co.x *= 1.6; v.co *= 1 + 0.04 * noise.noise(v.co * 3)
bpy.ops.object.shade_smooth(); objs.append(p)
# 泡沫細胞：ふくらんだ外形＋脂質のしずく
bpy.ops.mesh.primitive_uv_sphere_add(segments=40, ring_count=24, radius=10); f = bpy.context.object; f.name = "foam"
for v in f.data.vertices: v.co *= 1 + 0.05 * noise.noise(v.co * 0.3)
bpy.ops.object.shade_smooth(); objs.append(f)
parts = []
for i in range(60):
    q = Vector(rng.normal(size=3)); q = q.normalized() * (rng.uniform(0, 1) ** 0.5) * 7.5
    bpy.ops.mesh.primitive_uv_sphere_add(segments=14, ring_count=8, radius=rng.uniform(0.8, 1.8), location=q); parts.append(bpy.context.object)
objs.append(join(parts, "foam_drops"))
# 単球：丸い細胞＋豆の形の核
bpy.ops.mesh.primitive_uv_sphere_add(segments=40, ring_count=24, radius=7.5); mo = bpy.context.object; mo.name = "monocyte"
for v in mo.data.vertices: v.co *= 1 + 0.04 * noise.noise(v.co * 0.6) + 0.015 * noise.noise(v.co * 2.5)
bpy.ops.object.shade_smooth(); objs.append(mo)
bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=20, radius=4); n = bpy.context.object; n.name = "monocyte_nuc"
for v in n.data.vertices:
    v.co.x *= 1.3; v.co.z *= 0.8
    if v.co.y > 0: v.co.y *= 0.4 + 0.6 * min(1, abs(v.co.x) / 3)   # くびれ（豆の形）
bpy.ops.object.shade_smooth(); objs.append(n)
# 平滑筋細胞：紡錘形
bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=32, radius=1.0); s = bpy.context.object; s.name = "smc"
for v in s.data.vertices: v.co.x *= 12; v.co.y *= 1.0 - 0.6 * (abs(v.co.x) / 12) ** 2; v.co.z *= 0.8 - 0.5 * (abs(v.co.x) / 12) ** 2
bpy.ops.object.shade_smooth(); objs.append(s)
# フィブリンの網（20µm 四方、見えるよう太さ 0.12µm で）
parts = []
for i in range(46):
    a = Vector(rng.uniform(-10, 10, 3)); d = Vector(rng.normal(size=3)).normalized(); ln = rng.uniform(8, 22)
    pts = [tuple(a + d * (t * ln - ln / 2) + Vector((math.sin(t * 6 + i), math.cos(t * 5 + i), math.sin(t * 4)) ) * 0.8) for t in np.linspace(0, 1, 7)]
    parts.append(tube(pts, 0.12, "f", 1))
objs.append(join(parts, "fibrin"))
mat = bpy.data.materials.new("cell"); [o.data.materials.append(mat) for o in objs]
size = L.export_glb(objs, os.path.join(L.OUT_MODELS, "vessel.raw.glb"))
print("STATS " + json.dumps({"bytes": size, "tris": {o.name: sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objs}}))
