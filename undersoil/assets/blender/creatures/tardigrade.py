"""トウキョウチョウメイムシ（Paramacrobiotus metropolitanus）：活動中の成体、乾眠の樽、歩きの4コマ。
形の根拠は Docs/REFERENCE/species/tardigrade.md（△ は仮の値）。単位：1 = 10µm（体長 54）。
向き：+Y が頭、+Z が上、+X が体の右。足の先（立っている姿勢）が z = 0。
実行: python3 assets/blender/creatures/tardigrade.py [--no-bake] [--no-preview]
出力: assets/out/creatures/tardigrade.glb、tardigrade_na.png、tardigrade_tun_na.png（＋ _lod1）→ public/models/creatures/
GLB の中身（LOD0 と LOD1。どちらも同じ式から、細かさだけ変えて作る）:
  tardigrade_body_LOD0/1   体＋脚8本＋爪（脚1本に、Y字に分かれた爪が2本）。頂点色 R=厚み、G=爪は1、B=脚の重み
  tardigrade_inner_LOD0/1  透けて見える中身：口の管、口針1対、咽頭、（LOD0 だけ）咽頭の中の棒、腸。
                           頂点色 R=1、G=硬い部品（管・口針・棒）は1／咽頭 0.6／腸 0.3
シェイプキー（両方の物体、両方の LOD に同じ名前で入る）: tun、walk_a、walk_b、walk_c、walk_d
  基本の形＝立っている姿勢。walk_a→b→c→d→a の順に、重みを1つずつ入れ替えて（隣どうしをなめらかに混ぜて）歩かせる。
眼は作らない（本種の生きた個体に眼はない）。触角、とげ、板も作らない。"""
import bpy, sys, os, math, time
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from creature_common import *

args = sys.argv[1:]
BAKE = '--no-bake' not in args; PREVIEWS = '--no-preview' not in args

# ---- 寸法（1 = 10µm）----
L = 54.0                          # 体長 540µm（平均）
RX, RZT, RZB = 7.5, 8.3, 6.7      # 幅の半分、背側の高さ、腹側の高さ（幅 150µm × 高さ 150µm △）
ZB = 3.8                          # 腹の下の、地面からのすき間
SEG = [0.125, 0.32, 0.525, 0.74]  # 体節の境（頭｜胴1｜胴2｜胴3｜胴4）
LEG_S = [0.22, 0.42, 0.63]        # 1〜3対目の脚の位置（本種の横からの写真の目測）
LEG_A = math.radians(42)          # 腹の真下から、わきへ 42°の所から生える
LEG_OUT = math.radians(30)        # 脚は、真下から外へ 30°傾く
HIND_S, HIND_A = 0.953, math.radians(42)
RF, RF_HIND = 4.8, 3.6            # 脚のつけ根の広がり（半径）
CLAW, CLAW_HIND = 1.15, 1.3       # 爪の長い枝の高さ 11.5µm、4対目は 13µm
TUN_L, TUN_RX, TUN_RZT, TUN_RZB = 22.0, 8.6, 6.3, 4.7   # 樽：長さ 220µm × 幅 172µm × 高さ 110µm（△ 写真の縦横比 170:140 から）
TUN_FOLDS = 7                     # 樽のふくらみの数（横じわは 6本。仕様：5〜7本 △）
STRIDE_DEG = 30.0                 # 脚の振れ幅（前後 ±30° △）
DUTY = 0.67                       # 1周期のうち、足が地面についている割合

_cs = np.array([0, .05, .10, .16, .26, .40, .55, .68, .80, .90, 1.0]); _cp = np.array([.66, .68, .70, .72, .84, .97, 1.0, .97, .86, .72, .60])
_x = np.linspace(-0.2, 1.2, 2801); _p = np.interp(_x, _cs, _cp); _g = np.exp(-(np.linspace(-0.09, 0.09, 361) / 0.03) ** 2); _p = np.convolve(_p, _g / _g.sum(), 'same')

def caps(s):
    """両端を丸く閉じるための倍率（前の端、後ろの端）"""
    s = np.asarray(s, float)
    return np.clip(1 - (1 - np.clip(s / 0.085, 0, 1)) ** 2.2, 0, 1) ** 0.5, np.clip(1 - np.clip((s - 0.9) / 0.1, 0, 1) ** 2.2, 0, 1) ** 0.5

