# Workspace portfolio

Este workspace reúne três componentes ativos:
- Commerce backend
- ChatOps backend/frontend
- Logistics module (pasta ativa: [logistica-multi-tenant-clean](logistica-multi-tenant-clean))

## Como usar
```bash
npm install
npm run install:all
npm run validate:deploy
npm run start:all
npm run status:all
```

## Endpoints locais
- Commerce backend: http://localhost:3001
- ChatOps backend: http://localhost:3002
- ChatOps frontend: http://localhost:3006
- Logistics backend: http://localhost:3000
- Logistics frontend: http://localhost:3005

## Estado atual
- Commerce: iniciado e com health endpoint validado
- ChatOps: backend e testes validados, runtime verificado, e comportamento de token inválido confirmado em container real com `close 4001`
- Logistics: a pasta ativa é [logistica-multi-tenant-clean](logistica-multi-tenant-clean); a pasta [logistica-multi-tenant](logistica-multi-tenant) foi mantida apenas como referência histórica
- Container runtime: verificado para o stack ChatOps + Redis + Postgres + Logistics no mesmo ambiente Docker

## Observações de desenvolvedor
- `SKIP_PRISMA` é apenas uma flag de dev/teste; nunca deve ser definida em produção.

## Documentação relevante
- [Chatops/README.md](Chatops/README.md)
- [logistica-multi-tenant-clean/README.md](logistica-multi-tenant-clean/README.md)
