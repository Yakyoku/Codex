"""赤血球（erythrocyte）。形の仕様書: Docs/REFERENCE/atlas/rbc.md
   形は Evans & Fung (1972) の実測式による両凹円盤。単位はマイクロメートル（1 unit = 1 µm）。
   出力: assets/models/rbc.raw.glb（LOD0〜2 を1ファイルに）, assets/textures/rbc_orm.png(R=AO,G=厚み), assets/preview/rbc.jpg"""
import sys, os, json, time
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np, bpy
import irlib as L

R0 = 3.91                      # 半径 µm（直径 7.82）
C0, C1, C2 = 0.207, 2.003, -1.123


def half_h(x):                 # 中心からの相対半径 x(0..1) → 片側の高さ µm
    return 0.5 * R0 * np.sqrt(np.clip(1 - x * x, 0, 1)) * (C0 + C1 * x * x + C2 * x ** 4)


def build(name, seg, rings):
    # 縁で細かくなるよう余弦で半径を配る
    t = np.linspace(0, 1, rings + 1)
    x = np.sin(t * np.pi / 2) ** 0.85
    x[-1] = 1.0
    verts, uvs, thick = [], [], []
    def add(v, uv, th):
        verts.append(v); uvs.append(uv); thick.append(th); return len(verts) - 1
    tmax = 2 * half_h(np.linspace(0, 1, 400)).max()
    top = [[None] * seg for _ in range(rings + 1)]
    bot = [[None] * seg for _ in range(rings + 1)]
    for i, xi in enumerate(x):
        h = float(half_h(xi)); th = 2 * h / tmax
        for j in range(seg):
            a = 2 * np.pi * j / seg
            cx, cy = np.cos(a) * xi, np.sin(a) * xi
            if i == 0 and j > 0:
                top[i][j] = top[i][0]; bot[i][j] = bot[i][0]; continue
            top[i][j] = add((cx * R0, cy * R0, h), (0.25 + cx * 0.235, 0.5 + cy * 0.47), th)
            if i == rings:   # 赤道は上下で頂点を共有しない（UV の継ぎ目）が位置は同じ
                bot[i][j] = add((cx * R0, cy * R0, -h), (0.75 + cx * 0.235, 0.5 + cy * 0.47), th)
            else:
                bot[i][j] = add((cx * R0, cy * R0, -h), (0.75 + cx * 0.235, 0.5 + cy * 0.47), th)
    faces = []
    for i in range(rings):
        for j in range(seg):
            j2 = (j + 1) % seg
            for grid, flip in ((top, False), (bot, True)):
                a, b, c, d = grid[i][j], grid[i + 1][j], grid[i + 1][j2], grid[i][j2]
                f = [a, b, c] if i == 0 else [a, b, c, d]
                faces.append(f[::-1] if flip else f)
    ob = L.mesh_object(name, np.array(verts), faces, np.array(uvs), attrs={"thickness": thick})
    # 赤道の重複頂点を位置で結合（UV は loop に残る）
    L.select_only(ob)
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.remove_doubles(threshold=1e-5)
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode="OBJECT")
    return ob


def rbc_material():
    m = bpy.data.materials.new("rbc")
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (0.42, 0.035, 0.03, 1)
    b.inputs["Roughness"].default_value = 0.32
    for k, v in (("Transmission Weight", 0.35), ("Subsurface Weight", 0.6), ("Coat Weight", 0.4), ("Coat Roughness", 0.15)):
        if k in b.inputs: b.inputs[k].default_value = v
    if "Subsurface Radius" in b.inputs: b.inputs["Subsurface Radius"].default_value = (1.2, 0.25, 0.15)
    if "Subsurface Scale" in b.inputs: b.inputs["Subsurface Scale"].default_value = 0.8
    return m


def main():
    stats = {}
    L.reset()
    mat = rbc_material()
    hi = build("rbc_lod0", 96, 28)
    hi.data.materials.append(mat)
    size = 512
    ao = L.new_image("ao", size, (1, 1, 1, 1))
    th = L.new_image("th", size, (0, 0, 0, 1))
    stats["bake_ao_s"] = round(L.bake(hi, ao, "AO", samples=48), 1)
    stats["bake_thickness_s"] = round(L.bake(hi, th, "ATTR", samples=1, attr="thickness"), 1)
    a, t = L.image_to_np(ao), L.image_to_np(th)
    orm = np.stack([a[..., 0], t[..., 0], np.zeros_like(a[..., 0])], -1)
    L.save_png(orm, os.path.join(L.OUT_TEX, "rbc_orm.png"))
    t0 = time.time()
    L.render_views([hi], "rbc", R0, res=512, samples=48)
    stats["preview_s"] = round(time.time() - t0, 1)
    stats["lod0_tris"] = sum(len(p.vertices) - 2 for p in hi.data.polygons)
    objs = [hi]
    for i, (seg, rings) in enumerate(((40, 10), (16, 5)), start=1):
        ob = build(f"rbc_lod{i}", seg, rings)
        ob.data.materials.append(mat)
        stats[f"lod{i}_tris"] = sum(len(p.vertices) - 2 for p in ob.data.polygons)
        objs.append(ob)
    stats["raw_bytes"] = L.export_glb(objs, os.path.join(L.OUT_MODELS, "rbc.raw.glb"))
    stats["diameter_um"] = 2 * R0
    stats["center_thickness_um"] = round(float(2 * half_h(0.0)), 3)
    xs = np.linspace(0, 1, 2000); hs = 2 * half_h(xs)
    stats["max_thickness_um"] = round(float(hs.max()), 3)
    stats["max_thickness_at_r_um"] = round(float(xs[hs.argmax()] * R0), 3)
    print("STATS " + json.dumps(stats))


main()
