"""UNDERSOIL: 生き物モデル（コルポダ、クマムシ）で共通に使う関数。
格子（輪 × 列）から直接メッシュを組み立てる。頂点の並びを式で決めるので、姿勢を変えてもシェイプキーが壊れない。
単位：1 = 10µm。Blender の +Y が頭、+Z が上（GLB では −Z が前、+Y が上）。"""
import bpy, os, sys, math, time, subprocess
import numpy as np
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'lib'))
import common as C

ROOT = C.ROOT
COUT = os.path.join(C.OUT, 'creatures'); PUB = os.path.join(ROOT, 'public', 'models', 'creatures'); PREV = C.PREVIEW
for d in (COUT, PUB, PREV): os.makedirs(d, exist_ok=True)

def sstep(a, b, x):
    t = np.clip((np.asarray(x, dtype=float) - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)

def warp(n, dens, lo=0.0, hi=1.0, periodic=False):
    """密度 dens(x) に比例して、n 個の位置を [lo,hi] に並べる（脚や口のまわりに頂点を集めるため）"""
    x = np.linspace(lo, hi, 8001); d = dens(x) + 0 * x
    c = np.concatenate([[0], np.cumsum((d[1:] + d[:-1]) * 0.5)]); c /= c[-1]
    t = np.arange(n) / n if periodic else (np.arange(n) + 0.5) / n
    return np.interp(t, c, x)

def tube_tris(nv, nu, poles=True):
    """輪 nv 本 × 列 nu の筒（両端は1点に閉じる）。頂点番号 = 輪*nu+列、極は nv*nu と nv*nu+1。
    返り値：F (面,3)、G (面,3,2)＝各かどの格子座標（列, 輪）。列は継ぎ目で nu になる。極は輪 −1 と nv。"""
    j, i = np.meshgrid(np.arange(nv - 1), np.arange(nu), indexing='ij'); j = j.ravel(); i = i.ravel()
    a = j * nu + i; b = j * nu + (i + 1) % nu; c = (j + 1) * nu + (i + 1) % nu; d = (j + 1) * nu + i
    ga = np.stack([i, j], 1); gb = np.stack([i + 1, j], 1); gc = np.stack([i + 1, j + 1], 1); gd = np.stack([i, j + 1], 1)
    F = [np.stack([a, b, c], 1), np.stack([a, c, d], 1)]
    G = [np.stack([ga, gb, gc], 1).astype(float), np.stack([ga, gc, gd], 1).astype(float)]
    if poles:
        i = np.arange(nu); p0 = nv * nu; p1 = p0 + 1; o = (nv - 1) * nu; z = np.zeros(nu)
        F.append(np.stack([np.full(nu, p0), (i + 1) % nu, i], 1))
        G.append(np.stack([np.stack([i + .5, z - 1], 1), np.stack([i + 1., z], 1), np.stack([i + 0., z], 1)], 1))
        F.append(np.stack([np.full(nu, p1), o + i, o + (i + 1) % nu], 1))
        G.append(np.stack([np.stack([i + .5, z + nv], 1), np.stack([i + 0., z + nv - 1], 1), np.stack([i + 1., z + nv - 1], 1)], 1))
    return np.concatenate(F), np.concatenate(G)

def orient(V, F, G=None):
    """面の向きを外向きにそろえる（体積の符号で判定）"""
    v0, v1, v2 = V[F[:, 0]], V[F[:, 1]], V[F[:, 2]]
    ctr = V.mean(0)
    vol = np.einsum('ij,ij->i', v0 - ctr, np.cross(v1 - ctr, v2 - ctr)).sum()
    if vol < 0:
        F = F[:, ::-1].copy()
        if G is not None: G = G[:, ::-1].copy()
    return (F, G) if G is not None else F

def vertex_normals(V, F):
    fn = np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]])
    N = np.zeros_like(V)
    for k in range(3): np.add.at(N, F[:, k], fn)
    return N / np.maximum(np.linalg.norm(N, axis=1, keepdims=True), 1e-12)

def grid_normals(P, outward_ref=None):
    """P (nv,nu,3) の格子の法線。列方向は周期。outward_ref (nv,1,3)＝軸の点を渡すと、外向きにそろえる"""
    Pu = np.roll(P, -1, 1) - np.roll(P, 1, 1); Pv = np.gradient(P, axis=0)
    N = np.cross(Pu, Pv); N /= np.maximum(np.linalg.norm(N, axis=2, keepdims=True), 1e-12)
    ref = P.mean(1, keepdims=True) if outward_ref is None else outward_ref
    if np.sum(N * (P - ref)) < 0: N = -N
    return N

