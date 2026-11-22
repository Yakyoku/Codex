"""主人公（第4版）：持ち主の参考画像 Docs/REFERENCE/hero/reference-v3.jpg に沿った、継ぎ目のないボディスーツの潜行士。作り事の存在。
   作り方：
     1. 体の形を「距離の式」（丸い円すい・楕円体を滑らかにつないだもの）で定義し、マーチングキューブで1枚の閉じた曲面にする
     2. Blender で整え（スムーズ、ポリゴン削減）、部位ごとに淡いラベンダーの装甲と濃い紫の継ぎ目に塗り分け、継ぎ目をわずかに沈める
     3. ボーン（骨）を入れて自動で重みを付け、ヘルメット・背中のユニット・前腕の道具をボーンに取り付ける
     4. 陰（AO）を焼き込み、GLB で書き出す
   身長 2.0（ヘルメットの上端）。Blender は z が上、正面は -Y、+X が本人の左。
   出力: assets/models/diver.raw.glb, assets/models/diver.blend, assets/textures/diver_ao.png"""
import sys, os, math, time
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np, bpy, bmesh
from mathutils import Vector, Quaternion
import irlib as L
from skimage.measure import marching_cubes

T0 = time.time()
# ---------------- 1. 距離の式 ----------------
def round_cone(P, a, b, r1, r2):
    a, b = np.asarray(a, np.float32), np.asarray(b, np.float32)
    ba = b - a; l2 = float(ba @ ba); rr = r1 - r2; a2 = l2 - rr * rr; il2 = 1.0 / l2
    pa = P - a; y = pa @ ba; z = y - l2
    x = pa * l2 - y[:, None] * ba; x2 = (x * x).sum(1); y2 = y * y * l2; z2 = z * z * l2
    k = np.sign(rr) * rr * rr * x2
    d = np.where(np.sign(z) * a2 * z2 > k, np.sqrt(x2 + z2) * il2 - r2,
        np.where(np.sign(y) * a2 * y2 < k, np.sqrt(x2 + y2) * il2 - r1, (np.sqrt(x2 * a2 * il2) + y * rr) * il2 - r1))
    return d
def ellipsoid(P, c, r):
    q = (P - np.asarray(c, np.float32)); r = np.asarray(r, np.float32)
    k0 = np.linalg.norm(q / r, axis=1); k1 = np.linalg.norm(q / (r * r), axis=1)
    return k0 * (k0 - 1.0) / np.maximum(k1, 1e-6)
def smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0, 1)
    return b * (1 - h) + a * h - k * h * (1 - h)

S = {}   # 部位ごとの関節位置
for side, sx in (("L", 1), ("R", -1)):
    S[side] = dict(sh=(sx * 0.192, 0.006, 1.548), el=(sx * 0.252, 0.014, 1.292), wr=(sx * 0.29, -0.004, 1.052), hd=(sx * 0.302, -0.016, 0.9),
                   hip=(sx * 0.088, 0.0, 0.975), kn=(sx * 0.099, -0.006, 0.53), an=(sx * 0.103, 0.014, 0.115), toe=(sx * 0.107, -0.165, 0.032))

PARTS = []   # (名前, 関数)
def part(name, f): PARTS.append((name, f))
part("torso", lambda P: smin(smin(smin(ellipsoid(P, (0, 0.004, 1.035), (0.162, 0.112, 0.118)), ellipsoid(P, (0, 0.006, 1.245), (0.102, 0.078, 0.13)), 0.05),
                                   ellipsoid(P, (0, 0.002, 1.415), (0.146, 0.102, 0.165)), 0.05), ellipsoid(P, (0, 0.012, 1.562), (0.172, 0.08, 0.058)), 0.04))
