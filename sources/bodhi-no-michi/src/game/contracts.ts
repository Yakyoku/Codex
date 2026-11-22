// 各モジュールの約束（インターフェース）。実装はこの型に従う。
export type Vec3 = [number, number, number];

// ───────── 音 ─────────
export type SfxName =
  | 'swingLight' | 'swingHeavy' | 'hit' | 'guard' | 'perfectGuard' | 'hurt' | 'dodge'
  | 'breathIn' | 'breathOut' | 'bell' | 'inka' | 'step' | 'uiSelect' | 'uiOpen' | 'page'
  | 'conch' | 'voiceA' | 'voiceUn' | 'stomp' | 'windup' | 'rin';
export type Surface = 'stone' | 'earth' | 'wood' | 'water';
export type ChapterMusic = 'none' | 'title' | 'prologue';
export interface SfxOpts { pos?: Vec3; gain?: number; surface?: Surface; pitch?: number }
export interface AudioEngine {
  /** 最初のユーザー操作（タップ）の中で呼ぶ。AudioContext を作って resume する */
  unlock(): Promise<void>;
  readonly unlocked: boolean;
  setVolumes(v: { music: number; sfx: number; ambience: number }): void; // 各 0..1
  /** 立体音響の聞き手。毎フレーム呼ばれる */
  setListener(pos: Vec3, forward: Vec3, up: Vec3): void;
  /** 章の音楽と環境音へクロスフェードで切り替える */
  playChapter(id: ChapterMusic): void;
  /** 試練の段階 0=探索 1..3=試練の段階。音楽の層が増える */
  setPhase(n: number): void;
  /** 心の澄み具合 0(乱れ)..1(澄む)。乱れると音が曇り不協和が混じる */
  setMind(clarity: number): void;
  sfx(name: SfxName, opts?: SfxOpts): void;
  /** 一時停止など。true で全体を小さくこもらせる */
  setDucked(d: boolean): void;
}

// ───────── 入力 ─────────
export type Action = 'light' | 'heavy' | 'guard' | 'dodge' | 'breathe' | 'pause' | 'interact' | 'touchEarth';
export interface InputState {
  moveX: number; moveY: number;   // -1..1。moveY は前が +
  lookX: number; lookY: number;   // このフレームの視点回転量（ラジアン。右・上が +）
  held: Record<Action, boolean>;
  pressed: Record<Action, boolean>; // このフレームで押された瞬間だけ true
  usingTouch: boolean;
}
export interface Input {
  update(): InputState;
  setEnabled(b: boolean): void;      // false の間は全入力 0（メニュー中）
  setTouchVisible(b: boolean): void; // 仮想スティックとボタンの表示
  dispose(): void;
}

// ───────── 設定と保存 ─────────
export type Difficulty = 'story' | 'standard' | 'ascetic';
export type Quality = 'auto' | 'low' | 'mid' | 'high';
export interface Settings {
  difficulty: Difficulty; quality: Quality;
  volMusic: number; volSfx: number; volAmbience: number;
  invertY: boolean; lookSpeed: number; // 0.5..2
  vrSnapTurn: boolean; vrSeated: boolean; vrVignette: boolean; vrHeightOffset: number; // m
}
export interface SaveData {
  version: 1; chapter: number;               // 到達した章（0=序章）
  cleared: number[]; virtues: string[];      // 授かった徳の id
  zukan: string[];                           // 出会った尊格の id
  checkpoint?: { chapter: number; id: string };
  settings: Settings;
}

// ───────── UI（2D。DOM で作る） ─────────
export interface HudState {
  visible: boolean;
  mind: number;       // 心 0..1（澄み具合）
  body: number;       // 体力 0..1
  inka: number;       // 印可（認められた度合い）0..1
  phase: number;      // 1..3（0 は非表示）
  phaseName: string;  // 例「第一段　阿」
  breath: number;     // 呼吸の輪 0..1（0=吸い始め, 0.5=吐き始め）
  breathLabel: '' | '阿' | '吽';
  hint: string;       // 操作の手がかり（空なら非表示）
}
export interface TitleOpts { canContinue: boolean; vrSupported: boolean }
export type TitleChoice = 'new' | 'continue' | 'vr' | 'chapters' | 'zukan' | 'settings' | 'gallery';
export interface UIHandlers {
  onTitle(choice: TitleChoice): void;
  onSettings(s: Settings): void;          // 設定が変わるたび
  onPause(action: 'resume' | 'photo' | 'title' | 'retry'): void;
  onChapterSelect(chapter: number): void;
  onPhotoExit(): void;
  onFirstGesture(): void;                 // 最初のタップ（音の有効化用）
}
export interface UI {
  showTitle(o: TitleOpts): void; hideTitle(): void;
  showLoading(progress: number, label?: string): void; hideLoading(): void;
  setHud(h: HudState): void;
  /** 字幕。speaker は尊格名など。ms 後に自動で消える。タップで早送り。消えたら解決 */
  subtitle(text: string, speaker?: string, ms?: number): Promise<void>;
  /** 章の入りの題字（例：序章　山門　― 呼吸 ―）を数秒表示 */
  chapterCard(title: string, sub: string, ms?: number): Promise<void>;
  /** 図鑑の 1 画面紹介。閉じたら解決 */
  showZukanCard(id: string): Promise<void>;
  showZukanList(unlocked: string[]): void;
  /** 印可（徳を授かる）演出の文字。閉じたら解決 */
  showInka(virtue: string, reading: string, desc: string): Promise<void>;
  showVirtueTree(virtues: string[]): void;
  showChapterSelect(reached: number): void;
  showSettings(s: Settings): void;
  showPause(): void; hidePause(): void;
  setPhotoMode(on: boolean): void;        // UI を全部消し、「戻る」だけ小さく出す
  /** 場面転換：紙の白が染み広がって覆う(true)／引いて絵が現れる(false) */
  wash(cover: boolean, ms?: number): Promise<void>;
  toast(text: string, ms?: number): void;
  fatal(message: string): void;           // 日本語のエラー表示（真っ白にしない）
  readonly anyModalOpen: boolean;
}
