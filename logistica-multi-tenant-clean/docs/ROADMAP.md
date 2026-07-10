# Roadmap - Logística Multi-Tenant

This document describes the development roadmap planned for the coming months.

## Visão Geral

```
Q1 2026:  Estabilidade & Testes
Q2 2026:  Observabilidade & Segurança  
Q3 2026:  Performance & Escala
Q4 2026:  Production & Operations
```

---

## Q1 2026 (Jan-Mar) - Estabilidade & Testes

### Objetivos
- ✅ Estabelecer confiança no código via testes
- ✅ Complete documentation
- ✅ Simplificar estrutura (depreciar express backend)
- ✅ Setup monorepo e CI/CD

### Tarefas

#### Backend (backend-nest)

- [x] Monorepo + workspaces
- [x] CI/CD com GitHub Actions
- [ ] **Cobertura de testes ≥ 80%**
  - [ ] Testes unitários para services
  - [ ] Mocks para BD (Prisma)
  - [ ] Testes e2e para fluxos críticos (auth, CRUD)
  - [ ] Error cases and validation
- [x] Swagger/OpenAPI
- [ ] **Improved env vars validation**
- [ ] Logging estruturado (Pino)

#### **Frontend**

- [ ] **Testes React Testing Library** ≥ 60% components
- [ ] **E2E tests** Cypress (login, CRUD, navigation)
- [ ] **Storybook** para componentes isolados
- [ ] Improved folder organization
- [ ] ESLint + Prettier CI

#### **Documentation**

- [x] CONTRIBUTING.md updated
- [x] ARCHITECTURE.md
- [x] DEPLOYMENT.md
- [x] UX_UI.md
- [x] CHANGELOG.md
- [x] Roadmap (this file)
- [ ] Adicionar screenshots reais
- [ ] README específicos por pasta

### DL: **31 Março 2026**

---

## Q2 2026 (Abr-Jun) - Observabilidade & Segurança

### Objetivos
- Visibilidade completa do sistema (logs, metrics, traces)
- Proteção contra vulnerabilidades comuns
- Performance baseline estabelecido

### Tarefas

#### Backend

- [ ] **Prometheus metrics** (request count, latency, errors)
- [ ] **Grafana dashboard** com KPIs principais
- [ ] **Sentry** para error tracking e alertas
- [ ] **Rate-limiting** (Express-rate-limit)
- [ ] **CSRF protection** (csurf ou nest-js-csrf)
- [ ] **Security headers** (helmet, HSTS, CSP)
- [ ] **Dependency scanning** (Dependabot or Snyk)
- [ ] **Request/Response logging** (pino + transport to ELK)

#### Frontend

- [ ] **Error Boundary** com fallback UI
- [ ] **Sentry integration** para frontend errors
- [ ] **Audit de acessibilidade** (axe, jest-axe)
  - [ ] Corrigir todas as issues WCAG 2.1 AA
- [ ] **Dark mode** completo
- [ ] **Service Worker** (offline support - PWA)

#### DevOps

- [ ] **Docker robusto** (multi-stage, security scanning)
- [ ] **Docker-compose + health checks**
- [ ] **Helm chart** com readiness/liveness probes
- [ ] **K8s manifests** revistos (PVC, secrets, resources)

### DL: **30 Junho 2026**

---

## Q3 2026 (Jul-Sep) - Performance & Scale

### Objectives
- System optimized for production
- Support for data growth
- Smooth experience on slow networks

### Tarefas

#### Backend

- [ ] **Database indexing** e query optimization
- [ ] **Caching** (Redis for sessions, frequent data)
- [ ] **Pagination** robusto em endpoints grandes
- [ ] **Lazy-loading** de Prisma relations
- [ ] **Background jobs** (Bull, RabbitMQ) para tasks longos
- [ ] **API Gateway** (Kong ou similar - opcional)
- [ ] **Testes de carga** (k6, Locust)

#### Frontend

- [ ] **Code-splitting** baseado em rotas
- [ ] **Image optimization** (next-image ou similar)
- [ ] **Bundle analysis** e tree-shaking
- [ ] **Virtual scrolling** em listas grandes
- [ ] **Lazy-loading** de componentes
- [ ] **Lighthouse score** ≥ 90

#### Data

- [ ] **Automatic backup** (cron + offsite)
- [ ] **Replication** (secundário para HA)
- [ ] **Migration strategy** testada
- [ ] **Point-in-time recovery** documented

### DL: **September 30, 2026**

---

## Q4 2026 (Oct-Dec) - Production & Operations

### Objectives
- System ready for production
- Runbook documentation
- Team prepared for operations

### Tarefas

#### Deploy & Infrastructure

- [ ] **Separate staging environment**
- [ ] **DNS + SSL/TLS** configurado
- [ ] **Load balancer** (Ingress Nginx, ALB)
- [ ] **Auto-scaling** HPA configured
- [ ] **Disaster recovery** plan + tests
- [ ] **Automatic rollback** in case of failure

#### Monitoring & Alerts

- [ ] **Prometheus + Grafana** full setup
- [ ] **Alert rules** for critical metrics
- [ ] **On-call rotation** documented
- [ ] **SLO/SLI** defined (uptime, latency)

#### Documentation & Training

- [ ] **Runbooks** for daily operations
- [ ] **Troubleshooting guide**
- [ ] **Training sessions** for ops team
- [ ] **Incident response** procedure

#### Security Audit

- [ ] **Pentest** or security review
- [ ] **OWASP Top 10** checklist
- [ ] **Compliance** (GDPR, if applicable)
- [ ] **Secrets management** (Vault)

### DL: **December 31, 2026**

---

## Backlog (Nice-to-Have / Future)

- [ ] **Real-time features** (WebSockets + Socket.io para notificações)
- [ ] **Advanced analytics** (Data warehouse + BI)
- [ ] **Mobile app** (React Native)
- [ ] **Internationalization** (i18n - multilingual)
- [ ] **Two-factor authentication** (2FA/MFA)
- [ ] **Event-based audit trail**
- [ ] **GraphQL** API alternativa
- [ ] **Granular API rate-limiting** (per user/org)
- [ ] **Machine learning** (route prediction, anomalies)

---

## Dependencies Between Phases

```
Q1: Tests ──┬─→ Q2: Observability
            └─→ Q2: Security
            
Q2: Performance ──> Q3: Optimization
                → Q3: Scale
                
Q3: Backup ────→ Q4: DR Plan
Q3: Monitoring ─→ Q4: Alerts
```

---

## Success Metrics

| Metric | Q1 | Q2 | Q3 | Q4 |
|--------|----|----|----|----|
|---------|----|----|----|----|
| Test Coverage | 80% | 85% | 90% | 95% |
| Lighthouse Score | 75 | 80 | 90 | 95 |
| API Response Time | <500ms | <300ms | <200ms | <100ms |
| Uptime | 95% | 98% | 99% | 99.9% |
| Security Incidents | 0 | 0 | 0 | 0 |

---

## Review & Adjustments

This roadmap will be reviewed:
- **Monthly**: Status check on tasks
- **Quarterly**: Adjustments based on feedback and blockers

**Questions?** Contact the PM or technical leader.

Last review: **Feb 27, 2026**  
Próxima revisão: **31 Mar 2026**

---

## Como Contribuir

1. Abra uma issue se encontrar um blocker
2. Submeta PRs alinhadas com o roadmap
3. Participe nas discussões de planejamento (reuniões quinzenais)

**Dúvidas?** Contacte o PM ou líder técnico.
