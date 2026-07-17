# ChatOps backend

Este README documenta o backend do módulo ChatOps, incluindo health checks, WebSocket e deployment.

## Quick start
```bash
cd Chatops/backend
npm install
npx prisma generate
npm run dev
```

## Run tests
```bash
cd Chatops/backend
npm test
```

## Production / staging
O backend pode ser executado em `NODE_ENV=staging` ou `NODE_ENV=production`.

Exemplo:
```bash
NODE_ENV=staging PORT=3002 DATABASE_URL=postgresql://chatops:chatops@localhost:5432/chatops_db \ 
REDIS_URL=redis://127.0.0.1:6379 WS_PORT=9001 npm start
```

### Variáveis de ambiente
```bash
DATABASE_URL=postgresql://chatops:chatops@localhost:5432/chatops_db
REDIS_URL=redis://127.0.0.1:6379
PORT=3002
WS_PORT=9001
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Health check
- `GET /health` — valida Redis, estado do WebSocket e retorna `ok: true`

### WebSocket
- `ws://localhost:9001`
- Autenticação: `Authorization: Bearer <token>` header
- Fechamento de conexões inválidas: close code `4001`
- Comandos suportados:
  - `/stock [sku]`
  - `/approve-credit [id_empresa]`

## Deployment
Este backend é verificado pelo workflow de GitHub Actions em `.github/workflows/chatops-backend.yml`.

Para staging ou produção com Docker Compose, use o arquivo de compose relevante no diretório raiz do projeto.

## Notes
- O endpoint `/health` agora retorna metadata de Redis e do WebSocket.
- O servidor registra eventos de conexão/desconexão, subscrição e comandos para facilitar a operação.
