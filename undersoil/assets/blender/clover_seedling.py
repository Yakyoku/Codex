"""シロツメクサ（Trifolium repens）の種と芽生え。
- seed: 吸水した種（地下の場面で「山」として見える）。高解像度の形 → ローポリへ法線と AO を焼く。
- seedling: 発芽の各段階を同じ頂点の並びで作り、シェイプキーにする（実行時になめらかにつなぐ）。
  S0 種の中 → S1 幼根が出る → S2 胚軸がかぎ形に曲がって土を押す → S3 かぎが伸びて子葉を持ち上げる → S4 子葉が開く → S5 子葉が広がる
単位は mm。寸法は Docs/REFERENCE/species/trifolium-repens.md に合わせる。
実行: python3 assets/blender/clover_seedling.py"""
import bpy, bmesh, sys, os, math, time
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'lib'))
from common import *
from mathutils import Vector, Matrix

# ---- 寸法（mm）。形の仕様書の値をここに写す ----
SEED_L, SEED_W, SEED_T = 1.2, 1.1, 0.7     # 種：長さ・幅・厚み
HYP_R = 0.20                                  # 胚軸の半径
ROOT_R = 0.17                                 # 幼根の半径（根元）
COT_L, COT_W, COT_T = 4.0, 2.1, 0.3          # 開ききった子葉：長さ・幅・厚み
PET_L = 1.2                                   # 子葉の柄
STAGES = [  # name, 幼根の長さ, 胚軸の長さ, かぎの曲がり(0..1), 子葉の大きさ(0..1), 開き(0..1), 柄(0..1)
    ('S0_seed',   0.05, 0.05, 0.0, 0.22, 0.0, 0.05),
    ('S1_radicle', 2.2, 0.5, 0.0, 0.24, 0.0, 0.05),
    ('S2_hook',    5.0, 6.6, 1.0, 0.28, 0.0, 0.1),
    ('S3_lift',    9.0, 8.5, 0.25, 0.42, 0.06, 0.3),
    ('S4_open',   13.0, 10.5, 0.0, 0.72, 0.85, 0.7),
    ('S5_spread', 18.0, 12.0, 0.0, 1.0, 1.0, 1.0),
]
AX_N, AX_SIDES = 44, 10        # 軸（根＋胚軸）の輪の数と、輪の頂点数
ROOT_N = 18                    # そのうち根に使う輪の数
CU, CV = 12, 20                 # 子葉の格子

def smooth01(a, b, x):
    t = max(0.0, min(1.0, (x - a) / (b - a))); return t * t * (3 - 2 * t)

