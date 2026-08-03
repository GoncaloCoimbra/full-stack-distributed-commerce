# Observability and readiness runbook

## Health and readiness probes

Each service exposes the following probes:

- /health: readiness-oriented summary with dependency status
- /readyz: explicit readiness probe
- /livez: liveness probe

### Expected behavior
- HTTP 200 with `ok: true`
- Readiness responses should include `status: ready`
- Liveness responses should include `status: alive`

## Smoke validation

Run the workspace smoke check with:

```bash
node scripts/integration-smoke.js
```

This validates the shared readiness contract across:
- Commerce website
- ChatOps
- Logistics

## Suggested operational checks

- Probe the health endpoints periodically
- Alert on failures or sustained non-200 responses
- Correlate readiness failures with dependency issues (database/Redis/WebSocket)
- Keep the smoke check in CI/CD as a release gate
