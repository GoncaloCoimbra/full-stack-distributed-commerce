const http = require('http');
const { URL } = require('url');

const targetUrl = process.argv[2] || 'http://127.0.0.1:3001/health';
const totalRequests = Number(process.argv[3] || 40);
const concurrency = Number(process.argv[4] || 10);

function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[index];
}

function requestOnce(index) {
  const started = Date.now();
  return new Promise((resolve) => {
    const req = http.get(targetUrl, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        const durationMs = Date.now() - started;
        resolve({ index, ok: res.statusCode === 200, statusCode: res.statusCode, durationMs, body });
      });
    });

    req.on('error', (error) => {
      const durationMs = Date.now() - started;
      resolve({ index, ok: false, statusCode: 0, durationMs, error: error.message });
    });
  });
}

async function run() {
  const results = [];
  let nextIndex = 0;
  let active = 0;

  const workers = Array.from({ length: Math.min(concurrency, totalRequests) }, async () => {
    while (nextIndex < totalRequests) {
      const currentIndex = nextIndex++;
      active += 1;
      const result = await requestOnce(currentIndex);
      active -= 1;
      results.push(result);
    }
  });

  await Promise.all(workers);

  const success = results.filter((r) => r.ok).length;
  const failures = results.length - success;
  const durations = results.map((r) => r.durationMs);
  const elapsedMs = Math.max(...durations) - Math.min(results.map((r) => r.durationMs).slice(0, 1)) + 1;
  const summary = {
    targetUrl,
    totalRequests: results.length,
    success,
    failures,
    reqPerSec: (results.length / (Math.max(1, elapsedMs) / 1000)).toFixed(2),
    durationMs: elapsedMs,
    latenciesMs: {
      p50: percentile(durations, 50),
      p95: percentile(durations, 95),
      p99: percentile(durations, 99),
    },
    sample: results.slice(0, 5),
  };

  console.log(JSON.stringify(summary, null, 2));
}

run().catch((error) => {
  console.error(JSON.stringify({ error: error.message }));
  process.exit(1);
});
