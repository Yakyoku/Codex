# 金剛力士を Blender で作る：CC0 の人体（Blender Human Base Meshes）を土台に、T字の基本姿勢へ → 筋肉を盛る → 顔 → 衣装 → 色 → 骨 → 書き出し
import bpy, bmesh, math, sys, json, struct, os
from mathutils import Vector, Matrix, kdtree

ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
KIND = ARGS[0] if ARGS else 'a'          # 'a'=阿形 'un'=吽形
OUT = ARGS[1] if len(ARGS) > 1 else '/tmp/nio.bin'
PREVIEW = ARGS[2] if len(ARGS) > 2 else ''
STAGE = int(ARGS[3]) if len(ARGS) > 3 else 99
H = 2.0

def sm(t): t = max(0.0, min(1.0, t)); return t * t * (3 - 2 * t)
def gauss(d, r): return math.exp(-(d / r) ** 2)

# ── 1. 土台の人体 ──
body = bpy.data.objects['GEO-body_male_realistic']
eyes = [bpy.data.objects['GEO-body_male_realistic.eye.L'], bpy.data.objects['GEO-body_male_realistic.eye.R']]
keep = set([body] + eyes)
for ob in list(bpy.data.objects):
    if ob not in keep: bpy.data.objects.remove(ob, do_unlink=True)
for ob in keep:
    ob.animation_data_clear()
    for m in list(ob.modifiers):
        if m.type != 'MULTIRES': ob.modifiers.remove(m)
bpy.context.view_layer.objects.active = body
for ob in bpy.context.view_layer.objects: ob.select_set(False)
body.select_set(True)
mr = [m for m in body.modifiers if m.type == 'MULTIRES'][0]
mr.levels = 2
bpy.ops.object.modifier_apply(modifier=mr.name)
# 目は体の子：ワールド座標で固定してから親を外す
for e in eyes:
    mw = e.matrix_world.copy(); e.parent = None; e.matrix_world = mw
# 原点へ・高さ H へ
zmin = min((body.matrix_world @ v.co).z for v in body.data.vertices)
zmax = max((body.matrix_world @ v.co).z for v in body.data.vertices)
cx = body.matrix_world.translation.x
S = H / (zmax - zmin)
for ob in [body] + eyes:
    mw = ob.matrix_world.copy()
    t = Matrix.Translation((-cx, 0, -zmin))
    ob.matrix_world = Matrix.Scale(S, 4) @ t @ mw
    bpy.context.view_layer.update()
    me = ob.data
    me.transform(ob.matrix_world); ob.matrix_world = Matrix.Identity(4)
print('verts after multires', len(body.data.vertices))

# 減らす（ゲーム用に約 6 万面）
dec = body.modifiers.new('dec', 'DECIMATE'); dec.ratio = 60000 / max(1, len(body.data.polygons) * 2)
bpy.context.view_layer.objects.active = body; bpy.ops.object.modifier_apply(modifier='dec')
print('verts after decimate', len(body.data.vertices))

V = body.data.vertices
def P(): return [v.co.copy() for v in V]

# ── 2. 関節の推定（A字の姿勢） ──
def slice_center(z, xr=None, dz=0.02):
    pts = [v.co for v in V if abs(v.co.z - z) < dz and (xr is None or xr[0] <= v.co.x <= xr[1])]
    if not pts: return None
    c = Vector((0, 0, 0))
    for p in pts: c += p
    return c / len(pts)
tipL = max(V, key=lambda v: v.co.x).co.copy()                 # 左手の指先（+X が本人の左）
shL = Vector((0.105 * H, 0, 0.815 * H)); c = slice_center(0.80 * H, (0.06 * H, 0.14 * H)); shL.y = c.y if c else 0
armDir = (tipL - shL).normalized(); L = (tipL - shL).length
print('arm dir', tuple(round(x, 3) for x in armDir), 'len', round(L, 3))

