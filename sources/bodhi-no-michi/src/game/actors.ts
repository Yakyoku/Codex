// 登場する者たち：蓮（主人公）と金剛力士（阿形・吽形）。
import * as THREE from 'three';
import { Humanoid } from '../engine/humanoid';
import { wcMaterial } from '../engine/watercolor';
import { loadMesh } from '../engine/model';
import { MONK_J } from '../models/monk.def';
import { NIO_J } from '../models/nio.def';
import type { Joints } from '../models/skeleton';

export const NIO_SCALE = 2.5; // 2m の造形 × 2.5 ＝ 像高 約5m

export async function createMonk(): Promise<Humanoid & { staff: THREE.Mesh }> {
  // 体・顔・衣は Blender で作った一つの造形（tools/blender/build_monk.py）。関節の位置も造形から読む
  const [body, staff] = await Promise.all([loadMesh('monk-bl'), loadMesh('shakujo')]);
  const J = (body.userData.joints as Joints | undefined) ?? MONK_J;
  const h = new Humanoid(J, 1) as Humanoid & { staff: THREE.Mesh };
  h.add(body, wcMaterial({ vertexColors: true, bands: [0.36, 0.66], soft: 0.08, dens: [1.3, 0.92, 0.45], mottle: 0.22, grain: 0.08, dry: 0.05, rim: 0.6, noiseScale: 1.4, sway: 1, wind: 0.05, emph: 0.6 }));
  h.staff = new THREE.Mesh(staff, wcMaterial({ vertexColors: true, noiseScale: 1.5, bands: [0.36, 0.66], soft: 0.06, dens: [1.5, 1.0, 0.45], mottle: 0.25, grain: 0.1, dry: 0.08, emph: 1 }));
  h.rig.b('handR').add(h.staff);
  h.stride = 0.5; h.stepTime = 0.24;
  return h;
}

export type NioKind = 'a' | 'un';
export async function createNio(kind: NioKind): Promise<Humanoid & { vajra?: THREE.Mesh; kind: NioKind }> {
  // 体と顔は Blender で作った一つの造形（tools/blender/build_nio.py）。関節の位置も造形から読む
  const [body, vj] = await Promise.all([loadMesh(kind === 'a' ? 'nio-bl-a' : 'nio-bl-un'), loadMesh('vajra')]);
  const J = (body.userData.joints as Joints | undefined) ?? NIO_J;
  const h = new Humanoid(J, NIO_SCALE) as Humanoid & { vajra?: THREE.Mesh; kind: NioKind };
  h.kind = kind;
  h.add(body, wcMaterial({ vertexColors: true, noiseScale: 1.9, bands: [0.36, 0.66], soft: 0.06, dens: [1.6, 1.05, 0.5], mottle: 0.5, grain: 0.3, dry: 0.12, rim: 0.8, sway: 1, wind: 0.22, emph: 1 }));
  if (kind === 'a') {
    h.vajra = new THREE.Mesh(vj, wcMaterial({ vertexColors: true, noiseScale: 4, dens: [1.7, 1.0, 0.3], mottle: 0.5, grain: 0.4, dry: 0.2, emph: 1 }));
    h.vajra.scale.set(1.35, 0.72, 1.35); h.vajra.position.set(-0.08, -0.02, 0); h.vajra.rotation.set(Math.PI / 2, 0, 0);
    h.rig.b('handR').add(h.vajra);
  }
  h.stride = 0.5; h.stepTime = 0.5; h.wide = 0.55; h.hipDrop = 0.1;
  return h;
}

// ───────── 姿勢（オイラー角・ラジアン）。+x が本人の左。腕は基本姿勢でT字 ─────────
import type { Pose } from '../engine/humanoid';
/** 蓮：自然に立つ。右手に錫杖を立てて持つ */
export const MONK_IDLE: Pose = { armL: [0.05, 0, -1.47], foreL: [0, -0.12, 0], armR: [0.1, 0.25, 1.05], foreR: [0, 1.25, 0], handR: [0, 0, 0], chest: [0.03, 0, 0], head: [0.02, 0, 0] };
/** 金剛力士の構え（阿形：右手の金剛杵を高く振り上げ、左手は開いて下へ張る。腰をひねる） */
export const NIO_A_STAND: Pose = { hips: [0, 0.3, 0.07], spine: [0.03, -0.12, -0.1], chest: [-0.1, -0.22, -0.05], head: [0.16, 0.2, 0.05],
  armR: [0, 0.3, -0.75], foreR: [0, 0, -1.35], handR: [0, 0, -0.1], armL: [0.3, 0.0, -0.95], foreL: [0, -0.3, 0], handL: [0, 0, 0.9] };
/** 吽形：左の掌を開いて前へ向け、右の拳を腰の脇に押し下げる */
export const NIO_UN_STAND: Pose = { hips: [0, -0.3, -0.07], spine: [0.03, 0.12, 0.1], chest: [-0.08, 0.22, 0.05], head: [0.16, -0.2, -0.05],
  armR: [0.15, -0.15, 1.1], foreR: [0, 0.55, 0], handR: [0, 0, 0.2], armL: [0, -0.5, -0.5], foreL: [0, 0, 1.9], handL: [0, 0, 0.9] };