def tube(pts, radii, sides, ref=(0, 0, 1), squash=None):
    """中心線 pts (n,3) と半径 radii (n,) から、両端を閉じた細い筒を作る（爪、口の管、腸など）。
    頂点：n*sides + 2。向きの基準 ref を固定するので、姿勢が変わっても頂点の対応が保たれる。"""
    pts = np.asarray(pts, float); n = len(pts); radii = np.asarray(radii, float)
    T = np.gradient(pts, axis=0); T /= np.maximum(np.linalg.norm(T, axis=1, keepdims=True), 1e-9)
    r = np.asarray(ref, float)[None, :] + 0 * T
    X = np.cross(r, T); bad = np.linalg.norm(X, axis=1) < 1e-4
    X[bad] = np.cross(np.array([1.0, 0, 0]), T[bad])
    X /= np.linalg.norm(X, axis=1, keepdims=True); Y = np.cross(T, X)
    a = np.arange(sides) / sides * 2 * np.pi
    sq = (1.0, 1.0) if squash is None else squash
    V = pts[:, None, :] + radii[:, None, None] * (sq[0] * np.cos(a)[None, :, None] * X[:, None, :] + sq[1] * np.sin(a)[None, :, None] * Y[:, None, :])
    V = np.concatenate([V.reshape(-1, 3), pts[:1] - T[:1] * radii[0] * 0.5, pts[-1:] + T[-1:] * radii[-1] * 0.5])
    return V

def sphere(center, r, nu, nv, scale=(1, 1, 1)):
    v = (np.arange(nv) + 0.5) / nv; u = np.arange(nu) / nu * 2 * np.pi
    P = np.stack([np.sin(np.pi * v)[:, None] * np.cos(u)[None, :], np.sin(np.pi * v)[:, None] * np.sin(u)[None, :], -np.cos(np.pi * v)[:, None] + 0 * u[None, :]], 2)
    V = np.concatenate([P.reshape(-1, 3), [[0, 0, -1]], [[0, 0, 1]]]) * r * np.asarray(scale, float) + np.asarray(center, float)
    return V

def grid_uv(G, nu, nv, rect=(0, 0, 1, 1)):
    """格子座標 → UV（等間隔）。rect = (u0, v0, u1, v1)"""
    u = G[..., 0] / nu; v = (G[..., 1] + 1) / (nv + 1)
    return np.stack([rect[0] + u * (rect[2] - rect[0]), rect[1] + v * (rect[3] - rect[1])], -1)

def make_mesh(name, V, F, UV=None, uv2=None):
    me = bpy.data.meshes.new(name); me.from_pydata(np.asarray(V, float).tolist(), [], np.asarray(F).tolist()); me.update()
    if UV is not None:
        l = me.uv_layers.new(name='UVMap'); l.data.foreach_set('uv', np.asarray(UV, np.float32).ravel())
    if uv2 is not None:
        l = me.uv_layers.new(name='UV2'); l.data.foreach_set('uv', np.asarray(uv2, np.float32).ravel())
    me.polygons.foreach_set('use_smooth', [True] * len(me.polygons)); me.update()
    ob = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(ob)
    return ob

def set_colors(ob, rgb):
    """頂点色（線形の実数）。rgb (n,3)"""
    me = ob.data; n = len(me.vertices)
    col = me.color_attributes.new('Color', 'FLOAT_COLOR', 'POINT')
    a = np.ones((n, 4), np.float32); a[:, :3] = np.clip(rgb, 0, 1); col.data.foreach_set('color', a.ravel())
    me.color_attributes.active_color = col
    try: me.color_attributes.render_color_index = 0
    except Exception: pass

def thickness(V, F, ref):
    """各頂点から内向きに線を飛ばし、反対側の面までの距離を「厚み」とする（0 薄い … 1 厚い）"""
    bvh = BVHTree.FromPolygons(V.tolist(), F.tolist()); N = vertex_normals(V, F); out = np.zeros(len(V))
    for i in range(len(V)):
        o = Vector(V[i] - N[i] * 1e-3); h = bvh.ray_cast(o, Vector(-N[i]))
        out[i] = h[3] if h[0] is not None else 0.0
    return np.clip(out / ref, 0, 1)

