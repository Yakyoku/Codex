"""患者の視界（第2版）：朝の病室のベッドから、窓の外を見た光景。実在の場所・人物ではない。
   本物の空の光（Nishita の空）と日差し、空気中の光の筋、透ける薄いカーテン、しわのある掛け布団、木の床、
   窓の外の木々と遠くの街並み、枕元の花と水のグラス、手前の点滴の支柱。窓にピントを合わせ、手前をぼかす。
   出力: public/static/img/patient_view.jpg（1920×1080）"""
import sys, os, math, time
sys.path.insert(0, os.path.dirname(__file__))
import bpy, bmesh
import numpy as np
from mathutils import Vector, noise
import irlib as L

T0 = time.time()
sc = L.reset()
rng = np.random.default_rng(4)
def mat(name, col, rough=0.5, metal=0.0, trans=0.0, sss=0.0, emit=None, alpha=1.0, coat=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*col, 1); b.inputs["Roughness"].default_value = rough; b.inputs["Metallic"].default_value = metal
    if trans: b.inputs["Transmission Weight"].default_value = trans
    if sss: b.inputs["Subsurface Weight"].default_value = sss
    if coat: b.inputs["Coat Weight"].default_value = coat
    if alpha < 1: b.inputs["Alpha"].default_value = alpha
    if emit: b.inputs["Emission Color"].default_value = (*emit[0], 1); b.inputs["Emission Strength"].default_value = emit[1]
    return m
def add(o, m):
    o.data.materials.append(m)
    for p in o.data.polygons: p.use_smooth = True
    return o
def box(name, size, loc, m, bevel=0.0, sub=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc); o = bpy.context.object; o.name = name; o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    if bevel: md = o.modifiers.new("b", "BEVEL"); md.width = bevel; md.segments = 3
    if sub: md = o.modifiers.new("s", "SUBSURF"); md.levels = sub
    o.data.materials.append(m); return o
def grid(name, sx, sy, nx, ny, loc, m, fn=None, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=nx, y_subdivisions=ny, size=1, location=loc, rotation=rot); o = bpy.context.object; o.name = name
    o.scale = (sx, sy, 1); bpy.ops.object.transform_apply(scale=True, rotation=False)
    if fn:
        for v in o.data.vertices: v.co.z += fn(v.co.x, v.co.y)
    return add(o, m)

