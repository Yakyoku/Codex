"""コルポダ（Colpoda cucullus）：活動中の細胞と、休眠シスト。
形の根拠は Docs/REFERENCE/species/colpoda.md（△ は仮の値）。単位：1 = 10µm。
向き：+Y が前の端、+X が口のくぼみのある側（腹側）、Z が厚みの方向（平たい向き）。
実行: python3 assets/blender/creatures/colpoda.py [--no-bake] [--no-preview]
出力: assets/out/creatures/colpoda.glb、colpoda_na.png、colpoda_lod1_na.png → public/models/creatures/ に最適化版と WebP
GLB の中身:
  colpoda_body_LOD0/1     体。頂点色 R=厚み、G=0、B=口のくぼみの重み。UV は NA テクスチャ用
  colpoda_cilia_LOD0/1    繊毛の殻（体を繊毛の長さだけ外へ広げた面）。UV0.x*40-17 = 繊毛の列の番号、UV0.y = 後ろ→前。
                          UV1.x = 口のまわりの重み。頂点色 RGB = 列の向き（glTF の座標で、0.5+0.5*向き）
  colpoda_vacuoles_LOD0/1 食胞（まとめて1つ）。頂点色 R=1、G=1、B=粒ごとの乱数
  colpoda_cv              収縮胞（単位球に近い形を、ゲーム側で拡大縮小して拍動させる）
  colpoda_macronucleus    大核（ふつうの光ではほとんど見えない。ごく薄く描くか、隠す）
  colpoda_cyst_wall_LOD0/1、colpoda_cyst_cell_LOD0/1、colpoda_cyst_granules   休眠シスト（殻、中の細胞、中心の明るい粒）
体は硬く、形が変わらない（仕様書）ので、シェイプキーは作らない。"""
import bpy, sys, os, math, time, random
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from creature_common import *

args = sys.argv[1:]
BAKE = '--no-bake' not in args; PREVIEWS = '--no-preview' not in args

# ---- 寸法（1 = 10µm）。仕様書の推奨値 ----
L, W, T = 6.5, 4.5, 2.7           # 長さ・幅・厚さ（厚さは △）
N_ROWS = 34                        # 繊毛の列
N_NOTCH = 9                        # 口より前のふちの刻み目（8〜10）
CIL = 0.8                          # 繊毛の長さ 8µm（△）
YN0 = 0.16                         # 口のくぼみの中心：前から 42%（仕様：31〜53% がくぼみ）
VM = math.acos(-YN0) / math.pi     # そのときの v（v: 0=後ろの端、1=前の端）
V_END = 0.97
TWIST = 0.3                        # 口より後ろで、列が斜めに回る量（1 あたりの回転数）
BEND = 0.5                         # そら豆の曲がり
CYST_R, CYST_CELL_R = 2.1, 1.78    # シストの外径 42µm（△ 35〜45µm）と、中の細胞
_n = np.linspace(0, 1, 2001); _k = (np.sin(np.pi * _n) ** 0.8 * (1 + 0.17 * np.cos(np.pi * _n))).max()

def dent_w(yn):
    dy = yn - YN0; return np.exp(-(dy / np.where(dy > 0, 0.15, 0.27)) ** 2)

def body(u, v, soft=0.0):
    """体の表面の点。u: −0.5..0.5（0 = 腹側 +X）、v: 0..1（後ろ→前）。soft=1 で、口の穴のない、なだらかな形（繊毛の殻用）"""
    u, v = np.broadcast_arrays(np.asarray(u, float), np.asarray(v, float))
    yn = -np.cos(np.pi * v); rho = np.sin(np.pi * v) ** 0.8
    wf = (1 - 0.17 * yn) / _k                         # 後ろが広く、前がやや細い
    cu = np.cos(2 * np.pi * u); su = np.sin(2 * np.pi * u); cup = np.maximum(cu, 0)
    x = (W / 2) * 1.03 * rho * wf * cu; z = (T / 2) * rho * wf * su; y = (L / 2) * yn
    x = x + BEND * (yn ** 2 - 0.4)                    # 背側がふくらみ、腹側がへこむ
    x = x - 0.62 * (1 - 0.75 * soft) * dent_w(yn) * cup ** 1.5 * np.minimum(1, rho * 1.5)      # 口のくぼみ（ひと口かじった形）
    x = x - 0.34 * (1 - soft) * np.exp(-((yn - YN0 - 0.02) / 0.1) ** 2) * cup ** 6           # 口の入り口（前庭）
    x = x + 0.16 * np.exp(-((yn - YN0 - 0.33) / 0.13) ** 2) * cup ** 2                        # くぼみの前の張り出し（くちばし）
    return np.stack([x, y, z], -1)