def add_key(ob, name, V):
    if ob.data.shape_keys is None: ob.shape_key_add(name='Basis')
    sk = ob.shape_key_add(name=name); sk.data.foreach_set('co', np.asarray(V, np.float32).ravel()); return sk

def set_keys(ob, **w):
    if ob.data.shape_keys is None: return
    for k in ob.data.shape_keys.key_blocks[1:]: k.value = w.get(k.name, 0.0)

def plain_mat(ob, name=None):
    m = bpy.data.materials.new(name or ob.name); m.use_nodes = True; ob.data.materials.clear(); ob.data.materials.append(m); return m

def bake_na(low, high, size, path, cage=0.1, ao_samples=32, flat_rect=None):
    """高解像度 high → low へ、法線（接空間）と AO を焼いて1枚にまとめる。R,G = 法線 xy、B = AO。"""
    hidden = []
    for o in bpy.context.scene.objects:
        if o not in (low, high) and not o.hide_render: o.hide_render = True; hidden.append(o)
    for o in (low, high):
        if not o.data.materials: plain_mat(o)
    nrm = C.bake(low, 'NORMAL', size, samples=1, highpoly=high, cage=cage, margin=12)
    ao = C.bake(low, 'AO', size, samples=ao_samples, highpoly=high, cage=cage, margin=12)
    n = np.array(nrm.pixels[:], dtype=np.float32).reshape(size, size, 4); a = np.array(ao.pixels[:], dtype=np.float32).reshape(size, size, 4)
    out = np.ones((size, size, 4), dtype=np.float32); out[..., 0] = n[..., 0]; out[..., 1] = n[..., 1]; out[..., 2] = a[..., 0]
    if flat_rect is not None:   # 焼けない部分（爪など）を、平らな法線・影なしで埋める
        u0, v0, u1, v1 = flat_rect
        out[int(v0 * size):int(v1 * size), int(u0 * size):int(u1 * size), :3] = (0.5, 0.5, 1.0)
    img = bpy.data.images.new(os.path.basename(path), size, size, alpha=False); img.colorspace_settings.name = 'Non-Color'
    img.pixels = out.ravel().tolist(); C.save_image(img, path)
    for o in hidden: o.hide_render = False
    bpy.data.images.remove(nrm); bpy.data.images.remove(ao)
    return img

def to_webp(png, quality=90):
    dst = os.path.join(PUB, os.path.splitext(os.path.basename(png))[0] + '.webp')
    subprocess.run(['convert', png, '-quality', str(quality), '-define', 'webp:method=6', dst], check=True)
    print(f'[webp] {dst} {os.path.getsize(dst)/1024:.1f}KB'); return dst

def export_glb(name, objs, morph=False):
    path = os.path.join(COUT, name + '.glb')
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs: o.hide_render = False; o.hide_viewport = False; o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, export_yup=True, export_apply=False,
        export_morph=morph, export_morph_normal=morph, export_tangents=True, export_normals=True, export_texcoords=True,
        export_vertex_color='ACTIVE', export_all_vertex_colors=True, export_active_vertex_color_when_no_material=True,
        export_materials='NONE', export_draco_mesh_compression_enable=False, export_animations=False)
    print(f'[glb] {path} {os.path.getsize(path)/1024:.1f}KB')
    dst = os.path.join(PUB, name + '.glb')
    r = subprocess.run(['npx', 'gltf-transform', 'meshopt', path, dst, '--level', 'medium'], cwd=ROOT, capture_output=True, text=True)
    print('[meshopt]', r.returncode, (r.stdout + r.stderr).strip()[-300:])
    if os.path.exists(dst): print(f'[glb] {dst} {os.path.getsize(dst)/1024:.1f}KB')
    return path