# ---------- 材質 ----------
wall = mat("wall", (0.86, 0.84, 0.8), 0.85)
ceil = mat("ceil", (0.9, 0.9, 0.88), 0.9)
white = mat("white", (0.92, 0.92, 0.9), 0.35)
metal = mat("metal", (0.8, 0.8, 0.82), 0.22, 1.0)
# 木の床：板目（波の模様）と色むら
floor_m = bpy.data.materials.new("floor"); floor_m.use_nodes = True; nt = floor_m.node_tree; b = nt.nodes["Principled BSDF"]
tc = nt.nodes.new("ShaderNodeTexCoord"); bk = nt.nodes.new("ShaderNodeTexBrick"); bk.inputs["Scale"].default_value = 1.6; bk.offset = 0.5
bk.inputs["Color1"].default_value = (0.42, 0.28, 0.17, 1); bk.inputs["Color2"].default_value = (0.5, 0.34, 0.2, 1); bk.inputs["Mortar"].default_value = (0.25, 0.16, 0.1, 1); bk.inputs["Mortar Size"].default_value = 0.004
mp = nt.nodes.new("ShaderNodeMapping"); mp.inputs["Scale"].default_value = (0.35, 2.4, 1)
wv = nt.nodes.new("ShaderNodeTexWave"); wv.inputs["Scale"].default_value = 3; wv.inputs["Distortion"].default_value = 6
mx = nt.nodes.new("ShaderNodeMixRGB"); mx.blend_type = "MULTIPLY"; mx.inputs["Fac"].default_value = 0.35
nt.links.new(tc.outputs["Object"], mp.inputs["Vector"]); nt.links.new(mp.outputs["Vector"], bk.inputs["Vector"]); nt.links.new(mp.outputs["Vector"], wv.inputs["Vector"])
nt.links.new(bk.outputs["Color"], mx.inputs["Color1"]); nt.links.new(wv.outputs["Color"], mx.inputs["Color2"]); nt.links.new(mx.outputs["Color"], b.inputs["Base Color"])
b.inputs["Roughness"].default_value = 0.32; b.inputs["Coat Weight"].default_value = 0.4
sheet = mat("sheet", (0.88, 0.9, 0.93), 0.9, sss=0.1)
curtain = bpy.data.materials.new("curtain"); curtain.use_nodes = True; nt = curtain.node_tree; nt.nodes.clear()
o_ = nt.nodes.new("ShaderNodeOutputMaterial"); tr = nt.nodes.new("ShaderNodeBsdfTranslucent"); tp = nt.nodes.new("ShaderNodeBsdfTransparent"); df = nt.nodes.new("ShaderNodeBsdfDiffuse")
tr.inputs["Color"].default_value = (0.95, 0.93, 0.88, 1); df.inputs["Color"].default_value = (0.92, 0.9, 0.86, 1)
m1 = nt.nodes.new("ShaderNodeMixShader"); m1.inputs["Fac"].default_value = 0.45; m2 = nt.nodes.new("ShaderNodeMixShader"); m2.inputs["Fac"].default_value = 0.55
nt.links.new(tr.outputs[0], m1.inputs[1]); nt.links.new(df.outputs[0], m1.inputs[2]); nt.links.new(tp.outputs[0], m2.inputs[1]); nt.links.new(m1.outputs[0], m2.inputs[2]); nt.links.new(m2.outputs[0], o_.inputs["Surface"])
glass = mat("glass", (0.95, 0.97, 1.0), 0.02, trans=1.0)
leaf = bpy.data.materials.new("leaf"); leaf.use_nodes = True; nt = leaf.node_tree; b = nt.nodes["Principled BSDF"]
vo = nt.nodes.new("ShaderNodeTexVoronoi"); vo.inputs["Scale"].default_value = 60; ns = nt.nodes.new("ShaderNodeTexNoise"); ns.inputs["Scale"].default_value = 3
cr = nt.nodes.new("ShaderNodeValToRGB"); cr.color_ramp.elements[0].color = (0.018, 0.05, 0.014, 1); cr.color_ramp.elements[1].color = (0.12, 0.24, 0.05, 1)
bm_ = nt.nodes.new("ShaderNodeBump"); bm_.inputs["Strength"].default_value = 0.8
nt.links.new(ns.outputs["Fac"], cr.inputs["Fac"]); nt.links.new(cr.outputs["Color"], b.inputs["Base Color"]); nt.links.new(vo.outputs["Distance"], bm_.inputs["Height"]); nt.links.new(bm_.outputs["Normal"], b.inputs["Normal"])
b.inputs["Roughness"].default_value = 0.6; b.inputs["Subsurface Weight"].default_value = 0.3
bark = mat("bark", (0.16, 0.11, 0.08), 0.8)
grass = mat("grass", (0.12, 0.24, 0.07), 0.9)
def haze_mat(name, col, amount=0.55):    # 遠くのものは空気で白っぽく見える
    m = mat(name, col, 0.8); b = m.node_tree.nodes["Principled BSDF"]; b.inputs["Emission Color"].default_value = (0.72, 0.8, 0.92, 1); b.inputs["Emission Strength"].default_value = amount; return m
bld = haze_mat("building", (0.42, 0.45, 0.5), 0.12); bld2 = haze_mat("building2", (0.55, 0.52, 0.48), 0.16)
petal = mat("petal", (0.95, 0.94, 0.9), 0.5, sss=0.4); stem = mat("stem", (0.15, 0.32, 0.1), 0.6)
wood = mat("wood", (0.45, 0.3, 0.18), 0.45, coat=0.2); book = mat("book", (0.45, 0.12, 0.1), 0.6)
ivbag = mat("ivbag", (0.9, 0.95, 1.0), 0.15, trans=0.9)

