#!/usr/bin/env bash
# 构建静态产物并同步到自有服务器。前提：本机已配置到 root@47.99.227.95 的免密 SSH
set -euo pipefail
cd "$(dirname "$0")/.."

HOST=root@47.99.227.95
DIR=/var/www/xenonaesir.work

NEXT_PUBLIC_SITE_URL=https://xenonaesir.work pnpm build

# 本机没有 rsync，用 tar 走 ssh；先解到临时目录再换，避免删一半留下空站
tar -czf - -C out . | ssh "$HOST" "
  set -e
  rm -rf $DIR.new && mkdir -p $DIR.new
  tar -xzf - -C $DIR.new
  chown -R www-data:www-data $DIR.new
  rm -rf $DIR.old && mv $DIR $DIR.old && mv $DIR.new $DIR && rm -rf $DIR.old
"
echo "已发布：https://xenonaesir.work"
