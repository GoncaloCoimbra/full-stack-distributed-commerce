#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "Rolling back staging environment..."
if command -v docker >/dev/null 2>&1; then
  if docker compose version >/dev/null 2>&1; then
    docker compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.staging.yml down --remove-orphans
    echo "Rollback completed."
  else
    echo "Docker is installed but not reachable in this environment; rollback skipped."
  fi
else
  echo "Docker CLI not available in this shell; rollback skipped."
fi
