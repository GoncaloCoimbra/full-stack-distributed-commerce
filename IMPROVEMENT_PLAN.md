# Plano de Melhoria para chegar a 8/10

Este documento fornece um plano de ação prático para elevar os três módulos do projeto — Commerce, Logistics e ChatOps — a um nível de maturidade mais próximo de 8/10.

## Objetivo

- Tornar o projeto mais sólido, confiável e pronto para uso em ambientes de staging/prod
- Reduzir a lacuna entre a base técnica existente e a maturidade de produto
- Documentar e automatizar os pontos de validação faltantes

## 1. Commerce (Website)

### Objetivos para 8/10
- Validar a solução em ambiente de staging ou cluster real
- Garantir observabilidade mínima
- Ter testes E2E para checkout e rollback
- Documentar deployment e variáveis de produção

### Ações imediatas
- [ ] Criar um `docker-compose.staging.yml` ou instruções de staging para o Commerce
- [ ] Definir health checks mais completos no backend (DB, Redis, status do serviço)
- [ ] Adicionar métricas básicas ou logs estruturados para falhas de checkout
- [ ] Criar testes E2E simples que cubram o fluxo de checkout completo
- [ ] Atualizar o README do `website/backend` com informações de produção reais

## 2. Logistics

### Objetivos para 8/10
- Validar o deployment Kubernetes ou um ambiente equivalentes
- Limpar e isolar o código legado
- Automatizar testes tenant-aware e RBAC
- Garantir monitoramento básico em produção

### Ações imediatas
- [ ] Testar e validar o diretório `k8s/` em um cluster local (Kind / minikube)
- [ ] Remover referências a código histórico que não faz parte do fluxo ativo
- [ ] Implementar testes de integração que validem o isolamento por `companyId`
- [ ] Criar um checklist de produção no `logistica-multi-tenant-clean/docs/DEPLOYMENT.md`
- [ ] Adicionar observabilidade em endpoints críticos (health, auth, tenant guard)

## 3. ChatOps

### Objetivos para 8/10
- Formalizar deployment e operação WebSocket em produção
- Adicionar logging e métricas de presença/comando
- Criar testes E2E do fluxo ChatOps → Logistics
- Documentar as dependências externas e variáveis de ambiente

### Ações imediatas
- [ ] Definir um processo de deployment para o backend ChatOps (Docker / Compose)
- [ ] Adicionar logs mais detalhados no `Chatops/backend/src/server.ts`
- [ ] Implementar testes de integração para os comandos `/stock` e `/approve-credit`
- [ ] Atualizar `Chatops/README.md` com instruções de produção e variáveis completas
- [ ] Adicionar um health check que valide o Redis e a disponibilidade do WebSocket

## Métricas para 8/10

- build e testes passam consistentemente em CI
- health checks estão disponíveis e documentados
- documentação de deployment e variables está clara
- fluxos críticos estão cobertos por testes automatizados
- ambiente de staging ou cluster validado com sucesso

## Como usar este plano

1. Comece por escolher um módulo e marcar os itens imediatos.
2. Execute pequenas entregas rápidas e documente cada validação.
3. Depois de cada entrega, revise os status no `README.md`.
4. Use este documento como referência para manter o foco nas melhorias.