# ---------- 確認用の描画（光学顕微鏡の明視野に似せる） ----------
def mat_micro(name, color=(0.84, 0.86, 0.84), a_face=0.18, a_edge=0.85, edge_dark=0.45, na=None, strength=1.0):
    """半透明の淡い材質。正面は透け、ふちは濃く見える。na を渡すと、焼いた法線と AO を使う。"""
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; nd = nt.nodes; ln = nt.links
    for n in list(nd): nd.remove(n)
    out = nd.new('ShaderNodeOutputMaterial'); mix = nd.new('ShaderNodeMixShader'); tr = nd.new('ShaderNodeBsdfTransparent'); bs = nd.new('ShaderNodeBsdfPrincipled')
    lw = nd.new('ShaderNodeLayerWeight'); lw.inputs['Blend'].default_value = 0.5
    pw = nd.new('ShaderNodeMath'); pw.operation = 'POWER'; pw.inputs[1].default_value = 1.6; ln.new(lw.outputs['Facing'], pw.inputs[0])
    mr = nd.new('ShaderNodeMapRange'); mr.inputs['To Min'].default_value = a_face; mr.inputs['To Max'].default_value = a_edge; ln.new(pw.outputs[0], mr.inputs['Value'])
    cm = nd.new('ShaderNodeMixRGB'); cm.inputs['Color1'].default_value = (*color, 1); cm.inputs['Color2'].default_value = (*[c * edge_dark for c in color], 1); ln.new(pw.outputs[0], cm.inputs['Fac'])
    bs.inputs['Roughness'].default_value = 0.45
    col_out = cm.outputs[0]
    if na is not None:
        tex = nd.new('ShaderNodeTexImage'); tex.image = na; tex.interpolation = 'Cubic'
        sep = nd.new('ShaderNodeSeparateColor'); ln.new(tex.outputs['Color'], sep.inputs[0])
        def m2(op, a, b):
            n = nd.new('ShaderNodeMath'); n.operation = op
            for k, v in enumerate((a, b)):
                if isinstance(v, (int, float)): n.inputs[k].default_value = v
                else: ln.new(v, n.inputs[k])
            return n.outputs[0]
        x = m2('SUBTRACT', m2('MULTIPLY', sep.outputs[0], 2.0), 1.0); y = m2('SUBTRACT', m2('MULTIPLY', sep.outputs[1], 2.0), 1.0)
        zz = m2('SQRT', m2('MAXIMUM', m2('SUBTRACT', m2('SUBTRACT', 1.0, m2('MULTIPLY', x, x)), m2('MULTIPLY', y, y)), 0.0), 0.0)
        cb = nd.new('ShaderNodeCombineColor'); ln.new(sep.outputs[0], cb.inputs[0]); ln.new(sep.outputs[1], cb.inputs[1]); ln.new(m2('ADD', m2('MULTIPLY', zz, 0.5), 0.5), cb.inputs[2])
        nm = nd.new('ShaderNodeNormalMap'); nm.inputs['Strength'].default_value = strength; ln.new(cb.outputs[0], nm.inputs['Color']); ln.new(nm.outputs[0], bs.inputs['Normal'])
        ao = nd.new('ShaderNodeMixRGB'); ao.blend_type = 'MULTIPLY'; ao.inputs['Fac'].default_value = 1.0; ln.new(col_out, ao.inputs['Color1'])
        g = nd.new('ShaderNodeCombineColor'); [ln.new(sep.outputs[2], g.inputs[k]) for k in range(3)]; ln.new(g.outputs[0], ao.inputs['Color2']); col_out = ao.outputs[0]
        # AO の暗い所は、少し不透明にする（くぼみやしわが見えるように）
        inv = m2('MULTIPLY', m2('SUBTRACT', 1.0, sep.outputs[2]), 0.6); fac = m2('MINIMUM', m2('ADD', mr.outputs[0], inv), 1.0)
    else:
        fac = mr.outputs[0]
    ln.new(col_out, bs.inputs['Base Color']); ln.new(fac, mix.inputs['Fac']); ln.new(tr.outputs[0], mix.inputs[1]); ln.new(bs.outputs[0], mix.inputs[2]); ln.new(mix.outputs[0], out.inputs['Surface'])
    return m

