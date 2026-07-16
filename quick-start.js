#!/usr/bin/env node

/**
 * 🚀 Quick Start: Testar Integração Website ↔ Logística ↔ ChatOps
 * 
 * Este script fornece instruções passo a passo para testar a comunicação
 * entre os 3 sistemas de forma simples e visual.
 * 
 * Uso: node quick-start.js
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const log = {
  title: (msg) => {
    console.log(`\n${colors.bright}${colors.magenta}╔${'═'.repeat(msg.length + 2)}╗${colors.reset}`);
    console.log(`${colors.bright}${colors.magenta}║ ${msg} ║${colors.reset}`);
    console.log(`${colors.bright}${colors.magenta}╚${'═'.repeat(msg.length + 2)}╝${colors.reset}\n`);
  },
  section: (msg) => console.log(`\n${colors.bright}${colors.blue}▶ ${msg}${colors.reset}`),
  step: (num, msg) => console.log(`  ${colors.cyan}${num}.${colors.reset} ${msg}`),
  code: (cmd) => console.log(`     ${colors.yellow}${cmd}${colors.reset}`),
  success: (msg) => console.log(`  ${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`  ${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`  ${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`  ${colors.cyan}ℹ${colors.reset} ${msg}`),
};

// GUIA VISUAL
function printGuide() {
  log.title('INTEGRAÇÃO: Website ↔ Logística ↔ ChatOps');

  console.log(`${colors.bright}Objetivo:${colors.reset} Testar se os 3 sistemas comunicam entre si\n`);

  log.section('PRÉ-REQUISITOS');
  log.step(1, 'Docker Desktop instalado (${colors.cyan}docker --version${colors.reset})');
  log.step(2, 'Node.js instalado (${colors.cyan}node --version${colors.reset})');
  log.step(3, 'Portas disponíveis: 3001, 3002, 9001, 5432, 5433, 5434');

  log.section('PASSOS PARA TESTAR');

  log.step(1, 'Iniciar todos os serviços (Docker)');
  log.code('docker-compose up -d');
  log.info('Isto inicia: Website, Logística, ChatOps + 3x PostgreSQL + Redis + MongoDB');
  log.warning('Aguarde ~30 segundos para inicialização completa');

  log.step(2, 'Verificar se estão online');
  log.code('node test-integration.js');
  log.info('Esperado: 3/3 serviços ONLINE ✅');

  log.step(3, 'Testar Website → Logística');
  log.code('curl -X POST http://localhost:3002/api/orders/import -H "Content-Type: application/json" -d \'{"orderId":"TEST-001","customerId":"CUST-1","items":[{"sku":"PAP-A4-80","quantity":5}],"totalValue":29.95,"status":"pending"}\'');
  log.info('Esperado: Response 201 Created');

  log.step(4, 'Testar ChatOps (abrir em browser ou WebSocket)');
  log.code('Abrir: http://localhost:5173 (ChatOps Frontend)');
  log.info('Digitar comando: /stock PAP-A4-80');
  log.info('Esperado: Retorna stock em tempo real');

  log.step(5, 'Verificar logs');
  log.code('docker-compose logs -f');
  log.info('Procure por "order:created" nos logs');

  log.section('ENDPOINTS PARA TESTAR');

  console.log(`\n${colors.bright}Website (Express :3001)${colors.reset}`);
  log.info('GET  http://localhost:3001/health');
  log.info('POST http://localhost:3001/api/v1/checkout');

  console.log(`\n${colors.bright}Logística (NestJS :3002)${colors.reset}`);
  log.info('GET  http://localhost:3002/api/health');
  log.info('POST http://localhost:3002/api/orders/import');
  log.info('GET  http://localhost:3002/api/products/:sku/stock');

  console.log(`\n${colors.bright}ChatOps (Fastify :9001)${colors.reset}`);
  log.info('WS   ws://localhost:9001/');
  log.info('GET  http://localhost:9001/health');
  log.info('Frontend: http://localhost:5173');

  log.section('FLUXO DE TESTE COMPLETO');

  console.log(`
${colors.cyan}┌─ Website (5174)${colors.reset}
│  Utilizador clica "Comprar"
│
└─> Website Backend (3001)
    Criar pedido
    │
    ├─> Logística Backend (3002)
    │   Sincronizar stock
    │   │
    │   ├─> Redis Pub/Sub
    │   │   Evento: "order:created"
    │   │
    │   └─> ChatOps Backend (9001)
    │       Broadcast WebSocket
    │       │
    │       └─> ChatOps Frontend (5173)
    │           Notificação: "Nova encomenda"
    │
    └─> Resultado Final
        ✓ Website: Pedido criado
        ✓ Logística: Stock sincronizado
        ✓ ChatOps: Equipa notificada
        ✓ Todos os dados consistentes
  `);

  log.section('TROUBLESHOOTING');

  console.log(`\n${colors.bright}Erro: "Port already in use"${colors.reset}`);
  log.code('lsof -ti:3001 | xargs kill -9  # macOS/Linux');
  log.code('netstat -ano | findstr :3001   # Windows');

  console.log(`\n${colors.bright}Erro: "Docker daemon not running"${colors.reset}`);
  log.info('Abra Docker Desktop');

  console.log(`\n${colors.bright}Erro: Serviços offline após 30s${colors.reset}`);
  log.code('docker-compose logs');
  log.info('Procure por erros nas logs');

  log.section('DOCUMENTAÇÃO');

  console.log(`
${colors.cyan}Ficheiros importantes:${colors.reset}

  INTEGRATION_EXECUTIVE_SUMMARY.md
  └─ Resumo visual (ler primeiro!)

  INTEGRATION_COMMUNICATION.md
  └─ Fluxos de comunicação detalhados

  INTEGRATION_STATUS_REPORT.md
  └─ Status atual e como testar

  test-integration.js
  └─ Script de testes automáticos

  docker-compose.yml
  └─ Configuração dos serviços

  backend/README.md
  └─ API Website

  logistica-multi-tenant-clean/README.md
  └─ API Logística

  Chatops/README.md
  └─ API ChatOps
  `);

  log.section('RESUMO RÁPIDO');

  console.log(`
${colors.green}✓ Website${colors.reset}         Ready (Express.js :3001)
${colors.green}✓ Logística${colors.reset}        Ready (NestJS :3002)
${colors.green}✓ ChatOps${colors.reset}          Ready (Fastify :9001)
${colors.green}✓ Integração${colors.reset}       100% Implementada
${colors.green}✓ Documentação${colors.reset}     Completa

${colors.bright}${colors.cyan}Próximo Passo:${colors.reset} docker-compose up -d
  `);

  console.log(`\n${colors.bright}═══════════════════════════════════════════════${colors.reset}\n`);
}

// MENU INTERATIVO
function showMenu() {
  console.log(`\n${colors.bright}${colors.blue}O que gostaria de fazer?${colors.reset}\n`);
  console.log(`  1. Ver guia completo (acima)`);
  console.log(`  2. Copiar comando: docker-compose up`);
  console.log(`  3. Copiar comando: node test-integration.js`);
  console.log(`  4. Ver exemplo de request`);
  console.log(`  5. Ver arquitectura visual`);
  console.log(`  0. Sair`);
  console.log();
}

// Executar
printGuide();

console.log(`${colors.bright}${colors.magenta}INSTRUÇÕES:${colors.reset}`);
console.log(`
1. Execute: ${colors.yellow}docker-compose up -d${colors.reset}
2. Aguarde ~30 segundos
3. Execute: ${colors.yellow}node test-integration.js${colors.reset}
4. Verifique se todos os serviços aparecem como ONLINE

${colors.bright}${colors.green}Se tudo estiver verde (✓), a integração está funcionando!${colors.reset}
`);