# ── 3. 腕を水平に（T字）：Blender の骨と自動の重み（ボーンヒート）で回す ──
def tposeArms():
    global shL
    tips = {1: max(V, key=lambda v: v.co.x).co.copy(), -1: min(V, key=lambda v: v.co.x).co.copy()}
    ad = bpy.data.armatures.new('pose'); rig = bpy.data.objects.new('pose', ad); bpy.context.scene.collection.objects.link(rig)
    for ob in bpy.context.view_layer.objects: ob.select_set(False)
    bpy.context.view_layer.objects.active = rig; rig.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    eb = ad.edit_bones
    root = eb.new('root'); root.head = (0, 0, 0.5 * H); root.tail = (0, 0, 0.75 * H)
    chest = eb.new('chest'); chest.head = root.tail; chest.tail = (0, 0, 0.86 * H); chest.parent = root
    neck = eb.new('neck'); neck.head = chest.tail; neck.tail = (0, 0, 0.98 * H); neck.parent = chest
    legs = []
    for side, nm in ((1, 'L'), (-1, 'R')):
        th = eb.new('th' + nm); th.head = (side * 0.05 * H, 0, 0.5 * H); th.tail = (side * 0.05 * H, 0, 0.27 * H); th.parent = root
        sh_ = eb.new('sh' + nm); sh_.head = th.tail; sh_.tail = (side * 0.05 * H, 0, 0.04 * H); sh_.parent = th
        sh = Vector((side * shL.x, shL.y, shL.z)); tip = tips[side]
        cl = eb.new('cl' + nm); cl.head = (side * 0.02 * H, shL.y, shL.z); cl.tail = sh; cl.parent = chest
        el = sh + (tip - sh) * 0.43; wr = sh + (tip - sh) * 0.79
        ua = eb.new('ua' + nm); ua.head = sh; ua.tail = el; ua.parent = cl
        fa = eb.new('fa' + nm); fa.head = el; fa.tail = wr; fa.parent = ua
        hd = eb.new('hd' + nm); hd.head = wr; hd.tail = tip; hd.parent = fa
    bpy.ops.object.mode_set(mode='OBJECT')
    for ob in bpy.context.view_layer.objects: ob.select_set(False)
    body.select_set(True); rig.select_set(True); bpy.context.view_layer.objects.active = rig
    bpy.ops.object.parent_set(type='ARMATURE_AUTO')
    bpy.ops.object.mode_set(mode='POSE')
    for side, nm in ((1, 'L'), (-1, 'R')):
        tgt = Vector((side, 0, 0))
        for bn in ('ua', 'fa', 'hd'):
            pb = rig.pose.bones[bn + nm]; bone = pb.bone
            bpy.context.view_layer.update()
            cur = (pb.tail - pb.head).normalized()            # いまの向き（親の回転を含む）
            qw = cur.rotation_difference(tgt)
            # 骨の空間へ：回転は親の向きに対して与える
            pm = pb.matrix.to_3x3()
            local = pm.inverted() @ qw.to_matrix() @ pm
            pb.rotation_mode = 'QUATERNION'
            pb.rotation_quaternion = (pb.rotation_quaternion.to_matrix() @ local).to_quaternion()
    bpy.ops.object.mode_set(mode='OBJECT')
    bpy.context.view_layer.update()
    for ob in bpy.context.view_layer.objects: ob.select_set(False)
    bpy.context.view_layer.objects.active = body; body.select_set(True)
    mod = [m for m in body.modifiers if m.type == 'ARMATURE'][0]
    bpy.ops.object.modifier_apply(modifier=mod.name)
    mw = body.matrix_world.copy(); body.parent = None; body.matrix_world = mw
    body.vertex_groups.clear()
    bpy.data.objects.remove(rig, do_unlink=True)
tposeArms()
tipL = max(V, key=lambda v: v.co.x).co.copy()
print('tip after T', tuple(round(x, 3) for x in tipL))

