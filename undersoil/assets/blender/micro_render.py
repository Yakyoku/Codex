"""UNDERSOIL: 拡大像（光学顕微鏡で見た姿）を、Blender の Cycles で「本物の顕微鏡と同じ仕組み」で描く。
生き物は水の中にいるので、屈折の強さは「水との差」で決まる（体 1.36 / 水 1.33 ≒ 1.03）。この相対値を使う。
明視野顕微鏡のしくみ：生き物の後ろから白い光を当て、手前のレンズで見る。体は透明に近く、
  ・光が体の中を通るときに、色素や中身が光を少し吸う（→ 黄褐色、中の粒が暗く見える）
  ・体の縁では光が屈折して、レンズに届かなくなる（→ 細く暗い輪郭線）
  ・ピントの合う厚みはごく薄い（→ 前後はぼける）
これを、後ろの光る板・屈折する体（ガラスに近い材質）・体の中の吸収（ボリューム）・浅い被写界深度で再現する。
実行: python3 assets/blender/micro_render.py <tardigrade|colpoda|bacillus|pseudomonas> [--test] [--frames N] [--size WxH] [--samples S]
出力: assets/out/micro/<種>/f0000.png … → scripts/micro-encode.sh で動画（public/micro/<種>.webm/.mp4 と最初のコマの .webp）
"""
import bpy, sys, os, math, random, time
import numpy as np
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lib'))
import common as C

args = sys.argv[1:]
KIND = args[0] if args else 'tardigrade'
TEST = '--test' in args
def opt(name, default):
    return args[args.index(name) + 1] if name in args else default
FRAMES = int(opt('--frames', '1' if TEST else '48'))
W, H = map(int, opt('--size', '640x480').split('x'))
SAMPLES = int(opt('--samples', '48'))
OUT = os.path.join(C.OUT, 'micro', KIND); os.makedirs(OUT, exist_ok=True)
rng = random.Random(7)

# ---------------------------------------------------------------- 場面の基本
def reset():
    sc = C.reset()
    sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = True
    try: sc.cycles.denoiser = 'OPENIMAGEDENOISE'
    except Exception: pass
    sc.cycles.max_bounces = 24; sc.cycles.transmission_bounces = 24; sc.cycles.transparent_max_bounces = 24
    sc.cycles.volume_bounces = 2; sc.cycles.glossy_bounces = 4; sc.cycles.diffuse_bounces = 1
    sc.cycles.caustics_refractive = True; sc.cycles.caustics_reflective = False
    sc.cycles.blur_glossy = 0.5
    sc.render.resolution_x, sc.render.resolution_y = W, H; sc.render.resolution_percentage = 100
    sc.render.image_settings.file_format = 'PNG'
    sc.view_settings.view_transform = 'Standard'; sc.view_settings.look = 'None'
    sc.view_settings.exposure = 0.0; sc.view_settings.gamma = 1.0
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
    bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (0.02, 0.02, 0.02, 1); bg.inputs[1].default_value = 1.0
    return sc

def mat(name, build):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    for n in list(nt.nodes): nt.nodes.remove(n)
    out = nt.nodes.new('ShaderNodeOutputMaterial'); build(nt, out); return m

def backlight(z_or_axis, size, tint=(1.0, 0.985, 0.95), strength=1.0):
    """後ろの光る板（顕微鏡の光源とコンデンサの代わり）。色は写真の背景（わずかに暖かい白）に合わせる"""
    bpy.ops.mesh.primitive_plane_add(size=size)
    p = bpy.context.active_object; p.name = 'backlight'
    def b(nt, out):
        e = nt.nodes.new('ShaderNodeEmission'); e.inputs[0].default_value = (*tint, 1); e.inputs[1].default_value = strength
        nt.links.new(e.outputs[0], out.inputs['Surface'])
    p.data.materials.append(mat('backlight', b))
    return p

