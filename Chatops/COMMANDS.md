# ChatOps — Technical Reference

**Canonical API contract for frontend ↔ backend communication.**

This document specifies JSON message envelopes, WebSocket payload formats, and command/response contracts. For setup and overview, see [README.md](./README.md).

---

## Message Formats & Contracts

## Message envelope

All WebSocket messages exchanged use a small envelope to indicate type and channel.

Client -> Server and Server -> Client envelope:

```json
{
  "type": "message|typing|subscribe|reaction|command_response|system",
  "channelId": "logistica|comercial|geral|...",
  "userId": "string",
  "ts": 1680000000000,
  "payload": { }
}
```

`type` determines interpretation of `payload`.

---

## 1) `/stock <SKU>` — Rich Card response

Command (client -> server):

```json
{
  "type": "message",
  "channelId": "logistica",
  "userId": "goncalo",
  "payload": {
    "command": "/stock",
    "args": ["SKU-001"],
    "tempId": "temp-168..."
  }
}
```

Server `command_response` payload (rich card):

```json
{
  "type": "command_response",
  "channelId": "logistica",
  "userId": "bot",
  "payload": {
    "kind": "stock_card",
    "sku": "SKU-001",
    "title": "Parafuso M6 x 20",
    "imageUrl": "https://cdn.example.com/p/sku-001.jpg",
    "stock": 32,
    "stockPct": 32,
    "minRecommended": 10,
    "location": "Armazém A",
    "actions": [
      { "label": "Reservar 10", "action": "reserve", "meta": { "qty": 10 } },
      { "label": "Abrir ficha produto", "action": "open_product", "meta": { "sku": "SKU-001" } }
    ]
  }
}
```

Frontend should render a card with `imageUrl`, a colored progress bar based on `stockPct` (green >50, yellow 20-50, red <20), and action buttons that POST to `/commands/action` or emit WS events.

---

## 2) `/vendas hoje` — Mini-chart embed

Client command payload: same envelope with command `/vendas hoje`.

Server response payload:

```json
{
  "type": "command_response",
  "payload": {
    "kind": "mini_chart",
    "title": "Vendas hoje",
    "values": [ {"ts": 168..., "value": 120}, ... ],
    "meta": { "unit": "€", "seriesLabel": "Vendas/h" }
  }
}
```

Frontend should render the `mini_chart` using `recharts` or `chart.js` inside the message bubble.

---

## 3) Modal command flow: `/criar-desconto`

Client issues the command `/criar-desconto`.
Server can respond with a `command_response` of `kind: form` describing the fields for the modal.

Example response:

```json
{
  "type": "command_response",
  "payload": {
    "kind": "form",
    "formId": "create-discount-v1",
    "title": "Criar desconto rápido",
    "fields": [
      { "name": "clientId", "type": "select", "label": "Cliente B2B", "optionsEndpoint": "/api/clients?limit=50" },
      { "name": "sku", "type": "text", "label": "SKU" },
      { "name": "percent", "type": "number", "label": "% desconto", "min": 0, "max": 100 }
    ],
    "submitLabel": "Criar desconto"
  }
}
```

When the user fills the modal, the frontend POSTs to backend `/commands/submit` with `formId` and `values`. The backend processes and emits a confirmation `command_response` message to the channel.

---

## 4) Reactions and small events

Reaction message (client -> server):

```json
{
  "type": "reaction",
  "channelId": "logistica",
  "userId": "goncalo",
  "payload": { "messageId": "msg-123", "emoji": "👍" }
}
```

Server will broadcast the reaction as an envelope with updated reaction counts.

---

## 5) System logs with syntax highlighting

When sending system logs to a development channel, the server uses `type: system` and includes `lang` to allow client-side syntax highlighting.

```json
{
  "type": "system",
  "channelId": "desenvolvimento",
  "payload": {
    "lang": "bash|json|js|sql",
    "code": "Error: ... stack trace",
    "severity": "error|warning|info"
  }
}
```

Client should render a dark code block with simple syntax highlighting.

---

## 6) File upload result

When a file is uploaded, backend returns a `command_response` with `kind: file` including preview metadata.

```json
{
  "type": "command_response",
  "payload": {
    "kind": "file",
    "url": "https://.../files/123",
    "name": "fatura.pdf",
    "size": 343454,
    "mime": "application/pdf",
    "previewUrl": "https://.../thumbs/123.png"
  }
}
```

---

## 7) History endpoint contract (HTTP)

GET `/history?channelId=logistica&before=<ts>&limit=30`

Response body:

```json
b[
  {
    "id": "msg-...",
    "channelId": "logistica",
    "userId": "user",
    "text": "...",
    "ts": 168...,
    "system": false,
    "pending": false,
    "fileUrl": null
  }
]
```

---

## 8) Action endpoints

- POST `/commands/action` — body: `{ action:"reserve", meta:{...}, messageId?:string }`
- POST `/commands/submit` — used for modal form submission
- POST `/upload` — multipart/form-data (field `file`, `channelId`)

---

## 9) Tips for frontend implementation

- Render `command_response` messages by `kind` using a small registry of renderers (`stock_card`, `mini_chart`, `form_confirmation`, `file`, `system_code`).
- Keep optimistic updates for client-originated messages and resolve them when server confirms via `tempId`.
- Use `react-virtuoso` `startReached` for pagination and smooth prepend.

---

This file should be kept in sync with backend `chatOpsEngine.ts` and frontend renderers.
