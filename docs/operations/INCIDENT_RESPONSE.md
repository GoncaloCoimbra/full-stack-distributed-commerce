# Incident response checklist

## 1. Detecção
- Confirmar tempo de início do incidente.
- Identificar módulo afetado: Commerce, Logistics ou ChatOps.
- Listar impacto imediato: usuário, API, fila, WebSocket ou banco.

## 2. Contenção
- Desativar fluxo problemático se necessário.
- Isolar dependência afetada (Redis, banco, fila ou gateway).
- Evitar alterações adicionais sem contexto claro.

## 3. Investigação
- Revisar logs estruturados e health checks.
- Validar últimas alterações de deploy.
- Confirmar se a falha é local, de dependência ou de configuração.

## 4. Recuperação
- Reiniciar serviço ou aplicar rollback controlado.
- Validar health checks e fluxos críticos.
- Confirmar estabilidade antes de fechar o incidente.

## 5. Pós-incidente
- Registrar causa raiz.
- Anotar ações executadas e tempo de recuperação.
- Acrescentar item de melhoria para evitar recorrência.
