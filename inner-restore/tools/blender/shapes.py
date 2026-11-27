"""なめらかな管・束をつくる共通の道具（make_heart.py・make_brain.py で共用）"""
import math
import numpy as np, bpy
import irlib as L


def join(objs, name):
    L.select_only(objs[0]); [o.select_set(True) for o in objs[1:]]; bpy.context.view_layer.objects.active = objs[0]; bpy.ops.object.join()
    o = bpy.context.object; o.name = name; bpy.ops.object.shade_smooth(); return o


def tube(pts, r, name="t", res=3, taper=None):
    cu = bpy.data.curves.new(name, "CURVE"); cu.dimensions = "3D"; sp = cu.splines.new("NURBS"); sp.points.add(len(pts) - 1)
    for k, q in enumerate(pts):
        sp.points[k].co = (*q, 1); sp.points[k].radius = taper[k] if taper else 1
    sp.use_endpoint_u = True; sp.order_u = 4; sp.resolution_u = 10; cu.bevel_depth = r; cu.bevel_resolution = res; cu.use_fill_caps = True
    co = bpy.data.objects.new(name, cu); bpy.context.scene.collection.objects.link(co)
    L.select_only(co); bpy.ops.object.convert(target="MESH"); return bpy.context.object


def sweep(name, path, radius_fn, nr=28, flat=0.82, groove=0.0, ngroove=0, sub=True):
    """path: (N,3) の点列。radius_fn(t, a) で半径。断面は楕円（flat）、長さの向きの筋（groove）。両端は半球で丸く閉じる"""
    path = np.asarray(path, float); n = len(path)
    rings = []   # (中心, 向き, 半径の倍率, t)
    def frame(i):
        d = path[min(n - 1, i + 1)] - path[max(0, i - 1)]; return d / np.linalg.norm(d)
    d0, d1 = frame(0), frame(n - 1); r0, r1 = radius_fn(0, 0), radius_fn(1, 0)
    NC = 6
    for k in range(NC, 0, -1):
        th = k / NC * math.pi / 2 * 0.97; rings.append((path[0] - d0 * r0 * math.sin(th), d0, math.cos(th), 0.0))
    for i in range(n): rings.append((path[i], frame(i), 1.0, i / (n - 1)))
    for k in range(1, NC + 1):
        th = k / NC * math.pi / 2 * 0.97; rings.append((path[-1] + d1 * r1 * math.sin(th), d1, math.cos(th), 1.0))
    verts, faces = [], []
    for (p, d, m, t) in rings:
        up = np.array([0, 0, 1.0]) if abs(d[2]) < 0.95 else np.array([1.0, 0, 0])
        s_ = np.cross(d, up); s_ /= np.linalg.norm(s_); u = np.cross(s_, d)
        for j in range(nr):
            a = 2 * math.pi * j / nr
            r = radius_fn(t, a) * m
            if ngroove: r *= 1 - groove * (0.5 + 0.5 * math.cos(a * ngroove)) ** 4
            verts.append(p + s_ * math.cos(a) * r + u * math.sin(a) * r * flat)
    R = len(rings)
    for i in range(R - 1):
        for j in range(nr):
            a, b = i * nr + j, i * nr + (j + 1) % nr
            faces.append((a, a + nr, b + nr, b))
    c0 = len(verts); verts.append(rings[0][0] - rings[0][1] * 0.01); c1 = len(verts); verts.append(rings[-1][0] + rings[-1][1] * 0.01)
    for j in range(nr):
        faces.append((c0, j, (j + 1) % nr)); a, b = (R - 1) * nr + j, (R - 1) * nr + (j + 1) % nr; faces.append((a, c1, b))
    ob = L.mesh_object(name, np.array(verts), faces)
    L.select_only(ob)
    if sub:
        m = ob.modifiers.new("sub", "SUBSURF"); m.levels = 1; bpy.ops.object.modifier_apply(modifier=m.name)
    bpy.ops.object.shade_smooth()
    return ob


def decimate(ob, tris):
    L.select_only(ob); now = sum(len(p.vertices) - 2 for p in ob.data.polygons)
    if now > tris:
        m = ob.modifiers.new("d", "DECIMATE"); m.ratio = tris / now; bpy.ops.object.modifier_apply(modifier=m.name)
    bpy.ops.object.shade_smooth()