# ---------- 部屋（窓の壁は y=+3） ----------
box("floor", (7, 8, 0.1), (0, 0, -0.05), floor_m)
box("ceil", (7, 8, 0.1), (0, 0, 2.85), ceil)
box("wl", (0.1, 8, 2.9), (-2.7, 0, 1.4), wall); box("wr", (0.1, 8, 2.9), (2.7, 0, 1.4), wall); box("wb", (5.4, 0.1, 2.9), (0, -3.4, 1.4), wall)
WX0, WX1, WZ0, WZ1 = -1.35, 1.35, 0.75, 2.45
box("w1", (5.4, 0.18, WZ0), (0, 3.0, WZ0 / 2), wall); box("w2", (5.4, 0.18, 2.9 - WZ1), (0, 3.0, (WZ1 + 2.9) / 2), wall)
box("w3", (WX0 + 2.7, 0.18, WZ1 - WZ0), ((WX0 - 2.7) / 2, 3.0, (WZ0 + WZ1) / 2), wall); box("w4", (2.7 - WX1, 0.18, WZ1 - WZ0), ((WX1 + 2.7) / 2, 3.0, (WZ0 + WZ1) / 2), wall)
for x in (WX0, 0.0, WX1): box("mul", (0.05, 0.08, WZ1 - WZ0), (x, 2.95, (WZ0 + WZ1) / 2), white, 0.008)
for z in (WZ0, WZ1): box("tr", (WX1 - WX0 + 0.05, 0.08, 0.05), (0, 2.95, z), white, 0.008)
box("sill", (WX1 - WX0 + 0.3, 0.32, 0.04), (0, 2.82, WZ0 - 0.01), white, 0.01)
# 薄いカーテン（波打つひだ）を窓の両わきに
def curtain_obj(name, x0, x1):
    fn = lambda x, y: 0.0
    o = grid(name, x1 - x0, 2.25, 160, 2, ((x0 + x1) / 2, 2.78, 1.55), curtain, rot=(math.pi / 2, 0, 0))
    for v in o.data.vertices:
        u = v.co.x; v.co.y += 0.05 * math.sin(u * 34) + 0.02 * math.sin(u * 11 + 1.3)
    return o
curtain_obj("cL", -2.0, -1.0); curtain_obj("cR", 1.05, 1.9)
box("rod", (4.2, 0.03, 0.03), (0, 2.8, 2.7), metal, 0.01)

# ---------- 外：芝、木々、遠くの街並み ----------
grid("lawn", 80, 60, 4, 4, (0, 34, -0.6), grass)
def tree(x, y, s, seed):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.12 * s, depth=3 * s, location=(x, y, 1.5 * s - 0.6)); add(bpy.context.object, bark)
    for k in range(12):
        r = s * (0.45 + 0.3 * rng.random())
        c = (x + (rng.random() - 0.5) * 2.0 * s, y + (rng.random() - 0.5) * 1.6 * s, (2.6 + rng.random() * 2.2) * s - 0.6)
        bpy.ops.mesh.primitive_ico_sphere_add(radius=r, subdivisions=4, location=c); o = bpy.context.object
        tx = bpy.data.textures.new(f"t{seed}{k}", "CLOUDS"); tx.noise_scale = 0.12 * s; tx.noise_depth = 3
        md = o.modifiers.new("d", "DISPLACE"); md.texture = tx; md.strength = 0.35 * s
        add(o, leaf)
for i, (x, y, s) in enumerate([(-7, 17, 1.5), (-3, 21, 1.8), (1.8, 18, 1.4), (6, 23, 1.9), (10, 18, 1.3), (-11, 24, 1.7), (3.5, 27, 1.6), (-5.5, 29, 1.5), (13, 26, 1.6), (-15, 20, 1.4)]):
    tree(x, y, s, i)
for i in range(40):    # 遠くの木立ち（かすんで見える）
    x = -45 + i * 2.4 + rng.random() * 1.2; y = 50 + rng.random() * 12; r = 2.2 + rng.random() * 1.8
    bpy.ops.mesh.primitive_ico_sphere_add(radius=r, subdivisions=3, location=(x, y, r * 0.6)); o = bpy.context.object; o.scale = (1, 0.7, 1.1)
    add(o, haze_mat("far", (0.05, 0.1, 0.04), 0.02))

# ---------- ベッドと掛け布団（しわ） ----------
box("frameL", (0.05, 2.0, 0.05), (-0.55, 0.2, 0.62), metal, 0.01); box("frameR", (0.05, 2.0, 0.05), (0.55, 0.2, 0.62), metal, 0.01)
box("foot", (1.16, 0.05, 0.28), (0, 1.22, 0.72), white, 0.015)
box("footrail", (1.2, 0.035, 0.035), (0, 1.24, 0.88), metal, 0.012)
def blanket(x, y):
    r = math.hypot(x / 0.62, (y - 0.15) / 1.15)
    dome = 0.2 * max(0.0, 1 - r * r) ** 0.6
    wr = 0.012 * math.sin(x * 14 + 2 * math.sin(y * 3)) + 0.008 * noise.noise(Vector((x * 3, y * 3, 0.5)))
    legs = 0.06 * math.exp(-((x - 0.13) / 0.12) ** 2) * max(0, min(1, (y + 0.5))) + 0.06 * math.exp(-((x + 0.13) / 0.12) ** 2) * max(0, min(1, (y + 0.5)))
    return dome + wr + legs