part("glute", lambda P: np.minimum(ellipsoid(P, (0.07, 0.042, 0.998), (0.082, 0.08, 0.092)), ellipsoid(P, (-0.07, 0.042, 0.998), (0.082, 0.08, 0.092))))
part("bust", lambda P: np.minimum(ellipsoid(P, (0.064, -0.066, 1.458), (0.06, 0.05, 0.056)), ellipsoid(P, (-0.064, -0.066, 1.458), (0.06, 0.05, 0.056))))
part("neck", lambda P: np.minimum(round_cone(P, (0, 0.01, 1.58), (0, 0.004, 1.72), 0.054, 0.048), ellipsoid(P, (0, 0.0, 1.8), (0.085, 0.095, 0.1))))
for side, sx in (("L", 1), ("R", -1)):
    J = S[side]
    part("delt" + side, lambda P, sx=sx: ellipsoid(P, (sx * 0.192, 0.004, 1.548), (0.064, 0.068, 0.072)))
    part("uarm" + side, lambda P, J=J: round_cone(P, J["sh"], J["el"], 0.05, 0.04))
    part("farm" + side, lambda P, J=J, sx=sx: smin(round_cone(P, J["el"], J["wr"], 0.042, 0.029), ellipsoid(P, (sx * 0.264, 0.006, 1.215), (0.044, 0.046, 0.075)), 0.02))
    part("hand" + side, lambda P, J=J, sx=sx: smin(smin(ellipsoid(P, (sx * 0.298, -0.012, 0.99), (0.019, 0.04, 0.052)),
                                                         round_cone(P, (sx * 0.3, -0.016, 0.955), (sx * 0.303, -0.022, 0.885), 0.016, 0.011), 0.012),
                                                    round_cone(P, (sx * 0.29, -0.04, 1.0), (sx * 0.284, -0.062, 0.962), 0.011, 0.008), 0.01))
    part("thigh" + side, lambda P, J=J, sx=sx: smin(round_cone(P, J["hip"], J["kn"], 0.086, 0.052), ellipsoid(P, (sx * 0.104, -0.004, 0.84), (0.072, 0.08, 0.13)), 0.03))
    part("knee" + side, lambda P, J=J: ellipsoid(P, (J["kn"][0], J["kn"][1] - 0.008, J["kn"][2]), (0.05, 0.052, 0.058)))
    part("shin" + side, lambda P, J=J, sx=sx: smin(round_cone(P, J["kn"], J["an"], 0.048, 0.032), ellipsoid(P, (sx * 0.1, 0.026, 0.405), (0.05, 0.053, 0.11)), 0.025))
    part("foot" + side, lambda P, J=J, sx=sx: np.maximum(smin(smin(ellipsoid(P, (sx * 0.104, -0.06, 0.042), (0.046, 0.115, 0.042)), ellipsoid(P, (sx * 0.103, 0.032, 0.05), (0.042, 0.05, 0.05)), 0.02),
                                                              ellipsoid(P, (sx * 0.103, 0.014, 0.11), (0.039, 0.041, 0.065)), 0.02), -P[:, 2] + 0.002))

BLEND = {"torso": 0.0, "glute": 0.035, "bust": 0.03, "neck": 0.03}
def sdf(P, labels=False):
    vals = np.stack([f(P) for _, f in PARTS], 1)
    if labels: return vals.argmin(1)
    d = vals[:, 0]
    for i, (n, _) in enumerate(PARTS[1:], start=1):
        k = BLEND.get(n, 0.022 if n.startswith(("delt", "uarm", "thigh")) else 0.016)
        d = smin(d, vals[:, i], k)
    return d

VOX = 0.0042
lo = np.array([-0.4, -0.22, -0.01], np.float32); hi = np.array([0.4, 0.2, 1.86], np.float32)
nx, ny, nz = (np.ceil((hi - lo) / VOX)).astype(int) + 1
xs, ys, zs = [lo[i] + np.arange(n, dtype=np.float32) * VOX for i, n in enumerate((nx, ny, nz))]
vol = np.empty((nx, ny, nz), np.float32)
X, Y = np.meshgrid(xs, ys, indexing="ij")
for k in range(nz):
    P = np.stack([X.ravel(), Y.ravel(), np.full(X.size, zs[k], np.float32)], 1)
    vol[:, :, k] = sdf(P).reshape(nx, ny)
