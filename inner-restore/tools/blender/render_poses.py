"""アニメーションの要所の姿勢を、持ち主の参考画像（Docs/REFERENCE/hero/poses-v1.jpg）と同じ並びで描く：走る・立つ・しゃがむ・片ひざ。
   出力: progress-src/diver-poses.jpg"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import bpy
from mathutils import Vector
import irlib as L
from PIL import Image, ImageDraw, ImageFont
bpy.ops.wm.open_mainfile(filepath=os.path.join(L.OUT_MODELS, "diver_anim.blend"))
sc = bpy.context.scene; sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"; sc.cycles.samples = int(os.environ.get("SAMPLES", "32")); sc.cycles.use_denoising = True
w = bpy.data.worlds.new("w"); w.use_nodes = True; w.node_tree.nodes["Background"].inputs[0].default_value = (0.5, 0.45, 0.38, 1); w.node_tree.nodes["Background"].inputs[1].default_value = 0.5; sc.world = w
bpy.ops.mesh.primitive_plane_add(size=20); fl = bpy.context.object; fm = bpy.data.materials.new("f"); fm.use_nodes = True
fm.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.42, 0.37, 0.3, 1); fl.data.materials.append(fm)
for pos, e, col in [((2.0, -3.0, 3.2), 700, (1, 0.97, 0.92)), ((-3, -1.5, 2.0), 250, (0.9, 0.92, 1)), ((0.5, 3.0, 2.5), 400, (0.9, 0.85, 1))]:
    ld = bpy.data.lights.new("L", "AREA"); ld.energy = e; ld.size = 3; ld.color = col
    lo = bpy.data.objects.new("L", ld); lo.location = pos; lo.rotation_euler = (Vector((0, 0, 1)) - Vector(pos)).to_track_quat("-Z", "Y").to_euler(); sc.collection.objects.link(lo)
rig = bpy.data.objects["rig"]
cd = bpy.data.cameras.new("c"); cd.lens = 55; cam = bpy.data.objects.new("c", cd); sc.collection.objects.link(cam); sc.camera = cam
sc.render.resolution_x, sc.render.resolution_y = 520, 640
def shot(action, frame, campos, look):
    rig.animation_data.action = bpy.data.actions[action]; sc.frame_set(frame)
    cam.location = campos; cam.rotation_euler = (Vector(look) - Vector(campos)).to_track_quat("-Z", "Y").to_euler()
    tmp = os.path.join(L.OUT_PREVIEW, "_p.png"); sc.render.filepath = tmp; bpy.ops.render.render(write_still=True)
    im = Image.open(tmp).convert("RGB"); os.remove(tmp); return im
panels = [("RUN", shot("run", 1 + round(21 * 3 / 8), (-3.6, -3.2, 1.1), (0, 0, 0.9))),
          ("STAND", shot("idle", 1, (1.6, -4.4, 1.1), (0, 0, 0.95))),
          ("SQUAT", shot("squat", 1, (1.8, -3.9, 0.9), (0, -0.05, 0.62))),
          ("CROUCH", shot("crouch", 1, (-2.6, -3.4, 0.8), (0, -0.15, 0.5)))]
sheet = Image.new("RGB", (1040, 1340), (110, 98, 84)); d = ImageDraw.Draw(sheet)
for i, (lab, im) in enumerate(panels):
    x, y = (i % 2) * 520, (i // 2) * 670; sheet.paste(im, (x, y)); d.text((x + 240, y + 645), lab, fill=(240, 236, 230))
sheet.save(os.path.join(L.ROOT, "progress-src", "diver-poses.jpg"), quality=88); print("OK")