def prof(s):
    """体の太さ（最大を1とする）。頭は細く、胴の2〜3節目がいちばん太く、後ろへ細くなる"""
    s = np.asarray(s, float); p = np.interp(s, _x, _p)
    cf, cr = caps(s); p = p * cf * cr
    for f in SEG: p = p * (1 - 0.028 * np.exp(-((s - f) / 0.012) ** 2))      # 体節の境の、浅いくびれ
    return p

class Active:
    """活動中の体。und = (左右のくねりの大きさ, 位相)"""
    def __init__(self, amp=0.0, ph=0.0, bob=0.0): self.amp, self.ph, self.bob = amp, ph, bob
    def center(self, s):
        s = np.asarray(s, float); p = prof(s)
        y = L * (0.5 - s) + 0.3 * np.exp(-(s / 0.012) ** 2)
        x = self.amp * np.sin(2 * np.pi * (self.ph + 0.7 * s)) * sstep(0, 0.1, s)
        cf, cr = caps(s)        # 端では、中心を持ち上げる（口は頭の高さの下から約3分の1。後ろの端は、4対目の脚の上で丸く閉じる）
        z = ZB + self.bob + RZB * p + 1.6 * (1 - sstep(0.0, 0.24, s)) + 0.9 * sstep(0.84, 1.0, s) + 3.4 * (1 - cf) + 3.0 * (1 - cr)
        return np.stack([x, y, z], -1)
    def radii(self, s):
        s = np.asarray(s, float); p = prof(s); nub = 0.38 * np.exp(-(s / 0.006) ** 2)     # 口の先の小さな突き出し
        return RX * p + nub, RZT * p + nub, RZB * p + nub
    def base(self, s, a):
        s, a = np.broadcast_arrays(np.asarray(s, float), np.asarray(a, float)); c = self.center(s); rx, rt, rb = self.radii(s)
        ca = np.cos(a); x = c[..., 0] + rx * np.sin(a); z = c[..., 2] - ca * np.where(ca > 0, rb, rt)
        return np.stack([x, c[..., 1], z], -1)
    def pole(self, k):
        c = self.center(float(k)); c[1] += (-0.12 if k == 0 else 0.0); return c

def tun_phase(s, a):
    """樽の横じわの位置。等間隔にせず、少しずらして波打たせる"""
    return TUN_FOLDS * s + 0.22 * np.sin(2 * np.pi * 1.3 * s + 0.6) + 0.07 * np.sin(2 * a + 1.0) + 0.04 * np.sin(5 * a + 3 * s)

class Tun:
    """乾眠の樽。頭と脚を引き込み、前後に縮んだ形。横じわが走る"""
    def center(self, s):
        s = np.asarray(s, float); return np.stack([0 * s, TUN_L * (0.5 - s), TUN_RZB + 0 * s], -1)
    def base(self, s, a):
        s, a = np.broadcast_arrays(np.asarray(s, float), np.asarray(a, float))
        p = np.clip(1 - np.abs(2 * s - 1) ** 2.8, 0, 1) ** 0.5
        dors = sstep(-0.5, 0.6, -np.cos(a))
        m = np.abs(np.sin(np.pi * tun_phase(s, a))) ** 0.5
        p = p * (1 - (0.15 + 0.04 * np.sin(9 * s + 2 * a)) * (1 - m) * (0.5 + 0.5 * dors) * sstep(0.02, 0.1, s) * (1 - sstep(0.9, 0.98, s)))
        sa, ca = np.sin(a), np.cos(a)
        x = TUN_RX * p * np.sign(sa) * np.abs(sa) ** 0.85; z = TUN_RZB - np.sign(ca) * np.abs(ca) ** 0.9 * np.where(ca > 0, TUN_RZB, TUN_RZT) * p
        return np.stack([x, TUN_L * (0.5 - s), z], -1)
    def pole(self, k):
        return np.array([0.0, TUN_L * (0.5 - k), TUN_RZB])

