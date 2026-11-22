// 光と空気：地下は本来まっ暗。光源は主人公のライト、地表から差し込むわずかな光に絞る。
import * as THREE from 'three/webgpu';
import { normalWorld, mix, vec3, smoothstep, float, pow, saturate } from 'three/tsl';

/** 映り込み用の環境の画像を、外部の素材に頼らず自分で作る（上からのわずかな冷たい光＋暖色の反射） */
export function makeEnvironment(renderer: THREE.WebGPURenderer): THREE.Texture {
  const s = new THREE.Scene();
  const m = new THREE.MeshBasicNodeMaterial({ side: THREE.BackSide });
  const y = normalWorld.y.negate(); // BackSide なので反転
  const up = smoothstep(0.2, 1.0, y);
  const sky = vec3(0.55, 0.68, 0.85).mul(pow(up, float(3))).mul(1.6);
  const warm = vec3(0.22, 0.13, 0.07).mul(saturate(float(1).sub(y.abs().mul(1.4)))).mul(0.5);
  m.colorNode = mix(vec3(0.012, 0.009, 0.007), sky, up).add(warm);
  s.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), m));
  const pm = new THREE.PMREMGenerator(renderer);
  const rt = pm.fromScene(s, 0.04);
  return rt.texture;
}

export interface Lights { lamp: THREE.SpotLight; fill: THREE.PointLight; top: THREE.DirectionalLight; hemi: THREE.HemisphereLight; }
export function addLights(scene: THREE.Scene, camera: THREE.Camera, opts: { shadows: number }): Lights {
  // 主人公のライト：暖色のスポット。影を落とすのはこれだけ
  const lamp = new THREE.SpotLight(0xffe2bd, 60, 160, 1.0, 0.8, 1.15);
  lamp.position.set(3.2, 2.6, 0.5); lamp.target.position.set(-0.6, -1.2, -14);
  camera.add(lamp); camera.add(lamp.target);
  if (opts.shadows > 0) { lamp.castShadow = true; lamp.shadow.mapSize.set(1024, 1024); lamp.shadow.camera.near = 1; lamp.shadow.camera.far = 90; lamp.shadow.bias = -0.0015; lamp.shadow.normalBias = 0.25; }
  // ライトのこぼれ光（影なし）：近くの粒の裏側が真っ黒につぶれないように
  const fill = new THREE.PointLight(0xffc998, 5, 40, 1.3); fill.position.set(-0.8, 0.4, 1.0); camera.add(fill);
  // 地表から粒のすき間を通って届く、わずかな昼の光
  const top = new THREE.DirectionalLight(0xbfd4ff, 0.22); top.position.set(-0.3, 1, 0.25); scene.add(top);
  const hemi = new THREE.HemisphereLight(0x51607a, 0x150d08, 0.16); scene.add(hemi);
  scene.add(camera);
  return { lamp, fill, top, hemi };
}
