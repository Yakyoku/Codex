"""主人公のアニメーション（キーポーズを付け、Blender の曲線でなめらかにつなぐ）。持ち主の参考画像 Docs/REFERENCE/hero/poses-v1.jpg（走る・立つ・しゃがむ・片ひざ）に基づく。
   make_hero.py が保存した assets/models/diver.blend を開き、次の動きを作って GLB に書き出す。
     idle   … 立ち。腰に手を当て、体重を片足にのせて、ゆっくり呼吸する（4 秒のループ）
     walk   … 歩き（1.1 秒で2歩）
     run    … 走り（0.7 秒で2歩。ひじを曲げて腕を振り、ひざを高く上げ、体を前に傾ける）
     squat  … しゃがみ（両手を胸の前で合わせる）
     crouch … 片ひざ立ち（左ひざに左手、右手を床へ。スキャンのときの姿勢）
   しゃがみ・片ひざ・腰に手を当てる姿勢は、足と手の置き場所を先に決め、IK で関節の曲がりを求めてから、普通のキーに焼き付ける。
   回転は「体の向きを基準にした軸」（x=前後に曲げる 負で前へ, y=ねじる, z=横に開く）。ゲームの diver.ts と同じ決まり。
   出力: assets/models/diver.raw.glb（アニメーションつき）, assets/models/diver_anim.blend"""
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
import bpy
from mathutils import Vector, Quaternion, Matrix
import irlib as L

bpy.ops.wm.open_mainfile(filepath=os.path.join(L.OUT_MODELS, "diver.blend"))
sc = bpy.context.scene; sc.render.fps = 30
rig = bpy.data.objects["rig"]
JOINTS = ['pelvis', 'chest', 'head', 'upperArmL', 'foreArmL', 'handL', 'upperArmR', 'foreArmR', 'handR', 'thighL', 'shinL', 'footL', 'thighR', 'shinR', 'footR']
AD, LI = 0.62, 0.09      # 安静の姿勢（腕を斜めに開き、脚も少し開く）からの補正
BASE = {"upperArmL": (0, 0, -AD), "upperArmR": (0, 0, AD), "thighL": (0, 0, -LI), "thighR": (0, 0, LI)}

def bq(name, x, y, z):
    inv = rig.data.bones[name].matrix_local.to_3x3().inverted()
    return Quaternion(inv @ Vector((1, 0, 0)), x) @ Quaternion(inv @ Vector((0, 0, 1)), y) @ Quaternion(inv @ Vector((0, -1, 0)), z)
def apply(p, loc=(0, 0, 0)):
    """p: {関節: (x, y, z)}。BASE に足し合わせる。loc: 骨盤の移動（世界の x, 前 -y, 上 z）"""
    for n in JOINTS:
        pb = rig.pose.bones[n]; pb.rotation_mode = "QUATERNION"
        b = BASE.get(n, (0, 0, 0)); d = p.get(n, (0, 0, 0))
        pb.rotation_quaternion = bq(n, b[0] + d[0], b[1] + d[1], b[2] + d[2])
    pel = rig.pose.bones["pelvis"]
    inv = rig.data.bones["pelvis"].matrix_local.to_3x3().inverted()
    pel.location = inv @ Vector(loc)
def key(frame):
    for n in JOINTS:
        rig.pose.bones[n].keyframe_insert("rotation_quaternion", frame=frame)
    rig.pose.bones["pelvis"].keyframe_insert("location", frame=frame)
def new_action(name):
    a = bpy.data.actions.new(name); a.use_fake_user = True
    if not rig.animation_data: rig.animation_data_create()
    rig.animation_data.action = a
    for pb in rig.pose.bones: pb.rotation_mode = "QUATERNION"; pb.rotation_quaternion = (1, 0, 0, 0); pb.location = (0, 0, 0)
    return a
def mirror(p):
    """左右を入れ替えた姿勢（y と z の向きも反転）"""
    out = {}
    for n, (x, y, z) in p.items():
        m = n[:-1] + ("R" if n.endswith("L") else "L") if n[-1] in "LR" else n
        out[m] = (x, -y, -z)
    return out


