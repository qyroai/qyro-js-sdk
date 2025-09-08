const axios = require("axios");
const { HTTPError, ConfigurationError } = require("./exceptions");
const { Session, Message } = require("./models");

class QyroClient {
    constructor(baseUrl, token, timeout = 30000) {
        if (!baseUrl) throw new ConfigurationError("base_url is required");
        this.baseUrl = baseUrl.replace(/\/+$/, "");
        this.token = token;
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

    _clientHeaders() {
        return {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
        };
    }

    async createSession(assistantId, context) {
        const path = `/client/api/v1/assistants/${assistantId}/sessions`;
        const headers = this._clientHeaders();

        const resp = await axios.post(
            this._url(path),
            { context },
            { headers, timeout: this.timeout }
        );

        QyroClient._raiseForStatus(resp);
        return new Session(resp.data.id);
    }

    async fetchSessionMessages(assistantId, sessionId) {
        const path = `/client/api/v1/assistants/${assistantId}/sessions/${sessionId}/messages`;
        const headers = this._clientHeaders();

        const resp = await axios.get(this._url(path), { headers, timeout: this.timeout });
        QyroClient._raiseForStatus(resp);

        return resp.data.map(m => new Message(m.id, m.role, m.content));
    }

    async chat(assistantId, sessionId, message) {
        const path = `/client/api/v1/assistants/${assistantId}/sessions/${sessionId}/chat`;
        const headers = this._clientHeaders();

        const resp = await axios.post(
            this._url(path),
            { message },
            { headers, timeout: this.timeout }
        );

        QyroClient._raiseForStatus(resp);
        return resp.data.map(m => new Message(m.id, m.role, m.content));
    }
}

module.exports = { QyroClient };
