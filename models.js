class Session {
    constructor(id) {
        this.id = id;
    }
}

class Message {
    constructor(id, role, content) {
        this.id = id;
        this.role = role;
        this.content = content;
    }
}

module.exports = { Session, Message };