REST = Active()
# ---- 脚：(名前, s, a, 立っているときの向き, つけ根の半径, 爪の高さ) ----
LEGS = []
for side, sn in ((1, 'R'), (-1, 'L')):
    for j, s in enumerate(LEG_S):
        LEGS.append(dict(name=f'{sn}{j+1}', s=s, a=side * LEG_A, side=side, hind=False, rf=RF, claw=CLAW,
                         dir=np.array([side * math.sin(LEG_OUT), 0.0, -math.cos(LEG_OUT)])))
    d = np.array([side * 0.22, -0.62, -0.75]); LEGS.append(dict(name=f'{sn}4', s=HIND_S, a=side * HIND_A, side=side, hind=True, rf=RF_HIND, claw=CLAW_HIND, dir=d / np.linalg.norm(d)))
for lg in LEGS:
    lg['c'] = REST.base(lg['s'], lg['a'])
    lg['len'] = float(np.clip(lg['c'][2] / -lg['dir'][2], 3.5, 6.6))      # 足の先が z=0 に届く長さ
    f = np.array([0.0, 1.0, 0.0]); d = lg['dir']
    if lg['hind']:   # 4対目：爪は前後に並び、かぎは下・前へ曲がる
        h = np.array([0.0, 0.55, -1.0]); h = h - d * h.dot(d); h /= np.linalg.norm(h); m = np.cross(d, h)
    else:            # 1〜3対目：爪は内と外に並び、かぎは後ろへ曲がる（向きは文章からの推定 △）
        h = -(f - d * f.dot(d)); h /= np.linalg.norm(h); m = np.cross(d, h)
    lg['h'], lg['m'] = h, m

def rotx(v, th):
    c, s = math.cos(th), math.sin(th); v = np.asarray(v, float)
    return np.stack([v[..., 0], v[..., 1] * c - v[..., 2] * s, v[..., 1] * s + v[..., 2] * c], -1)

def leg_w(t):
    """脚の形：つけ根（t=1）から先（t=0）へ。円すいと釣り鐘の中間で、先は丸い"""
    t = np.clip(t, 0, 1); t = (np.sqrt(t * t + 0.05) - math.sqrt(0.05)) / (math.sqrt(1.05) - math.sqrt(0.05))
    return 0.5 * (1 - t) + 0.5 * (1 - 3 * t * t + 2 * t ** 3)

def walk_leg(lg, phase):
    """歩きの1コマでの、脚の (回転角, 長さの倍率)。phase は 0..1"""
    off = {'R3': 0.0, 'R2': 1 / 3, 'R1': 2 / 3, 'L3': 0.5, 'L2': 5 / 6, 'L1': 1 / 6}     # 後ろ→前へ順に出て、左右は半周期ずれる
    if lg['hind']:   # 4対目は歩きのリズムにあまり合わせず、足場をつかむ。小さく動かすだけ
        th = math.radians(7) * math.sin(2 * math.pi * (phase + (0.0 if lg['side'] > 0 else 0.5))); return th, 1.0 + 0.04 * math.cos(2 * math.pi * phase + lg['side'])
    p = (phase + off[lg['name']]) % 1.0; th0 = math.radians(STRIDE_DEG)
    if p < DUTY:
        th = th0 * (1 - 2 * p / DUTY); return th, 1.0 / math.cos(th) ** 0.9          # 地面についている間：前→後ろ。伸び縮みで足の高さを保つ
    q = (p - DUTY) / (1 - DUTY); th = -th0 * math.cos(math.pi * q)                    # 浮かせて前へ戻す
    return th, (1.0 / math.cos(th) ** 0.9) * (1 - 0.26 * math.sin(math.pi * q))

POSES = {'Basis': ('active', None), 'tun': ('tun', None), 'walk_a': ('walk', 0.0), 'walk_b': ('walk', 0.25), 'walk_c': ('walk', 0.5), 'walk_d': ('walk', 0.75)}

def pose_setup(key):
    kind, ph = POSES[key]
    if kind == 'tun': return Tun(), None
    if kind == 'walk': return Active(0.5, ph, 0.12 * math.sin(4 * math.pi * ph)), ph
    return Active(), None

def leg_state(lg, body, ph, tun_n=None):
    """その姿勢での、脚のベクトル A（つけ根の中心 → 先）と、爪の付く位置・向き"""
    if isinstance(body, Tun):
        c = body.base(lg['s'], lg['a']); ctr = body.center(lg['s']); n = c - ctr; n[1] = 0; n /= np.linalg.norm(n)
        q = body.center(float(np.clip(lg['s'], 0.25, 0.75))) - c; q /= np.linalg.norm(q)      # 爪は、体の奥へ引き込まれる
        return -0.5 * n, c + 3.4 * q, lg['dir'], lg['m'], lg['h']
    th, k = (0.0, 1.0) if ph is None else walk_leg(lg, ph)
    d = rotx(lg['dir'], th); A = d * lg['len'] * k
    c = body.base(lg['s'], lg['a'])
    return A, c + A, d, rotx(lg['m'], th), rotx(lg['h'], th)

