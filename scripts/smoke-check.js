const http = require('http');

async function checkTarget(target) {
  return new Promise((resolve) => {
    const req = http.get(target.url, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        let parsedBody = null;
        try {
          parsedBody = body ? JSON.parse(body) : null;
        } catch {
          parsedBody = null;
        }

        const status = parsedBody && typeof parsedBody.status === 'string'
          ? parsedBody.status.toLowerCase()
          : undefined;
        const ready = res.statusCode === 200 && !!parsedBody && (
          parsedBody.ok === true ||
          status === 'ready' ||
          status === 'alive' ||
          status === 'ok'
        );

        resolve({
          name: target.name,
          url: target.url,
          ok: ready,
          statusCode: res.statusCode,
          body: parsedBody || body,
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        name: target.name,
        url: target.url,
        ok: false,
        statusCode: 0,
        error: error.message,
      });
    });
  });
}

async function runTargets(targets) {
  const results = await Promise.all(targets.map(checkTarget));
  const ok = results.every((result) => result.ok);
  return { ok, results };
}

if (require.main === module) {
  const targets = (process.argv.slice(2) || [])
    .filter(Boolean)
    .map((item) => {
      const [name, url] = item.split('=');
      const resolvedUrl = url || `http://127.0.0.1:${process.env.PORT || 3001}/health`;
      return { name, url: resolvedUrl };
    });

  runTargets(targets).then((result) => {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.ok ? 0 : 1);
  });
}

module.exports = { runTargets, checkTarget };
