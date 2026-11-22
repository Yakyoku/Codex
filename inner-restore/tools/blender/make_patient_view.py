"""患者の視点の絵（病室のベッドから窓のほうを見た光景）。患者側の変化の演出に使う。
   実在の人物・場所ではない。出力: public/static/img/patient_view.jpg"""
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
import bpy, bmesh
import numpy as np
import irlib as L

sc = L.reset()
def mat(name, col, rough=0.6, emit=None, trans=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]; b.inputs["Base Color"].default_value = (*col, 1); b.inputs["Roughness"].default_value = rough
    if emit: b.inputs["Emission Color"].default_value = (*emit[0], 1); b.inputs["Emission Strength"].default_value = emit[1]
    if trans and "Transmission Weight" in b.inputs: b.inputs["Transmission Weight"].default_value = trans
    return m
def box(name, size, loc, m, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc); o = bpy.context.object; o.scale = size; o.name = name
    bpy.ops.object.transform_apply(scale=True); o.data.materials.append(m)
    if bevel: md = o.modifiers.new("b", "BEVEL"); md.width = bevel; md.segments = 2
    return o
wall = mat("wall", (0.82, 0.8, 0.74), 0.9); floor = mat("floor", (0.45, 0.36, 0.28), 0.5); white = mat("white", (0.9, 0.9, 0.88), 0.5)
wood = mat("wood", (0.4, 0.26, 0.15), 0.5); sheet = mat("sheet", (0.86, 0.88, 0.9), 0.85); green = mat("green", (0.12, 0.32, 0.1), 0.6)
box("floor", (6, 6, 0.1), (0, 0, -0.05), floor); box("ceil", (6, 6, 0.1), (0, 0, 2.75), white)
box("wl", (0.1, 6, 2.8), (-2.6, 0, 1.35), wall); box("wr", (0.1, 6, 2.8), (2.6, 0, 1.35), wall); box("wb", (6, 0.1, 2.8), (0, -3, 1.35), wall)
# 窓のある壁（y=+3）。開口 x:-1.1..1.1, z:0.9..2.2
box("f1", (6, 0.12, 0.9), (0, 3, 0.45), wall); box("f2", (6, 0.12, 0.6), (0, 3, 2.5), wall)
box("f3", (1.55, 0.12, 1.3), (-1.875, 3, 1.55), wall); box("f4", (1.55, 0.12, 1.3), (1.875, 3, 1.55), wall)
for x in (-1.1, 0, 1.1): box("fr", (0.06, 0.08, 1.3), (x, 2.97, 1.55), white)
for z in (0.9, 2.2): box("fr", (2.26, 0.08, 0.06), (0, 2.97, z), white)
box("sill", (2.4, 0.3, 0.05), (0, 2.85, 0.88), white, 0.01)
# 窓の外：空と、遠くの木立ち
sky = box("sky", (14, 0.1, 8), (0, 9, 2.5), mat("sky", (0.5, 0.7, 1.0), 1, emit=((0.55, 0.75, 1.0), 6.0)))
for i, x in enumerate(np.linspace(-4, 4, 9)):
    bpy.ops.mesh.primitive_ico_sphere_add(radius=0.9 + 0.3 * math.sin(i * 2.1), subdivisions=2, location=(x, 7 + 0.4 * math.cos(i), 1.0 + 0.3 * math.sin(i * 1.3)))
    bpy.context.object.data.materials.append(green)
# カーテン（波打つ布）
bm = bmesh.new(); nx, nz = 40, 2
vs = [[bm.verts.new((-1.75 + 0.55 * i / nx, 2.78 + 0.05 * math.sin(i * 1.4), 0.3 + 2.05 * j / nz)) for i in range(nx + 1)] for j in range(nz + 1)]
for j in range(nz):
    for i in range(nx): bm.faces.new((vs[j][i], vs[j][i + 1], vs[j + 1][i + 1], vs[j + 1][i]))
me = bpy.data.meshes.new("curtain"); bm.to_mesh(me); cur = bpy.data.objects.new("curtain", me); sc.collection.objects.link(cur)
for p in me.polygons: p.use_smooth = True
cur.data.materials.append(mat("curtain", (0.75, 0.82, 0.8), 0.9, trans=0.3))
# 窓辺の小さな鉢植え、床頭台とコップ
bpy.ops.mesh.primitive_cylinder_add(radius=0.09, depth=0.14, location=(0.6, 2.82, 0.98)); bpy.context.object.data.materials.append(mat("pot", (0.7, 0.4, 0.3), 0.7))
for a in range(7):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.07, location=(0.6 + 0.09 * math.cos(a), 2.82 + 0.06 * math.sin(a * 2), 1.12 + 0.05 * (a % 3))); o = bpy.context.object; o.scale = (1, 0.5, 1.5); o.data.materials.append(green)
box("table", (0.5, 0.45, 0.7), (1.5, 1.3, 0.35), wood, 0.02)
bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.12, location=(1.45, 1.25, 0.76)); bpy.context.object.data.materials.append(mat("glass", (0.9, 0.95, 1), 0.05, trans=0.95))
box("book", (0.2, 0.28, 0.035), (1.6, 1.35, 0.72), mat("book", (0.5, 0.12, 0.1), 0.6), 0.004)
# 手前：掛け布団（ベッドの上から見ている）
bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(0, -0.2, 0.55)); o = bpy.context.object; o.scale = (0.75, 1.5, 0.22); o.data.materials.append(sheet)
for p in o.data.polygons: p.use_smooth = True
box("footboard", (1.6, 0.06, 0.5), (0, 1.25, 0.65), wood, 0.02)
# 光：窓からの日差し＋室内のやわらかい光
sun = bpy.data.lights.new("sun", "SUN"); sun.energy = 4.5; sun.angle = 0.05; so = bpy.data.objects.new("sun", sun); so.rotation_euler = (math.radians(-62), 0, math.radians(18)); sc.collection.objects.link(so)
al = bpy.data.lights.new("a", "AREA"); al.energy = 260; al.size = 2.2; al.color = (0.75, 0.85, 1); ao = bpy.data.objects.new("a", al); ao.location = (0, 2.7, 1.55); ao.rotation_euler = (math.radians(90), 0, 0); sc.collection.objects.link(ao)
w = bpy.data.worlds.new("w"); w.use_nodes = True; w.node_tree.nodes["Background"].inputs[0].default_value = (0.25, 0.27, 0.3, 1); sc.world = w
cd = bpy.data.cameras.new("cam"); cd.lens = 26; cam = bpy.data.objects.new("cam", cd); cam.location = (0.05, -1.75, 1.12); cam.rotation_euler = (math.radians(86), 0, math.radians(-1.5)); sc.collection.objects.link(cam); sc.camera = cam
sc.render.resolution_x, sc.render.resolution_y = 1280, 720
sc.cycles.samples = 96
try: sc.cycles.use_denoising = True
except Exception: pass
tmp = os.path.join(L.OUT_PREVIEW, "_pv.png"); sc.render.filepath = tmp
bpy.ops.render.render(write_still=True)
from PIL import Image
Image.open(tmp).convert("RGB").save(os.path.join(L.ROOT, "public", "static", "img", "patient_view.jpg"), quality=84)
os.remove(tmp); print("OK")
