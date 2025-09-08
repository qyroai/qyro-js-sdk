const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

class ApiKeyAuth {
    constructor(apiKeyId, apiKeySecret) {
        this.apiKeyId = apiKeyId;
        this.apiKeySecret = apiKeySecret;
    }

    headerValue() {
        return `ApiKey ${this.apiKeySecret}`;
    }
}

class ClientTokenGenerator {
    constructor(apiKeyId, apiKeySecret) {
        this.apiKeyId = apiKeyId;
        this.apiKeySecret = apiKeySecret;
    }

    generate(context) {
        const nowTs = Math.floor(Date.now() / 1000);
        const payload = {
            sub: JSON.stringify(context),
            iat: nowTs,
            exp: nowTs + 24 * 30 * 3600,
            type: "client",
            iss: String(this.apiKeyId),
            aud: "qyro",
            jti: uuidv4(),
        };
        const headers = { kid: String(this.apiKeyId) };

        return jwt.sign(payload, this.apiKeySecret, {
            algorithm: "HS256",
            header: headers,
        });
    }
}

module.exports = { ApiKeyAuth, ClientTokenGenerator };
