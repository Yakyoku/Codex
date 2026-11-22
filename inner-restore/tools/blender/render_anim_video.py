"""アニメーションの確認用動画：立ち→歩き→走り→しゃがみ→片ひざ を、ななめ前から毎秒30コマで描く（足は前へ進めず、その場で動く）。
   出力: progress-src/diver-anim.mp4"""
import sys, os, subprocess
sys.path.insert(0, os.path.dirname(__file__))
import bpy
from mathutils import Vector
import irlib as L
from PIL import Image, ImageDraw
bpy.ops.wm.open_mainfile(filepath=os.path.join(L.OUT_MODELS, "diver_anim.blend"))
sc = bpy.context.scene; sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"; sc.cycles.samples = int(os.environ.get("SAMPLES", "10")); sc.cycles.use_denoising = True
sc.cycles.max_bounces = 3
w = bpy.data.worlds.new("w"); w.use_nodes = True; w.node_tree.nodes["Background"].inputs[0].default_value = (0.5, 0.45, 0.38, 1); w.node_tree.nodes["Background"].inputs[1].default_value = 0.5; sc.world = w
bpy.ops.mesh.primitive_plane_add(size=20); fl = bpy.context.object; fm = bpy.data.materials.new("f"); fm.use_nodes = True
fm.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.42, 0.37, 0.3, 1); fl.data.materials.append(fm)
for pos, e, col in [((2.0, -3.0, 3.2), 700, (1, 0.97, 0.92)), ((-3, -1.5, 2.0), 250, (0.9, 0.92, 1)), ((0.5, 3.0, 2.5), 400, (0.9, 0.85, 1))]:
    ld = bpy.data.lights.new("L", "AREA"); ld.energy = e; ld.size = 3; ld.color = col
    lo = bpy.data.objects.new("L", ld); lo.location = pos; lo.rotation_euler = (Vector((0, 0, 1)) - Vector(pos)).to_track_quat("-Z", "Y").to_euler(); sc.collection.objects.link(lo)
rig = bpy.data.objects["rig"]
cd = bpy.data.cameras.new("c"); cd.lens = 45; cam = bpy.data.objects.new("c", cd); sc.collection.objects.link(cam); sc.camera = cam
cam.location = (-3.4, -4.4, 1.25); cam.rotation_euler = (Vector((0, 0, 0.85)) - cam.location).to_track_quat("-Z", "Y").to_euler()
sc.render.resolution_x, sc.render.resolution_y = int(os.environ.get("W", "480")), int(os.environ.get("H", "540"))
out = os.path.join(L.ROOT, "progress-src", "diver-anim.mp4.frames"); os.makedirs(out, exist_ok=True)
plan = [("idle", "立ち", 60), ("walk", "歩き", 99), ("run", "走り", 105), ("squat", "しゃがみ", 30), ("crouch", "片ひざ（スキャン）", 30)]
n = 0
for act, label, frames in plan:
    a = bpy.data.actions[act]; rig.animation_data.action = a; f0, f1 = int(a.frame_range[0]), int(a.frame_range[1]); span = max(1, f1 - f0)
    for i in range(frames):
        sc.frame_set(f0 + (i % span))
        p = os.path.join(out, f"f{n:04d}.png"); sc.render.filepath = p; bpy.ops.render.render(write_still=True)
        im = Image.open(p).convert("RGB"); ImageDraw.Draw(im).text((14, 12), act.upper(), fill=(245, 240, 235)); im.save(p.replace(".png", ".jpg"), quality=88); os.remove(p); n += 1
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30", "-i", os.path.join(out, "f%04d.jpg"), "-vf", "format=yuv420p", "-c:v", "libx264", "-crf", "22", "-movflags", "+faststart",
                os.path.join(L.ROOT, "progress-src", "diver-anim.mp4")], check=True)
print("OK frames", n)