def rowcoord(u, v, side=None):
    """繊毛の列の番号（実数）。口より後ろでは、列は後ろの端から斜めに走る。口より前では、腹側の列から順に、
    腹側のふち（口の前の縫い目）で終わる。終わる所が、ふちの刻み目になる。"""
    u, v = np.broadcast_arrays(np.asarray(u, float), np.asarray(v, float))
    s = np.where(u >= 0, 1.0, -1.0) if side is None else side
    k = np.clip((v - VM) / (V_END - VM), 0, 1)
    au = np.abs(u)
    front = s * (N_ROWS * au + N_NOTCH * k * (1 - 2 * au))
    back = N_ROWS * (u + TWIST * np.clip(VM - v, 0, None) ** 2 / VM)   # 口の高さで、なめらかにつながる
    return np.where(v >= VM, front, back)

def keel_w(u, v):
    cu = np.maximum(np.cos(2 * np.pi * u), 0)
    return cu ** 6 * sstep(VM + 0.01, VM + 0.06, v) * (1 - sstep(0.93, 0.985, v))

def oral_w(u, v):
    yn = -np.cos(np.pi * v); return dent_w(yn) * np.maximum(np.cos(2 * np.pi * u), 0) ** 2

def axis_pt(v):
    yn = -np.cos(np.pi * np.asarray(v, float)); return np.stack([BEND * (yn ** 2 - 0.4), (L / 2) * yn, 0 * yn], -1)

def grid(nu, nv):
    U = warp(nu, lambda x: 1 + 1.0 * np.exp(-(x / 0.12) ** 2), -0.5, 0.5, periodic=True)
    Vv = warp(nv, lambda x: 1 + 2.0 * sstep(VM - 0.1, VM - 0.02, x) * (1 - sstep(0.95, 1.0, x)), 0.0, 1.0)
    return U, Vv

def build_body(nu, nv, ridges, notch, name):
    """ridges: 繊毛の列のうねの高さ（焼き込み元だけ）。notch: ふちの刻み目の深さ"""
    U, Vv = grid(nu, nv); uu, vv = U[None, :], Vv[:, None]
    P = body(uu, vv); N = grid_normals(P, axis_pt(Vv)[:, None, :])
    r = rowcoord(uu, vv)
    fade = sstep(0.0, 0.3, np.sin(np.pi * vv)) * (1 - 0.9 * np.exp(-((-np.cos(np.pi * vv) - YN0 - 0.02) / 0.1) ** 2) * np.maximum(np.cos(2 * np.pi * uu), 0) ** 10)
    d = (ridges * fade + notch * keel_w(uu, vv)) * np.cos(2 * np.pi * r)
    P = P + N * d[..., None]
    V = np.concatenate([P.reshape(-1, 3), body(0.0, 0.0)[None], body(0.0, 1.0)[None]])
    F, G = tube_tris(nv, nu); F, G = orient(V, F, G)
    ob = make_mesh(name, V, F, grid_uv(G, nu, nv))
    return ob, V, F, (U, Vv)

def build_shell(nu, nv, name):
    """繊毛の殻。列の番号が不連続になる所（腹側の縫い目と背側）で UV を切る。"""
    U = np.arange(nu) / nu - 0.5; Vv = (np.arange(nv) + 0.5) / nv
    uu, vv = U[None, :], Vv[:, None]
    P = body(uu, vv, soft=1.0); N = grid_normals(P, axis_pt(Vv)[:, None, :])
    ow = oral_w(uu, vv); ln = CIL * (1 + 0.35 * ow)          # 口のあたりは、やや長い
    S = P + N * ln[..., None]
    p0 = body(0.0, 0.0) + np.array([0, -CIL, 0]); p1 = body(0.0, 1.0) + np.array([0, CIL, 0])
    V = np.concatenate([S.reshape(-1, 3), p0[None], p1[None]])
    F, G = tube_tris(nv, nu); F, G = orient(V, F, G)
    # かどごとの UV：面の中心がどちら側（u の正負）かで、列の番号の取り方を決める
    gu = G[..., 0] / nu - 0.5; gv = np.clip((G[..., 1] + 0.5) / nv, 0, 1)
    side = np.where(gu.mean(1, keepdims=True) >= 0, 1.0, -1.0)
    r = rowcoord(gu, gv, side=side + 0 * gu)
    UV = np.stack([(r + 17) / 40.0, gv], -1)
    uv2 = np.stack([oral_w(gu, gv), 0 * gv], -1)
    ob = make_mesh(name, V, F, UV, uv2)
    # 頂点色 = 列の向き（列の番号が一定の線に沿った、前向きの接線）。glTF の座標に直して入れる
    h = 1e-3; sd = np.where(uu >= 0, 1.0, -1.0) + 0 * vv
    uc = np.where(np.abs(uu) < 1e-9, 1e-6, uu) + 0 * vv; vc = vv + 0 * uu
    Pu = (body(uc + h, vc, 1.0) - body(uc - h, vc, 1.0)) / (2 * h); Pv = (body(uc, vc + h, 1.0) - body(uc, vc - h, 1.0)) / (2 * h)
    ru = (rowcoord(uc + h, vc, sd) - rowcoord(uc - h, vc, sd)) / (2 * h); rv = (rowcoord(uc, vc + h, sd) - rowcoord(uc, vc - h, sd)) / (2 * h)
    t = Pv * ru[..., None] - Pu * rv[..., None]; t /= np.maximum(np.linalg.norm(t, axis=2, keepdims=True), 1e-9)
    t = np.concatenate([t.reshape(-1, 3), [[0, 1, 0]], [[0, 1, 0]]])
    tg = np.stack([t[:, 0], t[:, 2], -t[:, 1]], 1)            # Blender (x,y,z) → glTF (x,z,−y)
    set_colors(ob, 0.5 + 0.5 * tg)
    return ob

