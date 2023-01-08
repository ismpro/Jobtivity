let DB = require('../config/connection');

/**
 * A class representing a conversation.
 * @class
 */
class Chat {
    /**
     * Creates a new Chat instance.
     * @param {Object} obj - The properties of the Chat.
     * @param {Number} obj.idChat - The ID of the chat.
     * @param {Number} obj.idUser1 - The ID of the first user.
     * @param {Number} obj.idUser2 - The ID of the second user.
     * @param {String} obj.timestamp - The timestamp of the chat message.
     * @param {String} obj.text - The text of the chat message.
     */
    constructor(obj) {
        if (!obj) return;
        this.idChat = obj.idChat;
        this.idUser1 = obj.idUser1;
        this.idUser2 = obj.idUser2;
        this.timestamp = obj.timestamp;
        this.text = obj.text;
    }

    /**
     * Creates a new chat message in the database.
     * @returns {Promise<Number>} - The ID of the newly created chat message.
     */
    async create() {
        const result = await DB.pool.query(
            `INSERT INTO Chat (idUser1, idUser2, timestamp, text) VALUES (?, ?, ?, ?)`,
            [this.idUser1, this.idUser2, this.timestamp, this.text]
        );
        this.idChat = result[0].insertId;
        return result[0].insertId;
    }
}