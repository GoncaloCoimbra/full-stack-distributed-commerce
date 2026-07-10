# ChatOps

Módulo de demonstração com backend Fastify, frontend Vite, WebSocket, Prisma e Redis.

## Início rápido
```bash
cd Chatops/backend
npm install
npx prisma generate
npm run dev
```

Em outro terminal:
```bash
cd Chatops/frontend
npm install
npm run dev
```

## Variáveis de ambiente
```bash
DATABASE_URL=postgresql://chatops:chatops@localhost:5432/chatops_db
REDIS_URL=redis://127.0.0.1:6379
PORT=3002
WS_PORT=9001
```

## Testes
```bash
cd Chatops/backend
npm test

cd ../frontend
npm test
```

## Troubleshooting
- Verifique PostgreSQL e Redis antes de iniciar.
- Confirme as portas 3002 e 9001.
- Se Prisma falhar, rode `npx prisma generate`.
