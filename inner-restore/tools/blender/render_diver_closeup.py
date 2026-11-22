"""主人公の寄りの確認用画像（前ななめ・後ろななめ）。出力: progress-src/diver-front.jpg, diver-back.jpg"""
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
import bpy
from mathutils import Vector
import irlib as L
sc = L.reset()
bpy.ops.import_scene.gltf(filepath=os.path.join(L.OUT_MODELS, "diver.raw.glb"))
w = bpy.data.worlds.new("w"); w.use_nodes = True; w.node_tree.nodes["Background"].inputs[0].default_value = (0.02, 0.016, 0.018, 1); sc.world = w
for pos, e, size, col in [((2.2, -3, 3.2), 420, 3, (1, 0.96, 0.9)), ((-3.5, 1.5, 1.5), 260, 4, (0.75, 0.88, 1)), ((0.5, 3.5, 2.2), 380, 3, (1, 0.85, 0.75))]:
    ld = bpy.data.lights.new("L", "AREA"); ld.energy = e; ld.size = size; ld.color = col
    lo = bpy.data.objects.new("L", ld); lo.location = pos; lo.rotation_euler = (Vector((0, 0, 1)) - Vector(pos)).to_track_quat("-Z", "Y").to_euler(); sc.collection.objects.link(lo)
cd = bpy.data.cameras.new("c"); cd.lens = 70; cam = bpy.data.objects.new("c", cd); sc.collection.objects.link(cam); sc.camera = cam
sc.render.resolution_x, sc.render.resolution_y = 720, 1080; sc.cycles.samples = 64
try: sc.cycles.use_denoising = True
except Exception: pass
from PIL import Image
for name, p in (("front", (2.6, -5.2, 1.7)), ("back", (-2.8, 5.0, 1.9))):
    cam.location = p; cam.rotation_euler = (Vector((0, 0, 1.0)) - Vector(p)).to_track_quat("-Z", "Y").to_euler()
    tmp = os.path.join(L.OUT_PREVIEW, "_d.png"); sc.render.filepath = tmp; bpy.ops.render.render(write_still=True)
    Image.open(tmp).convert("RGB").save(os.path.join(L.ROOT, "progress-src", f"diver-{name}.jpg"), quality=90); os.remove(tmp)
print("OK")
