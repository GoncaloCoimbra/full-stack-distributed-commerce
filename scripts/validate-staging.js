const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

function parseEnv(content) {
  const env = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const equalsIndex = line.indexOf('=');
    if (equalsIndex === -1) {
      continue;
    }

    const key = line.slice(0, equalsIndex).trim();
    let value = line.slice(equalsIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }
  return env;
}

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) {
    throw new Error(`Missing env file: ${envPath}`);
  }
  const raw = fs.readFileSync(envPath, 'utf8');
  return parseEnv(raw);
}

const services = [
  {
    name: 'Website backend',
    directory: 'backend',
    envFile: '.env.staging',
    required: ['DATABASE_URL', 'REDIS_URL', 'PORT'],
  },
  {
    name: 'ChatOps backend',
    directory: 'Chatops/backend',
    envFile: '.env.staging',
    required: ['DATABASE_URL', 'REDIS_URL', 'PORT', 'WS_PORT'],
  },
  {
    name: 'Logistics backend',
    directory: 'logistica-multi-tenant-clean/backend-nest',
    envFile: '.env.staging',
    required: ['DATABASE_URL', 'REDIS_URL', 'PORT'],
  },
];

function validateService(service) {
  const envPath = path.join(rootDir, service.directory, service.envFile);
  const env = loadEnvFile(envPath);

  const missing = service.required.filter((key) => !env[key] || env[key].trim() === '');
  if (missing.length > 0) {
    throw new Error(`${service.name} missing required env vars: ${missing.join(', ')} (${envPath})`);
  }

  console.log(`✔ ${service.name} staging env validated (${envPath})`);
  console.log(`  PORT=${env.PORT}`);
  if (service.name === 'ChatOps backend') {
    console.log(`  WS_PORT=${env.WS_PORT}`);
  }
  console.log('');
}

function runDockerComposeConfig() {
  try {
    execSync(
      'docker compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.staging.yml config',
      {
        cwd: rootDir,
        stdio: 'inherit',
      },
    );
    console.log('✔ Docker Compose staging config is valid');
    console.log('');
  } catch (error) {
    throw new Error('Docker Compose staging config validation failed');
  }
}

function main() {
  console.log('Validating staging environment configuration...');

  let failed = false;
  for (const service of services) {
    try {
      validateService(service);
    } catch (error) {
      console.error(`✖ ${service.name} validation failed: ${error.message}`);
      failed = true;
    }
  }

  if (failed) {
    process.exit(1);
  }

  try {
    runDockerComposeConfig();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  console.log('Staging environment validation completed successfully.');
}

main();