def grid(nu, nv):
    U = warp(nu, lambda x: 1 + 1.2 * np.exp(-((np.abs(x) - 0.12) / 0.07) ** 2), -0.5, 0.5, periodic=True)
    def dv(s):
        d = 1 + 5 * np.exp(-s / 0.012) + 2.2 * sstep(0.89, 0.94, s)
        for sj in LEG_S: d = d + 1.4 * np.exp(-((s - sj) / 0.045) ** 2)
        return d
    return U, warp(nv, dv, 0.0, 1.0)

def body_grid(key, U, S, detail=0.0):
    """体（脚つき）の格子 (nv,nu,3) と両端の点、脚の重み。detail>0 は焼き込み元の細かいしわ"""
    body, ph = pose_setup(key); a = 2 * np.pi * U[None, :]; s = S[:, None]
    B = body.base(s, a); R0 = REST.base(s, a); W = np.zeros(B.shape[:2]); P = B.copy(); tmin = np.full(B.shape[:2], 9.0)
    for lg in LEGS:
        t = np.linalg.norm(R0 - lg['c'], axis=2) / lg['rf']; A = leg_state(lg, body, ph)[0]
        if isinstance(body, Tun):
            w = sstep(1.25, 0.2, t) * np.maximum(np.cos(a), 0) ** 0.5
            N = B - body.center(s + 0 * a); N[..., 1] = 0; N /= np.maximum(np.linalg.norm(N, axis=2, keepdims=True), 1e-9); P = P - 1.0 * w[..., None] * N    # 引き込んだ脚の跡：浅いくぼみ
        else:
            w = leg_w(t) * (t < 1)
            if lg['hind']: w = w * sstep(-0.55, 0.25, np.cos(a))      # 4対目は、体の後ろの端の腹側から出る（背中側は動かさない）
            P = P + w[..., None] * A
        W = np.maximum(W, w); tmin = np.minimum(tmin, t)
    p0, p1 = body.pole(0), body.pole(1)
    if detail > 0:
        N = grid_normals(P, body.center(S)[:, None, :]); d = np.zeros(B.shape[:2]); sb = s + 0 * a; ab = a + 0 * s
        if isinstance(body, Tun):
            ph1 = tun_phase(sb, ab)
            d += 0.05 * np.sin(2 * np.pi * 3 * ph1 + 1.5 * np.sin(3 * ab)) * np.abs(np.sin(np.pi * ph1)) ** 0.5     # 大きなひだの間の、細かい横じわ
            d += 0.028 * np.sin(2 * np.pi * 61 * sb + 2.5 * np.sin(2 * ab + 0.7) + 2 * np.sin(7 * ab))
            d += 0.02 * np.sin(11 * ab + 3 * np.sin(23 * sb)) * sstep(-0.2, 0.5, -np.cos(ab))                        # 背中の、ごく弱い縦じわ
            d *= sstep(0.0, 0.05, sb) * (1 - sstep(0.95, 1.0, sb))
        else:
            for f in SEG:
                d -= 0.10 * np.exp(-((sb - f) / 0.0035) ** 2) + 0.025 * np.exp(-((sb - f - 0.018) / 0.004) ** 2) + 0.02 * np.exp(-((sb - f + 0.02) / 0.004) ** 2)
            d *= (0.55 + 0.45 * sstep(-0.6, 0.3, -np.cos(ab)))                           # 境の溝は、背中とわきで見え、腹では弱い
            d -= 0.03 * np.cos(2 * np.pi * 3.5 * tmin) * sstep(0.2, 0.35, tmin) * (1 - sstep(0.85, 1.05, tmin))     # 脚のつけ根の輪じわ（伸び縮みする所）
            d += 0.006 * np.sin(2 * np.pi * 150 * sb + 2 * np.sin(3 * ab)) * (1 - W)     # 表皮はなめらか。ごく弱い横じわだけ
        P = P + N * (d * detail)[..., None]
    return P, p0, p1, W

