"""シロツメクサ（Trifolium repens）の芽生え。発芽の各段階を同じ頂点の並びで作り、シェイプキーにする（実行時になめらかにつなぐ）。
形は Docs/REFERENCE/species/trifolium-repens.md と、実物の写真4点（build-cache/ref/trifolium-repens/）に合わせる：
  - 子葉は、豆のようにふっくら厚い長だ円形。縁は丸い。短い柄。開くと少し上向きで、左右の角度は同じではない
  - 胚軸の地上部は短い（2〜4 mm）。子葉は地面のすぐ上に開く
  - 最初の本葉は、小葉が1枚だけの丸い葉。中央の葉脈で浅く折れ、細い葉柄の先に付く
物体は2つ：
  clover_seedling … 根＋胚軸＋子葉2枚。キー：S0_seed → S1_radicle → S2_hook → S3_lift → S4_half → S5_open →（基本形＝開ききった姿）
  clover_leaf1    … 最初の本葉。キー：L0_none → L1_bud →（基本形＝開いた葉）
単位は mm。原点＝種の位置、+Z が上。地表は Z = SEED_DEPTH。
実行: python3 assets/blender/clover_seedling.py [--no-preview]"""
import bpy, sys, os, math
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'lib'))
from common import *
from mathutils import Vector

SEED_DEPTH = 3.0                               # 種の深さ（シロツメクサは浅くまく。3 mm は目安 △）
HYP_R, ROOT_R = 0.19, 0.16                     # 胚軸・幼根の半径（太さ 約0.3〜0.4 mm）
COT_L, COT_W, COT_T = 3.8, 2.25, 0.5           # 子葉：長さ・幅・厚み（写真の目測：長さ3〜5、幅は長さの約半分強、ふっくら厚い）
PET_L = 0.35                                    # 子葉の柄
HYP_FINAL = 3.8                                # 胚軸の最終の長さ → 地上部 約3.4 mm
RISE_A, RISE_B = 6.0, -4.0                    # 開いた子葉が水平より上を向く角度（左右で違う）
LEAF_PET, LEAF_L, LEAF_W = 5.6, 3.5, 4.3       # 最初の本葉：葉柄、葉身の長さ・幅（丸く、幅のほうが広いこともある）
STAGES = [  # name, 幼根, 胚軸, かぎ(0..1), 子葉の大きさ, 開きA, 開きB, 柄, 傾き
    ('S0_seed',    0.05, 0.05, 0.0, 0.26, 0.0, 0.0, 0.05, 0.0),
    ('S1_radicle', 2.4,  0.5,  0.0, 0.28, 0.0, 0.0, 0.05, 0.0),
    ('S2_hook',    5.5,  3.6,  1.0, 0.32, 0.0, 0.0, 0.1, 0.0),
    ('S3_lift',    9.0,  3.95,  0.3, 0.46, 0.05, 0.03, 0.3, 0.5),
    ('S4_half',   12.0,  3.85,  0.04, 0.70, 0.62, 0.34, 0.65, 0.9),
    ('S5_open',   15.0,  3.8,  0.0, 0.88, 0.95, 0.9, 0.9, 1.0),
    ('FINAL',     19.0,  3.8,  0.0, 1.0,  1.0, 1.0, 1.0, 1.0),
]
AX_N, AX_SIDES, ROOT_N = 46, 10, 18
CU, CV = 14, 24

def sm(a, b, x):
    t = max(0.0, min(1.0, (x - a) / (b - a))); return t * t * (3 - 2 * t)

