let DB = require('../config/connection');

class FriendsRequests {

    constructor(obj) {
        if (!obj) return;
        this.id = obj.id
        this.profissional1 = obj.profissional1
        this.profissional2 = obj.profissional2
        this.timestamp = obj.timestamp
    }

    async create() {
        try {
            let query = await DB.pool.query(`
            INSERT INTO FriendsRequests (idProfissional1, idProfissional2, timestamp)
                VALUES (${this.profissional1}, ${this.profissional2}, STR_TO_DATE('${this.timestamp.toISOString().slice(0, 19).replace('T', ' ')}', '%Y-%m-%d  %H:%i:%s'));`);
            this.id = query[0].insertId;
            return query[0].insertId;
        } catch (error) {
            console.log(error)
        }
    }

    async getAllForUser(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                let output = [];
                const query = await DB.pool.query(`select idFriendsRequests"id", idProfissional1"profissional1", idProfissional2"profissional2", timestamp 
                                            FROM FriendsRequests where idProfissional1=${id} or idProfissional2=${id}`);
                if (query.length === 0) return null;
                for (const element of query) {
                    output.push(new FriendsRequests({
                        ...element,
                        timestamp: new Date(element.timestamp)
                    }));
                }
                return output;
            } catch (err) {
                console.log(err);
                throw err;
            }
        } else {
            console.log("Invalid id");
            throw "Invalid id"
        }
    }
}

module.exports = FriendsRequests;