const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envFilePath = path.join(root, '.env');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};

  const values = {};
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    values[key] = value;
  }
  return values;
}

function getValue(key, fileValues) {
  return process.env[key] ?? fileValues[key] ?? '';
}

const fileValues = parseEnvFile(envFilePath);
const isProduction = (process.env.NODE_ENV || '').toLowerCase() === 'production';
const checks = [
  {
    scope: 'Commerce / backend',
    items: [
      { key: 'DATABASE_URL', required: true, description: 'DATABASE_URL' },
      { key: 'JWT_SECRET', required: isProduction, minLength: 32, description: 'JWT_SECRET' },
      { key: 'JWT_REFRESH_SECRET', required: isProduction, minLength: 32, description: 'JWT_REFRESH_SECRET' },
      { key: 'REDIS_URL', required: isProduction, description: 'REDIS_URL' },
    ],
  },
  {
    scope: 'ChatOps',
    items: [
      { key: 'DATABASE_URL', required: isProduction, description: 'DATABASE_URL' },
      { key: 'REDIS_URL', required: isProduction, description: 'REDIS_URL' },
      { key: 'PORT', required: isProduction, description: 'PORT' },
      { key: 'WS_PORT', required: isProduction, description: 'WS_PORT' },
    ],
  },
  {
    scope: 'Logistics',
    items: [
      { key: 'DATABASE_URL', required: isProduction, description: 'DATABASE_URL' },
      { key: 'JWT_SECRET', required: isProduction, minLength: 32, description: 'JWT_SECRET' },
      { key: 'PORT', required: isProduction, description: 'PORT' },
    ],
  },
];

const failures = [];

for (const scope of checks) {
  console.log(`[validate-env] Checking ${scope.scope}`);
  for (const item of scope.items) {
    const value = getValue(item.key, fileValues);
    const hasValue = Boolean(value && value.trim());
    const meetsMinLength = !item.minLength || (value && value.length >= item.minLength);

    if (!item.required) {
      if (!hasValue) {
        console.log(`  [warn] ${item.description} not set; using default behavior in non-production mode`);
      }
      continue;
    }

    if (!hasValue || !meetsMinLength) {
      failures.push(`${scope.scope}: ${item.description}`);
      console.log(`  [fail] ${item.description} is missing or too short`);
      continue;
    }

    console.log(`  [ok] ${item.description}`);
  }
}

if (failures.length > 0) {
  console.error(`[validate-env] Environment validation failed for: ${failures.join(', ')}`);
  process.exit(1);
}

console.log('[validate-env] Environment validation passed');