if STAGE >= 2:
    # ── 4. 筋肉を盛る：肩幅を広げ、各部を法線方向へふくらませる ──
    body.data.update(); body.data.calc_normals_split() if hasattr(body.data, 'calc_normals_split') else None
    N = [v.normal.copy() for v in V]
    def blobs(side):
        s = side
        return [  # (中心, 半径, 量)
            (Vector((s * 0.075, -0.115, 1.47)), 0.11, 0.035),   # 胸筋
            (Vector((s * 0.2, -0.01, 1.6)), 0.09, 0.04),       # 三角筋
            (Vector((s * 0.1, 0.06, 1.62)), 0.1, 0.03),        # 僧帽筋
            (Vector((s * 0.15, 0.06, 1.38)), 0.13, 0.03),      # 広背筋
            (Vector((s * 0.36, -0.03, 1.63)), 0.08, 0.032),    # 二頭筋
            (Vector((s * 0.34, 0.03, 1.62)), 0.08, 0.03),      # 三頭筋
            (Vector((s * 0.55, -0.01, 1.63)), 0.08, 0.022),    # 前腕
            (Vector((s * 0.1, -0.06, 0.86)), 0.15, 0.045),     # 大腿四頭筋
            (Vector((s * 0.12, 0.02, 0.98)), 0.13, 0.03),      # 腰回り
            (Vector((s * 0.1, 0.05, 0.42)), 0.09, 0.032),      # ふくらはぎ
            (Vector((s * 0.13, -0.02, 0.62)), 0.07, 0.015),    # 膝まわり
            (Vector((s * 0.045, 0.01, 1.74)), 0.06, 0.03),     # 首（太く）
            (Vector((s * 0.065, 0.03, 1.69)), 0.06, 0.025),    # 首の付け根
        ]
    B = blobs(1) + blobs(-1)
    for i, v in enumerate(V):
        p = v.co; d = 0.0
        for c, r, a in B: d += a * gauss((p - c).length, r)
        # 腹筋の段（格子状に）
        if -0.16 < p.y < -0.05 and 1.15 < p.z < 1.42 and abs(p.x) < 0.11:
            d += 0.006 * (0.5 + 0.5 * math.cos((p.z - 1.15) / 0.09 * 2 * math.pi)) * (0.6 + 0.4 * math.cos(p.x / 0.11 * math.pi))
        v.co = p + N[i] * d
    # 肩幅と胸を広げる（胴の上半分を左右へ）
    for v in V:
        p = v.co
        k = sm((p.z - 1.2) / 0.25) * (1 - sm((p.z - 1.75) / 0.1))
        if abs(p.x) < 0.3: v.co.x = p.x * (1 + 0.12 * k)
        elif k > 0: v.co.x = p.x + math.copysign(0.3 * 0.12 * k, p.x)
    body.data.update()


# ── 5. 顔：忿怒の相（眉を寄せて下げる・小鼻を張る・阿は口を開き、吽は口角を下げる） ──
def centroid(ob):
    c = Vector((0, 0, 0))
    for v in ob.data.vertices: c += v.co
    return c / len(ob.data.vertices)
eL, eR = centroid(eyes[0]), centroid(eyes[1])
if eL.x < eR.x: eL, eR = eR, eL
eC = (eL + eR) / 2
# 顔の正中の横顔から、鼻先・口・顎の高さを求める
prof = sorted([(v.co.z, v.co.y) for v in V if abs(v.co.x) < 0.006 and eC.z - 0.2 < v.co.z < eC.z + 0.02 and v.co.y < eC.y + 0.02])
def front_at(z): 
    ys = [y for zz, y in prof if abs(zz - z) < 0.004]
    return min(ys) if ys else None
zs = [eC.z - i * 0.002 for i in range(0, 100)]
fy = [(z, front_at(z)) for z in zs]; fy = [(z, y) for z, y in fy if y is not None]
noseZ, noseY = min(fy, key=lambda t: t[1])
# 鼻の付け根（鼻先の下で前後が一気に引っ込む所）→ 口の合わせ目はその 2.6cm 下 → 顎の下は横顔が首へ引っ込む所
subZ = next((z for z, y in fy if z < noseZ - 0.008 and y > noseY + 0.014), noseZ - 0.024)
mouthZ = subZ - 0.026
mouthY = front_at(mouthZ) or (noseY + 0.012)
chinZ = mouthZ - 0.05
prev = None
for z, y in fy:
    if z < mouthZ - 0.03 and prev is not None and y - prev > 0.008: chinZ = z; break
    prev = y