def claw_tubes(tip, d, m, h, size, sides, seg):
    """脚1本ぶんの爪：2本（m の方向に並ぶ）。それぞれが、根もとの柄から、長い枝と短い枝に Y字に分かれ、h の向きへ曲がる。
    長い枝どうしが内側、短い枝が外側（2-1-1-2 の並び）。返り値：[(頂点, 輪の数)] × 4"""
    out = []; k = size / 1.15
    for sg in (-1.0, 1.0):
        base = tip - d * 0.5 * k + m * sg * 0.3 * k
        e = base + d * 0.82 * k + m * sg * 0.05 * k                    # 枝分かれの点
        for long in (True, False):
            n = seg if long else max(3, seg - 2); Lb = (1.1 if long else 0.66) * k; kap = 1.75 if long else 1.7
            lean = (-0.10 if long else 0.62) * sg
            tau = (np.linspace(0, 1, n - 2) if long else np.linspace(0.35, 1, n - 1))[:, None]
            arc = e + (Lb / kap) * (np.sin(kap * tau) * (d + m * lean) + (1 - np.cos(kap * tau)) * h)
            pts = np.concatenate([[base], [base * 0.5 + e * 0.5], arc]) if long else np.concatenate([[e - d * 0.12 * k], arc])
            r = np.linspace(0.14, 0.02, len(pts)) * k * (1.0 if long else 0.85)
            out.append((tube(pts, r, sides, ref=m + 0.3 * h), len(pts)))
    return out

def build(nu, nv, cs, cseg, key, lod):
    """1つの姿勢の、体＋爪の頂点。面・UV・色のもとも返す"""
    U, S = grid(nu, nv); P, p0, p1, W = body_grid(key, U, S)
    Vs = [P.reshape(-1, 3), p0[None], p1[None]]; F, G = tube_tris(nv, nu); Fs = [F]; UVs = [grid_uv(G, nu, nv, (0, 0.07, 1, 1))]
    part = [np.zeros(nv * nu + 2)]; legw = [np.concatenate([W.ravel(), [0, 0]])]; base = nv * nu + 2
    body, ph = pose_setup(key)
    for lg in LEGS:
        A, tip, d, m, h = leg_state(lg, body, ph)
        for V, n in claw_tubes(tip, d, m, h, lg['claw'], cs, cseg):
            f, g = tube_tris(n, cs); Vs.append(V); Fs.append(f + base); UVs.append(grid_uv(g, cs, n, (0.02, 0.008, 0.98, 0.05))); base += len(V)
            part.append(np.ones(len(V))); legw.append(np.ones(len(V)))
    return np.concatenate(Vs), Fs, UVs, np.concatenate(part), np.concatenate(legw)