def na_normal(nt, path, strength=1.0):
    """焼き込んだ法線（RG＝法線の x,y、B＝AO）から、法線マップの入力を作る"""
    img = bpy.data.images.load(path); img.colorspace_settings.name = 'Non-Color'
    tex = nt.nodes.new('ShaderNodeTexImage'); tex.image = img
    sep = nt.nodes.new('ShaderNodeSeparateColor'); nt.links.new(tex.outputs[0], sep.inputs[0])
    # z = sqrt(1 - x^2 - y^2)、x,y = 2c-1 → 0..1 に戻して並べる
    def m(op, a, b=None, v=None):
        n = nt.nodes.new('ShaderNodeMath'); n.operation = op
        if hasattr(a, 'bl_idname'): nt.links.new(a, n.inputs[0])
        else: n.inputs[0].default_value = a
        if b is not None:
            if hasattr(b, 'bl_idname'): nt.links.new(b, n.inputs[1])
            else: n.inputs[1].default_value = b
        return n.outputs[0]
    x = m('SUBTRACT', m('MULTIPLY', sep.outputs[0], 2.0), 1.0); y = m('SUBTRACT', m('MULTIPLY', sep.outputs[1], 2.0), 1.0)
    z = m('SQRT', m('MAXIMUM', m('SUBTRACT', m('SUBTRACT', 1.0, m('MULTIPLY', x, x)), m('MULTIPLY', y, y)), 0.0))
    cc = nt.nodes.new('ShaderNodeCombineColor'); nt.links.new(sep.outputs[0], cc.inputs[0]); nt.links.new(sep.outputs[1], cc.inputs[1]); nt.links.new(m('ADD', m('MULTIPLY', z, 0.5), 0.5), cc.inputs[2])
    nm = nt.nodes.new('ShaderNodeNormalMap'); nm.inputs['Strength'].default_value = strength; nt.links.new(cc.outputs[0], nm.inputs['Color'])
    return nm.outputs[0]

def specimen(name, color, ior, density, rough=0.08, absorb_col=None, normal=None):
    """半透明の体：表面は屈折（縁が暗い線になる）、中は色を吸うボリューム"""
    def b(nt, out):
        g = nt.nodes.new('ShaderNodeBsdfGlass'); g.inputs['Color'].default_value = (*color, 1); g.inputs['IOR'].default_value = ior; g.inputs['Roughness'].default_value = rough
        if normal: nt.links.new(na_normal(nt, *normal), g.inputs['Normal'])
        nt.links.new(g.outputs[0], out.inputs['Surface'])
        if density > 0:
            v = nt.nodes.new('ShaderNodeVolumeAbsorption'); v.inputs['Color'].default_value = (*(absorb_col or color), 1); v.inputs['Density'].default_value = density
            nt.links.new(v.outputs[0], out.inputs['Volume'])
    return mat(name, b)

def grains_material(name, color, ior, density):
    """体の中の粒（貯蔵細胞・食胞・顆粒）：まわりより少し屈折率が高く、色を強く吸う"""
    return specimen(name, color, ior, density, rough=0.15)

def scatter_inside(obj, n, rmin, rmax, m, margin=0.6, bias=None, seed=1, squash=1.0):
    """メッシュの中に、重ならないように小さな球を散らす（点が中にあるかは、上向きの光線が面を奇数回通るかで判定）"""
    dg = bpy.context.evaluated_depsgraph_get(); ev = obj.evaluated_get(dg)
    me = ev.to_mesh(); mw = obj.matrix_world
    verts = [mw @ v.co for v in me.vertices]; polys = [tuple(p.vertices) for p in me.polygons]
    bvh = BVHTree.FromPolygons(verts, polys); ev.to_mesh_clear()
    lo = Vector((min(v.x for v in verts), min(v.y for v in verts), min(v.z for v in verts))); hi = Vector((max(v.x for v in verts), max(v.y for v in verts), max(v.z for v in verts)))
    r = random.Random(seed); placed = []
    def inside(p):
        cnt = 0; o = p.copy(); d = Vector((0.0, 0.0, 1.0))
        for _ in range(40):
            hit = bvh.ray_cast(o, d)
            if hit[0] is None: break
            cnt += 1; o = hit[0] + d * 1e-4
        return cnt % 2 == 1
    tries = 0
    while len(placed) < n and tries < n * 60:
        tries += 1
        p = Vector((r.uniform(lo.x, hi.x), r.uniform(lo.y, hi.y), r.uniform(lo.z, hi.z)))
        if bias and r.random() > bias(p): continue
        rad = rmin + (rmax - rmin) * r.random() ** 1.8
        if not inside(p): continue
        near = bvh.find_nearest(p)
        if near[0] is None or near[3] < rad + margin: continue
        if any((p - q).length < rad + qr + 0.05 for q, qr in placed[-400:]): continue
        placed.append((p, rad))
    # 1 つのメッシュにまとめる（物体の数を減らし、描画を速くする）
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1.0); src = bpy.context.active_object
    import bmesh
    bm = bmesh.new(); base = bmesh.new(); base.from_mesh(src.data)
    for p, rad in placed:
        sx = rad * r.uniform(0.85, 1.15); sy = rad * r.uniform(0.85, 1.15); sz = rad * r.uniform(0.85, 1.15) * squash
        M = Matrix.Translation(p) @ Matrix.Rotation(r.uniform(0, 6.28), 4, 'Z') @ Matrix.Diagonal((sx, sy, sz, 1.0))
        tmp = base.copy(); bmesh.ops.transform(tmp, matrix=M, verts=tmp.verts)
        tm = bpy.data.meshes.new('tmp'); tmp.to_mesh(tm); bm.from_mesh(tm); bpy.data.meshes.remove(tm); tmp.free()
    me2 = bpy.data.meshes.new(obj.name + '_grains'); bm.to_mesh(me2); bm.free(); base.free()
    bpy.data.objects.remove(src)
    g = bpy.data.objects.new(obj.name + '_grains', me2); bpy.context.collection.objects.link(g)
    for pl in me2.polygons: pl.use_smooth = True
    g.data.materials.append(m)
    print(f'  grains {len(placed)} in {obj.name}')
    return g

