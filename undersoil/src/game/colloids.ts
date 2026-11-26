// 水の中をただよう、ごく小さな粒（粘土のコロイド、腐植のかけら）。1 単位 = 10 µm。
// 本物の顕微鏡の動画では、水の中に 0.1〜2 µm ほどの小さな粒が無数に見え、熱の揺らぎ（ブラウン運動）で、
// 小刻みにふるえながら少しずつさまよう。手前の粒はピントが外れて丸くぼけ、奥行きの手がかりになる。
// ・カメラのまわり（半径 R）にだけ置き、カメラが動くと、外へ出た粒を反対側に回す（数を一定に保つ）
// ・湿り具合が高いほど多く見える（乾いた所には水がない）
import * as THREE from 'three/webgpu';
import { float, instancedBufferAttribute, mix, positionLocal, smoothstep, uniform, vec3, cameraPosition, positionWorld, oneMinus, saturate, length } from 'three/tsl';

export function buildColloids(count: number, R = 7, nearFade = 0.15) {
  const geo = new THREE.IcosahedronGeometry(1, 1);
  const pos = new Float32Array(count * 3), size = new Float32Array(count), tone = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos.set([(Math.random() * 2 - 1) * R, (Math.random() * 2 - 1) * R, (Math.random() * 2 - 1) * R], i * 3);
    size[i] = 0.012 + 0.07 * Math.random() ** 3;   // 半径 0.1〜0.8 µm（ほとんどは小さい）
    tone[i] = Math.random();
  }
  const aPos = new THREE.InstancedBufferAttribute(pos, 3); aPos.setUsage(THREE.DynamicDrawUsage);
  const P = instancedBufferAttribute(aPos) as unknown as ReturnType<typeof vec3>;
  const S = instancedBufferAttribute(new THREE.InstancedBufferAttribute(size, 1)) as unknown as ReturnType<typeof float>;
  const T = instancedBufferAttribute(new THREE.InstancedBufferAttribute(tone, 1)) as unknown as ReturnType<typeof float>;
  const uWet = uniform(0);
  const m = new THREE.MeshStandardNodeMaterial({ transparent: true, depthWrite: false });
  m.positionNode = positionLocal.mul(S).add(P);
  // 色：粘土は明るい黄褐色、腐植は暗い茶色。遠いほど霧に溶けるので、近い粒ほどはっきり
  m.colorNode = mix(vec3(0.42, 0.34, 0.22), vec3(0.12, 0.08, 0.05), smoothstep(0.55, 0.85, T));
  m.roughnessNode = float(0.6); m.metalnessNode = float(0);
  const d = length(positionWorld.sub(cameraPosition));
  m.opacityNode = uWet.mul(smoothstep(float(R), float(R * 0.55), d)).mul(smoothstep(float(nearFade), float(nearFade * 2.0 + 0.2), d)).mul(mix(float(0.55), float(0.9), T));
  void oneMinus;
  const mesh = new THREE.InstancedMesh(geo, m, count); mesh.frustumCulled = false; mesh.name = 'colloids'; mesh.renderOrder = 8;
  const arr = aPos.array as Float32Array; const vel = new Float32Array(count * 3);
  let center = new THREE.Vector3(), first = true;
  return {
    mesh,
    /** cam：カメラの位置、wet：その場所の湿り（0〜1） */
    update(dt: number, cam: THREE.Vector3, wet: number) {
      uWet.value += (wet - uWet.value) * (1 - Math.exp(-dt * 1.5));
      if (first) { for (let i = 0; i < count; i++) { arr[i * 3] += cam.x; arr[i * 3 + 1] += cam.y; arr[i * 3 + 2] += cam.z; } first = false; }
      center = cam;
      // ブラウン運動：小さい粒ほど大きくふるえる（拡散係数は半径に反比例）。ゆるい流れも少し
      const k = Math.sqrt(Math.min(dt, 0.05));
      for (let i = 0; i < count; i++) {
        const j = i * 3, amp = 0.006 / size[i] * k;
        vel[j] = vel[j] * 0.6 + (Math.random() * 2 - 1) * amp; vel[j + 1] = vel[j + 1] * 0.6 + (Math.random() * 2 - 1) * amp; vel[j + 2] = vel[j + 2] * 0.6 + (Math.random() * 2 - 1) * amp;
        arr[j] += vel[j]; arr[j + 1] += vel[j + 1] - 0.002 * dt; arr[j + 2] += vel[j + 2];
        // カメラから離れすぎた粒は、反対側へ回す
        for (let a = 0; a < 3; a++) { const c = center.getComponent(a); if (arr[j + a] - c > R) arr[j + a] -= 2 * R; else if (arr[j + a] - c < -R) arr[j + a] += 2 * R; }
      }
      aPos.needsUpdate = true;
    },
  };
}
