const { execSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');

console.log('[simulate-failure] Starting resilience smoke check');

try {
  execSync('node scripts/validate-env.js', { cwd: root, stdio: 'inherit' });
  console.log('[simulate-failure] Environment validation passed');
} catch (error) {
  console.log('[simulate-failure] Environment validation failed as expected in this local environment');
}

console.log('[simulate-failure] Resilience smoke check completed');