# ---------------- 周期的な滑らかな曲線で、要所の姿勢を止まらずにつなぐ ----------------
# Blender の初期設定の曲線は、要所で速さが0になる（動きが一瞬止まる＝カクカク）。
# そこで、要所の姿勢を通る「周期的な3次スプライン」で毎コマの姿勢を計算し、毎コマにキーを打つ。
from scipy.interpolate import CubicSpline
import numpy as np
def scale(p, f):
    """動きにメリハリを付ける：関節ごとに角度を拡大する（f: {関節: (x倍, y倍, z倍)}）"""
    return {n: tuple(v * k for v, k in zip(p[n], f.get(n, (1, 1, 1)))) for n in p}
def cyclic(name, keys, T):
    """keys: [(姿勢, 骨盤の移動)] を等間隔に並べた1周期。T: 1周期のコマ数"""
    new_action(name)
    n = len(keys); ts = np.linspace(0, T, n + 1)
    names = sorted({j for p, _ in keys for j in p})
    def series(get):
        v = np.array([get(k) for k in keys] + [get(keys[0])], float); return CubicSpline(ts, v, bc_type="periodic", axis=0)
    rot = {j: series(lambda k, j=j: k[0].get(j, (0, 0, 0))) for j in names}
    loc = series(lambda k: k[1])
    for f in range(T + 1):
        apply({j: tuple(rot[j](f)) for j in names}, tuple(loc(f))); key(1 + f)
    a = rig.animation_data.action
    for fc in getattr(a, "fcurves", []):
        for kp in fc.keyframe_points: kp.interpolation = "LINEAR"

# ---------------- 歩き（1.1 秒＝33 コマで2歩） ----------------
W_CONTACT = {"pelvis": (0.02, 0.1, 0.0), "chest": (0.04, -0.13, 0.0), "head": (-0.03, 0.04, 0),
             "thighL": (-0.42, 0, -0.02), "shinL": (0.06, 0, 0), "footL": (-0.18, 0, 0),
             "thighR": (0.3, 0, 0.0), "shinR": (0.22, 0, 0), "footR": (0.3, 0, 0),
             "upperArmL": (0.3, 0, 0.03), "foreArmL": (-0.22, 0, 0), "upperArmR": (-0.3, 0, -0.03), "foreArmR": (-0.42, 0, 0), "handL": (-0.1, 0, 0), "handR": (-0.15, 0, 0)}
W_DOWN = {"pelvis": (0.03, 0.06, -0.07), "chest": (0.05, -0.08, 0.05), "head": (-0.03, 0.02, 0),
          "thighL": (-0.28, 0, -0.03), "shinL": (0.3, 0, 0), "footL": (0.0, 0, 0),
          "thighR": (0.18, 0, 0.0), "shinR": (0.75, 0, 0), "footR": (0.25, 0, 0),
          "upperArmL": (0.18, 0, 0.03), "foreArmL": (-0.25, 0, 0), "upperArmR": (-0.18, 0, -0.03), "foreArmR": (-0.38, 0, 0), "handL": (-0.1, 0, 0), "handR": (-0.15, 0, 0)}
W_PASS = {"pelvis": (0.02, 0.0, -0.09), "chest": (0.04, 0.0, 0.06), "head": (-0.02, 0, 0),
          "thighL": (0.0, 0, -0.03), "shinL": (0.05, 0, 0), "footL": (0.0, 0, 0),
          "thighR": (-0.28, 0, 0.04), "shinR": (0.85, 0, 0), "footR": (-0.1, 0, 0),
          "upperArmL": (0.0, 0, 0.04), "foreArmL": (-0.28, 0, 0), "upperArmR": (0.0, 0, -0.04), "foreArmR": (-0.3, 0, 0), "handL": (-0.1, 0, 0), "handR": (-0.15, 0, 0)}
W_UP = {"pelvis": (0.02, -0.05, -0.05), "chest": (0.04, 0.06, 0.03), "head": (-0.02, -0.02, 0),
        "thighL": (0.18, 0, -0.02), "shinL": (0.08, 0, 0), "footL": (0.22, 0, 0),
        "thighR": (-0.45, 0, 0.03), "shinR": (0.4, 0, 0), "footR": (-0.12, 0, 0),
        "upperArmL": (-0.18, 0, 0.03), "foreArmL": (-0.35, 0, 0), "upperArmR": (0.18, 0, -0.03), "foreArmR": (-0.25, 0, 0), "handL": (-0.1, 0, 0), "handR": (-0.15, 0, 0)}
