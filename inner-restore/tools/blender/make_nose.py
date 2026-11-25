"""ステージ2「鼻」の模型。形の仕様書: Docs/REFERENCE/nose.md, atlas/*.md
   plug      … 粘液栓：水分を失って固まった粘液の、でこぼこの塊（単位の大きさ。ゲーム側で 直径 約 10µm にする）
   dust      … ほこりの粒：角ばった不ぞろいの粒（単位の大きさ。2〜5µm にして置く）
   staph     … 黄色ブドウ球菌：直径 約 1µm の球が、ぶどうの房のように集まる
   neutro    … 好中球：直径 約 12µm（平たく広がった形）。表面にひだ、中に3〜5つにくびれた核（図鑑用に半分を透かす）
   olfknob   … 嗅細胞の樹状突起の先のふくらみ（直径 約 2µm）と、そこから伸びる長い線毛（動かない）
   出力: assets/models/nose.raw.glb"""
import sys, os, math, json
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np, bpy
import irlib as L
from mathutils import Vector, noise
rng = np.random.default_rng(12)
def join(objs, name):
    L.select_only(objs[0]); [o.select_set(True) for o in objs[1:]]; bpy.context.view_layer.objects.active = objs[0]; bpy.ops.object.join()
    o = bpy.context.object; o.name = name; bpy.ops.object.shade_smooth(); return o
L.reset(); objs = []
# 粘液栓：つぶれたでこぼこの塊
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=4, radius=1.0); p = bpy.context.object; p.name = "plug"
for v in p.data.vertices:
    n = noise.noise(v.co * 2.2) * 0.25 + noise.noise(v.co * 6) * 0.07; v.co *= 1 + n; v.co.z *= 0.55
    if v.co.z < -0.1: v.co.z = -0.1 + (v.co.z + 0.1) * 0.2
bpy.ops.object.shade_smooth(); objs.append(p)
# ほこり：丸みのある不ぞろいの粒（粘液にとらえられ、角は水の膜でやわらかく見える）
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=1.0); d = bpy.context.object; d.name = "dust"
for v in d.data.vertices: v.co *= 1 + 0.22 * noise.noise(v.co * 1.6) + 0.06 * noise.noise(v.co * 5)
bpy.ops.object.shade_smooth(); objs.append(d)
# 黄色ブドウ球菌の房
parts = []; pts = [Vector((0, 0, 0))]
while len(pts) < 14:
    b = pts[rng.integers(len(pts))]; dv = Vector(rng.normal(size=3)).normalized() * 0.95; q = b + dv
    if all((q - x).length > 0.85 for x in pts): pts.append(q)
for q in pts:
    bpy.ops.mesh.primitive_uv_sphere_add(segments=14, ring_count=8, radius=0.5, location=q); parts.append(bpy.context.object)
objs.append(join(parts, "staph"))
# 好中球：平たく広がった細胞（半径 約6µm）。表面は細かなひだで波打ち、太い突起（偽足）と細い糸状の突起を伸ばす
bpy.ops.mesh.primitive_uv_sphere_add(segments=96, ring_count=48, radius=6.0); c = bpy.context.object
for v in c.data.vertices:
    v.co.z *= 0.55
    ang = math.atan2(v.co.y, v.co.x)
    pod = max(0.0, math.cos(ang - 0.4)) ** 6 * 0.35 + max(0.0, math.cos(ang - 2.7)) ** 10 * 0.25   # 偽足（2方向）
    ruff = 0.06 * noise.noise(v.co * 1.4) + 0.035 * noise.noise(v.co * 4.0) + 0.02 * math.sin(v.co.x * 5 + v.co.y * 3)
    v.co.x *= 1 + pod; v.co.y *= 1 + pod * 0.6; v.co *= 1 + ruff
c.name = "neutro"; bpy.ops.object.shade_smooth()
parts = [c]
c = join(parts, "neutro"); objs.append(c)
parts = []; lob = [Vector((-2.2, 0.4, 0)), Vector((-0.7, 1.3, 0.2)), Vector((0.9, 0.9, -0.1)), Vector((2.1, -0.5, 0.1))]
for q in lob:
    bpy.ops.mesh.primitive_uv_sphere_add(segments=18, ring_count=10, radius=0.95, location=q); o = bpy.context.object; o.scale = (1.1, 0.85, 0.75); parts.append(o)
for a, b in zip(lob, lob[1:]):
    mid = (a + b) / 2; dv = b - a
    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.18, depth=dv.length, location=mid); o = bpy.context.object
    o.rotation_mode = "QUATERNION"; o.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(dv.normalized()); parts.append(o)