def axis(root_len, hyp_len, hook, lean):
    pts, radii = [], []
    for i in range(ROOT_N):
        s = 1 - i / (ROOT_N - 1); k = min(1, root_len / 4)
        pts.append(Vector((0.22 * math.sin(s * 5.0) * k, 0.15 * math.sin(s * 3.3 + 1) * k, -root_len * s)))
        radii.append((ROOT_R * (0.2 + 0.8 * (1 - s) ** 0.55) + (HYP_R - ROOT_R) * max(0, 1 - s * 6)) * (0.5 + 0.5 * min(1, root_len / 2)))
    n_h = AX_N - ROOT_N; p = Vector((0, 0, 0)); seg = hyp_len / (n_h - 1)
    for i in range(n_h):
        s = i / (n_h - 1)
        if i > 0:
            a = hook * math.radians(172) * sm(0.5, 1.0, s) + lean * math.radians(7) * math.sin(s * math.pi * 0.9)   # かぎ＋ごくゆるい S 字
            b = lean * math.radians(5) * s
            p = p + Vector((math.sin(a) * math.cos(b), math.sin(b), math.cos(a) * math.cos(b))) * seg
        pts.append(p.copy()); radii.append(HYP_R * (1.0 - 0.22 * s) * (0.55 + 0.45 * min(1, hyp_len / 3)))
    frames = []
    for i, c in enumerate(pts):
        t = (pts[min(i + 1, len(pts) - 1)] - pts[max(i - 1, 0)])
        t = t.normalized() if t.length > 1e-6 else Vector((0, 0, 1))
        nx = Vector((0, 1, 0)).cross(t).normalized(); frames.append((t, nx, t.cross(nx)))
    return pts, radii, frames

def build(root_len, hyp_len, hook, cot_s, open_a, open_b, pet, lean):
    V = []
    pts, radii, frames = axis(root_len, hyp_len, hook, lean)
    for c, r, (t, nx, by) in zip(pts, radii, frames):
        for k in range(AX_SIDES):
            a = 2 * math.pi * k / AX_SIDES; V.append(c + (nx * math.cos(a) + by * math.sin(a)) * r)
    V.append(pts[0] - Vector((0, 0, radii[0])))
    tip, (td, tn, tb) = pts[-1], frames[-1]
    V.append(tip + td * radii[-1] * 0.7)
    for side, opening, rise in ((1, open_a, RISE_A), (-1, open_b, RISE_B)):
        tilt = math.radians(3 + (87 - rise) * opening)
        d = (td * math.cos(tilt) + tn * math.sin(tilt) * side).normalized()        # 子葉の伸びる向き
        up = (td * math.sin(tilt) - tn * math.cos(tilt) * side).normalized()       # 表（向かい合う側。開くと上を向く）
        w = tb * side
        L = COT_L * cot_s; W2 = COT_W * cot_s * 0.5; T2 = COT_T * (0.55 + 0.45 * cot_s) * 0.5; PL = PET_L * pet
        base = tip - up * (T2 * 0.95) * (1 - opening)                              # 閉じているとき、2枚の表が合わさる
        for layer in (1, -1):
            for j in range(CV + 1):
                v = j / CV; x = max(0.0, min(1.0, (v - 0.12) / 0.88)); blade = sm(0.10, 0.22, v)
                along = PL * sm(0, 0.14, v) + L * x
                oval = max(0.0, 1 - abs(2 * x - 1) ** 2.05) ** 0.5                  # 両端が丸い長だ円
                half = 0.075 + (W2 - 0.075) * blade * oval
                lenprof = max(0.0, 1 - abs(2 * x - 1) ** 4.0) ** 0.4               # 長さ方向の厚みの変化
                for i in range(CU + 1):
                    u = i / CU * 2 - 1
                    rim = max(0.0, 1 - abs(u) ** 4.0) ** 0.35                        # 縁は丸く薄くなる（豆のような断面）
                    th = 0.07 + (T2 - 0.07) * blade * rim * lenprof
                    groove = 0.16 * T2 * math.exp(-(u / 0.13) ** 2) * blade * lenprof if layer > 0 else 0.0   # 表の中央の浅い溝
                    dome = (0.85 if layer > 0 else 0.6)                              # 表はふくらみ、裏はやや平ら
                    droop = -0.05 * W2 * (u * u) * blade * opening - 0.10 * L * (x ** 2) * opening * 0.25      # 縁と先がわずかに下がる
                    V.append(base + d * along + w * (u * half) + up * (layer * th * dome - groove + droop))
    return V

