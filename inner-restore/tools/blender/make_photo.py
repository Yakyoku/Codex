"""区域C：視細胞の森と、病巣の核（黄斑の中心）。形の仕様書: Docs/REFERENCE/atlas/rod.md, cone.md, rpe.md
   rod   … 桿体：外節（直径 2µm・長さ 25µm、先は丸い）→ 結合線毛（細い首 約 1µm）→ 内節（直径 2µm・長さ 18µm。外節寄りの半分がエリプソイド）
   cone  … 錐体（周辺部）：内節は樽〜とっくり形（直径 約 6µm）、外節は先へ細くなる円錐（長さ 約 15µm）
   fcone … 中心窩の錐体：直径 約 2µm、外節 約 35µm の細く長い円柱（桿体によく似る）
   rpe   … 網膜色素上皮：六角形の柱（幅 14µm、高さ 12µm）。頂部に細い微絨毛
   drusen… ドルーゼン：色素上皮の下にたまる沈着物。上の層を押し上げる、低いドーム
   すべて y 方向（Blender の z）が上。色素上皮側（下）から硝子体側（上）へ。出力: assets/models/photo.raw.glb"""
import sys, os, json, math
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np, bpy
import irlib as L

def lathe(name, prof, seg=18):
    """prof: [(高さ z, 半径 r)] を z 軸まわりに回す。uv の v は高さの割合"""
    zs = [p[0] for p in prof]; z0, z1 = min(zs), max(zs)
    verts, faces, uvs = [], [], []
    for i, (z, r) in enumerate(prof):
        for j in range(seg):
            a = 2 * math.pi * j / seg; verts.append((r * math.cos(a), r * math.sin(a), z)); uvs.append((j / seg, (z - z0) / (z1 - z0)))
    n = len(prof)
    for i in range(n - 1):
        for j in range(seg):
            a, b = i * seg + j, i * seg + (j + 1) % seg; faces.append((a, b, b + seg, a + seg))
    # 上下のふた
    verts.append((0, 0, prof[0][0])); uvs.append((0.5, 0)); c0 = len(verts) - 1
    verts.append((0, 0, prof[-1][0])); uvs.append((0.5, 1)); c1 = len(verts) - 1
    for j in range(seg):
        faces.append((c0, (j + 1) % seg, j)); faces.append((c1, (n - 1) * seg + j, (n - 1) * seg + (j + 1) % seg))
    return L.mesh_object(name, np.array(verts), faces, np.array(uvs))

def rounded(z0, z1, r, cap=0.8, k=6):
    out = [(z0 + cap * (1 - math.cos(t * math.pi / 2)), r * math.sin(t * math.pi / 2) + 0.001) for t in np.linspace(0, 1, k)]
    return out

L.reset()
# 桿体：下（色素上皮側）が外節の先
rod_prof = rounded(0, 0, 1.0, 0.8)[:] + [(12, 1.0), (24.2, 1.0), (25, 0.75), (25.3, 0.32), (26.2, 0.3), (26.6, 0.8), (27.2, 1.02), (35, 1.05), (44, 0.98), (44.8, 0.7), (45.3, 0.2)]
rod = lathe("rod", rod_prof, 14)
cone_prof = [(0, 0.05), (0.4, 0.55), (8, 1.0), (14.6, 1.5), (15.1, 0.5), (15.6, 0.45), (16.2, 1.8), (18, 2.8), (22, 3.1), (27, 2.8), (31, 2.0), (33, 1.4), (34, 0.3)]
cone = lathe("cone", cone_prof, 18)
fcone_prof = rounded(0, 0, 0.9, 0.7) + [(20, 0.9), (34.5, 0.95), (35.2, 0.4), (36.2, 0.35), (36.8, 0.9), (48, 1.0), (49, 0.3)]
fcone = lathe("fcone", fcone_prof, 12)
# 色素上皮：六角柱＋頂部の微絨毛（細い突起）
bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=8.0, depth=12, location=(0, 0, -6))
rpe = bpy.context.object; rpe.name = "rpe"
bpy.ops.object.modifier_add(type="BEVEL"); rpe.modifiers[-1].width = 0.8; rpe.modifiers[-1].segments = 3; bpy.ops.object.modifier_apply(modifier=rpe.modifiers[-1].name)
rng = np.random.default_rng(5); parts = []
for i in range(60):
    a, r = rng.uniform(0, 2 * math.pi), 6.6 * math.sqrt(rng.uniform(0, 1)); h = rng.uniform(1.2, 2.6)
    bpy.ops.mesh.primitive_cylinder_add(vertices=5, radius=0.13, depth=h, location=(r * math.cos(a), r * math.sin(a), h / 2)); parts.append(bpy.context.object)
L.select_only(rpe); [p.select_set(True) for p in parts]; bpy.context.view_layer.objects.active = rpe; bpy.ops.object.join(); bpy.ops.object.shade_smooth()
# ドルーゼン：低いドーム（半径 1 の単位形。ゲーム側で大きさを決める）
bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, radius=1.0)
dr = bpy.context.object; dr.name = "drusen"
for v in dr.data.vertices:
    if v.co.z < 0: v.co.z = 0
    v.co.z *= 0.55; v.co *= 1 + 0.06 * math.sin(v.co.x * 9) * math.cos(v.co.y * 7)
bpy.ops.object.shade_smooth()
objs = [rod, cone, fcone, rpe, dr]
m = bpy.data.materials.new("cell"); m.use_nodes = True
for o in objs: o.data.materials.append(m)
L.render_views([rod, cone, fcone], "photo", 30, res=512, samples=16)
size = L.export_glb(objs, os.path.join(L.OUT_MODELS, "photo.raw.glb"))
print("STATS " + json.dumps({"raw_bytes": size, "tris": {o.name: sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objs}}))
