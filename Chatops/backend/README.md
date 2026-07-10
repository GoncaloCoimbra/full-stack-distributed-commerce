# ChatOps backend

Este README resume a execução local do backend do módulo ChatOps.

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

## Variáveis de ambiente
```bash
DATABASE_URL=postgresql://chatops:chatops@localhost:5432/chatops_db
REDIS_URL=redis://127.0.0.1:6379
PORT=3002
WS_PORT=9001
```

## CI
Este backend é verificado automaticamente pelo workflow de GitHub Actions em `.github/workflows/chatops-backend.yml`.

## Endpoints principais
- GET /health
- GET /history?channelId=<id>
- GET /channels/:channelId/members
- POST /upload

## WebSocket
- ws://localhost:9001
- mensagens e presença por canal
- comandos como /stock e /approve-credit
