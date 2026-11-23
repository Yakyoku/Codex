"""水晶体線維細胞（区域B）。形の仕様書: Docs/REFERENCE/atlas/lens_fiber.md
   断面は平たい六角形（幅 10µm × 厚み 2µm、広い面 7µm・狭い面4つ）、長さ方向は画面の端まで続く帯として 40µm の一節を作る。
   ヒトの外側の皮質は表面がなめらかで、ボール・ソケット（頭の直径 0.5〜2µm の丸い突起。首がある）は少ない → 一節に数個だけ。
   もう1つ：凝集したクリスタリンの粒（50〜500nm。区域Bの濁りのもと）を、小さな多面体で。
   出力: assets/models/lens.raw.glb, assets/preview/lens_*.jpg"""
import sys, os, json, math
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np, bpy
import irlib as L

LEN, WID, TH, BROAD = 40.0, 10.0, 2.0, 7.0

def fiber(name, nseg=40, seed=1):
    rng = np.random.default_rng(seed)
    # 六角形の断面（y=幅, z=厚み）。角は少し丸める（各角を2点に）
    hx = [(-BROAD / 2, TH / 2), (BROAD / 2, TH / 2), (WID / 2, 0), (BROAD / 2, -TH / 2), (-BROAD / 2, -TH / 2), (-WID / 2, 0)]
    ring = []
    for i in range(6):
        a, b, c = np.array(hx[i - 1]), np.array(hx[i]), np.array(hx[(i + 1) % 6])
        ring.append(b + (a - b) * 0.08); ring.append(b + (c - b) * 0.08)
    ring = np.array(ring); n = len(ring)
    verts, faces, uvs = [], [], []
    for k in range(nseg + 1):
        x = -LEN / 2 + LEN * k / nseg
        # ゆるいうねり（線維は弧を描き、膜はわずかに波打つ）
        wob = 0.06 * math.sin(x * 0.4 + seed) 
        for j, (y, z) in enumerate(ring):
            verts.append((x, y * (1 + 0.01 * math.sin(x * 0.7 + j)), z + wob)); uvs.append((k / nseg, j / n))
    for k in range(nseg):
        for j in range(n):
            a, b = k * n + j, k * n + (j + 1) % n
            faces.append((a, b, b + n, a + n))
    ob = L.mesh_object(name, np.array(verts), faces, np.array(uvs), smooth=True)
    parts = [ob]
    # ボール・ソケット：広い面（上下）に少し、狭い面にさらに少し。丸い頭＋細い首
    for i in range(7):
        top = rng.random() < 0.5; x = rng.uniform(-LEN / 2 + 2, LEN / 2 - 2); y = rng.uniform(-BROAD / 2 + 0.8, BROAD / 2 - 0.8)
        r = rng.uniform(0.25, 0.8); zs = 1 if top else -1
        bpy.ops.mesh.primitive_uv_sphere_add(segments=14, ring_count=8, radius=r, location=(x, y, zs * (TH / 2 + r * 0.9)))
        head = bpy.context.object
        bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=r * 0.45, depth=r * 1.2, location=(x, y, zs * (TH / 2 + r * 0.3)))
        neck = bpy.context.object
        parts += [head, neck]
    L.select_only(ob)
    for p in parts[1:]: p.select_set(True)
    bpy.context.view_layer.objects.active = ob; bpy.ops.object.join()
    bpy.ops.object.shade_smooth()
    return ob

def grain(name):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.5)
    g = bpy.context.object; g.name = name
    # 不ぞろいなかたまり（形を崩したタンパクの集まり）
    rng = np.random.default_rng(3)
    for v in g.data.vertices: v.co *= rng.uniform(0.75, 1.2)
    return g

def mat(name, col, rough, alpha):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*col, 1); b.inputs["Roughness"].default_value = rough
    if "Transmission Weight" in b.inputs: b.inputs["Transmission Weight"].default_value = 1 - alpha
    if "IOR" in b.inputs: b.inputs["IOR"].default_value = 1.39
    return m

L.reset()
fibers = [fiber(f"fiber{i}", seed=i + 1) for i in range(3)]   # 3通りの節（並べたときに同じ形がくり返して見えないように）
fm = mat("fiber", (0.95, 0.93, 0.9), 0.15, 0.1)
for f in fibers: f.data.materials.append(fm)
g = grain("grain"); g.data.materials.append(mat("grain", (0.9, 0.88, 0.85), 0.6, 1))
L.render_views(fibers[:1], "lens_fiber", 22, res=512, samples=24)
size = L.export_glb(fibers + [g], os.path.join(L.OUT_MODELS, "lens.raw.glb"))
print("STATS " + json.dumps({"raw_bytes": size, "tris": [sum(len(p.vertices) - 2 for p in f.data.polygons) for f in fibers]}))
