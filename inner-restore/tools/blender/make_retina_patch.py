"""網膜の内側の面の一区画（M1）。形の仕様: Docs/REFERENCE/atlas/retinal_capillary.md, endothelial_cell.md, pericyte.md
   単位 µm。y が上（硝子体側）。出力:
     assets/models/retina.raw.glb（ilm=内境界膜の面, vessel=毛細血管の壁, pericyte=周皮細胞）
     public/static/data/retina.json（血管の中心線・経路・核と周皮細胞の位置。流れと当たり判定に使う）
     assets/preview/retina.jpg"""
import sys, os, json, math
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np, bpy
import irlib as L

W, D = 150.0, 110.0            # 区画の広さ µm
R_OUT, R_LUMEN = 3.0, 2.6      # 毛細血管の外半径・内腔の半径（内径 5.2µm）
Y_VESSEL = -3.1                # 血管の中心の深さ（内境界膜のすぐ下の浅い毛細血管網）
SEG = 18
rng = np.random.default_rng(11)

NODES = {"A": (-78, -14), "B": (-40, -6), "C": (-10, -28), "D": (-6, 20), "E": (30, -18), "F": (32, 26), "H": (54, 4), "G": (78, 8)}
EDGES = [("A", "B"), ("B", "C"), ("B", "D"), ("C", "D"), ("C", "E"), ("D", "F"), ("E", "H"), ("F", "H"), ("H", "G")]
ROUTES = [[0, 1, 4, 6, 8], [0, 2, 5, 7, 8], [0, 1, 3, 5, 7, 8]]


def base_height(x, z):
    return 0.35 * np.sin(x * 0.09 + 1.3) * np.cos(z * 0.11) + 0.2 * np.sin(x * 0.23 + z * 0.17)


def catmull(pts, step=1.0):
    pts = np.array(pts, dtype=float)
    p = np.vstack([2 * pts[0] - pts[1], pts, 2 * pts[-1] - pts[-2]])
    out = []
    for i in range(1, len(p) - 2):
        p0, p1, p2, p3 = p[i - 1], p[i], p[i + 1], p[i + 2]
        n = max(2, int(np.linalg.norm(p2 - p1) / 0.25))
        for t in np.linspace(0, 1, n, endpoint=False):
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    out.append(pts[-1])
    out = np.array(out)
    d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(out, axis=0), axis=1))]
    s = np.arange(0, d[-1], step)
    s = np.r_[s, d[-1]] if d[-1] - s[-1] > 0.3 else s
    return np.stack([np.interp(s, d, out[:, k]) for k in range(out.shape[1])], 1)


def edge_curve(a, b):
    a, b = np.array(NODES[a], float), np.array(NODES[b], float)
    v = b - a; n = np.array([-v[1], v[0]]) / np.linalg.norm(v)
    ctrl = [a]
    for t in (0.3, 0.62):
        ctrl.append(a + v * t + n * rng.uniform(-5.5, 5.5))
    ctrl.append(b)
    xz = catmull(ctrl)
    y = Y_VESSEL + 0.5 * np.sin(xz[:, 0] * 0.07 + xz[:, 1] * 0.05)
    return np.stack([xz[:, 0], y, xz[:, 1]], 1)


def frames(P):
    T = np.gradient(P, axis=0); T /= np.linalg.norm(T, axis=1)[:, None]
    up = np.array([0, 1.0, 0])
    Nn = up - T * (T @ up)[:, None]; Nn /= np.linalg.norm(Nn, axis=1)[:, None]
    B = np.cross(T, Nn)
    return T, Nn, B


def tube(P, radius_fn, uscale=0.1, cap=True):
    T, Nn, B = frames(P)
    n = len(P); verts, uvs, idx = [], [], []
    arc = np.r_[0, np.cumsum(np.linalg.norm(np.diff(P, axis=0), axis=1))]
    for i in range(n):
        for j in range(SEG + 1):
            a = 2 * np.pi * j / SEG
            r = radius_fn(i, a, arc[i])
            verts.append(P[i] + (Nn[i] * np.cos(a) + B[i] * np.sin(a)) * r)
            uvs.append((arc[i] * uscale, j / SEG))
    for i in range(n - 1):
        for j in range(SEG):
            a0 = i * (SEG + 1) + j
            idx.append((a0, a0 + 1, a0 + SEG + 2, a0 + SEG + 1))
    return np.array(verts), np.array(uvs), idx, arc


