"""土の粒一式（石英・団粒・腐植・粘土の薄片）。高解像度の形 → ローポリへ法線と AO を焼き込み、LOD 付きで書き出す。
実行: python3 assets/blender/soil_grains.py [--only quartz_a] [--size 512]
出力: assets/out/grains/<name>.glb（LOD0/LOD1）、assets/out/grains/<name>_na.png（RG=法線 xy、B=AO）、assets/preview/grain_<name>_*.png"""
import bpy, bmesh, sys, os, math, random, time
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'lib'))
from common import *
from mathutils import Vector, noise

args = sys.argv[1:]
ONLY = args[args.index('--only') + 1] if '--only' in args else None
SIZE = int(args[args.index('--size') + 1]) if '--size' in args else 512
PREVIEW = '--no-preview' not in args
GOUT = os.path.join(OUT, 'grains'); os.makedirs(GOUT, exist_ok=True)

def ico(sub=6, r=1.0):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=sub, radius=r)
    return bpy.context.object

def plane_cuts(obj, n, rng, depth=(0.55, 0.9)):
    """石英の割れ面：ランダムな平面で切り落として、角ばった面を作る"""
    bm = bmesh.new(); bm.from_mesh(obj.data)
    for _ in range(n):
        d = Vector((rng.uniform(-1, 1), rng.uniform(-1, 1), rng.uniform(-1, 1))).normalized()
        geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
        r = bmesh.ops.bisect_plane(bm, geom=geom, plane_co=d * rng.uniform(*depth), plane_no=d, clear_outer=True)
        edges = [e for e in r['geom_cut'] if isinstance(e, bmesh.types.BMEdge)]
        if edges: bmesh.ops.contextual_create(bm, geom=edges)
    bmesh.ops.triangulate(bm, faces=bm.faces[:])
    bm.to_mesh(obj.data); bm.free()

def remesh(obj, voxel):
    m = obj.modifiers.new('rm', 'REMESH'); m.mode = 'VOXEL'; m.voxel_size = voxel; m.use_smooth_shade = True
    bpy.context.view_layer.objects.active = obj; bpy.ops.object.modifier_apply(modifier='rm')

def smooth(obj, it=4, f=0.5):
    m = obj.modifiers.new('sm', 'SMOOTH'); m.iterations = it; m.factor = f
    bpy.context.view_layer.objects.active = obj; bpy.ops.object.modifier_apply(modifier='sm')

def join(objs):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs: o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]; bpy.ops.object.join(); return bpy.context.object

def make_quartz(seed):
    rng = random.Random(seed)
    o = ico(5); o.scale = (1.0, rng.uniform(0.7, 0.9), rng.uniform(0.6, 0.85)); bpy.ops.object.transform_apply(scale=True)
    plane_cuts(o, 12, rng, depth=(0.5, 0.88))
    # 貝殻状の割れ口：浅いくぼみを 4〜8 か所えぐる（写真の石英粒の特徴）
    bm = bmesh.new(); bm.from_mesh(o.data)
    for _ in range(rng.randint(4, 8)):
        c = Vector((rng.uniform(-1, 1), rng.uniform(-1, 1), rng.uniform(-1, 1))).normalized()
        rad, dep = rng.uniform(0.25, 0.5), rng.uniform(0.04, 0.10)
        for v in bm.verts:
            d = (v.co.normalized() - c).length
            if d < rad: v.co -= v.co.normalized() * dep * (1 - (d / rad) ** 2) ** 1.5
    bm.to_mesh(o.data); bm.free()
    remesh(o, 0.012); smooth(o, 1, 0.35)   # 角はわずかに丸めるだけ（亜角）
    displace_noise(o, [(1.3, 0.04, 'n'), (6.0, 0.012, 'n'), (28.0, 0.005, 'ridge'), (90.0, 0.002, 'n')], seed)   # すりガラス状の細かい凹凸
    return o