WF = {"pelvis": (1, 1.5, 1.35), "chest": (1, 1.5, 1.2), "upperArmL": (1.3, 1, 1), "upperArmR": (1.3, 1, 1), "thighL": (1.1, 1, 1), "thighR": (1.1, 1, 1)}
half = [(W_CONTACT, -0.005, 0.4), (W_DOWN, -0.032, 1.0), (W_PASS, 0.0, 1.0), (W_UP, 0.02, 0.4)]
keys = [(scale(p, WF), (0.014 * sx, 0, dz)) for p, dz, sx in half] + [(scale(mirror(p), WF), (-0.014 * sx, 0, dz)) for p, dz, sx in half]
# 歩きは、下の loco() で足の軌道から作る（関節の角度だけで作ると足が地面に着かず、スキップのように見えた）

# ---------------- 走り（0.7 秒＝21 コマで2歩） ----------------
R_CONTACT = {"pelvis": (0.2, 0.16, 0.0), "chest": (0.32, -0.22, 0.0), "head": (-0.18, 0.06, 0),
             "thighL": (-0.6, 0, 0), "shinL": (0.25, 0, 0), "footL": (-0.15, 0, 0),
             "thighR": (0.42, 0, 0), "shinR": (0.55, 0, 0), "footR": (0.45, 0, 0),
             "upperArmL": (0.55, 0, 0.12), "foreArmL": (-1.15, 0, 0), "upperArmR": (-0.5, 0, -0.12), "foreArmR": (-1.15, 0, 0), "handL": (-0.2, 0, 0), "handR": (-0.2, 0, 0)}
R_DOWN = {"pelvis": (0.2, 0.08, -0.06), "chest": (0.32, -0.1, 0.05), "head": (-0.2, 0.03, 0),
          "thighL": (-0.32, 0, 0), "shinL": (0.55, 0, 0), "footL": (0.05, 0, 0),
          "thighR": (0.05, 0, 0), "shinR": (1.35, 0, 0), "footR": (0.3, 0, 0),
          "upperArmL": (0.25, 0, 0.12), "foreArmL": (-1.25, 0, 0), "upperArmR": (-0.35, 0, -0.12), "foreArmR": (-1.35, 0, 0), "handL": (-0.2, 0, 0), "handR": (-0.2, 0, 0)}
R_PUSH = {"pelvis": (0.2, -0.04, -0.03), "chest": (0.32, 0.06, 0.02), "head": (-0.18, -0.02, 0),
          "thighL": (0.38, 0, 0), "shinL": (0.2, 0, 0), "footL": (0.55, 0, 0),
          "thighR": (-0.95, 0, 0), "shinR": (1.45, 0, 0), "footR": (-0.1, 0, 0),
          "upperArmL": (-0.4, 0, 0.12), "foreArmL": (-1.1, 0, 0), "upperArmR": (0.45, 0, -0.12), "foreArmR": (-1.2, 0, 0), "handL": (-0.2, 0, 0), "handR": (-0.2, 0, 0)}
R_FLIGHT = {"pelvis": (0.2, -0.12, 0.0), "chest": (0.32, 0.18, 0.0), "head": (-0.18, -0.05, 0),
            "thighL": (0.55, 0, 0), "shinL": (0.95, 0, 0), "footL": (0.4, 0, 0),
            "thighR": (-1.05, 0, 0), "shinR": (1.0, 0, 0), "footR": (-0.15, 0, 0),
            "upperArmL": (-0.5, 0, 0.12), "foreArmL": (-1.15, 0, 0), "upperArmR": (0.6, 0, -0.12), "foreArmR": (-1.15, 0, 0), "handL": (-0.2, 0, 0), "handR": (-0.2, 0, 0)}
RF = {"upperArmL": (1.3, 1, 1), "upperArmR": (1.3, 1, 1), "thighL": (1.08, 1, 1), "thighR": (1.08, 1, 1), "pelvis": (1, 1.25, 1.2), "chest": (1, 1.3, 1)}
half = [(R_CONTACT, -0.012), (R_DOWN, -0.055), (R_PUSH, 0.0), (R_FLIGHT, 0.05)]
keys = [(scale(p, RF), (0, -0.02, dz)) for p, dz in half] + [(scale(mirror(p), RF), (0, -0.02, dz)) for p, dz in half]
# 走りも loco() で作る

