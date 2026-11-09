#!/usr/bin/env bash
# games/<フォルダ> を Netlify に公開する（GitHub Actions から呼ばれる）
#   使い方: NETLIFY_AUTH_TOKEN=... bash scripts/deploy-game.sh games/<フォルダ>
# 公開先のサイト名は games/<フォルダ>/netlify-site.json の "name"（なければフォルダ名）。
# サイトがなければ作り、あれば同じサイトに上書きで公開する。
set -euo pipefail

DIR="${1:?games/<フォルダ> を指定してください}"
DIR="${DIR%/}"
SLUG="$(basename "$DIR")"
API="${NETLIFY_API:-https://api.netlify.com/api/v1}"

if [ -z "${NETLIFY_AUTH_TOKEN:-}" ]; then
  echo "::error::GitHub の Secrets に NETLIFY_AUTH_TOKEN が登録されていません"
  exit 1
fi
AUTH="Authorization: Bearer ${NETLIFY_AUTH_TOKEN}"

if [ ! -f "$DIR/index.html" ]; then
  echo "::error::$DIR/index.html がありません（index.html をフォルダの一番上に置いてください）"
  exit 1
fi

CONF="$DIR/netlify-site.json"
NAME=""; SITE_ID=""
if [ -f "$CONF" ]; then
  NAME="$(jq -r '.name // empty' "$CONF")"
  SITE_ID="$(jq -r '.siteId // empty' "$CONF")"
fi
[ -n "$NAME" ] || NAME="$SLUG"
NAME="$(echo "$NAME" | tr 'A-Z_' 'a-z-')"

# 1) サイトを探す（siteId 指定 → 名前で完全一致 → なければ作る）
if [ -z "$SITE_ID" ]; then
  SITE_ID="$(curl -fsS -H "$AUTH" "$API/sites?name=${NAME}&filter=all&per_page=100" \
    | jq -r --arg n "$NAME" '[.[] | select(.name == $n)][0].id // empty')"
fi
if [ -z "$SITE_ID" ]; then
  echo "サイト ${NAME} が見つからないので作ります"
  RES="$(curl -sS -w '\n%{http_code}' -X POST -H "$AUTH" -H 'Content-Type: application/json' \
    -d "{\"name\":\"${NAME}\"}" "$API/sites")"
  CODE="$(echo "$RES" | tail -n1)"; BODY="$(echo "$RES" | sed '$d')"
  if [ "$CODE" != "201" ] && [ "$CODE" != "200" ]; then
    echo "::error::サイト ${NAME} を作れませんでした（HTTP $CODE）。名前が他の人に使われている可能性があります。netlify-site.json の name を変えてください。応答: $BODY"
    exit 1
  fi
  SITE_ID="$(echo "$BODY" | jq -r '.id')"
fi
echo "公開先: ${NAME} (${SITE_ID})"

# 2) フォルダを zip にして送る
TMP="$(mktemp -d)"
( cd "$DIR" && zip -qr -X "$TMP/site.zip" . -x 'netlify-site.json' -x '.git*' -x '*/.git/*' -x 'node_modules/*' )
SIZE="$(du -h "$TMP/site.zip" | cut -f1)"
echo "zip の大きさ: $SIZE"

DEP="$(curl -fsS -X POST -H "$AUTH" -H 'Content-Type: application/zip' \
  --data-binary @"$TMP/site.zip" "$API/sites/${SITE_ID}/deploys")"
DID="$(echo "$DEP" | jq -r '.id')"
echo "デプロイID: $DID"

# 3) 公開完了を待つ（最大10分）
STATE=""
for i in $(seq 1 120); do
  INFO="$(curl -fsS -H "$AUTH" "$API/deploys/${DID}")"
  STATE="$(echo "$INFO" | jq -r '.state')"
  case "$STATE" in
    ready) break ;;
    error|rejected)
      echo "::error::デプロイ失敗: $(echo "$INFO" | jq -r '.error_message // "理由不明"')"
      exit 1 ;;
  esac
  sleep 5
done
if [ "$STATE" != "ready" ]; then
  echo "::error::10分待っても公開が終わりませんでした（state=$STATE）"
  exit 1
fi

URL="$(curl -fsS -H "$AUTH" "$API/sites/${SITE_ID}" | jq -r '.ssl_url // .url')"

# 4) 公開URLが開けるか確かめる
HTTP="000"
for i in 1 2 3 4 5 6; do
  HTTP="$(curl -sS -o /dev/null -w '%{http_code}' "$URL/" || true)"
  [ "$HTTP" = "200" ] && break
  sleep 5
done

echo "DEPLOYED ${SLUG} ${URL} http=${HTTP} deploy=${DID}"
if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
  echo "| ${SLUG} | ${URL} | ${HTTP} | ${DID} |" >> "$GITHUB_STEP_SUMMARY"
fi
[ "$HTTP" = "200" ] || { echo "::error::公開URL ${URL} が HTTP ${HTTP} を返しました"; exit 1; }
