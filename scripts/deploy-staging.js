const { execSync } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function exec(command, options = {}) {
  execSync(command, {
    cwd: rootDir,
    stdio: options.stdio || 'inherit',
    shell: true,
    env: {
      ...process.env,
      COMPOSE_PROJECT_NAME: 'website',
      COMPOSE_PROJECT_DIRECTORY: rootDir,
      ...(options.env || {}),
    },
  });
}

try {
  console.log('Validating staging environment...');
  exec('node scripts/validate-staging.js');

  console.log('Capturing current healthy images as previous before deployment...');
  try {
    exec('node scripts/tag-current-as-previous.js');
  } catch (error) {
    console.log('No healthy current deployment was available to tag as previous; proceeding with standard deployment.');
  }

  console.log('Deploying staging environment...');
  exec('docker compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.staging.yml up -d --build --wait --wait-timeout 600');

  console.log('Waiting for service health endpoints...');
  exec('node scripts/wait-for-health.js', {
    env: {
      WAIT_MAX_ATTEMPTS: '60',
      WAIT_INTERVAL_MS: '10000',
      WAIT_INITIAL_DELAY_MS: '15000',
    },
  });

  console.log('Running integration smoke checks...');
  exec('node scripts/integration-smoke.js');

  console.log('Re-running staging validation after deployment...');
  exec('node scripts/validate-staging.js');

  console.log('Staging deployment completed successfully.');
} catch (error) {
  console.error('Staging deployment failed.');
  process.exit(1);
}
