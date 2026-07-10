const WebSocket = require('ws');

const url = 'ws://localhost:9001';
const headers = { authorization: 'Bearer invalid.token.here' };

console.log('connecting to', url, 'with headers', headers);

const ws = new WebSocket(url, { headers });

ws.on('open', () => {
  console.log('open');
});

ws.on('close', (code, reason) => {
  console.log('close', code, reason && reason.toString());
  process.exit(0);
});

ws.on('error', (err) => {
  console.error('error', err && err.message);
  process.exit(1);
});

setTimeout(() => {
  console.log('timeout waiting for close');
  process.exit(2);
}, 8000);
