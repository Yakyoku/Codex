// 生の GLB（Blender 出力）に焼き込みテクスチャを付け、glTF Transform で最適化する。
//   node tools/pack-glb.mjs <入力.raw.glb> <出力.glb> [--orm tex.png] [--texsize 512]
// ORM テクスチャ: R=AO（occlusionTexture）, G=厚み（KHR_materials_volume.thicknessTexture）
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRMaterialsVolume } from '@gltf-transform/extensions';
import { dedup, prune, weld, reorder, quantize, meshopt, textureCompress } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';

const [inp, out, ...rest] = process.argv.slice(2);
const opt = {};
for (let i = 0; i < rest.length; i += 2) opt[rest[i].replace(/^--/, '')] = rest[i + 1];
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(inp);
if (opt.orm) {
  const tex = doc.createTexture('orm').setImage(fs.readFileSync(opt.orm)).setMimeType('image/png');
  const vol = doc.createExtension(KHRMaterialsVolume);
  for (const m of doc.getRoot().listMaterials()) {
    m.setOcclusionTexture(tex);
    const v = m.getExtension('KHR_materials_volume') || vol.createVolume();
    v.setThicknessTexture(tex).setThicknessFactor(1);
    m.setExtension('KHR_materials_volume', v);
  }
}
const size = Number(opt.texsize || 1024);
await doc.transform(
  dedup(), prune({ keepAttributes: true }), weld(),
  reorder({ encoder: MeshoptEncoder }), quantize(),
  textureCompress({ encoder: sharp, targetFormat: 'webp', quality: 90, resize: [size, size] }),
  meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
);
await io.write(out, doc);
console.log(`${out}: ${fs.statSync(inp).size} -> ${fs.statSync(out).size} bytes`);
