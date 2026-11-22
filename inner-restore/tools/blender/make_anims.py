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
new_action("walk")
T = 33
for i, (p, dz) in enumerate([(W_CONTACT, -0.005), (W_DOWN, -0.03), (W_PASS, 0.0), (W_UP, 0.018)]):
    for half in (0, 1):
        f = 1 + half * T / 2 + i * T / 8
        apply(p if half == 0 else mirror(p), (0.012 * (1 if half == 0 else -1) * (1 if i in (1, 2) else 0.4), 0, dz)); key(f)
apply(W_CONTACT, (0.005, 0, -0.005)); key(1 + T)

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
new_action("run")
T = 21
for i, (p, dz) in enumerate([(R_CONTACT, -0.01), (R_DOWN, -0.05), (R_PUSH, 0.0), (R_FLIGHT, 0.045)]):
    for half in (0, 1):
        f = 1 + half * T / 2 + i * T / 8
        apply(p if half == 0 else mirror(p), (0, -0.02, dz)); key(f)
apply(R_CONTACT, (0, -0.02, -0.01)); key(1 + T)

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
    for ang in range(-180, 180, 15):      # ひざ・ひじが極（pole）の方を向く角度を探す
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