verts, faces, _, _ = marching_cubes(vol, 0.0, spacing=(VOX, VOX, VOX))
verts = verts + lo
print("MC", len(verts), len(faces), round(time.time() - T0, 1), "s")

# ---------------- 2. Blender で整える ----------------
L.reset()
body = L.mesh_object("body", verts, [tuple(f[::-1]) for f in faces], smooth=True)
L.select_only(body)
bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT"); bpy.ops.mesh.remove_doubles(threshold=1e-5); bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode="OBJECT")
md = body.modifiers.new("sm", "SMOOTH"); md.factor = 0.6; md.iterations = 6
md = body.modifiers.new("dec", "DECIMATE"); md.ratio = 22000 / max(1, len(faces))
for m in list(body.modifiers): bpy.ops.object.modifier_apply(modifier=m.name)

M = {}
def mat(name, col, rough, metal=0.0, emit=None, coat=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*col, 1); b.inputs["Roughness"].default_value = rough; b.inputs["Metallic"].default_value = metal
    if coat: b.inputs["Coat Weight"].default_value = coat; b.inputs["Coat Roughness"].default_value = 0.06
    if emit: b.inputs["Emission Color"].default_value = (*emit[0], 1); b.inputs["Emission Strength"].default_value = emit[1]
    M[name] = m; return m
mat("armor", (0.5, 0.42, 0.88), 0.2, coat=0.9)        # 淡いラベンダー（参考画像の主色）
mat("seam", (0.05, 0.022, 0.15), 0.32, coat=0.5)       # 濃い紫（継ぎ目・内側）
mat("mid", (0.24, 0.16, 0.5), 0.26, coat=0.7)          # 中間の紫（手袋・靴底・小物）
mat("visor", (0.003, 0.002, 0.006), 0.03, coat=1.0)    # 黒いバイザー
mat("glow", (0.55, 0.35, 0.95), 0.4, emit=((0.62, 0.38, 1.0), 4.0))
for k in ("armor", "seam", "mid"): body.data.materials.append(M[k])

for p in body.data.polygons: p.use_smooth = True
body.data.materials.clear()
suit = bpy.data.materials.new("suit"); suit.use_nodes = True
bs = suit.node_tree.nodes["Principled BSDF"]; bs.inputs["Roughness"].default_value = 0.2; bs.inputs["Coat Weight"].default_value = 0.9; bs.inputs["Coat Roughness"].default_value = 0.06
body.data.materials.append(suit); M["suit"] = suit
names = [n for n, _ in PARTS]

