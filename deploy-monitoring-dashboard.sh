#!/usr/bin/env bash
set -euo pipefail

SOURCE="${1:-}"
DEST="/home/ubuntu/devops-infrastructure-monitoring-dashboard"

if [[ -z "$SOURCE" || "$SOURCE" != /var/lib/jenkins/workspace/* ]]; then
  echo "Refusing unexpected source path."
  exit 2
fi

if [[ ! -f "$SOURCE/app.js" || ! -f "$SOURCE/package.json" ]]; then
  echo "Source does not look like the dashboard repository."
  exit 3
fi

mkdir -p "$DEST"
rsync -a --delete --exclude='.git' "$SOURCE/" "$DEST/"
chown -R ubuntu:ubuntu "$DEST"

sudo -u ubuntu -H bash -lc "
  cd '$DEST'
  npm install --omit=dev
  node --check app.js
  if pm2 describe devops-monitoring-dashboard >/dev/null 2>&1; then
    pm2 reload ecosystem.config.js --update-env
  else
    pm2 start ecosystem.config.js
  fi
  pm2 save
"

echo "Deployment successful."
