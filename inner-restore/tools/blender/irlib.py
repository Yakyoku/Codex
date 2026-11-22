"""INNER RESTORE 共通の Blender(bpy) ヘルパー。画面なしで動かす。
   モデル作成スクリプトはすべてこのモジュールを使い、何度実行しても同じ結果になるようにする。"""
import bpy, bmesh, math, os, time
import numpy as np
from mathutils import Vector

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT_MODELS = os.path.join(ROOT, "assets", "models")
OUT_PREVIEW = os.path.join(ROOT, "assets", "preview")
OUT_TEX = os.path.join(ROOT, "assets", "textures")
for d in (OUT_MODELS, OUT_PREVIEW, OUT_TEX):
    os.makedirs(d, exist_ok=True)


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.use_denoising = False
    sc.render.threads_mode = "AUTO"
    return sc


def mesh_object(name, verts, faces, uvs=None, smooth=True, attrs=None):
    """verts:(N,3) faces:list of index tuples uvs:(N,2) 頂点ごと attrs:{name:(N,) float}"""
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(v) for v in verts], [], [tuple(f) for f in faces])
    me.validate()
    if uvs is not None:
        layer = me.uv_layers.new(name="UVMap")
        for loop in me.loops:
            layer.data[loop.index].uv = tuple(uvs[loop.vertex_index])
    if attrs:
        for k, arr in attrs.items():
            a = me.attributes.new(k, "FLOAT", "POINT")
            a.data.foreach_set("value", np.asarray(arr, dtype=np.float32))
    if smooth:
        me.polygons.foreach_set("use_smooth", [True] * len(me.polygons))
    me.update()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def select_only(ob):
    for o in bpy.context.scene.objects:
        o.select_set(False)
    ob.select_set(True)
    bpy.context.view_layer.objects.active = ob


def new_image(name, size, color=(0, 0, 0, 1), is_data=True):
    img = bpy.data.images.new(name, size, size, alpha=False, float_buffer=False)
    img.generated_color = color
    if is_data:
        img.colorspace_settings.name = "Non-Color"
    return img


def bake(ob, img, kind="AO", samples=32, attr=None, margin=8):
    """kind: 'AO' か 'ATTR'（頂点属性 attr を放射として焼く）。img に書き込む。所要秒を返す。"""
    sc = bpy.context.scene
    sc.cycles.samples = samples
    mat = bpy.data.materials.new("bake_" + kind)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    if kind == "ATTR":
        em = nt.nodes.new("ShaderNodeEmission")
        at = nt.nodes.new("ShaderNodeAttribute")
        at.attribute_name = attr
        nt.links.new(at.outputs["Fac"], em.inputs["Color"])
        nt.links.new(em.outputs[0], out.inputs["Surface"])
    else:
        bs = nt.nodes.new("ShaderNodeBsdfDiffuse")
        nt.links.new(bs.outputs[0], out.inputs["Surface"])
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = img
    nt.nodes.active = tex
    old = list(ob.data.materials)
    ob.data.materials.clear()
    ob.data.materials.append(mat)
    select_only(ob)
    t = time.time()
    bpy.ops.object.bake(type="EMIT" if kind == "ATTR" else "AO", margin=margin, use_clear=True)
    dt = time.time() - t
    ob.data.materials.clear()
    for m in old:
        ob.data.materials.append(m)
    bpy.data.materials.remove(mat)
    return dt


def image_to_np(img):
    w, h = img.size
    a = np.empty(w * h * 4, dtype=np.float32)
    img.pixels.foreach_get(a)
    return a.reshape(h, w, 4)[::-1]  # 上が先頭


def save_png(arr, path):
    from PIL import Image
    Image.fromarray((np.clip(arr, 0, 1) * 255 + 0.5).astype(np.uint8)).save(path)


def render_views(objs, name, radius, res=512, samples=24, world=(0.012, 0.01, 0.012), extra_setup=None):
    """4方向（斜め上・正面・真横・真上）から Cycles で描き、1枚に並べた確認用画像を作る。"""
    sc = bpy.context.scene
    sc.cycles.samples = samples
    sc.cycles.use_denoising = False
    sc.render.resolution_x = sc.render.resolution_y = res
    sc.render.film_transparent = False
    sc.view_settings.view_transform = "Filmic" if "Filmic" in [i.identifier for i in type(sc.view_settings).bl_rna.properties["view_transform"].enum_items] else sc.view_settings.view_transform
    w = bpy.data.worlds.new("w")
    w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    bg.inputs[0].default_value = (*world, 1)
    sc.world = w
    cam_d = bpy.data.cameras.new("cam")
    cam_d.lens = 85
    cam = bpy.data.objects.new("cam", cam_d)
    sc.collection.objects.link(cam)
    sc.camera = cam
    lights = []
    for (pos, energy, size, col) in [((1.2, -1.6, 1.8), 900, 2.0, (1, 0.96, 0.9)), ((-2.0, 1.5, 0.3), 500, 3.0, (0.8, 0.9, 1.0)), ((0.2, 2.0, -1.5), 700, 2.0, (1, 0.9, 0.85))]:
        ld = bpy.data.lights.new("L", "AREA")
        ld.energy = energy * radius * radius
        ld.size = size * radius
        ld.color = col
        lo = bpy.data.objects.new("L", ld)
        lo.location = Vector(pos) * radius * 2.2
        lo.rotation_euler = (Vector((0, 0, 0)) - lo.location).to_track_quat("-Z", "Y").to_euler()
        sc.collection.objects.link(lo)
        lights.append(lo)
    if extra_setup:
        extra_setup()
    dist = radius * 9.5
    views = {"persp": (0.9, -1.5, 0.9), "front": (0, -1, 0.0001), "side": (1, 0, 0.0001), "top": (0, -0.0001, 1)}
    paths = []
    for k, d in views.items():
        v = Vector(d).normalized() * dist
        cam.location = v
        cam.rotation_euler = (-v).to_track_quat("-Z", "Y").to_euler()
        p = os.path.join(OUT_PREVIEW, f"_{name}_{k}.png")
        sc.render.filepath = p
        bpy.ops.render.render(write_still=True)
        paths.append(p)
    from PIL import Image
    ims = [Image.open(p).convert("RGB") for p in paths]
    sheet = Image.new("RGB", (res * 2, res * 2))
    for i, im in enumerate(ims):
        sheet.paste(im, ((i % 2) * res, (i // 2) * res))
    outp = os.path.join(OUT_PREVIEW, f"{name}.jpg")
    sheet.save(outp, quality=88)
    for p in paths:
        os.remove(p)
    for o in lights + [cam]:
        bpy.data.objects.remove(o)
    return outp


def export_glb(objs, path, draco=False):
    for o in bpy.context.scene.objects:
        o.select_set(False)
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.export_scene.gltf(filepath=path, export_format="GLB", use_selection=True, export_apply=True,
                              export_yup=True, export_draco_mesh_compression_enable=draco,
                              export_attributes=True, export_animations=True)
    return os.path.getsize(path)
