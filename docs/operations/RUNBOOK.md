# Runbook operacional

## Objetivo

Este runbook documenta os passos básicos para operar o ecossistema Commerce, Logistics e ChatOps em ambiente de staging e produção.

## 1. Verificação rápida de saúde

- Commerce: GET /health
- Logistics: GET /health
- ChatOps: GET /health

Comandos rápidos:

```bash
curl http://localhost:3001/health
curl http://localhost:3000/health
curl http://localhost:3002/health
```

## 2. Resposta a incidentes comuns

### Falha de banco de dados
- Confirmar se o serviço de banco está disponível.
- Verificar logs do serviço afetado.
- Aplicar rollback ou reinicialização conforme procedimento local.

### Falha de Redis
- Confirmar o status do container ou serviço Redis.
- Reiniciar o serviço se necessário.
- Validar que o fluxo de checkout e ChatOps voltou a responder.

### Falha de WebSocket no ChatOps
- Confirmar conectividade HTTP e Redis.
- Verificar se há erro de autenticação ou reconexão.
- Reiniciar o serviço ChatOps se o canal permanecer indisponível.

## 3. Rollback

- Reverter para a última imagem ou build estável.
- Garantir que as dependências de banco e Redis estejam saudáveis.
- Validar health checks após o rollback.

## 4. Escalação

- Em falhas críticas ou indisponibilidade prolongada, escalar para o time responsável pelo ambiente.
- Documentar timestamp, impacto e ações tomadas.
