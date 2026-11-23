# 錫杖（しゃくじょう）を Blender で作る：木の柄、金具、宝珠形の輪の頭と五輪塔、左右に三つずつの遊環
import bpy, bmesh, math, sys, json, struct
from mathutils import Vector, Matrix
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = ARGS[0] if ARGS else '/tmp/shakujo.bin'; PREVIEW = ARGS[1] if len(ARGS) > 1 else ''
for ob in list(bpy.data.objects): bpy.data.objects.remove(ob, do_unlink=True)
WOOD = (0.52, 0.38, 0.27); METAL = (0.74, 0.6, 0.36); METAL_D = (0.56, 0.44, 0.27)
parts = []
def obj(bm, col):
    me = bpy.data.meshes.new('p'); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new('p', me); bpy.context.scene.collection.objects.link(ob); ob['col'] = col; parts.append(ob); return ob
def tube(rings, seg, fn, col, closed=False):
    bm = bmesh.new(); g = []
    for i in range(rings + (0 if closed else 1)):
        g.append([bm.verts.new(fn(i / rings, j / seg * 2 * math.pi)) for j in range(seg)])
    n = len(g)
    for i in range(n if closed else n - 1):
        for j in range(seg):
            bm.faces.new((g[i][j], g[i][(j + 1) % seg], g[(i + 1) % n][(j + 1) % seg], g[(i + 1) % n][j]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return obj(bm, col)
def lathe(prof, col, seg=24):
    # prof: [(z, r)] を z 軸まわりに回す
    return tube(len(prof) - 1, seg, lambda t, a: Vector((math.cos(a) * r_(t), math.sin(a) * r_(t), z_(t))), col) if False else _lathe(prof, col, seg)
def _lathe(prof, col, seg):
    bm = bmesh.new(); g = [[bm.verts.new((math.cos(j / seg * 2 * math.pi) * r, math.sin(j / seg * 2 * math.pi) * r, z)) for j in range(seg)] for z, r in prof]
    for i in range(len(g) - 1):
        for j in range(seg): bm.faces.new((g[i][j], g[i][(j + 1) % seg], g[i + 1][(j + 1) % seg], g[i + 1][j]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return obj(bm, col)
def ring(c, R, r, axis, col, seg=40, rs=10):
    # axis: 輪の面の法線
    ax = Vector(axis).normalized(); u = ax.orthogonal().normalized(); w = ax.cross(u)
    return tube(seg, rs, lambda t, a: c + (u * math.cos(t * 2 * math.pi) + w * math.sin(t * 2 * math.pi)) * (R + r * math.cos(a)) + ax * r * math.sin(a), col, closed=True)
# 柄：ゆるく細る木の棒、節を少し
_lathe([(-1.0, 0.012), (-0.98, 0.016)] + [(-0.98 + i * 0.06, 0.0165 - i * 0.00004 + (0.0012 if i % 7 == 3 else 0)) for i in range(25)] + [(0.5, 0.0152)], WOOD, 16)
# 石突（下の金具）と、上の口金
_lathe([(-1.04, 0.0), (-1.035, 0.008), (-1.0, 0.0145), (-0.955, 0.0175), (-0.945, 0.019), (-0.935, 0.0175)], METAL_D, 16)
_lathe([(0.46, 0.0175), (0.47, 0.021), (0.5, 0.019), (0.53, 0.024), (0.55, 0.026), (0.57, 0.018), (0.585, 0.012)], METAL, 20)
# 頭：宝珠形（上がとがる）の大きな輪。輪は x-z 平面
def loop_pt(t):
    a = t * 2 * math.pi; R = 0.085
    x = math.sin(a) * R; z = (1 - math.cos(a)) * R
    k = max(0.0, z / (2 * R) - 0.45) / 0.55                    # 上へ行くほど絞る
    x *= 1 - 0.75 * k ** 1.6
    return Vector((x, 0, 0.575 + z + 0.04 * k ** 2))
def loop_fn(t, a):
    p = loop_pt(t); q = loop_pt(t + 0.003) - loop_pt(t - 0.003); n = q.cross(Vector((0, 1, 0))).normalized()
    r = 0.0075 + 0.002 * math.cos(t * 2 * math.pi * 2)
    return p + n * math.cos(a) * r + Vector((0, 1, 0)) * math.sin(a) * r
tube(120, 10, loop_fn, METAL, closed=True)
# 頂の宝珠
_lathe([(0.775, 0.0), (0.78, 0.009), (0.79, 0.013), (0.8, 0.012), (0.812, 0.007), (0.825, 0.0)], METAL, 16)
# 輪の中の五輪塔（小さな塔）
_lathe([(0.585, 0.011), (0.6, 0.011), (0.602, 0.016), (0.618, 0.016), (0.62, 0.011), (0.64, 0.013), (0.655, 0.009), (0.66, 0.017), (0.664, 0.017), (0.672, 0.006), (0.68, 0.009), (0.69, 0.009), (0.7, 0.0)], METAL_D, 16)
# 遊環：輪の左右に三つずつ、輪の線にかかって垂れる
for sg in (1, -1):
    for k, t in enumerate((0.2, 0.28, 0.36)):
        p = loop_pt(t if sg > 0 else 1 - t)
        ring(p + Vector((0, 0, -0.026)), 0.024, 0.0042, (0, 1, 0.25 * (k - 1)), METAL)
# 書き出し（ゲームの形式。骨は 0 のみ）
pos, nrm, col, idx = [], [], [], []
for ob in parts:
    me = ob.data; me.calc_loop_triangles(); base = len(pos) // 3
    for p in me.polygons: p.use_smooth = True
    for v in me.vertices:
        pos += [v.co.x, v.co.z, -v.co.y]; nrm += [v.normal.x, v.normal.z, -v.normal.y]
        c = ob['col']; col += [round(c[0] * 255), round(c[1] * 255), round(c[2] * 255), 0]
    for t in me.loop_triangles: idx += [base + t.vertices[0], base + t.vertices[1], base + t.vertices[2]]
nv = len(pos) // 3; mn = [min(pos[k::3]) for k in range(3)]; mx = [max(pos[k::3]) for k in range(3)]
head = json.dumps({'nv': nv, 'ni': len(idx), 'use16': nv < 65536, 'min': mn, 'max': mx, 'src': 'blender'}).encode()
pad = lambda b: b + b'\0' * ((4 - len(b) % 4) % 4)
data = struct.pack('<I', len(head)) + pad(head) + pad(struct.pack('<%dH' % len(pos), *[round((pos[i] - mn[i % 3]) / (mx[i % 3] - mn[i % 3]) * 65535) for i in range(len(pos))]))
data += pad(struct.pack('<%db' % len(nrm), *[max(-127, min(127, round(x * 127))) for x in nrm])) + pad(bytes(col)) + pad(bytes(nv * 4)) + pad(bytes([255, 0, 0, 0] * nv))
data += pad(struct.pack('<%d%s' % (len(idx), 'H' if nv < 65536 else 'I'), *idx))
open(OUT, 'wb').write(data); print('exported', OUT, 'verts', nv, 'tris', len(idx) // 3)
if PREVIEW:
    scn = bpy.context.scene; scn.render.engine = 'CYCLES'; scn.cycles.samples = 16; scn.render.resolution_x, scn.render.resolution_y = 600, 900
    mat = bpy.data.materials.new('m'); mat.use_nodes = True; bs = mat.node_tree.nodes['Principled BSDF']
    at = mat.node_tree.nodes.new('ShaderNodeAttribute'); at.attribute_name = 'Col'
    for ob in parts:
        me = ob.data; ca = me.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT')
        for i in range(len(me.vertices)): ca.data[i].color = (*ob['col'], 1)
        me.materials.append(mat)
    mat.node_tree.links.new(at.outputs['Color'], bs.inputs['Base Color'])
    w = bpy.data.worlds.new('w'); scn.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[1].default_value = 0.6
    sun = bpy.data.objects.new('s', bpy.data.lights.new('s', 'SUN')); sun.data.energy = 3; sun.rotation_euler = (0.8, 0.3, 0.5); scn.collection.objects.link(sun)
    cam = bpy.data.objects.new('c', bpy.data.cameras.new('c')); scn.collection.objects.link(cam); scn.camera = cam
    cam.location = (0.25, -0.6, 0.68); cam.rotation_euler = (math.radians(90), 0, math.radians(22)); cam.data.lens = 60
    scn.render.filepath = PREVIEW; bpy.ops.render.render(write_still=True)