def panels(P):
    """塗り分けの設計図：0=淡いラベンダーの装甲, 1=濃い紫の継ぎ目, 2=中間の紫。P は体の表面の点（安静の姿勢）"""
    lab = np.array(names)[sdf(P, labels=True)]
    x, y, z = P[:, 0], P[:, 1], P[:, 2]; ax = np.abs(x)
    out = np.zeros(len(P), np.int8)
    def dark(m): out[m] = 1
    T = np.isin(lab, ["torso", "bust", "glute"])
    has = lambda pre: np.char.startswith(lab.astype(str), pre)
    line = lambda v, c, w=0.0055: np.abs(v - c) < w
    dark(lab == "neck")
    # 胴：腰のベルト、骨盤の前の V 字、腰の板の切れ目、腹の両わき、背中の下の帯、胸の下と鎖骨の線、わきの継ぎ目、背骨の線
    dark(T & (z > 1.112) & (z < 1.15))
    dark(T & (z < 1.112) & (y < -0.02) & (ax < 0.038 + (1.1 - z) * 0.78))
    dark(T & (z < 1.112) & (z > 0.99) & line(ax, 0.118 + (1.112 - z) * 0.3) & (y < 0.06))
    dark(T & (z > 1.15) & (z < 1.365) & (ax > 0.056 + (z - 1.15) * 0.12) & (y < 0.03))
    dark(T & (z > 1.15) & (z < 1.215) & (y > 0.03))
    dark(T & (z > 1.15) & (z < 1.36) & (y > 0.03) & line(ax, 0.0, 0.006))
    dark(T & line(z, 1.37, 0.007) & (y < 0.0))
    dark(T & line(z, 1.523, 0.005) & (y < -0.02))
    dark(T & (z > 1.36) & (z < 1.5) & (ax > 0.112) & (ax < 0.152) & (np.abs(y) < 0.05))
    dark(T & (z > 1.36) & (y > 0.04) & line(ax, 0.0, 0.005) & (z < 1.52))
    # 腕：肩当ての下の線、上腕の内側、ひじ、手首。手袋は中間の紫
    dark(has("uarm") & line(z, 1.47, 0.005)); dark(has("uarm") & (ax < 0.172) & (z < 1.48)); dark(has("uarm") & (z < 1.33))
    dark(has("farm") & (z > 1.255)); dark(has("farm") & (z < 1.085)); dark(has("farm") & line(z, 1.17, 0.004) & (y > 0.0))
    out[has("hand") & (z < 0.975)] = 2
    # 脚：股、太ももの内側、太ももの上と下の線、ひざの裏、すねの上の線、ふくらはぎ、足首。靴底は中間の紫
    dark(has("thigh") & (z > 0.88) & (ax < 0.062) & (y > -0.035))
    dark(has("thigh") & (ax < 0.058) & (z > 0.66) & (z < 0.88) & (y > -0.03))
    dark(has("thigh") & line(z, 0.6, 0.006)); dark(has("thigh") & line(z, 0.912, 0.005) & (ax > 0.062))
    dark(has("knee") & (y > 0.0))
    dark(has("shin") & (z < 0.15)); dark(has("shin") & line(z, 0.468, 0.005)); dark(has("shin") & (y > 0.05) & line(x, x * 0 + np.sign(x) * 0.1, 0.005) & (z > 0.2) & (z < 0.46))
    out[has("foot") & (z < 0.022)] = 2; dark(has("foot") & line(z, 0.088, 0.004))
    return out
# ---------------- 取り付ける硬い部品 ----------------
def sph(name, m, r, c, scale=(1, 1, 1), seg=48):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=c, segments=seg, ring_count=seg // 2); ob = bpy.context.object; ob.name = name; ob.scale = scale
    bpy.ops.object.transform_apply(scale=True); ob.data.materials.append(M[m])
    for p in ob.data.polygons: p.use_smooth = True
    return ob
def torus(name, m, c, R, r, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=40, minor_segments=10, location=c); ob = bpy.context.object; ob.name = name; ob.scale = scale
    bpy.ops.object.transform_apply(scale=True); ob.data.materials.append(M[m])
    for p in ob.data.polygons: p.use_smooth = True
    return ob
def cyl(name, m, r, h, c, axis=(0, 0, 1), r2=None, verts=24):
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r, radius2=r if r2 is None else r2, depth=h, location=c); ob = bpy.context.object; ob.name = name
    ob.rotation_euler = Vector((0, 0, 1)).rotation_difference(Vector(axis)).to_euler(); bpy.ops.object.transform_apply(rotation=True); ob.data.materials.append(M[m])
    md = ob.modifiers.new("b", "BEVEL"); md.width = 0.003; md.segments = 2; md.limit_method = "ANGLE"
    for p in ob.data.polygons: p.use_smooth = True
    return ob
def rbox(name, m, size, c, sub=2):
    bpy.ops.mesh.primitive_cube_add(size=1, location=c); ob = bpy.context.object; ob.name = name; ob.scale = size; bpy.ops.object.transform_apply(scale=True); ob.data.materials.append(M[m])
    md = ob.modifiers.new("b", "BEVEL"); md.width = min(size) * 0.45; md.segments = 4
    md = ob.modifiers.new("s", "SUBSURF"); md.levels = sub
    for p in ob.data.polygons: p.use_smooth = True
    return ob
