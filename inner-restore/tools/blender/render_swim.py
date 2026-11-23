"""泳ぎの要所の姿勢の確認用の絵（横から）。swim は体を水平に倒して描く。出力: progress-src/diver-swim.jpg"""
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
import bpy
from mathutils import Vector
import irlib as L
from PIL import Image, ImageDraw, ImageFont
bpy.ops.wm.open_mainfile(filepath=os.path.join(L.OUT_MODELS, "diver_anim.blend"))
sc = bpy.context.scene; sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"; sc.cycles.samples = int(os.environ.get("SAMPLES", "24")); sc.cycles.use_denoising = True
w = bpy.data.worlds.new("w"); w.use_nodes = True; w.node_tree.nodes["Background"].inputs[0].default_value = (0.55, 0.42, 0.36, 1); w.node_tree.nodes["Background"].inputs[1].default_value = 0.8; sc.world = w
for pos, e in [((2.0, -3.0, 3.2), 700), ((-3, -1.5, 2.0), 300)]:
    ld = bpy.data.lights.new("L", "AREA"); ld.energy = e; ld.size = 3
    lo = bpy.data.objects.new("L", ld); lo.location = pos; lo.rotation_euler = (Vector((0, 0, 1)) - Vector(pos)).to_track_quat("-Z", "Y").to_euler(); sc.collection.objects.link(lo)
rig = bpy.data.objects["rig"]
cd = bpy.data.cameras.new("c"); cd.lens = 40; cam = bpy.data.objects.new("c", cd); sc.collection.objects.link(cam); sc.camera = cam
sc.render.resolution_x, sc.render.resolution_y = 560, 420
def shot(action, frame, pitch):
    rig.animation_data.action = bpy.data.actions[action]; sc.frame_set(frame)
    rig.rotation_euler = (pitch, 0, 0); rig.location = (0, 0, 0.95 * math.sin(pitch) * 0 + 0.0)
    campos, look = ((5.2, -0.9, 0.9) if pitch > 0.5 else (4.2, 0.0, 1.0)), ((0, -0.9, 0.35) if pitch > 0.5 else (0, 0, 0.95))
    cam.location = campos; cam.rotation_euler = (Vector(look) - Vector(campos)).to_track_quat("-Z", "Y").to_euler()
    tmp = os.path.join(L.OUT_PREVIEW, "_s.png"); sc.render.filepath = tmp; bpy.ops.render.render(write_still=True)
    im = Image.open(tmp).convert("RGB"); os.remove(tmp); return im
P = 1.3
panels = [("SWIM 伸び", shot("swim", 1, P)), ("SWIM かき", shot("swim", 17, P)), ("SWIM 引きつけ", shot("swim", 25, P)), ("SWIM けり", shot("swim", 33, P)),
          ("FLOAT", shot("float", 1, 0.1)), ("FLOAT", shot("float", 46, 0.1))]
sheet = Image.new("RGB", (1120, 1260), (90, 70, 62)); d = ImageDraw.Draw(sheet)
f = ImageFont.truetype("/usr/share/fonts/opentype/ipafont-gothic/ipag.ttf", 26)
for i, (lab, im) in enumerate(panels):
    x, y = (i % 2) * 560, (i // 2) * 420; sheet.paste(im, (x, y)); d.text((x + 14, y + 10), lab, font=f, fill=(255, 255, 255))
sheet.save(os.path.join(os.path.dirname(__file__), "..", "..", "progress-src", "diver-swim.jpg"), quality=85); print("OK")
