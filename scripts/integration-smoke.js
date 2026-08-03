const http = require('http');

function requestJson(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ statusCode: res.statusCode, body: parsed });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
  });
}

async function run() {
  const websiteUrl = process.env.WEBSITE_HEALTH_URL || 'http://127.0.0.1:3101/health';
  const chatopsUrl = process.env.CHATOPS_HEALTH_URL || 'http://127.0.0.1:3002/health';
  const logisticsUrl = process.env.LOGISTICS_HEALTH_URL || 'http://127.0.0.1:3000/health';

  const websiteHealth = await requestJson(websiteUrl);
  const chatopsHealth = await requestJson(chatopsUrl);
  const logisticsHealth = await requestJson(logisticsUrl);

  const assessReadiness = (serviceName, payload, statusCode) => {
    const body = payload && typeof payload === 'object' ? payload : {};
    const status = typeof body.status === 'string' ? body.status.toLowerCase() : undefined;
    const ready = statusCode === 200 && (
      body.ok === true ||
      status === 'ready' ||
      status === 'healthy' ||
      status === 'ok'
    );
    return {
      name: serviceName,
      endpoint: payload.endpoint || undefined,
      statusCode,
      ok: ready,
      body,
    };
  };

  const checks = [
    assessReadiness('website', { ...websiteHealth.body, endpoint: 'http://127.0.0.1:3101/health' }, websiteHealth.statusCode),
    assessReadiness('chatops', { ...chatopsHealth.body, endpoint: 'http://127.0.0.1:3002/health' }, chatopsHealth.statusCode),
    assessReadiness('logistics', { ...logisticsHealth.body, endpoint: 'http://127.0.0.1:3000/health' }, logisticsHealth.statusCode),
  ];

  const ok = checks.every((item) => item.ok);
  console.log(JSON.stringify({ ok, checks }, null, 2));
  process.exit(ok ? 0 : 1);
}

run().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }));
  process.exit(1);
});
