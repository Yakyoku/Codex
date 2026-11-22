"""第1部の経路確認用：でこぼこのある土の粒を1つ作り、AO を焼いて GLB で書き出す。
実行: python3 assets/blender/soil_grain_test.py"""
import bpy, sys, os, time
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'lib'))
from common import *
t0 = time.time()
reset()
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=5, radius=1)
g = bpy.context.object; g.name = 'soil_grain'
g.scale = (1.0, 0.82, 0.7); bpy.ops.object.transform_apply(scale=True)
displace_noise(g, [(0.9, 0.35, 'n'), (2.2, 0.16, 'ridge'), (6.0, 0.05, 'n'), (14.0, 0.018, 'n')], seed=1)
bpy.ops.object.shade_smooth()
mat = bpy.data.materials.new('soil'); mat.use_nodes = True
bsdf = mat.node_tree.nodes['Principled BSDF']
bsdf.inputs['Base Color'].default_value = (0.21, 0.12, 0.06, 1); bsdf.inputs['Roughness'].default_value = 0.85
g.data.materials.append(mat)
smart_uv(g)
ao = bake(g, 'AO', 512, samples=24)
p = os.path.join(OUT, 'soil_grain_test_ao.png'); save_image(ao, p)
# AO を glTF の occlusion として載せる（Blender の glTF 書き出しの決まり：glTF Material Output）
nt = mat.node_tree
tex = nt.nodes.new('ShaderNodeTexImage'); tex.image = bpy.data.images.load(p); tex.image.colorspace_settings.name = 'Non-Color'
grp = bpy.data.node_groups.new('glTF Material Output', 'ShaderNodeTree')
grp.interface.new_socket('Occlusion', in_out='INPUT', socket_type='NodeSocketFloat')
gn = nt.nodes.new('ShaderNodeGroup'); gn.node_tree = grp
nt.links.new(tex.outputs['Color'], gn.inputs['Occlusion'])
export_glb(os.path.join(OUT, 'soil_grain_test.glb'), [g])
render_views([g], os.path.join(PREVIEW, 'soil_grain_test'), size=384, samples=16)
print('total', round(time.time() - t0, 1), 's', 'tris', len(g.data.polygons))