def camera(loc, look, lens, focus, fstop, ortho=None):
    cam = bpy.data.cameras.new('cam'); co = bpy.data.objects.new('cam', cam); bpy.context.collection.objects.link(co)
    co.location = loc; d = (Vector(look) - Vector(loc)); co.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    if ortho: cam.type = 'ORTHO'; cam.ortho_scale = ortho
    else: cam.lens = lens
    cam.clip_start = 0.1; cam.clip_end = 2000
    cam.dof.use_dof = True; cam.dof.focus_distance = focus; cam.dof.aperture_fstop = fstop
    bpy.context.scene.camera = co; return co

def debris(n, area, z, seed=3, scale=1.0):
    """スライドの上の小さなごみ（実際の写真にはいつも写っている）：暗い小片と、透明な粒"""
    r = random.Random(seed)
    dark = specimen('debris_dark', (0.6, 0.5, 0.4), 1.12, 0.9)
    clear = specimen('debris_clear', (0.97, 0.97, 0.95), 1.1, 0.02)
    for i in range(n):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1.0)
        o = bpy.context.active_object
        for v in o.data.vertices: v.co *= 1 + 0.35 * (r.random() - 0.5)
        for pl in o.data.polygons: pl.use_smooth = True
        s = (r.uniform(0.15, 0.9) if r.random() < 0.8 else r.uniform(1.0, 2.2)) * scale
        o.scale = (s * r.uniform(0.6, 1.4), s * r.uniform(0.6, 1.4), s * r.uniform(0.3, 0.7))
        o.rotation_euler = (r.uniform(0, 6), r.uniform(0, 6), r.uniform(0, 6))
        o.location = (r.uniform(-area[0], area[0]), r.uniform(-area[1], area[1]), z + r.uniform(-2, 2) * scale)
        o.data.materials.append(dark if r.random() < 0.55 else clear)

