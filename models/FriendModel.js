let DB = require('../config/connection');

/**
 * Friend represents a friend request or relationship between two professionals
 * @class
 */
class Friend {

    /**
     * Creates a new Friends object
     * @constructor
     * @param {Object} obj - The object with which to create the Friends object
     * @param {Number} obj.id - The id of the Friends object
     * @param {Number} obj.professional1 - The id of the first professional in the friend relationship
     * @param {Number} obj.professional2 - The id of the second professional in the friend relationship
     * @param {Date} obj.since - The date the friend relationship was created
     */
    constructor(obj) {
        if (!obj) return;
        this.id = obj.id
        this.professional1 = obj.professional1
        this.professional2 = obj.professional2
        this.since = obj.since
    }

    /**
     * Creates a new friend relationship in the database
     * @returns {Promise<Number>} - The id of the newly created friend relationship
     */
    async create() {
        try {
            let query = await DB.pool.query(`
            INSERT INTO FriendRequest (idProfessional1, idProfessional2, timestamp)
            VALUES (${this.professional1}, ${this.professional2}, STR_TO_DATE('${this.since.toISOString().split("T")[0]}', "%Y-%m-%d"));`);
            
            this.id = query[0].insertId;
            return query[0].insertId;
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Gets all friend relationships for a given user
     * @param {number} id - The id of the user
     * @returns {Promise<Array<Friend>>} - An array of Friends objects representing the friend relationships
     * @throws {String} - If the id is invalid.
     */
    static async getAllForProfessional(id) {
        if (id && !isNaN(id) && Number.isSafeInteger(id)) {
            try {
                let output = [];
                const [query] = await DB.pool.query(`select idFriendsRequests"id", idProfessional1"professional1", idProfessional2"professional2", timestamp 
                                      FROM FriendRequest where idProfessional1=${id} or idProfessional2=${id}`);
                if (query.length === 0) return null;
                console.log(query)
                for (const element of query) {
                    output.push(new Friend(element))
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

module.exports = Friend;
