// 生き物のデータ（1種1ファイル）。Docs/SPECIES.md と中身を一致させる。紹介カードと図鑑はここから自動で作る。
export interface Species {
  id: string;
  /** 'organism' = 生き物、'element' = 土の要素（団粒・水の膜など） */
  kind: 'organism' | 'element';
  nameJa: string;
  /** 題名の表示用。漢字には（よみ）を付ける。なければ nameJa */
  title?: string;
  /** 学名（生き物のみ） */
  sci?: string;
  taxon?: string;
  /** 実際の大きさ（表示用） */
  size: string;
  /** 身近なものとの比較 */
  sizeCompare: string;
  /** 初登場時の説明文（1〜2文） */
  intro: string;
  /** 図鑑用：姿・動き・働き・関係 */
  look?: string; motion?: string; role?: string; relations?: string;
  stage: number;
  model?: string;
  sources: string[];
}
const mods = import.meta.glob<Species>('../data/species/*.json', { eager: true, import: 'default' });
export const SPECIES: Record<string, Species> = Object.fromEntries(Object.values(mods).map((s) => [s.id, s]));
