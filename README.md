# Tranzor — Full-Stack Distributed Commerce Platform

Ecossistema integrado de três serviços: **Commerce** (e-commerce com checkout resiliente), **Logistics** (WMS/TMS multi-tenant) e **ChatOps** (motor operacional em tempo real). Projeto com foco em arquitetura distribuída, Docker, Redis, autenticação segura e comportamento fail-fast em ambiente de produção.

**Stack:** 52k+ linhas TypeScript | React + NestJS + Fastify | Docker | Redis | PostgreSQL | Prisma

> Consulte o plano de melhorias em [IMPROVEMENT_PLAN.md](IMPROVEMENT_PLAN.md) para os próximos passos do projeto.

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 20+
- Docker Desktop
- npm

### Setup e Arranque

```bash
# 1. Instalar dependências em todos os serviços
npm run install:all

# 2. Validar configuração do Docker Compose
npm run validate:deploy

# 3. Subir os containers
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

### Comunicação entre serviços

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

### Race condition prevention

- Lock distribuído com Redis para operações críticas de stock
- Verificação de ownership antes de libertar lock
- Fallback em memória apenas em ambiente de desenvolvimento
- Fail-fast em produção se Redis indisponível

### Fail-fast em produção

- **Prisma:** valida conexão com `SELECT 1` no arranque
- **Redis:** falha se `REDIS_URL` não estiver configurado em ambiente de produção
- **WebSocket Auth:** tokens inválidos são rejeitados imediatamente com código 4001

---

## ✅ Validação

### Testes unitários

```bash
cd website/backend
npm test

cd Chatops/backend
npm test

cd logistica-multi-tenant-clean/backend-nest
npm test
```

### Arranque conjunto

- Scripts de arranque e validação disponíveis no root
- Health checks ativos nos serviços principais
- Endpoints autenticados exigem JWT quando aplicável

### Fluxos validados

- Comando de stock via ChatOps para Logistics
- Rejeição de token inválido no WebSocket
- Fallback de comunicação em ambiente de desenvolvimento

---

## 🧭 Roadmap de melhoria
O projeto está funcional, mas precisa de maturidade adicional para produção completa.

### Commerce
- Validar staging ou cluster real
- Adicionar observabilidade e métricas
- Documentar deployment em produção
- Criar testes E2E para checkout e rollback

### Logistics
- Validar o `k8s/` em cluster real
- Limpar código legado e separar fluxo ativo
- Adicionar testes tenant-aware e RBAC
- Configurar monitoramento e alertas

### ChatOps
- Formalizar deployment em produção
- Adicionar métricas de canal e uso
- Implementar testes E2E para ChatOps → Logistics
- Documentar variáveis de ambiente e dependências

> Consulte [IMPROVEMENT_PLAN.md](IMPROVEMENT_PLAN.md) para tarefas detalhadas e prioridades.

---

## 📁 Estrutura do projeto

```
tranzor/
├── website/                          # Commerce backend e configuração
│   ├── backend/                      # Node/Prisma/Fastify + lógica de checkout
│   └── docker-compose.override.yml
│
├── Chatops/                          # ChatOps backend e integração
│   └── backend/
│       ├── src/                      # WebSocket, comandos e Redis
│       └── tests/
│
├── logistica-multi-tenant-clean/     # Logistics WMS/TMS multi-tenant
│   ├── backend-nest/                 # NestJS com isolamento por tenant
│   ├── frontend/                     # React frontend
│   └── docs/                         # Documentação e integração
│
├── docker-compose.yml                # Produção
├── docker-compose.override.yml       # Dev overrides
├── package.json                      # Scripts root
└── README.md
```

---

## 🔐 Segurança

### Autenticação WebSocket (ChatOps)

- Tokens inválidos são rejeitados com código `4001`
- Sem token ou token malformado, a conexão é fechada
- Cada mensagem é tratada com contexto de usuário

### Isolamento multi-tenant (Logistics)

- `companyId` é verificado em todas as queries
- Não há acesso cruzado entre empresas
- Guards e middlewares reforçam o isolamento por tenant

### Prisma fail-fast

- O serviço valida `DATABASE_URL` no arranque
- Se o banco não estiver disponível em produção, o processo encerra

---

## 🛠️ Variáveis de ambiente

### Website (Commerce)

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=<database-url>
REDIS_URL=<redis-url>
```

### ChatOps

```env
NODE_ENV=production
PORT=3002
WS_PORT=9001
REDIS_URL=<redis-url>
JWT_SECRET=<jwt-secret>
```

### Logistics

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=<database-url>
REDIS_URL=<redis-url>
```

---

## 📄 Documentação

- [IMPROVEMENT_PLAN.md](IMPROVEMENT_PLAN.md)
- `website/backend/README.md`
- `Chatops/backend/README.md`
- `logistica-multi-tenant-clean/README.md`

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
