# Release checklist

## Pre-flight
- [ ] Validate environment variables for staging.
- [ ] Ensure database, Redis and required services are reachable.
- [ ] Run backend tests for ChatOps, website and logistics.
- [ ] Confirm health endpoints return 200.
- [ ] Record the commit SHA and deployment target.

## Deploy
- [ ] Start services with the staging compose file.
- [ ] Verify service health and logs.
- [ ] Run smoke tests for the main user flows.
- [ ] Check /health and /metrics endpoints.

## Post-deploy
- [ ] Validate observability signals and error rates.
- [ ] Capture logs, metrics and test evidence.
- [ ] Confirm rollback plan is documented and ready.
- [ ] Notify stakeholders with the deployment summary.
