"""ステージ3「肺」の模型。形の仕様書: Docs/REFERENCE/lung.md, atlas/*.md。どれも角を作らず、なめらかな曲面で（鼻での持ち主の指摘を受けて）。
   alveolus … 肺胞の部屋（半径 1 の単位形。ゲームで 半径 約100µm に）：内側から見る球の壁。上に肺胞道への大きな口、壁に小さな孔（コーンの孔）
   club     … クラブ細胞：立方形で、内腔に向いた面がドームのようにふくらむ（線毛はない）
   type2    … II型肺胞上皮細胞：直径 約9〜10µm の丸みのある立方形。表面に細かな微絨毛のこぶ
   macro    … 肺胞マクロファージ：直径 約21µm の、やや平たいかたまり。進む側に薄い膜（葉状の突起）
   soot     … すすの粒：小さな球がぶどうの房のようにつながった塊（フラクタル状）
   grain    … 鉱物の粒（ケイ酸など）：丸みのある不ぞろいの粒
   出力: assets/models/lung.raw.glb"""
import sys, os, math, json
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np, bpy, bmesh
import irlib as L
from mathutils import Vector, noise
rng = np.random.default_rng(21)
def join(objs, name):
    L.select_only(objs[0]); [o.select_set(True) for o in objs[1:]]; bpy.context.view_layer.objects.active = objs[0]; bpy.ops.object.join()
    o = bpy.context.object; o.name = name; bpy.ops.object.shade_smooth(); return o
def lathe(name, prof, seg=32):
    verts, faces = [], []
    for z, r in prof:
        for j in range(seg): a = 2 * math.pi * j / seg; verts.append((r * math.cos(a), r * math.sin(a), z))
    for i in range(len(prof) - 1):
        for j in range(seg): a, b = i * seg + j, i * seg + (j + 1) % seg; faces.append((a, b, b + seg, a + seg))
    o = L.mesh_object(name, np.array(verts), faces); return o
L.reset(); objs = []
# 肺胞の部屋：球（内側から見る）。上（+z）に大きな口、壁に孔。壁はゆるく波打つ（隣の肺胞に押される）
bpy.ops.mesh.primitive_uv_sphere_add(segments=96, ring_count=64, radius=1.0); a = bpy.context.object; a.name = "alveolus"
bm = bmesh.new(); bm.from_mesh(a.data)
holes = [Vector((0, 0, 1)) * 1, *[Vector(rng.normal(size=3)).normalized() for _ in range(5)]]
sizes = [0.42] + [0.05] * 5
dele = [f for f in bm.faces if any((f.calc_center_median().normalized() - h.normalized()).length < s for h, s in zip(holes, sizes))]
bmesh.ops.delete(bm, geom=dele, context="FACES"); bm.to_mesh(a.data); bm.free()
for v in a.data.vertices: v.co *= 1 + 0.035 * noise.noise(v.co * 3) + 0.015 * noise.noise(v.co * 8)
bpy.ops.object.shade_smooth(); objs.append(a)
# クラブ細胞：ドームの頭
objs.append(lathe("club", [(0, 4.0), (2.0, 4.0), (3.2, 3.6), (4.4, 2.6), (5.2, 1.4), (5.5, 0.01)]))
# II型肺胞上皮細胞：丸みのある立方形＋微絨毛のこぶ
bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=20, radius=4.8); t = bpy.context.object; t.scale = (1, 1, 0.75); bpy.ops.object.transform_apply(scale=True)
parts = [t]
for i in range(80):
    d = Vector(rng.normal(size=3)); d.z = abs(d.z) + 0.6; d.normalize()
    if d.z < 0.35: continue
    p = Vector((d.x * 4.8, d.y * 4.8, d.z * 3.6))
    bpy.ops.mesh.primitive_uv_sphere_add(segments=8, ring_count=5, radius=0.22, location=p); parts.append(bpy.context.object)
objs.append(join(parts, "type2"))
# 肺胞マクロファージ：平たいかたまり（直径 約21µm）。進む向き（+x）に薄い膜
bpy.ops.mesh.primitive_uv_sphere_add(segments=96, ring_count=48, radius=10.5); m = bpy.context.object; m.name = "macro"
for v in m.data.vertices:
    v.co.z *= 0.45; ang = math.atan2(v.co.y, v.co.x)
    lam = max(0.0, math.cos(ang)) ** 3 * 0.35
    v.co.x *= 1 + lam; v.co.y *= 1 + lam * 0.4
    if lam > 0.05: v.co.z *= 1 - lam * 1.3
    v.co *= 1 + 0.05 * noise.noise(v.co * 0.35) + 0.025 * noise.noise(v.co * 1.2)
bpy.ops.object.shade_smooth(); objs.append(m)
# すす：ぶどうの房のようにつながった小球（フラクタル状）。単位の大きさ
parts = []; pts = [Vector((0, 0, 0))]
while len(pts) < 26:
    b = pts[rng.integers(len(pts))]; q = b + Vector(rng.normal(size=3)).normalized() * 0.34
    if all((q - x).length > 0.28 for x in pts): pts.append(q)
for q in pts:
    bpy.ops.mesh.primitive_uv_sphere_add(segments=10, ring_count=6, radius=0.18, location=q); parts.append(bpy.context.object)
objs.append(join(parts, "soot"))
# 鉱物の粒
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=1.0); g = bpy.context.object; g.name = "grain"
for v in g.data.vertices: v.co *= 1 + 0.2 * noise.noise(v.co * 1.5) + 0.05 * noise.noise(v.co * 4)
bpy.ops.object.shade_smooth(); objs.append(g)
mat = bpy.data.materials.new("cell"); [o.data.materials.append(mat) for o in objs]
size = L.export_glb(objs, os.path.join(L.OUT_MODELS, "lung.raw.glb"))
print("STATS " + json.dumps({"bytes": size, "tris": {o.name: sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objs}}))
