# Staging checklist

## Pré-deploy
- Validar ambiente com o gate de qualidade.
- Confirmar que as variáveis críticas estão definidas.
- Confirmar disponibilidade de Redis, PostgreSQL e dependências externas.

## Deploy
- Executar o script de staging.
- Validar health checks dos serviços.
- Validar endpoints críticos de Commerce, Logistics e ChatOps.

## Pós-deploy
- Rodar smoke checks.
- Confirmar que o fluxo principal funciona.
- Registrar resultado e possíveis falhas.

## Rollback
- Reverter para a versão anterior estável.
- Validar novamente health checks.
- Registrar causa raiz e ação corretiva.