# ---------------------------------------------------------------- クマムシ
def tardigrade():
    sc = reset()
    path = os.path.join(C.OUT, 'creatures', 'tardigrade.glb')
    bpy.ops.import_scene.gltf(filepath=path)
    body = bpy.data.objects['tardigrade_body_LOD0']; inner = bpy.data.objects['tardigrade_inner_LOD0']
    for o in list(bpy.data.objects):
        if o.type == 'MESH' and o not in (body, inner): bpy.data.objects.remove(o)
    for o in (body, inner): o.parent = None
    # 体：ほぼ透明。表皮は屈折率 1.38 前後（キチン質・水を含む）、中の体液と貯蔵細胞が黄褐色に色を吸う（写真 #A5926C 前後）
    na = os.path.join(C.OUT, 'creatures', 'tardigrade_na.png')
    body.data.materials.clear(); body.data.materials.append(specimen('tg_body', (0.99, 0.98, 0.95), 1.05, 0.07, rough=0.02, absorb_col=(0.55, 0.42, 0.18), normal=(na, 1.6)))
    # 鉤爪：硬いクチクラで、光をよく曲げ、灰褐色に色を吸う → 写真では暗く細い、曲がった爪に見える（頂点色 G=1 の面）
    body.data.materials.append(specimen('tg_claw', (0.85, 0.82, 0.75), 1.22, 1.6, rough=0.05, absorb_col=(0.45, 0.4, 0.32)))
    col = body.data.color_attributes[0] if body.data.color_attributes else None
    for p in body.data.polygons:
        p.use_smooth = True
        if col is not None:
            g = sum(col.data[li].color[1] for li in p.loop_indices) / len(p.loop_indices) if col.domain == 'CORNER' else sum(col.data[v].color[1] for v in p.vertices) / len(p.vertices)
            if g > 0.5: p.material_index = 1
    # 中身：咽頭・口の管・腸。腸は食べたもので緑褐色〜暗い褐色
    inner.data.materials.clear(); inner.data.materials.append(specimen('tg_gut', (0.97, 0.95, 0.9), 1.04, 0.18, rough=0.1, absorb_col=(0.35, 0.33, 0.12)))
    for p in inner.data.polygons: p.use_smooth = True
    # 貯蔵細胞：体腔に浮かぶ、たくさんの丸い細胞（直径 10〜20µm）。写真の「粒々のかたまり」
    keys = body.data.shape_keys.key_blocks
    for k in keys: k.value = 0.0
    cells = scatter_inside(body, 520, 0.45, 1.15, grains_material('tg_cells', (0.97, 0.94, 0.86), 1.06, 0.35), margin=0.7, seed=11,
                           bias=lambda p: 1.0 if -24 < p.y < 20 else 0.2)
    fine = scatter_inside(body, 700, 0.12, 0.28, grains_material('tg_fine', (0.95, 0.92, 0.84), 1.08, 0.8), margin=0.4, seed=12)
    # 光源：体の向こう（+X 側から見るので −X 側）に置く
    bl = backlight(None, 600, tint=(0.93, 0.95, 0.97), strength=0.85)
    debris(26, (2, 55), 0, seed=5)
    for o in bpy.data.objects:
        if o.name.startswith('Icosphere') and o.data.materials and o.data.materials[0].name.startswith('debris'):
            o.location.x = rng.uniform(-30, 6); o.location.y = rng.uniform(-60, 60); o.location.z = rng.uniform(-30, 45)
    cam = camera((118, 92, -22), (0, -1, 7), 78, 151, 0.7)   # 写真と同じ、斜め前・やや下から（頭が右）
    d = (cam.location - Vector((0, -1, 7))).normalized(); bl.location = Vector((0, -1, 7)) - d * 90; bl.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()   # 光源は、カメラから見て体の真後ろ
    # 歩き：walk_a → b → c → d を順に混ぜる（ゲームと同じシェイプキー）。体の中の粒は、体と一緒に少し揺らす
    names = ['walk_a', 'walk_b', 'walk_c', 'walk_d']
    for f in range(FRAMES):
        ph = 4.0 * f / FRAMES; i = int(ph) % 4; t = ph - int(ph); t = t * t * (3 - 2 * t)
        for k in keys: k.value = 0.0
        if 'walk_a' in keys:
            keys[names[i]].value = 1 - t; keys[names[(i + 1) % 4]].value = t
        ik = inner.data.shape_keys.key_blocks if inner.data.shape_keys else None
        if ik:
            for k in ik: k.value = 0.0
            if 'walk_a' in ik: ik[names[i]].value = 1 - t; ik[names[(i + 1) % 4]].value = t
        bob = 0.12 * math.sin(2 * math.pi * 2 * f / FRAMES)
        for g in (cells, fine): g.location.z = bob; g.location.x = 0.25 * math.sin(2 * math.pi * f / FRAMES)
        render(f)