print('face eye', tuple(round(x, 3) for x in eC), 'nose', round(noseZ, 3), 'mouth', round(mouthZ, 3), 'chin', round(chinZ, 3))
FACE = {'mouth': None}
if STAGE >= 3:
    def push(c, r, d):
        for v in V:
            dd = (v.co - c).length
            if dd < r * 2.5: v.co += d * gauss(dd, r)
    for sg, e in ((1, eL), (-1, eR)):
        # 眉の内側を大きく下げて寄せ、外側は吊り上げる
        push(Vector((sg * 0.012, e.y - 0.014, e.z + 0.02)), 0.012, Vector((-sg * 0.007, -0.014, -0.022)))
        push(Vector((sg * 0.028, e.y - 0.012, e.z + 0.024)), 0.016, Vector((0, -0.018, -0.01)))
        push(Vector((sg * 0.052, e.y - 0.004, e.z + 0.026)), 0.012, Vector((0, -0.008, 0.008)))
        # 下まぶたと頬を押し上げて睨ませる
        push(Vector((sg * 0.03, e.y - 0.008, e.z - 0.016)), 0.01, Vector((0, -0.005, 0.005)))
        push(Vector((sg * 0.04, e.y - 0.004, e.z - 0.034)), 0.016, Vector((0, -0.008, 0.006)))
        # こめかみの怒張
        push(Vector((sg * 0.07, e.y + 0.03, e.z + 0.02)), 0.014, Vector((sg * 0.004, 0, 0)))
        # 小鼻を張る
        push(Vector((sg * 0.016, noseY + 0.012, noseZ - 0.006)), 0.009, Vector((sg * 0.007, -0.001, 0.002)))
        # 頬を盛り上げ、法令線を深く
        push(Vector((sg * 0.03, noseY + 0.02, noseZ - 0.012)), 0.012, Vector((0, -0.004, 0.004)))
    # 眉間の縦皺
    for sg in (1, -1): push(Vector((sg * 0.005, eC.y - 0.022, eC.z + 0.026)), 0.004, Vector((0, 0.004, 0)))
    # 額の横皺
    for zz in (0.05, 0.066):
        for xx in (-0.04, -0.02, 0, 0.02, 0.04): push(Vector((xx, eC.y - 0.012, eC.z + zz)), 0.006, Vector((0, 0.0025, 0)))
    if KIND == 'a':
        # 顎を下げて口を開く（蝶番は耳の前）
        hinge = Vector((0, eC.y + 0.06, eC.z - 0.03)); ang = math.radians(17)
        push(Vector((0, mouthY - 0.004, mouthZ + 0.008)), 0.012, Vector((0, -0.002, 0.005)))
        R = Matrix.Rotation(ang, 4, 'X')
        for v in V:
            p = v.co
            if p.y > mouthY + 0.04 or abs(p.x) > 0.075 or p.z > mouthZ + 0.004 or p.z < chinZ - 0.035: continue
            w = sm((mouthZ + 0.002 - p.z) / 0.006) * (1 - sm((chinZ - 0.012 - p.z) / 0.022)) * (1 - sm((abs(p.x) - 0.03) / 0.05)) * (1 - sm((p.y - mouthY - 0.006) / 0.045))
            q = hinge + (R @ (p - hinge))
            if 0.08 < w < 0.92 and abs(p.x) < 0.03 and p.z > mouthZ - 0.03: FACE.setdefault('gap', {})[v.index] = w
            v.co = p.lerp(q, w)
        FACE['mouth'] = (Vector((0, mouthY, mouthZ - 0.008)), 0.024, 0.011)
    else:
        # 吽：口角を強く下げ、下唇を押し上げる
        for sg in (1, -1): push(Vector((sg * 0.024, mouthY + 0.004, mouthZ)), 0.008, Vector((0, 0.001, -0.011)))
        push(Vector((0, mouthY, mouthZ + 0.004)), 0.01, Vector((0, 0.002, -0.002)))
        push(Vector((0, mouthY - 0.002, mouthZ - 0.008)), 0.008, Vector((0, -0.002, 0.003)))
        push(Vector((0, mouthY - 0.004, chinZ + 0.012)), 0.012, Vector((0, -0.004, 0.003)))
    body.data.update()

# ── 6. 衣装と持ち物（別の部品として作り、あとで一つにする） ──
parts = []
def new_obj(name, bm):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(ob)
    for p in me.polygons: p.use_smooth = True
    return ob
def tube(name, rings, seg, fn):
    # fn(t, a) -> 位置。t=0..1 上から下、a=0..2π
    bm = bmesh.new(); grid = []
    for i in range(rings + 1):
        row = []
        for j in range(seg):
            row.append(bm.verts.new(fn(i / rings, j / seg * 2 * math.pi)))
        grid.append(row)
    for i in range(rings):
        for j in range(seg):
            a, b, c, d = grid[i][j], grid[i][(j + 1) % seg], grid[i + 1][(j + 1) % seg], grid[i + 1][j]
            bm.faces.new((a, b, c, d))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return new_obj(name, bm)
def body_radius(z, a):
    # 腰の断面の半径（その方向）を体から測る
    best = 0.0
    dx, dy = math.cos(a), math.sin(a)
    for v in V:
        if abs(v.co.z - z) < 0.02 and abs(v.co.x) < 0.3:
            r = v.co.x * dx + (v.co.y - yc) * dy
            if r > best: best = r
    return best
