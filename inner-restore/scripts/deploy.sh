#!/usr/bin/env bash
# ビルドして Netlify に公開する（下書き／本番）。
#   bash scripts/deploy.sh draft "<proxy-path>"   … 下書き用サイトへ（作業中の版）
#   bash scripts/deploy.sh prod  "<proxy-path>"   … 本番サイトへ（節目の版だけ）
# <proxy-path> は、Netlify の連携機能（MCP の deploy-site に該当サイトの siteId を渡す）が
# その都度発行する一時的な URL。トークンは保存しない・リポジトリに入れない。
#   環境変数 NETLIFY_AUTH_TOKEN がある場合は、代わりに Netlify CLI を使う（proxy-path は不要）。
set -euo pipefail
cd "$(dirname "$0")/.."
MODE="${1:?draft か prod を指定}"; PROXY="${2:-}"
PROD_ID="df57e5ce-3511-45aa-854e-a1198fe2ce16";  PROD_URL="https://inner-restore-web-20261122.netlify.app"
DRAFT_ID="9da4a676-781d-48cc-8114-d8a3ae8a1735"; DRAFT_URL="https://inner-restore-web-20261122-draft.netlify.app"
case "$MODE" in prod) ID=$PROD_ID; URL=$PROD_URL;; draft) ID=$DRAFT_ID; URL=$DRAFT_URL;; *) echo "draft か prod"; exit 1;; esac
[ "${SKIP_BUILD:-0}" = "1" ] || npm run build
if [ -n "${NETLIFY_AUTH_TOKEN:-}" ]; then
  npx -y netlify-cli deploy --dir dist --site "$ID" --prod --no-build
else
  [ -n "$PROXY" ] || { echo "proxy-path が必要です（MCP の deploy-site で siteId=$ID を指定して取得）"; exit 1; }
  (cd dist && npx -y @netlify/mcp@latest --site-id "$ID" --proxy-path "$PROXY")
fi
# 公開できたかを、index.html の一致で確かめる
LOCAL=$(sha256sum dist/index.html | cut -d' ' -f1)
for i in $(seq 1 18); do
  REMOTE=$(curl -fsS "$URL/" | sha256sum | cut -d' ' -f1 || true)
  [ "$LOCAL" = "$REMOTE" ] && { echo "公開を確認:"; echo "$URL/"; exit 0; }
  sleep 5
done
echo "公開後の内容が一致しません: $URL/"; exit 1