# ---------------------------------------------------------------- コルポダ
def colpoda():
    """上から見下ろす（体は平たい面をスライドに向けて泳ぐ）。光は下から。体長 65µm（6.5 単位）"""
    sc = reset()
    bpy.ops.import_scene.gltf(filepath=os.path.join(C.OUT, 'creatures', 'colpoda.glb'))
    ob = {o.name: o for o in bpy.data.objects if o.type == 'MESH'}
    keep = ['colpoda_body_LOD0', 'colpoda_vacuoles_LOD0', 'colpoda_macronucleus', 'colpoda_cv', 'colpoda_cyst_wall_LOD0', 'colpoda_cyst_cell_LOD0']
    for n, o in ob.items():
        if n not in keep: bpy.data.objects.remove(o)
    ob = {n: bpy.data.objects[n] for n in keep}
    for o in ob.values():
        o.parent = None
        for p in o.data.polygons: p.use_smooth = True
    body = ob['colpoda_body_LOD0']
    na = os.path.join(C.OUT, 'creatures', 'colpoda_na.png')
    # 写真：体は灰褐色の半透明、輪郭は太く暗い。中は細かい粒がぎっしり。食胞はわずかに黄褐色、大核は粒の少ない灰色の丸
    body.data.materials.clear(); body.data.materials.append(specimen('co_body', (0.99, 0.98, 0.96), 1.075, 0.08, rough=0.03, absorb_col=(0.62, 0.56, 0.42), normal=(na, 1.0)))
    for n, c, ior, d in (('colpoda_vacuoles_LOD0', (0.7, 0.66, 0.55), 1.03, 0.07), ('colpoda_macronucleus', (0.72, 0.7, 0.64), 1.025, 0.25), ('colpoda_cv', (1, 1, 1), 0.985, 0.0)):
        ob[n].data.materials.clear(); ob[n].data.materials.append(specimen(n + '_m', (0.99, 0.99, 0.98), ior, d, rough=0.08, absorb_col=c))
    # 収縮胞の大きさ（GLB は単位球に近い形。ゲーム側の値と同じ半径 0.55）
    cv = ob['colpoda_cv']; cv.scale = (0.55, 0.55, 0.45)
    fine = scatter_inside(body, 2600, 0.04, 0.09, grains_material('co_fine', (0.95, 0.93, 0.88), 1.07, 0.7), margin=0.1, seed=21)
    mid = scatter_inside(body, 120, 0.12, 0.22, grains_material('co_mid', (0.88, 0.84, 0.74), 1.05, 0.5), margin=0.2, seed=22)
    # 繊毛：体の表面から生える細い毛（長さ 10µm 前後、太さ 0.25µm）。毛の粒子で作る
    ps = body.modifiers.new('cilia', 'PARTICLE_SYSTEM').particle_system; st = ps.settings
    st.type = 'HAIR'; st.count = 1800; st.hair_length = 0.55; st.use_advanced_hair = True; st.emit_from = 'FACE'; st.use_even_distribution = True
    st.root_radius = 0.02; st.tip_radius = 0.008; st.radius_scale = 1.0; st.display_step = 3; st.render_step = 3
    st.child_type = 'NONE'
    def bc(nt, out):
        t = nt.nodes.new('ShaderNodeBsdfTransparent'); d = nt.nodes.new('ShaderNodeBsdfDiffuse'); d.inputs[0].default_value = (0.35, 0.34, 0.31, 1)
        mx = nt.nodes.new('ShaderNodeMixShader'); mx.inputs[0].default_value = 0.07; nt.links.new(t.outputs[0], mx.inputs[1]); nt.links.new(d.outputs[0], mx.inputs[2]); nt.links.new(mx.outputs[0], out.inputs['Surface'])
    body.data.materials.append(mat('co_cilia', bc)); st.material = 2
    # シスト（写真の左に写っているもの）：厚い殻の中に、丸い細胞。分裂中は 2 つ
    for n in ('colpoda_cyst_wall_LOD0', 'colpoda_cyst_cell_LOD0'):
        o = ob[n]; o.location = (-4.3, 1.9, 0.0)
    ob['colpoda_cyst_wall_LOD0'].data.materials.clear(); ob['colpoda_cyst_wall_LOD0'].data.materials.append(specimen('co_wall', (0.99, 0.99, 0.97), 1.22, 0.35, rough=0.05, absorb_col=(0.7, 0.66, 0.55)))
    cell = ob['colpoda_cyst_cell_LOD0']; cell.data.materials.clear(); cell.data.materials.append(specimen('co_cell', (0.99, 0.98, 0.96), 1.07, 0.1, absorb_col=(0.62, 0.56, 0.42)))
    cell.scale = (0.66, 0.56, 0.62); cell.location = (-4.3, 2.88, 0)
    bpy.ops.object.duplicate(); c2 = bpy.context.active_object if bpy.context.active_object != cell else None
    c2 = cell.copy(); c2.data = cell.data; bpy.context.collection.objects.link(c2); c2.location = (-4.3, 0.95, 0)
    for c in (cell, c2): scatter_inside(c, 700, 0.04, 0.09, grains_material('co_cfine', (0.95, 0.93, 0.88), 1.07, 0.7), margin=0.1, seed=hash(c.name) % 97)
    bl = backlight(None, 400, tint=(0.93, 0.9, 0.97), strength=0.85); bl.location = (0, 0, -30)
    debris(22, (9, 7), -1.8, seed=8, scale=0.15)
    cam = camera((0, 0, 60), (0, 0, 0), 135, 60, 0.9)   # 横 約 16 単位（160µm）。ピントは体の中ほど
    parts = [body, fine, mid, ob['colpoda_vacuoles_LOD0'], ob['colpoda_macronucleus'], cv]
    base = [(o.location.copy(), o.rotation_euler.copy()) for o in parts]
    piv = Vector((1.6, -0.6, 0))
    for f in range(FRAMES):
        u = f / FRAMES; ang = 0.22 * math.sin(2 * math.pi * u); off = Vector((0.5 * math.sin(2 * math.pi * u), 0.35 * math.sin(4 * math.pi * u), 0))
        R = Matrix.Rotation(ang - 0.35, 4, 'Z')
        for o, (l0, r0) in zip(parts, base):
            o.matrix_world = Matrix.Translation(piv + off) @ R @ Matrix.Translation(l0) @ r0.to_matrix().to_4x4() @ Matrix.Diagonal((*o.scale, 1.0))
        cv.scale = (0.55 * (0.6 + 0.4 * abs(math.cos(math.pi * u))),) * 2 + (0.45,)
        render(f)