yc = sum(v.co.y for v in V if abs(v.co.z - 1.05) < 0.02) / max(1, len([v for v in V if abs(v.co.z - 1.05) < 0.02]))
if STAGE >= 4:
    zTop, zHem = 1.1, 0.44
    rad0 = {}
    for j in range(48):
        a = j / 48 * 2 * math.pi
        rad0[j] = max(body_radius(zTop, a), 0.08) + 0.02
    def skirt(t, a):
        j = int(round(a / (2 * math.pi) * 48)) % 48
        z = zTop + (zHem - zTop) * t
        flare = 0.03 + 0.2 * t ** 1.6                          # 裾ほど広がる
        fold = (0.006 + 0.03 * t) * math.sin(a * 13 + t * 2.5) + 0.012 * t * math.sin(a * 5 + 1.3)
        r = rad0[j] * (1 + 0.15 * t) + flare + fold
        sx = 1.18                                              # 横に広い
        x = math.cos(a) * r * sx; y = yc + math.sin(a) * r
        # 裾は外へ翻る
        z += 0.05 * t ** 3 * math.sin(a * 2 + 0.6)
        return Vector((x, y, z))
    skirtOb = tube('skirt', 26, 96, skirt); skirtOb['col'] = (0.44, 0.54, 0.32); skirtOb['loose'] = 'skirt'; parts.append(skirtOb)
    # 腰の折り返し（縁）と帯
    def band(z0, z1, extra, name, col):
        def f(t, a):
            j = int(round(a / (2 * math.pi) * 48)) % 48
            r = rad0[j] + extra + 0.004 * math.sin(a * 9)
            return Vector((math.cos(a) * r * 1.12, yc + math.sin(a) * r, z0 + (z1 - z0) * t))
        ob = tube(name, 3, 96, f); ob['col'] = col; parts.append(ob); return ob
    band(1.16, 1.07, 0.03, 'fold', (0.5, 0.58, 0.36))
    band(1.12, 1.07, 0.045, 'sash', (0.86, 0.7, 0.34))
    # 帯の結び目と垂れ
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=16, v_segments=10, radius=0.05)
    for v in bm.verts: v.co = Vector((v.co.x * 1.2, yc - rad0[36] - 0.06 + v.co.y * 0.6, 1.09 + v.co.z * 0.8))
    knot = new_obj('knot', bm); knot['col'] = (0.86, 0.7, 0.34); parts.append(knot)
    for sg in (1, -1):
        def tail(t, a, sg=sg):
            w = 0.035 - 0.012 * t
            x0 = sg * (0.025 + 0.05 * t); z = 1.06 - 0.36 * t
            return Vector((x0 + math.cos(a) * w, yc - rad0[36] - 0.07 - 0.02 * t + math.sin(a) * 0.008, z))
        tl = tube('tail', 12, 12, tail); tl['col'] = (0.86, 0.7, 0.34); tl['loose'] = 'tail'; parts.append(tl)
    # 腕輪（上腕と手首）：腕は X 軸に沿う
    for sg in (1, -1):
        for xx, r in ((0.45, 0.07), (0.8, 0.045)):
            bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=False, segments=32, radius1=r, radius2=r, depth=0.04)
            for v in bm.verts: v.co = Vector((sg * xx + v.co.z, shL.y + v.co.y, shL.z + v.co.x - 0.01))
            # 腕の太さに合わせて半径を測り直す
            ob = new_obj('ring', bm); ob['col'] = (0.84, 0.66, 0.3); ob['fit'] = (sg * xx,); ob['bone'] = ('arm' if xx < 0.6 else 'fore') + ('L' if sg > 0 else 'R'); parts.append(ob)
    # 天衣の輪（頭の後ろ）
    bm = bmesh.new(); bmesh.ops.create_circle(bm, segments=1, radius=0.01)
    bm.free()
    def halo(t, a):
        ang = t * 2 * math.pi; R = 0.42; r = 0.026 + 0.004 * math.sin(ang * 6)
        cx, cz = math.cos(ang) * R, math.sin(ang) * R
        n = Vector((math.cos(ang), 0, math.sin(ang)))
        return Vector((cx, eC.y + 0.16, eC.z + 0.02 + cz)) + n * math.cos(a) * r + Vector((0, 1, 0)) * math.sin(a) * r
    ho = tube('halo', 96, 10, halo); ho['col'] = (0.66, 0.48, 0.34); ho['bone'] = 'extra'; parts.append(ho)
    # 髻（もとどり）
    top = max(v.co.z for v in V)
    def bun(t, a):
        # 髻：根元は締まり、上でふくらみ、先はすぼまる（髪の束の筋を入れる）
        z = top - 0.02 + 0.13 * t
        r = (0.032 + 0.03 * math.sin(math.pi * min(1, t * 1.15)) ** 0.8) * (1 - 0.6 * max(0, t - 0.85) / 0.15)
        r *= 1 + 0.06 * math.sin(a * 14)
        return Vector((math.cos(a) * r, eC.y + 0.03 + math.sin(a) * r * 0.9 - 0.02 * t, z))
    tk = tube('topknot', 16, 48, bun); tk['col'] = (0.3, 0.26, 0.26); tk['bone'] = 'head'; parts.append(tk)
    bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=False, segments=32, radius1=0.036, radius2=0.036, depth=0.014)
    for v in bm.verts: v.co = Vector((v.co.x, eC.y + 0.03 + v.co.y * 0.9, top + 0.0 + v.co.z))
    hb = new_obj('hairband', bm); hb['col'] = (0.84, 0.66, 0.3); hb['bone'] = 'head'; parts.append(hb)
    # 腕輪を腕の太さへ合わせる
    for ob in parts:
        if 'fit' not in ob.keys(): continue
        xx = ob['fit'][0]
        sl = [v.co for v in V if abs(v.co.x - xx) < 0.01 and abs(v.co.z - shL.z) < 0.15]
        cy_ = sum(p.y for p in sl) / len(sl); cz_ = sum(p.z for p in sl) / len(sl)
        rr = max(math.hypot(p.y - cy_, p.z - cz_) for p in sl) + 0.004
        oy = sum(v.co.y for v in ob.data.vertices) / len(ob.data.vertices); oz = sum(v.co.z for v in ob.data.vertices) / len(ob.data.vertices)
        for v in ob.data.vertices:
            d = Vector((0, v.co.y - oy, v.co.z - oz))
            if d.length > 0: d = d.normalized() * rr
            v.co = Vector((v.co.x, cy_ + d.y, cz_ + d.z))

