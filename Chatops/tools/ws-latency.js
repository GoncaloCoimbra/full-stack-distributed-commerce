const { performance } = require('perf_hooks');
const WebSocket = require('ws');
const url = process.env.WS_URL || 'ws://localhost:9001';
const channelId = process.env.CHANNEL || 'logistica';
const iterations = Number(process.env.ITERATIONS || '10');

async function measureSingle(iteration) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    const start = { value: 0 };

    ws.on('open', () => {
      start.value = performance.now();
      ws.send(JSON.stringify({ type: 'message', channelId, userId: 'tester', text: '/stock SKU-001' }));
    });

    ws.on('message', () => {
      const end = performance.now();
      const rtt = end - start.value;
      ws.close();
      resolve(rtt);
    });

    ws.on('error', reject);
    ws.on('close', () => {
      if (start.value === 0) reject(new Error('Connection closed before open'));
    });
  });
}

function percentile(values, p) {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * p)));
  return sorted[index];
}

async function measure() {
  const results = [];
  for (let i = 0; i < iterations; i += 1) {
    const rtt = await measureSingle(i + 1);
    results.push(rtt);
    process.stdout.write(`Test ${i + 1}/${iterations}: ${rtt.toFixed(3)} ms\r`);
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log('\nResultados:');
  console.log(`  média: ${(results.reduce((sum, v) => sum + v, 0) / results.length).toFixed(3)} ms`);
  console.log(`  p50: ${percentile(results, 0.5).toFixed(3)} ms`);
  console.log(`  p95: ${percentile(results, 0.95).toFixed(3)} ms`);
  console.log(`  p99: ${percentile(results, 0.99).toFixed(3)} ms`);
  console.log(`  mínimo: ${Math.min(...results).toFixed(3)} ms`);
  console.log(`  máximo: ${Math.max(...results).toFixed(3)} ms`);
}

measure().catch((e) => { console.error(e); process.exit(1); });
