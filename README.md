Qyro Node.js SDK
==================

A Node.js SDK for interacting with Qyro server and client APIs.

### Installation

```bash
npm install qyro-js-sdk
```

### Usage

```js
const {
  QyroServerClient,
  QyroClient,
  ClientTokenGenerator
} = require("qyro-js-sdk");

const BASE_URL = "https://qyroai.com";
const API_KEY_ID = "<>";
const API_KEY_SECRET = "<>";
const ASSISTANT_ID = "<>";

(async () => {
  const baseUrl = BASE_URL;
  const apiKeyId = API_KEY_ID;
  const apiKeySecret = API_KEY_SECRET;
  const assistantId = ASSISTANT_ID;

  // ---------------------------
  // Using Server Client
  // ---------------------------
  console.log("👉 Creating session via server API...");
  const serverClient = new QyroServerClient(baseUrl, apiKeyId, apiKeySecret);

  const session = await serverClient.createSession(assistantId, {
    user_id: "user_abc",
    context: "first test run",
  });
  console.log("✅ Session created:", session.id);

  console.log("👉 Sending message to assistant (server)...");
  const messages = await serverClient.chat(
    assistantId,
    session.id,
    "Hello from Node.js Server Client!"
  );

  messages.forEach((m) => {
    console.log(`[${m.role}] ${m.content}`);
  });

  // ---------------------------
  // Using Client SDK (token-based)
  // ---------------------------
  console.log("\n👉 Generating client token...");
  const tokenGen = new ClientTokenGenerator(apiKeyId, apiKeySecret);
  const clientToken = tokenGen.generate({
    user_id: "123",
  });

  const client = new QyroClient(baseUrl, clientToken);

  console.log("👉 Creating session via client API...");
  const clientSession = await client.createSession(assistantId, {
    context: "from client SDK",
  });
  console.log("✅ Client session created:", clientSession.id);

  console.log("👉 Sending message to assistant (client)...");
  const clientMessages = await client.chat(
    assistantId,
    clientSession.id,
    "Hello from Node.js Client SDK!"
  );

  clientMessages.forEach((m) => {
    console.log(`[${m.role}] ${m.content}`);
  });
})();


```