def join(name, parts):
    for o in bpy.context.scene.objects: o.select_set(False)
    for p in parts:
        bpy.context.view_layer.objects.active = p
        for md in list(p.modifiers): bpy.ops.object.modifier_apply(modifier=md.name)
        p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]; bpy.ops.object.join(); parts[0].name = name; parts[0].data.name = name; return parts[0]
def oval_patch(name, m, ax, az, R, cz, sy=1.06, sz=1.04, lift=0.0, r0=0.0, rings=12, seg=56):
    """ヘルメットの前面に沿う楕円の面（バイザー）。r0>0 なら縁取りの輪"""
    Vv, F = [], []
    for i, r in enumerate(np.linspace(r0, 1, rings + 1)):
        for j in range(seg):
            a = 2 * math.pi * j / seg; x = ax * r * math.cos(a); dz = az * r * math.sin(a)
            yy = -math.sqrt(max(1e-6, 1 - (x / R) ** 2 - (dz / (R * sz)) ** 2)) * R * sy
            q = np.array([x, yy, dz]); n = q / np.linalg.norm(q)          # 殻の中心から外向きに浮かせる（上端でも重ならない）
            Vv.append((x + n[0] * lift, yy + n[1] * lift, cz + dz + n[2] * lift))
    for i in range(rings):
        for j in range(seg):
            j2 = (j + 1) % seg; F.append((i * seg + j, (i + 1) * seg + j, (i + 1) * seg + j2, i * seg + j2))
    ob = L.mesh_object(name, np.array(Vv), F); ob.data.materials.append(M[m])
    L.select_only(ob); bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT"); bpy.ops.mesh.remove_doubles(threshold=1e-5); bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode="OBJECT")
    return ob
# ヘルメット：丸い殻＋顔の前面を広く覆う黒いバイザー＋細い縁取り＋耳の円盤
HCZ = 1.815; HR = 0.148
helmet = join("helmet", [
    sph("hs", "armor", HR, (0, 0, HCZ), (1, 1.06, 1.04), 40),
    oval_patch("visor", "visor", 0.118, 0.094, HR, HCZ - 0.006, lift=0.0045),
    oval_patch("vrim", "seam", 0.128, 0.103, HR, HCZ - 0.006, lift=0.0028, r0=0.9, rings=3),
    cyl("earL", "mid", 0.036, 0.016, (HR * 0.985, 0.012, HCZ - 0.01), (1, 0, 0)), cyl("earR", "mid", 0.036, 0.016, (-HR * 0.985, 0.012, HCZ - 0.01), (1, 0, 0)),
    torus("neckRing", "armor", (0, 0.006, 1.678), 0.068, 0.016, (1.06, 1.0, 1)),
    torus("neckRing2", "seam", (0, 0.006, 1.656), 0.064, 0.01, (1.06, 1.0, 1)),
])
# 背中の小さなユニット（参考画像どおり、肩甲骨の間に収まる大きさ）
pack = join("pack", [
    rbox("pk", "armor", (0.15, 0.075, 0.19), (0, 0.118, 1.445), 2),
    rbox("pkS", "mid", (0.085, 0.012, 0.12), (0, 0.153, 1.445), 1),
    cyl("pkL", "mid", 0.022, 0.17, (0.088, 0.118, 1.445)), cyl("pkR", "mid", 0.022, 0.17, (-0.088, 0.118, 1.445)),
    rbox("pkG", "glow", (0.05, 0.006, 0.008), (0, 0.161, 1.49), 1),
])
# 右前腕の浄化の発振器（細い筒＋光る先端）、左前腕の小さな端末
emit = join("emitter", [cyl("em", "mid", 0.012, 0.15, (-0.302, -0.008, 1.16), (0.17, 0.07, -1)), cyl("emG", "glow", 0.009, 0.012, (-0.315, -0.012, 1.082), (0.17, 0.07, -1))])
pad = join("wristpad", [rbox("dp", "mid", (0.012, 0.045, 0.07), (0.304, -0.01, 1.14), 1), rbox("dpG", "glow", (0.004, 0.032, 0.05), (0.311, -0.01, 1.14), 1)])

