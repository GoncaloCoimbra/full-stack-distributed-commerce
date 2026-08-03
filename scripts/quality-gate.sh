#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

echo "[quality-gate] Running backend tests"
(cd backend && npm test -- --runInBand)

echo "[quality-gate] Running ChatOps tests"
(cd Chatops/backend && npm test -- --runInBand)

echo "[quality-gate] Running Logistics tests"
(cd logistica-multi-tenant-clean/backend-nest && npm test -- --runInBand)

echo "[quality-gate] Quality gate completed"
