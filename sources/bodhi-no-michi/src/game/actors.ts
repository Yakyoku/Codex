// 登場する者たち：蓮（主人公）と金剛力士（阿形・吽形）。
import * as THREE from 'three';
import { Humanoid } from '../engine/humanoid';
import { wcMaterial } from '../engine/watercolor';
import { loadMesh } from '../engine/model';
import { MONK_J } from '../models/monk.def';
import { NIO_J } from '../models/nio.def';

export const NIO_SCALE = 2.5; // 2m の造形 × 2.5 ＝ 像高 約5m

export async function createMonk(): Promise<Humanoid & { staff: THREE.Mesh }> {
  const h = new Humanoid(MONK_J, 1) as Humanoid & { staff: THREE.Mesh };
  const [body, head, staff] = await Promise.all([loadMesh('monk-body'), loadMesh('monk-head'), loadMesh('shakujo')]);
  h.add(body, wcMaterial({ vertexColors: true, noiseScale: 3.0, bands: [0.4, 0.7], dens: [1.7, 1.05, 0.5], mottle: 0.7, grain: 0.5, dry: 0.25, rim: 0.7, sway: 1, wind: 0.05, emph: 1 }));
  h.add(head, wcMaterial({ vertexColors: true, noiseScale: 3.0, bands: [0.36, 0.66], soft: 0.03, dens: [1.35, 1.0, 0.45], mottle: 0.3, grain: 0.25, dry: 0.04, rim: 0.5, emph: 1 }));
  h.staff = new THREE.Mesh(staff, wcMaterial({ vertexColors: true, noiseScale: 3.0, dens: [1.6, 1.0, 0.4], mottle: 0.5, grain: 0.5, dry: 0.3, emph: 1 }));
  h.rig.b('handR').add(h.staff);
  h.stride = 0.5; h.stepTime = 0.24;
  return h;
}

export type NioKind = 'a' | 'un';
export async function createNio(kind: NioKind): Promise<Humanoid & { vajra?: THREE.Mesh; kind: NioKind }> {
  const h = new Humanoid(NIO_J, NIO_SCALE) as Humanoid & { vajra?: THREE.Mesh; kind: NioKind };
  h.kind = kind;
  const [body, head, vj] = await Promise.all([loadMesh('nio-body'), loadMesh(kind === 'a' ? 'nio-head-a' : 'nio-head-un'), loadMesh('vajra')]);
  h.add(body, wcMaterial({ vertexColors: true, noiseScale: 1.9, bands: [0.4, 0.7], dens: [1.6, 1.0, 0.42], mottle: 0.55, grain: 0.45, dry: 0.16, rim: 0.8, sway: 1, wind: 0.22, emph: 1 }));
  h.add(head, wcMaterial({ vertexColors: true, noiseScale: 1.9, bands: [0.38, 0.68], soft: 0.03, dens: [1.4, 1.0, 0.45], mottle: 0.3, grain: 0.25, dry: 0.05, rim: 0.6, emph: 1 }));
  if (kind === 'a') {
    h.vajra = new THREE.Mesh(vj, wcMaterial({ vertexColors: true, noiseScale: 4, dens: [1.7, 1.0, 0.3], mottle: 0.5, grain: 0.4, dry: 0.2, emph: 1 }));
    h.vajra.scale.setScalar(1.25); h.vajra.position.set(-0.12, -0.03, 0); h.vajra.rotation.set(Math.PI / 2, 0, 0);
    h.rig.b('handR').add(h.vajra);
  }
  h.stride = 0.5; h.stepTime = 0.5; h.wide = 0.5;
  return h;
}

// ───────── 姿勢（オイラー角・ラジアン）。+x が本人の左。腕は基本姿勢でT字 ─────────
import type { Pose } from '../engine/humanoid';
/** 蓮：自然に立つ。右手に錫杖を立てて持つ */
export const MONK_IDLE: Pose = { armL: [0.05, 0, -1.3], foreL: [0, -0.25, 0], armR: [0.1, 0.25, 1.05], foreR: [0, 1.25, 0], handR: [0, 0, 0], chest: [0.03, 0, 0], head: [0.02, 0, 0] };
/** 金剛力士の構え（阿形：右手の金剛杵を高く振り上げ、左手は開いて下へ張る。腰をひねる） */
export const NIO_A_STAND: Pose = { hips: [0, 0.25, 0.06], spine: [0, -0.12, -0.08], chest: [-0.08, -0.2, -0.04], head: [0.14, 0.25, 0],
  armR: [0, 0.35, -0.55], foreR: [0, 0, -1.25], handR: [0, 0, -0.1], armL: [0.25, -0.15, -0.8], foreL: [0, -0.35, 0], handL: [0, 0, 0.9] };
/** 吽形：左の拳を腰の脇に押し下げ、右手は掌を開いて前へ */
export const NIO_UN_STAND: Pose = { hips: [0, -0.25, -0.06], spine: [0, 0.12, 0.08], chest: [-0.06, 0.2, 0.04], head: [0.14, -0.25, 0],
  armL: [0.15, 0.1, -1.0], foreL: [0, -0.5, 0], handL: [0, 0, -0.2], armR: [0, 0.9, 0.55], foreR: [0, 0.3, -1.3], handR: [0, 0, -1.1] };
