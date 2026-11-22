"""主人公の確認用画像。参考画像（Docs/REFERENCE/hero/reference-v3.jpg）と同じ見せ方：暗い灰色の背景、やわらかな正面の光、紫の縁の光。
   姿勢をつけて、正面の立ち姿・後ろななめ・動きのある姿勢・上半身を描く。make_hero.py が保存した diver.blend を開く。
   出力: progress-src/diver-front.jpg, diver-back.jpg, diver-action.jpg, diver-bust.jpg, diver-lineup.jpg, assets/preview/diver.jpg"""
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
import bpy
from mathutils import Vector, Quaternion
import irlib as L
from PIL import Image
bpy.ops.wm.open_mainfile(filepath=os.path.join(L.OUT_MODELS, "diver.blend"))
sc = bpy.context.scene; sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"
sc.cycles.samples = int(os.environ.get("SAMPLES", "64")); sc.cycles.use_denoising = True
sc.view_settings.view_transform = "AgX" if "AgX" in [i.identifier for i in type(sc.view_settings).bl_rna.properties["view_transform"].enum_items] else sc.view_settings.view_transform
w = bpy.data.worlds.new("w"); w.use_nodes = True; w.node_tree.nodes["Background"].inputs[0].default_value = (0.016, 0.016, 0.02, 1); w.node_tree.nodes["Background"].inputs[1].default_value = 1.0; sc.world = w
# 床（影を受ける、暗い灰色）
bpy.ops.mesh.primitive_plane_add(size=12, location=(0, 0, 0)); fl = bpy.context.object
fm = bpy.data.materials.new("floor"); fm.use_nodes = True; fm.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.002, 0.002, 0.003, 1); fm.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.5; fl.data.materials.append(fm)
for pos, e, size, col in [((1.8, -3.4, 3.0), 420, 2.0, (1, 0.98, 0.98)), ((-3.2, -1.6, 1.6), 260, 3.5, (0.85, 0.88, 1.0)), ((0.6, 3.4, 2.6), 900, 2.5, (0.62, 0.38, 1.0)), ((-2.5, 2.6, 1.2), 300, 2.5, (0.55, 0.4, 1.0))]:
    ld = bpy.data.lights.new("L", "AREA"); ld.energy = e; ld.size = size; ld.color = col
    lo = bpy.data.objects.new("L", ld); lo.location = pos; lo.rotation_euler = (Vector((0, 0, 1)) - Vector(pos)).to_track_quat("-Z", "Y").to_euler(); sc.collection.objects.link(lo)
rig = bpy.data.objects["rig"]
def pose(p, drop=0.0):
    """体の向きを基準にした軸で回す（x=前後に曲げる, y=ねじる, z=横に開く。ゲームの中と同じ決まり）"""
    rig.location = (0, 0, -drop)
    for pb in rig.pose.bones: pb.rotation_mode = "QUATERNION"; pb.rotation_quaternion = (1, 0, 0, 0)
    for n, (x, y, z) in p.items():
        pb = rig.pose.bones[n]; inv = rig.data.bones[n].matrix_local.to_3x3().inverted()
        q = Quaternion(inv @ Vector((1, 0, 0)), x) @ Quaternion(inv @ Vector((0, 0, 1)), y) @ Quaternion(inv @ Vector((0, -1, 0)), z)
        pb.rotation_quaternion = q
    bpy.context.view_layer.update()
STAND = {"pelvis": (0, 0.08, 0.07), "chest": (-0.03, -0.06, -0.09), "head": (0.04, -0.1, 0.06),
         "thighL": (-0.1, 0.05, -0.06), "shinL": (0.2, 0, 0), "footL": (-0.1, 0, 0), "thighR": (0.02, 0, 0.0), "shinR": (0.02, 0, 0),
         "upperArmL": (0.06, 0, 0.1), "foreArmL": (-0.25, 0, 0), "handL": (-0.1, 0, 0), "upperArmR": (-0.05, 0, -0.12), "foreArmR": (-0.4, 0, 0), "handR": (-0.15, 0, 0)}
ACTION = {"pelvis": (0.08, 0.35, 0.0), "chest": (0.18, -0.3, 0.05), "head": (-0.12, -0.15, 0.0),
          "thighL": (-1.15, 0, -0.1), "shinL": (1.05, 0, 0), "footL": (0.12, 0, 0), "thighR": (0.6, 0, 0.12), "shinR": (0.7, 0, 0), "footR": (-0.45, 0, 0),
          "upperArmR": (-1.75, 0, -0.35), "foreArmR": (-0.35, 0, 0), "handR": (0.25, 0, 0), "upperArmL": (0.35, 0, 0.55), "foreArmL": (-0.7, 0, 0)}
cd = bpy.data.cameras.new("c"); cam = bpy.data.objects.new("c", cd); sc.collection.objects.link(cam); sc.camera = cam
def shot(p, look, lens, res):
    cd.lens = lens; cam.location = p; cam.rotation_euler = (Vector(look) - Vector(p)).to_track_quat("-Z", "Y").to_euler()
    sc.render.resolution_x, sc.render.resolution_y = res
    tmp = os.path.join(L.OUT_PREVIEW, "_d.png"); sc.render.filepath = tmp; bpy.ops.render.render(write_still=True)
    im = Image.open(tmp).convert("RGB"); os.remove(tmp); return im
out = os.path.join(L.ROOT, "progress-src"); only = os.environ.get("ONLY", "")
ims = {}
if not only or "front" in only: pose(STAND); ims["front"] = shot((1.5, -5.2, 1.25), (0, 0, 1.0), 62, (720, 1080))
if not only or "back" in only: pose(STAND); ims["back"] = shot((-2.4, 4.8, 1.4), (0, 0, 1.0), 62, (720, 1080))
if not only or "action" in only: pose(ACTION, 0.2); ims["action"] = shot((3.4, -4.3, 1.1), (0, 0, 0.85), 58, (720, 1080))
if not only or "bust" in only: pose(STAND); ims["bust"] = shot((0.9, -2.3, 1.62), (0, 0, 1.52), 80, (960, 960))
for k, im in ims.items(): im.save(os.path.join(out, f"diver-{k}.jpg"), quality=90)
if all(k in ims for k in ("front", "back", "action")):
    sheet = Image.new("RGB", (2160, 1080)); [sheet.paste(ims[k], (i * 720, 0)) for i, k in enumerate(("action", "front", "back"))]
    sheet.save(os.path.join(out, "diver-lineup.jpg"), quality=88)
if not only:
    pose({})
    vs = [shot(p, (0, 0, 1.0), 85, (512, 512)) for p in ((0, -7.5, 1.0), (7.5, 0, 1.0), (0, 7.5, 1.0), (0, -0.01, 8.5))]
    s4 = Image.new("RGB", (1024, 1024)); [s4.paste(im, ((i % 2) * 512, (i // 2) * 512)) for i, im in enumerate(vs)]; s4.save(os.path.join(L.OUT_PREVIEW, "diver.jpg"), quality=88)
print("OK")