def mat_fringe(name, rows=40.0, color=(0.25, 0.27, 0.26), alpha=0.4):
    """繊毛の殻の確認用：ふちだけが見え、UV の x に沿って細いすじになる（ゲームのシェーダーの考え方と同じ）"""
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; nd = nt.nodes; ln = nt.links
    for n in list(nd): nd.remove(n)
    out = nd.new('ShaderNodeOutputMaterial'); mix = nd.new('ShaderNodeMixShader'); tr = nd.new('ShaderNodeBsdfTransparent'); bs = nd.new('ShaderNodeBsdfDiffuse'); bs.inputs['Color'].default_value = (*color, 1)
    lw = nd.new('ShaderNodeLayerWeight'); lw.inputs['Blend'].default_value = 0.5
    def m2(op, a, b=None):
        n = nd.new('ShaderNodeMath'); n.operation = op
        for k, v in enumerate((a, b)):
            if v is None: continue
            if isinstance(v, (int, float)): n.inputs[k].default_value = v
            else: ln.new(v, n.inputs[k])
        return n.outputs[0]
    uv = nd.new('ShaderNodeUVMap'); sp = nd.new('ShaderNodeSeparateXYZ'); ln.new(uv.outputs[0], sp.inputs[0])
    st = m2('ABSOLUTE', m2('SUBTRACT', m2('FRACT', m2('MULTIPLY', sp.outputs[0], rows * 2)), 0.5))       # 0..0.5 の三角波（1列に2本）
    st = m2('MULTIPLY', st, 2.0)
    rim = m2('POWER', m2('MAXIMUM', m2('SUBTRACT', m2('MULTIPLY', lw.outputs['Facing'], 1.6), 0.45), 0.0), 1.2)
    fac = m2('MINIMUM', m2('MULTIPLY', m2('MULTIPLY', rim, m2('ADD', m2('MULTIPLY', st, 0.75), 0.25)), alpha * 2.2), 0.9)
    ln.new(fac, mix.inputs['Fac']); ln.new(tr.outputs[0], mix.inputs[1]); ln.new(bs.outputs[0], mix.inputs[2]); ln.new(mix.outputs[0], out.inputs['Surface'])
    return m

VIEWS = {  # 名前: (カメラのある向き, 画面の上)
    'front': ((0, 1, 0), (0, 0, 1)), 'side': ((-1, 0, 0), (0, 0, 1)), 'top': ((0, 0, 1), (0, 1, 0)), 'under': ((0, 0, -1), (0, 1, 0)),
    'quarter': ((-0.62, 0.55, -0.56), (0, 0, 1)),
}

def setup_preview(bg=0.72):
    sc = bpy.context.scene
    sc.cycles.use_denoising = True; sc.cycles.transparent_max_bounces = 24; sc.cycles.max_bounces = 6
    try: sc.view_settings.view_transform = 'Standard'
    except Exception: pass
    w = sc.world or bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
    w.node_tree.nodes['Background'].inputs[0].default_value = (bg, bg, bg, 1); w.node_tree.nodes['Background'].inputs[1].default_value = 1.0
    if 'pv_cam' not in bpy.data.objects:
        cam = bpy.data.objects.new('pv_cam', bpy.data.cameras.new('pv_cam')); sc.collection.objects.link(cam); cam.data.type = 'ORTHO'; sc.camera = cam
        sun = bpy.data.objects.new('pv_sun', bpy.data.lights.new('pv_sun', 'SUN')); sc.collection.objects.link(sun); sun.data.energy = 1.2; sun.data.angle = 0.6

def render_views(prefix, show, views, center, scale, size=448, samples=24, dist=200.0):
    """show に入っている物だけを見せて、直交投影で各方向から描く。scale = 画面の一辺の長さ"""
    sc = bpy.context.scene; setup_preview()
    for o in sc.objects:
        if o.type == 'MESH': o.hide_render = o not in show
    cam = bpy.data.objects['pv_cam']; sun = bpy.data.objects['pv_sun']
    cam.data.ortho_scale = scale; cam.data.clip_start = 0.1; cam.data.clip_end = dist * 3
    sc.render.resolution_x = sc.render.resolution_y = size; sc.cycles.samples = samples
    outs = []
    for v in views:
        d, up = VIEWS[v]; z = Vector(d).normalized(); x = Vector(up).cross(z).normalized(); y = z.cross(x)
        M = Matrix((x, y, z)).transposed().to_4x4(); M.translation = Vector(center) + z * dist; cam.matrix_world = M
        # 光は、カメラの少し斜め上から
        sd = (z + y * 0.5 + x * 0.35).normalized(); sun.rotation_euler = sd.to_track_quat('Z', 'Y').to_euler()
        sc.render.filepath = f'{prefix}_{v}.png'; t = time.time(); bpy.ops.render.render(write_still=True); outs.append(sc.render.filepath)
        print(f'[preview] {os.path.basename(sc.render.filepath)} {time.time()-t:.1f}s')
    return outs
