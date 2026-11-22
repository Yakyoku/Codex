"""主人公の確認用画像（前ななめ・後ろななめ・上半身の寄り・4方向）。make_diver.py が保存した diver.blend を開いて描く。
   出力: progress-src/diver-front.jpg, diver-back.jpg, diver-bust.jpg, assets/preview/diver.jpg"""
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
import bpy
from mathutils import Vector
import irlib as L
from PIL import Image
bpy.ops.wm.open_mainfile(filepath=os.path.join(L.OUT_MODELS, "diver.blend"))
sc = bpy.context.scene; sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"
w = bpy.data.worlds.new("w"); w.use_nodes = True; w.node_tree.nodes["Background"].inputs[0].default_value = (0.03, 0.02, 0.02, 1); sc.world = w
# 体内を思わせる光：上からの白い主光、下と後ろからの赤みのある回り込み
for pos, e, size, col in [((2.0, -3.2, 3.6), 520, 3, (1, 0.96, 0.9)), ((-3.6, -0.5, 1.2), 180, 4, (0.7, 0.86, 1)), ((0.8, 3.6, 2.4), 520, 3, (1, 0.62, 0.48)), ((0, -1, -2.5), 160, 5, (1, 0.45, 0.3))]:
    ld = bpy.data.lights.new("L", "AREA"); ld.energy = e; ld.size = size; ld.color = col
    lo = bpy.data.objects.new("L", ld); lo.location = pos; lo.rotation_euler = (Vector((0, 0, 1)) - Vector(pos)).to_track_quat("-Z", "Y").to_euler(); sc.collection.objects.link(lo)
cd = bpy.data.cameras.new("c"); cam = bpy.data.objects.new("c", cd); sc.collection.objects.link(cam); sc.camera = cam
sc.cycles.samples = int(os.environ.get("SAMPLES", "72")); sc.cycles.use_denoising = True
def shot(name, p, look, lens, res):
    cd.lens = lens; cam.location = p; cam.rotation_euler = (Vector(look) - Vector(p)).to_track_quat("-Z", "Y").to_euler()
    sc.render.resolution_x, sc.render.resolution_y = res
    tmp = os.path.join(L.OUT_PREVIEW, "_d.png"); sc.render.filepath = tmp; bpy.ops.render.render(write_still=True)
    im = Image.open(tmp).convert("RGB"); os.remove(tmp); return im
out = os.path.join(L.ROOT, "progress-src")
only = os.environ.get("ONLY", "")
views = {"front": ((2.4, -4.9, 1.6), (0, 0, 1.0), 70, (720, 1080)), "back": ((-2.6, 4.7, 1.8), (0, 0, 1.0), 70, (720, 1080)), "bust": ((0.9, -2.2, 1.75), (0, 0, 1.6), 80, (960, 960))}
for k, v in views.items():
    if only and k not in only: continue
    shot(k, *v).save(os.path.join(out, f"diver-{k}.jpg"), quality=90)
if not only:
    ims = [shot(k, p, (0, 0, 1.0), 85, (512, 512)) for k, p in (("f", (0, -7.5, 1.0)), ("s", (7.5, 0, 1.0)), ("b", (0, 7.5, 1.0)), ("t", (0, -0.01, 8.5)))]
    sheet = Image.new("RGB", (1024, 1024))
    for i, im in enumerate(ims): sheet.paste(im, ((i % 2) * 512, (i // 2) * 512))
    sheet.save(os.path.join(L.OUT_PREVIEW, "diver.jpg"), quality=88)
print("OK")
