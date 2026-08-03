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

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

if [ -z "${REDIS_URL:-}" ]; then
  echo "REDIS_URL is required" >&2
  exit 1
fi

echo "Staging environment validated for ChatOps backend."
echo "HTTP_PORT=$PORT"
echo "WS_PORT=$WS_PORT"
echo "DATABASE_URL=$DATABASE_URL"
echo "REDIS_URL=$REDIS_URL"