# ---------------- IK を使う姿勢（立ち・しゃがみ・片ひざ） ----------------
def world_of(bone_name, tail=True):
    b = rig.data.bones[bone_name]; return rig.matrix_world @ (b.tail_local if tail else b.head_local)
def empty(name, loc):
    e = bpy.data.objects.get(name) or bpy.data.objects.new(name, None)
    if e.name not in sc.collection.objects: sc.collection.objects.link(e)
    e.location = loc; e.rotation_mode = "QUATERNION"; return e
def add_ik(bone, target, pole, chain=2):
    pb = rig.pose.bones[bone]; c = pb.constraints.new("IK"); c.target = target; c.chain_count = chain; c.pole_target = pole
    best = None
    for ang in range(-180, 180, 5):      # ひざ・ひじが極（pole）の方を向く角度を探す
        c.pole_angle = math.radians(ang); bpy.context.view_layer.update()
        mid = rig.matrix_world @ rig.pose.bones[bone].head
        d = (mid - pole.location).length
        if best is None or d < best[0]: best = (d, ang)
    c.pole_angle = math.radians(best[1]); return c
def flat_foot(bone, tilt=0.0):
    """足の向きを世界の中で固定する（足裏を床に沿わせる）。tilt: つま先を下げる角度"""
    pb = rig.pose.bones[bone]; e = empty("rot_" + bone, (0, 0, 0))
    q = (rig.matrix_world @ rig.data.bones[bone].matrix_local).to_quaternion()
    e.rotation_quaternion = Quaternion(Vector((1, 0, 0)), tilt) @ q
    c = pb.constraints.new("COPY_ROTATION"); c.target = e; return e
def bake(a, f0, f1):
    for o in bpy.context.scene.objects: o.select_set(False)
    rig.select_set(True); bpy.context.view_layer.objects.active = rig
    bpy.ops.object.mode_set(mode="POSE"); bpy.ops.pose.select_all(action="SELECT")
    bpy.ops.nla.bake(frame_start=f0, frame_end=f1, only_selected=False, visual_keying=True, clear_constraints=True, use_current_action=True, bake_types={"POSE"})
    bpy.ops.object.mode_set(mode="OBJECT")
def ik_clip(name, frames, setup):
    """setup(frame) が各キーの FK の姿勢・骨盤の位置・目標の位置を決める"""
    a = new_action(name)
    tg = {k: empty("ik_" + k, (0, 0, 0)) for k in ("footL", "footR", "handL", "handR")}
    po = {k: empty("pole_" + k, (0, 0, 0)) for k in ("footL", "footR", "handL", "handR")}
    use = setup(frames[0], tg, po, init=True)
    cons = []
    if "legs" in use:
        cons += [add_ik("shinL", tg["footL"], po["footL"]), add_ik("shinR", tg["footR"], po["footR"])]
        flat_foot("footL", use.get("tiltL", 0)); flat_foot("footR", use.get("tiltR", 0))
    if "armL" in use: cons.append(add_ik("foreArmL", tg["handL"], po["handL"]))
    if "armR" in use: cons.append(add_ik("foreArmR", tg["handR"], po["handR"]))
    for f in frames:
        setup(f, tg, po)
        key(f)
        for e in list(tg.values()) + list(po.values()): e.keyframe_insert("location", frame=f)
    bake(a, frames[0], frames[-1])
    return a

AN_L, AN_R = world_of("shinL"), world_of("shinR")       # 足首（脛の骨の先）
HIP_L, HIP_R = world_of("thighL", False), world_of("thighR", False)

# ---------------- 歩き・走り：足の軌道を先に決め、IK で脚を求める ----------------
# 地面に着いている間は、足は地面に固定（体から見ると一定の速さで後ろへ流れる）。離れている間は弧を描いて前へ運ぶ。
# 着地はかかとから、蹴り出しはつま先で。腰の上下・左右、骨盤のひねり、腕の振りは止まらない滑らかな波で動かす。
import math as _m
def _ease(u): return 0.5 - 0.5 * _m.cos(_m.pi * u)
def aim_bone(name, d_body):
    """関節 name の骨を、胸を基準にした向き d_body（x=左, -y=前, z=上）へ向ける。ねじれは最小に。親（胸・上腕）を先に決めてから呼ぶ"""
    pb = rig.pose.bones[name]; pb.rotation_mode = "QUATERNION"; pb.rotation_quaternion = (1, 0, 0, 0); bpy.context.view_layer.update()
    ch = rig.pose.bones["chest"]
    R = ch.matrix.to_3x3() @ rig.data.bones["chest"].matrix_local.to_3x3().inverted()      # 胸の、安静からの回転
    want = (R @ Vector(d_body)).normalized()
    M = pb.matrix.copy(); q = M.to_3x3().col[1].normalized().rotation_difference(want)
    N = (q.to_matrix() @ M.to_3x3()).to_4x4(); N.translation = M.translation
    pb.matrix = N; bpy.context.view_layer.update()
