"""主人公：医療用ナノスーツの潜行士（作り事の存在。硬質な素材で、有機的な背景と対比させる）。
   身長 2.0（=2µm 相当）。関節ごとに別オブジェクトにして親子付けし、実行時に関節を回して動かす（硬いスーツなので剛体の部品で動かす）。
   Blender は z が上、正面は -Y。出力: assets/models/diver.raw.glb, assets/preview/diver.jpg"""
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
import bpy
from mathutils import Vector
import irlib as L

L.reset()
M = {}
def mat(name, col, rough, metal=0.0, emit=None, coat=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*col, 1); b.inputs["Roughness"].default_value = rough; b.inputs["Metallic"].default_value = metal
    if coat and "Coat Weight" in b.inputs: b.inputs["Coat Weight"].default_value = coat
    if emit:
        b.inputs["Emission Color"].default_value = (*emit[0], 1); b.inputs["Emission Strength"].default_value = emit[1]
    M[name] = m; return m
mat("shell", (0.78, 0.79, 0.8), 0.32, 0.0, coat=0.6)
mat("joint", (0.035, 0.04, 0.045), 0.7)
mat("metal", (0.45, 0.47, 0.5), 0.28, 1.0)
mat("visor", (0.01, 0.014, 0.02), 0.06, 0.0, coat=1.0)
mat("glow", (0.3, 0.9, 0.82), 0.4, emit=((0.25, 0.95, 0.85), 4.0))
mat("lamp", (1, 0.95, 0.85), 0.3, emit=((1.0, 0.93, 0.8), 8.0))

def finish(ob, name, m, bevel=0.0, subsurf=0, smooth=True):
    ob.name = name; ob.data.name = name
    ob.data.materials.clear(); ob.data.materials.append(M[m])
    if bevel > 0:
        md = ob.modifiers.new("b", "BEVEL"); md.width = bevel; md.segments = 3
    if subsurf:
        md = ob.modifiers.new("s", "SUBSURF"); md.levels = subsurf; md.render_levels = subsurf
    if smooth:
        for p in ob.data.polygons: p.use_smooth = True
    return ob
def cube(name, m, size, loc, bevel=0.03, sub=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc); ob = bpy.context.object; ob.scale = size
    bpy.ops.object.transform_apply(scale=True); return finish(ob, name, m, bevel, sub)
def sph(name, m, r, loc, scale=(1, 1, 1), seg=32):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=seg, ring_count=seg // 2); ob = bpy.context.object; ob.scale = scale
    bpy.ops.object.transform_apply(scale=True); return finish(ob, name, m)
def cyl(name, m, r, h, loc, rot=(0, 0, 0), r2=None, bevel=0.012, verts=28):
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r, radius2=r if r2 is None else r2, depth=h, location=loc, rotation=rot); ob = bpy.context.object
    return finish(ob, name, m, bevel)
def join(name, parts):
    for o in bpy.context.scene.objects: o.select_set(False)
    for p in parts:
        bpy.context.view_layer.objects.active = p
        for md in list(p.modifiers): bpy.ops.object.modifier_apply(modifier=md.name)
        p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join(); parts[0].name = name; return parts[0]
def pivot(ob, p):
    """原点（関節の位置）を p に移す"""
    bpy.context.scene.cursor.location = p
    for o in bpy.context.scene.objects: o.select_set(False)
    ob.select_set(True); bpy.context.view_layer.objects.active = ob
    bpy.ops.object.origin_set(type="ORIGIN_CURSOR"); return ob
def parent(ch, pa):
    ch.parent = pa; ch.matrix_parent_inverse = pa.matrix_world.inverted()