def build(root_len, hyp_len, hook, cot_s, opening, pet):
    """1段階ぶんの頂点座標を返す（並びは常に同じ）。原点＝種の位置。+Z が上。"""
    V = []
    # 軸：根の先 → 種 → 胚軸の先
    pts, frames, radii = [], [], []
    for i in range(ROOT_N):  # 根（下へ。わずかにうねる）
        s = 1 - i / (ROOT_N - 1)          # 1=先端, 0=種
        z = -root_len * s
        pts.append(Vector((0.18 * math.sin(s * 5.0) * min(1, root_len / 4), 0.12 * math.sin(s * 3.3 + 1) * min(1, root_len / 4), z)))
        radii.append((ROOT_R * (0.25 + 0.75 * (1 - s) ** 0.6) + (HYP_R - ROOT_R) * max(0, 1 - s * 6)) * (0.5 + 0.5 * min(1, root_len / 2)))
    n_h = AX_N - ROOT_N
    p = Vector((0, 0, 0)); ang = 0.0; seg = hyp_len / (n_h - 1)
    for i in range(n_h):  # 胚軸（上へ。先のほうが、かぎ形に曲がる）
        s = i / (n_h - 1)
        if i > 0:
            ang = hook * math.radians(175) * smooth01(0.55, 1.0, s)
            p = p + Vector((math.sin(ang), 0, math.cos(ang))) * seg
        pts.append(p.copy()); radii.append(HYP_R * (1.0 - 0.18 * s) * (0.55 + 0.45 * min(1, hyp_len / 3)))
    for i, c in enumerate(pts):
        t = (pts[min(i + 1, len(pts) - 1)] - pts[max(i - 1, 0)]).normalized()
        if t.length < 1e-6: t = Vector((0, 0, 1))
        bx = Vector((0, 1, 0)); nx = bx.cross(t).normalized(); by = t.cross(nx)
        frames.append((t, nx, by))
        for k in range(AX_SIDES):
            a = 2 * math.pi * k / AX_SIDES
            V.append(c + (nx * math.cos(a) + by * math.sin(a)) * radii[i])
    V.append(pts[0] - Vector((0, 0, radii[0])))            # 根の先のふた
    tip, (td, tn, tb) = pts[-1], frames[-1]
    V.append(tip + td * radii[-1] * 0.6)                    # 胚軸の先のふた（子葉の付け根＝節）
    # 子葉 2枚：節から、軸の向き td に対して ±（開き × 80°）で倒れる。閉じているときは、面を合わせて重なる
    for side in (1, -1):
        tilt = math.radians(4 + 80 * opening) * side
        d = (td * math.cos(tilt) + tn * math.sin(tilt)).normalized()       # 子葉の伸びる向き
        up = (tn * math.cos(tilt) - td * math.sin(tilt)).normalized() * side  # 子葉の表（向かい合う側）
        w = tb
        L = COT_L * cot_s; W2 = COT_W * cot_s * 0.5; T2 = COT_T * (0.6 + 0.4 * cot_s) * 0.5; PL = PET_L * pet
        base = tip + up * (0.02 + T2 * 1.05) * (1 - opening) * side * 0 + d * 0.0
        for layer in (1, -1):               # 表の面、裏の面
            for j in range(CV + 1):
                v = j / CV
                for i in range(CU + 1):
                    u = i / CU * 2 - 1
                    # 輪郭：柄の細い部分から、卵形の葉身へ
                    along = PL * smooth01(0, 0.18, v) + L * smooth01(0.1, 1.0, v) * (v ** 0.9)
                    blade = smooth01(0.12, 0.3, v)
                    xb = max(0.0, min(1.0, (v - 0.13) / 0.87))                 # 葉身の中での位置
                    half = 0.06 + (W2 - 0.06) * blade * max(0.0, 1 - (2 * xb - 1) ** 2) ** 0.42   # 長円形で、先は丸い
                    edge = math.sqrt(max(0.0, 1 - u * u))                 # ふちに向かって薄くなる（レンズ形）
                    cup = -0.10 * W2 * (u * u) * blade * opening             # 開くと、わずかに舟形に反る
                    th = T2 * (0.25 + 0.75 * edge) * (0.5 + 0.5 * blade)
                    closed_gap = (T2 * 1.02) * (1 - opening)                  # 閉じているとき、2枚が合わさる
                    pos = base + d * along + w * (u * half) + up * (cup + layer * th + closed_gap * 0.0)
                    pos = pos + up * (-closed_gap * 0 + 0)                    
                    V.append(pos + (up * side) * (T2 * (1 - opening)) * 0 )
    return V

def faces():
    F = []
    for i in range(AX_N - 1):
        for k in range(AX_SIDES):
            a = i * AX_SIDES + k; b = i * AX_SIDES + (k + 1) % AX_SIDES
            F.append((a, b, b + AX_SIDES, a + AX_SIDES))
    cap0 = AX_N * AX_SIDES; cap1 = cap0 + 1
    for k in range(AX_SIDES):
        F.append((cap0, (k + 1) % AX_SIDES, k))
        o = (AX_N - 1) * AX_SIDES; F.append((cap1, o + k, o + (k + 1) % AX_SIDES))
    base = cap1 + 1; per = (CU + 1) * (CV + 1)
    for c in range(2):
        top = base + c * 2 * per; bot = top + per
        for j in range(CV):
            for i in range(CU):
                a = j * (CU + 1) + i
                F.append((top + a, top + a + 1, top + a + CU + 2, top + a + CU + 1))
                F.append((bot + a + 1, bot + a, bot + a + CU + 1, bot + a + CU + 2))
        rim = [(0, i) for i in range(CU + 1)] + [(j, CU) for j in range(1, CV + 1)] + [(CV, i) for i in range(CU - 1, -1, -1)] + [(j, 0) for j in range(CV - 1, 0, -1)]
        for r in range(len(rim)):
            (j0, i0), (j1, i1) = rim[r], rim[(r + 1) % len(rim)]
            a = j0 * (CU + 1) + i0; b = j1 * (CU + 1) + i1
            F.append((top + b, top + a, bot + a, bot + b))
    return F