grid("blanket", 1.3, 2.4, 120, 200, (0, 0.05, 0.62), sheet, fn=blanket)
# ---------- 枕元の小さな台：花、水のグラス、本 ----------
box("table", (0.5, 0.45, 0.72), (1.35, 0.9, 0.36), wood, 0.02)
bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=0.13, location=(1.25, 0.82, 0.785)); add(bpy.context.object, glass)
box("book", (0.2, 0.27, 0.035), (1.45, 0.98, 0.738), book, 0.004)
bpy.ops.mesh.primitive_cylinder_add(radius=0.05, depth=0.16, location=(1.5, 0.75, 0.8)); add(bpy.context.object, glass)
for k in range(9):
    a = k * 2.399; h = 0.22 + 0.08 * rng.random(); top = (1.5 + 0.06 * math.cos(a), 0.75 + 0.06 * math.sin(a), 0.72 + h + 0.08)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.004, depth=h + 0.08, location=(1.5 + 0.03 * math.cos(a), 0.75 + 0.03 * math.sin(a), 0.72 + (h + 0.08) / 2)); add(bpy.context.object, stem)
    for p in range(6):
        b_ = p * 1.047
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.022, location=(top[0] + 0.02 * math.cos(b_), top[1] + 0.02 * math.sin(b_), top[2])); o = bpy.context.object; o.scale = (1, 0.5, 0.25); add(o, petal)
# ---------- 手前の点滴の支柱（ぼける） ----------
bpy.ops.mesh.primitive_cylinder_add(radius=0.012, depth=1.9, location=(-0.95, -0.55, 0.95)); add(bpy.context.object, metal)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.08, location=(-0.95, -0.52, 1.78)); o = bpy.context.object; o.scale = (0.8, 0.35, 1.3); add(o, ivbag)

# ---------- 光：本物の空と日差し、空気中の光の筋 ----------
w = bpy.data.worlds.new("w"); w.use_nodes = True; sc.world = w; nt = w.node_tree
sky = nt.nodes.new("ShaderNodeTexSky")
try: sky.sky_type = "NISHITA"
except Exception: pass
for k, v in (("sun_elevation", math.radians(25)), ("sun_rotation", math.atan2(0.8, -0.42) + math.pi / 2), ("altitude", 100), ("air_density", 1.2), ("dust_density", 2.0)):
    try: setattr(sky, k, v)
    except Exception: pass
nt.links.new(sky.outputs["Color"], nt.nodes["Background"].inputs["Color"]); nt.nodes["Background"].inputs["Strength"].default_value = 0.22
sun = bpy.data.lights.new("sun", "SUN"); sun.energy = 9.0; sun.angle = math.radians(1.0); sun.color = (1.0, 0.86, 0.68)
so = bpy.data.objects.new("sun", sun); sc.collection.objects.link(so)
SUN_DIR = Vector((0.42, -0.8, -0.43)).normalized()           # 光の進む向き：窓の外（+y）から部屋へ、右上から左下へ斜めに
so.rotation_euler = (-SUN_DIR).to_track_quat("Z", "Y").to_euler()
# 部屋の空気（ごく薄いもや）で光の筋を見せる
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 1.4)); vb = bpy.context.object; vb.scale = (5.3, 6.6, 2.8); bpy.ops.object.transform_apply(scale=True)
vm = bpy.data.materials.new("air"); vm.use_nodes = True; nt = vm.node_tree; nt.nodes.clear()
vo_ = nt.nodes.new("ShaderNodeOutputMaterial"); pv = nt.nodes.new("ShaderNodeVolumePrincipled"); pv.inputs["Density"].default_value = 0.012; pv.inputs["Color"].default_value = (1, 0.97, 0.92, 1)
nt.links.new(pv.outputs[0], vo_.inputs["Volume"]); vb.data.materials.append(vm)
# 室内のやわらかい反射光（天井から）
al = bpy.data.lights.new("bounce", "AREA"); al.energy = 12; al.size = 3; al.color = (1, 0.96, 0.9)
ao = bpy.data.objects.new("bounce", al); ao.location = (0, 0.5, 2.75); sc.collection.objects.link(ao)