# ---------------- 3. ボーン ----------------
arm_d = bpy.data.armatures.new("rig"); rig = bpy.data.objects.new("rig", arm_d); bpy.context.scene.collection.objects.link(rig)
L.select_only(rig); bpy.ops.object.mode_set(mode="EDIT")
EB = arm_d.edit_bones
def bone(name, h, t, parent=None, roll=0.0):
    b = EB.new(name); b.head = h; b.tail = t; b.roll = roll
    if parent: b.parent = EB[parent]; b.use_connect = False
    return b
bone("pelvis", (0, 0, 0.99), (0, 0, 1.15))
bone("chest", (0, 0, 1.15), (0, 0.0, 1.6), "pelvis")
bone("head", (0, 0.004, 1.64), (0, 0.004, 1.95), "chest")
for side, sx in (("L", 1), ("R", -1)):
    J = S[side]
    bone("upperArm" + side, J["sh"], J["el"], "chest"); bone("foreArm" + side, J["el"], J["wr"], "upperArm" + side); bone("hand" + side, J["wr"], J["hd"], "foreArm" + side)
    bone("thigh" + side, J["hip"], J["kn"], "pelvis"); bone("shin" + side, J["kn"], J["an"], "thigh" + side); bone("foot" + side, J["an"], J["toe"], "shin" + side)
bpy.ops.object.mode_set(mode="OBJECT")
for o in bpy.context.scene.objects: o.select_set(False)
body.select_set(True); rig.select_set(True); bpy.context.view_layer.objects.active = rig
bpy.ops.object.parent_set(type="ARMATURE_AUTO")
groups = {g.index: g.name for g in body.vertex_groups}
unweighted = sum(1 for v in body.data.vertices if not any(g.weight > 0.01 for g in v.groups))
print("WEIGHTS groups", len(groups), "unweighted", unweighted)
if unweighted > len(body.data.vertices) * 0.02:
    # 自動の重み付けに失敗した場合は、いちばん近い部位のボーンに割り当てる
    map_ = {"torso": "chest", "glute": "pelvis", "bust": "chest", "neck": "head"}
    for side in "LR":
        map_.update({"delt" + side: "upperArm" + side, "uarm" + side: "upperArm" + side, "farm" + side: "foreArm" + side, "hand" + side: "hand" + side,
                     "thigh" + side: "thigh" + side, "knee" + side: "shin" + side, "shin" + side: "shin" + side, "foot" + side: "foot" + side})
    for g in list(body.vertex_groups): body.vertex_groups.remove(g)
    vg = {b.name: body.vertex_groups.new(name=b.name) for b in arm_d.bones}
    Vb = np.array([v.co[:] for v in body.data.vertices], np.float32); lb = sdf(Vb, labels=True)
    for i, li in enumerate(lb):
        n = names[li]; bn = map_[n]
        if n == "torso" and Vb[i, 2] < 1.15: bn = "pelvis"
        vg[bn].add([i], 1.0, "REPLACE")
    print("WEIGHTS fallback used")
def attach(ob, bone_name):
    mw = ob.matrix_world.copy(); ob.parent = rig; ob.parent_type = "BONE"; ob.parent_bone = bone_name; ob.matrix_world = mw
attach(helmet, "head"); attach(pack, "chest"); attach(emit, "foreArmR"); attach(pad, "foreArmL")
def empty(name, loc, bone_name):
    e = bpy.data.objects.new(name, None); e.location = loc; bpy.context.scene.collection.objects.link(e); bpy.context.view_layer.update(); attach(e, bone_name); return e