# ---------------------------------------------------------------- 細菌（枯草菌・シュードモナス）。この場面だけ単位は µm
def capsule(name, length, radius, m, seg=24, rings=10):
    """両端の丸い棒（長さ length は丸い端を含む）。+X 方向に伸びる"""
    import bmesh
    bm = bmesh.new(); half = length / 2 - radius
    rows = []
    for k in range(rings + 1):          # 左の半球
        a = math.pi / 2 * (1 - k / rings); rows.append((-half - radius * math.sin(a), radius * math.cos(a)))
    for k in range(1, 4): rows.append((-half + 2 * half * k / 4, radius))
    for k in range(rings + 1):          # 右の半球
        a = math.pi / 2 * k / rings; rows.append((half + radius * math.sin(a), radius * math.cos(a)))
    vs = []
    for x, rr in rows:
        ring = [bm.verts.new((x, rr * math.cos(2 * math.pi * j / seg), rr * math.sin(2 * math.pi * j / seg))) for j in range(seg)] if rr > 1e-5 else [bm.verts.new((x, 0, 0))]
        vs.append(ring)
    for r0, r1 in zip(vs[:-1], vs[1:]):
        if len(r0) == 1: [bm.faces.new((r0[0], r1[(j + 1) % seg], r1[j])) for j in range(seg)]
        elif len(r1) == 1: [bm.faces.new((r0[j], r0[(j + 1) % seg], r1[0])) for j in range(seg)]
        else: [bm.faces.new((r0[j], r0[(j + 1) % seg], r1[(j + 1) % seg], r1[j])) for j in range(seg)]
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for pl in me.polygons: pl.use_smooth = True
    o = bpy.data.objects.new(name, me); bpy.context.collection.objects.link(o); o.data.materials.append(m); return o