def swing_arms(p, fwd, back, el_f, el_b, out, tuck, lag=0.0):
    """実際の人の腕の振り（Docs/REFERENCE/hero/gait.md）。足と逆の腕が前へ出る。
       fwd/back: 上腕が肩から前・後ろへ振れる角度, el_f/el_b: 前・後ろでのひじの曲げ, out: 上腕を体の外へ開く角度（手が腰に当たらない）,
       tuck: 前へ出た手が体の中心へ寄る量（中心線は越えない）"""
    for side, sx, ph in (("L", 1, 0.0), ("R", -1, 0.5)):
        c = _m.cos(2 * _m.pi * (p + ph - lag))            # +1＝いちばん後ろ（同じ側の足が前）, -1＝いちばん前
        u = 0.5 - 0.5 * c                                   # 0＝後ろ, 1＝前
        th = -back + (fwd + back) * u                       # 上腕の前後の角度（前が正）
        el = el_b + (el_f - el_b) * u ** 1.3                # ひじは前で深く曲がり、後ろで伸びる
        up = Vector((sx * _m.sin(out), -_m.sin(th) * _m.cos(out), -_m.cos(th) * _m.cos(out)))
        fa = Vector((sx * (_m.sin(out) * 0.6 - tuck * u), -_m.sin(th + el), -_m.cos(th + el))).normalized()
        aim_bone("upperArm" + side, up); aim_bone("foreArm" + side, fa)
        aim_bone("hand" + side, fa + Vector((-sx * 0.12, 0, -0.1)))   # 手は前腕の延長で、力を抜いて少し内へ・下へ
