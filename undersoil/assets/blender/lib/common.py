"""UNDERSOIL: bpy で素材を作るための共通関数（画面なし・CPU）。"""
import bpy, bmesh, math, os, time
from mathutils import Vector, noise

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
OUT = os.path.join(ROOT, 'assets', 'out')
PREVIEW = os.path.join(ROOT, 'assets', 'preview')

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.use_denoising = False
    sc.render.threads_mode = 'AUTO'
    return sc

def displace_noise(obj, layers, seed=0.0):
    """layers: [(周波数, 振幅, 種類)] を重ねて、法線方向に頂点を動かす。"""
    me = obj.data
    off = Vector((seed * 13.1, seed * 7.7, seed * 3.3))
    for v in me.vertices:
        p = v.co.copy(); n = p.normalized(); d = 0.0
        for f, a, kind in layers:
            if kind == 'ridge':
                d += a * (1.0 - abs(noise.noise(p * f + off))) 
            elif kind == 'cell':
                d += a * noise.cell(p * f + off)
            else:
                d += a * noise.noise(p * f + off)
        v.co = p + n * d
    me.update()

def smart_uv(obj, margin=0.02):
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=margin)
    bpy.ops.object.mode_set(mode='OBJECT')

def bake(obj, kind, size, samples=16, name=None, margin=8, highpoly=None, cage=0.05):
    """kind: 'AO' | 'NORMAL' | 'DIFFUSE' | 'EMIT'。obj のアクティブなマテリアルに画像ノードを足して焼く。"""
    sc = bpy.context.scene
    sc.cycles.samples = samples
    img = bpy.data.images.new(name or f'{obj.name}_{kind}', size, size, alpha=False)
    if kind == 'NORMAL': img.colorspace_settings.name = 'Non-Color'
    for mat in obj.data.materials:
        nt = mat.node_tree
        node = nt.nodes.new('ShaderNodeTexImage'); node.image = img; node.name = 'BAKE_TARGET'
        nt.nodes.active = node
    bpy.ops.object.select_all(action='DESELECT')
    if highpoly is not None:
        highpoly.select_set(True)
    obj.select_set(True); bpy.context.view_layer.objects.active = obj
    t = time.time()
    kw = dict(type=kind, margin=margin)
    if kind == 'DIFFUSE': kw['pass_filter'] = {'COLOR'}
    if highpoly is not None: kw.update(use_selected_to_active=True, cage_extrusion=cage)
    bpy.ops.object.bake(**kw)
    for mat in obj.data.materials:
        n = mat.node_tree.nodes.get('BAKE_TARGET')
        if n: mat.node_tree.nodes.remove(n)
    print(f'[bake] {obj.name} {kind} {size}px {samples}spp {time.time()-t:.1f}s')
    return img

def save_image(img, path):
    img.filepath_raw = path; img.file_format = 'PNG'; img.save()

def export_glb(path, objs, draco=True, anim=False, tangents=False):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True,
        export_draco_mesh_compression_enable=draco, export_apply=not anim,
        export_animations=anim, export_yup=True, export_tangents=tangents, export_image_format='AUTO')
    print(f'[glb] {path} {os.path.getsize(path)/1024:.1f}KB')

def render_views(objs, path_prefix, size=512, samples=24, dist=None, world=0.05):
    """4方向（前・右・後ろ・斜め上）から確認用の画像を描く。"""
    sc = bpy.context.scene
    sc.render.resolution_x = sc.render.resolution_y = size
    sc.cycles.samples = samples; sc.cycles.use_denoising = True
    try: sc.view_settings.view_transform = 'Filmic'
    except Exception: pass
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
    w.node_tree.nodes['Background'].inputs[0].default_value = (world, world, world * 1.1, 1)
    mn = Vector((1e9,) * 3); mx = Vector((-1e9,) * 3)
    for o in objs:
        for c in o.bound_box:
            p = o.matrix_world @ Vector(c)
            mn = Vector(map(min, mn, p)); mx = Vector(map(max, mx, p))
    ctr = (mn + mx) / 2; r = (mx - mn).length / 2
    d = dist or r * 3.2
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam)
    cam.data.lens = 60; cam.data.clip_start = d / 100; cam.data.clip_end = d * 10; sc.camera = cam
    key = bpy.data.objects.new('key', bpy.data.lights.new('key', 'AREA')); sc.collection.objects.link(key)
    key.data.energy = 60 * r * r * 2.5; key.data.size = r * 3
    rim = bpy.data.objects.new('rim', bpy.data.lights.new('rim', 'AREA')); sc.collection.objects.link(rim)
    rim.data.energy = 30 * r * r * 2.5; rim.data.size = r * 2; rim.data.color = (0.7, 0.85, 1)
    outs = []
    for name, az, el in (('front', -90, 10), ('right', 0, 10), ('back', 90, 10), ('top', -50, 55)):
        a, e = math.radians(az), math.radians(el)
        dirv = Vector((math.cos(a) * math.cos(e), math.sin(a) * math.cos(e), math.sin(e)))
        cam.location = ctr + dirv * d
        cam.rotation_euler = (ctr - cam.location).to_track_quat('-Z', 'Y').to_euler()
        for L, off in ((key, Vector((0.6, -0.3, 0.9))), (rim, Vector((-0.8, 0.5, 0.3)))):
            side = dirv.cross(Vector((0, 0, 1))).normalized()
            L.location = ctr + (dirv * off.y * -1 + side * off.x + Vector((0, 0, off.z))) .normalized() * d
            L.rotation_euler = (ctr - L.location).to_track_quat('-Z', 'Y').to_euler()
        sc.render.filepath = f'{path_prefix}_{name}.png'
        bpy.ops.render.render(write_still=True); outs.append(sc.render.filepath)
    for o in (cam, key, rim): bpy.data.objects.remove(o)
    return outs

def cube_uv(obj, margin=0.03):
    """塊状の形のための UV 展開：重心から見た向きで6面に分け、面ごとに中心投影して 3×2 に並べる。
    smart_project は、でこぼこの塊を数千の小さな島に割ってしまい、法線の焼き込みが壊れるので使わない。"""
    me = obj.data
    bm = bmesh.new(); bm.from_mesh(me)
    uvl = bm.loops.layers.uv.verify()
    c = Vector((0, 0, 0))
    for v in bm.verts: c += v.co
    c /= max(1, len(bm.verts))
    for f in bm.faces:
        d = f.calc_center_median() - c
        ax = max(range(3), key=lambda i: abs(d[i])); sg = 1 if d[ax] >= 0 else -1
        k = ax * 2 + (0 if sg > 0 else 1); col, row = k % 3, k // 3
        ua, va = [i for i in range(3) if i != ax]
        for l in f.loops:
            p = l.vert.co - c; m = max(abs(p[ax]), 1e-4)
            # 面の外へ少しはみ出す頂点があるので、1.35 で割って枠に収める
            u = max(-1, min(1, p[ua] / m / 1.35)); v = max(-1, min(1, p[va] / m / 1.35))
            l[uvl].uv = ((col + margin + (u * 0.5 + 0.5) * (1 - 2 * margin)) / 3, (row + margin + (v * 0.5 + 0.5) * (1 - 2 * margin)) / 2)
    bm.to_mesh(me); bm.free(); me.update()