def make_aggregate(seed):
    """団粒：シルトと粘土の細かい粒が、有機物の糊でゆるく固まった塊。輪郭はけば立ち、孔が多く、角ばったシルトの粒が混じる（写真で確認）"""
    rng = random.Random(seed); parts = []
    core = ico(3, 0.45); core.scale = (1.0, 0.85, 0.75); parts.append(core)
    for i in range(rng.randint(150, 190)):
        d = Vector((rng.gauss(0, 1), rng.gauss(0, 1), rng.gauss(0, 0.85))).normalized() * (0.25 + 0.5 * rng.random() ** 0.6)
        r = 0.03 + 0.2 * rng.random() ** 2.5                                   # 大きさの幅が広い（小さい粒が多い）
        angular = rng.random() < 0.3                                           # 角ばったシルトの粒
        p = ico(1 if angular else 2, r); p.location = d
        p.scale = (rng.uniform(0.6, 1.4), rng.uniform(0.6, 1.4), rng.uniform(0.5, 1.2)); p.rotation_euler = (rng.uniform(0, 3), rng.uniform(0, 3), rng.uniform(0, 3)); parts.append(p)
    o = join(parts); bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    remesh(o, 0.016); smooth(o, 1, 0.25)
    # 孔：セル模様で表面をえぐる。けば：細かい凹凸を強く
    displace_noise(o, [(2.0, 0.05, 'n'), (6.0, -0.06, 'cell'), (14.0, 0.025, 'ridge'), (40.0, 0.012, 'n'), (95.0, 0.005, 'n')], seed)
    return o

def make_humus(seed):
    """腐植その1：炭のかけら。黒く、角ばり、細かい孔が多い"""
    rng = random.Random(seed)
    o = ico(5); o.scale = (1.0, rng.uniform(0.5, 0.7), rng.uniform(0.35, 0.5)); bpy.ops.object.transform_apply(scale=True)
    plane_cuts(o, 7, rng, depth=(0.45, 0.85)); remesh(o, 0.018)
    displace_noise(o, [(3.0, 0.03, 'n'), (9.0, -0.05, 'cell'), (30.0, 0.012, 'ridge')], seed)
    return o

def make_humus_tissue(seed):
    """腐植その2：分解途中の植物のかけら。薄く、丸まった帯。細胞の網目が見える（模様はマテリアルで描く）"""
    rng = random.Random(seed)
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=48, y_subdivisions=16, size=2)
    o = bpy.context.object; o.scale = (1.0, 0.32, 1); bpy.ops.object.transform_apply(scale=True)
    for v in o.data.vertices:
        x, y = v.co.x, v.co.y
        v.co.z = 0.18 * math.sin(x * 1.7 + 0.5) + 0.25 * (y / 0.32) ** 2 * 0.4 + 0.03 * math.sin(x * 9) * math.sin(y * 20)
        if abs(y) > 0.3 * (0.75 + 0.25 * math.sin(x * 5 + seed)): v.co.y *= 0.92   # ぼろぼろの縁
    m = o.modifiers.new('s', 'SOLIDIFY'); m.thickness = 0.06
    bpy.context.view_layer.objects.active = o; bpy.ops.object.modifier_apply(modifier='s')
    remesh(o, 0.014); smooth(o, 2, 0.4)
    displace_noise(o, [(12.0, 0.01, 'n'), (35.0, 0.006, 'n')], seed)
    return o

def make_humus_pellet(seed):
    """腐植その3：小さな動物（トビムシ・ダニ）のふん。丸いつぶが集まったもの"""
    rng = random.Random(seed); parts = []
    for i in range(rng.randint(5, 9)):
        p = ico(3, rng.uniform(0.24, 0.34)); p.location = (rng.gauss(0, 0.17), rng.gauss(0, 0.15), rng.gauss(0, 0.12))
        p.scale = (1.0, rng.uniform(0.75, 0.95), rng.uniform(0.75, 0.95)); parts.append(p)
    o = join(parts); bpy.ops.object.transform_apply(location=True, scale=True)
    remesh(o, 0.016); smooth(o, 2, 0.4)
    displace_noise(o, [(8.0, 0.02, 'n'), (25.0, 0.008, 'n')], seed)
    return o

def make_clay(seed):
    """粘土鉱物の薄片：六角に近い薄い板が、ずれて重なった束"""
    rng = random.Random(seed); parts = []
    for i in range(rng.randint(5, 8)):
        bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=rng.uniform(0.6, 1.0), depth=rng.uniform(0.035, 0.06))
        p = bpy.context.object
        p.location = (rng.uniform(-0.25, 0.25), rng.uniform(-0.25, 0.25), i * 0.075 - 0.25)
        p.rotation_euler = (rng.uniform(-0.12, 0.12), rng.uniform(-0.12, 0.12), rng.uniform(0, 3.14))
        p.scale = (1, rng.uniform(0.7, 1.0), 1); parts.append(p)
    o = join(parts); bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    remesh(o, 0.016)
    displace_noise(o, [(3.0, 0.012, 'n'), (16.0, 0.004, 'n')], seed)
    return o