empty("emitterTip", (-0.317, -0.013, 1.072), "foreArmR")
empty("lampMount", (0.09, -0.12, 1.91), "head")

# ---------------- 4. 体の UV、位置と AO の焼き込み、塗り分けの合成 ----------------
meshes = [body, helmet, pack, emit, pad]
L.select_only(body)
bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT"); bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=0.003); bpy.ops.object.mode_set(mode="OBJECT")
TS = 2048
def bake_into(kind, float_buf):
    img = bpy.data.images.new("b_" + kind, TS, TS, alpha=True, float_buffer=float_buf); img.colorspace_settings.name = "Non-Color"
    nt = suit.node_tree
    if kind == "POS":
        em = nt.nodes.new("ShaderNodeEmission"); geo = nt.nodes.new("ShaderNodeNewGeometry"); out = nt.nodes["Material Output"]
        old = out.inputs["Surface"].links[0].from_socket
        nt.links.new(geo.outputs["Position"], em.inputs["Color"]); nt.links.new(em.outputs[0], out.inputs["Surface"])
    tex = nt.nodes.new("ShaderNodeTexImage"); tex.image = img; nt.nodes.active = tex
    L.select_only(body); bpy.context.scene.cycles.samples = 1 if kind == "POS" else 40
    bpy.ops.object.bake(type="EMIT" if kind == "POS" else "AO", margin=8, use_clear=True)
    if kind == "POS": nt.links.new(old, out.inputs["Surface"]); nt.nodes.remove(em); nt.nodes.remove(geo)
    nt.nodes.remove(tex)
    w = np.empty(TS * TS * 4, np.float32); img.pixels.foreach_get(w); return w.reshape(TS, TS, 4)
t1 = time.time()
pos = bake_into("POS", True); ao = bake_into("AO", False)[..., 0]
valid = np.abs(pos[..., :3]).sum(-1) > 1e-6
P = pos[..., :3][valid]
code = np.full((TS, TS), 0, np.int8); code[valid] = panels(P)
pal = np.array([[0.74, 0.67, 0.95], [0.16, 0.09, 0.32], [0.55, 0.46, 0.84]], np.float32)   # sRGB：淡いラベンダー／濃い紫／中間
col = pal[code]
# 境目をなめらかにする（2×2 の平均で 1 画素ぶんぼかす）
col = (col + np.roll(col, 1, 0) + np.roll(col, 1, 1) + np.roll(np.roll(col, 1, 0), 1, 1)) / 4
col *= (0.42 + 0.58 * ao)[..., None]
from PIL import Image
Image.fromarray((np.clip(col[::-1], 0, 1) * 255 + 0.5).astype(np.uint8)).save(os.path.join(L.OUT_TEX, "diver_color.png"))
cimg = bpy.data.images.load(os.path.join(L.OUT_TEX, "diver_color.png")); cimg.colorspace_settings.name = "sRGB"
tex = suit.node_tree.nodes.new("ShaderNodeTexImage"); tex.image = cimg; suit.node_tree.links.new(tex.outputs["Color"], bs.inputs["Base Color"])
print("PANELS_s", round(time.time() - t1, 1), "TRIS", sum(len(p.vertices) - 2 for o in meshes for p in o.data.polygons), "total_s", round(time.time() - T0, 1))
for o in bpy.context.scene.objects: o.select_set(False)
for o in meshes + [rig] + [o for o in bpy.context.scene.objects if o.type == "EMPTY"]: o.select_set(True)
bpy.context.view_layer.objects.active = rig
bpy.ops.export_scene.gltf(filepath=os.path.join(L.OUT_MODELS, "diver.raw.glb"), export_format="GLB", use_selection=True, export_skins=True, export_animations=False,
                          export_yup=True, export_apply=False, export_attributes=False)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(L.OUT_MODELS, "diver.blend"))
print("OK")