def spheres(name, items, nu, nv, g=1.0):
    Vs, Fs, UVs, cols = [], [], [], []; base = 0
    for (c, r, sc, b) in items:
        V = sphere(c, r, nu, nv, sc); F, G = tube_tris(nv, nu); F, G = orient(V, F, G)
        Vs.append(V); Fs.append(F + base); UVs.append(grid_uv(G, nu, nv)); base += len(V)
        cols.append(np.tile([1.0, g, b], (len(V), 1)))
    ob = make_mesh(name, np.concatenate(Vs), np.concatenate(Fs), np.concatenate(UVs)); set_colors(ob, np.concatenate(cols)); return ob

def vacuole_items(seed=7, count=24):
    """食胞：直径 3〜8µm の丸い粒を、体の中に散らす。収縮胞・大核・口の穴・ほかの粒と重ならないようにする"""
    rng = random.Random(seed); out = []; keep = [(np.array(CV_C), CV_R + 0.05), (np.array(MAC_C), MAC_R + 0.05)]
    tries = 0
    while len(out) < count and tries < 20000:
        tries += 1
        u = rng.uniform(-0.5, 0.5); v = rng.uniform(0.14, 0.9); fr = rng.uniform(0.0, 0.8) ** 0.7; r = rng.uniform(0.16, 0.4)
        a = axis_pt(v); s = body(u, v); c = a + fr * (s - a)
        if np.linalg.norm(s - c) < r + 0.14: continue
        if abs(c[2]) + r > T / 2 * 0.86 * math.sin(math.pi * v) ** 0.8: continue
        if oral_w(u, v) > 0.25 and fr > 0.35: continue
        if any(np.linalg.norm(c - k) < r + kr for k, kr in keep): continue
        keep.append((c, r + 0.03)); out.append((tuple(c), r, (1, 1, rng.uniform(0.85, 1.0)), rng.random()))
    return out

CV_C, CV_R = (0.1, -2.38, 0.0), 0.62          # 収縮胞：後ろの端の少し手前。直径は幅の約 28%
MAC_C, MAC_R = (-0.55, -0.15, 0.0), 0.56      # 大核：直径約 11µm

