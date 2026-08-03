const http = require('http');

const DEFAULT_TARGETS = {
  website: process.env.WEBSITE_HEALTH_URL || 'http://127.0.0.1:3101/health',
  chatops: process.env.CHATOPS_HEALTH_URL || 'http://127.0.0.1:3002/health',
  logistics: process.env.LOGISTICS_HEALTH_URL || 'http://127.0.0.1:3000/health',
};

const INTERVAL_MS = Number(process.env.WAIT_INTERVAL_MS || 10000);
const MAX_ATTEMPTS = Number(process.env.WAIT_MAX_ATTEMPTS || 60);
const INITIAL_DELAY_MS = Number(process.env.WAIT_INITIAL_DELAY_MS || 15000);
const REQUEST_TIMEOUT_MS = Number(process.env.WAIT_REQUEST_TIMEOUT_MS || 15000);

function requestJson(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { timeout: REQUEST_TIMEOUT_MS }, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        let parsed;
        try {
          parsed = body ? JSON.parse(body) : {};
        } catch (error) {
          return reject(error);
        }
        resolve({ statusCode: res.statusCode, body: parsed });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy(new Error('Request timed out'));
    });
  });
}

function ready(response) {
  if (!response || response.statusCode !== 200) {
    return false;
  }

  const body = response.body;
  const status = body && typeof body.status === 'string' ? body.status.toLowerCase() : undefined;
  return body && (body.ok === true || status === 'ready' || status === 'healthy' || status === 'ok');
}

async function checkTarget(name, url) {
  try {
    const result = await requestJson(url);
    return { name, url, ok: ready(result), statusCode: result.statusCode, body: result.body };
  } catch (error) {
    return { name, url, ok: false, statusCode: 0, error: String(error) };
  }
}

async function checkAll() {
  const targets = Object.entries(DEFAULT_TARGETS).map(([name, url]) => ({ name, url }));
  const results = await Promise.all(targets.map((target) => checkTarget(target.name, target.url)));
  return results;
}

(async () => {
  if (INITIAL_DELAY_MS > 0) {
    console.log(`Waiting ${INITIAL_DELAY_MS}ms before probing health endpoints...`);
    await new Promise((resolve) => setTimeout(resolve, INITIAL_DELAY_MS));
  }

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const results = await checkAll();
    const healthy = results.every((result) => result.ok);

    console.log(`Attempt ${attempt}/${MAX_ATTEMPTS}`);
    results.forEach((result) => {
      if (result.ok) {
        console.log(`  [OK] ${result.name} ${result.url}`);
      } else {
        console.log(`  [FAIL] ${result.name} ${result.url} status=${result.statusCode} ${result.error || JSON.stringify(result.body)}`);
      }
    });

    if (healthy) {
      process.exit(0);
    }

    if (attempt < MAX_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS));
    }
  }

  process.exit(1);
})();