def main():
    L.reset()
    curves = [edge_curve(a, b) for a, b in EDGES]
    V, UV, F, COL = [], [], [], []
    nuclei, pericytes = [], []
    PV, PF = [], []
    off = 0
    for ei, P in enumerate(curves):
        arc = np.r_[0, np.cumsum(np.linalg.norm(np.diff(P, axis=0), axis=1))]
        total = arc[-1]
        # 内皮細胞の核：約 28µm ごとに1つ。核の所だけ壁が厚くふくらむ（長さ約 7µm、ふくらみ 0.7µm）
        ncl = [(s, rng.uniform(0, 2 * np.pi)) for s in np.arange(rng.uniform(8, 16), total - 6, rng.uniform(24, 32))]
        def rf(i, a, s, ncl=ncl):
            r = R_OUT + 0.06 * np.sin(s * 0.9 + a * 2)
            for (s0, a0) in ncl:
                da = (a - a0 + np.pi) % (2 * np.pi) - np.pi
                r += 0.0 * da  # 核は内腔側へ盛り上がる（資料で確認）ので、外側の面はふくらませない。核は色の濃さ（頂点色 R）で示す
            return r
        v, uv, f, _ = tube(P, rf)
        col = np.zeros((len(v), 3), dtype=np.float32)
        T, Nn, B = frames(P)
        k = 0
        for i in range(len(P)):
            for j in range(SEG + 1):
                a = 2 * np.pi * j / SEG; w = 0
                for (s0, a0) in ncl:
                    da = (a - a0 + np.pi) % (2 * np.pi) - np.pi
                    w = max(w, math.exp(-((arc[i] - s0) / 3.2) ** 2 - (da / 0.75) ** 2))
                col[k] = (w, ei / 16.0, arc[i] / 128.0); k += 1   # R=核, G=区間番号, B=区間内の位置
        V.append(v); UV.append(uv); COL.append(col); F += [tuple(x + off for x in q) for q in f]; off += len(v)
        for (s0, a0) in ncl:
            i = int(np.argmin(abs(arc - s0)))
            c = P[i] + (Nn[i] * np.cos(a0) + B[i] * np.sin(a0)) * (R_OUT + 0.3)
            nuclei.append({"edge": ei, "s": round(float(s0), 2), "p": [round(float(x), 2) for x in c]})
        # 周皮細胞：約 34µm ごと。細胞体は血管の外側の「こぶ」（長さ約 7µm・高さ約 2.2µm）。
        # 一次突起が血管の長さ方向へ伸び、細い二次突起が周方向へ巻き付く。
        for s0 in np.arange(rng.uniform(14, 24), total - 10, rng.uniform(30, 38)):
            a0 = rng.uniform(-1.0, 1.0)            # 上側（見える側）寄り
            i0 = int(np.argmin(abs(arc - s0)))
            body_c = P[i0] + (Nn[i0] * np.cos(a0) + B[i0] * np.sin(a0)) * (R_OUT + 0.35)
            pericytes.append({"edge": ei, "s": round(float(s0), 2), "p": [round(float(x), 2) for x in body_c]})
            # 細胞体（つぶれた楕円体）
            nu, nv = 14, 9
            base = len(PV)
            for a in range(nv + 1):
                th = np.pi * a / nv
                for b in range(nu):
                    ph = 2 * np.pi * b / nu
                    loc = np.array([3.4 * np.sin(th) * np.cos(ph), 0.95 * np.cos(th), 1.7 * np.sin(th) * np.sin(ph)])
                    radial = Nn[i0] * np.cos(a0) + B[i0] * np.sin(a0)
                    side = np.cross(T[i0], radial)
                    PV.append(body_c + T[i0] * loc[0] + radial * loc[1] + side * loc[2])
            for a in range(nv):
                for b in range(nu):
                    b2 = (b + 1) % nu
                    PF.append((base + a * nu + b, base + (a + 1) * nu + b, base + (a + 1) * nu + b2, base + a * nu + b2))
            # 突起（血管の表面に沿う細い帯）。断面は半円に近い低い山。
            def ribbon(pts_sa, width, height):
                nonlocal PV, PF
                base = len(PV); m = 5
                for (s, a) in pts_sa:
                    i = int(np.clip(np.searchsorted(arc, s), 0, len(P) - 1))
                    for q in range(m):
                        t = q / (m - 1)
                        da = (t - 0.5) * width / R_OUT
                        h = height * np.sin(np.pi * t) ** 0.7
                        rad = Nn[i] * np.cos(a + da) + B[i] * np.sin(a + da)
                        PV.append(P[i] + rad * (R_OUT + 0.04 + h))
                for k in range(len(pts_sa) - 1):
                    for q in range(m - 1):
                        PF.append((base + k * m + q, base + k * m + q + 1, base + (k + 1) * m + q + 1, base + (k + 1) * m + q))
            for sign in (-1, 1):
                ln = rng.uniform(13, 20)
                ss = np.arange(0, ln, 0.6)
                drift = rng.uniform(-0.03, 0.03)
                pts = [(float(np.clip(s0 + sign * (2.5 + s), 0, total)), a0 + drift * s + 0.25 * np.sin(s * 0.5)) for s in ss]
                ribbon(pts, 0.62, 0.2)
                # 二次突起（周方向の指）
                for sc in np.arange(3.0, ln - 1, rng.uniform(2.6, 3.6)):
                    sA = float(np.clip(s0 + sign * (2.5 + sc), 0, total))
                    aA = a0 + drift * sc + 0.25 * np.sin(sc * 0.5)
                    for dirn in (-1, 1):
                        span = rng.uniform(1.0, 1.9)
                        aa = np.linspace(0, span, 9)
                        # 周方向に進む帯：幅の向きを長さ方向にするため、s を少しずつずらした点列で作る
                        base = len(PV); m = 4
                        for k, da in enumerate(aa):
                            wdt = 0.34 * (1 - 0.6 * k / len(aa))
                            for q in range(m):
                                t = q / (m - 1)
                                s = float(np.clip(sA + (t - 0.5) * wdt, 0, total))
                                i = int(np.clip(np.searchsorted(arc, s), 0, len(P) - 1))
                                ang = aA + dirn * da
                                rad = Nn[i] * np.cos(ang) + B[i] * np.sin(ang)
                                PV.append(P[i] + T[i] * (s - arc[i]) + rad * (R_OUT + 0.03 + 0.12 * np.sin(np.pi * t)))
                        for k in range(len(aa) - 1):
                            for q in range(m - 1):
                                PF.append((base + k * m + q, base + (k + 1) * m + q, base + (k + 1) * m + q + 1, base + k * m + q + 1))
    V = np.vstack(V); UV = np.vstack(UV); COL = np.vstack(COL)
    vessel = L.mesh_object("vessel", V, F, UV, colors=COL)
    peri = L.mesh_object("pericyte", np.array(PV), PF)
    L.select_only(peri)
    bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT"); bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode="OBJECT")

    # 内境界膜の面：ゆるい起伏＋浅い血管の上のふくらみ
    allp = np.vstack(curves)
    nx, nz = int(W) + 1, int(D) + 1
    xs = np.linspace(-W / 2, W / 2, nx); zs = np.linspace(-D / 2, D / 2, nz)
    X, Z = np.meshgrid(xs, zs)
    pts = np.stack([X.ravel(), Z.ravel()], 1)
    dmin = np.full(len(pts), 1e9)
    for c in range(0, len(allp), 400):
        d = np.linalg.norm(pts[:, None, :] - allp[None, c:c + 400, [0, 2]], axis=2).min(1)
        dmin = np.minimum(dmin, d)
    H = base_height(pts[:, 0], pts[:, 1]) + 1.7 * np.exp(-(dmin / 4.6) ** 2)
    fv = np.stack([pts[:, 0], H, pts[:, 1]], 1)
    ff = []
    for j in range(nz - 1):
        for i in range(nx - 1):
            a = j * nx + i
            ff.append((a, a + nx, a + nx + 1, a + 1))
    fuv = np.stack([(pts[:, 0] + W / 2) / W, (pts[:, 1] + D / 2) / D], 1)
    fcol = np.stack([np.exp(-(dmin / 4.6) ** 2), np.zeros(len(pts)), np.zeros(len(pts))], 1)   # R=血管の真上
    ilm = L.mesh_object("ilm", fv, ff, fuv, colors=fcol)

    def mat(name, col, rough, trans=0.0):
        m = bpy.data.materials.new(name); m.use_nodes = True
        b = m.node_tree.nodes["Principled BSDF"]
        b.inputs["Base Color"].default_value = (*col, 1); b.inputs["Roughness"].default_value = rough
        if "Transmission Weight" in b.inputs: b.inputs["Transmission Weight"].default_value = trans
        return m
    vessel.data.materials.append(mat("vessel", (0.55, 0.12, 0.10), 0.45, 0.5))
    peri.data.materials.append(mat("pericyte", (0.75, 0.62, 0.52), 0.5, 0.2))
    ilm.data.materials.append(mat("ilm", (0.7, 0.62, 0.55), 0.3, 0.85))

    data = {"unit": "um", "size": [W, D], "rOuter": R_OUT, "rLumen": R_LUMEN,
            "edges": [[[round(float(x), 2) for x in p] for p in c] for c in curves],
            "routes": ROUTES, "nuclei": nuclei, "pericytes": pericytes,
            "floor": {"bulge": 1.7, "sigma": 4.6}}
    with open(os.path.join(L.ROOT, "public", "static", "data", "retina.json"), "w") as f:
        json.dump(data, f, separators=(",", ":"))
    L.export_glb([ilm, vessel, peri], os.path.join(L.OUT_MODELS, "retina.raw.glb"), yup=False)  # すでに y-up で作ってある
    # 確認用の画像：血管と周皮細胞だけ（膜を外して）中央の分岐付近を写す
    ilm.hide_render = True
    c = np.array(NODES["B"])
    for o in (vessel, peri):
        o.location = (-c[0], 0, -c[1]); o.rotation_euler = (math.radians(90), 0, 0)
    # Blender は z が上。y-up で作ったので x 軸まわりに 90°回して z-up にする
    L.render_views([vessel, peri], "retina", 16, res=512, samples=32)
    print("STATS", json.dumps({"vessel_tris": len(F) * 2, "peri_tris": len(PF) * 2, "ilm_tris": len(ff) * 2, "nuclei": len(nuclei), "pericytes": len(pericytes),
                               "total_len_um": round(float(sum(np.linalg.norm(np.diff(c, axis=0), axis=1).sum() for c in curves)), 1)}))


main()
