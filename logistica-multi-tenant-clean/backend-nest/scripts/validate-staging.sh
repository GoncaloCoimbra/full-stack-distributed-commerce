#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -f .env.staging ]; then
  echo "Missing .env.staging. Copy staging.env.example to .env.staging and adjust values." >&2
  exit 1
fi

set -a
source .env.staging
set +a

echo "Logistics staging environment validated."
echo "PORT=$PORT"
echo "NODE_ENV=$NODE_ENV"
echo "DATABASE_URL=$DATABASE_URL"
echo "REDIS_URL=$REDIS_URL"
