# Project Architecture

This document explains the organization of components and the decision about the backends.

## Backends

- **`backend-nest`**
  - Updated NestJS project with Prisma, Swagger, validation and modular architecture.
  - Considered the main piece for future development.
  - Includes test pipelines, migration scripts and all new features.

- **`backend`** (Express)
  - Old code that was initially used for prototyping.
  - Does not have an independent `package.json` and uses `ts-nocheck` in many files.
  - **Deprecated:** should not be modified. It exists only for historical reference and possibly to copy small implementations during migrations.
  - The long-term goal is to completely remove this directory once `backend-nest` is complete and stabilized.

## Monorepo

The repository has been reorganized as a monorepo using `npm workspaces` (could be easily adapted to `yarn` or `pnpm`).
Included packages:

- `backend-nest`
- `frontend`

Global scripts (`npm run lint-all`, `test-all` etc.) facilitate operations across the entire monorepo.

## Dependencies and tools

- `tsconfig-paths`/aliases configured in the `tsconfig.json` of each subproject for standardized imports.
- Husky + lint-staged to ensure quality in commits.

> See `README.md` in the root for initialization instructions and list of improvements.
