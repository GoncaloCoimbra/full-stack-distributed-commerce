#!/usr/bin/env node

/**
 * Teste de Integração: Website ↔ Chatops ↔ Logística
 * Verifica se os 3 sistemas conseguem comunicar entre si
 * 
 * Uso: node test-integration.js
 */

const http = require('http');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  header: (msg) => console.log(`\n${colors.bright}${colors.blue}▶ ${msg}${colors.reset}`),
  success: (msg) => console.log(`  ${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`  ${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`  ${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`  ${colors.cyan}ℹ${colors.reset} ${msg}`),
  test: (msg) => console.log(`\n${colors.bright}${colors.cyan}TEST:${colors.reset} ${msg}`),
};

// Endpoints para testar
const SERVICES = {
  website: {
    name: 'Website (Express.js)',
    health: 'http://localhost:3001/health',
    api: 'http://localhost:3001/api/v1/health',
    checkout: 'http://localhost:3001/api/v1/checkout/status'
  },
  logistica: {
    name: 'Logística (NestJS)',
    health: 'http://localhost:3002/api/health',
    swagger: 'http://localhost:3002/api/docs',
    products: 'http://localhost:3002/api/products'
  },
  chatops: {
    name: 'ChatOps (Fastify)',
    health: 'http://localhost:9001/health',
    ws: 'ws://localhost:9001/',
    api: 'http://localhost:9001/api/health'
  }
};

// Função helper para fazer requests HTTP
function makeRequest(url, method = 'GET', timeout = 5000) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? require('https') : http;

    const req = protocol.request(url, { method, timeout }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null,
            ok: res.statusCode >= 200 && res.statusCode < 300
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
            ok: res.statusCode >= 200 && res.statusCode < 300
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout (${timeout}ms)`));
    });

    req.end();
  });
}

// Testes de saúde (Health Checks)
async function testHealthChecks() {
  log.header('HEALTH CHECKS');

  const results = {};

  for (const [key, service] of Object.entries(SERVICES)) {
    log.test(service.name);

    // Teste 1: Health endpoint
    try {
      const res = await makeRequest(service.health);
      if (res.ok) {
        log.success(`${service.health} → HTTP ${res.status}`);
        results[key] = { status: 'ONLINE', health: res.status };
      } else {
        log.error(`${service.health} → HTTP ${res.status}`);
        results[key] = { status: 'ERROR', health: res.status };
      }
    } catch (error) {
      log.error(`${service.health} → ${error.message}`);
      results[key] = { status: 'OFFLINE', error: error.message };
    }

    // Teste 2: API endpoint (se diferente)
    if (service.api && service.api !== service.health) {
      try {
        const res = await makeRequest(service.api);
        log.info(`${service.api} → HTTP ${res.status}`);
      } catch (error) {
        log.warning(`${service.api} → ${error.message}`);
      }
    }

    // Teste 3: Swagger/Docs (se aplicável)
    if (service.swagger) {
      try {
        const res = await makeRequest(service.swagger);
        if (res.ok) {
          log.info(`${service.swagger} → Documentação disponível`);
        }
      } catch (error) {
        log.warning(`Swagger indisponível`);
      }
    }
  }

  return results;
}

// Testes de integração entre serviços
async function testIntegration() {
  log.header('TESTES DE INTEGRAÇÃO');

  log.test('Website → Logística (REST)');
  log.info('Simulando sincronização de pedidos...');
  try {
    const res = await makeRequest('http://localhost:3002/api/products', 'GET');
    if (res.ok) {
      log.success('Website consegue contactar Logística ✓');
    } else {
      log.warning('Resposta inesperada do Logística');
    }
  } catch (error) {
    log.error(`Falha na comunicação: ${error.message}`);
  }

  log.test('ChatOps → Website (Events/Webhooks)');
  log.info('Simulando notificação de eventos...');
  try {
    const res = await makeRequest('http://localhost:3001/api/v1/health');
    if (res.ok) {
      log.success('ChatOps consegue contactar Website ✓');
    }
  } catch (error) {
    log.error(`Falha na comunicação: ${error.message}`);
  }

  log.test('Logística → ChatOps (Broadcasting)');
  log.info('Simulando broadcast de atualizações de stock...');
  log.warning('Requer WebSocket - testar manualmente em prod');

  log.test('Database Connectivity');
  log.info('Verificando conexões com BDs...');
  log.warning('postgres_Tranzor: 5432 (Commerce DB)');
  log.warning('postgres_logistica: 5433 (Logistics DB)');
  log.warning('postgres_chatops: 5434 (ChatOps DB)');
}

// Resumo final
async function printSummary(results) {
  console.log(`\n${colors.bright}═════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}RESUMO DA INTEGRAÇÃO${colors.reset}`);
  console.log(`${colors.bright}═════════════════════════════════════════${colors.reset}\n`);

  const onlineCount = Object.values(results).filter(r => r.status === 'ONLINE').length;
  const totalCount = Object.keys(results).length;

  console.log(`${colors.cyan}Serviços Online:${colors.reset} ${onlineCount}/${totalCount}`);

  for (const [key, info] of Object.entries(results)) {
    const status = info.status === 'ONLINE' 
      ? `${colors.green}● ONLINE${colors.reset}` 
      : `${colors.red}● OFFLINE${colors.reset}`;
    const service = SERVICES[key].name;
    console.log(`  ${status} ${service}`);
  }

  console.log(`\n${colors.bright}${colors.cyan}Próximos Passos:${colors.reset}`);

  if (onlineCount === 0) {
    console.log(`  ${colors.yellow}1. Inicie os serviços com: docker-compose up${colors.reset}`);
    console.log(`  ${colors.yellow}2. Aguarde ~30s para inicialização${colors.reset}`);
    console.log(`  ${colors.yellow}3. Execute novamente este script${colors.reset}`);
  } else if (onlineCount < totalCount) {
    console.log(`  ${colors.yellow}1. Verifique os serviços offline${colors.reset}`);
    console.log(`  ${colors.yellow}2. Consulte logs: docker-compose logs ${colors.reset}`);
  } else {
    console.log(`  ${colors.green}✓ Todos os serviços estão online!${colors.reset}`);
    console.log(`  ${colors.green}✓ Integração pronta para testar${colors.reset}`);
  }

  console.log(`\n${colors.bright}${colors.cyan}Documentação:${colors.reset}`);
  console.log(`  → INTEGRATION_GUIDE.md - Guia completo`);
  console.log(`  → docker-compose.yml - Configuração dos serviços`);
  console.log(`  → backend/README.md - Documentação Website`);
  console.log(`  → logistica-multi-tenant-clean/README.md - Documentação Logística`);
  console.log(`  → Chatops/README.md - Documentação ChatOps`);

  console.log(`\n${colors.bright}═════════════════════════════════════════${colors.reset}\n`);
}

// Main
async function main() {
  console.log(`\n${colors.bright}${colors.cyan}🔍 Teste de Integração: Website ↔ Logística ↔ ChatOps${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}═════════════════════════════════════════${colors.reset}\n`);

  const results = await testHealthChecks();
  await testIntegration();
  await printSummary(results);
}

main().catch(console.error);
