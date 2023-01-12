let DB = require('../config/connection');

class FriendsRequests {

    constructor(obj) {
        if (!obj) return;
        this.id = obj.id
        this.professional1 = obj.professional1
        this.professional2 = obj.professional2
        this.timestamp = obj.timestamp
    }

    async create() {
        try {
            let query = await DB.pool.query(`
            INSERT INTO FriendRequest (idProfessional1, idProfessional2, timestamp)
                VALUES (${this.professional1}, ${this.professional2}, STR_TO_DATE('${this.timestamp.toISOString().slice(0, 19).replace('T', ' ')}', '%Y-%m-%d  %H:%i:%s'));`);
            this.id = query[0].insertId;
            return query[0].insertId;
        } catch (error) {
            console.log(error)
        }
    }/* */

    async delete() {
        try {
            await DB.pool.query(`DELETE FROM FriendRequest WHERE idFriendRequest=${this.id};`);
            this.id =  null;
            return;
        } catch (error) {
            console.log(error)
        }
    }

    static async getById(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                const [query] = await DB.pool.query(`select idFriendRequest"id", idProfessional1"professional1", idProfessional2"professional2", timestamp 
                                                    FROM FriendRequest where idFriendRequest=${id}`);
                if (query.length === 0) return null;
                return new FriendsRequests({
                    ...query[0],
                    timestamp: new Date(query[0].timestamp)
                });
            } catch (err) {
                console.log(err);
                throw err
            }
        } else {
            console.log("Invalid id");
            throw "Invalid id"
        }
    }

    static async getAllByProfessional2Id(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                let output = [];
                const [query] = await DB.pool.query(`select idFriendRequest"id", idProfessional1"professional1", idProfessional2"professional2", timestamp 
                                            FROM FriendRequest where idProfessional2=${id}`);
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