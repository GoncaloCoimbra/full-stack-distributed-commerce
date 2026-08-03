const WebSocket = require("ws");
const crypto = require("crypto");

const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
const payload = Buffer.from(JSON.stringify({ sub: "goncalo", exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url");
const sig = crypto.createHmac("sha256", "change-me").update(`${header}.${payload}`).digest("base64url");
const token = `Bearer ${header}.${payload}.${sig}`;

const ws = new WebSocket("ws://localhost:9001", { headers: { Authorization: token } });
let done = false;

ws.on("open", () => {
  console.log("OPEN");
  // First subscribe to the channel
  ws.send(JSON.stringify({ type: "subscribe", channelId: "logistica" }));
  // Then send the message
  setTimeout(() => {
    ws.send(JSON.stringify({ type: "message", channelId: "logistica", text: "/stock TESTSKU" }));
  }, 100);
});

ws.on("message", (msg) => {
  console.log("MSG", msg.toString());
  done = true;
  ws.close();
});

ws.on("close", () => {
  if (!done) {
    console.log("CLOSED without message");
  }
  process.exit(done ? 0 : 1);
});

ws.on("error", (err) => {
  console.error("WSERR", err.message);
  process.exit(1);
});

setTimeout(() => {
  if (!done) {
    console.error("SCRIPT TIMEOUT");
    process.exit(2);
  }
}, 30000);
