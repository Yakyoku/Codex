# 素材とライブラリの出所・ライセンス

## 素材（フォント以外は、すべてこのリポジトリの中で生成）
| 素材 | 作り方 |
|---|---|
| 3D モデル（赤血球、網膜の区画） | `tools/blender/*.py`（bpy）で生成 |
| 主人公 | 体の土台は MakeHuman（CC0、下記）。スーツ・装甲・ヘルメット・道具・骨は `tools/blender/make_hero.py` で生成 |
| 患者の視界の絵 | `tools/blender/make_patient_view.py`（Cycles で描画。実在の場所・人物ではない） |
| 音 | 実行時に Web Audio API で合成（`src/core/audio.ts`） |
| ナレーション（仮） | 端末の読み上げ機能（音声データは同梱していない） |
| フォント | Noto Sans JP（Google Fonts、SIL Open Font License 1.1、`public/static/fonts/OFL.txt`）。ゲームで使う文字だけを切り出して同梱（`tools/make_font.py`） |

## 外部の素材
| 素材 | 出所 | ライセンス | 使い方 |
|---|---|---|---|
| 人体のベース形状と体型の調整データ | MakeHuman（https://github.com/makehumancommunity/makehuman の makehuman/data/3dobjs/base.obj と targets の一部。版は assets/makehuman/SOURCE.txt） | CC0 1.0（assets/makehuman/LICENSE-CC0.md） | 主人公の体の土台。`tools/mh_body.py` で体型を調整し、`tools/blender/make_hero.py` でスーツ・装甲・骨を付ける |

## ライブラリ
| 名前 | 版 | ライセンス | 用途 |
|---|---|---|---|
| three | 0.187.0 | MIT | 描画（公開物に同梱） |
| meshoptimizer の復号器（three 同梱） | — | MIT | メッシュの復号（公開物に同梱） |
| Vite / TypeScript / vitest | 8.3.8 / 7.0.2 / 5.1.1 | MIT / Apache-2.0 / MIT | ビルドとテスト（同梱しない） |
| @gltf-transform | 4.5.1 | MIT | 素材の最適化（同梱しない） |
| bpy（Blender） | 5.3.0 | GPL | モデルの生成に使用（同梱しない。出力したモデルに GPL は及ばない） |
| iwer | 2.8.0 | MIT | VR の模擬による確認（同梱しない） |
| Playwright | 1.63 | Apache-2.0 | 画面の確認（同梱しない） |

| ナレーションの声 | 持ち主の音声会話の仕組み（voice-buddy）を通して OpenAI のリアルタイム音声で前もって録音し、サイトに同梱（実行時の外部読み込みはなし） |
