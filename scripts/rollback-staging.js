const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const services = [
  { name: 'backend', image: 'website-backend' },
  { name: 'chatops-backend', image: 'website-chatops-backend' },
  { name: 'logistica-backend', image: 'website-logistica-backend' },
];

function exec(command, options = {}) {
  return execSync(command, {
    cwd: rootDir,
    stdio: options.stdio || 'inherit',
    shell: true,
    encoding: options.encoding || 'utf8',
    env: {
      ...process.env,
      COMPOSE_PROJECT_NAME: 'website',
      COMPOSE_PROJECT_DIRECTORY: rootDir,
      ...(options.env || {}),
    },
  });
}

function hasLocalTag(imageName) {
  try {
    exec(`docker image inspect ${imageName}:previous`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

function ensurePreviousTags() {
  const missing = services.filter((service) => !hasLocalTag(service.image));
  if (missing.length > 0) {
    throw new Error(`nenhuma versão anterior disponível para rollback: ${missing.map((item) => item.image).join(', ')}`);
  }
}

function buildOverrideServiceConfig(serviceName, imageName, environmentEntries, extraLines = []) {
  const envLines = environmentEntries.map(([key, value]) => `      ${key}: ${JSON.stringify(value)}`);
  return [`  ${serviceName}:`, `    image: ${imageName}:previous`, ...extraLines, `    environment:`, ...envLines].join('\n');
}

function startCreatedServices(overrideRelativePath) {
  const composeFiles = '-f docker-compose.yml -f docker-compose.override.yml -f docker-compose.staging.yml -f ' + overrideRelativePath;
  const createdServices = exec(
    `docker compose --project-name website ${composeFiles} ps --services --filter status=created`,
    { stdio: 'pipe' }
  )
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);

  if (createdServices.length === 0) {
    return;
  }

  console.log(`[rollback] starting created services: ${createdServices.join(', ')}`);
  createdServices.forEach((serviceName) => {
    exec(`docker compose --project-name website ${composeFiles} start ${serviceName}`);
  });
}

function applyPreviousImages() {
  const overridePath = path.join(rootDir, '.rollback-compose.override.yml');
  const overrideRelativePath = '.rollback-compose.override.yml';
  const overrideContent = [
    buildOverrideServiceConfig('backend', 'website-backend', [
      ['NODE_ENV', 'staging'],
      ['PORT', '3101'],
      ['APP_SHUTDOWN_TIMEOUT_MS', '10000'],
      ['FRONTEND_URL', 'http://localhost:5173'],
      ['REDIS_URL', 'redis://redis:6379'],
      ['DATABASE_URL', '${DATABASE_URL:-postgresql://${POSTGRES_USER:-tranzor_app}:${POSTGRES_PASSWORD:-TranzorAppPass2026}@postgres_Tranzor:5432/${POSTGRES_DB:-tranzor}}'],
      ['DATABASE_URL_READ_REPLICA', '${DATABASE_URL_READ_REPLICA:-}'],
      ['MONGODB_URI', '${MONGODB_URI:-mongodb://mongo:27017/Tranzor}'],
      ['CLICKHOUSE_HTTP_URL', '${CLICKHOUSE_HTTP_URL:-http://clickhouse:8123}'],
      ['CLICKHOUSE_USER', '${CLICKHOUSE_USER:-default}'],
      ['CLICKHOUSE_PASSWORD', '${CLICKHOUSE_PASSWORD:-}'],
      ['JAEGER_ENDPOINT', '${JAEGER_ENDPOINT:-http://jaeger:14268/api/traces}'],
      ['JWT_SECRET', '${JWT_SECRET:-replace-with-a-secure-random-secret}'],
      ['JWT_REFRESH_SECRET', '${JWT_REFRESH_SECRET:-replace-with-a-secure-random-refresh-secret}'],
    ], [
      '    ports:',
      '      - "3101:3101"',
      '    depends_on:',
      '      postgres_Tranzor:',
      '        condition: service_healthy',
      '      redis:',
      '        condition: service_healthy',
      '      mongo:',
      '        condition: service_healthy',
      '      clickhouse:',
      '        condition: service_healthy',
      '    restart: unless-stopped',
    ]),
    buildOverrideServiceConfig('chatops-backend', 'website-chatops-backend', [
      ['PORT', '3002'],
      ['WS_PORT', '9001'],
      ['CORS_ORIGIN', 'http://localhost:5173,http://localhost:3006'],
      ['DATABASE_URL', 'postgresql://chatops:chatops@postgres_chatops:5432/chatops_db'],
      ['REDIS_URL', 'redis://redis:6379'],
      ['LOGISTICS_URL', 'http://logistica-backend:3000'],
    ], [
      '    ports:',
      '      - "3002:3002"',
      '      - "9001:9001"',
      '    depends_on:',
      '      postgres_chatops:',
      '        condition: service_healthy',
      '      redis:',
      '        condition: service_healthy',
      '    healthcheck:',
      '      test: ["CMD", "node", "-e", "require(\'http\').get(\'http://127.0.0.1:3002/health\', res => process.exit(res.statusCode===200?0:1)).on(\'error\',()=>process.exit(1))"]',
      '      interval: 30s',
      '      timeout: 10s',
      '      retries: 5',
      '      start_period: 40s',
      '    restart: unless-stopped',
    ]),
    buildOverrideServiceConfig('logistica-backend', 'website-logistica-backend', [
      ['DATABASE_URL', 'postgresql://postgres:postgres@postgres_logistica:5432/logistica'],
      ['REDIS_URL', 'redis://redis:6379'],
      ['JWT_SECRET', 'replace-with-a-secure-random-secret'],
      ['PORT', '3000'],
      ['NODE_ENV', 'development'],
    ], [
      '    ports:',
      '      - "3000:3000"',
      '    depends_on:',
      '      postgres_logistica:',
      '        condition: service_healthy',
      '      redis:',
      '        condition: service_healthy',
      '    healthcheck:',
      '      test: ["CMD", "node", "-e", "require(\'http\').get(\'http://127.0.0.1:3000/health\', res => process.exit(res.statusCode===200?0:1)).on(\'error\',()=>process.exit(1))"]',
      '      interval: 30s',
      '      timeout: 10s',
      '      retries: 5',
      '      start_period: 40s',
      '    restart: unless-stopped',
    ]),
  ].join('\n');
  const fullContent = ['services:', overrideContent].join('\n');

  fs.writeFileSync(overridePath, fullContent, 'utf8');

  try {
    exec(`docker compose --project-name website -f docker-compose.yml -f docker-compose.staging.yml -f ${overrideRelativePath} up -d --no-build --force-recreate --wait --wait-timeout 600 backend chatops-backend logistica-backend`);
    startCreatedServices(overrideRelativePath);
    services.forEach((service) => {
      console.log(`[rollback] ${service.name} re-created from ${service.image}:previous`);
    });
  } finally {
    if (fs.existsSync(overridePath)) {
      fs.unlinkSync(overridePath);
    }
  }
}

try {
  console.log('Starting rollback flow for staging environment...');
  ensurePreviousTags();

  console.log('Stopping current staging deployment...');
  exec('docker compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.staging.yml down --remove-orphans');

  console.log('Starting services from previous local images...');
  applyPreviousImages();

  console.log('Waiting for service health endpoints after rollback...');
  exec('node scripts/wait-for-health.js', {
    env: {
      WAIT_MAX_ATTEMPTS: '60',
      WAIT_INTERVAL_MS: '10000',
      WAIT_INITIAL_DELAY_MS: '15000',
    },
  });

  console.log('Running integration smoke checks after rollback...');
  exec('node scripts/integration-smoke.js');

  console.log('Rollback completed successfully.');
} catch (error) {
  console.error('Staging rollback failed.');
  console.error(error.message);
  process.exit(1);
}