def main():
    t0 = time.time(); C.reset(); objs = []
    # ---- 体 ----
    b0, V0, F0, _ = build_body(48, 76, 0.0, 0.04, 'colpoda_body_LOD0')
    b1, V1, F1, _ = build_body(24, 30, 0.0, 0.0, 'colpoda_body_LOD1')
    for ob, V, F, (nu, nv) in ((b0, V0, F0, (48, 76)), (b1, V1, F1, (24, 30))):
        U, Vv = grid(nu, nv); ow = np.concatenate([oral_w(U[None, :], Vv[:, None]).ravel(), [0, 0]])
        set_colors(ob, np.stack([thickness(V, F, T), 0 * ow, ow], 1))
    print('[colpoda] body bbox', V0.min(0).round(2), V0.max(0).round(2), 'tris', len(F0), len(F1))
    na = {}
    if BAKE:
        hi, Vh, Fh, _ = build_body(544, 340, 0.022, 0.04, 'colpoda_body_high')
        for ob, size, tag in ((b0, 1024, ''), (b1, 512, '_lod1')):
            p = os.path.join(COUT, f'colpoda{tag}_na.png'); na[ob.name] = bake_na(ob, hi, size, p, cage=0.12 if ob is b0 else 0.3); to_webp(p)
        bpy.data.objects.remove(hi)
    # ---- 繊毛の殻 ----
    c0 = build_shell(40, 34, 'colpoda_cilia_LOD0'); c1 = build_shell(20, 16, 'colpoda_cilia_LOD1')
    # ---- 中身 ----
    items = vacuole_items()
    v0 = spheres('colpoda_vacuoles_LOD0', items, 10, 6); v1 = spheres('colpoda_vacuoles_LOD1', items, 6, 3)
    cv = spheres('colpoda_cv', [(CV_C, CV_R, (1, 1, 0.92), 0.0)], 16, 10)
    mac = spheres('colpoda_macronucleus', [(MAC_C, MAC_R, (1, 1.07, 0.93), 0.0)], 14, 8)
    # ---- 休眠シスト（形は文章だけが根拠。写真は見ていない） ----
    rng = random.Random(3)
    def cyst_wall(nu, nv, name):
        V = sphere((0, 0, 0), 1.0, nu, nv); d = V / np.linalg.norm(V, axis=1, keepdims=True)
        lump = 0.018 * np.sin(d[:, 0] * 3.1 + 1.0) * np.cos(d[:, 1] * 2.3) + 0.012 * np.sin(d[:, 2] * 4.0 + d[:, 0] * 2.0)   # ごくわずかな、いびつさ
        V = d * (CYST_R * (1 + lump))[:, None] * np.array([1.0, 1.04, 0.97])
        F, G = tube_tris(nv, nu); F, G = orient(V, F, G); ob = make_mesh(name, V, F, grid_uv(G, nu, nv))
        set_colors(ob, np.tile([0.15, 0.0, 0.0], (len(V), 1))); return ob
    w0 = cyst_wall(32, 20, 'colpoda_cyst_wall_LOD0'); w1 = cyst_wall(16, 10, 'colpoda_cyst_wall_LOD1')
    k0 = spheres('colpoda_cyst_cell_LOD0', [((0, 0, 0), CYST_CELL_R, (1, 1.03, 0.97), 0.0)], 28, 18, g=0.5)
    k1 = spheres('colpoda_cyst_cell_LOD1', [((0, 0, 0), CYST_CELL_R, (1, 1.03, 0.97), 0.0)], 14, 9, g=0.5)
    gr = []
    while len(gr) < 16:
        p = np.array([rng.gauss(0, 0.33), rng.gauss(0, 0.33), rng.gauss(0, 0.3)]); r = rng.uniform(0.1, 0.2)
        if np.linalg.norm(p) < 0.8 and all(np.linalg.norm(p - q) > r + rr for q, rr in gr): gr.append((p, r))
    g0 = spheres('colpoda_cyst_granules', [(tuple(p), r, (1, 1, 1), rng.random()) for p, r in gr], 8, 5)
    objs = [b0, b1, c0, c1, v0, v1, cv, mac, w0, w1, k0, k1, g0]
    for o in objs: print(f'  {o.name}: verts {len(o.data.vertices)} tris {len(o.data.polygons)}')
    export_glb('colpoda', objs)
    # ---- 確認用の画像 ----
    if PREVIEWS:
        b0.data.materials.clear(); b0.data.materials.append(mat_micro('pv_body', (0.84, 0.86, 0.84), 0.16, 0.95, 0.28, na.get(b0.name), 1.0))
        c0.data.materials.clear(); c0.data.materials.append(mat_fringe('pv_cilia'))
        v0.data.materials.append(mat_micro('pv_vac', (0.70, 0.68, 0.58), 0.45, 0.9, 0.55))
        cv.data.materials.append(mat_micro('pv_cv', (0.95, 0.96, 0.95), 0.03, 0.75, 0.5))
        mac.data.materials.append(mat_micro('pv_mac', (0.86, 0.87, 0.85), 0.08, 0.4, 0.7))
        w0.data.materials.append(mat_micro('pv_wall', (0.85, 0.82, 0.70), 0.12, 0.97, 0.25))
        k0.data.materials.append(mat_micro('pv_cell', (0.78, 0.76, 0.66), 0.4, 0.95, 0.35))
        g0.data.materials.append(mat_micro('pv_gran', (0.97, 0.97, 0.93), 0.6, 0.9, 0.9))
        views = ['top', 'side', 'front', 'under']
        render_views(os.path.join(PREV, 'creature_colpoda_active'), [b0, c0, v0, cv, mac], views, (0, 0, 0), 9.4)
        render_views(os.path.join(PREV, 'creature_colpoda_cyst'), [w0, k0, g0], views, (0, 0, 0), 9.4)
        if '--extra' in args:
            render_views(os.path.join(PREV, 'creature_colpoda_bodyonly'), [b0], ['top', 'quarter'], (0, 0, 0), 8.0)
    print(f'[colpoda] done {time.time()-t0:.1f}s')

main()
