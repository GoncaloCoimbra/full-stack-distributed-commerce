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

NODE_ENV=${NODE_ENV:-staging} npm run start