def make_seedling():
    reset()
    coords = [build(*s[1:]) for s in STAGES]
    me = bpy.data.meshes.new('seedling'); me.from_pydata([tuple(v) for v in coords[-1]], [], faces()); me.update()
    ob = bpy.data.objects.new('clover_seedling', me); bpy.context.scene.collection.objects.link(ob)
    bpy.context.view_layer.objects.active = ob; ob.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode='OBJECT')
    bpy.ops.object.shade_smooth()
    # 頂点色：R=子葉（緑になる部分）、G=根（地下。白いまま）、B=子葉の中での根元→先（0..1）
    col = me.color_attributes.new('Color', 'FLOAT_COLOR', 'POINT')
    n_ax = AX_N * AX_SIDES + 2; per = (CU + 1) * (CV + 1)
    for i in range(len(me.vertices)):
        if i < ROOT_N * AX_SIDES or i == AX_N * AX_SIDES: col.data[i].color = (0, 1, 0, 1)
        elif i < n_ax: col.data[i].color = (0, 0, (i // AX_SIDES - ROOT_N) / (AX_N - ROOT_N), 1)
        else:
            k = (i - n_ax) % per; col.data[i].color = (1, 0, (k // (CU + 1)) / CV, 1)
    # UV：子葉は格子そのまま（葉脈をシェーダーで描くため）。軸は (角度, 長さ)
    uvl = me.uv_layers.new(name='UVMap')
    for poly in me.polygons:
        for li in poly.loop_indices:
            vi = me.loops[li].vertex_index
            if vi < AX_N * AX_SIDES: uvl.data[li].uv = ((vi % AX_SIDES) / AX_SIDES * 0.2, (vi // AX_SIDES) / (AX_N - 1))
            elif vi < n_ax: uvl.data[li].uv = (0.1, 0.0 if vi == AX_N * AX_SIDES else 1.0)
            else:
                k = (vi - n_ax) % per; uvl.data[li].uv = (0.25 + 0.75 * (k % (CU + 1)) / CU, (k // (CU + 1)) / CV)
    ob.shape_key_add(name='Basis')
    for (name, *_), cs in zip(STAGES[:-1], coords[:-1]):
        sk = ob.shape_key_add(name=name)
        for i, v in enumerate(cs): sk.data[i].co = v
    return ob, coords

ob, coords = make_seedling()
os.makedirs(os.path.join(OUT, 'plants'), exist_ok=True)
bpy.ops.object.select_all(action='DESELECT'); ob.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, 'plants', 'clover_seedling.glb'), export_format='GLB', use_selection=True, export_yup=True,
    export_morph=True, export_morph_normal=True, export_apply=False, export_vertex_color='ACTIVE', export_all_vertex_colors=True, export_active_vertex_color_when_no_material=True, export_materials='NONE')
print('[seedling] verts', len(ob.data.vertices), 'faces', len(ob.data.polygons), 'kb', os.path.getsize(os.path.join(OUT, 'plants', 'clover_seedling.glb')) // 1024)
# 確認用：各段階を横から描く
mat = bpy.data.materials.new('g'); mat.use_nodes = True; mat.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (0.25, 0.5, 0.12, 1); ob.data.materials.append(mat)
for i, (name, *_ ) in enumerate(STAGES):
    for k in ob.data.shape_keys.key_blocks[1:]: k.value = 0
    if i < len(STAGES) - 1: ob.data.shape_keys.key_blocks[name].value = 1
    sc = bpy.context.scene; sc.render.resolution_x = 300; sc.render.resolution_y = 560; sc.cycles.samples = 12; sc.cycles.use_denoising = True
    if not sc.world: sc.world = bpy.data.worlds.new('w'); sc.world.use_nodes = True; sc.world.node_tree.nodes['Background'].inputs[0].default_value = (0.35, 0.38, 0.42, 1)
    if 'cam' not in bpy.data.objects:
        cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam; cam.data.type = 'ORTHO'; cam.data.ortho_scale = 36
        cam.location = (4, -40, -3); cam.rotation_euler = (math.radians(90), 0, math.radians(5.7))
        sun = bpy.data.objects.new('sun', bpy.data.lights.new('sun', 'SUN')); sc.collection.objects.link(sun); sun.data.energy = 3; sun.rotation_euler = (0.9, 0.2, 0.5)
    sc.render.filepath = os.path.join(PREVIEW, f'seedling_{i}.png'); bpy.ops.render.render(write_still=True)
# 確認用：子葉を斜め上から寄って描く（S5 と S2）
cam = bpy.data.objects['cam']; cam.data.ortho_scale = 10; sc = bpy.context.scene; sc.render.resolution_x = 480; sc.render.resolution_y = 400
for name, target in (('S5', (0, 0, 12)), ('S2', (1.2, 0, 3.4))):
    for k in ob.data.shape_keys.key_blocks[1:]: k.value = 1 if (name == 'S2' and k.name == 'S2_hook') else 0
    t = Vector(target); cam.location = t + Vector((9, -22, 14)); cam.rotation_euler = (t - cam.location).to_track_quat('-Z', 'Y').to_euler()
    sc.render.filepath = os.path.join(PREVIEW, f'seedling_close_{name}.png'); bpy.ops.render.render(write_still=True)
