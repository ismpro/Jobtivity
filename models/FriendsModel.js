let DB = require('../config/connection');

/**
 * Friends represents a friend request or relationship between two professionals
 * @class
 */
class Friends {

    /**
     * Creates a new Friends object
     * @constructor
     * @param {Object} obj - The object with which to create the Friends object
     * @param {Number} obj.id - The id of the Friends object
     * @param {Number} obj.profissional1 - The id of the first professional in the friend relationship
     * @param {Number} obj.profissional2 - The id of the second professional in the friend relationship
     * @param {String} obj.since - The date the friend relationship was created
     */
    constructor(obj) {
        if (!obj) return;
        this.id = obj.id
        this.profissional1 = obj.profissional1
        this.profissional2 = obj.profissional2
        this.since = obj.since
    }

    /**
     * Creates a new friend relationship in the database
     * @returns {Promise<Number>} - The id of the newly created friend relationship
     */
    async create() {
        try {
            let query = await DB.pool.query(`
            INSERT INTO Friends (idProfissional1, idProfissional2, since)
            VALUES (${this.profissional1}, ${this.profissional2}, STR_TO_DATE('${this.since}', "%Y-%m-%d"));`);
            
            this.id = query[0].insertId;
            return query[0].insertId;
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Gets all friend relationships for a given user
     * @param {number} id - The id of the user
     * @returns {Promise<Array<Friends>>} - An array of Friends objects representing the friend relationships
     * @throws {String} - If the id is invalid.
     */
    static async getAllForUser(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                let output = [];
                const [query] = await DB.pool.query(`select idFriends"id", idProfissional1"profissional1", idProfissional2"profissional2", since 
                                      FROM Friends where idProfissional1=${id} or idProfissional2=${id}`);
                if (query.length === 0) return null;
                console.log(query)
                for (const element of query) {
                    output.push(new Friends(element))
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

module.exports = Friends;