def inner(key, lod):
    """透けて見える中身。口の管と口針は硬く、樽になっても縮まない"""
    body, ph = pose_setup(key); hi = lod == 0; parts = []
    if isinstance(body, Tun):
        M = np.array([0.0, TUN_L / 2 - 2.2, TUN_RZB + 0.4]); dn = np.array([0.0, -1.0, -0.03]); gs = (0.55, 0.9); gr = 2.9
    else:
        M = body.pole(0) + np.array([0, -0.25, 0]); c = body.center(0.115); dn = c - M; gs = (0.2, 0.86); gr = 0.0
    dn = dn / np.linalg.norm(dn); xr = np.array([1.0, 0, 0]); up = np.cross(xr, dn)
    n = 6 if hi else 3
    tb = M + dn * np.linspace(0, 4.8, n)[:, None]                                        # 口の管：長さ 48µm、太さ 10µm
    parts.append((tube(tb, np.full(n, 0.5), 8 if hi else 5, ref=up), n, 8 if hi else 5, 1.0))
    for sg in (-1, 1):                                                                    # 口針：管の両わきの細い針。後ろへ向かって開く
        n = 7 if hi else 3; t = np.linspace(0, 1, n)[:, None]
        pts = M + dn * (0.3 + 4.3 * t) + xr * sg * (0.5 + 1.25 * t ** 1.6) + up * 0.15 * np.sin(np.pi * t)
        parts.append((tube(pts, np.linspace(0.07, 0.17, n), 4 if hi else 3, ref=up), n, 4 if hi else 3, 1.0))
    pc = M + dn * (4.8 + 2.1); n = 10 if hi else 5                                        # 咽頭：だ円形の筋肉の球（約 46 × 38µm △）
    t = (np.arange(n) + 0.5) / n; pts = pc + dn * (-np.cos(np.pi * t) * 2.3)[:, None]
    parts.append((tube(pts, 1.9 * np.sin(np.pi * t), 12 if hi else 6, ref=up), n, 12 if hi else 6, 0.6))
    if hi:                                                                                # 咽頭の中の棒：大きい3つ＋小さい1つが、2列
        for sg in (-1, 1):
            o = -1.35
            for ln in (0.62, 0.5, 0.66, 0.24):
                pts = pc + xr * sg * 0.3 + dn * np.array([o, o + ln])[:, None]; o += ln + 0.16
                parts.append((tube(pts, np.array([0.12, 0.12]), 3, ref=up), 2, 3, 1.0))
    n = 20 if hi else 7; s = np.linspace(gs[0], gs[1], n)                                 # 腸：体の中央を前後に走る太い管
    cc = body.center(s); t = np.linspace(0, 1, n)
    if isinstance(body, Tun): r = gr * np.sin(np.pi * np.clip(t, 0.06, 0.94)) ** 0.5 * (1 + 0.06 * np.sin(17 * t)); cc[:, 2] += 0.5
    else:
        r = 0.42 * RX * prof(s) * np.sin(np.pi * np.clip(t, 0.03, 0.97)) ** 0.7 * (1 + 0.07 * np.sin(23 * t)); cc[:, 2] += 0.6 - 0.5 * RZB * prof(s) * 0.2
    parts.append((tube(cc, r, 12 if hi else 6, ref=(0, 0, 1)), n, 12 if hi else 6, 0.3))
    Vs, Fs, UVs, col = [], [], [], []; base = 0
    for i, (V, n, sd, g) in enumerate(parts):
        f, gg = tube_tris(n, sd); Vs.append(V); Fs.append(f + base); UVs.append(grid_uv(gg, sd, n)); base += len(V); col.append(np.tile([1.0, g, 0.0], (len(V), 1)))
    return np.concatenate(Vs), Fs, UVs, np.concatenate(col)

def assemble(name, lod, nu, nv, cs, cseg):
    V, Fs, UVs, part, legw = build(nu, nv, cs, cseg, 'Basis', lod)
    # 面の向き：部品ごとに、外向きにそろえる（基本の形で決めて、全部の姿勢で同じ面を使う）
    F2, UV2 = [], []
    for f, uv in zip(Fs, UVs):
        idx = np.unique(f); sub = V.copy(); ctr = V[idx].mean(0)
        v0, v1, v2 = V[f[:, 0]] - ctr, V[f[:, 1]] - ctr, V[f[:, 2]] - ctr
        if np.einsum('ij,ij->i', v0, np.cross(v1, v2)).sum() < 0: f = f[:, ::-1].copy(); uv = uv[:, ::-1].copy()
        F2.append(f); UV2.append(uv)
    F = np.concatenate(F2); UV = np.concatenate(UV2)
    ob = make_mesh(f'{name}_body_LOD{lod}', V, F, UV)
    set_colors(ob, np.stack([thickness(V, F, 15.0), part, legw], 1))
    keys = {'Basis': V}
    for k in list(POSES)[1:]:
        Vk = build(nu, nv, cs, cseg, k, lod)[0]; add_key(ob, k, Vk); keys[k] = Vk
    Vi, Fi, UVi, coli = inner('Basis', lod); F3, UV3 = [], []
    for f, uv in zip(Fi, UVi):
        ctr = Vi[np.unique(f)].mean(0); v0, v1, v2 = Vi[f[:, 0]] - ctr, Vi[f[:, 1]] - ctr, Vi[f[:, 2]] - ctr
        if np.einsum('ij,ij->i', v0, np.cross(v1, v2)).sum() < 0: f = f[:, ::-1].copy(); uv = uv[:, ::-1].copy()
        F3.append(f); UV3.append(uv)
    oi = make_mesh(f'{name}_inner_LOD{lod}', Vi, np.concatenate(F3), np.concatenate(UV3)); set_colors(oi, coli)
    for k in list(POSES)[1:]: add_key(oi, k, inner(k, lod)[0])
    return ob, oi, keys, F, UV

