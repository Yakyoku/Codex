"""図鑑の3D表示用の模型（ゲームの場面には出ない、または場面では別の形で描いているもの）。形の仕様書: Docs/REFERENCE/atlas/*.md
   mito      … ミトコンドリア：長さ 約 3µm・太さ 約 0.8µm のカプセル。半分を切り開き、内膜のひだ（クリステ）を見せる
   platelet  … 血小板：直径 約 2.5µm・厚み 約 0.5µm の、ふちの丸い円盤
   endo      … 血管内皮細胞：内径 約 6µm の毛細血管の壁の一部（ごく薄い膜を丸めた筒の半分）。核の所は内腔側へ盛り上がる
   pericyte  … 周皮細胞：毛細血管（半透明の筒）の外面に張り付く細胞体のこぶと、幅 2µm 以下の突起
   muller    … ミュラー細胞：網膜を貫く細長い細胞（長さ 約 100µm に縮めずに表示）。内境界膜側の端が広がる終足
   vitreous  … 硝子体：10µm 角の中の、まばらなコラーゲン細線維（実物は太さ 10〜20nm。見えるよう太くして描く）
   単位は µm。出力: assets/models/atlas_extra.raw.glb"""
import sys, os, math, json
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np, bpy, bmesh
import irlib as L
from mathutils import Vector
rng = np.random.default_rng(4)

def join(objs, name):
    L.select_only(objs[0]); [o.select_set(True) for o in objs[1:]]; bpy.context.view_layer.objects.active = objs[0]; bpy.ops.object.join()
    o = bpy.context.object; o.name = name; bpy.ops.object.shade_smooth(); return o
def cut_half(o, axis="y"):
    """片側を切り落として断面を見せる"""
    bm = bmesh.new(); bm.from_mesh(o.data)
    n = Vector((0, 1, 0)) if axis == "y" else Vector((1, 0, 0))
    bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, 0, 0), plane_no=n, clear_outer=True)
    bm.to_mesh(o.data); bm.free()

L.reset(); objs = []
# ミトコンドリア：外膜（カプセル）＋内膜のひだ
bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=0.4); cap = bpy.context.object; cap.scale = (1, 1, 3.6); bpy.ops.object.transform_apply(scale=True)
bpy.ops.object.modifier_add(type="SOLIDIFY"); cap.modifiers[-1].thickness = 0.04; bpy.ops.object.modifier_apply(modifier=cap.modifiers[-1].name)
cut_half(cap)
parts = [cap]
for i in range(9):
    z = -1.15 + i * 0.29
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.33 * math.sqrt(max(0.05, 1 - (z / 1.44) ** 2)), depth=0.03, location=(0, 0, z)); c = bpy.context.object
    c.scale = (1, 0.9, 1); c.rotation_euler = (rng.uniform(-0.15, 0.15), 0, 0); bpy.ops.object.transform_apply(scale=True, rotation=True); cut_half(c); parts.append(c)
mito = join(parts, "mito"); mito.rotation_euler = (math.pi / 2, 0, 0); bpy.ops.object.transform_apply(rotation=True); objs.append(mito)
# 血小板：ふちの丸い円盤
bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=1.25); p = bpy.context.object; p.scale = (1, 1, 0.2); bpy.ops.object.transform_apply(scale=True); p.name = "platelet"
for v in p.data.vertices: v.co.z *= 1 + 0.1 * math.sin(v.co.x * 4) * math.cos(v.co.y * 3)
bpy.ops.object.shade_smooth(); objs.append(p)
# 内皮細胞：筒の壁（内径 6µm、壁 0.25µm）の半分。核の所（長さ 10µm）は内側へ盛り上がる
bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=3.25, depth=24, end_fill_type="NOTHING"); t = bpy.context.object
bpy.ops.object.modifier_add(type="SOLIDIFY"); t.modifiers[-1].thickness = 0.25; bpy.ops.object.modifier_apply(modifier=t.modifiers[-1].name)
bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT"); bpy.ops.mesh.subdivide(number_cuts=6); bpy.ops.object.mode_set(mode="OBJECT")
for v in t.data.vertices:
    a = math.atan2(v.co.y, v.co.x); k = math.exp(-((v.co.z / 4.0) ** 2)) * math.exp(-((a - math.pi / 2) / 0.6) ** 2)
    r = math.hypot(v.co.x, v.co.y); s = (r - 1.1 * k) / r; v.co.x *= s; v.co.y *= s