SPECS = [  # 名前, 作る関数, 種, LOD0 の面数, LOD1 の面数
    ('quartz_a', make_quartz, 1, 2200, 420, 110), ('quartz_b', make_quartz, 2, 2200, 420, 110), ('quartz_c', make_quartz, 5, 2200, 420, 110),
    ('aggregate_a', make_aggregate, 3, 3000, 600, 150), ('aggregate_b', make_aggregate, 8, 3000, 600, 150), ('aggregate_c', make_aggregate, 11, 3000, 600, 150),
    ('humus_a', make_humus, 4, 2400, 480, 130), ('humus_b', make_humus_tissue, 9, 2400, 480, 130), ('humus_c', make_humus_pellet, 12, 2000, 420, 120),
    ('clay_a', make_clay, 6, 900, 220, 48),
]

def lowpoly(high, name, tris):
    lo = high.copy(); lo.data = high.data.copy(); lo.name = name; bpy.context.scene.collection.objects.link(lo)
    m = lo.modifiers.new('dec', 'DECIMATE'); m.ratio = min(1.0, tris / max(1, len(lo.data.polygons)))
    bpy.context.view_layer.objects.active = lo; bpy.ops.object.modifier_apply(modifier='dec')
    bpy.ops.object.select_all(action='DESELECT'); lo.select_set(True); bpy.ops.object.shade_smooth()
    return lo

for name, fn, seed, t0n, t1n, t2n in SPECS:
    if ONLY and name != ONLY: continue
    t = time.time(); reset()
    high = fn(seed); high.name = name + '_high'
    bpy.ops.object.select_all(action='DESELECT'); high.select_set(True); bpy.context.view_layer.objects.active = high; bpy.ops.object.shade_smooth()
    # 大きさをそろえる（最大半径 1）
    r = max(v.co.length for v in high.data.vertices); high.scale = (1 / r,) * 3; bpy.ops.object.transform_apply(scale=True)
    mat = bpy.data.materials.new('m'); mat.use_nodes = True; high.data.materials.append(mat)
    lod0 = lowpoly(high, name + '_LOD0', t0n); lod1 = lowpoly(high, name + '_LOD1', t1n); lod2 = lowpoly(high, name + '_LOD2', t2n)
    for lo in (lod0, lod1, lod2):
        lo.data.materials.clear(); m2 = bpy.data.materials.new(lo.name); m2.use_nodes = True; lo.data.materials.append(m2)
        cube_uv(lo)
    # LOD0 に高解像度の形から法線と AO を焼く。LOD1 は同じ焼き方で別の画像（小さめ）
    for lo, size, tag in ((lod0, SIZE, ''), (lod1, SIZE // 2, '_lod1'), (lod2, SIZE // 4, '_lod2')):
        nrm = bake(lo, 'NORMAL', size, samples=1, highpoly=high, cage=0.06 if lo is not lod2 else 0.2)
        # AO は、その形だけを残して焼く。同じ場所に重なっている高解像度の形と他の LOD が写り込むと、黒い斑と割れ目のような線になる（2026-11-23 に見つけた不具合）
        others = [o for o in (high, lod0, lod1, lod2) if o is not lo]
        for o in others: o.hide_render = True
        ao = bake(lo, 'AO', size, samples=32)
        for o in others: o.hide_render = False
        n = np.array(nrm.pixels[:], dtype=np.float32).reshape(size, size, 4); a = np.array(ao.pixels[:], dtype=np.float32).reshape(size, size, 4)
        out = np.ones((size, size, 4), dtype=np.float32); out[..., 0] = n[..., 0]; out[..., 1] = n[..., 1]; out[..., 2] = a[..., 0]
        img = bpy.data.images.new('na', size, size, alpha=False); img.colorspace_settings.name = 'Non-Color'
        img.pixels = out.ravel().tolist(); save_image(img, os.path.join(GOUT, f'{name}{tag}_na.png'))
    export_glb(os.path.join(GOUT, name + '.glb'), [lod0, lod1, lod2], draco=False, tangents=True)
    if PREVIEW:
        # 確認用：高解像度の形を4方向から描く（焼き込み元の形そのもの）
        b = mat.node_tree.nodes['Principled BSDF']
        col = {'q': (0.55, 0.52, 0.47, 1), 'a': (0.16, 0.10, 0.06, 1), 'h': (0.08, 0.04, 0.02, 1), 'c': (0.42, 0.36, 0.28, 1)}[name[0]]
        b.inputs['Base Color'].default_value = col; b.inputs['Roughness'].default_value = 0.35 if name[0] == 'q' else 0.8
        lod0.hide_render = True; lod1.hide_render = True; lod2.hide_render = True
        from common import PREVIEW as PV
        render_views([high], os.path.join(PV, 'grain_' + name), size=320, samples=12)
    print(f'[grain] {name} high={len(high.data.polygons)} lod0={len(lod0.data.polygons)} lod1={len(lod1.data.polygons)} {time.time()-t:.1f}s')