def faces():
    F = []
    for i in range(AX_N - 1):
        for k in range(AX_SIDES):
            a = i * AX_SIDES + k; b = i * AX_SIDES + (k + 1) % AX_SIDES; F.append((a, b, b + AX_SIDES, a + AX_SIDES))
    cap0 = AX_N * AX_SIDES; cap1 = cap0 + 1
    for k in range(AX_SIDES):
        F.append((cap0, (k + 1) % AX_SIDES, k)); o = (AX_N - 1) * AX_SIDES; F.append((cap1, o + k, o + (k + 1) % AX_SIDES))
    base = cap1 + 1; per = (CU + 1) * (CV + 1)
    for c in range(2):
        top = base + c * 2 * per; bot = top + per
        for j in range(CV):
            for i in range(CU):
                a = j * (CU + 1) + i
                F.append((top + a, top + a + 1, top + a + CU + 2, top + a + CU + 1)); F.append((bot + a + 1, bot + a, bot + a + CU + 1, bot + a + CU + 2))
        rim = [(0, i) for i in range(CU + 1)] + [(j, CU) for j in range(1, CV + 1)] + [(CV, i) for i in range(CU - 1, -1, -1)] + [(j, 0) for j in range(CV - 1, 0, -1)]
        for r in range(len(rim)):
            (j0, i0), (j1, i1) = rim[r], rim[(r + 1) % len(rim)]
            a = j0 * (CU + 1) + i0; b = j1 * (CU + 1) + i1; F.append((top + b, top + a, bot + a, bot + b))
    return F

def finish(ob):
    bpy.context.view_layer.objects.active = ob; bpy.ops.object.select_all(action='DESELECT'); ob.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode='OBJECT')
    bpy.ops.object.shade_smooth()