cut_half(t, "x"); t.name = "endo"; bpy.ops.object.shade_smooth(); t.rotation_euler = (math.pi / 2, 0, 0); bpy.ops.object.transform_apply(rotation=True); objs.append(t)
# 周皮細胞：細胞体のこぶ（核を含む）＋筒を抱く突起
parts = []
bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, radius=1.0, location=(0, 3.9, 0)); b = bpy.context.object; b.scale = (2.2, 0.8, 1.4); bpy.ops.object.transform_apply(scale=True); parts.append(b)
for side in (-1, 1):
    for j in range(2):
        pts = [Vector((3.9 * math.cos(math.pi / 2 + side * a), 3.9 * math.sin(math.pi / 2 + side * a), side * (1.6 + j * 2.2) * (a / 2.4))) for a in np.linspace(0.2, 2.4, 14)]
        cu = bpy.data.curves.new("p", "CURVE"); cu.dimensions = "3D"; sp = cu.splines.new("POLY"); sp.points.add(len(pts) - 1)
        for k, q in enumerate(pts): sp.points[k].co = (*q, 1)
        cu.bevel_depth = 0.32; cu.bevel_resolution = 3; co = bpy.data.objects.new("p", cu); bpy.context.scene.collection.objects.link(co)
        L.select_only(co); bpy.ops.object.convert(target="MESH"); parts.append(bpy.context.object)
per = join(parts, "pericyte"); per.rotation_euler = (math.pi / 2, 0, 0); bpy.ops.object.transform_apply(rotation=True); objs.append(per)
bpy.ops.mesh.primitive_cylinder_add(vertices=40, radius=3.3, depth=20, end_fill_type="NOTHING"); tube = bpy.context.object; tube.name = "pericyte_tube"; tube.rotation_euler = (math.pi / 2, 0, 0); bpy.ops.object.transform_apply(rotation=True); objs.append(tube)
# ミュラー細胞：長さ 100µm。下（外境界膜側）は細く、上（内境界膜側）は終足で円錐状に広がる。幹の途中に細い突起
prof = [(0, 0.6), (10, 1.2), (40, 1.8), (55, 3.0), (60, 2.2), (85, 1.6), (95, 2.5), (99, 6.0), (100, 6.2)]
verts, faces = [], []; seg = 16
for z, r in prof:
    for j in range(seg): a = 2 * math.pi * j / seg; verts.append((r * math.cos(a) * (1 + 0.15 * math.sin(3 * a + z)), r * math.sin(a), z))
for i in range(len(prof) - 1):
    for j in range(seg): a, b2 = i * seg + j, i * seg + (j + 1) % seg; faces.append((a, b2, b2 + seg, a + seg))
mu = L.mesh_object("muller", np.array(verts), faces); parts = [mu]
for i in range(14):
    z = rng.uniform(15, 85); a = rng.uniform(0, 6.28); ln = rng.uniform(4, 9)
    bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=0.5, radius2=0.08, depth=ln, location=(math.cos(a) * ln / 2, math.sin(a) * ln / 2, z)); c = bpy.context.object
    c.rotation_euler = (math.pi / 2 + rng.uniform(-0.4, 0.4), 0, a + math.pi / 2); parts.append(c)
mu = join(parts, "muller"); objs.append(mu)
# 硝子体：10µm 角の中の、まばらな細線維（見えるよう太さ 0.06µm で描く）
parts = []
for i in range(26):
    a = Vector(rng.uniform(-5, 5, 3)); d = Vector(rng.normal(size=3)).normalized(); ln = rng.uniform(5, 12)
    pts = [a + d * (t * ln - ln / 2) + Vector(rng.normal(0, 0.15, 3)) * t for t in np.linspace(0, 1, 6)]
    cu = bpy.data.curves.new("f", "CURVE"); cu.dimensions = "3D"; sp = cu.splines.new("POLY"); sp.points.add(len(pts) - 1)
    for k, q in enumerate(pts): sp.points[k].co = (*q, 1)
    cu.bevel_depth = 0.03; cu.bevel_resolution = 1; co = bpy.data.objects.new("f", cu); bpy.context.scene.collection.objects.link(co)
    L.select_only(co); bpy.ops.object.convert(target="MESH"); parts.append(bpy.context.object)
vit = join(parts, "vitreous"); objs.append(vit)
m = bpy.data.materials.new("cell"); [o.data.materials.append(m) for o in objs]
size = L.export_glb(objs, os.path.join(L.OUT_MODELS, "atlas_extra.raw.glb"))
print("STATS " + json.dumps({"bytes": size, "tris": {o.name: sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objs}}))
