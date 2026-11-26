"""ステージ4「腸」の模型。形の仕様書: Docs/REFERENCE/gut.md, atlas/*.md。角のない、なめらかな曲面で。
   vtip      … 絨毛の先（単位の半球。ゲームで 半径 約60µm に）：表面はゆるく波打つ
   crypt     … 陰窩の口（くぼみ）のまわりの盛り上がり（単位の輪）
   paneth    … パネート細胞：丸みのある細胞に、抗菌の粒（顆粒）がつまる（図鑑用に半透明の外形＋粒）
   bactero   … バクテロイデス：太さ 約0.6µm・長さ 約2.5µm の、両端の丸い棒（カプセル形）。動かない
   bifido    … ビフィズス菌：太さ 約0.8µm の棒が、先で Y 字に枝分かれする
   akker     … アッカーマンシア：直径 約0.65µm の、ほぼ丸い楕円
   ecoli     … 大腸菌（腸内細菌科）：太さ 約0.5µm・長さ 約2µm の棒と、波打つ長いべん毛
   単位は µm。出力: assets/models/gut.raw.glb"""
import sys, os, math, json
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np, bpy
import irlib as L
from mathutils import Vector, noise
rng = np.random.default_rng(33)
def join(objs, name):
    L.select_only(objs[0]); [o.select_set(True) for o in objs[1:]]; bpy.context.view_layer.objects.active = objs[0]; bpy.ops.object.join()
    o = bpy.context.object; o.name = name; bpy.ops.object.shade_smooth(); return o
def capsule(r, length, loc=(0, 0, 0), rot=None, seg=20):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=12, radius=r, location=loc); o = bpy.context.object
    for v in o.data.vertices:
        if v.co.z > 0: v.co.z += (length - 2 * r) / 2
        else: v.co.z -= (length - 2 * r) / 2
    if rot: o.rotation_euler = rot; bpy.ops.object.transform_apply(rotation=True)
    bpy.ops.object.shade_smooth(); return o
def tube(pts, r, name="t"):
    cu = bpy.data.curves.new(name, "CURVE"); cu.dimensions = "3D"; sp = cu.splines.new("NURBS"); sp.points.add(len(pts) - 1)
    for k, q in enumerate(pts): sp.points[k].co = (*q, 1)
    sp.use_endpoint_u = True; cu.bevel_depth = r; cu.bevel_resolution = 3; co = bpy.data.objects.new(name, cu); bpy.context.scene.collection.objects.link(co)
    L.select_only(co); bpy.ops.object.convert(target="MESH"); return bpy.context.object
L.reset(); objs = []
# 絨毛の先：なめらかな半球（ゆるい起伏）
bpy.ops.mesh.primitive_uv_sphere_add(segments=96, ring_count=48, radius=1.0); v0 = bpy.context.object; v0.name = "vtip"
for v in v0.data.vertices:
    if v.co.z < -0.05: v.co.z = -0.05 - (abs(v.co.z) - 0.05) * 3   # 下は筒のように長く伸びる
    v.co *= 1 + 0.02 * noise.noise(v.co * 4)
bpy.ops.object.shade_smooth(); objs.append(v0)
# 陰窩の口：ゆるく盛り上がった輪
bpy.ops.mesh.primitive_torus_add(major_radius=1.0, minor_radius=0.35, major_segments=48, minor_segments=16); c = bpy.context.object; c.name = "crypt"; c.scale = (1, 1, 0.4); bpy.ops.object.transform_apply(scale=True); bpy.ops.object.shade_smooth(); objs.append(c)
# パネート細胞：外形（半透明で見せる）と粒
bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=20, radius=5.0); p = bpy.context.object; p.scale = (1, 1, 1.5); bpy.ops.object.transform_apply(scale=True); p.name = "paneth"; bpy.ops.object.shade_smooth(); objs.append(p)
parts = []
for i in range(40):
    q = Vector(rng.normal(size=3)) * 1.6; q.z = abs(q.z) * 1.5 + 2.5
    bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=rng.uniform(0.45, 0.8), location=q); parts.append(bpy.context.object)
objs.append(join(parts, "paneth_granules"))
# 細菌
objs.append(capsule(0.3, 2.5, rot=(0, math.pi / 2, 0))); objs[-1].name = "bactero"
a = capsule(0.4, 2.6, loc=(-1.2, 0, 0), rot=(0, math.pi / 2, 0))
b1 = tube([(0.0, 0, 0), (0.5, 0.15, 0), (1.0, 0.55, 0), (1.5, 0.95, 0)], 0.36, "b1")
b2 = tube([(0.0, 0, 0), (0.5, -0.15, 0), (1.0, -0.55, 0), (1.5, -0.95, 0)], 0.36, "b2")
for e in ((1.5, 0.95, 0), (1.5, -0.95, 0), (0.0, 0, 0)):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=14, ring_count=8, radius=0.36, location=e)
    objs_tmp = bpy.context.object; b1 = join([b1, objs_tmp], "b1")
objs.append(join([a, b1, b2], "bifido"))
bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=14, radius=0.33); k = bpy.context.object; k.scale = (1.05, 1, 0.95); bpy.ops.object.transform_apply(scale=True); k.name = "akker"; bpy.ops.object.shade_smooth(); objs.append(k)
e = capsule(0.25, 2.0, rot=(0, math.pi / 2, 0)); parts = [e]
for j in range(4):
    a0 = j / 4 * 2 * math.pi
    pts = [(-1.0 - t * 5, 0.25 * math.cos(a0) + 0.35 * math.sin(t * 9 + j), 0.25 * math.sin(a0) + 0.35 * math.cos(t * 9 + j)) for t in np.linspace(0, 1, 14)]
    parts.append(tube(pts, 0.035, "f"))
objs.append(join(parts, "ecoli"))
m = bpy.data.materials.new("cell"); [o.data.materials.append(m) for o in objs]
size = L.export_glb(objs, os.path.join(L.OUT_MODELS, "gut.raw.glb"))
print("STATS " + json.dumps({"bytes": size, "tris": {o.name: sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objs}}))