def bacteria(kind):
    """写真は位相差顕微鏡なので、明視野で描いた像を、位相差の見え方（暗い細胞と、まわりの明るいにじみ）に変換する（post_phase）"""
    sc = reset()
    r = random.Random(31 if kind == 'bacillus' else 41)
    cell_m = specimen('cell', (0.92, 0.92, 0.9), 1.05, 0.9, rough=0.05, absorb_col=(0.3, 0.3, 0.29))
    def sb(nt, out):   # 芽胞：位相差では白く強く光る（光をよく曲げる）。ここでは光る小さなだ円として描く
        e = nt.nodes.new('ShaderNodeEmission'); e.inputs[0].default_value = (1, 1, 0.97, 1); e.inputs[1].default_value = 1.6
        nt.links.new(e.outputs[0], out.inputs['Surface'])
    spore_m = mat('spore', sb)
    cells = []
    if kind == 'bacillus':
        # 枯草菌：太さ 0.8µm、長さ 2.5〜4µm。2〜6 細胞の鎖が多い（写真）。一部の細胞に芽胞
        chains = [(-16, 8.5, -0.15, 5), (2, 10.5, -0.35, 3), (-15.5, -1.5, 0.25, 6), (3, 3.2, 0.55, 4), (-6, -10, -0.05, 4), (9.5, -8, 1.25, 3), (13, 1, 1.6, 2), (-8, 3.6, 1.45, 1), (6, -2, -0.6, 2)]
        for ci, (x, y, a, n) in enumerate(chains):
            p = Vector((x, y, r.uniform(-0.6, 0.6)))
            for k in range(n):
                L = r.uniform(2.8, 4.0); o = capsule('cell', L, 0.36, cell_m); a += r.uniform(-0.12, 0.12)
                d = Vector((math.cos(a), math.sin(a), 0)); c = p + d * (L / 2); o.location = c; o.rotation_euler = (0, 0, a); o['grp'] = ci; cells.append(o)
                if r.random() < 0.3:
                    sp = capsule('spore', 1.1, 0.3, spore_m, seg=16, rings=6); sp.location = c + d * (L * r.choice([-0.25, 0.25])); sp.rotation_euler = (0, 0, a); sp['grp'] = ci; cells.append(sp)
                p = c + d * (L / 2 + 0.06)
    else:
        # シュードモナス：太さ 0.7µm、長さ 1.8〜2.6µm。ばらばらで、2 個つながったもの（分裂直後）も
        for i in range(16):
            n = 2 if r.random() < 0.25 else 1; a = r.uniform(0, 6.28); p = Vector((r.uniform(-10, 10), r.uniform(-7, 7), r.uniform(-0.6, 0.6)))
            for k in range(n):
                L = r.uniform(1.8, 2.6); o = capsule('cell', L, 0.36, cell_m); d = Vector((math.cos(a), math.sin(a), 0)); o.location = p + d * (L / 2); o.rotation_euler = (0, 0, a); o['grp'] = i; cells.append(o); p = p + d * (L + 0.05); a += r.uniform(-0.3, 0.3)
    bl = backlight(None, 200, tint=(0.95, 0.95, 0.95), strength=0.85); bl.location = (0, 0, -20)
    debris(18, (17, 13), -0.8, seed=9, scale=0.18)
    cam = camera((0, 0, 100), (0, 0, 0), 100 if kind == 'bacillus' else 160, 100, 1.2)    # 横 約 36µm（枯草菌）・22µm（シュードモナス）。写真の倍率に合わせる
    base = [(o.location.copy(), o.rotation_euler.z) for o in cells]
    grp = {}
    for o in cells: grp.setdefault(o['grp'], []).append(o)
    gph = {g: (r.uniform(0, 6.28), r.uniform(0.15, 0.45)) for g in grp}
    gctr = {g: sum((o.location for o in os_), Vector()) / len(os_) for g, os_ in grp.items()}
    for f in range(FRAMES):
        u = f / FRAMES
        for o, (l0, a0) in zip(cells, base):
            # その場でのゆらぎ（ブラウン運動に近い小さな動き）。鎖はひとかたまりで動く。シュードモナスは泳ぐので大きく
            g = o['grp']; p0, amp = gph[g]; k = 2.5 if kind == 'pseudomonas' else 1.0
            th = 0.05 * k * math.sin(2 * math.pi * u + p0 * 0.7); R = Matrix.Rotation(th, 4, 'Z')
            rel = (R @ (l0 - gctr[g]).to_4d()).to_3d()
            o.location = gctr[g] + rel + Vector((amp * k * math.sin(2 * math.pi * u + p0), amp * k * 0.7 * math.sin(4 * math.pi * u + p0 * 1.3), 0))
            o.rotation_euler.z = a0 + th
        render(f)

def render(f):
    sc = bpy.context.scene; sc.render.filepath = os.path.join(OUT, f'f{f:04d}.png')
    t0 = time.time(); bpy.ops.render.render(write_still=True); print(f'[micro] {KIND} frame {f} {time.time()-t0:.1f}s', flush=True)

if __name__ == '__main__':
    {'tardigrade': tardigrade, 'colpoda': colpoda, 'bacillus': lambda: bacteria('bacillus'), 'pseudomonas': lambda: bacteria('pseudomonas')}[KIND]()