def loco(name, T, fs, D, lift, drop, bob, twist, tilt, shift, lean, arms, run=False, track=0.06):
    """T: 1周期（2歩）のコマ数, fs: 足が地面に着いている割合, D: 着いている間に足が後ろへ流れる距離（＝歩幅）,
       lift: 足を上げる高さ, drop: 骨盤を下げる量, bob: 上下動, twist/tilt/shift: 骨盤のひねり・傾き・左右移動,
       lean: 前傾, arm: 腕の振り, elbow: ひじの曲げ, elbow_fwd: 腕が前のときの追加の曲げ"""
    a = new_action(name)
    tg = {k: empty("ik_" + k, (0, 0, 0)) for k in ("footL", "footR")}
    po = {k: empty("pole_" + k, (0, 0, 0)) for k in ("footL", "footR")}
    rot = {k: empty("rot_" + k, (0, 0, 0)) for k in ("footL", "footR")}
    base_q = {k: (rig.matrix_world @ rig.data.bones[k].matrix_local).to_quaternion() for k in ("footL", "footR")}
    # ひざが向く角度を探す前に、足を少し引き上げてひざが前へ曲がる姿勢を作っておく（目標が原点のままだと、ひざが内側・横へ曲がる）
    apply({}, (0, 0, -drop)); bpy.context.view_layer.update()
    for k, AN, sx in (("footL", AN_L, 1), ("footR", AN_R, -1)):
        tg[k].location = (sx * track, AN.y, AN.z + 0.18); po[k].location = (sx * track * 0.4, AN.y - 1.0, 0.55)
    bpy.context.view_layer.update()
    add_ik("shinL", tg["footL"], po["footL"]); add_ik("shinR", tg["footR"], po["footR"])
    for k in ("footL", "footR"):
        c = rig.pose.bones[k].constraints.new("COPY_ROTATION"); c.target = rot[k]
    for f in range(T + 1):
        p = f / T
        # 骨盤：上下（歩き＝着地で低く片足立ちで高い／走り＝着地の中ほどで低く宙で高い）、左右、ひねり、傾き
        if run: z = -drop - bob * _m.cos(4 * _m.pi * (p - fs / 2))
        else: z = -drop - bob * _m.cos(4 * _m.pi * p)
        x = shift * _m.sin(2 * _m.pi * p)
        tw = twist * _m.cos(2 * _m.pi * p); tl = tilt * _m.sin(2 * _m.pi * p - 0.6)
        pose = {"pelvis": (lean * 0.45, tw, tl), "chest": (lean * 0.55 + 0.012 * _m.cos(4 * _m.pi * p), -tw * 1.1, -tl * 0.7), "head": (-lean * 0.8, tw * 0.15, tl * 0.3)}
        apply(pose, (x, 0, z)); swing_arms(p, *arms)
        for k, ph0, AN, sx in (("footL", 0.0, AN_L, 1), ("footR", 0.5, AN_R, -1)):
            ph = (p + ph0) % 1
            if ph < fs:                         # 地面に着いている：後ろへ一定の速さで流れる
                u = ph / fs; fwd = D / 2 - D * u; up = 0.0
                tiltf = -0.28 * max(0, 1 - u / 0.14) + 0.7 * max(0, (u - 0.68) / 0.32) ** 1.5    # かかとから着地 → つま先で蹴る
                heel = 0.09 * max(0, (u - 0.68) / 0.32) ** 1.5
            else:                               # 離れている：弧を描いて前へ
                u = (ph - fs) / (1 - fs); s = _ease(u)
                back = (0.22 if run else 0.04) * _m.sin(_m.pi * min(1, u * 1.4)) * (1 - u)
                fwd = -D / 2 + D * s - back
                up = lift * _m.sin(_m.pi * u) ** (0.7 if run else 1.0)
                tiltf = 0.7 * (1 - _ease(min(1, u * 1.6))) - 0.28 * _ease(max(0, (u - 0.6) / 0.4)); heel = 0.09 * (1 - min(1, u * 3))
            tx = sx * track                    # 足を置く左右の位置（小さいほど一本の線の上を歩く、女性らしい足運び）
            tg[k].location = (tx, AN.y - fwd, AN.z + up + heel)
            po[k].location = (sx * track * 0.4, AN.y - 1.0, 0.55)   # ひざは内側へ寄せて、まっすぐ前へ
            rot[k].rotation_quaternion = Quaternion(Vector((1, 0, 0)), tiltf) @ base_q[k]
        key(1 + f)
        for e in list(tg.values()) + list(po.values()): e.keyframe_insert("location", frame=1 + f)
        for e in rot.values(): e.keyframe_insert("rotation_quaternion", frame=1 + f)
    for e in list(tg.values()) + list(po.values()) + list(rot.values()):
        if e.animation_data and e.animation_data.action:
            for fc in getattr(e.animation_data.action, "fcurves", []):
                for kp in fc.keyframe_points: kp.interpolation = "LINEAR"
    bake(a, 1, 1 + T)
    return a
# 歩き：1.1 秒（33 コマ）で2歩。歩幅 0.62、ゲームでの速さ ≒ 0.62 / (0.62 × 1.1) ≒ 0.91
# 腕：肩から振り子のように。前へ 約18°・後ろへ 約22°、ひじは後ろでほぼ伸び（12°）前で軽く曲がる（38°）。上腕を 9°外へ開き、手は腰の横を通る
loco("walk", 33, 0.62, 0.56, 0.07, 0.04, 0.012, 0.17, 0.1, 0.035, 0.02, (0.31, 0.38, 0.66, 0.21, 0.16, 0.10, 0.03), track=0.03)
# 走り：0.68 秒（約 20 コマ）で2歩。着いている割合 0.36、歩幅 0.76、ゲームでの速さ ≒ 0.76 / (0.36 × 0.68) ≒ 3.1
# 腕：ひじを 約90°に曲げたまま肩から振る。ひじは後ろへ大きく引き（上腕 50°）、前では手が胸の高さへ。手は体の中心線を越えない
loco("run", 20, 0.36, 0.76, 0.24, 0.085, 0.03, 0.19, 0.06, 0.016, 0.22, (0.38, 0.87, 1.75, 1.3, 0.2, 0.2, 0.0), run=True, track=0.045)
# 立ち：腰に手を当て、体重を左足に。ゆっくり呼吸し、重心を少し揺らす（4 秒＝120 コマ）
def stand(f, tg, po, init=False):
    s = math.sin((f - 1) / 120 * 2 * math.pi); br = math.sin((f - 1) / 60 * 2 * math.pi)
    apply({"pelvis": (0, 0.06 + 0.02 * s, 0.075 + 0.012 * s), "chest": (-0.04 + 0.015 * br, -0.05, -0.085 - 0.01 * s), "head": (0.03, -0.08, 0.06),
           "handL": (0.25, 0, 0.2), "handR": (0.25, 0, -0.2)}, (0.022 + 0.004 * s, 0, -0.008))
    tg["footL"].location = (AN_L.x - 0.02, AN_L.y, AN_L.z); tg["footR"].location = (AN_R.x + 0.035, AN_R.y + 0.03, AN_R.z)
    po["footL"].location = (AN_L.x + 0.05, AN_L.y - 0.6, 0.55); po["footR"].location = (AN_R.x - 0.1, AN_R.y - 0.6, 0.55)
    hz = HIP_L.z + 0.07 + 0.003 * br
    tg["handL"].location = (0.175, 0.0, hz); tg["handR"].location = (-0.175, 0.0, hz)
    po["handL"].location = (0.5, 0.25, 1.25); po["handR"].location = (-0.5, 0.25, 1.25)
    return {"legs": 1, "armL": 1, "armR": 1}
