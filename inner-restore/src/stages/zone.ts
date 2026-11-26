// ステージ1「目」の区域の共通の形。区域ごとに別の模型・遊びを持つが、画面版と VR 版はこの形だけを見る。
// 区域は後から読み込む（区域ごとに別のファイルになる）。
import type * as THREE from 'three/webgpu';
import type { HealthField } from '../core/health';
import type { N } from '../core/tsl';

export interface ZoneMeta {
  id: string;
  hud: string;              // 左上の見出し（例：網膜・内側の面　血流の回復）
  enter?: string;           // 入口（泳いで降りる間）の案内
  arrive: string;           // 区域に着いたときの案内
  plugName: string;         // 塊の呼び名（例：閉塞点）
  plugHit: string;          // 初めて塊に光が当たったときの案内
  plugCleared: (left: number) => string;
  done: string;             // 区域を治しきったときの言葉
  doneTitle: string;        // 区域を治しきったときの画面の見出し
  causeMain: string;        // 診断の「主な原因」
  swimCeil?: number;        // 泳げる高さ（床から）
  plugDiag?: { short: string; cause: string };   // 診断での塊の説明
  patient?: 'sight' | 'smell' | 'breath' | 'comfort';
  perception?: number;                         // 知覚加速（体内の時間を何倍ゆっくり見るか）。省略時は tuning の値
  scaleNote?: string;                          // 左上の大きさの目安（例：潜行士の身長 2µm ／ 赤血球の直径 7.8µm）                  // 患者の変化の見せ方（目＝視界、鼻＝におい）
}
export interface Plug { p: THREE.Vector3; hp: number; cleared: boolean }
export interface ZoneStage {
  meta: ZoneMeta;
  scene: THREE.Scene; health: HealthField; size: [number, number];
  u: { time: N; scan: N; lightIn: N; beamPos: N; beamOn: N; heartPhase: N; scanR: N; scanOrigin: N; scanPulse: N };
  start: { pos: THREE.Vector3; yaw: number; swimming: boolean };
  floorHeight(x: number, z: number): number;
  /** 診断の原因の推定（その場所の悪さの理由） */
  causeAt(x: number, z: number): { short: string; cause: string };
  progress(): number;
  plugs: Plug[];
  setOnPlug(f: (i: number, kind: 'hit' | 'cleared' | 'pulse') => void): void;
  /** 当たり判定（立っている柱などから押し出す）。p を書き換える */
  collide?(p: THREE.Vector3, radius: number): void;
  update(dt: number, t: number, camera: THREE.Camera): void;
  heal(x: number, z: number, dt: number): number;
  /** 出会い：いま紹介してよいもの（id と、カメラを寄せる場所） */
  encounters(pos: THREE.Vector3, t: number, walked: number): { id: string; at: THREE.Vector3 | null }[];
  /** 流れ（粘液など）が、その場所のものを運ぶ速さ（µm/秒） */
  drift?(p: THREE.Vector3): THREE.Vector3;
  /** 拍子の位相（0〜1。0 付近が打つ瞬間）。照準の輪が脈打つ */
  beat?(): number;
  /** 潜行士の位置（線毛がよけるなど） */
  setDiver?(p: THREE.Vector3): void;
  /** 動くものの紹介中、カメラが追いかける位置 */
  track?(id: string): THREE.Vector3 | null;
  /** 音と脈動の元になる「生き生きさ」（血流など）0〜1 */
  flowing(): number;
  sun: THREE.DirectionalLight;
}
export type ZoneBuilder = (renderer: THREE.WebGPURenderer, tier: string, opts?: { entrance?: boolean }) => Promise<ZoneStage>;

/** 区域の並び（GDD の道のり）。入口の硝子体は、網膜の区域の上から泳いで降りる形で含める */
export interface ZoneEntry { id: string; stage: string; name: string; load: () => Promise<{ build: ZoneBuilder }> }
/** すべてのステージの区域（ステージの中では、この並びで進む） */
export const ZONES: ZoneEntry[] = [
  { id: 'retina', stage: 'eye', name: '区域A　網膜の内側の面', load: () => import('./eye/retina').then((m) => ({ build: m.buildRetina as unknown as ZoneBuilder })) },
  { id: 'lens', stage: 'eye', name: '区域B　水晶体', load: () => import('./eye/lens').then((m) => ({ build: m.buildLens })) },
  { id: 'photo', stage: 'eye', name: '区域C　視細胞の森　→　病巣の核：黄斑の中心', load: () => import('./eye/photo').then((m) => ({ build: m.buildPhoto })) },
  { id: 'cilia', stage: 'nose', name: '区域A　線毛の森', load: () => import('./nose/airway').then((m) => ({ build: m.buildCilia })) },
  { id: 'mucus', stage: 'nose', name: '区域B　粘液の川', load: () => import('./nose/airway').then((m) => ({ build: m.buildMucus })) },
  { id: 'olfactory', stage: 'nose', name: '区域C　嗅上皮　→　病巣の核：炎症の中心', load: () => import('./nose/olfactory').then((m) => ({ build: m.buildOlfactory })) },
  { id: 'bronchiole', stage: 'lung', name: '区域A　細気管支', load: () => import('./nose/airway').then((m) => ({ build: m.buildBronchiole })) },
  { id: 'alveolus', stage: 'lung', name: '区域B　肺胞の中', load: () => import('./lung/alveolus').then((m) => ({ build: m.buildAlveolus })) },
  { id: 'alvwall', stage: 'lung', name: '区域C　肺胞の壁　→　病巣の核：炎症の芯', load: () => import('./lung/alveolus').then((m) => ({ build: m.buildAlvWall })) },
  { id: 'villi', stage: 'gut', name: '区域A　絨毛の草原（小腸）', load: () => import('./gut/villi').then((m) => ({ build: m.buildVilli })) },
  { id: 'colon', stage: 'gut', name: '区域B　大腸の粘液', load: () => import('./gut/villi').then((m) => ({ build: m.buildColon })) },
  { id: 'crypt', stage: 'gut', name: '区域C　陰窩　→　病巣の核：炎症の芯', load: () => import('./gut/villi').then((m) => ({ build: m.buildCrypt })) },
];

/** ステージ（器官）の一覧。区域を作ったステージだけが遊べる */
export const STAGES: { id: string; ja: string }[] = [{ id: 'eye', ja: '目' }, { id: 'nose', ja: '鼻' }, { id: 'lung', ja: '肺' }, { id: 'gut', ja: '腸' }];
export const stageZones = (stage: string) => ZONES.filter((z) => z.stage === stage);
/** そのステージの進み具合（治しきった区域の割合） */
export const stageProgress = (done: string[] | undefined, stage: string) => { const zs = stageZones(stage); return zs.length ? zs.filter((z) => done?.includes(z.id)).length / zs.length : 0; };