HX = math.pi / 2
# 胴（腰の関節が根）
torso = join("torso", [
    cube("t1", "shell", (0.5, 0.32, 0.42), (0, 0, 1.36), 0.09),
    cube("t2", "joint", (0.4, 0.26, 0.2), (0, 0, 1.1), 0.06),
    cube("t3", "shell", (0.44, 0.3, 0.16), (0, 0, 0.98), 0.05),
    cube("t4", "metal", (0.2, 0.05, 0.12), (0, -0.165, 1.38), 0.015),
    cube("t5", "glow", (0.12, 0.02, 0.022), (0, -0.19, 1.4), 0.004),
    cyl("t6", "metal", 0.13, 0.07, (0, 0, 1.59)),
])
pivot(torso, (0, 0, 1.0))
pack = join("pack", [
    cube("p1", "shell", (0.36, 0.17, 0.42), (0, 0.24, 1.36), 0.05),
    cyl("p2", "metal", 0.055, 0.4, (-0.11, 0.3, 1.36)), cyl("p3", "metal", 0.055, 0.4, (0.11, 0.3, 1.36)),
    cube("p4", "glow", (0.03, 0.01, 0.2), (0, 0.33, 1.38), 0.003),
])
pivot(pack, (0, 0.16, 1.36)); parent(pack, torso)
head = join("head", [
    sph("h1", "shell", 0.2, (0, 0, 1.78), (1, 1.05, 1.0)),
    sph("h2", "visor", 0.172, (0, -0.062, 1.785), (0.95, 0.9, 0.78)),
    cyl("h3", "metal", 0.035, 0.07, (-0.2, 0.02, 1.78), (0, HX, 0)), cyl("h4", "metal", 0.035, 0.07, (0.2, 0.02, 1.78), (0, HX, 0)),
    cyl("h5", "lamp", 0.028, 0.02, (0.13, -0.15, 1.93), (HX, 0, 0)),
    cyl("h6", "metal", 0.036, 0.05, (0.13, -0.125, 1.93), (HX, 0, 0)),
])
pivot(head, (0, 0, 1.62)); parent(head, torso)
objs = [torso, pack, head]
for side, sx in (("L", 1), ("R", -1)):
    ua = join("upperArm" + side, [
        sph("a1", "joint", 0.085, (sx * 0.33, 0, 1.5)),
        sph("a0", "shell", 0.115, (sx * 0.335, 0, 1.52), (1, 1, 0.8)),
        cyl("a2", "shell", 0.07, 0.3, (sx * 0.34, 0, 1.32), r2=0.078),
    ])
    pivot(ua, (sx * 0.33, 0, 1.5)); parent(ua, torso)
    fa = join("foreArm" + side, [
        sph("f1", "joint", 0.068, (sx * 0.34, 0, 1.15)),
        cyl("f2", "shell", 0.058, 0.28, (sx * 0.34, 0, 0.99), r2=0.072),
        cyl("f3", "metal", 0.062, 0.035, (sx * 0.34, 0, 0.86)),
        sph("f4", "joint", 0.062, (sx * 0.34, -0.005, 0.79), (0.8, 1, 1.15)),
    ] + ([cyl("f5", "metal", 0.03, 0.16, (sx * 0.34, -0.085, 0.99), r2=0.03), cyl("f6", "glow", 0.022, 0.02, (sx * 0.34, -0.085, 0.9))] if side == "R" else
         [cube("f7", "visor", (0.085, 0.02, 0.13), (sx * 0.34, -0.07, 1.0), 0.008), cube("f8", "glow", (0.06, 0.006, 0.09), (sx * 0.34, -0.082, 1.0), 0.002)]))
    pivot(fa, (sx * 0.34, 0, 1.15)); parent(fa, ua)
    th = join("thigh" + side, [
        sph("l1", "joint", 0.1, (sx * 0.13, 0, 0.9)),
        cyl("l2", "shell", 0.082, 0.36, (sx * 0.13, 0, 0.68), r2=0.1),
    ])
    pivot(th, (sx * 0.13, 0, 0.9)); parent(th, torso)
    sh = join("shin" + side, [
        sph("s1", "joint", 0.08, (sx * 0.13, 0, 0.48)),
        cyl("s2", "shell", 0.085, 0.36, (sx * 0.13, 0, 0.28), r2=0.07),
        cube("s3", "shell", (0.15, 0.3, 0.1), (sx * 0.13, -0.05, 0.05), 0.04),
        cube("s4", "joint", (0.14, 0.28, 0.025), (sx * 0.13, -0.05, 0.0), 0.008),
    ])
    pivot(sh, (sx * 0.13, 0, 0.48)); parent(sh, th)
    objs += [ua, fa, th, sh]
bpy.context.view_layer.update()
print("TRIS", sum(len(p.vertices) - 2 for o in objs for p in o.data.polygons))
L.export_glb(objs, os.path.join(L.OUT_MODELS, "diver.raw.glb"))
torso.location.z -= 1.0   # 画像では中央に
L.render_views(objs, "diver", 1.05, res=512, samples=40)