# ── 7. 色（頂点色）と、凹みの重ね塗り ──
SKIN = (0.8, 0.52, 0.4); HAIR = (0.3, 0.26, 0.26); LIP = (0.66, 0.34, 0.3)
def paint(ob, fn):
    me = ob.data
    if 'Col' not in me.color_attributes: me.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT')
    ca = me.color_attributes['Col']
    for i, v in enumerate(me.vertices): ca.data[i].color = fn(v.co, i)
def body_col(p, i):
    c = list(SKIN); loose = 0.0
    # 髪：頭頂から生え際まで
    hl = sm((p.z - (eC.z + 0.075) + max(0.0, p.y - eC.y - 0.02) * 0.6) / 0.012)
    c = [c[k] * (1 - hl) + HAIR[k] * hl for k in range(3)]
    # 唇
    if abs(p.x) < 0.026 and abs(p.z - mouthZ) < 0.012 and p.y < mouthY + 0.012: c = [c[k] * 0.5 + LIP[k] * 0.5 for k in range(3)]
    # 阿の口の中（暗い赤）と歯
    g = FACE.get('gap', {}).get(i)
    if g is not None:
        c = [0.95, 0.92, 0.82] if g < 0.3 else ([0.4, 0.15, 0.15] if g < 0.8 else [0.86, 0.84, 0.76])
    # 爪先・手のひらを少し明るく
    return (c[0], c[1], c[2], loose)
if STAGE >= 5:
    paint(body, body_col)
    for e in eyes:
        ce = centroid(e)
        def eye_col(p, i, ce=ce):
            d = (p - ce).normalized(); f = -d.y                   # 正面ほど 1
            if f > 0.965: return (0.08, 0.05, 0.06, 0)
            if f > 0.9: return (0.58, 0.4, 0.18, 0)              # 玉眼の琥珀
            return (0.93, 0.88, 0.76, 0)
        paint(e, eye_col)
    for ob in parts:
        col = tuple(ob['col']); kind = ob.get('loose', '')
        def pc(p, i, col=col, kind=kind):
            l = 0.0
            if kind == 'skirt': l = sm((1.0 - p.z) / 0.5)
            if kind == 'tail': l = sm((1.0 - p.z) / 0.3) * 0.9
            return (col[0], col[1], col[2], l)
        paint(ob, pc)

