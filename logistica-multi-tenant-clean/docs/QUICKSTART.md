# Quick Start Guide

Quick guide to start working on the project in 5 minutes.

## 1️⃣ Clone and Install (1 minute)

```bash
# Clone
git clone https://github.com/your-repo/logistica-multi-tenant.git
cd logistica-multi-tenant

# Install everything (monorepo)
npm install
```

## 2️⃣ Configure Environment (2 minutes)

```bash
# Backend
cp backend-nest/.env.example backend-nest/.env
# Edit .env if necessary (DATABASE_URL, JWT_SECRET)

# Frontend  
cp frontend/.env.example frontend/.env
```

## 3️⃣ Database (1 minute)

```bash
# Start Postgres with Docker Compose
docker-compose up -d

# Run migrations
npm run --workspace=backend-nest prisma:migrate dev

# Seed (test data)
npm run --workspace=backend-nest seed
```

## 4️⃣ Run the Application (1 minute)

**Option A: In separate terminals**

```bash
# Terminal 1 - Backend
npm run --workspace=backend-nest start:dev

# Terminal 2 - Frontend
npm run --workspace=frontend dev
```

**Option B: Concurrent (both together)**

```bash
npm run start-all
```

## ✅ Validation

- **Frontend**: http://localhost:5173 (Vite) or http://localhost:3000 (React Scripts)
- **Backend**: http://localhost:3000 (with /api prefix)
- **API Docs**: http://localhost:3000/api/docs (Swagger)
- **Health Check**: http://localhost:3000/health

You should see JSON: `{"status":"ok","timestamp":"..."}`

## 📁 Next Readings

| When | Read |
|------|------|
| Developing | [backend-nest/README.md](./backend-nest/README.md) |
| Contributing | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| Structure doubt | [ARCHITECTURE.md](./docs/ARCHITECTURE.md) |
| Tests | [TESTING_STRATEGY.md](./docs/TESTING_STRATEGY.md) |
| Deploy | [DEPLOYMENT.md](./docs/DEPLOYMENT.md) |

## 🛠️ Useful Commands

```bash
# Lint (check code)
npm run lint-all

# Format (fix code)
npm run format-all

# Tests
npm run test-all

# Build
npm run build-all

# Clean code and dependencies
npm run format-all && npm run lint-all

# View Prisma status
npm run --workspace=backend-nest prisma:studio

# Reset DB (careful!)
npm run --workspace=backend-nest prisma migrate reset
```

## 🐛 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Port 3000 em uso | Mude em `.env` ou kill outro processo |
| DATABASE_URL error | Copiar `.env.example` → `.env` e preencher |
| Migrações falharam | `rm prisma/dev.db` (SQLite) ou resetar BD |
| Imports não encontram módulos | Rodar `npm install` novamente |
| Frontend não carrega API | Verificar `REACT_APP_API_URL` em `.env` |

## 📞 Ajuda

1. Consulte [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
2. Procure na seção Troubleshooting dos READMEs específicos
3. Abra uma issue no GitHub

---

**Tempo total estimado**: 5-10 minutos ⏱️