ik_clip("idle", [1, 31, 61, 91, 121], stand)
# しゃがみ：深くしゃがみ、両手を胸の前で合わせる（2 秒のループ、呼吸だけ）
def squat(f, tg, po, init=False):
    br = math.sin((f - 1) / 60 * 2 * math.pi)
    apply({"pelvis": (0.3, 0, 0), "chest": (0.42 + 0.015 * br, 0, 0), "head": (-0.5, 0, 0), "handL": (0.1, 0, -0.3), "handR": (0.1, 0, 0.3)}, (0, 0.14, -0.47 + 0.004 * br))
    tg["footL"].location = (AN_L.x + 0.05, AN_L.y - 0.02, AN_L.z); tg["footR"].location = (AN_R.x - 0.05, AN_R.y - 0.02, AN_R.z)
    po["footL"].location = (0.45, -0.9, 0.5); po["footR"].location = (-0.45, -0.9, 0.5)
    tg["handL"].location = (0.035, -0.33, 0.8); tg["handR"].location = (-0.035, -0.33, 0.8)
    po["handL"].location = (0.7, -0.2, 0.3); po["handR"].location = (-0.7, -0.2, 0.3)
    return {"legs": 1, "armL": 1, "armR": 1}
ik_clip("squat", [1, 31, 61], squat)
# 片ひざ立ち：右ひざを床に、左足は前に。左手は左ひざに、右手は前の床へ（スキャンの姿勢）
def crouch(f, tg, po, init=False):
    br = math.sin((f - 1) / 60 * 2 * math.pi)
    apply({"pelvis": (0.1, 0.25, 0.0), "chest": (0.45 + 0.012 * br, -0.15, 0.05), "head": (-0.25, -0.1, 0), "handR": (0.3, 0, 0), "handL": (0.2, 0, 0)}, (0, 0.04, -0.6 + 0.003 * br))
    tg["footL"].location = (AN_L.x - 0.02, AN_L.y - 0.32, AN_L.z); tg["footR"].location = (AN_R.x + 0.02, AN_R.y + 0.36, AN_R.z + 0.05)
    po["footL"].location = (0.3, -1.2, 0.8); po["footR"].location = (-0.2, -1.0, 0.1)
    kL = Vector((AN_L.x - 0.02, AN_L.y - 0.36, 0.5))
    tg["handL"].location = kL + Vector((0.01, 0.03, 0.03)); tg["handR"].location = (-0.08, -0.5, 0.05)
    po["handL"].location = (0.6, 0.4, 0.9); po["handR"].location = (-0.5, 0.2, 0.9)
    return {"legs": 1, "armL": 1, "armR": 1, "tiltR": 0.9}
ik_clip("crouch", [1, 31, 61], crouch)
# ---------------- 泳ぎ（体液の中）：ゲーム側で体を腰を中心に前へ倒して水平にする ----------------
# swim … 平泳ぎ風の1かき（1.6 秒＝48 コマ）：伸び → かき → 引きつけ（脚を曲げる）→ けり出し＋腕を前へ。ひざはそろえたまま（ガニ股にしない）
def both(p):
    """左側だけ書いた姿勢を、右側にも左右対称に写す"""
    out = dict(p); out.update(mirror({k: v for k, v in p.items() if k.endswith("L")})); return out
