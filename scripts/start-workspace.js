#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: path.resolve(__dirname, '..'),
    encoding: 'utf8',
    shell: true,
    ...options,
  });
}

const dockerCheck = run('docker', ['version']);
if (dockerCheck.status !== 0) {
  console.error('Docker is not available on this machine. Install Docker Desktop/Engine and run the command again.');
  process.exit(1);
}

const daemonCheck = run('docker', ['info']);
if (daemonCheck.status !== 0) {
  console.error('Docker is installed, but the daemon is not running. Start Docker Desktop/Engine and rerun this command.');
  process.exit(1);
}

const compose = run('docker', ['compose', 'up', '-d']);
if (compose.status !== 0) {
  if (compose.stdout) {
    process.stdout.write(compose.stdout);
  }
  if (compose.stderr) {
    process.stderr.write(compose.stderr);
  }
  process.exit(compose.status || 1);
}

if (compose.stdout) {
  process.stdout.write(compose.stdout);
}

console.log('Workspace startup command completed.');
