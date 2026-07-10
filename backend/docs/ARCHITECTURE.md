# Architecture Overview

This document summarizes the backend architecture for the Tranzor monorepo.

- Framework: Express + TypeScript
- Architecture: single-store e-commerce backend, not a multi-tenant SaaS platform
- ORM/DB: Prisma (primary), with legacy Mongoose-style models present (technical debt)
- Auth: JWT access & refresh tokens (signing secrets required in env)
- Middlewares: helmet (CSP), cors, cookie-parser, dynamic csurf (if installed), rate limiting
- Logging: pino (pino-http) with requestId middleware
- Routes: modular under `server/routes/` (auth, products, cart, account, shop, admin)
- Config: validated environment in `server/config/env.ts` using Zod

Notes:
- There are mixed persistence patterns (Prisma + Mongoose-like models). A migration plan should be drafted to standardize on Prisma or remove legacy models.
- JWT secrets are required and validated at startup.
- CSRF protection is supported via `csurf` if installed; a basic Origin/Referer check is present as fallback.
