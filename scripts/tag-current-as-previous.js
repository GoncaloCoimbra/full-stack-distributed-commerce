const { execSync } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const services = [
  { name: 'backend', image: 'website-backend' },
  { name: 'chatops-backend', image: 'website-chatops-backend' },
  { name: 'logistica-backend', image: 'website-logistica-backend' },
];

function run(command, options = {}) {
  return execSync(command, {
    cwd: rootDir,
    stdio: options.stdio || 'inherit',
    shell: true,
    encoding: options.encoding || 'utf8',
  });
}

function getContainerId(serviceName) {
  try {
    const output = run(
      `docker compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.staging.yml ps -q ${serviceName}`,
      { stdio: 'pipe' }
    ).trim();
    return output || null;
  } catch (error) {
    return null;
  }
}

function getImageIdFromContainer(serviceName) {
  const containerId = getContainerId(serviceName);
  if (!containerId) {
    throw new Error(`No running container found for ${serviceName}`);
  }

  return run(`docker inspect ${containerId} --format {{.Image}}`, { stdio: 'pipe' }).trim();
}

function imageHasDist(imageRef) {
  try {
    run(`docker run --rm --entrypoint ls ${imageRef} -la /app/dist`, { stdio: 'pipe' });
    return true;
  } catch (err) {
    return false;
  }
}

function findLatestImageForRepo(repo) {
  try {
    const list = run(`docker images --format "{{.Repository}}:{{.Tag}} {{.ID}} {{.CreatedAt}}" ${repo}*`, { stdio: 'pipe' });
    const lines = list.split(/\r?\n/).filter(Boolean);
    if (!lines.length) return null;
    // pick the first entry which is usually the most recent in `docker images` output
    const parts = lines[0].split(/\s+/);
    return parts[1] || null; // ID
  } catch (err) {
    return null;
  }
}

function tagAsPrevious(service) {
  let imageId = null;

  try {
    imageId = getImageIdFromContainer(service.name);
  } catch (err) {
    // continue to fallback attempts
  }

  // Validate the image contains built artifacts (/app/dist). If not, try fallbacks.
  if (imageId && imageHasDist(imageId)) {
    // ok
  } else {
    // try common tags: latest, image repo entries
    try {
      const repoLatest = run(`docker image inspect ${service.image}:latest --format '{{.Id}}'`, { stdio: 'pipe' }).trim();
      if (repoLatest && imageHasDist(repoLatest)) {
        imageId = repoLatest;
      }
    } catch (err) {
      // ignore
    }
  }

  if ((!imageId || !imageHasDist(imageId)) ) {
    const fallback = findLatestImageForRepo(service.image);
    if (fallback && imageHasDist(fallback)) {
      imageId = fallback;
    }
  }

  if (!imageId) {
    throw new Error(`Could not find a built image for ${service.name} (missing /app/dist)`);
  }

  const currentTag = `${service.image}:current`;
  const previousTag = `${service.image}:previous`;

  run(`docker tag ${imageId} ${currentTag}`);
  run(`docker tag ${currentTag} ${previousTag}`);
  console.log(`[tag] ${service.name} -> ${previousTag} (image ${imageId})`);
}

try {
  console.log('Checking whether the current staging deployment is healthy before recording a previous image...');
  run('node scripts/wait-for-health.js');
  run('node scripts/integration-smoke.js');

  console.log('Tagging current healthy images as previous...');
  services.forEach((service) => {
    try {
      tagAsPrevious(service);
    } catch (error) {
      console.log(`[skip] ${service.name}: ${error.message}`);
    }
  });

  console.log('Previous image tagging completed.');
} catch (error) {
  console.error('Failed to tag current staging images as previous.');
  console.error(error.message);
  process.exit(1);
}
