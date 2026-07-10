# Tranzor — Full-Stack Distributed Commerce Platform

Ecossistema integrado de três serviços em produção: **Commerce** (e-commerce com checkout resiliente), **Logistics** (WMS/TMS multi-tenant), **ChatOps** (motor operacional em tempo real). Demonstração prática de arquitetura distribuída, Docker, Redis, autenticação segura e fail-fast em produção.

**Stack:** 52k+ linhas TypeScript | React + NestJS + Fastify | Docker | Redis | PostgreSQL | Prisma

---

## 📋 Componentes

| Serviço | Descrição | Tech Stack | Status |
|---------|-----------|-----------|--------|
| **Commerce** | E-commerce com lock distribuído, checkout resiliente, rollback automático | Express/Node, Mongoose, Prisma, Redis | ✅ 8/10 |
| **Logistics** | Sistema WMS/TMS multi-tenant, isolamento por empresa, RBAC | NestJS, React, Prisma, PostgreSQL | ✅ 8/10 |
| **ChatOps** | Motor de comunicação em tempo real, comandos operacionais, autenticação por token | Fastify, WebSocket, Redis pub/sub, React | ✅ 8/10 |

---

## 🚀 Quick Start

### Prerequisitos
- Node.js 20+
- Docker Desktop
- npm

### Setup e Arranque

```bash
# 1. Instalar dependências em todos os serviços
npm run install:all

# 2. Validar configuração do Docker Compose
npm run validate:deploy

# 3. Subir os 13 containers (5 serviços + bases de dados)
npm run start:all

# 4. Verificar status
npm run status:all

# 5. Consultar logs de um serviço específico
npm run logs:all -- chatops-backend
```

### Parar o ambiente

```bash
npm run stop:all
```

---

## 🔗 Endpoints Locais

| Serviço | URL | Auth | Descrição |
|---------|-----|------|-----------|
| **Commerce** | http://localhost:3001/health | ❌ | Health check público |
| **ChatOps** | http://localhost:3002/health | ❌ | Health check público |
| **Logistics** | http://localhost:3000/health | ❌ | Health check público |
| **Logistics API** | http://localhost:3000/api | ✅ JWT | Endpoints autenticados |

---

## 🏗️ Arquitetura

### Comunicação entre Serviços

```
┌─────────────────────────────────────────────┐
│         ChatOps WebSocket                   │
│  (Autenticação por token, close 4001)       │
└────────────┬────────────────────────────────┘
             │
        HTTP REST
             │
    ┌────────▼──────────┐
    │   Logistics API   │
    │  (Isolamento por  │
    │   empresa)        │
    └────────┬──────────┘
             │
      Redis pub/sub
      (portfolio:stock-sync)
             │
    ┌────────▼──────────┐
    │   Commerce DB     │
    │  (Stock, Orders)  │
    └───────────────────┘
```

### Race Condition Prevention

**Commerce** implementa lock distribuído com Redis:
- `SET NX EX` atómico para adquirir lock por produto
- Lua script para verificar ownership antes de libertar
- Fallback em memória apenas em dev/teste
- Fail-fast em produção se Redis indisponível

### Fail-Fast em Produção

- **Prisma:** Valida conexão com `SELECT 1` no arranque; falha se BD inacessível
- **Redis:** Lança erro se `REDIS_URL` indefinida em produção
- **Auth WebSocket:** Rejeita tokens inválidos com código 4001

---

## ✅ Validação

### Testes Unitários

```bash
cd website/backend
npm test
# Result: 35/35 passing

cd Chatops/backend
npm test
# Result: 9/9 passing (incluindo autenticação e parsing de token)

cd logistica-multi-tenant-clean/backend-nest
npm test
# Result: 43/43 passing (notificações como best-effort non-blocking)
```

### Arranque Conjunto Verificado

- ✅ 13/13 containers a subir e healthy
- ✅ Commerce health: 200 OK
- ✅ ChatOps health: 200 OK
- ✅ Logistics health: 200 OK (GET /health público)
- ✅ Logistics API: 401 Unauthorized em GET /api (autenticação requerida)

### Fluxos E2E Validados Manualmente

- ✅ `/stock` ChatOps → Logistics: comando de consulta de stock via HTTP
- ✅ `/approve-credit` ChatOps: aprovação de crédito com sucesso/falha
- ✅ Token inválido no WebSocket: rejeição com close code 4001
- ✅ Redis fallback não silencioso: erro em produção se variável indefinida

---

## 📁 Estrutura do Projeto

