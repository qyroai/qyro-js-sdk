const axios = require("axios");
const { ApiKeyAuth } = require("./auth");
const { HTTPError, ConfigurationError } = require("./exceptions");
const { Session, Message } = require("./models");

class QyroServerClient {
    constructor(baseUrl, apiKeyId, apiKeySecret, timeout = 30000) {
        if (!baseUrl) throw new ConfigurationError("base_url is required");
        this.baseUrl = baseUrl.replace(/\/+$/, "");
        this.auth = new ApiKeyAuth(apiKeyId, apiKeySecret);
        this.timeout = timeout;
    }

    _url(path) {
        return `${this.baseUrl}${path}`;
    }

    static _raiseForStatus(resp) {
        if (resp.status >= 400) {
            let msg = resp.data?.message || resp.data || resp.statusText;
            throw new HTTPError(resp.status, msg, resp);
        }
    }

    async createSession(assistantId, context) {
        const path = `/server/api/v1/assistants/${assistantId}/sessions`;
        const headers = { Authorization: this.auth.headerValue() };

        const resp = await axios.post(
            this._url(path),
            { context },
            { headers, timeout: this.timeout }
        );

        QyroServerClient._raiseForStatus(resp);
        return new Session(resp.data.id);
    }

    async fetchSessionMessages(assistantId, sessionId) {
        const path = `/server/api/v1/assistants/${assistantId}/sessions/${sessionId}/messages`;
        const headers = { Authorization: this.auth.headerValue() };

        const resp = await axios.get(this._url(path), { headers, timeout: this.timeout });
        QyroServerClient._raiseForStatus(resp);

        return resp.data.map(m => new Message(m.id, m.role, m.content));
    }

    async chat(assistantId, sessionId, message) {
        const path = `/server/api/v1/assistants/${assistantId}/sessions/${sessionId}/chat`;
        const headers = {
            Authorization: this.auth.headerValue(),
            "Content-Type": "application/json",
        };

        const resp = await axios.post(
            this._url(path),
            { message },
            { headers, timeout: this.timeout }
        );

        QyroServerClient._raiseForStatus(resp);
        return resp.data.map(m => new Message(m.id, m.role, m.content));
    }
}

module.exports = { QyroServerClient };
