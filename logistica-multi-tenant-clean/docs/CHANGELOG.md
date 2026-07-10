# Changelog

All notable changes in this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and the project adopts [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Monorepo with npm workspaces (`backend-nest`, `frontend`)
- Global scripts: `npm run lint-all`, `test-all`, `build-all`, `format-all`
- Husky + lint-staged for local CI (pre-commit hooks)
- CI/CD pipeline with GitHub Actions (lint, test, build)
- Swagger/OpenAPI documentation at `/api/docs`
- CONTRIBUTING.md and architecture guides
- Deployment documentation (Docker, Kubernetes, Helm)
- UX/UI guide and design system
- Official deprecation of `backend` (Express); `backend-nest` is the active base

### Changed
- Updated `.github/workflows/ci.yml` to use monorepo
- Reorganized `tsconfig.json` with aliases (`@common/*`, `@modules/*`, etc.)
- Simplified startup process (single `npm install`)

### Removed
- Removal of `@ts-nocheck` from legacy code
- Cleanup of unused dependencies

### Fixed
- Validation of `DATABASE_URL` on startup
- Improved error handling in middleware

## [0.1.0] - 2025-02-15

### Added
- Initial project with `backend` (Express) + `backend-nest` (NestJS) + `frontend` (React)
- JWT authentication with roles (ADMIN, USER, SUPPLIER)
- Multi-tenant system with support for multiple companies
- Prisma models for users, products, vehicles, transports, companies
- Basic API endpoints for CRUD of products and vehicles
- Frontend with Dashboard, product list/detail, transport map
- Docker Compose for local development
- Kubernetes manifests for deployment
- Support for file uploads (avatars, documents)
- Basic logging and audit interceptors
- Initial tests (Jest + Supertest)

---

## Versioning Guide

**Version bumping:**

```bash
# Patch (bug fixes)
npm version patch          # 0.1.0 → 0.1.1

# Minor (novas features)
npm version minor          # 0.1.0 → 0.2.0

# Major (breaking changes)
npm version major          # 0.1.0 → 1.0.0

# Tags automáticas
git push origin --tags
```

## Next Planned Versions

### v0.2.0 (Testing and Documentation)
- [ ] Test coverage ≥ 80% (unit and e2e)
- [ ] Documentation completely updated
- [ ] Storybook for React components
- [ ] Testes de acessibilidade

### v0.3.0 (Observability and Security)
- [ ] Logging estruturado com Pino
- [ ] Prometheus metrics + Grafana dashboard
- [ ] Sentry for error tracking
- [ ] Rate-limiting e proteção CSRF

### v1.0.0 (Production)
- [ ] 100% de cobertura crítica
- [ ] Deploy em Kubernetes com Helm
- [ ] Monitoramento completo
- [ ] Documentation of operations

---

**Keep this file updated with each PR/release!**