# ---------- カメラ：ベッドの上から窓へ。窓にピント ----------
# 器官ごとの「患者の目に映るもの」：同じ病室の中で、見る場所を変える（VIEW=sight|smell|breath|comfort|circulation|rhythm）
#   smell＝枕元の花／breath＝風にゆれるカーテンと窓／comfort＝枕元の台の、水と食事の盆／circulation＝足もとの掛け布団／rhythm＝点滴の袋と支柱
VIEW = os.environ.get("VIEW", "sight")
if VIEW == "comfort":   # 食事の盆（お椀と湯のみ）を台に足す
    box("tray", (0.3, 0.2, 0.012), (1.3, 0.66, 0.727), wood, 0.004)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.06, location=(1.25, 0.66, 0.775)); o = bpy.context.object
    for v in o.data.vertices:
        if v.co.z > 0.01: v.co.z = 0.01
    bpy.ops.object.shade_smooth(); add(o, white)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.07, location=(1.39, 0.66, 0.77)); add(bpy.context.object, white)
VIEWS = {  # カメラの位置, 見る先, レンズ, ピントの距離
    "sight": ((0.04, -1.5, 1.16), (0.0, 3.0, 1.45), 30, 2.4),
    "smell": ((0.15, -0.55, 1.12), (1.45, 0.82, 0.92), 38, 1.9),
    "breath": ((0.3, -0.6, 1.2), (-1.1, 3.0, 1.5), 40, 3.2),
    "comfort": ((0.6, 0.0, 1.15), (1.32, 0.72, 0.76), 42, 1.05),
    "circulation": ((0.0, -1.2, 1.25), (0.0, 1.0, 0.72), 40, 1.9),
    "rhythm": ((-0.7, -1.75, 1.35), (-0.95, -0.52, 1.6), 50, 1.3),
}
cpos, ctgt, clens, cfocus = VIEWS[VIEW]
cd = bpy.data.cameras.new("cam"); cd.lens = clens; cd.dof.use_dof = True; cd.dof.aperture_fstop = 1.0 if VIEW == "sight" else 2.0
cam = bpy.data.objects.new("cam", cd); cam.location = cpos; sc.collection.objects.link(cam); sc.camera = cam
tgt = Vector(ctgt); cam.rotation_euler = (tgt - cam.location).to_track_quat("-Z", "Y").to_euler()
cd.dof.focus_distance = cfocus      # sight：ベッドの足元にピント。窓の外はやわらかくぼける（目覚めたばかりの視界）
sc.render.resolution_x, sc.render.resolution_y = int(os.environ.get("W", "1920")), int(os.environ.get("H", "1080"))
sc.cycles.samples = int(os.environ.get("SAMPLES", "128")); sc.cycles.use_denoising = True
sc.cycles.volume_step_rate = 4.0; sc.cycles.max_bounces = 6
try:
    sc.view_settings.view_transform = "AgX"; sc.view_settings.look = "AgX - Medium High Contrast"
except Exception: pass
sc.view_settings.exposure = 0.05
tmp = os.path.join(L.OUT_PREVIEW, "_pv.png"); sc.render.filepath = tmp
bpy.ops.render.render(write_still=True)
from PIL import Image, ImageFilter
im = Image.open(tmp).convert("RGB")
# 後処理：明るい所のにじみ（目覚めたばかりの、光のあふれる視界）、ほのかな暖色、周辺減光
a = np.asarray(im).astype(np.float32) / 255
hi = np.clip((a - 0.62) / 0.38, 0, 1)
glow = np.asarray(Image.fromarray((hi * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=a.shape[1] * 0.022))).astype(np.float32) / 255
a = 1 - (1 - a) * (1 - glow * np.array([0.55, 0.5, 0.42]))
a = a * np.array([1.03, 1.0, 0.95])
yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]; r = np.hypot((xx / a.shape[1] - 0.5) * 1.6, (yy / a.shape[0] - 0.5) * 1.6)
a *= (1 - 0.35 * np.clip(r - 0.35, 0, 1) ** 1.6)[..., None]
im = Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8))
out = os.environ.get("OUT", os.path.join(L.ROOT, "public", "static", "img", "patient_view.jpg" if VIEW == "sight" else f"patient_{VIEW}.jpg"))
im.save(out, quality=86); os.remove(tmp)
print("OK", out, round(time.time() - T0, 1), "s")