# ── 8. 骨組み（ゲームの骨と同じ名前・順番）と自動の重み ──
BONES = ['hips', 'spine', 'chest', 'neck', 'head', 'clavL', 'armL', 'foreL', 'handL', 'clavR', 'armR', 'foreR', 'handR', 'thighL', 'shinL', 'footL', 'thighR', 'shinR', 'footR', 'extra']
PARENT = {'hips': None, 'spine': 'hips', 'chest': 'spine', 'neck': 'chest', 'head': 'neck', 'clavL': 'chest', 'armL': 'clavL', 'foreL': 'armL', 'handL': 'foreL', 'clavR': 'chest', 'armR': 'clavR', 'foreR': 'armR', 'handR': 'foreR', 'thighL': 'hips', 'shinL': 'thighL', 'footL': 'shinL', 'thighR': 'hips', 'shinR': 'thighR', 'footR': 'shinR', 'extra': 'chest'}
def joints():
    J = {}
    def cy(z, xr=None):
        c = slice_center(z, xr); return c.y if c else yc
    J['hips'] = Vector((0, cy(0.53 * H), 0.53 * H)); J['spine'] = Vector((0, cy(0.6 * H), 0.6 * H)); J['chest'] = Vector((0, cy(0.7 * H), 0.7 * H))
    J['neck'] = Vector((0, cy(0.845 * H, (-0.05, 0.05)), 0.845 * H)); J['head'] = Vector((0, cy(0.88 * H, (-0.05, 0.05)), 0.885 * H)); J['extra'] = Vector((0, J['head'].y + 0.06, 0.9 * H))
    tipx = max(v.co.x for v in V)
    for sg, n in ((1, 'L'), (-1, 'R')):
        sh = Vector((sg * shL.x, shL.y, shL.z)); Lr = tipx - shL.x
        J['clav' + n] = Vector((sg * 0.03 * H, shL.y, shL.z)); J['arm' + n] = sh
        J['fore' + n] = sh + Vector((sg * Lr * 0.43, 0, 0)); J['hand' + n] = sh + Vector((sg * Lr * 0.79, 0, 0))
        for b, z in (('thigh', 0.52 * H), ('shin', 0.285 * H), ('foot', 0.05 * H)):
            c = slice_center(z if b != 'thigh' else 0.46 * H, (0.0, 0.3) if sg > 0 else (-0.3, 0.0))
            x = c.x if c else sg * 0.09 * H; y = c.y if c else yc
            J[b + n] = Vector((x, y, z))
    return J
