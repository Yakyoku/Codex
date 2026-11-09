# Yakyoku/Codex — ゲームの公開用リポジトリ

このリポジトリは、Codex のクラウド環境で作ったブラウザゲームを Netlify に公開するための置き場所です。
**Codex は Netlify に直接デプロイしません。** `games/<フォルダ>/` に push すると、
GitHub Actions（`.github/workflows/netlify-deploy.yml`）が Netlify に公開します。

## 置き方
```
games/
  <ゲームのフォルダ名>/        ← 英小文字・数字・ハイフン（例: verdant-vector）
    index.html                 ← 必ずフォルダの一番上
    （JS・画像・音声など。参照はすべて相対パス）
    netlify-site.json          ← {"name": "<Netlifyのサイト名>"}
```
- `name` は Netlify のサイト名（URL は https://<name>.netlify.app）。
  すでに公開しているサイトがあれば、その名前を書けば同じサイトに上書きされる。
  なければ自動で作られる（他の人に使われている名前だとエラーになるので、`-yakyoku` などを付ける）。
- ビルドが必要なゲームは、**ビルド後の静的ファイル**を置く（Netlify 側ではビルドしない）。
- 1つのフォルダは 1つのゲームだけ。ほかのゲームのフォルダは触らない。

## 公開の流れ（Codex がやること）
1. `games/<フォルダ>/` にファイルを置き、`netlify-site.json` を書く
2. `git pull --rebase origin main` → commit → `git push origin main`（衝突したら pull --rebase して最大3回やり直す）
3. `gh run list --workflow netlify-deploy.yml --branch main --limit 5` で自分のコミットの実行を探し、`gh run watch <ID> --exit-status`
4. `gh run view <ID> --log | grep DEPLOYED` で公開URLを読む（`DEPLOYED <フォルダ> <URL> http=200 ...`）
5. `curl -sI <URL>` で 200 を確認して、URL を報告する（URL は飾らず1行に単独で）

## 失敗したとき
| 症状 | 原因と対処 |
|---|---|
| `NETLIFY_AUTH_TOKEN が登録されていません` | リポジトリの Secrets にトークンがない。持ち主（藤田さん）に登録を頼む |
| `index.html がありません` | index.html をフォルダの一番上に移す |
| `サイト … を作れませんでした（HTTP 422）` | サイト名が使われている。`netlify-site.json` の name を変える |
| push が拒否される | `git pull --rebase origin main` してからもう一度 |
| 手動で公開し直したい | `gh workflow run netlify-deploy.yml -f game=<フォルダ>` |
