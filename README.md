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
  const serverClient = new QyroServerClient(BASE_URL, API_KEY_ID, API_KEY_SECRET);

  // Create a session
  const session = await serverClient.createSession(ASSISTANT_ID, { user: "alice" });
  console.log("Session ID:", session.id);

  // Send a message
  const messages = await serverClient.chat(ASSISTANT_ID, session.id, "Hello!");
  console.log(messages);
})();

```