J = joints()
def bind_and_export():
    ad = bpy.data.armatures.new('rig'); rig = bpy.data.objects.new('rig', ad); bpy.context.scene.collection.objects.link(rig)
    for ob in bpy.context.view_layer.objects: ob.select_set(False)
    bpy.context.view_layer.objects.active = rig; rig.select_set(True); bpy.ops.object.mode_set(mode='EDIT')
    kids = {b: [c for c in BONES if PARENT[c] == b] for b in BONES}
    for b in BONES:
        e = ad.edit_bones.new(b); e.head = J[b]
        ch = [c for c in kids[b] if c not in ('extra',) and not c.startswith('clav') and not (b == 'hips' and c.startswith('thigh'))]
        if ch: e.tail = J[ch[0]]
        elif b.startswith('hand'): e.tail = J[b] + Vector((0.12 if b.endswith('L') else -0.12, 0, 0))
        elif b.startswith('foot'): e.tail = J[b] + Vector((0, -0.12, -0.04))
        elif b == 'head': e.tail = J[b] + Vector((0, 0, 0.2))
        else: e.tail = J[b] + Vector((0, 0, 0.1))
        if (e.tail - e.head).length < 0.01: e.tail = e.head + Vector((0, 0, 0.05))
    for b in BONES:
        if PARENT[b]: ad.edit_bones[b].parent = ad.edit_bones[PARENT[b]]
    bpy.ops.object.mode_set(mode='OBJECT')
    for ob in bpy.context.view_layer.objects: ob.select_set(False)
    body.select_set(True); rig.select_set(True); bpy.context.view_layer.objects.active = rig
    bpy.ops.object.parent_set(type='ARMATURE_AUTO')
    # 目・髻・輪は一つの骨に、衣装は体から重みを写す
    for ob in eyes + parts:
        for b in BONES: ob.vertex_groups.new(name=b)
        fixed = 'head' if ob in eyes else ob.get('bone', '')
        if fixed:
            ob.vertex_groups[fixed].add(list(range(len(ob.data.vertices))), 1.0, 'REPLACE')
        else:
            m = ob.modifiers.new('dt', 'DATA_TRANSFER'); m.object = body; m.use_vert_data = True
            m.data_types_verts = {'VGROUP_WEIGHTS'}; m.vert_mapping = 'POLYINTERP_NEAREST'
            bpy.context.view_layer.objects.active = ob
            for o2 in bpy.context.view_layer.objects: o2.select_set(False)
            ob.select_set(True)
            bpy.ops.object.datalayout_transfer(modifier='dt')
            bpy.ops.object.modifier_apply(modifier='dt')
    # 一つにまとめて書き出す
    allp = [body] + eyes + parts
    out_pos, out_nrm, out_col, out_si, out_sw, out_idx = [], [], [], [], [], []
    for ob in allp:
        me = ob.data; me.calc_loop_triangles()
        base = len(out_pos) // 3
        ca = me.color_attributes['Col'] if 'Col' in me.color_attributes else None
        gi = {g.index: g.name for g in ob.vertex_groups}
        for i, v in enumerate(me.vertices):
            p = v.co; n = v.normal
            out_pos += [p.x, p.z, -p.y]; out_nrm += [n.x, n.z, -n.y]
            c = ca.data[i].color if ca else (0.8, 0.8, 0.8, 0)
            out_col += [max(0, min(255, round(c[k] * 255))) for k in range(4)]
            ws = sorted([(g.weight, BONES.index(gi[g.group])) for g in v.groups if gi.get(g.group) in BONES and g.weight > 0.001], reverse=True)[:4]
            if not ws: ws = [(1.0, BONES.index('hips'))]
            s = sum(w for w, _ in ws) or 1
            q = [round(w / s * 255) for w, _ in ws]; q[0] += 255 - sum(q)
            while len(ws) < 4: ws.append((0, 0)); q.append(0)
            out_si += [b for _, b in ws]; out_sw += q
        for t in me.loop_triangles:
            a, b, c = t.vertices
            out_idx += [base + a, base + b, base + c]
    nv = len(out_pos) // 3
    mn = [min(out_pos[k::3]) for k in range(3)]; mx = [max(out_pos[k::3]) for k in range(3)]
    jg = {b: [J[b].x, J[b].z, -J[b].y] for b in BONES}
    use16 = nv < 65536
    head = json.dumps({'nv': nv, 'ni': len(out_idx), 'use16': use16, 'min': mn, 'max': mx, 'joints': jg, 'src': 'blender'}).encode()
    def pad(b): return b + b'\0' * ((4 - len(b) % 4) % 4)
    qpos = struct.pack('<%dH' % len(out_pos), *[round((out_pos[i] - mn[i % 3]) / (mx[i % 3] - mn[i % 3]) * 65535) for i in range(len(out_pos))])
    n8 = struct.pack('<%db' % len(out_nrm), *[max(-127, min(127, round(x * 127))) for x in out_nrm])
    data = struct.pack('<I', len(head)) + pad(head) + pad(qpos) + pad(n8) + pad(bytes(out_col)) + pad(bytes(out_si)) + pad(bytes(out_sw)) + pad(struct.pack('<%d%s' % (len(out_idx), 'H' if use16 else 'I'), *out_idx))
    open(OUT, 'wb').write(data)
    print('exported', OUT, 'verts', nv, 'tris', len(out_idx) // 3, 'bytes', len(data))
if STAGE >= 6: bind_and_export()

# ── プレビュー ──
def preview(path):
    scn = bpy.context.scene
    scn.render.engine = 'CYCLES'; scn.cycles.samples = 16; scn.cycles.device = 'CPU'
    scn.render.resolution_x, scn.render.resolution_y = 900, 900
    mat = bpy.data.materials.new('clay'); mat.use_nodes = True
    bsdf = mat.node_tree.nodes['Principled BSDF']; bsdf.inputs['Base Color'].default_value = (0.75, 0.5, 0.4, 1); bsdf.inputs['Roughness'].default_value = 0.6
    if STAGE >= 5:
        at = mat.node_tree.nodes.new('ShaderNodeVertexColor'); at.layer_name = 'Col'; mat.node_tree.links.new(at.outputs['Color'], bsdf.inputs['Base Color'])
    for ob in bpy.data.objects:
        if ob.type == 'MESH':
            ob.data.materials.clear(); ob.data.materials.append(mat)
            for p in ob.data.polygons: p.use_smooth = True
    w = bpy.data.worlds.new('w'); scn.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[1].default_value = 0.4
    sun = bpy.data.objects.new('sun', bpy.data.lights.new('sun', 'SUN')); sun.data.energy = 3; sun.rotation_euler = (0.9, 0.2, 0.6); scn.collection.objects.link(sun)
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); scn.collection.objects.link(cam); scn.camera = cam
    shots = [((0, -4.6, 1.1), (math.radians(90), 0, 0), 'front'), ((3.2, -3.2, 1.2), (math.radians(88), 0, math.radians(45)), 'q'), ((0, -0.75, 1.86), (math.radians(90), 0, 0), 'face')]
    for loc, rot, nm in shots:
        cam.location = loc; cam.rotation_euler = rot; cam.data.lens = 50 if nm != 'face' else 60
        scn.render.filepath = path.replace('.png', f'-{nm}.png'); bpy.ops.render.render(write_still=True)
if PREVIEW: preview(PREVIEW)
