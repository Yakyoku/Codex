# UNDERSOIL（このブランチの作業対象）

作業の前に、必ず次の2つを読むこと。

1. `undersoil/Docs/GAME_BRIEF.md`（制作依頼の全文）
2. `undersoil/Docs/HANDOFF.md`（現状・決定事項・次の一手）

- プロジェクトの本体はすべて `undersoil/` の下にある（このリポジトリは複数のゲームの置き場所なので、1フォルダにまとめている）。
- 新しいセッションでは最初に `bash undersoil/scripts/setup.sh` を実行して道具を入れ直す。
- 「ステージ2を作って」「VRで酔う」などの短い依頼は `undersoil/Docs/PROMPTS.md` の該当する指示に従う。
- 「続けて」と言われたら、上の2つを読んで続きから再開する。
- ローカルの Web サーバーは立てない。画面確認は Playwright の経路差し替えで行う。
- `games/` の下のほかのゲームには触らない。
