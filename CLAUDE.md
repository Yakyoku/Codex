# INNER RESTORE（このブランチの作業対象）

このブランチ `claude/inner-restore-game-dev-pu5f2t` では、ゲーム「INNER RESTORE」を `inner-restore/` の中だけで作る。
`games/` 以下のほかのゲームには触らない。

- **作業の前に `inner-restore/Docs/GAME_BRIEF.md` と `inner-restore/Docs/HANDOFF.md` を読むこと。**
- 新しいセッションでは最初に `bash inner-restore/scripts/setup.sh` を実行して道具を入れ直す。
- 「ステージ2を作って」「VRで酔う」などの短い指示は `inner-restore/Docs/PROMPTS.md` の該当する指示を読んで実行する。
- 指示書の中の `Docs/…` `scripts/…` は、すべて `inner-restore/` からの相対パスを指す。
- 公開は `inner-restore/scripts/deploy.sh`（下書き／本番）。Netlify のサイト ID は `inner-restore/Docs/TECH.md` にある。
- ローカルの Web サーバーは立てない。画面の確認は Playwright の経路差し替えで行う。