```
tranzor/
├── website/                          # Commerce backend + DB config
│   ├── backend/                      # Express/Node, Mongoose, Prisma
│   │   ├── server/
│   │   │   ├── services/
│   │   │   │   ├── stockLockService.ts     # Lock distribuído Redis
│   │   │   │   ├── checkoutQueueService.ts # Compensação de falha
│   │   │   └── config/
│   │   │       └── prisma.ts              # Fail-fast BD + fallback
│   │   ├── test-race-condition.ts         # Teste de 10 checkouts paralelos
│   │   └── package.json
│   └── docker-compose.override.yml
│
├── Chatops/                          # ChatOps backend + frontend
│   └── backend/
│       ├── src/
│       │   ├── server.ts             # WebSocket com auth token
│       │   ├── chatOpsEngine.ts      # Lógica de comandos
│       │   └── redis-subscriber.ts   # Pub/sub com retry
│       ├── tests/
│       │   └── auth.test.ts          # Token inválido → close 4001
│       └── package.json
│
├── logistica-multi-tenant-clean/     # Logistics WMS/TMS
│   ├── backend-nest/                 # NestJS
│   │   ├── src/
│   │   │   ├── services/
│   │   │   └── guards/
│   │   │       └── tenant.guard.ts   # Isolamento por companyId
│   │   ├── prisma/
│   │   │   └── schema.prisma         # 3 roles: SUPER_ADMIN, ADMIN, OPERATOR
│   │   └── package.json
│   ├── frontend/                     # React
│   └── scripts/
│       └── legacy-refactor/          # Ferramentas de migração (histórico)
│
├── docker-compose.yml                # Produção
├── docker-compose.override.yml       # Dev overrides
├── package.json                      # Scripts root (install:all, start:all, etc.)
└── README.md                         # Este ficheiro
```

---

## 🔐 Segurança

### Autenticação WebSocket (ChatOps)

```typescript
wss.on('connection', (ws: WebSocket, req) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  const userId = authHeader ? parseUserIdFromToken(authHeader) : null;
  
  if (!userId) {
    ws.close(4001, 'invalid token');
    return;
  }
  connectionMeta.set(ws, { userId });
});
```

- Tokens inválidos são rejeitados com código 4001
- Sem token ou com token malformado: ligação fechada imediatamente
- Cada mensagem é auditada com userId

### Multi-Tenant Isolation (Logistics)

```typescript
// Filtro companyId em todas as queries
const products = await prisma.product.findMany({
  where: { companyId: req.user.companyId }
});
```

- Guard valida `companyId` em cada request
- Sem acesso cruzado entre empresas

### Prisma Fail-Fast (Website)

```typescript
if (!env.DATABASE_URL) {
  logger.error('DATABASE_URL is not configured');
  if (env.NODE_ENV === 'production') process.exit(1);
}

await primaryPrisma.$connect();
await primaryPrisma.$queryRaw`SELECT 1`;
```

- Valida conexão no arranque
- Mata o processo em produção se BD inacessível

---

## 🛠️ Variáveis de Ambiente

### Website (Commerce)

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://tranzor_app:TranzorAppPass2026@postgres_Tranzor:5432/tranzor
REDIS_URL=redis://redis:6379
SKIP_PRISMA=0  # Nunca ativar em produção
```

### Chatops

```env
NODE_ENV=production
PORT=3002
WS_PORT=9001
REDIS_URL=redis://redis:6379
JWT_SECRET=<your-secret>
```

### Logistics

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://tranzor_app:TranzorAppPass2026@postgres_Tranzor:5432/logistics
REDIS_URL=redis://redis:6379
```

---

## 📊 Observações de Produção

- **Histórico do Redis:** Guarda eventos de stock sync em `portfolio:stock-sync`
- **Notificações (Logistics):** Best-effort, não bloqueantes — falha de notificação não impede operação
- **Retry em fallback:** 3 tentativas com backoff antes de falhar
- **Logs:** ChatOps imprime `Redis subscriber connected`, Logistics imprime `Nest application successfully started`

---

## 🚧 Próximos Passos

- [ ] CI/CD pipeline (GitHub Actions) para arranque conjunto automático
- [ ] E2E tests (Playwright) para fluxos críticos
- [ ] Monitoring (Prometheus/Grafana) para métricas em produção
- [ ] Rate limiting no ChatOps

---

## 👤 Autor

Gonçalo Pinho Coimbra  
Full-Stack Developer & Software Engineer  
[goncalo.pinho.coimbra@gmail.com](mailto:goncalo.pinho.coimbra@gmail.com) | [LinkedIn](https://linkedin.com/in/goncalo-coimbra-b514b0345) | [Portfolio](https://goncalocoimbraportfolio.netlify.app)

---

## 📄 Documentação Detalhada

- [Commerce Backend](website/backend/README.md)
- [ChatOps Backend](Chatops/backend/README.md)
- [Logistics Module](logistica-multi-tenant-clean/README.md)
- [Integration Guide](logistica-multi-tenant-clean/PORTFOLIO_INTEGRATION_GUIDE.md)

---

**Nota:** Este projeto foi desenvolvido como demonstração prática de arquitetura distribuída, fail-safe em produção, e integração de múltiplos serviços via Docker. Validação manual concluída; arranque conjunto em Docker Compose comprovado com 13/13 containers healthy e 3/3 endpoints a 200 OK.