def make_seedling():
    coords = [build(*s[1:]) for s in STAGES]
    me = bpy.data.meshes.new('seedling'); me.from_pydata([tuple(v) for v in coords[-1]], [], faces()); me.update()
    ob = bpy.data.objects.new('clover_seedling', me); bpy.context.scene.collection.objects.link(ob); finish(ob)
    # 頂点色：R=子葉、G=根、B=子葉では表(1)/裏(0)、胚軸では根元(0)→先(1)。A=子葉の中での位置（根元0→先1）
    col = me.color_attributes.new('Color', 'FLOAT_COLOR', 'POINT')
    n_ax = AX_N * AX_SIDES + 2; per = (CU + 1) * (CV + 1)
    for i in range(len(me.vertices)):
        if i < ROOT_N * AX_SIDES or i == AX_N * AX_SIDES: col.data[i].color = (0, 1, 0, 0)
        elif i < n_ax: col.data[i].color = (0, 0, (min(i, AX_N * AX_SIDES - 1) // AX_SIDES - ROOT_N) / (AX_N - ROOT_N - 1), 0)
        else:
            k = (i - n_ax); layer_top = ((k // per) % 2 == 0); kk = k % per
            col.data[i].color = (1, 0, 1.0 if layer_top else 0.0, (kk // (CU + 1)) / CV)
    uvl = me.uv_layers.new(name='UVMap')   # 子葉：u=幅(0..1)、v=長さ(0..1)。軸：u=まわり、v=長さ
    for poly in me.polygons:
        for li in poly.loop_indices:
            vi = me.loops[li].vertex_index
            if vi < AX_N * AX_SIDES: uvl.data[li].uv = ((vi % AX_SIDES) / AX_SIDES, (vi // AX_SIDES) / (AX_N - 1))
            elif vi < n_ax: uvl.data[li].uv = (0.5, 0.0 if vi == AX_N * AX_SIDES else 1.0)
            else:
                kk = (vi - n_ax) % per; uvl.data[li].uv = ((kk % (CU + 1)) / CU, (kk // (CU + 1)) / CV)
    ob.shape_key_add(name='Basis')
    for (name, *_), cs in zip(STAGES[:-1], coords[:-1]):
        sk = ob.shape_key_add(name=name)
        for i, v in enumerate(cs): sk.data[i].co = v
    return ob

# ---- 最初の本葉 ----
LU, LV, LP, LSIDES = 16, 18, 10, 6
def build_leaf(grow, unfold):
    """grow: 0=まだない、1=伸びきった。unfold: 0=中央の葉脈で二つ折り、1=開いた（浅い折れ目は残る）"""
    pts, _, frames = axis(1, HYP_FINAL, 0.0, 1.0); node, (td, tn, tb) = pts[-1], frames[-1]
    V = []
    pl = LEAF_PET * grow; lean = math.radians(16) * grow
    pd = (td * math.cos(lean) + tb * math.sin(lean)).normalized()                # 葉柄は、2枚の子葉の間から、少し傾いて立つ
    sx = pd.cross(tn).normalized();
    for i in range(LP + 1):
        s = i / LP; c = node + pd * (pl * s) + tb * (pl * 0.16 * math.sin(s * math.pi * 0.5) ** 2) - td * (pl * 0.10 * s * s)
        r = 0.085 * (1 - 0.3 * s) * (0.3 + 0.7 * grow)
        for k in range(LSIDES):
            a = 2 * math.pi * k / LSIDES; V.append(c + (tn * math.cos(a) + sx * math.sin(a)) * r)
    top = node + pd * pl + tb * (pl * 0.16) - td * (pl * 0.10)
    Ls = LEAF_L * (0.12 + 0.88 * grow) * (0.35 + 0.65 * unfold); Ws = LEAF_W * 0.5 * (0.12 + 0.88 * grow) * (0.4 + 0.6 * unfold)
    tiltb = math.radians(20 + 52 * unfold) * grow                                # 葉身は葉柄の先で外へ倒れ、表が斜め上を向く
    bd = (pd * math.cos(tiltb) + tb * math.sin(tiltb)).normalized(); bn = (pd * math.sin(tiltb) - tb * math.cos(tiltb)).normalized()   # 葉の表の向き。両側は、中央の葉脈から上へ浅く持ち上がる（V 字）
    fold = math.radians(86 - 58 * unfold)                                        # 片側の持ち上がり角（閉じ 86° → 開き 16°）
    for j in range(LV + 1):
        x = j / LV
        outline = (max(0.0, 1 - abs(2 * x - 1) ** 1.8) ** 0.5) * (0.9 + 0.2 * (1 - x))   # 腎臓形（幅が長さより広い）
        notch = 0.10 * Ls
        for i in range(LU + 1):
            u = i / LU * 2 - 1
            a_long = Ls * x - notch * (1 - abs(u)) ** 2 * (1 - x) ** 3 * 4 * 0 + notch * (abs(u) ** 1.5) * (1 - x) ** 2 * 1.2 * -1  # つけ根はまっすぐ〜浅いハート形
            lat = u * Ws * outline
            a_long -= Ls * 0.10 * (1 - abs(u)) ** 3 * x ** 6               # 先の中央が浅くくぼむ
            V.append(top + bd * a_long + tn * (lat * math.cos(fold)) + bn * (abs(lat) * math.sin(fold) + 0.03 * math.sin(x * 9 + u * 4) * grow))
    return V

def leaf_faces():
    F = []
    for i in range(LP):
        for k in range(LSIDES):
            a = i * LSIDES + k; b = i * LSIDES + (k + 1) % LSIDES; F.append((a, b, b + LSIDES, a + LSIDES))
    o = (LP + 1) * LSIDES
    for j in range(LV):
        for i in range(LU):
            a = o + j * (LU + 1) + i; F.append((a, a + 1, a + LU + 2, a + LU + 1))
    return F

def make_leaf():
    final = build_leaf(1, 1)
    me = bpy.data.meshes.new('leaf1'); me.from_pydata([tuple(v) for v in final], [], leaf_faces()); me.update()
    ob = bpy.data.objects.new('clover_leaf1', me); bpy.context.scene.collection.objects.link(ob); finish(ob)
    col = me.color_attributes.new('Color', 'FLOAT_COLOR', 'POINT'); o = (LP + 1) * LSIDES   # R=葉身(1)/葉柄(0)、G=中央の葉脈からの距離、B=長さ方向
    for i in range(len(me.vertices)):
        if i < o: col.data[i].color = (0, 0, (i // LSIDES) / LP, 1)
        else: k = i - o; col.data[i].color = (1, abs((k % (LU + 1)) / LU * 2 - 1), (k // (LU + 1)) / LV, 1)
    uvl = me.uv_layers.new(name='UVMap')
    for poly in me.polygons:
        for li in poly.loop_indices:
            vi = me.loops[li].vertex_index
            if vi < o: uvl.data[li].uv = ((vi % LSIDES) / LSIDES, (vi // LSIDES) / LP)
            else: k = vi - o; uvl.data[li].uv = ((k % (LU + 1)) / LU, (k // (LU + 1)) / LV)
    ob.shape_key_add(name='Basis')
    for name, g, un in (('L0_none', 0.0, 0.0), ('L1_bud', 0.3, 0.0), ('L2_rise', 0.75, 0.25)):
        sk = ob.shape_key_add(name=name)
        for i, v in enumerate(build_leaf(g, un)): sk.data[i].co = v
    return ob

reset()
ob = make_seedling(); leaf = make_leaf()
os.makedirs(os.path.join(OUT, 'plants'), exist_ok=True)
bpy.ops.object.select_all(action='DESELECT'); ob.select_set(True); leaf.select_set(True)
path = os.path.join(OUT, 'plants', 'clover_seedling.glb')
bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, export_yup=True, export_morph=True, export_morph_normal=True, export_apply=False,
    export_vertex_color='ACTIVE', export_all_vertex_colors=True, export_active_vertex_color_when_no_material=True, export_materials='NONE')
print('[seedling] verts', len(ob.data.vertices), '+', len(leaf.data.vertices), 'kb', os.path.getsize(path) // 1024)

if '--no-preview' not in sys.argv:
    def mat(name, c, rough=0.45, sss=0.35):
        m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
        b.inputs['Base Color'].default_value = (*c, 1); b.inputs['Roughness'].default_value = rough
        try: b.inputs['Subsurface Weight'].default_value = sss; b.inputs['Subsurface Radius'].default_value = (0.4, 0.8, 0.2); b.inputs['Subsurface Scale'].default_value = 0.6
        except Exception: pass
        return m
    ob.data.materials.append(mat('cot', (0.19, 0.50, 0.065))); leaf.data.materials.append(mat('leaf', (0.10, 0.30, 0.10), 0.7))
    bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, SEED_DEPTH)); g = bpy.context.object; g.data.materials.append(mat('soil', (0.09, 0.06, 0.04), 0.95, 0))
    sc = bpy.context.scene; sc.cycles.samples = 24; sc.cycles.use_denoising = True
    sc.world = bpy.data.worlds.new('w'); sc.world.use_nodes = True; sc.world.node_tree.nodes['Background'].inputs[0].default_value = (0.5, 0.55, 0.62, 1)
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam; cam.data.lens = 70
    sun = bpy.data.objects.new('sun', bpy.data.lights.new('sun', 'SUN')); sc.collection.objects.link(sun); sun.data.energy = 4; sun.data.angle = 0.2; sun.rotation_euler = (math.radians(55), 0, math.radians(120))
    def setkeys(o, name):
        for k in o.data.shape_keys.key_blocks[1:]: k.value = 1 if k.name == name else 0
    def shot(tag, target, off, w=480, h=400):
        t = Vector(target); cam.location = t + Vector(off); cam.rotation_euler = (t - cam.location).to_track_quat('-Z', 'Y').to_euler()
        sc.render.resolution_x = w; sc.render.resolution_y = h; sc.render.filepath = os.path.join(PREVIEW, f'seedling_{tag}.png'); bpy.ops.render.render(write_still=True)
    top = (0, 0, HYP_FINAL)
    for name, lk in (('S2_hook', 'L0_none'), ('S3_lift', 'L0_none'), ('S4_half', 'L0_none'), ('S5_open', 'L0_none'), ('FINAL', 'L1_bud'), ('FINAL', None)):
        setkeys(ob, name); setkeys(leaf, lk)
        tag = name + ('_leaf' if lk is None else '')
        shot('q_' + tag, (0, 0, 5.2), (10, -15, 10))        # 斜め上から
    setkeys(ob, 'FINAL'); setkeys(leaf, None)
    shot('top_FINAL', top, (0.5, -0.5, 26))                  # 真上から（写真 kz01 と同じ向き）
    shot('side_FINAL', (0, 0, 5), (0, -24, 3.5))             # ほぼ真横から
    setkeys(leaf, 'L0_none'); shot('close_cot', top, (5, -7, 4.5), 560, 420)   # 子葉の寄り（厚みと縁の丸み）
