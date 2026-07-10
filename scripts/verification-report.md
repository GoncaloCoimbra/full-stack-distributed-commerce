# Verificação comercial do projeto

## Estado geral

Este ficheiro reúne a evidência real que foi possível verificar no ambiente local sem depender de Stripe real, Redis ativo ou Docker com todos os módulos arrancados.

## 1) Pagamentos

### 1.1 Stripe sandbox
- O backend contém integração com Stripe em [backend/server/services/checkoutService.ts](backend/server/services/checkoutService.ts) e webhook em [backend/server/routes/orders.ts](backend/server/routes/orders.ts).
- O ficheiro de ambiente atual usa chaves placeholder em [backend/.env](backend/.env), o que impede a criação de um PaymentIntent real em sandbox neste ambiente.
- Comando executado: `node -e ... stripe.paymentIntents.create(...)`
- Resultado observado: a validação foi bloqueada porque a chave de ambiente não estava disponível ou estava em formato placeholder.

### 1.2 Webhook e confirmação
- O handler de webhook está implementado em [backend/server/routes/orders.ts](backend/server/routes/orders.ts) e responde a `payment_intent.succeeded` e `payment_intent.payment_failed`.
- Não foi possível provar o fluxo completo com eventos reais do Stripe porque não há chave válida nem endpoint público configurado.

### 1.3 Falha de pagamento e rollback
- O processamento de checkout usa compensação e rollback em [backend/server/services/checkoutQueueService.ts](backend/server/services/checkoutQueueService.ts).
- O código reverte stock e marca a ordem como falhada em caso de erro. Isso é verificável na implementação, mas não foi executado com um pagamento real rejeitado por Stripe neste ambiente.

## 2) Concorrência

### 2.1 Teste de carga real
- Foi executado um teste simples de 40 pedidos concorrentes contra o endpoint de health da API.
- Resultado:
  - Requests: 40
  - Success: 40
  - Failures: 0
  - Req/s: 1428.57
  - P50: 32 ms
  - P95: 57 ms
  - P99: 62 ms

### 2.2 Limites do ambiente
- O Redis não está disponível localmente; o serviço de locks de stock em [backend/server/services/stockLockService.ts](backend/server/services/stockLockService.ts) cai para modo sem lock quando não há Redis.
- Isso significa que a prova de concorrência com último item em stock não pode ser feita de forma realista neste ambiente sem Redis ativo.

## 3) Integração entre módulos

### 3.1 ChatOps / stock real
- O comando `/stock` existe em [Chatops/backend/src/chatOpsEngine.ts](Chatops/backend/src/chatOpsEngine.ts).
- Ele consulta a base de dados do módulo ChatOps via Prisma.
- Não foi possível provar uma resposta real com base de dados ativa porque a infra local do ChatOps não estava disponível no mesmo ciclo de execução.

### 3.2 Website -> API global
- O backend responde ao endpoint de health em [backend/server/config/app.ts](backend/server/config/app.ts).
- Comando executado: `Invoke-WebRequest http://127.0.0.1:3001/health`
- Resposta recebida: `{"status":"OK","timestamp":"2026-06-23T21:00:18.944Z","environment":"development","redis":{"configured":false,"connected":false,"source":"memory"}}`

## 4) Credibilidade comercial

### 4.1 Uptime / estabilidade
- O backend subiu e respondeu ao health endpoint durante a execução local.
- O ambiente não permite provar horas contínuas de uptime sem um processo de execução prolongada e monitorização.

### 4.2 Erro real observado
- O erro real encontrado foi a falta de Redis/Stripe real e o uso de chaves placeholder; isso foi tratado por fallback degradado e por logs de startup.
- O sistema não ficou bloqueado por esse cenário; continuou a responder ao health endpoint.