S_GLIDE = both({"pelvis": (0.0, 0, 0), "chest": (0.1, 0, 0), "head": (0.25, 0, 0),
                "upperArmL": (-2.85, 0, -0.12), "foreArmL": (-0.05, 0, 0), "handL": (0.0, 0, 0),
                "thighL": (0.06, 0, 0.04), "shinL": (0.06, 0, 0), "footL": (0.55, 0, 0)})
S_PULL = both({"pelvis": (0.02, 0, 0), "chest": (0.02, 0, 0), "head": (0.12, 0, 0),
               "upperArmL": (-1.9, 0, 0.85), "foreArmL": (-0.55, 0, 0), "handL": (-0.25, 0, 0),
               "thighL": (0.0, 0, 0.03), "shinL": (0.15, 0, 0), "footL": (0.5, 0, 0)})
S_DRAW = both({"pelvis": (0.0, 0, 0), "chest": (-0.02, 0, 0), "head": (0.0, 0, 0),
               "upperArmL": (-0.75, 0, 0.25), "foreArmL": (-2.0, 0, 0), "handL": (-0.2, 0, 0),
               "thighL": (-0.5, 0, 0.08), "shinL": (1.95, 0, 0), "footL": (-0.35, 0, 0)})
S_KICK = both({"pelvis": (0.0, 0, 0), "chest": (0.06, 0, 0), "head": (0.18, 0, 0),
               "upperArmL": (-2.2, 0, -0.05), "foreArmL": (-0.7, 0, 0), "handL": (0.0, 0, 0),
               "thighL": (0.12, 0, 0.06), "shinL": (0.45, 0, 0), "footL": (0.25, 0, 0)})
cyclic("swim", [(S_GLIDE, (0, 0, 0)), (S_GLIDE, (0, 0, 0.01)), (S_PULL, (0, 0, 0.02)), (S_DRAW, (0, 0.04, 0.0)), (S_KICK, (0, 0.02, -0.01)), (S_GLIDE, (0, 0, -0.005))], 48)
# float … その場でただよう（3 秒＝90 コマ）：腕を横に開いて手のひらでゆっくり水をかき、脚は交互にゆるく自転車をこぐ
F_A = {"pelvis": (-0.05, 0.03, 0), "chest": (0.03, -0.03, 0), "head": (0.05, 0, 0),
       "upperArmL": (-0.35, 0.3, 0.95), "foreArmL": (-0.55, 0, 0), "handL": (0.2, 0, 0.15),
       "upperArmR": (-0.25, -0.3, -0.85), "foreArmR": (-0.75, 0, 0), "handR": (0.2, 0, -0.15),
       "thighL": (-0.55, 0, 0.05), "shinL": (0.95, 0, 0), "footL": (0.45, 0, 0),
       "thighR": (-0.2, 0, -0.05), "shinR": (0.45, 0, 0), "footR": (0.5, 0, 0)}
F_B = mirror(F_A)
cyclic("float", [(F_A, (0, 0, 0.02)), (F_B, (0, 0, -0.02))], 90)

for e in [o for o in bpy.data.objects if o.name.startswith(("ik_", "pole_", "rot_"))]: bpy.data.objects.remove(e)
for a in [a for a in bpy.data.actions if a.name.startswith(("ik_", "pole_", "rot_"))]: bpy.data.actions.remove(a)

# ---------------- 書き出し ----------------
rig.animation_data.action = None
for pb in rig.pose.bones: pb.rotation_quaternion = (1, 0, 0, 0); pb.location = (0, 0, 0)
for o in bpy.context.scene.objects: o.select_set(o.type in ("MESH", "ARMATURE", "EMPTY"))
bpy.context.view_layer.objects.active = rig
bpy.ops.export_scene.gltf(filepath=os.path.join(L.OUT_MODELS, "diver.raw.glb"), export_format="GLB", use_selection=True, export_skins=True,
                          export_animations=True, export_animation_mode="ACTIONS", export_force_sampling=True, export_frame_step=1,
                          export_yup=True, export_apply=False, export_attributes=False, export_vertex_color="NAME", export_vertex_color_name="Col", export_all_vertex_colors=False)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(L.OUT_MODELS, "diver_anim.blend"))
print("ANIMS", [a.name for a in bpy.data.actions], "OK")
