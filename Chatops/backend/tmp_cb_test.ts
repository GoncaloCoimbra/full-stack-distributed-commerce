process.env.LOGISTICS_URL = process.env.LOGISTICS_URL || "http://invalid-service-that-does-not-exist:3000";
import { ChatOpsEngine, logisticsCircuitBreaker } from "./src/chatOpsEngine";

async function main() {
  logisticsCircuitBreaker.reset();

  for (let i = 1; i <= 4; i += 1) {
    console.log(`=== CALL ${i} ===`);
    const result = await ChatOpsEngine.handleCommand('/stock SKU-OPEN', 'user-1');
    console.log(`RESULT ${i}: ${result}\n`);
  }

  console.log('Waiting 31 seconds for circuit reset...');
  await new Promise((r) => setTimeout(r, 31000));

  console.log('Starting recovery service on 127.0.0.1:3000');
  const http = await import('http');
  const server = http.createServer((req, res) => {
    if (req.url?.startsWith('/api/products/stock')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ stock: 42, description: 'Recovered SKU' }));
    } else {
      res.writeHead(404);
      res.end('not found');
    }
  });

  server.listen(3000, '127.0.0.1', async () => {
    console.log('Recovery service started');
    const result = await ChatOpsEngine.handleCommand('/stock SKU-RECOVER', 'user-1');
    console.log(`RECOVERY RESULT: ${result}`);
    server.close(() => process.exit(0));
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