objs.append(join(parts, "neutro_nucleus"))
# 嗅細胞の先：ふくらみ（樹状突起のこぶ）＋長い線毛 12本（粘液の中に寝そべる）
parts = []
bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=10, radius=1.0, location=(0, 0, 0.6)); parts.append(bpy.context.object)
for i in range(12):
    a = i / 12 * 2 * math.pi + rng.uniform(-0.2, 0.2); ln = rng.uniform(14, 22)
    pts = [Vector((0, 0, 1.2))] + [Vector((math.cos(a) * t * ln, math.sin(a) * t * ln, 1.2 + 2.0 * math.sin(t * math.pi * 0.5) * (1 - t) + 0.4 * math.sin(t * 9 + i))) for t in np.linspace(0.08, 1, 10)]
    cu = bpy.data.curves.new("c", "CURVE"); cu.dimensions = "3D"; sp = cu.splines.new("POLY"); sp.points.add(len(pts) - 1)
    for k, q in enumerate(pts): sp.points[k].co = (*q, 1)
    cu.bevel_depth = 0.11; cu.bevel_resolution = 1; co = bpy.data.objects.new("c", cu); bpy.context.scene.collection.objects.link(co)
    L.select_only(co); bpy.ops.object.convert(target="MESH"); parts.append(bpy.context.object)
objs.append(join(parts, "olfknob"))
# ---- 図鑑用 ----
def lathe(name, prof, seg=24):
    verts, faces = [], []
    for z, r in prof:
        for j in range(seg): a = 2 * math.pi * j / seg; verts.append((r * math.cos(a), r * math.sin(a), z))
    for i in range(len(prof) - 1):
        for j in range(seg): a, b = i * seg + j, i * seg + (j + 1) % seg; faces.append((a, b, b + seg, a + seg))
    return L.mesh_object(name, np.array(verts), faces)
# 線毛細胞：高さ 18µm の柱（幅 約 6µm として描く）＋頂面に 60本の線毛（長さ 6µm）
parts = [lathe("cc", [(0, 1.2), (3, 2.2), (14, 3.0), (17.6, 3.0), (18, 2.6)])]
for i in range(60):
    a = rng.uniform(0, 6.28); r = 2.6 * math.sqrt(rng.uniform(0, 1)); bend = rng.uniform(0.2, 0.5)
    pts = [Vector((r * math.cos(a) + bend * t * t * 2.5, r * math.sin(a), 18 + t * 6)) for t in np.linspace(0, 1, 6)]
    cu = bpy.data.curves.new("c", "CURVE"); cu.dimensions = "3D"; sp = cu.splines.new("POLY"); sp.points.add(len(pts) - 1)
    for k, q in enumerate(pts): sp.points[k].co = (*q, 1)
    cu.bevel_depth = 0.12; cu.bevel_resolution = 1; co = bpy.data.objects.new("c", cu); bpy.context.scene.collection.objects.link(co)
    L.select_only(co); bpy.ops.object.convert(target="MESH"); parts.append(bpy.context.object)
objs.append(join(parts, "ciliated"))
# 杯細胞：細い茎＋粘液の粒でふくらんだ杯。頂部が開いて粘液がのぞく
objs.append(lathe("goblet", [(0, 0.8), (6, 1.0), (9, 2.6), (13, 3.4), (16.5, 3.0), (18, 1.6), (18.3, 0.2)]))
# 線毛の断面（9+2）：太さ 0.25µm を 40倍にして、外周の2本組9組と中心の2本を見せる
parts = []
bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=5, depth=3, end_fill_type="NOTHING"); o = bpy.context.object; bpy.ops.object.modifier_add(type="SOLIDIFY"); o.modifiers[-1].thickness = 0.25; bpy.ops.object.modifier_apply(modifier=o.modifiers[-1].name); parts.append(o)
for i in range(9):
    a = i / 9 * 2 * math.pi
    for k in (0, 1):
        r = 3.6; aa = a + (k - 0.5) * 0.16
        bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.55, depth=3.2, location=(r * math.cos(aa), r * math.sin(aa), 0)); parts.append(bpy.context.object)
for dx in (-0.8, 0.8):
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.55, depth=3.2, location=(dx, 0, 0)); parts.append(bpy.context.object)
objs.append(join(parts, "axoneme"))
# 支持細胞：細長い柱（頂面に細い微絨毛）
parts = [lathe("sc", [(0, 1.0), (10, 1.4), (24, 1.8), (27.5, 1.8), (28, 1.4)])]
for i in range(30):
    a = rng.uniform(0, 6.28); r = 1.5 * math.sqrt(rng.uniform(0, 1)); h = rng.uniform(0.8, 1.6)
    bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.08, depth=h, location=(r * math.cos(a), r * math.sin(a), 28 + h / 2)); parts.append(bpy.context.object)
objs.append(join(parts, "sustentacular"))
m = bpy.data.materials.new("cell"); [o.data.materials.append(m) for o in objs]
size = L.export_glb(objs, os.path.join(L.OUT_MODELS, "nose.raw.glb"))
print("STATS " + json.dumps({"bytes": size, "tris": {o.name: sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objs}}))
