#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "Validating workspace staging configuration..."

echo "- Staging environment config"
node scripts/validate-staging.js

echo "Running smoke checks..."
BACKEND_PORT=${BACKEND_PORT:-3101}
CHATOPS_PORT=${CHATOPS_PORT:-3002}
LOGISTICS_PORT=${LOGISTICS_PORT:-3000}
WEBSITE_HEALTH_URL=${WEBSITE_HEALTH_URL:-http://127.0.0.1:${BACKEND_PORT}/health}
CHATOPS_HEALTH_URL=${CHATOPS_HEALTH_URL:-http://127.0.0.1:${CHATOPS_PORT}/health}
LOGISTICS_HEALTH_URL=${LOGISTICS_HEALTH_URL:-http://127.0.0.1:${LOGISTICS_PORT}/health}

if command -v node >/dev/null 2>&1; then
  WEBSITE_HEALTH_URL="${WEBSITE_HEALTH_URL}" CHATOPS_HEALTH_URL="${CHATOPS_HEALTH_URL}" LOGISTICS_HEALTH_URL="${LOGISTICS_HEALTH_URL}" node scripts/smoke-check.js website="${WEBSITE_HEALTH_URL}" chatops="${CHATOPS_HEALTH_URL}" logistics="${LOGISTICS_HEALTH_URL}"
elif command -v cmd.exe >/dev/null 2>&1; then
  cmd.exe /c "set WEBSITE_HEALTH_URL=${WEBSITE_HEALTH_URL} && set CHATOPS_HEALTH_URL=${CHATOPS_HEALTH_URL} && set LOGISTICS_HEALTH_URL=${LOGISTICS_HEALTH_URL} && node scripts/smoke-check.js website=${WEBSITE_HEALTH_URL} chatops=${CHATOPS_HEALTH_URL} logistics=${LOGISTICS_HEALTH_URL}"
else
  echo "Node.js executable not found; smoke checks skipped."
fi

echo "Running integration smoke checks..."
if command -v node >/dev/null 2>&1; then
  WEBSITE_HEALTH_URL="${WEBSITE_HEALTH_URL}" CHATOPS_HEALTH_URL="${CHATOPS_HEALTH_URL}" LOGISTICS_HEALTH_URL="${LOGISTICS_HEALTH_URL}" node scripts/integration-smoke.js
elif command -v cmd.exe >/dev/null 2>&1; then
  cmd.exe /c "set WEBSITE_HEALTH_URL=${WEBSITE_HEALTH_URL} && set CHATOPS_HEALTH_URL=${CHATOPS_HEALTH_URL} && set LOGISTICS_HEALTH_URL=${LOGISTICS_HEALTH_URL} && node scripts/integration-smoke.js"
else
  echo "Node.js executable not found; integration smoke checks skipped."
fi

echo "Staging validation completed."