def high(key, nu, nv, name):
    U, S = grid(nu, nv); P, p0, p1, W = body_grid(key, U, S, detail=1.0)
    V = np.concatenate([P.reshape(-1, 3), p0[None], p1[None]]); F, G = tube_tris(nv, nu); F, G = orient(V, F, G)
    return make_mesh(name, V, F, grid_uv(G, nu, nv, (0, 0.07, 1, 1)))

def main():
    t0 = time.time(); C.reset()
    b0, i0, K0, F0, UV0 = assemble('tardigrade', 0, 52, 100, 4, 7)
    b1, i1, K1, F1, UV1 = assemble('tardigrade', 1, 22, 44, 3, 4)
    for o in (b0, i0, b1, i1): print(f'  {o.name}: verts {len(o.data.vertices)} tris {len(o.data.polygons)} keys {[k.name for k in o.data.shape_keys.key_blocks]}')
    print('  LOD0 tris', len(b0.data.polygons) + len(i0.data.polygons), 'LOD1 tris', len(b1.data.polygons) + len(i1.data.polygons))
    V = K0['Basis']; print('[tardigrade] bbox active', V.min(0).round(2), V.max(0).round(2), 'tun', K0['tun'].min(0).round(2), K0['tun'].max(0).round(2))
    for lg in LEGS: print('   leg', lg['name'], 'len', round(lg['len'], 2), 'base', lg['c'].round(2))
    na = {}
    if BAKE:
        for key, tag in (('Basis', ''), ('tun', '_tun')):
            hi = high(key, 312, 520, 'tardigrade_high' + tag)
            for lod, (F, UV, K, size) in enumerate(((F0, UV0, K0, 1024), (F1, UV1, K1, 512))):
                low = make_mesh('bake_low', K[key], F, UV)       # その姿勢の形を、焼き込みの受け側にする
                p = os.path.join(COUT, f'tardigrade{tag}{"_lod1" if lod else ""}_na.png')
                img = bake_na(low, hi, size, p, cage=(0.4, 0.9)[lod], flat_rect=(0, 0, 1, 0.06)); to_webp(p)
                if lod == 0: na[key] = img
                bpy.data.objects.remove(low)
            bpy.data.objects.remove(hi)
    export_glb('tardigrade', [b0, i0, b1, i1], morph=True)
    if PREVIEWS:
        mb = mat_micro('pv_body', (0.91, 0.91, 0.87), 0.2, 0.95, 0.3, na.get('Basis'), 1.0)
        mt = mat_micro('pv_tun', (0.80, 0.78, 0.70), 0.62, 0.98, 0.3, na.get('tun'), 1.0)
        mi = mat_micro('pv_inner', (0.72, 0.68, 0.52), 0.42, 0.9, 0.5)
        i0.data.materials.clear(); i0.data.materials.append(mi)
        views = ['side', 'top', 'under', 'front']
        if '--extra' in args: views = views + ['quarter']
        for state, w in (('active', {}), ('tun', {'tun': 1.0}), ('walk_a', {'walk_a': 1.0}), ('walk_c', {'walk_c': 1.0})):
            if '--only' in args and state != args[args.index('--only') + 1]: continue
            set_keys(b0, **w); set_keys(i0, **w)
            b0.data.materials.clear(); b0.data.materials.append(mt if state == 'tun' else mb)
            ctr, sc = ((0, 0, 5.5), 30.0) if state == 'tun' else ((0, 0, 7.5), 62.0)
            render_views(os.path.join(PREV, f'creature_tardigrade_{state}'), [b0, i0], views, ctr, sc)
            if state == 'active' and '--extra' in args:      # 爪の確認用の拡大
                render_views(os.path.join(PREV, 'creature_tardigrade_claw_L2'), [b0, i0], ['side', 'under', 'front'], (-7.6, 4.3, 0.9), 6.0)
                render_views(os.path.join(PREV, 'creature_tardigrade_claw_hind'), [b0, i0], ['side', 'under'], (0, -29.0, 0.9), 12.0)
                render_views(os.path.join(PREV, 'creature_tardigrade_head'), [b0, i0], ['side', 'under'], (0, 22.0, 9.0), 20.0)
    print(f'[tardigrade] done {time.time()-t0:.1f}s')

main()
