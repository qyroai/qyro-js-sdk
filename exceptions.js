class QyroError extends Error {
    constructor(message) {
        super(message);
        this.name = "QyroError";
    }
}

class HTTPError extends QyroError {
    constructor(statusCode, message, response) {
        super(`HTTP ${statusCode}: ${message}`);
        this.statusCode = statusCode;
        this.response = response;
    }
}

class ConfigurationError extends QyroError { }

module.exports = { QyroError, HTTPError, ConfigurationError };