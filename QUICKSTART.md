# Quickstart — Tranzor Workspace

Este guia rápido descreve o fluxo principal para configurar e iniciar o workspace local completo.

## 1) Instalar dependências
No diretório raiz do workspace:

```bash
npm install
npm run install:all
```

## 2) Validar deploy local
Verifique se o Docker Compose está válido antes de iniciar:

```bash
npm run validate:deploy
```

## 3) Iniciar os serviços
```bash
npm run start:all
```

## 4) Verificar status
```bash
npm run status:all
```

## 5) Parar o ambiente
```bash
npm run stop:all
```

## URLs expostas
- ChatOps backend: http://localhost:3002
- ChatOps frontend: http://localhost:3006
- Logística backend: http://localhost:3000
- Logística frontend: http://localhost:3005

## 6) Executar todos os testes
```bash
npm run test:all
```

## Resumo
- O workspace suporta ChatOps e Logística juntos.
- A validação de deploy e o status do ambiente podem ser verificados com scripts do root.
- Use `QUICKSTART.md` sempre que precisar de um fluxo rápido de startup.
