#!/usr/bin/env bash
# Sync the EASI build to the BASI droplet where Caddy serves
# https://easi.pivotventures.tech/atlas/organs/ from
# /opt/basi/human-atlas-static/organs.
#
# Usage: scripts/deploy-easi.sh [user@host] [ssh-key]
#   defaults: root@204.48.26.134, ~/.ssh/basi_do
set -euo pipefail
cd "$(dirname "$0")/.."

TARGET="${1:-root@204.48.26.134}"
KEY="${2:-$HOME/.ssh/basi_do}"
DEST="/opt/basi/human-atlas-static/organs"

test -f dist/client/index.html || { echo "Run npm run build:easi first" >&2; exit 1; }
grep -q "/atlas/organs/assets/" dist/client/index.html || { echo "dist/client is not an EASI build" >&2; exit 1; }

ssh -i "$KEY" "$TARGET" "mkdir -p $DEST"
rsync -az --delete -e "ssh -i $KEY" dist/client/ "$TARGET:$DEST/"
rsync -az -e "ssh -i $KEY" LICENSE THIRD_PARTY_ASSETS.md "$TARGET:$DEST/"

ssh -i "$KEY" "$TARGET" "set -e
  test -f $DEST/index.html
  test -f $DEST/models/heart.glb
  curl -fsS --max-time 10 -H 'Host: easi.pivotventures.tech' -o /tmp/organs.check http://127.0.0.1/atlas/organs/
  grep -q '/atlas/organs/assets/' /tmp/organs.check
  curl -fsS --max-time 10 -H 'Host: easi.pivotventures.tech' -o /dev/null -w 'heart.glb %{http_code} %{size_download} bytes\n' http://127.0.0.1/atlas/organs/models/heart.glb
  echo 'Caddy is serving the Organ Studio at /atlas/organs/'"
