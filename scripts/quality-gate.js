const { execSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');

const commands = [
  { label: 'backend', cwd: path.join(root, 'backend'), command: 'npm test -- --runInBand' },
  { label: 'chatops', cwd: path.join(root, 'Chatops/backend'), command: 'npm test -- --runInBand' },
  { label: 'logistics', cwd: path.join(root, 'logistica-multi-tenant-clean/backend-nest'), command: 'npm test -- --runInBand' },
];

for (const step of commands) {
  console.log(`[quality-gate] Running ${step.label} tests`);
  execSync(step.command, { cwd: step.cwd, stdio: 'inherit' });
}

console.log('[quality-gate] Quality gate completed');
