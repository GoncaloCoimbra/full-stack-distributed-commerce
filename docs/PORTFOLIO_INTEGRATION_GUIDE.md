# Portfolio Integration Guide

## Visão geral
Este documento descreve as validações de integração atualmente comprovadas no workspace.

Os três projetos estão incluídos no portfólio, mas não devem ser apresentados como um ecossistema integrado completo ainda.

Projetos:
- Commerce: backend principal da aplicação web de e-commerce, com lock distribuído real e compensação de falhas
- Logistics: backend NestJS com gestão de produtos e stock, em progresso de estabilização
- ChatOps: camada de comunicação em tempo real para comandos operacionais

A camada de logística usa isolamento por empresa através de filtros `companyId` e guards de tenant, em vez de um esquema separado por tenant.

## Prova real executada
Os passos abaixo foram validados durante a execução local entre ChatOps e Logistics:
1. O ChatOps respondeu ao comando `/stock SKU-X` com um valor real devolvido pela Logística.
2. O mesmo fluxo retornou uma mensagem explícita de erro quando a Logística estava indisponível.
3. Uma mensagem publicada em `portfolio:stock-sync` foi recebida pelo subscriber Redis do projeto.
4. O ChatOps respondeu ao comando `/approve-credit company-1` com sucesso e também devolveu uma mensagem explícita de erro quando a atualização falha.

## Fluxo validado entre ChatOps e Logistics
1. O ChatOps recebe `/stock SKU-X`.
2. O ChatOps consulta o endpoint de stock da Logística por HTTP.
3. A resposta da Logística é devolvida ao utilizador.
4. O ChatOps publica um evento para Redis no canal `portfolio:stock-sync`.
5. O subscriber Redis recebe a mensagem publicada.

## Validação adicional
- Validado: `/stock` do ChatOps com sucesso e falha.
- Validado: `/approve-credit` em execução real para os cenários de sucesso e falha explícita.
- Não validado: integração completa do Commerce com ChatOps ou Logistics.
- Não validado: checkout Stripe real com fornecedor externo de pagamentos.

## Pontos de integração comprovados
- ChatOps → Logistics: HTTP REST
- ChatOps → Redis: Pub/Sub
- Logistics → Redis: subscriber ativo para eventos de stock

## Como testar
```bash
# 1. Iniciar os serviços base
docker compose up -d redis mongo

# 2. Iniciar o ChatOps
cd Chatops/backend
PORT=3002 WS_PORT=9001 REDIS_URL=redis://127.0.0.1:6379 LOGISTICS_URL=http://127.0.0.1:3000 node dist/server.js

# 3. Disparar o comando
node -e "const { ChatOpsEngine } = require('./Chatops/backend/dist/chatOpsEngine.js'); ChatOpsEngine.handleCommand('/stock SKU-X','tester').then(console.log).catch(console.error);"
```

## Limitações reais
- Não existe retry nem circuit breaker no fluxo atual.
- O histórico de mensagens é mantido em memória no ChatOps.
- O fluxo de sucesso/falha foi validado localmente, mas ainda depende de um ambiente Redis e de uma Logística acessível.

## Resultado honesto
- O sistema demonstra integração funcional via HTTP e Redis pub/sub.
- O fluxo está validado para sucesso e para falha explícita.
- Ainda não se trata de uma plataforma de produção completa, mas a integração base está provada.
