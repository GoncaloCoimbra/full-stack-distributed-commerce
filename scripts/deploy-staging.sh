#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

./scripts/validate-staging.sh

echo "Deploying staging environment..."
if command -v docker >/dev/null 2>&1; then
  if docker compose version >/dev/null 2>&1; then
    docker compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.staging.yml up -d --build
    echo "Staging deployment started."
    if command -v node >/dev/null 2>&1; then
      echo "Waiting for service health endpoints to become ready..."
      node scripts/wait-for-health.js || true
    fi
    ./scripts/validate-staging.sh
  else
    echo "Docker is installed but not reachable in this environment; skipping container deployment."
  fi
else
  echo "Docker CLI not available in this shell; skipping container deployment."
fi
